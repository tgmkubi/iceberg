import { AgentDocument } from "src/agents/schemas/agent.schema";

export class AgentMiniDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  static from(agent: AgentDocument): AgentMiniDto {
    const dto = new AgentMiniDto();
    dto.id = agent._id.toString();
    dto.firstName = agent.firstName;
    dto.lastName = agent.lastName;
    dto.email = agent.email;
    return dto;
  }
}
