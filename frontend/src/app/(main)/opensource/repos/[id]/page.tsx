"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";

export default function RepoDetailPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/opensource/repos" className="hover:text-foreground transition-colors">Repositories</Link>
        <span>/</span>
        <span>Repository</span>
      </div>
      <Card padding="lg">
        <CardTitle>GitHub Integration Required</CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Connect your GitHub account to see repository details, AI-generated overviews, and beginner guides.
        </p>
      </Card>
    </div>
  );
}
