import React, { memo, useCallback, useContext, useMemo } from 'react';

import CalendarContext, { DefaultContext } from '../CalendarContext';
import classnames from '../util/classnames';
import { SharedPanelProps } from './interface';
import TablePanel from './TablePanel';

type MonthPanelProps = Omit<SharedPanelProps, 'onCurrentChange'>;

const C_COL = 3;
const C_ROW = 4;

const defaultMonths = DefaultContext.locale.months;

const MonthPanel = ({ value, onChange, current }: MonthPanelProps) => {
    const valueMonth = useMemo(() => value?.month(), [value]);
    const valueYear = useMemo(() => value?.year(), [value]);
    const currentYear = useMemo(() => current.year(), [current]);

    const context = useContext(CalendarContext);
    const months = context.locale?.months || defaultMonths;

    const cells = useMemo(() => {
        const count = C_COL * C_ROW;
        const cells = [];
        const prefix = context.prefix;
        const activeCls = prefix + '-active';
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
    }, [context.prefix, currentYear, valueYear, valueMonth, months]);

    const onMonthClick = useCallback(
        (index: number) => {
            onChange(current.set('month', index));
        },
        [current, onChange]
    );

    return <TablePanel cells={cells} onCellClick={onMonthClick} mode={'month'} />;
};

export default memo(MonthPanel);
