import { z } from "zod";
import { zMongoId } from "../../common/validation/zod-mongo-id";

export const CreateAgentSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),

    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),

    agencyId: zMongoId,
});

export type CreateAgentDto = z.infer<typeof CreateAgentSchema>;
