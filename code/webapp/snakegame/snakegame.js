document.addEventListener('DOMContentLoaded', function () {
  // 游戏变量
  let snake = [];
  let food = {};
  let specialFood = null;
  let direction = 'right';
  let nextDirection = 'right';
  let gameInterval;
  let gameSpeed = 150;
  let score = 0;
  let highScore = localStorage.getItem('snakeHighScore') || 0;
  let gameStarted = false;
  let specialFoodTimer;
  let specialFoodActive = false;
  let lastTime = 0;
  const gameBoard = document.getElementById('game-board');
  const startBtn = document.querySelector('.start-btn');
  const restartBtn = document.querySelector('.restart-btn');
  const currentScoreEl = document.getElementById('current-score');
  const highScoreEl = document.getElementById('high-score');
  const finalScoreEl = document.getElementById('final-score');
  const gameOverScreen = document.querySelector('.game-over');
  const startScreen = document.querySelector('.start-screen');
  const particlesContainer = document.getElementById('particles');
  const backButton = document.getElementById("back");
  const fpsElement = document.getElementById('fps');
  const fpsCounter = document.getElementById('fps-counter');
  let lastFpsUpdate = performance.now();
  let frameCount = 0;
  let fps = 0;
  let lastFrameTime = performance.now();
  const fpsHistory = [];
  const HISTORY_SIZE = 10;
  let isGameActive = true;  // 新增游戏状态标志
  // 独立的FPS计算循环    
  function updateFPS() {
    if (!isGameActive) return;
    const now = performance.now();
    frameCount++;
            
    // 计算瞬时帧时间
    const frameTime = now - lastFrameTime;
    lastFrameTime = now;
            
    // 每秒更新一次显示
    if (now >= lastFpsUpdate) { // 每250ms更新一次更平滑
      // 计算平滑的FPS
      fpsHistory.push(frameCount * 1000 / (now - lastFpsUpdate));
      if (fpsHistory.length > HISTORY_SIZE) {
        fpsHistory.shift();
      }
                
      const smoothedFPS = Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length);
                
      // 更新显示
      fpsElement.textContent = Math.round(smoothedFPS);
                
      // 根据FPS值改变样式
      if (smoothedFPS < 30) {
        fpsCounter.classList.add('low');
      } else {
        fpsCounter.classList.remove('low');
      }
                
      frameCount = 0;
      lastFpsUpdate = now;
    }
            
    requestAnimationFrame(updateFPS);
  }
  document.addEventListener('DOMContentLoaded', function () {
    highScore = localStorage.getItem('snakeHighScore') || 0;
    highScoreEl.textContent = highScore;
    
    // 检查是否需要上传本地最高分
    checkAndPromptUpload();
  });

  // 添加新函数：检查并提示上传
  function checkAndPromptUpload() {
    const localHighScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;

    fetch(`${serverurl}/get-all-custom-data`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // 获取当前用户的服务器最高分
          const username = localStorage.getItem('username');
          let serverHighScore = 0;
                
          if (username) {
            const currentUser = data.data.find(user => user.username === username);
            if (currentUser && currentUser.customData && currentUser.customData.startsWith('gamesnack_maxscore:')) {
              serverHighScore = parseInt(currentUser.customData.split(':')[1]) || 0;
            }
          }

          // 如果本地分数高于服务器记录，提示上传
          if (localHighScore > serverHighScore) {
            setTimeout(() => {
              swal({
                title: "发现更高分数",
                text: `你的本地最高分(${localHighScore})高于服务器记录(${serverHighScore})，要上传吗?`,
                type: "info",
                showCancelButton: true,
                confirmButtonText: "上传",
                cancelButtonText: "不上传",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
              }, function () {
                uploadScore(localHighScore);
              });
            }, 0); // 延迟0秒显示
          }
        }
      })
      .catch(error => {
        console.log('检查服务器分数失败:', error);
      });
  }

  // 排行榜相关HTML和CSS
  const leaderboardHTML = `
<div id="leaderboard-modal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2>贪吃蛇排行榜</h2>
        <div id="leaderboard-status"></div>
        <div id="leaderboard-list"></div>
    </div>
</div>
<style>
    .modal {
        display: none;
        position: fixed;
        z-index: 20;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
    }
    
    .modal-content {
        background: linear-gradient(135deg, #1a2a6c, #b21f1f);
        margin: 5% auto;
        padding: 20px;
        border-radius: 10px;
        width: 80%;
        max-width: 500px;
        color: white;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        position: relative;
    }
    
    .close {
        color: white;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }
    
    .close:hover {
        color: #ccc;
    }
    
    #leaderboard-list {
        margin-top: 20px;
    }
    
    .leaderboard-item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        margin-bottom: 5px;
        background-color: rgba(255,255,255,0.1);
        border-radius: 5px;
    }
    
    .leaderboard-item.me {
        background-color: rgba(255,215,0,0.3);
        font-weight: bold;
    }
    
    .leaderboard-rank {
        width: 30px;
        text-align: center;
    }
    
    .leaderboard-name {
        flex-grow: 1;
        margin: 0 10px;
    }
    
    .leaderboard-score {
        width: 80px;
        text-align: right;
    }
    
    #show-leaderboard {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 4;
    }
        .loading-status {
    text-align: center;
    padding: 20px;
    color: rgba(255,255,255,0.7);
}

.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

</style>
<button id="show-leaderboard">排行榜</button>
`;

  // 将排行榜HTML添加到页面
  document.body.insertAdjacentHTML('beforeend', leaderboardHTML);

  // 排行榜按钮事件
  document.getElementById('show-leaderboard').addEventListener('click', function () {
    updateLeaderboard();
    document.getElementById('leaderboard-modal').style.display = 'block';
  });

  // 关闭按钮事件
  document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('leaderboard-modal').style.display = 'none';
  });

  // 更新排行榜函数
  function updateLeaderboard() {
    fetch(`${serverurl}/get-all-custom-data`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const leaderboardList = document.getElementById('leaderboard-list');
          leaderboardList.innerHTML = '';
            
          // 处理数据，提取分数
          const scores = data.data.map(user => {
            let score = 0;
            if (user.customData && user.customData.startsWith('gamesnack_maxscore:')) {
              score = parseInt(user.customData.split(':')[1]) || 0;
            }
            return {
              username: user.username,
              score: score,
              avatar: user.avatarUrl,
              isMe: user.id === localStorage.getItem('userId')
            };
          });
            
          // 按分数排序
          scores.sort((a, b) => b.score - a.score);
            
          // 只显示前20名
          const topScores = scores.slice(0, 20);
            
          // 添加本地记录（如果不在前20名中）
          const localHighScore = localStorage.getItem('snakeHighScore') || 0;
          const userId = localStorage.getItem('userId');
          if (localHighScore > 0 && !topScores.some(item => item.isMe)) {
            topScores.push({
              username: '我 (本地记录)',
              score: parseInt(localHighScore),
              avatar: '',
              isMe: true
            });
          }
            
          // 显示排行榜
          topScores.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = `leaderboard-item ${item.isMe ? 'me' : ''}`;
            itemElement.innerHTML = `
                    <div class="leaderboard-rank">${index + 1}</div>
                    <div class="leaderboard-name">${item.username}</div>
                    <div class="leaderboard-score">${item.score}分</div>
                `;
            leaderboardList.appendChild(itemElement);
          });
            
          // 如果没有数据，显示提示
          if (topScores.length === 0) {
            leaderboardList.innerHTML = '<div style="text-align:center;padding:20px;">暂无排行榜数据</div>';
          }
        } else {
          console.error('获取排行榜数据失败:', data.message);
        }
      })
      .catch(error => {
        console.error('获取排行榜数据出错:', error);
      });
  }
  function clearBoard() {
    // 清除游戏板上所有子元素
    while (gameBoard.firstChild) {
      gameBoard.removeChild(gameBoard.firstChild);
    }
  }
  function generateFood() {
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
            
    // 确保食物出现在20px的网格上
    const maxX = Math.floor((boardWidth - 20) / 20);
    const maxY = Math.floor((boardHeight - 20) / 20);
            
    let validPosition = false;
    let foodX, foodY;
            
    while (!validPosition) {
      foodX = Math.floor(Math.random() * maxX) * 20;
      foodY = Math.floor(Math.random() * maxY) * 20;
                
      // 检查食物是否与蛇重叠
      validPosition = true;
      for (const segment of snake) {
        if (segment.x === foodX && segment.y === foodY) {
          validPosition = false;
          break;
        }
      }
    }
            
    food = {
      x: foodX,
      y: foodY,
      type: 'normal'  // 添加类型标识
    };
  } function drawSnake(withAnimation = false) {
    snake.forEach((segment, index) => {
      const segmentElement = document.createElement('div');
      segmentElement.className = 'snake-segment';
      if (index === 0) segmentElement.classList.add('snake-head');
                
      if (withAnimation) {
        segmentElement.classList.add('snake-enter');
        segmentElement.style.animationDelay = `${index * 0.1}s`;
      }
                
      segmentElement.style.left = `${segment.x}px`;
      segmentElement.style.top = `${segment.y}px`;
                
      // 添加颜色渐变效果
      if (index > 0) {
        const hue = (120 + index * 5) % 360;
        segmentElement.style.background = `linear-gradient(45deg, hsl(${hue}, 70%, 50%), hsl(${hue}, 90%, 60%))`;
      }
                
      gameBoard.appendChild(segmentElement);
    });
  }
  function drawFood(withAnimation = false) {
    const foodElement = document.createElement('div');
    foodElement.className = 'food';
        
    if (withAnimation) {
      foodElement.classList.add('food-enter');
    }
        
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
        
    // 普通食物使用绿色系
    foodElement.style.background = 'linear-gradient(45deg, #4CAF50, #8BC34A)';
    foodElement.style.boxShadow = '0 0 10px #4CAF50';
        
    gameBoard.appendChild(foodElement);
  }
  // 初始化游戏
  function initGame() {
    // 清除现有蛇和食物
    isGameActive = true;
    requestAnimationFrame(updateFPS);
    backButton.style.display = "none";
    document.getElementById('show-leaderboard').style.display = 'block';
    
    // 初始加载排行榜
    updateLeaderboard();
    clearBoard();
            
    // 初始化蛇
    snake = [
      { x: 100, y: 100 },
      { x: 80, y: 100 },
      { x: 60, y: 100 }
    ];
            
    // 重置方向和分数
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    currentScoreEl.textContent = score;
    highScoreEl.textContent = highScore;
            
    // 生成食物
    generateFood();
            
    // 启动特殊食物计时器
    if (specialFoodTimer) clearTimeout(specialFoodTimer);
    if (specialFoodActive) {
      clearTimeout(specialFoodTimer);
      specialFoodActive = false;
    }
    startSpecialFoodTimer();
            
    // 绘制蛇和食物（带进入动画）
    drawSnake(true);
    drawFood(true);
            
    // 隐藏游戏结束屏幕
    gameOverScreen.classList.remove('show');
            
    // 开始游戏循环
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
            
    gameStarted = true;
            
    // 创建背景元素
    createBackgroundElements();
            
    // 进入全屏模式
    requestFullscreen();
  }
        
  // 请求全屏
  function requestFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }
        
  // 启动特殊食物计时器
  function startSpecialFoodTimer() {
    specialFoodTimer = setTimeout(() => {
      generateSpecialFood();
    }, 15000 + Math.random() * 15000); // 15-30秒随机出现
  }
        
  // 生成特殊食物
  function generateSpecialFood() {
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
            
    // 确保食物出现在20px的网格上
    const maxX = Math.floor((boardWidth - 20) / 20);
    const maxY = Math.floor((boardHeight - 20) / 20);
            
    let validPosition = false;
    let foodX, foodY;
            
    while (!validPosition) {
      foodX = Math.floor(Math.random() * maxX) * 20;
      foodY = Math.floor(Math.random() * maxY) * 20;
                
      // 检查食物是否与蛇或普通食物重叠
      validPosition = true;
      for (const segment of snake) {
        if (segment.x === foodX && segment.y === foodY) {
          validPosition = false;
          break;
        }
      }
                
      if (validPosition && food.x === foodX && food.y === foodY) {
        validPosition = false;
      }
    }
            
    specialFood = {
      x: foodX,
      y: foodY,
      type: 'special'  // 添加类型标识
    };
    specialFoodActive = true;
    drawSpecialFood();
            
    // 特殊食物10秒后消失
    setTimeout(() => {
      if (specialFoodActive) {
        specialFoodActive = false;
        specialFood = null;
        clearBoard();
        drawSnake();
        drawFood();
        startSpecialFoodTimer();
      }
    }, 10000);
  }
        
  // 绘制特殊食物
  function drawSpecialFood() {
    if (!specialFoodActive) return;
            
    const foodElement = document.createElement('div');
    foodElement.className = 'special-food';
    foodElement.style.left = `${specialFood.x}px`;
    foodElement.style.top = `${specialFood.y}px`;
            
    // 特殊食物使用彩虹色动画
    foodElement.style.animation = 'rainbowPulse 2s infinite, rotate 5s infinite';
            
    gameBoard.appendChild(foodElement);
  }
        
  // 游戏主循环修改
  function gameLoop() {
    // 帧率计算
    frameCount++;
    const now = performance.now();
    if (now >= lastTime + 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      fpsElement.textContent = fps;
      frameCount = 0;
      lastTime = now;
    }
            
    // 原有的游戏逻辑
    direction = nextDirection;
            
    // 移动蛇
    const head = { ...snake[0] };
            
    switch (direction) {
      case 'up':
        head.y -= 20;
        break;
      case 'down':
        head.y += 20;
        break;
      case 'left':
        head.x -= 20;
        break;
      case 'right':
        head.x += 20;
        break;
    }
            
    // 穿墙逻辑
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
            
    if (head.x < 0) head.x = boardWidth - 20;
    if (head.x >= boardWidth) head.x = 0;
    if (head.y < 0) head.y = boardHeight - 20;
    if (head.y >= boardHeight) head.y = 0;
            
    // 检查自身碰撞
    if (checkSelfCollision(head)) {
      gameOver();
      return;
    }
            
    // 将新头部添加到蛇身
    snake.unshift(head);
            
    // 检查是否吃到食物
    if (Math.abs(head.x - food.x) < 20 && Math.abs(head.y - food.y) < 20) {
      // 增加分数
      score += 10;
      currentScoreEl.textContent = score;
                
      // 播放吃食物动画
      createParticles(food.x + 10, food.y + 10, 20, '#FF5722');
                
      // 分数增加动画
      currentScoreEl.style.transform = 'scale(1.5)';
      currentScoreEl.style.color = '#FFD700';
      setTimeout(() => {
        currentScoreEl.style.transform = 'scale(1)';
        currentScoreEl.style.color = 'white';
      }, 300);
                
      // 生成新食物
      generateFood();
                
      // 加快游戏速度
      if (gameSpeed > 50 && score % 50 === 0) {
        gameSpeed -= 5;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
                    
        // 速度变化提示
        showNotice('速度提升!', '#FF5722');
      }
    }
    // 检查是否吃到特殊食物
    else if (specialFoodActive && Math.abs(head.x - specialFood.x) < 20 && Math.abs(head.y - specialFood.y) < 20) {
      // 增加分数
      score += 100;
      currentScoreEl.textContent = score;
                
      // 播放吃食物动画
      createParticles(specialFood.x + 10, specialFood.y + 10, 50, '#FFD700');
                
      // 分数增加动画
      currentScoreEl.style.transform = 'scale(1.5)';
      currentScoreEl.style.color = '#FFD700';
      setTimeout(() => {
        currentScoreEl.style.transform = 'scale(1)';
        currentScoreEl.style.color = 'white';
      }, 300);
                
      // 移除特殊食物
      specialFoodActive = false;
      specialFood = null;
                
      // 显示提示
      showNotice('+100分!', '#FFD700');
                
      // 重新启动特殊食物计时器
      startSpecialFoodTimer();
    }
    else {
      // 如果没有吃到食物，移除尾部
      snake.pop();
    }
            
    // 重新绘制
    clearBoard();
    drawSnake();
    drawFood();
    if (specialFoodActive) drawSpecialFood();
  }
        
  // 检查自身碰撞
  function checkSelfCollision(head) {
    // 检查自身碰撞（跳过头部）
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }
        
  // 显示通知
  function showNotice(text, color) {
    const notice = document.createElement('div');
    notice.textContent = text;
    notice.style.position = 'absolute';
    notice.style.left = '50%';
    notice.style.top = '50%';
    notice.style.transform = 'translate(-50%, -50%)';
    notice.style.color = color;
    notice.style.fontSize = '24px';
    notice.style.fontWeight = 'bold';
    notice.style.textShadow = '0 0 5px white';
    notice.style.animation = 'fadeOut 1s forwards';
    gameBoard.appendChild(notice);
            
    setTimeout(() => {
      notice.remove();
    }, 1000);
  }
        
  // 游戏结束
  function gameOver() {
    isGameActive = false;
    backButton.style.display = "block";
    clearInterval(gameInterval);
    gameStarted = false;
    let lastFpsUpdate = performance.now();
    let frameCount = 0;
    let fps = 0;
    let lastFrameTime = performance.now();
    const fpsHistory = [];
    const HISTORY_SIZE = 10;
    // 更新最高分
    let isNewRecord = false;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', highScore);
      highScoreEl.textContent = highScore;
      isNewRecord = true;
                    
      // 庆祝动画
      for (let i = 0; i < 50; i++) {
        setTimeout(() => {
          createParticles(
            Math.random() * gameBoard.clientWidth,
            Math.random() * gameBoard.clientHeight,
            10,
            `hsl(${Math.random() * 360}, 100%, 50%)`
          );
        }, i * 100);
      }
    }
    // 显示游戏结束屏幕
    finalScoreEl.textContent = score;
    gameOverScreen.classList.add('show');
    
    const localHighScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;

    fetch(`${serverurl}/get-all-custom-data`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // 获取当前用户的服务器最高分
          const username = localStorage.getItem('username');
          let serverHighScore = 0;
                
          if (username) {
            const currentUser = data.data.find(user => user.username === username);
            if (currentUser && currentUser.customData && currentUser.customData.startsWith('gamesnack_maxscore:')) {
              serverHighScore = parseInt(currentUser.customData.split(':')[1]) || 0;
            }
          }

          // 如果本地分数高于服务器记录，提示上传
          if (localHighScore > serverHighScore) {
            setTimeout(() => {
              swal({
                title: "新纪录！d",
                text: `你的本地最高分(${localHighScore})高于服务器记录(${serverHighScore})，要上传吗?`,
                type: "info",
                showCancelButton: true,
                confirmButtonText: "上传",
                cancelButtonText: "不上传",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
              }, function () {
                uploadScore(localHighScore);
              });
            }, 0); // 延迟0秒显示
          }
        }
      })
      .catch(error => {
        console.log('检查服务器分数失败:', error);
      });
  }

  // 上传分数函数
  function uploadScore(score) {
    const userId = localStorage.getItem('userid');
    
    if (!userId) {
      swal("上传失败", "请先登录", "error");
      return;
    }
    
    const customData = `gamesnack_maxscore:${score}`;
    
    fetch(`${serverurl}/update-custom-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        customData: customData,
        operationType: 'overwrite'
      })
    })
      .then(response => {
        // 首先检查响应内容类型
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          return response.text().then(text => {
            throw new Error(`服务器返回了非JSON数据: ${text.substring(0, 100)}...`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (data && data.success) {
          localStorage.setItem('uploadedHighScore', score);
          swal("上传成功", "你的分数已记录到排行榜", "success");
          updateLeaderboard();
        } else {
          throw new Error(data?.message || "未知错误");
        }
      })
      .catch(error => {
        console.error('上传分数错误:', error);
        let errorMsg = error.message;
        
        // 处理常见的错误情况
        if (errorMsg.includes('<!DOCTYPE')) {
          errorMsg = "服务器返回了错误页面，请检查网络连接";
        } else if (errorMsg.includes('Failed to fetch')) {
          errorMsg = "网络连接失败，请检查网络设置";
        }
        
        swal("上传失败", errorMsg, "error");
      });
  }
        
  // 创建粒子效果
  function createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.backgroundColor = color;
      particle.style.animationDuration = `${2 + Math.random() * 3}s`;
      particle.style.animationDelay = `${Math.random() * 0.5}s`;
                
      // 随机大小
      const size = 2 + Math.random() * 6;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
                
      // 随机方向
      const angle = Math.random() * Math.PI * 2;
      const distance = 5 + Math.random() * 20;
      particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
                
      particlesContainer.appendChild(particle);
                
      // 动画结束后移除粒子
      setTimeout(() => {
        particle.remove();
      }, 3000);
    }
  }
        
  // 创建背景元素
  function createBackgroundElements() {
    const colors = ['#FF5722', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0'];
            
    for (let i = 0; i < 8; i++) {
      const element = document.createElement('div');
      element.className = 'bg-element';
                
      // 随机位置
      const left = Math.random() * 100;
      const top = Math.random() * 100;
                
      // 随机大小
      const size = 50 + Math.random() * 150;
                
      // 随机颜色
      const color = colors[Math.floor(Math.random() * colors.length)];
                
      element.style.left = `${left}%`;
      element.style.top = `${top}%`;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.backgroundColor = color;
      element.style.animationDuration = `${15 + Math.random() * 30}s`;
      element.style.animationDelay = `${Math.random() * 5}s`;
                
      document.body.appendChild(element);
    }
  }
        
  // 创建背景粒子
  function createBackgroundParticles() {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${10 + Math.random() * 20}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
                
      // 随机颜色
      const hue = Math.random() * 360;
      particle.style.backgroundColor = `hsla(${hue}, 100%, 70%, 0.7)`;
                
      particlesContainer.appendChild(particle);
    }
  }
        
  // 键盘控制
  document.addEventListener('keydown', (e) => {
    if (!gameStarted) return;
            
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (direction !== 'down') nextDirection = 'up';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (direction !== 'up') nextDirection = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (direction !== 'right') nextDirection = 'left';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (direction !== 'left') nextDirection = 'right';
        break;
    }
  });
        
  // 触摸控制（移动设备）
  let touchStartX = 0;
  let touchStartY = 0;
        
  gameBoard.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });
        
  gameBoard.addEventListener('touchmove', (e) => {
    if (!gameStarted) return;
    e.preventDefault();
            
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
            
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
            
    // 确定主要滑动方向
    if (Math.abs(dx) > Math.abs(dy)) {
      // 水平滑动
      if (dx > 0 && direction !== 'left') nextDirection = 'right';
      else if (dx < 0 && direction !== 'right') nextDirection = 'left';
    } else {
      // 垂直滑动
      if (dy > 0 && direction !== 'up') nextDirection = 'down';
      else if (dy < 0 && direction !== 'down') nextDirection = 'up';
    }
  });
        
  // 开始游戏按钮
  startBtn.addEventListener('click', () => {
    // 开始按钮动画
    startBtn.style.animation = 'buttonClick 0.5s forwards';
            
    // 开始屏幕退出动画
    startScreen.style.animation = 'startScreenExit 0.8s forwards';
            
    setTimeout(() => {
      startScreen.classList.add('hide');
      initGame();
    }, 800);
  });
        
  // 重新开始按钮
  restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.remove('show');
    setTimeout(() => {
      initGame();
    }, 300);
  });
        
  // 初始化背景粒子
  createBackgroundParticles();
        
  // 添加CSS动画
  const style = document.createElement('style');
  style.textContent = `
            @keyframes fadeOut {
                to { opacity: 0; transform: translate(-50%, -100%); }
            }
            @keyframes snakeShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            @keyframes buttonClick {
                50% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
            @keyframes startScreenExit {
                to { opacity: 0; transform: scale(1.2); }
            }
        `;
  document.head.appendChild(style);
});