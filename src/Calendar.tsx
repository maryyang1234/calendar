import React, { memo, useCallback, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import DatePanel from './view/DatePanel';
import Header from './view/Header';
import Month from './Month';
import Year from './Year';
import standard from './util/standard';
import { SharedCalendarProps, TDate } from './interface';
import useUncontrolled from './useUncontrolled';
import { withContext } from './CalendarContext';

type CalendarProps = SharedCalendarProps & {
    // value of today
    today?: TDate;
};

const Calendar = ({
    today,
    value: _value,
    defaultValue = null,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange
}: CalendarProps) => {
    const now = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate | null, Dayjs>(_value, defaultValue, _onChange);
    const standardValue = useMemo(() => standard(value), [value]);
    const [current, onCurrentChange] = useUncontrolled<TDate, Dayjs>(
        _current,
        defaultCurrent || value || now,
        _onCurrentChange
    );
    const standardCurrent = useMemo(() => standard(current), [current]);
    const standardToday = useMemo(() => standard(today || dayjs()), [today]);
    const [mode, setMode] = useState('date');
    const onModeChange = useCallback((mode: string) => setMode(mode), []);
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
            return <Month value={standardValue} defaultCurrent={current} onChange={onMonthChange} />;
        case 'year':
            return <Year value={standardValue} defaultCurrent={current} onChange={onYearChange} />;
        default: {
            return (
                <div>
                    <Header
                        value={standardCurrent}
                        onChange={onCurrentChange}
                        type="date"
                        onModeChange={onModeChange}
                    />
                    <DatePanel
                        today={standardToday}
                        value={standardValue === null ? undefined : standardValue}
                        onChange={onChange}
                        current={standardCurrent}
                        onCurrentChange={onCurrentChange}
                    />
                </div>
            );
        }
    }
};

export default withContext<CalendarProps>(memo(Calendar));
