package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all runtime configuration for the API server.
type Config struct {
	Port            int
	DatabaseURL     string
	JWTSecret       string
	SessionTTL      time.Duration
	CORSOrigins     []string
	AIServiceURL    string
	AIServiceKey    string
	GitHubClientID  string
	GitHubSecret    string
	GitHubCallback  string
	GitHubScopes    string
	FrontendBaseURL string
}

// Load reads configuration from environment variables, applying defaults.
func Load() (*Config, error) {
	_ = godotenv.Load() // best-effort .env loading
	cfg := &Config{
		Port:            envInt("API_PORT", 8080),
		DatabaseURL:     os.Getenv("DATABASE_URL"),
		JWTSecret:       os.Getenv("JWT_SECRET"),
		SessionTTL:      envDuration("SESSION_TTL", 168*time.Hour),
		CORSOrigins:     envList("CORS_ORIGINS"),
		AIServiceURL:    envDefault("AI_SERVICE_URL", "http://localhost:8000"),
		AIServiceKey:    os.Getenv("AI_SERVICE_SHARED_KEY"),
		GitHubClientID:  os.Getenv("GITHUB_CLIENT_ID"),
		GitHubSecret:    os.Getenv("GITHUB_CLIENT_SECRET"),
		GitHubCallback:  os.Getenv("GITHUB_CALLBACK_URL"),
		GitHubScopes:    envDefault("GITHUB_SCOPES", "read:user,repo"),
		FrontendBaseURL: os.Getenv("NEXT_PUBLIC_APP_URL"),
	}

	required := []struct {
		name  string
		value string
	}{
		{"DATABASE_URL", cfg.DatabaseURL},
		{"JWT_SECRET", cfg.JWTSecret},
	}
	for _, r := range required {
		if strings.TrimSpace(r.value) == "" {
			return nil, fmt.Errorf("missing required env var %s (see .env.example)", r.name)
		}
	}
	if len(cfg.CORSOrigins) == 0 {
		cfg.CORSOrigins = []string{"http://localhost:3000"}
	}
	return cfg, nil
}

func envDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func envInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return def
}

func envDuration(key string, def time.Duration) time.Duration {
	if v := os.Getenv(key); v != "" {
		if d, err := time.ParseDuration(v); err == nil {
			return d
		}
	}
	return def
}

func envList(key string) []string {
	raw := os.Getenv(key)
	if raw == "" {
		return nil
	}
	var out []string
	for _, p := range strings.Split(raw, ",") {
		if p = strings.TrimSpace(p); p != "" {
			out = append(out, p)
		}
	}
	return out
}
