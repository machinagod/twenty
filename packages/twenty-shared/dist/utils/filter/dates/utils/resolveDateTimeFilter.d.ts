import { ViewFilterOperand } from '@/types';
import { resolveRelativeDateTimeFilterStringified } from '@/utils/filter/dates/utils/resolveRelativeDateTimeFilterStringified';
export type ResolvedDateTimeFilterValue<O extends ViewFilterOperand> = O extends ViewFilterOperand.IS_RELATIVE ? ReturnType<typeof resolveRelativeDateTimeFilterStringified> : string | null;
type PartialViewFilter<O extends ViewFilterOperand> = {
    value: string;
    operand: O;
};
export declare const resolveDateTimeFilter: <O extends ViewFilterOperand>(viewFilter: PartialViewFilter<O>) => ResolvedDateTimeFilterValue<O>;
export {};
//# sourceMappingURL=resolveDateTimeFilter.d.ts.map