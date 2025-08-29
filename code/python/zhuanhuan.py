
# 等待一段时间，以便操作系统可以处理终止的进程    
import tkinter as tk  
from tkinter import filedialog  
from tkinter import messagebox  
from threading import Thread  
import os  
import glob  
from openpyxl import Workbook  
from openpyxl.utils.dataframe import dataframe_to_rows  
import pandas as pd  
import xlrd  
import threading 
def on_closing():  
    # 询问用户是否真的要退出  
    if messagebox.askyesno("退出", "您确定要退出吗？"):  
        # 如果用户点击"是"，则退出  
        root.destroy()  
    else:  
        # 如果用户点击"否"，则保持窗口打开状态  
        pass 
def start_thread():  
    thread = threading.Thread(target=on_confirm)  
    thread.start()
def select_folder():  
    folder_path = filedialog.askdirectory()  
    input_box.delete(0, tk.END)  
    input_box.insert(0, folder_path)  
    label.config(text="准备就绪")  
  
def on_confirm():  
    selected_text = input_box.get()
    threads = []  
    confirm_button.config(state=tk.DISABLED)
    for xls_file in glob.glob(os.path.join(selected_text, '*.xls')):  
        thread = Thread(target=process_file, args=(xls_file,))  
        thread.start()  
        threads.append(thread)# 保存线程对象，以便后续等待所有线程完成
        label.config(text=f"正在打开 {xls_file}")
    for thread in threads:  
        thread.join()  # 等待所有线程完成
    label.config(text="输入要转换文件所在的文件夹路径:") 
    input_box.delete(0, tk.END)
    confirm_button.config(state=tk.NORMAL)
    result = messagebox.askyesno("提示", "文件处理已完成,是否删除源文件？")  
    if result == True:
    # 在此处删除原始文件，避免在 with 块中删除文件时引发错误    
        for xls_file in glob.glob(os.path.join(selected_text, '*.xls')):  
            os.remove(xls_file)
        messagebox.showinfo("提示","删除成功")    
    elif result == False:
        messagebox.showinfo("提示","已取消删除")
def process_file(xls_file):  
    try:  
        df = pd.read_excel(xls_file)
        label.config(text=f"正在读取 {xls_file}")
    except Exception as e:  
        print(f"读取文件 {xls_file} 时出错: {e}")  
        return  
    df = df.map(lambda x: ''.join(filter(str.isalnum, str(x))))  
    xlsx_file = os.path.splitext(xls_file)[0] + '.xlsx'  
    try:  
        wb = Workbook()  # 创建工作簿对象  
        ws = wb.active  # 获取活动工作表  
        rows = dataframe_to_rows(df, index=False, header=True)  # 将DataFrame转换为行  
        for r in rows:  
            ws.append(r)  # 将行添加到工作表中
            label.config(text=f"正在处理 {xls_file}")
        wb.save(xlsx_file)  # 保存工作簿  
    except Exception as e:  
        print(f"处理文件 {xls_file} 时出错: {e}")  
  
root = tk.Tk()  
root.geometry("700x200")  
root.resizable(False, False)  
root.title("基础数据专用转换")  
label = tk.Label(root, text="输入要转换文件所在的文件夹路径:", font=("Arial", 14))  
label.pack(pady=10)  
input_box = tk.Entry(root, width=80)
input_box.pack(pady=10)  
select_button = tk.Button(root, text="浏览", command=select_folder)  
select_button.pack(pady=10)
confirm_button = tk.Button(root, text="确定", command=start_thread)    
confirm_button.pack(pady=10)
root.protocol("WM_DELETE_WINDOW", on_closing)
root.mainloop()