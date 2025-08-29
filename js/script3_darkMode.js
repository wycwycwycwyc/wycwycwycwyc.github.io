document.addEventListener('DOMContentLoaded', function() {

    var isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    // 根据查询参数设置深色或浅色模式
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

});