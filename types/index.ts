export type EntryType = "project" | "incident" | "study";

export interface DailyEntryDoc {
  _id: string;
  userId: string;
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

export interface WeeklyReflectionDoc {
  _id: string;
  userId: string;
  weekStartDate: Date;
  whatDidILearn?: string;
  whereDidIImprove?: string;
  mainChallenge?: string;
  autonomyAverage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExperimentComplianceLog {
  date: Date;
  completed: boolean;
  value?: number;
}

export interface ExperimentDoc {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  targetMetric: string;
  complianceLog: ExperimentComplianceLog[];
  createdAt: Date;
  updatedAt: Date;
}
