import mongoose from "mongoose";

export interface IComplianceLog {
  date: Date;
  completed: boolean;
  value?: number;
}

export interface IExperiment {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  targetMetric: string;
  complianceLog: IComplianceLog[];
  createdAt: Date;
  updatedAt: Date;
}

const complianceLogSchema = new mongoose.Schema<IComplianceLog>(
  {
    date: { type: Date, required: true },
    completed: { type: Boolean, required: true },
    value: { type: Number },
  },
  { _id: false }
);

const experimentSchema = new mongoose.Schema<IExperiment>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    targetMetric: { type: String, required: true },
    complianceLog: { type: [complianceLogSchema], default: [] },
  },
  { timestamps: true }
);

export const Experiment =
  mongoose.models.Experiment ||
  mongoose.model<IExperiment>("Experiment", experimentSchema);
