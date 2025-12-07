import { env } from "./load-env";

export const sanitizedConfig = {
    mongoUri: env.MONGO_URI,
    port: Number(env.PORT),
};
