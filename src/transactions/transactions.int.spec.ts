import { Test, TestingModule } from "@nestjs/testing";
import mongoose from "mongoose";

import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { AgentsService } from "../agents/agents.service";
import { AgenciesService } from "../agencies/agencies.service";

import { TransactionModel } from "./schemas/transaction.schema";
import { AgentModel } from "../agents/schemas/agent.schema";
import { AgencyModel } from "../agencies/schemas/agency.schema";

import { TransactionStageEnum } from "./enums/transaction-stage.enum";

describe("Transactions Integration Test (Pure Mongoose)", () => {
    let module: TestingModule;
    let controller: TransactionsController;

    beforeAll(async () => {
        if (mongoose.connection.readyState === 0 && process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        module = await Test.createTestingModule({
            controllers: [TransactionsController],
            // providers: [TransactionsService],
            providers: [
                TransactionsService,
                AgentsService,
                AgenciesService,
            ],

        }).compile();

        controller = module.get(TransactionsController);
    });

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await TransactionModel.deleteMany({});
        await AgentModel.deleteMany({});
        await AgencyModel.deleteMany({});
    });

    it("should create a transaction", async () => {
        const agency = await AgencyModel.create({
            name: "A1",
            officeEmail: "a@a.com",
        });

        const agent1 = await AgentModel.create({
            firstName: "L",
            lastName: "A",
            email: "l@a.com",
            agencyId: agency._id,
        });

        const agent2 = await AgentModel.create({
            firstName: "S",
            lastName: "B",
            email: "s@b.com",
            agencyId: agency._id,
        });

        const dto = {
            propertyId: "prop1",
            listingAgentId: agent1._id.toString(),
            sellingAgentId: agent2._id.toString(),
            totalServiceFee: 1000,
            agencyId: agency._id.toString(),
        };

        const result = await controller.create(dto);

        expect(result.data.propertyId).toBe("prop1");

        const created = await TransactionModel.findOne({ propertyId: "prop1" });
        expect(created).toBeTruthy();
    });

    it("should list transactions", async () => {
        const agency = await AgencyModel.create({
            name: "A1",
            officeEmail: "a@a.com",
        });

        const agent = await AgentModel.create({
            firstName: "L",
            lastName: "A",
            email: "l@a.com",
            agencyId: agency._id,
        });

        await TransactionModel.create({
            propertyId: "p1",
            listingAgentId: agent._id,
            sellingAgentId: agent._id,
            totalServiceFee: 500,
            agencyId: agency._id,
        });

        const result = await controller.findAll({
            page: 1,
            limit: 10,
            sortBy: "createdAt",
            order: "desc",
        });


        expect(result.data.length).toBe(1);
        expect(result.data[0].propertyId).toBe("p1");
    });

    it("should get one transaction", async () => {
        const agency = await AgencyModel.create({
            name: "A1",
            officeEmail: "a@a.com",
        });

        const agent = await AgentModel.create({
            firstName: "L",
            lastName: "A",
            email: "l@a.com",
            agencyId: agency._id,
        });

        const trx = await TransactionModel.create({
            propertyId: "one",
            listingAgentId: agent._id,
            sellingAgentId: agent._id,
            totalServiceFee: 700,
            agencyId: agency._id,
        });

        const result = await controller.findOne(trx._id.toString());

        expect(result.data.propertyId).toBe("one");
    });

    it("should update a transaction", async () => {
        const agency = await AgencyModel.create({ name: "A", officeEmail: "x@x.com" });
        const agent = await AgentModel.create({
            firstName: "F",
            lastName: "L",
            email: "f@l.com",
            agencyId: agency._id,
        });

        const trx = await TransactionModel.create({
            propertyId: "old",
            listingAgentId: agent._id,
            sellingAgentId: agent._id,
            totalServiceFee: 222,
            agencyId: agency._id,
        });

        const result = await controller.update(trx._id.toString(), {
            propertyId: "updated",
        });

        expect(result.data.propertyId).toBe("updated");

        const updated = await TransactionModel.findById(trx._id);
        expect(updated!.propertyId).toBe("updated");
    });

    it("should update stage and compute commission when COMPLETED", async () => {
        const agency = await AgencyModel.create({ name: "A", officeEmail: "x@x.com" });

        const agent = await AgentModel.create({
            firstName: "F",
            lastName: "L",
            email: "f@l.com",
            agencyId: agency._id,
        });

        const trx = await TransactionModel.create({
            propertyId: "done",
            listingAgentId: agent._id,
            sellingAgentId: agent._id,
            totalServiceFee: 1000,
            agencyId: agency._id,
            stage: TransactionStageEnum.AGREEMENT,
        });

        const result = await controller.updateStage(trx._id.toString(), {
            stage: TransactionStageEnum.COMPLETED,
        });

        expect(result.data.stage).toBe(TransactionStageEnum.COMPLETED);
        expect(result.data.financialBreakdown?.agencyEarnings).toBeGreaterThan(0);
    });


    it("should delete a transaction", async () => {
        const agency = await AgencyModel.create({ name: "A", officeEmail: "x@x.com" });

        const agent = await AgentModel.create({
            firstName: "D",
            lastName: "L",
            email: "d@l.com",
            agencyId: agency._id,
        });

        const trx = await TransactionModel.create({
            propertyId: "toDelete",
            listingAgentId: agent._id,
            sellingAgentId: agent._id,
            totalServiceFee: 111,
            agencyId: agency._id,
        });

        const result = await controller.remove(trx._id.toString());

        expect(result.message).toBe("Transaction deleted successfully");

        const found = await TransactionModel.findById(trx._id);
        expect(found).toBeNull();
    });
});
