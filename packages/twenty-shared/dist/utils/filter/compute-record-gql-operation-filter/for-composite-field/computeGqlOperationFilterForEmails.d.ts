import { type CompositeFieldSubFieldName, type PartialFieldMetadataItem, type RecordGqlOperationFilter } from '@/types';
import { type RecordFilter } from '@/utils/filter/turnRecordFilterGroupIntoGqlOperationFilter';
export declare const computeGqlOperationFilterForEmails: ({ recordFilter, correspondingFieldMetadataItem, subFieldName, }: {
    recordFilter: Omit<RecordFilter, "id">;
    correspondingFieldMetadataItem: Pick<PartialFieldMetadataItem, "name" | "type">;
    subFieldName: CompositeFieldSubFieldName | null | undefined;
}) => RecordGqlOperationFilter;
//# sourceMappingURL=computeGqlOperationFilterForEmails.d.ts.map