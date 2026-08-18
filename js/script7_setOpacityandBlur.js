document.addEventListener('DOMContentLoaded', function() {
    var opacitySelect = document.getElementById('opacitySelect');
    var blurSelect = document.getElementById('blurSelect');

    // 从 localStorage 中获取设置
    var selectedOpacity = localStorage.getItem('opacity') || '0.3';
    var selectedBlur = localStorage.getItem('blur') || '5';
    var isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // 初始化设置
    if (opacitySelect) {
        opacitySelect.value = selectedOpacity;
    }
    if (blurSelect) {
        blurSelect.value = selectedBlur.replace('px', '');
    }

    // 设置现有元素的样式
    setElementsStyle(selectedOpacity, selectedBlur + 'px', isDarkMode);

    // 监听透明度选择的变化
    if (opacitySelect) {
        opacitySelect.addEventListener('change', function() {
            selectedOpacity = opacitySelect.value;
            localStorage.setItem('opacity', selectedOpacity);
            setElementsStyle(selectedOpacity, selectedBlur + 'px', isDarkMode);
        });
    }

    // 监听模糊度选择的变化
    if (blurSelect) {
        blurSelect.addEventListener('change', function() {
            selectedBlur = blurSelect.value + 'px';
            localStorage.setItem('blur', selectedBlur);
            setElementsStyle(selectedOpacity, selectedBlur, isDarkMode);
        });
    }

    // 使用MutationObserver监听DOM变化，只对新添加的元素应用样式
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        if (isTargetElement(node)) {
                            applyStyleToElement(node, selectedOpacity, selectedBlur + 'px', isDarkMode);
                        }
                        if (window.location.pathname.includes('settings.html') || 
                            window.location.href.includes('settings.html')) {
                            return;
                        }
                        const targetElements = node.querySelectorAll('th, table, thead, .bottom-bar, #busuanzi-container, #tips, #time, #searchbox');
                        targetElements.forEach(function(element) {
                            applyStyleToElement(element, selectedOpacity, selectedBlur + 'px', isDarkMode);
                        });
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

function isTargetElement(element) {
    if (window.location.pathname.includes('settings.html') || 
        window.location.href.includes('settings.html')) {
        return;
    }
    const targetSelectors = ['th', 'table', 'thead', '.bottom-bar', '#busuanzi-container', '#tips', '#time', '#searchBox'];
    return targetSelectors.some(selector => {
        if (selector.startsWith('.') && element.classList.contains(selector.slice(1))) {
            return true;
        }
        if (selector.startsWith('#') && element.id === selector.slice(1)) {
            return true;
        }
        return element.tagName.toLowerCase() === selector;
    });
}

function applyStyleToElement(element, opacity, blur, isDarkMode) {
    if (isDarkMode) {
        element.style.backgroundColor = `rgba(16, 16, 16, ${opacity})`;
    } else {
        element.style.backgroundColor = `rgba(242, 242, 242, ${opacity})`;
    }
    
    element.style.backdropFilter = `blur(${blur})`;
    element.style.webkitBackdropFilter = `blur(${blur})`;
}

function setElementsStyle(opacity, blur, isDarkMode) {
    if (window.location.pathname.includes('settings.html') || 
        window.location.href.includes('settings.html')) {
        return;
    }
    var elements = document.querySelectorAll('th, table, thead, .bottom-bar, #busuanzi-container, #tips, #time, #searchBox');

    if (elements.length === 0) {
        return;
    }

    elements.forEach(function(element) {
        applyStyleToElement(element, opacity, blur, isDarkMode);
    });
}