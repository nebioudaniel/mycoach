"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Code2, Flame, Clock, Trophy, BookOpen, ArrowRight, Zap } from "lucide-react";

type Stats = {
  topicsMastered: number; problemsSolved: number;
  currentStreak: number; learningHours: number;
  weakConcepts: string[];
};

type Topic = { id: string; title: string; slug: string; status: string; mastery: number };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats", { credentials: "include" }).then((r) => r.json()).catch(() => ({})),
      fetch("/api/topics", { credentials: "include" }).then((r) => r.json()).catch(() => []),
    ]).then(([s, t]) => {
      setStats(s);
      setTopics(t.slice(0, 6));
    }).finally(() => setLoading(false));
  }, []);

  const s = stats || { topicsMastered: 0, problemsSolved: 0, currentStreak: 0, learningHours: 0, weakConcepts: [] };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{greeting}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {s.currentStreak > 0
            ? `You're on a ${s.currentStreak}-day streak. Keep it going!`
            : "Start a learning session to build your streak."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Topics mastered" value={String(s.topicsMastered)} icon={<Brain size={16} />} />
        <StatCard label="Problems solved" value={String(s.problemsSolved)} icon={<Code2 size={16} />} />
        <StatCard label="Current streak" value={`${s.currentStreak}d`} icon={<Flame size={16} />} />
        <StatCard label="Learning hours" value={`${Math.round(s.learningHours)}h`} icon={<Clock size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Learning Path</CardTitle>
            <Link href="/dsa/path" className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors">
              View path <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {topics.map((topic) => (
              <div key={topic.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <Link href={`/dsa/topics/${topic.slug}`} className="text-sm hover:text-foreground transition-colors">{topic.title}</Link>
                  <span className="text-xs text-muted-foreground tabular-nums">{topic.mastery}%</span>
                </div>
                <Progress value={topic.mastery} size="sm" />
              </div>
            ))}
            {topics.length === 0 && <p className="text-sm text-muted-foreground">No topics started yet.</p>}
          </div>
        </Card>

        <div className="space-y-5">
          <Card padding="lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/dsa/topics">
                <Button variant="outline" className="w-full justify-start" icon={<BookOpen size={14} />}>
                  Learn
                </Button>
              </Link>
              <Link href="/dsa/practice">
                <Button variant="outline" className="w-full justify-start" icon={<Code2 size={14} />}>
                  Practice
                </Button>
              </Link>
              <Link href="/dsa/progress">
                <Button variant="outline" className="w-full justify-start" icon={<Trophy size={14} />}>
                  Progress
                </Button>
              </Link>
              <Link href="/journal">
                <Button variant="outline" className="w-full justify-start" icon={<Zap size={14} />}>
                  Journal
                </Button>
              </Link>
            </div>
          </Card>

          {s.weakConcepts && s.weakConcepts.length > 0 && (
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Weak Areas</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                {s.weakConcepts.map((topic, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className="text-sm">{topic}</span>
                    <Badge variant="destructive">Review</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
