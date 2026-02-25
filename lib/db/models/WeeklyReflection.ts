import mongoose from "mongoose";

export interface IWeeklyReflection {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  weekStartDate: Date;
  whatDidILearn?: string;
  whereDidIImprove?: string;
  mainChallenge?: string;
  autonomyAverage?: number;
  createdAt: Date;
  updatedAt: Date;
}

const weeklyReflectionSchema = new mongoose.Schema<IWeeklyReflection>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weekStartDate: { type: Date, required: true },
    whatDidILearn: { type: String },
    whereDidIImprove: { type: String },
    mainChallenge: { type: String },
    autonomyAverage: { type: Number },
  },
  { timestamps: true }
);

weeklyReflectionSchema.index({ userId: 1, weekStartDate: 1 }, { unique: true });

export const WeeklyReflection =
  mongoose.models.WeeklyReflection ||
  mongoose.model<IWeeklyReflection>("WeeklyReflection", weeklyReflectionSchema);
