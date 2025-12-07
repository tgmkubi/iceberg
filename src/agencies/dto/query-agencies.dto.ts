import { z } from "zod";

export const QueryAgenciesSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  name: z.string().optional(),
  email: z.string().optional(),
});

export type QueryAgenciesDto = z.infer<typeof QueryAgenciesSchema>;
