import { type FieldMetadataType } from '@/types/FieldMetadataType';
type PickLiteral<T, U extends T> = U;
export declare const FILTERABLE_FIELD_TYPES: readonly ["TEXT", "PHONES", "EMAILS", "DATE_TIME", "DATE", "NUMBER", "CURRENCY", "FULL_NAME", "LINKS", "RELATION", "ADDRESS", "SELECT", "RATING", "MULTI_SELECT", "ACTOR", "ARRAY", "RAW_JSON", "FILES", "BOOLEAN", "UUID"];
type FilterableFieldTypeBaseLiteral = (typeof FILTERABLE_FIELD_TYPES)[number];
export type FilterableFieldType = PickLiteral<`${FieldMetadataType}`, FilterableFieldTypeBaseLiteral>;
export type FilterableAndTSVectorFieldType = FilterableFieldType | 'TS_VECTOR';
export {};
//# sourceMappingURL=FilterableFieldType.d.ts.map