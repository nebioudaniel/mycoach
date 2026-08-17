"use client";

import React from "react";
import Link from "next/link";

export default function IssueDetailPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/opensource/repos" className="hover:text-foreground transition-colors">Repositories</Link>
        <span>/</span>
        <span>Select a repo to view issues</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Go to <Link href="/opensource/repos" className="text-foreground underline">Repositories</Link>, select a repo, and browse its issues there.
      </p>
    </div>
  );
}
