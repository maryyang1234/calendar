const debounce = <T>(func: T, wait: number) => {
    let timer;
    const debounced = function (...args) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            ((func as unknown) as (...args: any[]) => any)(...args);
        }, wait);
    };

    debounced.abort = function () {
        clearTimeout(timer);
    };

    return (debounced as unknown) as typeof func;
};

export default debounce;
