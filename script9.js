document.addEventListener('DOMContentLoaded', function() {
    // 获取之前保存的亮度值
    const savedBrightness = localStorage.getItem('brightness');
    const defaultBrightness = savedBrightness !== null ? savedBrightness : 1; // 默认值为1

    // 获取元素
    const brightnessRange = document.getElementById('brightnessRange');
    const brightnessNumber = document.getElementById('brightnessNumber');

    // 创建并添加 brightness-overlay 元素
    const brightnessOverlay = document.createElement('div');
    brightnessOverlay.classList.add('brightness-overlay');
    document.body.appendChild(brightnessOverlay);

    // 设置初始亮度
    brightnessOverlay.style.opacity = 1 - defaultBrightness;

    // 如果存在亮度调节控件，则设置初始值并添加事件监听器
    if (brightnessRange && brightnessNumber) {
        brightnessRange.value = defaultBrightness * 100;
        brightnessNumber.value = defaultBrightness * 100;

        brightnessRange.addEventListener('input', function() {
            const brightness = brightnessRange.value;
            brightnessNumber.value = brightness;
            brightnessOverlay.style.opacity = 1 - brightness / 100;
            localStorage.setItem('brightness', brightness / 100);
        });

        brightnessNumber.addEventListener('input', function() {
            let brightness = brightnessNumber.value;

            // 限制输入的字符长度为3个
            if (brightness.length > 3) {
                brightness = brightness.slice(0, 3);
            }

            // 确保输入值在0到100之间
            if (brightness < 0) brightness = 0;
            if (brightness > 100) brightness = 100;

            // 确保输入的数字不能以0开头，除非是0本身
            if (brightness.length > 1 && brightness.startsWith('0')) {
                brightness = brightness.slice(1);
            }

            brightnessNumber.value = brightness;
            brightnessRange.value = brightness;
            brightnessOverlay.style.opacity = 1 - brightness / 100;
            localStorage.setItem('brightness', brightness / 100);
        });
    }
});