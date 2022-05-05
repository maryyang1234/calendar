import React, { memo, useCallback, useContext, useMemo, useState } from 'react';

import YearPanel from 'src/view/YearPanel';
import DecadePanel from 'src/view/DecadePanel';
import Header from 'src/view/Header';
import CalendarContext, { withContext } from 'src/CalendarContext';
import useUncontrolled from 'src/useUncontrolled';
import standard from 'src/util/standard';
import classnames from 'src/util/classnames';
import { DisabledFunc, Mode, SharedCalendarProps, TDate } from 'src/interface';

type YearProps = SharedCalendarProps & {
    // disable rule
    disabledRule?: {
        year?: DisabledFunc;
        decade?: DisabledFunc;
    };
};

const Year = ({
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
}: YearProps) => {
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
    const [mode, setMode] = useState<Mode>('year');
    const { year: disabledYear, decade: disabledDecade } = disabledRule;
    const onModeChange = useCallback((mode: Mode) => setMode(mode), []);
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
            year: prefixCls + '-year',
            yearWrap: prefixCls + '-year-wrap',
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
            case 'year': {
                return <YearPanel disabledYear={disabledYear} onChange={onChange} {...sharedProps} />;
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
        disabledYear,
        mode,
        onChange,
        onCurrentChange,
        onDecadeChange,
        standardCurrent,
        standardNow,
        standardRangeValue,
        standardValue
    ]);

    return (
        <div {...rest} className={classnames(cls.wrap, cls.year, className)}>
            <div className={cls.yearWrap}>
                <Header value={standardCurrent} onChange={onCurrentChange} mode={mode} onModeChange={onModeChange} />
                <div className={cls.body}>
                    {panel}
                    {sidebar}
                </div>
            </div>
        </div>
    );
};

export default withContext<YearProps>(memo(Year));
