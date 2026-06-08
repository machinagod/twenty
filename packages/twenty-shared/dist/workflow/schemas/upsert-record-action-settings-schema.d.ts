import { z } from 'zod';
export declare const workflowUpsertRecordActionSettingsSchema: z.ZodObject<{
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
        objectName: z.ZodString;
        objectRecord: z.ZodRecord<z.ZodString, z.ZodAny>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=upsert-record-action-settings-schema.d.ts.map