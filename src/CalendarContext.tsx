import React, { ComponentType, createContext, memo, useContext, useMemo } from 'react';

import { CalendarComponents } from 'src/interface';
import { months, weekdays } from 'src/locale/en_us';

export interface TCalendarContext {
    // custom locale
    locale?: { months: string[]; weekdays: string[] };
    // prefix for classnames
    prefixCls?: string;
    // custom component
    components?: CalendarComponents;
    // place month before year
    monthBeforeYear?: boolean;
    // only show valid year on year panel
    onlyValidYear?: boolean;
    // only show valid decade on decade panel
    onlyValidDecade?: boolean;
    // onChange when prev, next click
    onChangeWhenPrevNextClick?: boolean;
    // disabled prev and next when disabled
    disabledPrevNextClickWhenDisabled?: boolean;
}

export const DefaultContext: Required<TCalendarContext> = {
    locale: { months, weekdays },
    prefixCls: 'zr-cal',
    components: {},
    monthBeforeYear: true,
    onlyValidYear: true,
    onlyValidDecade: true,
    onChangeWhenPrevNextClick: true,
    disabledPrevNextClickWhenDisabled: true
};

export type ContextKeys = keyof TCalendarContext;
export const contextKeys = Object.keys(DefaultContext) as ContextKeys[];

const CalendarContext = createContext<TCalendarContext>(DefaultContext);
export default CalendarContext;

export const pickContext = <T,>(obj: T & TCalendarContext): [TCalendarContext, T] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rest: any = { ...obj };
    const context: TCalendarContext = {};
    contextKeys.forEach(key => {
        if (key in rest) {
            context[key] = rest[key];
            delete rest[key];
        }
    });
    return [context, rest as T];
};

export const useCalendarContext = <T,>(props: T & TCalendarContext): [TCalendarContext, T] => {
    const [context, rest] = pickContext(props);
    const inheritContext = useContext(CalendarContext);
    const finalContext = useMemo(
        () => ({ ...DefaultContext, ...inheritContext, ...context }),
        [context, inheritContext]
    );
    return [finalContext, rest];
};

export const withContext = <T,>(Component: ComponentType<T>) => {
    const ComponentWithContext = (props: T & TCalendarContext) => {
        const [finalContext, rest] = useCalendarContext(props);
        return (
            <CalendarContext.Provider value={finalContext}>
                <Component {...rest} />
            </CalendarContext.Provider>
        );
    };
    return memo(ComponentWithContext);
};
