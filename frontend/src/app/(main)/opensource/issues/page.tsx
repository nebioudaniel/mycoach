"use client";

import { useState } from "react";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const ISSUES = [
  { id: "1", number: 12847, title: "Fix flaky e2e test for deployment rollback", labels: ["good first issue", "test"], difficulty: "beginner", learningValue: 75, relevantTech: ["Go"] },
  { id: "2", number: 12851, title: "Add structured logging to admission controller", labels: ["help wanted"], difficulty: "intermediate", learningValue: 85, relevantTech: ["Go"] },
  { id: "3", number: 12863, title: "Migrate deprecated API calls in pkg/controller", labels: ["good first issue"], difficulty: "beginner", learningValue: 60, relevantTech: ["Go"] },
  { id: "4", number: 12871, title: "Implement rate limiter for webhook endpoints", labels: ["kind/feature"], difficulty: "advanced", learningValue: 90, relevantTech: ["Go"] },
  { id: "5", number: 12880, title: "Update RBAC documentation with new policy examples", labels: ["documentation"], difficulty: "beginner", learningValue: 40, relevantTech: ["docs"] },
];

export default function IssuesPage() {
  const [filter, setFilter] = useState("all");
  const filtered = ISSUES.filter((i) => {
    if (filter === "beginner") return i.difficulty === "beginner";
    if (filter === "intermediate") return i.difficulty === "intermediate";
    if (filter === "advanced") return i.difficulty === "advanced";
    if (filter === "good-first-issue") return i.labels.includes("good first issue");
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Issues</h1>
        <p className="text-sm text-muted-foreground mt-1">Issues matched to your skill level with estimated learning value.</p>
      </div>

      <div className="flex gap-1.5 p-1 bg-muted rounded-lg flex-wrap">
        {["all", "good-first-issue", "beginner", "intermediate", "advanced"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 h-8 text-xs font-medium rounded-md capitalize transition-all ${
              filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}>
            {f === "good-first-issue" ? "Good First Issue" : f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((issue) => (
          <Link key={issue.id} href={`/opensource/issues/${issue.id}`}>
            <Card padding="md" className="hover:border-border transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground font-mono">#{issue.number}</span>
                    <h3 className="text-sm font-medium truncate">{issue.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {issue.labels.map((label) => (
                      <Badge key={label} variant={label === "good first issue" ? "default" : "secondary"}>{label}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant="outline">{issue.difficulty}</Badge>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{issue.learningValue}% value</span>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Understand issue <ArrowRight size={12} />
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
