"use client";

import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { BookOpen, Trophy, AlertTriangle, GitBranch, Sparkles, Calendar } from "lucide-react";

const ENTRIES = [
  {
    date: "August 16, 2026",
    learned: ["Hash Maps internals", "Two Pointers pattern"],
    struggled: ["Recognizing sliding window problems"],
    solved: ["Two Sum", "Valid Anagram"],
    opensource: ["Analyzed kubernetes/kubernetes", "Reviewed issue #12847"],
    recommendation: "Review sliding window problems tomorrow — you struggled to identify the pattern. Try 2-3 sliding window problems to solidify the approach.",
  },
  {
    date: "August 15, 2026",
    learned: ["Array basics", "Big O notation"],
    struggled: ["Understanding O(n²) complexity"],
    solved: ["Contains Duplicate"],
    opensource: [],
    recommendation: "Focus on Big O analysis — try to derive the complexity for each solution before submitting.",
  },
  {
    date: "August 14, 2026",
    learned: ["Git branching strategies", "Pull request workflow"],
    struggled: ["Understanding CI/CD pipelines"],
    solved: [],
    opensource: ["Explored Grafana repo", "Read CONTRIBUTING.md"],
    recommendation: "Continue with DSA fundamentals while keeping open source exploration as a secondary activity.",
  },
];

const sectionConfig = {
  learned: { icon: BookOpen, label: "Learned" },
  struggled: { icon: AlertTriangle, label: "Struggled with" },
  solved: { icon: Trophy, label: "Solved" },
  opensource: { icon: GitBranch, label: "Open Source" },
};

export default function JournalPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Engineering Journal</h1>
        <p className="text-sm text-muted-foreground mt-1">Your learning journey, recorded daily. The AI uses this to personalize your coaching.</p>
      </div>

      <div className="space-y-5">
        {ENTRIES.map((entry, i) => (
          <Card key={i} padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold">{entry.date}</h2>
            </div>
            <div className="space-y-4">
              {(["learned", "struggled", "solved", "opensource"] as const).map((key) => {
                const items = entry[key];
                if (!items.length) return null;
                const config = sectionConfig[key];
                const Icon = config.icon;
                return (
                  <div key={key}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Icon size={13} className="text-muted-foreground" />
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{config.label}</span>
                    </div>
                    <ul className="space-y-1">
                      {items.map((item, j) => (
                        <li key={j} className="text-sm flex items-start gap-2">
                          <span className="text-muted-foreground mt-0.5">-</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              {entry.recommendation && (
                <div className="mt-3 flex items-start gap-2 px-3 py-2.5 bg-muted rounded-lg border border-border">
                  <Sparkles size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-0.5">AI Recommendation</p>
                    <p className="text-sm">{entry.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
