import { Dayjs } from 'dayjs';
import React, { HTMLAttributes, memo, useCallback, useContext, useMemo } from 'react';

import { Context as CalendarContext } from '../CalendarContext';
import { Override } from '../interface';
import classnames from '../classnames';

interface YearPanelProps {
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

let YearCell = ({
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
YearCell = memo(YearCell);

const YearPanel = ({ value, onChange, current, onCurrentChange }: YearPanelProps) => {
    const baseYear = useMemo(() => {
        const year = current.year();
        return ((year / 10) | 0) * 10;
    }, [current]);

    const valueYear = useMemo(() => {
        return value?.year();
    }, [value]);

    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefix = context.prefix;
        const yearPrefix = context.prefix + 'year-';
        return {
            table: yearPrefix + 'table',
            body: yearPrefix + 'body',
            row: yearPrefix + 'row',
            cell: yearPrefix + 'cell',
            active: prefix + 'active'
        };
    }, [context.prefix]);

    const onYearClick = useCallback(
        (index: number) => {
            if (index === 0) {
                onCurrentChange(current.set('year', baseYear - 10));
            } else if (index === 11) {
                onCurrentChange(current.set('year', baseYear + 10));
            } else {
                onChange?.(current.set('year', baseYear + index - 1));
            }
        },
        [baseYear, current, onChange, onCurrentChange]
    );

    const renderBody = () => {
        const info = [];
        for (let i = 0; i < C_ROW; i++) {
            const group = [];
            for (let j = 0; j < C_COL; j++) {
                const index = i * C_COL + j;
                const year = baseYear + index - 1;
                let isActive = false;
                if (valueYear && valueYear === year) {
                    isActive = true;
                }
                group.push(
                    <YearCell
                        key={index}
                        className={classnames(cls.cell, isActive && cls.active)}
                        index={index}
                        onClick={onYearClick}
                    >
                        {year}
                    </YearCell>
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

export default YearPanel;
