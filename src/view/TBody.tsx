import React, { HTMLAttributes, memo, ReactNode, useCallback, useContext, useMemo } from 'react';

import CalendarContext from 'src/CalendarContext';
import { Mode, Override } from 'src/interface';
import classnames from 'src/util/classnames';

interface TBodyProps {
    // prefix
    mode: Mode;
    // cell info
    cells: {
        className: string;
        children: ReactNode;
    }[];
    // callback when cell click
    onCellClick: (cellIndex: number) => void;
    // col count
    col: number;
    // row count
    row: number;
}

const CellWithoutMemo = ({
    index,
    onClick,
    mode,
    ...rest
}: Override<
    HTMLAttributes<HTMLDivElement>,
    {
        index: number;
        onClick: (v: number) => void;
        mode: Mode;
    }
>) => {
    const handleCellClick = useCallback(() => onClick(index), [onClick, index]);
    const context = useContext(CalendarContext);
    const props = { onClick: handleCellClick, ...rest };
    return context.components?.Cell ? <context.components.Cell mode={mode} {...props} /> : <div {...props} />;
};
const Cell = memo(CellWithoutMemo);

const TBody = ({ cells, onCellClick, col, row, mode }: TBodyProps) => {
    const { prefixCls } = useContext(CalendarContext);
    const cls = useMemo(
        () => ({
            body: prefixCls + '-tbody',
            row: prefixCls + '-row',
            cell: prefixCls + '-cell',
            emptyCell: prefixCls + '-cell-empty'
        }),
        [prefixCls]
    );
    const handleClick = useCallback(
        (index: number) => {
            const cellInfo = cells[index];
            if (!cellInfo) return;
            onCellClick(index);
        },
        [cells, onCellClick]
    );
    const renderBody = () => {
        const info = [];
        for (let i = 0; i < row; i++) {
            const group = [];
            for (let j = 0; j < col; j++) {
                const index = i * col + j;
                const cellInfo = cells[index];
                group.push(
                    <Cell
                        key={index}
                        className={classnames(cls.cell, cellInfo?.className, !cellInfo && cls.emptyCell)}
                        index={index}
                        onClick={handleClick}
                        mode={mode}
                    >
                        {cellInfo?.children}
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

    return <div className={cls.body}>{renderBody()}</div>;
};

export default memo(TBody);
