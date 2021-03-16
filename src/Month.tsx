import React, { memo, useCallback, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import MonthPanel from './Panel/MonthPanel';
import Header from './Header';
import CalendarContext from './CalendarContext';
import Year from './Year';
import { TDate } from './interface';
import { standard } from './utils';
import uncontrolled from './uncontrolled';

interface CalendarProps {
    value?: TDate;
    onChange?: (v: Dayjs) => void;
    current?: TDate;
    onCurrentChange?: (v: Dayjs) => void;
}

const Month = ({ value, onChange, current, onCurrentChange }: CalendarProps) => {
    const standardCurrent = useMemo(() => standard(current || dayjs()), [current]);
    const standardValue = useMemo(() => (value ? standard(value) : null), [value]);
    const [mode, setMode] = useState('month');
    const onModeChange = useCallback((mode: string) => {
        setMode(mode);
    }, []);
    const onYearChange = useCallback(
        (current: Dayjs) => {
            onCurrentChange(current);
            setMode('month');
        },
        [onCurrentChange]
    );

    switch (mode) {
        case 'year':
            return <Year defaultCurrent={current} onChange={onYearChange} />;
        default: {
            return (
                <CalendarContext.Provider value={{ locale: 'en' }}>
                    <div>
                        <Header
                            value={standardCurrent}
                            onChange={onCurrentChange}
                            type="month"
                            onModeChange={onModeChange}
                        />
                        <MonthPanel
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

export default uncontrolled()(uncontrolled({ valueName: 'current', onChangeName: 'onCurrentChange' })(memo(Month)));
