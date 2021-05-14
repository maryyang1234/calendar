import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import CalendarContext from 'src/CalendarContext';
import { set } from 'src/util/date';
import classnames from 'src/util/classnames';
import { SharedPanelProps } from 'src/view/interface';
import TBody from 'src/view/TBody';
import { DisabledFunc } from 'src/interface';

import getChangedValue from './getChangedValue';

type DecadePanelProps = SharedPanelProps & { disabledDecade?: DisabledFunc };

const C_COL = 3;
const C_ROW = 4;

const DecadePanel = ({ now, value, onChange, current, onCurrentChange, disabledDecade }: DecadePanelProps) => {
    const baseYear = useMemo(() => ((current.getFullYear() / 100) | 0) * 100, [current]);
    const valueYear = useMemo(() => value?.getFullYear(), [value]);
    const nowYear = useMemo(() => now?.getFullYear(), [now]);
    const { prefixCls, onlyValidDecade, onChangeWhenPrevNextClick, disabledPrevNextClickWhenDisabled } = useContext(
        CalendarContext
    );

    // use ref to reduce reRender
    const currentRef = useRef(current);
    const valueRef = useRef(value);
    useEffect(() => {
        currentRef.current = current;
        valueRef.current = value;
    }, [current, value]);

    const cells = useMemo(() => {
        const cells = [];
        const activeCls = prefixCls + '-active';
        const disabledCls = prefixCls + '-disabled';
        const nowCls = prefixCls + '-now';
        const prevCls = prefixCls + '-prev';
        const nextCls = prefixCls + '-next';
        const start = onlyValidDecade ? 0 : -1;
        const end = (onlyValidDecade ? 10 : C_COL * C_ROW) + start;
        for (let i = start; i < end; i++) {
            const year = baseYear + i * 10;
            const latestYear = year + 9;
            const active = valueYear !== undefined && valueYear >= year && valueYear <= latestYear;
            const isNow = nowYear !== undefined && nowYear >= year && nowYear <= latestYear;
            const disabled = disabledDecade?.(set(current, year, 'year'), value);
            const isCurrent = i < 0 ? 'prev' : i > 9 ? 'next' : 'current';
            const cellInfo = {
                children: year + '-' + latestYear,
                current: isCurrent,
                disabled,
                year,
                className: classnames(
                    active && activeCls,
                    isNow && nowCls,
                    disabled && disabledCls,
                    isCurrent === 'prev' && prevCls,
                    isCurrent === 'next' && nextCls
                )
            };
            cells.push(cellInfo);
        }
        return cells;
    }, [prefixCls, onlyValidDecade, baseYear, valueYear, nowYear, disabledDecade, current, value]);

    const onYearClick = useCallback(
        (index: number) => {
            const cellInfo = cells[index];
            if (!cellInfo) return;
            if (cellInfo.disabled && disabledPrevNextClickWhenDisabled) return;
            if (cellInfo.current === 'prev') {
                onCurrentChange(set(current, baseYear - 100, 'year'));
            } else if (cellInfo.current === 'next') {
                onCurrentChange(set(current, baseYear + 100, 'year'));
            }
            if (cellInfo.disabled) return;
            if (cellInfo.current === 'current' || onChangeWhenPrevNextClick) {
                const changedValue = getChangedValue({ year: cellInfo.year }, currentRef.current, valueRef.current);
                onChange(changedValue);
            }
        },
        [
            baseYear,
            cells,
            current,
            disabledPrevNextClickWhenDisabled,
            onChange,
            onChangeWhenPrevNextClick,
            onCurrentChange
        ]
    );

    const cls = useMemo(
        () => ({
            table: prefixCls + '-table'
        }),
        [prefixCls]
    );

    return (
        <div className={cls.table}>
            <TBody cells={cells} onCellClick={onYearClick} col={C_COL} row={C_ROW} mode="decade" />
        </div>
    );
};
export default memo(DecadePanel);
