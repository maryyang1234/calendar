import React, { memo, useCallback, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';

import YearPanel from './view/YearPanel';
import Header from './view/Header';
import Decade from './Decade';
import { TDate } from './interface';
import standard from './util/standard';
import useUncontrolled from './useUncontrolled';
import { withContext } from './CalendarContext';

interface YearProps {
    value?: TDate;
    defaultValue?: TDate;
    onChange?: (v: Dayjs) => void;
    current?: TDate;
    defaultCurrent?: TDate;
    onCurrentChange?: (v: Dayjs) => void;
}

const Year = ({
    value: _value,
    defaultValue,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange
}: YearProps) => {
    const now = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate, Dayjs>(_value, defaultValue, _onChange);
    const standardValue = useMemo(() => standard(value), [value]);
    const [current, onCurrentChange] = useUncontrolled<TDate, Dayjs>(
        _current,
        defaultCurrent || value || now,
        _onCurrentChange
    );
    const standardCurrent = useMemo(() => standard(current), [current]);
    const [mode, setMode] = useState('year');
    const onModeChange = useCallback((mode: string) => setMode(mode), []);
    const onDecadeChange = useCallback(
        (current: Dayjs) => {
            onCurrentChange(current);
            setMode('year');
        },
        [onCurrentChange]
    );

    switch (mode) {
        case 'decade':
            return <Decade value={standardValue} defaultCurrent={current} onChange={onDecadeChange} />;
        default: {
            return (
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
            );
        }
    }
};

export default withContext<YearProps>(memo(Year));
