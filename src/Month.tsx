import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { Dayjs } from 'dayjs';

import MonthPanel from './view/MonthPanel';
import Header from './view/Header';
import Year from './Year';
import standard from './util/standard';
import { SharedCalendarProps, TDate } from './interface';
import useUncontrolled from './useUncontrolled';
import CalendarContext, { withContext } from './CalendarContext';
import classnames from './util/classnames';

type MonthProps = SharedCalendarProps;

const Month = ({
    value: _value,
    defaultValue = null,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange,
    sidebar,
    className,
    ...rest
}: MonthProps) => {
    const now = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate | null, Dayjs>(_value, defaultValue, _onChange);
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
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return {
            wrap: prefixCls,
            month: prefixCls + '-month',
            monthWrap: prefixCls + '-month-wrap',
            body: prefixCls + '-body'
        };
    }, [context.prefixCls]);

    return (
        <div {...rest} className={classnames(cls.wrap, cls.month, className)}>
            {mode === 'year' ? (
                <Year value={standardValue} defaultCurrent={current} onChange={onYearChange} />
            ) : (
                <div className={cls.monthWrap}>
                    <Header
                        value={standardCurrent}
                        onChange={onCurrentChange}
                        type="month"
                        onModeChange={onModeChange}
                    />
                    <div className={cls.body}>
                        <MonthPanel
                            value={standardValue === null ? undefined : standardValue}
                            onChange={onChange}
                            current={standardCurrent}
                        />
                        {sidebar}
                    </div>
                </div>
            )}
        </div>
    );
};

export default withContext<MonthProps>(memo(Month));
