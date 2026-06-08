import z from 'zod';
export declare const relativeDateFilterDirectionSchema: z.ZodEnum<{
    NEXT: "NEXT";
    THIS: "THIS";
    PAST: "PAST";
}>;
export type RelativeDateFilterDirection = z.infer<typeof relativeDateFilterDirectionSchema>;
//# sourceMappingURL=relativeDateFilterDirectionSchema.d.ts.map