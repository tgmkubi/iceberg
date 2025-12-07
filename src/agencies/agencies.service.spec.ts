import { BadRequestException, NotFoundException } from "@nestjs/common";
import { AgenciesService } from "./agencies.service";

import { AgencyModel } from "./schemas/agency.schema";
import { AgentModel } from "../agents/schemas/agent.schema";

jest.mock("./schemas/agency.schema");
jest.mock("../agents/schemas/agent.schema");

describe("AgenciesService", () => {
  let service: AgenciesService;

  beforeEach(() => {
    service = new AgenciesService();

    jest.clearAllMocks();
  });

  it("should create an agency", async () => {
    (AgencyModel.findOne as any).mockResolvedValue(null);
    (AgencyModel.create as any).mockResolvedValue({
      _id: "123",
      name: "Test Agency",
    });

    const result = await service.create({
      name: "Test Agency",
      officeEmail: "test@mail.com",
    });

    expect(result.name).toBe("Test Agency");
  });

  it("should throw when agency name already exists", async () => {
    (AgencyModel.findOne as any).mockResolvedValue({ _id: "123" });

    await expect(
      service.create({
        name: "Test Agency",
        officeEmail: "test@mail.com",
      })
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw if agency not found", async () => {
    (AgencyModel.findById as any).mockResolvedValue(null);

    await expect(service.findOne("123")).rejects.toThrow(NotFoundException);
  });

  it("should update an agency", async () => {
    (AgencyModel.findById as any).mockResolvedValue({
      _id: "123",
      name: "Old",
      save: jest.fn().mockResolvedValue(true),
    });

    (AgencyModel.findOne as any).mockResolvedValue(null);

    const res = await service.update("123", { name: "New" });

    expect(res.name).toBe("New");
  });

  it("should prevent duplicate name on update", async () => {
    (AgencyModel.findById as any).mockResolvedValue({
      _id: "123",
      name: "Old",
    });

    (AgencyModel.findOne as any).mockResolvedValue({ _id: "999", name: "New" });

    await expect(
      service.update("123", { name: "New" })
    ).rejects.toThrow(BadRequestException);
  });

  it("should throw if agency has agents", async () => {
    (AgencyModel.findById as any).mockResolvedValue({ _id: "123" });
    (AgentModel.countDocuments as any).mockResolvedValue(3);

    await expect(service.remove("123")).rejects.toThrow(BadRequestException);
  });

  it("should delete agency successfully", async () => {
    (AgencyModel.findById as any).mockResolvedValue({ _id: "123" });
    (AgentModel.countDocuments as any).mockResolvedValue(0);
    (AgencyModel.deleteOne as any).mockResolvedValue(true);

    const result = await service.remove("123");
    expect(result).toBe(true);
  });
});
