import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Experiment, DailyEntry } from "@/lib/db/models";
import type { CreateExperimentInput, UpdateExperimentInput, LogComplianceInput } from "@/lib/validators/experiment";
import { startOfDay, startOfWeek, endOfWeek, eachWeekOfInterval } from "date-fns";
import { calculatePointsForEntry } from "@/lib/utils/gamification";

export async function create(
  userId: string,
  input: CreateExperimentInput
): Promise<{ _id: string; name: string; [key: string]: unknown }> {
  await connectDB();
  const doc = await Experiment.create({
    userId: new mongoose.Types.ObjectId(userId),
    name: input.name,
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate,
    targetMetric: input.targetMetric,
    complianceLog: [],
  });
  return { _id: doc._id.toString(), name: doc.name, ...doc.toObject() } as { _id: string; name: string; [key: string]: unknown };
}

export async function list(userId: string): Promise<{ _id: string; [key: string]: unknown }[]> {
  await connectDB();
  const docs = await Experiment.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .lean();
  return docs.map((d) => ({
    ...d,
    _id: (d._id as mongoose.Types.ObjectId).toString(),
  })) as { _id: string; [key: string]: unknown }[];
}

export async function getById(
  userId: string,
  id: string
): Promise<{ _id: string; [key: string]: unknown } | null> {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return null;
  const doc = await Experiment.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  }).lean() as { _id: mongoose.Types.ObjectId; [key: string]: unknown } | null;
  if (!doc) return null;
  return { ...doc, _id: doc._id.toString() } as { _id: string; [key: string]: unknown };
}

export async function update(
  userId: string,
  id: string,
  input: UpdateExperimentInput
): Promise<{ _id: string; [key: string]: unknown } | null> {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return null;
  const doc = await Experiment.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) },
    { $set: input },
    { new: true }
  ).lean() as { _id: mongoose.Types.ObjectId; [key: string]: unknown } | null;
  if (!doc) return null;
  return { ...doc, _id: doc._id.toString() } as { _id: string; [key: string]: unknown };
}

export async function remove(userId: string, id: string): Promise<boolean> {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return false;
  const result = await Experiment.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });
  return result.deletedCount === 1;
}

export async function logCompliance(
  userId: string,
  experimentId: string,
  input: LogComplianceInput
): Promise<{ _id: string; [key: string]: unknown } | null> {
  await connectDB();
  if (!mongoose.isValidObjectId(experimentId)) return null;
  const dateNorm = startOfDay(new Date(input.date));
  const doc = await Experiment.findOne({
    _id: new mongoose.Types.ObjectId(experimentId),
    userId: new mongoose.Types.ObjectId(userId),
  }).lean() as { complianceLog?: { date: Date; completed: boolean; value?: number }[] } | null;
  if (!doc) return null;
  const log = (doc.complianceLog || []) as { date: Date; completed: boolean; value?: number }[];
  const dateNormTime = dateNorm.getTime();
  const existing = log.findIndex((e) => startOfDay(new Date(e.date)).getTime() === dateNormTime);
  const entry = { date: dateNorm, completed: input.completed, value: input.value };
  let newLog;
  if (existing >= 0) {
    newLog = [...log];
    newLog[existing] = entry;
  } else {
    newLog = [...log, entry];
  }
  newLog.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const updated = await Experiment.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(experimentId), userId: new mongoose.Types.ObjectId(userId) },
    { $set: { complianceLog: newLog } },
    { new: true }
  ).lean() as { _id: mongoose.Types.ObjectId; [key: string]: unknown } | null;
  if (!updated) return null;
  return { ...updated, _id: updated._id.toString() } as { _id: string; [key: string]: unknown };
}

export async function getCorrelationData(
  userId: string,
  experimentId: string
): Promise<{
  complianceByWeek: { weekStart: string; completed: number; total: number; pct: number }[];
  weeklyXP: { weekStart: string; points: number }[];
  weeklyAutonomy: { weekStart: string; avg: number }[];
} | null> {
  await connectDB();
  const exp = await Experiment.findOne({
    _id: new mongoose.Types.ObjectId(experimentId),
    userId: new mongoose.Types.ObjectId(userId),
  }).lean() as { startDate: Date; endDate: Date; complianceLog?: { date: Date; completed: boolean }[] } | null;
  if (!exp) return null;
  const start = startOfDay(new Date(exp.startDate));
  const end = startOfDay(new Date(exp.endDate));
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
  const complianceByWeek = weeks.map((weekStart) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const log = (exp.complianceLog || []) as { date: Date; completed: boolean }[];
    const inWeek = log.filter(
      (e) => new Date(e.date) >= weekStart && new Date(e.date) <= weekEnd
    );
    const completed = inWeek.filter((e) => e.completed).length;
    return {
      weekStart: weekStart.toISOString().slice(0, 10),
      completed,
      total: inWeek.length,
      pct: inWeek.length ? (completed / inWeek.length) * 100 : 0,
    };
  });
  const entries = await DailyEntry.find({
    userId: new mongoose.Types.ObjectId(userId),
    date: { $gte: start, $lte: end },
  }).lean();
  const weeklyXP: Record<string, number> = {};
  const weeklyAutonomySum: Record<string, number> = {};
  const weeklyAutonomyCount: Record<string, number> = {};
  for (const e of entries) {
    const d = new Date(e.date);
    const ws = startOfWeek(d, { weekStartsOn: 1 }).toISOString().slice(0, 10);
    if (!weeklyXP[ws]) weeklyXP[ws] = 0;
    weeklyXP[ws] += calculatePointsForEntry({
      entryType: e.entryType,
      difficulty: e.difficulty,
      deepWorkBlockCompleted: e.deepWorkBlockCompleted,
      interruptionManagedWell: e.interruptionManagedWell,
      learned: e.learned,
    });
    if (e.autonomyScore != null) {
      if (!weeklyAutonomySum[ws]) {
        weeklyAutonomySum[ws] = 0;
        weeklyAutonomyCount[ws] = 0;
      }
      weeklyAutonomySum[ws] += e.autonomyScore;
      weeklyAutonomyCount[ws]++;
    }
  }
  const weeklyXPArr = weeks.map((w) => ({
    weekStart: w.toISOString().slice(0, 10),
    points: weeklyXP[w.toISOString().slice(0, 10)] ?? 0,
  }));
  const weeklyAutonomyArr = weeks.map((w) => {
    const ws = w.toISOString().slice(0, 10);
    const sum = weeklyAutonomySum[ws] ?? 0;
    const count = weeklyAutonomyCount[ws] ?? 0;
    return { weekStart: ws, avg: count ? sum / count : 0 };
  });
  return {
    complianceByWeek,
    weeklyXP: weeklyXPArr,
    weeklyAutonomy: weeklyAutonomyArr,
  };
}
