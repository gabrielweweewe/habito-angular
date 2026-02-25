import mongoose from "mongoose";

export type EntryType = "project" | "incident" | "study";

export interface IDailyEntry {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  projectName?: string;
  entryType: EntryType;
  description?: string;
  learned?: string;
  difficulty?: number;
  autonomyScore?: number;
  deepWorkBlockCompleted: boolean;
  interruptionManagedWell: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dailyEntrySchema = new mongoose.Schema<IDailyEntry>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: Date, required: true, index: true },
    projectName: { type: String },
    entryType: {
      type: String,
      required: true,
      enum: ["project", "incident", "study"],
    },
    description: { type: String },
    learned: { type: String },
    difficulty: { type: Number, min: 1, max: 5 },
    autonomyScore: { type: Number, min: 0, max: 10 },
    deepWorkBlockCompleted: { type: Boolean, default: false },
    interruptionManagedWell: { type: Boolean, default: false },
  },
  { timestamps: true }
);

dailyEntrySchema.index({ userId: 1, date: -1 });

export const DailyEntry =
  mongoose.models.DailyEntry ||
  mongoose.model<IDailyEntry>("DailyEntry", dailyEntrySchema);
