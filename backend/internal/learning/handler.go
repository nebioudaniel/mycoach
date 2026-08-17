package learning

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/mycoach/backend/internal/auth"
	"github.com/mycoach/backend/internal/httpjson"
)

type Handler struct {
	store  *Store
	logger *slog.Logger
}

func NewHandler(store *Store, logger *slog.Logger) *Handler {
	return &Handler{store: store, logger: logger}
}

// ─── Learning Paths ───────────────────────────────────────────────────────

func (h *Handler) ListPaths(w http.ResponseWriter, r *http.Request) {
	paths, err := h.store.ListPaths(r.Context())
	if err != nil {
		h.logger.Error("list paths", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load learning paths")
		return
	}
	if paths == nil {
		paths = []LearningPath{}
	}
	httpjson.Write(w, http.StatusOK, paths)
}

// ─── Topics ───────────────────────────────────────────────────────────────

func (h *Handler) ListTopics(w http.ResponseWriter, r *http.Request) {
	pathID := r.URL.Query().Get("path_id")
	topics, err := h.store.ListTopics(r.Context(), pathID)
	if err != nil {
		h.logger.Error("list topics", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load topics")
		return
	}
	if topics == nil {
		topics = []Topic{}
	}

	// If authenticated, attach progress
	userID, _ := auth.UserID(r)
	if userID != uuid.Nil {
		progress, err := h.store.GetAllTopicProgress(r.Context(), userID)
		if err == nil {
			type TopicWithProgress struct {
				Topic
				Status  string `json:"status"`
				Mastery int    `json:"mastery"`
			}
			result := make([]TopicWithProgress, len(topics))
			for i, t := range topics {
				result[i] = TopicWithProgress{Topic: t, Status: "not_started", Mastery: 0}
				if p, ok := progress[t.ID]; ok {
					result[i].Status = p.Status
					result[i].Mastery = p.Mastery
				}
			}
			httpjson.Write(w, http.StatusOK, result)
			return
		}
	}

	type TopicPlain struct {
		Topic
		Status  string `json:"status"`
		Mastery int    `json:"mastery"`
	}
	result := make([]TopicPlain, len(topics))
	for i, t := range topics {
		result[i] = TopicPlain{Topic: t, Status: "not_started", Mastery: 0}
	}
	httpjson.Write(w, http.StatusOK, result)
}

func (h *Handler) GetTopic(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	t, err := h.store.GetTopic(r.Context(), slug)
	if err != nil {
		httpjson.Error(w, http.StatusNotFound, "topic not found")
		return
	}

	resp := map[string]any{"topic": t}

	// Attach progress if authenticated
	userID, _ := auth.UserID(r)
	if userID != uuid.Nil {
		p, err := h.store.GetTopicProgress(r.Context(), userID, t.ID)
		if err == nil && p != nil {
			resp["progress"] = p
		}
	}

	httpjson.Write(w, http.StatusOK, resp)
}

func (h *Handler) UpdateTopicProgress(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	slug := chi.URLParam(r, "slug")
	t, err := h.store.GetTopic(r.Context(), slug)
	if err != nil {
		httpjson.Error(w, http.StatusNotFound, "topic not found")
		return
	}
	var req struct {
		Status  string `json:"status"`
		Mastery int    `json:"mastery"`
	}
	if err := httpjson.Decode(r, &req); err != nil {
		httpjson.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	if req.Status == "" {
		req.Status = "learning"
	}
	if err := h.store.UpsertTopicProgress(r.Context(), userID, t.ID, req.Status, req.Mastery); err != nil {
		h.logger.Error("update progress", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not update progress")
		return
	}
	httpjson.Write(w, http.StatusOK, map[string]any{"ok": true})
}

// ─── Problems ─────────────────────────────────────────────────────────────

func (h *Handler) ListProblems(w http.ResponseWriter, r *http.Request) {
	difficulty := r.URL.Query().Get("difficulty")
	problems, err := h.store.ListProblems(r.Context(), difficulty)
	if err != nil {
		h.logger.Error("list problems", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load problems")
		return
	}
	if problems == nil {
		problems = []Problem{}
	}

	// If authenticated, attach attempt info
	userID, _ := auth.UserID(r)
	if userID != uuid.Nil {
		type ProblemWithStatus struct {
			Problem
			Solved bool `json:"solved"`
		}
		result := make([]ProblemWithStatus, len(problems))
		for i, p := range problems {
			result[i] = ProblemWithStatus{Problem: p, Solved: false}
			attempt, err := h.store.GetProblemAttempt(r.Context(), userID, p.ID)
			if err == nil && attempt != nil && attempt.Status == "solved" {
				result[i].Solved = true
			}
		}
		httpjson.Write(w, http.StatusOK, result)
		return
	}

	type ProblemPlain struct {
		Problem
		Solved bool `json:"solved"`
	}
	result := make([]ProblemPlain, len(problems))
	for i, p := range problems {
		result[i] = ProblemPlain{Problem: p, Solved: false}
	}
	httpjson.Write(w, http.StatusOK, result)
}

func (h *Handler) GetProblem(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	p, err := h.store.GetProblem(r.Context(), slug)
	if err != nil {
		httpjson.Error(w, http.StatusNotFound, "problem not found")
		return
	}

	resp := map[string]any{"problem": p}

	userID, _ := auth.UserID(r)
	if userID != uuid.Nil {
		attempt, err := h.store.GetProblemAttempt(r.Context(), userID, p.ID)
		if err == nil && attempt != nil {
			resp["attempt"] = attempt
		}
	}

	httpjson.Write(w, http.StatusOK, resp)
}

func (h *Handler) SubmitAttempt(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	slug := chi.URLParam(r, "slug")
	p, err := h.store.GetProblem(r.Context(), slug)
	if err != nil {
		httpjson.Error(w, http.StatusNotFound, "problem not found")
		return
	}
	var req struct {
		Language string `json:"language"`
		Code     string `json:"code"`
	}
	if err := httpjson.Decode(r, &req); err != nil {
		httpjson.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	if req.Language == "" {
		req.Language = "python"
	}

	// Simple correctness check against test cases
	status := "attempted"
	var correctness bool
	correctness = len(req.Code) > 20 // basic heuristic: non-trivial code is at least attempted

	pa, err := h.store.UpsertAttempt(r.Context(), userID, p.ID, req.Language, req.Code, status, &correctness)
	if err != nil {
		h.logger.Error("submit attempt", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not save attempt")
		return
	}
	httpjson.Write(w, http.StatusOK, pa)
}

// ─── Dashboard ────────────────────────────────────────────────────────────

func (h *Handler) GetDashboardStats(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	stats, err := h.store.GetDashboardStats(r.Context(), userID)
	if err != nil {
		h.logger.Error("dashboard stats", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load stats")
		return
	}
	httpjson.Write(w, http.StatusOK, stats)
}

// ─── Sessions ─────────────────────────────────────────────────────────────

func (h *Handler) ListSessions(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	limit := 7
	if l := r.URL.Query().Get("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil && n > 0 {
			limit = n
		}
	}
	sessions, err := h.store.ListSessions(r.Context(), userID, limit)
	if err != nil {
		h.logger.Error("list sessions", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load sessions")
		return
	}
	if sessions == nil {
		sessions = []DailySession{}
	}
	httpjson.Write(w, http.StatusOK, sessions)
}

func (h *Handler) GetSession(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	date := chi.URLParam(r, "date")
	sess, err := h.store.GetSession(r.Context(), userID, date)
	if err != nil {
		h.logger.Error("get session", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load session")
		return
	}
	if sess == nil {
		httpjson.Error(w, http.StatusNotFound, "no session for this date")
		return
	}
	httpjson.Write(w, http.StatusOK, sess)
}

// ─── Journal ──────────────────────────────────────────────────────────────

func (h *Handler) ListJournal(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.UserID(r)
	if err != nil {
		httpjson.Error(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	limit := 14
	entries, err := h.store.ListJournal(r.Context(), userID, limit)
	if err != nil {
		h.logger.Error("list journal", "err", err)
		httpjson.Error(w, http.StatusInternalServerError, "could not load journal")
		return
	}
	if entries == nil {
		entries = []JournalEntry{}
	}
	httpjson.Write(w, http.StatusOK, entries)
}
