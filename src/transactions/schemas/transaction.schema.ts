import mongoose, { Schema } from "mongoose";
import { AgentDocument } from "src/agents/schemas/agent.schema";
import { AgencyDocument } from "src/agencies/schemas/agency.schema";
import { TransactionStageEnum } from "../enums/transaction-stage.enum";

export const TransactionSchema = new Schema(
    {
        propertyId: { type: String, required: true },
        totalServiceFee: { type: Number, required: true, min: 0 },
        agencyId: {
            type: Schema.Types.ObjectId,
            ref: "Agency",
            required: true,
        },
        stage: {
            type: String,
            enum: Object.values(TransactionStageEnum),
            default: TransactionStageEnum.AGREEMENT,
        },
        // Stage change logs
        stageLogs: [
            {
                stage: {
                    type: String,
                    enum: Object.values(TransactionStageEnum),
                },
                timestamp: { type: Date, default: Date.now },
            },
        ],
        listingAgentId: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },
        sellingAgentId: {
            type: Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },
        // Commission breakdown (company + agents)
        financialBreakdown: {
            agencyFee: { type: Number },
            agents: [
                {
                    agentId: {
                        type: Schema.Types.ObjectId,
                        ref: "Agent",
                        required: true,
                    },
                    role: { type: String },
                    amount: { type: Number },
                },
            ],
        },
    },
    { timestamps: true }
);

export interface TransactionDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    propertyId: string;
    totalServiceFee: number;
    agencyId: mongoose.Types.ObjectId | AgencyDocument;
    stage: TransactionStageEnum;
    stageLogs: {
        stage: TransactionStageEnum;
        timestamp: Date;
    }[];
    listingAgentId: mongoose.Types.ObjectId | AgentDocument;
    sellingAgentId: mongoose.Types.ObjectId | AgentDocument;
    financialBreakdown?: {
        agencyFee: number;
        agents: {
            agentId: mongoose.Types.ObjectId | AgentDocument;
            role: string;
            amount: number;
        }[];
    };
    createdAt: Date;
    updatedAt: Date;
}

export const TransactionModel =
    mongoose.models.Transaction ||
    mongoose.model<TransactionDocument>("Transaction", TransactionSchema);
