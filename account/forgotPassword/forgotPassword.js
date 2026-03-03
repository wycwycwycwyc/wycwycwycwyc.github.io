let lastSendTime = 0; // 上次发送验证码的时间
let countdown = 60; // 倒计时时间

function validateForm(event) {
    var email = document.getElementById("email").value;
    var verificationCode = document.getElementById("verification_code").value;
    var newPassword = document.getElementById("new_password").value;
    var confirmPassword = document.getElementById("confirm_password").value;

    if (!verificationCode) {
        document.getElementById("error_message").innerText = getLocalizedText("验证码不能为空！", "Verification code cannot be empty!");
        return false;
    } else if (!newPassword) {
        document.getElementById("error_message").innerText = getLocalizedText("新密码不能为空！", "New password cannot be empty!");
        return false;
    } else if (newPassword !== confirmPassword) {
        document.getElementById("error_message").innerText = getLocalizedText("新密码和确认新密码不一致！", "New password and confirm password do not match!");
        return false;
    }

    event.preventDefault(); // 阻止表单提交
    document.getElementById("submit_message").style.display = "block"; // 显示正在重置的提示
    verifyCode();
}

function sendVerificationCode() {
    const sendButton = document.getElementById("send_code_button");
    sendButton.disabled = true;
    sendButton.innerText = getLocalizedText("正在发送", "Sending...");
    var email = document.getElementById("email").value;
    const currentTime = Date.now();

    // 检查是否超过1分钟
    if (currentTime - lastSendTime < 60000) {
        Swal.fire(
            getLocalizedText("请1分钟后再尝试发送验证码。", "Please wait 1 minute before requesting another code."),
            getLocalizedText("请1分钟后再尝试发送验证码。", "Please wait 1 minute before requesting another code."),
            'error'
        );
        sendButton.disabled = false;
        sendButton.innerText = getLocalizedText("发送验证码", "Send Code");
        return;
    }

    fetch(`${serverurl}/send-verification-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            Swal.fire(
                getLocalizedText('验证码发送成功', 'Verification code sent successfully'),
                getLocalizedText('请查收您的邮箱', 'Please check your email'),
                'success'
            );
            sendButton.innerText = getLocalizedText("发送成功", "Sent");
            lastSendTime = Date.now(); // 更新发送时间
            disableSendButton();
        })
        .catch(error => {
            console.error('Error:', error);
            sendButton.disabled = false;
            sendButton.innerText = getLocalizedText("发送验证码", "Send Code");
            Swal.fire(
                getLocalizedText('验证码发送失败', 'Failed to send verification code'),
                getLocalizedText('请检查你的邮箱地址，或稍后重试。', 'Please check your email address or try again later.'),
                'error'
            );
        });
}

function disableSendButton() {
    const sendButton = document.getElementById("send_code_button");
    sendButton.disabled = true;
    sendButton.innerText = getLocalizedText("剩余 ", "Remaining ") + countdown + getLocalizedText(" 秒", "s");

    const intervalId = setInterval(() => {
        countdown--;
        sendButton.innerText = getLocalizedText("剩余 ", "Wait for") + countdown + getLocalizedText(" 秒", "");
        if (countdown === 0) {
            clearInterval(intervalId);
            sendButton.innerText = getLocalizedText("发送验证码", "Send Code");
            countdown = 60; // 倒计时时间
            sendButton.disabled = false;
        }
    }, 1000);
}

function verifyCode() {
    var email = document.getElementById("email").value;
    var code = document.getElementById("verification_code").value;

    fetch(`${serverurl}/verify-code`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, code: code })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            if (data === '验证码验证成功。') {
                resetPassword();
            } else {
                document.getElementById("error_message").innerText = getLocalizedText("验证码错误。", "Verification code error.");
                document.getElementById("submit_message").style.display = "none"; // 隐藏正在重置的提示
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("error_message").innerText = getLocalizedText("验证码错误", "Verification code error");
            document.getElementById("submit_message").style.display = "none"; // 隐藏正在重置的提示
        });
}

function resetPassword() {
    var email = document.getElementById("email").value;
    var newPassword = document.getElementById("new_password").value;

    fetch(`${serverurl}/reset-password-by-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, newPassword: newPassword })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            Swal.fire(
                getLocalizedText("重置密码成功！", "Password reset successful!"),
                getLocalizedText("你可以改用新密码登录", "You can now login with your new password"),
                'success'
            );
            document.getElementById("submit_message").style.display = "none"; // 隐藏正在重置的提示
            window.location.href = '';
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire(
                getLocalizedText('重置密码失败', 'Password reset failed'),
                getLocalizedText('请稍后重试', 'Please try again later'),
                'error'
            );
            document.getElementById("submit_message").style.display = "none"; // 隐藏正在重置的提示
        });
}