import { Dayjs } from 'dayjs';
import React, { memo, useCallback, useContext, useMemo } from 'react';

import CalendarContext from '../CalendarContext';
import classnames from '../util/classnames';
import TablePanel from './TablePanel';

interface MonthPanelProps {
    // 选中值
    value?: Dayjs;
    // 选中回调
    onChange: (t: Dayjs) => void;
    // 当前面板值
    current: Dayjs;
    // 面板切换回调
    onCurrentChange: (t: Dayjs) => void;
}

const C_COL = 3;
const C_ROW = 4;

const MonthPanel = ({ value, onChange, current }: MonthPanelProps) => {
    const valueMonth = useMemo(() => value?.month(), [value]);
    const valueYear = useMemo(() => value?.year(), [value]);
    const currentYear = useMemo(() => current.year(), [current]);

    const context = useContext(CalendarContext);
    const months = context.locale.months;

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
