"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TOPICS = [
  { slug: "arrays", title: "Arrays", difficulty: "beginner", problems: 8, solved: 6, mastery: 75 },
  { slug: "strings", title: "Strings", difficulty: "beginner", problems: 6, solved: 4, mastery: 67 },
  { slug: "hash-maps", title: "Hash Maps", difficulty: "beginner", problems: 10, solved: 6, mastery: 60 },
  { slug: "two-pointers", title: "Two Pointers", difficulty: "intermediate", problems: 6, solved: 2, mastery: 33 },
  { slug: "sliding-window", title: "Sliding Window", difficulty: "intermediate", problems: 5, solved: 1, mastery: 20 },
  { slug: "linked-lists", title: "Linked Lists", difficulty: "intermediate", problems: 7, solved: 0, mastery: 0 },
  { slug: "stacks-queues", title: "Stacks & Queues", difficulty: "intermediate", problems: 6, solved: 0, mastery: 0 },
  { slug: "binary-trees", title: "Binary Trees", difficulty: "intermediate", problems: 8, solved: 0, mastery: 0 },
  { slug: "graphs", title: "Graphs", difficulty: "advanced", problems: 8, solved: 0, mastery: 0 },
  { slug: "dynamic-programming", title: "Dynamic Programming", difficulty: "advanced", problems: 10, solved: 0, mastery: 0 },
];

export default function TopicsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Topics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep-dive into individual concepts with structured learning.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TOPICS.map((t) => (
          <Link key={t.slug} href={`/dsa/topics/${t.slug}`}>
            <Card padding="md" className="group hover:border-border transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium">{t.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{t.difficulty}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {t.solved}/{t.problems}
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="mt-3">
                <Progress value={t.mastery} size="sm" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
