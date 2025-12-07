import { Test, TestingModule } from "@nestjs/testing";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { TransactionResponseDto } from "./dto/response/transaction-response.dto";

describe("TransactionsController", () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStage: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => jest.clearAllMocks());

  it("should create a transaction", async () => {
    const dto = {
      propertyId: "P123",
      totalServiceFee: 5000,
      listingAgentId: "111111111111111111111111",
      sellingAgentId: "222222222222222222222222",
    };

    const trx = {
      _id: "1",
      ...dto,
      stage: "AGREEMENT",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockService.create.mockResolvedValue(trx);

    const result = await controller.create(dto as any);

    expect(result.data).toEqual(TransactionResponseDto.from(trx as any));
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it("should list transactions", async () => {
    const trx = {
      _id: "1",
      propertyId: "A",
      totalServiceFee: 1000,
      stage: "AGREEMENT",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockService.findAll.mockResolvedValue({
      items: [trx],
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
    expect(result.data[0]).toEqual(TransactionResponseDto.from(trx as any));
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it("should return one transaction", async () => {
    const trx = {
      _id: "1",
      propertyId: "A",
      totalServiceFee: 1000,
      stage: "AGREEMENT",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockService.findOne.mockResolvedValue(trx);

    const result = await controller.findOne("1");

    expect(result.data).toEqual(TransactionResponseDto.from(trx as any));
    expect(mockService.findOne).toHaveBeenCalledWith("1");
  });

  it("should update a transaction", async () => {
    const updated = {
      _id: "1",
      propertyId: "Updated",
      totalServiceFee: 2000,
      stage: "AGREEMENT",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockService.update.mockResolvedValue(updated);

    const result = await controller.update("1", { propertyId: "Updated" } as any);

    expect(result.data).toEqual(TransactionResponseDto.from(updated as any));
    expect(mockService.update).toHaveBeenCalledWith("1", { propertyId: "Updated" });
  });

  it("should update a transaction stage", async () => {
    const trx = {
      _id: "1",
      propertyId: "P1",
      totalServiceFee: 2000,
      stage: "COMPLETED",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockService.updateStage.mockResolvedValue(trx);

    const result = await controller.updateStage("1", { stage: "COMPLETED" } as any);

    expect(result.data).toEqual(TransactionResponseDto.from(trx as any));
    expect(mockService.updateStage).toHaveBeenCalledWith("1", "COMPLETED");
  });

  it("should delete a transaction", async () => {
    mockService.remove.mockResolvedValue(true);

    const result = await controller.remove("1");

    expect(result.message).toBe("Transaction deleted successfully");
    expect(mockService.remove).toHaveBeenCalledWith("1");
  });
});
