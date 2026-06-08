import { z } from 'zod';
export declare const workflowTriggerSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    type: z.ZodLiteral<"WEBHOOK">;
    settings: z.ZodDiscriminatedUnion<[z.ZodObject<{
        outputSchema: z.ZodObject<{}, z.core.$loose>;
        httpMethod: z.ZodLiteral<"GET">;
        authentication: z.ZodNullable<z.ZodLiteral<"API_KEY">>;
    }, z.core.$strip>, z.ZodObject<{
        outputSchema: z.ZodObject<{}, z.core.$loose>;
        httpMethod: z.ZodLiteral<"POST">;
        expectedBody: z.ZodObject<{}, z.core.$loose>;
        authentication: z.ZodNullable<z.ZodLiteral<"API_KEY">>;
    }, z.core.$strip>], "httpMethod">;
}, z.core.$strip>], "type">;
//# sourceMappingURL=workflow-trigger-schema.d.ts.map