export declare const resolveRelativeDateFilterStringified: (relativeDateFilterStringified?: string | null) => {
    start: string;
    end: string;
    direction: "NEXT" | "THIS" | "PAST";
    unit: "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
    amount?: number | null | undefined;
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
} | null;
//# sourceMappingURL=resolveRelativeDateFilterStringified.d.ts.map