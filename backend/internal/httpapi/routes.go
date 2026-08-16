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

	s.router.Route("/api/auth", func(r chi.Router) {
		r.Post("/register", h.Users.Register)
		r.Post("/login", h.Users.Login)
		r.Post("/logout", h.Users.Logout)
	})

	s.router.Route("/api/me", func(r chi.Router) {
		r.Use(h.Tokens.Middleware)
		r.Get("/", h.Users.Me)
		r.Put("/profile", h.Users.UpdateProfile)
	})
}
