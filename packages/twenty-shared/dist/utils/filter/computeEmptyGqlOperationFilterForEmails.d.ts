import { type PartialFieldMetadataItem, type RecordGqlOperationFilter } from '@/types';
import { type RecordFilter } from '@/utils/filter/turnRecordFilterGroupIntoGqlOperationFilter';
export declare const computeEmptyGqlOperationFilterForEmails: ({ recordFilter, correspondingFieldMetadataItem, }: {
    recordFilter: Omit<RecordFilter, "id">;
    correspondingFieldMetadataItem: Pick<PartialFieldMetadataItem, "name" | "type">;
}) => RecordGqlOperationFilter;
//# sourceMappingURL=computeEmptyGqlOperationFilterForEmails.d.ts.map