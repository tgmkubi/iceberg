import { Test, TestingModule } from "@nestjs/testing";
import { AgentsService } from "./agents.service";
import { AgentModel } from "./schemas/agent.schema";
import { NotFoundException, BadRequestException } from "@nestjs/common";

// Reusable mock chain for Mongoose Query
function mockQueryChain(returnVal: any) {
  const chain: any = {};

  chain.populate = jest.fn(() => chain);
  chain.skip = jest.fn(() => chain);
  chain.limit = jest.fn(() => chain);
  chain.exec = jest.fn().mockResolvedValue(returnVal);
  // Make the chain awaitable like a Mongoose query
  chain.then = jest.fn((resolve, reject) => Promise.resolve(returnVal).then(resolve, reject));
  chain.catch = jest.fn((reject) => Promise.resolve(returnVal).catch(reject));
  chain.finally = jest.fn((onFinally) => Promise.resolve(returnVal).finally(onFinally));

  return chain;
}

jest.mock("./schemas/agent.schema");

describe("AgentsService", () => {
  let service: AgentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentsService],
    }).compile();

    service = module.get(AgentsService);
    jest.clearAllMocks();
  });

  // --------------------------------------------------------
  // CREATE
  // --------------------------------------------------------
  it("should create an agent", async () => {
    (AgentModel.findOne as jest.Mock).mockResolvedValue(null);

    const dto = {
      firstName: "A",
      lastName: "B",
      email: "a@b.com",
      agencyId: "507f1f77bcf86cd799439011",
    };

    const created = { _id: "1", ...dto };

    (AgentModel.create as jest.Mock).mockResolvedValue(created);

    const result = await service.create(dto);

    expect(result).toEqual(created);
  });

  it("should throw BadRequestException if email exists", async () => {
    (AgentModel.findOne as jest.Mock).mockResolvedValue({ _id: "123" });

    await expect(
      service.create({
        firstName: "A",
        lastName: "B",
        email: "a@b.com",
        agencyId: "507f1f77bcf86cd799439011",
      })
    ).rejects.toThrow(BadRequestException);
  });

  // --------------------------------------------------------
  // FIND ALL
  // --------------------------------------------------------
  it("should return paginated agents list", async () => {
    const agents = [
      { _id: "1", firstName: "A", lastName: "B", email: "a@b.com" },
    ];

    (AgentModel.find as jest.Mock).mockReturnValue(mockQueryChain(agents));

    (AgentModel.countDocuments as jest.Mock).mockResolvedValue(1);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.items.length).toBe(1);
    expect(result.meta.total).toBe(1);
    expect(result.items[0]._id).toBe("1");
  });

  // --------------------------------------------------------
  // FIND ONE
  // --------------------------------------------------------
  it("should return one agent", async () => {
    const agent = { _id: "1", firstName: "X" };

    (AgentModel.findById as jest.Mock).mockReturnValue(mockQueryChain(agent));

    const result = await service.findOne("1");

    expect(result).toEqual(agent);
  });

  it("should throw NotFoundException when agent not found", async () => {
    (AgentModel.findById as jest.Mock).mockReturnValue(mockQueryChain(null));

    await expect(service.findOne("999")).rejects.toThrow(NotFoundException);
  });

  // --------------------------------------------------------
  // UPDATE
  // --------------------------------------------------------
  it("should update an agent", async () => {
    const agent = {
      _id: "1",
      email: "old@test.com",
      save: jest.fn().mockResolvedValue(true),
    };

    (AgentModel.findById as jest.Mock).mockResolvedValue(agent);

    // Update email → ensure findOne returns null (no conflict)
    (AgentModel.findOne as jest.Mock).mockResolvedValue(null);

    await service.update("1", { email: "new@test.com" });

    expect(agent.save).toHaveBeenCalled();
  });

  // --------------------------------------------------------
  // DELETE
  // --------------------------------------------------------
  it("should delete an agent", async () => {
    (AgentModel.findById as jest.Mock).mockResolvedValue({ _id: "1" });
    (AgentModel.deleteOne as jest.Mock).mockResolvedValue(true);

    const result = await service.remove("1");

    expect(result).toBe(true);
  });

  it("should throw NotFoundException when deleting missing agent", async () => {
    (AgentModel.findById as jest.Mock).mockResolvedValue(null);

    await expect(service.remove("999")).rejects.toThrow(NotFoundException);
  });
});
