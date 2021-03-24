import dayjs from 'dayjs';

import { TDate } from '../interface';

export default (v: TDate) => {
    let date: Date;
    if (typeof v === 'number' || typeof v === 'string' || v instanceof Date) {
        date = new Date(v);
    } else {
        date = new Date(+v);
    }
    return dayjs(date);
};
