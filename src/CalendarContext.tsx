import React, { ComponentType, createContext, memo, useMemo } from 'react';

import { months, weekdays } from './locale/en_us';

// interface CalendarComponents {
//     DateCell: React.ComponentType;
//     Header: React.ComponentType;
//     HeaderButton: React.ComponentType;
// }

export interface Context {
    locale?: { months: string[]; weekdays: string[] };
    prefix?: string;
    // components?: CalendarComponents;
}

export const DefaultContext: Context = {
    locale: {
        months,
        weekdays
    },
    prefix: 'zr-cal'
};

export type ContextKeys = keyof Context;
export const contextKeys = Object.keys(DefaultContext) as ContextKeys[];

const CalendarContext = createContext<Context>(DefaultContext);
export default CalendarContext;

export const pickContext = <T extends Context>(obj): [Context, T] => {
    const rest = { ...obj };
    const context = {};
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
        const finalContext = useMemo(() => ({ ...DefaultContext, ...context }), [context]);
        return (
            <CalendarContext.Provider value={finalContext}>
                <Component {...rest} />
            </CalendarContext.Provider>
        );
    };
    return memo(ComponentWithContext);
};
