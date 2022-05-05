import React, { memo, useContext, useMemo } from 'react';

import DecadePanel from 'src/view/DecadePanel';
import Header from 'src/view/Header';
import standard from 'src/util/standard';
import { DisabledFunc, SharedCalendarProps, TDate } from 'src/interface';
import useUncontrolled from 'src/useUncontrolled';
import CalendarContext, { withContext } from 'src/CalendarContext';
import classnames from 'src/util/classnames';

type DecadeProps = SharedCalendarProps & {
    // disable rule
    disabledRule?: {
        decade?: DisabledFunc;
    };
};

const Decade = ({
    now,
    value: _value,
    defaultValue = null,
    onChange: _onChange,
    current: _current,
    defaultCurrent,
    onCurrentChange: _onCurrentChange,
    sidebar,
    className,
    disabledRule = {},
    ...rest
}: DecadeProps) => {
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
    const { decade: disabledDecade } = disabledRule;
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
                        now={standardNow}
                        value={standardValue === null ? undefined : standardValue}
                        onChange={onChange}
                        current={standardCurrent}
                        onCurrentChange={onCurrentChange}
                        disabledDecade={disabledDecade}
                    />
                    {sidebar}
                </div>
            </div>
        </div>
    );
};

export default withContext<DecadeProps>(memo(Decade));
