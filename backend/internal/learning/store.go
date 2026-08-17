package learning

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LearningPath struct {
	ID          string `json:"id"`
	Slug        string `json:"slug"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Position    int    `json:"position"`
}

type Topic struct {
	ID         string          `json:"id"`
	PathID     *string         `json:"pathId"`
	Slug       string          `json:"slug"`
	Title      string          `json:"title"`
	Difficulty string          `json:"difficulty"`
	Content    json.RawMessage `json:"content"`
	Position   int             `json:"position"`
}

type TopicProgress struct {
	UserID   uuid.UUID `json:"-"`
	TopicID  string    `json:"topicId"`
	Status   string    `json:"status"`
	Mastery  int       `json:"mastery"`
	StartedAt *time.Time `json:"startedAt,omitempty"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type TopicDetail struct {
	Topic
	Progress *TopicProgress `json:"progress,omitempty"`
}

type Problem struct {
	ID            string          `json:"id"`
	Slug          string          `json:"slug"`
	Title         string          `json:"title"`
	Difficulty    string          `json:"difficulty"`
	Topics        []string        `json:"topics"`
	DescriptionMd string          `json:"descriptionMd"`
	Examples      json.RawMessage `json:"examples"`
	ConstraintsMd string          `json:"constraintsMd"`
	StarterCode   json.RawMessage `json:"starterCode"`
	Source        string          `json:"source"`
}

type ProblemWithAttempt struct {
	Problem
	Attempt *ProblemAttempt `json:"attempt,omitempty"`
}

type ProblemAttempt struct {
	ID             string          `json:"id"`
	ProblemID      string          `json:"problemId"`
	Language       string          `json:"language"`
	Code           string          `json:"code"`
	Status         string          `json:"status"`
	Correctness    *bool           `json:"correctness"`
	TimeComplexity string          `json:"timeComplexity"`
	SpaceComplexity string         `json:"spaceComplexity"`
	MaxHintLevel   int             `json:"maxHintLevel"`
	Review         json.RawMessage `json:"review"`
	CreatedAt      time.Time       `json:"createdAt"`
}

type DashboardStats struct {
	TopicsMastered   int        `json:"topicsMastered"`
	TopicsLearning   int        `json:"topicsLearning"`
	ProblemsAttempted int       `json:"problemsAttempted"`
	ProblemsSolved   int        `json:"problemsSolved"`
	CurrentStreak    int        `json:"currentStreak"`
	LearningHours    float64    `json:"learningHours"`
	WeakConcepts     []string   `json:"weakConcepts"`
	RecentMistakes   []Mistake  `json:"recentMistakes"`
}

type Mistake struct {
	Description string `json:"description"`
	Topic       string `json:"topic"`
	Date        string `json:"date"`
}

type DailySession struct {
	ID          string          `json:"id"`
	Date        string          `json:"date"`
	Plan        json.RawMessage `json:"plan"`
	Status      string          `json:"status"`
	StartedAt   *time.Time      `json:"startedAt,omitempty"`
	CompletedAt *time.Time      `json:"completedAt,omitempty"`
}

type JournalEntry struct {
	ID             string          `json:"id"`
	Date           string          `json:"date"`
	Entries        json.RawMessage `json:"entries"`
	Recommendation string          `json:"recommendation"`
}

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

// ─── Learning Paths ───────────────────────────────────────────────────────

func (s *Store) ListPaths(ctx context.Context) ([]LearningPath, error) {
	rows, err := s.pool.Query(ctx, `SELECT id, slug, title, description, position FROM learning_paths ORDER BY position`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var paths []LearningPath
	for rows.Next() {
		var p LearningPath
		if err := rows.Scan(&p.ID, &p.Slug, &p.Title, &p.Description, &p.Position); err != nil {
			return nil, err
		}
		paths = append(paths, p)
	}
	return paths, rows.Err()
}

// ─── Topics ───────────────────────────────────────────────────────────────

func (s *Store) ListTopics(ctx context.Context, pathID string) ([]Topic, error) {
	var rows pgx.Rows
	var err error
	if pathID != "" {
		rows, err = s.pool.Query(ctx,
			`SELECT id, path_id, slug, title, difficulty, content, position
			 FROM topics WHERE path_id = $1 ORDER BY position`, pathID)
	} else {
		rows, err = s.pool.Query(ctx,
			`SELECT id, path_id, slug, title, difficulty, content, position
			 FROM topics ORDER BY position`)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var topics []Topic
	for rows.Next() {
		var t Topic
		if err := rows.Scan(&t.ID, &t.PathID, &t.Slug, &t.Title, &t.Difficulty, &t.Content, &t.Position); err != nil {
			return nil, err
		}
		topics = append(topics, t)
	}
	return topics, rows.Err()
}

func (s *Store) GetTopic(ctx context.Context, slug string) (Topic, error) {
	var t Topic
	err := s.pool.QueryRow(ctx,
		`SELECT id, path_id, slug, title, difficulty, content, position
		 FROM topics WHERE slug = $1`, slug).
		Scan(&t.ID, &t.PathID, &t.Slug, &t.Title, &t.Difficulty, &t.Content, &t.Position)
	return t, err
}

func (s *Store) GetTopicProgress(ctx context.Context, userID uuid.UUID, topicID string) (*TopicProgress, error) {
	var tp TopicProgress
	err := s.pool.QueryRow(ctx,
		`SELECT topic_id, status, mastery, started_at, updated_at
		 FROM topic_progress WHERE user_id = $1 AND topic_id = $2`, userID, topicID).
		Scan(&tp.TopicID, &tp.Status, &tp.Mastery, &tp.StartedAt, &tp.UpdatedAt)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	tp.UserID = userID
	return &tp, err
}

func (s *Store) GetAllTopicProgress(ctx context.Context, userID uuid.UUID) (map[string]*TopicProgress, error) {
	rows, err := s.pool.Query(ctx,
		`SELECT topic_id, status, mastery, started_at, updated_at
		 FROM topic_progress WHERE user_id = $1`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	result := make(map[string]*TopicProgress)
	for rows.Next() {
		var tp TopicProgress
		if err := rows.Scan(&tp.TopicID, &tp.Status, &tp.Mastery, &tp.StartedAt, &tp.UpdatedAt); err != nil {
			return nil, err
		}
		tp.UserID = userID
		result[tp.TopicID] = &tp
	}
	return result, rows.Err()
}

func (s *Store) UpsertTopicProgress(ctx context.Context, userID uuid.UUID, topicID, status string, mastery int) error {
	_, err := s.pool.Exec(ctx,
		`INSERT INTO topic_progress (user_id, topic_id, status, mastery, started_at)
		 VALUES ($1, $2, $3, $4, CASE WHEN $4 > 0 THEN now() ELSE NULL END)
		 ON CONFLICT (user_id, topic_id) DO UPDATE
		 SET status = EXCLUDED.status, mastery = EXCLUDED.mastery, updated_at = now()`,
		userID, topicID, status, mastery)
	return err
}

// ─── Problems ─────────────────────────────────────────────────────────────

func (s *Store) ListProblems(ctx context.Context, difficulty string) ([]Problem, error) {
	var rows pgx.Rows
	var err error
	if difficulty != "" {
		rows, err = s.pool.Query(ctx,
			`SELECT id, slug, title, difficulty, topics, description_md, examples, constraints_md, starter_code, source
			 FROM problems WHERE difficulty = $1 ORDER BY created_at`, difficulty)
	} else {
		rows, err = s.pool.Query(ctx,
			`SELECT id, slug, title, difficulty, topics, description_md, examples, constraints_md, starter_code, source
			 FROM problems ORDER BY created_at`)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var problems []Problem
	for rows.Next() {
		var p Problem
		if err := rows.Scan(&p.ID, &p.Slug, &p.Title, &p.Difficulty, &p.Topics, &p.DescriptionMd, &p.Examples, &p.ConstraintsMd, &p.StarterCode, &p.Source); err != nil {
			return nil, err
		}
		problems = append(problems, p)
	}
	return problems, rows.Err()
}

func (s *Store) GetProblem(ctx context.Context, slug string) (Problem, error) {
	var p Problem
	err := s.pool.QueryRow(ctx,
		`SELECT id, slug, title, difficulty, topics, description_md, examples, constraints_md, starter_code, source
		 FROM problems WHERE slug = $1`, slug).
		Scan(&p.ID, &p.Slug, &p.Title, &p.Difficulty, &p.Topics, &p.DescriptionMd, &p.Examples, &p.ConstraintsMd, &p.StarterCode, &p.Source)
	return p, err
}

func (s *Store) GetProblemAttempt(ctx context.Context, userID uuid.UUID, problemID string) (*ProblemAttempt, error) {
	var pa ProblemAttempt
	err := s.pool.QueryRow(ctx,
		`SELECT id, problem_id, language, code, status, correctness, time_complexity, space_complexity, max_hint_level, review, created_at
		 FROM problem_attempts WHERE user_id = $1 AND problem_id = $2
		 ORDER BY created_at DESC LIMIT 1`, userID, problemID).
		Scan(&pa.ID, &pa.ProblemID, &pa.Language, &pa.Code, &pa.Status, &pa.Correctness, &pa.TimeComplexity, &pa.SpaceComplexity, &pa.MaxHintLevel, &pa.Review, &pa.CreatedAt)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	return &pa, err
}

func (s *Store) UpsertAttempt(ctx context.Context, userID uuid.UUID, problemID, language, code, status string, correctness *bool) (*ProblemAttempt, error) {
	var pa ProblemAttempt
	err := s.pool.QueryRow(ctx,
		`INSERT INTO problem_attempts (user_id, problem_id, language, code, status, correctness)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 ON CONFLICT DO UPDATE SET code = EXCLUDED.code, status = EXCLUDED.status, correctness = EXCLUDED.correctness
		 RETURNING id, problem_id, language, code, status, correctness, time_complexity, space_complexity, max_hint_level, review, created_at`,
		userID, problemID, language, code, status, correctness).
		Scan(&pa.ID, &pa.ProblemID, &pa.Language, &pa.Code, &pa.Status, &pa.Correctness, &pa.TimeComplexity, &pa.SpaceComplexity, &pa.MaxHintLevel, &pa.Review, &pa.CreatedAt)
	return &pa, err
}

// ─── Dashboard ────────────────────────────────────────────────────────────

func (s *Store) GetDashboardStats(ctx context.Context, userID uuid.UUID) (*DashboardStats, error) {
	stats := &DashboardStats{}

	// Topic progress
	err := s.pool.QueryRow(ctx,
		`SELECT
			COUNT(*) FILTER (WHERE status = 'mastered'),
			COUNT(*) FILTER (WHERE status = 'learning')
		 FROM topic_progress WHERE user_id = $1`, userID).
		Scan(&stats.TopicsMastered, &stats.TopicsLearning)
	if err != nil {
		return nil, err
	}

	// Problem stats
	err = s.pool.QueryRow(ctx,
		`SELECT
			COUNT(*),
			COUNT(*) FILTER (WHERE status = 'solved')
		 FROM problem_attempts WHERE user_id = $1`, userID).
		Scan(&stats.ProblemsAttempted, &stats.ProblemsSolved)
	if err != nil {
		return nil, err
	}

	// Streak: count consecutive days with activity
	var streak int
	rows, err := s.pool.Query(ctx,
		`SELECT DISTINCT date(created_at) as d FROM problem_attempts WHERE user_id = $1
		 UNION
		 SELECT DISTINCT date(created_at) as d FROM topic_progress WHERE user_id = $1 AND started_at IS NOT NULL
		 ORDER BY d DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	today := time.Now().Truncate(24 * time.Hour)
	for rows.Next() {
		var d time.Time
		if err := rows.Scan(&d); err != nil {
			break
		}
		d = d.Truncate(24 * time.Hour)
		expected := today.AddDate(0, 0, -streak)
		if d.Equal(expected) {
			streak++
		} else if streak == 0 && d.Equal(today) {
			streak = 1
		} else {
			break
		}
	}
	stats.CurrentStreak = streak

	// Learning hours from sessions
	var hours float64
	_ = s.pool.QueryRow(ctx,
		`SELECT COALESCE(SUM(s.minutes)/60.0, 0)
		 FROM session_items si JOIN sessions s ON si.session_id = s.id
		 WHERE s.user_id = $1 AND si.status = 'done'`, userID).Scan(&hours)
	stats.LearningHours = hours

	// Weak concepts: topics with low mastery
	rows2, err := s.pool.Query(ctx,
		`SELECT t.title FROM topic_progress tp
		 JOIN topics t ON t.id = tp.topic_id
		 WHERE tp.user_id = $1 AND tp.mastery < 50 AND tp.status != 'not_started'
		 ORDER BY tp.mastery ASC LIMIT 5`, userID)
	if err == nil {
		defer rows2.Close()
		for rows2.Next() {
			var title string
			if err := rows2.Scan(&title); err == nil {
				stats.WeakConcepts = append(stats.WeakConcepts, title)
			}
		}
	}

	// Recent mistakes
	rows3, err := s.pool.Query(ctx,
		`SELECT m.description, COALESCE(t.title, ''), m.created_at::text
		 FROM mistakes m LEFT JOIN topics t ON t.id = m.topic_id
		 WHERE m.user_id = $1 ORDER BY m.created_at DESC LIMIT 5`, userID)
	if err == nil {
		defer rows3.Close()
		for rows3.Next() {
			var m Mistake
			if err := rows3.Scan(&m.Description, &m.Topic, &m.Date); err == nil {
				stats.RecentMistakes = append(stats.RecentMistakes, m)
			}
		}
	}

	return stats, nil
}

// ─── Sessions ─────────────────────────────────────────────────────────────

func (s *Store) ListSessions(ctx context.Context, userID uuid.UUID, limit int) ([]DailySession, error) {
	if limit <= 0 {
		limit = 7
	}
	rows, err := s.pool.Query(ctx,
		`SELECT id, date, plan, status, started_at, completed_at
		 FROM sessions WHERE user_id = $1 ORDER BY date DESC LIMIT $2`, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var sessions []DailySession
	for rows.Next() {
		var ds DailySession
		if err := rows.Scan(&ds.ID, &ds.Date, &ds.Plan, &ds.Status, &ds.StartedAt, &ds.CompletedAt); err != nil {
			return nil, err
		}
		sessions = append(sessions, ds)
	}
	return sessions, rows.Err()
}

func (s *Store) GetSession(ctx context.Context, userID uuid.UUID, date string) (*DailySession, error) {
	var ds DailySession
	err := s.pool.QueryRow(ctx,
		`SELECT id, date, plan, status, started_at, completed_at
		 FROM sessions WHERE user_id = $1 AND date = $2`, userID, date).
		Scan(&ds.ID, &ds.Date, &ds.Plan, &ds.Status, &ds.StartedAt, &ds.CompletedAt)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	return &ds, err
}

// ─── Journal ──────────────────────────────────────────────────────────────

func (s *Store) ListJournal(ctx context.Context, userID uuid.UUID, limit int) ([]JournalEntry, error) {
	if limit <= 0 {
		limit = 14
	}
	rows, err := s.pool.Query(ctx,
		`SELECT id, date, entries, recommendation
		 FROM engineering_journal WHERE user_id = $1 ORDER BY date DESC LIMIT $2`, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var entries []JournalEntry
	for rows.Next() {
		var je JournalEntry
		if err := rows.Scan(&je.ID, &je.Date, &je.Entries, &je.Recommendation); err != nil {
			return nil, err
		}
		entries = append(entries, je)
	}
	return entries, rows.Err()
}
