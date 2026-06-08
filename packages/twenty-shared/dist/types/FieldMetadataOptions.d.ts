import { type FieldMetadataType } from '@/types/FieldMetadataType';
import { type IsExactly } from '@/types/IsExactly';
export type TagColor = 'red' | 'ruby' | 'crimson' | 'tomato' | 'orange' | 'amber' | 'yellow' | 'lime' | 'grass' | 'green' | 'jade' | 'mint' | 'turquoise' | 'cyan' | 'sky' | 'blue' | 'iris' | 'violet' | 'purple' | 'plum' | 'pink' | 'bronze' | 'gold' | 'brown' | 'gray';
export declare class FieldMetadataDefaultOption {
    id?: string;
    position: number;
    label: string;
    value: string;
}
export declare class FieldMetadataComplexOption extends FieldMetadataDefaultOption {
    color: TagColor;
}
type FieldMetadataOptionsMapping = {
    [FieldMetadataType.RATING]: FieldMetadataDefaultOption[];
    [FieldMetadataType.SELECT]: FieldMetadataComplexOption[];
    [FieldMetadataType.MULTI_SELECT]: FieldMetadataComplexOption[];
};
export type FieldMetadataOptionForAnyType = null | FieldMetadataOptionsMapping[keyof FieldMetadataOptionsMapping];
export type FieldMetadataOptions<T extends FieldMetadataType = FieldMetadataType> = IsExactly<T, FieldMetadataType> extends true ? FieldMetadataOptionForAnyType : T extends keyof FieldMetadataOptionsMapping ? FieldMetadataOptionsMapping[T] : never | null;
export {};
//# sourceMappingURL=FieldMetadataOptions.d.ts.map