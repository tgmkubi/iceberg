import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AgenciesModule } from "../agencies/agencies.module";
import { AgentsModule } from "../agents/agents.module";

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [AgenciesModule, AgentsModule],
})
export class TransactionsModule {}
