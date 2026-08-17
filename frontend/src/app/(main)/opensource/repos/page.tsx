"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, ExternalLink } from "lucide-react";

export default function ReposPage() {
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
            <CardTitle>GitHub Integration</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Connect your GitHub account to browse repositories, find beginner issues, and track your open source contributions.
            </p>
          </div>
          <Button variant="outline" size="sm" icon={<ExternalLink size={14} />}>
            Connect GitHub
          </Button>
        </div>
      </Card>
    </div>
  );
}
