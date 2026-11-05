const urlParams = new URLSearchParams(window.location.search);
const isPreview = urlParams.has('preview');
if (isPreview) {
    document.documentElement.classList.add('preview-mode');
}

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
        const selectors = isPreview
            ? 'th, table, thead, #searchBox'
            : 'th, table, thead, .bottom-bar, #busuanzi-container, #tips, #time, #searchBox';
        const elements = document.querySelectorAll(selectors);
        
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
        const selectors = isPreview
            ? 'th, table, thead, #searchBox'
            : 'th, table, thead, .bottom-bar, #busuanzi-container, #tips, #time, #searchBox';
        const elements = document.querySelectorAll(selectors);
        
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
    document.body.classList.add('preview-mode');
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
                        <tr>
                            <td data-en="Example Script 2">示例脚本 2</td>
                            <td data-en="A second example script">第二个示例脚本的简介</td>
                            <td data-en="Preview layout sample">预览布局示例</td>
                            <td><button class="custom-button" onclick="alert('Preview mode, cannot view actual content')" data-en="View">查看</button></td>
                        </tr>
                        <tr>
                            <td data-en="Example Script 3">示例脚本 3</td>
                            <td data-en="A third example script">第三个示例脚本的简介</td>
                            <td data-en="Preview layout sample">预览布局示例</td>
                            <td><button class="custom-button" onclick="alert('Preview mode, cannot view actual content')" data-en="View">查看</button></td>
                        </tr>
                        <tr>
                            <td data-en="Example Script 4">示例脚本 4</td>
                            <td data-en="A fourth example script">第四个示例脚本的简介</td>
                            <td data-en="Preview layout sample">预览布局示例</td>
                            <td><button class="custom-button" onclick="alert('Preview mode, cannot view actual content')" data-en="View">查看</button></td>
                        </tr>
                        <tr>
                            <td data-en="Example Script 5">示例脚本 5</td>
                            <td data-en="A fifth example script">第五个示例脚本的简介</td>
                            <td data-en="Preview layout sample">预览布局示例</td>
                            <td><button class="custom-button" onclick="alert('Preview mode, cannot view actual content')" data-en="View">查看</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
    ['loginStatus', 'accountOverlay', 'busuanzi-container', 'tips', 'time'].forEach(function(id) {
        const element = document.getElementById(id);
        if (element) element.remove();
    });
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
        <span data-en="Running for ">已运行 </span>
        <span>${diffDays}</span>
        <span data-en=" days · visits "> 天 · 访问 </span>
        <span id='busuanzi_value_site_pv'></span>
        <span data-en=" times"> 次</span>
    `;
    
    // 注册新添加的翻译元素
    registerI18nElements(busuanziElement);
}
    
    // ==================== 登录状态处理 ====================
    document.body.classList.add('account-ui-enabled');
    var loginStatusElement = document.getElementById('loginStatus');
    var isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    var menuVisible = false;
    var aboutLoaded = false;
    var avatarMotionId = 0;
    var avatarHomeRect = loginStatusElement && loginStatusElement.getBoundingClientRect();
    var accountOverlay = document.getElementById('accountOverlay');
    var accountAvatarSlot = document.getElementById('accountAvatarSlot');
    var accountAbout = document.getElementById('accountAbout');
    var accountHome = document.getElementById('accountHome');
    var accountFavorites = document.getElementById('accountFavorites');

// 登录状态处理
if (!isLoggedIn) {
    if (loginStatusElement) {
        loginStatusElement.onclick = function() {
            if (menuVisible) {
                window.location.href = '/account/Login/index.html?redirect=/index.html';
            } else {
                toggleMenu();
            }
        };
    }
} else {
    document.body.classList.add('has-account-menu');
    if (loginStatusElement) {
        // 创建带翻译的加载状态
        const loginStatusSpan = loginStatusElement.querySelector('.login-status');
        if (loginStatusSpan) {
            loginStatusSpan.textContent = '正在加载';
            loginStatusSpan.removeAttribute('data-en');
        }
        
        const accountUsername = document.getElementById('accountUsername');
        if (accountUsername) {
            accountUsername.textContent = localStorage.getItem('username') || '用户';
        }
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
                if (accountUsername) {
                    accountUsername.textContent = data.data.username;
                }
                if (loginStatusElement && loginStatusSpan) {
                    const statusSpan = loginStatusSpan;
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
    }
}
if (loginStatusElement) {
    loginStatusElement.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            loginStatusElement.click();
        }
    });
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
    // 账户侧栏显示/隐藏函数
    function toggleMenu() {
        if (menuVisible) {
            hideMenu();
        } else {
            showMenu();
        }
    }

    function showMenu() {
        if (!accountOverlay || !loginStatusElement || !accountAvatarSlot) return;
        const isAvatarMoving = loginStatusElement.classList.contains('account-avatar-flight')
            || loginStatusElement.classList.contains('account-avatar-in-panel');
        if (!isAvatarMoving) {
            avatarHomeRect = loginStatusElement.getBoundingClientRect();
        }
        const startRect = loginStatusElement.getBoundingClientRect();
        const panelRect = document.querySelector('.account-panel').getBoundingClientRect();
        const slotRect = accountAvatarSlot.getBoundingClientRect();
        const targetRect = {
            left: slotRect.left - panelRect.left,
            top: slotRect.top - panelRect.top,
            width: slotRect.width,
            height: slotRect.height
        };
        if (loginStatusElement.parentNode === accountAvatarSlot) {
            document.body.appendChild(loginStatusElement);
        }
        loginStatusElement.style.transition = 'none';
        loginStatusElement.style.left = `${startRect.left}px`;
        loginStatusElement.style.top = `${startRect.top}px`;
        loginStatusElement.style.width = `${startRect.width}px`;
        loginStatusElement.style.height = `${startRect.height}px`;
        loginStatusElement.style.right = 'auto';
        loginStatusElement.style.bottom = 'auto';
        loginStatusElement.classList.remove('account-avatar-in-panel');
        loginStatusElement.classList.add('account-avatar-entered');
        loginStatusElement.classList.add('account-avatar-flight');
        loginStatusElement.getBoundingClientRect();
        menuVisible = true;
        setGuestLoginLabel(true);
        accountOverlay.setAttribute('aria-hidden', 'false');
        accountOverlay.classList.add('is-open');
        transitionAvatarTo(targetRect, function() {
            if (!menuVisible) return;
            accountAvatarSlot.appendChild(loginStatusElement);
            loginStatusElement.classList.remove('account-avatar-flight');
            loginStatusElement.classList.add('account-avatar-in-panel');
            clearAvatarPosition();
        });
    }

function hideMenu() {
    if (!menuVisible || !accountOverlay || !loginStatusElement) return;
    menuVisible = false;

    // 隐藏所有子页面（关于、消息推送），并重置主页状态
    accountAbout.classList.remove('is-active');
    accountAbout.setAttribute('aria-hidden', 'true');

    if (accountFavorites) {
        accountFavorites.classList.remove('is-active');
        accountFavorites.setAttribute('aria-hidden', 'true');
    }
    
    if (accountMessages) {
        accountMessages.classList.remove('is-active');
        accountMessages.setAttribute('aria-hidden', 'true');
    }
    
    accountHome.classList.add('is-active');

    // 恢复头像位置和遮罩层关闭
    if (loginStatusElement.classList.contains('account-avatar-flight')
        || loginStatusElement.classList.contains('account-avatar-in-panel')) {
        const start = loginStatusElement.getBoundingClientRect();
        document.body.appendChild(loginStatusElement);
        loginStatusElement.classList.remove('account-avatar-in-panel');
        loginStatusElement.classList.add('account-avatar-flight');
        loginStatusElement.style.transition = 'none';
        loginStatusElement.style.left = `${start.left}px`;
        loginStatusElement.style.top = `${start.top}px`;
        loginStatusElement.style.width = `${start.width}px`;
        loginStatusElement.style.height = `${start.height}px`;
        loginStatusElement.style.right = 'auto';
        loginStatusElement.style.bottom = 'auto';
        loginStatusElement.getBoundingClientRect();
        
        accountOverlay.classList.remove('is-open');
        accountOverlay.setAttribute('aria-hidden', 'true');
        setGuestLoginLabel(false);
        transitionAvatarTo(avatarHomeRect || start, function() {
            resetAvatarPosition();
            avatarHomeRect = loginStatusElement.getBoundingClientRect();
        });
    } else {
        accountOverlay.classList.remove('is-open');
        accountOverlay.setAttribute('aria-hidden', 'true');
        setGuestLoginLabel(false);
    }
}

    function setGuestLoginLabel(isLoginAction) {
        if (isLoggedIn) return;
        const label = loginStatusElement.querySelector('.login-status');
        const text = isLoginAction ? '登录' : '更多';
        loginStatusElement.setAttribute('aria-label', text);
        if (label) {
            label.textContent = text;
            label.setAttribute('data-en', isLoginAction ? 'Login' : 'More');
            if (window.i18n) window.i18n.register(label);
        }
    }

    function transitionAvatarTo(targetRect, onComplete) {
        const motionId = ++avatarMotionId;
        loginStatusElement.style.transition = 'left 300ms cubic-bezier(.2,.8,.2,1), top 300ms cubic-bezier(.2,.8,.2,1), width 300ms ease, height 300ms ease';
        window.requestAnimationFrame(function() {
            if (motionId !== avatarMotionId) return;
            loginStatusElement.style.left = `${targetRect.left}px`;
            loginStatusElement.style.top = `${targetRect.top}px`;
            loginStatusElement.style.width = `${targetRect.width}px`;
            loginStatusElement.style.height = `${targetRect.height}px`;
        });
        if (onComplete) {
            window.setTimeout(function() {
                if (motionId === avatarMotionId) onComplete();
            }, 320);
        }
    }

    function resetAvatarPosition() {
        loginStatusElement.classList.remove('account-avatar-flight');
        clearAvatarPosition();
    }

    function clearAvatarPosition() {
        ['transition', 'left', 'top', 'right', 'bottom', 'width', 'height'].forEach(function(property) {
            loginStatusElement.style.removeProperty(property);
        });
    }

    function loadAboutContent() {
        if (aboutLoaded) return;
        const visitCount = document.getElementById('busuanzi_value_site_pv');
        accountAbout.innerHTML = `
            <header class="account-subpage-header">
                <button id="aboutBack" class="account-back-button" data-en="Back">返回</button>
                <h2 data-en="About">关于</h2>
                <button id="aboutClose" class="account-close-button" aria-label="关闭" data-en-aria-label="Close">×</button>
            </header>
            <div class="account-about-content">
                <p class="about-stat-line">
                    <span data-en="Running for ">已运行 </span><strong>${diffDays}</strong><span data-en=" days"> 天</span>
                    <span aria-hidden="true"> · </span>
                    <span data-en="visits ">访问 </span><strong id="aboutVisitCount">${visitCount && visitCount.textContent.trim() || '…'}</strong><span data-en=" times"> 次</span>
                </p>
                <section class="about-section">
                    <h3 data-en="Access address">访问地址</h3>
                    <a href="https://wycwycwycwyc.github.io" target="_blank" rel="noopener noreferrer" data-en="Main address">主地址</a>
                    <a href="https://imaginative-babka-6c8416.netlify.app" target="_blank" rel="noopener noreferrer" data-en="Backup address">备用地址</a>
                </section>
                <section class="about-section">
                    <h3 data-en="Homepage tips">首页提示</h3>
                    <p data-en="Tap the page background to switch between light and dark mode.">轻点页面背景可以切换浅色/深色模式。</p>
                </section>
                <section class="about-section about-time"></section>
            </div>`;
        const aboutTime = accountAbout.querySelector('.about-time');
        const timeElement = document.getElementById('time');
        if (timeElement && aboutTime) aboutTime.appendChild(timeElement);
        registerI18nElements(accountAbout);
        if (visitCount) {
            new MutationObserver(function() {
                const aboutVisitCount = document.getElementById('aboutVisitCount');
                if (aboutVisitCount) aboutVisitCount.textContent = visitCount.textContent.trim() || '…';
            }).observe(visitCount, { childList: true, characterData: true, subtree: true });
        }
        document.getElementById('aboutBack').addEventListener('click', showAccountHome);
        document.getElementById('aboutClose').addEventListener('click', hideMenu);
        aboutLoaded = true;
    }

    function showAccountHome() {
        accountAbout.classList.remove('is-active');
        accountAbout.setAttribute('aria-hidden', 'true');
        accountMessages.classList.remove('is-active');
        accountMessages.setAttribute('aria-hidden', 'true');
        if (accountFavorites) {
            accountFavorites.classList.remove('is-active');
            accountFavorites.setAttribute('aria-hidden', 'true');
        }
        accountHome.classList.add('is-active');
        window.setTimeout(function() {
            accountHome.classList.add('is-active');
        }, 20);
    }

    function showAbout() {
        loadAboutContent();
        if (accountFavorites) {
            accountFavorites.classList.remove('is-active');
            accountFavorites.setAttribute('aria-hidden', 'true');
        }
        accountMessages.classList.remove('is-active');
        accountMessages.setAttribute('aria-hidden', 'true');
        accountHome.classList.remove('is-active');
        accountAbout.setAttribute('aria-hidden', 'false');
        window.requestAnimationFrame(function() {
            accountAbout.classList.add('is-active');
        });
    }

    document.getElementById('accountBackdrop').addEventListener('click', hideMenu);
    document.getElementById('openSettings').addEventListener('click', function() {
        window.location.href = '/settings.html';
    });
    document.getElementById('accountSettings').addEventListener('click', function() {
        window.location.href = '/settings.html#account';
    });
    document.getElementById('accountLogout').addEventListener('click', function() {
        hideMenu();
        window.setTimeout(logout, 320);
    });
    document.getElementById('accountSwitch').addEventListener('click', function() {
        hideMenu();
        window.setTimeout(sa, 320);
    });
    document.getElementById('openAbout').addEventListener('click', showAbout);
    // ==================== 消息推送逻辑 ====================
var accountMessages = document.getElementById('accountMessages');
var messagesLoaded = false;
function loadBroadcastsList() {
    var container = document.getElementById('messagesContentArea');
    if (!container) return;

    // 1. 检查推送开关是否被关闭
    var settings = window.BroadcastExtension && window.BroadcastExtension.getPushSettings
        ? window.BroadcastExtension.getPushSettings()
        : { enabled: true };

    if (!settings.enabled) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <p style="font-size: 16px;" data-en="Message push is disabled">消息推送已关闭</p>
                <p style="font-size: 14px; margin-top: 10px;" data-en="Please enable it in settings">请在设置中开启</p>
            </div>`;
        return;
    }

    // 2. 检查广播扩展对象是否存在
    if (!window.BroadcastExtension || !window.BroadcastExtension.fetchBroadcasts) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;" data-en="No message data available">暂无消息数据</div>';
        return;
    }

    // 3. 拉取广播列表
    window.BroadcastExtension.fetchBroadcasts().then(function(broadcasts) {
        // 如果没有任何广播
        if (!broadcasts || broadcasts.length === 0) {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;" data-en="No messages found">暂无消息</div>';
            return;
        }

        // 4. 生成 HTML
        var html = '';
        broadcasts.forEach(function(b) {
            var title = b.title || '未命名';
            var createdAt = b.createdAt ? new Date(b.createdAt).toLocaleString() : '未知时间';
            var snippet = '';
            
            // 仅文本广播显示简略内容，HTML广播显示提示字样
            if (b.type === 'text') {
                var text = b.content || '';
                snippet = text.length > 20 ? text.substring(0, 20) + '...' : text;
            } else {
                snippet = '[HTML 广播]';
            }

            html += `
                <div class="message-card" data-bid="${b.broadcastId}" style="padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.08); cursor: pointer; transition: background 0.2s;">
                    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px;">
                        <h4 style="margin: 0; font-size: 15px; color: #333; font-weight: bold;">${title}</h4>
                        <span style="font-size: 12px; color: #999;">${createdAt}</span>
                    </div>
                    <p style="margin: 0; font-size: 13px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${snippet}</p>
                </div>
            `;
        });
        container.innerHTML = html;

        // 5. 绑定点击事件，调用弹出广播的接口
        container.querySelectorAll('.message-card').forEach(function(card) {
            // 可选：添加鼠标悬停效果
            card.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(0,0,0,0.03)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });

            card.addEventListener('click', function() {
                var bid = this.getAttribute('data-bid');
                var target = broadcasts.find(function(x) { return x.broadcastId === bid; });
                // 如果找到了目标广播并且弹出函数存在，则展示
                if (target && window.BroadcastExtension && window.BroadcastExtension.displayBroadcast) {
                    window.BroadcastExtension.displayBroadcast(target);
                }
            });
        });

    }).catch(function(err) {
        console.warn('[Messages] 加载广播列表失败:', err);
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;" data-en="Failed to load messages">加载消息失败</div>';
    });
}
function loadMessagesContent() {
    if (messagesLoaded) return;
    accountMessages.innerHTML = `
        <header class="account-subpage-header">
            <button id="messagesBack" class="account-back-button" data-en="Back">返回</button>
            <h2 data-en="Message Push">消息推送</h2>
            <button id="messagesClose" class="account-close-button" aria-label="关闭">×</button>
        </header>
        <div class="account-messages-content" id="messagesContentArea" style="flex:1; overflow-y:auto;">
            <div style="text-align:center; padding: 40px; color: #999;">加载中...</div>
        </div>
        <div style="padding: 15px 20px; text-align: center; border-top: 1px solid rgba(0,0,0,0.1); margin-top: auto;">
            <a href="/settings.html#boardcast" style="color: #007bff; text-decoration: none; font-size: 14px;" data-en="Message Push Settings">消息推送设置</a>
        </div>
    `;
    registerI18nElements(accountMessages);

    // 返回按钮：移出消息页的 active，恢复主页面的 active
    document.getElementById('messagesBack').addEventListener('click', function() {
        accountMessages.classList.remove('is-active');
        accountMessages.setAttribute('aria-hidden', 'true');
        accountHome.classList.add('is-active');
    });

    document.getElementById('messagesClose').addEventListener('click', hideMenu);

    loadBroadcastsList();
    messagesLoaded = true;
}

function showMessages() {
    loadMessagesContent();
    // 确保关闭其他子页面
    accountAbout.classList.remove('is-active');
    accountAbout.setAttribute('aria-hidden', 'true');
    if (accountFavorites) {
        accountFavorites.classList.remove('is-active');
        accountFavorites.setAttribute('aria-hidden', 'true');
    }
    accountHome.classList.remove('is-active');
    
    accountMessages.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(function() {
        accountMessages.classList.add('is-active');
    });
}

document.getElementById('openMessages').addEventListener('click', showMessages);
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && menuVisible) hideMenu();
    });

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

    // ==================== 表格加载 ====================
    const tablesContainer = document.getElementById('tables-container');
    const navigationButtons = document.getElementById('navigation-buttons');
    
    if (tablesContainer) {
        // 存储所有表格和表格信息
        const tables = [];
        const tableNames = [];
        let currentTableIndex = 0;
            const favoritesStorageKey = 'favoriteTables';
            const favoritesShowStorageKey = 'showFavoritesTableOnOpen';
            const favoritesTableName = getCurrentLang() === 'en' ? 'Favorites' : '收藏夹';
            let favoritesManagerLoaded = false;
            let favoriteSortSnapshot = {};

            function readFavorites() {
                try {
                    const savedFavorites = JSON.parse(localStorage.getItem(favoritesStorageKey) || '{}');
                    if (!savedFavorites || typeof savedFavorites !== 'object' || Array.isArray(savedFavorites)) {
                        throw new Error('收藏夹数据格式无效');
                    }
                    return savedFavorites;
                } catch (error) {
                    console.error('读取收藏夹失败:', error);
                    return {};
                }
            }

            function saveFavorites(favorites) {
                try {
                    localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
                    return true;
                } catch (error) {
                    console.error('保存收藏夹失败:', error);
                    Swal.fire(
                        getCurrentLang() === 'en' ? 'Unable to save favorites' : '无法保存收藏夹',
                        getCurrentLang() === 'en' ? 'Please check your browser storage settings.' : '请检查浏览器的本地存储设置。',
                        'error'
                    );
                    return false;
                }
            }

            function getFavoriteTableData(data) {
                const favorites = readFavorites();
                let headerRow = null;
                const favoriteRows = [];

                Object.entries(favorites).forEach(([tableType, rowEntries]) => {
                    if (!rowEntries || typeof rowEntries !== 'object' || !data[tableType]) return;
                    const rowKeys = Array.isArray(rowEntries) ? rowEntries : Object.keys(rowEntries);
                    rowKeys.forEach(rowKey => {
                        const rowData = data[tableType][rowKey];
                        if (!rowData || typeof rowData !== 'object' || rowKey === 'row1') return;
                        if (!headerRow) headerRow = data[tableType].row1;
                        favoriteRows.push({ tableType, rowKey, rowData });
                    });
                });

                if (!headerRow || favoriteRows.length === 0) return null;

                const tableData = { row1: headerRow };
                favoriteRows.forEach(({ tableType, rowKey, rowData }) => {
                    tableData[`${tableType}::${rowKey}`] = rowData;
                });
                return tableData;
            }

            function hasFavorite(favorites, tableType, rowKey) {
                const rowEntries = favorites[tableType];
                return Array.isArray(rowEntries)
                    ? rowEntries.includes(rowKey)
                    : Boolean(rowEntries && Object.prototype.hasOwnProperty.call(rowEntries, rowKey));
            }

            function toggleFavorite(tableType, rowKey) {
                const favorites = readFavorites();
                const rowEntries = favorites[tableType] && !Array.isArray(favorites[tableType])
                    ? { ...favorites[tableType] }
                    : Object.fromEntries((favorites[tableType] || []).map(key => [key, true]));

                if (Object.prototype.hasOwnProperty.call(rowEntries, rowKey)) delete rowEntries[rowKey];
                else rowEntries[rowKey] = true;

                if (Object.keys(rowEntries).length) favorites[tableType] = rowEntries;
                else delete favorites[tableType];

                if (!saveFavorites(favorites)) return;
                refreshTables(true);
                renderFavoriteItems();
            }

            function refreshTables(focusFavorites) {
                const previousTableName = tableNames[currentTableIndex];
                createTablesFromJSON(allTablesData);
                createNavigationButtons();
                let nextIndex = tableNames.indexOf(previousTableName);
                const favoritesIndex = tableNames.indexOf(favoritesTableName);
                const showFavorites = localStorage.getItem(favoritesShowStorageKey) !== 'false';
                if (focusFavorites && showFavorites && favoritesIndex !== -1) {
                    nextIndex = favoritesIndex;
                } else if (nextIndex === -1) {
                    nextIndex = favoritesIndex === -1
                        ? 0
                        : (showFavorites ? favoritesIndex : Math.min(1, tables.length - 1));
                }
                showTable(nextIndex);
            }

            function loadFavoritesContent() {
                if (!accountFavorites || favoritesManagerLoaded) return;
                const isEnglish = getCurrentLang() === 'en';
                accountFavorites.innerHTML = `
                    <header class="account-subpage-header">
                        <button id="favoritesBack" class="account-back-button" data-en="Back">返回</button>
                        <h2 data-en="Favorites">收藏夹</h2>
                        <button id="favoritesClose" class="account-close-button" aria-label="关闭">×</button>
                    </header>
                    <div class="favorites-settings">
                        <label class="favorites-default-setting">
                            <input id="showFavoritesOnOpen" type="checkbox">
                            <span data-en="Show favorites table when opening the page">${isEnglish ? 'Show favorites table when opening the page' : '打开主页时默认展示收藏夹表格'}</span>
                        </label>
                        <button id="clearFavorites" class="favorites-clear-button" type="button" data-en="Clear all favorites">${isEnglish ? 'Clear all favorites' : '清空所有收藏'}</button>
                        <input id="favoritesSearch" class="favorites-search" type="search"
                            placeholder="${isEnglish ? 'Search scripts...' : '搜索工具...'}"
                            aria-label="${isEnglish ? 'Search scripts' : '搜索工具'}">
                    </div>
                    <div id="favoriteItems" class="favorite-items"></div>
                `;
                registerI18nElements(accountFavorites);
                document.getElementById('favoritesBack').addEventListener('click', showAccountHome);
                document.getElementById('favoritesClose').addEventListener('click', hideMenu);
                document.getElementById('favoritesSearch').addEventListener('input', renderFavoriteItems);
                document.getElementById('clearFavorites').addEventListener('click', clearFavorites);
                document.getElementById('showFavoritesOnOpen').checked = localStorage.getItem(favoritesShowStorageKey) !== 'false';
                document.getElementById('showFavoritesOnOpen').addEventListener('change', function() {
                    localStorage.setItem(favoritesShowStorageKey, this.checked ? 'true' : 'false');
                });
                favoritesManagerLoaded = true;
                renderFavoriteItems();
            }

            function clearFavorites() {
                if (!Object.values(readFavorites()).some(rowEntries =>
                    Array.isArray(rowEntries) ? rowEntries.length > 0 : rowEntries && Object.keys(rowEntries).length > 0
                )) return;

                const isEnglish = getCurrentLang() === 'en';
                Swal.fire({
                    title: isEnglish ? 'Clear all favorites?' : '确定清空所有收藏吗？',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: isEnglish ? 'Clear all' : '全部清空',
                    cancelButtonText: isEnglish ? 'Cancel' : '取消'
                }).then(result => {
                    if (!result.isConfirmed || !saveFavorites({})) return;
                    refreshTables(true);
                    renderFavoriteItems();
                });
            }

            function renderFavoriteItems() {
                const itemsContainer = document.getElementById('favoriteItems');
                if (!itemsContainer) return;
                if (!allTablesData) {
                    itemsContainer.textContent = getCurrentLang() === 'en' ? 'Loading scripts...' : '工具加载中...';
                    return;
                }

                const isEnglish = getCurrentLang() === 'en';
                const searchTerm = (document.getElementById('favoritesSearch').value || '').trim().toLowerCase();
                const favorites = readFavorites();
                const clearButton = document.getElementById('clearFavorites');
                if (clearButton) {
                    clearButton.disabled = !Object.values(favorites).some(rowEntries =>
                        Array.isArray(rowEntries) ? rowEntries.length > 0 : rowEntries && Object.keys(rowEntries).length > 0
                    );
                }
                itemsContainer.innerHTML = '';
                let itemCount = 0;

                const availableItems = Object.entries(allTablesData).flatMap(([tableType, tableData]) =>
                    Object.entries(tableData)
                        .filter(([rowKey]) => rowKey !== 'row1')
                        .map(([rowKey, rowData]) => ({ tableType, rowKey, rowData }))
                );
                availableItems.sort((first, second) =>
                    Number(hasFavorite(favoriteSortSnapshot, second.tableType, second.rowKey))
                    - Number(hasFavorite(favoriteSortSnapshot, first.tableType, first.rowKey))
                );

                availableItems.forEach(({ tableType, rowKey, rowData }) => {
                    const searchableText = [tableType, rowKey].concat(
                        Object.values(rowData).map(value => {
                            if (value && typeof value === 'object') return `${value.zh || ''} ${value.en || ''}`;
                            return String(value || '');
                        })
                    ).join(' ').toLowerCase();
                    if (searchTerm && !searchableText.includes(searchTerm)) return;

                    itemCount++;
                    const item = document.createElement('div');
                    item.className = 'favorite-item';
                    const name = document.createElement('span');
                    const nameValue = rowData.name;
                    const displayName = nameValue && typeof nameValue === 'object'
                        ? nameValue[isEnglish ? 'en' : 'zh'] || nameValue.zh || rowKey
                        : nameValue || rowKey;
                    name.textContent = `${tableType} · ${displayName}`;
                    const action = document.createElement('button');
                    action.type = 'button';
                    const isFavorite = hasFavorite(favorites, tableType, rowKey);
                    action.textContent = isFavorite
                        ? (isEnglish ? 'Remove' : '移除')
                        : (isEnglish ? 'Add' : '添加');
                    action.className = isFavorite ? 'favorite-remove-button' : 'favorite-add-button';
                    action.addEventListener('click', function() {
                        toggleFavorite(tableType, rowKey);
                    });
                    item.append(name, action);
                    itemsContainer.appendChild(item);
                });

                if (!itemCount) {
                    itemsContainer.textContent = isEnglish ? 'No matching scripts found' : '没有找到匹配的工具';
                }
            }

            if (accountFavorites) {
                document.getElementById('openFavorites').addEventListener('click', function() {
                    favoriteSortSnapshot = readFavorites();
                    loadFavoritesContent();
                    renderFavoriteItems();
                    accountAbout.classList.remove('is-active');
                    accountAbout.setAttribute('aria-hidden', 'true');
                    accountMessages.classList.remove('is-active');
                    accountMessages.setAttribute('aria-hidden', 'true');
                    accountHome.classList.remove('is-active');
                    accountFavorites.setAttribute('aria-hidden', 'false');
                    window.requestAnimationFrame(function() {
                        accountFavorites.classList.add('is-active');
                    });
                });
            }

            // 从服务器加载tables.json
    fetch('/config/tables.json')
    .then(response => response.json())
    .then(data => {
        // 保存数据供搜索使用
        allTablesData = data;
        
        if (favoritesManagerLoaded) renderFavoriteItems();
        createTablesFromJSON(data);
        createNavigationButtons();
        const favoriteTableIndex = tableNames.indexOf(favoritesTableName);
        const shouldShowFavorites = localStorage.getItem(favoritesShowStorageKey) !== 'false';
        const defaultTableIndex = favoriteTableIndex === -1
            ? 0
            : (shouldShowFavorites ? favoriteTableIndex : Math.min(1, tables.length - 1));
        showTable(defaultTableIndex);
        
        // 初始化搜索
        initSearch();
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
// ==================== 搜索功能 ====================
let allTablesData = null;  // 存储所有表格数据
let currentLang = 'zh';

// 获取当前语言
function getCurrentLang() {
    const savedLang = localStorage.getItem('preferredLang') || 'auto';
    if (savedLang === 'auto') {
        return navigator.language.startsWith('zh') ? 'zh' : 'en';
    }
    return savedLang;
}

// 高亮搜索词
function highlightText(text, searchTerm) {
    if (!searchTerm || !text) return text;
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(' + escapedTerm + ')', 'gi');
    return text.replace(regex, '<mark style="background: #ffeb3b; color: #000; padding: 0 2px; border-radius: 2px;">$1</mark>');
}

// 判断单元格是否匹配搜索词
function cellMatchesSearch(cellData, searchTerm, lang) {
    let text = '';
    if (typeof cellData === 'object') {
        text = cellData[lang] || cellData.zh || '';
    } else {
        text = String(cellData || '');
    }
    return text.toLowerCase().includes(searchTerm.toLowerCase());
}

// 执行搜索
function performSearch(searchTerm) {
    const resultsContainer = document.getElementById('searchResults');
    const normalContainer = document.getElementById('tables-container');
    
    if (!searchTerm || searchTerm.trim() === '') {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        normalContainer.style.display = '';
        return;
    }
    
    currentLang = getCurrentLang();
    const term = searchTerm.trim();
    const matchingRows = [];
    
    // 遍历所有表格数据
    Object.entries(allTablesData || {}).forEach(([tableType, tableData]) => {
        const headers = Object.keys(tableData.row1 || {});
        
        Object.entries(tableData).forEach(([rowKey, rowData]) => {
            if (rowKey === 'row1') return;
            
            // 检查这一行是否有任何单元格匹配
            const hasMatch = headers.some(header => {
                if (header === 'view') return false;
                return cellMatchesSearch(rowData[header], term, currentLang);
            });
            
            if (hasMatch) {
                matchingRows.push({
                    tableType: tableType,
                    headers: headers,
                    rowData: rowData,
                    tableData: tableData
                });
            }
        });
    });
    
    // 渲染搜索结果
    if (matchingRows.length === 0) {
        resultsContainer.innerHTML = '<div style="text-align:center;padding:40px;color:#888;font-size:14px;" data-en="No results found">未找到匹配结果</div>';
        // 注册翻译
        if (window.i18n) {
            const el = resultsContainer.querySelector('[data-en]');
            if (el) window.i18n.register(el);
        }
    } else {
        resultsContainer.innerHTML = renderSearchResults(matchingRows, term);
        // 注册翻译
        if (window.i18n) {
            const els = resultsContainer.querySelectorAll('[data-en]');
            els.forEach(el => window.i18n.register(el));
        }
    }
    
    resultsContainer.style.display = 'block';
    normalContainer.style.display = 'none';
    clearBtn.style.display = 'inline-block';
}

// 渲染搜索结果
function renderSearchResults(matchingRows, searchTerm) {
    const lang = currentLang;
    
    const table = document.createElement('table');
    table.className = 'main-table';
    table.style.animation = 'slideUp 1.5s forwards, blurIn 1.5s forwards';
    
    // 表头
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = matchingRows[0].headers;
    headers.forEach(header => {
        const th = document.createElement('th');
        
        if (header === 'view') {
            const viewInfo = matchingRows[0].tableData.row1.view;
            if (typeof viewInfo === 'object') {
                th.textContent = viewInfo[lang] || viewInfo.zh;
                th.setAttribute('data-en', viewInfo.en);
            } else {
                th.textContent = '查看';
                th.setAttribute('data-en', 'View');
            }
        } else {
            const headerInfo = matchingRows[0].tableData.row1[header];
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
                const info = headerDisplayNames[header] || { zh: header, en: header };
                th.textContent = info[lang];
                th.setAttribute('data-en', info.en);
            }
        }
        
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 表体
    const tbody = document.createElement('tbody');
    
    matchingRows.forEach(({rowData}) => {
        const tr = document.createElement('tr');
        
        headers.forEach(header => {
            const td = document.createElement('td');
            
            if (header === 'view') {
                const button = document.createElement('button');
                button.className = 'custom-button';
                button.style.whiteSpace = 'nowrap';
                
                const viewInfo = matchingRows[0].tableData.row1.view;
                if (typeof viewInfo === 'object') {
                    button.textContent = viewInfo[lang] || viewInfo.zh;
                    button.setAttribute('data-en', viewInfo.en);
                } else {
                    button.textContent = '查看';
                    button.setAttribute('data-en', 'View');
                }
                
                if (rowData.path) {
                    if (rowData.path.endsWith('.py') || rowData.path.endsWith('.cpp')) {
                        const nameObj = rowData.name;
                        const title = typeof nameObj === 'object' ? nameObj[lang] : nameObj;
                        const encodedTitle = encodeURIComponent(title);
                        const url = `/code.html?title=${encodedTitle}&file=${rowData.path}`;
                        button.onclick = function() { openPage(url); };
                    } else {
                        button.onclick = function() { openPage(rowData.path); };
                    }
                }
                
                td.appendChild(button);
            } else {
                const cellData = rowData[header];
                let cellText = '';
                
                if (typeof cellData === 'object') {
                    cellText = cellData[lang] || cellData.zh || '';
                } else {
                    cellText = String(cellData || '');
                }
                
                // 高亮搜索词
                td.innerHTML = highlightText(cellText, searchTerm);
                
                // 保留翻译属性
                if (typeof cellData === 'object' && cellData.en) {
                    td.setAttribute('data-en', cellData.en);
                }
            }
            
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.style.display = 'block';
    wrapper.appendChild(table);
    
    const container = document.createElement('div');
    container.appendChild(wrapper);
    
    return container.innerHTML;
}

// 初始化搜索
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    let debounceTimer = null;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            performSearch('');
        }
        if (e.key === 'Enter') {
            clearTimeout(debounceTimer);
            performSearch(this.value);
        }
    });
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
    tables.length = 0;
    tableNames.length = 0;

    const favoriteTable = getFavoriteTableData(data);
    const displayData = favoriteTable
        ? { [favoritesTableName]: favoriteTable, ...data }
        : data;
    Object.keys(displayData).forEach(tableName => tableNames.push(tableName));

    Object.entries(displayData).forEach(([tableType, tableData], index) => {
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

// 在 createTablesFromJSON 函数内部，替换 td 创建部分

headers.forEach(header => {
    const td = document.createElement('td');

    if (header === 'view') {
        const button = document.createElement('button');
        button.className = 'custom-button';
        
        const viewInfo = tableData.row1.view;
        if (typeof viewInfo === 'object') {
            button.textContent = viewInfo[lang];
            button.setAttribute('data-en', viewInfo.en);
        } else {
            button.textContent = '查看';
            button.setAttribute('data-en', 'View');
        }

        if (rowData.path) {
            if (rowData.path.endsWith('.py') || rowData.path.endsWith('.cpp')) {
                const nameObj = rowData.name;
                const title = typeof nameObj === 'object' ? nameObj[lang] : nameObj;
                const encodedTitle = encodeURIComponent(title);
                const url = `/code.html?title=${encodedTitle}&file=${rowData.path}`;
                
                button.onclick = function() {
                    openPage(url);
                };
            } else {
                button.onclick = function() {
                    openPage(rowData.path);
                };
            }
        }

        td.appendChild(button);
    } else {
        // 获取单元格内容
        const cellData = rowData[header];
        let cellText = '';
        
        if (typeof cellData === 'object') {
            cellText = cellData[lang] || cellData.zh || '';
        } else {
            cellText = cellData || '';
        }
        
        // 判断是否是简介或备注列
        const isIntroOrNote = header === 'Introduction' || header === 'note';
        
        if (isIntroOrNote && cellText) {
            // 创建带省略号的 span
            const span = document.createElement('span');
            span.className = 'table-cell-truncate';
            span.textContent = cellText;
            
            // 设置 data-en 属性（如果有英文翻译）
            if (typeof cellData === 'object' && cellData.en) {
                span.setAttribute('data-en', cellData.en);
                span.setAttribute('data-zh', cellData.zh || '');
            } else {
                span.setAttribute('data-full', cellText);
            }
            
            // 点击弹窗显示完整内容
            span.onclick = function() {
                showCellDetail(header, cellData, lang);
            };
            
            td.appendChild(span);
        } else {
            // 普通单元格
            td.textContent = cellText;
            if (typeof cellData === 'object' && cellData.en) {
                td.setAttribute('data-en', cellData.en);
            }
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
// 显示单元格完整内容
function showCellDetail(header, cellData, lang) {
    const headerNames = {
        'Introduction': { zh: '简介', en: 'Introduction' },
        'note': { zh: '备注', en: 'Notes' }
    };
    
    const info = headerNames[header] || { zh: header, en: header };
    const headerText = lang === 'en' ? info.en : info.zh;
    
    let fullText = '';
    if (typeof cellData === 'object') {
        fullText = cellData[lang] || cellData.zh || '';
    } else {
        fullText = cellData || '';
    }
    
    Swal.fire({
        title: headerText,
        text: fullText,
        confirmButtonText: lang === 'en' ? 'Close' : '关闭'
    });
}

// HTML 转义
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}