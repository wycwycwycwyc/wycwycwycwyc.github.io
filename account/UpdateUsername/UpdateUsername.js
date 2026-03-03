function updateUsername() {
    const oldUsername = localStorage.getItem('username');
    const newUsername = document.getElementById('newUsername').value;
    const isLoggedIn = localStorage.getItem("isLoggedIn") === 'true';
    const message = document.getElementById('message');
    const usernameRegex = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
    
    if (newUsername.length > 10) {
        Swal.fire(
            getLocalizedText('用户名长度不能超过10个字符！', 'Username cannot exceed 10 characters!'),
            '',
            'error'
        );
        return;
    }

    if (!usernameRegex.test(newUsername)) {
        Swal.fire(
            getLocalizedText('用户名只能包含汉字、英文和数字！', 'Username can only contain Chinese, English letters, and numbers!'),
            '',
            'error'
        );
        return;
    }
    
    message.textContent = getLocalizedText('正在更改用户名...', 'Updating username...');
    message.style.display = 'block';
    
    if (!isLoggedIn) {
        Swal.fire(
            getLocalizedText('你还没登录!', 'You are not logged in!'),
            getLocalizedText('登录后可更改', 'Login to change username'),
            'error'
        );
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
                message.textContent = getLocalizedText('用户名更新成功！', 'Username updated successfully!');
                Swal.fire(
                    getLocalizedText('用户名更新成功！', 'Username updated successfully!'),
                    getLocalizedText('下次使用新用户名登录', 'Use your new username next time'),
                    'success'
                );
                window.location.href = '';
            } else {
                message.textContent = getLocalizedText('用户名更换失败，请换一个用户名，或稍后再试', 'Username update failed, please try a different username or try again later');
                Swal.fire(
                    getLocalizedText('用户名更换失败', 'Username update failed'),
                    getLocalizedText('请换一个用户名，或稍后再试', 'Please try a different username or try again later'),
                    'error'
                );
                message.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            message.textContent = getLocalizedText('请求失败，请稍后重试。', 'Request failed, please try again later.');
            Swal.fire(
                getLocalizedText('请求失败', 'Request failed'),
                getLocalizedText('请稍后重试。', 'Please try again later.'),
                'error'
            );
            message.style.display = 'none';
        });
}

isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
if (!isLoggedIn) {
    document.getElementById('currentUsername').textContent = getLocalizedText('未登录', 'Not logged in');
} else {
    document.getElementById('currentUsername').textContent = getLocalizedText('正在加载', 'Loading...');
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
                document.getElementById('currentUsername').textContent = localStorage.getItem('username') || getLocalizedText('未登录', 'Not logged in');
            } else {
                // 显示错误信息
                console.error(data.message);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}