const DaysMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const INVALID_DATA_STRING = 'Invalid Date';
const REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
const TS_HOUR = 60 * 60 * 1000;
const TS_DAY = 24 * TS_HOUR;
export type Unit = 'second' | 'minute' | 'hour' | 'date' | 'month' | 'year';

const padZero = (s: string | number, length: number) => {
    s = '0000' + s;
    return s.substr(s.length - length);
};

export const getDaysInMonth = (d: Date): number => {
    const month = d.getMonth();
    const year = d.getFullYear();
    if (month === 1) {
        const over = new Date(year, 1, 29).getMonth() === 2;
        return over ? 28 : 29;
    } else {
        return DaysMap[month];
    }
};

export const format = (d: Date | null = null, format: string): string => {
    if (d == null) return '';
    if (d.toString() === INVALID_DATA_STRING) return INVALID_DATA_STRING;

    const $y = d.getFullYear();
    const $M = d.getMonth();
    const $D = d.getDate();
    const $d = d.getDay();
    const $H = d.getHours();
    const $m = d.getMinutes();
    const $s = d.getSeconds();

    const matches: { [key: string]: string | number } = {
        YY: String($y).slice(-2),
        YYYY: $y,
        M: $M + 1,
        MM: padZero($M + 1, 2),
        D: $D,
        DD: padZero($D, 2),
        d: $d,
        H: $H,
        HH: padZero($H, 2),
        m: $m,
        mm: padZero($m, 2),
        s: $s,
        ss: padZero($s, 2)
    };
    return format.replace(REGEX_FORMAT, (match, $1) => $1 || matches[match] || '');
};

export const add = (d: Date, value: number, unit: Unit) => {
    switch (unit) {
        case 'hour': {
            return new Date(+d + TS_HOUR * value);
        }
        case 'date': {
            return new Date(+d + TS_DAY * value);
        }
        case 'month': {
            const month = d.getMonth();
            const year = d.getFullYear();
            const date = d.getDate();
            const newD = new Date(d);
            const newYear = (year + (month + value) / 12) | 0;
            const newMonth = (((month + value) % 12) + 12) % 12;
            const newDate = Math.min(getDaysInMonth(new Date(newYear, newMonth, 1)), date);
            newD.setDate(newDate);
            newD.setFullYear(newYear);
            newD.setMonth(newMonth);
            return newD;
        }
        case 'year': {
            const year = d.getFullYear();
            const newD = new Date(d);
            newD.setFullYear(year + value);
            return newD;
        }
    }
    return d;
};

const SetMap: Record<Unit, 'setSeconds' | 'setMinutes' | 'setHours' | 'setDate' | 'setMonth' | 'setFullYear'> = {
    second: 'setSeconds',
    minute: 'setMinutes',
    hour: 'setHours',
    date: 'setDate',
    month: 'setMonth',
    year: 'setFullYear'
};

export const set = (d: Date, value: number, unit: Unit) => {
    const newD = new Date(+d);
    newD[SetMap[unit]](value);
    return newD;
};
