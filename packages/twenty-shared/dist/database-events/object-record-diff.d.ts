export type ObjectRecordDiff<T> = {
    [K in keyof T]: {
        before: T[K];
        after: T[K];
    };
};
//# sourceMappingURL=object-record-diff.d.ts.map