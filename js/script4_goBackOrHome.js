function goBackOrHome() {
    // 获取当前页面的URL（用于判断是否为首页）
    var currentPageUrl = window.location.href;
    
    // 获取上一个页面的URL
    var referrer = document.referrer;
    
    // 定义主界面URL（根据您的实际情况调整）
    var mainPageUrl = '/index.html';
    
    // 获取当前网站的主域名（用于判断来源是否为本站）
    var currentDomain = window.location.hostname;
    
    // 如果当前页面已经是主界面，直接刷新或不做处理
    if (currentPageUrl === mainPageUrl || currentPageUrl.endsWith(mainPageUrl)) {
        window.location.href = mainPageUrl;
        return;
    }
    
    // 判断来源是否为本站
    // 如果有来源页面，并且来源页面的域名与当前域名相同
    if (referrer) {
        try {
            var referrerUrl = new URL(referrer);
            var referrerDomain = referrerUrl.hostname;
            
            // 如果来源域名和当前域名相同（说明是从本站页面跳转过来的）
            if (referrerDomain === currentDomain) {
                // 后退到上一页
                window.history.back();
                return;
            }
        } catch (e) {
            // 如果解析URL失败（某些浏览器可能限制），则默认跳转到主页
            console.warn('无法解析来源URL:', e);
        }
    }
    
    // 如果不是从本站跳转过来的，或者没有来源页面，跳转到主页
    window.location.href = mainPageUrl;
}