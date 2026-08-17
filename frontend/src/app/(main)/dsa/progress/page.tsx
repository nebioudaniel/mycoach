"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Brain, Code2, Flame, Clock } from "lucide-react";

type Stats = {
  topicsMastered: number; topicsLearning: number;
  problemsAttempted: number; problemsSolved: number;
  currentStreak: number; learningHours: number;
  weakConcepts: string[];
  recentMistakes: { description: string; topic: string; date: string }[];
};

type Topic = { id: string; title: string; status: string; mastery: number };

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats", { credentials: "include" }).then((r) => r.json()).catch(() => ({})),
      fetch("/api/topics", { credentials: "include" }).then((r) => r.json()).catch(() => []),
    ]).then(([s, t]) => {
      setStats(s);
      setTopics(t);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  const s = stats || { topicsMastered: 0, topicsLearning: 0, problemsAttempted: 0, problemsSolved: 0, currentStreak: 0, learningHours: 0, weakConcepts: [], recentMistakes: [] };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your mastery across all concepts and skills.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Mastered topics" value={String(s.topicsMastered)} icon={<Brain size={16} />} />
        <StatCard label="Solved problems" value={String(s.problemsSolved)} icon={<Code2 size={16} />} />
        <StatCard label="Current streak" value={`${s.currentStreak}d`} icon={<Flame size={16} />} />
        <StatCard label="Total hours" value={`${Math.round(s.learningHours)}h`} icon={<Clock size={16} />} />
      </div>

      <Card padding="lg">
        <CardHeader><CardTitle>Topic Mastery</CardTitle></CardHeader>
        <div className="space-y-3">
          {topics.map((t) => (
            <div key={t.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">{t.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">{t.mastery}%</span>
                  <ProgressRing value={t.mastery} size={28} stroke={3} />
                </div>
              </div>
              <Progress value={t.mastery} size="sm" />
            </div>
          ))}
          {topics.length === 0 && <p className="text-sm text-muted-foreground">Start learning to see your progress here.</p>}
        </div>
      </Card>

      {s.weakConcepts && s.weakConcepts.length > 0 && (
        <Card padding="lg">
          <CardHeader><CardTitle>Areas Needing Review</CardTitle></CardHeader>
          <div className="space-y-2">
            {s.weakConcepts.map((topic, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm font-medium">{topic}</span>
                <Badge variant="destructive">Review</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
