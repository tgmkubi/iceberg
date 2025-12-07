import { TransactionDocument } from "../../schemas/transaction.schema";
import { AgentMiniDto } from "./agent-mini.dto";
import { CommissionBreakdownDto } from "./commission-breakdown.dto";
import { AgentDocument } from "src/agents/schemas/agent.schema";

function isPopulatedAgent(agent: any): agent is AgentDocument {
  return agent && typeof agent.firstName === "string";
}

export class TransactionResponseDto {
  id: string;
  propertyId: string;
  totalServiceFee: number;
  stage: string;

  listingAgent: AgentMiniDto | null;
  sellingAgent: AgentMiniDto | null;

  financialBreakdown?: CommissionBreakdownDto | null;

  createdAt: Date;
  updatedAt: Date;

  static from(trx: TransactionDocument): TransactionResponseDto {
    const dto = new TransactionResponseDto();

    dto.id = trx._id.toString();
    dto.propertyId = trx.propertyId;
    dto.totalServiceFee = trx.totalServiceFee;
    dto.stage = trx.stage;

    dto.listingAgent = isPopulatedAgent(trx.listingAgentId)
      ? AgentMiniDto.from(trx.listingAgentId)
      : null;

    dto.sellingAgent = isPopulatedAgent(trx.sellingAgentId)
      ? AgentMiniDto.from(trx.sellingAgentId)
      : null;

    if (trx.financialBreakdown) {
      dto.financialBreakdown = {
        agencyEarnings: trx.financialBreakdown.agencyFee,
        agents: trx.financialBreakdown.agents.map((a) => ({
          agent: isPopulatedAgent(a.agentId)
            ? AgentMiniDto.from(a.agentId)
            : { id: a.agentId.toString(), firstName: "", lastName: "", email: "" },
          role: a.role,
          amount: a.amount,
        })),
      };
    } else {
      dto.financialBreakdown = null;
    }

    dto.createdAt = trx.createdAt;
    dto.updatedAt = trx.updatedAt;

    return dto;
  }
}
