document.addEventListener('DOMContentLoaded', function () {
    var isGlowEnabled = localStorage.getItem('glowEnabled') === 'true';

    // 检查是否存在发光效果开关
    var glowToggle = document.getElementById('glowToggle');
    if (glowToggle) {
        glowToggle.checked = isGlowEnabled;
    }

    // 根据 localStorage 设置应用发光效果
    if (isGlowEnabled) {
        document.body.classList.add('glow-effect');
    } else {
        document.body.classList.remove('glow-effect');
    }

    // 如果存在发光效果开关，则添加事件监听器
    if (glowToggle) {
        glowToggle.addEventListener('change', function () {
            var isNowEnabled = this.checked;
            localStorage.setItem('glowEnabled', isNowEnabled);
            if (isNowEnabled) {
                document.body.classList.add('glow-effect');
            } else {
                document.body.classList.remove('glow-effect');
            }
        });
    }
});