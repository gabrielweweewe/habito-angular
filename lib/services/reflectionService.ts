import mongoose from "mongoose";
import { startOfWeek } from "date-fns";
import { connectDB } from "@/lib/db";
import { WeeklyReflection } from "@/lib/db/models";
import type { CreateReflectionInput, UpdateReflectionInput } from "@/lib/validators/reflection";

export async function create(
  userId: string,
  input: CreateReflectionInput
): Promise<{ _id: string; weekStartDate: Date; [key: string]: unknown }> {
  await connectDB();
  const weekStart = startOfWeek(new Date(input.weekStartDate), { weekStartsOn: 1 });
  const doc = await WeeklyReflection.create({
    userId: new mongoose.Types.ObjectId(userId),
    weekStartDate: weekStart,
    whatDidILearn: input.whatDidILearn,
    whereDidIImprove: input.whereDidIImprove,
    mainChallenge: input.mainChallenge,
    autonomyAverage: input.autonomyAverage,
  });
  return {
    _id: doc._id.toString(),
    weekStartDate: doc.weekStartDate,
    ...doc.toObject(),
  } as { _id: string; weekStartDate: Date; [key: string]: unknown };
}

export async function list(
  userId: string,
  limit = 20
): Promise<{ _id: string; weekStartDate: Date; [key: string]: unknown }[]> {
  await connectDB();
  const docs = await WeeklyReflection.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ weekStartDate: -1 })
    .limit(limit)
    .lean();
  return docs.map((d) => ({
    ...d,
    _id: (d._id as mongoose.Types.ObjectId).toString(),
    weekStartDate: d.weekStartDate,
  })) as { _id: string; weekStartDate: Date; [key: string]: unknown }[];
}

export async function getByWeek(
  userId: string,
  weekStartDate: Date
): Promise<{ _id: string; weekStartDate: Date; [key: string]: unknown } | null> {
  await connectDB();
  const weekStart = startOfWeek(new Date(weekStartDate), { weekStartsOn: 1 });
  const doc = await WeeklyReflection.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    weekStartDate: weekStart,
  }).lean() as { _id: mongoose.Types.ObjectId; weekStartDate: Date; [key: string]: unknown } | null;
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    weekStartDate: doc.weekStartDate,
  } as { _id: string; weekStartDate: Date; [key: string]: unknown };
}
