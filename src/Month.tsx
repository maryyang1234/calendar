import React, { memo, useCallback, useContext, useMemo, useState } from 'react';

import MonthPanel from 'src/view/MonthPanel';
import Header from 'src/view/Header';
import Year from 'src/Year';
import standard from 'src/util/standard';
import { SharedCalendarProps, TDate } from 'src/interface';
import useUncontrolled from 'src/useUncontrolled';
import CalendarContext, { withContext } from 'src/CalendarContext';
import classnames from 'src/util/classnames';

type MonthProps = SharedCalendarProps;

const Month = ({
    now,
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
    const [mode, setMode] = useState('month');
    const onModeChange = useCallback((mode: string) => {
        setMode(mode);
    }, []);
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
            month: prefixCls + '-month',
            monthWrap: prefixCls + '-month-wrap',
            body: prefixCls + '-body'
        };
    }, [context.prefixCls]);

    return (
        <div {...rest} className={classnames(cls.wrap, cls.month, className)}>
            {mode === 'year' ? (
                <Year now={standardNow} value={standardValue} onChange={onYearChange} defaultCurrent={current} />
            ) : (
                <div className={cls.monthWrap}>
                    <Header
                        value={standardCurrent}
                        onChange={onCurrentChange}
                        mode="month"
                        onModeChange={onModeChange}
                    />
                    <div className={cls.body}>
                        <MonthPanel
                            now={standardNow}
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
