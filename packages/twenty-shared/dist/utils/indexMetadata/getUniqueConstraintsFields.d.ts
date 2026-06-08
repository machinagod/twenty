export declare const getUniqueConstraintsFields: <K extends {
    id: string;
    name: string;
}, T extends {
    id: string;
    indexMetadatas: {
        id: string;
        isUnique: boolean;
        indexFieldMetadatas: {
            fieldMetadataId: string;
        }[];
    }[];
    fields: K[];
}>(objectMetadata: T) => K[][];
//# sourceMappingURL=getUniqueConstraintsFields.d.ts.map