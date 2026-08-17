"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Check, Circle, ArrowRight } from "lucide-react";

type Topic = {
  id: string; slug: string; title: string; difficulty: string; position: number;
  status: string; mastery: number;
};

const statusIcon: Record<string, { icon: typeof Check; cls: string; ring: string }> = {
  mastered: { icon: Check, cls: "bg-primary text-primary-foreground", ring: "ring-0" },
  learning: { icon: ArrowRight, cls: "bg-muted text-foreground", ring: "ring-2 ring-border" },
  not_started: { icon: Circle, cls: "bg-muted text-muted-foreground", ring: "ring-0" },
};

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  mastered: { label: "Mastered", variant: "default" },
  learning: { label: "In progress", variant: "secondary" },
  not_started: { label: "Not started", variant: "outline" },
};

export default function LearningPathPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setTopics(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const mastered = topics.filter((t) => t.status === "mastered").length;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Learning Path</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A structured progression from fundamentals to advanced topics.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={mastered} max={topics.length} className="max-w-xs" size="sm" />
          <span className="text-xs text-muted-foreground tabular-nums">
            {mastered}/{topics.length} mastered
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[17px] top-6 bottom-6 w-px bg-border" />
        <div className="space-y-1">
          {topics.map((topic) => {
            const s = statusIcon[topic.status] || statusIcon.not_started;
            const Icon = s.icon;
            const badge = statusBadge[topic.status] || statusBadge.not_started;
            return (
              <Link key={topic.slug} href={`/dsa/topics/${topic.slug}`}>
                <div className="relative flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-accent transition-colors group">
                  <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${s.cls} ${s.ring}`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{topic.title}</span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    {topic.mastery > 0 && topic.mastery < 100 && (
                      <div className="mt-1.5 max-w-xs">
                        <Progress value={topic.mastery} size="sm" />
                      </div>
                    )}
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {topics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No topics available yet.</p>
        </div>
      )}
    </div>
  );
}
