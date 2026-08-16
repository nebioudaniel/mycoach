-- +goose Up
CREATE TABLE sessions (
    id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date         date NOT NULL,
    -- Generated plan, e.g. [{kind:"review",title:"Hash Maps",minutes:10}, ...]
    plan         jsonb NOT NULL DEFAULT '[]',
    status       text NOT NULL DEFAULT 'planned'
                 CHECK (status IN ('planned','in_progress','completed')),
    started_at   timestamptz,
    completed_at timestamptz,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, date)
);

CREATE TABLE session_items (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    kind        text NOT NULL
                CHECK (kind IN ('review','learn','practice','leetcode','opensource','reflection')),
    title       text NOT NULL DEFAULT '',
    topic_id    uuid REFERENCES topics(id) ON DELETE SET NULL,
    minutes     int NOT NULL DEFAULT 10,
    position    int NOT NULL DEFAULT 0,
    status      text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','in_progress','done','skipped')),
    completed_at timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE engineering_journal (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date            date NOT NULL,
    entries         jsonb NOT NULL DEFAULT '{}',  -- { learned:[], struggled:[], solved:[], opensource:[] }
    recommendation  text NOT NULL DEFAULT '',
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, date)
);

CREATE INDEX idx_sessions_user ON sessions(user_id, date);
CREATE INDEX idx_session_items_session ON session_items(session_id);
CREATE INDEX idx_journal_user ON engineering_journal(user_id, date);

-- +goose Down
DROP TABLE IF EXISTS engineering_journal;
DROP TABLE IF EXISTS session_items;
DROP TABLE IF EXISTS sessions;
