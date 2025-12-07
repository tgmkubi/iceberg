import { AgentDocument } from "../../agents/schemas/agent.schema";

export function isPopulatedAgent(
    agent: any
): agent is AgentDocument {
    return agent && typeof agent.fullName === "string";
}
