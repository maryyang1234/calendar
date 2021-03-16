import React, { useMemo } from 'react';
import { Dayjs } from 'dayjs';

import DecadePanel from './Panel/DecadePanel';
import Header from './Header';
import CalendarContext from './CalendarContext';
import { standard } from './utils';
import dayjs from './dayjs';
import { TDate } from './interface';
import uncontrolled from './uncontrolled';

interface CalendarProps {
    value?: TDate;
    onChange?: (v: Dayjs) => void;
    current?: TDate;
    onCurrentChange?: (v: Dayjs) => void;
}

function Decade({ value, onChange, current, onCurrentChange }: CalendarProps) {
    const standardCurrent = useMemo(() => standard(current || dayjs()), [current]);
    const standardValue = useMemo(() => (value ? standard(value) : null), [value]);

    return (
        <CalendarContext.Provider value={{ locale: 'en' }}>
            <div>
                <Header value={standardCurrent} onChange={onCurrentChange} type="decade" />
                <DecadePanel
                    value={standardValue}
                    onChange={onChange}
                    current={standardCurrent}
                    onCurrentChange={onCurrentChange}
                />
            </div>
        </CalendarContext.Provider>
    );
}

export default uncontrolled()(uncontrolled({ valueName: 'current', onChangeName: 'onCurrentChange' })(Decade));
