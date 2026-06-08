import { type RelativeDateFilter } from '@/utils/filter/dates/utils/relativeDateFilterSchema';
import { type Temporal } from 'temporal-polyfill';
export declare const resolveRelativeDateTimeFilter: (relativeDateFilter: RelativeDateFilter, referenceZonedDateTime: Temporal.ZonedDateTime) => {
    start: Temporal.ZonedDateTime;
    end: Temporal.ZonedDateTime;
    direction: "NEXT" | "THIS" | "PAST";
    unit: "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
    amount?: number | null | undefined;
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
};
//# sourceMappingURL=resolveRelativeDateTimeFilter.d.ts.map