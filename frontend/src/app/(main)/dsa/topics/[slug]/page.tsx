"use client";

import React from "react";
import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb, Target, Zap, Brain, CheckCircle2 } from "lucide-react";

const TOPIC_DATA: Record<string, any> = {
  "hash-maps": {
    title: "Hash Maps",
    difficulty: "beginner",
    mastery: 60,
    what: "A hash map (or dictionary) is a data structure that stores key-value pairs. It uses a hash function to compute an index into an array of buckets or slots, from which the desired value can be found. Hash maps provide average O(1) time complexity for lookups, insertions, and deletions.",
    why: "Imagine you have 1,000 books and need to find a specific one. Without a system, you'd check each book one by one. A hash map is like an organized library where each book has a unique shelf address — you go directly to it.",
    mentalModel: "Think of a hash map as a magical vending machine. You put in a specific coin (key), and it instantly knows which slot to dispense from (value).",
    visual: "┌─────────────────────────────┐\n│  Hash Map: name → age       │\n├─────────┬───────────────────┤\n│  Index  │  Key → Value      │\n├─────────┼───────────────────┤\n│    0    │                   │\n│    1    │  \"Alice\" → 25     │\n│    2    │  \"Bob\" → 30       │\n│    3    │  \"Carol\" → 28     │\n└─────────┴───────────────────┘",
    examples: [
      { code: "# Python\nages = {}\nages[\"Alice\"] = 25\nages[\"Bob\"] = 30\nprint(ages[\"Alice\"])  # 25", explanation: "Create an empty hash map, add two entries, and look up Alice's age." },
      { code: "// Go\nages := map[string]int{}\nages[\"Alice\"] = 25\nages[\"Bob\"] = 30\nfmt.Println(ages[\"Alice\"]) // 25", explanation: "Same operation in Go using the built-in map type." },
    ],
    complexity: { "Lookup": "O(1) average", "Insertion": "O(1) average", "Deletion": "O(1) average", "Worst case": "O(n) — all keys hash to same bucket" },
    tryIt: ["Count word frequency in a sentence", "Find the most common element in an array", "Check if two arrays have any common elements"],
    checkUnderstanding: ["Why are hash maps O(1) on average but O(n) worst case?", "What makes a good hash function?", "When would you use a hash map instead of an array?", "What is a hash collision and how do maps handle it?"],
  },
};

const DEFAULT_TOPIC = {
  title: "Topic", difficulty: "beginner", mastery: 0,
  what: "This topic content is being developed. Check back soon for structured lessons.",
  why: "", mentalModel: "", visual: "", examples: [] as any[], complexity: {} as Record<string, string>, tryIt: [] as string[], checkUnderstanding: [] as string[],
};

export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params) as { slug: string };
  const data = TOPIC_DATA[slug] ?? { ...DEFAULT_TOPIC, title: slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dsa/topics" className="hover:text-foreground transition-colors">Topics</Link>
        <span>/</span>
        <span>{data.title}</span>
      </div>

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight">{data.title}</h1>
          <Badge variant="outline">{data.difficulty}</Badge>
        </div>
        {data.mastery > 0 && (
          <div className="mt-3 flex items-center gap-3 max-w-sm">
            <Progress value={data.mastery} size="sm" />
            <span className="text-xs text-muted-foreground tabular-nums">{data.mastery}% mastery</span>
          </div>
        )}
      </div>

      <Card padding="lg">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-muted-foreground" />
          <CardTitle>What is it?</CardTitle>
        </div>
        <p className="text-sm leading-relaxed">{data.what}</p>
      </Card>

      {data.why && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-muted-foreground" />
            <CardTitle>Why does it exist?</CardTitle>
          </div>
          <p className="text-sm leading-relaxed">{data.why}</p>
        </Card>
      )}

      {data.mentalModel && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={16} className="text-muted-foreground" />
            <CardTitle>Mental Model</CardTitle>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground italic">{data.mentalModel}</p>
        </Card>
      )}

      {data.visual && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-muted-foreground" />
            <CardTitle>Visual Example</CardTitle>
          </div>
          <pre className="text-sm bg-muted rounded-lg p-4 overflow-x-auto border border-border">
            <code>{data.visual}</code>
          </pre>
        </Card>
      )}

      {data.examples?.length > 0 && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={16} className="text-muted-foreground" />
            <CardTitle>Examples</CardTitle>
          </div>
          <div className="space-y-4">
            {data.examples.map((ex: any, i: number) => (
              <div key={i}>
                <pre className="text-sm bg-muted rounded-lg p-4 overflow-x-auto border border-border">
                  <code>{ex.code}</code>
                </pre>
                <p className="text-xs text-muted-foreground mt-2">{ex.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {Object.keys(data.complexity).length > 0 && (
        <Card padding="lg">
          <CardTitle>Complexity</CardTitle>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {Object.entries(data.complexity).map(([op, c]) => (
              <div key={op} className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg border border-border">
                <span className="text-sm text-muted-foreground">{op}</span>
                <code className="text-sm">{c as string}</code>
              </div>
            ))}
          </div>
        </Card>
      )}

      {data.tryIt?.length > 0 && (
        <Card padding="lg">
          <CardTitle>Try It</CardTitle>
          <ul className="space-y-2 mt-4">
            {data.tryIt.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">{i + 1}.</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {data.checkUnderstanding?.length > 0 && (
        <Card padding="lg">
          <CardTitle>Check Understanding</CardTitle>
          <ul className="space-y-2 mt-4">
            {data.checkUnderstanding.map((q: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                {q}
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button variant="outline" size="sm">Ask your coach</Button>
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
