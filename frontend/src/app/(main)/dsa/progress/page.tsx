"use client";

import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { Brain, Code2, Flame, Clock } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your mastery across all concepts and skills.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Mastered topics" value="3" icon={<Brain size={16} />} />
        <StatCard label="Solved problems" value="19" icon={<Code2 size={16} />} />
        <StatCard label="Current streak" value="7d" icon={<Flame size={16} />} />
        <StatCard label="Total hours" value="42h" icon={<Clock size={16} />} />
      </div>

      <Card padding="lg">
        <CardHeader><CardTitle>Topic Mastery</CardTitle></CardHeader>
        <div className="space-y-3">
          {[
            { name: "Arrays", mastery: 95 },
            { name: "Hash Maps", mastery: 60 },
            { name: "Strings", mastery: 67 },
            { name: "Two Pointers", mastery: 33 },
            { name: "Sliding Window", mastery: 20 },
            { name: "Linked Lists", mastery: 0 },
            { name: "Stacks & Queues", mastery: 0 },
            { name: "Binary Trees", mastery: 0 },
            { name: "Graphs", mastery: 0 },
            { name: "Dynamic Programming", mastery: 0 },
          ].map((t) => (
            <div key={t.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">{t.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">{t.mastery}%</span>
                  <ProgressRing value={t.mastery} size={28} stroke={3} />
                </div>
              </div>
              <Progress value={t.mastery} size="sm" />
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <CardHeader><CardTitle>Areas Needing Review</CardTitle></CardHeader>
        <div className="space-y-2">
          {[
            { topic: "Sliding Window", issue: "Struggled to recognize pattern", count: 3 },
            { topic: "Two Pointers", issue: "Edge case: empty arrays", count: 2 },
            { topic: "Hash Maps", issue: "Forgetting collision handling", count: 1 },
          ].map((w, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium">{w.topic}</p>
                <p className="text-xs text-muted-foreground">{w.issue}</p>
              </div>
              <Badge variant="destructive">{w.count} missed</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
