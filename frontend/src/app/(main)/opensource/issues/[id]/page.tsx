"use client";

import React from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";

export default function IssueDetailPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/opensource/issues" className="hover:text-foreground transition-colors">Issues</Link>
        <span>/</span>
        <span>Issue</span>
      </div>
      <Card padding="lg">
        <CardTitle>GitHub Integration Required</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Connect your GitHub account to see issue details, AI-guided analysis, and contribution workflows.
        </p>
      </Card>
    </div>
  );
}
