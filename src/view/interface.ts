import { Dayjs } from 'dayjs';

export interface SharedPanelProps {
    // 选中值
    value?: Dayjs;
    // 选中回调
    onChange: (t: Dayjs) => void;
    // 当前面板值
    current: Dayjs;
    // 面板切换回调
    onCurrentChange: (t: Dayjs) => void;
}
