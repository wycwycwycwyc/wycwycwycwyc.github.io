
document.addEventListener('DOMContentLoaded', function () {
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
            button.innerHTML = '返回'; // 设置按钮文本
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
            lightModeBgUrlInput.value = 'https://pic.vjshi.com/2021-12-30/35b7a7a382df4ef387873d042575802a/00001.jpg?x-oss-process=style/watermark';
            localStorage.setItem('backgroundImage', "url('https://pic.vjshi.com/2021-12-30/35b7a7a382df4ef387873d042575802a/00001.jpg?x-oss-process=style/watermark')");
            localStorage.setItem('lightModeBgUrl1', "https://pic.vjshi.com/2021-12-30/35b7a7a382df4ef387873d042575802a/00001.jpg?x-oss-process=style/watermark");
            localStorage.setItem('lightModeBgUrl', "url('https://pic.vjshi.com/2021-12-30/35b7a7a382df4ef387873d042575802a/00001.jpg?x-oss-process=style/watermark')");
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
        usernameElement.innerHTML = '用户名: <a href="/account/UpdateUsername.html" class="user-name-text"><span>' + '正在加载' + '</span></a>';
        email.innerHTML = '用户名: <a href="/account/UpdateUsername.html" class="user-name-text"><span>' + '正在加载' + '</span></a>';
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
                    usernameElement.innerHTML = '用户名: <a href="/account/UpdateUsername.html" class="user-name-text"><span>' + username + '</span></a>';
                } else {
                    // 显示错误信息
                    console.error(data.message);
                    swal({
                        title: "找不到该用户，是否尝试重新登录？",
                        text: "注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "是",
                        cancelButtonText: "否",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            swal("正在跳转!", "正在跳转");
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('username');
                            localStorage.removeItem('usertype');
                            localStorage.removeItem('userid');
                            localStorage.removeItem('developerOptionsEnabled');
                            window.location.href = '/account/Login.html?redirect=/settings.html';
                        } else {
                            window.location.reload();
                        }
                    })
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                swal({
                    title: "找不到该用户，是否尝试重新登录？",
                    text: "注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        swal("正在跳转!", "正在跳转");
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertype');
                        localStorage.removeItem('userid');
                        localStorage.removeItem('developerOptionsEnabled');
                        window.location.href = '/account/Login.html?redirect=/settings.html';
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
                    email.innerHTML = '邮箱: <a href="/account/UpdateEmail.html" class="user-name-text"><span>' + data.data.email + '</span></a>';
                }
            })
            .catch(error => {
            });


        usernameElement.style.display = 'block';

        // 添加更改密码的链接
        const resetPasswordLink = document.createElement('a');
        resetPasswordLink.href = '/account/resetpassword.html';
        resetPasswordLink.textContent = '更改密码';
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
            swal({
                title: "您确定要退出登录吗？",
                text: "这将清除你本地的登录信息",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是",
                cancelButtonText: "否",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('username');
                    localStorage.removeItem('usertype');
                    localStorage.removeItem('userid');
                    localStorage.removeItem('developerOptionsEnabled');
                    // 重定向到登录页面
                    swal("退出成功成功！", "已退出登录", "success");
                    location.reload();
                }
                else {
                    swal({
                        title: "正在取消",
                        text: "正在取消",
                        timer: 0,
                        showConfirmButton: false
                    })
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
            var loginUrl = '/account/Login.html?redirect=/settings.html#account'; // 替换为您的登录页面URL
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
    swal({
        title: "确定要清除深色模式设置吗？",
        text: "确定要清除深色模式设置吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('darkMode');
            localStorage.removeItem('backgroundImage');
            swal("清除成功！", "深色模式设置已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
}

function clearAnimation() {
    swal({
        title: "确定要清除动画设置吗？",
        text: "确定要清除动画设置吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('animation');
            swal("清除成功！", "动画设置已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
}

function clearglowToggle() {
    swal({
        title: "确定要清除泛光设置吗？",
        text: "确定要清除泛光设置吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('glowEnabled');
            swal("清除成功！", "泛光设置已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })

}

function clearcode() {
    swal({
        title: "确定要清除更好的代码显示设置吗？",
        text: "确定要清除更好的代码显示设置吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('isCodeVisible');
            swal("清除成功！", "更好的代码显示设置已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
}

function clearVisibility() {
    swal({
        title: "确定要清除可见度设置吗？",
        text: "确定要清除可见度设置吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('opacity');
            swal("清除成功！", "可见度设置已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })

}

function clearFontSize() {
    swal({
        title: "确定要清除字体大小设置吗？",
        text: "确定要清除字体大小设置吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('fontSize');
            swal("清除成功！", "字体大小设置已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
}

function clearEyeCare() {
    swal({
        title: "确定要清除护眼模式设置吗？",
        text: "确定要清除护眼模式设置吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('eyeCareMode');
            swal("清除成功！", "护眼模式设置已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
}

function clearBrightness() {
    swal({
        title: "确定要清除亮度设置吗？",
        text: "确定要清除亮度设置吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('brightness');
            swal("清除成功！", "亮度设置已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
}

function clearLoginInfo() {
    swal({
        title: "确定要清除登录信息吗？",
        text: "确定要清除登录信息吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('usertype');
            localStorage.removeItem('userid');
            localStorage.removeItem('developerOptionsEnabled');
            swal("清除成功！", "登录信息已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
}

function clearAllSettings() {
    swal({
        title: "确定要清除所有设置吗？",
        text: "确定要清除所有设置吗？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.clear();
            swal("清除成功！", "所有设置已清除", "success");
            location.reload();
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
}

document.addEventListener('DOMContentLoaded', function () {
    // 这里可以添加其他DOM加载完成后的初始化代码
});
function logout() {
    swal({
        title: "确定要注销此用户吗？",
        text: "这将永久删除此用户在服务器和本地的所有记录。",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            userId = localStorage.getItem('userid');
            fetch(`${serverurl}/delete-user`, {
                method: 'POST', // 指定请求方法为POST
                headers: {
                    'Content-Type': 'application/json' // 设置请求头，表明发送的是JSON数据
                },
                body: JSON.stringify({ id: userId }) // 请求体，包含要删除的用户ID
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // 解析JSON响应体
                })
                .then(data => {
                    if (data.success) {
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertype');
                        localStorage.removeItem('userid');
                        localStorage.removeItem('developerOptionsEnabled');
                        newtable();
                        swal("用户删除成功", "此用户将不能登录", "success");

                    } else {
                        swal("用户删除失败", data.message, "error");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    swal("用户删除失败", "删除用户时发生错误，请稍后重试。", "error");
                });
        } else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
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
    swal({
        title: "您确定要切换账号吗",
        text: "这将清除你现在的登录信息",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('usertype');
            localStorage.removeItem('userid');
            localStorage.removeItem('developerOptionsEnabled');
            window.location.href = '/account/Login.html?redirect=/settings.html#account';
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
}
function exitdev() {
    swal({
        title: "您确定要退出开发者模式吗",
        text: "这将关闭你的开发者操作",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            localStorage.removeItem('developerOptionsEnabled');
            swal("退出成功！", "您已退出开发者模式", "success");
            if (navigator.userAgent.match(/Mobile/i)) {
                document.getElementById('sidebar').style.display = 'block';
            }
            document.getElementById('developer-link').style.pointerEvents = 'none'; // 设置链接可点击
            document.getElementById('developers').style.display = 'none';
            document.getElementById('developer').style.display = 'none';
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
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
        Qmsg.success("已启用开发者模式");
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
                            swal("获取用户类型失败，请稍后重试。", "获取用户类型失败，请稍后重试。", "error");
                        });
                } else {
                    // 显示错误信息
                    console.error(data.message);
                    swal({
                        title: "找不到该用户，是否尝试重新登录？",
                        text: "注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "是",
                        cancelButtonText: "否",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            swal("正在跳转!", "正在跳转");
                            localStorage.removeItem('isLoggedIn');
                            localStorage.removeItem('username');
                            localStorage.removeItem('usertype');
                            localStorage.removeItem('userid');
                            localStorage.removeItem('developerOptionsEnabled');
                            window.location.href = '/account/Login.html?redirect=/settings.html';
                        } else {
                            window.location.reload();
                        }
                    })
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                swal({
                    title: "找不到该用户，是否尝试重新登录？",
                    text: "注意：如果页面未加载完成时进行操作请忽略，等待页面加载完成即可",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    closeOnConfirm: false,
                    closeOnCancel: false
                }, function (isConfirm) {
                    if (isConfirm) {
                        swal("正在跳转!", "正在跳转");
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertype');
                        localStorage.removeItem('userid');
                        localStorage.removeItem('developerOptionsEnabled');
                        window.location.href = '/account/Login.html?redirect=/settings.html';
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
    ['头像', '用户名', '邮箱', '密码', '用户类型', '用户ID(不可更改)',"用户数据", '操作', '切换'].forEach((text, i) => {
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
            swal("错误:拒绝访问", "错误:拒绝访问", "error");
        };
    } else {
        customLink.className = 'custom-link';
        const currentType = localStorage.getItem('usertype'); // 获取当前用户类型
        const newType = user.type; // 这里替换为实际的要更改的用户类型

        // 将当前用户类型和要更改的用户类型添加到 updatedUserInfo 对象中
        customLink.onclick = function () {

            swal({
                title: "确定要删除该用户吗？",
                text: "这个用户将无法登录",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是",
                cancelButtonText: "否",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    swal('正在删除');
                    userId = user.id;
                    fetch(`${serverurl}/delete-user`, {
                        method: 'POST', // 指定请求方法为POST
                        headers: {
                            'Content-Type': 'application/json' // 设置请求头，表明发送的是JSON数据
                        },
                        body: JSON.stringify({ id: userId, currentType: currentType, newType: newType }) // 请求体，包含要删除的用户ID
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json(); // 解析JSON响应体
                        })
                        .then(data => {
                            if (data.success) {
                                newtable();
                                swal("用户删除成功", "此用户将不能登录", "success");

                            } else {
                                swal("用户删除失败:", data.message, "error");
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            swal("删除用户时发生错误，请稍后重试。", "删除用户时发生错误，请稍后重试。", "error");
                        });
                }
                else {
                    swal({
                        title: "正在取消",
                        text: "正在取消",
                        timer: 0,
                        showConfirmButton: false
                    })
                }
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
                    swal('图片上传成功', '你的账号头像已更新', 'success');
                    newtable();
                } else {
                    swal('图片上传失败: ', xhr.statusText, 'error');
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
    swal({
        title: "确定切换到" + username + "吗？",
        text: "可能会导致一些不可预测的问题",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            // 如果当前用户是superadmin，则直接切换
            if (currentUserType === 'superadmin') {
                localStorage.setItem('userid', targetUserId);
                localStorage.setItem('username', username);
                localStorage.setItem('usertype', targetUserType);
                newtable();
                swal("用户已更新", "当前用户已更新为: " + username, "success");
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
                    swal("用户已更新", "当前用户已更新为: " + username, "success");
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
                    swal("用户已更新", "当前用户已更新为: " + username, "success");
                }

            }
            else {
                swal("权限不足", "您没有权限执行此操作", "error");
            }
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })

}

// 密码确认函数
function confirmPassword(targetUserId, username, targetUserType) {
    swal({
        title: "输入" + username + "的密码以继续",
        text: "请输入" + username + "的密码:",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",
        inputPlaceholder: "请输入密码"
    }, function (inputValue) {
        if (!inputValue) {
            swal.showInputError("密码不能为空");
            return false;
        }
        swal('正在验证');
        // 发送密码到后端API进行验证
        fetch(`${serverurl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: inputValue
            })
        })
            .then(response => {
                return response.text(); // 这里使用text()，因为我们预期服务器返回的是HTML文本
            })
            .then(data => {
                if (data.includes('<h1>登录成功</h1>')) {
                    localStorage.setItem('userid', targetUserId);
                    localStorage.setItem('username', username);
                    localStorage.setItem('usertype', targetUserType);
                    newtable();
                    swal("密码正确，用户已更新", "当前用户已更新为: " + username, "success");
                    location.reload();
                } else if (data.includes('登录失败')) {
                    swal("密码错误", '请输入正确的密码', 'error');
                }
            })
            .catch(error => {
                alert(error);
                swal("请求失败", "请稍后重试", "error");
            });
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
            swal({
                title: "确定要更改此用户信息吗",
                text: "确定要更改此用户信息吗",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "是",
                cancelButtonText: "否",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    swal('正在更新');
                    submitChanges(index, users);
                }
                else {
                    swal({
                        title: "正在取消",
                        text: "正在取消",
                        timer: 0,
                        showConfirmButton: false
                    })
                }
            })
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
        swal("更新失败：请确保所有字段都已填写。", "更新失败：请确保所有字段都已填写。", "error");
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
                swal("更改失败", "用户名已被占用", "error");
            } else if (data.error === '邮箱已被占用') {
                swal("更改失败", "邮箱已被占用", "error");
            } else {
                const editButton = document.getElementById(`editButton-${user.username}`);
                editButton.textContent = '编辑';
                editButton.onclick = function () { editUser(index, users); };
                swal("用户数据更新成功", "用户数据更新成功", "success");
                newtable();
            }
            // 这里可以添加代码来处理成功的响应，例如更新表格或显示消息
            // 例如，可以在这里重新加载用户列表或更新表格的特定行
            // 例如：updateTableRow(row, data.data);
        })
        .catch(error => {
            swal("更改失败", error, "error");
            // 处理错误情况，例如显示错误消息
        });
}
function registerUserBydev() {
    var steps = [
        {
            title: "创建新用户",
            placeholder: "用户名",
            type: "input"
        },
        {
            title: "邮箱",
            placeholder: "邮箱",
            type: "input"
        },
        {
            title: "密码",
            placeholder: "密码",
            type: "input"
        },
        {
            title: "用户类型",
            placeholder: "用户类型（user）",
            type: "input"
        }
    ];

    var currentStep = 0;
    var inputs = [];

    function showStep() {
        var step = steps[currentStep];
        swal({
            title: step.title,
            type: step.type,
            inputPlaceholder: step.placeholder,
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: currentStep === steps.length - 1 ? "注册" : "继续",
            cancelButtonText: currentStep > 0 ? "上一步" : "取消"
        }, function (inputValue) {
            if (inputValue === false) {
                return false;
            }
            if (inputValue === "") {
                swal.showInputError(step.placeholder + "不能为空！");
                return false;
            }
            inputs.push(inputValue);
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep();
            } else {
                swal("正在创建");
                registerUser();
            }
        });
    }

    function registerUser() {
        var username = inputs[0];
        var email = inputs[1];
        var password = inputs[2];
        var type = inputs[3]; // 默认用户类型
        if (type !== ('user' || 'admin')) {
            swal("用户类型只能为user", '由于JavaScript玄学问题,你不能创建其他用户类型，如确实需要，请在创建后更改用户类型，敬请谅解', 'error');
            return false;
        }

        // 使用 AJAX 发送数据到服务器
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `${serverurl}/register`, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var status = xhr.status;
                if (status === 201) {
                    swal({
                        title: "新建成功！",
                        text: "成功新建" + username + "用户",
                        type: "success"
                    });
                    newtable();
                } else if (status === 409) {
                    swal("注册失败", "用户名已存在", "error");
                } else if (status === 408) {
                    swal("注册失败", "邮箱已被注册", "error");
                } else {
                    swal("注册失败", "请重试", "error");
                }
            }
        };
        xhr.send(JSON.stringify({ username: username, email: email, password: password, type: type }));
    }

    showStep();
};

document.getElementById('restartSystemBtn').addEventListener('click', function () {
    swal({
        title: "确定要重启服务器吗？",
        text: "这将关闭服务器上所有正在运行的程序。",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "是",
        cancelButtonText: "否",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            swal('正在执行');
            fetch(`${serverurl}/restart-server`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ operation: 'restart_system' })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        swal('已发送重启指令', '服务器将重启', "success");
                    } else {
                        swal('操作失败: ' + data.message, "error");
                    }
                })
                .catch(error => {
                    swal('请求失败: ', "error");
                });
        }
        else {
            swal({
                title: "正在取消",
                text: "正在取消",
                timer: 0,
                showConfirmButton: false
            })
        }
    })
});
// 终端状态
let terminalHistory = [];
let historyIndex = -1;
let currentCommand = '';

// 初始化终端
function initTerminal() {
    const terminalOutput = document.getElementById('terminalOutput');

    // 清空终端
    terminalOutput.innerHTML = '';

    // 添加欢迎信息
    addTerminalLine('scripthub服务器终端', 'info');
    addTerminalLine('输入命令并按Enter执行', 'info');
    addTerminalLine('--------------------------------', 'info');

    // 添加初始提示符
    addPrompt();

    // 聚焦终端
    focusTerminal();
}

// 添加提示符
function addPrompt() {
    const terminalOutput = document.getElementById('terminalOutput');
    const line = document.createElement('div');
    line.className = 'terminal-line terminal-input-line';

    line.innerHTML = `
            <span class="terminal-prompt">superadmin@scripthub:~#</span>
            <span class="terminal-command" id="terminalCommand"></span>
            <span class="terminal-cursor"></span>
        `;

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// 添加终端行
function addTerminalLine(text, type = 'output') {
    const terminalOutput = document.getElementById('terminalOutput');
    const line = document.createElement('div');
    line.className = 'terminal-line';

    // 设置样式类
    let styleClass = 'command-output';
    if (type === 'error') {
        styleClass = 'command-error';
    } else if (type === 'info') {
        styleClass = 'command-info';
    }

    line.innerHTML = `
            <span class="${styleClass}">${text}</span>
        `;

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// 聚焦终端
function focusTerminal() {
    document.addEventListener('keydown', handleTerminalInput);
}

// 处理终端输入
function handleTerminalInput(e) {
    const terminalCommand = document.getElementById('terminalCommand');

    // 只处理可打印字符和特殊键
    if (e.key.length === 1 && e.key.charCodeAt(0) >= 32) {
        currentCommand += e.key;
        terminalCommand.textContent = currentCommand;
    } else if (e.key === 'Backspace') {
        currentCommand = currentCommand.slice(0, -1);
        terminalCommand.textContent = currentCommand;
    } else if (e.key === 'Enter') {
        executeCommand(currentCommand);
    } else if (e.key === 'ArrowUp') {
        // 上箭头 - 历史命令
        if (historyIndex < terminalHistory.length - 1) {
            historyIndex++;
            currentCommand = terminalHistory[terminalHistory.length - 1 - historyIndex];
            terminalCommand.textContent = currentCommand;
        }
    } else if (e.key === 'ArrowDown') {
        // 下箭头 - 历史命令
        if (historyIndex > 0) {
            historyIndex--;
            currentCommand = terminalHistory[terminalHistory.length - 1 - historyIndex];
            terminalCommand.textContent = currentCommand;
        } else if (historyIndex === 0) {
            historyIndex = -1;
            currentCommand = '';
            terminalCommand.textContent = '';
        }
    }

    // 滚动到底部
    const terminalOutput = document.getElementById('terminalOutput');
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// 执行命令
function executeCommand(command) {
    const terminalOutput = document.getElementById('terminalOutput');
    const commandLine = terminalOutput.lastChild;
    // 忽略空命令
    if (!command.trim()) {
        commandLine.removeChild(commandLine.lastChild);
        commandLine.innerHTML = `
            <span class="terminal-prompt">superadmin@scripthub:~#</span>
            <span class="command-output">${command}</span>
        `;
        addPrompt();
        currentCommand = '';
        return;
    }

    // 添加命令到历史
    terminalHistory.push(command);
    historyIndex = -1;

    // 显示命令

    commandLine.removeChild(commandLine.lastChild); // 移除光标
    commandLine.innerHTML = `
            <span class="terminal-prompt">superadmin@scripthub:~#</span>
            <span class="command-output">${command}</span>
        `;

    // 显示执行中状态
    addTerminalLine('执行中...', 'info');

    // 发送命令到服务器
    fetch(`${serverurl}/execute-command`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: command })
    })
        .then(response => response.json())
        .then(data => {
            // 移除"执行中..."提示
            terminalOutput.removeChild(terminalOutput.lastChild);

            if (data.success) {
                // 添加命令输出
                addTerminalLine(data.output, 'output');
            } else {
                // 添加错误信息
                addTerminalLine(data.error, 'error');
            }

            // 添加新提示符
            currentCommand = '';
            addPrompt();
        })
        .catch(error => {
            // 移除"执行中..."提示
            terminalOutput.removeChild(terminalOutput.lastChild);

            // 添加网络错误信息
            addTerminalLine(`网络错误: ${error}`, 'error');

            // 添加新提示符
            currentCommand = '';
            addPrompt();
        });
}

// 初始化终端
document.addEventListener('DOMContentLoaded', initTerminal);
server = document.getElementById('server');;
if (localStorage.getItem('usertype') === 'superadmin') {
    server.style.display = 'block';
}
else {
    server.remove();
}