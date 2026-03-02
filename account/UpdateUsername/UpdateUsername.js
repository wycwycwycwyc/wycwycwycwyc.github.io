        function updateUsername() {
            const oldUsername = localStorage.getItem('username');
            const newUsername = document.getElementById('newUsername').value;
            const isLoggedIn = localStorage.getItem("isLoggedIn") === 'true';
            const message = document.getElementById('message');
            const usernameRegex = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
            if (newUsername.length > 10) {
                Swal.fire('用户名长度不能超过10个字符！', '', 'error');
                return;
            }

            if (!usernameRegex.test(newUsername)) {
                Swal.fire('用户名只能包含汉字、英文和数字！', '', 'error');
                return;
            }
            message.textContent = '正在更改用户名...';
            message.style.display = 'block';
            if (!isLoggedIn) {
                Swal.fire('你还没登录!', '登录后可更改', 'error');
                window.location.href = '/account/Login/index.html';
                return;
            }

            fetch(`${serverurl}/update-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ oldUsername, newUsername })
            })
                .then(response => {
                    if (response.ok) {
                        localStorage.setItem('username', newUsername);
                        message.textContent = '用户名更新成功！';
                        Swal.fire('用户名更新成功！', '下次使用新用户名登录', 'success');
                        window.location.href = '';
                    } else {
                        message.textContent = "用户名更换失败，请换一个用户名，或稍后再试";
                        Swal.fire('用户名更换失败，请换一个用户名，或稍后再试', '用户名更换失败，请换一个用户名，或稍后再试', 'error');
                        message.style.display = 'none';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    message.textContent = '请求失败，请稍后重试。';
                    Swal.fire('请求失败，请稍后重试。', '请求失败，请稍后重试。', 'error');
                    message.style.display = 'none';
                });
}
         isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            document.getElementById('currentUsername').textContent = '未登录';
        } else {
            document.getElementById('currentUsername').textContent = '正在加载'
            let userId = localStorage.getItem('userid');

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
                        document.getElementById('currentUsername').textContent = localStorage.getItem('username') || '未登录';
                    } else {
                        // 显示错误信息
                        console.error(data.message);
                    }
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        }       