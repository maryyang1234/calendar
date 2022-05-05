import React, { HTMLAttributes, memo, useCallback, useContext, useMemo } from 'react';

import { add } from 'src/util/date';
import { Mode, HeaderButtonType, HeaderSwitcherType } from 'src/interface';
import CalendarContext from 'src/CalendarContext';
import { Override } from 'src/types';

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
            case 'prevDecade':
            case 'prevCentury':
                return '«';
            case 'nextYear':
            case 'nextDecade':
            case 'nextCentury':
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
        value: Date;
        type: HeaderSwitcherType;
        mode: Mode;
        switchMode: (mode: Mode) => void;
    }
>) => {
    const display = useMemo(() => {
        switch (type) {
            case 'date-month':
                return value.getMonth() + 1;
            case 'date-year':
            case 'month':
                return value.getFullYear();
            case 'year': {
                const baseYear = ((value.getFullYear() / 10) | 0) * 10;
                return `${baseYear} - ${baseYear + 9}`;
            }
            case 'decade': {
                const baseYear = ((value.getFullYear() / 100) | 0) * 100;
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
    const { prefixCls, components } = useContext(CalendarContext);
    const cls = useMemo(() => {
        return `${prefixCls}-header-switcher ${prefixCls}-header-switcher-${type}`;
    }, [prefixCls, type]);
    const props = { onClick: handleClick, className: cls, children: display, value, ...rest };
    return components?.HeaderSwitcher ? (
        <components.HeaderSwitcher mode={mode} type={type} {...props} />
    ) : (
        <span {...props} />
    );
};

const HeaderSwitcher = memo(HeaderSwitcherWithoutMemo);

const CalMap: Record<HeaderButtonType, { unit: 'month' | 'year'; count: number }> = {
    prevMonth: { unit: 'month', count: -1 },
    nextMonth: { unit: 'month', count: 1 },
    prevYear: { unit: 'year', count: -1 },
    nextYear: { unit: 'year', count: 1 },
    prevDecade: { unit: 'year', count: -10 },
    nextDecade: { unit: 'year', count: 10 },
    prevCentury: { unit: 'year', count: -100 },
    nextCentury: { unit: 'year', count: 100 }
};

const Header = ({
    value,
    onChange,
    mode,
    onModeChange
}: {
    value: Date;
    onChange: (v: Date) => void;
    mode: Mode;
    onModeChange?: (mode: Mode) => void;
}) => {
    const handleButtonClick = useCallback(
        (type: HeaderButtonType) => {
            const { unit, count } = CalMap[type];
            onChange(add(value, count, unit));
        },
        [onChange, value]
    );
    const handleModeChange = useCallback((mode: Mode) => onModeChange?.(mode), [onModeChange]);
    const { prefixCls, monthBeforeYear } = useContext(CalendarContext);
    const cls = useMemo(() => {
        const headerPrefix = prefixCls + '-header';
        return {
            header: `${headerPrefix} ${headerPrefix}-${mode}`,
            switcherWrap: headerPrefix + '-switcher-wrap'
        };
    }, [prefixCls, mode]);
    const buttonProps = { onClick: handleButtonClick, mode };
    const switcherProps = { value, switchMode: handleModeChange, mode };
    switch (mode) {
        case 'date':
            return (
                <div className={cls.header}>
                    <HeaderButton type="prevYear" {...buttonProps} />
                    <HeaderButton type="prevMonth" {...buttonProps} />
                    <span className={cls.switcherWrap}>
                        {monthBeforeYear ? (
                            <>
                                <HeaderSwitcher type="date-month" {...switcherProps} />
                                <HeaderSwitcher type="date-year" {...switcherProps} />
                            </>
                        ) : (
                            <>
                                <HeaderSwitcher type="date-year" {...switcherProps} />
                                <HeaderSwitcher type="date-month" {...switcherProps} />
                            </>
                        )}
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
                    <HeaderButton type="prevDecade" {...buttonProps} />
                    <span className={cls.switcherWrap}>
                        <HeaderSwitcher type="year" {...switcherProps} />
                    </span>
                    <HeaderButton type="nextDecade" {...buttonProps} />
                </div>
            );
        case 'decade':
            return (
                <div className={cls.header}>
                    <HeaderButton type="prevCentury" {...buttonProps} />
                    <span className={cls.switcherWrap}>
                        <HeaderSwitcher type="decade" {...switcherProps} />
                    </span>
                    <HeaderButton type="nextCentury" {...buttonProps} />
                </div>
            );
        default:
            return null;
    }
};

export default memo(Header);
