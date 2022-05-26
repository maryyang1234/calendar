import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { format, set } from 'src/util/date';
import CalendarContext, { DefaultContext } from 'src/CalendarContext';
import classnames from 'src/util/classnames';
import { SharedPanelProps } from 'src/view/interface';
import TBody from 'src/view/TBody';
import { DisabledFunc } from 'src/interface';
import useCls from 'src/useCls';

import getChangedValue from './getChangedValue';

type MonthPanelProps = Omit<SharedPanelProps, 'onCurrentChange'> & { disabledMonth?: DisabledFunc };

const C_COL = 3;
const C_ROW = 4;

const defaultMonths = DefaultContext.locale.months;

const MonthPanel = ({ now, value, onChange, rangeValue, current, disabledMonth }: MonthPanelProps) => {
    const valueYear = useMemo(() => value?.getFullYear(), [value]);
    const valueMonth = useMemo(() => value?.getMonth(), [value]);
    const currentYear = useMemo(() => current?.getFullYear(), [current]);
    const nowYear = useMemo(() => now?.getFullYear(), [now]);
    const nowMonth = useMemo(() => now?.getMonth(), [now]);
    const { locale } = useContext(CalendarContext);
    const cls = useCls();
    const months = locale?.months || defaultMonths;

    // use ref to reduce reRender
    const currentRef = useRef(current);
    const valueRef = useRef(value);
    useEffect(() => {
        currentRef.current = current;
        valueRef.current = value;
    }, [current, value]);

    const cells = useMemo(() => {
        const count = C_COL * C_ROW;
        const cells = [];
        for (let i = 0; i < count; i++) {
            const active = currentYear === valueYear && valueMonth === i;
            const isNow = currentYear === nowYear && nowMonth === i;
            const disabled = disabledMonth?.(set(current, i, 'month'), value);
            let className = classnames(active && cls.active, isNow && cls.now, disabled && cls.disabled);
            if (rangeValue) {
                const t = set(current, i, 'month');
                const rangeStart = rangeValue?.[0];
                const rangeEnd = rangeValue?.[1];
                let startOrEndTag = false;
                const tString = format(t, 'YYYYMM');
                if (rangeStart) {
                    const rangeStartString = format(rangeStart, 'YYYYMM');
                    if (tString === rangeStartString) {
                        className = classnames(className, cls.rangeFirst);
                        startOrEndTag = true;
                    }
                }
                if (rangeEnd) {
                    const rangeEndString = format(rangeEnd, 'YYYYMM');
                    if (tString === rangeEndString) {
                        className = classnames(className, cls.rangeLast);
                        startOrEndTag = true;
                    }
                }
                if (startOrEndTag && (!rangeStart || !rangeEnd)) {
                    className = classnames(className, cls.rangeUnclosed);
                }
                if (!startOrEndTag && rangeStart && rangeEnd && +rangeStart <= +rangeEnd) {
                    const tTS = +t;
                    if (tTS > +rangeStart && tTS < +rangeEnd) {
                        className = classnames(className, cls.rangeMiddle);
                    }
                }
            }
            const cellInfo = {
                children: months[i],
                disabled,
                value: { year: currentYear, month: i },
                className
            };
            cells.push(cellInfo);
        }
        return cells;
    }, [currentYear, valueYear, valueMonth, nowYear, nowMonth, disabledMonth, current, value, rangeValue, months, cls]);

    const onMonthClick = useCallback(
        (index: number) => {
            const cellInfo = cells[index];
            if (cellInfo.disabled) return;
            const changedValue = getChangedValue(cellInfo.value, currentRef.current, valueRef.current);
            onChange(changedValue);
        },
        [cells, onChange]
    );

    return (
        <div className={cls.table}>
            <TBody cells={cells} onCellClick={onMonthClick} col={C_COL} row={C_ROW} mode="month" />
        </div>
    );
};

export default memo(MonthPanel);
