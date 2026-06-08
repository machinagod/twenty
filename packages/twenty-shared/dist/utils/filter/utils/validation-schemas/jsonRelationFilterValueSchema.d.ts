import { z } from 'zod';
export declare const relationFilterValueSchemaObject: z.ZodObject<{
    isCurrentWorkspaceMemberSelected: z.ZodOptional<z.ZodBoolean>;
    isCurrentRecordSelected: z.ZodOptional<z.ZodBoolean>;
    selectedRecordIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const jsonRelationFilterValueSchema: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>, z.ZodObject<{
    isCurrentWorkspaceMemberSelected: z.ZodOptional<z.ZodBoolean>;
    isCurrentRecordSelected: z.ZodOptional<z.ZodBoolean>;
    selectedRecordIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>>;
//# sourceMappingURL=jsonRelationFilterValueSchema.d.ts.map