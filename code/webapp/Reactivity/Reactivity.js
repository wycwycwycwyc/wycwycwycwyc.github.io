        document.addEventListener('DOMContentLoaded', function() {
            const startBtn = document.getElementById('start-btn');
            const restartBtn = document.getElementById('restart-btn');
            const testArea = document.getElementById('test-area');
            const colorScreen = document.getElementById('color-screen');
            const results = document.getElementById('results');
            const resultList = document.getElementById('result-list');
            const averageResult = document.getElementById('average-result');
            const currentTestEl = document.getElementById('current-test');
            const fastestEl = document.getElementById('fastest');
            const averageEl = document.getElementById('average');
            const progressEl = document.getElementById('progress');
            
            let testCount = 0;
            let reactionTimes = [];
            let startTime = 0;
            let timeoutId = null;
            let testStartTime = 0;
            let countdownInterval = null;
            
            // 开始测试
            startBtn.addEventListener('click', startTest);
            restartBtn.addEventListener('click', startTest);
            
            // 点击测试区域（使用mousedown/touchstart实现更快的响应）
            colorScreen.addEventListener('mousedown', handleReaction);
            colorScreen.addEventListener('touchstart', handleReaction, {passive: true});
            
            function handleReaction() {
                if (colorScreen.style.backgroundColor === 'green') {
                    const reactionTime = Date.now() - startTime;
                    reactionTimes.push(reactionTime);
                    
                    // 更新统计数据
                    updateStats();
                    
                    // 显示本次反应时间
                    colorScreen.style.backgroundColor = 'blue';
                    colorScreen.innerHTML = `
                        <div style="font-size: 5rem; color: white; animation: zoomIn 0.5s;">${reactionTime} ms</div>
                        <div class="message">点击有效！</div>
                    `;
                    
                    // 准备下一次测试
                    testCount++;
                    currentTestEl.textContent = `${testCount}/5`;
                    progressEl.style.width = `${(testCount/5)*100}%`;
                    
                    if (testCount < 5) {
                        // 显示5秒倒计时
                        showCountdown(5, startColorChange);
                    } else {
                        setTimeout(showResults, 2000);
                    }
                } else if (colorScreen.style.backgroundColor !== 'red') {
                    // 在非红色状态下点击（非测试状态）
                    colorScreen.style.backgroundColor = 'red';
                    colorScreen.innerHTML = '';
                    setTimeout(() => {
                        colorScreen.style.backgroundColor = '';
                        colorScreen.innerHTML = '<div style="font-size: 2rem; color: white; animation: flash 0.5s;">过早点击！</div>';
                    }, 1000);
                }
            }
            
            function startTest() {
                testCount = 0;
                reactionTimes = [];
                updateStats();
                currentTestEl.textContent = '0/5';
                progressEl.style.width = '0%';
                
                // 隐藏其他元素，显示测试区域
                document.querySelector('.container').style.display = 'none';
                results.style.display = 'none';
                testArea.style.display = 'flex';
                
                // 开始第一次测试
                showCountdown(3, startColorChange);
            }
            
            function showCountdown(seconds, callback) {
                let count = seconds;
                const countdownEl = document.createElement('div');
                countdownEl.className = 'countdown';
                countdownEl.textContent = count;
                document.body.appendChild(countdownEl);
                
                countdownInterval = setInterval(() => {
                    count--;
                    if (count > 0) {
                        countdownEl.textContent = count;
                        countdownEl.style.animation = 'none';
                        void countdownEl.offsetWidth; // 触发重绘
                        countdownEl.style.animation = 'countdownPop 1s forwards';
                    } else {
                        clearInterval(countdownInterval);
                        document.body.removeChild(countdownEl);
                        callback();
                    }
                }, 1000);
            }
            
            function startColorChange() {
                // 清除可能存在的之前的时间out
                if (timeoutId) clearTimeout(timeoutId);
                
                // 设置红色背景
                colorScreen.style.backgroundColor = 'red';
                colorScreen.innerHTML = '<div class="message">准备...</div>';
                
                // 随机等待时间（3-8秒）
                const waitTime = Math.floor(Math.random() * 5000) + 3000;
                
                // 设置超时，变为绿色
                timeoutId = setTimeout(() => {
                    colorScreen.style.backgroundColor = 'green';
                    colorScreen.innerHTML = '<div class="message" style="animation: flash 0.3s infinite;">就是现在！</div>';
                    startTime = Date.now();
                }, waitTime);
            }
            
            function updateStats() {
                if (reactionTimes.length > 0) {
                    const fastest = Math.min(...reactionTimes);
                    const average = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
                    
                    fastestEl.textContent = `${fastest} ms`;
                    averageEl.textContent = `${Math.round(average)} ms`;
                }
            }
            
            function showResults() {
                testArea.style.display = 'none';
                results.style.display = 'block';
                
                // 清空结果列表
                resultList.innerHTML = '';
                
                // 添加每次测试结果
                reactionTimes.forEach((time, index) => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>测试 #${index + 1}</span><span>${time} ms</span>`;
                    resultList.appendChild(li);
                });
                
                // 计算并显示平均时间
                const average = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
                averageResult.textContent = `平均反应时间: ${Math.round(average)} ms`;
                
                // 显示祝贺信息
                let message = "";
                if (average < 200) {
                    message = "超凡的反应速度！";
                } else if (average < 300) {
                    message = "非常出色的反应力！";
                } else if (average < 400) {
                    message = "不错的反应速度！";
                } else {
                    message = "继续练习会更好！";
                }
                
                averageResult.innerHTML += `<div style="margin-top: 10px; color: #ffcc00;">${message}</div>`;
            }
        });