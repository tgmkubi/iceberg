import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBody } from "@nestjs/swagger";
import { CreateTransactionSwaggerDto } from "./dto/swagger/create-transaction.swagger.dto";
import { UpdateTransactionSwaggerDto } from "./dto/swagger/update-transaction.swagger.dto";
import { UpdateTransactionStageSwaggerDto } from "./dto/swagger/update-transaction-stage.swagger.dto";
import type { CreateTransactionDto } from './dto/create-transaction.dto';
import type { UpdateTransactionDto } from './dto/update-transaction.dto';
import type { UpdateStageDto } from "./dto/update-stage.dto";
import type { QueryTransactionsDto } from "./dto/query-transactions.dto";


import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { CreateTransactionSchema } from './dto/create-transaction.dto';
import { UpdateTransactionSchema } from './dto/update-transaction.dto';
import { UpdateStageSchema } from "./dto/update-stage.dto";
import { QueryTransactionsSchema } from "./dto/query-transactions.dto";

import { TransactionResponseDto } from "./dto/response/transaction-response.dto";

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  @ApiBody({ type: CreateTransactionSwaggerDto })
  async create(
    @Body(new ZodValidationPipe(CreateTransactionSchema)) dto: CreateTransactionDto,
  ) {
    const trx = await this.transactionsService.create(dto);
    return { message: "Transaction created successfully", data: TransactionResponseDto.from(trx) };
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(QueryTransactionsSchema)) query: QueryTransactionsDto,
  ) {
    const list = await this.transactionsService.findAll(query);
    return { data: list.items.map(TransactionResponseDto.from), meta: list.meta };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const trx = await this.transactionsService.findOne(id);
    return { data: TransactionResponseDto.from(trx) };
  }

  @Patch(":id")
  @ApiBody({ type: UpdateTransactionSwaggerDto })
  async update(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateTransactionSchema)) dto: UpdateTransactionDto
  ) {
    const trx = await this.transactionsService.update(id, dto);
    return { message: "Transaction updated", data: TransactionResponseDto.from(trx) };
  }

  @Patch(":id/stage")
  @ApiBody({ type: UpdateTransactionStageSwaggerDto })
  async updateStage(
    @Param("id") id: string,
    @Body(new ZodValidationPipe(UpdateStageSchema)) body: UpdateStageDto,
  ) {
    const trx = await this.transactionsService.updateStage(id, body.stage);
    return { message: "Transaction stage updated", data: TransactionResponseDto.from(trx) };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.transactionsService.remove(id);
    return { message: "Transaction deleted successfully" };
  }
}
