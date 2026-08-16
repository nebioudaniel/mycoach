package users

import (
	"errors"
	"log/slog"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/mycoach/backend/internal/auth"
	"github.com/mycoach/backend/internal/httpjson"
	"github.com/mycoach/backend/internal/session"
)

var emailRe = regexp.MustCompile(`^[^@\s]+@[^@\s]+\.[^@\s]+$`)

// Handler exposes the auth and profile endpoints.
type Handler struct {
	store   *Store
	tokens  *auth.Manager
	sess    *session.Manager
	logger  *slog.Logger
	baseURL string
}

func NewHandler(store *Store, tokens *auth.Manager, sess *session.Manager, logger *slog.Logger, baseURL string) *Handler {
	return &Handler{store: store, tokens: tokens, sess: sess, logger: logger, baseURL: baseURL}
}

type registerRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DisplayName string `json:"displayName"`
}

// Register creates an account and issues a session.
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req registerRequest
	if err := httpjson.Decode(r, &req); err != nil {
		httpjson.Error(w, http.StatusBadRequest, err.Error())
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	req.DisplayName = strings.TrimSpace(req.DisplayName)

	var fields []httpjson.FieldError
	if !emailRe.MatchString(req.Email) {
		fields = append(fields, httpjson.Field("email", "enter a valid email address"))
	}
	if len(req.Password) < 8 {
		fields = append(fields, httpjson.Field("password", "password must be at least 8 characters"))
	}
	if req.DisplayName == "" {
		fields = append(fields, httpjson.Field("displayName", "display name is required"))
	}
	if len(fields) > 0 {
		httpjson.Fail(w, fields)
		return
	}

	hash, err := auth.HashPassword(req.Password)
	if err != nil {
		h.logger.Error("hash password", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not create account")
		return
	}

	u, err := h.store.Create(r.Context(), req.Email, hash, req.DisplayName)
	if errors.Is(err, ErrEmailTaken) {
		httpjson.Error(w, http.StatusConflict, "an account with this email already exists")
		return
	}
	if err != nil {
		h.logger.Error("create user", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not create account")
		return
	}

	h.issueSession(w, r, u)
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login verifies credentials and issues a session.
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if err := httpjson.Decode(r, &req); err != nil {
		httpjson.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	u, hash, err := h.store.ByEmail(r.Context(), req.Email)
	if errors.Is(err, ErrNotFound) || (err == nil && !auth.CheckPassword(hash, req.Password)) {
		// Same error for unknown email vs wrong password, to avoid user enumeration.
		httpjson.Error(w, http.StatusUnauthorized, "invalid email or password")
		return
	}
	if err != nil {
		h.logger.Error("find user", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not log in")
		return
	}

	h.issueSession(w, r, u)
}

// Logout clears the session cookie.
func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	h.sess.Clear(w)
	httpjson.Write(w, http.StatusOK, map[string]bool{"ok": true})
}

// Me returns the current user and profile.
func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	u, err := h.store.ByID(r.Context(), userID)
	if err != nil {
		h.logger.Error("load user", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load user")
		return
	}
	p, err := h.store.GetProfile(r.Context(), userID)
	if err != nil {
		h.logger.Error("load profile", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load profile")
		return
	}
	httpjson.Write(w, http.StatusOK, map[string]any{"user": u, "profile": p})
}

// UpdateProfile updates the learner profile.
func (h *Handler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	var req Profile
	if err := httpjson.Decode(r, &req); err != nil {
		httpjson.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	if req.SkillLevel == "" {
		req.SkillLevel = "beginner"
	}
	valid := map[string]bool{"beginner": true, "intermediate": true, "advanced": true}
	if !valid[req.SkillLevel] {
		httpjson.Fail(w, []httpjson.FieldError{httpjson.Field("skillLevel", "must be beginner, intermediate or advanced")})
		return
	}
	if len(req.Languages) == 0 {
		req.Languages = []string{"Go", "Python"}
	}
	p, err := h.store.UpdateProfile(r.Context(), userID, req)
	if err != nil {
		h.logger.Error("update profile", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not update profile")
		return
	}
	httpjson.Write(w, http.StatusOK, p)
}

// issueSession sets a session cookie and returns user + session payload.
func (h *Handler) issueSession(w http.ResponseWriter, r *http.Request, u User) {
	token, err := h.tokens.Issue(u.ID)
	if err != nil {
		h.logger.Error("issue token", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not start session")
		return
	}
	h.sess.Set(w, token)

	p, err := h.store.GetProfile(r.Context(), u.ID)
	if err != nil {
		h.logger.Error("load profile", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load profile")
		return
	}
	httpjson.Write(w, http.StatusOK, map[string]any{
		"user":    u,
		"profile": p,
		"expiresAt": time.Now().Add(h.sess.TTL).Format(time.RFC3339),
	})
}
