import mongoose from "mongoose";
import { AgentDocument } from "../../schemas/agent.schema";

export class AgentResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  agencyId?: string | null;

  createdAt: Date;
  updatedAt: Date;

  static from(agent: AgentDocument): AgentResponseDto {
    const dto = new AgentResponseDto();

    dto.id = agent._id.toString();
    dto.firstName = agent.firstName;
    dto.lastName = agent.lastName;
    dto.email = agent.email;
    dto.phone = agent.phone;

    // AgentDocument agencyId type
    // agencyId: mongoose.Types.ObjectId | AgencyDocument;
    const agency = agent.agencyId as
      | mongoose.Types.ObjectId
      | { _id: mongoose.Types.ObjectId }
      | null
      | undefined;

    if (!agency) {
      // not populated or not set at all
      dto.agencyId = null;
    } else if (agency instanceof mongoose.Types.ObjectId) {
      // ObjectId (not populated)
      dto.agencyId = agency.toHexString();
    } else if (typeof agency === "string") {
      // plain string id (e.g., mocks)
      dto.agencyId = agency;
    } else {
      // populated AgencyDocument
      dto.agencyId = agency._id.toHexString();
    }

    dto.createdAt = agent.createdAt;
    dto.updatedAt = agent.updatedAt;

    return dto;
  }
}
