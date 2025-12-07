import { AgentMiniDto } from "./agent-mini.dto";

export class CommissionAgentShareDto {
    agent: AgentMiniDto;
    role: string;
    amount: number;

    static from(entity: any): CommissionAgentShareDto {
        const dto = new CommissionAgentShareDto();
        dto.role = entity.role;
        dto.amount = entity.amount;
        dto.agent = AgentMiniDto.from(entity.agentId);
        return dto;
    }
}
