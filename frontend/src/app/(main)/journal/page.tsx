"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Trophy, AlertTriangle, GitBranch, Sparkles, Calendar } from "lucide-react";

type JournalEntryData = {
  id: string; date: string;
  entries: { learned?: string[]; struggled?: string[]; solved?: string[]; opensource?: string[] };
  recommendation: string;
};

const sectionConfig = {
  learned: { icon: BookOpen, label: "Learned" },
  struggled: { icon: AlertTriangle, label: "Struggled with" },
  solved: { icon: Trophy, label: "Solved" },
  opensource: { icon: GitBranch, label: "Open Source" },
};

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journal", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setEntries(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        {[1, 2].map((i) => <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Engineering Journal</h1>
        <p className="text-sm text-muted-foreground mt-1">Your learning journey, recorded daily. The AI uses this to personalize your coaching.</p>
      </div>

      <div className="space-y-5">
        {entries.map((entry) => (
          <Card key={entry.id} padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold">{new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</h2>
            </div>
            <div className="space-y-4">
              {(["learned", "struggled", "solved", "opensource"] as const).map((key) => {
                const items = entry.entries?.[key] || [];
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

      {entries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No journal entries yet. Start learning to build your journal.</p>
        </div>
      )}
    </div>
  );
}
