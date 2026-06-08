import { Temporal } from 'temporal-polyfill';
export declare const resolveRelativeDateTimeFilterStringified: (relativeDateTimeFilterStringified: string | null | undefined) => {
    start: Temporal.ZonedDateTime;
    end: Temporal.ZonedDateTime;
    direction: "NEXT" | "THIS" | "PAST";
    unit: "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
    amount?: number | null | undefined;
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
} | null;
//# sourceMappingURL=resolveRelativeDateTimeFilterStringified.d.ts.map