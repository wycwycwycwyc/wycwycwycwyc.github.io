// 主题管理 - 保存为 theme.js 并在所有页面引入
document.addEventListener('DOMContentLoaded', function () {
    (function () {
        'use strict';
    
        // 初始化主题
        function initTheme() {
            // 设置默认值
            if (localStorage.getItem('followSystem') === null) {
                localStorage.setItem('followSystem', 'false'); // 默认不跟随系统
            }
            if (localStorage.getItem('darkMode') === null) {
                localStorage.setItem('darkMode', 'disabled'); // 默认浅色模式
            }
        
            // 应用主题
            applyTheme();
        }
    
        // 切换 logo 函数 - 根据系统深色模式
        function updateLogo() {
            // 检测系统是否为深色模式
            const systemIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
            console.log('System dark mode:', systemIsDark); // 调试用
        
            const logoLinks = document.querySelectorAll('link[rel="icon"][type="image/svg+xml"], link[rel="icon"][href*="logo"], link[rel="apple-touch-icon"][href*="logo"]');
        
            // 如果没有找到 link 标签，可能是使用 img 标签作为 logo
            const logoImages = document.querySelectorAll('img.logo, img[src*="logo"], #logo, .logo img, header img[src*="logo"], .site-logo');
        
            // 更新 favicon
            if (logoLinks.length > 0) {
                logoLinks.forEach(link => {
                    if (systemIsDark) {
                        link.href = '/icons/logo_dark.svg';
                    } else {
                        link.href = '/icons/logo.svg';
                    }
                });
            } else {
                // 如果没有找到 link 标签，创建一个默认的 favicon
                let favicon = document.querySelector('link[rel="icon"]');
                if (!favicon) {
                    favicon = document.createElement('link');
                    favicon.rel = 'icon';
                    favicon.type = 'image/svg+xml';
                    document.head.appendChild(favicon);
                }
                favicon.href = systemIsDark ? '/icons/logo_dark.svg' : '/icons/logo.svg';
            }
        
            // 更新 img 标签的 logo
            if (logoImages.length > 0) {
                logoImages.forEach(img => {
                    img.src = systemIsDark ? '/icons/logo_dark.svg' : '/icons/logo.svg';
                });
            }
        
            // 更新 apple-touch-icon（如果有）
            const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
            if (appleIcon) {
                appleIcon.href = systemIsDark ? '/icons/logo_dark.svg' : '/icons/logo.svg';
            }
        
            // 可选：添加一个数据属性标识当前使用的 logo 类型
            document.documentElement.setAttribute('data-system-theme', systemIsDark ? 'dark' : 'light');
        }
    
        // 应用主题函数（只控制网页的深浅色）
        function applyTheme() {
            const followSystem = localStorage.getItem('followSystem') === 'true';
            const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        
            console.log('Applying theme:', { followSystem, isDarkMode }); // 调试用
        
            if (followSystem) {
                // 跟随系统
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            } else {
                // 手动模式
                if (isDarkMode) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            }
        
            // 注意：这里不调用 updateLogo()，因为 logo 只跟随系统，不跟随网页主题
        }
    
        // 监听系统主题变化（这个会影响 logo！）
        function setupSystemThemeListener() {
            if (window.matchMedia) {
                const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
            
                systemThemeMedia.addEventListener('change', function (e) {
                    console.log('System theme changed:', e.matches ? 'dark' : 'light');
                
                    // 系统主题变化时，始终更新 logo
                    updateLogo();
                
                    // 如果当前是跟随系统模式，也要更新网页主题
                    if (localStorage.getItem('followSystem') === 'true') {
                        applyTheme();
                    }
                });
            }
        }
    
        // 监听 storage 事件（这是跨页面通信的关键！）
        window.addEventListener('storage', function (e) {
            console.log('Storage changed in another page:', e.key, e.newValue); // 调试用
        
            if (e.key === 'followSystem' || e.key === 'darkMode') {
                applyTheme();
            }
        });
    
        // 为了在同一页面内也能响应变化，我们还需要一个自定义事件
        function setupLocalListener() {
            // 保存原始的 setItem 方法
            const originalSetItem = localStorage.setItem;
        
            // 重写 setItem 方法
            localStorage.setItem = function (key, value) {
                // 调用原始的 setItem
                originalSetItem.call(this, key, value);
            
                // 触发自定义事件
                const event = new CustomEvent('localStorageChange', {
                    detail: {
                        key: key,
                        newValue: value,
                        oldValue: this.getItem(key)
                    }
                });
                window.dispatchEvent(event);
            };
        }
    
        // 监听自定义事件（用于同一页面内的变化）
        window.addEventListener('localStorageChange', function (e) {
            console.log('Local storage changed in this page:', e.detail.key, e.detail.newValue); // 调试用
        
            if (e.detail.key === 'followSystem' || e.detail.key === 'darkMode') {
                applyTheme();
            }
        });
    
        // 初始化
        setupLocalListener();
        setupSystemThemeListener();
    
        // 初始化时应用主题并设置正确的 logo
        initTheme();
    
        // 页面加载完成后设置 logo
        document.addEventListener('DOMContentLoaded', function () {
            updateLogo();
        });
    
        // 如果使用动态加载的内容，可以使用 MutationObserver 监听 DOM 变化
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查新添加的节点是否包含 logo
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 元素节点
                            if (node.matches && (node.matches('img.logo, img[src*="logo"], #logo, header img, .site-logo'))) {
                                updateLogo();
                                break;
                            }
                        }
                    }
                }
            });
        });
    
        // 开始观察 document.body 的子节点变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    
        // 暴露方法给全局（方便在按钮点击时调用）
        window.themeUtils = {
            // 切换到深色模式
            enableDarkMode: function () {
                localStorage.setItem('followSystem', 'false');
                localStorage.setItem('darkMode', 'enabled');
                // 不更新 logo，因为 logo 只跟随系统
            },
        
            // 切换到浅色模式
            enableLightMode: function () {
                localStorage.setItem('followSystem', 'false');
                localStorage.setItem('darkMode', 'disabled');
            },
        
            // 切换深色/浅色
            toggleDarkMode: function () {
                const followSystem = localStorage.getItem('followSystem') === 'true';
                const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
            
                if (followSystem) {
                    // 如果当前是跟随系统，切换时改为手动模式
                    localStorage.setItem('followSystem', 'false');
                    // 根据系统当前主题设置相反的模式
                    const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    localStorage.setItem('darkMode', systemIsDark ? 'disabled' : 'enabled');
                } else {
                    // 手动模式，直接切换
                    localStorage.setItem('darkMode', isDarkMode ? 'disabled' : 'enabled');
                }
                // 不更新 logo，因为 logo 只跟随系统
            },
        
            // 设置跟随系统
            setFollowSystem: function (follow) {
                localStorage.setItem('followSystem', follow ? 'true' : 'false');
            },
        
            // 获取当前状态
            getStatus: function () {
                return {
                    followSystem: localStorage.getItem('followSystem') === 'true',
                    isDarkMode: localStorage.getItem('darkMode') === 'enabled',
                    bodyHasDarkClass: document.body.classList.contains('dark-mode'),
                    systemIsDark: window.matchMedia('(prefers-color-scheme: dark)').matches
                };
            },
        
            // 获取当前系统主题（深色还是浅色）
            getSystemTheme: function () {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            },
        
            // 手动更新 logo（如果需要）
            updateLogo: function () {
                updateLogo();
            }
        };
    })();
});