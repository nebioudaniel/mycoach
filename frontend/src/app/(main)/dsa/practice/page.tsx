"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

const PROBLEMS = [
  { slug: "two-sum", title: "Two Sum", difficulty: "easy", topics: ["arrays", "hash-maps"], solved: true },
  { slug: "valid-anagram", title: "Valid Anagram", difficulty: "easy", topics: ["strings", "hash-maps"], solved: true },
  { slug: "contains-duplicate", title: "Contains Duplicate", difficulty: "easy", topics: ["arrays"], solved: true },
  { slug: "longest-substring-without-repeating", title: "Longest Substring Without Repeating Characters", difficulty: "medium", topics: ["strings", "sliding-window"], solved: false },
  { slug: "container-with-most-water", title: "Container With Most Water", difficulty: "medium", topics: ["two-pointers"], solved: false },
  { slug: "3sum", title: "3Sum", difficulty: "medium", topics: ["two-pointers", "sorting"], solved: false },
  { slug: "reverse-linked-list", title: "Reverse Linked List", difficulty: "easy", topics: ["linked-lists"], solved: false },
  { slug: "binary-tree-inorder", title: "Binary Tree Inorder Traversal", difficulty: "easy", topics: ["trees"], solved: false },
];

export default function PracticePage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = PROBLEMS.filter((p) => {
    if (filter === "solved" && !p.solved) return false;
    if (filter === "unsolved" && p.solved) return false;
    if (filter !== "all" && filter !== "solved" && filter !== "unsolved" && p.difficulty !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
                  {p.topics.map((t) => (
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
