import { useContext, useMemo } from 'react';

import CalendarContext from './CalendarContext';

const useCls = () => {
    const { prefixCls } = useContext(CalendarContext);
    const cls = useMemo(() => {
        return {
            table: prefixCls + '-table',
            head: prefixCls + '-thead',
            row: prefixCls + '-row',
            cell: prefixCls + '-cell',
            active: prefixCls + '-active',
            now: prefixCls + '-now',
            disabled: prefixCls + '-disabled',
            prev: prefixCls + '-prev',
            next: prefixCls + '-next',
            rangeFirst: prefixCls + '-range-first',
            rangeLast: prefixCls + '-range-last',
            rangeMiddle: prefixCls + '-range-middle',
            rangeUnclosed: prefixCls + '-range-unclosed',
            wrap: prefixCls,
            month: prefixCls + '-month',
            monthWrap: prefixCls + '-month-wrap',
            body: prefixCls + '-body'
        };
    }, [prefixCls]);
    return cls;
};

export default useCls;
