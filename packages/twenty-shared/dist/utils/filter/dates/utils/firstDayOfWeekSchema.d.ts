import { FirstDayOfTheWeek } from '@/types';
import z from 'zod';
export declare const firstDayOfWeekSchema: z.ZodEnum<{
    MONDAY: FirstDayOfTheWeek.MONDAY;
    SUNDAY: FirstDayOfTheWeek.SUNDAY;
    SATURDAY: FirstDayOfTheWeek.SATURDAY;
}>;
export type FirstDayOfTheWeekSchema = z.infer<typeof firstDayOfWeekSchema>;
//# sourceMappingURL=firstDayOfWeekSchema.d.ts.map