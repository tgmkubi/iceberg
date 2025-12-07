import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { connectDatabase } from "./common/database/database.helper";

let expressApp: express.Express;
let isAppInitialized = false;

async function bootstrap() {
    if (isAppInitialized && expressApp) {
        return expressApp;
    }

    console.log("🚀 Initializing NestJS app...");

    expressApp = express();

    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        {
            logger: ["error", "warn"],
        }
    );

    // Global prefix (optional)
    app.setGlobalPrefix('api');

    // CORS (if needed)
    app.enableCors();

    await app.init();
    isAppInitialized = true;

    console.log("✅ NestJS app initialized");
    return expressApp;
}

export default async function handler(req, res) {
    try {
        // Parallel DB connection
        const dbPromise = connectDatabase(process.env.MONGO_URI!);

        // Start the app
        const app = await bootstrap();

        // Wait for DB connection (connecting in the background)
        await dbPromise;

        // Handle the request
        return app(req, res);
    } catch (error) {
        console.error("❌ Handler error:", error);

        // Even in case of error, send a response
        if (!res.headersSent) {
            res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
}