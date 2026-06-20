import tkinter as tk
from tkinter import ttk, messagebox, filedialog, scrolledtext, simpledialog
import subprocess
import threading
import queue
import re
import os
import sys
import webbrowser
from dataclasses import dataclass
from typing import List, Optional, Dict, Tuple
import json
from collections import OrderedDict
import time
from datetime import datetime
import base64
from io import BytesIO
from PIL import Image, ImageTk
import shutil

# ========== 启动时检查ADB和Fastboot ==========

def check_adb_fastboot():
    """检查ADB和Fastboot是否可用"""
    adb_available = False
    fastboot_available = False
    
    try:
        # 检查adb
        result = subprocess.run(['adb', '--version'], capture_output=True, text=True, timeout=5)
        if result.returncode == 0 and 'Android Debug Bridge' in result.stdout:
            adb_available = True
    except:
        pass
    
    try:
        # 检查fastboot
        result = subprocess.run(['fastboot', '--version'], capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            fastboot_available = True
    except:
        pass
    
    # 也尝试在Windows下用shell=True检查
    if not adb_available or not fastboot_available:
        try:
            result = subprocess.run('adb --version', shell=True, capture_output=True, text=True, timeout=5)
            if result.returncode == 0 and 'Android Debug Bridge' in result.stdout:
                adb_available = True
        except:
            pass
        
        try:
            result = subprocess.run('fastboot --version', shell=True, capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                fastboot_available = True
        except:
            pass
    
    return adb_available, fastboot_available

def show_missing_tools_dialog(missing_tools):
    """显示缺少工具对话框"""
    root = tk.Tk()
    root.withdraw()  # 隐藏主窗口
    
    tool_names = []
    if not missing_tools[0]:
        tool_names.append("ADB")
    if not missing_tools[1]:
        tool_names.append("Fastboot")
    
    tools_str = " 和 ".join(tool_names)
    
    result = messagebox.askyesno(
        "缺少必要工具",
        f"未检测到 {tools_str} 工具！\n\n"
        f"请下载并安装 Android Platform Tools（包含ADB和Fastboot），\n"
        f"并将其添加到系统PATH环境变量中。\n\n"
        f"点击\"是\"将打开下载页面，点击\"否\"退出程序。\n\n"
        f"下载地址：\n"
        f"https://developer.android.google.cn/tools/releases/platform-tools?hl=zh-cn"
    )
    
    if result:
        # 打开下载页面
        webbrowser.open("https://developer.android.google.cn/tools/releases/platform-tools?hl=zh-cn")
    
    root.destroy()
    sys.exit(1)

# 检查ADB和Fastboot
adb_ok, fastboot_ok = check_adb_fastboot()
if not adb_ok or not fastboot_ok:
    show_missing_tools_dialog((adb_ok, fastboot_ok))

# ========== 数据类 ==========

@dataclass
class Device:
    """设备信息类"""
    serial: str
    model: str = ""
    brand: str = ""
    codename: str = ""
    android_version: str = ""
    kernel_version: str = ""
    bootloader_status: str = ""
    current_slot: str = ""
    state: str = ""
    partitions: List[str] = None
    max_download_size: str = ""
    has_root: bool = False
    root_checked: bool = False
    
    def __post_init__(self):
        if self.partitions is None:
            self.partitions = []

# ========== ADB管理器 ==========

class ADBManager:
    """ADB命令管理器"""
    
    @staticmethod
    def execute_command(cmd: str, timeout: int = 30) -> tuple:
        """执行shell命令并返回结果"""
        try:
            result = subprocess.run(
                cmd, 
                shell=True, 
                capture_output=True, 
                text=True, 
                timeout=timeout,
                encoding='utf-8',
                errors='ignore'
            )
            output = result.stdout
            error = result.stderr
            
            if ('adb' in cmd and ('push' in cmd or 'pull' in cmd)) or \
               ('fastboot' in cmd and error):
                if error and ('pushed' in error or 'pulled' in error or 
                            'KB/s' in error or 'MB/s' in error or
                            any(keyword in error.lower() for keyword in 
                                ['(bootloader)', 'finished', 'okay', 'product:', 
                                 'unlocked:', 'secure:', 'current-slot:', 
                                 'max-download-size:', 'partition-size:', 'partition-type:'])):
                    output = error + output
                    error = ""
            
            return result.returncode, output, error
        except subprocess.TimeoutExpired:
            return -1, "", "Command timed out"
        except Exception as e:
            return -1, "", str(e)
    
    @staticmethod
    def execute_command_with_pipe(cmd: str, timeout: int = 60) -> tuple:
        """使用管道执行命令"""
        try:
            process = subprocess.Popen(
                cmd,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding='utf-8',
                errors='ignore'
            )
            
            try:
                stdout, stderr = process.communicate(timeout=timeout)
                
                output = stdout
                error = stderr
                
                if 'adb' in cmd and ('push' in cmd or 'pull' in cmd):
                    if error and ('pushed' in error or 'pulled' in error or 
                                'KB/s' in error or 'MB/s' in error):
                        output = error + output
                        error = ""
                elif 'fastboot' in cmd and error:
                    if any(keyword in error.lower() for keyword in 
                          ['(bootloader)', 'finished', 'okay', 'product:', 
                           'unlocked:', 'secure:', 'current-slot:', 
                           'max-download-size:', 'partition-size:', 'partition-type:']):
                        output = error + output
                        error = ""
                
                return process.returncode, output, error
            except subprocess.TimeoutExpired:
                process.kill()
                process.communicate()
                return -1, "", "Command timed out"
        except Exception as e:
            return -1, "", str(e)
    
    @staticmethod
    def check_root(serial: str) -> bool:
        """检查设备是否有root权限"""
        code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell su -c 'id'", timeout=5)
        return code == 0 and 'uid=0' in output
    
    @staticmethod
    def get_devices() -> List[Device]:
        """获取连接的设备列表"""
        code, output, _ = ADBManager.execute_command("adb devices")
        if code != 0:
            return []
        
        devices = []
        lines = output.strip().split('\n')[1:]
        for line in lines:
            if line.strip():
                parts = line.split()
                if len(parts) >= 2:
                    device = Device(serial=parts[0], state=parts[1])
                    if device.state == "device":
                        device = ADBManager.get_device_info(device)
                    devices.append(device)
        
        return devices
    
    @staticmethod
    def get_device_info(device: Device) -> Device:
        """获取设备详细信息"""
        serial = device.serial
        
        code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell getprop ro.product.model")
        device.model = output.strip() if code == 0 else "Unknown"
        
        code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell getprop ro.product.brand")
        device.brand = output.strip() if code == 0 else "Unknown"
        
        code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell getprop ro.product.device")
        device.codename = output.strip() if code == 0 else "Unknown"
        
        code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell getprop ro.build.version.release")
        device.android_version = output.strip() if code == 0 else "Unknown"
        
        code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell cat /proc/version")
        device.kernel_version = output.strip().split('\n')[0] if code == 0 else "Unknown"
        
        code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell getprop ro.boot.verifiedbootstate")
        device.bootloader_status = "Unlocked" if output.strip() == "orange" else "Locked"
        
        code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell getprop ro.boot.slot_suffix")
        device.current_slot = output.strip() if output.strip() else "_a"
        
        return device

# ========== Fastboot管理器 ==========

class FastbootManager:
    """Fastboot命令管理器"""
    
    @staticmethod
    def get_devices() -> List[Device]:
        """获取fastboot设备列表"""
        code, output, _ = ADBManager.execute_command("fastboot devices")
        
        devices = []
        if code == 0 and output.strip():
            lines = output.strip().split('\n')
            for line in lines:
                if line.strip():
                    parts = line.split()
                    if len(parts) >= 2 and 'fastboot' in parts[1]:
                        serial = parts[0].strip()
                        device = Device(serial=serial, state="fastboot")
                        device = FastbootManager.get_device_info(device)
                        devices.append(device)
        
        return devices
    
    @staticmethod
    def get_device_info(device: Device) -> Device:
        """获取fastboot设备信息"""
        serial = device.serial
        
        code, output, _ = ADBManager.execute_command(f"fastboot -s {serial} getvar product")
        if code == 0:
            for line in output.split('\n'):
                if 'product:' in line:
                    device.codename = line.split(':')[1].strip()
                    break
        
        code, output, _ = ADBManager.execute_command(f"fastboot -s {serial} getvar unlocked")
        if code == 0 and output.strip():
            match = re.search(r'unlocked:\s*(yes|no)', output, re.IGNORECASE)
            if match:
                device.bootloader_status = "Unlocked" if match.group(1).lower() == 'yes' else "Locked"
            else:
                device.bootloader_status = "Unknown"
        else:
            code, output, _ = ADBManager.execute_command(f"fastboot -s {serial} getvar secure")
            if code == 0 and output.strip():
                match = re.search(r'secure:\s*(yes|no)', output, re.IGNORECASE)
                if match:
                    device.bootloader_status = "Locked" if match.group(1).lower() == 'yes' else "Unlocked"
                else:
                    device.bootloader_status = "Unknown"
            else:
                device.bootloader_status = "Unknown"
        
        code, output, _ = ADBManager.execute_command(f"fastboot -s {serial} getvar current-slot")
        if code == 0:
            for line in output.split('\n'):
                if 'current-slot:' in line:
                    slot = line.split(':')[1].strip()
                    if slot:
                        device.current_slot = f"_{slot}"
                    break
        
        code, output, _ = ADBManager.execute_command(f"fastboot -s {serial} getvar max-download-size")
        if code == 0:
            for line in output.split('\n'):
                if 'max-download-size:' in line:
                    device.max_download_size = line.split(':')[1].strip()
                    break
        
        device.partitions = FastbootManager.get_partitions(serial)
        
        return device
    
    @staticmethod
    def get_partitions(serial: str) -> List[str]:
        """从设备获取实际的分区列表"""
        partitions = set()
        
        code, output, _ = ADBManager.execute_command(f"fastboot -s {serial} getvar all")
        if code != 0:
            return sorted(["boot", "system", "vendor", "recovery", "vbmeta", "dtbo", 
                          "userdata", "cache", "misc", "persist", "modem", "bluetooth", 
                          "dsp", "super", "cust", "metadata"])
        
        for line in output.split('\n'):
            line = line.strip()
            if 'partition-size:' in line or 'partition-type:' in line:
                if line.startswith('(bootloader)'):
                    line = line[len('(bootloader)'):].strip()
                parts = line.split(':')
                if len(parts) >= 2:
                    part = parts[1].strip()
                    if part:
                        partitions.add(part)
        
        if not partitions:
            partitions = {"boot", "system", "vendor", "recovery", "vbmeta", "dtbo", 
                         "userdata", "cache", "misc", "persist", "modem", "bluetooth", 
                         "dsp", "super", "cust", "metadata"}
        
        return sorted(list(partitions))

# ========== 主界面类 ==========

class FlashToolGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("刷机工具箱")
        self.root.geometry("1200x900")
        
        self.app_name = "刷机工具箱"
        self.app_version = "1.0.0"
        self.app_author = "wyc"  # 请替换为你的名字
        self.app_website = "https://jbcfz.cloudns.be"  # 请替换为你的网站
        self.style = ttk.Style()

        self.style.theme_use('clam')
        
        self.current_mode = tk.StringVar(value="adb")
        self.selected_device = None
        self.devices = []
        self.screenshot_window = None
        self.current_screenshot_path = None
        self.root_checked_devices = set()
        
        self.create_widgets()
        self.auto_refresh()
    
    def create_widgets(self):
        """创建界面元素"""
        self.create_mode_selector()
        self.create_status_bar()
        
        self.main_frame = ttk.Frame(self.root, padding="10")
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        self.adb_page = ttk.Frame(self.main_frame)
        self.fastboot_page = ttk.Frame(self.main_frame)
        
        self.create_adb_page()
        self.create_fastboot_page()
        
        self.switch_page()
    def show_about(self):
        """显示关于对话框"""
        about_dialog = tk.Toplevel(self.root)
        about_dialog.title(f"关于 {self.app_name}")
        about_dialog.geometry("400x350")
        about_dialog.resizable(False, False)
        
        # 居中显示
        about_dialog.transient(self.root)
        about_dialog.grab_set()
        
        # 主框架
        main_frame = ttk.Frame(about_dialog, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # 应用名称
        name_label = ttk.Label(main_frame, text=self.app_name, font=("Arial", 24, "bold"))
        name_label.pack(pady=(10, 5))
        
        # 版本
        version_label = ttk.Label(main_frame, text=f"版本 {self.app_version}", font=("Arial", 12))
        version_label.pack(pady=5)
        
        # 分隔线
        separator = ttk.Separator(main_frame, orient='horizontal')
        separator.pack(fill=tk.X, pady=10)
        
        # 描述
        desc_frame = ttk.Frame(main_frame)
        desc_frame.pack(fill=tk.X, pady=10)
        
        desc_text = "Android设备刷机工具箱\n支持ADB和Fastboot模式\n提供设备管理、刷机、截图等功能"
        desc_label = ttk.Label(desc_frame, text=desc_text, font=("Arial", 10), justify=tk.CENTER)
        desc_label.pack()
        
        # 作者
        author_frame = ttk.Frame(main_frame)
        author_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(author_frame, text="作者:", font=("Arial", 10, "bold")).pack(side=tk.LEFT)
        ttk.Label(author_frame, text=self.app_author, font=("Arial", 10)).pack(side=tk.LEFT, padx=5)
        
        # 网站
        website_frame = ttk.Frame(main_frame)
        website_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(website_frame, text="网站:", font=("Arial", 10, "bold")).pack(side=tk.LEFT)
        
        website_link = ttk.Label(website_frame, text=self.app_website, 
                                foreground="blue", cursor="hand2", font=("Arial", 10, "underline"))
        website_link.pack(side=tk.LEFT, padx=5)
        website_link.bind("<Button-1>", lambda e: webbrowser.open(self.app_website))
        
        # 版权信息
        copyright_frame = ttk.Frame(main_frame)
        copyright_frame.pack(fill=tk.X, pady=(15, 5))
        
        copyright_label = ttk.Label(copyright_frame, text=f"© 2026 {self.app_author}. All rights reserved.", 
                                  font=("Arial", 8), foreground="gray")
        copyright_label.pack()
        
        # 关闭按钮
        close_btn = ttk.Button(main_frame, text="关闭", command=about_dialog.destroy)
        close_btn.pack(pady=10)    
    def create_mode_selector(self):
        """创建模式选择器"""
        top_frame = ttk.Frame(self.root, padding="5")
        top_frame.pack(fill=tk.X)
        
        ttk.Label(top_frame, text="选择模式:", font=("Arial", 12)).pack(side=tk.LEFT, padx=5)
        
        ttk.Radiobutton(top_frame, text="ADB模式", variable=self.current_mode, 
                      value="adb", command=self.switch_page).pack(side=tk.LEFT, padx=10)
        ttk.Radiobutton(top_frame, text="Fastboot模式", variable=self.current_mode, 
                      value="fastboot", command=self.switch_page).pack(side=tk.LEFT, padx=10)
        
        # 关于按钮（放在右侧）
        about_btn = ttk.Button(top_frame, text="关于", command=self.show_about)
        about_btn.pack(side=tk.RIGHT, padx=5)
        
        # 刷新按钮
        self.refresh_btn = ttk.Button(top_frame, text="刷新设备", command=self.refresh_devices)
        self.refresh_btn.pack(side=tk.RIGHT, padx=5)
        
        # 连接状态
        self.connection_status = tk.StringVar(value="未连接")
        self.status_label = ttk.Label(top_frame, textvariable=self.connection_status, 
                                    foreground="red", font=("Arial", 10))
        self.status_label.pack(side=tk.RIGHT, padx=20)
    
    def create_status_bar(self):
        """创建底部状态栏"""
        self.status_bar = ttk.Label(self.root, text="就绪", relief=tk.SUNKEN, 
                                   anchor=tk.W, padding=(5, 2))
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)
    
    def create_adb_page(self):
        """创建ADB页面"""
        self.adb_notebook = ttk.Notebook(self.adb_page)
        self.adb_notebook.pack(fill=tk.BOTH, expand=True)
        
        info_page = ttk.Frame(self.adb_notebook)
        self.create_adb_info_page(info_page)
        self.adb_notebook.add(info_page, text="设备信息")
        
        operation_page = ttk.Frame(self.adb_notebook)
        self.create_adb_operations_page(operation_page)
        self.adb_notebook.add(operation_page, text="功能操作")
        
        shell_page = ttk.Frame(self.adb_notebook)
        self.create_shell_page(shell_page, "adb")
        self.adb_notebook.add(shell_page, text="ADB Shell")
    
    def create_adb_info_page(self, parent):
        """创建ADB设备信息页面"""
        paned = ttk.PanedWindow(parent, orient=tk.VERTICAL)
        paned.pack(fill=tk.BOTH, expand=True)
        
        top_frame = ttk.Frame(paned)
        
        device_frame = ttk.LabelFrame(top_frame, text="设备选择", padding="10")
        device_frame.pack(fill=tk.X, pady=5)
        
        self.device_var = tk.StringVar()
        self.device_combo = ttk.Combobox(device_frame, textvariable=self.device_var, 
                                        state="readonly", width=40)
        self.device_combo.pack(side=tk.LEFT, padx=5)
        self.device_combo.bind('<<ComboboxSelected>>', self.on_device_selected)
        
        self.root_status_var = tk.StringVar(value="")
        ttk.Label(device_frame, textvariable=self.root_status_var, 
                 foreground="orange").pack(side=tk.LEFT, padx=10)
        
        info_frame = ttk.LabelFrame(top_frame, text="设备信息", padding="10")
        info_frame.pack(fill=tk.X, pady=5)
        
        self.create_copyable_info(info_frame, "设备名称:", "device_name", 0)
        self.create_copyable_info(info_frame, "设备品牌:", "device_brand", 1)
        self.create_copyable_info(info_frame, "设备代号:", "device_codename", 2)
        self.create_copyable_info(info_frame, "设备序列号:", "device_serial", 3)
        
        sys_frame = ttk.LabelFrame(top_frame, text="系统信息", padding="10")
        sys_frame.pack(fill=tk.X, pady=5)
        
        self.create_copyable_info(sys_frame, "系统版本:", "android_version", 0, "system")
        self.create_copyable_info(sys_frame, "BL锁状态:", "bl_status", 1, "system")
        self.create_copyable_info(sys_frame, "当前槽位:", "slot", 2, "system")
        self.create_copyable_info(sys_frame, "内核版本:", "kernel", 3, "system")
        
        paned.add(top_frame, weight=1)
        
        bottom_frame = ttk.Frame(paned)
        
        status_frame = ttk.LabelFrame(bottom_frame, text="设备实时状态", padding="10")
        status_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.status_text = scrolledtext.ScrolledText(status_frame, height=8, width=60)
        self.status_text.pack(fill=tk.BOTH, expand=True)
        
        refresh_btn = ttk.Button(status_frame, text="刷新状态", command=self.refresh_device_status)
        refresh_btn.pack(pady=5)
        
        paned.add(bottom_frame, weight=1)
    
    def create_adb_operations_page(self, parent):
        """创建ADB操作页面"""
        canvas = tk.Canvas(parent)
        scrollbar = ttk.Scrollbar(parent, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)
        
        scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        def _configure_canvas(event):
            canvas.itemconfig("all", width=event.width)
        canvas.bind("<Configure>", _configure_canvas)
        
        # 重启操作
        reboot_frame = ttk.LabelFrame(scrollable_frame, text="重启操作", padding="10")
        reboot_frame.pack(fill=tk.X, pady=5)
        for text, target in [("关机", "poweroff"), ("重启系统", ""), ("重启Recovery", "recovery"),
                            ("重启Bootloader", "bootloader"), ("重启Fastboot", "fastboot"), ("重启EDL", "edl")]:
            ttk.Button(reboot_frame, text=text, command=lambda t=target: self.reboot_device(t)).pack(side=tk.LEFT, padx=5)
        
        # 模拟操作
        simulate_frame = ttk.LabelFrame(scrollable_frame, text="模拟点击", padding="10")
        simulate_frame.pack(fill=tk.X, pady=5)
        for text, keycode in [("返回", "KEYCODE_BACK"), ("回到桌面", "KEYCODE_HOME"), ("多任务", "KEYCODE_APP_SWITCH")]:
            ttk.Button(simulate_frame, text=text, command=lambda k=keycode: self.simulate_key(k)).pack(side=tk.LEFT, padx=5)
        ttk.Button(simulate_frame, text="通知栏", command=self.open_notifications).pack(side=tk.LEFT, padx=5)
        
        # 截图
        screenshot_frame = ttk.LabelFrame(scrollable_frame, text="屏幕截图", padding="10")
        screenshot_frame.pack(fill=tk.X, pady=5)
        ttk.Button(screenshot_frame, text="截取屏幕", command=self.take_screenshot).pack(side=tk.LEFT, padx=5)
        ttk.Button(screenshot_frame, text="保存截图", command=self.save_screenshot).pack(side=tk.LEFT, padx=5)
        
        # 文件传输
        file_frame = ttk.LabelFrame(scrollable_frame, text="文件传输", padding="10")
        file_frame.pack(fill=tk.X, pady=5)
        ttk.Button(file_frame, text="推送文件到设备", command=self.push_file).pack(side=tk.LEFT, padx=5)
        ttk.Button(file_frame, text="从设备拉取文件", command=self.pull_file).pack(side=tk.LEFT, padx=5)
        
        # 进程管理
        process_frame = ttk.LabelFrame(scrollable_frame, text="进程/应用管理", padding="10")
        process_frame.pack(fill=tk.X, pady=5)
        ttk.Button(process_frame, text="查看进程列表", command=self.list_processes).pack(side=tk.LEFT, padx=5)
        ttk.Button(process_frame, text="结束进程(PID)", command=self.kill_process_dialog).pack(side=tk.LEFT, padx=5)
        ttk.Button(process_frame, text="强制停止应用", command=self.force_stop_app_dialog).pack(side=tk.LEFT, padx=5)
        
        # 电量模拟
        battery_frame = ttk.LabelFrame(scrollable_frame, text="电量模拟", padding="10")
        battery_frame.pack(fill=tk.X, pady=5)
        ttk.Button(battery_frame, text="充电伪装", command=lambda: self.mock_battery("charge")).pack(side=tk.LEFT, padx=5)
        ttk.Button(battery_frame, text="电量伪装", command=self.mock_battery_dialog).pack(side=tk.LEFT, padx=5)
        ttk.Button(battery_frame, text="温度伪装", command=self.mock_temperature_dialog).pack(side=tk.LEFT, padx=5)
        ttk.Button(battery_frame, text="还原电量设置", command=self.reset_battery).pack(side=tk.LEFT, padx=5)
        
        # 日志
        log_frame = ttk.LabelFrame(scrollable_frame, text="日志管理", padding="10")
        log_frame.pack(fill=tk.X, pady=5)
        ttk.Button(log_frame, text="抓取日志", command=self.capture_logs).pack(side=tk.LEFT, padx=5)
        
        # 应用管理
        app_frame = ttk.LabelFrame(scrollable_frame, text="应用管理", padding="10")
        app_frame.pack(fill=tk.X, pady=5)
        ttk.Button(app_frame, text="安装应用", command=self.install_app).pack(side=tk.LEFT, padx=5)
        ttk.Button(app_frame, text="卸载应用", command=self.uninstall_app_dialog).pack(side=tk.LEFT, padx=5)
        ttk.Button(app_frame, text="冻结/解冻应用", command=self.freeze_app_dialog).pack(side=tk.LEFT, padx=5)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        def _on_mousewheel(event):
            canvas.yview_scroll(int(-1*(event.delta/120)), "units")
        canvas.bind_all("<MouseWheel>", _on_mousewheel)
    
    def create_fastboot_page(self):
        """创建Fastboot页面"""
        self.fb_notebook = ttk.Notebook(self.fastboot_page)
        self.fb_notebook.pack(fill=tk.BOTH, expand=True)
        
        info_page = ttk.Frame(self.fb_notebook)
        self.create_fastboot_info_page(info_page)
        self.fb_notebook.add(info_page, text="设备信息")
        
        operation_page = ttk.Frame(self.fb_notebook)
        self.create_fastboot_operations_page(operation_page)
        self.fb_notebook.add(operation_page, text="操作")
        
        shell_page = ttk.Frame(self.fb_notebook)
        self.create_shell_page(shell_page, "fastboot")
        self.fb_notebook.add(shell_page, text="Fastboot Shell")
    
    def create_fastboot_info_page(self, parent):
        """创建Fastboot设备信息页面"""
        device_frame = ttk.LabelFrame(parent, text="设备选择", padding="10")
        device_frame.pack(fill=tk.X, pady=5)
        
        self.fb_device_var = tk.StringVar()
        self.fb_device_combo = ttk.Combobox(device_frame, textvariable=self.fb_device_var, 
                                           state="readonly", width=40)
        self.fb_device_combo.pack(side=tk.LEFT, padx=5)
        self.fb_device_combo.bind('<<ComboboxSelected>>', self.on_fb_device_selected)
        
        info_frame = ttk.LabelFrame(parent, text="设备信息", padding="10")
        info_frame.pack(fill=tk.X, pady=5)
        
        self.fb_info_text = scrolledtext.ScrolledText(info_frame, height=8, width=50)
        self.fb_info_text.pack(fill=tk.X)
        
        bl_frame = ttk.LabelFrame(parent, text="Bootloader状态", padding="10")
        bl_frame.pack(fill=tk.X, pady=5)
        
        self.bl_status_label = ttk.Label(bl_frame, text="状态未知", font=("Arial", 10))
        self.bl_status_label.pack()
    
    def create_fastboot_operations_page(self, parent):
        """创建Fastboot操作页面"""
        reboot_frame = ttk.LabelFrame(parent, text="重启操作", padding="10")
        reboot_frame.pack(fill=tk.X, pady=5)
        for text, target in [("关机", "poweroff"), ("重启系统", "reboot"), ("重启Recovery", "reboot-recovery"),
                            ("重启Bootloader", "reboot-bootloader"), ("重启Fastboot", "reboot-fastboot"), ("重启EDL", "oem edl")]:
            ttk.Button(reboot_frame, text=text, command=lambda t=target: self.fastboot_command(t)).pack(side=tk.LEFT, padx=5)
        
        partition_frame = ttk.LabelFrame(parent, text="分区管理", padding="10")
        partition_frame.pack(fill=tk.X, pady=5)
        
        partition_select_frame = ttk.Frame(partition_frame)
        partition_select_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(partition_select_frame, text="分区:").pack(side=tk.LEFT, padx=5)
        self.partition_var = tk.StringVar()
        self.partition_combo = ttk.Combobox(partition_select_frame, textvariable=self.partition_var, width=25)
        self.partition_combo.pack(side=tk.LEFT, padx=5)
        ttk.Label(partition_select_frame, text="(从设备读取，可手动输入)", foreground="gray").pack(side=tk.LEFT, padx=5)
        
        button_frame = ttk.Frame(partition_frame)
        button_frame.pack(fill=tk.X, pady=5)
        ttk.Button(button_frame, text="刷入镜像", command=self.flash_partition).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="擦除分区", command=self.erase_partition).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="格式化分区", command=self.format_partition).pack(side=tk.LEFT, padx=5)
        
        boot_frame = ttk.LabelFrame(parent, text="临时启动", padding="10")
        boot_frame.pack(fill=tk.X, pady=5)
        
        ttk.Label(boot_frame, text="选择镜像文件临时启动系统（不会刷入设备）:").pack(anchor=tk.W)
        boot_button_frame = ttk.Frame(boot_frame)
        boot_button_frame.pack(fill=tk.X, pady=5)
        
        self.boot_image_path = tk.StringVar()
        ttk.Entry(boot_button_frame, textvariable=self.boot_image_path, width=40).pack(side=tk.LEFT, padx=5)
        ttk.Button(boot_button_frame, text="浏览", command=self.select_boot_image).pack(side=tk.LEFT, padx=5)
        ttk.Button(boot_button_frame, text="临时启动", command=self.boot_image).pack(side=tk.LEFT, padx=10)
        ttk.Label(boot_frame, text="提示：临时启动不会修改设备，重启后恢复原系统", 
                 foreground="blue", font=("Arial", 8)).pack(anchor=tk.W, pady=5)
    
    def create_shell_page(self, parent, mode):
        """创建Shell页面"""
        input_frame = ttk.Frame(parent, padding="5")
        input_frame.pack(fill=tk.X)
        
        ttk.Label(input_frame, text="命令:").pack(side=tk.LEFT, padx=5)
        
        if mode == "adb":
            self.adb_shell_cmd_entry = ttk.Entry(input_frame, width=60)
            self.adb_shell_cmd_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
            self.adb_shell_cmd_entry.bind('<Return>', lambda e: self.execute_shell_command("adb"))
            ttk.Button(input_frame, text="执行", command=lambda: self.execute_shell_command("adb")).pack(side=tk.LEFT, padx=5)
        else:
            self.fb_shell_cmd_entry = ttk.Entry(input_frame, width=60)
            self.fb_shell_cmd_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
            self.fb_shell_cmd_entry.bind('<Return>', lambda e: self.execute_shell_command("fastboot"))
            ttk.Button(input_frame, text="执行", command=lambda: self.execute_shell_command("fastboot")).pack(side=tk.LEFT, padx=5)
        
        output_frame = ttk.Frame(parent, padding="5")
        output_frame.pack(fill=tk.BOTH, expand=True)
        
        if mode == "adb":
            self.adb_shell_output = scrolledtext.ScrolledText(output_frame, height=20)
            self.adb_shell_output.pack(fill=tk.BOTH, expand=True)
        else:
            self.fb_shell_output = scrolledtext.ScrolledText(output_frame, height=20)
            self.fb_shell_output.pack(fill=tk.BOTH, expand=True)
        
        ttk.Button(parent, text="清除输出", command=lambda: self.clear_shell_output(mode)).pack(pady=5)
    
    def create_copyable_info(self, parent, label_text, attr_name, row, prefix=""):
        """创建可复制的信息标签"""
        frame = ttk.Frame(parent)
        frame.grid(row=row, column=0, sticky=tk.W, pady=2)
        ttk.Label(frame, text=label_text, font=("Arial", 10)).pack(side=tk.LEFT)
        value_var = tk.StringVar(value="N/A")
        label = ttk.Label(frame, textvariable=value_var, foreground="blue", cursor="hand2", 
                         font=("Arial", 10, "underline"))
        label.pack(side=tk.LEFT, padx=5)
        label.bind("<Button-1>", lambda e, v=value_var: self.copy_to_clipboard(v.get()))
        setattr(self, f"{prefix}_{attr_name}_var" if prefix else f"{attr_name}_var", value_var)
    
    # ========== 核心功能 ==========
    
    def switch_page(self):
        """切换页面"""
        if self.current_mode.get() == "adb":
            self.fastboot_page.pack_forget()
            self.adb_page.pack(fill=tk.BOTH, expand=True)
        else:
            self.adb_page.pack_forget()
            self.fastboot_page.pack(fill=tk.BOTH, expand=True)
        self.refresh_devices()
    
    def update_status(self, message):
        """更新状态栏"""
        self.status_bar.config(text=message)
        self.root.update_idletasks()
    
    def refresh_devices(self):
        """刷新设备列表"""
        threading.Thread(target=self._refresh_devices_thread, daemon=True).start()
    
    def _refresh_devices_thread(self):
        """在后台线程中刷新设备"""
        if self.current_mode.get() == "adb":
            self.devices = ADBManager.get_devices()
            self.root.after(0, self._update_adb_device_list)
        else:
            self.devices = FastbootManager.get_devices()
            self.root.after(0, self._update_fastboot_device_list)
    
    def _update_adb_device_list(self):
        """更新ADB设备列表"""
        if self.devices:
            self.connection_status.set(f"已连接 ({len(self.devices)}个设备)")
            self.status_label.config(foreground="green")
            device_list = [f"{d.serial} - {d.model}" for d in self.devices]
            self.device_combo['values'] = device_list
            if not self.selected_device or self.selected_device.serial not in [d.serial for d in self.devices]:
                if self.devices:
                    self.device_combo.set(device_list[0])
                    self.on_device_selected()
        else:
            self.connection_status.set("未连接")
            self.status_label.config(foreground="red")
            self.device_combo['values'] = []
            self.device_combo.set('')
            self.clear_device_info()
    
    def _update_fastboot_device_list(self):
        """更新Fastboot设备列表"""
        if self.devices:
            self.connection_status.set(f"已连接 ({len(self.devices)}个设备)")
            self.status_label.config(foreground="green")
            device_list = [f"{d.serial} - {d.codename}" for d in self.devices]
            self.fb_device_combo['values'] = device_list
            if not self.selected_device or self.selected_device.serial not in [d.serial for d in self.devices]:
                if self.devices:
                    self.fb_device_combo.set(device_list[0])
                    self.on_fb_device_selected()
        else:
            self.connection_status.set("未连接")
            self.status_label.config(foreground="red")
            self.fb_device_combo['values'] = []
            self.fb_device_combo.set('')
            self.fb_info_text.delete(1.0, tk.END)
            self.bl_status_label.config(text="状态未知")
    
    def on_device_selected(self, event=None):
        """ADB设备选择事件"""
        selection = self.device_combo.get()
        if selection:
            for device in self.devices:
                if device.serial in selection:
                    self.selected_device = device
                    self.update_device_info()
                    self.check_root_once(device)
                    self.update_root_status()
                    break
    
    def on_fb_device_selected(self, event=None):
        """Fastboot设备选择事件"""
        selection = self.fb_device_combo.get()
        if selection:
            for device in self.devices:
                if device.serial in selection:
                    self.selected_device = device
                    self.update_fastboot_device_info()
                    break
    
    def update_device_info(self):
        """更新设备信息显示"""
        if not self.selected_device:
            return
        self.device_name_var.set(self.selected_device.model)
        self.device_brand_var.set(self.selected_device.brand)
        self.device_codename_var.set(self.selected_device.codename)
        self.device_serial_var.set(self.selected_device.serial)
        self.system_android_version_var.set(self.selected_device.android_version)
        self.system_bl_status_var.set(self.selected_device.bootloader_status)
        self.system_slot_var.set(self.selected_device.current_slot)
        self.system_kernel_var.set(self.selected_device.kernel_version[:50] + "..." if self.selected_device.kernel_version else "Unknown")
    
    def update_root_status(self):
        """更新Root状态显示"""
        if self.selected_device:
            if self.selected_device.root_checked:
                self.root_status_var.set("已Root ✓" if self.selected_device.has_root else "未Root")
            else:
                self.root_status_var.set("")
    
    def update_fastboot_device_info(self):
        """更新Fastboot设备信息"""
        if not self.selected_device:
            return
        info = f"序列号: {self.selected_device.serial}\n"
        info += f"设备代号: {self.selected_device.codename}\n"
        info += f"BL状态: {self.selected_device.bootloader_status}\n"
        info += f"当前槽位: {self.selected_device.current_slot}\n"
        if self.selected_device.max_download_size:
            try:
                size_bytes = int(self.selected_device.max_download_size)
                size_mb = size_bytes / (1024 * 1024)
                info += f"最大下载大小: {size_mb:.0f}MB\n"
            except:
                info += f"最大下载大小: {self.selected_device.max_download_size}\n"
        info += f"分区数量: {len(self.selected_device.partitions)}\n"
        info += f"前10个分区: {', '.join(self.selected_device.partitions[:10])}"
        if len(self.selected_device.partitions) > 10:
            info += "..."
        self.fb_info_text.delete(1.0, tk.END)
        self.fb_info_text.insert(1.0, info)
        self.bl_status_label.config(
            text=f"Bootloader: {self.selected_device.bootloader_status}",
            foreground="green" if self.selected_device.bootloader_status == "Unlocked" else "red")
        if self.selected_device.partitions:
            self.partition_combo['values'] = self.selected_device.partitions
            self.partition_combo.set(self.selected_device.partitions[0])
    
    def clear_device_info(self):
        """清空设备信息"""
        for attr in ['device_name', 'device_brand', 'device_codename', 'device_serial',
                     'system_android_version', 'system_bl_status', 'system_slot', 'system_kernel']:
            var = getattr(self, f"{attr}_var", None)
            if var:
                var.set("无设备")
    
    def copy_to_clipboard(self, text):
        """复制文本到剪贴板"""
        self.root.clipboard_clear()
        self.root.clipboard_append(text)
        self.update_status("已复制到剪贴板")
    
    def check_root_once(self, device):
        """只检查一次root状态"""
        if device.serial not in self.root_checked_devices and not device.root_checked:
            self.update_status("正在检查Root状态...")
            device.has_root = ADBManager.check_root(device.serial)
            device.root_checked = True
            self.root_checked_devices.add(device.serial)
    
    def refresh_device_status(self):
        """刷新设备状态"""
        if not self.selected_device:
            messagebox.showwarning("警告", "请先选择设备")
            return
        
        def get_status():
            serial = self.selected_device.serial
            info = []
            
            code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell dumpsys battery")
            if code == 0:
                battery_data = {}
                for line in output.split('\n'):
                    line = line.strip()
                    if ':' in line:
                        key, value = line.split(':', 1)
                        key = key.strip()
                        value = value.strip()
                        battery_data[key] = value
                
                info.append(f"电量: {battery_data.get('level', 'N/A')}%")
                
                temp_val = battery_data.get('temperature', '0')
                try:
                    info.append(f"电池温度: {int(temp_val) / 10}°C")
                except:
                    pass
                
                status_map = {'1': '未知', '2': '充电中', '3': '放电中', '4': '未充电', '5': '已充满'}
                info.append(f"充电状态: {status_map.get(battery_data.get('status', '0'), '未知')}")
                
                health_map = {'1': '未知', '2': '良好', '3': '过热', '4': '损坏', '5': '过压', '6': '故障', '7': '冷却'}
                info.append(f"电池健康: {health_map.get(battery_data.get('health', '0'), '未知')}")
            
            code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell cat /proc/cpuinfo | grep -i 'hardware' | head -1")
            if code == 0 and output.strip():
                info.append(f"CPU: {output.split(':')[-1].strip()}")
            
            code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell wm size")
            if code == 0:
                match = re.search(r'(\d+x\d+)', output)
                if match:
                    info.append(f"屏幕分辨率: {match.group(1)}")
            
            code, output, _ = ADBManager.execute_command(
                f"adb -s {serial} shell cat /proc/meminfo | grep -E 'MemTotal|MemAvailable'")
            if code == 0:
                for line in output.split('\n'):
                    if 'MemTotal' in line:
                        info.append(f"总内存: {line.split(':')[1].strip()}")
                    if 'MemAvailable' in line:
                        info.append(f"可用内存: {line.split(':')[1].strip()}")
            
            code, output, _ = ADBManager.execute_command(f"adb -s {serial} shell df -h /data")
            if code == 0:
                for line in output.strip().split('\n')[1:]:
                    if '/data' in line and not '/data/' in line:
                        parts = line.split()
                        if len(parts) >= 4:
                            info.append(f"存储空间: 总量{parts[1]} 已用{parts[2]} 可用{parts[3]}")
                            break
            
            info.append("Root权限: 已获取 ✓" if self.selected_device.has_root else "Root权限: 未获取")
            
            self.root.after(0, lambda: self.update_status_text(info))
        
        threading.Thread(target=get_status, daemon=True).start()
    
    def update_status_text(self, info):
        """更新状态文本"""
        self.status_text.delete(1.0, tk.END)
        self.status_text.insert(1.0, '\n'.join(info))
    
    # ========== 操作功能 ==========
    
    def take_screenshot(self):
        if not self.selected_device:
            messagebox.showwarning("警告", "请先选择设备"); return
        self.update_status("正在截图...")
        def capture():
            serial = self.selected_device.serial
            temp_path = os.path.join(os.environ.get('TEMP', '/tmp'), 'screenshot.png')
            if ADBManager.execute_command(f"adb -s {serial} shell screencap -p /sdcard/screenshot.png")[0] == 0:
                code, output, _ = ADBManager.execute_command(f"adb -s {serial} pull /sdcard/screenshot.png \"{temp_path}\"")
                if code == 0 and os.path.exists(temp_path):
                    self.root.after(0, lambda: self.show_screenshot(temp_path))
                    ADBManager.execute_command(f"adb -s {serial} shell rm /sdcard/screenshot.png")
                else:
                    self.root.after(0, lambda: messagebox.showerror("错误", "截图拉取失败"))
            else:
                self.root.after(0, lambda: messagebox.showerror("错误", "截图失败"))
        threading.Thread(target=capture, daemon=True).start()
    
    def show_screenshot(self, image_path):
        if self.screenshot_window: self.screenshot_window.destroy()
        self.screenshot_window = tk.Toplevel(self.root)
        self.screenshot_window.title("屏幕截图")
        try:
            img = Image.open(image_path); img.thumbnail((800, 600))
            photo = ImageTk.PhotoImage(img)
            label = ttk.Label(self.screenshot_window, image=photo); label.image = photo; label.pack()
            self.current_screenshot_path = image_path
        except Exception as e:
            messagebox.showerror("错误", f"无法显示截图: {e}")
    
    def save_screenshot(self):
        if hasattr(self, 'current_screenshot_path') and self.current_screenshot_path and os.path.exists(self.current_screenshot_path):
            save_path = filedialog.asksaveasfilename(title="保存截图", defaultextension=".png", filetypes=[("PNG files", "*.png"), ("All files", "*.*")])
            if save_path:
                shutil.copy(self.current_screenshot_path, save_path)
                messagebox.showinfo("成功", f"截图已保存到: {save_path}")
        else:
            messagebox.showwarning("警告", "请先截取屏幕")
    
    def push_file(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        file_path = filedialog.askopenfilename(title="选择要推送的文件")
        if not file_path: return
        dest_path = simpledialog.askstring("目标路径", "输入设备上的目标路径:", initialvalue="/sdcard/")
        if not dest_path: return
        self.run_command_with_result(f"adb -s {self.selected_device.serial} push \"{file_path}\" \"{dest_path}\"", "推送文件")
    
    def pull_file(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        src_path = simpledialog.askstring("源路径", "输入设备上的文件路径:", initialvalue="/sdcard/")
        if not src_path: return
        save_path = filedialog.asksaveasfilename(title="保存文件到")
        if not save_path: return
        self.run_command_with_result(f"adb -s {self.selected_device.serial} pull \"{src_path}\" \"{save_path}\"", "拉取文件")
    
    def list_processes(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        self.run_command_with_result(f"adb -s {self.selected_device.serial} shell ps", "进程列表")
    
    def kill_process_dialog(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        pid = simpledialog.askstring("结束进程", "输入进程PID:")
        if pid: self.run_command_with_result(f"adb -s {self.selected_device.serial} shell kill {pid}", f"结束进程 {pid}")
    
    def force_stop_app_dialog(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        code, output, _ = ADBManager.execute_command(f"adb -s {self.selected_device.serial} shell pm list packages")
        if code != 0: messagebox.showerror("错误", "无法获取应用列表"); return
        packages = sorted([line.split(':')[1].strip() for line in output.split('\n') if line.startswith('package:')])
        dialog = tk.Toplevel(self.root); dialog.title("强制停止应用"); dialog.geometry("500x400")
        search_frame = ttk.Frame(dialog); search_frame.pack(fill=tk.X, padx=10, pady=5)
        ttk.Label(search_frame, text="搜索:").pack(side=tk.LEFT, padx=5)
        search_var = tk.StringVar(); ttk.Entry(search_frame, textvariable=search_var, width=30).pack(side=tk.LEFT, padx=5)
        listbox = tk.Listbox(dialog); listbox.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        def update_list(*args):
            search_text = search_var.get().lower(); listbox.delete(0, tk.END)
            for pkg in packages:
                if search_text in pkg.lower(): listbox.insert(tk.END, pkg)
        search_var.trace('w', update_list); update_list()
        def force_stop():
            selection = listbox.curselection()
            if selection:
                pkg = listbox.get(selection[0])
                self.run_command_with_result(f"adb -s {self.selected_device.serial} shell am force-stop {pkg}", f"强制停止 {pkg}")
                dialog.destroy()
        ttk.Button(dialog, text="强制停止", command=force_stop).pack(pady=10)
    
    def mock_battery(self, mode):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        if mode == "charge": self.run_command_with_result(f"adb -s {self.selected_device.serial} shell dumpsys battery set ac 1", "充电伪装")
    
    def mock_battery_dialog(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        level = simpledialog.askinteger("电量伪装", "输入电量百分比:")
        if level is not None: self.run_command_with_result(f"adb -s {self.selected_device.serial} shell dumpsys battery set level {level}", f"电量伪装 {level}%")
    
    def mock_temperature_dialog(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        temp = simpledialog.askinteger("温度伪装", "输入电池温度 (°C):")
        if temp is not None: self.run_command_with_result(f"adb -s {self.selected_device.serial} shell dumpsys battery set temperature {temp * 10}", f"温度伪装 {temp}°C")
    
    def reset_battery(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        self.run_command_with_result(f"adb -s {self.selected_device.serial} shell dumpsys battery reset", "还原电量设置")
    
    def capture_logs(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        save_path = filedialog.asksaveasfilename(title="保存日志文件", defaultextension=".txt", filetypes=[("Text files", "*.txt"), ("All files", "*.*")])
        if save_path: self.run_command_with_result(f"adb -s {self.selected_device.serial} logcat -d > \"{save_path}\"", "抓取日志")
    
    def reboot_device(self, target):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        self.run_command_with_result(f"adb -s {self.selected_device.serial} reboot {target}".strip(), "重启操作")
    
    def simulate_key(self, keycode):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        self.run_command_silent(f"adb -s {self.selected_device.serial} shell input keyevent {keycode}", f"模拟按键 {keycode}")
    
    def open_notifications(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        self.run_command_silent(f"adb -s {self.selected_device.serial} shell cmd statusbar expand-notifications", "打开通知栏")
    
    def install_app(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        file_path = filedialog.askopenfilename(title="选择APK文件", filetypes=[("APK files", "*.apk"), ("All files", "*.*")])
        if not file_path: return
        allow_downgrade = messagebox.askyesno("降级安装", "是否允许降级安装？")
        cmd = f"adb -s {self.selected_device.serial} install {'-d ' if allow_downgrade else ''}\"{file_path}\""
        self.run_command_with_result(cmd, "安装应用")
    
    def uninstall_app_dialog(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        def fetch_apps():
            code1, user_output, _ = ADBManager.execute_command(f"adb -s {self.selected_device.serial} shell pm list packages -3")
            code2, system_output, _ = ADBManager.execute_command(f"adb -s {self.selected_device.serial} shell pm list packages -s")
            if code1 != 0 and code2 != 0: self.root.after(0, lambda: messagebox.showerror("错误", "无法获取应用列表")); return
            apps = []
            if code1 == 0 and user_output:
                for line in user_output.split('\n'):
                    if line.startswith('package:'): apps.append((line.split(':')[1].strip(), False))
            if code2 == 0 and system_output:
                for line in system_output.split('\n'):
                    if line.startswith('package:'): apps.append((line.split(':')[1].strip(), True))
            apps.sort(key=lambda x: (x[1], x[0].lower()))
            self.root.after(0, lambda: self.show_uninstall_dialog(apps))
        threading.Thread(target=fetch_apps, daemon=True).start()
    
    def show_uninstall_dialog(self, apps):
        dialog = tk.Toplevel(self.root); dialog.title("选择要卸载的应用"); dialog.geometry("600x500")
        search_frame = ttk.Frame(dialog); search_frame.pack(fill=tk.X, padx=10, pady=5)
        ttk.Label(search_frame, text="搜索:").pack(side=tk.LEFT, padx=5)
        search_var = tk.StringVar(); ttk.Entry(search_frame, textvariable=search_var, width=30).pack(side=tk.LEFT, padx=5)
        list_frame = ttk.Frame(dialog); list_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        scrollbar = ttk.Scrollbar(list_frame); scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        listbox = tk.Listbox(list_frame, yscrollcommand=scrollbar.set); listbox.pack(fill=tk.BOTH, expand=True)
        scrollbar.config(command=listbox.yview)
        def update_list(*args):
            search_text = search_var.get().lower(); listbox.delete(0, tk.END)
            for pkg, is_system in apps:
                if search_text in pkg.lower(): listbox.insert(tk.END, f"{'📱 ' if not is_system else '⚙️ '}{pkg}")
        search_var.trace('w', update_list); update_list()
        button_frame = ttk.Frame(dialog); button_frame.pack(fill=tk.X, padx=10, pady=10)
        def uninstall(keep_data=False):
            selection = listbox.curselection()
            if not selection: messagebox.showwarning("警告", "请选择应用"); return
            pkg_name = listbox.get(selection[0]).split(' ', 1)[-1] if ' ' in listbox.get(selection[0]) else listbox.get(selection[0])
            cmd = f"adb -s {self.selected_device.serial} shell cmd package uninstall -k {pkg_name}" if keep_data else f"adb -s {self.selected_device.serial} uninstall {pkg_name}"
            self.run_command_with_result(cmd, "卸载应用"); dialog.destroy()
        ttk.Button(button_frame, text="完全卸载", command=lambda: uninstall(False)).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="保留数据卸载", command=lambda: uninstall(True)).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="取消", command=dialog.destroy).pack(side=tk.RIGHT, padx=5)
    
    def freeze_app_dialog(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        code, output, _ = ADBManager.execute_command(f"adb -s {self.selected_device.serial} shell pm list packages")
        if code != 0: messagebox.showerror("错误", "无法获取应用列表"); return
        packages = sorted([line.split(':')[1].strip() for line in output.split('\n') if line.startswith('package:')])
        dialog = tk.Toplevel(self.root); dialog.title("冻结/解冻应用"); dialog.geometry("500x400")
        search_frame = ttk.Frame(dialog); search_frame.pack(fill=tk.X, padx=10, pady=5)
        ttk.Label(search_frame, text="搜索:").pack(side=tk.LEFT, padx=5)
        search_var = tk.StringVar(); ttk.Entry(search_frame, textvariable=search_var, width=30).pack(side=tk.LEFT, padx=5)
        listbox = tk.Listbox(dialog); listbox.pack(fill=tk.BOTH, expand=True, padx=10, pady=5)
        def update_list(*args):
            search_text = search_var.get().lower(); listbox.delete(0, tk.END)
            for pkg in packages:
                if search_text in pkg.lower(): listbox.insert(tk.END, pkg)
        search_var.trace('w', update_list); update_list()
        def freeze():
            selection = listbox.curselection()
            if selection:
                self.run_command_with_result(f"adb -s {self.selected_device.serial} shell pm disable-user {listbox.get(selection[0])}", "冻结应用")
                dialog.destroy()
        def unfreeze():
            selection = listbox.curselection()
            if selection:
                self.run_command_with_result(f"adb -s {self.selected_device.serial} shell pm enable {listbox.get(selection[0])}", "解冻应用")
                dialog.destroy()
        btn_frame = ttk.Frame(dialog); btn_frame.pack(pady=10)
        ttk.Button(btn_frame, text="冻结", command=freeze).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="解冻", command=unfreeze).pack(side=tk.LEFT, padx=5)
    
    def fastboot_command(self, command):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        self.run_command_with_result(f"fastboot -s {self.selected_device.serial} {command}", "Fastboot操作")
    
    def flash_partition(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        if self.selected_device.bootloader_status != "Unlocked": messagebox.showerror("错误", "Bootloader未解锁，无法刷入分区"); return
        partition = self.partition_var.get()
        if not partition: messagebox.showwarning("警告", "请输入或选择分区名"); return
        file_path = filedialog.askopenfilename(title=f"选择{partition}镜像文件", filetypes=[("IMG files", "*.img"), ("All files", "*.*")])
        if not file_path: return
        file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
        if file_size_mb > 100:
            if not messagebox.askyesno("大文件提示", f"镜像文件大小为 {file_size_mb:.1f}MB\n\n刷入大文件可能需要先擦除分区。\n是否继续？"): return
        cmd = f"fastboot -s {self.selected_device.serial} flash {partition} \"{file_path}\""
        self.run_command_with_fastboot_fix(cmd, f"刷入{partition}分区", partition, file_path)
    
    def run_command_with_fastboot_fix(self, cmd, operation_name, partition, file_path):
        self.update_status(f"正在{operation_name}...")
        def run():
            code, output, error = ADBManager.execute_command_with_pipe(cmd, timeout=120)
            result = f"命令: {cmd}\n\n退出码: {code}\n\n"
            if output: result += f"输出:\n{output}\n\n"
            if error: result += f"错误:\n{error}"
            if code != 0 and "upload request failed" in output.lower():
                self.root.after(0, lambda: self.show_result(result + "\n\n正在尝试修复：先擦除分区再刷入...", operation_name + " (失败，尝试修复)"))
                erase_cmd = f"fastboot -s {self.selected_device.serial} erase {partition}"
                erase_code, erase_output, erase_error = ADBManager.execute_command_with_pipe(erase_cmd, timeout=60)
                if erase_code == 0:
                    flash_code, flash_output, flash_error = ADBManager.execute_command_with_pipe(cmd, timeout=120)
                    final_result = f"擦除命令: {erase_cmd}\n擦除退出码: {erase_code}\n\n重新刷入:\n命令: {cmd}\n退出码: {flash_code}\n"
                    if flash_output: final_result += f"输出:\n{flash_output}\n\n"
                    if flash_error: final_result += f"错误:\n{flash_error}"
                    final_result += "\n✓ 修复成功！分区已成功刷入。" if flash_code == 0 else "\n✗ 修复失败。"
                    self.root.after(0, lambda: self.show_result(final_result, operation_name + " - 修复结果"))
                else:
                    self.root.after(0, lambda: self.show_result(f"擦除也失败了:\n命令: {erase_cmd}\n退出码: {erase_code}\n错误: {erase_error}", operation_name + " - 修复失败"))
            else:
                self.root.after(0, lambda: self.show_result(result, operation_name))
            self.root.after(0, lambda: self.update_status(f"{operation_name} - 完成"))
        threading.Thread(target=run, daemon=True).start()
    
    def erase_partition(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        if self.selected_device.bootloader_status != "Unlocked": messagebox.showerror("错误", "Bootloader未解锁，无法擦除分区"); return
        partition = self.partition_var.get()
        if not partition: messagebox.showwarning("警告", "请输入或选择分区名"); return
        if not messagebox.askyesno("确认", f"确认要擦除{partition}分区吗？此操作不可逆！"): return
        self.run_command_with_result(f"fastboot -s {self.selected_device.serial} erase {partition}", f"擦除{partition}分区")
    
    def format_partition(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        if self.selected_device.bootloader_status != "Unlocked": messagebox.showerror("错误", "Bootloader未解锁，无法格式化分区"); return
        partition = self.partition_var.get()
        if not partition: messagebox.showwarning("警告", "请输入或选择分区名"); return
        if not messagebox.askyesno("确认", f"确认要格式化{partition}分区吗？此操作不可逆！"): return
        self.run_command_with_result(f"fastboot -s {self.selected_device.serial} format {partition}", f"格式化{partition}分区")
    
    def select_boot_image(self):
        file_path = filedialog.askopenfilename(title="选择启动镜像文件", filetypes=[("IMG files", "*.img"), ("All files", "*.*")])
        if file_path: self.boot_image_path.set(file_path)
    
    def boot_image(self):
        if not self.selected_device: messagebox.showwarning("警告", "请先选择设备"); return
        if self.selected_device.bootloader_status != "Unlocked": messagebox.showerror("错误", "Bootloader未解锁，无法临时启动"); return
        image_path = self.boot_image_path.get()
        if not image_path: messagebox.showwarning("警告", "请选择镜像文件"); return
        if not os.path.exists(image_path): messagebox.showerror("错误", "镜像文件不存在"); return
        self.run_command_with_result(f"fastboot -s {self.selected_device.serial} boot \"{image_path}\"", "临时启动")
    
    def clear_shell_output(self, mode):
        if mode == "adb" and hasattr(self, 'adb_shell_output'): self.adb_shell_output.delete(1.0, tk.END)
        elif mode == "fastboot" and hasattr(self, 'fb_shell_output'): self.fb_shell_output.delete(1.0, tk.END)
    
    def execute_shell_command(self, mode):
        if mode == "adb":
            cmd = self.adb_shell_cmd_entry.get().strip(); output_widget = self.adb_shell_output
        else:
            cmd = self.fb_shell_cmd_entry.get().strip(); output_widget = self.fb_shell_output
        if not cmd: return
        full_cmd = f"{mode} -s {self.selected_device.serial} {cmd}" if self.selected_device and self.current_mode.get() == mode else f"{mode} {cmd}"
        output_widget.insert(tk.END, f"\n>>> {full_cmd}\n")
        self.update_status(f"正在执行: {full_cmd}")
        def run():
            code, output, error = ADBManager.execute_command_with_pipe(full_cmd, timeout=60)
            def update_ui():
                if output: output_widget.insert(tk.END, output)
                if error: output_widget.insert(tk.END, f"错误:\n{error}")
                output_widget.insert(tk.END, f"退出码: {code}\n\n")
                output_widget.see(tk.END)
                self.update_status("命令执行完成")
            self.root.after(0, update_ui)
        threading.Thread(target=run, daemon=True).start()
        if mode == "adb": self.adb_shell_cmd_entry.delete(0, tk.END)
        else: self.fb_shell_cmd_entry.delete(0, tk.END)
    
    def run_command_silent(self, cmd, operation_name):
        self.update_status(f"正在{operation_name}...")
        def run():
            code, output, error = ADBManager.execute_command(cmd)
            def update_ui():
                if code == 0: self.update_status(f"{operation_name} - 成功")
                else: self.update_status(f"{operation_name} - 失败"); self.show_result(f"命令: {cmd}\n退出码: {code}\n输出: {output}\n错误: {error}", operation_name)
            self.root.after(0, update_ui)
        threading.Thread(target=run, daemon=True).start()
    
    def run_command_with_result(self, cmd, operation_name):
        self.update_status(f"正在{operation_name}...")
        def run():
            code, output, error = ADBManager.execute_command_with_pipe(cmd)
            result = f"命令: {cmd}\n\n退出码: {code}\n\n"
            if output: result += f"输出:\n{output}\n\n"
            if error: result += f"错误:\n{error}"
            self.root.after(0, lambda: self.show_result(result, operation_name))
            self.root.after(0, lambda: self.update_status(f"{operation_name} - 完成"))
        threading.Thread(target=run, daemon=True).start()
    
    def show_result(self, result, operation_name):
        dialog = tk.Toplevel(self.root); dialog.title(f"{operation_name} - 结果"); dialog.geometry("600x400")
        text = scrolledtext.ScrolledText(dialog); text.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        text.insert(1.0, result); text.config(state=tk.DISABLED)
        ttk.Button(dialog, text="关闭", command=dialog.destroy).pack(pady=10)
    
    def auto_refresh(self):
        self.refresh_devices()
        self.root.after(5000, self.auto_refresh)

# ========== 主程序入口 ==========

def main():
    root = tk.Tk()
    app = FlashToolGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()