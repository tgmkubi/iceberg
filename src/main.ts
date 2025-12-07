import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { SuccessResponseInterceptor } from "./common/interceptors/success-response.interceptor";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle("Iceberg API")
    .setDescription("REST API documentation for Iceberg")
    .setVersion("1.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: { persistAuthorization: true },
    customCssUrl: "https://unpkg.com/swagger-ui-dist@4/swagger-ui.css",
    customJs: [
      "https://unpkg.com/swagger-ui-dist@4/swagger-ui-bundle.js",
      "https://unpkg.com/swagger-ui-dist@4/swagger-ui-standalone-preset.js",
    ],
  });

  process.on("SIGINT", async () => {
    console.log("Received SIGINT. Starting graceful shutdown...");
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log("Received SIGTERM. Starting graceful shutdown...");
    await app.close();
    process.exit(0);
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
