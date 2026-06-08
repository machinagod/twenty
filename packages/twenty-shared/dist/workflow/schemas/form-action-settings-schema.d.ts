import { z } from 'zod';
import { FieldMetadataType } from '../../types/FieldMetadataType';
export declare const workflowFormActionSettingsSchema: z.ZodObject<{
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
        type: z.ZodUnion<readonly [z.ZodLiteral<FieldMetadataType.TEXT>, z.ZodLiteral<FieldMetadataType.NUMBER>, z.ZodLiteral<FieldMetadataType.DATE>, z.ZodLiteral<FieldMetadataType.SELECT>, z.ZodLiteral<FieldMetadataType.MULTI_SELECT>, z.ZodLiteral<"RECORD">]>;
        placeholder: z.ZodOptional<z.ZodString>;
        settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        value: z.ZodOptional<z.ZodAny>;
    }, z.core.$strip>>;
}, z.core.$strip>;
//# sourceMappingURL=form-action-settings-schema.d.ts.map