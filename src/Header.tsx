import React, { HTMLAttributes, useCallback, useMemo } from 'react';
import { Dayjs, OpUnitType } from 'dayjs';
import { Override } from './interface';

type HeaderType = 'date' | 'month' | 'year' | 'decade';
type ButtonType =
    | 'prevMonth'
    | 'nextMonth'
    | 'prevYear'
    | 'nextYear'
    | 'prev10Year'
    | 'next10Year'
    | 'prevDecade'
    | 'nextDecade';

type Mode = HeaderType | 'final';

const HeaderButton = ({
    type,
    onClick,
    children
}: Override<HTMLAttributes<HTMLSpanElement>, { type: ButtonType; onClick: (type: ButtonType) => void }>) => {
    const clickHandle = useCallback(() => {
        onClick(type);
    }, [onClick, type]);
    return (
        <span onClick={clickHandle} className="">
            {children}
        </span>
    );
};

const HeaderSwitcher = ({
    value,
    mode,
    switchMode
}: {
    value: Dayjs;
    mode: Mode;
    switchMode: (mode: Mode) => void;
}) => {
    const display = useMemo(() => {
        switch (mode) {
            case 'month':
                return value.month();
            case 'year':
                return value.year();
            case 'decade': {
                const baseYear = ((value.year() / 10) | 0) * 10;
                return `${baseYear} - ${baseYear + 9}`;
            }
            case 'final': {
                const baseYear = ((value.year() / 100) | 0) * 100;
                return `${baseYear} - ${baseYear + 99}`;
            }
            default:
                return '';
        }
    }, [value, mode]);
    const onClick = useCallback(() => {
        if (mode === 'final') return;
        switchMode(mode);
    }, [mode, switchMode]);
    return <span onClick={onClick}>{display}</span>;
};

const CalMap: Record<ButtonType, { unit: OpUnitType; count: number }> = {
    prevMonth: { unit: 'month', count: -1 },
    nextMonth: { unit: 'month', count: 1 },
    prevYear: { unit: 'year', count: -1 },
    nextYear: { unit: 'year', count: 1 },
    prev10Year: { unit: 'year', count: -10 },
    next10Year: { unit: 'year', count: 10 },
    prevDecade: { unit: 'year', count: -100 },
    nextDecade: { unit: 'year', count: 100 }
};

const Header = ({
    value,
    type,
    onChange,
    onModeChange
}: {
    value: Dayjs;
    type: HeaderType;
    onChange: (v: Dayjs) => void;
    onModeChange?: (mode: Mode) => void;
}) => {
    const onButtonClick = useCallback(
        (type: ButtonType) => {
            const { unit, count } = CalMap[type];
            return onChange(value.add(count, unit));
        },
        [onChange, value]
    );
    const onModeChangeHandle = useCallback(
        (mode: Mode) => {
            onModeChange(mode);
        },
        [onModeChange]
    );

    switch (type) {
        case 'date':
            return (
                <div>
                    <HeaderButton type="prevYear" onClick={onButtonClick}>
                        {'«'}
                    </HeaderButton>
                    <HeaderButton type="prevMonth" onClick={onButtonClick}>
                        {'‹'}
                    </HeaderButton>
                    <span>
                        <HeaderSwitcher value={value} mode="year" switchMode={onModeChangeHandle} />
                        <HeaderSwitcher value={value} mode="month" switchMode={onModeChangeHandle} />
                    </span>
                    <HeaderButton type="nextMonth" onClick={onButtonClick}>
                        {'›'}
                    </HeaderButton>
                    <HeaderButton type="nextYear" onClick={onButtonClick}>
                        {'»'}
                    </HeaderButton>
                </div>
            );
        case 'month':
            return (
                <div>
                    <HeaderButton type="prevYear" onClick={onButtonClick}>
                        {'«'}
                    </HeaderButton>
                    <HeaderSwitcher value={value} mode="year" switchMode={onModeChangeHandle} />
                    <HeaderButton type="nextYear" onClick={onButtonClick}>
                        {'»'}
                    </HeaderButton>
                </div>
            );
        case 'year':
            return (
                <div>
                    <HeaderButton type="prev10Year" onClick={onButtonClick}>
                        {'«'}
                    </HeaderButton>
                    <HeaderSwitcher value={value} mode="decade" switchMode={onModeChangeHandle} />
                    <HeaderButton type="next10Year" onClick={onButtonClick}>
                        {'»'}
                    </HeaderButton>
                </div>
            );
        case 'decade':
            return (
                <div>
                    <HeaderButton type="prevDecade" onClick={onButtonClick}>
                        {'«'}
                    </HeaderButton>
                    <HeaderSwitcher value={value} mode="final" switchMode={onModeChangeHandle} />
                    <HeaderButton type="nextDecade" onClick={onButtonClick}>
                        {'»'}
                    </HeaderButton>
                </div>
            );
        default:
            return null;
    }
};

export default Header;
