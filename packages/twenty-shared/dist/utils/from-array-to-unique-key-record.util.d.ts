import { type StringPropertyKeys } from '@/utils/trim-and-remove-duplicated-whitespaces-from-object-string-properties';
export declare const fromArrayToUniqueKeyRecord: <T extends object>({ array, uniqueKey, }: {
    array: T[];
    uniqueKey: StringPropertyKeys<T>;
}) => Record<string, T>;
//# sourceMappingURL=from-array-to-unique-key-record.util.d.ts.map