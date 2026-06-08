import { type CompositeFieldSubFieldName, type FilterableAndTSVectorFieldType, RecordFilterGroupLogicalOperator, type RecordFilterValueDependencies, type RecordGqlOperationFilter, type ViewFilterOperand } from '@/types';
import { type FieldShared } from '@/utils/filter/turnRecordFilterIntoGqlOperationFilter';
export type RecordFilter = {
    id: string;
    fieldMetadataId: string;
    value: string;
    type: FilterableAndTSVectorFieldType;
    recordFilterGroupId?: string | null;
    operand: ViewFilterOperand;
    subFieldName?: CompositeFieldSubFieldName | null | undefined;
    relationTargetFieldMetadataId?: string | null | undefined;
};
export type RecordFilterGroup = {
    id: string;
    parentRecordFilterGroupId?: string | null;
    logicalOperator: RecordFilterGroupLogicalOperator;
};
export declare const turnRecordFilterGroupsIntoGqlOperationFilter: ({ filterValueDependencies, filters, fieldMetadataItemById, recordFilterGroups, currentRecordFilterGroupId, }: {
    filterValueDependencies: RecordFilterValueDependencies;
    filters: Omit<RecordFilter, "id">[];
    fieldMetadataItemById: Map<string, FieldShared>;
    recordFilterGroups: RecordFilterGroup[];
    currentRecordFilterGroupId?: string;
}) => RecordGqlOperationFilter | undefined;
//# sourceMappingURL=turnRecordFilterGroupIntoGqlOperationFilter.d.ts.map