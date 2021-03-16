import { Dayjs } from 'dayjs';
import React, { HTMLAttributes, memo, useCallback, useContext, useMemo } from 'react';

import { Context as CalendarContext } from '../CalendarContext';
import { Override } from '../interface';
import classnames from '../classnames';
import dayjs from '../dayjs';

interface MonthPanelProps {
    // 选中值
    value?: Dayjs;
    // 选中回调
    onChange?: (t: Dayjs) => void;
    // 当前面板值
    current?: Dayjs;
    // 面板切换回调
    onCurrentChange?: (t: Dayjs) => void;
}

const C_COL = 3;
const C_ROW = 4;

let MonthCell = ({
    index,
    onClick,
    ...rest
}: Override<
    HTMLAttributes<HTMLTableDataCellElement>,
    {
        index: number;
        onClick: (v: number) => void;
    }
>) => {
    const onYearClick = useCallback(() => {
        onClick(index);
    }, [onClick, index]);
    return <td onClick={onYearClick} {...rest} />;
};
MonthCell = memo(MonthCell);

const MonthPanel = ({ value, onChange, current }: MonthPanelProps) => {
    const valueMonth = useMemo(() => {
        return value?.month();
    }, [value]);

    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefix = context.prefix;
        const monthPrefix = context.prefix + 'month-';
        return {
            table: monthPrefix + 'table',
            body: monthPrefix + 'body',
            row: monthPrefix + 'row',
            cell: monthPrefix + 'cell',
            active: prefix + 'active'
        };
    }, [context.prefix]);

    const monthLocales = useMemo(() => dayjs().localeData().monthsShort(), []);

    const onMonthClick = useCallback(
        (index: number) => {
            onChange?.(current.set('month', index));
        },
        [current, onChange]
    );

    const renderBody = () => {
        const info = [];
        for (let i = 0; i < C_ROW; i++) {
            const group = [];
            for (let j = 0; j < C_COL; j++) {
                const index = i * C_COL + j;
                let isActive = false;
                if (valueMonth != null && valueMonth === index) {
                    isActive = true;
                }
                group.push(
                    <MonthCell
                        key={index}
                        className={classnames(cls.cell, isActive && cls.active)}
                        index={index}
                        onClick={onMonthClick}
                    >
                        {monthLocales[index]}
                    </MonthCell>
                );
            }
            info.push(
                <tr key={i} className={cls.row}>
                    {group}
                </tr>
            );
        }
        return info;
    };

    return (
        <table className={cls.table}>
            <tbody className={cls.body}>{renderBody()}</tbody>
        </table>
    );
};

export default memo(MonthPanel);
