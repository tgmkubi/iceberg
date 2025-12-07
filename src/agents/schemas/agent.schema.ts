import mongoose, { Schema } from "mongoose";
import { AgencyDocument } from "src/agencies/schemas/agency.schema";

export const AgentSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        agencyId: {
            type: Schema.Types.ObjectId,
            ref: "Agency",
            required: true,
        },
    },
    { timestamps: true }
);

export interface AgentDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    agencyId: mongoose.Types.ObjectId | AgencyDocument;
    createdAt: Date;
    updatedAt: Date;
}

export const AgentModel =
    mongoose.models.Agent ||
    mongoose.model<AgentDocument>("Agent", AgentSchema);
