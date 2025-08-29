const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto'); // 引入加密模块来生成随机字符串
const nodemailer = require('nodemailer');
const { spawn } = require('child_process');
const app = express();
const PORT = 3000;

app.use(cors()); // 允许所有跨源请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const multer = require('multer');
// 定义一个函数来删除以特定前缀开头的文件
function deleteFilesWithPrefix(directory, prefix) {
    fs.readdirSync(directory).forEach(file => {
        if (file.startsWith(prefix)) {
            fs.unlinkSync(path.join(directory, file));
        }
    });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const iconDir = 'icons';
        if (!fs.existsSync(iconDir)) {
            fs.mkdirSync(iconDir);
        }
        cb(null, iconDir);
    },
    filename: function (req, file, cb) {
        const userId = req.body.userId;
        const fileExt = path.extname(file.originalname).toLowerCase();

        // 删除icons目录下所有以userId开头的文件
        deleteFilesWithPrefix('icons', userId);

        // 设置新的文件名并调用回调
        cb(null, `${userId}${fileExt}`);
    }
});

const upload = multer({ storage: storage });

const verificationCodes = {};

// 读取现有的用户列表
let users = [];
const userFilePath = path.join(__dirname, 'users.xlsx');
if (fs.existsSync(userFilePath)) {
    const workbook = xlsx.readFile(userFilePath);
    const sheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[sheetName];
    users = xlsx.utils.sheet_to_json(workSheet);
    // 确保每个用户都有customData字段
    users = users.map(user => ({
        username: user.username,
        email: user.email,
        password: user.password,
        type: user.type,
        id: user.id,
        customData: user.customData || '' // 添加自定义数据字段
    }));
} else {
    users = [];
}
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

// 启动子进程，执行命令
const child = spawn('ssh', ['-o', 'ServerAliveInterval=60', '-R', 'jbcfz.serveo.net:80:localhost:3000', 'serveo.net']);

// 监听标准输出
child.stdout.on('data', (data) => {
    console.log(`${data}`);
});

// 监听标准错误
child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

// 监听子进程关闭事件
child.on('close', (code) => {
    console.log(`子进程退出，退出码：${code}`);
});
// 注册用户
app.post('/register', (req, res) => {
    const { username, email, password, type } = req.body;
    if (!username || !email || !password || !type) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>注册失败</title>
            </head>
            <body>
                <h1>注册失败</h1>
                <p>用户名、邮箱、密码和用户类型不能为空。</p>
            </body>
            </html>
        `);
    }

    // 检查用户名是否已存在
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>注册失败</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* 使用视口高度 */
        }
        .container {
            width: 80%;
            max-width: 600px; /* 最大宽度 */
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #333;
        }
        p {
            color: #666;
        }
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        li {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 4px;
        }
        li strong {
            color: #333;
        }
        .button {
            display: block;
            width: 97%;
            padding: 10px;
            background-color: #007BFF;
            color: white;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>注册失败</h1>
        <p>原因：用户名已存在。</p>
        <p>解决办法：换一个用户名。</p>
        <a href="https://wycwycwycwyc.github.io/Register.html" class="button">重新注册</a>
    </div>
</body>
</html>
        `);
    }

    // 检查邮箱是否已存在
    const existingEmail = users.find(user => user.email === email);
    if (existingEmail) {
        return res.status(408).send(`
 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>注册失败</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* 使用视口高度 */
        }
        .container {
            width: 80%;
            max-width: 600px; /* 最大宽度 */
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #333;
        }
        p {
            color: #666;
        }
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        li {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 4px;
        }
        li strong {
            color: #333;
        }
        .button {
            display: block;
            width: 97%;
            padding: 10px;
            background-color: #007BFF;
            color: white;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>注册失败</h1>
        <p>原因：邮箱已被注册。</p>
        <p>解决办法：换一个邮箱注册，或使用这个邮箱的账号登录。</p>
        <a href="https://wycwycwycwyc.github.io/Register.html" class="button">重新注册</a>
    </div>
</body>
</html>
        `);
    }

    // 生成用户ID
    const randomString = crypto.randomBytes(15).toString('hex');
    const id = `scripthub_user_${randomString}`;

    // 添加新用户
    const newUser = { 
    username, 
    email, 
    password, 
    type, 
    id, 
    customData: '' // 初始化自定义数据为空
    };
    users.push(newUser);

    // 将用户列表写入Excel文件
    const worksheet = xlsx.utils.json_to_sheet(users, { header: ["username", "email", "password", "type", "id"] });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '用户列表');
    xlsx.writeFile(workbook, userFilePath);

    // 发送HTML页面
    res.status(201).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>注册成功</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* 使用视口高度 */
        }
        .container {
            width: 80%;
            max-width: 600px; /* 最大宽度 */
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            color: #333;
        }
        p {
            color: #666;
        }
        ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        li {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 4px;
        }
        li strong {
            color: #333;
        }
        .button {
            display: block;
            width: 97%;
            padding: 10px;
            background-color: #007BFF;
            color: white;
            text-align: center;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>注册成功</h1>
        <p>欢迎，${username}！</p>
        <p>你的注册信息如下：</p>
        <ul>
            <li>用户名: <strong>${username}</strong></li>
            <li>邮箱: <strong>${email}</strong></li>
            <li>用户类型: <strong>${type}</strong></li>
            <li>用户ID: <strong>${id}</strong></li>
            <p>请保管好你的用户ID，你再也看不到它了</p>
        </ul>
        <a href="https://wycwycwycwyc.github.io/Login.html" class="button">去登录</a>
    </div>
</body>
</html>
    `);
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>登录失败</title>
            </head>
            <body>
                <h1>登录失败</h1>
                <p>用户名和密码不能为空。</p>
            </body>
            </html>
        `);
    }

    // 尝试通过用户名查找用户
    let user = users.find(user => user.username === username && user.password === password) || users.find(user => user.email === username && user.password === password);

    if (user) {
        res.status(200).send(`
<h1>登录成功</h1>
        `);
    } else {
        res.status(401).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>登录失败</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 50px;
                    }
                    .error-box {
                        background: #f2dede;
                        border: 1px solid #ebccd1;
                        border-radius: 5px;
                        padding: 20px;
                        max-width: 500px;
                        margin: 0 auto;
                    }
                </style>
            </head>
            <body>
                <div class="error-box">
                    <h1>⚠️ 登录失败</h1>
                    <p>用户名/邮箱或密码错误</p>
                    <p>可能原因：</p>
                    <ul style="text-align: left; margin-left: 20%;">
                        <li>• 输入了错误的登录凭证</li>
                        <li>• 账号尚未注册</li>
                        <li>• 系统出现异常</li>
                    </ul>
                </div>
            </body>
            </html>
        `);
    }
});
app.post('/send-verification-code', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send('邮箱地址不能为空。');
    }

    // 生成6位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000);
    console.log(`Generated code for ${email}: ${code}`);

    // 存储验证码和当前时间戳
    verificationCodes[email] = {
        code: code,
        timestamp: Date.now()
    };

    // 创建SMTP客户端
    let transporter = nodemailer.createTransport({
        service: '163', // 使用的邮箱服务
        host: 'smtp.163.com',
        port: 465, // SMTP 端口
        secure: true, // 使用 SSL
        auth: {
            user: 'w3803002032@163.com', // 发件人邮箱账号
            pass: 'WMMDIIGYSPSBNZJL' // 发件人邮箱的应用专用密码
        }
    });

    // 邮件内容
    let mailOptions = {
        from: '"脚本存放站验证码服务" <w3803002032@163.com>', // 发件人地址
        to: email, // 收件人地址
        subject: '您的验证码', // 邮件主题
        text: `[脚本存放站]欢迎使用脚本存放站！\n\n您的验证码是: ${code}\n\n（验证码5分钟内有效）`, // 邮件正文
        html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>您的验证码</title>
    <style>
body {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    min-height: 100vh; /* 确保至少为视口高度 */
    margin: 0;
    padding: 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background-color: #e9ecef;
}

.container {
    width: 360px; /* 可以根据需要调整宽度 */
    padding: 30px;
    background: white;
    border-radius: 8px;
margin: 0 auto; /* 水平居中 */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
}

h1 {
    color: #333;
    font-size: 28px; /* 增大字体大小 */
    margin-bottom: 30px; /* 增大间距 */
}

p {
    color: #666;
    font-size: 18px;
    line-height: 1.6;
    margin-bottom: 15px; /* 增大间距 */
}

.strong {
    color: #3498db; /* 更换颜色 */
    font-weight: bold;
    display: inline-block; /* 改为内联块，以适应文本样式 */
    padding: 5px 10px; /* 添加内边距 */
    border-radius: 4px; /* 添加边框圆角 */
    background-color: #ecf0f1; /* 添加背景色 */
    margin: 0; /* 重置外边距 */
}

.footer {
    margin-top: 30px;
    text-align: center;
}

.footer a {
    color: #3498db; /* 链接颜色 */
    text-decoration: none; /* 去除下划线 */
    transition: color 0.3s; /* 添加颜色变化的过渡效果 */
}

.footer a:hover {
    color: #2980b9; /* 鼠标悬停时的颜色变化 */
}
    </style>
</head>
<body>
    <div class="container">
        <h1>您的验证码</h1>
        <p><strong>[脚本存放站]</strong>欢迎使用脚本存放站！</p>
        <p>您的验证码是: <span class="strong">${code}</span></p>
        <p>(验证码5分钟内有效)</p>
        <p>请保管好你的验证码，不要轻易告诉他人。</p>
        <div class="footer">
            <p>感谢你对脚本存放站的信任！</p>
            <p>如有疑问，请咨询邮箱: <a href="mailto:3803002032@qq.com" class="strong">3803002032@qq.com</a></p>
        </div>
    </div>
</body>
</html>` // 邮件正文HTML格式
    };

    // 发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('验证码发送失败，请稍后重试。');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('验证码发送成功，请查收您的邮箱。');
        }
    });
});

// 验证验证码
app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    console.log(email);
    console.log(code);
    if (!email || !code) {
        return res.status(400).send('邮箱和验证码不能为空。');
    }

    const storedCode = verificationCodes[email];
    if (!storedCode) {
        return res.status(401).send('无效的验证码。');
    }

    const currentTime = Date.now();
    if (currentTime - storedCode.timestamp > 5 * 60 * 1000) { // 5分钟转换为毫秒
        return res.status(401).send('验证码已过期。');
    }

    if (parseInt(code) === storedCode.code) {
        delete verificationCodes[email]; // 验证成功后删除验证码记录
        return res.status(200).send('验证码验证成功。');
    } else {
        return res.status(401).send('验证码错误。');
    }
});
app.post('/reset-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    if (!username || !oldPassword || !newPassword) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>重置密码失败</title>
            </head>
            <body>
                <h1>重置密码失败</h1>
                <p>用户名、旧密码和新密码不能为空。</p>
            </body>
            </html>
        `);
    }

    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(401).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>重置密码失败</title>
            </head>
            <body>
                <h1>重置密码失败</h1>
                <p>用户名不存在。</p>
            </body>
            </html>
        `);
    }

    if (user.password !== oldPassword) {
        return res.status(401).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>重置密码失败</title>
            </head>
            <body>
                <h1>重置密码失败</h1>
                <p>旧密码错误。</p>
            </body>
            </html>
        `);
    }

    // 更新密码
    user.password = newPassword;

    // 将用户列表写入Excel文件
    const worksheet = xlsx.utils.json_to_sheet(users, { header: ["username", "email", "password", "type", "id"] });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '用户列表');
    xlsx.writeFile(workbook, userFilePath);

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>重置密码成功</title>
        </head>
        <body>
            <h1>重置密码成功</h1>
            <p>密码已成功更新为新密码。</p>
        </body>
        </html>
    `);
});
app.post('/update-username', (req, res) => {
    const { oldUsername, newUsername } = req.body;
    if (!oldUsername || !newUsername) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>更改用户名失败</title>
            </head>
            <body>
                <h1>更改用户名失败</h1>
                <p>原用户名和新用户名不能为空。</p>
            </body>
            </html>
        `);
    }

    // 检查原用户名是否存在
    const user = users.find(user => user.username === oldUsername);
    if (!user) {
        return res.status(401).send(`
原用户名不存在
        `);
    }

    // 检查新用户名是否已存在
    const existingUser = users.find(user => user.username === newUsername);
    if (existingUser) {
        return res.status(409).send(`新用户名已存在
        `);
    }

    // 更新用户名
    user.username = newUsername;

    // 将用户列表写入Excel文件
    const worksheet = xlsx.utils.json_to_sheet(users, { header: ["username", "email", "password", "type", "id"] });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '用户列表');
    xlsx.writeFile(workbook, userFilePath);

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>更改用户名成功</title>
        </head>
        <body>
            <h1>更改用户名成功</h1>
            <p>用户名已成功更新为新用户名。</p>
        </body>
        </html>
    `);
});
app.post('/reset-password-by-email', (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>重置密码失败</title>
            </head>
            <body>
                <h1>重置密码失败</h1>
                <p>邮箱和新密码不能为空。</p>
            </body>
            </html>
        `);
    }

    // 查找邮箱对应的用户
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>重置密码失败</title>
            </head>
            <body>
                <h1>重置密码失败</h1>
                <p>邮箱不存在。</p>
            </body>
            </html>
        `);
    }

    // 更新密码
    user.password = newPassword;

    // 将用户列表写入Excel文件
    const worksheet = xlsx.utils.json_to_sheet(users, { header: ["username", "email", "password", "type", "id"] });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '用户列表');
    xlsx.writeFile(workbook, userFilePath);

    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>重置密码成功</title>
        </head>
        <body>
            <h1>重置密码成功</h1>
            <p>密码已成功更新为新密码。</p>
        </body>
        </html>
    `);
});
// 获取所有用户信息的接口
app.get('/users', (req, res) => {
    const { userid } = req.query;

    // 参数校验
    if (!userid) {
        return res.status(400).json({
            success: false,
            message: '用户id不能为空'
        });
    }

    // 查找请求用户
    const requestingUser = users.find(user =>
        user.id === userid
    );

    // 用户不存在时的模糊提示
    if (!requestingUser) {
        return res.status(403).json({
            success: false,
            message: '权限不足'
        });
    }

    // 获取实际用户类型
    const userType = requestingUser.type;

    // 数据过滤逻辑
    if (userType === 'superadmin') {
        // 超级管理员返回完整数据
        return res.status(200).json({
            success: true,
            data: users
        });
    }

    // 非超级管理员的数据处理
    const filteredUsers = users.map(user => {
        // 当前用户保持完整信息
        if (user.id === userid) {
            return user;
        }

        // 对管理员和超级管理员脱敏
        if (user.type === 'admin' || user.type === 'superadmin') {
            return {
                username: user.username,
                email: '错误：拒绝访问',
                password: '错误：拒绝访问',
                type: user.type,
                id: user.id
            };
        }

        // 普通用户返回完整信息
        return user;
    });

    res.status(200).json({
        success: true,
        data: filteredUsers
    });
});
// 获取用户类型接口
// 新的POST接口，用于根据用户名获取用户类型
app.post('/get-user-type', (req, res) => {
    // 解析请求体中的JSON数据
    const reqBody = req.body;
    const { username } = reqBody;

    // 检查用户名是否提供
    if (!username) {
        return res.status(400).json({
            success: false,
            message: '用户名不能为空'
        });
    }

    // 从现有的用户列表中查找用户类型
    const user = users.find(user => user.username === username);
    if (user) {
        // 如果用户存在，返回用户类型
        res.status(200).json({
            success: true,
            data: {
                userType: user.type
            }
        });
    } else {
        // 如果用户不存在，返回错误信息
        res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }
});
// 更新用户信息的接口
app.post('/update-user-by-id', (req, res) => {
    // 解析请求体中的JSON数据
    const userData = req.body;

    // 检查用户数据是否提供
    if (!userData || !userData.id) {
        return res.status(400).json({
            success: false,
            message: '用户ID不能为空'
        });
    }

    // 从现有的用户列表中根据ID查找用户
    const user = users.find(u => u.id === userData.id);
    if (!user) {
        // 如果用户不存在，返回错误信息
        return res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }
    if (userData.currentType === 'admin' && userData.newType === 'superadmin') {
        return res.status(401).json({
            success: false,
            message: '拒绝访问',
            data: { error: '拒绝访问' }
        });
    }
    // 检查用户名是否重复
    const isUsernameDuplicate = users.some(u => u.id !== userData.id && u.username === userData.username);
    if (isUsernameDuplicate) {
        return res.status(409).json({
            success: false,
            message: '用户名已被占用',
            data: { error: '用户名已被占用' }
        });
    }

    // 检查邮箱是否重复
    const isEmailDuplicate = users.some(u => u.id !== userData.id && u.email === userData.email);
    if (isEmailDuplicate) {
        return res.status(409).json({
            success: false,
            message: '邮箱已被占用',
            data: { error: '邮箱已被占用,且邮箱不能与现有用户名相同' }
        });
    }
    const isusernameEmailDuplicate = users.some(u => u.id !== userData.id && u.username === userData.email);
    if (isusernameEmailDuplicate) {
        return res.status(409).json({
            success: false,
            message: '邮箱已被占用',
            data: { error: '邮箱已被占用,且邮箱不能与现有用户名相同' }
        });
    }
    // 更新找到的用户信息，注意这里只更新除了id之外的数据
    user.username = userData.username || user.username;
    user.email = userData.email || user.email;
    user.password = userData.password || user.password;
    user.type = userData.type || user.type;

    // 将更新后的用户列表写入Excel文件
    const worksheet = xlsx.utils.json_to_sheet(users, { header: ["username", "email", "password", "type", "id"] });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '用户列表');
    xlsx.writeFile(workbook, userFilePath);

    // 发送成功响应
    res.status(200).json({
        success: true,
        message: '用户信息更新成功',
        data: { user: user }
    });
});
// 根据用户名获取用户ID的接口
app.post('/get-user-id-by-username', (req, res) => {
    // 解析请求体中的JSON数据
    const reqBody = req.body;
    const userData = reqBody;

    // 检查用户名是否提供
    if (!userData.username) {
        return res.status(400).json({
            success: false,
            message: '用户名不能为空'
        });
    }

    // 从现有的用户列表中查找用户ID
    const user = users.find(user => user.username === userData.username);
    if (user) {
        // 如果用户存在，返回用户ID
        res.status(200).json({
            success: true,
            data: {
                userId: user.id
            }
        });
    } else {
        // 如果用户不存在，返回错误信息
        res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }
});
app.post('/get-user-id-or-username-by-email', (req, res) => {
    // 解析请求体中的JSON数据
    const reqBody = req.body;
    const userData = reqBody;

    // 检查用户名是否提供
    if (!userData.email) {
        return res.status(400).json({
            success: false,
            message: '用户名不能为空'
        });
    }

    // 从现有的用户列表中查找用户ID
    const user = users.find(user => user.email === userData.email);
    if (user) {
        // 如果用户存在，返回用户ID
        res.status(200).json({
            success: true,
            data: {
                userId: user.id,
                username: user.username
            }
        });
    } else {
        // 如果用户不存在，返回错误信息
        res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }
});
// 根据用户ID获取用户名的接口
app.post('/get-username-by-id', (req, res) => {
    // 解析请求体中的JSON数据
    const reqBody = req.body;
    const { id } = reqBody;

    // 检查ID是否提供
    if (!id) {
        return res.status(400).json({
            success: false,
            message: '用户ID不能为空'
        });
    }

    // 从现有的用户列表中查找用户名
    const user = users.find(user => user.id === id);
    if (user) {
        // 如果用户存在，返回用户名
        res.status(200).json({
            success: true,
            data: {
                username: user.username
            }
        });
    } else {
        // 如果用户不存在，返回错误信息
        res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }
});
// 删除用户的接口，使用POST请求
app.post('/delete-user', (req, res) => {
    // 从请求体中获取用户ID
    const userData = req.body;
    if (userData.currentType === 'admin' && userData.newType === 'superadmin') {
        return res.status(401).json({
            success: false,
            message: '拒绝访问',
            data: { error: '拒绝访问' }
        });
    }
    // 检查用户ID是否提供
    if (!userData.id) {
        return res.status(400).json({
            success: false,
            message: '用户ID不能为空'
        });
    }

    // 找到用户ID对应的用户并从列表中删除
    const index = users.findIndex(user => user.id === userData.id);
    if (index === -1) {
        // 如果用户不存在，返回错误信息
        return res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }

    // 删除用户
    users.splice(index, 1);

    // 将更新后的用户列表写入Excel文件
    const worksheet = xlsx.utils.json_to_sheet(users, { header: ["username", "email", "password", "type", "id"] });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '用户列表');
    xlsx.writeFile(workbook, userFilePath);

    // 发送成功响应
    res.status(200).json({
        success: true,
        message: '用户删除成功'
    });
});
app.post('/restart-server', (req, res) => {
    const { operation } = req.body; // 期望的请求体包含一个操作类型

    if (!operation) {
        return res.status(400).json({
            success: false,
            message: '缺少操作指令'
        });
    }

    // 根据操作类型执行不同的命令
    switch (operation) {
        case 'restart_system':
            // 重启Windows系统
            const restartSystem = spawn('shutdown', ['/r', '/t', '0']);
            restartSystem.on('close', (code) => {
                if (code === 0) {
                    res.status(200).json({
                        success: true,
                        message: '系统正在重启'
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: '系统重启失败'
                    });
                }
            });
            break;
        default:
            res.status(400).json({
                success: false,
                message: '无效的操作指令'
            });
    }
});



// 创建一个持久的 shell 进程（全局共享）
const shellCommand = process.platform === 'win32' ? 'cmd' : '/bin/bash';
const shell = spawn(shellCommand, [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    encoding: 'utf-8'
});

let commandBuffer = '';

// 监听 shell 输出
shell.stdout.on('data', (data) => {
    commandBuffer += data;
});

shell.stderr.on('data', (data) => {
    commandBuffer += data;
});

app.post('/execute-command', (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).json({
            success: false,
            message: '命令不能为空'
        });
    }

    commandBuffer = ''; // 清空之前的输出

    // 发送命令到 shell（\n 表示执行）
    shell.stdin.write(command + '\n');

    // 等待 shell 返回数据（模拟原来的 close 事件）
    const checkOutput = setInterval(() => {
        if (commandBuffer.includes('\n')) { // 简单检测是否有输出
            clearInterval(checkOutput);
            
            // 移除命令本身（假设命令是第一行）
            let output = commandBuffer.trim();
            if (output.startsWith(command)) {
                output = output.slice(command.length).trim();
            }

            // 检查是否是错误
            const isError = output.includes('error') || 
                           output.includes('command not found') || 
                           output.includes('not recognized');

            if (isError) {
                res.status(500).json({
                    success: false,
                    message: '命令执行失败',
                    error: output
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: '命令执行成功',
                    output: output
                });
            }
        }
    }, 0);
});

app.post('/upload-image', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '没有上传文件' });
    }
    // req.file 是文件信息，req.body 包含其他请求数据
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: '缺少用户ID' });
    }
    // 图片已保存，发送成功响应
    res.status(200).json({ message: '文件上传成功' });
});
app.get('/get-icon-by-id', (req, res) => {

    const { id } = req.query;
    if (!id) {
        return res.status(400).send('缺少ID');
    }

    const iconsDir = path.join(__dirname, 'icons');
    fs.readdir(iconsDir, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('读取文件夹失败');
        }

        const matchingFile = files.find(file =>
            path.basename(file, path.extname(file)) === id
        );

        if (matchingFile) {
            const filePath = path.join(iconsDir, matchingFile);
            const extension = path.extname(matchingFile).substring(1);
            const contentType = `image/${extension}`;

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `inline; filename="${id}.${extension}"`);

            fs.createReadStream(filePath).pipe(res);
        } else {
            fs.createReadStream('icons/undefined.jpeg').pipe(res);
        }
    });
});
app.post('/get-email-by-userid', (req, res) => {
    // 从请求体中获取 userId
    const { userId } = req.body;

    // 检查 userId 是否提供
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: '用户ID不能为空'
        });
    }

    // 从现有的用户列表中查找用户邮箱
    const user = users.find(user => user.id === userId);
    if (user) {
        // 如果用户存在，返回用户邮箱
        res.status(200).json({
            success: true,
            data: {
                email: user.email
            }
        });
    } else {
        // 如果用户不存在，返回错误信息
        res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }
});
app.post('/update-email', (req, res) => {
    // 从请求体中获取 userId 和新邮箱地址
    const { userId, newEmail } = req.body;

    // 检查 userId 和新邮箱地址是否提供
    if (!userId || !newEmail) {
        return res.status(400).json({
            success: false,
            message: '用户ID和新邮箱地址不能为空'
        });
    }

    // 从现有的用户列表中查找用户
    const user = users.find(user => user.id === userId);
    if (!user) {
        // 如果用户不存在，返回错误信息
        return res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }

    // 检查新邮箱是否已被其他用户使用
    const isEmailDuplicate = users.some(u => u.id !== userId && u.email === newEmail);
    if (isEmailDuplicate) {
        return res.status(409).json({
            success: false,
            message: '新邮箱已被占用'
        });
    }

    // 更新用户的邮箱
    user.email = newEmail;

    // 将更新后的用户列表写入Excel文件
    const worksheet = xlsx.utils.json_to_sheet(users, { header: ["username", "email", "password", "type", "id"] });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '用户列表');
    xlsx.writeFile(workbook, userFilePath);

    // 发送成功响应
    res.status(200).json({
        success: true,
        message: '邮箱更新成功',
        data: { email: newEmail }
    });
});
// 上传/更新自定义数据
app.post('/update-custom-data', (req, res) => {
    const { userId, customData } = req.body;
    
    if (!userId || customData === undefined) {
        return res.status(400).json({
            success: false,
            message: '用户ID和自定义数据不能为空'
        });
    }

    // 查找用户
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }

    // 更新自定义数据
    user.customData = customData;

    // 保存到Excel
    const worksheet = xlsx.utils.json_to_sheet(users, { 
        header: ["username", "email", "password", "type", "id", "customData"] 
    });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '用户列表');
    xlsx.writeFile(workbook, userFilePath);

    res.status(200).json({
        success: true,
        message: '自定义数据更新成功'
    });
});
// 获取所有自定义数据（仅返回用户名和对应的自定义数据）
app.get('/get-all-custom-data', (req, res) => {
    const customDataList = users.map(user => ({
        username: user.username,
        customData: user.customData || ''
    }));

    res.status(200).json({
        success: true,
        data: customDataList
    });
});

// 获取所有自定义数据（仅返回用户名和对应的自定义数据）
app.get('/get-all-custom-data', (req, res) => {
    const customDataList = users.map(user => ({
        username: user.username,
        customData: user.customData || '',
        // 头像地址：/get-icon-by-id?id=用户ID
        avatarUrl: `http://${req.headers.host}/get-icon-by-id?id=${user.id}`
    }));

    res.status(200).json({
        success: true,
        data: customDataList
    });
});
// 获取单个用户的自定义数据
app.post('/get-custom-data-by-id', (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: '用户ID不能为空'
        });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: '用户未找到'
        });
    }

    res.status(200).json({
        success: true,
        data: {
            username: user.username,
            customData: user.customData || ''
        }
    });
});
// 启动服务器
app.listen(PORT, () => {
    // 定义命令和参数
    console.log(`服务器运行在 http://localhost:${PORT}`);
});