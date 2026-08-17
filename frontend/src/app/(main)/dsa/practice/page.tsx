"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

type Problem = {
  id: string; slug: string; title: string; difficulty: string; topics: string[]; solved: boolean;
};

export default function PracticePage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/problems", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setProblems(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = problems.filter((p) => {
    if (filter === "solved" && !p.solved) return false;
    if (filter === "unsolved" && p.solved) return false;
    if (filter !== "all" && filter !== "solved" && filter !== "unsolved" && p.difficulty !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Practice</h1>
        <p className="text-sm text-muted-foreground mt-1">Solve structured problems to build algorithmic thinking.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search problems..."
            className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
        </div>
        <div className="flex gap-1.5 p-1 bg-muted rounded-lg">
          {["all", "easy", "medium", "solved", "unsolved"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 h-8 text-xs font-medium rounded-md capitalize transition-all ${
                filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((p) => (
          <Link key={p.slug} href={`/dsa/practice/${p.slug}`}>
            <Card padding="md" className="flex items-center gap-4 hover:border-border transition-colors group">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                p.solved ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {p.solved ? "✓" : ""}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{p.title}</span>
                  <Badge variant="outline">{p.difficulty}</Badge>
                </div>
                <div className="flex gap-1.5 mt-1">
                  {(p.topics || []).map((t) => (
                    <span key={t} className="text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
              <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No problems match your filter.</p>
        </div>
      )}
    </div>
  );
}
