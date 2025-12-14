import { PartialType } from "@nestjs/swagger";
import { CreateTransactionSwaggerDto } from "./create-transaction.swagger.dto";

export class UpdateTransactionSwaggerDto extends PartialType(CreateTransactionSwaggerDto) {}
