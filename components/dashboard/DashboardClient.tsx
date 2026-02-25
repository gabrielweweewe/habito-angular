"use client";

import { useEffect, useState } from "react";
import { LevelProgress } from "./LevelProgress";
import { StreakCounter } from "./StreakCounter";
import { WeeklyPointsChart } from "./WeeklyPointsChart";
import { AutonomyTrendChart } from "./AutonomyTrendChart";
import { EntryTypeChart } from "./EntryTypeChart";
import { PointsLegend } from "./PointsLegend";

interface DashboardData {
  levelProgress: {
    level: number;
    totalXP: number;
    currentLevelXP: number;
    nextLevelXP: number;
    xpInCurrentLevel: number;
  };
  streak: { current: number; longest: number };
  weeklyPoints: { weekStart: string; points: number }[];
  monthlyPoints: number;
  autonomyTrend: { date: string; score: number }[];
  entryTypeDistribution: { type: string; count: number }[];
}

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard", { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Falha ao carregar dashboard");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="text-red-600 p-4">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-gray-500">
        Carregando métricas...
      </div>
    );
  }

  const { levelProgress, streak, weeklyPoints, monthlyPoints, autonomyTrend, entryTypeDistribution } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LevelProgress
          level={levelProgress.level}
          xpInCurrentLevel={levelProgress.xpInCurrentLevel}
          nextLevelXP={levelProgress.nextLevelXP}
          totalXP={levelProgress.totalXP}
        />
        <StreakCounter current={streak.current} longest={streak.longest} />
      </div>

      <div className="rounded border p-4 bg-white">
        <h3 className="font-semibold text-sm text-gray-700 mb-1">Pontos no mês</h3>
        <p className="text-2xl font-bold text-emerald-600">{monthlyPoints}</p>
      </div>

      <PointsLegend />

      <WeeklyPointsChart data={weeklyPoints} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AutonomyTrendChart data={autonomyTrend} />
        <EntryTypeChart data={entryTypeDistribution} />
      </div>
    </div>
  );
}
