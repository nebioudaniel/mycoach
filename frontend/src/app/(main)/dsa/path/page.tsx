"use client";

import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Check, Circle, ArrowRight } from "lucide-react";

const PATH = [
  { slug: "programming-fundamentals", title: "Programming Fundamentals", status: "mastered" as const, mastery: 100 },
  { slug: "big-o", title: "Big O Notation", status: "mastered" as const, mastery: 100 },
  { slug: "arrays", title: "Arrays", status: "mastered" as const, mastery: 100 },
  { slug: "strings", title: "Strings", status: "learning" as const, mastery: 75 },
  { slug: "hash-maps", title: "Hash Maps", status: "learning" as const, mastery: 60 },
  { slug: "linked-lists", title: "Linked Lists", status: "not_started" as const, mastery: 0 },
  { slug: "stacks-queues", title: "Stacks & Queues", status: "not_started" as const, mastery: 0 },
  { slug: "trees", title: "Trees", status: "not_started" as const, mastery: 0 },
  { slug: "graphs", title: "Graphs", status: "not_started" as const, mastery: 0 },
  { slug: "sorting", title: "Sorting Algorithms", status: "not_started" as const, mastery: 0 },
  { slug: "searching", title: "Searching", status: "not_started" as const, mastery: 0 },
  { slug: "recursion", title: "Recursion", status: "not_started" as const, mastery: 0 },
  { slug: "dynamic-programming", title: "Dynamic Programming", status: "not_started" as const, mastery: 0 },
];

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
  const mastered = PATH.filter((t) => t.status === "mastered").length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Learning Path</h1>
        <p className="text-sm text-muted-foreground mt-1">
          A structured progression from fundamentals to advanced topics.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={mastered} max={PATH.length} className="max-w-xs" size="sm" />
          <span className="text-xs text-muted-foreground tabular-nums">
            {mastered}/{PATH.length} mastered
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[17px] top-6 bottom-6 w-px bg-border" />
        <div className="space-y-1">
          {PATH.map((topic) => {
            const s = statusIcon[topic.status];
            const Icon = s.icon;
            const badge = statusBadge[topic.status];
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
    </div>
  );
}
