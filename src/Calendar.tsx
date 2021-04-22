import React, { memo, useCallback, useContext, useMemo, useState } from 'react';

import DatePanel from 'src/view/DatePanel';
import Header from 'src/view/Header';
import Month from 'src/Month';
import Year from 'src/Year';
import standard from 'src/util/standard';
import { SharedCalendarProps, TDate } from 'src/interface';
import useUncontrolled from 'src/useUncontrolled';
import CalendarContext, { withContext } from 'src/CalendarContext';
import classnames from 'src/util/classnames';

type CalendarProps = SharedCalendarProps & {
    // disable rule
    disabledDate?: (t: TDate) => boolean;
};

const Calendar = ({
    now,
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
    const d = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate | null, Date>(_value, defaultValue, _onChange);
    const standardValue = useMemo(() => standard(value), [value]);
    const [current, onCurrentChange] = useUncontrolled<TDate, Date>(
        _current,
        defaultCurrent || value || d,
        _onCurrentChange
    );
    const standardCurrent = useMemo(() => standard(current), [current]);
    const standardNow = useMemo(() => standard(now === undefined ? d : now), [d, now]);
    const [mode, setMode] = useState('date');
    const onModeChange = useCallback((mode: string) => setMode(mode), []);
    const onMonthChange = useCallback(
        (current: Date) => {
            onCurrentChange(current);
            setMode('date');
        },
        [onCurrentChange]
    );
    const onYearChange = useCallback(
        (current: Date) => {
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
                <Month
                    now={standardNow}
                    value={standardValue}
                    defaultCurrent={current}
                    onChange={onMonthChange}
                    sidebar={sidebar}
                />
            ) : mode === 'year' ? (
                <Year
                    now={standardNow}
                    value={standardValue}
                    defaultCurrent={current}
                    onChange={onYearChange}
                    sidebar={sidebar}
                />
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
                            now={standardNow}
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
