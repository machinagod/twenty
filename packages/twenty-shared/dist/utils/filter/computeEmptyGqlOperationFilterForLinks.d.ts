import { type PartialFieldMetadataItem, type RecordGqlOperationFilter } from '@/types';
import { type RecordFilter } from '@/utils/filter/turnRecordFilterGroupIntoGqlOperationFilter';
export declare const computeEmptyGqlOperationFilterForLinks: ({ recordFilter, correspondingFieldMetadataItem, }: {
    recordFilter: Omit<RecordFilter, "id">;
    correspondingFieldMetadataItem: Pick<PartialFieldMetadataItem, "name">;
}) => RecordGqlOperationFilter;
//# sourceMappingURL=computeEmptyGqlOperationFilterForLinks.d.ts.map