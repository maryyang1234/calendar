import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import CalendarContext from 'src/CalendarContext';
import { DisabledFunc } from 'src/interface';
import classnames from 'src/util/classnames';
import { format, set } from 'src/util/date';
import { SharedPanelProps } from 'src/view/interface';
import TBody from 'src/view/TBody';

import getChangedValue from './getChangedValue';

type YearPanelProps = SharedPanelProps & { disabledYear?: DisabledFunc };

const C_COL = 3;
const C_ROW = 4;

const YearPanel = ({ now, value, onChange, rangeValue, current, onCurrentChange, disabledYear }: YearPanelProps) => {
    const baseYear = useMemo(() => ((current.getFullYear() / 10) | 0) * 10, [current]);
    const valueYear = useMemo(() => value?.getFullYear(), [value]);
    const nowYear = useMemo(() => now?.getFullYear(), [now]);
    const { prefixCls, onlyValidYear, onChangeWhenPrevNextClick, disabledPrevNextClickWhenDisabled } =
        useContext(CalendarContext);

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
        const start = onlyValidYear ? 0 : -1;
        const end = (onlyValidYear ? 10 : C_COL * C_ROW) + start;
        for (let i = start; i < end; i++) {
            const year = baseYear + i;
            const active = valueYear === year;
            const isCurrent = i < 0 ? 'prev' : i > 9 ? 'next' : 'current';
            const isNow = year === nowYear;
            const disabled = disabledYear?.(set(current, year, 'year'), value);
            const rangeStartCls = prefixCls + '-range-start';
            const rangeEndCls = prefixCls + '-range-end';
            const rangeMiddleCls = prefixCls + '-range-middle';
            let className = classnames(
                active && activeCls,
                isNow && nowCls,
                disabled && disabledCls,
                isCurrent === 'prev' && prevCls,
                isCurrent === 'next' && nextCls
            );
            if (rangeValue) {
                const t = set(current, year, 'year');
                const rangeStart = rangeValue?.[0];
                const rangeEnd = rangeValue?.[1];
                let startOrEndTag = false;
                const tString = format(t, 'YYYY');
                if (rangeStart) {
                    const rangeStartString = format(rangeStart, 'YYYY');
                    if (tString === rangeStartString) {
                        className = classnames(className, rangeStartCls);
                        startOrEndTag = true;
                    }
                }
                if (rangeEnd) {
                    const rangeEndString = format(rangeEnd, 'YYYY');
                    if (tString === rangeEndString) {
                        className = classnames(className, rangeEndCls);
                        startOrEndTag = true;
                    }
                }
                if (!startOrEndTag && rangeStart && rangeEnd && +rangeStart <= +rangeEnd) {
                    const tTS = +t;
                    if (tTS > +rangeStart && tTS < +rangeEnd) {
                        className = classnames(className, rangeMiddleCls);
                    }
                }
            }
            const cellInfo = {
                children: year,
                current: isCurrent,
                disabled,
                year,
                className
            };
            cells.push(cellInfo);
        }
        return cells;
    }, [prefixCls, onlyValidYear, baseYear, valueYear, nowYear, disabledYear, current, value, rangeValue]);

    const onYearClick = useCallback(
        (index: number) => {
            const cellInfo = cells[index];
            if (!cellInfo) return;
            if (cellInfo.disabled && disabledPrevNextClickWhenDisabled) return;
            if (cellInfo.current === 'prev') {
                onCurrentChange(set(current, baseYear - 10, 'year'));
            } else if (cellInfo.current === 'next') {
                onCurrentChange(set(current, baseYear + 10, 'year'));
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
            <TBody cells={cells} onCellClick={onYearClick} col={C_COL} row={C_ROW} mode={'year'} />
        </div>
    );
};

export default memo(YearPanel);
