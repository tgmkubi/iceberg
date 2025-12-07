import { z } from "zod";
import { zMongoId } from "../../common/validation/zod-mongo-id";

export const CreateTransactionSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),

  totalServiceFee: z.coerce
    .number()
    .min(0, "Service fee cannot be negative"),

  listingAgentId: zMongoId,
  sellingAgentId: zMongoId,
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
