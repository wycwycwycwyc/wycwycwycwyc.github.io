
document.addEventListener('DOMContentLoaded', function () {
    function initSwalTheme() {
    if (typeof Swal === 'undefined') {
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
initSwalTheme();
    if (navigator.userAgent.match(/Mobile/i)) {
        // 移动设备
    
        var menu;
        document.getElementById('sidebar').style.width = '100%';
        document.getElementById("content").style.visibility = 'hidden';
        document.getElementById("content").style.marginLeft = '0';
        var sidebars = document.getElementById('sidebar');

        for (var i = 0; i < sidebars.children.length; i++) {
            // 获取子元素的id
            var childId = sidebars.children[i].id;
            // 打印子元素的id
            var button = document.createElement('button');
            button.innerHTML = getLocalizedText('返回', 'Back'); // 修改这里
            button.id = 'last'; // 设置按钮ID
            button.className = 'custom-button';
            // 设置按钮的样式
            button.style.cssText = 'position: fixed;left :0;top:-40px';
            var urlParams = new URLSearchParams(window.location.search);

            // 获取容器元素
            var container = document.getElementById(childId.replace(/-si/g, '').replace(/developers/g, 'developer'));
            button.onclick = function () {
                document.getElementById(menu).style.display = 'none';
                var type = urlParams.get('type');
                if (type == null) {
                    sidebars.classList.remove('hide');
                    document.getElementById('sidebar').style.display = 'block';
                }
            }
            // 将按钮添加到容器中

            if (childId != '') {

                container.appendChild(button);
                document.getElementById(childId.replace(/-si/g, '').replace(/developers/g, 'developer')).style.transform = 'translateY(30px)';


                document.getElementById(childId.replace(/-si/g, '').replace(/developers/g, 'developer')).style.display = 'none';
            }
        }
        if (sidebars) {
            // 获取 sidebar 元素的所有子元素
            var children = sidebar.children;
            // 遍历每个子元素
            sidebar.addEventListener('click', function (event) {
                // 检查被点击的元素是否是sidebar的子元素
                if (event.target.id) {
                    // 获取被点击元素的id
                    var clickedId = event.target.id;
                    event.preventDefault();
                    menu = clickedId.replace(/-si/g, '').replace(/developers/g, 'developer');

                    // 先添加 hide 类来触发过渡效果
                    sidebars.classList.add('hide');

                    // 监听过渡结束事件
                    sidebars.addEventListener('transitionend', function handler() {
                        // 过渡完成后设置 display: none


                        // 移除事件监听器，避免重复触发
                        sidebars.removeEventListener('transitionend', handler);
                    }, { once: true });
                    // 显示点击的菜单项
                    var contentElement = document.getElementById('content');

                    // 定义动画效果
                    var animationStyle = {
                        animationName: 'slideInFromRight', // 动画名称
                        animationDuration: '0.5s', // 动画持续时间
                        animationTimingFunction: 'ease-out', // 动画速度曲线
                        animationFillMode: 'forwards', // 动画完成后的状态
                    };

                    // 将动画效果应用到元素上
                    Object.assign(contentElement.style, animationStyle);
                    document.getElementById(clickedId.replace(/-si/g, '').replace(/developers/g, 'developer')).style.display = 'block';
                    document.getElementById(clickedId.replace(/-si/g, '').replace(/developers/g, 'developer')).style.visibility = 'visible';
                }
            });
        }
        var urlParams = new URLSearchParams(window.location.search);
        var type = urlParams.get('type');
        if (type != null) {
            document.getElementById('last').display = 'none';
            sidebars.style.display = 'none';
            document.getElementById(type).style.visibility = 'visible';
            document.getElementById(type).style.display = 'block';


        }
    }
});
var usertabletext;

document.addEventListener('DOMContentLoaded', function () {
    var darkModeToggle = document.getElementById('darkModeToggle');
    var animationToggle = document.getElementById('animationToggle');
    var lightModeBgUrlInput = document.getElementById('lightModeBgUrl');
    var darkModeBgUrlInput = document.getElementById('darkModeBgUrl');

    // 从 localStorage 中获取设置
    var isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    var isAnimationEnabled = localStorage.getItem('animation') === 'enabled';
    var lightModeBgUrl = localStorage.getItem('lightModeBgUrl') || '';
    var darkModeBgUrl = localStorage.getItem('darkModeBgUrl') || '';

    // 初始化设置
    darkModeToggle.checked = isDarkMode;
    animationToggle.checked = isAnimationEnabled;
    lightModeBgUrlInput.value = localStorage.getItem('lightModeBgUrl1');
    darkModeBgUrlInput.value = localStorage.getItem('darkModeBgUrl1');
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('no-animation', !isAnimationEnabled);
    darkModeToggle.addEventListener('change', function () {
        isDarkMode = darkModeToggle.checked;
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        if (true) {
            localStorage.setItem('backgroundImage', "url('" + lightModeBgUrlInput.value + "')");
            localStorage.setItem('lightModeBgUrl1', lightModeBgUrlInput.value);
            localStorage.setItem('lightModeBgUrl', "url('" + lightModeBgUrlInput.value + "')");
            localStorage.setItem('backgroundImage', "url('" + darkModeBgUrlInput.value + "')");
            localStorage.setItem('darkModeBgUrl1', darkModeBgUrlInput.value);
            localStorage.setItem('darkModeBgUrl', "url('" + darkModeBgUrlInput.value + "')")
        }
        document.body.classList.toggle('dark-mode', isDarkMode);
    });
    var isDarkModeimg = document.getElementById('isDarkModeimg');
    isDarkModeimg.addEventListener('click', function isDarkModeimg() {
        isDarkMode = darkModeToggle.checked;
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        if (lightModeBgUrlInput.value == '' || darkModeBgUrlInput.value == '') {
            lightModeBgUrlInput.value = 'https://cdn.pixabay.com/photo/2023/06/16/21/13/landscape-8068793_1280.jpg';
            localStorage.setItem('backgroundImage', "url('https://cdn.pixabay.com/photo/2023/06/16/21/13/landscape-8068793_1280.jpg')");
            localStorage.setItem('lightModeBgUrl1', "https://cdn.pixabay.com/photo/2023/06/16/21/13/landscape-8068793_1280.jpg");
            localStorage.setItem('lightModeBgUrl', "url('https://cdn.pixabay.com/photo/2023/06/16/21/13/landscape-8068793_1280.jpg')");
            darkModeBgUrlInput.value = 'https://img1.wallspic.com/previews/7/4/9/3947/3947-ye_wan_de_tian_kong-wai_ceng_kong_jian-ming_xing-tian_wen_xue_dui_xiang-tian_kong-x750.jpg';
            localStorage.setItem('backgroundImage', "url('https://img1.wallspic.com/previews/7/4/9/3947/3947-ye_wan_de_tian_kong-wai_ceng_kong_jian-ming_xing-tian_wen_xue_dui_xiang-tian_kong-x750.jpg')");
            localStorage.setItem('darkModeBgUrl1', "https://img1.wallspic.com/previews/7/4/9/3947/3947-ye_wan_de_tian_kong-wai_ceng_kong_jian-ming_xing-tian_wen_xue_dui_xiang-tian_kong-x750.jpg");
        }
        else {
            if (true) {
                localStorage.setItem('backgroundImage', "url('" + lightModeBgUrlInput.value + "')");
                localStorage.setItem('lightModeBgUrl1', lightModeBgUrlInput.value);
                localStorage.setItem('lightModeBgUrl', "url('" + lightModeBgUrlInput.value + "')");
                localStorage.setItem('backgroundImage', "url('" + darkModeBgUrlInput.value + "')");
                localStorage.setItem('darkModeBgUrl1', darkModeBgUrlInput.value);
                localStorage.setItem('darkModeBgUrl', "url('" + darkModeBgUrlInput.value + "')")
            }
        }
        Qmsg.success("应用成功！");
    })
    // 切换动画
    animationToggle.addEventListener('change', function () {
        isAnimationEnabled = animationToggle.checked;
        localStorage.setItem('animation', isAnimationEnabled ? 'enabled' : 'disabled');
        document.body.classList.toggle('no-animation', !isAnimationEnabled);
    });
    // 获取之前保存的透明度值
    const savedOpacity = localStorage.getItem('opacity');
    const defaultOpacity = savedOpacity !== null ? savedOpacity : 0.3; // 默认值为0.8

    // 设置初始透明度
    const opacityRange = document.getElementById('opacityRange');
    const opacityNumber = document.getElementById('opacityNumber');
    opacityRange.value = defaultOpacity * 100;
    opacityNumber.value = defaultOpacity * 100;

    // 添加事件监听器
    opacityRange.addEventListener('input', function () {
        const opacity = opacityRange.value;
        opacityNumber.value = opacity;
        localStorage.setItem('opacity', opacity / 100);
    });

    opacityNumber.addEventListener('input', function () {
        let opacity = opacityNumber.value;

        // 限制输入的字符长度为3个
        if (opacity.length > 3) {
            opacity = opacity.slice(0, 3);
        }

        // 确保输入值在0到100之间
        if (opacity < 0) opacity = 0;
        if (opacity > 100) opacity = 100;

        // 确保输入的数字不能以0开头，除非是0本身
        if (opacity.length > 1 && opacity.startsWith('0')) {
            opacity = opacity.slice(1);
        }

        opacityNumber.value = opacity;
        opacityRange.value = opacity;
        localStorage.setItem('opacity', opacity / 100);
    });
    // 获取之前保存的模糊度值
    const savedblur = localStorage.getItem('blur');
    const defaultblur = savedblur !== null ? savedblur : 30 // 默认值为30

    // 设置初始模糊度
    const blurRange = document.getElementById('blurRange');
    const blurNumber = document.getElementById('blurNumber');
    blurRange.value = defaultblur;
    blurNumber.value = defaultblur;

    // 添加事件监听器
    blurRange.addEventListener('input', function () {
        const blur = blurRange.value;
        blurNumber.value = blur;
        localStorage.setItem('blur', blur);
    });

    blurNumber.addEventListener('input', function () {
        let blur = blurNumber.value;

        // 限制输入的字符长度为2个
        if (blur.length > 2) {
            blur = blur.slice(0, 2);
        }

        // 确保输入值在0到50之间
        if (blur < 0) blur = 0;
        if (blur > 50) blur = 50;

        // 确保输入的数字不能以0开头，除非是0本身
        if (blur.length > 1 && blur.startsWith('0')) {
            blur = blur.slice(1);
        }

        blurNumber.value = blur;
        blurRange.value = blur;
        localStorage.setItem('blur', blur);
    });
    // 检查localStorage中的登录状态
    const username = localStorage.getItem('username');
    const usernameElement = document.getElementById('username');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const sa = document.getElementById('sa');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const logout = document.getElementById('logout');
    const resetPasswordLink = document.createElement('a');
    const loginStatus = document.createElement('loginStatus');
    const email = document.getElementById('email');
    if (isLoggedIn) {
        usernameElement.innerHTML = '用户名: <a href="/account/UpdateUsername" class="user-name-text"><span>' + '正在加载' + '</span></a>';
        email.innerHTML = '用户名: <a href="/account/UpdateUsername" class="user-name-text"><span>' + '正在加载' + '</span></a>';
        let userId = localStorage.getItem('userid');
        const imageUrl = `${serverurl}/get-icon-by-id?id=${localStorage.getItem('userid')}`;
        document.getElementById('loginStatus').style.backgroundImage = `url('${imageUrl}')`;
        // 使用fetch发送POST请求到后端接口
        fetch(`${serverurl}/get-username-by-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // 显示用户名
                    console.log('用户名:', data.data.username);
                    localStorage.setItem('username', data.data.username);
                    usernameElement.innerHTML = '<span data-en="Username: ">用户名: </span><a href="/account/UpdateUsername" class="user-name-text"><span>' + username + '</span></a>';
                    // 注册新元素
                    if (window.i18n) {
                        const span = usernameElement.querySelector('span[data-en]');
                        if (span) window.i18n.register(span);
                    }
                } else {
                    // 显示错误信息
                    console.error(data.message);
                    Swal.fire({
                        title: getLocalizedText("找不到该用户，是否尝试重新登录？", "User not found, try to login again?"),
                        text: getLocalizedText("注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可", "Note: If the page is still loading, please wait"),
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: getLocalizedText("是", "Yes"),
                        cancelButtonText: getLocalizedText("否", "No")
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire(
                                getLocalizedText("正在跳转!", "Redirecting!"), 
                                getLocalizedText("正在跳转", "Redirecting"), 
                                "info"
                            );
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('username');
                            localStorage.removeItem('usertype');
                            localStorage.removeItem('userid');
                            localStorage.removeItem('developerOptionsEnabled');
                            window.location.href = '/account/Login/index.html?redirect=/settings.html';
                        } else {
                            window.location.reload();
                        }
                    })
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                    Swal.fire({
                        title: getLocalizedText("找不到该用户，是否尝试重新登录？", "User not found, try to login again?"),
                        text: getLocalizedText("注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可", "Note: If the page is still loading, please wait"),
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: getLocalizedText("是", "Yes"),
                        cancelButtonText: getLocalizedText("否", "No")
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire(
                                getLocalizedText("正在跳转!", "Redirecting!"), 
                                getLocalizedText("正在跳转", "Redirecting"), 
                                "info"
                            );
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('username');
                            localStorage.removeItem('usertype');
                            localStorage.removeItem('userid');
                            localStorage.removeItem('developerOptionsEnabled');
                            window.location.href = '/account/Login/index.html?redirect=/settings.html';
                        } else {
                            window.location.reload();
                        }
                    })
            });
        fetch(`${serverurl}/get-email-by-userid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: localStorage.getItem('userid') })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    email.innerHTML = '<span data-en="Email: ">邮箱: </span><a href="/account/UpdateEmail" class="user-name-text"><span>' + data.data.email + '</span></a>';
                    // 注册新元素
                    if (window.i18n) {
                        const span = email.querySelector('span[data-en]');
                        if (span) window.i18n.register(span);
                    }
                }
            })
            .catch(error => {
            });


        usernameElement.style.display = 'block';

        // 添加更改密码的链接
        const resetPasswordLink = document.createElement('a');
        resetPasswordLink.href = '/account/resetpassword';
        resetPasswordLink.setAttribute('data-en', 'Change Password');
        resetPasswordLink.textContent = '更改密码';
        // 注册新元素
        if (window.i18n) {
            window.i18n.register(resetPasswordLink);
        }
        resetPasswordLink.className = 'password-link';
        passwordLink.appendChild(resetPasswordLink);
        passwordLink.style.display = 'block';
    } else {
        document.getElementById('account').style.height = '100px';
        usernameElement.style.display = 'none';
        passwordLink.style.display = 'none';
        resetPasswordLink.style.display = 'none';
        sa.style.display = 'none';
        logout.style.display = 'none';
        document.getElementById('loginStatus').remove();
        document.getElementById('email').remove();
    }

    // 如果用户已登录，显示退出登录按钮
    if (isLoggedIn) {
        logoutButton.style.display = 'block';
        loginButton.style.display = 'none';

        // 添加退出登录按钮的点击事件
        logoutButton.onclick = function () {
        Swal.fire({
            title: getLocalizedText("您确定要退出登录吗？", "Are you sure you want to logout?"),
            text: getLocalizedText("这将清除你本地的登录信息", "This will clear your local login information"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: getLocalizedText("是", "Yes"),
            cancelButtonText: getLocalizedText("否", "No")
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                localStorage.removeItem('usertype');
                localStorage.removeItem('userid');
                localStorage.removeItem('developerOptionsEnabled');
                Swal.fire(
                    getLocalizedText("退出成功！", "Logout successful!"), 
                    getLocalizedText("已退出登录", "You have been logged out"), 
                    "success"
                );
                location.reload();
            }
        })
        };
    } else {
        usernameElement.style.display = 'none';
        passwordLink.style.display = 'none';
        logoutButton.style.display = 'none';
        sa.style.display = 'none';
        logout.style.display = 'none';
        // 如果未登录，设置点击事件以跳转到登录页面
        loginButton.onclick = function () {
            var loginUrl = '/account/Login/index.html?redirect=/settings.html#account'; // 替换为您的登录页面URL
            openPage(loginUrl); // 使用openPage函数进行跳转
        };
    }
});
// 跟随系统复选框功能
document.addEventListener('DOMContentLoaded', function() {
    const followSystemCheckbox = document.getElementById('followSystemCheckbox');
    
    // 初始化复选框状态
    function initCheckbox() {
        const followSystem = localStorage.getItem('followSystem');
        // 如果为空或true，都勾选上
        if (followSystem === null || followSystem === 'true') {
            // 同时应用系统当前主题
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.getElementById("darkModediaplay").style.display="none";
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }            
            followSystemCheckbox.checked = true;
        } else {
            followSystemCheckbox.checked = false;
        }
    }
    
    // 复选框变化事件
    followSystemCheckbox.addEventListener('change', function() {
        if (this.checked) {
            localStorage.setItem('followSystem', 'true');
        } else {
            localStorage.setItem('followSystem', 'false');
        }
        
        // 触发自定义事件，让主题应用代码响应变化
        const event = new Event('localStorageChanged');
        event.key = 'followSystem';
        event.newValue = this.checked ? 'true': 'false';
        this.checked ?document.getElementById("darkModediaplay").style.display="none":document.getElementById("darkModediaplay").style.display="block";
        window.dispatchEvent(event);
    });
    
    // 初始化复选框
    initCheckbox();
});

// 主题应用代码（整合版）
document.addEventListener('DOMContentLoaded', function() {
    // 应用主题函数
    function applyTheme() {
        const followSystem = localStorage.getItem('followSystem');
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        
        // 如果跟随系统
        if (followSystem === 'true') {
            // 检测系统颜色偏好
            document.getElementById("darkModediaplay").style.display="none"
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        } else {
            // 不跟随系统，使用用户手动设置
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    }
    
    // 初始化设置
    if (localStorage.getItem('followSystem') === null) {
        localStorage.setItem('followSystem', 'true');
    }
    
    // 初始应用主题
    applyTheme();
    
    // 设置系统主题变化监听
    function setupSystemThemeListener() {
        if (window.matchMedia) {
            const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
            
            const systemThemeChangeHandler = function(e) {
                const currentFollowSystem = localStorage.getItem('followSystem');
                if (currentFollowSystem === 'true') {
                    if (e.matches) {
                        document.body.classList.add('dark-mode');
                    } else {
                        document.body.classList.remove('dark-mode');
                    }
                }
            };
            
            // 移除旧的监听器（如果有）
            systemThemeMedia.removeEventListener('change', systemThemeChangeHandler);
            // 添加新的监听器
            systemThemeMedia.addEventListener('change', systemThemeChangeHandler);
        }
    }
    
    // 监听自定义的localStorage变化事件
    window.addEventListener('localStorageChanged', function(e) {
        if (e.key === 'followSystem' || e.key === 'darkMode') {
            applyTheme();
            
            if (e.key === 'followSystem') {
                if (e.newValue === 'true') {
                    // 开始跟随系统，设置系统主题监听
                    setupSystemThemeListener();
                }
            }
        }
    });
    
    // 监听原生storage事件（其他页面修改时）
    window.addEventListener('storage', function(e) {
        if (e.key === 'followSystem' || e.key === 'darkMode') {
            applyTheme();
            
            // 如果是followSystem变化，更新复选框状态
            if (e.key === 'followSystem') {
                const checkbox = document.getElementById('followSystemCheckbox');
                if (checkbox) {
                    checkbox.checked = e.newValue === 'true';
                }
                
                if (e.newValue === 'true') {
                    setupSystemThemeListener();
                }
            }
        }
    });
    
    // 初始化系统主题监听
    setupSystemThemeListener();
});
function clearDarkMode() {
    Swal.fire({
        title: getLocalizedText("确定要清除深色模式设置吗？", "Clear dark mode settings?"),
        text: getLocalizedText("确定要清除深色模式设置吗？", "Clear dark mode settings?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('darkMode');
            localStorage.removeItem('backgroundImage');
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("深色模式设置已清除", "Dark mode settings cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

// 其他 clear 函数类似修改...
function clearAnimation() {
    Swal.fire({
        title: getLocalizedText("确定要清除动画设置吗？", "Clear animation settings?"),
        text: getLocalizedText("确定要清除动画设置吗？", "Clear animation settings?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('animation');
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("动画设置已清除", "Animation settings cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

function clearglowToggle() {
    Swal.fire({
        title: getLocalizedText("确定要清除泛光设置吗？", "Clear glow settings?"),
        text: getLocalizedText("确定要清除泛光设置吗？", "Clear glow settings?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('glowEnabled');
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("泛光设置已清除", "Glow settings cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

function clearcode() {
    Swal.fire({
        title: getLocalizedText("确定要清除更好的代码显示设置吗？", "Clear code display settings?"),
        text: getLocalizedText("确定要清除更好的代码显示设置吗？", "Clear code display settings?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('isCodeVisible');
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("更好的代码显示设置已清除", "Code display settings cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

function clearVisibility() {
    Swal.fire({
        title: getLocalizedText("确定要清除可见度设置吗？", "Clear opacity settings?"),
        text: getLocalizedText("确定要清除可见度设置吗？", "Clear opacity settings?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('opacity');
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("可见度设置已清除", "Opacity settings cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

function clearFontSize() {
    Swal.fire({
        title: getLocalizedText("确定要清除字体大小设置吗？", "Clear font size settings?"),
        text: getLocalizedText("确定要清除字体大小设置吗？", "Clear font size settings?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('fontSize');
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("字体大小设置已清除", "Font size settings cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

function clearEyeCare() {
    Swal.fire({
        title: getLocalizedText("确定要清除护眼模式设置吗？", "Clear eye care settings?"),
        text: getLocalizedText("确定要清除护眼模式设置吗？", "Clear eye care settings?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('eyeCareMode');
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("护眼模式设置已清除", "Eye care settings cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

function clearBrightness() {
    Swal.fire({
        title: getLocalizedText("确定要清除亮度设置吗？", "Clear brightness settings?"),
        text: getLocalizedText("确定要清除亮度设置吗？", "Clear brightness settings?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('brightness');
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("亮度设置已清除", "Brightness settings cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

function clearLoginInfo() {
    Swal.fire({
        title: getLocalizedText("确定要清除登录信息吗？", "Clear login information?"),
        text: getLocalizedText("确定要清除登录信息吗？", "Clear login information?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('usertype');
            localStorage.removeItem('userid');
            localStorage.removeItem('developerOptionsEnabled');
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("登录信息已清除", "Login information cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

function clearAllSettings() {
    Swal.fire({
        title: getLocalizedText("确定要清除所有设置吗？", "Clear all settings?"),
        text: getLocalizedText("确定要清除所有设置吗？", "Clear all settings?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            Swal.fire(
                getLocalizedText("清除成功！", "Cleared successfully!"), 
                getLocalizedText("所有设置已清除", "All settings cleared"), 
                "success"
            );
            location.reload();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // 这里可以添加其他DOM加载完成后的初始化代码
});
function logout() {
    Swal.fire({
        title: getLocalizedText("确定要注销此用户吗？", "Delete this user?"),
        text: getLocalizedText("这将永久删除此用户在服务器和本地的所有记录。", "This will permanently delete all records of this user on server and local."),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            userId = localStorage.getItem('userid');
            fetch(`${serverurl}/delete-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userId })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertype');
                        localStorage.removeItem('userid');
                        localStorage.removeItem('developerOptionsEnabled');
                        newtable();
                        Swal.fire(
                            getLocalizedText("用户删除成功", "User deleted successfully"), 
                            getLocalizedText("此用户将不能登录", "This user will not be able to login"), 
                            "success"
                        );
                    } else {
                        Swal.fire(
                            getLocalizedText("用户删除失败", "User deletion failed"), 
                            data.message, 
                            "error"
                        );
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire(
                        getLocalizedText("用户删除失败", "User deletion failed"), 
                        getLocalizedText("删除用户时发生错误，请稍后重试。", "An error occurred while deleting user, please try again later."), 
                        "error"
                    );
                });
        }
    })
}
// 假设这是你的openPage函数
function openPage(url) {

    window.location.href = url;
}
document.addEventListener('DOMContentLoaded', function () {
    var triggers = document.querySelectorAll('.explanation-trigger');

    triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var explanationId = this.getAttribute('data-target');
            var explanation = document.getElementById(explanationId);
            explanation.style.display = explanation.style.display === 'block' ? 'none' : 'block';
        });
    });
});

function sa() {
    Swal.fire({
        title: getLocalizedText("您确定要切换账号吗", "Are you sure you want to switch accounts?"),
        text: getLocalizedText("这将清除你现在的登录信息", "This will clear your current login information"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('usertype');
            localStorage.removeItem('userid');
            localStorage.removeItem('developerOptionsEnabled');
            window.location.href = '/account/Login/index.html?redirect=/settings.html#account';
        }
    })
}
function exitdev() {
    Swal.fire({
        title: getLocalizedText("您确定要退出开发者模式吗", "Are you sure you want to exit developer mode?"),
        text: getLocalizedText("这将关闭你的开发者操作", "This will disable developer features"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('developerOptionsEnabled');
            Swal.fire(
                getLocalizedText("退出成功！", "Exited successfully!"), 
                getLocalizedText("您已退出开发者模式", "You have exited developer mode"), 
                "success"
            );
            if (navigator.userAgent.match(/Mobile/i)) {
                document.getElementById('sidebar').style.display = 'block';
            }
            document.getElementById('developer-link').style.pointerEvents = 'none';
            document.getElementById('developers').style.display = 'none';
            document.getElementById('developer').style.display = 'none';
        }
    })
}
// 定义一个全局变量来跟踪点击次数
let clickCount = 0; // 确保全局变量在脚本开始时就已定义
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
// 检查localStorage中是否有启用开发者选项的状态
function checkDeveloperOptions() {
    const developerLink = document.getElementById('developer-link');
    if (localStorage.getItem('developerOptionsEnabled') === 'true' && isLoggedIn && (localStorage.getItem('usertype') === 'superadmin' || localStorage.getItem('usertype') === 'admin')) {
        document.getElementById('developers').style.display = 'block';
        if (!navigator.userAgent.match(/Mobile/i)) {
            document.getElementById('developer').style.display = 'block';
        }
        developerLink.style.pointerEvents = 'none'; // 设置链接可点击
    }
}

// 处理按钮点击事件
function handleButtonClick() {
    clickCount++; // 增加点击次数
    if (clickCount === 10 && isLoggedIn && (localStorage.getItem('usertype') === 'superadmin' || localStorage.getItem('usertype') === 'admin')) {
        clickCount = 0; // 重置点击次数
        localStorage.setItem('developerOptionsEnabled', 'true'); // 启用开发者选项
        const developerLink = document.getElementById('developer-link');
        developerLink.removeEventListener('click', handleButtonClick); // 移除点击事件
        developerLink.style.pointerEvents = 'none'; // 设置链接不可点击
        document.getElementById('developers').style.display = 'block';
        if (!navigator.userAgent.match(/Mobile/i)) {
            document.getElementById('developer').style.display = 'block';
        }
        newtable();
        Qmsg.success(getLocalizedText("已启用开发者模式", "Developer mode enabled"));
    }
}

// 页面加载完成后添加事件监听器
document.addEventListener('DOMContentLoaded', (event) => {
    const developerLink = document.getElementById('developer-link');
    if (localStorage.getItem('developerOptionsEnabled') === 'true' && (localStorage.getItem('usertype') === 'superadmin' || localStorage.getItem('usertype') === 'admin')) {
        developerLink.addEventListener('click', handleButtonClick);
    }
    checkDeveloperOptions(); // 检查是否启用开发者选项
});

document.addEventListener('DOMContentLoaded', function () {
    var userType;
    // 检查用户名是否已存储

    let userId = localStorage.getItem('userid');
    if (isLoggedIn) {
        // 使用fetch发送POST请求到后端接口
        fetch(`${serverurl}/get-username-by-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // 显示用户名
                    console.log('用户名:', data.data.username);
                    localStorage.setItem('username', data.data.username);
                    username = localStorage.getItem('username');
                    // 创建包含用户名的JSON对象
                    const userData = {
                        username: username
                    };

                    // 使用fetch发送POST请求
                    fetch(`${serverurl}/get-user-type`, {
                        method: 'POST', // 指定请求方法为POST
                        headers: {
                            'Content-Type': 'application/json' // 设置请求头，表明发送的是JSON数据
                        },
                        body: JSON.stringify(userData) // 将userData对象转换为JSON字符串作为请求体
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('网络响应错误');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // 检查请求是否成功，并显示用户类型
                            if (data.success) {
                                usertype = data.data.userType;
                                localStorage.setItem('usertype', usertype)
                            }
                        })
                        .catch(error => {
                            // 网络或JSON解析错误
                            console.error('获取用户类型失败:', error);
                            Swal.fire("获取用户类型失败，请稍后重试。", "获取用户类型失败，请稍后重试。", "error");
                        });
                } else {
                    // 显示错误信息
                    console.error(data.message);
                    Swal.fire({
                        title: getLocalizedText("找不到该用户，是否尝试重新登录？", "User not found, try to login again?"),
                        text: getLocalizedText("注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可", "Note: If the page is still loading, please wait"),
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: getLocalizedText("是", "Yes"),
                        cancelButtonText: getLocalizedText("否", "No")
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire(
                                getLocalizedText("正在跳转!", "Redirecting!"), 
                                getLocalizedText("正在跳转", "Redirecting"), 
                                "info"
                            );
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('username');
                            localStorage.removeItem('usertype');
                            localStorage.removeItem('userid');
                            localStorage.removeItem('developerOptionsEnabled');
                            window.location.href = '/account/Login/index.html?redirect=/settings.html';
                        } else {
                            window.location.reload();
                        }
                    })
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                    Swal.fire({
                        title: getLocalizedText("找不到该用户，是否尝试重新登录？", "User not found, try to login again?"),
                        text: getLocalizedText("注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可", "Note: If the page is still loading, please wait"),
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: getLocalizedText("是", "Yes"),
                        cancelButtonText: getLocalizedText("否", "No")
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire(
                                getLocalizedText("正在跳转!", "Redirecting!"), 
                                getLocalizedText("正在跳转", "Redirecting"), 
                                "info"
                            );
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('username');
                            localStorage.removeItem('usertype');
                            localStorage.removeItem('userid');
                            localStorage.removeItem('developerOptionsEnabled');
                            window.location.href = '/account/Login/index.html?redirect=/settings.html';
                        } else {
                            window.location.reload();
                        }
                    })
            });
    }

    if (localStorage.getItem('developerOptionsEnabled') === 'true' && isLoggedIn && (localStorage.getItem('usertype') === 'superadmin' || localStorage.getItem('usertype') === 'admin')) {
        fetch(`${serverurl}/users?userid=${localStorage.getItem('userid')}`)
            .then(response => {
                if (response.status === 403) {

                }
                return response.json();
            })
            .then(data => {
                if (data && data.success) {
                    var userTableContainer = document.getElementById('userTableContainer');
                    userTableContainer.innerHTML = '';
                    createTable(data.data);
                }
            })
            .catch(error => {
                console.error('请求失败:', error);
                showError('系统繁忙，请稍后再试');
            });
    }
});
function newtable(isnewtable) {
    // 使用静态方法
    if (isnewtable === 1) {
        loading = Qmsg.loading("正在重新加载用户列表");
    }
    fetch(`${serverurl}/users?userid=${localStorage.getItem('userid')}`)
        .then(response => {
            if (response.status === 403) {

            }
            return response.json();
        })
        .then(data => {
            if (data && data.success) {
                var userTableContainer = document.getElementById('userTableContainer');
                userTableContainer.innerHTML = '';
                createTable(data.data);
                loading.close();
                Qmsg.success("用户列表加载成功");
            }
        })
        .catch(error => {
            console.error('请求失败:', error);
            showError('系统繁忙，请稍后再试');
        });
}
function createTable(users, isicon, input) {
    localStorage.setItem('users', users);
    const container = document.getElementById('userTableContainer');
    const table = document.createElement('table');
    const thead = createTableHead();
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    users.forEach((user, index) => {

        if (isicon === 1) {
            createRow(user, index, users, 1, input);
            return;
        }
        const row = createRow(user, index, users);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);
}

function createTableHead() {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [
        getLocalizedText('头像', 'Avatar'),
        getLocalizedText('用户名', 'Username'),
        getLocalizedText('邮箱', 'Email'),
        getLocalizedText('密码', 'Password'),
        getLocalizedText('用户类型', 'User Type'),
        getLocalizedText('用户ID(不可更改)', 'User ID'),
        getLocalizedText('用户数据', 'User Data'),
        getLocalizedText('操作', 'Actions'),
        getLocalizedText('切换', 'Switch')
    ];
    
    headers.forEach((text, i) => {
        const th = document.createElement('th');
        th.textContent = text;
        if (i === 0) {
            th.style.borderRadius = '10px 0 0 0';
        } if (i === 8) {
            th.style.borderRadius = '0 10px 0 0';
        }
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    return thead;
}

function createRow(user, index, users, isicon, input) {
    var userbefore = user;
    if (isicon === 1) {
        previewImagebefore(input, userbefore);
        return;
    }
    const tr = document.createElement('tr');
    const imageUrl = `${serverurl}/get-icon-by-id?id=${user.id}`;
    // 创建圆形按钮
    const buttonTd = document.createElement('td');
    const circleButton = document.createElement('button');
    circleButton.style.width = '50px';
    circleButton.style.height = '50px';
    circleButton.style.borderRadius = '50%';
    circleButton.style.backgroundColor = '#3498db';
    circleButton.style.display = 'flex';
    circleButton.style.justifyContent = 'center';
    circleButton.style.alignItems = 'center';
    circleButton.style.cursor = 'none';
    circleButton.style.fontSize = '16px';
    circleButton.style.border = 'none';
    circleButton.style.outline = 'none';
    circleButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    circleButton.style.backgroundSize = 'cover';
    circleButton.style.backgroundRepeat = 'no-repeat;'
    circleButton.style.backgroundImage = `url(${imageUrl})`;
    /* circleButton.onclick = function () {
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        });
 
        // 模拟点击事件
        document.getElementById('avatar').dispatchEvent(clickEvent);
 
    };
    */
    buttonTd.appendChild(circleButton);

    // 将圆形按钮单元格添加到行的开头
    tr.appendChild(buttonTd);
    const isCurrentUserAdmin = localStorage.getItem('usertype') === 'admin' || localStorage.getItem('usertype') === 'user';
    let isSuperAdmin = user.type === 'superadmin'; // 检查用户是否是 superadmin
    let isAndmin = user.type === 'admin'; // 检查用户是否是 admin
    Object.values(user).forEach((text, i) => {
        const td = document.createElement('td');
        if (isCurrentUserAdmin && (isSuperAdmin || isAndmin) && i !== 0 && localStorage.getItem('username') !== user.username) {
            // 如果当前用户是 admin 且用户是 superadmin，则隐藏信息（除了用户名）
            td.textContent = i === 0 || i === 3 ? text : '错误:拒绝访问';
            td.style.color = i === 0 || i === 3 ? null : 'red';
            td.style.pointerEvents = 'none'; // 使单元格不可点击
        } else {
            td.textContent = text;
        }
        tr.appendChild(td);
    });
    const switchUserIdTd = document.createElement('td');
    const switchUserIdButton = document.createElement('button');
    switchUserIdButton.textContent = '切换';
    switchUserIdButton.style.width = 'auto';
    switchUserIdButton.className = 'custom-button';
    switchUserIdButton.onclick = function () {
        storeUserId(index, users, user);
    };
    switchUserIdTd.appendChild(switchUserIdButton);
    // 添加编辑按钮和链接
    const editTd = document.createElement('td');
    const editButton = document.createElement('button');
    if (isCurrentUserAdmin && (isSuperAdmin || isAndmin) && localStorage.getItem('username') !== user.username) {
        // 如果当前用户是 admin 且正在编辑的用户是 superadmin，则禁用编辑按钮
        editButton.disabled = true;
        editButton.textContent = '不可编辑';
    } else {
        editButton.textContent = '编辑';
        editButton.style.width = 'auto';
        editButton.className = 'custom-button';
        editButton.setAttribute('id', `editButton-${user.username}`); // 给每个按钮一个唯一 ID（可选）

        // 使用闭包绑定 index，确保点击时能正确获取
        editButton.onclick = (function (idx) {
            return function () {
                editUser(idx, users); // 这里的 idx 就是创建时的 index
            };
        })(index);
    }
    editTd.appendChild(editButton);

    // 创建链接
    const customLink = document.createElement('a');
    customLink.textContent = '×';
    customLink.display = 'inline';
    customLink.style.color = 'red';
    customLink.style.fontSize = '30px';
    customLink.style.marginLeft = '10px'; // 设置右边距为10像素
    customLink.style.textDecoration = 'none'; // 去掉下划线
    if (isCurrentUserAdmin && (isSuperAdmin || isAndmin) && localStorage.getItem('username') !== user.username) {
        // 如果当前用户是 admin 且正在操作的用户是 superadmin，则禁用链接
        customLink.style.color = 'grey';
        customLink.onclick = function (event) {
            event.preventDefault(); // 阻止链接的默认行为
            Swal.fire("错误:拒绝访问", "错误:拒绝访问", "error");
        };
    } else {
        customLink.className = 'custom-link';
        const currentType = localStorage.getItem('usertype'); // 获取当前用户类型
        const newType = user.type; // 这里替换为实际的要更改的用户类型

        // 将当前用户类型和要更改的用户类型添加到 updatedUserInfo 对象中
        customLink.onclick = function () {

Swal.fire({
    title: getLocalizedText("确定要删除该用户吗？", "Delete this user?"),
    text: getLocalizedText("这个用户将无法登录", "This user will not be able to login"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: getLocalizedText("是", "Yes"),
    cancelButtonText: getLocalizedText("否", "No")
}).then((result) => {
    if (result.isConfirmed) {
        Swal.fire({
            title: getLocalizedText('正在删除', 'Deleting'),
            text: getLocalizedText('请稍候...', 'Please wait...'),
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        userId = user.id;
        fetch(`${serverurl}/delete-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: userId, currentType: currentType, newType: newType })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                newtable();
                Swal.fire("用户删除成功", "此用户将不能登录", "success");
            } else {
                Swal.fire("用户删除失败", data.message, "error");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire("删除用户时发生错误，请稍后重试。", "删除用户时发生错误，请稍后重试。", "error");
        });
    }
    // else 部分已完全移除 - 用户点击取消时不执行任何操作
})
        };
    }
    editTd.appendChild(customLink);

    tr.appendChild(editTd);
    tr.appendChild(switchUserIdTd);
    return tr;
    return;
}
function previewImagebebefore(input) {
    fetch(`${serverurl}/users${localStorage.getItem('userId')}`) // 假设后端接口是/users
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => { document.getElementById('userTableContainer').innerHTML = ''; createTable(data.data, 1, input) })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    return;
}
function previewImagebefore(input, user) {
    previewImage(input, user);
    return;
}
function previewImage(input, user) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.onload = function () {
                // 创建canvas元素
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                // 原始图片的宽高比
                var aspectRatio = img.width / img.height;

                // 根据宽高比确定压缩后的尺寸
                var targetWidth, targetHeight;
                if (aspectRatio > 1) {
                    // 宽度大于高度，按照宽度压缩
                    targetWidth = 200;
                    targetHeight = 200;
                } else if (aspectRatio < 1) {
                    // 高度大于宽度，按照高度压缩
                    targetHeight = 200;
                    targetWidth = 200;
                } else {
                    // 正方形图片，直接压缩
                    targetWidth = 200;
                    targetHeight = 200;
                }

                // 绘制压缩后的图片
                canvas.width = 200;
                canvas.height = 200;
                ctx.drawImage(img, (200 - targetWidth) / 2, (200 - targetHeight) / 2, targetWidth, targetHeight);
                var preview = document.getElementById('preview');
                preview.src = canvas.toDataURL('image/png');
                preview.style.display = 'inline';
                // 将canvas转换为DataURL并设置为预览图片的源
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        sleep(1000).then(() => {
            uploadImage(user);
        });
    }
    return;
}

function uploadImage(user) {
    var userId = user.id;
    var preview = document.getElementById('preview');
    if (!preview.src) {
        Qmsg.error('请先选择文件');
        return;
    }

    // 将DataURL转换为Blob
    fetch(preview.src)
        .then(res => res.blob())
        .then(blob => {
            if (!['image/jpeg', 'image/png'].includes(blob.type)) {
                Qmsg.error('只能上传不超过1MB的图片,格式为png或jpg');
                return;
            }

            var formData = new FormData();
            formData.append('userId', userId);

            formData.append('avatar', blob);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', `${serverurl}/upload-image`, true);

            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                }
            };

            xhr.onload = function () {
                if (xhr.status === 200) {
                    Swal.fire('图片上传成功', '你的账号头像已更新', 'success');
                    newtable();
                } else {
                    Swal.fire('图片上传失败: ', xhr.statusText, 'error');
                }
            };

            xhr.send(formData);
        })
        .catch(error => {
            console.error('Error converting image to blob', error);
            Qmsg.error('无法转换图片');
        });
    return;
}
function storeUserId(index, users, currentUser) {
    const currentUserType = localStorage.getItem('usertype');
    const targetUserId = users[index].id;
    const targetUserType = users[index].type;
    const username = users[index].username;
    
    Swal.fire({
        title: getLocalizedText("确定切换到" + username + "吗？", "Switch to " + username + "?"),
        text: getLocalizedText("可能会导致一些不可预测的问题", "This may cause unexpected issues"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
    if (result.isConfirmed) {
            // 如果当前用户是superadmin，则直接切换
            if (currentUserType === 'superadmin') {
                localStorage.setItem('userid', targetUserId);
                localStorage.setItem('username', username);
                localStorage.setItem('usertype', targetUserType);
                newtable();
                Swal.fire(
                    getLocalizedText("用户已更新", "User updated"), 
                    getLocalizedText("当前用户已更新为: " + username, "Current user updated to: " + username), 
                    "success"
                );
                location.reload();
            }
            // 如果当前用户是admin，需要进一步检查
            else if (currentUserType === 'admin') {
                // 如果目标用户是superadmin，则需要输入密码
                if (targetUserType === 'superadmin' || targetUserType === 'admin' && localStorage.getItem('username') !== username) {
                    confirmPassword(targetUserId, username, targetUserType);
                } else {
                    // 如果目标用户是user，则直接切换
                    localStorage.setItem('userid', targetUserId);
                    localStorage.setItem('username', username);
                    localStorage.setItem('usertype', targetUserType);
                    newtable();
                Swal.fire(
                    getLocalizedText("用户已更新", "User updated"), 
                    getLocalizedText("当前用户已更新为: " + username, "Current user updated to: " + username), 
                    "success"
                );
                }
            } else if (currentUserType === 'user') {
                if (targetUserType === 'superadmin' || targetUserType === 'admin') {
                    confirmPassword(targetUserI, username, targetUserType);
                } else {
                    // 如果目标用户是user，则直接切换
                    localStorage.setItem('userid', targetUserId);
                    localStorage.setItem('username', username);
                    localStorage.setItem('usertype', targetUserType);
                    newtable();
                    Swal.fire(
                        getLocalizedText("用户已更新", "User updated"), 
                        getLocalizedText("当前用户已更新为: " + username, "Current user updated to: " + username), 
                        "success"
                    );
                }

            }
            else {
                Swal.fire(
                    getLocalizedText("权限不足", "Insufficient permissions"), 
                    getLocalizedText("您没有权限执行此操作", "You do not have permission to perform this action"), 
                    "error"
                );
            }
        }
    })

}

// 密码确认函数
function confirmPassword(targetUserId, username, targetUserType) {
    Swal.fire({
        title: getLocalizedText("输入" + username + "的密码以继续", "Enter " + username + "'s password to continue"),
        text: getLocalizedText("请输入" + username + "的密码:", "Please enter " + username + "'s password:"),
        icon: "question",
        input: "password",
        inputPlaceholder: getLocalizedText("请输入密码", "Enter password"),
        showCancelButton: true,
        confirmButtonText: getLocalizedText("验证", "Verify"),
        cancelButtonText: getLocalizedText("取消", "Cancel"),
        inputValidator: (value) => {
            if (!value) {
                return getLocalizedText("密码不能为空！", "Password cannot be empty!");
            }
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            Swal.fire({
                title: getLocalizedText('正在验证', 'Verifying'),
                text: getLocalizedText('请稍候...', 'Please wait...'),
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // 发送密码到后端API进行验证
            fetch(`${serverurl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: result.value
                })
            })
            .then(response => {
                return response.text();
            })
            .then(data => {
                if (data.includes('<h1>登录成功</h1>')) {
                    localStorage.setItem('userid', targetUserId);
                    localStorage.setItem('username', username);
                    localStorage.setItem('usertype', targetUserType);
                    Swal.fire({
                        title: getLocalizedText("密码正确", "Password correct"),
                        text: getLocalizedText("当前用户已更新为: " + username, "Current user updated to: " + username),
                        icon: "success"
                    });
                } else if (data.includes('登录失败')) {
                    Swal.fire({
                        title: getLocalizedText("密码错误", "Wrong password"),
                        text: getLocalizedText("请输入正确的密码", "Please enter the correct password"),
                        icon: "error"
                    });
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
                title: getLocalizedText("已取消", "Cancelled"),
                text: getLocalizedText("操作已取消", "Operation cancelled"),
                icon: "info",
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

function editUser(index, users) {
    const user = users[index];
    const isCurrentUserAdmin = localStorage.getItem('usertype') === 'admin'; // 假设用户的角色信息存储在 role 属性中
    const isSuperAdmin = user.type === 'superadmin'; // 检查是否是 superadmin
    const tbody = document.querySelector('tbody');
    const row = tbody.children[index];
    const cells = row.querySelectorAll('td');
    const isAndmin = user.type === 'admin';
    cells.forEach((cell, i) => {
        if (i < cells.length - 2 && i !== 0) { // 排除最后一个单元格，即操作按钮的单元格
            if (isCurrentUserAdmin && (isSuperAdmin || isAndmin) && i !== 0 && i !== 3 && localStorage.getItem('username') !== user.username) {
                // 如果当前用户是 admin 且正在编辑的用户是 superadmin，则隐藏信息
                cell.innerHTML = '';
                cell.style.pointerEvents = 'none'; // 使单元格不可点击
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = cell.textContent;
                input.className = 'input_info';
                cell.innerHTML = '';
                cell.appendChild(input);
                if (i === 4) {
                    input.addEventListener('input', function () {
                        let value = this.value.toLowerCase();

                        // 提取所有 'u' 和 'a'，并按输入顺序存储
                        const validChars = [...value].filter(char => char === 'u' || char === 'a');

                        // 取最后一个有效字符决定补全内容
                        const lastChar = validChars[validChars.length - 1];

                        if (lastChar === 'u') {
                            this.value = 'user';
                        } else if (lastChar === 'a') {
                            this.value = 'admin';
                        } else {
                            this.value = ''; // 无有效字符时清空
                        }

                    });
                    input.select();
                }
                if (i === 5) {
                    input.style.pointerEvents = 'none';
                }
            }
        }
    });

    const editButton = document.getElementById(`editButton-${user.username}`);
    editButton.className = 'custom-button';
    editButton.style.width = 'auto';
    if (isCurrentUserAdmin && (isSuperAdmin || isAndmin) && localStorage.getItem('username') !== user.username) {
        // 如果当前用户是 admin 且正在编辑的用户是 superadmin，则禁用编辑按钮
        editButton.disabled = true;
        editButton.textContent = '不可编辑';
    } else {
        editButton.textContent = '提交';
        editButton.onclick = function () {
            Swal.fire({
                title: getLocalizedText("确定要更改此用户信息吗", "Update this user's information?"),
                text: getLocalizedText("确定要更改此用户信息吗", "Update this user's information?"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: getLocalizedText("是", "Yes"),
                cancelButtonText: getLocalizedText("否", "No")
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: getLocalizedText('正在更新', 'Updating'),
                        text: getLocalizedText('请稍候...', 'Please wait...'),
                        icon: 'info',
                        showConfirmButton: false,
                        timerProgressBar: true
                    });
                    submitChanges(index, users);
                }
            });
        };
    }
}

function submitChanges(index, users) {
    const tbody = document.querySelector('tbody');
    const row = tbody.children[index];
    const inputs = row.querySelectorAll('input');
    const updatedUserInfo = {};
    const user = users[index];
    inputs.forEach((input, i) => {
        const key = Object.keys(users[index])[i];
        const value = input.value.trim(); // 去除输入值的前后空格

        // 检查输入值是否为空字符串或null，如果是，则不包括在更新数据中
        if (value) {
            updatedUserInfo[key] = value;
        }
    });
    const currentType = localStorage.getItem('usertype'); // 获取当前用户类型
    const newType = user.type; // 这里替换为实际的要更改的用户类型

    // 将当前用户类型和要更改的用户类型添加到 updatedUserInfo 对象中
    updatedUserInfo['currentType'] = currentType;
    updatedUserInfo['newType'] = newType;


    // 在发送请求之前检查updatedUserInfo是否包含null值
    if (Object.values(updatedUserInfo).some(value => value === null)) {
        Swal.fire("更新失败：请确保所有字段都已填写。", "更新失败：请确保所有字段都已填写。", "error");
        return; // 如果有null值，终止函数执行
    }

    // 将 updatedUserInfo 转换为JSON字符串
    const userData = JSON.stringify(updatedUserInfo);
    
    // 发送请求到服务器
    fetch(`${serverurl}/update-user-by-id`, {
        method: 'POST', // 指定请求方法为POST
        headers: {
            'Content-Type': 'application/json' // 设置请求头，告诉服务器我们发送的是JSON数据
        },
        body: userData // 请求体为上面转换的JSON字符串
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // 解析JSON响应数据
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(data => {
            console.log('Success:', data);
            if (data.error === '用户名已被占用') {
                Swal.fire("更改失败", "用户名已被占用", "error");
            } else if (data.error === '邮箱已被占用') {
                Swal.fire("更改失败", "邮箱已被占用", "error");
            } else {
                const editButton = document.getElementById(`editButton-${user.username}`);
                editButton.textContent = '编辑';
                editButton.onclick = function () { editUser(index, users); };
                    
                newtable();
            }
            // 这里可以添加代码来处理成功的响应，例如更新表格或显示消息
            // 例如，可以在这里重新加载用户列表或更新表格的特定行
            // 例如：updateTableRow(row, data.data);
        })
        .catch(error => {
            Swal.fire("更改失败", error, "error");
            // 处理错误情况，例如显示错误消息
        });
}
function registerUserBydev() {
    var steps = [
        {
            title: getLocalizedText("创建新用户", "Create New User"),
            placeholder: getLocalizedText("用户名", "Username"),
            inputType: "text"
        },
        {
            title: getLocalizedText("邮箱", "Email"),
            placeholder: getLocalizedText("邮箱", "Email"),
            inputType: "email"
        },
        {
            title: getLocalizedText("密码", "Password"),
            placeholder: getLocalizedText("密码", "Password"),
            inputType: "password"
        },
        {
            title: getLocalizedText("用户类型", "User Type"),
            placeholder: getLocalizedText("用户类型", "User type"),
            inputType: "text"
        }
    ];

    var currentStep = 0;
    var inputs = [];

    function showStep() {
        var step = steps[currentStep];
        
        Swal.fire({
            title: step.title,
            text: getLocalizedText("请输入" + step.placeholder, "Enter " + step.placeholder),
            input: step.inputType,
            inputPlaceholder: step.placeholder,
            showCancelButton: true,
            confirmButtonText: currentStep === steps.length - 1 ? 
                getLocalizedText("注册", "Register") : getLocalizedText("下一步", "Next"),
            cancelButtonText: currentStep > 0 ? 
                getLocalizedText("上一步", "Previous") : getLocalizedText("取消", "Cancel"),
            inputValidator: (value) => {
                if (!value) {
                    return step.placeholder + getLocalizedText("不能为空！", " cannot be empty!");
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                inputs.push(result.value);
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep();
                } else {
                    Swal.fire({
                        title: getLocalizedText('正在创建', 'Creating'),
                        text: getLocalizedText('请稍候...', 'Please wait...'),
                        icon: 'info',
                        showConfirmButton: false,
                        timerProgressBar: true
                    });
                    registerUser();
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                if (currentStep > 0) {
                    currentStep--;
                    showStep();
                }
            }
        });
    }

    function registerUser() {
        var username = inputs[0];
        var email = inputs[1];
        var password = inputs[2];
        var type = inputs[3];

        if (type !== 'user' && type !== 'admin') {
            Swal.fire({
                title: getLocalizedText("用户类型只能为user或admin", "User type must be user or admin"),
                text: getLocalizedText('请重新输入', 'Please try again'),
                icon: "error"
            }).then(() => {
                currentStep = 3;
                showStep();
            });
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", `${serverurl}/register`, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var status = xhr.status;
                if (status === 201) {
                    Swal.fire({
                        title: getLocalizedText("新建成功！", "Created successfully!"),
                        text: getLocalizedText("成功新建" + username + "用户", "User " + username + " created successfully"),
                        icon: "success"
                    });
                    newtable();
                } else if (status === 409) {
                    Swal.fire(
                        getLocalizedText("注册失败", "Registration failed"), 
                        getLocalizedText("用户名已存在", "Username already exists"), 
                        "error"
                    );
                } else if (status === 408) {
                    Swal.fire(
                        getLocalizedText("注册失败", "Registration failed"), 
                        getLocalizedText("邮箱已被注册", "Email already registered"), 
                        "error"
                    );
                } else {
                    Swal.fire(
                        getLocalizedText("注册失败", "Registration failed"), 
                        getLocalizedText("请重试", "Please try again"), 
                        "error"
                    );
                }
            }
        };
        xhr.send(JSON.stringify({ username: username, email: email, password: password, type: type }));
    }

    showStep();
}
document.addEventListener('DOMContentLoaded', () => {
  // ====== 重启服务器按钮 ======
  const restartBtn = document.getElementById('restartSystemBtn');
  if (restartBtn) {
// 在 restartBtn 的事件监听中
restartBtn.addEventListener('click', () => {
    Swal.fire({
        title: getLocalizedText("确定要重启服务器吗？", "Restart server?"),
        text: getLocalizedText("这将关闭服务器上所有正在运行的程序。", "This will shut down all running programs on the server."),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: getLocalizedText("是", "Yes"),
        cancelButtonText: getLocalizedText("否", "No")
    }).then((result) => {
        if (!result.isConfirmed) return;

        Swal.fire({
            title: getLocalizedText("正在执行", "Executing"),
            text: getLocalizedText("正在发送重启指令…", "Sending restart command..."),
            icon: "info",
            showConfirmButton: false,
            timerProgressBar: true
        });

        fetch(`${serverurl}/restart-server`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operation: 'restart_system' })
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    Swal.fire(
                        getLocalizedText('已发送重启指令', 'Restart command sent'), 
                        getLocalizedText('服务器将重启', 'Server will restart'), 
                        "success"
                    );
                } else {
                    Swal.fire(
                        getLocalizedText('操作失败', 'Operation failed'), 
                        data.message || getLocalizedText('未知错误', 'Unknown error'), 
                        "error"
                    );
                }
            })
            .catch(err => {
                Swal.fire(
                    getLocalizedText('请求失败', 'Request failed'), 
                    String(err), 
                    "error"
                );
            });
    });
});
  }

  // ====== 权限显示 server 区块 ======
  const server = document.getElementById('server');
  if (server) {
    if (localStorage.getItem('usertype') === 'superadmin') {
      server.style.display = 'block';
    } else {
      server.remove();
      return; // 非 superadmin 不初始化终端
    }
  }

  // ====== 终端实现 ======
  const terminalOutput = document.getElementById('terminalOutput');
  if (!terminalOutput) return;

  const PROMPT = 'superadmin@scripthub:~#';

  let history = [];
  let historyIndex = -1; // -1 表示不在历史浏览状态
  let busy = false;

  function escapeHTML(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function scrollToBottom() {
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function addLine(text, type = 'output') {
    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;

    // 用 pre 保留换行/缩进
    line.innerHTML = `<pre class="terminal-pre">${escapeHTML(text)}</pre>`;
    terminalOutput.appendChild(line);
    scrollToBottom();
    return line;
  }

  function addCommandEcho(command) {
    const line = document.createElement('div');
    line.className = 'terminal-line cmd-echo';
    line.innerHTML = `
      <span class="terminal-prompt">${escapeHTML(PROMPT)}</span>
      <span class="terminal-echo">${escapeHTML(command)}</span>
    `;
    terminalOutput.appendChild(line);
    scrollToBottom();
  }

  function addInputRow() {
    const row = document.createElement('div');
    row.className = 'terminal-line input-row';
    row.innerHTML = `
      <span class="terminal-prompt">${escapeHTML(PROMPT)}</span>
      <input class="terminal-input" type="text" spellcheck="false" autocomplete="off" />
    `;
    terminalOutput.appendChild(row);

    const input = row.querySelector('.terminal-input');
    input.disabled = busy;

    // 点击终端任意处聚焦输入
    terminalOutput.addEventListener('mousedown', () => {
      if (!busy) input.focus();
    }, { once: true });

    input.focus();
    scrollToBottom();

    input.addEventListener('keydown', (e) => {
      if (busy) return;

      // Ctrl+L 清屏
      if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        clearScreen();
        return;
      }

      // ESC 清空当前输入
      if (e.key === 'Escape') {
        input.value = '';
        historyIndex = -1;
        return;
      }

      // 历史命令
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length === 0) return;
        if (historyIndex < history.length - 1) historyIndex++;
        input.value = history[history.length - 1 - historyIndex];
        // 光标移到末尾
        input.setSelectionRange(input.value.length, input.value.length);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (history.length === 0) return;

        if (historyIndex > 0) {
          historyIndex--;
          input.value = history[history.length - 1 - historyIndex];
        } else {
          historyIndex = -1;
          input.value = '';
        }
        input.setSelectionRange(input.value.length, input.value.length);
        return;
      }

      // Enter 执行
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = input.value;
        // 固化本行（把 input 行换成 echo）
        row.remove();
        runCommand(cmd);
      }
    });
  }

// 在 clearScreen 函数中
function clearScreen() {
    terminalOutput.innerHTML = '';
    addLine(getLocalizedText('scripthub 服务器终端', 'scripthub server terminal'), 'info');
    addLine(
        getLocalizedText(
            '输入命令并按 Enter 执行（Ctrl+L 清屏，↑/↓ 历史，exit退出并结束当前终端）', 
            'Enter commands (Ctrl+L clear, ↑/↓ history, exit to close terminal)'
        ), 
        'info'
    );
    addLine('--------------------------------', 'info');
    addInputRow();
}

  async function runCommand(command) {
    const cmd = String(command ?? '');
    addCommandEcho(cmd);

    // 空命令：直接给新提示符
    if (!cmd.trim()) {
      historyIndex = -1;
      addInputRow();
      return;
    }

    // 记录历史
    history.push(cmd);
    historyIndex = -1;

    busy = true;
    const loadingLine = addLine('执行中...', 'info');

    try {
      const resp = await fetch(`${serverurl}/execute-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });

      // 兼容非 200 但返回文本的情况
      let data;
      try {
        data = await resp.json();
      } catch {
        const t = await resp.text();
        throw new Error(`服务器返回非 JSON：${t.slice(0, 200)}`);
      }

      loadingLine.remove();

      if (data && data.success) {
        addLine(data.output ?? '', 'output');
      } else {
        addLine(data?.error || data?.message || '执行失败（未知原因）', 'error');
      }
    } catch (err) {
      loadingLine.remove();
      addLine(`网络/请求错误: ${String(err)}`, 'error');
    } finally {
      busy = false;
      addInputRow();
    }
  }

  // 初始化
  clearScreen();
});
