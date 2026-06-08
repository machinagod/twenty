import z from 'zod';
export declare const relativeDateFilterUnitSchema: z.ZodEnum<{
    SECOND: "SECOND";
    MINUTE: "MINUTE";
    HOUR: "HOUR";
    DAY: "DAY";
    WEEK: "WEEK";
    MONTH: "MONTH";
    QUARTER: "QUARTER";
    YEAR: "YEAR";
}>;
export type RelativeDateFilterUnit = z.infer<typeof relativeDateFilterUnitSchema>;
//# sourceMappingURL=relativeDateFilterUnitSchema.d.ts.map