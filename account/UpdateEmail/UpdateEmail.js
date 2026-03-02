            function disableSendButton() {
                countdown = 60;
                const sendButton = document.getElementById("sendCodeBtn");
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

            document.getElementById('sendCodeBtn').onclick = async function () {
                const sendButton = document.getElementById("sendCodeBtn");
                sendButton.disabled = true;
                sendButton.innerText = "正在发送";
                const email = document.getElementById('email').value;

                const sendCodeResponse = await fetch(`${serverurl}/send-verification-code`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                const sendCodeText = await sendCodeResponse.text();

                if (sendCodeResponse.ok) {
                    disableSendButton();
                    Swal.fire(sendCodeText, '请查看你的新邮箱的验证码邮件', 'success'); // 直接显示文本响应
                } else {
                    sendButton.innerText = "发送验证码";
                    countdown = 60; // 倒计时时间
                    sendButton.disabled = false;
                    Swal.fire('验证码发送失败：', sendCodeText, 'error');
                }
            };

            document.querySelector('.container button[type="submit"]').onclick = async function (event) {
                event.preventDefault();

                const username = localStorage.getItem('username');
                const password = document.getElementById('password').value;
                const email = document.getElementById('email').value;
                const verificationCode = document.getElementById('verificationCode').value;

                // 调用登录接口
                const loginResponse = await fetch(`${serverurl}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                const loginHtml = await loginResponse.text();

                if (loginResponse.ok) {
                    Swal.fire('正在验证密码');
                    // 登录成功，验证验证码
                    const verifyCodeResponse = await fetch(`${serverurl}/verify-code`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email: email, code: verificationCode })

                    });
                    const verifyCodeData = await verifyCodeResponse.text();

                    if (verifyCodeResponse.ok) {
                        // 验证码验证成功，更新邮箱
                        Swal.fire('正在更新邮箱');
                        const updateEmailResponse = await fetch(`${serverurl}/update-email`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ userId: localStorage.getItem('userid'), newEmail: email })
                        });
                        const updateEmailData = await updateEmailResponse.json();

                        if (updateEmailData.success) {
                            Swal.fire('邮箱更新成功！', '你的账户将使用新的邮箱', 'success');
                            location.href = '/settings.html';
                        } else {
                            Swal.fire('邮箱更新失败：', updateEmailData.message, 'error');
                        }
                    } else {
                        Swal.fire('验证码错误', '', 'error');
                    }
                } else {
                    Swal.fire('密码错误', '', 'error');
                }
            };