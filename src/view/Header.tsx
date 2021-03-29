import React, { HTMLAttributes, memo, useCallback, useContext, useMemo } from 'react';
import { Dayjs, OpUnitType } from 'dayjs';

import { Override, Mode, HeaderButtonType, HeaderSwitcherType } from '../interface';
import CalendarContext from '../CalendarContext';

const HeaderButtonWithoutMemo = ({
    type,
    mode,
    onClick,
    ...rest
}: Override<
    HTMLAttributes<HTMLSpanElement>,
    { type: HeaderButtonType; mode: Mode; onClick: (type: HeaderButtonType) => void }
>) => {
    const handleClick = useCallback(() => onClick(type), [onClick, type]);
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return `${prefixCls}-header-button ${prefixCls}-header-button-${type}`;
    }, [context.prefixCls, type]);
    const display = useMemo(() => {
        switch (type) {
            case 'prevMonth':
                return '‹';
            case 'nextMonth':
                return '›';
            case 'prevYear':
            case 'prev10Year':
            case 'prevDecade':
                return '«';
            case 'nextYear':
            case 'next10Year':
            case 'nextDecade':
                return '»';
        }
    }, [type]);
    const props = { onClick: handleClick, className: cls, children: display, ...rest };
    return context.components?.HeaderButton ? (
        <context.components.HeaderButton mode={mode} type={type} {...props} />
    ) : (
        <div {...props} />
    );
};
const HeaderButton = memo(HeaderButtonWithoutMemo);

const HeaderSwitcherWithoutMemo = ({
    value,
    type,
    mode,
    switchMode,
    ...rest
}: Override<
    HTMLAttributes<HTMLSpanElement>,
    {
        value: Dayjs;
        type: HeaderSwitcherType;
        mode: Mode;
        switchMode: (mode: Mode) => void;
    }
>) => {
    const display = useMemo(() => {
        switch (type) {
            case 'date-month':
                return value.month() + 1;
            case 'date-year':
            case 'month':
                return value.year();
            case 'year': {
                const baseYear = ((value.year() / 10) | 0) * 10;
                return `${baseYear} - ${baseYear + 9}`;
            }
            case 'decade': {
                const baseYear = ((value.year() / 100) | 0) * 100;
                return `${baseYear} - ${baseYear + 99}`;
            }
        }
    }, [value, type]);
    const handleClick = useCallback(() => {
        if (type === 'decade') return;
        switch (type) {
            case 'date-month':
                switchMode('month');
                break;
            case 'date-year':
                switchMode('year');
                break;
            case 'month':
                switchMode('year');
                break;
            case 'year':
                switchMode('decade');
                break;
        }
    }, [type, switchMode]);
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const prefixCls = context.prefixCls;
        return `${prefixCls}-header-switcher ${prefixCls}-header-switcher-${type}`;
    }, [context.prefixCls, type]);
    const props = { onClick: handleClick, className: cls, children: display, ...rest };
    return context.components?.HeaderSwitcher ? (
        <context.components.HeaderSwitcher mode={mode} type={type} {...props} />
    ) : (
        <span {...props} />
    );
};

const HeaderSwitcher = memo(HeaderSwitcherWithoutMemo);

const CalMap: Record<HeaderButtonType, { unit: OpUnitType; count: number }> = {
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
    onChange,
    mode,
    onModeChange
}: {
    value: Dayjs;
    onChange: (v: Dayjs) => void;
    mode: Mode;
    onModeChange?: (mode: Mode) => void;
}) => {
    const handleButtonClick = useCallback(
        (type: HeaderButtonType) => {
            const { unit, count } = CalMap[type];
            return onChange(value.add(count, unit));
        },
        [onChange, value]
    );
    const handleModeChange = useCallback((mode: Mode) => onModeChange?.(mode), [onModeChange]);
    const context = useContext(CalendarContext);
    const cls = useMemo(() => {
        const headerPrefix = context.prefixCls + '-header';
        return {
            header: `${headerPrefix} ${headerPrefix}-${mode}`,
            switcherWrap: headerPrefix + '-switcher-wrap'
        };
    }, [context.prefixCls, mode]);
    const buttonProps = { onClick: handleButtonClick, mode };
    const switcherProps = { value, switchMode: handleModeChange, mode };
    switch (mode) {
        case 'date':
            return (
                <div className={cls.header}>
                    <HeaderButton type="prevYear" {...buttonProps} />
                    <HeaderButton type="prevMonth" {...buttonProps} />
                    <span className={cls.switcherWrap}>
                        <HeaderSwitcher type="date-year" {...switcherProps} />
                        <HeaderSwitcher type="date-month" {...switcherProps} />
                    </span>
                    <HeaderButton type="nextMonth" {...buttonProps} />
                    <HeaderButton type="nextYear" {...buttonProps} />
                </div>
            );
        case 'month':
            return (
                <div className={cls.header}>
                    <HeaderButton type="prevYear" {...buttonProps} />
                    <span className={cls.switcherWrap}>
                        <HeaderSwitcher type="month" {...switcherProps} />
                    </span>
                    <HeaderButton type="nextYear" {...buttonProps} />
                </div>
            );
        case 'year':
            return (
                <div className={cls.header}>
                    <HeaderButton type="prev10Year" {...buttonProps} />
                    <span className={cls.switcherWrap}>
                        <HeaderSwitcher type="year" {...switcherProps} />
                    </span>
                    <HeaderButton type="next10Year" {...buttonProps} />
                </div>
            );
        case 'decade':
            return (
                <div className={cls.header}>
                    <HeaderButton type="prevDecade" {...buttonProps} />
                    <span className={cls.switcherWrap}>
                        <HeaderSwitcher type="decade" {...switcherProps} />
                    </span>
                    <HeaderButton type="nextDecade" {...buttonProps} />
                </div>
            );
        default:
            return null;
    }
};

export default memo(Header);
