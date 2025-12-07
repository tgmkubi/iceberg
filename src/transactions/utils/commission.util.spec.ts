import { calculateCommission } from "./commission.util";

describe("calculateCommission", () => {
    it("Scenario 1: same agent gets full agent pool (50%)", () => {
        const result = calculateCommission({
            totalFee: 10000,
            listingAgentId: "A1",
            sellingAgentId: "A1",
            agencyCommissionRate: 0.5,
        });

        // 50% agency
        expect(result.agencyFee).toBe(5000);

        // kalan 50% tek ajana
        expect(result.agents.length).toBe(1);
        expect(result.agents[0]).toEqual({
            agentId: "A1",
            role: "listing_selling",
            amount: 5000,
        });
    });

    it("Scenario 2: different agents split agent pool equally", () => {
        const result = calculateCommission({
            totalFee: 10000,
            listingAgentId: "A1",
            sellingAgentId: "A2",
            agencyCommissionRate: 0.5,
        });

        // agency %50
        expect(result.agencyFee).toBe(5000);

        // agent pool = 5000 → 2500 + 2500
        expect(result.agents.length).toBe(2);
        expect(result.agents[0]).toEqual({
            agentId: "A1",
            role: "listing",
            amount: 2500,
        });
        expect(result.agents[1]).toEqual({
            agentId: "A2",
            role: "selling",
            amount: 2500,
        });
    });

    it("defaults to 50% agency commission when not provided", () => {
        const result = calculateCommission({
            totalFee: 8000,
            listingAgentId: "A1",
            sellingAgentId: "A2",
        });

        expect(result.agencyFee).toBe(4000); // 8000 * 0.5
        const agentPool = 8000 - 4000;
        expect(result.agents[0].amount + result.agents[1].amount).toBe(agentPool);
    });

    it("throws if agencyCommissionRate is outside [0, 1]", () => {
        expect(() =>
            calculateCommission({
                totalFee: 10000,
                listingAgentId: "A1",
                sellingAgentId: "A2",
                agencyCommissionRate: 1.5,
            }),
        ).toThrow("agencyCommissionRate must be between 0 and 1");

        expect(() =>
            calculateCommission({
                totalFee: 10000,
                listingAgentId: "A1",
                sellingAgentId: "A2",
                agencyCommissionRate: -0.1,
            }),
        ).toThrow("agencyCommissionRate must be between 0 and 1");
    });
});
