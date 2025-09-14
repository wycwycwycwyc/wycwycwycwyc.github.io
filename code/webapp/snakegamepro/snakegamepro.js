document.addEventListener('DOMContentLoaded', function() {
// 游戏变量
let snakes = {
    snake1: [],
    snake2: []
};
let foods = [];
let specialItems = []; // 存储特殊球
let directions = {
    snake1: 'right',
    snake2: 'right'
};
let nextDirections = {
    snake1: 'right',
    snake2: 'right'
};
let gameInterval;
let gameSpeed = 100;
let health = {
    snake1: 10,
    snake2: 10
};
let scores = {
    snake1: 0,
    snake2: 0
};
let snakeTypes = {
    snake1: null,
    snake2: null
};
let collisionCount = {
    snake1: 0,
    snake2: 0
};
let defenseRate = {
    snake1: 1.0,
    snake2: 1.0
};
let immunity = {
    snake1: false,
    snake2: false,
    timer1: 0,
    timer2: 0
};
let reversedControls = {
    snake1: false,
    snake2: false,
    timer1: 0,
    timer2: 0
};
let ballStorage = {
    snake1: [],
    snake2: []
};
let attackMode = {
    snake1: false,
    snake2: false,
    timer1: 0,
    timer2: 0,
    lastShot1: 0,
    lastShot2: 0
};
let magicSnakeTimers = {
    snake1: 0,
    snake2: 0
};
let pausedSnakes = {
    snake1: false,
    snake2: false
};
let walls = [];
let bullets = []; // 存储子弹对象
let lastSpecialItemSpawn = 0;
let gameStarted = false;
let lastTime = 0;
let lastWallHitTime = {
snake1: 0,
snake2: 0
};
// 游戏变量中添加
let volcanoes = [];
let lavaTiles = [];
let lastEruptionTime = 0;
let isErupting = false;
let nextEruptionTime = 30000; // 30秒后第一次喷发
// 在游戏变量中添加
let currentMap = 'default';
let blizzardActive = false;
let blizzardDirection = null;
let blizzardTimer = 0;
let coldWindTimer = 0;
let snakeSpeedModifiers = { snake1: 1, snake2: 1 };
let frozenSnakes = { snake1: false, snake2: false, timer1: 0, timer2: 0 };
let speedBoosts = {
    snake1: 0,
    snake2: 0
};
const gameBoard = document.getElementById('game-board');
const startBtn = document.querySelector('.start-btn');
const restartBtn = document.querySelector('.restart-btn');
const health1El = document.getElementById('health-1');
const health2El = document.getElementById('health-2');
const score1El = document.getElementById('score-1');
const score2El = document.getElementById('score-2');
const gameOverScreen = document.querySelector('.game-over');
const startScreen = document.querySelector('.start-screen');
const particlesContainer = document.getElementById('particles');
const winnerBanner = document.getElementById('winner-banner');
const winnerName = document.getElementById('winner-name');
const characterSelection = document.querySelector('.character-selection');
const viewRecords = document.getElementById("view-records");
let lastMoveTime = {
    snake1: 0,
    snake2: 0
};

// 初始化游戏
function initGame() {
    document.getElementById("back").style.display ="none"
    viewRecords.style.display = 'none';
    const player1Name = localStorage.getItem('username') || '玩家1';
    document.getElementById('player1-name').textContent = player1Name + ': ';
            
    // 如果玩家2已登录，设置其名称
    const player2Name = localStorage.getItem('player2_username') || '玩家2';
    document.getElementById('player2-name').textContent = player2Name + ': '; 
    document.getElementById("player-label1").textContent =localStorage.getItem("username") + "(橙色)" || '玩家1'
    document.getElementById("player-label2").textContent =localStorage.getItem("player2_username") + "(蓝色)" || '玩家2'
    document.getElementById("storage-title1").textContent =localStorage.getItem("username") + "储存:" || '玩家1储存:'
    document.getElementById("storage-title2").textContent =localStorage.getItem("player2_username") + "储存:"  || '玩家2储存:'    
    // 清除现有蛇和食物
    if (currentMap === 'snow') {
        document.body.style.background = 'linear-gradient(135deg, #1e3c72, #2a5298, #7b4397)';
        blizzardTimer = performance.now() + 30000; // 30秒后第一次暴风雪
    } else if (currentMap === 'volcano') {
        document.body.style.background = 'linear-gradient(135deg, #8B0000, #FF4500, #FF8C00)';
        generateVolcanoes();
        nextEruptionTime = performance.now() + 30000;
    } else {
        document.body.style.background = 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)';
    }
    clearBoard();
    bullets = [];
        // 重置速度加成
    speedBoosts = {
        snake1: 0,
        snake2: 0
    };
    // 重置特殊物品
    specialItems = [];
    lastSpecialItemSpawn = 0;
    
    // 重置状态效果
    immunity = { snake1: false, snake2: false, timer1: 0, timer2: 0 };
    reversedControls = { snake1: false, snake2: false, timer1: 0, timer2: 0 };
    
    // 初始化球体储存
    ballStorage = {
        snake1: [],
        snake2: []
    };
    pausedSnakes = {
        snake1: false,
        snake2: false
    };
    updateStorageDisplay();
    
    // 初始化蛇
    snakes.snake1 = [
        { x: 200, y: 300 },
        { x: 180, y: 300 },
        { x: 160, y: 300 }
    ];
    
    snakes.snake2 = [
        { x: 400, y: 300 },
        { x: 420, y: 300 },
        { x: 440, y: 300 }
    ];
    
    // 重置方向和血量
    directions = {
        snake1: 'left',
        snake2: 'right'
    };
    nextDirections = {
        snake1: 'left',
        snake2: 'right'
    };
    health = {
        snake1: 10,
        snake2: 10
    };
    
    // 重置分数
    scores = {
        snake1: 0,
        snake2: 0
    };
    if (snakeTypes.snake1 === 'tough') {
        health.snake1 = 15; // 坚硬蛇有15点血
    }
    if (snakeTypes.snake2 === 'tough') {
        health.snake2 = 15; // 坚硬蛇有15点血
    }
    if (attackMode.intervalId1) clearInterval(attackMode.intervalId1);
    if (attackMode.intervalId2) clearInterval(attackMode.intervalId2);
    attackMode = {
        snake1: false,
        snake2: false,
        timer1: 0,
        timer2: 0,
        lastShot1: 0,
        lastShot2: 0,
        intervalId1: null,
        intervalId2: null
};
    walls = [];
    generateAllWalls();
    updateHealthBars();
    updateScoreDisplay();
    
    // 生成食物
    foods = [];
    generateFood();
    generateFood();
    
    // 绘制蛇和食物（带进入动画）
    drawSnakes(true);
    drawFoods(true);
    
    // 隐藏游戏结束屏幕
    gameOverScreen.classList.remove('show');
    gameOverScreen.style.display = 'none';
    // 开始游戏循环
    if (gameInterval) clearInterval(gameInterval);
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
    
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
// 添加新的生成所有墙的函数
function generateAllWalls() {
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    const gridSize = 20; // 每个墙块的大小
    const cols = Math.floor(boardWidth / gridSize);
    const rows = Math.floor(boardHeight / gridSize);
    
    // 清空现有墙
    walls = [];
    
    // 计算蛇前方的安全区域（10格=200像素）
    const safeZones = {
        snake1: getSnakeSafeZone('snake1', 10),
        snake2: getSnakeSafeZone('snake2', 10)
    };
    
    // 生成水平墙
    const horizontalWallCount = Math.floor(rows * 0.1);
    for (let i = 0; i < horizontalWallCount; i++) {
        const row = Math.floor(3 + Math.random() * (rows - 6));
        const y = row * gridSize;
        const startCol = Math.floor(Math.random() * (cols - 5));
        const length = 8 + Math.floor(Math.random() * 4);
        
        const newWall = {
            segments: [],
            spawnTime: performance.now()
        };
        
        let validWall = true;
        
        // 检查墙是否与蛇重叠或位于安全区域内
        for (let c = 0; c < length; c++) {
            const x = (startCol + c) * gridSize;
            
            // 检查是否与蛇重叠
            for (const segment of snakes.snake1) {
                if (segment.x === x && segment.y === y) {
                    validWall = false;
                    break;
                }
            }
            
            if (validWall) {
                for (const segment of snakes.snake2) {
                    if (segment.x === x && segment.y === y) {
                        validWall = false;
                        break;
                    }
                }
            }
            
            // 检查是否在安全区域内
            if (validWall) {
                if (isInSafeZone(x, y, safeZones.snake1) || 
                    isInSafeZone(x, y, safeZones.snake2)) {
                    validWall = false;
                }
            }
            
            if (!validWall) break;
        }
        
        if (validWall) {
            for (let c = 0; c < length; c++) {
                newWall.segments.push({
                    x: (startCol + c) * gridSize,
                    y: y
                });
            }
            walls.push(newWall);
        }
    }
    
    // 生成垂直墙（类似逻辑）
    const verticalWallCount = Math.floor(cols * 0.1);
    for (let i = 0; i < verticalWallCount; i++) {
        const col = Math.floor(3 + Math.random() * (cols - 6));
        const x = col * gridSize;
        const startRow = Math.floor(Math.random() * (rows - 5));
        const length = 8 + Math.floor(Math.random() * 3);
        
        const newWall = {
            segments: [],
            spawnTime: performance.now()
        };
        
        let validWall = true;
        
        for (let r = 0; r < length; r++) {
            const y = (startRow + r) * gridSize;
            
            // 检查是否与蛇重叠
            for (const segment of snakes.snake1) {
                if (segment.x === x && segment.y === y) {
                    validWall = false;
                    break;
                }
            }
            
            if (validWall) {
                for (const segment of snakes.snake2) {
                    if (segment.x === x && segment.y === y) {
                        validWall = false;
                        break;
                    }
                }
            }
            
            // 检查是否在安全区域内
            if (validWall) {
                if (isInSafeZone(x, y, safeZones.snake1) || 
                    isInSafeZone(x, y, safeZones.snake2)) {
                    validWall = false;
                }
            }
            
            if (!validWall) break;
        }
        
        if (validWall) {
            for (let r = 0; r < length; r++) {
                newWall.segments.push({
                    x: x,
                    y: (startRow + r) * gridSize
                });
            }
            walls.push(newWall);
        }
    }
}

// 获取蛇前方的安全区域
function getSnakeSafeZone(snakeId, distanceInGrids) {
    const head = snakes[snakeId][0];
    const direction = directions[snakeId];
    const gridSize = 20;
    const safeZone = [];
    
    // 计算前方区域
    for (let i = 1; i <= distanceInGrids; i++) {
        let x = head.x, y = head.y;
        
        switch (direction) {
            case 'up': y -= i * gridSize; break;
            case 'down': y += i * gridSize; break;
            case 'left': x -= i * gridSize; break;
            case 'right': x += i * gridSize; break;
        }
        
        // 确保坐标在游戏板内
        if (x >= 0 && x < gameBoard.clientWidth && 
            y >= 0 && y < gameBoard.clientHeight) {
            safeZone.push({x, y});
        }
    }
    
    return safeZone;
}

// 检查坐标是否在安全区域内
function isInSafeZone(x, y, safeZone) {
    return safeZone.some(zone => zone.x === x && zone.y === y);
}
// 清除游戏板
function clearBoard() {
    document.querySelectorAll('.bullet').forEach(bullet => bullet.remove());
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }
}

// 添加更新储存显示的函数
function updateStorageDisplay() {
    // 更新玩家1的储存显示
    for (let i = 0; i < 5; i++) {
        const slot = document.getElementById(`p1-slot-${i+1}`);
        if (i < ballStorage.snake1.length) {
            slot.classList.add('filled');
            switch(ballStorage.snake1[i].type) {
                case 'immunity':
                    slot.style.background = 'linear-gradient(45deg, #FFFF00, #FFD700)';
                    slot.style.boxShadow = '0 0 10px #FFFF00';
                    break;
                case 'health':
                    slot.style.background = 'linear-gradient(45deg, #FF0000, #FF6B6B)';
                    slot.style.boxShadow = '0 0 10px #FF0000';
                    break;
                case 'reverse':
                    slot.style.background = 'linear-gradient(45deg, #800080, #DA70D6)';
                    slot.style.boxShadow = '0 0 10px #800080';
                    break;
                case 'attack':
                    slot
                .style.background = 'linear-gradient(45deg, #00BFFF, #87CEFA)'; // 浅蓝色
                    slot
                .style.boxShadow = '0 0 10px #00BFFF';
    break;
            }
        } else {
            slot.classList.remove('filled');
            slot.style.background = 'rgba(255, 255, 255, 0.2)';
            slot.style.boxShadow = 'none';
        }
    }
    
    // 更新玩家2的储存显示
    for (let i = 0; i < 5; i++) {
        const slot = document.getElementById(`p2-slot-${i+1}`);
        if (i < ballStorage.snake2.length) {
            slot.classList.add('filled');
            switch(ballStorage.snake2[i].type) {
                case 'immunity':
                    slot.style.background = 'linear-gradient(45deg, #FFFF00, #FFD700)';
                    slot.style.boxShadow = '0 0 10px #FFFF00';
                    break;
                case 'health':
                    slot.style.background = 'linear-gradient(45deg, #FF0000, #FF6B6B)';
                    slot.style.boxShadow = '0 0 10px #FF0000';
                    break;
                case 'reverse':
                    slot.style.background = 'linear-gradient(45deg, #800080, #DA70D6)';
                    slot.style.boxShadow = '0 0 10px #800080';
                    break;
                case 'attack':
                    slot
                .style.background = 'linear-gradient(45deg, #00BFFF, #87CEFA)'; // 浅蓝色
                    slot
                .style.boxShadow = '0 0 10px #00BFFF';
            }
        } else {
            slot.classList.remove('filled');
            slot.style.background = 'rgba(255, 255, 255, 0.2)';
            slot.style.boxShadow = 'none';
        }
    }
}
    
    // 更新玩家2的储存显示
    for (let i = 0; i < 5; i++) {
        const slot = document.getElementById(`p2-slot-${i+1}`);
        if (i < ballStorage.snake2.length) {
            slot.classList.add('filled');
            switch(ballStorage.snake2[i].type) {
                case 'immunity':
                    slot.style.background = 'linear-gradient(45deg, #FFFF00, #FFD700)';
                    slot.style.boxShadow = '0 0 10px #FFFF00';
                    break;
                case 'health':
                    slot.style.background = 'linear-gradient(45deg, #FF0000, #FF6B6B)';
                    slot.style.boxShadow = '0 0 10px #FF0000';
                    break;
                case 'reverse':
                    slot.style.background = 'linear-gradient(45deg, #800080, #DA70D6)';
                    slot.style.boxShadow = '0 0 10px #800080';
                    break;
            }
        } else {
            slot.classList.remove('filled');
            slot.style.background = 'rgba(255, 255, 255, 0.2)';
            slot.style.boxShadow = 'none';
        }
    }


// 生成食物
function generateFood() {
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    
    // 确保食物出现在20px的网格上
    const maxX = Math.floor((boardWidth - 20) / 20);
    const maxY = Math.floor((boardHeight - 20) / 20);
    
    let validPosition = false;
    let foodX, foodY;
    let attempts = 0;
    const maxAttempts = 100; // 防止无限循环
    
    while (!validPosition && attempts < maxAttempts) {
        attempts++;
        foodX = Math.floor(Math.random() * maxX) * 20;
        foodY = Math.floor(Math.random() * maxY) * 20;
        
        validPosition = true;
        
        // 检查食物是否与蛇重叠
        for (const snakeId in snakes) {
            for (const segment of snakes[snakeId]) {
                if (segment.x === foodX && segment.y === foodY) {
                    validPosition = false;
                    break;
                }
            }
            if (!validPosition) break;
        }
        
        // 检查是否与现有食物重叠
        if (validPosition) {
            for (const food of foods) {
                if (food.x === foodX && food.y === foodY) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        // 检查是否与特殊物品重叠
        if (validPosition) {
            for (const item of specialItems) {
                if (item.x === foodX && item.y === foodY) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        // 新增：检查是否在墙上
        if (validPosition) {
            validPosition = !isPositionOnWall(foodX, foodY);
        }
    }
    
    if (validPosition) {
        foods.push({ 
            x: foodX, 
            y: foodY,
            type: Math.random() > 0.7 ? 'special' : 'normal'
        });
    } else {
        console.warn('未能找到有效位置生成食物');
    }
}

function drawSpecialItems() {
    specialItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'special-food';
        
        // 根据类型设置不同颜色
        switch(item.type) {
            case 'immunity':
                itemElement.classList.add('immunity-ball'); // 黄色
                break;
            case 'health':
                itemElement.classList.add('health-ball');   // 红色
                break;
            case 'reverse':
                itemElement.classList.add('reverse-ball');  // 紫色
                break;
        }
        
        itemElement.style.left = `${item.x}px`;
        itemElement.style.top = `${item.y}px`;
        
        gameBoard.appendChild(itemElement);
    });
}    

// 生成特殊物品
function generateSpecialItem() {
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    
    const maxX = Math.floor((boardWidth - 20) / 20);
    const maxY = Math.floor((boardHeight - 20) / 20);
    
    let validPosition = false;
    let itemX, itemY;
    let attempts = 0;
    const maxAttempts = 100;
    
    while (!validPosition && attempts < maxAttempts) {
        attempts++;
        itemX = Math.floor(Math.random() * maxX) * 20;
        itemY = Math.floor(Math.random() * maxY) * 20;
        
        validPosition = true;
        
        // 检查是否与蛇重叠
        for (const snakeId in snakes) {
            for (const segment of snakes[snakeId]) {
                if (segment.x === itemX && segment.y === itemY) {
                    validPosition = false;
                    break;
                }
            }
            if (!validPosition) break;
        }
        
        // 检查是否与现有食物重叠
        if (validPosition) {
            for (const food of foods) {
                if (food.x === itemX && food.y === itemY) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        // 检查是否与现有特殊物品重叠
        if (validPosition) {
            for (const item of specialItems) {
                if (item.x === itemX && item.y === itemY) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        // 新增：检查是否在墙上
        if (validPosition) {
            validPosition = !isPositionOnWall(itemX, itemY);
        }
    }
    
    if (validPosition) {
        const itemTypes = ['immunity', 'health', 'reverse', 'attack'];
        const weights = [0, 0, 0, 1]; // 平均分配概率
        let randomValue = Math.random();
        let selectedType = itemTypes[0];
        
        for (let i = 0; i < itemTypes.length; i++) {
            if (randomValue < weights[i]) {
                selectedType = itemTypes[i];
                break;
            }
            randomValue -= weights[i];
        }
        
        specialItems.push({ 
            x: itemX, 
            y: itemY,
            type: selectedType,
            spawnTime: performance.now()
        });
    } else {
        console.warn('未能找到有效位置生成特殊物品');
    }
}

// 绘制蛇
function drawSnakes(withAnimation = false) {
    for (const snakeId in snakes) {
        const snake = snakes[snakeId];
        const isSnake1 = snakeId === 'snake1';
        
        snake.forEach((segment, index) => {
            const segmentElement = document.createElement('div');
            segmentElement.className = `snake-segment ${snakeId}`;
            
            // 添加冻结效果
            if (frozenSnakes[snakeId]) {
                segmentElement.classList.add('frozen-snake');
                if (index === 0) {
                    segmentElement.innerHTML = '❄❄️';
                    segmentElement.style.display = 'flex';
                    segmentElement.style.justifyContent = 'center';
                    segmentElement.style.alignItems = 'center';
                    segmentElement.style.fontSize = '14px';
                }
            }
            // 添加免疫效果视觉提示
            if ((snakeId === 'snake1' && immunity.snake1) || 
                (snakeId === 'snake2' && immunity.snake2)) {
                segmentElement.style.boxShadow = '0 0 15px #FFFF00';
                segmentElement.style.animation = 'pulse 0.5s infinite alternate';
            }
            
            if (index === 0) segmentElement.classList.add('snake-head');
            
            if (withAnimation) {
                segmentElement.classList.add('snake-enter');
                segmentElement.style.animationDelay = `${index * 0.1}s`;
            }
            if (pausedSnakes[snakeId]) {
                segmentElement.style.opacity = '0.6';
                segmentElement.style.filter = 'grayscale(50%)';
                if (index === 0) { // 蛇头添加暂停图标
                    segmentElement.innerHTML = '⏸';
                    segmentElement.style.display = 'flex';
                    segmentElement.style.justifyContent = 'center';
                    segmentElement.style.alignItems = 'center';
                    segmentElement.style.fontSize = '14px';
                }
            }            
            segmentElement.style.left = `${segment.x}px`;
            segmentElement.style.top = `${segment.y}px`;
            
            gameBoard.appendChild(segmentElement);
        });
    }
}

// 绘制食物
function drawFoods(withAnimation = false) {
    // 绘制普通食物和特殊食物
    foods.forEach(food => {
        const foodElement = document.createElement('div');
        foodElement.className = food.type === 'special' ? 'special-food' : 'food';
        
        if (withAnimation) {
            foodElement.classList.add('food-enter');
        }
        
        foodElement.style.left = `${food.x}px`;
        foodElement.style.top = `${food.y}px`;
        
        gameBoard.appendChild(foodElement);
    });
    
    // 绘制特殊物品
    specialItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'special-food';
        
        // 根据类型设置不同样式
        switch(item.type) {
            case 'immunity':
                itemElement.style.background = 'linear-gradient(45deg, #FFFF00, #FFD700)';
                itemElement.style.boxShadow = '0 0 15px #FFFF00';
                break;
            case 'health':
                itemElement.style.background = 'linear-gradient(45deg, #FF0000, #FF6B6B)';
                itemElement.style.boxShadow = '0 0 15px #FF0000';
                break;
            case 'reverse':
                itemElement.style.background = 'linear-gradient(45deg, #800080, #DA70D6)';
                itemElement.style.boxShadow = '0 0 15px #800080';
                break;
        }
        
        itemElement.style.left = `${item.x}px`;
        itemElement.style.top = `${item.y}px`;
        
        gameBoard.appendChild(itemElement);
    });
}

// 游戏主循环
function gameLoop(timestamp) {
    if (!gameStarted) return;
    
    if (currentMap === 'snow') {
        handleBlizzard(timestamp);
    } else if (currentMap === 'volcano') {
        handleVolcanoEruption(timestamp);
    }  
requestAnimationFrame(gameLoop);
    
    // 更新魔法蛇计时器
    updateMagicSnakeTimers(timestamp);
    
    // 更新状态效果计时器
    updateStatusEffects(timestamp);
    
    // 移动子弹
    moveBullets(timestamp);
        
    // 生成特殊物品
    if (timestamp - lastSpecialItemSpawn > (120 + Math.random() * 60) * 200) {
        generateSpecialItem();
        lastSpecialItemSpawn = timestamp;
    }
    
    // 移除过期的特殊物品（存在30秒后消失）
    for (let i = specialItems.length - 1; i >= 0; i--) {
        if (timestamp - specialItems[i].spawnTime > 30000) {
            specialItems.splice(i, 1);
        }
    }
    
    // 计算蛇的速度（整合暴风雪减速效果）
    const snake1Speed = (snakeTypes.snake1 === 'speed' ? gameSpeed * 0.55 : 
                       (snakeTypes.snake1 === 'magic' ? gameSpeed * 0.85 : gameSpeed)) / 
                       (1 + speedBoosts.snake1) / 
                       (currentMap === 'snow' && blizzardActive && !immunity.snake1 ? snakeSpeedModifiers.snake1 : 1);
    
    const snake2Speed = (snakeTypes.snake2 === 'speed' ? gameSpeed * 0.55 : 
                       (snakeTypes.snake2 === 'magic' ? gameSpeed * 0.85 : gameSpeed)) / 
                       (1 + speedBoosts.snake2) / 
                       (currentMap === 'snow' && blizzardActive && !immunity.snake2 ? snakeSpeedModifiers.snake2 : 1);
    // 移动蛇1
    if (!pausedSnakes.snake1 && timestamp - lastMoveTime.snake1 > snake1Speed) {
        directions.snake1 = nextDirections.snake1;
        moveSnake('snake1');
        lastMoveTime.snake1 = timestamp;
    }
    
    // 移动蛇2（如果未暂停）
    if (!pausedSnakes.snake2 && timestamp - lastMoveTime.snake2 > snake2Speed) {
        directions.snake2 = nextDirections.snake2;
        moveSnake('snake2');
        lastMoveTime.snake2 = timestamp;
    }
    
    // 检查游戏结束条件
    if (health.snake1 <= 0 || health.snake2 <= 0) {
        gameOver();
        return;
    }
    
    // 检查墙碰撞
    checkWallCollisions(timestamp);
    // 重新绘制
    clearBoard();
    drawWalls();
    drawBullets(); // 绘制子弹
    drawSpecialItems();
    drawVolcanoes();
    drawSnakes();
    drawFoods();
}
// 在CSS中添加
const blizzardStyle = document.createElement('style');
blizzardStyle.textContent = `
    @keyframes blizzard-up {
        to { transform: translateY(-100vh); }
    }
    @keyframes blizzard-down {
        to { transform: translateY(100vh); }
    }
    @keyframes blizzard-left {
        to { transform: translateX(-100vw); }
    }
    @keyframes blizzard-right {
        to { transform: translateX(100vw); }
    }
    
    .blizzard-particle {
        position: absolute;
        border-radius: 50%;
        z-index: 1;
    }
    
    .frozen-snake {
        opacity: 0.7;
        filter: brightness(1.5) saturate(0.5);
        box-shadow: 0 0 10px #00BFFF;
    }
`;
document.head.appendChild(blizzardStyle);
function drawBlizzard() {
    if (!blizzardActive || !blizzardDirection) return;
    
    // 创建暴风雪粒子
    const particleCount = 30;
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'blizzard-particle';
        
        // 根据方向设置粒子初始位置和动画
        switch(blizzardDirection) {
            case 'up':
                particle.style.left = `${Math.random() * boardWidth}px`;
                particle.style.top = `${boardHeight}px`;
                particle.style.animation = `blizzard-up ${1 + Math.random() * 2}s linear`;
                break;
            case 'down':
                particle.style.left = `${Math.random() * boardWidth}px`;
                particle.style.top = `0px`;
                particle.style.animation = `blizzard-down ${1 + Math.random() * 2}s linear`;
                break;
            case 'left':
                particle.style.left = `${boardWidth}px`;
                particle.style.top = `${Math.random() * boardHeight}px`;
                particle.style.animation = `blizzard-left ${1 + Math.random() * 2}s linear`;
                break;
            case 'right':
                particle.style.left = `0px`;
                particle.style.top = `${Math.random() * boardHeight}px`;
                particle.style.animation = `blizzard-right ${1 + Math.random() * 2}s linear`;
                break;
        }
        
        // 随机大小
        const size = 3 + Math.random() * 7;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = 'rgba(200, 240, 255, 0.7)';
        particle.style.boxShadow = '0 0 5px rgba(200, 240, 255, 0.9)';
        
        gameBoard.appendChild(particle);
        
        // 动画结束后移除
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}
// 暴风雪处理
function handleBlizzard(timestamp) {
    // 暴风雪前5秒显示冷风方向
    if (!blizzardActive && timestamp > blizzardTimer - 5000 && timestamp < blizzardTimer) {
        if (!blizzardDirection) {
            // 随机选择暴风雪方向
            const directions = ['up', 'down', 'left', 'right'];
            blizzardDirection = directions[Math.floor(Math.random() * directions.length)];
        }
        
        // 显示冷风方向提示
        const effect1 = document.getElementById('player1-effect');
        const effect2 = document.getElementById('player2-effect');
        effect1.textContent = `冷风来自${getDirectionName(blizzardDirection)}!`;
        effect2.textContent = `冷风来自${getDirectionName(blizzardDirection)}!`;
    }
    
    // 开始暴风雪
    if (!blizzardActive && timestamp > blizzardTimer) {
        blizzardActive = true;
        coldWindTimer = timestamp;
        
        // 显示暴风雪提示
        showNotice(`暴风雪来袭! 来自${getDirectionName(blizzardDirection)}`, '#00BFFF', 
                  gameBoard.clientWidth / 2, 20);
        
        // 10秒后停止暴风雪
        setTimeout(() => {
            blizzardActive = false;
            blizzardDirection = null;
            blizzardTimer = timestamp + 30000; // 30秒后下次暴风雪
            
            // 重置速度修改器
            snakeSpeedModifiers.snake1 = 1;
            snakeSpeedModifiers.snake2 = 1;
            
            // 移除暴风雪效果显示
            document.getElementById('player1-effect').textContent = '';
            document.getElementById('player2-effect').textContent = '';
        }, 10000);
    }
    
    // 暴风雪期间处理减速和冻结
    if (blizzardActive) {
        applyBlizzardEffects(timestamp);
    }
}

// 获取方向名称
function getDirectionName(dir) {
    switch(dir) {
        case 'up': return '上方';
        case 'down': return '下方';
        case 'left': return '左侧';
        case 'right': return '右侧';
        default: return '';
    }
}

// 应用暴风雪效果
function applyBlizzardEffects(timestamp) {
    for (const snakeId in snakes) {
        // 检查是否有免疫效果
        if ((snakeId === 'snake1' && immunity.snake1) || 
            (snakeId === 'snake2' && immunity.snake2)) {
            continue; // 免疫暴风雪效果
        }
        
        const head = snakes[snakeId][0];
        let affected = true;
        
        // 检查是否在墙后（有遮挡）
        for (const wall of walls) {
            for (const segment of wall.segments) {
                // 根据暴风雪方向检查遮挡
                switch(blizzardDirection) {
                    case 'up':
                        if (segment.x === head.x && segment.y > head.y) affected = false;
                        break;
                    case 'down':
                        if (segment.x === head.x && segment.y < head.y) affected = false;
                        break;
                    case 'left':
                        if (segment.y === head.y && segment.x > head.x) affected = false;
                        break;
                    case 'right':
                        if (segment.y === head.y && segment.x < head.x) affected = false;
                        break;
                }
                if (!affected) break;
            }
            if (!affected) break;
        }
        
        if (affected) {
            // 应用减速效果
            if (!frozenSnakes[snakeId]) {
                // 每2秒减速一次
                if (timestamp - coldWindTimer > 2000) {
                    snakeSpeedModifiers[snakeId] = Math.max(0.2, snakeSpeedModifiers[snakeId] - 0.2);
                    coldWindTimer = timestamp;
                    
                    // 显示减速提示
                    showNotice('速度下降!', '#00BFFF', head.x, head.y);
                    
                    // 检查是否完全冻结
                    if (snakeSpeedModifiers[snakeId] <= 0.2) {
                        frozenSnakes[snakeId] = true;
                        frozenSnakes[`timer${snakeId.slice(-1)}`] = timestamp + 4000; // 冻结4秒
                        showNotice('被冻住了!', '#00BFFF', head.x, head.y);
                    }
                }
            }
        } else {
            // 在墙后，逐渐恢复速度
            if (!frozenSnakes[snakeId]) {
                snakeSpeedModifiers[snakeId] = Math.min(1, snakeSpeedModifiers[snakeId] + 0.05);
            }
        }
        
        // 处理冻结状态
        if (frozenSnakes[snakeId] && timestamp > frozenSnakes[`timer${snakeId.slice(-1)}`]) {
            frozenSnakes[snakeId] = false;
            snakeSpeedModifiers[snakeId] = 0.4; // 解冻后初始速度为40%
            showNotice('解冻了!', '#4CAF50', head.x, head.y);
        }
    }
}
function isPositionOnWall(x, y) {
    for (const wall of walls) {
        for (const segment of wall.segments) {
            if (segment.x === x && segment.y === y) {
                return true;
            }
        }
    }
    return false;
}
function generateVolcanoes() {
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    const gridSize = 20;
    
    // 清空现有火山和岩浆
    volcanoes = [];
    lavaTiles = [];
    
    // 生成3-5个火山
    const volcanoCount = 4 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < volcanoCount; i++) {
        let validPosition = false;
        let volcanoX, volcanoY;
        let attempts = 0;
        
        while (!validPosition && attempts < 100) {
            attempts++;
            volcanoX = Math.floor(Math.random() * (boardWidth / gridSize - 2)) * gridSize;
            volcanoY = Math.floor(Math.random() * (boardHeight / gridSize - 2)) * gridSize;
            
            validPosition = true;
            
            // 检查是否与蛇重叠
            for (const snakeId in snakes) {
                for (const segment of snakes[snakeId]) {
                    if (Math.abs(segment.x - volcanoX) < 60 && Math.abs(segment.y - volcanoY) < 60) {
                        validPosition = false;
                        break;
                    }
                }
                if (!validPosition) break;
            }
            
            // 检查是否与其他火山太近
            if (validPosition) {
                for (const volcano of volcanoes) {
                    if (Math.abs(volcano.x - volcanoX) < 100 && Math.abs(volcano.y - volcanoY) < 100) {
                        validPosition = false;
                        break;
                    }
                }
            }
        }
        
        if (validPosition) {
            volcanoes.push({
                x: volcanoX,
                y: volcanoY,
                warning: false
            });
        }
    }
}

// 火山喷发处理
function handleVolcanoEruption(timestamp) {
    // 喷发前5秒警告
    if (!isErupting && timestamp > nextEruptionTime - 5000 && timestamp < nextEruptionTime) {
        volcanoes.forEach(volcano => {
            volcano.warning = true;
        });
    }
    
    // 开始喷发
    if (!isErupting && timestamp > nextEruptionTime) {
        isErupting = true;
        lastEruptionTime = timestamp;
        
        // 生成岩浆
        generateLava();
        
        // 10秒后停止喷发
        setTimeout(() => {
            isErupting = false;
            lavaTiles = [];
            nextEruptionTime = timestamp + 30000; // 30秒后下次喷发
        }, 10000);
    }
    
    // 检查岩浆伤害
    if (isErupting) {
        checkLavaDamage(timestamp);
    }
}

// 生成岩浆
function generateLava() {
    lavaTiles = [];
    
    volcanoes.forEach(volcano => {
        // 火山中心3x3区域
        for (let dx = -3; dx <= 3; dx++) {
            for (let dy = -3; dy <= 3; dy++) {
                const lavaX = volcano.x + dx * 20;
                const lavaY = volcano.y + dy * 20;
                
                // 检查是否在墙后
                let blockedByWall = false;
                for (const wall of walls) {
                    for (const segment of wall.segments) {
                        if (segment.x === lavaX && segment.y === lavaY) {
                            blockedByWall = true;
                            break;
                        }
                    }
                    if (blockedByWall) break;
                }
                
                if (!blockedByWall) {
                    lavaTiles.push({
                        x: lavaX,
                        y: lavaY,
                        spawnTime: performance.now()
                    });
                }
            }
        }
    });
}

// 检查岩浆伤害
// 检查岩浆伤害
function checkLavaDamage(timestamp) {
    for (const snakeId in snakes) {
        const head = snakes[snakeId][0];
        
        for (const lava of lavaTiles) {
            if (head.x === lava.x && head.y === lava.y) {
                // 检查是否有免疫效果
                const isImmune = (snakeId === 'snake1' && immunity.snake1) || 
                                (snakeId === 'snake2' && immunity.snake2);
                
                // 每秒造成2点伤害（免疫状态下不受伤害）
                if (timestamp - lava.spawnTime > 1000 && !isImmune) {
                    health[snakeId] -= 2;
                    updateHealthBars();
                    
                    // 显示伤害提示
                    showNotice('-2HP', '#FF4500', head.x, head.y);
                    
                    // 检查游戏结束
                    if (health[snakeId] <= 0) {
                        gameOver();
                    }
                    
                    lava.spawnTime = timestamp;
                } else if (isImmune) {
                    // 显示免疫提示
                    showNotice('免疫岩浆!', '#FFFF00', head.x, head.y);
                }
                break;
            }
        }
    }
}

// 绘制火山和岩浆
function drawVolcanoes() {
    // 绘制火山
    volcanoes.forEach(volcano => {
        const volcanoElement = document.createElement('div');
        volcanoElement.className = 'volcano';
        if (volcano.warning) {
            volcanoElement.classList.add('warning-volcano');
        }
        volcanoElement.style.left = `${volcano.x}px`;
        volcanoElement.style.top = `${volcano.y}px`;
        gameBoard.appendChild(volcanoElement);
    });
    
    // 绘制岩浆
    lavaTiles.forEach(lava => {
        const lavaElement = document.createElement('div');
        lavaElement.className = 'lava';
        lavaElement.style.left = `${lava.x}px`;
        lavaElement.style.top = `${lava.y}px`;
        gameBoard.appendChild(lavaElement);
    });
}
function checkWallCollisions(timestamp) {
    for (const snakeId in snakes) {
        const head = snakes[snakeId][0];
        const headCenterX = head.x + 10; // 蛇头中心X坐标
        const headCenterY = head.y + 10; // 蛇头中心Y坐标
        
        // 遍历所有墙
        for (let w = walls.length - 1; w >= 0; w--) {
            const wall = walls[w];
            
            // 遍历墙的所有段
            for (let s = wall.segments.length - 1; s >= 0; s--) {
                const segment = wall.segments[s];
                const wallCenterX = segment.x + 10; // 墙块中心X坐标
                const wallCenterY = segment.y + 10; // 墙块中心Y坐标
                
                // 计算蛇头与墙块中心的距离
                const distance = Math.sqrt(
                    Math.pow(headCenterX - wallCenterX, 2) + 
                    Math.pow(headCenterY - wallCenterY, 2)
                );
                
                // 距离小于20像素就算碰撞
                if (distance < 20) {
                    // 检查是否是新碰撞（避免同一面墙连续扣血）
                    if (timestamp - lastWallHitTime[snakeId] > 1000) {
                        lastWallHitTime[snakeId] = timestamp;
                        
                        if (!immunity[snakeId]) { // 非免疫状态下扣血
                            health[snakeId] -= 5; // 直接扣5血
                            updateHealthBars();
                            
                            // 显示撞墙提示
                            showNotice('撞墙! -5HP', '#FF0000', head.x, head.y);
                        } else {
                            // 免疫状态下不扣血
                            showNotice('无敌撞墙!', '#FFFF00', head.x, head.y);
                        }
                        
                        // 无论是否免疫，都能撞烂墙
                        createParticles(head.x + 10, head.y + 10, 10, '#FF0000');
                        wall.segments.splice(s, 1);
                        
                        // 如果这面墙的所有段都被撞烂了，移除整面墙
                        if (wall.segments.length === 0) {
                            walls.splice(w, 1);
                        }
                        
                        // 检查游戏结束（只在非免疫状态下）
                        if (!immunity[snakeId] && health[snakeId] <= 0) {
                            gameOver();
                        }
                    }
                    
                    // 移除了回弹代码，蛇可以继续前进
                    
                    break;
                }
            }
        }
    }
}

// 绘制墙的函数（在drawSnakes和drawFoods之后调用）
function drawWalls() {
    walls.forEach(wall => {
        wall.segments.forEach(segment => {
            const wallElement = document.createElement('div');
            wallElement.className = 'wall-segment';
            wallElement.style.left = `${segment.x}px`;
            wallElement.style.top = `${segment.y}px`;
            wallElement.style.width = '20px';
            wallElement.style.height = '20px';
            wallElement.style.backgroundColor = '#555';
            wallElement.style.border = '1px solid #333';
            wallElement.style.position = 'absolute';
            wallElement.style.zIndex = '1';
            
            // 添加闪烁效果提示新生成的墙
            const timeSinceSpawn = performance.now() - wall.spawnTime;
            if (timeSinceSpawn < 2000) {
                wallElement.style.animation = 'wallBlink 0.5s infinite';
            }
            
            gameBoard.appendChild(wallElement);
        });
    });
}

// 在CSS中添加墙的样式
const wallStyle = document.createElement('style');
wallStyle.textContent = `
    @keyframes wallBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .wall-segment {
        background-color: #555;
        border: 1px solid #333;
        position: absolute;
        z-index: 1;
    }
`;
document.head.appendChild(wallStyle);
function updateMagicSnakeTimers(timestamp) {
    // 检查玩家1是否是魔法蛇
    if (snakeTypes.snake1 === 'magic' && timestamp - magicSnakeTimers.snake1 > 20000) {
        generateMagicBall('snake1');
        magicSnakeTimers.snake1 = timestamp;
    }
    
    // 检查玩家2是否是魔法蛇
    if (snakeTypes.snake2 === 'magic' && timestamp - magicSnakeTimers.snake2 > 20000) {
        generateMagicBall('snake2');
        magicSnakeTimers.snake2 = timestamp;
    }
}
function generateMagicBall(snakeId) {
    if (ballStorage[snakeId].length >= 5) {
        // 储存已满，不生成新球
        return;
    }
    
    // 根据概率分布生成球类型
    const randomValue = Math.random();
    let ballType;
    
    if (randomValue < 0.4) { // 40% 攻击球
        ballType = 'attack';
    } else if (randomValue < 0.7) { // 30% 血球
        ballType = 'health';
    } else if (randomValue < 0.9) { // 20% 无敌球
        ballType = 'immunity';
    } else { // 10% 反转球
        ballType = 'reverse';
    }
    
    // 添加到储存
    ballStorage[snakeId].push({ type: ballType });
    updateStorageDisplay();
    
    // 显示提示
    const head = snakes[snakeId][0];
    let message, color;
    switch(ballType) {
        case 'attack':
            message = '获得攻击球!';
            color = '#00BFFF';
            break;
        case 'health':
            message = '获得血球!';
            color = '#FF0000';
            break;
        case 'immunity':
            message = '获得无敌球!';
            color = '#FFFF00';
            break;
        case 'reverse':
            message = '获得反转球!';
            color = '#800080';
            break;
    }
    
    showNotice(message, color, head.x, head.y);
    createParticles(head.x + 10, head.y + 10, 15, color);
}
function drawBullets() {
    bullets.forEach(bullet => {
        const bulletElement = document.createElement('div');
        bulletElement.className = 'bullet';
        bulletElement.style.width = `${bullet.size}px`;
        bulletElement.style.height = `${bullet.size}px`;
        bulletElement.style.borderRadius = '50%';
        bulletElement.style.position = 'absolute';
        bulletElement.style.left = `${bullet.x}px`;
        bulletElement.style.top = `${bullet.y}px`;
        
        // 根据玩家设置子弹颜色
        if (bullet.player === 'snake1') {
            bulletElement.style.background = 'linear-gradient(45deg, #FF5722, #FF9800)';
            bulletElement.style.boxShadow = '0 0 5px #FF5722';
        } else {
            bulletElement.style.background = 'linear-gradient(45deg, #2196F3, #00BCD4)';
            bulletElement.style.boxShadow = '0 0 5px #2196F3';
        }
        
        gameBoard.appendChild(bulletElement);
    });
}
// 更新状态效果
function updateStatusEffects(timestamp) {
    // 更新免疫状态
    if (immunity.timer1 > 0 && timestamp > immunity.timer1) {
        immunity.snake1 = false;
        immunity.timer1 = 0;
        document.getElementById('player1-effect').textContent = '';
    }
    
    if (immunity.timer2 > 0 && timestamp > immunity.timer2) {
        immunity.snake2 = false;
        immunity.timer2 = 0;
        document.getElementById('player2-effect').textContent = '';
    }
    
    // 更新反向控制状态
    if (reversedControls.timer1 > 0 && timestamp > reversedControls.timer1) {
        reversedControls.snake1 = false;
        reversedControls.timer1 = 0;
        document.getElementById('player1-effect').textContent = '';
    }
    
    if (reversedControls.timer2 > 0 && timestamp > reversedControls.timer2) {
        reversedControls.snake2 = false;
        reversedControls.timer2 = 0;
        document.getElementById('player2-effect').textContent = '';
    }
    
    // 更新攻击模式状态
    if (attackMode.timer1 > 0 && timestamp > attackMode.timer1) {
        attackMode.snake1 = false;
        attackMode.timer1 = 0;
        if (attackMode.intervalId1) clearInterval(attackMode.intervalId1);
        document.getElementById('player1-effect').textContent = '';
    }

    if (attackMode.timer2 > 0 && timestamp > attackMode.timer2) {
        attackMode.snake2 = false;
        attackMode.timer2 = 0;
        if (attackMode.intervalId2) clearInterval(attackMode.intervalId2);
        document.getElementById('player2-effect').textContent = '';
}
    
    // 更新状态显示
    updateStatusDisplay();
}
function fireBullet(snakeId) {
    if ((snakeId === 'snake1' && !attackMode.snake1) || 
        (snakeId === 'snake2' && !attackMode.snake2)) {
        return;
    }
    
    const currentTime = performance.now();
    const lastShot = snakeId === 'snake1' ? attackMode.lastShot1 : attackMode.lastShot2;
    
    // 更新最后发射时间
    if (snakeId === 'snake1') {
        attackMode.lastShot1 = currentTime;
    } else {
        attackMode.lastShot2 = currentTime;
    }
    
    const head = snakes[snakeId][0];
    const direction = directions[snakeId];
    
    // 创建子弹
    const bullet = {
        x: head.x,
        y: head.y,
        direction: direction,
        player: snakeId,
        speed: 10, // 每秒移动10个像素
        size: 8 // 子弹大小
    };
    
    bullets.push(bullet);
    
    // 播放发射音效或动画
    createParticles(head.x + 10, head.y + 10, 10, '#FF0000');
}
function moveBullets(timestamp) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // 根据方向移动子弹
        switch (bullet.direction) {
            case 'up':
                bullet.y -= bullet.speed;
                break;
            case 'down':
                bullet.y += bullet.speed;
                break;
            case 'left':
                bullet.x -= bullet.speed;
                break;
            case 'right':
                bullet.x += bullet.speed;
                break;
        }
        
        // 检查是否超出边界
        const boardWidth = gameBoard.clientWidth;
        const boardHeight = gameBoard.clientHeight;
        
        if (bullet.x < 0 || bullet.x >= boardWidth || 
            bullet.y < 0 || bullet.y >= boardHeight) {
            bullets.splice(i, 1);
            continue;
        }
        
        // 检查是否击中墙
        let hitWall = false;
        for (const wall of walls) {
            for (const segment of wall.segments) {
                const distance = Math.sqrt(
                    Math.pow(bullet.x - segment.x - 10, 2) + 
                    Math.pow(bullet.y - segment.y - 10, 2)
                );
                
                if (distance < 15) { // 子弹与墙块碰撞检测
                    hitWall = true;
                    // 子弹击中墙的特效
                    createParticles(bullet.x, bullet.y, 5, '#FFFFFF');
                    break;
                }
            }
            if (hitWall) break;
        }
        
        if (hitWall) {
            bullets.splice(i, 1);
            continue;
        }
        
        // 检查是否击中对方蛇
        const targetSnakeId = bullet.player === 'snake1' ? 'snake2' : 'snake1';
        const targetSnake = snakes[targetSnakeId];
        
        for (let j = 0; j < targetSnake.length; j++) {
            const segment = targetSnake[j];
            const distance = Math.sqrt(Math.pow(bullet.x - segment.x, 2) + Math.pow(bullet.y - segment.y, 2));
            
            if (distance < (20 + bullet.size) / 2) {
                // 击中目标
                bullets.splice(i, 1);
                
                // 如果目标有免疫效果，则不造成伤害
                if ((targetSnakeId === 'snake1' && immunity.snake1) || 
                    (targetSnakeId === 'snake2' && immunity.snake2)) {
                    showNotice('免疫子弹!', '#FFFF00', segment.x, segment.y);
                    createParticles(segment.x + 10, segment.y + 10, 15, '#FFFF00');
                } 
                // 如果是坚硬蛇，有50%概率免疫子弹伤害
                else if ((targetSnakeId === 'snake1' && snakeTypes.snake1 === 'tough' && Math.random() < 0.5) ||
                        (targetSnakeId === 'snake2' && snakeTypes.snake2 === 'tough' && Math.random() < 0.5)) {
                    showNotice('坚硬免疫!', '#C0C0C0', segment.x, segment.y);
                    createParticles(segment.x + 10, segment.y + 10, 15, '#C0C0C0');
                }
                else {
                    // 造成0.5点伤害
                    health[targetSnakeId] -= 0.5;
                    updateHealthBars();
                    
                    // 显示伤害提示
                    showNotice('-0.5HP', '#FF0000', segment.x, segment.y);
                    createParticles(segment.x + 10, segment.y + 10, 20, '#FF0000');
                    
                    // 检查游戏结束条件
                    if (health.snake1 <= 0 || health.snake2 <= 0) {
                        gameOver();
                    }
                }
                break;
            }
        }
    }
}
// 更新状态显示
function updateStatusDisplay() {
    const effect1 = document.getElementById('player1-effect');
    const effect2 = document.getElementById('player2-effect');
    
    effect1.textContent = '';
    effect2.textContent = '';
    
    // 检查是否是魔法蛇
    const isMagicSnake1 = snakeTypes.snake1 === 'magic';
    const isMagicSnake2 = snakeTypes.snake2 === 'magic';
    
    if (immunity.snake1) {
        effect1.textContent += '免疫' + (isMagicSnake1 ? ' (魔法)' : '') + ' ';
    }
    if (reversedControls.snake1) {
        effect1.textContent += '反向控制' + (isMagicSnake1 ? ' (魔法)' : '') + ' ';
    }
    if (attackMode.snake1) {
        effect1.textContent += '攻击模式' + (isMagicSnake1 ? ' (魔法)' : '') + ' ';
    }
    
    if (immunity.snake2) {
        effect2.textContent += '免疫' + (isMagicSnake2 ? ' (魔法)' : '') + ' ';
    }
    if (reversedControls.snake2) {
        effect2.textContent += '反向控制' + (isMagicSnake2 ? ' (魔法)' : '') + ' ';
    }
    if (attackMode.snake2) {
        effect2.textContent += '攻击模式' + (isMagicSnake2 ? ' (魔法)' : '') + ' ';
    }
}

// 移动蛇
function moveSnake(snakeId) {
    const snake = snakes[snakeId];
    const direction = directions[snakeId];
    
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
    
    const otherSnakeId = snakeId === 'snake1' ? 'snake2' : 'snake1';
    const collisionResult = checkOtherSnakeCollision(otherSnakeId, head);
    
    // 检查当前蛇是否有免疫效果
    const isImmune = (snakeId === 'snake1' && immunity.snake1) || 
                     (snakeId === 'snake2' && immunity.snake2);
    
    // 检查对方蛇是否有免疫效果
    const isOtherImmune = (otherSnakeId === 'snake1' && immunity.snake1) || 
                         (otherSnakeId === 'snake2' && immunity.snake2);
    
// 在 moveSnake 函数中修改碰撞处理部分
        if (collisionResult.collided) {
            if (collisionResult.isHeadCollision) {
                // 蛇头相撞处理
                if (!isImmune && !isOtherImmune) {
                    // 双方都没有免疫，都扣血
                    // 如果是坚硬蛇，造成双倍伤害
                    const damage1 = snakeTypes.snake1 === 'tough' ? 5 : 1;
                    const damage2 = snakeTypes.snake2 === 'tough' ? 5 : 1;
                    
                    health.snake1 -= damage2;
                    health.snake2 -= damage1;
                    updateHealthBars();
                    
                    // 双方碰撞特效
                    createParticles(head.x + 10, head.y + 10, 30, '#FF0000');
                    createParticles(snakes[otherSnakeId][0].x + 10, snakes[otherSnakeId][0].y + 10, 30, '#FF0000');
                    
                    // 显示双方伤害提示
                    showNotice(`-${damage1}HP`, '#FF0000', head.x, head.y);
                    showNotice(`-${damage2}HP`, '#FF0000', snakes[otherSnakeId][0].x, snakes[otherSnakeId][0].y);
                } else if (isImmune && !isOtherImmune) {
                    // 只有当前蛇有免疫，只扣对方血
                    const damage = snakeTypes[otherSnakeId] === 'tough' ? 2 : 1;
                    health[otherSnakeId] -= damage;
                    updateHealthBars();
                    
                    // 显示免疫提示和伤害提示
                    showNotice('免疫!', '#FFFF00', head.x, head.y);
                    showNotice(`-${damage}HP`, '#FF0000', snakes[otherSnakeId][0].x, snakes[otherSnakeId][0].y);
                    
                    // 特效
                    createParticles(head.x + 10, head.y + 10, 15, '#FFFF00');
                    createParticles(snakes[otherSnakeId][0].x + 10, snakes[otherSnakeId][0].y + 10, 30, '#FF0000');
                } else if (!isImmune && isOtherImmune) {
                    // 只有对方蛇有免疫，只扣当前蛇血
                    const damage = snakeTypes[snakeId] === 'tough' ? 2 : 1;
                    health[snakeId] -= damage;
                    updateHealthBars();
                    
                    // 显示免疫提示和伤害提示
                    showNotice(`-${damage}HP`, '#FF0000', head.x, head.y);
                    showNotice('免疫!', '#FFFF00', snakes[otherSnakeId][0].x, snakes[otherSnakeId][0].y);
                    
                    // 特效
                    createParticles(head.x + 10, head.y + 10, 30, '#FF0000');
                    createParticles(snakes[otherSnakeId][0].x + 10, snakes[otherSnakeId][0].y + 10, 15, '#FFFF00');
                } else {
                    // 双方都有免疫，都不扣血
                    showNotice('免疫!', '#FFFF00', head.x, head.y);
                    showNotice('免疫!', '#FFFF00', snakes[otherSnakeId][0].x, snakes[otherSnakeId][0].y);
                    
                    // 特效
                    createParticles(head.x + 10, head.y + 10, 15, '#FFFF00');
                    createParticles(snakes[otherSnakeId][0].x + 10, snakes[otherSnakeId][0].y + 10, 15, '#FFFF00');
                }
            } else if (!isImmune) {
                // 普通碰撞：撞的蛇扣血，被撞的蛇截断
                // 如果是坚硬蛇，造成双倍伤害
                const damage = snakeTypes[snakeId] === 'tough' ? 2 : 1;
                health[snakeId] -= damage;
                updateHealthBars();
                
                // 被撞的蛇从碰撞点开始截断
                snakes[otherSnakeId] = snakes[otherSnakeId].slice(0, collisionResult.collisionIndex);
                
                // 碰撞特效
                createParticles(head.x + 10, head.y + 10, 20, snakeId === 'snake1' ? '#FF5722' : '#2196F3');
                
                // 显示伤害提示
                showNotice(`-${damage}HP`, snakeId === 'snake1' ? '#FF5722' : '#2196F3', head.x, head.y);
            } else {
                // 如果有免疫效果，显示免疫提示，不扣血
                showNotice('免疫!', '#FFFF00', head.x, head.y);
                createParticles(head.x + 10, head.y + 10, 15, '#FFFF00');
            }
        }
    
    // 检查是否吃到食物（使用距离判断）
    // 检查是否吃到食物（使用距离判断）
    let ateFood = false;
    for (let i = 0; i < foods.length; i++) {
        const food = foods[i];
        const distance = Math.sqrt(Math.pow(head.x - food.x, 2) + Math.pow(head.y - food.y, 2));
        if (distance < 20) {
            // 播放吃食物动画
            createParticles(food.x + 10, food.y + 10, 20, food.type === 'special' ? '#FFD700' : '#4CAF50');
            
            // 移除被吃的食物
            foods.splice(i, 1);
            
            if (food.type === 'special') {
                // 特殊食物：加100分并储存
                scores[snakeId] += 100;
                updateScoreDisplay();
                
                // 特殊食物储存为随机特殊球
                const specialTypes = ['immunity', 'health', 'reverse'];
                const randomType = specialTypes[Math.floor(Math.random() * specialTypes.length)];
                
                if (ballStorage[snakeId].length < 5) {
                    ballStorage[snakeId].push({type: randomType});
                    showNotice('+100分! 已储存!', '#FFD700', head.x, head.y);
                } else {
                    showNotice('+100分! 储存已满!', '#FF0000', head.x, head.y);
                }
            } else {
                // 普通食物：加10分，蛇身增长，速度增加3%（最多15%）
                scores[snakeId] += 10;
                updateScoreDisplay();
                
                // 增加速度（最多15%）
                if (speedBoosts[snakeId] < 0.3) {
                    speedBoosts[snakeId] = Math.min(0.30, speedBoosts[snakeId] + 0.03);
                    showNotice('+10分! 速度+3%', '#4CAF50', head.x, head.y);
                } else {
                    showNotice('+10分! 速度已达上限', '#4CAF50', head.x, head.y);
                }
                
                ateFood = true; // 蛇身增长
            }
            
            // 更新储存显示
            updateStorageDisplay();
            
            // 生成新食物
            generateFood();
            
            break;
        }
    }
    
    // 检查是否吃到特殊物品
    let ateSpecialItem = false;
    for (let i = 0; i < specialItems.length; i++) {
        const item = specialItems[i];
        const distance = Math.sqrt(Math.pow(head.x - item.x, 2) + Math.pow(head.y - item.y, 2));
        if (distance < 20) {
            // 播放吃特殊物品动画
            createParticles(item.x + 10, item.y + 10, 30, 
                item.type === 'immunity' ? '#FFFF00' : 
                item.type === 'health' ? '#FF0000' : '#800080');
            
            // 应用特殊物品效果
            applySpecialItemEffect(snakeId, item.type);
            
            // 移除被吃的特殊物品
            specialItems.splice(i, 1);
            
            ateSpecialItem = true;
            break;
        }
    }
    
    // 将新头部添加到蛇身
    snake.unshift(head);
    
    // 如果没有吃到食物或特殊物品，移除尾部
    if (!ateFood && !ateSpecialItem) {
        snake.pop();
    }
}

// 应用特殊物品效果
function applySpecialItemEffect(snakeId, itemType) {
    const currentTime = performance.now();
    
    // 检查是否是魔法蛇，如果是则延长效果时间50%
    const isMagicSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'magic' : snakeTypes.snake2 === 'magic';
    const timeMultiplier = isMagicSnake ? 1.5 : 1; // 魔法蛇效果时间延长50%
    
    switch(itemType) {
        case 'immunity':
            // 免疫效果：10秒内完全免疫（锁血），魔法蛇为15秒
            const immunityDuration = 10000 * timeMultiplier;
            if (snakeId === 'snake1') {
                immunity.snake1 = true;
                immunity.timer1 = currentTime + immunityDuration;
                document.getElementById('player1-effect').textContent = '免疫' + (isMagicSnake ? ' (魔法)' : '');
                showNotice('完全免疫激活!' + (isMagicSnake ? ' (魔法延长)' : ''), '#FFFF00', snakes.snake1[0].x, snakes.snake1[0].y);
            } else {
                immunity.snake2 = true;
                immunity.timer2 = currentTime + immunityDuration;
                document.getElementById('player2-effect').textContent = '免疫' + (isMagicSnake ? ' (魔法)' : '');
                showNotice('完全免疫激活!' + (isMagicSnake ? ' (魔法延长)' : ''), '#FFFF00', snakes.snake2[0].x, snakes.snake2[0].y);
            }
            break;
            
        case 'health':
            // 加血效果：增加0.5点生命值
            const maxHealth = snakeId === 'snake1' ? (snakeTypes.snake1 === 'tough' ? 15 : 10) : (snakeTypes.snake2 === 'tough' ? 15 : 10);
            health[snakeId] = Math.min(maxHealth, health[snakeId] + 5);
            updateHealthBars();
            showNotice('+0.5HP', '#FF0000', 
                snakeId === 'snake1' ? snakes.snake1[0].x : snakes.snake2[0].x, 
                snakeId === 'snake1' ? snakes.snake1[0].y : snakes.snake2[0].y);
            break;
            
        case 'reverse':
            // 反向控制效果：对手控制反向，魔法蛇为22.5秒
            const reverseDuration = 8000 * timeMultiplier;
            const opponentId = snakeId === 'snake1' ? 'snake2' : 'snake1';
            if (opponentId === 'snake1') {
                reversedControls.snake1 = true;
                reversedControls.timer1 = currentTime + reverseDuration;
                document.getElementById('player1-effect').textContent = '反向控制' + (isMagicSnake ? ' (魔法)' : '');
                showNotice('控制反向!' + (isMagicSnake ? ' (魔法延长)' : ''), '#800080', snakes.snake1[0].x, snakes.snake1[0].y);
            } else {
                reversedControls.snake2 = true;
                reversedControls.timer2 = currentTime + reverseDuration;
                document.getElementById('player2-effect').textContent = '反向控制' + (isMagicSnake ? ' (魔法)' : '');
                showNotice('控制反向!' + (isMagicSnake ? ' (魔法延长)' : ''), '#800080', snakes.snake2[0].x, snakes.snake2[0].y);
            }
            break;
            
        case 'attack':
            // 攻击球：存储起来，而不是立即使用
            if (ballStorage[snakeId].length < 5) {
                ballStorage[snakeId].push({type: 'attack'});
                updateStorageDisplay();
                showNotice('攻击球已储存!', '#00BFFF', 
                    snakeId === 'snake1' ? snakes.snake1[0].x : snakes.snake2[0].x, 
                    snakeId === 'snake1' ? snakes.snake1[0].y : snakes.snake2[0].y);
            } else {
                showNotice('储存已满!', '#FF0000', 
                    snakeId === 'snake1' ? snakes.snake1[0].x : snakes.snake2[0].x, 
                    snakeId === 'snake1' ? snakes.snake1[0].y : snakes.snake2[0].y);
            }
            break;
    }
}

function releaseBall(snakeId, slotIndex) {
    if (ballStorage[snakeId].length > slotIndex) {
        const ball = ballStorage[snakeId][slotIndex];
        
        // 从储存中移除
        ballStorage[snakeId].splice(slotIndex, 1);
        updateStorageDisplay();
        
        // 如果是攻击球，激活攻击模式
        if (ball.type === 'attack') {
            activateAttackMode(snakeId);
        } else {
            // 其他球立即生效
            applySpecialItemEffect(snakeId, ball.type);
        }
        
        // 显示释放效果
        const head = snakes[snakeId][0];
        const effect = document.createElement('div');
        effect.className = 'release-effect';
        effect.style.left = `${head.x}px`;
        effect.style.top = `${head.y}px`;
        
        // 根据球体类型设置效果颜色
        switch(ball.type) {
            case 'immunity':
                effect.style.background = 'radial-gradient(circle, #FFFF00, transparent)';
                effect.style.width = '40px';
                effect.style.height = '40px';
                break;
            case 'health':
                effect.style.background = 'radial-gradient(circle, #FF0000, transparent)';
                effect.style.width = '40px';
                effect.style.height = '40px';
                break;
            case 'reverse':
                effect.style.background = 'radial-gradient(circle, #800080, transparent)';
                effect.style.width = '40px';
                effect.style.height = '40px';
                break;
            case 'attack':
                effect.style.background = 'radial-gradient(circle, #00BFFF, transparent)';
                effect.style.width = '40px';
                effect.style.height = '40px';
                break;
        }
        
        gameBoard.appendChild(effect);
        
        // 动画结束后移除效果元素
        setTimeout(() => {
            effect.remove();
        }, 500);
    }
}
function activateAttackMode(snakeId) {
    const currentTime = performance.now();
    const isMagicSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'magic' : snakeTypes.snake2 === 'magic';
    const timeMultiplier = isMagicSnake ? 1.5 : 1;
    const attackDuration = 30000 * timeMultiplier; // 30秒，魔法蛇45秒

    if (snakeId === 'snake1') {
        attackMode.snake1 = true;
        attackMode.timer1 = currentTime + attackDuration;
        attackMode.intervalId1 = setInterval(() => {
            if (attackMode.snake1) {
                fireBullet(snakeId);
            } else {
                clearInterval(attackMode.intervalId1);
            }
        }, 400); // 每0.5秒发射一颗
    } else {
        attackMode.snake2 = true;
        attackMode.timer2 = currentTime + attackDuration;
        attackMode.intervalId2 = setInterval(() => {
            if (attackMode.snake2) {
                fireBullet(snakeId);
            } else {
                clearInterval(attackMode.intervalId2);
            }
        }, 400);
    }

    // 更新状态显示
    updateStatusDisplay();
    showNotice('攻击模式激活!' + (isMagicSnake ? ' (魔法延长)' : ''), '#00BFFF', 
        snakeId === 'snake1' ? snakes.snake1[0].x : snakes.snake2[0].x, 
        snakeId === 'snake1' ? snakes.snake1[0].y : snakes.snake2[0].y);
}
// 检查与其他蛇碰撞
function checkOtherSnakeCollision(otherSnakeId, head) {
    const otherSnake = snakes[otherSnakeId];
    
    for (let i = 0; i < otherSnake.length; i++) {
        const segment = otherSnake[i];
        const distance = Math.sqrt(Math.pow(head.x - segment.x, 2) + Math.pow(head.y - segment.y, 2));
        
        if (distance < 20) {
            const isHeadCollision = (i === 0);
            
            // 检查对方是否被冻结
            if (frozenSnakes[otherSnakeId]) {
                // 撞冻结的蛇不掉血，但冻结的蛇会掉血
                if (performance.now() - lastMoveTime[otherSnakeId] > 1000) {
                    health[otherSnakeId] -= 1;
                    updateHealthBars();
                    showNotice('-1HP (冻结碰撞)', '#00BFFF', segment.x, segment.y);
                    lastMoveTime[otherSnakeId] = performance.now();
                    
                    // 检查游戏结束
                    if (health[otherSnakeId] <= 0) {
                        gameOver();
                    }
                }
                return { collided: false }; // 返回未碰撞，因为不掉血
            }
            
            // 检查是否是坚硬蛇并且有抵挡效果
            const currentSnakeId = otherSnakeId === 'snake1' ? 'snake2' : 'snake1';
            const currentSnakeType = snakeTypes[currentSnakeId];
            
            if (currentSnakeType === 'tough' && defenseRate[currentSnakeId] > 0.2) {
                // 坚硬蛇有抵挡效果
                const damageReduction = defenseRate[currentSnakeId];
                
                // 显示抵挡提示
                showNotice(`抵挡${Math.round((1 - damageReduction) * 100)}%!`, '#FFFFFF', head.x, head.y);
                createParticles(head.x + 10, head.y + 10, 15, '#FFFFFF');
                
                // 更新抵挡率
                if (collisionCount[currentSnakeId] < 3) {
                    collisionCount[currentSnakeId]++;
                } else {
                    // 第4次碰撞开始，抵挡率逐步降低
                    defenseRate[currentSnakeId] = Math.max(0.2, defenseRate[currentSnakeId] - 0.2);
                }
                
                return { collided: false }; // 返回未碰撞
            }
            
            return {
                collided: true,
                collisionIndex: i,
                isHeadCollision: isHeadCollision
            };
        }
    }
    
    return { collided: false };
}

// 更新分数显示
function updateScoreDisplay() {
    document.getElementById('score-1').textContent = `${scores.snake1}分`;
    document.getElementById('score-2').textContent = `${scores.snake2}分`;
}

// 更新血量显示
function updateHealthBars() {
    const maxHealth1 = snakeTypes.snake1 === 'tough' ? 13 : 10;
    const maxHealth2 = snakeTypes.snake2 === 'tough' ? 13 : 10;
    
    health1El.style.width = `${(health.snake1 / maxHealth1) * 100}%`;
    health2El.style.width = `${(health.snake2 / maxHealth2) * 100}%`;
    document.getElementById('health-text-1').textContent = `${health.snake1}HP`;
    document.getElementById('health-text-2').textContent = `${health.snake2}HP`;
}

// 显示通知
function showNotice(text, color, x, y) {
    const notice = document.createElement('div');
    notice.textContent = text;
    notice.style.position = 'absolute';
    notice.style.left = `${x}px`;
    notice.style.top = `${y}px`;
    notice.style.color = color;
    notice.style.fontSize = '16px';
    notice.style.fontWeight = 'bold';
    notice.style.textShadow = '0 0 5px white';
    notice.style.zIndex = '10';
    notice.style.animation = 'fadeOut 1s forwards';
    gameBoard.appendChild(notice);
    
    setTimeout(() => {
        notice.remove();
    }, 1000);
}

function gameOver() {
    gameOverScreen.style.display = '';
    gameStarted = false;
    let hasUploaded = false;
    if (attackMode.intervalId1) clearInterval(attackMode.intervalId1);
    if (attackMode.intervalId2) clearInterval(attackMode.intervalId2);
    attackMode = {
        snake1: false,
        snake2: false,
        timer1: 0,
        timer2: 0,
        lastShot1: 0,
        lastShot2: 0,
        intervalId1: null,
        intervalId2: null
    };
    document.getElementById("back").style.display = "block";
    viewRecords.style.display = 'block';
    gameOverScreen.classList.remove('show');
    document.getElementById("back").onclick = function(){ 
        if(!gameStarted){     
            gameOverScreen.classList.remove('show');
            characterSelection.classList.add('show');
            gameStarted = true;
        } else {
            document.getElementById("back").onclick=goBackOrHome();
        }
    }

    // 确定获胜者
    let winner = null;
    let currentWin1 = 0;
    let currentWin2 = 0;
    
    if (health.snake1 <= 0 && health.snake2 <= 0) {
        winner = 'draw';
    } else if (health.snake1 <= 0) {
        winner = 'snake2';
        currentWin2 = 1; // 标记玩家2本次获胜
    } else {
        winner = 'snake1';
        currentWin1 = 1; // 标记玩家1本次获胜
    }

    // 获取服务器数据并显示
    getServerRecords().then(serverData => {
        // 只显示历史战绩，不包含本次结果
        let player1Wins = serverData?.player1Wins || 0;
        let player2Wins = serverData?.player2Wins || 0;
        // 创建游戏结束界面
        gameOverScreen.innerHTML = `
            <div class="game-over-content">
                <div class="winner-container">
                    ${winner === 'draw' ? `
                        <div class="trophy-icon">
                            <i class="fas fa-trophy" style="color: #FFD700;"></i>
                            <i class="fas fa-trophy" style="color: #C0C0C0;"></i>
                        </div>
                        <h2 class="winner-banner">平局!</h2>
                    ` : `
                        <div class="trophy-icon">
                            <i class="fas fa-trophy" style="color: ${winner === 'snake1' ? '#FFD700' : '#C0C0C0'};"></i>
                        </div>
                        <h2 class="winner-banner ${winner === 'snake1' ? 'player-1-win' : 'player-2-win'}">
                            ${winner === 'snake1' ? localStorage.getItem("username") : localStorage.getItem("player2_username")}获胜!
                        </h2>
                    `}
                </div>
                
                <div class="stats-container">
                    <div class="player-stats player-1-stats">
                        <div class="player-avatar">
                            <i class="fas fa-user" style="color: #FF5722;"></i>
                        </div>
                        <div class="player-name">${localStorage.getItem("username") || "玩家1"}</div>
                        <div class="win-count">
                            <span class="history-wins">${player1Wins}</span>
                            ${currentWin1 > 0 ? `<span class="current-win">+${currentWin1}</span>` : ''}
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${calculateWinPercentage(player1Wins, player2Wins)}%; background: linear-gradient(to right, #FF5722, #FF9800);"></div>
                        </div>
                    </div>
                    
                    <div class="vs-text">VS</div>
                    
                    <div class="player-stats player-2-stats">
                        <div class="player-avatar">
                            <i class="fas fa-user" style="color: #2196F3;"></i>
                        </div>
                        <div class="player-name">${localStorage.getItem("player2_username") || "玩家2"}</div>
                        <div class="win-count">
                            <span class="history-wins">${player2Wins}</span>
                            ${currentWin2 > 0 ? `<span class="current-win">+${currentWin2}</span>` : ''}
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${calculateWinPercentage(player2Wins, player1Wins)}%; background: linear-gradient(to right, #2196F3, #00BCD4);"></div>
                        </div>
                    </div>
                </div>
                
                <div class="buttons-container">
                    <button class="restart-btn" id="play-again">
                        <i class="fas fa-redo"></i> 再来一局
                    </button>
                    <button class="restart-btn upload-btn" id="save-record">
                        <i class="fas fa-save"></i> 保存战绩
                    </button>
                </div>
            </div>
        `;

        // 再来一局按钮事件
        document.getElementById('play-again').addEventListener('click', () => {
            gameOverScreen.classList.remove('show');
            setTimeout(() => {
                initGame();
            }, 300);
        });

        // 保存战绩按钮事件
        document.getElementById('save-record').addEventListener('click', () => {
            // 禁用按钮防止重复点击
            const saveBtn = document.getElementById('save-record');
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> 保存中...`;
            
            // 上传本次比赛结果
            uploadGameRecord(currentWin1, currentWin2).then(() => {
                // 上传成功后更新显示
                const historyWins1 = document.querySelector('.player-1-stats .history-wins');
                const historyWins2 = document.querySelector('.player-2-stats .history-wins');
                
                if (historyWins1 && historyWins2) {
                    // 更新显示为历史战绩+本次结果
                    historyWins1.textContent = player1Wins + currentWin1;
                    historyWins2.textContent = player2Wins + currentWin2;
                    
                    // 隐藏+1提示
                    const currentWinElements = document.querySelectorAll('.current-win');
                    currentWinElements.forEach(el => el.remove());
                    
                    // 更新进度条
                    const progress1 = document.querySelector('.player-1-stats .progress-fill');
                    const progress2 = document.querySelector('.player-2-stats .progress-fill');
                    if (progress1 && progress2) {
                        progress1.style.width = `${calculateWinPercentage(player1Wins + currentWin1, player2Wins + currentWin2)}%`;
                        progress2.style.width = `${calculateWinPercentage(player2Wins + currentWin2, player1Wins + currentWin1)}%`;
                    }
                    
                    // 显示保存成功提示
                    showGameOverMessage('战绩保存成功!', '#4CAF50');
                    
                    // 更新按钮状态
                    saveBtn.innerHTML = `<i class="fas fa-check"></i> 已保存`;
                }
            }).catch(error => {
                console.error('保存战绩失败:', error);
                showGameOverMessage('保存失败: ' + error.message, '#FF5722');
                
                // 恢复按钮状态
                saveBtn.disabled = false;
                saveBtn.innerHTML = `<i class="fas fa-save"></i> 保存战绩`;
            });
        });

        // 显示游戏结束界面
        gameOverScreen.classList.add('show');
        
        // 添加庆祝效果
        if (winner !== 'draw') {
            createCelebrationEffect(winner === 'snake1' ? '#FF5722' : '#2196F3');
        }
    });
}

// 修改上传战绩函数，确保只上传一次
let hasUploaded = false;

function showGameOverMessage(message, color) {
    const messageEl = document.createElement('div');
    messageEl.className = 'game-over-message';
    messageEl.textContent = message;
    messageEl.style.color = color;
    
    const buttonsContainer = document.querySelector('.buttons-container');
    if (buttonsContainer) {
        buttonsContainer.insertAdjacentElement('beforebegin', messageEl);
        
        // 3秒后淡出
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                messageEl.remove();
            }, 500);
        }, 3000);
    }
}

// 计算胜率百分比
function calculateWinPercentage(wins, opponentWins) {
    const total = wins + opponentWins;
    return total > 0 ? Math.round((wins / total) * 100) : 50;
}


// 创建庆祝效果
function createCelebrationEffect(color) {
    const colors = [color, '#FFFFFF', '#FFD700'];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'celebration-particle';
        
        // 随机属性
        const size = 5 + Math.random() * 10;
        const duration = 1 + Math.random() * 2;
        const delay = Math.random() * 0.5;
        const distance = 50 + Math.random() * 100;
        const angle = Math.random() * Math.PI * 2;
        
        // 设置样式
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // 设置初始位置
        particle.style.left = '50%';
        particle.style.top = '30%';
        
        // 设置动画终点
        particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
        
        gameOverScreen.appendChild(particle);
        
        // 动画结束后移除
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }
}
// 获取服务器记录
async function getServerRecords() {
    try {
        const userId = localStorage.getItem("userid");
        const player2UserId = localStorage.getItem("player2_userid");
        const currentUsername = localStorage.getItem("username");
        const player2Username = localStorage.getItem("player2_username");
        
        if (!userId || !player2UserId || !currentUsername || !player2Username) {
            return null;
        }
        
        // 获取当前用户的记录
        const currentUserData = await getUserCustomData(userId);
        const player2Data = await getUserCustomData(player2UserId);
        
        let player1Wins = 0;
        let player2Wins = 0;
        
        // 从当前用户数据中解析
        if (currentUserData) {
            const records = currentUserData.split(';');
            for (const record of records) {
                if (record.startsWith(`snakegame_record_with_${player2Username}`)) {
                    const parts = record.split(':')[1].split(',');
                    player1Wins += parseInt(parts[0]) || 0;
                    player2Wins += parseInt(parts[1]) || 0;
                }
            }
        }
        return {
            player1Wins,
            player2Wins
        };
    } catch (error) {
        console.error('获取服务器记录失败:', error);
        return null;
    }
}
async function uploadGameRecord(player1Wins, player2Wins) {
    if (hasUploaded) {
        throw new Error('战绩已保存，请勿重复提交');
    }
    
    try {
        const userId = localStorage.getItem("userid");
        const player2UserId = localStorage.getItem("player2_userid");
        const currentUsername = localStorage.getItem("username");
        const player2Username = localStorage.getItem("player2_username");
        
        if (!userId || !player2UserId || !currentUsername || !player2Username) {
            throw new Error('用户信息不完整');
        }
        
        // 准备上传的数据
        const recordForCurrentUser = `snakegame_record_with_${player2Username}:${player1Wins},${player2Wins}`;
        const recordForPlayer2 = `snakegame_record_with_${currentUsername}:${player2Wins},${player1Wins}`;
        
        // 获取当前用户的现有数据
        const currentUserData = await getUserCustomData(userId);
        const player2Data = await getUserCustomData(player2UserId);
        
        // 更新数据
        const updatedCurrentUserData = updateRecord(currentUserData, recordForCurrentUser);
        const updatedPlayer2Data = updateRecord(player2Data, recordForPlayer2);
        
        // 上传更新后的数据
        await Promise.all([
            updateUserCustomData(userId, updatedCurrentUserData),
            updateUserCustomData(player2UserId, updatedPlayer2Data)
        ]);
        
        return true;
    } catch (error) {
        console.error('上传战绩失败:', error);
        throw error;
    }
}
// 获取用户自定义数据
async function getUserCustomData(userId) {
    try {
        const response = await fetch(`${serverurl}/get-custom-data-by-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId
            })
        });
        
        const data = await response.json();
        if (data.success) {
            return data.data.customData || '';
        }
        throw new Error(data.message || '获取用户数据失败');
    } catch (error) {
        console.error('获取用户数据失败:', error);
        throw error;
    }
}

// 更新记录
function updateRecord(currentData, newRecord) {
    if (!currentData) return newRecord;
    
    const recordKey = newRecord.split(':')[0];
    const records = currentData.split(';');
    let found = false;
    
    const updatedRecords = records.map(record => {
        if (record.startsWith(recordKey)) {
            found = true;
            const [oldP1Wins, oldP2Wins] = record.split(':')[1].split(',').map(Number);
            const [newP1Wins, newP2Wins] = newRecord.split(':')[1].split(',').map(Number);
            return `${recordKey}:${oldP1Wins + newP1Wins},${oldP2Wins + newP2Wins}`;
        }
        return record;
    });
    
    if (!found) {
        updatedRecords.push(newRecord);
    }
    
    return updatedRecords.filter(r => r).join(';');
}

// 更新用户自定义数据
async function updateUserCustomData(userId, customData) {
    try {
        const response = await fetch(`${serverurl}/update-custom-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                customData: customData
            })
        });
        
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || '更新数据失败');
        }
    } catch (error) {
        console.error('更新用户数据失败:', error);
        throw error;
    }
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
    // 阻止空格和Enter键的默认行为，避免触发按钮点击
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
    }
    
    if (!gameStarted) return;
    if (e.key >= '1' && e.key <= '5') {
        const slotIndex = parseInt(e.key) - 1;
        releaseBall('snake1', slotIndex);
        return;
    }
    
    // 玩家2释放球体 (按键6-0)
    if ((e.key >= '6' && e.key <= '9') || e.key === '0') {
        const slotIndex = e.key === '0' ? 4 : parseInt(e.key) - 6;
        releaseBall('snake2', slotIndex);
        return;
    }
    if (e.key === 'z' || e.key === 'Z') {
        pausedSnakes.snake1 = !pausedSnakes.snake1;
        showNotice(pausedSnakes.snake1 ? '玩家1已暂停' : '玩家1已恢复', 
                  '#FF5722', snakes.snake1[0].x, snakes.snake1[0].y);
        return;
    }
    
    if (e.key === 'm' || e.key === 'M') {
        pausedSnakes.snake2 = !pausedSnakes.snake2;
        showNotice(pausedSnakes.snake2 ? '玩家2已暂停' : '玩家2已恢复', 
                  '#2196F3', snakes.snake2[0].x, snakes.snake2[0].y);
        return;
    }    
    // 处理玩家1控制 (WASD)
    if (reversedControls.snake1) {
        // 反向控制
        switch (e.key) {
            case 'w':
            case 'W':
                if (directions.snake1 !== 'up') nextDirections.snake1 = 'down';
                break;
            case 's':
            case 'S':
                if (directions.snake1 !== 'down') nextDirections.snake1 = 'up';
                break;
            case 'a':
            case 'A':
                if (directions.snake1 !== 'left') nextDirections.snake1 = 'right';
                break;
            case 'd':
            case 'D':
                if (directions.snake1 !== 'right') nextDirections.snake1 = 'left';
                break;
        }
    } else {
        // 正常控制
        switch (e.key) {
            case 'w':
            case 'W':
                if (directions.snake1 !== 'down') nextDirections.snake1 = 'up';
                break;
            case 's':
            case 'S':
                if (directions.snake1 !== 'up') nextDirections.snake1 = 'down';
                break;
            case 'a':
            case 'A':
                if (directions.snake1 !== 'right') nextDirections.snake1 = 'left';
                break;
            case 'd':
            case 'D':
                if (directions.snake1 !== 'left') nextDirections.snake1 = 'right';
                break;
        }
    }
    
    // 处理玩家2控制 (方向键)
    if (reversedControls.snake2) {
        // 反向控制
        switch (e.key) {
            case 'ArrowUp':
                if (directions.snake2 !== 'up') nextDirections.snake2 = 'down';
                break;
            case 'ArrowDown':
                if (directions.snake2 !== 'down') nextDirections.snake2 = 'up';
                break;
            case 'ArrowLeft':
                if (directions.snake2 !== 'left') nextDirections.snake2 = 'right';
                break;
            case 'ArrowRight':
                if (directions.snake2 !== 'right') nextDirections.snake2 = 'left';
                break;
        }
    } else {
        // 正常控制
        switch (e.key) {
            case 'ArrowUp':
                if (directions.snake2 !== 'down') nextDirections.snake2 = 'up';
                break;
            case 'ArrowDown':
                if (directions.snake2 !== 'up') nextDirections.snake2 = 'down';
                break;
            case 'ArrowLeft':
                if (directions.snake2 !== 'right') nextDirections.snake2 = 'left';
                break;
            case 'ArrowRight':
                if (directions.snake2 !== 'left') nextDirections.snake2 = 'right';
                break;
        }
    }
});

// 开始游戏按钮
startBtn.addEventListener('click', () => {
    const player1Name = localStorage.getItem('username') || '玩家1';
    document.getElementById('player1-name').textContent = player1Name + ': ';
    player2Name=localStorage.getItem("player2_username");
    if(!player2Name){
        loginPlayer2();
    }
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
    @keyframes buttonClick {
        50% { transform: scale(0.9); }
        100% { transform: scale(1); }
    }
    @keyframes startScreenExit {
        to { opacity: 0; transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// 添加角色选择界面交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    const startScreen = document.querySelector('.start-screen');
    const startBtn = document.querySelector('.start-btn');
    const snakeOptions = document.querySelectorAll('.snake-option');
    const startGameBtn = document.querySelector('.start-game-btn');
    
    // 开始按钮点击事件
    startBtn.addEventListener('click', () => {
        startScreen.classList.add('hide');
        setTimeout(() => {
            characterSelection.classList.add('show');
        }, 500);
    });
    
    // 蛇类型选择事件
    snakeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const player = this.getAttribute('data-player');
            const type = this.getAttribute('data-type');
            
            // 移除同玩家的其他选择
            document.querySelectorAll(`.snake-option[data-player="${player}"]`).forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // 添加当前选择
            this.classList.add('selected');
            
            // 保存选择
            snakeTypes[`snake${player}`] = type;
            
            // 检查是否两位玩家都已选择
            if (snakeTypes.snake1 && snakeTypes.snake2) {
                startGameBtn.disabled = false;
            }
        });
    });
    
// 修改角色选择后的流程
document.querySelector('.character-selection .start-game-btn').addEventListener('click', () => {
    characterSelection.classList.remove('show');
    setTimeout(() => {
        document.querySelector('.map-selection').classList.add('show');
    }, 500);
});

// 地图选择交互
document.querySelectorAll('.map-option').forEach(option => {
    option.addEventListener('click', function() {
        document.querySelectorAll('.map-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        this.classList.add('selected');
        currentMap = this.getAttribute('data-map');
        document.querySelector('.map-selection .start-game-btn').disabled = false;
    });
});

// 开始游戏按钮
document.querySelector('.map-selection .start-game-btn').addEventListener('click', () => {
    document.querySelector('.map-selection').classList.remove('show');
    setTimeout(() => {
        initGame();
    }, 500);
});
});
        // 添加玩家2登录功能
function loginPlayer2() {
    swal({
        title: "玩家2登录",
        text: "请输入用户名和密码",
        type: "input",
        inputType: "text",
        inputPlaceholder: "请输入用户名",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonText: "下一步",
        closeOnConfirm: false
    }, function(username) {
        if (username === false) return false;
        if (!username) {
            swal.showInputError("请输入用户名");
            return false;
        }
        
        // 检查是否与玩家1用户名相同
        const player1Username = localStorage.getItem('username');
        if (player1Username && username === player1Username) {
            swal.showInputError("用户名不能与玩家1相同");
            return false;
        }
        
        // 第二步：询问密码
        swal({
            title: "玩家2登录",
            text: "请输入密码",
            type: "input",
            inputType: "password",
            inputPlaceholder: "请输入密码",
            showCancelButton: true,
            cancelButtonText: "上一步",
            confirmButtonText: "登录",
            closeOnConfirm: false
        }, function(password) {
            if (password === false) {
                // 点击取消返回上一步
                loginPlayer2();
                return false;
            }
            if (!password) {
                swal.showInputError("请输入密码");
                return false;
            }
            
            // 发送登录请求
            fetch(`${serverurl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(response => response.text())
            .then(data => {
                if (data.includes('<h1>登录成功</h1>')) {
                    localStorage.setItem('player2_username', username);
                    fetch(`${serverurl}/get-user-id-by-username`, {
                                method: 'POST', // 指定请求方法
                                headers: {
                                    'Content-Type': 'application/json' // 设置请求头
                                },
                                body: JSON.stringify({ username: username }) // 请求体
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json(); // 解析JSON数据
                                })
                                .then(data => {
                                    // 处理返回的数据
                                    if (data.success) {
                                        // 假设data.data中包含userId
                                        const userId = data.data.userId;
                                        localStorage.setItem("player2_userid",userId);
                                        document.getElementById('player2-name').textContent = username + ': ';
                                        document.getElementById("player-label1").textContent =localStorage.getItem("username") + "(橙色)"
                                        document.getElementById("player-label2").textContent =localStorage.getItem("player2_username") + "(蓝色)"
                                        document.getElementById("storage-title1").textContent =localStorage.getItem("username") + "储存:"
                                        document.getElementById("storage-title2").textContent =localStorage.getItem("player2_username") + "储存:"                    
                                        swal("登录成功", "玩家2已登录", "success");
                                    } else {
                                        // 显示错误信息
                                        console.log(data.message);
                                    }
                                })
                                .catch(error => {
                                    // 处理请求过程中的错误
                                    console.error('Fetch error:', error);
                                });
                } else if (data.includes('登录失败')) {
                    swal("登录失败", '用户名或密码错误', 'error');
                    document.querySelector('.start-game-btn').style.display = "none";
                }
            })
            .catch(error => {
                console.error(error);
                swal("请求失败", "请稍后重试", "error");
            });
        });
    });
}
// 蛇类详细数据
const snakeDetails = {
    speed: {
        title: "速度蛇",
        color: "#FFD700",
        ratings: [
            { name: "生命", value: 3, max: 5 },
            { name: "速度", value: 5, max: 5 },
            { name: "魔法", value: 1, max: 5 }
        ],
        attributes: [
            { 
                name: "移动速度", 
                value: "<span class='speed-icon'></span> +50%", 
                desc: "移动间隔减少50%，比普通蛇快一倍" 
            },
            { 
                name: "生命值", 
                value: "<span class='health-icon'></span> 10HP", 
                desc: "标准生命值，碰撞会受到正常伤害" 
            },
            { 
                name: "特殊能力", 
                value: "无", 
                desc: "专注于高速移动，没有其他特殊能力" 
            }
        ],
        tips: "适合喜欢快节奏、高操作的玩家。利用速度优势快速包围对手。"
    },
    tough: {
        title: "坚硬蛇",
        color: "#C0C0C0",
        ratings: [
            { name: "生命", value: 5, max: 5 },
            { name: "速度", value: 2, max: 5 },
            { name: "魔法", value: 1, max: 5 }
        ],
        attributes: [
            { 
                name: "生命值", 
                value: "<span class='health-icon'></span> 10HP(上限15)", 
                desc: "1.5倍生命值，生存能力更强" 
            },
            { 
                name: "进攻", 
                value: "撞击别人伤害增加", 
                desc: "仅有0.5概率受到子弹伤害" 
            },
            { 
                name: "速度", 
                value: "标准速度", 
                desc: "移动速度较慢" 
            }
        ],
        tips: "适合稳健型玩家。高生命值让你可以承受更多失误，但要注意子弹伤害不减。"
    },
    magic: {
        title: "魔法蛇",
        color: "#9C27B0",
        ratings: [
            { name: "生命", value: 3, max: 5 },
            { name: "速度", value: 3, max: 5 },
            { name: "魔法", value: 5, max: 5 }
        ],
        attributes: [
            { 
                name: "移动速度", 
                value: "<span class='speed-icon'></span> +15%", 
                desc: "比坚硬蛇稍快，但不如速度蛇" 
            },
            { 
                name: "效果时长", 
                value: "<span class='magic-icon'></span> +50%", 
                desc: "所有特殊球效果时间延长50%" 
            },
            { 
                name: "自动获得", 
                value: "每20秒", 
                desc: "自动获得一个随机特殊球(攻击40%/血球30%/无敌20%/反转10%)" 
            }
        ],
        tips: "适合策略型玩家。合理规划特殊球使用时机，效果延长让你更有优势。"
    }
};

// 显示蛇类详情
function showSnakeDetails(type) {
    const detail = snakeDetails[type];
    const modal = document.getElementById('snake-details-modal');
    const content = document.getElementById('snake-details-content');
    
    content.innerHTML = `
        <div class="snake-type-title" style="color: ${detail.color}">
            ${detail.title}
        </div>
        
        <!-- 星级评分 -->
        <div style="margin:15px 0;display:flex;justify-content:center;background:rgba(255,255,255,0.1);padding:10px;border-radius:8px;">
            ${detail.ratings.map(rating => `
                <div class="star-rating ${rating.name.toLowerCase()}-rating">
                    ${rating.name}:
                    ${'★'.repeat(rating.value)}${'☆'.repeat(rating.max - rating.value)}
                    <span class="rating-value">${rating.value}/${rating.max}</span>
                </div>
            `).join('')}
        </div>
        
        ${detail.attributes.map(attr => `
            <div class="snake-attribute">
                <div class="attribute-name">${attr.name}:</div>
                <div class="attribute-value">
                    <div>${attr.value}</div>
                    <div style="font-size:12px;color:#ccc">${attr.desc}</div>
                </div>
            </div>
        `).join('')}
        
        <div style="margin-top:20px;padding:10px;background:rgba(255,255,255,0.1);border-radius:8px;">
            <strong>玩法提示：</strong> ${detail.tips}
        </div>
    `;
    
    modal.style.display = 'block';
}

// 为所有蛇类选项添加点击事件
document.querySelectorAll('.snake-option').forEach(option => {
    option.addEventListener('click', function(e) {
        // 阻止事件冒泡，避免与选择逻辑冲突
        if (e.target === this || e.target.classList.contains('snake-type')) {
            const type = this.getAttribute('data-type');
            showSnakeDetails(type);
        }
    });
});

// 关闭弹窗
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('snake-details-modal').style.display = 'none';
});

// 点击外部关闭
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('snake-details-modal')) {
        document.getElementById('snake-details-modal').style.display = 'none';
    }
});
// 战绩查询功能
document.getElementById('view-records').addEventListener('click', showAllRecords);

// 显示所有战绩记录
async function showAllRecords() {
    try {
        const modal = document.getElementById('records-modal');
        const container = document.getElementById('records-container');
        modal.style.zIndex = "100";
        // 显示加载中
        container.innerHTML = '<div class="loading">加载中...</div>';
        modal.style.display = 'block';
        
        // 获取所有用户数据
        const response = await fetch(`${serverurl}/get-all-custom-data`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('获取数据失败');
        }
        
        // 处理并显示数据
        displayRecords(data.data);
        
        // 添加搜索功能
        document.getElementById('search-username').addEventListener('input', (e) => {
            filterRecords(e.target.value, data.data);
        });
        
        // 刷新按钮
        document.getElementById('refresh-records').addEventListener('click', showAllRecords);
        
    } catch (error) {
        console.error('获取战绩失败:', error);
        document.getElementById('records-container').innerHTML = 
            `<div class="error">获取战绩失败: ${error.message}</div>`;
    }
}

// 显示战绩记录
function displayRecords(users) {
    const container = document.getElementById('records-container');
    container.innerHTML = '';
    
    if (!users || users.length === 0) {
        container.innerHTML = '<div class="no-data">暂无战绩数据</div>';
        return;
    }
    
    // 处理每个用户的记录
    users.forEach(user => {
        if (!user.customData) return;
        
        // 解析对战记录
        const records = parseRecords(user.customData);
        if (records.length === 0) return;
        
        // 计算总胜率
        const stats = calculateStats(records);
        
        // 创建记录元素
        const recordElement = document.createElement('div');
        recordElement.className = 'record-item';
        recordElement.innerHTML = `
            
            <div class="record-details">
                <div class="record-username">${user.username}</div>
                <div class="record-stats">
                    <div class="record-stat">总场次: ${stats.totalMatches}</div>
                    <div class="record-stat">总胜场: ${stats.totalWins}</div>
                    <div class="record-stat">胜率: ${stats.winRate}%</div>
                </div>
                ${records.map(record => `
                    <div class="record-match">
                        <div class="record-match-opponent">
                            
                            <span>对战 ${record.opponentName}</span>
                        </div>
                        <div>战绩: ${record.wins}胜 ${record.losses}负</div>
                        <div>胜率: ${record.winRate}%</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.appendChild(recordElement);
    });
}

// 过滤记录
function filterRecords(searchTerm, allUsers) {
    const filteredUsers = allUsers.filter(user => {
        // 检查用户名是否匹配
        if (user.username.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
        }
        
        // 检查对战记录中是否包含搜索词
        if (user.customData && user.customData.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
        }
        
        return false;
    });
    
    displayRecords(filteredUsers);
}

// 解析记录数据
function parseRecords(customData) {
    if (!customData) return [];
    
    const records = [];
    const recordStrings = customData.split(';');
    
    recordStrings.forEach(str => {
        if (!str.startsWith('snakegame_record_with_')) return;
        
        const parts = str.split(':');
        if (parts.length !== 2) return;
        
        const opponentName = parts[0].replace('snakegame_record_with_', '');
        const [wins, losses] = parts[1].split(',').map(Number);
        
        if (isNaN(wins) || isNaN(losses)) return;
        
        const total = wins + losses;
        const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
        
        records.push({
            opponentName,
            wins,
            losses,
            winRate,
            opponentAvatar: `https://jbcfz.serveo.net/get-icon-by-id?username=${encodeURIComponent(opponentName)}`
        });
    });
    
    return records;
}

// 计算统计数据
function calculateStats(records) {
    let totalWins = 0;
    let totalLosses = 0;
    
    records.forEach(record => {
        totalWins += record.wins;
        totalLosses += record.losses;
    });
    
    const totalMatches = totalWins + totalLosses;
    const winRate = totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0;
    
    return {
        totalMatches,
        totalWins,
        totalLosses,
        winRate
    };
}

// 关闭模态框
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('records-modal').style.display = 'none';
    });
});

// 点击外部关闭
window.addEventListener('click', function(event) {
    if (event.target === document.getElementById('records-modal')) {
        document.getElementById('records-modal').style.display = 'none';
    }
});
});