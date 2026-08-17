package httpapi

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/mycoach/backend/internal/httpjson"
)

func (s *Server) routes(h *Handlers) {
	s.router.Get("/api/health", func(w http.ResponseWriter, r *http.Request) {
		httpjson.Write(w, http.StatusOK, map[string]any{
			"status":  "ok",
			"service": "mycoach-api",
		})
	})

	// ─── Auth ────────────────────────────────────────────────────────────
	s.router.Route("/api/auth", func(r chi.Router) {
		r.Post("/register", h.Users.Register)
		r.Post("/login", h.Users.Login)
		r.Post("/logout", h.Users.Logout)
	})

	// ─── Me ──────────────────────────────────────────────────────────────
	s.router.Route("/api/me", func(r chi.Router) {
		r.Use(h.Tokens.Middleware)
		r.Get("/", h.Users.Me)
		r.Put("/profile", h.Users.UpdateProfile)
	})

	// ─── Learning Paths ──────────────────────────────────────────────────
	s.router.Get("/api/learning-paths", h.Learning.ListPaths)

	// ─── Topics ──────────────────────────────────────────────────────────
	s.router.Get("/api/topics", h.Learning.ListTopics)
	s.router.Get("/api/topics/{slug}", h.Learning.GetTopic)
	s.router.Put("/api/topics/{slug}/progress", func(w http.ResponseWriter, r *http.Request) {
		h.Learning.UpdateTopicProgress(w, r)
	})

	// ─── Problems ────────────────────────────────────────────────────────
	s.router.Get("/api/problems", h.Learning.ListProblems)
	s.router.Get("/api/problems/{slug}", h.Learning.GetProblem)
	s.router.Post("/api/problems/{slug}/submit", h.Learning.SubmitAttempt)

	// ─── Dashboard ───────────────────────────────────────────────────────
	s.router.Route("/api/dashboard", func(r chi.Router) {
		r.Use(h.Tokens.Middleware)
		r.Get("/stats", h.Learning.GetDashboardStats)
	})

	// ─── Sessions ────────────────────────────────────────────────────────
	s.router.Route("/api/sessions", func(r chi.Router) {
		r.Use(h.Tokens.Middleware)
		r.Get("/", h.Learning.ListSessions)
		r.Get("/{date}", h.Learning.GetSession)
	})

	// ─── Journal ─────────────────────────────────────────────────────────
	s.router.Route("/api/journal", func(r chi.Router) {
		r.Use(h.Tokens.Middleware)
		r.Get("/", h.Learning.ListJournal)
	})
}
