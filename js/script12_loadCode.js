document.addEventListener('DOMContentLoaded', function () {
    // 检查用户的登录状态
    function checkLoginStatus() {
        var isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        return isLoggedIn;
    }

    // 获取URL参数
    function getUrlParameter(name) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(window.location.href);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // 自动下载函数 - 修改为下载file参数指定的文件
    function autoDownload() {
        if (checkLoginStatus()) {
            var fileParam = getUrlParameter('file');
            if (fileParam) {
                fetch(fileParam)
                    .then(response => response.text())
                    .then(data => {
                        var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
                        var filename = fileParam.split('/').pop() || 'download.txt';
                        Qmsg.success("已开始下载");
                        saveAs(blob, filename);
                    })
                    .catch(error => {
                        console.error('下载文件时出错:', error);
                        Qmsg.error("文件下载失败");
                    });
            }
        }
    }

    // 检查是否有自动下载参数
    var autoDownloadParam = getUrlParameter('autoDownload');
    if (autoDownloadParam && autoDownloadParam.toLowerCase() === 'true') {
        autoDownload();
    }

    document.getElementById('downloadSourceCodeBtn').addEventListener('click', function () {
        if (checkLoginStatus()) {
            // 用户已登录，直接下载file参数指定的文件
            var fileParam = getUrlParameter('file');
            if (fileParam) {
                fetch(fileParam)
                    .then(response => response.text())
                    .then(data => {
                        var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
                        var filename = fileParam.split('/').pop() || 'download.txt';
                        Qmsg.success("已开始下载");
                        saveAs(blob, filename);
                    })
                    .catch(error => {
                        console.error('下载文件时出错:', error);
                        Qmsg.error("文件下载失败");
                    });
            }
        } else {
            // 用户未登录，重定向到登录页面并带上当前页面和autoDownload参数
            var fullPath = window.location.pathname; // 获取完整路径（包括子目录）
            var searchParams = window.location.search; // 获取所有参数（包括?号）

            // 构建重定向URL，包含完整路径和所有原始参数
            var redirectUrl = encodeURIComponent(fullPath + searchParams + (searchParams ? '&' : '?') + 'autoDownload=true');
            window.location.href = '/account/Login.html?redirect=' + redirectUrl;
        }
    });

    // 获取URL参数
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');

        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1] || '');
            params[key] = value;
        }
        return params;
    }

    // 页面加载时根据参数设置内容
    window.onload = function () {
        const params = getQueryParams();

        // 设置标题
        if (params.title) {
            document.title = params.title;
            const titleElement = document.querySelector('.title');
            if (titleElement) {
                titleElement.textContent = params.title;
            }
        }

        // 加载对应的txt文件到pre元素
        if (params.file) {
            fetch(params.file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('文件加载失败');
                    }
                    return response.text();
                })
                .then(data => {
                    const preElement = document.getElementById('sourceCode');
                    if (preElement) {
                        preElement.querySelector('code').textContent = data;
                        // 重新高亮代码
                        if (typeof hljs !== 'undefined') {
                            hljs.highlightElement(preElement.querySelector('code'));
                        }
                    }
                })
                .catch(error => {
                    console.error('加载文件时出错:', error);
                });
        }
    };
    // 获取URL参数
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const pairs = queryString.split('&');

        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            const key = decodeURIComponent(pair[0]);
            const value = decodeURIComponent(pair[1] || '');
            params[key] = value;
        }
        return params;
    }

    // 页面加载时根据参数设置内容
    window.onload = function () {
        const params = getQueryParams();

        // 设置标题
        if (params.title) {
            document.title = params.title;
            const titleElement = document.querySelector('.title');
            if (titleElement) {
                titleElement.textContent = params.title;
            }
        }

        // 加载对应的txt文件到pre元素
        if (params.file) {
            fetch(params.file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('文件加载失败');
                    }
                    return response.text();
                })
                .then(data => {
                    const preElement = document.getElementById('sourceCode');
                    if (preElement) {
                        preElement.querySelector('code').textContent = data;
                        // 重新高亮代码
                        if (typeof hljs !== 'undefined') {
                            hljs.highlightElement(preElement.querySelector('code'));
                        }
                    }
                })
                .catch(error => {
                    console.error('加载文件时出错:', error);
                });
        }
    };
});