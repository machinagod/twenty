import { z } from 'zod';
export declare const workflowDelayActionSettingsSchema: z.ZodObject<{
    outputSchema: z.ZodObject<{}, z.core.$loose>;
    errorHandlingOptions: z.ZodObject<{
        retryOnFailure: z.ZodObject<{
            value: z.ZodBoolean;
        }, z.core.$strip>;
        continueOnFailure: z.ZodObject<{
            value: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>;
    input: z.ZodObject<{
        delayType: z.ZodEnum<{
            SCHEDULED_DATE: "SCHEDULED_DATE";
            DURATION: "DURATION";
        }>;
        scheduledDateTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        duration: z.ZodOptional<z.ZodObject<{
            days: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            hours: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            minutes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            seconds: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=workflow-delay-action-settings-schema.d.ts.map