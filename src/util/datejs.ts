import { TDate } from 'src/interface';
import { add, format, getDaysInMonth, set, Unit } from 'src/util/date';

const datejs = (v: TDate) => {
    const d = new Date(+v);
    const _y = d.getFullYear();
    const _M = d.getMonth();
    const _D = d.getDate();
    const _d = d.getDay();
    const _H = d.getHours();
    const _m = d.getMinutes();
    const _s = d.getSeconds();

    const instance = {
        _t: d,
        _y,
        _M,
        _D,
        _d,
        _H,
        _m,
        _s,
        add: (value: number, unit: Unit) => {
            return datejs(add(d, value, unit));
        },
        set: (value: number, unit: Unit) => {
            return datejs(set(d, value, unit));
        },
        getDaysInMonth: () => {
            return getDaysInMonth(d);
        },
        valueOf: () => {
            return +d;
        },
        format: (_format: string) => {
            return format(d, _format);
        }
    };

    return instance;
};

export type DateJS = ReturnType<typeof datejs>;

export default datejs;
