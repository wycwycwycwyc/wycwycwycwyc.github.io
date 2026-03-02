            let lastSendTime = 0; // 上次发送验证码的时间
            let countdown = 60; // 倒计时时间

            function validateForm(event) {
                var email = document.getElementById("email").value;
                var verificationCode = document.getElementById("verification_code").value;
                var newPassword = document.getElementById("new_password").value;
                var confirmPassword = document.getElementById("confirm_password").value;

                if (!verificationCode) {
                    document.getElementById("error_message").innerText = "验证码不能为空！";
                    return false;
                } else if (!newPassword) {
                    document.getElementById("error_message").innerText = "新密码不能为空！";
                    return false;
                } else if (newPassword !== confirmPassword) {
                    document.getElementById("error_message").innerText = "新密码和确认新密码不一致！";
                    return false;
                }

                event.preventDefault(); // 阻止表单提交
                document.getElementById("submit_message").style.display = "block"; // 显示正在重置的提示
                verifyCode();
            }

            function sendVerificationCode() {
                const sendButton = document.getElementById("send_code_button");
                sendButton.disabled = true;
                sendButton.innerText = "正在发送";
                var email = document.getElementById("email").value;
                const currentTime = Date.now();

                // 检查是否超过1分钟
                if (currentTime - lastSendTime < 60000) {
                    Swal.fire("请1分钟后再尝试发送验证码。", "请1分钟后再尝试发送验证码。", 'error');
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
                        Swal.fire('验证码发送成功', '请查收您的邮箱', 'success');
                        sendButton.innerText = "发送成功";
                        lastSendTime = Date.now(); // 更新发送时间
                        disableSendButton();
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        sendButton.disabled = false;
                        sendButton.innerText = "发送验证码";
                        Swal.fire('验证码发送失败','请检查你的邮箱地址，或稍后重试。','error');
                    });
            }

            function disableSendButton() {
                const sendButton = document.getElementById("send_code_button");
                sendButton.disabled = true;
                sendButton.innerText = "剩余 " + countdown + " 秒";

                const intervalId = setInterval(() => {
                    countdown--;
                    sendButton.innerText = "剩余 " + countdown + " 秒";
                    if (countdown === 0) {
                        clearInterval(intervalId);
                        sendButton.innerText = "发送验证码";
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
                            document.getElementById("error_message").innerText = "验证码错误。";
                            document.getElementById("submit_message").style.display = "none"; // 隐藏正在重置的提示
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        document.getElementById("error_message").innerText = "验证码错误";
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
                        Swal.fire("重置密码成功！",'你可以改用新密码登录','success');
                        document.getElementById("submit_message").style.display = "none"; // 隐藏正在重置的提示
                        window.location.href = '';
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        Swal.fire('重置密码失败','请稍后重试','error');
                        document.getElementById("submit_message").style.display = "none"; // 隐藏正在重置的提示
                    });
            }