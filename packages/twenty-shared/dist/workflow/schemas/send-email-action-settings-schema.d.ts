import { z } from 'zod';
export declare const workflowSendEmailActionSettingsSchema: z.ZodObject<{
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
        connectedAccountId: z.ZodString;
        recipients: z.ZodObject<{
            to: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            cc: z.ZodDefault<z.ZodOptional<z.ZodString>>;
            bcc: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        }, z.core.$strip>;
        subject: z.ZodOptional<z.ZodString>;
        body: z.ZodOptional<z.ZodString>;
        files: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            size: z.ZodNumber;
            type: z.ZodString;
            createdAt: z.ZodString;
        }, z.core.$strip>>>>;
        inReplyTo: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=send-email-action-settings-schema.d.ts.map