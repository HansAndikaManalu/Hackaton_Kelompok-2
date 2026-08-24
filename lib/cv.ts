import { z } from "zod";

export const cvSchema = z.object({
  full_name: z.string(),
  summary: z.string(),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      points: z.array(z.string()),
    }),
  ),
  education: z.array(z.string()),
  skills: z.array(z.string()),
});

export type CVData = z.infer<typeof cvSchema>;
