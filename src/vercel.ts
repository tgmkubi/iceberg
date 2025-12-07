import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import serverlessHttp from "serverless-http";
import { connectDatabase } from "./common/database/database.helper";

let cachedHandler;

async function bootstrap() {
    await connectDatabase(process.env.MONGO_URI!);

    const app = await NestFactory.create(AppModule);
    await app.init();
    return serverlessHttp(app.getHttpAdapter().getInstance());
}

export default async function handler(req, res) {
    if (!cachedHandler) {
        cachedHandler = await bootstrap();
    }
    return cachedHandler(req, res);
}
