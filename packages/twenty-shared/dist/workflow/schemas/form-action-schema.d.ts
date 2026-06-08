import { z } from 'zod';
export declare const workflowFormActionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    valid: z.ZodBoolean;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    type: z.ZodLiteral<"FORM">;
    settings: z.ZodObject<{
        outputSchema: z.ZodObject<{}, z.core.$loose>;
        errorHandlingOptions: z.ZodObject<{
            retryOnFailure: z.ZodObject<{
                value: z.ZodBoolean;
            }, z.core.$strip>;
            continueOnFailure: z.ZodObject<{
                value: z.ZodBoolean;
            }, z.core.$strip>;
        }, z.core.$strip>;
        input: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            label: z.ZodString;
            type: z.ZodUnion<readonly [z.ZodLiteral<import("../../types").FieldMetadataType.TEXT>, z.ZodLiteral<import("../../types").FieldMetadataType.NUMBER>, z.ZodLiteral<import("../../types").FieldMetadataType.DATE>, z.ZodLiteral<import("../../types").FieldMetadataType.SELECT>, z.ZodLiteral<import("../../types").FieldMetadataType.MULTI_SELECT>, z.ZodLiteral<"RECORD">]>;
            placeholder: z.ZodOptional<z.ZodString>;
            settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
            value: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=form-action-schema.d.ts.map