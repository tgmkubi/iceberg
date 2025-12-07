import { CommissionAgentShareDto } from "./commission-agent-share.dto";

export class CommissionBreakdownDto {
    agencyEarnings: number;
    agents: CommissionAgentShareDto[];

    static from(financial: any): CommissionBreakdownDto {
        const dto = new CommissionBreakdownDto();

        dto.agencyEarnings = financial.agencyFee; // schema'ya uygun
        dto.agents = financial.agents.map(CommissionAgentShareDto.from);

        return dto;
    }
}
