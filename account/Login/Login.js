 // 获取URL参数
    // 获取完整的 redirect 参数（包括 # 后面的部分）
    function getRedirectUrl() {
        // 1. 获取 ?redirect= 后面的部分（不含 #）
        var paramRegex = /[?&]redirect=([^&?#]*)/;
        var paramMatch = location.href.match(paramRegex);
        var path = paramMatch ? decodeURIComponent(paramMatch[1]) : '';

        // 2. 获取 # 后面的部分（如果有）
        var hash = location.hash || '';

        // 3. 如果 redirect 参数本身包含 #（如 redirect=page.html#section），则直接返回
        if (paramMatch && paramMatch[0].includes('#')) {
            return path;
        }
        // 4. 否则，拼接 path 和 hash
        return path + hash;
    }

    // 获取跳转目标（支持 #）
    var redirectUrl = getRedirectUrl() || '';

    function isStrictEmail(input) {
        // 更严格的验证规则
        const strictEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // 额外规则检查
        return (
            typeof input === "string" &&
            strictEmailRegex.test(input) &&
            input.length <= 254 &&       // 最大长度限制
            input.split("@")[0].length <= 64 // 本地部分长度限制
        );
    }

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault(); // 阻止表单的默认提交行为

        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var errorElement = document.getElementById('error');
        var verifyingElement = document.getElementById('verifying');

        // 获取 hCaptcha 响应
        var captchaResponse = hcaptcha.getResponse();
        if (!captchaResponse) {
            errorElement.textContent = '请完成人机验证';
            errorElement.style.display = 'block';
            return;
        }

        // 显示正在验证的提示
        verifyingElement.style.display = 'block';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', `${serverurl}/login`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) { // 请求完成
                verifyingElement.textContent = '正在更新你的用户信息...'

                if (xhr.status === 200) {
                    // 登录成功
                    errorElement.textContent = '';
                    errorElement.style.display = 'none';

                    Swal.fire("登录成功！", "你将解锁更多新功能", "success");

                    if (!isStrictEmail(username)) {
                        fetch(`${serverurl}/get-user-id-by-username`, {
                            method: 'POST', // 指定请求方法
                            headers: {
                                'Content-Type': 'application/json' // 设置请求头
                            },
                            body: JSON.stringify({ username: username }) // 请求体
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json(); // 解析JSON数据
                            })
                            .then(data => {
                                // 处理返回的数据
                                if (data.success) {
                                    // 假设data.data中包含userId
                                    const userId = data.data.userId;
                                    console.log('用户ID:', userId);
                                    // 将用户ID存储在变量中
                                    var receivedUserId = userId;
                                    localStorage.setItem('username', username);
                                    localStorage.setItem('isLoggedIn', 'true');
                                    localStorage.setItem('userid', userId);
                                    Swal.fire({
                                        title: "处理信息完成",
                                        text: "跳转到目标页面",
                                        icon: "success",
                                        timer: 1500,
                                        showConfirmButton: false
                                    }).then(() => {
                                        window.location.href = redirectUrl;
                                    });
                                } else {
                                    // 显示错误信息
                                    console.log(data.message);
                                }
                            })
                            .catch(error => {
                                // 处理请求过程中的错误
                                console.error('Fetch error:', error);
                                Swal.fire("请求失败", "获取用户信息时发生错误", "error");
                            });
                    } else {
                        fetch(`${serverurl}/get-user-id-or-username-by-email`, {
                            method: 'POST', // 指定请求方法
                            headers: {
                                'Content-Type': 'application/json' // 设置请求头
                            },
                            body: JSON.stringify({ email: username }) // 请求体
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json(); // 解析JSON数据
                            })
                            .then(data => {
                                // 处理返回的数据
                                if (data.success) {
                                    // 假设data.data中包含userId
                                    const userId = data.data.userId;
                                    console.log('用户ID:', userId);
                                    // 将用户ID存储在变量中
                                    var receivedUserId = userId;
                                    username = data.data.username;
                                    localStorage.setItem('username', username);
                                    localStorage.setItem('isLoggedIn', 'true');
                                    localStorage.setItem('userid', userId);
                                    Swal.fire({
                                        title: "处理信息完成",
                                        text: "跳转到目标页面",
                                        icon: "success",
                                        timer: 1500,
                                        showConfirmButton: false
                                    }).then(() => {
                                        window.location.href = redirectUrl;
                                    });
                                } else {
                                    // 显示错误信息
                                    console.log(data.message);
                                }
                            })
                            .catch(error => {
                                // 处理请求过程中的错误
                                console.error('Fetch error:', error);
                                Swal.fire("请求失败", "获取用户信息时发生错误", "error");
                            });
                    }
                } else {
                    // 处理登录失败情况
                    var errorMessage = '登录失败';
                    switch (xhr.status) {
                        case 401:
                            errorMessage = '用户名/邮箱或密码错误';
                            break;
                        case 400:
                            errorMessage = '用户名/邮箱或密码不能为空';
                            break;
                        default:
                            errorMessage = '未知错误';
                            break;
                    }
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                    Swal.fire("登录失败", errorMessage, "error");
                }
            }
        };

        // 发送登录信息和 hCaptcha 响应
        xhr.send(JSON.stringify({
            username: username,
            password: password,
            h_captcha: captchaResponse
        }));
    });