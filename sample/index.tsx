import React, { HTMLAttributes, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import raf from 'raf';

import { Calendar, Month, Year, Time } from '../src';
import { CellValue, Mode, TDate } from '../src/interface';
import './index.scss';

const scrollMap: { [key: number]: number } = {};

const _scrollTo = (element: Element, to: number, duration: number, uid: number, tag: number) => {
    if (tag != scrollMap[uid]) return;
    if (duration <= 0) {
        raf(() => {
            element.scrollTop = to;
        });
        return;
    }
    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;

    raf(() => {
        element.scrollTop += perTick;
        if (element.scrollTop === to) return;
        _scrollTo(element, to, duration - 10, uid, tag);
    });
};

const scrollTo = (element: Element, to: number, duration: number, uid: number) => {
    _scrollTo(element, to, duration, uid, (scrollMap[uid] = (scrollMap[uid] | 0) + 1));
};

const dom = document.getElementById('app');

const now = new Date();

const format = (v: TDate) => {
    return moment(+v).format('YYYY-MM-DD hh:mm:ss');
};

const Clock = () => {
    const [timer, setTimer] = useState(() => new Date());
    useEffect(() => {
        let t: ReturnType<typeof setTimeout>;
        const f = () => {
            t = setTimeout(() => {
                setTimer(new Date());
                f();
            }, 100);
        };
        f();
        return () => {
            clearTimeout(t);
        };
    }, []);
    return <Time onChange={console.log} value={timer} className="zr-time-css" />;
};

const Cell = ({
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mode,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value,
    ...rest
}: HTMLAttributes<HTMLDivElement> & { mode: Mode; value?: CellValue<Mode> }) => {
    return (
        <div {...rest}>
            <span>{children}</span>
        </div>
    );
};

const disabledDate = (t: TDate) => {
    return new Date(+t).getDate() > 28;
};
const disabledMonth = (t: TDate) => {
    return new Date(+t).getMonth() > 6;
};
const disabledYear = (t: TDate) => {
    return new Date(+t).getFullYear() > new Date().getFullYear();
};
const disabledDecade = (t: TDate) => {
    return new Date(+t).getFullYear() > new Date().getFullYear();
};
const logDateFormat = (v: Date) => console.log('value', format(v));
const logDateCurrentFormat = (v: Date) => console.log('current', format(v));

const App = () => {
    return (
        <div>
            <Calendar
                // value={moment()}
                onChange={logDateFormat}
                onCurrentChange={logDateCurrentFormat}
                components={{ Cell: Cell }}
                disabledRule={{ date: disabledDate, month: disabledMonth, year: disabledYear, decade: disabledDecade }}
            />
            <Calendar
                value={null}
                onChange={logDateFormat}
                onCurrentChange={logDateCurrentFormat}
                components={{ Cell: Cell }}
                disabledRule={{ date: disabledDate, month: disabledMonth, year: disabledYear, decade: disabledDecade }}
                rangeValue={[new Date(+now - 1000 * 60 * 60 * 24 * 30), new Date(+now)]}
            />
            <Month onChange={logDateFormat} onCurrentChange={logDateCurrentFormat} now={null} />
            <Year onChange={logDateFormat} onCurrentChange={logDateCurrentFormat} />
            <Time value={now} onChange={console.log} />
            <Time onChange={console.log} scrollTo={scrollTo} />
            <Clock />
        </div>
    );
};

ReactDOM.render(<App />, dom);
