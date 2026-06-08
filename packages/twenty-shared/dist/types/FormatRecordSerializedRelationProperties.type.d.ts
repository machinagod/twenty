import { type ExtractSerializedRelationProperties } from '@/types/ExtractSerializedRelationProperties.type';
import { type IsSerializedRelation } from '@/types/IsSerializedRelation.type';
import { type RemoveSuffix } from '@/types/RemoveSuffix.type';
type ShouldTransformToUniversalIdentifier<T, P extends keyof T> = [P] extends [
    ExtractSerializedRelationProperties<T>
] ? string extends keyof NonNullable<T[P]> ? false : true : false;
export type FormatRecordSerializedRelationProperties<T> = T extends unknown ? T extends (infer U)[] ? FormatRecordSerializedRelationProperties<U>[] : T extends string ? IsSerializedRelation<T> extends true ? T | null : T : T extends object ? {
    [P in keyof T as ShouldTransformToUniversalIdentifier<T, P> extends true ? P extends string ? `${RemoveSuffix<P, 'Id'>}UniversalIdentifier` : P : P]: FormatRecordSerializedRelationProperties<T[P]>;
} : T : never;
export {};
//# sourceMappingURL=FormatRecordSerializedRelationProperties.type.d.ts.map