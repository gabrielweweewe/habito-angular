import { connectDB } from "@/lib/db";
import { DailyEntry } from "@/lib/db/models";
import {
  calculatePointsForEntry,
  calculateStreak,
  getLevelFromTotalXP,
} from "@/lib/utils/gamification";
import type { EntryForPoints } from "@/lib/utils/gamification";
import { startOfDay, subDays, startOfWeek, endOfWeek } from "date-fns";

export async function getTotalXP(userId: string): Promise<number> {
  await connectDB();
  const entries = await DailyEntry.find({ userId }).lean();
  let total = 0;
  for (const e of entries) {
    total += calculatePointsForEntry({
      entryType: e.entryType,
      difficulty: e.difficulty,
      deepWorkBlockCompleted: e.deepWorkBlockCompleted,
      interruptionManagedWell: e.interruptionManagedWell,
      learned: e.learned,
    });
  }
  return total;
}

export async function getStreaks(userId: string): Promise<{ current: number; longest: number }> {
  await connectDB();
  const entries = await DailyEntry.find({ userId }).distinct("date");
  const dates = entries.map((d) => new Date(d));
  return calculateStreak(dates);
}

export async function getLevelProgress(userId: string) {
  const totalXP = await getTotalXP(userId);
  return getLevelFromTotalXP(totalXP);
}

export async function getPointsByDay(
  userId: string,
  from: Date,
  to: Date
): Promise<{ date: string; points: number }[]> {
  await connectDB();
  const entries = await DailyEntry.find({
    userId,
    date: { $gte: startOfDay(from), $lte: startOfDay(to) },
  }).lean();
  const byDay: Record<string, number> = {};
  for (const e of entries) {
    const d = startOfDay(new Date(e.date)).toISOString().slice(0, 10);
    if (!byDay[d]) byDay[d] = 0;
    byDay[d] += calculatePointsForEntry({
      entryType: e.entryType,
      difficulty: e.difficulty,
      deepWorkBlockCompleted: e.deepWorkBlockCompleted,
      interruptionManagedWell: e.interruptionManagedWell,
      learned: e.learned,
    });
  }
  return Object.entries(byDay).map(([date, points]) => ({ date, points }));
}

export async function getWeeklyPoints(
  userId: string,
  weeks: number = 8
): Promise<{ weekStart: string; points: number }[]> {
  const now = new Date();
  const result: { weekStart: string; points: number }[] = [];
  for (let i = 0; i < weeks; i++) {
    const weekStart = startOfWeek(subDays(now, i * 7), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const points = await getPointsByDay(userId, weekStart, weekEnd);
    const total = points.reduce((s, p) => s + p.points, 0);
    result.push({ weekStart: weekStart.toISOString().slice(0, 10), points: total });
  }
  return result.reverse();
}
