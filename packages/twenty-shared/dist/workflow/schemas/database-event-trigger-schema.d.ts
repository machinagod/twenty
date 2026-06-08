import { z } from 'zod';
export declare const workflowDatabaseEventTriggerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    type: z.ZodLiteral<"DATABASE_EVENT">;
    settings: z.ZodObject<{
        eventName: z.ZodString;
        input: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        outputSchema: z.ZodObject<{}, z.core.$loose>;
        objectType: z.ZodOptional<z.ZodString>;
        fields: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=database-event-trigger-schema.d.ts.map