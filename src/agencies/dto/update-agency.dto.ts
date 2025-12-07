import { z } from "zod";
import { CreateAgencySchema } from "./create-agency.dto";

export const UpdateAgencySchema = CreateAgencySchema.partial();

export type UpdateAgencyDto = z.infer<typeof UpdateAgencySchema>;

