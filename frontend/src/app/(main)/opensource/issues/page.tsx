"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GitBranch, ExternalLink, ArrowRight } from "lucide-react";

type GhStatus = { connected: boolean; username: string };

export default function IssuesPage() {
  const [ghStatus, setGhStatus] = useState<GhStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/github/connected", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setGhStatus(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="h-24 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!ghStatus?.connected) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Issues</h1>
          <p className="text-sm text-muted-foreground mt-1">Find beginner-friendly issues to contribute to open source.</p>
        </div>
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <GitBranch size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle>Connect GitHub</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Connect your GitHub account to browse issues, analyze difficulty, and get AI-guided contribution workflows.
              </p>
            </div>
            <Button onClick={() => { window.location.href = "/api/auth/github"; }} icon={<ExternalLink size={14} />}>
              Connect GitHub
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Issues</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Select a repository to browse open issues.
        </p>
      </div>
      <Card padding="lg">
        <p className="text-sm text-muted-foreground mb-3">
          Go to your <Link href="/opensource/repos" className="text-foreground underline">repositories</Link> and select a repo to see its issues.
        </p>
        <Link href="/opensource/repos">
          <Button variant="outline" icon={<ArrowRight size={14} />}>Browse Repos</Button>
        </Link>
      </Card>
    </div>
  );
}
