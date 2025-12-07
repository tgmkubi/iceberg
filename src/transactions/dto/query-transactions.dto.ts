import { z } from "zod";

export const QueryTransactionsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  stage: z.string().optional(),
  listingAgentId: z.string().optional(),
  sellingAgentId: z.string().optional(),
  agencyId: z.string().optional(),
  propertyId: z.string().optional(),

  sortBy: z.string().default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type QueryTransactionsDto = z.infer<typeof QueryTransactionsSchema>;

