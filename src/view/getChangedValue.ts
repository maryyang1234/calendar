// 获取指定月份有多少天
const getDays = (year: number, month: number) => {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        days[1] = 29;
    }
    return days[month];
};

export default (v: { year?: number; month?: number; date?: number }, current: Date, value?: Date) => {
    const currentDate = new Date(value == null ? current : value);
    const currentMonth = currentDate.getMonth();
    const result = new Date(currentDate);
    const { year, month = currentMonth, date } = v;
    if (year != null) result.setFullYear(year);
    if (getDays(currentDate.getFullYear(), currentMonth) > getDays(result.getFullYear(), month)) {
        // 当前月的天数大于更新月的天数，先更新天再更新月
        if (date != null) result.setDate(date);
        result.setMonth(month);
    } else {
        result.setMonth(month);
        if (date != null) result.setDate(date);
    }

    return result;
};
