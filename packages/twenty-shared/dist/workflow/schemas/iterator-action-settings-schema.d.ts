import { z } from 'zod';
export declare const workflowIteratorActionSettingsSchema: z.ZodObject<{
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
        items: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodRecord<z.ZodString, z.ZodAny>, z.ZodAny]>>, z.ZodString]>>;
        initialLoopStepIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
        shouldContinueOnIterationFailure: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=iterator-action-settings-schema.d.ts.map