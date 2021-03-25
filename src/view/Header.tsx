import React, { HTMLAttributes, memo, useCallback, useContext, useMemo } from 'react';
import { Dayjs, OpUnitType } from 'dayjs';

import { Override } from '../interface';
import CalendarContext from '../CalendarContext';

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

const HeaderButtonWithoutMemo = ({
    type,
    onClick,
    ...rest
}: Override<HTMLAttributes<HTMLSpanElement>, { type: ButtonType; onClick: (type: ButtonType) => void }>) => {
    const clickHandle = useCallback(() => {
        onClick(type);
    }, [onClick, type]);
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return `${prefixCls}-header-button ${prefixCls}-header-button-${type}`;
    }, [context.prefixCls, type]);
    return <span onClick={clickHandle} className={cls} {...rest} />;
};
const HeaderButton = memo(HeaderButtonWithoutMemo);

const HeaderSwitcherWithoutMemo = ({
    value,
    mode,
    switchMode,
    ...rest
}: Override<
    HTMLAttributes<HTMLSpanElement>,
    {
        value: Dayjs;
        mode: Mode;
        switchMode: (mode: Mode) => void;
    }
>) => {
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
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return `${prefixCls}-header-switcher ${prefixCls}-header-switcher-${mode}`;
    }, [context.prefixCls, mode]);
    return (
        <span onClick={onClick} className={cls} {...rest}>
            {display}
        </span>
    );
};

const HeaderSwitcher = memo(HeaderSwitcherWithoutMemo);

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
            onModeChange?.(mode);
        },
        [onModeChange]
    );

    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const headerPrefix = context.prefixCls + '-header';
        return {
            header: `${headerPrefix} ${headerPrefix}-${type}`,
            switcherWrap: headerPrefix + '-switcher-wrap'
        };
    }, [context.prefixCls, type]);

    switch (type) {
        case 'date':
            return (
                <div className={cls.header}>
                    <HeaderButton type="prevYear" onClick={onButtonClick}>
                        {'«'}
                    </HeaderButton>
                    <HeaderButton type="prevMonth" onClick={onButtonClick}>
                        {'‹'}
                    </HeaderButton>
                    <span className={cls.switcherWrap}>
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
                <div className={cls.header}>
                    <HeaderButton type="prevYear" onClick={onButtonClick}>
                        {'«'}
                    </HeaderButton>
                    <span className={cls.switcherWrap}>
                        <HeaderSwitcher value={value} mode="year" switchMode={onModeChangeHandle} />
                    </span>
                    <HeaderButton type="nextYear" onClick={onButtonClick}>
                        {'»'}
                    </HeaderButton>
                </div>
            );
        case 'year':
            return (
                <div className={cls.header}>
                    <HeaderButton type="prev10Year" onClick={onButtonClick}>
                        {'«'}
                    </HeaderButton>
                    <span className={cls.switcherWrap}>
                        <HeaderSwitcher value={value} mode="decade" switchMode={onModeChangeHandle} />
                    </span>
                    <HeaderButton type="next10Year" onClick={onButtonClick}>
                        {'»'}
                    </HeaderButton>
                </div>
            );
        case 'decade':
            return (
                <div className={cls.header}>
                    <HeaderButton type="prevDecade" onClick={onButtonClick}>
                        {'«'}
                    </HeaderButton>
                    <span className={cls.switcherWrap}>
                        <HeaderSwitcher value={value} mode="final" switchMode={onModeChangeHandle} />
                    </span>
                    <HeaderButton type="nextDecade" onClick={onButtonClick}>
                        {'»'}
                    </HeaderButton>
                </div>
            );
        default:
            return null;
    }
};

export default memo(Header);
