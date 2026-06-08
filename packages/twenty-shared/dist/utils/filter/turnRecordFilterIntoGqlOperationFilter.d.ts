import { FieldMetadataType, type RecordFilterValueDependencies, type RecordGqlOperationFilter } from '@/types';
import { type RecordFilter } from '@/utils';
export type FieldShared = {
    id: string;
    name: string;
    type: FieldMetadataType;
    label: string;
};
type TurnRecordFilterIntoRecordGqlOperationFilterParams = {
    filterValueDependencies: RecordFilterValueDependencies;
    recordFilter: Omit<RecordFilter, 'id'>;
    fieldMetadataItemById: Map<string, FieldShared>;
};
export declare const turnRecordFilterIntoRecordGqlOperationFilter: ({ recordFilter, fieldMetadataItemById, filterValueDependencies, }: TurnRecordFilterIntoRecordGqlOperationFilterParams) => RecordGqlOperationFilter | undefined;
export {};
//# sourceMappingURL=turnRecordFilterIntoGqlOperationFilter.d.ts.map