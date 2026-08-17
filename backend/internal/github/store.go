package github

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type GitHubAccount struct {
	ID             uuid.UUID `json:"id"`
	UserID         uuid.UUID `json:"userId"`
	GitHubUserID   int64     `json:"githubUserId"`
	GitHubUsername string    `json:"githubUsername"`
	AvatarURL      string    `json:"avatarUrl"`
	Scope          string    `json:"scope"`
	CreatedAt      time.Time `json:"createdAt"`
}

type Repository struct {
	ID            string          `json:"id"`
	UserID        uuid.UUID       `json:"-"`
	FullName      string          `json:"fullName"`
	Owner         string          `json:"owner"`
	Name          string          `json:"name"`
	DefaultBranch string          `json:"defaultBranch"`
	Description   string          `json:"description"`
	Language      string          `json:"language"`
	Stars         int             `json:"stars"`
	IsFork        bool            `json:"isFork"`
	SizeKb        int             `json:"sizeKb"`
	HtmlUrl       string          `json:"htmlUrl"`
	Overview      json.RawMessage `json:"overview"`
	OverviewStatus string         `json:"overviewStatus"`
}

type Issue struct {
	ID                string          `json:"id"`
	RepoID            string          `json:"repoId"`
	GitHubNumber      int             `json:"githubNumber"`
	Title             string          `json:"title"`
	Body              string          `json:"body"`
	Labels            json.RawMessage `json:"labels"`
	State             string          `json:"state"`
	DifficultyEstimate string         `json:"difficultyEstimate"`
	LearningValue     int             `json:"learningValue"`
	RelevantTech      json.RawMessage `json:"relevantTech"`
}

type Store struct {
	pool *pgxpool.Pool
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

// ─── GitHub Account ───────────────────────────────────────────────────────

func (s *Store) GetAccount(ctx context.Context, userID uuid.UUID) (*GitHubAccount, error) {
	var a GitHubAccount
	err := s.pool.QueryRow(ctx,
		`SELECT id, user_id, github_user_id, github_username, avatar_url, scope, created_at
		 FROM github_accounts WHERE user_id = $1`, userID).
		Scan(&a.ID, &a.UserID, &a.GitHubUserID, &a.GitHubUsername, &a.AvatarURL, &a.Scope, &a.CreatedAt)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	return &a, err
}

func (s *Store) UpsertAccount(ctx context.Context, userID uuid.UUID, ghUserID int64, username, avatarURL, scope, accessToken string) error {
	_, err := s.pool.Exec(ctx,
		`INSERT INTO github_accounts (user_id, github_user_id, github_username, avatar_url, scope, access_token)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 ON CONFLICT (user_id) DO UPDATE SET
		   github_user_id = EXCLUDED.github_user_id, github_username = EXCLUDED.github_username,
		   avatar_url = EXCLUDED.avatar_url, scope = EXCLUDED.scope, access_token = EXCLUDED.access_token,
		   updated_at = now()`,
		userID, ghUserID, username, avatarURL, scope, accessToken)
	return err
}

func (s *Store) GetAccessToken(ctx context.Context, userID uuid.UUID) (string, error) {
	var token string
	err := s.pool.QueryRow(ctx,
		`SELECT access_token FROM github_accounts WHERE user_id = $1`, userID).Scan(&token)
	if err == pgx.ErrNoRows {
		return "", nil
	}
	return token, err
}

// ─── Repositories ─────────────────────────────────────────────────────────

func (s *Store) UpsertRepo(ctx context.Context, userID uuid.UUID, r Repository) error {
	_, err := s.pool.Exec(ctx,
		`INSERT INTO repositories (user_id, full_name, owner, name, default_branch, description, language, stars, is_fork, size_kb, html_url)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		 ON CONFLICT (user_id, full_name) DO UPDATE SET
		   description = EXCLUDED.description, language = EXCLUDED.language, stars = EXCLUDED.stars,
		   size_kb = EXCLUDED.size_kb, updated_at = now()`,
		userID, r.FullName, r.Owner, r.Name, r.DefaultBranch, r.Description, r.Language, r.Stars, r.IsFork, r.SizeKb, r.HtmlUrl)
	return err
}

func (s *Store) ListRepos(ctx context.Context, userID uuid.UUID) ([]Repository, error) {
	rows, err := s.pool.Query(ctx,
		`SELECT id, full_name, owner, name, default_branch, description, language, stars, is_fork, size_kb, html_url, COALESCE(overview,'{}'), overview_status
		 FROM repositories WHERE user_id = $1 ORDER BY stars DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var repos []Repository
	for rows.Next() {
		var r Repository
		if err := rows.Scan(&r.ID, &r.FullName, &r.Owner, &r.Name, &r.DefaultBranch, &r.Description, &r.Language, &r.Stars, &r.IsFork, &r.SizeKb, &r.HtmlUrl, &r.Overview, &r.OverviewStatus); err != nil {
			return nil, err
		}
		repos = append(repos, r)
	}
	return repos, rows.Err()
}

func (s *Store) GetRepoByID(ctx context.Context, id string) (Repository, error) {
	var r Repository
	err := s.pool.QueryRow(ctx,
		`SELECT id, full_name, owner, name, default_branch, description, language, stars, is_fork, size_kb, html_url, COALESCE(overview,'{}'), overview_status
		 FROM repositories WHERE id = $1`, id).
		Scan(&r.ID, &r.FullName, &r.Owner, &r.Name, &r.DefaultBranch, &r.Description, &r.Language, &r.Stars, &r.IsFork, &r.SizeKb, &r.HtmlUrl, &r.Overview, &r.OverviewStatus)
	return r, err
}

// ─── Issues ───────────────────────────────────────────────────────────────

func (s *Store) UpsertIssue(ctx context.Context, repoID string, i Issue) error {
	_, err := s.pool.Exec(ctx,
		`INSERT INTO issues (repo_id, github_number, title, body, labels, state)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 ON CONFLICT (repo_id, github_number) DO UPDATE SET
		   title = EXCLUDED.title, body = EXCLUDED.body, labels = EXCLUDED.labels, state = EXCLUDED.state, updated_at = now()`,
		repoID, i.GitHubNumber, i.Title, i.Body, i.Labels, i.State)
	return err
}

func (s *Store) ListIssues(ctx context.Context, repoID string) ([]Issue, error) {
	rows, err := s.pool.Query(ctx,
		`SELECT id, repo_id, github_number, title, body, labels, state, difficulty_estimate, learning_value, COALESCE(relevant_tech,'[]')
		 FROM issues WHERE repo_id = $1 ORDER BY github_number DESC`, repoID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var issues []Issue
	for rows.Next() {
		var i Issue
		if err := rows.Scan(&i.ID, &i.RepoID, &i.GitHubNumber, &i.Title, &i.Body, &i.Labels, &i.State, &i.DifficultyEstimate, &i.LearningValue, &i.RelevantTech); err != nil {
			return nil, err
		}
		issues = append(issues, i)
	}
	return issues, rows.Err()
}

// ─── GitHub API Client ────────────────────────────────────────────────────

func exchangeCode(ctx context.Context, clientID, clientSecret, code string) (string, error) {
	body, _ := json.Marshal(map[string]string{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"code":          code,
	})
	req, _ := http.NewRequestWithContext(ctx, "POST", "https://github.com/login/oauth/access_token", bytes.NewReader(body))
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var result struct {
		AccessToken string `json:"access_token"`
		Error       string `json:"error"`
		ErrorDesc   string `json:"error_description"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}
	if result.Error != "" {
		return "", fmt.Errorf("github oauth: %s", result.ErrorDesc)
	}
	return result.AccessToken, nil
}

func fetchGitHubUser(ctx context.Context, token string) (int64, string, string, error) {
	req, _ := http.NewRequestWithContext(ctx, "GET", "https://api.github.com/user", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return 0, "", "", err
	}
	defer resp.Body.Close()

	var user struct {
		ID        int64  `json:"id"`
		Login     string `json:"login"`
		AvatarURL string `json:"avatar_url"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return 0, "", "", err
	}
	return user.ID, user.Login, user.AvatarURL, nil
}

func FetchUserRepos(ctx context.Context, token string) ([]Repository, error) {
	var all []Repository
	url := "https://api.github.com/user/repos?per_page=100&sort=updated"
	for url != "" {
		req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("Accept", "application/vnd.github.v3+json")

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return nil, err
		}
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		var repos []struct {
			FullName      string `json:"full_name"`
			Owner         struct{ Login string } `json:"owner"`
			Name          string `json:"name"`
			DefaultBranch string `json:"default_branch"`
			Description   string `json:"description"`
			Language      string `json:"language"`
			Stargazers    int    `json:"stargazers_count"`
			Fork          bool   `json:"fork"`
			Size          int    `json:"size"`
			HTMLURL       string `json:"html_url"`
		}
		if err := json.Unmarshal(body, &repos); err != nil {
			return nil, err
		}
		for _, r := range repos {
			all = append(all, Repository{
				FullName:      r.FullName,
				Owner:         r.Owner.Login,
				Name:          r.Name,
				DefaultBranch: r.DefaultBranch,
				Description:   r.Description,
				Language:      r.Language,
				Stars:         r.Stargazers,
				IsFork:        r.Fork,
				SizeKb:        r.Size,
				HtmlUrl:       r.HTMLURL,
			})
		}

		// Parse Link header for pagination
		url = ""
		for _, v := range resp.Header.Values("Link") {
			if parts := splitLink(v); parts["next"] != "" {
				url = parts["next"]
			}
		}
	}
	return all, nil
}

func FetchRepoIssues(ctx context.Context, token, owner, repo string) ([]Issue, error) {
	var all []Issue
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/issues?state=open&per_page=50", owner, repo)
	for url != "" {
		req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
		req.Header.Set("Authorization", "Bearer "+token)
		req.Header.Set("Accept", "application/vnd.github.v3+json")

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			return nil, err
		}
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		var issues []struct {
			Number int    `json:"number"`
			Title  string `json:"title"`
			Body   string `json:"body"`
			State  string `json:"state"`
			Labels []struct {
				Name string `json:"name"`
			} `json:"labels"`
		}
		if err := json.Unmarshal(body, &issues); err != nil {
			return nil, err
		}
		for _, i := range issues {
			labels, _ := json.Marshal(i.Labels)
			all = append(all, Issue{
				GitHubNumber: i.Number,
				Title:        i.Title,
				Body:         i.Body,
				State:        i.State,
				Labels:       labels,
			})
		}

		url = ""
		for _, v := range resp.Header.Values("Link") {
			if parts := splitLink(v); parts["next"] != "" {
				url = parts["next"]
			}
		}
	}
	return all, nil
}

func splitLink(header string) map[string]string {
	result := map[string]string{}
	for _, part := range splitParts(header) {
		if len(part) < 2 {
			continue
		}
		url := part[0]
		key := ""
		for _, p := range part[1:] {
			if len(p) > 0 && p[len(p)-1] == ';' {
				p = p[:len(p)-1]
			}
			if kv := splitKV(p); kv != "" {
				key = kv
			}
		}
		if key != "" && len(url) > 2 {
			result[key] = url[1 : len(url)-1]
		}
	}
	return result
}

func splitParts(s string) [][]string {
	var result [][]string
	current := []string{}
	buf := ""
	inQuote := false
	for _, c := range s {
		switch {
		case c == '"':
			inQuote = !inQuote
		case c == ',' && !inQuote:
			if buf != "" || len(current) > 0 {
				current = append(current, buf)
			}
			result = append(result, current)
			current = nil
			buf = ""
		case c == ';' && !inQuote:
			current = append(current, buf)
			buf = ""
		default:
			buf += string(c)
		}
	}
	if buf != "" || len(current) > 0 {
		current = append(current, buf)
		result = append(result, current)
	}
	return result
}

func splitKV(s string) string {
	for i, c := range s {
		if c == '=' {
			return s[i+1:]
		}
	}
	return ""
}
