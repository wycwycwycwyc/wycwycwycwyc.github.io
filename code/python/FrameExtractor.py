import cv2
import os
import threading
import time
import queue
from queue import Queue, Empty
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageTk
import numpy as np
from concurrent.futures import ThreadPoolExecutor, as_completed

class VideoFrameExtractor:
    def __init__(self, root):
        self.root = root
        self.root.title("多线程视频帧提取器")
        self.root.geometry("850x750")
        
        # 设置样式
        self.setup_styles()
        
        # 视频信息
        self.video_path = ""
        self.video_info = {}
        self.is_extracting = False
        self.stop_extraction = False
        self.is_paused = False
        self.progress_queue = Queue()
        
        # 线程相关
        self.thread_count = 4
        self.frame_queue = queue.Queue(maxsize=100)  # 限制队列大小，避免内存占用过多
        self.active_workers = 0
        
        # 性能统计
        self.start_time = 0
        self.total_frames_processed = 0
        self.total_frames_saved = 0
        self.read_frames_count = 0
        
        # 创建界面
        self.create_widgets()
        
        # 开始更新进度
        self.update_progress()
        
    def setup_styles(self):
        """设置样式"""
        style = ttk.Style()
        style.theme_use('clam')
        
        # 自定义颜色
        self.bg_color = "#f0f0f0"
        self.accent_color = "#2196F3"
        self.success_color = "#4CAF50"
        self.error_color = "#f44336"
        self.warning_color = "#FF9800"
        self.pause_color = "#FFC107"
        
        self.root.configure(bg=self.bg_color)
        
    def create_widgets(self):
        """创建界面组件"""
        # 主框架
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # 标题
        title_label = ttk.Label(
            main_frame, 
            text="多线程视频帧提取器", 
            font=("微软雅黑", 24, "bold"),
            foreground=self.accent_color
        )
        title_label.grid(row=0, column=0, columnspan=3, pady=(0, 20))
        
        # 视频选择部分
        video_frame = ttk.LabelFrame(main_frame, text="视频文件选择", padding="10")
        video_frame.grid(row=1, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        
        self.video_path_var = tk.StringVar()
        video_entry = ttk.Entry(video_frame, textvariable=self.video_path_var, width=80)
        video_entry.grid(row=0, column=0, padx=(0, 10), sticky=(tk.W, tk.E))
        
        browse_btn = ttk.Button(
            video_frame, 
            text="选择视频文件", 
            command=self.select_video_file,
            width=15
        )
        browse_btn.grid(row=0, column=1)
        
        # 视频信息显示
        info_frame = ttk.LabelFrame(main_frame, text="视频信息", padding="10")
        info_frame.grid(row=2, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # 使用Text组件显示视频信息
        self.info_text = tk.Text(info_frame, height=6, width=100, state=tk.DISABLED)
        self.info_text.grid(row=0, column=0, columnspan=2)
        
        # 配置标签
        scrollbar = ttk.Scrollbar(info_frame, command=self.info_text.yview)
        scrollbar.grid(row=0, column=2, sticky=(tk.N, tk.S))
        self.info_text.configure(yscrollcommand=scrollbar.set)
        
        # 提取设置部分
        settings_frame = ttk.LabelFrame(main_frame, text="提取设置", padding="10")
        settings_frame.grid(row=3, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # 第一行：输出路径
        ttk.Label(settings_frame, text="输出文件夹:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.output_path_var = tk.StringVar()
        output_entry = ttk.Entry(settings_frame, textvariable=self.output_path_var, width=50)
        output_entry.grid(row=0, column=1, padx=(10, 5), pady=5, sticky=(tk.W, tk.E))
        
        output_btn = ttk.Button(
            settings_frame, 
            text="选择输出路径", 
            command=self.select_output_folder,
            width=15
        )
        output_btn.grid(row=0, column=2, pady=5)
        
        # 第二行：输出格式和线程数
        ttk.Label(settings_frame, text="输出格式:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.format_var = tk.StringVar(value="jpg")
        format_combo = ttk.Combobox(
            settings_frame, 
            textvariable=self.format_var, 
            values=["jpg", "png", "bmp", "tiff"],
            state="readonly",
            width=10
        )
        format_combo.grid(row=1, column=1, padx=10, pady=5, sticky=tk.W)
        
        ttk.Label(settings_frame, text="线程数量:").grid(row=1, column=2, sticky=tk.W, pady=5, padx=(20, 0))
        self.thread_var = tk.IntVar(value=self.thread_count)
        thread_spinbox = ttk.Spinbox(
            settings_frame,
            from_=1,
            to=32,
            textvariable=self.thread_var,
            width=8,
            state="readonly"
        )
        thread_spinbox.grid(row=1, column=3, padx=(5, 0), pady=5, sticky=tk.W)
        
        # 第三行：帧间隔和图像质量
        ttk.Label(settings_frame, text="帧提取间隔:").grid(row=2, column=0, sticky=tk.W, pady=5)
        frame_interval_frame = ttk.Frame(settings_frame)
        frame_interval_frame.grid(row=2, column=1, padx=10, pady=5, sticky=tk.W)
        
        self.frame_skip_var = tk.IntVar(value=1)
        frame_skip_entry = ttk.Entry(frame_interval_frame, textvariable=self.frame_skip_var, width=8)
        frame_skip_entry.grid(row=0, column=0)
        ttk.Label(frame_interval_frame, text="(1表示提取每一帧)").grid(row=0, column=1, padx=(5, 0))
        
        ttk.Label(settings_frame, text="JPG质量 (1-100):").grid(row=2, column=2, sticky=tk.W, pady=5, padx=(20, 0))
        self.quality_var = tk.IntVar(value=95)
        quality_scale = ttk.Scale(
            settings_frame, 
            from_=1, 
            to=100, 
            variable=self.quality_var,
            orient=tk.HORIZONTAL,
            length=150
        )
        quality_scale.grid(row=2, column=3, padx=5, pady=5, sticky=tk.W)
        self.quality_label = ttk.Label(settings_frame, text="95")
        self.quality_label.grid(row=2, column=4, pady=5, padx=(0, 10))
        
        # 绑定质量变化事件
        self.quality_var.trace("w", self.update_quality_label)
        
        # 内存使用显示
        memory_frame = ttk.LabelFrame(main_frame, text="内存与队列状态", padding="10")
        memory_frame.grid(row=4, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        
        self.memory_labels = {}
        memory_grid = [
            ("帧队列:", "queue_label", "空闲"),
            ("内存使用:", "memory_label", "低"),
            ("读取状态:", "read_label", "等待"),
            ("处理状态:", "process_label", "等待")
        ]
        
        for i, (label_text, key, default_value) in enumerate(memory_grid):
            ttk.Label(memory_frame, text=label_text, font=("微软雅黑", 9)).grid(
                row=i//2, column=(i%2)*2, sticky=tk.W, pady=5, padx=(0, 5)
            )
            self.memory_labels[key] = ttk.Label(
                memory_frame, 
                text=default_value,
                font=("微软雅黑", 9, "bold")
            )
            # 设置初始颜色
            if key == "queue_label":
                self.memory_labels[key].config(foreground=self.success_color)
            elif key == "memory_label":
                self.memory_labels[key].config(foreground=self.success_color)
            else:
                self.memory_labels[key].config(foreground=self.accent_color)
                
            self.memory_labels[key].grid(
                row=i//2, column=(i%2)*2+1, sticky=tk.W, pady=5
            )
        
        # 进度条和状态显示
        progress_frame = ttk.LabelFrame(main_frame, text="提取进度", padding="10")
        progress_frame.grid(row=5, column=0, columnspan=3, sticky=(tk.W, tk.E), pady=(0, 10))
        
        # 进度条
        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(
            progress_frame, 
            variable=self.progress_var,
            maximum=100,
            length=750,
            mode='determinate'
        )
        self.progress_bar.grid(row=0, column=0, columnspan=4, pady=(0, 10))
        
        # 状态标签
        self.status_label = ttk.Label(
            progress_frame, 
            text="等待开始...",
            font=("微软雅黑", 10)
        )
        self.status_label.grid(row=1, column=0, sticky=tk.W, padx=(0, 20))
        
        # 时间估算
        self.time_label = ttk.Label(progress_frame, text="预计剩余时间: --")
        self.time_label.grid(row=1, column=1, padx=20)
        
        # 已处理帧数
        self.frame_count_label = ttk.Label(progress_frame, text="已处理: 0 / 0")
        self.frame_count_label.grid(row=1, column=2, padx=20)
        
        # 线程使用情况
        self.thread_usage_label = ttk.Label(progress_frame, text="线程: 0/0 活跃")
        self.thread_usage_label.grid(row=1, column=3, sticky=tk.E)
        
        # 按钮框架
        button_frame = ttk.Frame(main_frame)
        button_frame.grid(row=6, column=0, columnspan=3, pady=(10, 0))
        
        # 开始按钮
        self.start_button = ttk.Button(
            button_frame,
            text="开始提取",
            command=self.start_extraction,
            width=18
        )
        self.start_button.grid(row=0, column=0, padx=(0, 10))
        
        # 暂停/继续按钮
        self.pause_button = ttk.Button(
            button_frame,
            text="暂停",
            command=self.toggle_pause,
            width=18,
            state=tk.DISABLED
        )
        self.pause_button.grid(row=0, column=1, padx=5)
        
        # 停止按钮
        self.stop_button = ttk.Button(
            button_frame,
            text="停止提取",
            command=self.stop_extraction_process,
            width=18,
            state=tk.DISABLED
        )
        self.stop_button.grid(row=0, column=2, padx=5)
        
        # 预览按钮
        self.preview_button = ttk.Button(
            button_frame,
            text="预览第一帧",
            command=self.preview_first_frame,
            width=18
        )
        self.preview_button.grid(row=0, column=3, padx=(10, 0))
        
        # 配置网格权重
        for child in main_frame.winfo_children():
            child.grid_configure(padx=5, pady=5)
            
        # 设置列权重
        for i in range(3):
            main_frame.columnconfigure(i, weight=1)
    
    def update_quality_label(self, *args):
        """更新质量标签"""
        self.quality_label.config(text=str(self.quality_var.get()))
    
    def select_video_file(self):
        """选择视频文件"""
        filetypes = [
            ("视频文件", "*.mp4 *.avi *.mov *.mkv *.flv *.wmv *.mpeg *.mpg"),
            ("MP4文件", "*.mp4"),
            ("AVI文件", "*.avi"),
            ("所有文件", "*.*")
        ]
        
        filename = filedialog.askopenfilename(
            title="选择视频文件",
            filetypes=filetypes
        )
        
        if filename:
            self.video_path_var.set(filename)
            self.load_video_info(filename)
    
    def load_video_info(self, video_path):
        """加载视频信息"""
        try:
            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                messagebox.showerror("错误", "无法打开视频文件！")
                return
            
            # 获取视频信息
            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            duration = total_frames / fps if fps > 0 else 0
            
            # 根据视频大小建议线程数
            suggested_threads = self.suggest_thread_count(total_frames, width * height)
            self.thread_var.set(suggested_threads)
            
            # 保存视频信息
            self.video_info = {
                'path': video_path,
                'fps': fps,
                'total_frames': total_frames,
                'width': width,
                'height': height,
                'duration': duration
            }
            
            # 在文本框中显示信息
            info_text = f"文件路径: {video_path}\n"
            info_text += f"分辨率: {width} × {height}\n"
            info_text += f"帧率: {fps:.2f} FPS\n"
            info_text += f"总帧数: {total_frames:,}\n"
            info_text += f"时长: {self.format_duration(duration)}\n"
            info_text += f"建议线程数: {suggested_threads} (已自动设置)"
            
            self.info_text.config(state=tk.NORMAL)
            self.info_text.delete(1.0, tk.END)
            self.info_text.insert(1.0, info_text)
            self.info_text.config(state=tk.DISABLED)
            
            # 设置默认输出路径
            if not self.output_path_var.get():
                video_name = os.path.splitext(os.path.basename(video_path))[0]
                default_output = os.path.join(os.path.dirname(video_path), f"{video_name}_frames")
                self.output_path_var.set(default_output)
            
            cap.release()
            
        except Exception as e:
            messagebox.showerror("错误", f"读取视频信息时出错:\n{str(e)}")
    
    def suggest_thread_count(self, total_frames, frame_size):
        """根据视频大小和帧数建议线程数"""
        # 获取CPU核心数
        try:
            import multiprocessing
            cpu_count = multiprocessing.cpu_count()
        except:
            cpu_count = 4
        
        # 根据视频大小调整线程数
        if total_frames < 100:
            return min(2, cpu_count)
        elif total_frames < 1000:
            return min(4, cpu_count)
        elif total_frames < 10000:
            return min(8, cpu_count)
        elif frame_size > 1920*1080:  # 高清视频
            return min(4, cpu_count)  # 高清视频用较少线程避免内存不足
        else:
            return min(cpu_count * 2, 32)
    
    def format_duration(self, seconds):
        """格式化时间显示"""
        if seconds <= 0:
            return "未知"
        
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        
        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{secs:02d}"
        else:
            return f"{minutes:02d}:{secs:02d}"
    
    def select_output_folder(self):
        """选择输出文件夹"""
        folder = filedialog.askdirectory(title="选择输出文件夹")
        if folder:
            self.output_path_var.set(folder)
    
    def preview_first_frame(self):
        """预览视频第一帧"""
        if not self.video_path_var.get():
            messagebox.showwarning("警告", "请先选择视频文件！")
            return
        
        try:
            cap = cv2.VideoCapture(self.video_path_var.get())
            ret, frame = cap.read()
            
            if ret:
                # 调整图像大小以适应预览窗口
                height, width = frame.shape[:2]
                max_size = 800
                if width > max_size or height > max_size:
                    if width > height:
                        new_width = max_size
                        new_height = int(height * (max_size / width))
                    else:
                        new_height = max_size
                        new_width = int(width * (max_size / height))
                    
                    frame = cv2.resize(frame, (new_width, new_height))
                
                # 转换颜色空间
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # 创建预览窗口
                preview_window = tk.Toplevel(self.root)
                preview_window.title("视频第一帧预览")
                preview_window.geometry(f"{frame.shape[1]}x{frame.shape[0]+50}")
                
                # 转换为PIL图像
                image = Image.fromarray(frame)
                photo = ImageTk.PhotoImage(image)
                
                # 显示图像
                label = ttk.Label(preview_window, image=photo)
                label.image = photo  # 保持引用
                label.pack(padx=10, pady=10)
                
                # 显示信息
                info_label = ttk.Label(
                    preview_window, 
                    text=f"原始尺寸: {self.video_info.get('width', 0)} × {self.video_info.get('height', 0)}",
                    font=("微软雅黑", 9)
                )
                info_label.pack(pady=(0, 10))
            
            cap.release()
            
        except Exception as e:
            messagebox.showerror("错误", f"预览视频帧时出错:\n{str(e)}")
    
    def start_extraction(self):
        """开始提取帧"""
        # 验证输入
        if not self.video_path_var.get():
            messagebox.showwarning("警告", "请先选择视频文件！")
            return
        
        if not self.output_path_var.get():
            messagebox.showwarning("警告", "请选择输出文件夹！")
            return
        
        if not os.path.exists(self.video_path_var.get()):
            messagebox.showerror("错误", "视频文件不存在！")
            return
        
        # 验证线程数
        thread_count = self.thread_var.get()
        if thread_count < 1 or thread_count > 32:
            messagebox.showerror("错误", "线程数必须在1-32之间！")
            return
        
        # 创建输出文件夹
        output_folder = self.output_path_var.get()
        try:
            if not os.path.exists(output_folder):
                os.makedirs(output_folder)
        except Exception as e:
            messagebox.showerror("错误", f"创建输出文件夹失败:\n{str(e)}")
            return
        
        # 重置状态
        self.is_extracting = True
        self.stop_extraction = False
        self.is_paused = False
        self.progress_var.set(0)
        self.start_button.config(state=tk.DISABLED)
        self.pause_button.config(state=tk.NORMAL)
        self.stop_button.config(state=tk.NORMAL)
        self.preview_button.config(state=tk.DISABLED)
        
        # 清空队列
        while not self.frame_queue.empty():
            try:
                self.frame_queue.get_nowait()
            except queue.Empty:
                break
        
        # 重置统计信息
        self.start_time = time.time()
        self.total_frames_processed = 0
        self.total_frames_saved = 0
        self.read_frames_count = 0
        self.active_workers = 0
        
        # 在独立线程中开始提取
        extraction_thread = threading.Thread(
            target=self.extract_frames_pipeline,
            daemon=True
        )
        extraction_thread.start()
    
    def extract_frames_pipeline(self):
        """流水线式提取帧 - 读取和处理同时进行"""
        video_path = self.video_path_var.get()
        output_folder = self.output_path_var.get()
        frame_skip = self.frame_skip_var.get()
        output_format = self.format_var.get()
        quality = self.quality_var.get()
        thread_count = self.thread_var.get()
        
        try:
            # 打开视频
            cap = cv2.VideoCapture(video_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            if total_frames <= 0:
                self.progress_queue.put(('error', '无法获取视频帧数'))
                return
            
            # 更新状态
            self.progress_queue.put(('status', f'开始流水线提取 (使用{thread_count}个线程)...'))
            self.progress_queue.put(('frames', (0, total_frames)))
            self.progress_queue.put(('thread_usage', f'线程: 0/{thread_count} 活跃'))
            self.memory_labels['read_label'].config(text="读取中", foreground=self.accent_color)
            self.memory_labels['process_label'].config(text="准备中", foreground=self.accent_color)
            
            # 启动工作线程
            self.worker_threads = []
            for i in range(thread_count):
                worker = threading.Thread(
                    target=self.worker_function,
                    args=(output_folder, output_format, quality, i+1),
                    daemon=True
                )
                worker.start()
                self.worker_threads.append(worker)
            
            # 生产者：读取视频帧
            frame_index = 0
            saved_index = 0
            
            while True:
                # 检查是否停止
                if self.stop_extraction:
                    break
                
                # 如果暂停，等待
                while self.is_paused and not self.stop_extraction:
                    time.sleep(0.1)
                    self.progress_queue.put(('status', '已暂停...'))
                
                if self.stop_extraction:
                    break
                
                # 读取一帧
                ret, frame = cap.read()
                if not ret:
                    break
                
                # 根据帧间隔判断是否处理
                if frame_index % frame_skip == 0:
                    # 等待队列有空间（避免内存占用过多）
                    while self.frame_queue.qsize() > 50 and not self.stop_extraction:
                        time.sleep(0.01)
                    
                    if self.stop_extraction:
                        break
                    
                    # 添加到队列
                    self.frame_queue.put({
                        'index': saved_index,
                        'frame': frame.copy(),
                        'frame_num': frame_index
                    })
                    saved_index += 1
                
                frame_index += 1
                self.read_frames_count = frame_index
                
                # 更新读取进度
                read_progress = (frame_index / total_frames) * 40  # 读取占40%进度
                self.progress_queue.put(('progress', read_progress))
                
                # 每100帧更新一次状态
                if frame_index % 100 == 0:
                    self.progress_queue.put(('status', f'已读取 {frame_index:,}/{total_frames:,} 帧'))
                    self.memory_labels['queue_label'].config(
                        text=f"{self.frame_queue.qsize()}/100", 
                        foreground=self.warning_color if self.frame_queue.qsize() > 80 else self.success_color
                    )
            
            # 读取完成，等待所有工作线程完成
            cap.release()
            self.memory_labels['read_label'].config(text="读取完成", foreground=self.success_color)
            
            # 添加结束标记到队列
            for _ in range(thread_count):
                self.frame_queue.put(None)  # None表示结束标记
            
            # 等待所有工作线程完成
            for worker in self.worker_threads:
                worker.join(timeout=5)
            
            # 完成提取
            if not self.stop_extraction:
                self.progress_queue.put(('progress', 100))
                self.progress_queue.put(('status', f'提取完成！共保存 {self.total_frames_saved:,} 帧'))
                self.progress_queue.put(('frames', (total_frames, total_frames)))
                self.progress_queue.put(('time', '完成'))
                self.progress_queue.put(('thread_usage', f'线程: 0/{thread_count} 活跃'))
                
                # 显示完成信息
                elapsed_time = time.time() - self.start_time
                avg_fps = self.total_frames_processed / elapsed_time if elapsed_time > 0 else 0
                
                self.root.after(0, lambda: messagebox.showinfo(
                    "完成", 
                    f"视频帧提取完成！\n\n"
                    f"共保存 {self.total_frames_saved:,} 张图片\n"
                    f"输出文件夹: {output_folder}\n"
                    f"使用线程数: {thread_count}\n"
                    f"平均速度: {avg_fps:.1f} 帧/秒\n"
                    f"总用时: {self.format_duration(elapsed_time)}"
                ))
            
        except Exception as e:
            self.progress_queue.put(('error', f'提取过程中出错: {str(e)}'))
        
        finally:
            # 更新按钮状态
            self.progress_queue.put(('done', None))
    
    def worker_function(self, output_folder, output_format, quality, worker_id):
        """工作线程函数"""
        self.active_workers += 1
        
        while True:
            # 检查是否停止
            if self.stop_extraction:
                break
            
            # 如果暂停，等待
            while self.is_paused and not self.stop_extraction:
                time.sleep(0.1)
            
            if self.stop_extraction:
                break
            
            try:
                # 从队列获取任务，设置超时避免死锁
                task = self.frame_queue.get(timeout=0.1)
                
                # None表示结束标记
                if task is None:
                    self.frame_queue.task_done()
                    break
                
                # 处理任务
                frame_data = task['frame']
                idx = task['index']
                frame_num = task['frame_num']
                
                # 生成文件名
                filename = f"frame_{idx + 1:06d}.{output_format}"
                filepath = os.path.join(output_folder, filename)
                
                # 保存图像
                try:
                    if output_format.lower() == 'jpg':
                        cv2.imwrite(filepath, frame_data, [int(cv2.IMWRITE_JPEG_QUALITY), quality])
                    elif output_format.lower() == 'png':
                        cv2.imwrite(filepath, frame_data, [cv2.IMWRITE_PNG_COMPRESSION, 3])
                    else:
                        cv2.imwrite(filepath, frame_data)
                    
                    # 更新统计
                    with threading.Lock():
                        self.total_frames_saved += 1
                        self.total_frames_processed += 1
                    
                    # 更新进度
                    if self.total_frames_processed % 10 == 0:
                        elapsed_time = time.time() - self.start_time
                        if elapsed_time > 0:
                            fps = self.total_frames_processed / elapsed_time
                            self.progress_queue.put(('fps', f"{fps:.1f}"))
                        
                        # 计算总体进度（读取40% + 处理60%）
                        total_frames = self.video_info.get('total_frames', 1)
                        read_progress = min(self.read_frames_count / total_frames * 40, 40)
                        process_progress = min(self.total_frames_processed / (self.read_frames_count + 1) * 60, 60)
                        total_progress = read_progress + process_progress
                        
                        self.progress_queue.put(('progress', total_progress))
                        self.progress_queue.put(('frames', (self.total_frames_processed, total_frames)))
                        
                        # 更新队列状态
                        queue_size = self.frame_queue.qsize()
                        self.memory_labels['queue_label'].config(
                            text=f"{queue_size}/100", 
                            foreground=self.warning_color if queue_size > 80 else self.success_color
                        )
                        
                        # 更新内存使用状态
                        memory_status = "高" if queue_size > 80 else "中" if queue_size > 50 else "低"
                        self.memory_labels['memory_label'].config(
                            text=memory_status,
                            foreground=self.warning_color if queue_size > 80 else self.success_color
                        )
                        
                        self.memory_labels['process_label'].config(text="运行中", foreground=self.success_color)
                
                except Exception as e:
                    self.progress_queue.put(('error', f'工作线程{worker_id}保存帧 {idx} 时出错: {str(e)}'))
                
                finally:
                    self.frame_queue.task_done()
                    # 释放内存
                    del frame_data
            
            except queue.Empty:
                # 队列为空，继续等待
                continue
            except Exception as e:
                self.progress_queue.put(('error', f'工作线程{worker_id}出错: {str(e)}'))
                break
        
        self.active_workers -= 1
    
    def toggle_pause(self):
        """暂停/继续提取"""
        if self.is_extracting:
            self.is_paused = not self.is_paused
            
            if self.is_paused:
                self.pause_button.config(text="继续")
                self.status_label.config(text="已暂停", foreground=self.pause_color)
                self.memory_labels['read_label'].config(text="已暂停", foreground=self.pause_color)
                self.memory_labels['process_label'].config(text="已暂停", foreground=self.pause_color)
            else:
                self.pause_button.config(text="暂停")
                self.status_label.config(text="继续提取...", foreground=self.accent_color)
                self.memory_labels['read_label'].config(text="读取中", foreground=self.accent_color)
                self.memory_labels['process_label'].config(text="运行中", foreground=self.success_color)
    
    def stop_extraction_process(self):
        """停止提取过程"""
        if self.is_extracting:
            self.stop_extraction = True
            self.status_label.config(text="正在停止...", foreground=self.warning_color)
    
    def update_progress(self):
        """更新进度显示"""
        try:
            while not self.progress_queue.empty():
                msg_type, data = self.progress_queue.get_nowait()
                
                if msg_type == 'progress':
                    self.progress_var.set(data)
                elif msg_type == 'status':
                    self.status_label.config(text=data)
                    self.status_label.config(foreground=self.accent_color)
                elif msg_type == 'frames':
                    current, total = data
                    self.frame_count_label.config(text=f"已处理: {current:,} / {total:,}")
                elif msg_type == 'time':
                    self.time_label.config(text=f"预计剩余时间: {data}")
                elif msg_type == 'thread_usage':
                    self.thread_usage_label.config(text=data)
                elif msg_type == 'fps':
                    # 更新FPS显示
                    pass
                elif msg_type == 'error':
                    self.status_label.config(text=f"错误: {data}", foreground=self.error_color)
                    messagebox.showerror("错误", data)
                    self.reset_extraction_state()
                elif msg_type == 'done':
                    self.reset_extraction_state()
                    self.memory_labels['read_label'].config(text="等待", foreground=self.accent_color)
                    self.memory_labels['process_label'].config(text="等待", foreground=self.accent_color)
                    self.memory_labels['queue_label'].config(text="空闲", foreground=self.success_color)
                    self.memory_labels['memory_label'].config(text="低", foreground=self.success_color)
        
        except Exception:
            pass
        
        # 更新活跃线程数显示
        if self.is_extracting and hasattr(self, 'worker_threads'):
            active_count = self.active_workers
            total_count = self.thread_var.get()
            self.thread_usage_label.config(text=f"线程: {active_count}/{total_count} 活跃")
        
        # 更新已用时间
        if self.is_extracting and not self.stop_extraction:
            elapsed_time = time.time() - self.start_time
            # 更新到统计标签
            pass
        
        # 继续检查更新
        self.root.after(100, self.update_progress)
    
    def reset_extraction_state(self):
        """重置提取状态"""
        self.is_extracting = False
        self.stop_extraction = False
        self.is_paused = False
        self.start_button.config(state=tk.NORMAL)
        self.pause_button.config(state=tk.DISABLED)
        self.pause_button.config(text="暂停")
        self.stop_button.config(state=tk.DISABLED)
        self.preview_button.config(state=tk.NORMAL)
        self.status_label.config(foreground=self.accent_color)

def main():
    root = tk.Tk()
    app = VideoFrameExtractor(root)
    
    # 使窗口可调整大小
    root.columnconfigure(0, weight=1)
    root.rowconfigure(0, weight=1)
    
    # 设置窗口最小尺寸
    root.minsize(880, 800)
    
    root.mainloop()

if __name__ == "__main__":
    main()