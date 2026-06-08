import { z } from 'zod';
export declare const workflowUpdateRecordActionSettingsSchema: z.ZodObject<{
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
        objectRecordId: z.ZodString;
        fieldsToUpdate: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=update-record-action-settings-schema.d.ts.map