// 设置表单的 action 属性
document.getElementById('registration_form').action = `${serverurl}/register`;

let lastSendTime = 0; // 上次发送验证码的时间
let countdown = 60; // 倒计时时间

// 初始化 hCaptcha
hcaptcha.render('.h-captcha');

// 表单提交时的验证函数
function validateForm(event) {
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("confirm_password").value;
  var verificationCode = document.getElementById("verification_code").value;
  // 新增用户名验证
  var username = document.getElementById("username").value;
  var usernameRegex = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;

  if (username.length > 10) {
    document.getElementById("error_message").innerText = getLocalizedText("用户名长度不能超过10个字符！", "Username cannot exceed 10 characters!");
    return false;
  }

  if (!usernameRegex.test(username)) {
    document.getElementById("error_message").innerText = getLocalizedText("用户名只能包含汉字、英文和数字！", "Username can only contain Chinese, English letters, and numbers!");
    return false;
  }
  // 检查密码是否一致
  if (password !== confirmPassword) {
    document.getElementById("error_message").innerText = getLocalizedText("密码和确认密码不一致！", "Password and confirm password do not match!");
    return false;
  }
  // 检查验证码是否为空
  else if (!verificationCode) {
    document.getElementById("error_message").innerText = getLocalizedText("验证码不能为空！", "Verification code cannot be empty!");
    return false;
  }

  // 检查 hCaptcha 验证是否通过
  var captchaResponse = hcaptcha.getResponse();
  if (!captchaResponse) {
    document.getElementById("error_message").innerText = getLocalizedText("请完成人机验证。", "Please complete the captcha.");
    return false;
  }

  // 阻止表单默认提交行为
  event.preventDefault();

  // 进行验证码验证
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
        getLocalizedText("请查收您的邮箱", "Please check your email"),
        "success"
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
  sendButton.innerText = getLocalizedText("剩余 ", "Wait for ") + countdown + getLocalizedText(" 秒", "");

  const intervalId = setInterval(() => {
    countdown--;
    sendButton.innerText = getLocalizedText("剩余 ", "Wait for ") + countdown + getLocalizedText(" 秒", "");
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
        // 验证码验证成功后，发送注册请求
        submitRegistration();
      } else {
        document.getElementById("error_message").innerText = getLocalizedText("验证码错误。", "Verification code error.");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById("error_message").innerText = getLocalizedText("验证码错误", "Verification code error");
    });
}

// 新增：提交注册请求的函数
function submitRegistration() {
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var type = document.getElementById("type").value;

  fetch(`${serverurl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
      type: type
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 注册成功
        Swal.fire({
          title: getLocalizedText('注册成功！', 'Registration successful!'),
          html: `
            <p>${getLocalizedText('欢迎，', 'Welcome, ')}${data.data.username}！</p>
            <p>${getLocalizedText('你的注册信息如下：', 'Your registration information:')}</p>
            <ul style="text-align: left;">
              <li>${getLocalizedText('用户名: ', 'Username: ')}<strong>${data.data.username}</strong></li>
              <li>${getLocalizedText('邮箱: ', 'Email: ')}<strong>${data.data.email}</strong></li>
              <li>${getLocalizedText('用户类型: ', 'User type: ')}<strong>${data.data.type}</strong></li>
              <li>${getLocalizedText('用户ID: ', 'User ID: ')}<strong>${data.data.id}</strong></li>
            </ul>
            <p style="color: #ff6b6b;">${getLocalizedText('请保管好你的用户ID，这是你唯一能看到的机会', 'Please save your user ID, this is the only time you will see it')}</p>
          `,
          icon: 'success',
          confirmButtonText: getLocalizedText('去登录', 'Go to Login'),
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/account/Login/index.html';
          }
        });
      } else {
        // 注册失败
        let errorMessage = data.error || getLocalizedText('注册失败', 'Registration failed');
        if (data.suggestion) {
          errorMessage += '<br><br>' + getLocalizedText('建议：', 'Suggestion: ') + data.suggestion;
        }
        Swal.fire({
          title: getLocalizedText('注册失败', 'Registration failed'),
          html: errorMessage,
          icon: 'error',
          confirmButtonText: getLocalizedText('确定', 'OK')
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire(
        getLocalizedText('注册失败', 'Registration failed'),
        getLocalizedText('网络错误，请稍后重试。', 'Network error, please try again later.'),
        'error'
      );
    });
}

// hCaptcha 验证结果回调
hcaptcha.on('verify', function (token) {
  // 可以在这里添加额外的逻辑，例如提交表单
  validateForm(event);
});

// hCaptcha 验证过期回调
hcaptcha.on('expire', function () {
  document.getElementById("error_message").innerText = getLocalizedText("人机验证已过期，请重新验证。", "Captcha expired, please verify again.");
});