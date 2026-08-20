import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# ==================== VIN映射表（四轮定位用） ====================
VIN_MODEL_MAP = {
    'C0': 'N111',
    'C1': 'N111P',
    'C5': 'CF510V',
    'C6': 'CN115',
    'C7': 'CN112',
    'C8': 'CN110V',
    'C9': 'CN110V',
}

# ==================== 规格配置 ====================
SPECS_ALIGNMENT = {
    'CF510V': {'左前前束': (-0.05, 0.05), '右前前束': (-0.05, 0.05), '左前外倾': (-0.25, 1.25), '右前外倾': (-0.25, 1.25), '方向盘角度': (-0.3, 0.3)},
    'CN110V': {'左前前束': (-0.05, 0.05), '右前前束': (-0.05, 0.05), '左前外倾': (-0.25, 1.25), '右前外倾': (-0.25, 1.25), '方向盘角度': (-0.3, 0.3)},
    'CN112':  {'左前前束': (-0.05, 0.05), '右前前束': (-0.05, 0.05), '左前外倾': (-0.25, 1.25), '右前外倾': (-0.25, 1.25), '方向盘角度': (-0.3, 0.3)},
    'CN115':  {'左前前束': (-0.05, 0.05), '右前前束': (-0.05, 0.05), '左前外倾': (-0.25, 1.25), '右前外倾': (-0.25, 1.25), '方向盘角度': (-0.3, 0.3)},
    'N111':   {'左前前束': (0.133, 0.3), '右前前束': (0.133, 0.3), '左前外倾': (0.08, 1.58), '右前外倾': (0.08, 1.58), '方向盘角度': (-0.3, 0.3)},
    'N111P':  {'左前前束': (0.133, 0.3), '右前前束': (0.133, 0.3), '左前外倾': (0.08, 1.58), '右前外倾': (0.08, 1.58), '方向盘角度': (-0.3, 0.3)},
}

SPECS_LAMP = {
    'CF510V':  {'左远光强': (40000, 225000), '右远光强': (40000, 225000), '左近光上下偏': (-168, -123), '右近光上下偏': (-168, -123), '左近光水平偏': (-20, 220), '右近光水平偏': (-20, 220)},
    'N111':    {'左远光强': (26000, 225000), '右远光强': (26000, 225000), '左近光上下偏': (-236, -79), '右近光上下偏': (-236, -79), '左近光水平偏': (-153, 315), '右近光水平偏': (-153, 315)},
    'N111P':   {'左远光强': (26000, 225000), '右远光强': (26000, 225000), '左近光上下偏': (-236, -79), '右近光上下偏': (-236, -79), '左近光水平偏': (-153, 315), '右近光水平偏': (-153, 315)},
    'CN110V':  {'左远光强': (30000, 225000), '右远光强': (30000, 225000), '左近光上下偏': (-257, -86), '右近光上下偏': (-257, -86), '左近光水平偏': (-153, 315), '右近光水平偏': (-153, 315)},
    'CN112':   {'左远光强': (30000, 225000), '右远光强': (30000, 225000), '左近光上下偏': (-227, -76), '右近光上下偏': (-227, -76), '左近光水平偏': (-153, 315), '右近光水平偏': (-153, 315)},
    'CN115':   {'左远光强': (30000, 225000), '右远光强': (30000, 225000), '左近光上下偏': (-251, -84), '右近光上下偏': (-251, -84), '左近光水平偏': (-153, 315), '右近光水平偏': (-153, 315)},
    'CN115G':  {'左远光强': (30000, 225000), '右远光强': (30000, 225000), '左近光上下偏': (-255, -85), '右近光上下偏': (-255, -85), '左近光水平偏': (-153, 315), '右近光水平偏': (-153, 315)},
}


def get_week_of_month(date):
    """计算某日是当月第几周"""
    first_day = date.replace(day=1)
    first_day_of_week = first_day.weekday()
    day_of_month = date.day
    week_num = (day_of_month + first_day_of_week - 1) // 7 + 1
    return week_num


def extract_model_from_vin(vin):
    """从VIN码第11-12位提取车型（四轮定位）"""
    if pd.isna(vin) or not isinstance(vin, str):
        return '未知'
    vin = str(vin).strip().upper()
    if len(vin) < 12:
        return '未知'
    key = vin[10:12]
    return VIN_MODEL_MAP.get(key, '未知')


def extract_model_from_standard(standard):
    """从检测标准列提取车型（大灯）"""
    if pd.isna(standard) or not isinstance(standard, str):
        return '未知'
    s = str(standard).strip()
    if s.startswith('BASE '):
        return s[5:]
    return s


def calculate_index(data, lower, upper, method):
    """
    计算 Cpk 或 Cp
    method: 'cpk' 或 'cp'
    """
    data_clean = data.dropna()
    if len(data_clean) < 3:
        return np.nan

    mean_val = data_clean.mean()
    std_val = data_clean.std(ddof=1)

    if std_val == 0 or pd.isna(std_val):
        return np.nan

    if method == 'cp':
        # Cp = (USL - LSL) / (6 * sigma)
        return (upper - lower) / (6 * std_val)
    else:
        # Cpk = min((USL - mean) / (3 * sigma), (mean - LSL) / (3 * sigma))
        cpu = (upper - mean_val) / (3 * std_val)
        cpl = (mean_val - lower) / (3 * std_val)
        return min(cpu, cpl)


def read_excel_file(file_path, module):
    """读取Excel文件，根据模块选择列"""
    print(f"正在读取文件: {file_path}")
    df = pd.read_excel(file_path, header=0)

    # 列名映射（支持带单位列名）
    col_mapping = {}
    for col in df.columns:
        col_str = str(col).strip()

        # 通用列
        if 'VIN' in col_str or '车辆识别码' in col_str:
            col_mapping['VIN'] = col
        elif '检测结果' in col_str:
            col_mapping['检测结果'] = col
        elif '检测线号' in col_str:
            col_mapping['检测线号'] = col
        elif '检测结束时间' in col_str:
            col_mapping['检测结束时间'] = col
        elif '检测类型' in col_str:
            col_mapping['检测类型'] = col
        elif '检测标准' in col_str:
            col_mapping['检测标准'] = col

        # 四轮定位
        if '左前前束' in col_str:
            col_mapping['左前前束'] = col
        elif '右前前束' in col_str:
            col_mapping['右前前束'] = col
        elif '左前外倾' in col_str:
            col_mapping['左前外倾'] = col
        elif '右前外倾' in col_str:
            col_mapping['右前外倾'] = col
        elif '方向盘角度' in col_str:
            col_mapping['方向盘角度'] = col

        # 大灯 - 优先匹配带单位的列，排除判定列
        if '左远光强(cd)' in col_str or ('左远光强' in col_str and '判定' not in col_str):
            col_mapping['左远光强'] = col
        elif '右远光强(cd)' in col_str or ('右远光强' in col_str and '判定' not in col_str):
            col_mapping['右远光强'] = col
        elif '左近光水平偏(mm)' in col_str or ('左近光水平偏' in col_str and '判定' not in col_str and '合格' not in col_str):
            col_mapping['左近光水平偏'] = col
        elif '左近光上下偏(mm/h)' in col_str or ('左近光上下偏' in col_str and '判定' not in col_str and '合格' not in col_str):
            col_mapping['左近光上下偏'] = col
        elif '右近光水平偏(mm)' in col_str or ('右近光水平偏' in col_str and '判定' not in col_str and '合格' not in col_str):
            col_mapping['右近光水平偏'] = col
        elif '右近光上下偏(mm/h)' in col_str or ('右近光上下偏' in col_str and '判定' not in col_str and '合格' not in col_str):
            col_mapping['右近光上下偏'] = col

    # 确定测量列
    if module == 'alignment':
        measure_cols = ['左前前束', '右前前束', '左前外倾', '右前外倾', '方向盘角度']
        specs = SPECS_ALIGNMENT
    else:
        measure_cols = ['左远光强', '右远光强', '左近光上下偏', '右近光上下偏', '左近光水平偏', '右近光水平偏']
        specs = SPECS_LAMP

    # 检查必要列是否存在
    available_cols = {}
    for col in measure_cols:
        if col in col_mapping:
            available_cols[col] = col_mapping[col]
        else:
            available_cols[col] = None
            print(f"警告: 未找到列 '{col}'")

    # 解析数据
    processed = []
    for _, row in df.iterrows():
        item = {
            'VIN': str(row[col_mapping.get('VIN', '')] if col_mapping.get('VIN') in row else ''),
            '检测结果': str(row[col_mapping.get('检测结果', '')] if col_mapping.get('检测结果') in row else ''),
            '检测线号': str(row[col_mapping.get('检测线号', '')] if col_mapping.get('检测线号') in row else ''),
            '检测类型': str(row[col_mapping.get('检测类型', '')] if col_mapping.get('检测类型') in row else ''),
            '检测标准': str(row[col_mapping.get('检测标准', '')] if col_mapping.get('检测标准') in row else '')
        }

        # 提取数值
        for col in measure_cols:
            if available_cols.get(col):
                val = row.get(available_cols[col])
                if isinstance(val, str):
                    val = val.replace(',', '').strip()
                try:
                    item[col] = float(val) if val is not None and val != '' and val != '--' else np.nan
                except (ValueError, TypeError):
                    item[col] = np.nan
            else:
                item[col] = np.nan

        # 提取车型
        if module == 'alignment':
            item['车型'] = extract_model_from_vin(item['VIN'])
        else:
            item['车型'] = extract_model_from_standard(item['检测标准'])

        # 解析时间
        dt = row.get(col_mapping.get('检测结束时间', ''))
        if dt is not None and not pd.isna(dt):
            if isinstance(dt, str):
                try:
                    dt = pd.to_datetime(dt)
                except:
                    dt = None
            if hasattr(dt, 'year'):
                item['日期'] = dt
                item['年'] = dt.year
                item['月数字'] = dt.month
                item['月'] = str(dt.month).zfill(2)
                item['日'] = str(dt.day).zfill(2)
                item['年月日'] = f"{dt.year}-{str(dt.month).zfill(2)}-{str(dt.day).zfill(2)}"
                week_num = get_week_of_month(dt)
                item['周'] = f"{dt.month}月第{week_num}周"
                item['周排序'] = dt.year * 100 + dt.month * 10 + week_num
                item['月显示'] = f"{dt.year}-{str(dt.month).zfill(2)}"
                item['年显示'] = str(dt.year)
            else:
                item['日期'] = None
                for k in ['年', '月数字', '月', '日', '年月日', '周', '周排序', '月显示', '年显示']:
                    item[k] = None
        else:
            item['日期'] = None
            for k in ['年', '月数字', '月', '日', '年月日', '周', '周排序', '月显示', '年显示']:
                item[k] = None

        processed.append(item)

    df_result = pd.DataFrame(processed)

    # 只保留合格数据
    if '检测结果' in df_result.columns:
        df_result = df_result[df_result['检测结果'] == 'P'].copy()

    print(f"合格数据: {len(df_result)} 条")

    return df_result, specs, measure_cols


def compute_dimension_data(df, specs, measure_cols, dim, model_filter, line_filter, method):
    """按维度计算Cpk/Cp"""
    data = df.copy()

    if model_filter and model_filter != 'all':
        data = data[data['车型'] == model_filter]
    if line_filter and line_filter != 'all':
        data = data[data['检测线号'] == line_filter]

    if len(data) == 0:
        return pd.DataFrame()

    # 获取所有车型
    models = [m for m in data['车型'].unique() if m in specs and m != '未知']
    models.sort()

    # 获取所有线号
    all_lines = [l for l in data['检测线号'].unique() if l and l != '']
    all_lines.sort()

    # 确定分组字段
    if dim == '日':
        group_col = '年月日'
        sort_col = '年月日'
    elif dim == '周':
        group_col = '周'
        sort_col = '周排序'
    elif dim == '月':
        group_col = '月显示'
        sort_col = '月显示'
    else:
        group_col = '年显示'
        sort_col = '年显示'

    # 获取所有时间值
    time_values = data[group_col].dropna().unique()
    if dim == '周':
        time_list = []
        for t in time_values:
            sample = data[data[group_col] == t]
            if len(sample) > 0:
                time_list.append((t, sample.iloc[0].get(sort_col, 0)))
        time_list.sort(key=lambda x: x[1])
        times = [t[0] for t in time_list]
    else:
        times = sorted([str(t) for t in time_values if str(t) != 'nan'])

    # 判断是否显示"全部"汇总行
    show_total = (line_filter == 'all' or line_filter == 'total')
    show_lines = []
    if line_filter == 'all':
        show_lines = all_lines.copy()
    elif line_filter == 'total':
        show_lines = []
    else:
        show_lines = [line_filter]

    rows = []

    for model in models:
        model_data = data[data['车型'] == model]
        model_specs = specs.get(model, {})

        # 显示"全部"汇总行
        if show_total:
            for t in times:
                group_data = model_data[model_data[group_col] == t]
                if len(group_data) < 3:
                    continue

                row = {'车型': model, '时间': t, '检测线号': '全部'}
                for col in measure_cols:
                    if col in model_specs:
                        lower, upper = model_specs[col]
                        idx = calculate_index(group_data[col], lower, upper, method)
                        row[col] = round(idx, 4) if not pd.isna(idx) else ''
                    else:
                        row[col] = ''
                rows.append(row)

        # 按线号计算
        for line in show_lines:
            line_data = model_data[model_data['检测线号'] == line]
            if len(line_data) == 0:
                continue

            for t in times:
                group_data = line_data[line_data[group_col] == t]
                if len(group_data) < 3:
                    continue

                row = {'车型': model, '时间': t, '检测线号': line}
                for col in measure_cols:
                    if col in model_specs:
                        lower, upper = model_specs[col]
                        idx = calculate_index(group_data[col], lower, upper, method)
                        row[col] = round(idx, 4) if not pd.isna(idx) else ''
                    else:
                        row[col] = ''
                rows.append(row)

    result = pd.DataFrame(rows)

    if result.empty:
        return result

    # 排序：车型 → 时间，全部行排前
    result['_is_total'] = result['检测线号'] == '全部'
    result = result.sort_values(['车型', '_is_total', '时间']).drop(columns=['_is_total']).reset_index(drop=True)

    return result


def main():
    print("=" * 60)
    print("车辆检测制程能力分析系统 (Cpk / Cp)")
    print("=" * 60)

    # 选择文件
    print("\n请将Excel文件放在当前目录，或输入完整路径:")
    print("  示例: 车辆检测记录 (43).xlsx")
    print("  示例: C:/Users/xxx/Desktop/检测数据.xlsx")

    file_path = input("\n请输入文件路径: ").strip()

    if not Path(file_path).exists():
        # 尝试桌面
        desktop = Path.home() / 'Desktop'
        desktop_file = desktop / file_path
        if desktop_file.exists():
            file_path = str(desktop_file)
        else:
            print(f"文件不存在: {file_path}")
            return

    # 选择模块
    print("\n请选择模块:")
    print("  1. 四轮定位")
    print("  2. 大灯")
    module_choice = input("请输入数字 (1 或 2): ").strip()
    module = 'alignment' if module_choice == '1' else 'lamp'
    module_name = '四轮定位' if module == 'alignment' else '大灯'

    # 选择计算方法
    print("\n请选择计算方法:")
    print("  1. Cpk (考虑中心偏移)")
    print("  2. Cp (不考虑中心偏移)")
    method_choice = input("请输入数字 (1 或 2): ").strip()
    method = 'cpk' if method_choice == '1' else 'cp'
    method_name = 'Cpk' if method == 'cpk' else 'Cp'

    print(f"\n加载配置: {module_name} | 计算方法: {method_name}")

    try:
        df, specs, measure_cols = read_excel_file(file_path, module)
    except Exception as e:
        print(f"读取文件失败: {e}")
        return

    if len(df) == 0:
        print("没有合格数据(P)，请检查数据")
        return

    # 统计信息
    print(f"\n总记录数: {len(df)}")
    print("\n车型分布:")
    for model, count in df['车型'].value_counts().items():
        if model in specs:
            print(f"  {model}: {count} 条")
        else:
            print(f"  {model}: {count} 条 (无规格)")

    print("\n检测线号分布:")
    for line, count in df['检测线号'].value_counts().items():
        print(f"  {line}: {count} 条")

    # 计算四个维度
    print("\n开始计算...")
    dims = ['日', '周', '月', '年']
    all_rows = []

    for dim in dims:
        print(f"  - 计算 {dim}...")
        result = compute_dimension_data(df, specs, measure_cols, dim, 'all', 'all', method)
        if not result.empty:
            all_rows.append(result)

    if not all_rows:
        print("没有足够数据计算")
        return

    final_df = pd.concat(all_rows, ignore_index=True)

    # 保存
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = Path.home() / 'Desktop' / f'{module_name}_{method_name}_全部数据_{timestamp}.xlsx'
    final_df.to_excel(output_file, index=False)

    print(f"\n✅ 结果已保存: {output_file}")
    print(f"总行数: {len(final_df)}")

    # 打印摘要
    print("\n" + "=" * 70)
    print("【计算结果摘要】")
    print("=" * 70)

    for model in final_df['车型'].unique():
        model_data = final_df[final_df['车型'] == model]
        print(f"\n【{model}】共 {len(model_data)} 条记录")

        # 先显示汇总行
        total_rows = model_data[model_data['检测线号'] == '全部']
        detail_rows = model_data[model_data['检测线号'] != '全部']

        if not total_rows.empty:
            print("  [汇总]")
            for _, row in total_rows.iterrows():
                values = []
                for col in measure_cols:
                    val = row.get(col, '')
                    if val != '' and not pd.isna(val):
                        values.append(f"{col}={val:.4f}")
                print(f"    {row['时间']} | 全部 | {' | '.join(values)}")

        if not detail_rows.empty:
            print("  [明细]")
            for _, row in detail_rows.head(10).iterrows():
                values = []
                for col in measure_cols:
                    val = row.get(col, '')
                    if val != '' and not pd.isna(val):
                        values.append(f"{col}={val:.4f}")
                print(f"    {row['时间']} | {row['检测线号']} | {' | '.join(values)}")
            if len(detail_rows) > 10:
                print(f"    ... 共 {len(detail_rows)} 条明细")

    print("\n" + "=" * 70)
    print(f"分级标准: ≥1.0 充足 | 0.67~1.0 临界 | <0.67 不足")
    print("=" * 70)


if __name__ == "__main__":
    main()