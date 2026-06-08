import { ViewFilterOperand, type PartialFieldMetadataItem, type RecordGqlOperationFilter } from '@/types';
import { type RecordFilter } from '@/utils/filter/turnRecordFilterGroupIntoGqlOperationFilter';
type GetEmptyRecordGqlOperationFilterParams = {
    operand: ViewFilterOperand;
    correspondingField: Pick<PartialFieldMetadataItem, 'id' | 'name' | 'type'>;
    recordFilter: Omit<RecordFilter, 'id'>;
};
export declare const getEmptyRecordGqlOperationFilter: ({ operand, correspondingField, recordFilter, }: GetEmptyRecordGqlOperationFilterParams) => RecordGqlOperationFilter;
export {};
//# sourceMappingURL=getEmptyRecordGqlOperationFilter.d.ts.map