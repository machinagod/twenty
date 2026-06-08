import { z } from 'zod';
import { StepLogicalOperator } from '../../types/StepFilters';
export declare const stepFilterGroupSchema: z.ZodObject<{
    id: z.ZodString;
    logicalOperator: z.ZodEnum<typeof StepLogicalOperator>;
    parentStepFilterGroupId: z.ZodOptional<z.ZodString>;
    positionInStepFilterGroup: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=step-filter-group-schema.d.ts.map