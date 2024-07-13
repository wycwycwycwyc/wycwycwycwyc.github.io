document.addEventListener('DOMContentLoaded', function() {
    var eyeCareToggle = document.getElementById('eyeCareToggle');
    var eyeCareOverlay = document.createElement('div');
    eyeCareOverlay.className = 'eye-care-overlay';
    document.body.appendChild(eyeCareOverlay);

    // 从 localStorage 中获取护眼模式设置
    var isEyeCareEnabled = localStorage.getItem('eyeCareMode') === 'enabled';

    // 初始化护眼模式
    if (eyeCareToggle) {
        eyeCareToggle.checked = isEyeCareEnabled;
    }
    eyeCareOverlay.style.display = isEyeCareEnabled ? 'block' : 'none';

    // 切换护眼模式
    if (eyeCareToggle) {
        eyeCareToggle.addEventListener('change', function() {
            isEyeCareEnabled = eyeCareToggle.checked;
            localStorage.setItem('eyeCareMode', isEyeCareEnabled ? 'enabled' : 'disabled');
            eyeCareOverlay.style.display = isEyeCareEnabled ? 'block' : 'none';
        });
    }
});