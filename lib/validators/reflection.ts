import { z } from "zod";

export const createReflectionSchema = z.object({
  weekStartDate: z.string().transform((s) => new Date(s)),
  whatDidILearn: z.string().optional(),
  whereDidIImprove: z.string().optional(),
  mainChallenge: z.string().optional(),
  autonomyAverage: z.number().min(0).max(10).optional(),
});

export const updateReflectionSchema = createReflectionSchema.partial();

export type CreateReflectionInput = z.infer<typeof createReflectionSchema>;
export type UpdateReflectionInput = z.infer<typeof updateReflectionSchema>;
