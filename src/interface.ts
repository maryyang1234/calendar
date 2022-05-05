import { HTMLAttributes, ReactNode } from 'react';

export type TDate = number | Date | { valueOf(): number };

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type SharedCalendarProps = Override<
    HTMLAttributes<HTMLDivElement>,
    {
        // controlled value of calendar
        value?: TDate | null;
        // uncontrolled default value of calendar
        defaultValue?: TDate | null;
        // callback when user change
        onChange?: (v: Date) => void;
        // controlled value of range display
        rangeValue?: [TDate | null, TDate | null];
        // controlled current display panel value
        current?: TDate;
        // uncontrolled default current display panel value
        defaultCurrent?: TDate;
        // callback when current display panel change
        onCurrentChange?: (v: Date) => void;
        // value of now
        now?: TDate | null;
        // render sidebar right to the table
        sidebar?: ReactNode;
    }
>;

export type DisabledFunc = (t: TDate, value?: TDate) => boolean;

export type Mode = 'date' | 'month' | 'year' | 'decade';
export type HeaderButtonType =
    | 'prevMonth'
    | 'nextMonth'
    | 'prevYear'
    | 'nextYear'
    | 'prevDecade'
    | 'nextDecade'
    | 'prevCentury'
    | 'nextCentury';
export type HeaderSwitcherType = 'date-month' | 'date-year' | 'month' | 'year' | 'decade';

export interface CalendarComponents {
    Cell?: React.ComponentType<
        HTMLAttributes<any> & {
            mode: Mode;
            value?: CellValue<Mode>;
        }
    >;
    HeaderButton?: React.ComponentType<HTMLAttributes<any> & { mode: Mode; type: HeaderButtonType }>;
    HeaderSwitcher?: React.ComponentType<HTMLAttributes<any> & { mode: Mode; type: HeaderSwitcherType }>;
}

export interface DateCellValue {
    date: number;
    month: number;
    year: number;
}

export interface MonthCellValue {
    month: number;
    year: number;
}

export interface YearCellValue {
    year: number;
}

export interface DecadeCellValue {
    year: number;
}

export type CellValue<T extends Mode> = T extends 'date'
    ? DateCellValue
    : T extends 'month'
    ? MonthCellValue
    : T extends 'year'
    ? YearCellValue
    : T extends 'decade'
    ? DecadeCellValue
    : DateCellValue | MonthCellValue | YearCellValue | DecadeCellValue;
