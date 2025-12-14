import { PartialType } from "@nestjs/swagger";
import { CreateAgencySwaggerDto } from "./create-agency.swagger.dto";

export class UpdateAgencySwaggerDto extends PartialType(
  CreateAgencySwaggerDto,
) {}
