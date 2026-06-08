import { z } from 'zod';
export declare const workflowRunStateSchema: z.ZodObject<{
    flow: z.ZodObject<{
        trigger: z.ZodDiscriminatedUnion<[z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            type: z.ZodLiteral<"DATABASE_EVENT">;
            settings: z.ZodObject<{
                eventName: z.ZodString;
                input: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
                outputSchema: z.ZodObject<{}, z.core.$loose>;
                objectType: z.ZodOptional<z.ZodString>;
                fields: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            type: z.ZodLiteral<"MANUAL">;
            settings: z.ZodObject<{
                objectType: z.ZodOptional<z.ZodString>;
                outputSchema: z.ZodObject<{}, z.core.$loose>;
                icon: z.ZodOptional<z.ZodString>;
                isPinned: z.ZodOptional<z.ZodBoolean>;
                availability: z.ZodNullable<z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
                    type: z.ZodLiteral<"GLOBAL">;
                    locations: z.ZodOptional<z.ZodArray<z.ZodString>>;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"SINGLE_RECORD">;
                    objectNameSingular: z.ZodString;
                }, z.core.$strip>, z.ZodObject<{
                    type: z.ZodLiteral<"BULK_RECORDS">;
                    objectNameSingular: z.ZodString;
                }, z.core.$strip>], "type">>>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            type: z.ZodLiteral<"CRON">;
            settings: z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"DAYS">;
                schedule: z.ZodObject<{
                    day: z.ZodNumber;
                    hour: z.ZodNumber;
                    minute: z.ZodNumber;
                }, z.core.$strip>;
                outputSchema: z.ZodObject<{}, z.core.$loose>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"HOURS">;
                schedule: z.ZodObject<{
                    hour: z.ZodNumber;
                    minute: z.ZodNumber;
                }, z.core.$strip>;
                outputSchema: z.ZodObject<{}, z.core.$loose>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"MINUTES">;
                schedule: z.ZodObject<{
                    minute: z.ZodNumber;
                }, z.core.$strip>;
                outputSchema: z.ZodObject<{}, z.core.$loose>;
            }, z.core.$strip>, z.ZodObject<{
                type: z.ZodLiteral<"CUSTOM">;
                pattern: z.ZodString;
                outputSchema: z.ZodObject<{}, z.core.$loose>;
            }, z.core.$strip>], "type">;
        }, z.core.$strip>, z.ZodObject<{
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
        }, z.core.$strip>], "type">;
        steps: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"CODE">;
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
                    logicFunctionId: z.ZodString;
                    logicFunctionInput: z.ZodRecord<z.ZodString, z.ZodAny>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"LOGIC_FUNCTION">;
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
                    logicFunctionId: z.ZodString;
                    logicFunctionInput: z.ZodRecord<z.ZodString, z.ZodAny>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"SEND_EMAIL">;
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
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"DRAFT_EMAIL">;
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
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"CREATE_RECORD">;
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
                    objectName: z.ZodString;
                    objectRecord: z.ZodRecord<z.ZodString, z.ZodAny>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"UPDATE_RECORD">;
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
                    objectName: z.ZodString;
                    objectRecord: z.ZodRecord<z.ZodString, z.ZodAny>;
                    objectRecordId: z.ZodString;
                    fieldsToUpdate: z.ZodArray<z.ZodString>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"DELETE_RECORD">;
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
                    objectName: z.ZodString;
                    objectRecordId: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"UPSERT_RECORD">;
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
                    objectName: z.ZodString;
                    objectRecord: z.ZodRecord<z.ZodString, z.ZodAny>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"FIND_RECORDS">;
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
        }, z.core.$strip>, z.ZodObject<{
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
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"HTTP_REQUEST">;
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
                    url: z.ZodString;
                    method: z.ZodEnum<{
                        GET: "GET";
                        POST: "POST";
                        PUT: "PUT";
                        PATCH: "PATCH";
                        DELETE: "DELETE";
                    }>;
                    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                    body: z.ZodOptional<z.ZodUnion<[z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>]>>, z.ZodString]>>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"AI_AGENT">;
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
                    agentId: z.ZodOptional<z.ZodString>;
                    prompt: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"FILTER">;
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
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
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
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"ITERATOR">;
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
                    items: z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodRecord<z.ZodString, z.ZodAny>, z.ZodAny]>>, z.ZodString]>>;
                    initialLoopStepIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
                    shouldContinueOnIterationFailure: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"DELAY">;
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
                    delayType: z.ZodEnum<{
                        SCHEDULED_DATE: "SCHEDULED_DATE";
                        DURATION: "DURATION";
                    }>;
                    scheduledDateTime: z.ZodOptional<z.ZodNullable<z.ZodString>>;
                    duration: z.ZodOptional<z.ZodObject<{
                        days: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
                        hours: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
                        minutes: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
                        seconds: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
                    }, z.core.$strip>>;
                }, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            valid: z.ZodBoolean;
            nextStepIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString>>>;
            position: z.ZodNullable<z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, z.core.$strip>>>;
            type: z.ZodLiteral<"EMPTY">;
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
                input: z.ZodObject<{}, z.core.$strip>;
            }, z.core.$strip>;
        }, z.core.$strip>], "type">>;
    }, z.core.$strip>;
    stepInfos: z.ZodRecord<z.ZodString, z.ZodObject<{
        result: z.ZodOptional<z.ZodAny>;
        error: z.ZodOptional<z.ZodAny>;
        status: z.ZodEnum<typeof import("..").StepStatus>;
        history: z.ZodOptional<z.ZodArray<z.ZodObject<{
            error: z.ZodOptional<z.ZodAny>;
            status: z.ZodEnum<typeof import("..").StepStatus>;
            result: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>;
    workflowRunError: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
//# sourceMappingURL=workflow-run-state-schema.d.ts.map