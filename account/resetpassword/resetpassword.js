            function resetPassword() {
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                if (!isLoggedIn) {
                    Swal.fire('你还没登录!', '登录后可更改', 'error');
                    window.location.href = "/account/Login/index.html"; // 假设登录页面为/account/Login/index.html
                    return;
                }

                const username = localStorage.getItem('username'); // 从localStorage获取用户名
                const oldPassword = document.getElementById('oldPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmNewPassword = document.getElementById('confirmNewPassword').value;

                if (newPassword !== confirmNewPassword) {
                    Swal.fire('新密码和确认新密码不一致!', '新密码和确认新密码不一致！', 'error');
                    return;
                }

                const loadingText = document.getElementById('loadingText');
                loadingText.style.display = 'block'; // 显示加载提示

                fetch(`${serverurl}/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        oldPassword: oldPassword,
                        newPassword: newPassword
                    })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok.');
                        }
                        return response.text();
                    })
                    .then(html => {
                        // 显示服务器返回的HTML
                        loadingText.style.display = 'none'; // 隐藏加载提示
                        Swal.fire('密码更改成功', '下次使用新密码登录', 'success');
                        window.location.href = '/settings.html';
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                        loadingText.style.display = 'none'; // 隐藏加载提示
                        Swal.fire('密码更改失败', '请检查旧密码，或稍后重试。', 'error');
                    });
            }