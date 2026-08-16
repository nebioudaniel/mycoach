// Package session manages the httpOnly session cookie that carries the JWT.
package session

import (
	"net/http"
	"time"
)

// Manager sets and clears the session cookie.
type Manager struct {
	CookieName string
	TTL        time.Duration
	Secure     bool
}

func NewManager(cookieName string, ttl time.Duration, secure bool) *Manager {
	return &Manager{CookieName: cookieName, TTL: ttl, Secure: secure}
}

// Set stores the token in an httpOnly, SameSite=Lax cookie.
func (m *Manager) Set(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     m.CookieName,
		Value:    token,
		Path:     "/",
		MaxAge:   int(m.TTL.Seconds()),
		HttpOnly: true,
		Secure:   m.Secure,
		SameSite: http.SameSiteLaxMode,
	})
}

// Clear expires the session cookie.
func (m *Manager) Clear(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     m.CookieName,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   m.Secure,
		SameSite: http.SameSiteLaxMode,
	})
}
