import { z } from 'zod';
export declare const workflowRunStatusSchema: z.ZodEnum<{
    NOT_STARTED: "NOT_STARTED";
    RUNNING: "RUNNING";
    STOPPED: "STOPPED";
    FAILED: "FAILED";
    COMPLETED: "COMPLETED";
    ENQUEUED: "ENQUEUED";
    STOPPING: "STOPPING";
}>;
//# sourceMappingURL=workflow-run-status-schema.d.ts.map