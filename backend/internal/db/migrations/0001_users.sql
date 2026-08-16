-- +goose Up
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email         text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    display_name  text NOT NULL DEFAULT '',
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
    user_id          uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    skill_level      text NOT NULL DEFAULT 'beginner' CHECK (skill_level IN ('beginner','intermediate','advanced')),
    timezone         text NOT NULL DEFAULT 'UTC',
    goals            jsonb NOT NULL DEFAULT '[]',
    languages        jsonb NOT NULL DEFAULT '["Go","Python"]',
    onboarding_done  boolean NOT NULL DEFAULT false,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE learning_goals (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       text NOT NULL,
    status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','achieved')),
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_user ON profiles(user_id);
CREATE INDEX idx_goals_user ON learning_goals(user_id);

-- +goose Down
DROP TABLE IF EXISTS learning_goals;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;
