import { HTMLAttributes } from 'react';
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
    }
>;
