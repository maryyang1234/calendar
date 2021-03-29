import React, { memo, useCallback, useContext, useMemo } from 'react';

import CalendarContext from '../CalendarContext';
import classnames from '../util/classnames';
import { SharedPanelProps } from './interface';
import TBody from './TBody';

type YearPanelProps = SharedPanelProps;

const C_COL = 3;
const C_ROW = 4;

const YearPanel = ({ value, onChange, current, onCurrentChange }: YearPanelProps) => {
    const baseYear = useMemo(() => ((current.year() / 10) | 0) * 10, [current]);
    const valueYear = useMemo(() => value?.year(), [value]);
    const { prefixCls } = useContext(CalendarContext);

    const cells = useMemo(() => {
        const count = C_COL * C_ROW;
        const cells = [];
        const activeCls = prefixCls + '-active';
        const prevCls = prefixCls + '-prev';
        const nextCls = prefixCls + '-next';
        for (let i = 0; i < count; i++) {
            const year = baseYear + i - 1;
            const active = valueYear === year;
            const current = i === 0 ? 'prev' : i > 10 ? 'next' : 'current';
            const cellInfo = {
                children: year,
                current,
                className: classnames(active && activeCls, current === 'prev' && prevCls, current === 'next' && nextCls)
            };
            cells.push(cellInfo);
        }
        return cells;
    }, [prefixCls, baseYear, valueYear]);

    const onYearClick = useCallback(
        (index: number) => {
            const cellInfo = cells[index];
            if (cellInfo.current === 'prev') {
                onCurrentChange(current.set('year', baseYear - 10));
            } else if (cellInfo.current === 'next') {
                onCurrentChange(current.set('year', baseYear + 10));
            } else {
                onChange(current.set('year', baseYear + index - 1));
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
            <TBody cells={cells} onCellClick={onYearClick} col={C_COL} row={C_ROW} mode={'year'} />
        </div>
    );
};

export default memo(YearPanel);
