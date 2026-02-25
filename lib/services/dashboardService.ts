import { connectDB } from "@/lib/db";
import { DailyEntry } from "@/lib/db/models";
import {
  getLevelProgress,
  getStreaks,
  getTotalXP,
  getWeeklyPoints,
  getPointsByDay,
} from "./gamificationService";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getDashboardData(userId: string) {
  await connectDB();

  const [levelProgress, streaks, totalXP, weeklyPoints] = await Promise.all([
    getLevelProgress(userId),
    getStreaks(userId),
    getTotalXP(userId),
    getWeeklyPoints(userId, 8),
  ]);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const monthlyPointsData = await getPointsByDay(userId, monthStart, monthEnd);
  const monthlyPoints = monthlyPointsData.reduce((s, p) => s + p.points, 0);

  const entries = await DailyEntry.find({ userId }).lean();
  const autonomyScores = entries
    .filter((e) => e.autonomyScore != null)
    .map((e) => ({
      date: new Date(e.date).toISOString().slice(0, 10),
      score: e.autonomyScore as number,
    }));
  autonomyScores.sort((a, b) => a.date.localeCompare(b.date));

  const entryTypeCount: Record<string, number> = { project: 0, incident: 0, study: 0 };
  for (const e of entries) {
    entryTypeCount[e.entryType] = (entryTypeCount[e.entryType] ?? 0) + 1;
  }
  const entryTypeDistribution = Object.entries(entryTypeCount).map(([type, count]) => ({
    type,
    count,
  }));

  return {
    levelProgress: {
      level: levelProgress.level,
      totalXP,
      currentLevelXP: levelProgress.currentLevelXP,
      nextLevelXP: levelProgress.nextLevelXP,
      xpInCurrentLevel: levelProgress.xpInCurrentLevel,
    },
    streak: { current: streaks.current, longest: streaks.longest },
    weeklyPoints,
    monthlyPoints,
    autonomyTrend: autonomyScores,
    entryTypeDistribution,
  };
}
