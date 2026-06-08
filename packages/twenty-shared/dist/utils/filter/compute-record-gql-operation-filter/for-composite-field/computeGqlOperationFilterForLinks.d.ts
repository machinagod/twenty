import { type CompositeFieldSubFieldName, type PartialFieldMetadataItem } from '@/types';
import { type RecordFilter } from '@/utils/filter/turnRecordFilterGroupIntoGqlOperationFilter';
export declare const computeGqlOperationFilterForLinks: ({ recordFilter, correspondingFieldMetadataItem, subFieldName, }: {
    recordFilter: Omit<RecordFilter, "id">;
    correspondingFieldMetadataItem: Pick<PartialFieldMetadataItem, "name" | "type">;
    subFieldName: CompositeFieldSubFieldName | null | undefined;
}) => {
    [x: string]: {
        [x: string]: {
            ilike: string;
        };
    };
    not?: undefined;
    or?: undefined;
    and?: undefined;
} | {
    not: {
        [x: string]: {
            [x: string]: {
                ilike: string;
            };
        };
    };
    or?: undefined;
    and?: undefined;
} | {
    [x: string]: {
        secondaryLinks: {
            like: string;
        };
    };
    not?: undefined;
    or?: undefined;
    and?: undefined;
} | {
    or: ({
        not: {
            [x: string]: {
                secondaryLinks: {
                    like: string;
                };
            };
        };
    } | {
        [x: string]: {
            secondaryLinks: {
                is: "NULL";
            };
        };
        not?: undefined;
    })[];
    not?: undefined;
    and?: undefined;
} | {
    or: ({
        [x: string]: {
            primaryLinkUrl: {
                ilike: string;
            };
        };
    } | {
        [x: string]: {
            primaryLinkLabel: {
                ilike: string;
            };
        };
    } | {
        [x: string]: {
            secondaryLinks: {
                like: string;
            };
        };
    })[];
    not?: undefined;
    and?: undefined;
} | {
    and: ({
        not: {
            [x: string]: {
                primaryLinkLabel: {
                    ilike: string;
                };
            };
        };
        or?: undefined;
    } | {
        not: {
            [x: string]: {
                primaryLinkUrl: {
                    ilike: string;
                };
            };
        };
        or?: undefined;
    } | {
        or: ({
            not: {
                [x: string]: {
                    secondaryLinks: {
                        like: string;
                    };
                };
            };
        } | {
            [x: string]: {
                secondaryLinks: {
                    is: "NULL";
                };
            };
            not?: undefined;
        })[];
        not?: undefined;
    })[];
    not?: undefined;
    or?: undefined;
};
//# sourceMappingURL=computeGqlOperationFilterForLinks.d.ts.map