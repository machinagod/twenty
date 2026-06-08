type OnlyStringPropertiesKey<T> = Extract<keyof T, string>;
export type StringPropertyKeys<T> = {
    [K in OnlyStringPropertiesKey<T>]: T[K] extends string | undefined ? K : never;
}[OnlyStringPropertiesKey<T>];
export declare const trimAndRemoveDuplicatedWhitespacesFromObjectStringProperties: <T, TKeys extends StringPropertyKeys<T>[], TExtract extends boolean = false>(obj: T, keys: TKeys, extractKeys?: TExtract) => TExtract extends true ? { [P in TKeys[number]]: T[P]; } : T;
export {};
//# sourceMappingURL=trim-and-remove-duplicated-whitespaces-from-object-string-properties.d.ts.map