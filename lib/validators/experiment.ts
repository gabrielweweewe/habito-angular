import { z } from "zod";

export const complianceLogSchema = z.object({
  date: z.string().transform((s) => new Date(s)),
  completed: z.boolean(),
  value: z.number().optional(),
});

export const createExperimentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  startDate: z.string().transform((s) => new Date(s)),
  endDate: z.string().transform((s) => new Date(s)),
  targetMetric: z.string().min(1, "Métrica alvo é obrigatória"),
});

export const updateExperimentSchema = createExperimentSchema.partial();

export const logComplianceSchema = z.object({
  date: z.string().transform((s) => new Date(s)),
  completed: z.boolean(),
  value: z.number().optional(),
});

export type CreateExperimentInput = z.infer<typeof createExperimentSchema>;
export type UpdateExperimentInput = z.infer<typeof updateExperimentSchema>;
export type LogComplianceInput = z.infer<typeof logComplianceSchema>;
