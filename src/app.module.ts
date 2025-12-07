import {
  Module,
  OnModuleInit,
  NestModule,
  MiddlewareConsumer,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { sanitizedConfig } from "./config";
import { connectDatabase, disconnectDatabase } from "./common/database/database.helper";
import { TransactionsModule } from './transactions/transactions.module';
import { AgentsModule } from './agents/agents.module';
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { AgenciesModule } from './agencies/agencies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionsModule,
    AgentsModule,
    AgenciesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit, NestModule, OnModuleDestroy {
  async onModuleInit() {
    await connectDatabase(sanitizedConfig.mongoUri);
  }

  async onModuleDestroy() {
    await disconnectDatabase();
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
