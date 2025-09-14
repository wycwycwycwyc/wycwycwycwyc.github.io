    // 加载jsSHA库作为备选方案（通过CDN）
    const loadJsSHA = () => {
        return new Promise((resolve) => {
            if (typeof jsSHA !== 'undefined') return resolve();
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsSHA/3.2.0/sha.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    };

    // 哈希计算函数（优先使用Web Crypto API）
    async function sha256(message) {
        try {
            // 尝试使用Web Crypto API
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } catch (error) {
            console.warn("Web Crypto API不可用，回退到jsSHA");
            await loadJsSHA(); // 确保jsSHA已加载
            const shaObj = new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
            shaObj.update(message);
            return shaObj.getHash("HEX");
        }
    }

    // 密码生成函数（保持原有本地时间处理）
    async function generatePassword() {
        const now = new Date();
        const timeStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

        const hash = await sha256(timeStr);
        const digits = hash.match(/\d/g) || [];
        return digits.join('').substring(0, 10).padEnd(10, '0');
    }

    // 其余原有代码保持不变...
    async function updateDisplay() {
        const now = new Date();

        // 显示当前时间（保持原有本地时间格式）
        document.getElementById('current-time').textContent =
            now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(/\//g, '-');

        // 生成并显示密码
        const password = await generatePassword();
        document.getElementById('current-password').textContent = password;

        // 计算下次更新时间
        const nextUpdate = new Date(now);
        nextUpdate.setMinutes(nextUpdate.getMinutes() + 1, 0, 0);

        document.getElementById('next-update').textContent =
            nextUpdate.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

        // 倒计时
        const diffSec = Math.floor((nextUpdate - now) / 1000);
        document.getElementById('countdown').textContent = `${diffSec}秒`;
    }

    // 初始化
    document.addEventListener('DOMContentLoaded', () => {
        updateDisplay();
        setInterval(updateDisplay, 1000);
    });