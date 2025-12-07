import { z } from "zod";
import { TransactionStageEnum } from "../enums/transaction-stage.enum";

export const UpdateStageSchema = z.object({
  stage: z.enum(TransactionStageEnum),
});

export type UpdateStageDto = z.infer<typeof UpdateStageSchema>;
