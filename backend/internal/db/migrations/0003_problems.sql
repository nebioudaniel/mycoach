-- +goose Up
CREATE TABLE problems (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug           text NOT NULL UNIQUE,
    title          text NOT NULL,
    difficulty     text NOT NULL DEFAULT 'easy'
                   CHECK (difficulty IN ('easy','medium','hard')),
    -- Array of topic slugs this problem belongs to.
    topics         text[] NOT NULL DEFAULT '{}',
    description_md text NOT NULL DEFAULT '',
    examples       jsonb NOT NULL DEFAULT '[]',
    constraints_md text NOT NULL DEFAULT '',
    starter_code   jsonb NOT NULL DEFAULT '{}',   -- { "go": "...", "python": "..." }
    test_cases     jsonb NOT NULL DEFAULT '[]',   -- { input, expected }
    source         text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','leetcode')),
    leetcode_url   text NOT NULL DEFAULT '',
    created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE problem_attempts (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id       uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    language         text NOT NULL DEFAULT 'python',
    code             text NOT NULL DEFAULT '',
    status           text NOT NULL DEFAULT 'attempted'
                     CHECK (status IN ('attempted','solved','failed','partial')),
    correctness      boolean,
    time_complexity  text NOT NULL DEFAULT '',
    space_complexity text NOT NULL DEFAULT '',
    max_hint_level   int NOT NULL DEFAULT 0,
    -- Structured AI review output (see code-review docs).
    review           jsonb NOT NULL DEFAULT '{}',
    notes            text NOT NULL DEFAULT '',
    created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE mistakes (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id    uuid REFERENCES topics(id) ON DELETE SET NULL,
    problem_id  uuid REFERENCES problems(id) ON DELETE SET NULL,
    category    text NOT NULL DEFAULT 'concept'
                CHECK (category IN ('concept','algorithm','complexity','coding','misread')),
    description text NOT NULL DEFAULT '',
    resolved    boolean NOT NULL DEFAULT false,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE hints_used (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attempt_id uuid REFERENCES problem_attempts(id) ON DELETE CASCADE,
    level      int NOT NULL CHECK (level BETWEEN 0 AND 6),
    content    text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notes (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic_id   uuid REFERENCES topics(id) ON DELETE SET NULL,
    problem_id uuid REFERENCES problems(id) ON DELETE SET NULL,
    content_md text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_attempts_user ON problem_attempts(user_id);
CREATE INDEX idx_attempts_problem ON problem_attempts(problem_id);
CREATE INDEX idx_mistakes_user ON mistakes(user_id);
CREATE INDEX idx_hints_user ON hints_used(user_id);
CREATE INDEX idx_notes_user ON notes(user_id);

-- +goose Down
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS hints_used;
DROP TABLE IF EXISTS mistakes;
DROP TABLE IF EXISTS problem_attempts;
DROP TABLE IF EXISTS problems;
