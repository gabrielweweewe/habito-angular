import { z } from "zod";

export const entryTypeEnum = z.enum(["project", "incident", "study"]);

export const createEntrySchema = z.object({
  date: z.string().transform((s) => new Date(s)),
  projectName: z.string().optional(),
  entryType: entryTypeEnum,
  description: z.string().optional(),
  learned: z.string().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  autonomyScore: z.number().min(0).max(10).optional(),
  deepWorkBlockCompleted: z.boolean().default(false),
  interruptionManagedWell: z.boolean().default(false),
});

export const updateEntrySchema = createEntrySchema.partial();

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
