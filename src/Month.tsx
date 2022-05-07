import React, { memo, useCallback, useContext, useMemo, useState } from 'react';

import MonthPanel from 'src/view/MonthPanel';
import YearPanel from 'src/view/YearPanel';
import DecadePanel from 'src/view/DecadePanel';
import Header from 'src/view/Header';
import standard from 'src/util/standard';
import classnames from 'src/util/classnames';
import CalendarContext, { withContext } from 'src/CalendarContext';
import useUncontrolled from 'src/useUncontrolled';
import { DisabledFunc, Mode, SharedCalendarProps, TDate } from 'src/interface';

type MonthProps = SharedCalendarProps & {
    // disable rule
    disabledRule?: {
        month?: DisabledFunc;
        year?: DisabledFunc;
        decade?: DisabledFunc;
    };
};

const Month = ({
    now,
    value: _value,
    defaultValue = null,
    onChange: _onChange,
    rangeValue,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange,
    sidebar,
    className,
    disabledRule = {},
    onModeChange,
    ...rest
}: MonthProps) => {
    const d = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate | null, Date>(_value, defaultValue, _onChange);
    const standardValue = useMemo(() => standard(value), [value]);
    const standardRangeValue = useMemo(
        () =>
            rangeValue
                ? ([standard(rangeValue[0]), standard(rangeValue[1])] as [Date | null, Date | null])
                : rangeValue,
        [rangeValue]
    );
    const [current, onCurrentChange] = useUncontrolled<TDate, Date>(
        _current,
        defaultCurrent || value || d,
        _onCurrentChange
    );
    const standardCurrent = useMemo(() => standard(current), [current]);
    const standardNow = useMemo(() => standard(now === undefined ? d : now), [d, now]);
    const [mode, setMode] = useState<Mode>('month');
    const { month: disabledMonth, year: disabledYear, decade: disabledDecade } = disabledRule;
    const handleModeChange = useCallback(
        (mode: Mode) => {
            onModeChange?.(mode);
            setMode(mode);
        },
        [onModeChange]
    );
    const onYearChange = useCallback(
        (current: Date) => {
            onCurrentChange(current);
            setMode('month');
        },
        [onCurrentChange]
    );
    const onDecadeChange = useCallback(
        (current: Date) => {
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
            month: prefixCls + '-month',
            monthWrap: prefixCls + '-month-wrap',
            body: prefixCls + '-body'
        };
    }, [context.prefixCls]);

    const panel = useMemo(() => {
        const sharedProps = {
            now: standardNow,
            value: standardValue === null ? undefined : standardValue,
            rangeValue: standardRangeValue,
            current: standardCurrent,
            onCurrentChange
        };
        switch (mode) {
            case 'month': {
                return <MonthPanel disabledMonth={disabledMonth} onChange={onChange} {...sharedProps} />;
            }
            case 'year': {
                return <YearPanel disabledYear={disabledYear} onChange={onYearChange} {...sharedProps} />;
            }
            case 'decade': {
                return <DecadePanel disabledDecade={disabledDecade} onChange={onDecadeChange} {...sharedProps} />;
            }
            default: {
                return null;
            }
        }
    }, [
        disabledDecade,
        disabledMonth,
        disabledYear,
        mode,
        onChange,
        onCurrentChange,
        onDecadeChange,
        onYearChange,
        standardCurrent,
        standardNow,
        standardRangeValue,
        standardValue
    ]);

    return (
        <div {...rest} className={classnames(cls.wrap, cls.month, className)}>
            <div className={cls.monthWrap}>
                <Header
                    value={standardCurrent}
                    onChange={onCurrentChange}
                    mode={mode}
                    onModeChange={handleModeChange}
                />
                <div className={cls.body}>
                    {panel}
                    {sidebar}
                </div>
            </div>
        </div>
    );
};

export default withContext<MonthProps>(memo(Month));
