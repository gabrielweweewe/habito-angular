import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { DailyEntry } from "@/lib/db/models";
import { createEntrySchema, updateEntrySchema } from "@/lib/validators/entry";
import type { CreateEntryInput, UpdateEntryInput } from "@/lib/validators/entry";
import { AppError } from "@/lib/utils/errors";
import { startOfDay } from "date-fns";

export async function create(
  userId: string,
  input: CreateEntryInput
): Promise<{ _id: string; date: Date; [key: string]: unknown }> {
  await connectDB();
  const date = startOfDay(new Date(input.date));
  const doc = await DailyEntry.create({
    userId: new mongoose.Types.ObjectId(userId),
    date,
    projectName: input.projectName,
    entryType: input.entryType,
    description: input.description,
    learned: input.learned,
    difficulty: input.difficulty,
    autonomyScore: input.autonomyScore,
    deepWorkBlockCompleted: input.deepWorkBlockCompleted ?? false,
    interruptionManagedWell: input.interruptionManagedWell ?? false,
  });
  return {
    _id: doc._id.toString(),
    date: doc.date,
    ...doc.toObject(),
  };
}

export async function list(
  userId: string,
  opts?: { from?: Date; to?: Date; limit?: number }
): Promise<{ _id: string; date: Date; [key: string]: unknown }[]> {
  await connectDB();
  const filter: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };
  if (opts?.from || opts?.to) {
    filter.date = {};
    if (opts?.from) (filter.date as Record<string, Date>).$gte = startOfDay(opts.from);
    if (opts?.to) (filter.date as Record<string, Date>).$lte = startOfDay(opts.to);
  }
  const docs = await DailyEntry.find(filter)
    .sort({ date: -1 })
    .limit(opts?.limit ?? 100)
    .lean();
  return docs.map((d) => ({
    ...d,
    _id: (d._id as mongoose.Types.ObjectId).toString(),
    date: d.date,
  })) as { _id: string; date: Date; [key: string]: unknown }[];
}

export async function getById(
  userId: string,
  id: string
): Promise<{ _id: string; date: Date; [key: string]: unknown } | null> {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return null;
  const doc = await DailyEntry.findOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  }).lean() as { _id: mongoose.Types.ObjectId; date: Date; [key: string]: unknown } | null;
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    date: doc.date,
  } as { _id: string; date: Date; [key: string]: unknown };
}

export async function update(
  userId: string,
  id: string,
  input: UpdateEntryInput
): Promise<{ _id: string; date: Date; [key: string]: unknown } | null> {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return null;
  const update: Record<string, unknown> = { ...input };
  if (input.date) update.date = startOfDay(new Date(input.date));
  const doc = await DailyEntry.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id), userId: new mongoose.Types.ObjectId(userId) },
    { $set: update },
    { new: true }
  ).lean() as { _id: mongoose.Types.ObjectId; date: Date; [key: string]: unknown } | null;
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    date: doc.date,
  } as { _id: string; date: Date; [key: string]: unknown };
}

export async function remove(userId: string, id: string): Promise<boolean> {
  await connectDB();
  if (!mongoose.isValidObjectId(id)) return false;
  const result = await DailyEntry.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });
  return result.deletedCount === 1;
}

export { createEntrySchema, updateEntrySchema };
