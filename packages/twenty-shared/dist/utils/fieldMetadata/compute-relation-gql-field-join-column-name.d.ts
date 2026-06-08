declare enum RelationType {
    MANY_TO_ONE = "MANY_TO_ONE",
    ONE_TO_MANY = "ONE_TO_MANY"
}
type ComputeRelationGqlFieldJoinColumnNameArgs = {
    name: string;
};
export declare const computeRelationGqlFieldJoinColumnName: ({ name, }: ComputeRelationGqlFieldJoinColumnNameArgs) => string;
type ComputeMorphRelationGqlFieldJoinColumnNameArgs = {
    fieldName: string;
    relationType: RelationType;
    targetObjectMetadataNameSingular: string;
    targetObjectMetadataNamePlural: string;
};
export declare const computeMorphRelationGqlFieldJoinColumnName: ({ fieldName, relationType, targetObjectMetadataNameSingular, targetObjectMetadataNamePlural, }: ComputeMorphRelationGqlFieldJoinColumnNameArgs) => string;
export {};
//# sourceMappingURL=compute-relation-gql-field-join-column-name.d.ts.map