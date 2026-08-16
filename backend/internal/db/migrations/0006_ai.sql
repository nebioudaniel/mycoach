-- +goose Up
CREATE TABLE ai_interactions (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           uuid REFERENCES users(id) ON DELETE SET NULL,
    kind              text NOT NULL,
    model             text NOT NULL DEFAULT '',
    prompt_tokens     int NOT NULL DEFAULT 0,
    completion_tokens int NOT NULL DEFAULT 0,
    latency_ms        int NOT NULL DEFAULT 0,
    created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE code_reviews (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attempt_id uuid REFERENCES problem_attempts(id) ON DELETE SET NULL,
    subject    text NOT NULL DEFAULT '',
    -- Structured review: { correctness, time_complexity, space_complexity,
    --   well_done[], issues[], concept_to_review, better_approach, next_exercise }
    review     jsonb NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_interactions_user ON ai_interactions(user_id, created_at);
CREATE INDEX idx_code_reviews_user ON code_reviews(user_id);

-- +goose Down
DROP TABLE IF EXISTS code_reviews;
DROP TABLE IF EXISTS ai_interactions;
