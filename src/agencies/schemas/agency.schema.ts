import mongoose, { Schema } from "mongoose";

export const AgencySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        officeEmail: { type: String, required: true },
        officePhone: { type: String },
        address: { type: String },
        // Commission rate for the agency (e.g., 0.5 = %50 company share)
        commissionRate: { type: Number, default: 0.5, min: 0, max: 1 },
    },
    { timestamps: true }
);

export interface AgencyDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    officeEmail: string;
    officePhone?: string;
    address?: string;
    commissionRate: number;
    createdAt: Date;
    updatedAt: Date;
}

export const AgencyModel =
    mongoose.models.Agency ||
    mongoose.model<AgencyDocument>("Agency", AgencySchema);
