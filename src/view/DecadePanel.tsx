import React, { memo, useCallback, useContext, useMemo } from 'react';

import CalendarContext from '../CalendarContext';
import classnames from '../util/classnames';
import { SharedPanelProps } from './interface';
import TablePanel from './TablePanel';

type DecadePanelProps = SharedPanelProps;

const C_COL = 3;
const C_ROW = 4;

const DecadePanel = ({ value, onChange, current, onCurrentChange }: DecadePanelProps) => {
    const baseYear = useMemo(() => ((current.year() / 100) | 0) * 100, [current]);
    const valueYear = useMemo(() => value?.year(), [value]);

    const context = useContext(CalendarContext);

    const cells = useMemo(() => {
        const count = C_COL * C_ROW;
        const cells = [];
        const prefix = context.prefix;
        const activeCls = prefix + '-active';
        const prevCls = prefix + '-prev';
        const nextCls = prefix + '-next';
        for (let i = 0; i < count; i++) {
            const year = baseYear + (i - 1) * 10;
            const latestYear = year + 9;
            const active = valueYear !== undefined && valueYear >= year && valueYear <= latestYear;
            const current = i === 0 ? 'prev' : i > 10 ? 'next' : 'current';
            const cellInfo = {
                children: year + '-' + latestYear,
                current,
                year,
                className: classnames(active && activeCls, current === 'prev' && prevCls, current === 'next' && nextCls)
            };
            cells.push(cellInfo);
        }
        return cells;
    }, [baseYear, valueYear, context.prefix]);

    const onYearClick = useCallback(
        (index: number) => {
            const cellInfo = cells[index];
            if (cellInfo.current === 'prev') {
                onCurrentChange(current.set('year', baseYear - 100));
            } else if (cellInfo.current === 'next') {
                onCurrentChange(current.set('year', baseYear + 100));
            } else {
                onChange(current.set('year', cellInfo.year));
            }
        },
        [baseYear, cells, current, onChange, onCurrentChange]
    );

    return <TablePanel cells={cells} onCellClick={onYearClick} mode={'decade'} />;
};
export default memo(DecadePanel);
