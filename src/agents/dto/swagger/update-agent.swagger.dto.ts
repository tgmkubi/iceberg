import { PartialType } from "@nestjs/swagger";
import { CreateAgentSwaggerDto } from "./create-agent.swagger.dto";

export class UpdateAgentSwaggerDto extends PartialType(
  CreateAgentSwaggerDto,
) {}
