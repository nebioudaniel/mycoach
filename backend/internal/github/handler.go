package github

import (
	"fmt"
	"log/slog"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/mycoach/backend/internal/auth"
	"github.com/mycoach/backend/internal/httpjson"
)

type Handler struct {
	store  *Store
	cfg    GitHubConfig
	logger *slog.Logger
}

type GitHubConfig struct {
	ClientID     string
	ClientSecret string
	CallbackURL  string
	Scopes       string
	FrontendURL  string
}

func NewHandler(store *Store, cfg GitHubConfig, logger *slog.Logger) *Handler {
	return &Handler{store: store, cfg: cfg, logger: logger}
}

// StartOAuth redirects the user to GitHub's authorize page.
func (h *Handler) StartOAuth(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	state := userID.String()
	callbackURL := h.cfg.CallbackURL
	if callbackURL == "" {
		callbackURL = fmt.Sprintf("%s/api/auth/github/callback", h.cfg.FrontendURL)
	}

	authorizeURL := fmt.Sprintf(
		"https://github.com/login/oauth/authorize?client_id=%s&redirect_uri=%s&scope=%s&state=%s",
		h.cfg.ClientID, callbackURL, h.cfg.Scopes, state,
	)
	http.Redirect(w, r, authorizeURL, http.StatusTemporaryRedirect)
}

// Callback handles the GitHub OAuth redirect with the authorization code.
func (h *Handler) Callback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")
	if code == "" {
		http.Error(w, "missing code", http.StatusBadRequest)
		return
	}

	// Verify state is a valid UUID (our user ID)
	stateStr, err := parseUUID(state)
	if err != nil {
		http.Error(w, "invalid state", http.StatusBadRequest)
		return
	}
	userID := uuid.MustParse(stateStr)

	// Exchange code for access token
	token, err := exchangeCode(r.Context(), h.cfg.ClientID, h.cfg.ClientSecret, code)
	if err != nil {
		h.logger.Error("exchange code", "err", err)
		http.Error(w, "failed to authenticate with GitHub", http.StatusInternalServerError)
		return
	}

	// Fetch GitHub user info
	ghUserID, username, avatarURL, err := fetchGitHubUser(r.Context(), token)
	if err != nil {
		h.logger.Error("fetch github user", "err", err)
		http.Error(w, "failed to fetch GitHub profile", http.StatusInternalServerError)
		return
	}

	// Store account
	if err := h.store.UpsertAccount(r.Context(), userID, ghUserID, username, avatarURL, h.cfg.Scopes, token); err != nil {
		h.logger.Error("store account", "err", err)
		http.Error(w, "failed to save GitHub account", http.StatusInternalServerError)
		return
	}

	// Redirect to frontend open source page
	frontend := h.cfg.FrontendURL
	if frontend == "" {
		frontend = "http://localhost:3000"
	}
	http.Redirect(w, r, frontend+"/opensource/repos", http.StatusTemporaryRedirect)
}

// ListRepos returns the user's GitHub repositories, syncing from GitHub API if needed.
func (h *Handler) ListRepos(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	token, err := h.store.GetAccessToken(r.Context(), userID)
	if err != nil || token == "" {
		httpjson.Error(w, http.StatusUnauthorized, "GitHub not connected")
		return
	}

	// Fetch from GitHub API and upsert
	ghRepos, err := FetchUserRepos(r.Context(), token)
	if err != nil {
		h.logger.Error("fetch repos from github", "err", err)
		// Fall back to cached repos
		repos, err := h.store.ListRepos(r.Context(), userID)
		if err != nil {
			httpjson.Error(w, http.StatusInternalServerError, "could not load repos")
			return
		}
		if repos == nil {
			repos = []Repository{}
		}
		httpjson.Write(w, http.StatusOK, repos)
		return
	}

	// Upsert each repo
	for _, repo := range ghRepos {
		_ = h.store.UpsertRepo(r.Context(), userID, repo)
	}

	// Return from DB
	repos, err := h.store.ListRepos(r.Context(), userID)
	if err != nil {
		httpjson.Error(w, http.StatusInternalServerError, "could not load repos")
		return
	}
	if repos == nil {
		repos = []Repository{}
	}
	httpjson.Write(w, http.StatusOK, repos)
}

// GetRepo returns a single repository.
func (h *Handler) GetRepo(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	repo, err := h.store.GetRepoByID(r.Context(), id)
	if err != nil {
		httpjson.Error(w, http.StatusNotFound, "repo not found")
		return
	}
	httpjson.Write(w, http.StatusOK, repo)
}

// ListIssues returns issues for a repository, syncing from GitHub if connected.
func (h *Handler) ListIssues(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	repoID := chi.URLParam(r, "id")

	// Get repo to find owner/name
	repo, err := h.store.GetRepoByID(r.Context(), repoID)
	if err != nil {
		httpjson.Error(w, http.StatusNotFound, "repo not found")
		return
	}

	token, err := h.store.GetAccessToken(r.Context(), userID)
	if err == nil && token != "" {
		// Fetch from GitHub API and upsert
		ghIssues, err := FetchRepoIssues(r.Context(), token, repo.Owner, repo.Name)
		if err == nil {
			for _, i := range ghIssues {
				_ = h.store.UpsertIssue(r.Context(), repo.ID, i)
			}
		}
	}

	issues, err := h.store.ListIssues(r.Context(), repo.ID)
	if err != nil {
		httpjson.Error(w, http.StatusInternalServerError, "could not load issues")
		return
	}
	if issues == nil {
		issues = []Issue{}
	}
	httpjson.Write(w, http.StatusOK, issues)
}

// ListIssuesByOwnerRepo fetches issues directly from GitHub API by owner/repo name.
func (h *Handler) ListIssuesByOwnerRepo(w http.ResponseWriter, r *http.Request) {
	owner := chi.URLParam(r, "owner")
	repo := chi.URLParam(r, "repo")

	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	token, err := h.store.GetAccessToken(r.Context(), userID)
	if err != nil || token == "" {
		httpjson.Error(w, http.StatusUnauthorized, "GitHub not connected")
		return
	}

	issues, err := FetchRepoIssues(r.Context(), token, owner, repo)
	if err != nil {
		h.logger.Error("fetch issues", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not fetch issues")
		return
	}
	if issues == nil {
		issues = []Issue{}
	}
	httpjson.Write(w, http.StatusOK, issues)
}

// Connected returns whether the user has connected their GitHub account.
func (h *Handler) Connected(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	account, err := h.store.GetAccount(r.Context(), userID)
	if err != nil {
		httpjson.Error(w, http.StatusInternalServerError, "could not check GitHub connection")
		return
	}
	connected := account != nil
	username := ""
	if connected {
		username = account.GitHubUsername
	}
	httpjson.Write(w, http.StatusOK, map[string]any{
		"connected": connected,
		"username":  username,
	})
}

func parseUUID(s string) (string, error) {
	s = strings.TrimSpace(s)
	if len(s) != 36 {
		return "", fmt.Errorf("invalid uuid length")
	}
	// Basic UUID format check
	for i, c := range s {
		if (i == 8 || i == 13 || i == 18 || i == 23) {
			if c != '-' {
				return "", fmt.Errorf("invalid uuid format")
			}
		} else if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F')) {
			return "", fmt.Errorf("invalid uuid character")
		}
	}
	return s, nil
}
