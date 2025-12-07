import * as dotenv from "dotenv";
import { EnvSchema } from "./env.schema";
import { z } from "zod";

dotenv.config();

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(JSON.stringify(z.treeifyError(parsed.error), null, 2));
    process.exit(1); // App should not start
}

export const env = parsed.data;
