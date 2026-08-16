-- +goose Up
CREATE TABLE github_accounts (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    github_user_id   bigint NOT NULL UNIQUE,
    github_username  text NOT NULL,
    -- OAuth tokens are encrypted at rest (AES-256-GCM, key from ENCRYPTION_KEY).
    access_token     bytea,
    access_token_iv  bytea,
    scope            text NOT NULL DEFAULT '',
    avatar_url       text NOT NULL DEFAULT '',
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_github_accounts_user ON github_accounts(user_id);

CREATE TABLE repositories (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name       text NOT NULL,
    owner           text NOT NULL,
    name            text NOT NULL,
    default_branch  text NOT NULL DEFAULT 'main',
    description     text NOT NULL DEFAULT '',
    language        text NOT NULL DEFAULT '',
    stars           int NOT NULL DEFAULT 0,
    is_fork         boolean NOT NULL DEFAULT false,
    size_kb         int NOT NULL DEFAULT 0,
    html_url        text NOT NULL DEFAULT '',
    -- Structured repo overview produced by the AI service.
    overview        jsonb NOT NULL DEFAULT '{}',
    overview_status text NOT NULL DEFAULT 'pending'
                    CHECK (overview_status IN ('pending','processing','ready','failed')),
    analyzed_at     timestamptz,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, full_name)
);
CREATE INDEX idx_repos_user ON repositories(user_id);

CREATE TABLE issues (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    repo_id             uuid NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
    github_number       int NOT NULL,
    title               text NOT NULL,
    body                text NOT NULL DEFAULT '',
    labels              jsonb NOT NULL DEFAULT '[]',
    state               text NOT NULL DEFAULT 'open',
    difficulty_estimate text NOT NULL DEFAULT 'unknown',
    learning_value      int NOT NULL DEFAULT 0,
    relevant_tech       jsonb NOT NULL DEFAULT '[]',
    -- Structured understanding produced by the AI service.
    analysis            jsonb NOT NULL DEFAULT '{}',
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    UNIQUE (repo_id, github_number)
);
CREATE INDEX idx_issues_repo ON issues(repo_id);

-- Guided open-source contribution workflow, stage-tracked.
CREATE TABLE contributions (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    repo_id        uuid REFERENCES repositories(id) ON DELETE SET NULL,
    issue_id       uuid REFERENCES issues(id) ON DELETE SET NULL,
    stage          text NOT NULL DEFAULT 'understand'
                   CHECK (stage IN ('understand','investigate','plan','implement','test','review','commit','push','pull_request')),
    branch         text NOT NULL DEFAULT '',
    pr_number      int,
    pr_url         text NOT NULL DEFAULT '',
    notes          text NOT NULL DEFAULT '',
    status         text NOT NULL DEFAULT 'active' CHECK (status IN ('active','merged','closed','abandoned')),
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_contributions_user ON contributions(user_id, status);

-- +goose Down
DROP TABLE IF EXISTS contributions;
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS repositories;
DROP TABLE IF EXISTS github_accounts;
