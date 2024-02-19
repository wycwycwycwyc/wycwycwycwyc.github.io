document.addEventListener('DOMContentLoaded', function() {
    // 获取URL中的查询参数
    var urlParams = new URLSearchParams(window.location.search);

    // 检查是否有'theme'参数
    var theme = urlParams.get('theme');

    // 根据查询参数设置深色或浅色模式
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (theme === 'light') {
        document.body.classList.remove('dark-mode');
    }

    // 初始化深色模式
    var isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
        // 执行深色模式的初始化代码
    }
});