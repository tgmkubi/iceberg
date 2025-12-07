import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import z, { ZodType } from "zod";

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType<any>) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (err) {
            throw new BadRequestException(z.treeifyError(err));
        }
    }
}
