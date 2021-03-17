import React, { HTMLAttributes, memo, ReactNode, useCallback, useContext, useMemo } from 'react';

import { Context as CalendarContext } from '../CalendarContext';
import { Override } from '../interface';
import classnames from '../classnames';

interface PanelProps {
    // prefix
    mode: string;
    // 选中回调
    onCellClick: (cellIndex: number) => void;
    // 格信息
    cells: {
        className: string;
        children: ReactNode;
    }[];
}

const C_COL = 3;
const C_ROW = 4;

let Cell = ({
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
    const onCellClick = useCallback(() => {
        onClick(index);
    }, [onClick, index]);
    return <td onClick={onCellClick} {...rest} />;
};
Cell = memo(Cell);

const CellPanel = ({ onCellClick, cells, mode }: PanelProps) => {
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const panelPrefix = context.prefix + '-' + mode;
        return {
            table: panelPrefix + '-table',
            body: panelPrefix + '-body',
            row: panelPrefix + '-row',
            cell: panelPrefix + '-cell'
        };
    }, [context.prefix, mode]);

    const onClick = useCallback(
        (index: number) => {
            onCellClick(index);
        },
        [onCellClick]
    );

    const renderBody = () => {
        const info = [];
        for (let i = 0; i < C_ROW; i++) {
            const group = [];
            for (let j = 0; j < C_COL; j++) {
                const index = i * C_COL + j;
                const cellInfo = cells[index];
                group.push(
                    <Cell
                        key={index}
                        className={classnames(cls.cell, cellInfo?.className)}
                        index={index}
                        onClick={onClick}
                    >
                        {cellInfo?.children}
                    </Cell>
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

export default memo(CellPanel);
