import { TDate } from 'src/interface';

function standard(v: TDate): Date;
function standard(v: TDate | null): Date | null;
function standard(v: TDate | null): Date | null {
    if (v == null) return null;
    let date: Date;
    if (typeof v === 'number' || typeof v === 'string' || v instanceof Date) {
        date = new Date(v);
    } else {
        date = new Date(+v);
    }
    return date;
}

export default standard;
