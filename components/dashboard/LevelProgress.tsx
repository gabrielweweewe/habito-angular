"use client";

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
  const pct = nextLevelXP > 0 ? Math.min(100, (xpInCurrentLevel / nextLevelXP) * 100) : 100;
  return (
    <div className="rounded border p-4 bg-white">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">Nível {level}</h3>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {xpInCurrentLevel} / {nextLevelXP} XP neste nível · Total: {totalXP} XP
      </p>
    </div>
  );
}
