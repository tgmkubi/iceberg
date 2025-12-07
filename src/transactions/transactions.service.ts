import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionsDto } from "./dto/query-transactions.dto";

import { TransactionStageEnum } from "./enums/transaction-stage.enum";
import { TransactionModel } from "./schemas/transaction.schema";

import { AgentsService } from "../agents/agents.service";
import { AgenciesService } from "../agencies/agencies.service";

import { calculateCommission } from "./utils/commission.util";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly agentsService: AgentsService,
    private readonly agenciesService: AgenciesService
  ) { }

  async create(dto: CreateTransactionDto) {
    const listingAgent = await this.agentsService.findOne(dto.listingAgentId);
    if (!listingAgent) throw new NotFoundException("Listing agent not found");

    const sellingAgent = await this.agentsService.findOne(dto.sellingAgentId);
    if (!sellingAgent) throw new NotFoundException("Selling agent not found");

    const agencyId = listingAgent.agencyId;

    const trx = await TransactionModel.create({
      ...dto,
      agencyId,
      stage: TransactionStageEnum.AGREEMENT,
      stageLogs: [
        {
          stage: TransactionStageEnum.AGREEMENT,
          timestamp: new Date(),
        },
      ],
    });

    return trx;
  }

  async findAll(query: QueryTransactionsDto) {
    const {
      page,
      limit,
      stage,
      listingAgentId,
      sellingAgentId,
      propertyId,
      agencyId,
      sortBy = "createdAt",
      order = "desc",
    } = query;

    const skip = (page - 1) * limit;

    const filter: any = {
      ...(stage ? { stage } : {}),
      ...(listingAgentId ? { listingAgentId } : {}),
      ...(sellingAgentId ? { sellingAgentId } : {}),
      ...(agencyId ? { agencyId } : {}),
      ...(propertyId ? { propertyId: { $regex: propertyId, $options: "i" } } : {}),
    };

    const items = await TransactionModel.find(filter)
      .populate("listingAgentId")
      .populate("sellingAgentId")
      .populate("agencyId")
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await TransactionModel.countDocuments(filter);

    return {
      items,
      meta: {
        total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const trx = await TransactionModel.findById(id)
      .populate("listingAgentId sellingAgentId agencyId")
      .exec();

    if (!trx) throw new NotFoundException("Transaction not found");
    return trx;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const trx = await TransactionModel.findById(id).exec();
    if (!trx) throw new NotFoundException("Transaction not found");

    // Listing agent changed → update agency too
    if (dto.listingAgentId) {
      const listingAgent = await this.agentsService.findOne(dto.listingAgentId);
      if (!listingAgent)
        throw new BadRequestException("Listing agent not found");

      trx.listingAgentId = listingAgent._id;
      trx.agencyId = listingAgent.agencyId;
    }

    if (dto.sellingAgentId) {
      const sellingAgent = await this.agentsService.findOne(dto.sellingAgentId);
      if (!sellingAgent)
        throw new BadRequestException("Selling agent not found");

      trx.sellingAgentId = sellingAgent._id;
    }

    if (dto.propertyId !== undefined) {
      trx.propertyId = dto.propertyId;
    }

    if (dto.totalServiceFee !== undefined) {
      trx.totalServiceFee = dto.totalServiceFee;
    }

    await trx.save();
    return trx;
  }

  async updateStage(id: string, newStage: TransactionStageEnum) {
    const trx = await TransactionModel.findById(id)
      .populate("listingAgentId sellingAgentId agencyId")
      .exec();

    if (!trx) throw new NotFoundException("Transaction not found");

    // Allowed progression order
    const order = [
      TransactionStageEnum.AGREEMENT,
      TransactionStageEnum.EARNEST_MONEY,
      TransactionStageEnum.TITLE_DEED,
      TransactionStageEnum.COMPLETED,
    ];

    const currentIndex = order.indexOf(trx.stage);
    const newIndex = order.indexOf(newStage);

    // Prevent going backwards
    if (newIndex < currentIndex) {
      throw new BadRequestException(
        `Invalid stage transition: cannot move from ${trx.stage} back to ${newStage}`
      );
    }

    trx.stage = newStage;

    trx.stageLogs.push({
      stage: newStage,
      timestamp: new Date(),
    });

    // COMPLETED → calculate financial breakdown
    if (newStage === TransactionStageEnum.COMPLETED) {
      const agencyId =
        (trx.agencyId as any)?._id?.toString() ?? trx.agencyId.toString();

      const agency = await this.agenciesService.findOne(agencyId);

      const listingAgentId =
        (trx.listingAgentId as any)?._id?.toString() ??
        trx.listingAgentId.toString();

      const sellingAgentId =
        (trx.sellingAgentId as any)?._id?.toString() ??
        trx.sellingAgentId.toString();

      const breakdown = calculateCommission({
        totalFee: trx.totalServiceFee,
        listingAgentId,
        sellingAgentId,
        agencyCommissionRate: agency?.commissionRate, // optional with safe access - default %50
      });

      trx.financialBreakdown = breakdown;

    }

    await trx.save();
    return trx;
  }

  async remove(id: string) {
    const trx = await TransactionModel.findById(id);
    if (!trx) throw new NotFoundException("Transaction not found");

    await TransactionModel.deleteOne({ _id: id }).exec();
    return true;
  }
}
