import React, { ComponentType, createContext, memo, useContext, useMemo } from 'react';

import { months, weekdays } from './locale/en_us';

// interface CalendarComponents {
//     DateCell: React.ComponentType;
//     Header: React.ComponentType;
//     HeaderButton: React.ComponentType;
// }

export interface Context {
    locale?: { months: string[]; weekdays: string[] };
    prefixCls?: string;
    // components?: CalendarComponents;
}

export const DefaultContext: Required<Context> = {
    locale: {
        months,
        weekdays
    },
    prefixCls: 'zr-cal'
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
