function resetPassword() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        Swal.fire(
            getLocalizedText('你还没登录!', 'You are not logged in!'),
            getLocalizedText('登录后可更改', 'Login to change password'),
            'error'
        );
        window.location.href = "/account/Login/index.html"; // 假设登录页面为/account/Login/index.html
        return;
    }

    const username = localStorage.getItem('username'); // 从localStorage获取用户名
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        Swal.fire(
            getLocalizedText('新密码和确认新密码不一致!', 'New password and confirm password do not match!'),
            getLocalizedText('新密码和确认新密码不一致！', 'New password and confirm password do not match!'),
            'error'
        );
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
            Swal.fire(
                getLocalizedText('密码更改成功', 'Password changed successfully'),
                getLocalizedText('下次使用新密码登录', 'Use your new password next time'),
                'success'
            );
            window.location.href = '/settings.html';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            loadingText.style.display = 'none'; // 隐藏加载提示
            Swal.fire(
                getLocalizedText('密码更改失败', 'Password change failed'),
                getLocalizedText('请检查旧密码，或稍后重试。', 'Please check your old password or try again later.'),
                'error'
            );
        });
}