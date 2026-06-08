import { z } from 'zod';
export declare const workflowIfElseActionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    valid: z.ZodBoolean;
    nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
    }, z.core.$strip>>>;
    type: z.ZodLiteral<"IF_ELSE">;
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
        input: z.ZodObject<{
            stepFilterGroups: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                logicalOperator: z.ZodEnum<typeof import("../../types").StepLogicalOperator>;
                parentStepFilterGroupId: z.ZodOptional<z.ZodString>;
                positionInStepFilterGroup: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            stepFilters: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodString;
                stepOutputKey: z.ZodString;
                operand: z.ZodUnion<[z.ZodEnum<typeof import("../../types").ViewFilterOperand>, z.ZodEnum<typeof import("../../types").ViewFilterOperandDeprecated>]>;
                value: z.ZodString;
                stepFilterGroupId: z.ZodString;
                positionInStepFilterGroup: z.ZodOptional<z.ZodNumber>;
                fieldMetadataId: z.ZodOptional<z.ZodString>;
                compositeFieldSubFieldName: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            branches: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                nextStepIds: z.ZodArray<z.ZodString>;
                filterGroupId: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=if-else-action-schema.d.ts.map