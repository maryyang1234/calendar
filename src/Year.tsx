import React, { memo, useCallback, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import YearPanel from './Panel/YearPanel';
import Header from './Header';
import CalendarContext from './CalendarContext';
import { TDate } from './interface';
import { standard } from './utils';
import Decade from './Decade';
import uncontrolled from './uncontrolled';

interface CalendarProps {
    value?: TDate;
    onChange?: (v: Dayjs) => void;
    current?: TDate;
    onCurrentChange?: (v: Dayjs) => void;
}

const Year = ({ value, onChange, current, onCurrentChange }: CalendarProps) => {
    const standardCurrent = useMemo(() => standard(current || dayjs()), [current]);
    const standardValue = useMemo(() => (value ? standard(value) : null), [value]);
    const [mode, setMode] = useState('year');
    const onModeChange = useCallback((mode: string) => {
        setMode(mode);
    }, []);
    const onDecadeChange = useCallback(
        (current: Dayjs) => {
            onCurrentChange(current);
            setMode('year');
        },
        [onCurrentChange]
    );

    switch (mode) {
        case 'decade':
            return <Decade defaultCurrent={current} onChange={onDecadeChange} />;
        default: {
            return (
                <CalendarContext.Provider value={{ locale: 'en' }}>
                    <div>
                        <Header
                            value={standardCurrent}
                            onChange={onCurrentChange}
                            type="year"
                            onModeChange={onModeChange}
                        />
                        <YearPanel
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

export default uncontrolled()(uncontrolled({ valueName: 'current', onChangeName: 'onCurrentChange' })(memo(Year)));
