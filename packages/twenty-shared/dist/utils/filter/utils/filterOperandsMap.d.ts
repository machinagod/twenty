import { ViewFilterOperand } from '@/types';
export declare const FILTER_OPERANDS_MAP: {
    readonly TEXT: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly EMAILS: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly FULL_NAME: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly ADDRESS: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly LINKS: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly PHONES: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly CURRENCY: readonly [ViewFilterOperand.GREATER_THAN_OR_EQUAL, ViewFilterOperand.LESS_THAN_OR_EQUAL, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly NUMBER: readonly [ViewFilterOperand.IS, ViewFilterOperand.IS_NOT, ViewFilterOperand.GREATER_THAN_OR_EQUAL, ViewFilterOperand.LESS_THAN_OR_EQUAL, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly RAW_JSON: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly FILES: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly DATE_TIME: readonly [ViewFilterOperand.IS, ViewFilterOperand.IS_RELATIVE, ViewFilterOperand.IS_IN_PAST, ViewFilterOperand.IS_IN_FUTURE, ViewFilterOperand.IS_TODAY, ViewFilterOperand.IS_BEFORE, ViewFilterOperand.IS_AFTER, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly DATE: readonly [ViewFilterOperand.IS, ViewFilterOperand.IS_RELATIVE, ViewFilterOperand.IS_IN_PAST, ViewFilterOperand.IS_IN_FUTURE, ViewFilterOperand.IS_TODAY, ViewFilterOperand.IS_BEFORE, ViewFilterOperand.IS_AFTER, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly RATING: readonly [ViewFilterOperand.IS, ViewFilterOperand.IS_NOT, ViewFilterOperand.GREATER_THAN_OR_EQUAL, ViewFilterOperand.LESS_THAN_OR_EQUAL, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly RELATION: readonly [ViewFilterOperand.IS, ViewFilterOperand.IS_NOT, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly MULTI_SELECT: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly SELECT: readonly [ViewFilterOperand.IS, ViewFilterOperand.IS_NOT, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly ACTOR: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly ARRAY: readonly [ViewFilterOperand.CONTAINS, ViewFilterOperand.DOES_NOT_CONTAIN, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
    readonly BOOLEAN: readonly [ViewFilterOperand.IS];
    readonly TS_VECTOR: readonly [ViewFilterOperand.VECTOR_SEARCH];
    readonly UUID: readonly [ViewFilterOperand.IS, ViewFilterOperand.IS_NOT, ViewFilterOperand.IS_EMPTY, ViewFilterOperand.IS_NOT_EMPTY];
};
//# sourceMappingURL=filterOperandsMap.d.ts.map