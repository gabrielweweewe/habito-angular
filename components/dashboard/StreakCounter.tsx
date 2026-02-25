"use client";

import { Icon } from "@/components/ui/Icon";

interface StreakCounterProps {
  current: number;
  longest: number;
}

export function StreakCounter({ current, longest }: StreakCounterProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-lg hover:shadow-amber-500/5">
      <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
        <Icon name="local_fire_department" size={20} className="text-amber-500" />
        Sequência
      </h3>
      <div className="flex gap-6">
        <div>
          <p className="text-2xl font-bold text-amber-500">{current}</p>
          <p className="text-xs text-muted-foreground">dias atual</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{longest}</p>
          <p className="text-xs text-muted-foreground">recorde</p>
        </div>
      </div>
    </div>
  );
}
