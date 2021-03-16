export default (...args: (string | void | boolean)[]): string => {
    let finalCls = '';
    args.forEach(cls => {
        if (cls) finalCls += ' ' + cls;
    });
    return finalCls;
};
