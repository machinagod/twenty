import { ViewFilterOperand } from '@/types';
import { resolveRelativeDateFilterStringified } from '@/utils/filter/dates/utils/resolveRelativeDateFilterStringified';
export type ResolvedDateFilterValue<O extends ViewFilterOperand> = O extends ViewFilterOperand.IS_RELATIVE ? ReturnType<typeof resolveRelativeDateFilterStringified> : string | null;
type PartialViewFilter<O extends ViewFilterOperand> = {
    value: string;
    operand: O;
};
export declare const resolveDateFilter: <O extends ViewFilterOperand>(viewFilter: PartialViewFilter<O>) => ResolvedDateFilterValue<O>;
export {};
//# sourceMappingURL=resolveDateFilter.d.ts.map