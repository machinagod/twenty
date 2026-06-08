import { z } from 'zod';
export declare const workflowWebhookTriggerSchema: z.ZodObject<{
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
}, z.core.$strip>;
//# sourceMappingURL=webhook-trigger-schema.d.ts.map