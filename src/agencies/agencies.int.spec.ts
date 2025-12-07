import { Test, TestingModule } from "@nestjs/testing";
import mongoose from "mongoose";

import { AgenciesController } from "./agencies.controller";
import { AgenciesService } from "./agencies.service";
import { AgencyModel } from "./schemas/agency.schema";

describe("Agencies Integration Test (Pure Mongoose)", () => {
  let module: TestingModule;
  let controller: AgenciesController;
  let service: AgenciesService;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0 && process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    module = await Test.createTestingModule({
      controllers: [AgenciesController],
      providers: [AgenciesService],
    }).compile();

    controller = module.get(AgenciesController);
    service = module.get(AgenciesService);
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await module.close();
    await mongoose.disconnect();
  });

  it("should create an agency", async () => {
    const dto = {
      name: "Test Agency",
      officeEmail: "test@agency.com",
      officePhone: "123",
      address: "Somewhere",
      commissionRate: 0.4,
    };

    const result = await controller.create(dto);

    expect(result.data.name).toBe(dto.name);

    const created = await AgencyModel.findOne({ name: dto.name });
    expect(created).toBeTruthy();
  });

  it("should return all agencies", async () => {
    await AgencyModel.create({ name: "A1", officeEmail: "a1@a.com" });
    await AgencyModel.create({ name: "A2", officeEmail: "a2@a.com" });

    const result = await controller.findAll({
      page: 1,
      limit: 10,
    });

    expect(result.data.length).toBe(2);
    expect(result.data[0].name).toBe("A1");
  });

  it("should return a single agency", async () => {
    const agency = await AgencyModel.create({
      name: "Single",
      officeEmail: "single@a.com",
    });

    const result = await controller.findOne(agency._id.toString());

    expect(result.data.name).toBe("Single");
  });

  it("should update an agency", async () => {
    const agency = await AgencyModel.create({
      name: "Old",
      officeEmail: "old@a.com",
    });

    const result = await controller.update(agency._id.toString(), {
      name: "Updated",
    });

    expect(result.data.name).toBe("Updated");

    const updated = await AgencyModel.findById(agency._id);
    expect(updated!.name).toBe("Updated");
  });

  it("should delete an agency", async () => {
    const agency = await AgencyModel.create({
      name: "Delete",
      officeEmail: "del@a.com",
    });

    const result = await controller.delete(agency._id.toString());
    expect(result.message).toBe("Agency deleted");

    const found = await AgencyModel.findById(agency._id);
    expect(found).toBeNull();
  });

  it("should throw if agency name already exists", async () => {
    await AgencyModel.create({
      name: "Unique",
      officeEmail: "u@a.com",
    });

    await expect(
      controller.create({
        name: "Unique",
        officeEmail: "x@a.com",
      })
    ).rejects.toThrow("Agency name already exists");
  });
});
