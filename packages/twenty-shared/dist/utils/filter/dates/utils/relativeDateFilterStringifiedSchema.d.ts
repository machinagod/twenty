import z from 'zod';
export declare const relativeDateFilterStringifiedSchema: z.ZodPipe<z.ZodString, z.ZodTransform<{
    direction: "NEXT" | "THIS" | "PAST";
    unit: "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR";
    amount?: number | null | undefined;
    timezone?: string | null | undefined;
    firstDayOfTheWeek?: import("../../../../types").FirstDayOfTheWeek | null | undefined;
}, string>>;
//# sourceMappingURL=relativeDateFilterStringifiedSchema.d.ts.map