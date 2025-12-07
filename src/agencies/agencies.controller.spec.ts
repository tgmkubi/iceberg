import { Test, TestingModule } from "@nestjs/testing";
import { AgenciesController } from "./agencies.controller";
import { AgenciesService } from "./agencies.service";
import { AgencyResponseDto } from "./dto/response/agency-response.dto";

describe("AgenciesController", () => {
  let controller: AgenciesController;
  let service: jest.Mocked<AgenciesService>;

  const mockAgenciesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgenciesController],
      providers: [
        { provide: AgenciesService, useValue: mockAgenciesService },
      ],
    }).compile();

    controller = module.get<AgenciesController>(AgenciesController);
    service = module.get(AgenciesService);
  });

  it("should create an agency", async () => {
    const dto = {
      name: "Test Agency",
      officeEmail: "a@b.com",
      commissionRate: 0.5,
    };

    const createdAgency = {
      _id: "1",
      name: dto.name,
      officeEmail: dto.officeEmail,
      officePhone: "",
      address: "",
      commissionRate: 0.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    service.create.mockResolvedValue(createdAgency);

    const result = await controller.create(dto as any);

    expect(result.data).toEqual(AgencyResponseDto.from(createdAgency));
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("should return all agencies", async () => {
    const agencies = [
      {
        _id: "111",
        name: "Alpha Estates",
        officeEmail: "alpha@est.com",
        officePhone: "5551112233",
        address: "London",
        commissionRate: 0.6,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
      {
        _id: "222",
        name: "Bravo Realty",
        officeEmail: "bravo@realty.com",
        officePhone: "5554445566",
        address: "Manchester",
        commissionRate: 0.4,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ];

    service.findAll.mockResolvedValue({
      items: agencies,
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });

    const result = await controller.findAll({} as any);

    expect(result.data.length).toBe(2);
    expect(result.data[0]).toEqual(AgencyResponseDto.from(agencies[0]));
    expect(result.data[1]).toEqual(AgencyResponseDto.from(agencies[1]));

    expect(result.meta.total).toBe(2);
  });

  it("should return one agency", async () => {
    const agency = {
      _id: "777",
      name: "Solo Agency",
      officeEmail: "solo@test.com",
      commissionRate: 0.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    service.findOne.mockResolvedValue(agency);

    const result = await controller.findOne("777");

    expect(result.data).toEqual(AgencyResponseDto.from(agency));
    expect(service.findOne).toHaveBeenCalledWith("777");
  });

  it("should update an agency", async () => {
    const updateDto = { name: "Updated Name" };

    const updated = {
      _id: "10",
      name: "Updated Name",
      officeEmail: "test@agency.com",
      commissionRate: 0.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;

    service.update.mockResolvedValue(updated);

    const result = await controller.update("10", updateDto as any);

    expect(result.data).toEqual(AgencyResponseDto.from(updated));
    expect(service.update).toHaveBeenCalledWith("10", updateDto);
  });

  it("should delete an agency", async () => {
    service.remove.mockResolvedValue(true);

    const result = await controller.delete("999");

    expect(result.message).toBe("Agency deleted");
    expect(service.remove).toHaveBeenCalledWith("999");
  });
});
