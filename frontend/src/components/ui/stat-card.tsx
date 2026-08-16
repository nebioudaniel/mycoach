import type { ReactNode } from "react";
import { Card } from "./card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className = "" }: StatCardProps) {
  return (
    <Card padding="md" className={`flex items-start gap-3 ${className}`}>
      {icon && (
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted text-muted-foreground shrink-0">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground truncate">{label}</p>
        <p className="text-xl font-semibold tracking-tight mt-0.5 tabular-nums">{value}</p>
      </div>
    </Card>
  );
}
