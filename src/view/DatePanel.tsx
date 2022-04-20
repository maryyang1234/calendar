import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react';

import { DisabledFunc } from 'src/interface';
import { add, format, getDaysInMonth, set } from 'src/util/date';
import classnames from 'src/util/classnames';
import CalendarContext, { DefaultContext } from 'src/CalendarContext';
import { SharedPanelProps } from 'src/view/interface';
import TBody from 'src/view/TBody';

import getChangedValue from './getChangedValue';

type DateBodyProps = SharedPanelProps & {
    // disable rule
    disabledDate?: DisabledFunc;
};

const C_COL = 7;
const C_ROW = 6;

const getDays = (
    v: Date,
    cls: Record<string, string>,
    activeV?: Date,
    now?: Date,
    disabledDate?: DateBodyProps['disabledDate'],
    rangeValue?: DateBodyProps['rangeValue']
) => {
    v = new Date(+v);
    // 月天数
    const daysInMonth = getDaysInMonth(v);
    // 月初
    const firstDayOfMonth = set(v, 1, 'date');
    // 周几，0 为周日
    const day = firstDayOfMonth.getDay();
    // 面板的第一天
    const firstDayOfPanel = new Date(+firstDayOfMonth - day * 1000 * 60 * 60 * 24);

    const activeVString = format(activeV, 'YYYYMMDD');
    const nowVString = format(now, 'YYYYMMDD');

    const min = day;
    const max = day + daysInMonth;
    // 日期合集
    const panelInfo = [];
    for (let i = 0; i < C_ROW; i++) {
        for (let j = 0; j < C_COL; j++) {
            const index = i * C_COL + j;
            const t = add(firstDayOfPanel, index, 'date');
            const tString = format(t, 'YYYYMMDD');
            const active = tString === activeVString;
            const current = index < min ? 'prev' : index >= max ? 'next' : 'current';
            const disabled = disabledDate?.(t, activeV);
            const isNow = tString === nowVString;
            const date = t.getDate();
            const month = t.getMonth();
            const year = t.getFullYear();
            let className = classnames(
                active && cls.active,
                disabled && cls.disabled,
                isNow && cls.now,
                current === 'prev' && cls.prev,
                current === 'next' && cls.next
            );
            if (rangeValue) {
                const rangeStart = rangeValue?.[0];
                const rangeEnd = rangeValue?.[1];
                let startOrEndTag = false;
                if (rangeStart) {
                    const rangeStartString = format(rangeStart, 'YYYYMMDD');
                    if (tString === rangeStartString) {
                        className = classnames(className, cls.rangeStart);
                        startOrEndTag = true;
                    }
                }
                if (rangeEnd) {
                    const rangeEndString = format(rangeEnd, 'YYYYMMDD');
                    if (tString === rangeEndString) {
                        className = classnames(className, cls.rangeEnd);
                        startOrEndTag = true;
                    }
                }
                if (!startOrEndTag && rangeStart && rangeEnd && +rangeStart <= +rangeEnd) {
                    // const minRangeStart = +set(rangeStart, {
                    //     ms: 0,
                    //     second: 0,
                    //     minute: 0,
                    //     hour: 0
                    // });
                    // const maxRangeEnd = +set(rangeEnd, {
                    //     ms: 999,
                    //     second: 59,
                    //     minute: 59,
                    //     hour: 23
                    // });
                    const tTS = +t;
                    if (tTS > +rangeStart && tTS < +rangeEnd) {
                        className = classnames(className, cls.rangeMiddle);
                    }
                }
            }

            panelInfo.push({
                value: {
                    year,
                    month,
                    date
                },
                children: t.getDate(),
                current,
                active,
                disabled,
                className
            });
        }
    }
    return panelInfo;
};

const defaultWeekdays = DefaultContext.locale.weekdays;

const DateBody = ({ value, onChange, rangeValue, current, onCurrentChange, now, disabledDate }: DateBodyProps) => {
    const { locale, prefixCls, onChangeWhenPrevNextClick, disabledPrevNextClickWhenDisabled } =
        useContext(CalendarContext);
    const weekdays = locale?.weekdays || defaultWeekdays;

    // use ref to reduce reRender
    const currentRef = useRef(current);
    const valueRef = useRef(value);
    useEffect(() => {
        currentRef.current = current;
        valueRef.current = value;
    }, [current, value]);

    const cls = useMemo(() => {
        return {
            table: prefixCls + '-table',
            head: prefixCls + '-thead',
            row: prefixCls + '-row',
            cell: prefixCls + '-cell',
            active: prefixCls + '-active',
            now: prefixCls + '-now',
            disabled: prefixCls + '-disabled',
            prev: prefixCls + '-prev',
            next: prefixCls + '-next',
            rangeStart: prefixCls + '-range-start',
            rangeEnd: prefixCls + '-range-end',
            rangeMiddle: prefixCls + '-range-middle'
        };
    }, [prefixCls]);

    const panelInfo = useMemo(
        () => getDays(current, cls, value, now, disabledDate, rangeValue),
        [current, cls, value, now, disabledDate, rangeValue]
    );

    const onDateClick = useCallback(
        (index: number) => {
            const t = panelInfo[index];
            if (t.disabled && disabledPrevNextClickWhenDisabled) return;
            const changedValue = getChangedValue(t.value, currentRef.current, valueRef.current);
            if (t.current !== 'current') onCurrentChange(changedValue);
            if (t.disabled) return;
            if (onChangeWhenPrevNextClick || t.current === 'current') onChange(changedValue);
        },
        [disabledPrevNextClickWhenDisabled, onChange, onChangeWhenPrevNextClick, onCurrentChange, panelInfo]
    );

    return (
        <div className={cls.table}>
            <div className={cls.head}>
                <div className={cls.row}>
                    {weekdays.map((v, i) => (
                        <div key={i} className={cls.cell}>
                            {v}
                        </div>
                    ))}
                </div>
            </div>
            <TBody cells={panelInfo} onCellClick={onDateClick} col={C_COL} row={C_ROW} mode={'date'} />
        </div>
    );
};

export default memo(DateBody);
