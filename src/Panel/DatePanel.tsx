import { Dayjs } from 'dayjs';
import React, { HTMLAttributes, memo, useCallback, useContext, useMemo } from 'react';

import { Context as CalendarContext } from '../CalendarContext';
import { Override } from '../interface';
import classnames from '../classnames';
import dayjs from '../dayjs';

interface DateBodyProps {
    // 选中值
    value?: Dayjs;
    // 选中回调
    onChange?: (t: Dayjs) => void;
    // 当前面板值
    current?: Dayjs;
    // 面板切换回调
    onCurrentChange?: (t: Dayjs) => void;
    // 今日值
    today?: Dayjs;
}

const C_COL = 7;
const C_ROW = 6;

interface DateInfo {
    t: Dayjs;
    day: number;
    date: number;
    current?: 'prev' | 'current' | 'after';
    today?: boolean;
    disabled?: boolean;
    active?: boolean;
}

const getDays = (v: Dayjs, activeV: Dayjs) => {
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
                current: index < min ? 'prev' : index > max ? 'after' : 'current',
                active: t.format('YYYYMMDD') === activeVString
            });
        }
        panelInfo.push(week);
    }
    return panelInfo;
};

let DateCell = ({
    day,
    onClick,
    ...rest
}: Override<HTMLAttributes<HTMLTableDataCellElement>, { day: DateInfo; onClick: (v: DateInfo) => void }>) => {
    const onDateClick = useCallback(() => {
        onClick(day);
    }, [day, onClick]);
    return <td onClick={onDateClick} {...rest} />;
};
DateCell = memo(DateCell);

const DateBody = ({ value, current, onChange, onCurrentChange }: DateBodyProps) => {
    const weekdays = useMemo(() => dayjs().localeData().weekdaysShort(), []);
    const panelInfo = useMemo(() => getDays(current || value || dayjs(), value), [current, value]);

    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefix = context.prefix;
        const datePrefix = context.prefix + 'date-';
        return {
            table: datePrefix + 'table',
            header: datePrefix + 'header',
            body: datePrefix + 'body',
            row: datePrefix + 'row',
            cell: datePrefix + 'cell',
            active: prefix + 'active'
        };
    }, [context.prefix]);

    const onDateClick = useCallback(
        (t: DateInfo) => {
            if (t.current === 'current') {
                onChange?.(t.t);
            } else {
                onCurrentChange?.(t.t);
            }
        },
        [onChange, onCurrentChange]
    );

    return (
        <table className={cls.table}>
            <thead className={cls.header}>
                <tr className={cls.row}>
                    {weekdays.map((v, i) => (
                        <th key={i} className={cls.cell}>
                            {v}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className={cls.body}>
                {panelInfo.map((week, i) => {
                    return (
                        <tr key={i} className={cls.row}>
                            {week.map(day => {
                                return (
                                    <DateCell
                                        key={+day.t}
                                        className={classnames(cls.cell, day.active && cls.active)}
                                        day={day}
                                        onClick={onDateClick}
                                    >
                                        {day.date}
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
