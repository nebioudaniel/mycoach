# mycoach

An **AI Software Engineer Coach** — a personal learning platform for self-taught developers
practicing **data structures & algorithms** and **open-source contributions**. The AI acts as a
mentor and coach inside structured workflows — it never solves problems for you.

![architecture](https://img.shields.io/badge/architecture-frontend%20%7C%20go%20api%20%7C%20fastapi%20%7C%20postgres-0f172a)

## Architecture

```
Frontend (Next.js / React / TS)
   │  HTTP + httpOnly session cookie
   ▼
Go API (backend/)                 ── auth, progress, DSA, GitHub proxy
   │  HTTP (shared key)
   ▼
FastAPI AI Service (ai-service/)  ── coaching, hints, reviews, session plans
   │
   ▼
LLM provider (OpenAI-compatible)
   ▲
PostgreSQL (Neon)
```

## Monorepo layout

```
mycoach/
├── backend/       Go API (chi + pgx + goose migrations)
├── ai-service/    Python FastAPI service (LLM provider abstraction)
├── frontend/      Next.js app (App Router, Tailwind, TanStack Query)
├── migrations/    SQL migrations (embedded into the Go API)
├── .env.example   All required environment variables
└── README.md
```

## Getting started

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (Neon), `JWT_SECRET`, `AI_API_KEY`.
2. Start the API, AI service and frontend (see each folder's README).

## Development workflow

- `backend/` — `go run ./cmd/server` (runs migrations automatically on start)
- `ai-service/` — `uvicorn app.main:app --reload`
- `frontend/` — `npm run dev`

## Principles

- The AI is a **coach**, not an answer machine (progressive hints, structured reviews).
- Every feature must persist progress and be represented with real UI, not a chat box.
- Token-efficient by design: only relevant repository content is ever sent to the model.
- GitHub write actions (push / PR) always require explicit confirmation and a dry-run preview.
