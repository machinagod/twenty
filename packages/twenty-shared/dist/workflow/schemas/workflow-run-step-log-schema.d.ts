import { z } from 'zod';
export declare const workflowRunStepLogSchema: z.ZodObject<{
    details: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"AI_AGENT">;
        modelId: z.ZodString;
        usage: z.ZodObject<{
            inputTokens: z.ZodNumber;
            outputTokens: z.ZodNumber;
            reasoningTokens: z.ZodOptional<z.ZodNumber>;
            cacheReadTokens: z.ZodOptional<z.ZodNumber>;
            cacheCreationTokens: z.ZodOptional<z.ZodNumber>;
            totalTokens: z.ZodNumber;
        }, z.core.$strip>;
        cost: z.ZodObject<{
            totalCostInDollars: z.ZodNumber;
            creditsUsedMicro: z.ZodNumber;
        }, z.core.$strip>;
        nativeWebSearchCallCount: z.ZodNumber;
        toolCalls: z.ZodArray<z.ZodObject<{
            toolName: z.ZodString;
            toolCallId: z.ZodString;
            providerExecuted: z.ZodOptional<z.ZodBoolean>;
            input: z.ZodOptional<z.ZodUnknown>;
            output: z.ZodOptional<z.ZodUnknown>;
            errorMessage: z.ZodOptional<z.ZodString>;
            state: z.ZodEnum<{
                success: "success";
                error: "error";
                started: "started";
                "awaiting-approval": "awaiting-approval";
            }>;
        }, z.core.$strip>>;
        durationMs: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"CODE">;
        durationMs: z.ZodNumber;
        status: z.ZodEnum<{
            SUCCESS: "SUCCESS";
            ERROR: "ERROR";
        }>;
        error: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            type: z.ZodString;
            message: z.ZodString;
            stackTrace: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"HTTP_REQUEST">;
        request: z.ZodObject<{
            method: z.ZodString;
            url: z.ZodString;
            headers: z.ZodRecord<z.ZodString, z.ZodString>;
            body: z.ZodOptional<z.ZodString>;
            bodyBytes: z.ZodOptional<z.ZodNumber>;
            bodyTruncated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
        response: z.ZodOptional<z.ZodObject<{
            status: z.ZodNumber;
            statusText: z.ZodOptional<z.ZodString>;
            headers: z.ZodRecord<z.ZodString, z.ZodString>;
            body: z.ZodOptional<z.ZodString>;
            bodyBytes: z.ZodOptional<z.ZodNumber>;
            bodyTruncated: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>>;
        error: z.ZodOptional<z.ZodString>;
        durationMs: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"EMAIL">;
        mode: z.ZodEnum<{
            SEND: "SEND";
            DRAFT: "DRAFT";
        }>;
        status: z.ZodEnum<{
            SUCCESS: "SUCCESS";
            ERROR: "ERROR";
        }>;
        recipients: z.ZodObject<{
            to: z.ZodArray<z.ZodString>;
            cc: z.ZodOptional<z.ZodArray<z.ZodString>>;
            bcc: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
        subject: z.ZodOptional<z.ZodString>;
        bodyPreview: z.ZodOptional<z.ZodString>;
        bodyBytes: z.ZodOptional<z.ZodNumber>;
        bodyTruncated: z.ZodOptional<z.ZodBoolean>;
        connectedAccountId: z.ZodOptional<z.ZodString>;
        attachmentCount: z.ZodOptional<z.ZodNumber>;
        inReplyTo: z.ZodOptional<z.ZodString>;
        error: z.ZodOptional<z.ZodString>;
        durationMs: z.ZodNumber;
    }, z.core.$strip>], "type">;
    entries: z.ZodArray<z.ZodObject<{
        timestamp: z.ZodString;
        level: z.ZodEnum<{
            error: "error";
            debug: "debug";
            info: "info";
            warn: "warn";
        }>;
        message: z.ZodString;
    }, z.core.$strip>>;
    truncated: z.ZodOptional<z.ZodObject<{
        droppedEntries: z.ZodNumber;
        droppedBytes: z.ZodNumber;
    }, z.core.$strip>>;
    sizeBytes: z.ZodNumber;
}, z.core.$strip>;
export declare const workflowRunStepLogsSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
//# sourceMappingURL=workflow-run-step-log-schema.d.ts.map