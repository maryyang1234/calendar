import React, { HTMLAttributes, memo, ReactNode, useCallback, useContext, useMemo } from 'react';

import CalendarContext from '../CalendarContext';
import { Override } from '../interface';
import classnames from '../util/classnames';

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

const CellWithoutMemo = ({
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
    return <div onClick={onCellClick} {...rest} />;
};
const Cell = memo(CellWithoutMemo);

const CellPanel = ({ onCellClick, cells }: PanelProps) => {
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return {
            table: prefixCls + '-table',
            body: prefixCls + '-tbody',
            row: prefixCls + '-row',
            cell: prefixCls + '-cell',
            content: prefixCls + '-content'
        };
    }, [context.prefixCls]);

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
                        <span className={cls.content}>{cellInfo?.children}</span>
                    </Cell>
                );
            }
            info.push(
                <div key={i} className={cls.row}>
                    {group}
                </div>
            );
        }
        return info;
    };

    return (
        <div className={cls.table}>
            <div className={cls.body}>{renderBody()}</div>
        </div>
    );
};

export default memo(CellPanel);
