import { z } from 'zod';
export declare const workflowRunStateStepInfosSchema: z.ZodRecord<z.ZodString, z.ZodObject<{
    result: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodAny>;
    status: z.ZodEnum<typeof import("..").StepStatus>;
    history: z.ZodOptional<z.ZodArray<z.ZodObject<{
        error: z.ZodOptional<z.ZodAny>;
        status: z.ZodEnum<typeof import("..").StepStatus>;
        result: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>>>;
}, z.core.$strip>>;
//# sourceMappingURL=workflow-run-state-step-infos-schema.d.ts.map