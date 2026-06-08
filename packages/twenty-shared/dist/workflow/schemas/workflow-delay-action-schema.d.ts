import { z } from 'zod';
export declare const workflowDelayActionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    valid: z.ZodBoolean;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    type: z.ZodLiteral<"DELAY">;
    settings: z.ZodObject<{
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
}, z.core.$strip>;
//# sourceMappingURL=workflow-delay-action-schema.d.ts.map