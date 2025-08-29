
    function goBackOrHome() {
        // 获取当前页面的URL
        var currentPageUrl = window.location.href;

        // 获取上一个页面的URL
        var referrer = document.referrer;

        // 假设主界面的URL是 http://your-main-page-url.com
        var mainPageUrl = '/index.html';

        // 检查当前页面是否是主界面
        if (currentPageUrl === mainPageUrl) {
            // 如果当前页面已经是主界面，则直接刷新主界面
            window.location.href = mainPageUrl;
        } else if (referrer && referrer.includes(mainPageUrl)) {
            // 如果是从主界面跳转的，使用浏览器的后退功能
            window.history.back();
        } else {
            // 如果不是从主界面跳转的，直接跳转到主界面
            window.location.href = mainPageUrl;
        }
    }
