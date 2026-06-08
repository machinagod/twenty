import { type RelativeDateFilter } from '@/utils/filter/dates/utils/relativeDateFilterSchema';
import { type Temporal } from 'temporal-polyfill';
export declare const resolveRelativeDateFilter: (relativeDateFilter: RelativeDateFilter, referenceTodayZonedDateTime: Temporal.ZonedDateTime) => {
    start: string;
    end: string;
    direction: "NEXT" | "THIS" | "PAST";
    unit: "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
    amount?: number | null | undefined;
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
};
//# sourceMappingURL=resolveRelativeDateFilter.d.ts.map