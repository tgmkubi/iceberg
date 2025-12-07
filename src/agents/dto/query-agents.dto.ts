import { z } from "zod";

export const QueryAgentsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  search: z.string().optional(),
  agencyId: z.string().optional(),
});

export type QueryAgentsDto = z.infer<typeof QueryAgentsSchema>;
