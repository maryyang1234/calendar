import { Dayjs } from 'dayjs';
import React, { HTMLAttributes, memo, useCallback, useContext, useMemo } from 'react';

import { Context as CalendarContext } from '../CalendarContext';
import { Override } from '../interface';
import classnames from '../classnames';

interface DecadePanelProps {
    // 选中值
    value?: Dayjs;
    // 选中回调
    onChange: (t: Dayjs) => void;
    // 当前面板值
    current: Dayjs;
    // 面板切换回调
    onCurrentChange: (t: Dayjs) => void;
}

const C_COL = 3;
const C_ROW = 4;

let DecadeCell = ({
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
DecadeCell = memo(DecadeCell);

const DecadePanel = ({ value, onChange, current, onCurrentChange }: DecadePanelProps) => {
    const baseYear = useMemo(() => {
        const year = current.year();
        return ((year / 100) | 0) * 100;
    }, [current]);

    const valueYear = useMemo(() => {
        return value?.year();
    }, [value]);

    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefix = context.prefix;
        const decadePrefix = context.prefix + 'decade-';
        return {
            table: decadePrefix + 'table',
            body: decadePrefix + 'body',
            row: decadePrefix + 'row',
            cell: decadePrefix + 'cell',
            active: prefix + 'active'
        };
    }, [context.prefix]);

    const onYearClick = useCallback(
        (index: number) => {
            if (index === 0) {
                onCurrentChange(current.set('year', baseYear - 100));
            } else if (index === 11) {
                onCurrentChange(current.set('year', baseYear + 100));
            } else {
                onChange?.(current.set('year', baseYear + 10 * (index - 1)));
            }
        },
        [current, onChange, onCurrentChange, baseYear]
    );

    const renderBody = () => {
        const info = [];
        for (let i = 0; i < C_ROW; i++) {
            const group = [];
            for (let j = 0; j < C_COL; j++) {
                const index = i * C_COL + j;
                const year = baseYear + (index - 1) * 10;
                let isActive = false;
                if (valueYear && valueYear >= year && valueYear < year + 10) {
                    isActive = true;
                }
                group.push(
                    <DecadeCell
                        key={index}
                        className={classnames(cls.cell, isActive && cls.active)}
                        index={index}
                        onClick={onYearClick}
                    >
                        {year} - {year + 9}
                    </DecadeCell>
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

export default memo(DecadePanel);
