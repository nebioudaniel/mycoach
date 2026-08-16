"use client";

import { Card, CardTitle, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const handleLogout = async () => { await logout(); router.push("/login"); };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-lg font-semibold tracking-tight">Settings</h1>

      <Card padding="lg">
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{user?.displayName}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Email</span>
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Skill level</span>
            <Badge variant="outline">{profile?.skillLevel ?? "beginner"}</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Languages</span>
            <div className="flex gap-1.5">
              {(profile?.languages ?? ["Go", "Python"]).map((l) => <Badge key={l} variant="secondary">{l}</Badge>)}
            </div>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <CardHeader><CardTitle>Learning Goals</CardTitle></CardHeader>
        <p className="text-sm text-muted-foreground mb-3">Define what you want to achieve. Your AI coach uses this for personalization.</p>
        <div className="space-y-2">
          {(profile?.goals ?? ["Become proficient in Go", "Contribute to open source", "Master DSA"]).map((g, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 bg-muted rounded-lg border border-border">
              <span className="text-sm">{g}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="lg">
        <CardHeader><CardTitle>Danger zone</CardTitle></CardHeader>
        <Button variant="destructive" size="sm" onClick={handleLogout}>Sign out</Button>
      </Card>
    </div>
  );
}
