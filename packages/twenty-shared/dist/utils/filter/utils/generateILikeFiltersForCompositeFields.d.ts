import { type RecordGqlOperationFilter } from '@/types';
export declare const generateILikeFiltersForCompositeFields: (filterString: string, baseFieldName: string, subFields: string[], emptyCheck?: boolean) => {
    or: ({
        [x: string]: {
            [x: string]: {
                is: string;
            };
        };
    } | {
        [x: string]: {
            [x: string]: {
                ilike: string;
            };
        };
    })[];
}[] | (RecordGqlOperationFilter | {
    [x: string]: {
        [x: string]: {
            ilike: string;
        };
    };
})[];
//# sourceMappingURL=generateILikeFiltersForCompositeFields.d.ts.map