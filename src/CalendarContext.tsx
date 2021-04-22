import React, { ComponentType, createContext, memo, useContext, useMemo } from 'react';

import { CalendarComponents } from 'src/interface';
import { months, weekdays } from 'src/locale/en_us';

export interface Context {
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
}

export const DefaultContext: Required<Context> = {
    locale: { months, weekdays },
    prefixCls: 'zr-cal',
    components: {},
    monthBeforeYear: true,
    onlyValidYear: true,
    onlyValidDecade: true,
    onChangeWhenPrevNextClick: true
};

export type ContextKeys = keyof Context;
export const contextKeys = Object.keys(DefaultContext) as ContextKeys[];

const CalendarContext = createContext<Context>(DefaultContext);
export default CalendarContext;

export const pickContext = <T extends Context>(obj: T): [Context, T] => {
    const rest: any = { ...obj };
    const context: Context = {};
    contextKeys.forEach(key => {
        if (key in rest) {
            context[key] = rest[key];
            delete rest[key];
        }
    });
    return [context, rest];
};

export const withContext = <T,>(Component: ComponentType<T>) => {
    const ComponentWithContext = (props: T & Context) => {
        const [context, rest] = pickContext<T & Context>(props);
        const inheritContext = useContext(CalendarContext);
        const finalContext = useMemo(() => ({ ...DefaultContext, ...inheritContext, ...context }), [
            context,
            inheritContext
        ]);
        return (
            <CalendarContext.Provider value={finalContext}>
                <Component {...rest} />
            </CalendarContext.Provider>
        );
    };
    return memo(ComponentWithContext);
};
