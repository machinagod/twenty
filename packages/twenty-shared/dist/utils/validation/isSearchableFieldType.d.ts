import { FieldMetadataType } from '@/types';
declare const SEARCHABLE_FIELD_TYPES: readonly [FieldMetadataType.TEXT, FieldMetadataType.FULL_NAME, FieldMetadataType.EMAILS, FieldMetadataType.ADDRESS, FieldMetadataType.LINKS, FieldMetadataType.PHONES, FieldMetadataType.RICH_TEXT, FieldMetadataType.UUID];
export type SearchableFieldType = (typeof SEARCHABLE_FIELD_TYPES)[number];
export declare const isSearchableFieldType: (type: FieldMetadataType) => type is SearchableFieldType;
export {};
//# sourceMappingURL=isSearchableFieldType.d.ts.map