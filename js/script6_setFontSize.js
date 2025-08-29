document.addEventListener('DOMContentLoaded', function() {
    var fontSizeSelect = document.getElementById('fontSizeSelect');

    // 从 localStorage 中获取设置
    var fontSize = localStorage.getItem('fontSize') || 'medium';

    // 初始化设置
    setFontSize(fontSize);

    // 如果存在 fontSizeSelect 元素，则添加事件监听器
    if (fontSizeSelect) {
        fontSizeSelect.value = fontSize;

        // 切换字体大小
        fontSizeSelect.addEventListener('change', function() {
            fontSize = fontSizeSelect.value;
            localStorage.setItem('fontSize', fontSize);
            setFontSize(fontSize);
        });
    }

    // 设置所有元素的字体大小
function setFontSize(size) {
    var fontSize, h1Size, h2Size, h3Size, codeFontSize, pFontSize;
    switch (size) {
        case 'small':
            fontSize = '12px';
            h1Size = '24px';
            h2Size = '20px';
            h3Size = '18px';
            codeFontSize = '10px'; // 设置<pre>和<code>的大小
            pFontSize = '12px'; // 设置<p>的大小
            break;
        case 'large':
            fontSize = '18px';
            h1Size = '36px';
            h2Size = '30px';
            h3Size = '24px';
            codeFontSize = '16px'; // 设置<pre>和<code>的大小
            pFontSize = '18px'; // 设置<p>的大小
            break;
        case 'x-large': // 处理特大选项
            fontSize = '24px';
            h1Size = '48px';
            h2Size = '36px';
            h3Size = '30px';
            codeFontSize = '22px'; // 设置<pre>和<code>的大小
            pFontSize = '24px'; // 设置<p>的大小
            break;
        case 'medium':
        default:
            fontSize = '16px';
            h1Size = '32px';
            h2Size = '24px';
            h3Size = '20px';
            codeFontSize = '14px'; // 设置<pre>和<code>的大小
            pFontSize = '16px'; // 设置<p>的大小
            break;
    }
        document.querySelectorAll('body, p, a, span, div').forEach(function(element) {
            element.style.fontSize = fontSize;
        });
        document.querySelectorAll('h1').forEach(function(element) {
            element.style.fontSize = h1Size;
        });
        document.querySelectorAll('h2').forEach(function(element) {
            element.style.fontSize = h2Size;
        });
        document.querySelectorAll('h3').forEach(function(element) {
            element.style.fontSize = h3Size;
        });

        // 设置<pre>和<code>的大小
        document.querySelectorAll('pre, code').forEach(function(element) {
            element.style.fontSize = codeFontSize;
        });
    }
});