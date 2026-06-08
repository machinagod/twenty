import { z } from 'zod';
export declare const baseWorkflowActionSettingsSchema: z.ZodObject<{
    input: z.ZodObject<{}, z.core.$loose>;
    outputSchema: z.ZodObject<{}, z.core.$loose>;
    errorHandlingOptions: z.ZodObject<{
        retryOnFailure: z.ZodObject<{
            value: z.ZodBoolean;
        }, z.core.$strip>;
        continueOnFailure: z.ZodObject<{
            value: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=base-workflow-action-settings-schema.d.ts.map