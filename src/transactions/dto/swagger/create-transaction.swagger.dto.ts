import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTransactionSwaggerDto {
    @ApiProperty({
        example: "PROP-123",
        description: "External or internal property identifier",
    })
    propertyId: string;

    @ApiProperty({
        example: 100000,
        minimum: 0,
        description: "Total service fee for the transaction",
    })
    totalServiceFee: number;

    @ApiProperty({
        example: "656a1b2c3d4e5f6789012345",
        description: "Listing agent MongoDB ObjectId",
    })
    listingAgentId: string;

    @ApiProperty({
        example: "656a1b2c3d4e5f6789012346",
        description: "Selling agent MongoDB ObjectId",
    })
    sellingAgentId: string;
}
