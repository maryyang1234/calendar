import React, { memo, useCallback, useContext, useMemo, useState } from 'react';

import DatePanel from 'src/view/DatePanel';
import MonthPanel from 'src/view/MonthPanel';
import YearPanel from 'src/view/YearPanel';
import DecadePanel from 'src/view/DecadePanel';
import Header from 'src/view/Header';
import standard from 'src/util/standard';
import classnames from 'src/util/classnames';
import { DisabledFunc, Mode, SharedCalendarProps, TDate } from 'src/interface';
import CalendarContext, { withContext } from 'src/CalendarContext';
import useUncontrolled from 'src/useUncontrolled';

type CalendarProps = SharedCalendarProps & {
    // disable rule
    disabledRule?: {
        date?: DisabledFunc;
        month?: DisabledFunc;
        year?: DisabledFunc;
        decade?: DisabledFunc;
    };
};

const Calendar = ({
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
    ...rest
}: CalendarProps) => {
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
    const [mode, setMode] = useState<Mode>('date');
    const { date: disabledDate, month: disabledMonth, year: disabledYear, decade: disabledDecade } = disabledRule;
    const onModeChange = useCallback((mode: Mode) => setMode(mode), []);
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
            date: prefixCls + '-date',
            dateWrap: prefixCls + '-date-wrap',
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
            case 'date': {
                return <DatePanel disabledDate={disabledDate} onChange={onChange} {...sharedProps} />;
            }
            case 'month': {
                return <MonthPanel disabledMonth={disabledMonth} onChange={onMonthChange} {...sharedProps} />;
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
        disabledDate,
        disabledDecade,
        disabledMonth,
        disabledYear,
        mode,
        onChange,
        onCurrentChange,
        onDecadeChange,
        onMonthChange,
        onYearChange,
        standardCurrent,
        standardNow,
        standardRangeValue,
        standardValue
    ]);

    return (
        <div {...rest} className={classnames(cls.wrap, cls.date, className)}>
            <div className={cls.dateWrap}>
                <Header value={standardCurrent} onChange={onCurrentChange} mode={mode} onModeChange={onModeChange} />
                <div className={cls.body}>
                    {panel}
                    {sidebar}
                </div>
            </div>
        </div>
    );
};

export default withContext<CalendarProps>(memo(Calendar));
