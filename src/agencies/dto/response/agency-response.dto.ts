export class AgencyResponseDto {
    id: string;
    name: string;
    officeEmail: string;
    officePhone?: string;
    address?: string;
    commissionRate: number;
    createdAt: Date;
    updatedAt: Date;

    static from(agency: any): AgencyResponseDto {
        const dto = new AgencyResponseDto();

        dto.id = agency._id.toString();
        dto.name = agency.name;
        dto.officeEmail = agency.officeEmail;
        dto.officePhone = agency.officePhone;
        dto.address = agency.address;
        dto.commissionRate = agency.commissionRate;
        dto.createdAt = agency.createdAt;
        dto.updatedAt = agency.updatedAt;

        return dto;
    }
}
