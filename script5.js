// script.js

document.addEventListener('DOMContentLoaded', function() {
    var animationToggle = document.getElementById('animationToggle');

    // 从 localStorage 中获取设置
    var isAnimationEnabled = localStorage.getItem('animation') === 'enabled';

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
            document.body.appendChild(style);
        }
    }

    function enableAllTransitionsAndAnimations() {
        let style = document.getElementById('disable-animations-style');
        if (style) {
            style.remove();
        }
    }
});