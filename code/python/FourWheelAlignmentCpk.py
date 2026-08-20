import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# ==================== 可配置区域 ====================
# 修改这里即可调整VIN映射和规格上下限

# VIN码第11-12位 → 车型映射
VIN_MODEL_MAP = {
    'C0': 'N111',
    'C1': 'N111P',
    'C5': 'CF510V',
    'C6': 'CN115',
    'C7': 'CN112',
    'C8': 'CN110V',
    'C9': 'CN110V',
}

# 各车型规格上下限 [下限, 上限]
SPECS = {
    'CF510V': {
        '左前前束': (-0.05, 0.05),
        '右前前束': (-0.05, 0.05),
        '左前外倾': (-0.25, 1.25),
        '右前外倾': (-0.25, 1.25),
        '方向盘角度': (-0.3, 0.3),
    },
    'CN110V': {
        '左前前束': (-0.05, 0.05),
        '右前前束': (-0.05, 0.05),
        '左前外倾': (-0.25, 1.25),
        '右前外倾': (-0.25, 1.25),
        '方向盘角度': (-0.3, 0.3),
    },
    'CN112': {
        '左前前束': (-0.05, 0.05),
        '右前前束': (-0.05, 0.05),
        '左前外倾': (-0.25, 1.25),
        '右前外倾': (-0.25, 1.25),
        '方向盘角度': (-0.3, 0.3),
    },
    'CN115': {
        '左前前束': (-0.05, 0.05),
        '右前前束': (-0.05, 0.05),
        '左前外倾': (-0.25, 1.25),
        '右前外倾': (-0.25, 1.25),
        '方向盘角度': (-0.3, 0.3),
    },
    'N111': {
        '左前前束': (0.133, 0.3),
        '右前前束': (0.133, 0.3),
        '左前外倾': (0.08, 1.58),
        '右前外倾': (0.08, 1.58),
        '方向盘角度': (-0.3, 0.3),
    },
    'N111P': {
        '左前前束': (0.133, 0.3),
        '右前前束': (0.133, 0.3),
        '左前外倾': (0.08, 1.58),
        '右前外倾': (0.08, 1.58),
        '方向盘角度': (-0.3, 0.3),
    },
}

MEASUREMENT_COLS = ['左前前束', '右前前束', '左前外倾', '右前外倾', '方向盘角度']
COL_LABELS = {
    '左前前束': '左前前束CPK',
    '右前前束': '右前前束CPK',
    '左前外倾': '左前外倾CPK',
    '右前外倾': '右前外倾CPK',
    '方向盘角度': '方向盘角度CPK',
}


# ==================== 工具函数 ====================
def get_week_of_month(date):
    """计算某日是当月第几周（周一为一周开始）"""
    first_day = date.replace(day=1)
    first_day_of_week = first_day.weekday()  # 0=周一
    day_of_month = date.day
    week_num = (day_of_month + first_day_of_week - 1) // 7 + 1
    return week_num


def extract_model_from_vin(vin):
    """从VIN码提取车型（取第11-12位）"""
    if pd.isna(vin) or not isinstance(vin, str):
        return '未知'
    vin = str(vin).strip().upper()
    if len(vin) < 12:
        return '未知'
    key = vin[10:12]
    return VIN_MODEL_MAP.get(key, '未知')


def calculate_cpk(data, spec_lower, spec_upper):
    """计算Cpk"""
    data_clean = data.dropna()
    if len(data_clean) < 3:
        return np.nan

    mean_val = data_clean.mean()
    std_val = data_clean.std(ddof=1)

    if std_val == 0 or std_val is None:
        return np.nan

    cpu = (spec_upper - mean_val) / (3 * std_val)
    cpl = (mean_val - spec_lower) / (3 * std_val)

    return min(cpu, cpl)


def get_status(cpk):
    """根据Cpk值返回状态: excellent/good/poor/na"""
    if pd.isna(cpk) or cpk is None:
        return 'na'
    if cpk >= 1.0:
        return 'excellent'
    if cpk >= 0.67:
        return 'good'
    return 'poor'


# ==================== 读取数据 ====================
def read_excel_data(file_path):
    """读取Excel数据 - 只保留合格数据(P)"""
    print(f"正在读取文件: {file_path}")
    df = pd.read_excel(file_path, header=0)

    print(f"原始数据行数: {len(df)}")

    # 列名映射
    col_mapping = {}
    for col in df.columns:
        col_str = str(col).strip()
        if 'VIN' in col_str or '车辆识别码' in col_str:
            col_mapping['VIN'] = col
        elif '检测结果' in col_str:
            col_mapping['检测结果'] = col
        elif '检测线号' in col_str:
            col_mapping['检测线号'] = col
        elif '检测结束时间' in col_str:
            col_mapping['检测结束时间'] = col
        elif '四轮定位是否及格' in col_str:
            col_mapping['四轮定位是否及格'] = col
        elif '左前前束' in col_str or '左前前束(度)' in col_str:
            col_mapping['左前前束'] = col
        elif '右前前束' in col_str or '右前前束(度)' in col_str:
            col_mapping['右前前束'] = col
        elif '左前外倾' in col_str or '左前外倾(度)' in col_str:
            col_mapping['左前外倾'] = col
        elif '右前外倾' in col_str or '右前外倾(度)' in col_str:
            col_mapping['右前外倾'] = col
        elif '方向盘角度' in col_str or '方向盘角度(度)' in col_str:
            col_mapping['方向盘角度'] = col

    # 重命名列
    for standard_name, actual_name in col_mapping.items():
        if actual_name != standard_name:
            df[standard_name] = df[actual_name]

    # 只保留合格数据 P
    if '检测结果' in df.columns:
        df = df[df['检测结果'] == 'P'].copy()
        print(f"合格数据(P)行数: {len(df)}")
    else:
        print("警告: 未找到'检测结果'列，使用全部数据")

    # 转换时间
    if '检测结束时间' in df.columns:
        df['检测结束时间'] = pd.to_datetime(df['检测结束时间'])
        df['日期'] = df['检测结束时间'].dt.date
        df['年'] = df['检测结束时间'].dt.year
        df['月数字'] = df['检测结束时间'].dt.month
        df['月'] = df['检测结束时间'].dt.strftime('%m')
        df['日'] = df['检测结束时间'].dt.strftime('%d')
        df['年月日'] = df['检测结束时间'].dt.strftime('%Y-%m-%d')
        # 计算当月第几周
        df['周数'] = df['检测结束时间'].apply(get_week_of_month)
        df['周'] = df['月数字'].astype(str) + '月第' + df['周数'].astype(str) + '周'
        # 用于排序的字段
        df['周排序'] = df['年'] * 100 + df['月数字'] * 10 + df['周数']
        # 年月
        df['年月'] = df['年'].astype(str) + '-' + df['月'].astype(str)
        # 年
        df['年显示'] = df['年'].astype(str)
    else:
        print("警告: 未找到'检测结束时间'列")
        now = datetime.now()
        df['日期'] = now.date()
        df['年'] = now.year
        df['月数字'] = now.month
        df['月'] = str(now.month).zfill(2)
        df['日'] = str(now.day).zfill(2)
        df['年月日'] = now.strftime('%Y-%m-%d')
        df['周数'] = get_week_of_month(now)
        df['周'] = str(now.month) + '月第' + str(df['周数']) + '周'
        df['周排序'] = now.year * 100 + now.month * 10 + df['周数']
        df['年月'] = str(now.year) + '-' + str(now.month).zfill(2)
        df['年显示'] = str(now.year)

    # 提取车型（从VIN第11-12位）
    if 'VIN' in df.columns:
        df['车型'] = df['VIN'].apply(extract_model_from_vin)
        print(f"成功提取车型")
    else:
        print("警告: 未找到'VIN'列")
        df['车型'] = '未知'

    # 数值列转换
    for col in MEASUREMENT_COLS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    print(f"\n最终有效记录数: {len(df)}")
    return df


# ==================== 核心计算 ====================
def compute_dimension_data(df, dim_key, model_filter=None, line_filter=None):
    """
    按维度计算Cpk
    dim_key: '日', '周', '月', '年'
    每个检测线号单独计算，同时保留"全部"汇总行
    """
    data = df.copy()

    if model_filter and model_filter != 'all':
        data = data[data['车型'] == model_filter]
    if line_filter and line_filter != 'all':
        data = data[data['检测线号'] == line_filter]

    if len(data) == 0:
        return pd.DataFrame()

    # 获取所有车型
    models = [m for m in data['车型'].unique() if m in SPECS and m != '未知']
    models.sort()

    # 获取所有检测线号
    all_lines = [l for l in data['检测线号'].unique() if l and l != '']
    all_lines.sort()

    # 确定分组字段
    if dim_key == '日':
        group_col = '年月日'
        sort_col = '年月日'
    elif dim_key == '周':
        group_col = '周'
        sort_col = '周排序'
    elif dim_key == '月':
        group_col = '年月'
        sort_col = '年月'
    else:  # 年
        group_col = '年显示'
        sort_col = '年显示'

    # 获取所有时间值
    time_values = data[group_col].dropna().unique()
    if dim_key == '周':
        # 按周排序
        time_list = []
        for t in time_values:
            if pd.isna(t):
                continue
            sample = data[data[group_col] == t].iloc[0] if len(data[data[group_col] == t]) > 0 else None
            if sample is not None:
                time_list.append((t, sample.get(sort_col, 0)))
        time_list.sort(key=lambda x: x[1])
        times = [t[0] for t in time_list]
    else:
        times = sorted([str(t) for t in time_values if str(t) != 'nan'])

    rows = []

    for model in models:
        model_data = data[data['车型'] == model]

        # 1. 先添加"全部"汇总行
        for t in times:
            group_data = model_data[model_data[group_col] == t]
            if len(group_data) < 3:
                continue

            row = {
                '车型': model,
                '时间': t,
                '检测线号': '全部',
                '_is_total': True
            }

            for col in MEASUREMENT_COLS:
                if col in SPECS[model]:
                    lower, upper = SPECS[model][col]
                    cpk = calculate_cpk(group_data[col], lower, upper)
                    row[COL_LABELS[col]] = round(cpk, 4) if not np.isnan(cpk) else ''
                else:
                    row[COL_LABELS[col]] = ''

            rows.append(row)

        # 2. 再按每个检测线号单独计算
        for line in all_lines:
            line_data = model_data[model_data['检测线号'] == line]
            if len(line_data) == 0:
                continue

            for t in times:
                group_data = line_data[line_data[group_col] == t]
                if len(group_data) < 3:
                    continue

                row = {
                    '车型': model,
                    '时间': t,
                    '检测线号': line,
                    '_is_total': False
                }

                for col in MEASUREMENT_COLS:
                    if col in SPECS[model]:
                        lower, upper = SPECS[model][col]
                        cpk = calculate_cpk(group_data[col], lower, upper)
                        row[COL_LABELS[col]] = round(cpk, 4) if not np.isnan(cpk) else ''
                    else:
                        row[COL_LABELS[col]] = ''

                rows.append(row)

    # 转换为DataFrame
    result = pd.DataFrame(rows)

    if result.empty:
        return result

    # 排序：先按车型，再按时间，全部行排在最前面
    # 添加辅助排序列
    result['_model_order'] = result['车型'].apply(lambda x: models.index(x) if x in models else 999)
    result['_is_total_order'] = result['_is_total'].apply(lambda x: 0 if x else 1)

    if dim_key == '周':
        # 周排序
        week_sort_map = {}
        for _, row in result.iterrows():
            key = (row['车型'], row['时间'])
            sample = data[(data['车型'] == row['车型']) & (data[group_col] == row['时间'])]
            if not sample.empty:
                week_sort_map[key] = sample.iloc[0].get(sort_col, 0)
            else:
                week_sort_map[key] = 0
        result['_time_sort'] = result.apply(lambda r: week_sort_map.get((r['车型'], r['时间']), 0), axis=1)
        result = result.sort_values(['_model_order', '_is_total_order', '_time_sort']).reset_index(drop=True)
    else:
        # 按时间字符串排序
        result['_time_sort'] = result['时间']
        result = result.sort_values(['_model_order', '_is_total_order', '_time_sort']).reset_index(drop=True)

    # 删除辅助列
    result = result.drop(columns=['_model_order', '_is_total_order', '_time_sort', '_is_total'])

    return result


def print_config():
    """打印当前配置"""
    print("\n" + "=" * 60)
    print("【当前配置】")
    print("=" * 60)
    print("\nVIN映射表:")
    for key, val in VIN_MODEL_MAP.items():
        print(f"  {key} → {val}")

    print("\n规格表 [下限, 上限]:")
    for model, specs in SPECS.items():
        print(f"  {model}:")
        for col, (lo, hi) in specs.items():
            print(f"    {col}: [{lo}, {hi}]")
    print("=" * 60)


def main():
    # 桌面路径
    desktop = Path.home() / 'Desktop'
    file_path = '车辆检测记录 (43).xlsx'

    if not Path(file_path).exists():
        desktop_file = desktop / file_path
        if desktop_file.exists():
            file_path = str(desktop_file)
        else:
            print(f"请将文件 '{file_path}' 放在当前目录或桌面上")
            return

    # 打印配置
    print_config()

    try:
        df = read_excel_data(file_path)
    except Exception as e:
        print(f"读取文件失败: {e}")
        return

    if len(df) == 0:
        print("没有合格数据(P)，请检查数据")
        return

    # 数据概览
    print(f"\n=== 数据概览（仅P合格数据） ===")
    print(f"总记录数: {len(df)}")

    print("\n车型分布:")
    for model, count in df['车型'].value_counts().items():
        if model in SPECS:
            print(f"  {model}: {count} 条 (有规格 ✓)")
        else:
            print(f"  {model}: {count} 条 (无规格 ✗)")

    print("\n检测线号分布:")
    for line, count in df['检测线号'].value_counts().items():
        print(f"  {line}: {count} 条")

    # 输出文件
    output_file = desktop / 'Cpk全部数据.xlsx'

    print(f"\n开始计算Cpk（日/周/月/年四个维度）...")
    print("  每个检测线号单独计算，同时保留'全部'汇总行")

    # 计算四个维度
    dims = ['日', '周', '月', '年']
    all_rows = []

    for dim in dims:
        print(f"  - 计算 {dim}...")
        result = compute_dimension_data(df, dim)
        if not result.empty:
            all_rows.append(result)

    if not all_rows:
        print("没有足够数据计算Cpk")
        return

    # 合并所有维度数据
    final_df = pd.concat(all_rows, ignore_index=True)

    # 保存到Excel
    final_df.to_excel(output_file, index=False)

    print(f"\n✅ 计算结果已保存到: {output_file}")

    # 打印摘要
    print("\n" + "=" * 70)
    print("【Cpk计算结果摘要】")
    print("=" * 70)

    # 按车型分组显示
    for model in final_df['车型'].unique():
        model_data = final_df[final_df['车型'] == model]
        print(f"\n【{model}】共 {len(model_data)} 条记录")

        # 先显示"全部"行
        total_rows = model_data[model_data['检测线号'] == '全部']
        detail_rows = model_data[model_data['检测线号'] != '全部']

        if not total_rows.empty:
            print("  [汇总]")
            for _, row in total_rows.iterrows():
                cpk_values = []
                for col in MEASUREMENT_COLS:
                    val = row[COL_LABELS[col]]
                    if val != '' and not pd.isna(val):
                        cpk_values.append(f"{COL_LABELS[col]}={val:.4f}")
                print(f"    {row['时间']} | 全部 | {' | '.join(cpk_values)}")

        if not detail_rows.empty:
            print("  [各线号明细]")
            for _, row in detail_rows.head(10).iterrows():
                cpk_values = []
                for col in MEASUREMENT_COLS:
                    val = row[COL_LABELS[col]]
                    if val != '' and not pd.isna(val):
                        cpk_values.append(f"{COL_LABELS[col]}={val:.4f}")
                print(f"    {row['时间']} | {row['检测线号']} | {' | '.join(cpk_values)}")
            if len(detail_rows) > 10:
                print(f"    ... 共 {len(detail_rows)} 条明细记录")

    print("\n" + "=" * 70)
    print("分级标准: ≥1.0 充足 | 0.67~1.0 临界 | <0.67 不足")
    print("=" * 70)


if __name__ == "__main__":
    main()