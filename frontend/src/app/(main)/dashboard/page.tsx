"use client";

import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Brain,
  Code2,
  Flame,
  GitBranch,
  Clock,
  Trophy,
  BookOpen,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react";

const PLACEHOLDER_SESSION = [
  { kind: "review" as const, title: "Hash Maps", minutes: 10, status: "done" as const },
  { kind: "learn" as const, title: "Two Pointers", minutes: 20, status: "in_progress" as const },
  { kind: "practice" as const, title: "3 exercises", minutes: 30, status: "pending" as const },
  { kind: "leetcode" as const, title: "2 problems", minutes: 40, status: "pending" as const },
  { kind: "opensource" as const, title: "Investigate issue #123", minutes: 30, status: "pending" as const },
  { kind: "reflection" as const, title: "Log progress", minutes: 5, status: "pending" as const },
];

export default function DashboardPage() {
  const session = PLACEHOLDER_SESSION;
  const totalMin = session.reduce((s, i) => s + i.minutes, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Good morning</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Keep up the streak — you&apos;re on a 7-day run. Here&apos;s your plan for today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Topics mastered" value="3" icon={<Brain size={16} />} />
        <StatCard label="Problems solved" value="19" icon={<Code2 size={16} />} />
        <StatCard label="Current streak" value="7d" icon={<Flame size={16} />} />
        <StatCard label="Learning hours" value="42h" icon={<Clock size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's session */}
        <Card padding="lg" className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today&apos;s Session</CardTitle>
              <Badge variant="secondary">{totalMin} min</Badge>
            </div>
          </CardHeader>
          <div className="space-y-2">
            {session.map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                  item.status === "in_progress"
                    ? "border-border bg-accent"
                    : item.status === "done"
                      ? "border-border bg-muted/50"
                      : "border-border bg-background"
                }`}
              >
                <span className="text-xs font-mono text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.minutes} min</p>
                </div>
                <Badge variant={item.status === "done" ? "secondary" : item.status === "in_progress" ? "default" : "outline"}>
                  {item.status === "done" ? "Done" : item.status === "in_progress" ? "In progress" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button className="w-full" icon={<Zap size={14} />}>
              Start session
            </Button>
          </div>
        </Card>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Learning path progress */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Learning Path</CardTitle>
              <Link
                href="/dsa/path"
                className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors"
              >
                View path <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { name: "Hash Maps", progress: 90 },
                { name: "Two Pointers", progress: 45 },
                { name: "Binary Trees", progress: 10 },
                { name: "Graphs", progress: 0 },
              ].map((topic) => (
                <div key={topic.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm">{topic.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{topic.progress}%</span>
                  </div>
                  <Progress value={topic.progress} size="sm" />
                </div>
              ))}
            </div>
          </Card>

          {/* Weak areas & recent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Card padding="lg">
              <CardHeader>
                <CardTitle>Weak Areas</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                {[
                  { topic: "Sliding Window", mistakes: 3 },
                  { topic: "Tree Traversal", mistakes: 2 },
                  { topic: "Graph BFS", mistakes: 1 },
                ].map((w) => (
                  <div key={w.topic} className="flex items-center justify-between py-1.5">
                    <span className="text-sm">{w.topic}</span>
                    <Badge variant="destructive">{w.mistakes} mistakes</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                {[
                  { text: "Solved Two Sum", icon: <Trophy size={14} className="text-muted-foreground" /> },
                  { text: "Learned Hash Maps", icon: <BookOpen size={14} className="text-muted-foreground" /> },
                  { text: "Analyzed repo GoFrame", icon: <GitBranch size={14} className="text-muted-foreground" /> },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5">
                    {a.icon}
                    <span className="text-sm">{a.text}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Open source */}
          <Card padding="lg">
            <div className="flex items-center justify-between mb-3">
              <CardTitle>Open Source</CardTitle>
              <Link
                href="/opensource/repos"
                className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors"
              >
                Browse repos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} />
                <span>4 contributions</span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch size={14} />
                <span>2 pull requests</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
