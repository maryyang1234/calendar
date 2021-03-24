import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Calendar, Month, Year, Timer } from '../src';
import './index.scss';

const dom = document.getElementById('app');

const now = new Date();
const App = () => {
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
    return (
        <div>
            <Calendar onChange={console.log} />
            <Month onChange={console.log} />
            <Year onChange={console.log} onCurrentChange={console.log} />
            <Timer value={now} onChange={console.log} />
            <Timer onChange={console.log} />
            <Timer onChange={console.log} value={timer} />
        </div>
    );
};

ReactDOM.render(<App />, dom);
