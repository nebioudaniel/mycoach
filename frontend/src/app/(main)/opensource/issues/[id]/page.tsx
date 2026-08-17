"use client";

import React from "react";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ExternalLink, BookOpen, ArrowRight } from "lucide-react";

export default function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params) as { id: string };
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link href="/opensource/issues" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} /> Issues
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-muted-foreground font-mono">#12847</span>
          <Badge variant="outline">beginner</Badge>
          <Badge variant="secondary">good first issue</Badge>
        </div>
        <h1 className="text-lg font-semibold tracking-tight">Fix flaky e2e test for deployment rollback</h1>
      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-muted-foreground" />
            <CardTitle>Issue Understanding</CardTitle>
          </div>
          <Badge variant="secondary">AI-guided</Badge>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium uppercase tracking-wide text-xs text-muted-foreground mb-1">What is the problem?</h4>
            <p className="text-muted-foreground">An end-to-end test for deployment rollback is failing intermittently in CI, causing false negatives.</p>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wide text-xs text-muted-foreground mb-1">Why does it matter?</h4>
            <p className="text-muted-foreground">Flaky tests erode confidence in the CI pipeline and waste developer time.</p>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wide text-xs text-muted-foreground mb-1">What should change?</h4>
            <p className="text-muted-foreground">The test needs to be made deterministic — likely by adding proper wait conditions instead of fixed timeouts.</p>
          </div>
          <div>
            <h4 className="font-medium uppercase tracking-wide text-xs text-muted-foreground mb-1">Suggested investigation</h4>
            <pre className="bg-muted border border-border rounded-lg p-3 text-xs overflow-x-auto text-muted-foreground">
{`1. Find the failing test: grep -r "rollback" test/e2e/
2. Read the test to understand expectations
3. Check for time.Sleep() vs condition waits
4. Look at how other e2e tests handle async
5. Implement proper wait with Eventually/polling`}
            </pre>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <CardHeader><CardTitle>Contribution Workflow</CardTitle></CardHeader>
        <div className="flex items-center gap-1 flex-wrap">
          {["Understand", "Investigate", "Plan", "Implement", "Test", "Review", "PR"].map((stage, i) => (
            <div key={stage} className="flex items-center">
              <div className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>{stage}</div>
              {i < 6 && <span className="text-muted-foreground mx-0.5">→</span>}
            </div>
          ))}
        </div>
      </Card>

      <div className="flex gap-2">
        <Button icon={<ArrowRight size={14} />}>Start investigation</Button>
        <Button variant="outline" icon={<ExternalLink size={14} />}>View on GitHub</Button>
      </div>
    </div>
  );
}
