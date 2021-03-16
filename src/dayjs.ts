import dayjs from 'dayjs';

// import weekday from 'dayjs/plugin/weekday';
// dayjs.extend(weekday);
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

export default dayjs;
