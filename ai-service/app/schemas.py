"""Request and response schemas for the AI service."""
from __future__ import annotations
from pydantic import BaseModel, Field


class HintRequest(BaseModel):
    problem_title: str = ""
    problem_description: str = ""
    user_code: str = ""
    user_reasoning: str = ""
    topic: str = ""
    level: int = Field(1, ge=1, le=5)


class HintResponse(BaseModel):
    hint: str
    level: int


class ReviewRequest(BaseModel):
    problem_title: str = ""
    problem_description: str = ""
    user_code: str = ""
    language: str = "python"
    expected_output: str = ""


class ReviewResponse(BaseModel):
    correctness: str = "unknown"
    time_complexity: str = ""
    space_complexity: str = ""
    well_done: list[str] = []
    issues: list[str] = []
    concept_to_review: str = ""
    better_approach: str = ""
    next_exercise: str = ""


class CoachRequest(BaseModel):
    kind: str = "general"  # general, hint, concept, approach, review
    message: str = ""
    topic: str = ""
    context: dict = {}
    hint_level: int = 0


class CoachResponse(BaseModel):
    response: str
    kind: str


class SessionPlanRequest(BaseModel):
    skill_level: str = "beginner"
    languages: list[str] = ["Go", "Python"]
    weak_topics: list[str] = []
    recent_mistakes: list[str] = []
    recent_problems_solved: int = 0
    goals: list[str] = []
    available_minutes: int = 90


class SessionPlanResponse(BaseModel):
    plan: list[dict]
    total_minutes: int
    rationale: str


class RepoOverviewRequest(BaseModel):
    repo_name: str = ""
    readme_content: str = ""
    contributing_md: str = ""
    languages: dict = {}
    file_tree: str = ""
    project_metadata: str = ""


class RepoOverviewResponse(BaseModel):
    what_it_does: str = ""
    tech_stack: list[str] = []
    architecture: str = ""
    important_directories: list[dict] = []
    how_to_run: str = ""
    how_to_contribute: str = ""
    beginner_entry_points: list[str] = []
    important_conventions: list[str] = []


class IssueAnalysisRequest(BaseModel):
    issue_title: str = ""
    issue_body: str = ""
    repo_name: str = ""
    repo_overview: str = ""
    user_skill_level: str = "beginner"


class IssueAnalysisResponse(BaseModel):
    what_is_the_problem: str = ""
    why_it_matters: str = ""
    what_should_change: str = ""
    prerequisites: list[str] = []
    relevant_project_concepts: list[str] = []
    likely_relevant_files: list[str] = []
    investigation_steps: list[str] = []
    implementation_approach: str = ""
    testing_plan: str = ""
    learning_value: int = 0
