import React, { memo, useCallback, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';

import DatePanel from './Panel/DatePanel';
import Header from './Header';
import CalendarContext from './CalendarContext';
import Month from './Month';
import dayjs from './dayjs';
import { standard } from './utils';
import { TDate } from './interface';
import uncontrolled from './uncontrolled';
import Year from './Year';

interface CalendarProps {
    value?: TDate;
    today?: TDate;
    onChange?: (v: Dayjs) => void;
    current?: TDate;
    onCurrentChange?: (v: Dayjs) => void;
}

const Calendar = ({ value, onChange, today, current, onCurrentChange }: CalendarProps) => {
    const standardCurrent = useMemo(() => standard(current || dayjs()), [current]);
    const standardValue = useMemo(() => (value ? standard(value) : null), [value]);
    const standardToday = useMemo(() => standard(today || dayjs()), [today]);
    const [mode, setMode] = useState('date');
    const onModeChange = useCallback((mode: string) => {
        setMode(mode);
    }, []);
    const onMonthChange = useCallback(
        (current: Dayjs) => {
            onCurrentChange(current);
            setMode('date');
        },
        [onCurrentChange]
    );
    const onYearChange = useCallback(
        (current: Dayjs) => {
            onCurrentChange(current);
            setMode('month');
        },
        [onCurrentChange]
    );

    switch (mode) {
        case 'month':
            return <Month defaultCurrent={current} onChange={onMonthChange} />;
        case 'year':
            return <Year defaultCurrent={current} onChange={onYearChange} />;
        default: {
            return (
                <CalendarContext.Provider value={{ locale: 'en' }}>
                    <div>
                        <Header
                            value={standardCurrent}
                            onChange={onCurrentChange}
                            type="date"
                            onModeChange={onModeChange}
                        />
                        <DatePanel
                            today={standardToday}
                            value={standardValue}
                            onChange={onChange}
                            current={standardCurrent}
                            onCurrentChange={onCurrentChange}
                        />
                    </div>
                </CalendarContext.Provider>
            );
        }
    }
};

export default uncontrolled()(uncontrolled({ valueName: 'current', onChangeName: 'onCurrentChange' })(memo(Calendar)));
