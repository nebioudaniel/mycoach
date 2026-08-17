"use client";

import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Send, Lightbulb, CheckCircle2, XCircle, Code2, ChevronDown, ChevronUp } from "lucide-react";

const PROBLEMS: Record<string, any> = {
  "two-sum": {
    title: "Two Sum", difficulty: "easy", topics: ["arrays", "hash-maps"],
    descriptionMd: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.`,
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] == 6" },
    ],
    constraintsMd: "2 <= nums.length <= 10⁴\n-10⁹ <= nums[i] <= 10⁹\nOnly one valid answer exists.",
    starterCode: { python: `def twoSum(nums, target):\n    # Your solution here\n    pass`, go: `func twoSum(nums []int, target int) []int {\n\t// Your solution here\n\treturn nil\n}` },
  },
  "valid-anagram": {
    title: "Valid Anagram", difficulty: "easy", topics: ["strings", "hash-maps"],
    descriptionMd: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: "true", explanation: "Same characters with same frequency." },
      { input: 's = "rat", t = "car"', output: "false", explanation: "Different characters." },
    ],
    constraintsMd: "1 <= s.length, t.length <= 5 * 10⁴",
    starterCode: { python: `def isAnagram(s, t):\n    # Your solution here\n    pass`, go: `func isAnagram(s string, t string) bool {\n\t// Your solution here\n\treturn false\n}` },
  },
};

export default function ProblemWorkspace({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params) as { slug: string };
  const problem = PROBLEMS[slug] ?? {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    difficulty: "medium", topics: [] as string[],
    descriptionMd: "Problem description coming soon.",
    examples: [] as any[], constraintsMd: "",
    starterCode: { python: "# Write your solution\ndef solve():\n    pass", go: "// Write your solution\nfunc Solve() {\n}" },
  };

  const [language, setLanguage] = useState<"python" | "go">("python");
  const [code, setCode] = useState(problem.starterCode.python);
  const [hintLevel, setHintLevel] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ correct: boolean } | null>(null);
  const [showExamples, setShowExamples] = useState(true);

  const HINTS = [
    "Think about what data structure allows O(1) lookups by key.",
    "What if you stored each number's complement as you iterate?",
    "For each element, check if (target - element) exists in your map.",
  ];

  const handleSubmit = () => { setShowResult(true); setResult({ correct: false }); };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/dsa/practice" className="hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} /> Practice
        </Link>
        <span>/</span>
        <span className="text-foreground">{problem.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="lg" className="overflow-y-auto max-h-[calc(100dvh-12rem)]">
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-lg font-semibold tracking-tight">{problem.title}</h1>
            <Badge variant="outline">{problem.difficulty}</Badge>
          </div>
          <div className="flex gap-1.5 mb-4">
            {problem.topics.map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-line mb-5">{problem.descriptionMd}</div>

          {problem.examples.length > 0 && (
            <div>
              <button onClick={() => setShowExamples(!showExamples)} className="flex items-center gap-2 text-sm font-medium mb-2">
                Examples {showExamples ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showExamples && problem.examples.map((ex: any, i: number) => (
                <div key={i} className="bg-muted rounded-lg p-3 border border-border mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Example {i + 1}</p>
                  <p className="text-sm"><code className="text-muted-foreground font-medium">Input:</code> {ex.input}</p>
                  <p className="text-sm"><code className="text-muted-foreground font-medium">Output:</code> {ex.output}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ex.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {problem.constraintsMd && (
            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">Constraints</h3>
              <p className="text-xs text-muted-foreground whitespace-pre-line">{problem.constraintsMd}</p>
            </div>
          )}
        </Card>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              {(["python", "go"] as const).map((lang) => (
                <button key={lang} onClick={() => { setLanguage(lang); setCode(problem.starterCode[lang]); }}
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
            <Button onClick={handleSubmit} icon={<Send size={14} />}>Submit</Button>
            <Button variant="outline" size="sm">Run tests</Button>
          </div>

          {showResult && result && (
            <Card padding="md" className="border-border">
              <div className="flex items-start gap-3">
                {result.correct ? <CheckCircle2 size={18} className="mt-0.5" /> : <XCircle size={18} className="text-destructive mt-0.5" />}
                <div className="text-sm">
                  <p className={`font-medium ${result.correct ? "" : "text-destructive"}`}>
                    {result.correct ? "Accepted" : "Incorrect"}
                  </p>
                  {!result.correct && <p className="text-muted-foreground mt-1">Think about the approach — try using a hash map to store complements.</p>}
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
