import React, { memo, useContext, useMemo } from 'react';
import { Dayjs } from 'dayjs';

import DecadePanel from './view/DecadePanel';
import Header from './view/Header';
import standard from './util/standard';
import { SharedCalendarProps, TDate } from './interface';
import useUncontrolled from './useUncontrolled';
import CalendarContext, { withContext } from './CalendarContext';
import classnames from './util/classnames';

type DecadeProps = SharedCalendarProps;

const Decade = ({
    value: _value,
    defaultValue = null,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange,
    sidebar,
    className,
    ...rest
}: DecadeProps) => {
    const now = useMemo(() => new Date(), []);
    const [value, onChange] = useUncontrolled<TDate | null, Dayjs>(_value, defaultValue, _onChange);
    const standardValue = useMemo(() => standard(value), [value]);
    const [current, onCurrentChange] = useUncontrolled<TDate, Dayjs>(
        _current,
        defaultCurrent || value || now,
        _onCurrentChange
    );
    const standardCurrent = useMemo(() => standard(current), [current]);
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return {
            wrap: prefixCls,
            decade: prefixCls + '-decade',
            decadeWrap: prefixCls + '-decade-wrap',
            body: prefixCls + '-body'
        };
    }, [context.prefixCls]);

    return (
        <div {...rest} className={classnames(cls.wrap, cls.decade, className)}>
            <div className={cls.decadeWrap}>
                <Header value={standardCurrent} onChange={onCurrentChange} mode="decade" />
                <div className={cls.body}>
                    <DecadePanel
                        value={standardValue === null ? undefined : standardValue}
                        onChange={onChange}
                        current={standardCurrent}
                        onCurrentChange={onCurrentChange}
                    />
                    {sidebar}
                </div>
            </div>
        </div>
    );
};

export default withContext<DecadeProps>(memo(Decade));
