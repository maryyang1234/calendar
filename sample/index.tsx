import React from 'react';
import ReactDOM from 'react-dom';

import { Calendar, Month, Year } from '../src';
import './index.scss';

const dom = document.getElementById('app');

const App = () => (
    <div>
        <Calendar />
        <Month />
        <Year onChange={console.log} onCurrentChange={console.log} />
    </div>
);

ReactDOM.render(<App />, dom);
