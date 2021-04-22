import React, { memo, useCallback, useContext, useMemo } from 'react';

import CalendarContext from 'src/CalendarContext';
import classnames from 'src/util/classnames';
import { set } from 'src/util/date';
import { SharedPanelProps } from 'src/view/interface';
import TBody from 'src/view/TBody';

type YearPanelProps = SharedPanelProps;

const C_COL = 3;
const C_ROW = 4;

const YearPanel = ({ value, onChange, current, onCurrentChange }: YearPanelProps) => {
    const baseYear = useMemo(() => ((current.getFullYear() / 10) | 0) * 10, [current]);
    const valueYear = useMemo(() => value?.getFullYear(), [value]);
    const { prefixCls, onlyValidYear, onChangeWhenPrevNextClick } = useContext(CalendarContext);

    const cells = useMemo(() => {
        const cells = [];
        const activeCls = prefixCls + '-active';
        const prevCls = prefixCls + '-prev';
        const nextCls = prefixCls + '-next';
        const start = onlyValidYear ? 0 : -1;
        const end = (onlyValidYear ? 10 : C_COL * C_ROW) + start;
        for (let i = start; i < end; i++) {
            const year = baseYear + i;
            const active = valueYear === year;
            const current = i < 0 ? 'prev' : i > 9 ? 'next' : 'current';
            const cellInfo = {
                children: year,
                current,
                year,
                className: classnames(active && activeCls, current === 'prev' && prevCls, current === 'next' && nextCls)
            };
            cells.push(cellInfo);
        }
        return cells;
    }, [onlyValidYear, prefixCls, baseYear, valueYear]);

    const onYearClick = useCallback(
        (index: number) => {
            const cellInfo = cells[index];
            if (!cellInfo) return;
            if (cellInfo.current === 'prev') {
                onCurrentChange(set(current, baseYear - 10, 'year'));
            } else if (cellInfo.current === 'next') {
                onCurrentChange(set(current, baseYear + 10, 'year'));
            }
            if (cellInfo.current === 'current' || onChangeWhenPrevNextClick) {
                onChange(set(current, cellInfo.year, 'year'));
            }
        },
        [baseYear, cells, current, onChange, onChangeWhenPrevNextClick, onCurrentChange]
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
