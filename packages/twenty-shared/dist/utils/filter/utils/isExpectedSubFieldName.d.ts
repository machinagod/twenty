import { COMPOSITE_FIELD_TYPE_SUB_FIELDS_NAMES } from '@/constants/CompositeFieldTypeSubFieldsNames';
import { type CompositeFieldSubFieldName } from '@/types';
type CompositeMap = typeof COMPOSITE_FIELD_TYPE_SUB_FIELDS_NAMES;
export declare const isExpectedSubFieldName: <FieldMetadataType extends keyof CompositeMap, PossibleSubFieldName extends CompositeFieldSubFieldName>(fieldMetadataType: FieldMetadataType, subFieldName: PossibleSubFieldName, subFieldNameToCheck: string | null | undefined) => subFieldNameToCheck is PossibleSubFieldName;
export {};
//# sourceMappingURL=isExpectedSubFieldName.d.ts.map