"use client";

import { Icon } from "@/components/ui/Icon";

interface LevelProgressProps {
  level: number;
  xpInCurrentLevel: number;
  nextLevelXP: number;
  totalXP: number;
}

export function LevelProgress({
  level,
  xpInCurrentLevel,
  nextLevelXP,
  totalXP,
}: LevelProgressProps) {
  const pct =
    nextLevelXP > 0
      ? Math.min(100, (xpInCurrentLevel / nextLevelXP) * 100)
      : 100;
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-lg hover:shadow-accent/5">
      <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
        <Icon name="trending_up" size={20} className="text-accent" />
        Nível {level}
      </h3>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">
        {xpInCurrentLevel} / {nextLevelXP} XP neste nível · Total: {totalXP} XP
      </p>
    </div>
  );
}
