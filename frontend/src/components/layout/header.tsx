"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "./theme-toggle";
import { LogOut, User } from "lucide-react";
import { useCallback, useState } from "react";

export function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = useCallback(async () => {
    await logout();
    setMenuOpen(false);
  }, [logout]);

  return (
    <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-border shrink-0">
      <div className="flex items-center gap-3 lg:hidden">
        <Link href="/dashboard" className="text-sm font-semibold">mycoach</Link>
      </div>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-1">
        <ThemeToggle />
        {user && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 h-9 px-2.5 rounded-md hover:bg-accent transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <User size={13} className="text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground hidden sm:inline max-w-[120px] truncate">
                {user.displayName}
              </span>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-popover border border-border rounded-xl shadow-lg py-1 animate-fade-in">
                  <p className="px-3 py-1.5 text-xs text-muted-foreground truncate">{user.email}</p>
                  <div className="h-px border-border my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
