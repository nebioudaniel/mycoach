"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Topic = {
  id: string; slug: string; title: string; difficulty: string; position: number;
  status: string; mastery: number;
};

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setTopics(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Topics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep-dive into individual concepts with structured learning.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {topics.map((t) => (
          <Link key={t.slug} href={`/dsa/topics/${t.slug}`}>
            <Card padding="md" className="group hover:border-border transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium">{t.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{t.difficulty}</Badge>
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
      {topics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No topics available yet.</p>
        </div>
      )}
    </div>
  );
}
