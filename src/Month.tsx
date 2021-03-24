import React, { memo, useCallback, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';

import MonthPanel from './view/MonthPanel';
import Header from './view/Header';
import Year from './Year';
import { TDate } from './interface';
import standard from './util/standard';
import useUncontrolled from './useUncontrolled';
import { withContext } from './CalendarContext';

interface MonthProps {
    value?: TDate;
    defaultValue?: TDate;
    onChange?: (v: Dayjs) => void;
    current?: TDate;
    defaultCurrent?: TDate;
    onCurrentChange?: (v: Dayjs) => void;
}

const Month = ({
    value: _value,
    defaultValue,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange
}: MonthProps) => {
    const now = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate, Dayjs>(_value, defaultValue, _onChange);
    const standardValue = useMemo(() => standard(value), [value]);
    const [current, onCurrentChange] = useUncontrolled<TDate, Dayjs>(
        _current,
        defaultCurrent || value || now,
        _onCurrentChange
    );
    const standardCurrent = useMemo(() => standard(current), [current]);
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
            return <Year value={standardValue} defaultCurrent={current} onChange={onYearChange} />;
        default: {
            return (
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
            );
        }
    }
};

export default withContext<MonthProps>(memo(Month));
