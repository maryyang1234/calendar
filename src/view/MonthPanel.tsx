import React, { memo, useCallback, useContext, useMemo } from 'react';

import { set } from 'src/util/date';
import CalendarContext, { DefaultContext } from 'src/CalendarContext';
import classnames from 'src/util/classnames';
import { SharedPanelProps } from 'src/view/interface';
import TBody from 'src/view/TBody';

type MonthPanelProps = Omit<SharedPanelProps, 'onCurrentChange'>;

const C_COL = 3;
const C_ROW = 4;

const defaultMonths = DefaultContext.locale.months;

const MonthPanel = ({ value, onChange, current }: MonthPanelProps) => {
    const valueMonth = useMemo(() => value?.getMonth(), [value]);
    const valueYear = useMemo(() => value?.getFullYear(), [value]);
    const currentYear = useMemo(() => current?.getFullYear(), [current]);
    const { locale, prefixCls } = useContext(CalendarContext);
    const months = locale?.months || defaultMonths;

    const cells = useMemo(() => {
        const count = C_COL * C_ROW;
        const cells = [];
        const activeCls = prefixCls + '-active';
        const sameYear = currentYear === valueYear;
        for (let i = 0; i < count; i++) {
            const active = sameYear && valueMonth === i;
            const cellInfo = {
                children: months[i],
                className: classnames(active && activeCls)
            };
            cells.push(cellInfo);
        }
        return cells;
    }, [prefixCls, currentYear, valueYear, valueMonth, months]);

    const onMonthClick = useCallback(
        (index: number) => {
            onChange(set(current, index, 'month'));
        },
        [current, onChange]
    );

    const cls = useMemo(
        () => ({
            table: prefixCls + '-table'
        }),
        [prefixCls]
    );

    return (
        <div className={cls.table}>
            <TBody cells={cells} onCellClick={onMonthClick} col={C_COL} row={C_ROW} mode={'month'} />
        </div>
    );
};

export default memo(MonthPanel);
