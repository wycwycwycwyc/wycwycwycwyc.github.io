document.addEventListener('DOMContentLoaded', function() {
    var opacitySelect = document.getElementById('opacitySelect');

    // 从 localStorage 中获取透明度设置
    var selectedOpacity = localStorage.getItem('opacity') || '0.3';
    var isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // 如果找不到ID为opacitySelect的元素，则直接根据localStorage设置透明度
    if (!opacitySelect) {
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
    var elements = document.querySelectorAll('th, table, thead, .bottom-bar, #busuanzi-container, #tips, #time');

    if (elements.length === 0) {
        return;
    }

    elements.forEach(function(element) {
        if (isDarkMode) {
            element.style.backgroundColor = `rgba(16, 16, 16, ${opacity})`;
        } if (!isDarkMode) {
            element.style.backgroundColor = `rgba(242, 242, 242, ${opacity})`;
        }
    });

var blurSelect = document.getElementById('blurSelect');

// 从 localStorage 中获取模糊度设置
var selectedBlur = localStorage.getItem('blur') || '5px'; // 默认值改为像素单位
var isDarkMode = localStorage.getItem('darkMode') === 'enabled';

// 如果找不到ID为blurSelect的元素，则直接根据localStorage设置模糊度
if (!blurSelect) {
    setElementsBlur(selectedBlur, isDarkMode);
    return;
}

// 初始化模糊度设置
blurSelect.value = selectedBlur.replace('px', ''); // 存储时去掉px单位
setElementsBlur(selectedBlur, isDarkMode);

// 监听模糊度选择的变化
blurSelect.addEventListener('change', function() {
    selectedBlur = blurSelect.value + 'px'; // 添加px单位
    localStorage.setItem('blur', selectedBlur);
    setElementsBlur(selectedBlur, isDarkMode);
});

function setElementsBlur(blur, isDarkMode) {
    var elements = document.querySelectorAll('th, table, thead, .bottom-bar, #busuanzi-container, #tips, #time');

    if (elements.length === 0) {
        return;
    }

    elements.forEach(function(element) {
        // 设置模糊效果
        element.style.backdropFilter = `blur(${blur})`;
        element.style.webkitBackdropFilter = `blur(${blur})`; // 为了兼容Safari

    });
}}