import { type RecordFilterValueDependencies, type RecordGqlOperationFilter } from '@/types';
import { type RecordFilter, type RecordFilterGroup } from '@/utils/filter/turnRecordFilterGroupIntoGqlOperationFilter';
import { type FieldShared } from '@/utils/filter/turnRecordFilterIntoGqlOperationFilter';
export declare const computeRecordGqlOperationFilter: ({ fieldMetadataItems, recordFilters, recordFilterGroups, filterValueDependencies, }: {
    recordFilters: Omit<RecordFilter, "id">[];
    fieldMetadataItems: FieldShared[];
    recordFilterGroups: RecordFilterGroup[];
    filterValueDependencies: RecordFilterValueDependencies;
}) => RecordGqlOperationFilter;
//# sourceMappingURL=computeRecordGqlOperationFilter.d.ts.map