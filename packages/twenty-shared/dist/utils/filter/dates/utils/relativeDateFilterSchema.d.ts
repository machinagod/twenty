import z from 'zod';
export declare const relativeDateFilterSchema: z.ZodObject<{
    direction: z.ZodEnum<{
        NEXT: "NEXT";
        THIS: "THIS";
        PAST: "PAST";
    }>;
    amount: z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodUnion<readonly [z.ZodCoercedNumber<unknown>, z.ZodLiteral<"undefined">]>, z.ZodTransform<number | undefined, number | "undefined">>>>;
    unit: z.ZodEnum<{
        SECOND: "SECOND";
        MINUTE: "MINUTE";
        HOUR: "HOUR";
        DAY: "DAY";
        WEEK: "WEEK";
        MONTH: "MONTH";
        QUARTER: "QUARTER";
        YEAR: "YEAR";
    }>;
    timezone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    firstDayOfTheWeek: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        MONDAY: import("../../../../types").FirstDayOfTheWeek.MONDAY;
        SUNDAY: import("../../../../types").FirstDayOfTheWeek.SUNDAY;
        SATURDAY: import("../../../../types").FirstDayOfTheWeek.SATURDAY;
    }>>>;
}, z.core.$strip>;
export type RelativeDateFilter = z.infer<typeof relativeDateFilterSchema>;
//# sourceMappingURL=relativeDateFilterSchema.d.ts.map