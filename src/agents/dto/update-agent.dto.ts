import { z } from "zod";
import { zMongoId } from "../../common/validation/zod-mongo-id";

export const UpdateAgentSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),

    email: z.string().email().optional(),
    phone: z.string().optional(),

    agencyId: zMongoId.optional(),
});

export type UpdateAgentDto = z.infer<typeof UpdateAgentSchema>;
