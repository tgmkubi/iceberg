import { z } from "zod";

export const EnvSchema = z.object({
    MONGO_URI: z.url("MONGO_URI must be a valid MongoDB connection string"),
    PORT: z.string().optional().default("3000"),
});
