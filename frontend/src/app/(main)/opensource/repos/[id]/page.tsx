"use client";

import React from "react";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, GitBranch, FileText, ExternalLink, FolderOpen, BookOpen } from "lucide-react";

export default function RepoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params) as { id: string };
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link href="/opensource/repos" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} /> Repositories
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-muted-foreground" />
            <h1 className="text-lg font-semibold tracking-tight">kubernetes/kubernetes</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Production-Grade Container Scheduling and Management</p>
        </div>
        <Badge variant="default">Match: 92%</Badge>
      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-muted-foreground" />
            <CardTitle>Project Overview</CardTitle>
          </div>
          <Badge variant="secondary">AI-generated</Badge>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium uppercase tracking-wide text-xs text-muted-foreground mb-1">What this project does</h4>
            <p className="text-muted-foreground">Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.</p>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wide text-xs text-muted-foreground mb-1">Tech stack</h4>
            <div className="flex gap-2">{["Go", "Protocol Buffers", "Bazel", "Docker"].map((t) => <Badge key={t} variant="outline">{t}</Badge>)}</div>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wide text-xs text-muted-foreground mb-1">Architecture</h4>
            <pre className="bg-muted border border-border rounded-lg p-3 text-xs overflow-x-auto">
{`API Server (kube-apiserver) → Controller Manager → Scheduler → Kubelet → Container Runtime`}
            </pre>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wide text-xs text-muted-foreground mb-1">Where a beginner should start</h4>
            <ul className="text-muted-foreground space-y-1">
              <li className="flex items-start gap-2"><span className="mt-0.5">1.</span> Read the CONTRIBUTING.md and developer guide</li>
              <li className="flex items-start gap-2"><span className="mt-0.5">2.</span> Look for issues labeled &quot;good first issue&quot;</li>
              <li className="flex items-start gap-2"><span className="mt-0.5">3.</span> Start with documentation or test improvements</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/opensource/issues">
          <Card padding="md" className="hover:border-border transition-colors group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-muted-foreground" />
                <div><h3 className="text-sm font-medium">Browse Issues</h3><p className="text-xs text-muted-foreground">2,400 open</p></div>
              </div>
              <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Card>
        </Link>
        <Card padding="md" className="hover:border-border transition-colors group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderOpen size={18} className="text-muted-foreground" />
              <div><h3 className="text-sm font-medium">Explore Code</h3><p className="text-xs text-muted-foreground">Browse structure</p></div>
            </div>
            <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Card>
      </div>
    </div>
  );
}
