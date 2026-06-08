import { type Nullable } from '@/types';
import { type DateTimePeriod } from '@/utils';
import { type FirstDayOfTheWeekSchema } from '@/utils/filter/dates/utils/firstDayOfWeekSchema';
import { type Temporal } from 'temporal-polyfill';
export declare const getPeriodStart: (dateTime: Temporal.ZonedDateTime, unit: DateTimePeriod, firstDayOfTheWeek?: Nullable<FirstDayOfTheWeekSchema>) => Temporal.ZonedDateTime;
//# sourceMappingURL=getPeriodStart.d.ts.map