export interface CommissionParams {
    totalFee: number;
    listingAgentId: string;
    sellingAgentId: string;
    agencyCommissionRate?: number; // optional, single declaration
}

export interface CommissionResult {
    agencyFee: number;
    agents: {
        agentId: string;
        role: string;
        amount: number;
    }[];
}

export function calculateCommission({
    totalFee,
    listingAgentId,
    sellingAgentId,
    agencyCommissionRate = 0.5, // DEFAULT = %50
}: CommissionParams): CommissionResult {

    if (agencyCommissionRate < 0 || agencyCommissionRate > 1) {
        throw new Error("agencyCommissionRate must be between 0 and 1");
    }

    const agencyFee = totalFee * agencyCommissionRate;
    const agentPool = totalFee - agencyFee;

    const same = listingAgentId === sellingAgentId;

    if (same) {
        return {
            agencyFee,
            agents: [
                {
                    agentId: listingAgentId,
                    role: "listing_selling",
                    amount: agentPool,
                },
            ],
        };
    }

    return {
        agencyFee,
        agents: [
            {
                agentId: listingAgentId,
                role: "listing",
                amount: agentPool / 2,
            },
            {
                agentId: sellingAgentId,
                role: "selling",
                amount: agentPool / 2,
            },
        ],
    };
}
