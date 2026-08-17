"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GitBranch, ExternalLink, Star, ArrowRight } from "lucide-react";

type Repo = {
  id: string; fullName: string; owner: string; name: string; description: string;
  language: string; stars: number; isFork: boolean; htmlUrl: string;
};

type GhStatus = { connected: boolean; username: string };

export default function ReposPage() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [ghStatus, setGhStatus] = useState<GhStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/github/connected", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setGhStatus(d);
        if (d.connected) {
          return fetch("/api/github/repos", { credentials: "include" }).then((r) => r.json());
        }
        return [];
      })
      .then((d) => { if (Array.isArray(d)) setRepos(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async () => {
    const res = await fetch("/api/auth/github", { credentials: "include", redirect: "manual" });
    // The API redirects to GitHub, so we need to follow it
    window.location.href = "/api/auth/github";
  };

  const filtered = repos.filter((r) =>
    !search || r.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="h-24 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!ghStatus?.connected) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Repositories</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect your GitHub account to discover beginner-friendly repos.</p>
        </div>
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <GitBranch size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle>Connect GitHub</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Link your GitHub account to browse your repos, find beginner issues, and track contributions.
              </p>
            </div>
            <Button onClick={handleConnect} icon={<ExternalLink size={14} />}>
              Connect GitHub
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Repositories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connected as <span className="font-medium text-foreground">{ghStatus.username}</span> · {repos.length} repos
          </p>
        </div>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search repos..."
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />

      <div className="space-y-2">
        {filtered.map((repo) => (
          <Link key={repo.id} href={`/opensource/repos/${repo.id}`}>
            <Card padding="md" className="flex items-center gap-4 hover:border-border transition-colors group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{repo.name}</span>
                  {repo.language && <Badge variant="outline">{repo.language}</Badge>}
                  {repo.isFork && <Badge variant="secondary">fork</Badge>}
                </div>
                {repo.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{repo.description}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star size={12} /> {repo.stars}
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">
            {search ? "No repos match your search." : "No repos found."}
          </p>
        </div>
      )}
    </div>
  );
}
