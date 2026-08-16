package users

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrEmailTaken = errors.New("email already registered")
	ErrNotFound   = errors.New("user not found")
)

// User is a persisted account.
type User struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	DisplayName  string    `json:"displayName"`
	CreatedAt    time.Time `json:"createdAt"`
}

// Profile holds learner metadata for a user.
type Profile struct {
	UserID        uuid.UUID `json:"userId"`
	SkillLevel    string    `json:"skillLevel"`
	Timezone      string    `json:"timezone"`
	Goals         []string  `json:"goals"`
	Languages     []string  `json:"languages"`
	OnboardingDone bool     `json:"onboardingDone"`
}

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

// Create registers a user and their default profile.
func (s *Store) Create(ctx context.Context, email, passwordHash, displayName string) (User, error) {
	var u User
	row := s.pool.QueryRow(ctx,
		`INSERT INTO users (email, password_hash, display_name)
		 VALUES ($1, $2, $3)
		 RETURNING id, email, display_name, created_at`,
		email, passwordHash, displayName)
	err := row.Scan(&u.ID, &u.Email, &u.DisplayName, &u.CreatedAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return User{}, ErrEmailTaken
		}
		return User{}, err
	}
	if _, err := s.pool.Exec(ctx,
		`INSERT INTO profiles (user_id) VALUES ($1)`, u.ID); err != nil {
		return User{}, err
	}
	return u, nil
}

// ByEmail returns a user and their password hash for login.
func (s *Store) ByEmail(ctx context.Context, email string) (User, string, error) {
	var u User
	var hash string
	err := s.pool.QueryRow(ctx,
		`SELECT id, email, display_name, password_hash, created_at
		 FROM users WHERE email = $1`, email).
		Scan(&u.ID, &u.Email, &u.DisplayName, &hash, &u.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return User{}, "", ErrNotFound
	}
	return u, hash, err
}

// ByID returns a user by id.
func (s *Store) ByID(ctx context.Context, id uuid.UUID) (User, error) {
	var u User
	err := s.pool.QueryRow(ctx,
		`SELECT id, email, display_name, created_at FROM users WHERE id = $1`, id).
		Scan(&u.ID, &u.Email, &u.DisplayName, &u.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return User{}, ErrNotFound
	}
	return u, err
}

// GetProfile returns the learner profile for a user.
func (s *Store) GetProfile(ctx context.Context, userID uuid.UUID) (Profile, error) {
	var p Profile
	var goals, languages []string
	err := s.pool.QueryRow(ctx,
		`SELECT user_id, skill_level, timezone, goals, languages, onboarding_done
		 FROM profiles WHERE user_id = $1`, userID).
		Scan(&p.UserID, &p.SkillLevel, &p.Timezone, &goals, &languages, &p.OnboardingDone)
	if err != nil {
		return Profile{}, err
	}
	p.Goals = goals
	p.Languages = languages
	return p, nil
}

// UpdateProfile persists profile fields.
func (s *Store) UpdateProfile(ctx context.Context, userID uuid.UUID, p Profile) (Profile, error) {
	_, err := s.pool.Exec(ctx,
		`UPDATE profiles
		 SET skill_level = $2, timezone = $3, goals = $4, languages = $5,
		     onboarding_done = $6, updated_at = now()
		 WHERE user_id = $1`,
		userID, p.SkillLevel, p.Timezone, p.Goals, p.Languages, p.OnboardingDone)
	if err != nil {
		return Profile{}, err
	}
	return s.GetProfile(ctx, userID)
}
