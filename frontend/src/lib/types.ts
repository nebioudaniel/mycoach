// ─── User & Auth ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface Profile {
  userId: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  timezone: string;
  goals: string[];
  languages: string[];
  onboardingDone: boolean;
}

export interface AuthPayload {
  user: User;
  profile: Profile;
  expiresAt: string;
}

// ─── Learning ─────────────────────────────────────────────────────────────

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  position: number;
}

export interface Topic {
  id: string;
  pathId: string | null;
  slug: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  content: TopicContent;
  position: number;
}

export interface TopicContent {
  what?: string;
  why?: string;
  mentalModel?: string;
  visual?: string;
  examples?: string[];
  complexity?: { [key: string]: string };
  tryIt?: string[];
  checkUnderstanding?: string[];
  resources?: string[];
}

export interface TopicProgress {
  topicId: string;
  status: "not_started" | "learning" | "mastered" | "review";
  mastery: number;
}

// ─── Problems ─────────────────────────────────────────────────────────────

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  topics: string[];
  descriptionMd: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraintsMd: string;
  starterCode: Record<string, string>;
  source: "manual" | "leetcode";
}

export interface ProblemAttempt {
  id: string;
  problemId: string;
  language: string;
  code: string;
  status: "attempted" | "solved" | "failed" | "partial";
  correctness: boolean | null;
  timeComplexity: string;
  spaceComplexity: string;
  maxHintLevel: number;
  review: CodeReviewResult;
  notes: string;
  createdAt: string;
}

export interface CodeReviewResult {
  correctness?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  wellDone?: string[];
  issues?: string[];
  conceptToReview?: string;
  betterApproach?: string;
  nextExercise?: string;
}

// ─── Sessions ─────────────────────────────────────────────────────────────

export interface DailySession {
  id: string;
  date: string;
  plan: SessionItem[];
  status: "planned" | "in_progress" | "completed";
  startedAt: string | null;
  completedAt: string | null;
}

export interface SessionItem {
  kind: "review" | "learn" | "practice" | "leetcode" | "opensource" | "reflection";
  title: string;
  minutes: number;
  status: "pending" | "in_progress" | "done" | "skipped";
  topicId?: string;
}

// ─── Open Source ──────────────────────────────────────────────────────────

export interface Repository {
  id: string;
  fullName: string;
  owner: string;
  name: string;
  defaultBranch: string;
  description: string;
  language: string;
  stars: number;
  isFork: boolean;
  sizeKb: number;
  htmlUrl: string;
  overview: Record<string, unknown>;
  overviewStatus: "pending" | "processing" | "ready" | "failed";
}

export interface Issue {
  id: string;
  repoId: string;
  githubNumber: number;
  title: string;
  body: string;
  labels: { name: string; color: string }[];
  state: string;
  difficultyEstimate: string;
  learningValue: number;
  relevantTech: string[];
  analysis: Record<string, unknown>;
}

export interface Contribution {
  id: string;
  repoId: string;
  issueId: string | null;
  stage:
    | "understand"
    | "investigate"
    | "plan"
    | "implement"
    | "test"
    | "review"
    | "commit"
    | "push"
    | "pull_request";
  branch: string;
  prNumber: number | null;
  prUrl: string;
  status: "active" | "merged" | "closed" | "abandoned";
}

// ─── Journal ──────────────────────────────────────────────────────────────

export interface JournalEntry {
  id: string;
  date: string;
  entries: {
    learned?: string[];
    struggled?: string[];
    solved?: string[];
    opensource?: string[];
  };
  recommendation: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  topicsMastered: number;
  topicsLearning: number;
  problemsAttempted: number;
  problemsSolved: number;
  currentStreak: number;
  weakConcepts: string[];
  recentMistakes: { description: string; topic: string; date: string }[];
  contributions: number;
  prs: number;
  learningHours: number;
}
