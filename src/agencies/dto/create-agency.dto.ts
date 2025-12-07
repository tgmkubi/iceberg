import { z } from "zod";

export const CreateAgencySchema = z.object({
  name: z.string().min(1, "Agency name is required"),
  officeEmail: z.email("Invalid email format"),
  officePhone: z.string().optional(),
  address: z.string().optional(),

  commissionRate: z
    .number()
    .min(0, "Commission must be between 0 and 1")
    .max(1, "Commission must be between 0 and 1")
    .default(0.5)
    .optional(),
});

export type CreateAgencyDto = z.infer<typeof CreateAgencySchema>;
