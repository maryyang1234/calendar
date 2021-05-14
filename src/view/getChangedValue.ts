export default (v: { year?: number; month?: number; date?: number }, current: Date, value?: Date) => {
    const result = new Date(value == null ? current : value);
    const { year, month, date } = v;
    if (year != null) result.setFullYear(year);
    if (month != null) result.setMonth(month);
    if (date != null) result.setDate(date);
    return result;
};
