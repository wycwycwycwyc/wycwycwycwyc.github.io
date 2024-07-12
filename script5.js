document.addEventListener('DOMContentLoaded', function() {
    var animationToggle = document.getElementById('animationToggle');

    // 从 localStorage 中获取设置，如果没有设置则默认启用动画
    var isAnimationEnabled = localStorage.getItem('animation');
    if (isAnimationEnabled === null) {
        isAnimationEnabled = true;
        localStorage.setItem('animation', 'enabled');
    } else {
        isAnimationEnabled = isAnimationEnabled === 'enabled';
    }

    // 初始化设置
    if (animationToggle) {
        animationToggle.checked = isAnimationEnabled;
        toggleAnimations(isAnimationEnabled);

        // 切换动画
        animationToggle.addEventListener('change', function() {
            isAnimationEnabled = animationToggle.checked;
            localStorage.setItem('animation', isAnimationEnabled ? 'enabled' : 'disabled');
            toggleAnimations(isAnimationEnabled);
        });
    } else {
        // 如果没有找到开关元素，直接根据 localStorage 设置动画状态
        toggleAnimations(isAnimationEnabled);
    }

    function toggleAnimations(enable) {
        if (!enable) {
            disableAllTransitionsAndAnimations();
        } else {
            enableAllTransitionsAndAnimations();
        }
    }

    function disableAllTransitionsAndAnimations() {
        let style = document.getElementById('disable-animations-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'disable-animations-style';
            style.innerHTML = `
                * {
                    animation: none !important;
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        // 保留需要执行的代码
        setTimeout(function() {
            var ripple = document.querySelector('.ripple');
            if (ripple) {
                ripple.style.opacity = '0';
            }
        }, 0);
    }

    function enableAllTransitionsAndAnimations() {
        let style = document.getElementById('disable-animations-style');
        if (style) {
            style.remove();
        }
    }
});