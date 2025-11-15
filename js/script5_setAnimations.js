document.addEventListener('DOMContentLoaded', function () {
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
        animationToggle.addEventListener('change', function () {
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
        setTimeout(function () {
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
    
    // 在DOMContentLoaded事件监听器中添加这部分代码
    const animationSpeedSelect = document.getElementById('animationSpeed');
    const savedSpeed = localStorage.getItem('animationSpeed') || '1';
    if(animationSpeedSelect){
        animationSpeedSelect.value = savedSpeed;
    }
    
    // 应用初始动画速度
    applyAnimationSpeed(parseFloat(savedSpeed));
    
    if(animationSpeedSelect){
        // 监听速度选择变化
        animationSpeedSelect.addEventListener('change', function() {
            const speed = parseFloat(this.value);
            localStorage.setItem('animationSpeed', speed);
            applyAnimationSpeed(speed);
        });
    }

    // 应用动画速度的函数 - 修改为使用CSS变量控制所有动画
    function applyAnimationSpeed(speed) {
        // 创建或更新全局CSS变量
        let style = document.getElementById('animation-speed-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'animation-speed-style';
            document.head.appendChild(style);
        }
        
        // 设置CSS变量来控制所有动画和过渡的持续时间
        style.innerHTML = `
            :root {
                --animation-speed-modifier: ${speed};
            }
            
            * {
                animation-duration: calc(var(--original-animation-duration, 1s) * var(--animation-speed-modifier, 1)) !important;
                animation-delay: calc(var(--original-animation-delay, 0s) * var(--animation-speed-modifier, 1)) !important;
                transition-duration: calc(var(--original-transition-duration, 0.3s) * var(--animation-speed-modifier, 1)) !important;
                transition-delay: calc(var(--original-transition-delay, 0s) * var(--animation-speed-modifier, 1)) !important;
            }
        `;
        
        // 为所有元素设置原始值（如果尚未设置）
        document.querySelectorAll('*').forEach(element => {
            const style = window.getComputedStyle(element);
            
            if (!element.hasAttribute('data-original-animation-duration')) {
                element.setAttribute('data-original-animation-duration', style.animationDuration);
            }
            
            if (!element.hasAttribute('data-original-animation-delay')) {
                element.setAttribute('data-original-animation-delay', style.animationDelay);
            }
            
            if (!element.hasAttribute('data-original-transition-duration')) {
                element.setAttribute('data-original-transition-duration', style.transitionDuration);
            }
            
            if (!element.hasAttribute('data-original-transition-delay')) {
                element.setAttribute('data-original-transition-delay', style.transitionDelay);
            }
        });
        
        // 同时应用到iframe中的动画
        const previewIframe = document.getElementById('Preview');
        if (previewIframe && previewIframe.contentWindow) {
            try {
                const iframeDoc = previewIframe.contentWindow.document;
                
                // 在iframe中创建相同的CSS变量
                let iframeStyle = iframeDoc.getElementById('animation-speed-style');
                if (!iframeStyle) {
                    iframeStyle = iframeDoc.createElement('style');
                    iframeStyle.id = 'animation-speed-style';
                    iframeDoc.head.appendChild(iframeStyle);
                }
                
                iframeStyle.innerHTML = `
                    :root {
                        --animation-speed-modifier: ${1/speed};
                    }
                    
                    * {
                        animation-duration: calc(var(--original-animation-duration, 1s) * var(--animation-speed-modifier, 1)) !important;
                        animation-delay: calc(var(--original-animation-delay, 0s) * var(--animation-speed-modifier, 1)) !important;
                        transition-duration: calc(var(--original-transition-duration, 0.3s) * var(--animation-speed-modifier, 1)) !important;
                        transition-delay: calc(var(--original-transition-delay, 0s) * var(--animation-speed-modifier, 1)) !important;
                    }
                `;
                
                // 为iframe中的所有元素设置原始值
                iframeDoc.querySelectorAll('*').forEach(element => {
                    const style = previewIframe.contentWindow.getComputedStyle(element);
                    
                    if (!element.hasAttribute('data-original-animation-duration')) {
                        element.setAttribute('data-original-animation-duration', style.animationDuration);
                    }
                    
                    if (!element.hasAttribute('data-original-animation-delay')) {
                        element.setAttribute('data-original-animation-delay', style.animationDelay);
                    }
                    
                    if (!element.hasAttribute('data-original-transition-duration')) {
                        element.setAttribute('data-original-transition-duration', style.transitionDuration);
                    }
                    
                    if (!element.hasAttribute('data-original-transition-delay')) {
                        element.setAttribute('data-original-transition-delay', style.transitionDelay);
                    }
                });
            } catch (e) {
                console.log('无法访问iframe中的动画:', e);
            }
        }
    }
    
    // 监听DOM变化，确保新添加的元素也能应用动画速度
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                const speed = parseFloat(localStorage.getItem('animationSpeed') || '1');
                applyAnimationSpeed(speed);
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});