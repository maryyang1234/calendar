import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';

import YearPanel from './view/YearPanel';
import Header from './view/Header';
import Decade from './Decade';
import standard from './util/standard';
import { SharedCalendarProps, TDate } from './interface';
import useUncontrolled from './useUncontrolled';
import CalendarContext, { withContext } from './CalendarContext';
import classnames from './util/classnames';

type YearProps = SharedCalendarProps;

const Year = ({
    value: _value,
    defaultValue = null,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange,
    className,
    ...rest
}: YearProps) => {
    const now = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate | null, Dayjs>(_value, defaultValue, _onChange);
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
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return {
            wrap: prefixCls,
            year: prefixCls + '-year',
            yearWrap: prefixCls + '-year-wrap'
        };
    }, [context.prefixCls]);

    return (
        <div {...rest} className={classnames(cls.wrap, cls.year, className)}>
            {mode === 'decade' ? (
                <Decade value={standardValue} defaultCurrent={current} onChange={onDecadeChange} />
            ) : (
                <div className={cls.yearWrap}>
                    <Header
                        value={standardCurrent}
                        onChange={onCurrentChange}
                        type="year"
                        onModeChange={onModeChange}
                    />
                    <YearPanel
                        value={standardValue === null ? undefined : standardValue}
                        onChange={onChange}
                        current={standardCurrent}
                        onCurrentChange={onCurrentChange}
                    />
                </div>
            )}
        </div>
    );
};

export default withContext<YearProps>(memo(Year));
