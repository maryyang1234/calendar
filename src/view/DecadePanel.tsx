import React, { memo, useCallback, useContext, useMemo } from 'react';

import CalendarContext from '../CalendarContext';
import classnames from '../util/classnames';
import { SharedPanelProps } from './interface';
import TBody from './TBody';

type DecadePanelProps = SharedPanelProps;

const C_COL = 3;
const C_ROW = 4;

const DecadePanel = ({ value, onChange, current, onCurrentChange }: DecadePanelProps) => {
    const baseYear = useMemo(() => ((current.year() / 100) | 0) * 100, [current]);
    const valueYear = useMemo(() => value?.year(), [value]);
    const { prefixCls } = useContext(CalendarContext);

    const cells = useMemo(() => {
        const count = C_COL * C_ROW;
        const cells = [];
        const activeCls = prefixCls + '-active';
        const prevCls = prefixCls + '-prev';
        const nextCls = prefixCls + '-next';
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
    }, [baseYear, valueYear, prefixCls]);

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

    const cls = useMemo(
        () => ({
            table: prefixCls + '-table'
        }),
        [prefixCls]
    );

    return (
        <div className={cls.table}>
            <TBody cells={cells} onCellClick={onYearClick} col={C_COL} row={C_ROW} mode={'decade'} />
        </div>
    );
};
export default memo(DecadePanel);
