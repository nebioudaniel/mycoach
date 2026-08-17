"use client";

import React, { useState, useEffect } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Send, Lightbulb, CheckCircle2, XCircle, Code2, ChevronDown, ChevronUp } from "lucide-react";

type ProblemData = {
  id: string; slug: string; title: string; difficulty: string; topics: string[];
  descriptionMd: string; examples: { input: string; output: string; explanation?: string }[];
  constraintsMd: string; starterCode: Record<string, string>; source: string;
};

type AttemptData = {
  id: string; language: string; code: string; status: string; correctness: boolean | null;
};

export default function ProblemWorkspace({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params) as { slug: string };
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"python" | "go">("python");
  const [code, setCode] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ correct: boolean } | null>(null);
  const [showExamples, setShowExamples] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/problems/${slug}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setProblem(d.problem);
        setAttempt(d.attempt || null);
        const starter = d.problem?.starterCode?.python || "# Write your solution\n";
        setCode(d.attempt?.code || starter);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/problems/${slug}/submit`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      setAttempt(data);
      setShowResult(true);
      setResult({ correct: data.status === "solved" });
    } catch {
      setShowResult(true);
      setResult({ correct: false });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto animate-fade-in">
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-96 bg-muted rounded-xl animate-pulse" />
          <div className="h-96 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const p = problem || {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    difficulty: "medium", topics: [] as string[],
    descriptionMd: "Problem description coming soon.",
    examples: [] as any[], constraintsMd: "",
    starterCode: { python: "# Write your solution\n", go: "// Write your solution\n" },
  };

  const HINTS = [
    "Think about what data structure allows O(1) lookups by key.",
    "What if you stored each number's complement as you iterate?",
    "For each element, check if (target - element) exists in your map.",
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/dsa/practice" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} /> Practice
        </Link>
        <span>/</span>
        <span className="text-foreground">{p.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="lg" className="overflow-y-auto max-h-[calc(100dvh-12rem)]">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-lg font-semibold tracking-tight">{p.title}</h1>
            <Badge variant="outline">{p.difficulty}</Badge>
          </div>
          <div className="flex gap-1.5 mb-4">
            {(p.topics || []).map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-line mb-5">{p.descriptionMd}</div>

          {p.examples.length > 0 && (
            <div>
              <button onClick={() => setShowExamples(!showExamples)} className="flex items-center gap-2 text-sm font-medium mb-2">
                Examples {showExamples ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showExamples && p.examples.map((ex: any, i: number) => (
                <div key={i} className="bg-muted rounded-lg p-3 border border-border mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Example {i + 1}</p>
                  <p className="text-sm"><code className="text-muted-foreground font-medium">Input:</code> {ex.input}</p>
                  <p className="text-sm"><code className="text-muted-foreground font-medium">Output:</code> {ex.output}</p>
                  {ex.explanation && <p className="text-xs text-muted-foreground mt-1">{ex.explanation}</p>}
                </div>
              ))}
            </div>
          )}

          {p.constraintsMd && (
            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Constraints</h3>
              <p className="text-xs text-muted-foreground whitespace-pre-line">{p.constraintsMd}</p>
            </div>
          )}
        </Card>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {(["python", "go"] as const).map((lang) => (
                <button key={lang} onClick={() => { setLanguage(lang); setCode(problem?.starterCode?.[lang] || "# Write your solution\n"); }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    language === lang ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {lang}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" icon={<Lightbulb size={14} />}
              onClick={() => setHintLevel(Math.min(hintLevel + 1, HINTS.length))}>
              Hint {hintLevel > 0 && `${hintLevel}/${HINTS.length}`}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute top-2 right-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Code2 size={10} /><span>{language}</span>
            </div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false}
              className="w-full h-72 p-4 pr-16 text-sm font-mono bg-muted border border-border rounded-xl resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </div>

          {hintLevel > 0 && (
            <Card padding="md" className="border-border bg-muted">
              <div className="flex items-start gap-2">
                <Lightbulb size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Hint {hintLevel}</p>
                  <p className="text-sm">{HINTS[hintLevel - 1]}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit} disabled={submitting} icon={<Send size={14} />}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>

          {showResult && result && (
            <Card padding="md" className="border-border">
              <div className="flex items-start gap-3">
                {result.correct ? <CheckCircle2 size={18} className="mt-0.5" /> : <XCircle size={18} className="text-destructive mt-0.5" />}
                <div className="text-sm">
                  <p className={`font-medium ${result.correct ? "" : "text-destructive"}`}>
                    {result.correct ? "Accepted" : "Incorrect"}
                  </p>
                  {!result.correct && <p className="text-muted-foreground mt-1">Think about the approach — review the hints and try again.</p>}
                </div>
              </div>
            </Card>
          )}

          <Card padding="md" className="border-border">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Need help?</p>
            <p className="text-sm text-muted-foreground mb-3">Your AI coach can guide your thinking without giving away the answer.</p>
            <Button variant="outline" size="sm">Ask your coach</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
