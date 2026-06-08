declare enum RelationType {
    MANY_TO_ONE = "MANY_TO_ONE",
    ONE_TO_MANY = "ONE_TO_MANY"
}
type ComputeMorphRelationGqlFieldNameArgs = {
    fieldName: string;
    relationType: RelationType;
    targetObjectMetadataNameSingular: string;
    targetObjectMetadataNamePlural: string;
};
export declare const computeMorphRelationGqlFieldName: ({ fieldName, relationType, targetObjectMetadataNameSingular: nameSingular, targetObjectMetadataNamePlural: namePlural, }: ComputeMorphRelationGqlFieldNameArgs) => string;
export {};
//# sourceMappingURL=compute-morph-relation-gql-field-name.d.ts.map