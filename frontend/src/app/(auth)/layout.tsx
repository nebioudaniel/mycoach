import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <span className="text-lg font-bold tracking-tight">mycoach</span>
        </div>
        <AuthProvider>{children}</AuthProvider>
      </div>
    </div>
  );
}
