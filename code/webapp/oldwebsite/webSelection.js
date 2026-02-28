document.addEventListener('DOMContentLoaded', function () {    
(function () {
      // 相当于外部的 script.js 文件
      // 深色模式: 不需要切换功能，但可以识别外部已经添加的dark-mode类 (body上)
      // 我们仅处理按钮跳转，以及可能额外的动画/日志。

      // 获取两个按钮
      const firstBtn = document.getElementById('firstUploadBtn');
      const stableBtn = document.getElementById('stableVersionBtn');

      // 跳转函数 (保留一点淡出效果——模拟动画跳转)
      function navigateTo(path) {
        // 增加微小的延迟，让点击反馈动画更明显，同时不失去功能
        // 但为了流畅体验，直接跳转也可以。这里加入一点怀旧淡出感
        document.body.style.transition = 'opacity 0.15s';
        document.body.style.opacity = '0.7';
        setTimeout(() => {
          window.location.href = path;   // 跳转到指定路径
        }, 100);
        // 可选：如果页面卸载前可以保留opacity，但无所谓
      }

      // 为两个按钮绑定点击事件
      if (firstBtn) {
        firstBtn.addEventListener('click', function (e) {
          e.preventDefault();  // 防止任何默认(按钮无默认行为，仅作保险)
          // 可以加一点自定义点击动画 (按钮自身已带有:active)
          const path = firstBtn.getAttribute('data-path');  // /firstUpload
          navigateTo(path);
        });
      }

      if (stableBtn) {
        stableBtn.addEventListener('click', function (e) {
          e.preventDefault();
          const path = stableBtn.getAttribute('data-path');  // /stableVersion
          navigateTo(path);
        });
      }
  })();
});