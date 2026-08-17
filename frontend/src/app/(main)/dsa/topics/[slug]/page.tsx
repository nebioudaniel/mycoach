"use client";

import React, { useEffect, useState } from "react";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb, Target, Zap, Brain, CheckCircle2 } from "lucide-react";

type TopicContent = {
  what?: string; why?: string; mentalModel?: string; visual?: string;
  examples?: string[]; complexity?: Record<string, string>;
  tryIt?: string[]; checkUnderstanding?: string[]; resources?: string[];
};

type TopicData = {
  topic: {
    id: string; slug: string; title: string; difficulty: string; content: TopicContent; position: number;
  };
  progress?: { status: string; mastery: number };
};

export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params) as { slug: string };
  const [data, setData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/topics/${slug}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="h-48 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  const topic = data?.topic;
  const progress = data?.progress;
  const c = topic?.content || {};

  const displayTitle = topic?.title || slug.replace(/-/g, " ").replace(/\b\w/g, (ch: string) => ch.toUpperCase());

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dsa/topics" className="hover:text-foreground transition-colors">Topics</Link>
        <span>/</span>
        <span>{displayTitle}</span>
      </div>

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight">{displayTitle}</h1>
          {topic && <Badge variant="outline">{topic.difficulty}</Badge>}
        </div>
        {progress && progress.mastery > 0 && (
          <div className="mt-3 flex items-center gap-3 max-w-sm">
            <Progress value={progress.mastery} size="sm" />
            <span className="text-xs text-muted-foreground tabular-nums">{progress.mastery}% mastery</span>
          </div>
        )}
      </div>

      {c.what && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-muted-foreground" />
            <CardTitle>What is it?</CardTitle>
          </div>
          <p className="text-sm leading-relaxed">{c.what}</p>
        </Card>
      )}

      {c.why && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-muted-foreground" />
            <CardTitle>Why does it exist?</CardTitle>
          </div>
          <p className="text-sm leading-relaxed">{c.why}</p>
        </Card>
      )}

      {c.mentalModel && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-muted-foreground" />
            <CardTitle>Mental Model</CardTitle>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground italic">{c.mentalModel}</p>
        </Card>
      )}

      {c.visual && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-muted-foreground" />
            <CardTitle>Visual Example</CardTitle>
          </div>
          <pre className="text-sm bg-muted rounded-lg p-4 overflow-x-auto border border-border">
            <code>{c.visual}</code>
          </pre>
        </Card>
      )}

      {c.examples && c.examples.length > 0 && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-muted-foreground" />
            <CardTitle>Examples</CardTitle>
          </div>
          <ul className="space-y-2">
            {c.examples.map((ex: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">{i + 1}.</span>
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {c.complexity && Object.keys(c.complexity).length > 0 && (
        <Card padding="lg">
          <CardTitle>Complexity</CardTitle>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {Object.entries(c.complexity).map(([op, val]) => (
              <div key={op} className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg border border-border">
                <span className="text-sm text-muted-foreground">{op}</span>
                <code className="text-sm">{val}</code>
              </div>
            ))}
          </div>
        </Card>
      )}

      {c.tryIt && c.tryIt.length > 0 && (
        <Card padding="lg">
          <CardTitle>Try It</CardTitle>
          <ul className="space-y-2 mt-4">
            {c.tryIt.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {c.checkUnderstanding && c.checkUnderstanding.length > 0 && (
        <Card padding="lg">
          <CardTitle>Check Understanding</CardTitle>
          <ul className="space-y-2 mt-4">
            {c.checkUnderstanding.map((q: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                {q}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link href="/dsa/practice" className="text-sm text-muted-foreground hover:text-foreground">
              Practice problems →
            </Link>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between pt-2">
        <Link href="/dsa/topics" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft size={14} /> All topics
        </Link>
        <Link href="/dsa/practice" className="text-sm text-foreground hover:underline flex items-center gap-1">
          Practice problems <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
