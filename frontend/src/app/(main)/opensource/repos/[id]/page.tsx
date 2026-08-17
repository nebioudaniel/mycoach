"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Repo = {
  id: string; fullName: string; owner: string; name: string; description: string;
  language: string; stars: number; isFork: boolean; htmlUrl: string; overview: Record<string, any>;
};

type Issue = {
  id: string; githubNumber: number; title: string; body: string;
  labels: { name: string }[]; state: string;
};

export default function RepoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params) as { id: string };
  const [repo, setRepo] = useState<Repo | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/github/repos/${id}`, { credentials: "include" }).then((r) => r.json()).catch(() => null),
      fetch(`/api/github/repos/${id}/issues`, { credentials: "include" }).then((r) => r.json()).catch(() => []),
    ]).then(([r, i]) => {
      setRepo(r);
      if (Array.isArray(i)) setIssues(i);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/opensource/repos" className="hover:text-foreground transition-colors">Repositories</Link>
          <span>/</span>
          <span>Not found</span>
        </div>
        <Card padding="lg">
          <p className="text-sm text-muted-foreground">Repository not found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/opensource/repos" className="hover:text-foreground transition-colors">Repositories</Link>
        <span>/</span>
        <span>{repo.name}</span>
      </div>

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight">{repo.name}</h1>
          {repo.language && <Badge variant="outline">{repo.language}</Badge>}
          {repo.isFork && <Badge variant="secondary">fork</Badge>}
        </div>
        {repo.description && <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>}
        <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-foreground mt-2 inline-flex items-center gap-1">
          View on GitHub ↗
        </a>
      </div>

      <Card padding="lg">
        <CardTitle>Open Issues ({issues.length})</CardTitle>
        <div className="space-y-2 mt-4">
          {issues.map((issue) => (
            <div key={issue.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
              <span className="text-xs font-mono text-muted-foreground mt-0.5">#{issue.githubNumber}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{issue.title}</p>
                {issue.body && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{issue.body}</p>
                )}
                <div className="flex gap-1.5 mt-1.5">
                  {(issue.labels || []).map((l, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{l.name}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {issues.length === 0 && (
            <p className="text-sm text-muted-foreground">No open issues found.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
