import os
import cv2
import numpy as np
from natsort import natsorted

def crop_images(top_crop=250, bottom_crop=550):
    """
    裁剪当前目录中的所有图片
    """
    # 创建裁剪后的文件夹
    cropped_folder = "cropped_images"
    if not os.path.exists(cropped_folder):
        os.makedirs(cropped_folder)
    
    # 获取当前目录中的所有图片文件
    image_files = [f for f in os.listdir('.') if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    image_files = natsorted(image_files)
    
    if not image_files:
        print("当前目录中没有找到图片文件")
        return None
    
    print(f"找到 {len(image_files)} 张图片，开始裁剪...")
    
    for i, filename in enumerate(image_files):
        img = cv2.imread(filename)
        
        if img is None:
            print(f"无法读取图片: {filename}")
            continue
        
        height = img.shape[0]
        # 裁剪图片（顶部250px，底部550px）
        if height > top_crop + bottom_crop:
            cropped_img = img[top_crop:height-bottom_crop, :]
        else:
            print(f"图片 {filename} 高度不足，跳过裁剪")
            cropped_img = img
        
        output_path = os.path.join(cropped_folder, filename)
        cv2.imwrite(output_path, cropped_img)
        print(f"已裁剪: {filename} ({i+1}/{len(image_files)})")
    
    print("所有图片裁剪完成！")
    return cropped_folder

def extract_number(filename):
    """
    从文件名中提取数字
    """
    base_name = os.path.splitext(filename)[0]
    numbers = ''.join(filter(str.isdigit, base_name))
    return int(numbers) if numbers else -1

def find_closest_pairs(image_folder):
    """
    找出数字最接近的图片对，按数字从大到小顺序处理（数字大的在左边）
    """
    # 获取裁剪文件夹中的图片文件
    image_files = [f for f in os.listdir(image_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    image_files = natsorted(image_files)
    
    # 提取文件名和对应的数字
    file_numbers = []
    valid_files = []
    
    for filename in image_files:
        num = extract_number(filename)
        if num != -1:
            file_numbers.append(num)
            valid_files.append(filename)
    
    if len(valid_files) < 2:
        print("至少需要2张有效数字的图片")
        return []
    
    # 创建(数字, 文件名)的列表并按数字降序排序
    numbered_files = list(zip(file_numbers, valid_files))
    numbered_files.sort(key=lambda x: x[0], reverse=True)  # 从大到小排序
    
    print("按数字降序排序的文件:")
    for num, filename in numbered_files:
        print(f"  {filename} ({num})")
    
    pairs = []
    used_indices = set()
    
    print("正在按顺序寻找最接近的图片对（从数字最大的开始）...")
    
    # 按顺序处理：从数字最大的开始，为每个文件找最接近的未使用配对
    for i in range(len(numbered_files)):
        if i in used_indices:
            continue
            
        current_num, current_file = numbered_files[i]
        best_match = None
        min_diff = float('inf')
        best_j = -1
        
        # 为当前文件寻找最接近的未使用配对
        for j in range(i + 1, len(numbered_files)):
            if j in used_indices:
                continue
                
            other_num, other_file = numbered_files[j]
            diff = abs(current_num - other_num)
            
            if diff < min_diff:
                min_diff = diff
                best_match = (other_file, other_num)
                best_j = j
        
        if best_match:
            other_file, other_num = best_match
            
            # 确保数字大的在左边
            if current_num > other_num:
                left_file, right_file = current_file, other_file
                left_num, right_num = current_num, other_num
            else:
                left_file, right_file = other_file, current_file
                left_num, right_num = other_num, current_num
            
            pairs.append((left_file, right_file))
            used_indices.add(i)
            used_indices.add(best_j)
            print(f"找到配对: {left_file} ({left_num}) 和 {right_file} ({right_num}), 差值: {min_diff}")
    
    # 按左图数字降序重新排序配对，确保最大的在最前面
    def get_left_number(pair):
        return extract_number(pair[0])
    
    pairs.sort(key=get_left_number, reverse=True)
    
    # 处理剩余的单个文件
    remaining_indices = set(range(len(numbered_files))) - used_indices
    if remaining_indices:
        print(f"有 {len(remaining_indices)} 张图片无法配对，将被忽略")
        for idx in remaining_indices:
            num, filename = numbered_files[idx]
            print(f"未配对的图片: {filename} (数字: {num})")
    
    print("最终配对顺序（从数字最大的开始）:")
    for i, (left_file, right_file) in enumerate(pairs, 1):
        left_num = extract_number(left_file)
        right_num = extract_number(right_file)
        print(f"  {i}. {left_file} ({left_num}) + {right_file} ({right_num})")
    
    return pairs

def stitch_images(input_folder, pairs):
    """
    拼接图片对到当前目录（数字大的在左边）
    """
    # 创建输出文件夹
    output_folder = "stitched_images"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    print("开始拼接图片（按数字从大到小顺序）...")
    for idx, (left_img_name, right_img_name) in enumerate(pairs, 1):
        # 读取图片
        left_img_path = os.path.join(input_folder, left_img_name)
        right_img_path = os.path.join(input_folder, right_img_name)
        
        left_img = cv2.imread(left_img_path)
        right_img = cv2.imread(right_img_path)
        
        if left_img is None:
            print(f"无法读取图片: {left_img_path}")
            continue
        if right_img is None:
            print(f"无法读取图片: {right_img_path}")
            continue
        
        # 确保两张图片高度相同
        if left_img.shape[0] != right_img.shape[0]:
            # 调整高度到较小的那个
            min_height = min(left_img.shape[0], right_img.shape[0])
            left_img = cv2.resize(left_img, (int(left_img.shape[1] * min_height / left_img.shape[0]), min_height))
            right_img = cv2.resize(right_img, (int(right_img.shape[1] * min_height / right_img.shape[0]), min_height))
        
        # 水平拼接（数字大的在左边）
        stitched_img = np.hstack((left_img, right_img))
        
        # 保存拼接后的图片到输出文件夹
        output_path = os.path.join(output_folder, f"{idx}.jpg")
        cv2.imwrite(output_path, stitched_img)
        
        left_num = extract_number(left_img_name)
        right_num = extract_number(right_img_name)
        print(f"已拼接 [{idx}/{len(pairs)}]: {left_img_name} ({left_num}) 和 {right_img_name} ({right_num}) -> {output_path}")
    
    print(f"所有图片拼接完成！共生成 {len(pairs)} 张拼接图片")
    return output_folder

def main():
    print("=" * 60)
    print("图片处理程序\t作者：scripthub：wyc")
    print("###请确定已经将本程序移动至去要处理的文件夹###")
    print("功能: 1. 裁剪图片 2. 按数字从大到小顺序拼接最接近的图片对")
    choices = input("输入任意文字继续，输入2查看本程序官方网站:")
    if choices.strip() == '2':
        print("官方网站：https://jbcfz.cloudns.be/\n本文件地址：https://jbcfz.cloudns.be/code.html?title=图片裁剪合并专用&file=/code/python/image_process.py")
        os.system("start https://jbcfz.cloudns.be/2")  # Windows系统打开网址
        print("=" * 60)
        main()    
    # 步骤1: 裁剪当前目录中的所有图片
    cropped_folder = crop_images()
    if cropped_folder is None:
        return
    
    # 步骤2: 找出最接近的图片对（按数字从大到小顺序）
    print("=" * 60)
    pairs = find_closest_pairs(cropped_folder)
    
    if not pairs:
        print("没有找到可配对的图片对")
        return
    
    print(f"共找到 {len(pairs)} 对最接近的图片")
    
    # 步骤3: 拼接图片（按数字从大到小顺序）
    print("=" * 60)
    output_folder = stitch_images(cropped_folder, pairs)
    
    print("=" * 60)
    print("程序执行完成！")
    print(f"原始图片: 当前目录")
    print(f"裁剪图片: ./{cropped_folder}/")
    print(f"拼接结果: ./{output_folder}/ (按数字从大到小顺序)")
    print("=" * 60)

if __name__ == "__main__":
    main()