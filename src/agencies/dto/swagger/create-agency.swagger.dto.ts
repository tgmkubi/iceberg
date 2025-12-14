import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAgencySwaggerDto {
  @ApiProperty({ example: "Acme Realty" })
  name: string;

  @ApiProperty({ example: "office@acme.com", format: "email" })
  officeEmail: string;

  @ApiPropertyOptional({ example: "+90 555 000 0000" })
  officePhone?: string;

  @ApiPropertyOptional({ example: "İstiklal Cd. No:1, İstanbul" })
  address?: string;

  @ApiPropertyOptional({ example: 0.5, minimum: 0, maximum: 1 })
  commissionRate?: number;
}
