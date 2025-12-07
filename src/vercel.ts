import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { SuccessResponseInterceptor } from "./common/interceptors/success-response.interceptor";
import serverlessHttp from "serverless-http";

let cached: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, transformOptions: { enableImplicitConversion: true } }));
  app.useGlobalInterceptors(new SuccessResponseInterceptor());
  await app.init(); // no listen
  return serverlessHttp(app.getHttpAdapter().getInstance());
}

export default async function handler(req: any, res: any) {
  if (!cached) cached = await bootstrap();
  return cached(req, res);
}
