import dayjs, { Dayjs } from 'dayjs';
import React, { HTMLAttributes, memo, useCallback, useContext, useMemo } from 'react';

import CalendarContext, { DefaultContext } from '../CalendarContext';
import { Override } from '../interface';
import classnames from '../util/classnames';
import { SharedPanelProps } from './interface';

type DateBodyProps = SharedPanelProps & {
    // 今日值
    today?: Dayjs;
};

const C_COL = 7;
const C_ROW = 6;

interface DateInfo {
    t: Dayjs;
    day: number;
    date: number;
    current?: 'prev' | 'current' | 'next';
    today?: boolean;
    disabled?: boolean;
    active?: boolean;
}

const getDays = (v: Dayjs, activeV?: Dayjs) => {
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
        const week: DateInfo[] = [];
        for (let j = 0; j < C_COL; j++) {
            const index = i * C_COL + j;
            const t = firstDayOfPanel.add(index, 'day');
            week.push({
                t,
                day: t.day(),
                date: t.date(),
                current: index < min ? 'prev' : index >= max ? 'next' : 'current',
                active: t.format('YYYYMMDD') === activeVString
            });
        }
        panelInfo.push(week);
    }
    return panelInfo;
};

const DateCellWithoutMemo = ({
    day,
    onClick,
    ...rest
}: Override<HTMLAttributes<HTMLTableDataCellElement>, { day: DateInfo; onClick: (v: DateInfo) => void }>) => {
    const onDateClick = useCallback(() => {
        onClick(day);
    }, [day, onClick]);
    return <td onClick={onDateClick} {...rest} />;
};
const DateCell = memo(DateCellWithoutMemo);

const defaultWeekdays = DefaultContext.locale.weekdays;

const DateBody = ({ value, onChange, current, onCurrentChange }: DateBodyProps) => {
    const panelInfo = useMemo(() => getDays(current, value), [current, value]);

    const context = useContext(CalendarContext);
    const weekdays = context.locale?.weekdays || defaultWeekdays;
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        const datePrefixCls = context.prefixCls + '-date';
        return {
            table: datePrefixCls + '-table',
            thead: datePrefixCls + '-thead',
            tbody: datePrefixCls + '-tbody',
            row: datePrefixCls + '-row',
            cell: datePrefixCls + '-cell',
            content: datePrefixCls + '-content',
            active: prefixCls + '-active',
            prev: prefixCls + '-prev',
            next: prefixCls + '-next'
        };
    }, [context.prefixCls]);

    const onDateClick = useCallback(
        (t: DateInfo) => {
            if (t.current === 'current') {
                onChange(t.t);
            } else {
                onCurrentChange(t.t);
            }
        },
        [onChange, onCurrentChange]
    );

    return (
        <table className={cls.table}>
            <thead className={cls.thead}>
                <tr className={cls.row}>
                    {weekdays.map((v, i) => (
                        <th key={i} className={cls.cell}>
                            {v}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className={cls.tbody}>
                {panelInfo.map((week, i) => {
                    return (
                        <tr key={i} className={cls.row}>
                            {week.map(day => {
                                return (
                                    <DateCell
                                        key={+day.t}
                                        className={classnames(
                                            cls.cell,
                                            day.active && cls.active,
                                            day.current === 'prev' && cls.prev,
                                            day.current === 'next' && cls.next
                                        )}
                                        day={day}
                                        onClick={onDateClick}
                                    >
                                        <span className={cls.content}>{day.date}</span>
                                    </DateCell>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default memo(DateBody);
