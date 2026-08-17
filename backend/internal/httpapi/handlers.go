package httpapi

import (
	"log/slog"

	"github.com/mycoach/backend/internal/auth"
	"github.com/mycoach/backend/internal/config"
	"github.com/mycoach/backend/internal/learning"
	"github.com/mycoach/backend/internal/session"
	"github.com/mycoach/backend/internal/users"
)

// Handlers bundles all HTTP handlers for route wiring.
type Handlers struct {
	Users    *users.Handler
	Learning *learning.Handler
	Tokens   *auth.Manager
}

// NewHandlers constructs the handler layer with its dependencies.
func NewHandlers(cfg *config.Config, logger *slog.Logger, deps *Deps) *Handlers {
	return &Handlers{
		Users:    users.NewHandler(deps.Users, deps.Tokens, deps.Sessions, logger, cfg.FrontendBaseURL),
		Learning: learning.NewHandler(deps.Learning, logger),
		Tokens:   deps.Tokens,
	}
}

// Deps holds shared dependencies constructed in main.
type Deps struct {
	Users    *users.Store
	Learning *learning.Store
	Tokens   *auth.Manager
	Sessions *session.Manager
}
