import { z } from 'zod';
export declare const baseTriggerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        DATABASE_EVENT: "DATABASE_EVENT";
        MANUAL: "MANUAL";
        CRON: "CRON";
        WEBHOOK: "WEBHOOK";
    }>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
//# sourceMappingURL=base-trigger-schema.d.ts.map