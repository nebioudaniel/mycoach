const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

interface RequestInit extends globalThis.RequestInit {
  json?: unknown;
}

async function request<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  const { json, ...init } = opts;
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(json);
  }
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = (body as any)?.error ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────

export const auth = {
  register: (data: { email: string; password: string; displayName: string }) =>
    request("/api/auth/register", { method: "POST", json: data }),
  login: (data: { email: string; password: string }) =>
    request("/api/auth/login", { method: "POST", json: data }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/me"),
  updateProfile: (data: Record<string, unknown>) =>
    request("/api/me/profile", { method: "PUT", json: data }),
};

// ─── Generic CRUD ─────────────────────────────────────────────────────────

export function createResource<T>(base: string) {
  return {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<T[]>(`${base}${qs}`);
    },
    get: (id: string) => request<T>(`${base}/${id}`),
    create: (data: Record<string, unknown>) =>
      request<T>(base, { method: "POST", json: data }),
    update: (id: string, data: Record<string, unknown>) =>
      request<T>(`${base}/${id}`, { method: "PUT", json: data }),
    delete: (id: string) =>
      request<unknown>(`${base}/${id}`, { method: "DELETE" }),
  };
}

// ─── Endpoints (will be backed by Go API) ────────────────────────────────

export const topics = createResource<any>("/api/topics");
export const problems = createResource<any>("/api/problems");
export const sessions = createResource<any>("/api/sessions");
export const repositories = createResource<any>("/api/repositories");
export const issues = createResource<any>("/api/issues");
export const contributions = createResource<any>("/api/contributions");
export const journal = createResource<any>("/api/journal");

// ─── AI ───────────────────────────────────────────────────────────────────

export const ai = {
  hint: (attemptId: string, level: number) =>
    request<any>("/api/ai/hint", { method: "POST", json: { attemptId, level } }),
  review: (attemptId: string) =>
    request<any>("/api/ai/review", { method: "POST", json: { attemptId } }),
  coach: (kind: string, context: Record<string, unknown>) =>
    request<any>("/api/ai/coach", { method: "POST", json: { kind, ...context } }),
  sessionPlan: () => request<any>("/api/ai/session-plan", { method: "POST" }),
  repoOverview: (repoId: string) =>
    request<any>("/api/ai/repo-overview", { method: "POST", json: { repoId } }),
  issueAnalysis: (issueId: string) =>
    request<any>("/api/ai/issue-analysis", { method: "POST", json: { issueId } }),
};

// ─── GitHub ───────────────────────────────────────────────────────────────

export const github = {
  repos: () => request<any[]>("/api/github/repos"),
  issues: (owner: string, repo: string) =>
    request<any[]>(`/api/github/${owner}/${repo}/issues`),
  pullRequests: (owner: string, repo: string) =>
    request<any[]>(`/api/github/${owner}/${repo}/pulls`),
};
