import dayjs, { Dayjs } from 'dayjs';

import { TDate } from '../interface';

function standard(v: TDate): Dayjs;
function standard(v: TDate | null): Dayjs | null;
function standard(v: TDate | null): Dayjs | null {
    if (v === null) return null;
    let date: Date;
    if (typeof v === 'number' || typeof v === 'string' || v instanceof Date) {
        date = new Date(v);
    } else {
        date = new Date(+v);
    }
    return dayjs(date);
}

export default standard;
