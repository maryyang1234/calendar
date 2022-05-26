import React, { HTMLAttributes, memo, ReactNode, useCallback, useContext, useMemo } from 'react';

import CalendarContext from 'src/CalendarContext';
import { CellValue, Mode } from 'src/interface';
import { Override } from 'src/types';
import classnames from 'src/util/classnames';

interface TBodyProps<T extends Mode> {
    // prefix
    mode: T;
    // cell info
    cells: {
        className: string;
        children: ReactNode;
        disabled?: boolean;
        value?: CellValue<T>;
    }[];
    // callback when cell click
    onCellClick: (cellIndex: number) => void;
    // col count
    col: number;
    // row count
    row: number;
}

function CellWithoutMemo({
    index,
    onClick,
    mode,
    value,
    ...rest
}: Override<
    HTMLAttributes<HTMLDivElement>,
    {
        index: number;
        onClick: (v: number) => void;
        mode: Mode;
        value?: CellValue<Mode>;
        disabled?: boolean;
    }
>) {
    const handleCellClick = useCallback(() => onClick(index), [onClick, index]);
    const context = useContext(CalendarContext);
    const props = { onClick: handleCellClick, ...rest };
    return context.components?.Cell ? (
        <context.components.Cell mode={mode} value={value} {...props} />
    ) : (
        <div {...props} />
    );
}
const Cell = memo(CellWithoutMemo);

function TBody({ cells, onCellClick, col, row, mode }: TBodyProps<Mode>) {
    const { prefixCls } = useContext(CalendarContext);
    const cls = useMemo(
        () => ({
            body: prefixCls + '-tbody',
            row: prefixCls + '-row',
            cell: prefixCls + '-cell',
            emptyCell: prefixCls + '-cell-empty',
            firstDisabledCell: prefixCls + '-cell-disabled-first',
            lastDisabledCell: prefixCls + '-cell-disabled-last'
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
            let first = true;
            for (let j = 0; j < col; j++) {
                const index = i * col + j;
                const cellInfo = cells[index];
                let isFirstDisabled = false;
                let isLastDisabled = false;
                if (cellInfo?.disabled) {
                    if (first) {
                        isFirstDisabled = true;
                        first = false;
                    }
                    const nextCellInfo = cells[index + 1];
                    if (j >= col - 1 || !nextCellInfo?.disabled) {
                        isLastDisabled = true;
                    }
                } else {
                    first = true;
                }
                group.push(
                    <Cell
                        key={index}
                        className={classnames(
                            cls.cell,
                            !cellInfo && cls.emptyCell,
                            cellInfo?.className,
                            isFirstDisabled && cls.firstDisabledCell,
                            isLastDisabled && cls.lastDisabledCell
                        )}
                        index={index}
                        onClick={handleClick}
                        mode={mode}
                        value={cellInfo?.value}
                        disabled={cellInfo?.disabled}
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
}

export default memo(TBody);
