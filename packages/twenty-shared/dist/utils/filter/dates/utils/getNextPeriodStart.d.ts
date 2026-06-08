import { type Nullable } from '@/types';
import { type DateTimePeriod } from '@/utils/filter/dates/types/DateTimePeriod';
import { type FirstDayOfTheWeekSchema } from '@/utils/filter/dates/utils/firstDayOfWeekSchema';
import { type Temporal } from 'temporal-polyfill';
export declare const FIRST_DAY_OF_WEEK_ISO_8601_MONDAY = 1;
export declare const getNextPeriodStart: (dateTime: Temporal.ZonedDateTime, unit: DateTimePeriod, firstDayOfTheWeek?: Nullable<FirstDayOfTheWeekSchema>) => Temporal.ZonedDateTime;
//# sourceMappingURL=getNextPeriodStart.d.ts.map