import { z } from 'zod';
export declare const workflowFindRecordsActionSettingsSchema: z.ZodObject<{
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
        limit: z.ZodOptional<z.ZodNumber>;
        filter: z.ZodOptional<z.ZodObject<{
            recordFilterGroups: z.ZodOptional<z.ZodArray<z.ZodAny>>;
            recordFilters: z.ZodOptional<z.ZodArray<z.ZodAny>>;
            gqlOperationFilter: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
        }, z.core.$strip>>;
        orderBy: z.ZodOptional<z.ZodObject<{
            recordSorts: z.ZodOptional<z.ZodArray<z.ZodAny>>;
            gqlOperationOrderBy: z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>>>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=find-records-action-settings-schema.d.ts.map