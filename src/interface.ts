import { Dayjs } from 'dayjs';
import { Moment } from 'moment';

export type TDate = number | string | Date | Moment | Dayjs;

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;
