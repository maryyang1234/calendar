import dayjs, { Dayjs } from 'dayjs';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { TDate } from 'src/interface';

import CalendarContext, { DefaultContext } from '../CalendarContext';
import classnames from '../util/classnames';
import { SharedPanelProps } from './interface';
import TBody from './TBody';

type DateBodyProps = SharedPanelProps & {
    // 今日值
    today?: Dayjs;
    // disable rule
    disabledDate?: (t: TDate) => boolean;
};

const C_COL = 7;
const C_ROW = 6;

const getDays = (
    v: Dayjs,
    cls: Record<string, string>,
    activeV?: Dayjs,
    disabledDate?: DateBodyProps['disabledDate']
) => {
    v = dayjs(v);
    // 月天数
    const daysInMonth = v.daysInMonth();
    // 月初
    const firstDayOfMonth = v.set('date', 1);
    // 周几，0 为周日
    const day = firstDayOfMonth.day();
    // 面板的第一天
    const firstDayOfPanel = firstDayOfMonth.add(-day, 'day');
    const activeVString = activeV?.format('YYYYMMDD');

    const min = day;
    const max = day + daysInMonth;
    // 日期合集
    const panelInfo = [];
    for (let i = 0; i < C_ROW; i++) {
        for (let j = 0; j < C_COL; j++) {
            const index = i * C_COL + j;
            const t = firstDayOfPanel.add(index, 'day');
            const active = t.format('YYYYMMDD') === activeVString;
            const current = index < min ? 'prev' : index >= max ? 'next' : 'current';
            const disabled = disabledDate?.(t);
            panelInfo.push({
                t,
                children: t.date(),
                current,
                active,
                disabled,
                className: classnames(
                    cls.cell,
                    active && cls.active,
                    disabled && cls.disabled,
                    current === 'prev' && cls.prev,
                    current === 'next' && cls.next
                )
            });
        }
    }
    return panelInfo;
};

const defaultWeekdays = DefaultContext.locale.weekdays;

const DateBody = ({ value, onChange, current, onCurrentChange, disabledDate }: DateBodyProps) => {
    const { locale, prefixCls } = useContext(CalendarContext);
    const weekdays = locale?.weekdays || defaultWeekdays;

    const cls = useMemo(() => {
        return {
            table: prefixCls + '-table',
            head: prefixCls + '-thead',
            row: prefixCls + '-row',
            cell: prefixCls + '-cell',
            active: prefixCls + '-active',
            disabled: prefixCls + '-disabled',
            prev: prefixCls + '-prev',
            next: prefixCls + '-next'
        };
    }, [prefixCls]);

    const panelInfo = useMemo(() => getDays(current, cls, value, disabledDate), [cls, current, value, disabledDate]);

    const onDateClick = useCallback(
        (index: number) => {
            const t = panelInfo[index];
            if (t.disabled) return;
            if (t.current === 'current') {
                onChange(t.t);
            } else {
                onCurrentChange(t.t);
            }
        },
        [onChange, onCurrentChange, panelInfo]
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
