import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import DatePanel from './view/DatePanel';
import Header from './view/Header';
import Month from './Month';
import Year from './Year';
import standard from './util/standard';
import { SharedCalendarProps, TDate } from './interface';
import useUncontrolled from './useUncontrolled';
import CalendarContext, { withContext } from './CalendarContext';
import classnames from './util/classnames';

type CalendarProps = SharedCalendarProps & {
    // value of today
    today?: TDate;
    // disable rule
    disabledDate?: (t: TDate) => boolean;
};

const Calendar = ({
    today,
    value: _value,
    defaultValue = null,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange,
    sidebar,
    className,
    disabledDate,
    ...rest
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
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return {
            wrap: prefixCls,
            date: prefixCls + '-date',
            dateWrap: prefixCls + '-date-wrap',
            body: prefixCls + '-body'
        };
    }, [context.prefixCls]);

    return (
        <div {...rest} className={classnames(cls.wrap, cls.date, className)}>
            {mode === 'month' ? (
                <Month value={standardValue} defaultCurrent={current} onChange={onMonthChange} sidebar={sidebar} />
            ) : mode === 'year' ? (
                <Year value={standardValue} defaultCurrent={current} onChange={onYearChange} sidebar={sidebar} />
            ) : (
                <div className={cls.dateWrap}>
                    <Header
                        value={standardCurrent}
                        onChange={onCurrentChange}
                        mode="date"
                        onModeChange={onModeChange}
                    />
                    <div className={cls.body}>
                        <DatePanel
                            today={standardToday}
                            value={standardValue === null ? undefined : standardValue}
                            onChange={onChange}
                            disabledDate={disabledDate}
                            current={standardCurrent}
                            onCurrentChange={onCurrentChange}
                        />
                        {sidebar}
                    </div>
                </div>
            )}
        </div>
    );
};

export default withContext<CalendarProps>(memo(Calendar));
