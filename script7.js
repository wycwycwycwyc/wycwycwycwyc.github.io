document.addEventListener('DOMContentLoaded', function() {
    var opacitySelect = document.getElementById('opacitySelect');

    // 从 localStorage 中获取透明度设置
    var selectedOpacity = localStorage.getItem('opacity') || '0.8';
    var isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // 如果找不到ID为opacitySelect的元素，则直接根据localStorage设置透明度
    if (!opacitySelect) {
        console.log('opacitySelect 元素未找到，直接根据 localStorage 设置透明度');
        setElementsOpacity(selectedOpacity, isDarkMode);
        return;
    }

    // 初始化透明度设置
    opacitySelect.value = selectedOpacity;
    setElementsOpacity(selectedOpacity, isDarkMode);

    // 监听透明度选择的变化
    opacitySelect.addEventListener('change', function() {
        selectedOpacity = opacitySelect.value;
        localStorage.setItem('opacity', selectedOpacity);
        setElementsOpacity(selectedOpacity, isDarkMode);
    });
});

function setElementsOpacity(opacity, isDarkMode) {
    var elements = document.querySelectorAll('th, td, table, thead, .bottom-bar, #busuanzi-container, #tips, #time');

    if (elements.length === 0) {
        console.log('未找到任何匹配的元素');
        return;
    }

    elements.forEach(function(element) {
        if (isDarkMode) {
            element.style.backgroundColor = `rgba(16, 16, 16, ${opacity})`;
        } if (!isDarkMode) {
            element.style.backgroundColor = `rgba(242, 242, 242, ${opacity})`;
        }
        console.log(`设置 ${element.tagName} 元素的背景颜色为 ${element.style.backgroundColor}`);
    });
}