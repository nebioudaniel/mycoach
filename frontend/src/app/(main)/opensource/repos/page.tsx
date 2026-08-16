"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRight, GitBranch, Star, GitFork, Search, Plus, ExternalLink } from "lucide-react";

const REPOS = [
  { id: "1", fullName: "kubernetes/kubernetes", description: "Production-Grade Container Scheduling", language: "Go", stars: 112000, forks: 40000, beginnerIssues: 120, matchScore: 92 },
  { id: "2", fullName: "grafana/grafana", description: "Observability and data visualization platform", language: "Go", stars: 68000, forks: 12000, beginnerIssues: 85, matchScore: 88 },
  { id: "3", fullName: "fastapi/fastapi", description: "High performance Python web framework", language: "Python", stars: 82000, forks: 7000, beginnerIssues: 45, matchScore: 85 },
];

export default function ReposPage() {
  const [search, setSearch] = useState("");
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Repositories</h1>
          <p className="text-sm text-muted-foreground mt-1">Explore open-source projects matched to your skill level.</p>
        </div>
        <Button variant="outline" size="sm" icon={<Plus size={14} />}>Add repo</Button>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories or paste a GitHub URL..."
          className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
      </div>

      <div className="space-y-3">
        {REPOS.map((repo) => (
          <Link key={repo.id} href={`/opensource/repos/${repo.id}`}>
            <Card padding="lg" className="hover:border-border transition-colors group">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <GitBranch size={14} className="text-muted-foreground shrink-0" />
                    <h3 className="text-sm font-medium truncate">{repo.fullName}</h3>
                    <ExternalLink size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{repo.description}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">{repo.language}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Star size={10} /> {(repo.stars / 1000).toFixed(0)}k</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><GitFork size={10} /> {(repo.forks / 1000).toFixed(0)}k</span>
                    <Badge variant="secondary">{repo.beginnerIssues} beginner issues</Badge>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs text-muted-foreground">Match</span>
                    <Badge variant="default">{repo.matchScore}%</Badge>
                  </div>
                  <Progress value={repo.matchScore} size="sm" className="w-20" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
