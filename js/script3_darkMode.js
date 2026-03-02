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
            
            // 初始化 hCaptcha 主题
            initHCaptchaTheme();
            
            // 初始化 SweetAlert2 主题
            initSwalTheme();
        }
        
        // 初始化 hCaptcha 主题
        function initHCaptchaTheme() {
            // 查找所有 hCaptcha 容器
            const hCaptchaElements = document.querySelectorAll('.h-captcha, [data-hcaptcha]');
            
            if (hCaptchaElements.length === 0) return;
            
            // 判断应该使用什么主题
            const shouldUseDark = shouldUseDarkMode();
            
            hCaptchaElements.forEach(element => {
                // 设置 data-theme 属性
                element.setAttribute('data-theme', shouldUseDark ? 'dark' : 'light');
                
                // 如果 hCaptcha 已经渲染（有 iframe），需要重新渲染
                if (element.querySelector('iframe')) {
                    // 获取当前的 hCaptcha 实例
                    const widgetId = element.getAttribute('data-hcaptcha-widget-id');
                    if (widgetId && window.hcaptcha) {
                        try {
                            // 重置并重新渲染
                            window.hcaptcha.reset(widgetId);
                            window.hcaptcha.render(element, {
                                theme: shouldUseDark ? 'dark' : 'light'
                            });
                        } catch (e) {
                            console.log('hCaptcha rerender error:', e);
                        }
                    }
                }
            });
        }
        
        // 判断应该使用深色模式还是浅色模式
        function shouldUseDarkMode() {
            const followSystem = localStorage.getItem('followSystem') === 'true';
            const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
            
            if (followSystem) {
                // 跟随系统
                return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            } else {
                // 手动模式
                return isDarkMode;
            }
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
        
            // 主题变化时，同步更新 hCaptcha
            setTimeout(initHCaptchaTheme, 0); // 使用 setTimeout 确保在 DOM 更新后执行
            
            // 主题变化时，同步更新 SweetAlert2
            setTimeout(initSwalTheme, 0);
        }
    
        // 监听系统主题变化（这个会影响 logo！）
        function setupSystemThemeListener() {
            if (window.matchMedia) {
                const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
            
                systemThemeMedia.addEventListener('change', function (e) {
                    console.log('System theme changed:', e.matches ? 'dark' : 'light');
                
                    // 系统主题变化时，始终更新 logo
                    updateLogo();
                
                    // 如果当前是跟随系统模式，也要更新网页主题和 hCaptcha
                    if (localStorage.getItem('followSystem') === 'true') {
                        applyTheme();
                        // 更新 hCaptcha（已经在 applyTheme 中调用，但为了确保同步再加一次）
                        initHCaptchaTheme();
                        initSwalTheme(); // 添加 SweetAlert 更新
                    } else {
                        // 即使不是跟随系统模式，如果 hCaptcha 是跟随系统的，也需要更新
                        // 但 hCaptcha 跟随的是网页主题，不是系统主题，所以这里不需要更新
                        // 除非你希望 hCaptcha 永远跟随系统（独立于网页主题）
                    }
                });
            }
        }
    
        // 监听 storage 事件（这是跨页面通信的关键！）
        window.addEventListener('storage', function (e) {
            console.log('Storage changed in another page:', e.key, e.newValue); // 调试用
        
            if (e.key === 'followSystem' || e.key === 'darkMode') {
                applyTheme();
                initHCaptchaTheme();
                initSwalTheme(); // 添加 SweetAlert 更新
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
                initHCaptchaTheme();
                initSwalTheme(); // 添加 SweetAlert 更新
            }
        });
    
        // 初始化 SweetAlert2 主题（通过重写 fire 方法）
        function initSwalTheme() {
            if (typeof Swal === 'undefined') {
                console.log('SweetAlert2 未加载，等待加载...');
                // 如果 Swal 还没加载，等待它加载
                const checkSwal = setInterval(function() {
                    if (typeof Swal !== 'undefined') {
                        clearInterval(checkSwal);
                        overrideSwalFire();
                    }
                }, 100);
                return;
            }
            
            overrideSwalFire();
        }
        
        // 重写 Swal.fire 方法
        function overrideSwalFire() {
            if (!Swal || !Swal.fire) {
                console.error('SweetAlert2 对象不完整');
                return;
            }
            
            console.log('SweetAlert2 版本:', Swal.version || '未知');
            
            // 保存原始的 fire 方法
            const originalFire = Swal.fire;
            
            // 重写 fire 方法
            Swal.fire = function() {
                const args = arguments;
                const shouldUseDark = shouldUseDarkMode();
                
                // 处理字符串参数形式: Swal.fire('title', 'text', 'icon')
                if (args.length >= 1 && typeof args[0] === 'string') {
                    const options = {
                        title: args[0],
                        text: args[1],
                        icon: args[2],
                        theme: shouldUseDark ? 'dark' : 'light'
                    };
                    return originalFire.call(this, options);
                }
                
                // 处理对象形式: Swal.fire({...})
                if (args.length === 1 && args[0] && typeof args[0] === 'object') {
                    const options = { ...args[0] };
                    options.theme = shouldUseDark ? 'dark' : 'light';
                    return originalFire.call(this, options);
                }
                
                // 其他情况（很少见）
                return originalFire.apply(this, args);
            };
            
            // 同时重写 Swal 本身（用于 Swal('title') 这种调用）
            if (window.Swal !== Swal.fire) {
                const originalSwal = window.Swal;
                window.Swal = function() {
                    const args = arguments;
                    const shouldUseDark = shouldUseDarkMode();
                    
                    if (args.length === 1 && typeof args[0] === 'string') {
                        return originalSwal.fire({
                            title: args[0],
                            theme: shouldUseDark ? 'dark' : 'light'
                        });
                    } else if (args.length === 2) {
                        return originalSwal.fire({
                            title: args[0],
                            text: args[1],
                            theme: shouldUseDark ? 'dark' : 'light'
                        });
                    } else if (args.length === 3) {
                        return originalSwal.fire({
                            title: args[0],
                            text: args[1],
                            icon: args[2],
                            theme: shouldUseDark ? 'dark' : 'light'
                        });
                    } else if (args.length === 1 && typeof args[0] === 'object') {
                        return originalSwal.fire({
                            ...args[0],
                            theme: shouldUseDark ? 'dark' : 'light'
                        });
                    }
                    return originalSwal.apply(this, args);
                };
                
                // 复制所有静态方法
                Object.assign(window.Swal, originalSwal);
            }
            
            // 处理 mixin
            if (Swal.mixin) {
                const originalMixin = Swal.mixin;
                Swal.mixin = function(options) {
                    const mixin = originalMixin.call(this, options);
                    const originalMixinFire = mixin.fire;
                    
                    mixin.fire = function() {
                        const args = arguments;
                        const shouldUseDark = shouldUseDarkMode();
                        
                        if (args.length === 1 && typeof args[0] === 'object') {
                            return originalMixinFire.call(this, {
                                ...args[0],
                                theme: shouldUseDark ? 'dark' : 'light'
                            });
                        } else if (args.length >= 1 && typeof args[0] === 'string') {
                            const options = {
                                title: args[0],
                                text: args[1],
                                icon: args[2],
                                theme: shouldUseDark ? 'dark' : 'light'
                            };
                            return originalMixinFire.call(this, options);
                        }
                        return originalMixinFire.apply(this, args);
                    };
                    
                    return mixin;
                };
            }
            
            console.log('SweetAlert2 已通过重写 fire 方法设置主题跟随');
        }
    
        // 初始化
        setupLocalListener();
        setupSystemThemeListener();
    
        // 初始化时应用主题并设置正确的 logo
        initTheme();
    
        // 页面加载完成后设置 logo
        document.addEventListener('DOMContentLoaded', function () {
            updateLogo();
        });
    
        // 监听动态添加的 hCaptcha 元素
        const observer = new MutationObserver(function (mutations) {
            let needsHCaptchaUpdate = false;
            
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查新添加的节点是否包含 logo 或 hCaptcha
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 元素节点
                            // 检查 logo
                            if (node.matches && (node.matches('img.logo, img[src*="logo"], #logo, header img, .site-logo'))) {
                                updateLogo();
                            }
                            
                            // 检查 hCaptcha
                            if (node.matches && (node.matches('.h-captcha, [data-hcaptcha]'))) {
                                needsHCaptchaUpdate = true;
                            }
                            
                            // 如果添加的节点内部可能包含 hCaptcha，递归检查
                            if (node.querySelectorAll) {
                                if (node.querySelectorAll('.h-captcha, [data-hcaptcha]').length > 0) {
                                    needsHCaptchaUpdate = true;
                                }
                                // 也检查 logo
                                if (node.querySelectorAll('img.logo, img[src*="logo"], #logo, header img, .site-logo').length > 0) {
                                    updateLogo();
                                }
                            }
                        }
                    }
                }
            });
            
            // 如果添加了新的 hCaptcha，初始化它们的主题
            if (needsHCaptchaUpdate) {
                // 给 hCaptcha 脚本一点时间初始化
                setTimeout(initHCaptchaTheme, 100);
            }
        });
    
        // 开始观察 document.body 的子节点变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    
        // 监听 hCaptcha API 加载完成
        function waitForHCaptcha() {
            if (window.hcaptcha) {
                console.log('hCaptcha API loaded');
                // hCaptcha 加载完成后，确保主题正确
                initHCaptchaTheme();
            } else {
                // 如果 hCaptcha 还没加载，监听它的加载事件
                const scriptObserver = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1 && node.tagName === 'SCRIPT' && 
                                node.src && node.src.includes('hcaptcha.com')) {
                                node.addEventListener('load', function() {
                                    console.log('hCaptcha script loaded');
                                    setTimeout(initHCaptchaTheme, 100);
                                });
                            }
                        });
                    });
                });
                
                scriptObserver.observe(document.head, {
                    childList: true,
                    subtree: true
                });
            }
        }
        
        waitForHCaptcha();
    
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
            },
            
            // 手动更新 hCaptcha 主题
            updateHCaptcha: function () {
                initHCaptchaTheme();
            },
            
            // 手动更新 SweetAlert 主题
            updateSwalTheme: function () {
                overrideSwalFire();
            },
            
            // 获取当前 SweetAlert 应该使用的主题
            getSwalTheme: function () {
                return shouldUseDarkMode() ? 'dark' : 'light';
            }
        };
    })();
});