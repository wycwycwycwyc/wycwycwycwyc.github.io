document.addEventListener('DOMContentLoaded', function() {
    // 检查用户的登录状态
    function checkLoginStatus() {
        // 假设用户的登录状态存储在localStorage中，键名为'isLoggedIn'
        var isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        return isLoggedIn;
    }

    document.getElementById('downloadSourceCodeBtn').addEventListener('click', function () {
        if (checkLoginStatus()) {
            // 用户已登录，提供下载链接
            var code = document.getElementById("sourceCode").innerText;
            var blob = new Blob([code], { type: "text/plain;charset=utf-8" });
            var filename = document.title + ".txt"; // 使用页面标题命名
            saveAs(blob, filename);
        } else {
            // 用户未登录，重定向到登录页面
            window.location.href = 'Login.html'; // 替换为您的登录页面URL
        }
    });
});