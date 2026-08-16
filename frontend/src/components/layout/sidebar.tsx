"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Brain,
  GitBranch,
  BookOpen,
  FileText,
  Code2,
  Flame,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, group: "Overview" },
  { label: "Journal", href: "/journal", icon: BookOpen, group: "Overview" },
  { label: "Learning Path", href: "/dsa/path", icon: Flame, group: "DSA Coach" },
  { label: "Topics", href: "/dsa/topics", icon: Brain, group: "DSA Coach" },
  { label: "Practice", href: "/dsa/practice", icon: Code2, group: "DSA Coach" },
  { label: "Progress", href: "/dsa/progress", icon: BarChart3, group: "DSA Coach" },
  { label: "Repos", href: "/opensource/repos", icon: GitBranch, group: "Open Source" },
  { label: "Issues", href: "/opensource/issues", icon: FileText, group: "Open Source" },
];

export function Sidebar() {
  const pathname = usePathname();
  const grouped = navItems.reduce<Record<string, NavItem[]>>((acc, item) => {
    const g = item.group ?? "Other";
    (acc[g] ??= []).push(item);
    return acc;
  }, {});

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Code2 size={15} className="text-primary-foreground" />
        </div>
        <span className="text-sm font-bold tracking-tight">mycoach</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <p className="px-2 mb-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {group}
            </p>
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon size={16} className="shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Settings size={16} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
