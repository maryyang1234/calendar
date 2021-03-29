import { HTMLAttributes, ReactNode } from 'react';
import { Dayjs } from 'dayjs';
import { Moment } from 'moment';

export type TDate = number | string | Date | Moment | Dayjs;

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type SharedCalendarProps = Override<
    HTMLAttributes<HTMLDivElement>,
    {
        // controlled value of calendar
        value?: TDate | null;
        // uncontrolled default value of calendar
        defaultValue?: TDate | null;
        // callback when user change
        onChange?: (v: Dayjs) => void;
        // controlled current display panel value
        current?: TDate;
        // uncontrolled default current display panel value
        defaultCurrent?: TDate;
        // callback when current display panel change
        onCurrentChange?: (v: Dayjs) => void;
        // render sidebar right to the table
        sidebar?: ReactNode;
    }
>;

export type Mode = 'date' | 'month' | 'year' | 'decade';
export type HeaderButtonType =
    | 'prevMonth'
    | 'nextMonth'
    | 'prevYear'
    | 'nextYear'
    | 'prev10Year'
    | 'next10Year'
    | 'prevDecade'
    | 'nextDecade';
export type HeaderSwitcherType = 'date-month' | 'date-year' | 'month' | 'year' | 'decade';

export interface CalendarComponents {
    Cell?: React.ComponentType<HTMLAttributes<any> & { mode: Mode }>;
    HeaderButton?: React.ComponentType<HTMLAttributes<any> & { mode: Mode; type: HeaderButtonType }>;
    HeaderSwitcher?: React.ComponentType<HTMLAttributes<any> & { mode: Mode; type: HeaderSwitcherType }>;
}
