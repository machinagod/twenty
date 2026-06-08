import { ViewFilterOperandDeprecated } from '@/types';
import { z } from 'zod';
import { ViewFilterOperand } from '../../types/ViewFilterOperand';
export declare const stepFilterSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    stepOutputKey: z.ZodString;
    operand: z.ZodUnion<[z.ZodEnum<typeof ViewFilterOperand>, z.ZodEnum<typeof ViewFilterOperandDeprecated>]>;
    value: z.ZodString;
    stepFilterGroupId: z.ZodString;
    positionInStepFilterGroup: z.ZodOptional<z.ZodNumber>;
    fieldMetadataId: z.ZodOptional<z.ZodString>;
    compositeFieldSubFieldName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=step-filter-schema.d.ts.map