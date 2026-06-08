import { type StringPropertyKeys } from '@/utils/trim-and-remove-duplicated-whitespaces-from-object-string-properties';
export declare const fromArrayToValuesByKeyRecord: <T extends object>({ array, key, }: {
    array: T[];
    key: StringPropertyKeys<T>;
}) => Record<string, T[]>;
//# sourceMappingURL=fromArrayToValuesByKeyRecord.util.d.ts.map