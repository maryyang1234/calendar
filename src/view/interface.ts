export interface SharedPanelProps {
    // 选中值
    value?: Date;
    // 选中回调
    onChange: (t: Date) => void;
    // 当前面板值
    current: Date;
    // 面板切换回调
    onCurrentChange: (t: Date) => void;
    // date of now
    now?: Date;
}
