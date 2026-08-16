-- +goose Up
CREATE TABLE learning_paths (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        text NOT NULL UNIQUE,
    title       text NOT NULL,
    description text NOT NULL DEFAULT '',
    position    int NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE topics (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    path_id     uuid REFERENCES learning_paths(id) ON DELETE CASCADE,
    slug        text NOT NULL UNIQUE,
    title       text NOT NULL,
    difficulty  text NOT NULL DEFAULT 'beginner'
                CHECK (difficulty IN ('beginner','intermediate','advanced')),
    -- Structured concept content. Keys:
    --   what, why, mental_model, visual (dsl/ascii), examples[], complexity{},
    --   try_it[], check_understanding[], resources[]
    content     jsonb NOT NULL DEFAULT '{}',
    position    int NOT NULL DEFAULT 0,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- Directed dependency edges between topics (prerequisites).
CREATE TABLE path_edges (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    from_topic   uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    to_topic     uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE (from_topic, to_topic)
);

CREATE TABLE topic_progress (
    user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id    uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    status      text NOT NULL DEFAULT 'not_started'
                CHECK (status IN ('not_started','learning','mastered','review')),
    mastery     int NOT NULL DEFAULT 0 CHECK (mastery BETWEEN 0 AND 100),
    started_at  timestamptz,
    updated_at  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, topic_id)
);

CREATE INDEX idx_topics_path ON topics(path_id);
CREATE INDEX idx_topic_progress_user ON topic_progress(user_id);

-- +goose Down
DROP TABLE IF EXISTS topic_progress;
DROP TABLE IF EXISTS path_edges;
DROP TABLE IF EXISTS topics;
DROP TABLE IF EXISTS learning_paths;
