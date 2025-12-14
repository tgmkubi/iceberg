import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAgentSwaggerDto {
    @ApiProperty({ example: "Jane" })
    firstName: string;

    @ApiProperty({ example: "Doe" })
    lastName: string;

    @ApiProperty({ example: "jane@example.com", format: "email" })
    email: string;

    @ApiPropertyOptional({ example: "+90 555 000 0000" })
    phone?: string;

    @ApiProperty({
        example: "656a1b2c3d4e5f6789012345",
        description: "Agency ObjectId",
    })
    agencyId: string;
}
