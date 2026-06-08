import { z } from 'zod';
export declare const workflowManualTriggerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    type: z.ZodLiteral<"MANUAL">;
    settings: z.ZodObject<{
        objectType: z.ZodOptional<z.ZodString>;
        outputSchema: z.ZodObject<{}, z.core.$loose>;
        icon: z.ZodOptional<z.ZodString>;
        isPinned: z.ZodOptional<z.ZodBoolean>;
        availability: z.ZodNullable<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
            type: z.ZodLiteral<"GLOBAL">;
            locations: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"SINGLE_RECORD">;
            objectNameSingular: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
            type: z.ZodLiteral<"BULK_RECORDS">;
            objectNameSingular: z.ZodString;
        }, z.core.$strip>], "type">>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=manual-trigger-schema.d.ts.map