import { Test, TestingModule } from "@nestjs/testing";
import mongoose from "mongoose";

import { AgentsController } from "./agents.controller";
import { AgentsService } from "./agents.service";
import { AgentModel } from "./schemas/agent.schema";
import { AgencyModel } from "../agencies/schemas/agency.schema";

describe("Agents Integration Test (Pure Mongoose)", () => {
    let module: TestingModule;
    let controller: AgentsController;

    beforeAll(async () => {
        // MongoMemoryServer global setup ayakta ise tekrar bağlanmaya gerek yok
        if (mongoose.connection.readyState === 0 && process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
        }

        // Mongoose'a Agency modelini registeration
        if (!mongoose.models.Agency) {
            mongoose.model("Agency", AgencyModel.schema);
        }

        module = await Test.createTestingModule({
            controllers: [AgentsController],
            providers: [AgentsService],
        }).compile();

        controller = module.get(AgentsController);
    });

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        // Her testten önce DB temizliği
        await AgentModel.deleteMany({});
    });

    it("should create an agent", async () => {
        const dto = {
            firstName: "John",
            lastName: "Doe",
            email: "john@test.com",
            agencyId: "507f1f77bcf86cd799439011",
        };

        const result = await controller.create(dto);

        expect(result.data.email).toBe(dto.email);

        const created = await AgentModel.findOne({ email: dto.email });
        expect(created).toBeTruthy();
    });

    it("should return all agents", async () => {
        await AgentModel.create({
            firstName: "A",
            lastName: "One",
            email: "a@a.com",
            agencyId: "507f1f77bcf86cd799439011",
        });

        await AgentModel.create({
            firstName: "B",
            lastName: "Two",
            email: "b@b.com",
            agencyId: "507f1f77bcf86cd799439011",
        });

        const result = await controller.findAll({
            page: 1,
            limit: 10,
        });

        expect(result.data.length).toBe(2);
        expect(result.data[0].email).toBe("a@a.com");
    });

    it("should return one agent", async () => {
        const agent = await AgentModel.create({
            firstName: "Single",
            lastName: "Agent",
            email: "single@test.com",
            agencyId: "507f1f77bcf86cd799439011",
        });

        const result = await controller.findOne(agent._id.toString());

        expect(result.data.email).toBe("single@test.com");
    });

    it("should update an agent", async () => {
        const agent = await AgentModel.create({
            firstName: "Old",
            lastName: "Name",
            email: "old@test.com",
            agencyId: "507f1f77bcf86cd799439011",
        });

        const result = await controller.update(agent._id.toString(), {
            firstName: "Updated",
        });

        expect(result.data.firstName).toBe("Updated");

        const updated = await AgentModel.findById(agent._id);
        expect(updated!.firstName).toBe("Updated");
    });

    it("should delete an agent", async () => {
        const agent = await AgentModel.create({
            firstName: "ToDelete",
            lastName: "L",
            email: "delete@test.com",
            agencyId: "507f1f77bcf86cd799439011",
        });

        const result = await controller.remove(agent._id.toString());
        expect(result.message).toBe("Agent deleted successfully");

        const found = await AgentModel.findById(agent._id);
        expect(found).toBeNull();
    });

    it("should throw if email already exists", async () => {
        await AgentModel.create({
            firstName: "A",
            lastName: "B",
            email: "exists@test.com",
            agencyId: "507f1f77bcf86cd799439011",
        });

        await expect(
            controller.create({
                firstName: "X",
                lastName: "Y",
                email: "exists@test.com",
                agencyId: "507f1f77bcf86cd799439011",
            })
        ).rejects.toThrow("Agent with this email already exists");
    });
});
