const urlParams = new URLSearchParams(window.location.search);
const isPreview = urlParams.has('preview');

// ==================== 主题管理模块 ====================
const ThemeManager = {
    // 初始化主题
    init: function() {
        // 设置默认值
        if (localStorage.getItem('followSystem') === null) {
            localStorage.setItem('followSystem', 'true');
        }
        if (localStorage.getItem('darkMode') === null) {
            localStorage.setItem('darkMode', 'disabled');
        }
        if (localStorage.getItem('opacity') === null) {
            localStorage.setItem('opacity', '0.3');
        }
        if (localStorage.getItem('blur') === null) {
            localStorage.setItem('blur', '30');
        }
        
        // 如果跟随系统，同步当前系统主题到 darkMode
        if (localStorage.getItem('followSystem') === 'true') {
            const systemIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            localStorage.setItem('darkMode', systemIsDark ? 'enabled' : 'disabled');
        }
        
        // 初始化 favicon（标签页图标）- 始终跟随系统
        this.updateFavicon();
        
        // 应用主题
        this.applyTheme();
        
        // 初始化 SweetAlert2
        this.initSwal();
        
        // 设置监听器
        this.setupListeners();
    },
    
    // 初始化 SweetAlert2
    initSwal: function() {
        if (typeof Swal === 'undefined') {
            // 如果 Swal 还没加载，等待它加载
            const checkSwal = setInterval(() => {
                if (typeof Swal !== 'undefined') {
                    clearInterval(checkSwal);
                    this.overrideSwalFire();
                }
            }, 100);
            return;
        }
        
        this.overrideSwalFire();
    },
    
    // 重写 Swal.fire 方法
    overrideSwalFire: function() {
        if (!Swal || !Swal.fire) {
            console.error('SweetAlert2 对象不完整');
            return;
        }
        
        console.log('SweetAlert2 版本:', Swal.version || '未知');
        
        // 保存原始的 fire 方法
        const originalFire = Swal.fire;
        const self = this;
        
        // 重写 fire 方法
        Swal.fire = function() {
            const args = arguments;
            const shouldUseDark = self.getCurrentDarkMode();
            
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
                const shouldUseDark = self.getCurrentDarkMode();
                
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
                    const shouldUseDark = self.getCurrentDarkMode();
                    
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
    },
    
    // 更新 favicon（标签页图标）- 根据系统深色模式
    updateFavicon: function() {
        const systemIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // 查找现有的 favicon
        let favicon = document.querySelector('link[rel="icon"]');
        
        // 如果不存在，创建一个
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.type = 'image/svg+xml';
            document.head.appendChild(favicon);
        }
        
        // 设置正确的图标
        favicon.href = systemIsDark ? '/icons/logo_dark.svg' : '/icons/logo.svg';
        
        // 同时更新 apple-touch-icon（如果有）
        const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
        if (appleIcon) {
            appleIcon.href = systemIsDark ? '/icons/logo_dark.svg' : '/icons/logo.svg';
        }
        
        console.log('Favicon updated to:', systemIsDark ? 'dark' : 'light', 'mode');
    },
    
    // 应用主题
    applyTheme: function() {
        const followSystem = localStorage.getItem('followSystem') === 'true';
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        
        // 背景图片路径
        let lightModeBackground = localStorage.getItem('lightModeBgUrl');
        let darkModeBackground = localStorage.getItem('darkModeBgUrl');
        
        if(lightModeBackground === "url('')" || !lightModeBackground) {
            lightModeBackground = "url('https://cdn.pixabay.com/photo/2023/06/16/21/13/landscape-8068793_1280.jpg')";
        }
        if(darkModeBackground === "url('')" || !darkModeBackground) {
            darkModeBackground = "url('https://img1.wallspic.com/previews/7/4/9/3947/3947-ye_wan_de_tian_kong-wai_ceng_kong_jian-ming_xing-tian_wen_xue_dui_xiang-tian_kong-x750.jpg')";
        }
        
        // Logo图片路径（这是页面中的主logo，不是标签页图标）
        const lightModeLogoSrc = '/icons/logo.svg';
        const darkModeLogoSrc = '/icons/logo_dark.svg';
        
        // 获取页面元素
        const body = document.body;
        const mainImage = document.getElementById('main-image');
        
        if (followSystem) {
            // 跟随系统
            const systemIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            if (body) {
                body.style.backgroundImage = systemIsDark ? darkModeBackground : lightModeBackground;
                body.classList.toggle('dark-mode', systemIsDark);
            }
            
            if (mainImage) {
                mainImage.src = systemIsDark ? darkModeLogoSrc : lightModeLogoSrc;
            }
            
            // 更新表格容器的深色模式类
            const tablesContainer = document.getElementById('tables-container');
            if (tablesContainer) {
                tablesContainer.classList.toggle('dark-mode', systemIsDark);
            }
            
            // 禁用切换按钮
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.style.opacity = '0.5';
                darkModeToggle.title = '跟随系统主题时无法手动切换';
            }
        } else {
            // 手动模式
            if (body) {
                body.style.backgroundImage = isDarkMode ? darkModeBackground : lightModeBackground;
                body.classList.toggle('dark-mode', isDarkMode);
            }
            
            if (mainImage) {
                mainImage.src = isDarkMode ? darkModeLogoSrc : lightModeLogoSrc;
            }
            
            // 更新表格容器的深色模式类
            const tablesContainer = document.getElementById('tables-container');
            if (tablesContainer) {
                tablesContainer.classList.toggle('dark-mode', isDarkMode);
            }
            
            // 启用切换按钮
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.style.opacity = '1';
                darkModeToggle.style.pointerEvents = 'auto';
                darkModeToggle.style.cursor = 'pointer';
                darkModeToggle.title = '切换深色/浅色模式';
            }
        }
        
        // 应用透明度和模糊效果
        const opacity = localStorage.getItem('opacity') || '0.3';
        const blur = localStorage.getItem('blur') || '30';
        const currentIsDark = this.getCurrentDarkMode();
        
        this.setElementsOpacity(opacity, currentIsDark);
        this.setElementsBlur(blur, currentIsDark);
        
        // 注意：不在这里更新 favicon，因为 favicon 只跟随系统，不跟随网页主题
    },
    
    // 获取当前是否为深色模式
    getCurrentDarkMode: function() {
        const followSystem = localStorage.getItem('followSystem') === 'true';
        if (followSystem) {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            return localStorage.getItem('darkMode') === 'enabled';
        }
    },
    
    // 设置元素透明度
    setElementsOpacity: function(opacity, isDarkMode) {
        const elements = document.querySelectorAll('th, table, thead, .bottom-bar, #busuanzi-container, #tips, #time');
        
        elements.forEach(function(element) {
            if (isDarkMode) {
                element.style.backgroundColor = `rgba(16, 16, 16, ${opacity})`;
            } else {
                element.style.backgroundColor = `rgba(242, 242, 242, ${opacity})`;
            }
        });
    },
    
    // 设置元素模糊效果
    setElementsBlur: function(blur, isDarkMode) {
        const elements = document.querySelectorAll('th, table, thead, .bottom-bar, #busuanzi-container, #tips, #time');
        
        elements.forEach(function(element) {
            element.style.backdropFilter = `blur(${blur}px)`;
            element.style.webkitBackdropFilter = `blur(${blur}px)`;
        });
    },
    
    // 设置监听器
    setupListeners: function() {
        // 监听 storage 事件（跨页面通信的关键！）
        window.addEventListener('storage', (e) => {
            if (e.key === 'followSystem' || e.key === 'darkMode' || e.key === 'opacity' || e.key === 'blur') {
                console.log('Theme changed in another page:', e.key, e.newValue);
                this.applyTheme();
                // 重新应用 SweetAlert 主题
                if (typeof Swal !== 'undefined') {
                    this.overrideSwalFire();
                }
            }
        });
        
        // 重写 localStorage.setItem 以在同一页面内也能响应
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            originalSetItem.call(this, key, value);
            
            // 触发自定义事件
            const event = new CustomEvent('localStorageChange', {
                detail: { key: key, newValue: value }
            });
            window.dispatchEvent(event);
        };
        
        // 监听自定义事件
        window.addEventListener('localStorageChange', (e) => {
            if (e.detail.key === 'followSystem' || e.detail.key === 'darkMode' || 
                e.detail.key === 'opacity' || e.detail.key === 'blur') {
                console.log('Theme changed in this page:', e.detail.key, e.detail.newValue);
                this.applyTheme();
                // 重新应用 SweetAlert 主题
                if (typeof Swal !== 'undefined') {
                    this.overrideSwalFire();
                }
            }
        });
        
        // 监听系统主题变化（这个会影响 favicon！）
        if (window.matchMedia) {
            const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
            systemThemeMedia.addEventListener('change', (e) => {
                console.log('System theme changed:', e.matches ? 'dark' : 'light');
                
                // 系统主题变化时，始终更新 favicon
                this.updateFavicon();
                
                // 如果当前是跟随系统模式，也要更新网页主题
                if (localStorage.getItem('followSystem') === 'true') {
                    localStorage.setItem('darkMode', e.matches ? 'enabled' : 'disabled');
                    this.applyTheme();
                    // 重新应用 SweetAlert 主题
                    if (typeof Swal !== 'undefined') {
                        this.overrideSwalFire();
                    }
                }
            });
        }
    },
    
    // 切换深色模式
    toggleDarkMode: function() {
        if (localStorage.getItem('followSystem') === 'true') {
            // 获取当前语言设置
            const currentLang = localStorage.getItem('preferredLang') || 'auto';
            let actualLang = 'zh';
            
            if (currentLang === 'auto') {
                actualLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
            } else {
                actualLang = currentLang;
            }
            
            // 根据语言显示不同提示
            if (actualLang === 'en') {
                Qmsg.error("Currently set to follow system, cannot manually switch dark/light mode");
            } else {
                Qmsg.error("当前设置为跟随系统，无法手动切换深浅色模式");
            }
            return;
        }
        
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        localStorage.setItem('darkMode', isDarkMode ? 'disabled' : 'enabled');
        
        // 创建全屏涟漪效果
        this.createRippleEffect(!isDarkMode);
        
        // 重新应用 SweetAlert 主题
        if (typeof Swal !== 'undefined') {
            this.overrideSwalFire();
        }
        
        // 注意：不更新 favicon，因为 favicon 始终跟随系统
    },
    
    // 创建涟漪效果
    createRippleEffect: function(isDark) {
        var ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.position = 'fixed';
        ripple.style.top = '0';
        ripple.style.left = '0';
        ripple.style.width = '100%';
        ripple.style.height = '100%';
        ripple.style.opacity = '0.5';
        ripple.style.backgroundColor = isDark ? 'black' : 'white';
        ripple.style.borderRadius = '50%';
        ripple.style.animation = 'rippleEffect 1s ease-out forwards';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999';

        document.body.appendChild(ripple);

        setTimeout(function() {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 1000);
    }
};

// ==================== DOM 加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题管理器
    ThemeManager.init();
    
    var body = document.body;
    var darkModeToggle = document.getElementById('darkModeToggle');
    var mainImage = document.getElementById('main-image');
    var opacitySelect = document.getElementById('opacitySelect');
    var blurSelect = document.getElementById('blurSelect');
    
    // 为深色模式切换按钮添加事件监听器
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            ThemeManager.toggleDarkMode();
        });
    }

    // 监听透明度选择的变化
    if (opacitySelect) {
        opacitySelect.value = localStorage.getItem('opacity') || '0.3';
        
        opacitySelect.addEventListener('change', function() {
            localStorage.setItem('opacity', opacitySelect.value);
            // ThemeManager.applyTheme 会被 storage 事件触发
        });
    }
    
    // 监听模糊选择的变化
    if (blurSelect) {
        blurSelect.value = localStorage.getItem('blur') || '30';
        
        blurSelect.addEventListener('change', function() {
            localStorage.setItem('blur', blurSelect.value);
            // ThemeManager.applyTheme 会被 storage 事件触发
        });
    }
    
// 预览模式处理
if (isPreview) {
    if (mainImage) {
        mainImage.style.width = '30%';
    }
    
    // 创建一个示例表格用于预览
    const tablesContainer = document.getElementById('tables-container');
    if (tablesContainer) {
        tablesContainer.innerHTML = `
            <div class="table-wrapper" style="display: block;">
                <table class="main-table" style="animation: slideUp 1.5s forwards, blurIn 1.5s forwards;">
                    <thead>
                        <tr>
                            <th data-en="Script Name">脚本名</th>
                            <th data-en="Introduction">简介</th>
                            <th data-en="Notes">备注</th>
                            <th data-en="View">查看</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-en="Example Script 1">示例脚本 1</td>
                            <td data-en="This is an introduction to the example script">这是一个示例脚本的简介</td>
                            <td data-en="You are previewing the main interface. You can slide the slider in the settings to change the homepage style">你正在预览主界面，你可以在设置界面中拖动滑块改变主页样式</td>
                            <td><button class="custom-button" onclick="alert('Preview mode, cannot view actual content')" data-en="View">查看</button></td>
                        </tr>
                        <!-- 其他示例行类似 -->
                    </tbody>
                </table>
            </div>
        `;
    }
    document.getElementById('settingsButton').remove();
    document.getElementById('loginStatus').remove();
    document.getElementById('busuanzi_container_site_pv').style.fontSize = '16px';
    document.getElementById('busuanzi_container_site_pv').innerHTML = "当前为预览模式<br>无访问量运行时间数据";
    document.getElementById('time_now').innerHTML = '当前时间：正在预览模式';
    document.getElementById('date_now').innerHTML = '当前日期：正在预览模式';
    return;
}
    // ==================== 站点运行时间 ====================
// 站点运行时间
var startDate = new Date('2024-01-18');
var currentDate = new Date();
var diffTime = Math.abs(currentDate - startDate);
var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
const script = document.createElement('script');
script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
document.head.appendChild(script);
var busuanziElement = document.getElementById('busuanzi_container_site_pv');
if (busuanziElement) {
    // 拆分成两部分，中间插入动态天数
    busuanziElement.innerHTML = `
        <span data-en="Total site visits: ">本站总访问量</span>
        <span id='busuanzi_value_site_pv'></span>
        <span data-en=" times">次</span>
        <br>
        <span data-en="Site running time: ">主站运行总时间:</span>
        <span>${diffDays}</span>
        <span data-en=" days">天</span>
    `;
    
    // 注册新添加的翻译元素
    registerI18nElements(busuanziElement);
}
    
    // ==================== 登录状态处理 ====================
    var loginStatusElement = document.getElementById('loginStatus');
    var logoutButton = document.getElementById('logoutButton');
    var isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    var menuVisible = false;

// 登录状态处理
if (!isLoggedIn) {
    if (logoutButton) logoutButton.style.display = 'none';
    if (loginStatusElement) {
        loginStatusElement.onclick = function() {
            var loginUrl = '/account/Login/index.html?redirect=/index.html';
            window.location.href = loginUrl;
        };
    }
} else {
    if (loginStatusElement) {
        // 创建带翻译的加载状态
        const loginStatusSpan = loginStatusElement.querySelector('.login-status');
        loginStatusSpan.textContent = '正在加载';
        loginStatusSpan.setAttribute('data-en', 'Loading');
        
        var user = localStorage.getItem('username');
        let userId = localStorage.getItem('userid');
        const imageUrl = `${serverurl}/get-icon-by-id?id=${localStorage.getItem('userid')}`;
        loginStatusElement.style.backgroundImage = `url('${imageUrl}')`;
        
        // 获取用户名
        fetch(`${serverurl}/get-username-by-id`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('用户名:', data.data.username);
                localStorage.setItem('username', data.data.username);
                if (loginStatusElement) {
                    const statusSpan = loginStatusElement.querySelector('.login-status');
                    statusSpan.textContent = '';
                    statusSpan.removeAttribute('data-en'); // 清空后不需要翻译
                }
            } else {
                console.error(data.message);
                showLoginError();
            }
        })
        .catch(error => {
            showLoginError();
        });

        loginStatusElement.onclick = function(event) {
            event.stopPropagation();
            toggleMenu();
        };

        document.addEventListener('click', function() {
            if (!menuVisible) return;
            hideMenu();
        });
    }
}

    // 登录错误处理函数
function showLoginError() {
    Swal.fire({
        title: "找不到该用户，是否尝试重新登录？",
        text: "注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "正在跳转!",
                text: "正在跳转",
                icon: "info",
                showConfirmButton: false,
                timer: 1500
            });
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('usertype');
            localStorage.removeItem('userid');
            localStorage.removeItem('developerOptionsEnabled');
            window.location.href = '/account/Login/index.html';
        } else {
            window.location.reload();
        }
    });
}

// 登录错误处理函数
function showLoginError() {
    Swal.fire({
        title: localStorage.getItem('preferredLang') === 'en' ? "User not found, try to login again?" : "找不到该用户，是否尝试重新登录？",
        text: localStorage.getItem('preferredLang') === 'en' ? "Note: If the page is still loading, please wait" : "注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: localStorage.getItem('preferredLang') === 'en' ? "Yes" : "是",
        cancelButtonText: localStorage.getItem('preferredLang') === 'en' ? "No" : "否"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: localStorage.getItem('preferredLang') === 'en' ? "Redirecting!" : "正在跳转!",
                text: localStorage.getItem('preferredLang') === 'en' ? "Redirecting" : "正在跳转",
                icon: "info",
                showConfirmButton: false,
                timer: 1500
            });
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('usertype');
            localStorage.removeItem('userid');
            localStorage.removeItem('developerOptionsEnabled');
            window.location.href = '/account/Login/index.html';
        } else {
            window.location.reload();
        }
    });
}

// 退出登录函数
function logout() {
    Swal.fire({
        title: localStorage.getItem('preferredLang') === 'en' ? "Are you sure you want to logout?" : "您确定要退出登录吗？",
        text: localStorage.getItem('preferredLang') === 'en' ? "This will clear your local login information" : "这将清除你本地的登录信息",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: localStorage.getItem('preferredLang') === 'en' ? "Yes" : "是",
        cancelButtonText: localStorage.getItem('preferredLang') === 'en' ? "No" : "否"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('usertype');
            localStorage.removeItem('userid');
            localStorage.removeItem('developerOptionsEnabled');
            Swal.fire(
                localStorage.getItem('preferredLang') === 'en' ? "Logout successful!" : "退出成功！", 
                localStorage.getItem('preferredLang') === 'en' ? "You have been logged out" : "已退出登录", 
                "success"
            );
            location.reload();
        }
    });
}

function sa() {
    Swal.fire({
        title: localStorage.getItem('preferredLang') === 'en' ? "Are you sure you want to switch accounts?" : "您确定要切换账号吗",
        text: localStorage.getItem('preferredLang') === 'en' ? "This will clear your current login information" : "这将清除你现在的登录信息",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: localStorage.getItem('preferredLang') === 'en' ? "Yes" : "是",
        cancelButtonText: localStorage.getItem('preferredLang') === 'en' ? "No" : "否"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('usertype');
            localStorage.removeItem('userid');
            localStorage.removeItem('developerOptionsEnabled');
            window.location.href = '/account/Login/index.html';
        }
    });
}
    // 菜单显示/隐藏函数
    function toggleMenu() {
        if (menuVisible) {
            hideMenu();
        } else {
            showMenu();
        }
    }

    function showMenu() {
        var menu = document.createElement('ul');
        isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        menu.style.position = 'absolute';
        menu.style.listStyle = 'none';
        menu.style.padding = '2px 0';
        menu.style.margin = '0';
        menu.style.width = '200px';
        menu.style.height = 'auto';
        menu.style.backgroundColor = isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        menu.style.color = isDarkMode ? 'white' : 'black';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '10px';
        menu.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.3)';
        menu.style.zIndex = '1000';
        menu.style.top = '100%';
        menu.style.left = '0';
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(-20px)';
        menu.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        var menuItems = [
            { text: '账户设置', enText: 'Account Settings', action: function () { if(navigator.userAgent.match(/Mobile/i)){ window.location.href = 'settings.html#account'; }else{window.location.href = 'settings.html#account';} } },
            { text: '切换账号', enText: 'Switch Account', action: function () { sa(); } },
            { text: '退出登录', enText: 'Logout', action: function () { logout(); } }
        ];

        menuItems.forEach(function (item, index) {
            if (index > 0) {
                var separator = document.createElement('li');
                separator.className = 'menu-separator';
                separator.style.height = '1px';
                separator.style.backgroundColor = '#ccc';
                separator.style.margin = '4px 0';
                separator.style.padding = '0';
                menu.appendChild(separator);
            }

            var menuItem = document.createElement('li');
            menuItem.className = 'menu-item';
            menuItem.textContent = item.text;
            menuItem.setAttribute('data-en', item.enText); // 添加翻译
            menuItem.style.padding = '8px 15px';
            menuItem.style.cursor = 'pointer';
            menuItem.style.fontSize = '14px';
            menuItem.onmouseover = function() {
                this.style.backgroundColor = isDarkMode ? '#333' : '#f0f0f0';
            };
            menuItem.onmouseout = function() {
                this.style.backgroundColor = 'transparent';
            };
            menuItem.onclick = function () {
                item.action();
                hideMenu();
            };
            menu.appendChild(menuItem);
        });

        loginStatusElement.appendChild(menu);
        
        // 注册菜单项到 i18n 系统
        if (window.i18n) {
            const menuItems = menu.querySelectorAll('[data-en]');
            menuItems.forEach(el => window.i18n.register(el));
        }
        
        setTimeout(function () {
            menu.style.opacity = '1';
            menu.style.transform = 'translateY(0)';
            menuVisible = true;
        }, 10);
    }
    function hideMenu() {
        if (!loginStatusElement) return;
        
        var menu = loginStatusElement.querySelector('ul');
        if (menu) {
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(-20px)';
            setTimeout(function() {
                if (menu.parentNode === loginStatusElement) {
                    loginStatusElement.removeChild(menu);
                    menuVisible = false;
                }
            }, 500);
        }
    }
    // ==================== 日期时间更新 ====================
    function updateLocalDateTime() {
        const nowUtc = new Date();
        const nowUtcAdjusted = new Date(nowUtc.getTime() + (0));
        const year = nowUtcAdjusted.getFullYear();
        const month = (nowUtcAdjusted.getMonth() + 1).toString().padStart(2, '0');
        const day = nowUtcAdjusted.getDate().toString().padStart(2, '0');
        const hoursUtc = nowUtcAdjusted.getHours().toString().padStart(2, '0');
        const minutesUtc = nowUtcAdjusted.getMinutes().toString().padStart(2, '0');
        const secondsUtc = nowUtcAdjusted.getSeconds().toString().padStart(2, '0');

        var timeNow = document.getElementById('time_now');
        var dateNow = document.getElementById('date_now');
        
        if (timeNow) {
            // 检查是否已经添加了翻译属性
            if (!timeNow.hasAttribute('data-en')) {
                timeNow.setAttribute('data-en', 'Local time: ');
            }
            // 使用 innerHTML 保留翻译标记
            timeNow.innerHTML = `<span data-en="Local time: ">本地时间：</span>${hoursUtc}:${minutesUtc}:${secondsUtc}`;
            
            // 注册新添加的翻译元素
            const span = timeNow.querySelector('span[data-en]');
            if (span && window.i18n) window.i18n.register(span);
        }
        
        if (dateNow) {
            if (!dateNow.hasAttribute('data-en')) {
                dateNow.setAttribute('data-en', 'Local date: ');
            }
            dateNow.innerHTML = `<span data-en="Local date: ">本地日期：</span>${year}-${month}-${day}`;
            
            // 注册新添加的翻译元素
            const span = dateNow.querySelector('span[data-en]');
            if (span && window.i18n) window.i18n.register(span);
        }
    }
    updateLocalDateTime();
    setInterval(updateLocalDateTime, 1000);

    // 动画监听
    var timeElement = document.getElementById('time');
    var settingsButton = document.getElementById('settingsButton');

    if (timeElement && settingsButton) {
        timeElement.addEventListener('animationstart', function() {
            settingsButton.style.right = '250px';
        });

        timeElement.addEventListener('animationend', function() {
            settingsButton.style.right = '250px';
        });
    }

    // ==================== 表格加载 ====================
    const tablesContainer = document.getElementById('tables-container');
    const navigationButtons = document.getElementById('navigation-buttons');
    
    if (tablesContainer) {
        // 存储所有表格和表格信息
        const tables = [];
        const tableNames = [];
        let currentTableIndex = 0;

        // 从服务器加载tables.json
        fetch('/config/tables.json')
            .then(response => response.json())
            .then(data => {
                Object.keys(data).forEach(tableType => {
                    tableNames.push(tableType);
                });

                createTablesFromJSON(data);
                createNavigationButtons();
                showTable(0);
            })
            .catch(error => {
                console.error('加载表格数据失败:', error);
                tablesContainer.innerHTML = '<p>加载表格数据失败，请刷新页面重试</p>';
            });

        // 根据JSON数据创建表格
        // 根据JSON数据创建表格
            function getCurrentLanguage() {
                const currentLang = localStorage.getItem('preferredLang') || 'auto';
                if (currentLang === 'auto') {
                    return navigator.language.startsWith('zh') ? 'zh' : 'en';
                }
                return currentLang;
            }
// 根据JSON数据创建表格
function createTablesFromJSON(data) {
    // 获取当前语言
    const currentLang = localStorage.getItem('preferredLang') || 'auto';
    let lang = 'zh';
    if (currentLang === 'auto') {
        lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    } else {
        lang = currentLang;
    }
    
    tablesContainer.innerHTML = '';

    Object.entries(data).forEach(([tableType, tableData], index) => {
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-wrapper';
        tableWrapper.style.display = 'none';

        const table = document.createElement('table');
        table.className = 'main-table';
        table.style.animation = 'slideUp 1.5s forwards, blurIn 1.5s forwards';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = Object.keys(tableData.row1 || {});

        headers.forEach((header, headerIndex) => {
            const th = document.createElement('th');

            if (headerIndex === 0 && tableNames.length > 1) {
                const tableSelector = document.createElement('select');
                tableSelector.className = 'table-selector';
                tableSelector.onchange = (e) => showTable(parseInt(e.target.value));

                tableNames.forEach((name, idx) => {
                    const option = document.createElement('option');
                    option.value = idx;
                    option.textContent = name;
                    option.selected = idx === index;
                    tableSelector.appendChild(option);
                });

                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'space-between';

                const titleSpan = document.createElement('span');
                // 根据语言设置表头文本
                const headerInfo = tableData.row1[header];
                if (typeof headerInfo === 'object') {
                    titleSpan.textContent = headerInfo[lang] || headerInfo.zh;
                    titleSpan.setAttribute('data-en', headerInfo.en);
                } else {
                    titleSpan.textContent = headerInfo || '脚本名';
                }

                container.appendChild(titleSpan);
                container.appendChild(tableSelector);
                th.appendChild(container);
            } else {
                // 根据语言设置表头文本
                const headerInfo = tableData.row1[header];
                if (typeof headerInfo === 'object') {
                    th.textContent = headerInfo[lang] || headerInfo.zh;
                    th.setAttribute('data-en', headerInfo.en);
                } else {
                    const headerDisplayNames = {
                        'name': { zh: '脚本名', en: 'Script Name' },
                        'Introduction': { zh: '简介', en: 'Introduction' },
                        'note': { zh: '备注', en: 'Notes' },
                        'view': { zh: '查看', en: 'View' },
                        'author': { zh: '作者', en: 'Author' },
                        'version': { zh: '版本', en: 'Version' },
                        'date': { zh: '日期', en: 'Date' }
                    };
                    const displayInfo = headerDisplayNames[header] || { zh: header, en: header };
                    th.textContent = displayInfo[lang];
                    th.setAttribute('data-en', displayInfo.en);
                }
            }

            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        Object.entries(tableData).forEach(([rowKey, rowData]) => {
            if (rowKey === 'row1') return;

            const tr = document.createElement('tr');

            headers.forEach(header => {
                const td = document.createElement('td');

                if (header === 'view') {
                    const button = document.createElement('button');
                    button.className = 'custom-button';
                    
                    // 获取查看按钮的文本
                    const viewInfo = tableData.row1.view;
                    if (typeof viewInfo === 'object') {
                        button.textContent = viewInfo[lang];
                        button.setAttribute('data-en', viewInfo.en);
                    } else {
                        button.textContent = '查看';
                        button.setAttribute('data-en', 'View');
                    }

                    // 根据是否有path字段构建URL
                    if (rowData.path) {
                        // 检查是否是代码文件（需要显示code.html）
                        if (rowData.path.endsWith('.py') || rowData.path.endsWith('.cpp')) {
                            const nameObj = rowData.name;
                            const title = typeof nameObj === 'object' ? nameObj[lang] : nameObj;
                            const encodedTitle = encodeURIComponent(title);
                            const url = `/code.html?title=${encodedTitle}&file=${rowData.path}`;
                            
                            button.onclick = function() {
                                openPage(url);
                            };
                        } else {
                            // 直接跳转到path
                            button.onclick = function() {
                                openPage(rowData.path);
                            };
                        }
                    }

                    td.appendChild(button);
                } else {
                    // 根据语言设置单元格内容
                    const cellData = rowData[header];
                    if (typeof cellData === 'object') {
                        td.textContent = cellData[lang] || cellData.zh;
                        if (cellData.en) {
                            td.setAttribute('data-en', cellData.en);
                        }
                    } else {
                        td.textContent = cellData || '';
                    }
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        tablesContainer.appendChild(tableWrapper);
        tables.push(tableWrapper);
        
        // 注册新创建的元素到 i18n 系统
        if (window.i18n) {
            const newElements = tableWrapper.querySelectorAll('[data-en]');
            newElements.forEach(el => window.i18n.register(el));
        }
    });
}

        // 创建导航按钮
        function createNavigationButtons() {
            if (!navigationButtons) return;
            
            navigationButtons.innerHTML = '';

            if (tables.length <= 1) return;

            const prevButton = document.createElement('button');
            prevButton.className = 'more-button left';
            prevButton.innerHTML = '&lt;';
            prevButton.title = '上一个表格';
            prevButton.style.left = '20px';
            prevButton.style.display = 'none';
            prevButton.onclick = () => showTable(currentTableIndex - 1);
            navigationButtons.appendChild(prevButton);

            const nextButton = document.createElement('button');
            nextButton.className = 'more-button';
            nextButton.innerHTML = '&gt;';
            nextButton.title = '下一个表格';
            nextButton.style.right = '20px';
            nextButton.style.display = 'block';
            nextButton.onclick = () => showTable(currentTableIndex + 1);
            navigationButtons.appendChild(nextButton);
            
            // 注册导航按钮
            registerI18nElements(navigationButtons);
        }
        // 显示指定索引的表格
        function showTable(index) {
            if (index < 0) index = 0;
            if (index >= tables.length) index = tables.length - 1;

            tables.forEach(table => {
                table.style.display = 'none';
            });

            tables[index].style.display = 'block';
            currentTableIndex = index;

            updateAllSelectors();
            updateNavigationButtons();
        }

        // 更新所有选择器
        function updateAllSelectors() {
            const allSelectors = document.querySelectorAll('.table-selector');
            allSelectors.forEach((selector) => {
                selector.value = currentTableIndex;
            });
        }

        // 更新导航按钮
        function updateNavigationButtons() {
            const prevButtons = document.querySelectorAll('.more-button.left');
            const nextButtons = document.querySelectorAll('.more-button:not(.left)');

            prevButtons.forEach(button => {
                button.style.display = currentTableIndex > 0 ? 'block' : 'none';
            });

            nextButtons.forEach(button => {
                button.style.display = currentTableIndex < tables.length - 1 ? 'block' : 'none';
            });
        }
    }
});