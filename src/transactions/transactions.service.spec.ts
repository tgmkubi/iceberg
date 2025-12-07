import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsService } from "./transactions.service";
import { AgentsService } from "../agents/agents.service";
import { AgenciesService } from "../agencies/agencies.service";
import { TransactionModel } from "./schemas/transaction.schema";
import { TransactionStageEnum } from "./enums/transaction-stage.enum";

jest.mock("./schemas/transaction.schema");

describe("TransactionsService", () => {
  let service: TransactionsService;
  let agentsService: AgentsService;
  let agenciesService: AgenciesService;

  const mockAgentsService = {
    findOne: jest.fn(),
  };

  const mockAgenciesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: AgentsService, useValue: mockAgentsService },
        { provide: AgenciesService, useValue: mockAgenciesService },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    agentsService = module.get<AgentsService>(AgentsService);
    agenciesService = module.get<AgenciesService>(AgenciesService);
  });

  afterEach(() => jest.clearAllMocks());

  // ------------------------------------------------------
  // CREATE
  // ------------------------------------------------------
  it("should create a transaction", async () => {
    mockAgentsService.findOne
      .mockResolvedValueOnce({ agencyId: "AG1" }) // listing agent
      .mockResolvedValueOnce({});                // selling agent

    (TransactionModel.create as jest.Mock).mockResolvedValue({ _id: "1" });

    const result = await service.create({
      propertyId: "P1",
      totalServiceFee: 1000,
      listingAgentId: "A1",
      sellingAgentId: "A2",
    } as any);

    expect(result._id).toBe("1");
    expect(TransactionModel.create).toHaveBeenCalled();
  });

  // ------------------------------------------------------
  // LIST + PAGINATION
  // ------------------------------------------------------
  it("should return paginated transactions", async () => {
    (TransactionModel.find as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([{ _id: "1" }]),
    });

    (TransactionModel.countDocuments as jest.Mock).mockResolvedValue(1);

    const result = await service.findAll({ page: 1, limit: 10 } as any);

    expect(result.items.length).toBe(1);
    expect(result.meta.total).toBe(1);
  });

  // ------------------------------------------------------
  // UPDATE STAGE → COMPLETED triggers commission calc
  // ------------------------------------------------------
  it("should update stage and compute commission on COMPLETED", async () => {
    const trx = {
      _id: "1",
      stage: TransactionStageEnum.TITLE_DEED,
      listingAgentId: "A1",
      sellingAgentId: "A2",
      agencyId: "AG1",
      totalServiceFee: 2000,
      stageLogs: [],
      save: jest.fn(),
    };

    (TransactionModel.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(trx),
    });

    mockAgenciesService.findOne.mockResolvedValue({ commissionRate: 0.5 });

    const result = await service.updateStage("1", TransactionStageEnum.COMPLETED);

    expect(result.stage).toBe(TransactionStageEnum.COMPLETED);
    expect(result.financialBreakdown).toBeDefined();
    expect(trx.save).toHaveBeenCalled();
  });
});
