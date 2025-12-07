import { Test, TestingModule } from "@nestjs/testing";
import { AgentsController } from "./agents.controller";
import { AgentsService } from "./agents.service";
import { AgentResponseDto } from "./dto/response/agent-response.dto";

describe("AgentsController", () => {
  let controller: AgentsController;
  let service: jest.Mocked<AgentsService>;

  const mockAgentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [
        { provide: AgentsService, useValue: mockAgentsService },
      ],
    }).compile();

    controller = module.get<AgentsController>(AgentsController);
    service = module.get(AgentsService);
  });

  afterEach(() => jest.clearAllMocks());

  it("should create an agent", async () => {
    const dto = {
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      agencyId: "507f1f77bcf86cd799439011",
    };

    const createdAgent = {
      _id: "507f1f77bcf86cd799439012",
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    service.create.mockResolvedValue(createdAgent);

    const result = await controller.create(dto);

    expect(result.message).toBe("Agent created successfully");
    expect(result.data).toEqual(AgentResponseDto.from(createdAgent));
  });

  it("should return all agents", async () => {
    const agents = [
      {
        _id: "507f1f77bcf86cd799439012",
        firstName: "A",
        lastName: "B",
        email: "a@b.com",
        agencyId: "507f1f77bcf86cd799439011",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ];

    service.findAll.mockResolvedValue({
      items: agents,
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });

    const result = await controller.findAll({ page: 1, limit: 10 } as any);

    expect(result.data.length).toBe(1);
    expect(result.data[0]).toEqual(AgentResponseDto.from(agents[0]));
    expect(service.findAll).toHaveBeenCalled();
  });

  it("should return a single agent", async () => {
    const agent = {
      _id: "507f1f77bcf86cd799439012",
      firstName: "X",
      lastName: "Y",
      email: "x@y.com",
      agencyId: "507f1f77bcf86cd799439011",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    service.findOne.mockResolvedValue(agent);

    const result = await controller.findOne("1");

    expect(result.data).toEqual(AgentResponseDto.from(agent));
    expect(service.findOne).toHaveBeenCalledWith("1");
  });

  it("should update an agent", async () => {
    const updated = {
      _id: "507f1f77bcf86cd799439012",
      firstName: "Updated",
      lastName: "Name",
      email: "updated@test.com",
      agencyId: "507f1f77bcf86cd799439011",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    service.update.mockResolvedValue(updated);

    const result = await controller.update("1", { firstName: "Updated" });

    expect(result.message).toBe("Agent updated successfully");
    expect(result.data).toEqual(AgentResponseDto.from(updated));
    expect(service.update).toHaveBeenCalledWith("1", { firstName: "Updated" });
  });

  it("should delete an agent", async () => {
    service.remove.mockResolvedValue(true);

    const result = await controller.remove("1");

    expect(result.message).toBe("Agent deleted successfully");
    expect(service.remove).toHaveBeenCalledWith("1");
  });
});
