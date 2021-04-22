import React, { HTMLAttributes, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Calendar, Month, Year, Timer } from '../src';
import { Mode, TDate } from '../src/interface';
import './index.scss';

const dom = document.getElementById('app');

const now = new Date();

const Clock = () => {
    const [timer, setTimer] = useState(() => new Date());
    useEffect(() => {
        let t;
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
    return <Timer onChange={console.log} value={timer} />;
};

const Cell = ({ children, mode, ...rest }: HTMLAttributes<HTMLDivElement> & { mode: Mode }) => {
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

const App = () => {
    return (
        <div>
            <Calendar
                onChange={console.log}
                components={{ Cell: Cell }}
                disabledRule={{ date: disabledDate, month: disabledMonth, year: disabledYear, decade: disabledDecade }}
            />
            <Month onChange={console.log} now={null} />
            <Year onChange={console.log} onCurrentChange={console.log} />
            <Timer value={now} onChange={console.log} />
            <Timer onChange={console.log} />
            <Clock />
        </div>
    );
};

ReactDOM.render(<App />, dom);
