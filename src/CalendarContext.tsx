import React, { createContext, ProviderProps, useMemo } from 'react';

interface CalendarComponents {
    DateCell: React.ComponentType;
    Header: React.ComponentType;
    HeaderButton: React.ComponentType;
}

interface IContext {
    locale?: 'en' | 'cn';
    prefix?: string;
    components?: CalendarComponents;
}

export const DefaultContext: IContext = {
    locale: 'en',
    prefix: 'zr-cal-'
};

export const Context = createContext<IContext>(DefaultContext);

const CalendarContextProvider = ({ value, ...rest }: ProviderProps<IContext>) => {
    const finalValue = useMemo(() => {
        return { ...value, ...DefaultContext };
    }, [value]);
    return <Context.Provider value={finalValue} {...rest} />;
};

const calendarContext = {
    Provider: CalendarContextProvider
};

export default calendarContext;
