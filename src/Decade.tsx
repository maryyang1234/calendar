import React, { memo, useMemo } from 'react';
import { Dayjs } from 'dayjs';

import DecadePanel from './view/DecadePanel';
import Header from './view/Header';
import standard from './util/standard';
import { TDate } from './interface';
import useUncontrolled from './useUncontrolled';
import { withContext } from './CalendarContext';

interface DecadeProps {
    today?: TDate;
    value?: TDate;
    defaultValue?: TDate;
    onChange?: (v: Dayjs) => void;
    current?: TDate;
    defaultCurrent?: TDate;
    onCurrentChange?: (v: Dayjs) => void;
}

const Decade = ({
    value: _value,
    defaultValue,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange
}: DecadeProps) => {
    const now = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate, Dayjs>(_value, defaultValue, _onChange);
    const standardValue = useMemo(() => standard(value), [value]);
    const [current, onCurrentChange] = useUncontrolled<TDate, Dayjs>(
        _current,
        defaultCurrent || value || now,
        _onCurrentChange
    );
    const standardCurrent = useMemo(() => standard(current), [current]);

    return (
        <div>
            <Header value={standardCurrent} onChange={onCurrentChange} type="decade" />
            <DecadePanel
                value={standardValue}
                onChange={onChange}
                current={standardCurrent}
                onCurrentChange={onCurrentChange}
            />
        </div>
    );
};

export default withContext<DecadeProps>(memo(Decade));
