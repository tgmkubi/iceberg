import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import express from "express";
import { connectDatabase } from "./common/database/database.helper";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { SuccessResponseInterceptor } from "./common/interceptors/success-response.interceptor";

// Cache Express instance globally
let expressApp: express.Express;
let isAppInitialized = false;

async function bootstrap() {
    if (isAppInitialized && expressApp) {
        return expressApp;
    }

    console.log("Initializing NestJS app...");

    // Create Express app
    expressApp = express();

    // Create NestJS app with express adapter
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        {
            logger: ["error", "warn"], // Minimize logs
        }
    );

    // Global filters, pipes, interceptors
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            }
        })
    );
    app.useGlobalInterceptors(new SuccessResponseInterceptor());

    // CORS
    app.enableCors();

    // Swagger Documentation
    const config = new DocumentBuilder()
        .setTitle("Iceberg API")
        .setDescription("REST API documentation for Iceberg - Estate Agency CRM")
        .setVersion("1.0.0")
        .addTag("agencies", "Agency management endpoints")
        .addTag("agents", "Agent management endpoints")
        .addTag("transactions", "Transaction management endpoints")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: "alpha",
            operationsSorter: "alpha",
        },
        customSiteTitle: "Iceberg API Docs",
    });

    await app.init();
    isAppInitialized = true;

    console.log("NestJS app initialized");
    console.log("Swagger docs available at: /api-docs");
    return expressApp;
}

export default async function handler(req, res) {
    try {
        // Start DB connection in parallel (non-blocking)
        const dbPromise = connectDatabase(process.env.MONGO_URI!);

        // Start the app if not already started
        const app = await bootstrap();

        // Wait for DB connection (connecting in the background)
        await dbPromise;

        // Handle the request
        return app(req, res);
    } catch (error) {
        console.error("Handler error:", error);

        // Even in case of error, send a response if headers not sent
        if (!res.headersSent) {
            res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
}