import { ApiProperty } from "@nestjs/swagger";

export class UpdateTransactionStageSwaggerDto {
  @ApiProperty({
    enum: ["agreement", "earnest_money", "title_deed", "completed"],
    example: "completed",
  })
  stage: "agreement" | "earnest_money" | "title_deed" | "completed";
}
