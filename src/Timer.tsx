import React, { HTMLAttributes, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import debounce from './debounce';

import useUncontrolled from './useUncontrolled';

interface ScrollerInterface {
    value?: number;
    defaultValue?: number;
    onChange?: (v: number) => void;
    mode: 'hour' | 'minute' | 'second';
}

const countMap = {
    hour: 24,
    minute: 60,
    second: 60
};

let Stepper = ({
    index,
    onStepperClick,
    ...rest
}: { index: number; onStepperClick: (i: number) => void } & HTMLAttributes<HTMLDivElement>) => {
    const onClick = useCallback(() => {
        onStepperClick(index);
    }, [index, onStepperClick]);
    return <div onClick={onClick} {...rest} />;
};
Stepper = memo(Stepper);

const Scroller = ({ value: _value, defaultValue = 0, onChange: _onChange, mode }: ScrollerInterface) => {
    const [value, onChange] = useUncontrolled<number>(_value, defaultValue, _onChange);
    const count = useMemo(() => countMap[mode], [mode]);
    const steps = useMemo(() => {
        return new Array(count).fill(null).map((v, i) => i);
    }, [count]);
    const valueLockRef = useRef(false);
    const scrollLockRef = useRef(0);

    const scroller = useRef<HTMLDivElement>(null);

    const updateValue = useMemo(
        () =>
            debounce(() => {
                const scrollerDOM = scroller.current;
                const firstChild = scrollerDOM.childNodes[0] as HTMLDivElement;
                const childHeight = firstChild.getClientRects()[0].height;
                const scrollTop = scrollerDOM.scrollTop;
                const currentIndex = +(scrollTop / childHeight).toFixed();
                onChange(currentIndex);
            }, 200),
        [onChange]
    );

    useEffect(() => {
        const scrollerDOM = scroller.current;

        const onScroll = () => {
            updateValue();
        };
        const onMouseLeave = () => {
            updateValue();
        };
        scrollerDOM.addEventListener('scroll', onScroll);
        scrollerDOM.addEventListener('mouseleave', onMouseLeave);
        return () => {
            scrollerDOM.removeEventListener('scroll', onScroll);
            scrollerDOM.removeEventListener('mouseleave', onMouseLeave);
        };
    }, [updateValue]);

    useEffect(() => {
        if (scrollLockRef.current) return;

        valueLockRef.current = true;

        const scrollerDOM = scroller.current;
        const firstChild = scrollerDOM.childNodes[0] as HTMLDivElement;
        const childHeight = firstChild.getClientRects()[0].height;
        scrollerDOM.scrollTop = childHeight * value;

        setTimeout(() => {
            valueLockRef.current = false;
        }, 100);
    }, [value]);

    const onStepperClick = useCallback(
        (index: number) => {
            onChange(index);
        },
        [onChange]
    );

    return (
        <div className="zr-timer-container">
            <div ref={scroller}>
                {steps.map(v => {
                    return (
                        <Stepper
                            key={v}
                            index={v}
                            onStepperClick={onStepperClick}
                            className={value === v ? 'active' : ''}
                        >
                            {v}
                        </Stepper>
                    );
                })}
            </div>
        </div>
    );
};

function Timer(props) {
    return (
        <div className="zr-timer-timer">
            <Scroller mode="hour" />
            <Scroller mode="minute" />
            <Scroller mode="second" />
        </div>
    );
}

export default Timer;
