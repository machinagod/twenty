type Diff<T extends {
    id: string;
}> = {
    toCreate: T[];
    toUpdate: T[];
    toRestoreAndUpdate: T[];
    idsToRemove: string[];
};
type ComputeDiffBetweenObjectsParams<T extends {
    id: string;
}, K extends {
    id: string;
}> = {
    existingObjects: T[];
    receivedObjects: K[];
    propertiesToCompare: (keyof K & keyof T)[];
    isEntityIncluded: (entity: NoInfer<T>) => boolean;
};
export declare const computeDiffBetweenObjects: <T extends {
    id: string;
}, K extends {
    id: string;
}>({ existingObjects, receivedObjects, propertiesToCompare, isEntityIncluded, }: ComputeDiffBetweenObjectsParams<T, K>) => Diff<K>;
export {};
//# sourceMappingURL=compute-diff-between-objects.d.ts.map