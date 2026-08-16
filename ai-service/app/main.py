"""mycoach AI Service — FastAPI application."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, Security, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .llm import chat, chat_json
from .prompts import (
    COACH_SYSTEM,
    HINT_SYSTEM,
    REVIEW_SYSTEM,
    SESSION_PLAN_SYSTEM,
    REPO_OVERVIEW_SYSTEM,
    ISSUE_ANALYSIS_SYSTEM,
)
from .schemas import (
    HintRequest,
    HintResponse,
    ReviewRequest,
    ReviewResponse,
    CoachRequest,
    CoachResponse,
    SessionPlanRequest,
    SessionPlanResponse,
    RepoOverviewRequest,
    RepoOverviewResponse,
    IssueAnalysisRequest,
    IssueAnalysisResponse,
)

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("mycoach-ai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("AI service starting (model=%s)", settings.ai_model)
    yield
    log.info("AI service shutting down")


app = FastAPI(
    title="mycoach AI Service",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Auth ──────────────────────────────────────────────────────────────────

async def verify_key(x_ai_service_key: str = Header("")) -> None:
    """Verify the shared key sent by the Go API."""
    if not settings.ai_service_shared_key:
        return  # no key configured → skip check (dev mode)
    if x_ai_service_key != settings.ai_service_shared_key:
        raise HTTPException(status_code=401, detail="invalid AI service key")


# ─── Health ────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "mycoach-ai", "model": settings.ai_model}


# ─── Hint ──────────────────────────────────────────────────────────────────

@app.post("/hint", response_model=HintResponse, dependencies=[Depends(verify_key)])
async def get_hint(req: HintRequest):
    user_msg = f"""Problem: {req.problem_title}
Description: {req.problem_description}
Topic: {req.topic}
User code so far:
```
{req.user_code or '(no code submitted)'}
```
User reasoning: {req.user_reasoning or '(none provided)'}

Give a hint at level {req.level} (1=small nudge, 5=walk-through)."""
    try:
        content, _ = await chat(HINT_SYSTEM, user_msg, temperature=0.3, max_tokens=512)
        return HintResponse(hint=content.strip(), level=req.level)
    except Exception as e:
        log.error("hint failed: %s", e)
        raise HTTPException(500, "failed to generate hint")


# ─── Review ────────────────────────────────────────────────────────────────

@app.post("/review", response_model=ReviewResponse, dependencies=[Depends(verify_key)])
async def review_code(req: ReviewRequest):
    user_msg = f"""Problem: {req.problem_title}
Description: {req.problem_description}
Language: {req.language}

Submitted code:
```{req.language}
{req.user_code}
```

Review this solution for correctness, complexity, and style."""
    try:
        parsed, _ = await chat_json(REVIEW_SYSTEM, user_msg, temperature=0.2)
        return ReviewResponse(**{
            k: v for k, v in parsed.items()
            if k in ReviewResponse.model_fields
        })
    except Exception as e:
        log.error("review failed: %s", e)
        raise HTTPException(500, "failed to generate review")


# ─── Coach ─────────────────────────────────────────────────────────────────

@app.post("/coach", response_model=CoachResponse, dependencies=[Depends(verify_key)])
async def coach(req: CoachRequest):
    user_msg = f"""User request kind: {req.kind}
Topic: {req.topic}
Message: {req.message}

Additional context: {req.context}"""
    try:
        content, _ = await chat(COACH_SYSTEM, user_msg, temperature=0.5)
        return CoachResponse(response=content.strip(), kind=req.kind)
    except Exception as e:
        log.error("coach failed: %s", e)
        raise HTTPException(500, "coach request failed")


# ─── Session plan ──────────────────────────────────────────────────────────

@app.post("/session-plan", response_model=SessionPlanResponse, dependencies=[Depends(verify_key)])
async def session_plan(req: SessionPlanRequest):
    user_msg = f"""Learner profile:
- Skill level: {req.skill_level}
- Languages: {', '.join(req.languages)}
- Weak topics: {', '.join(req.weak_topics) or 'none identified'}
- Recent mistakes: {', '.join(req.recent_mistakes) or 'none'}
- Problems solved recently: {req.recent_problems_solved}
- Goals: {', '.join(req.goals) or 'general improvement'}
- Available time: {req.available_minutes} minutes

Create a balanced daily learning session."""
    try:
        parsed, _ = await chat_json(SESSION_PLAN_SYSTEM, user_msg, temperature=0.4)
        return SessionPlanResponse(**{
            k: v for k, v in parsed.items()
            if k in SessionPlanResponse.model_fields
        })
    except Exception as e:
        log.error("session plan failed: %s", e)
        raise HTTPException(500, "failed to generate session plan")


# ─── Repo overview ─────────────────────────────────────────────────────────

@app.post("/repo-overview", response_model=RepoOverviewResponse, dependencies=[Depends(verify_key)])
async def repo_overview(req: RepoOverviewRequest):
    user_msg = f"""Repository: {req.repo_name}

README:
{req.readme_content[:3000] or '(not provided)'}

CONTRIBUTING.md:
{req.contributing_md[:2000] or '(not provided)'}

Languages: {req.languages}

File tree:
{req.file_tree[:2000] or '(not provided)'}

Project metadata:
{req.project_metadata[:1000] or '(not provided)'}

Generate a structured project overview for a beginner contributor."""
    try:
        parsed, _ = await chat_json(REPO_OVERVIEW_SYSTEM, user_msg, temperature=0.3)
        return RepoOverviewResponse(**{
            k: v for k, v in parsed.items()
            if k in RepoOverviewResponse.model_fields
        })
    except Exception as e:
        log.error("repo overview failed: %s", e)
        raise HTTPException(500, "failed to generate overview")


# ─── Issue analysis ────────────────────────────────────────────────────────

@app.post("/issue-analysis", response_model=IssueAnalysisResponse, dependencies=[Depends(verify_key)])
async def issue_analysis(req: IssueAnalysisRequest):
    user_msg = f"""Repository: {req.repo_name}
User skill level: {req.user_skill_level}

Issue #{req.issue_title}:
{req.issue_body[:3000] or '(no description)'}

Repository overview:
{req.repo_overview[:2000] or '(not available)'}

Analyze this issue and create an investigation plan for a {req.user_skill_level} developer."""
    try:
        parsed, _ = await chat_json(ISSUE_ANALYSIS_SYSTEM, user_msg, temperature=0.3)
        return IssueAnalysisResponse(**{
            k: v for k, v in parsed.items()
            if k in IssueAnalysisResponse.model_fields
        })
    except Exception as e:
        log.error("issue analysis failed: %s", e)
        raise HTTPException(500, "failed to analyze issue")
