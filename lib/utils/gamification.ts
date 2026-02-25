import { POINTS, getLevelFromTotalXP } from "@/lib/constants/gamification";
import type { EntryType } from "@/types";

export interface EntryForPoints {
  entryType: EntryType;
  difficulty?: number;
  deepWorkBlockCompleted: boolean;
  interruptionManagedWell: boolean;
  learned?: string;
}

export function calculatePointsForEntry(entry: EntryForPoints): number {
  let points = 0;
  if (entry.deepWorkBlockCompleted) points += POINTS.DEEP_WORK_BLOCK;
  if (entry.entryType === "incident") points += POINTS.INCIDENT_RESOLVED;
  if (entry.entryType === "study" && entry.learned) points += POINTS.NEW_APPLIED_LEARNING;
  if (entry.entryType === "project" && (entry.difficulty ?? 0) >= 4) points += POINTS.LARGE_TASK_COMPLETED;
  if (entry.interruptionManagedWell) points += POINTS.INTERRUPTION_MANAGED;
  return points;
}

export function calculateStreak(dates: Date[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };
  const sorted = [...dates].map((d) => new Date(d).toDateString()).sort();
  const unique = Array.from(new Set(sorted)).sort();
  const today = new Date().toDateString();
  let current = 0;
  let longest = 0;
  let run = 0;
  for (let i = unique.length - 1; i >= 0; i--) {
    const d = new Date(unique[i]);
    const nextInTime = i < unique.length - 1 ? new Date(unique[i + 1]) : null;
    if (nextInTime) {
      const diffDays = (nextInTime.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) run++;
      else run = 1;
    } else run = 1;
    longest = Math.max(longest, run);
    if (unique[i] === today) current = run;
  }
  return { current, longest };
}

export { getLevelFromTotalXP } from "@/lib/constants/gamification";
