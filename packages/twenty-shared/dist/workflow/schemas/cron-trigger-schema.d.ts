import { z } from 'zod';
export declare const workflowCronTriggerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    type: z.ZodLiteral<"CRON">;
    settings: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"DAYS">;
        schedule: z.ZodObject<{
            day: z.ZodNumber;
            hour: z.ZodNumber;
            minute: z.ZodNumber;
        }, z.core.$strip>;
        outputSchema: z.ZodObject<{}, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"HOURS">;
        schedule: z.ZodObject<{
            hour: z.ZodNumber;
            minute: z.ZodNumber;
        }, z.core.$strip>;
        outputSchema: z.ZodObject<{}, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"MINUTES">;
        schedule: z.ZodObject<{
            minute: z.ZodNumber;
        }, z.core.$strip>;
        outputSchema: z.ZodObject<{}, z.core.$loose>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"CUSTOM">;
        pattern: z.ZodString;
        outputSchema: z.ZodObject<{}, z.core.$loose>;
    }, z.core.$strip>], "type">;
}, z.core.$strip>;
//# sourceMappingURL=cron-trigger-schema.d.ts.map