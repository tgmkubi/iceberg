import { z } from "zod";

export const EnvSchema = z.object({
    // Allow mongodb(+srv) URI patterns instead of strict URL validation
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    PORT: z.string().optional().default("3000"),
});
