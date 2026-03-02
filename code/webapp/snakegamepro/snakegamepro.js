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
let deathCause = {
    snake1: null,
    snake2: null
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
const MAX_BULLETS = 100;
let speedBoosts = {
    snake1: 0,
    snake2: 0
};
let baseDefense = {
    player1: {
        lastShotTime: 0,
        bulletSpeed: 1, // 稍微降低速度
        attackRange: 15, // 20格 = 400像素
        active: false,
        targetSnake: null,
        damage: 0.5,
        shootInterval: 1000 // 2秒间隔
    },
    player2: {
        lastShotTime: 0,
        bulletSpeed: 1,
        attackRange: 15,
        active: false,
        targetSnake: null,
        damage: 0.5,
        shootInterval: 1000
    }
};
// 在游戏变量中添加统计变量
// 修改游戏统计数据初始化
let gameStats = {
    startTime: 0,
    snake1: {
        // 承受伤害统计
        damageReceived: {
            wall: 0,
            snakeCollision: 0,
            bullet: 0,
            base: 0,
            lava: 0,
            home: 0,
            bomb: 0
        },
        originalDamageReceived: {
            wall: 0,
            snakeCollision: 0,
            bullet: 0,
            base: 0,
            lava: 0,
            home: 0,
            bomb: 0
        },
        
        // === 输出伤害统计 - 确保这部分存在 ===
        damageDealt: {
            snakeCollision: 0,
            bullet: 0,
            bomb: 0,
            base: 0, // 基地子弹伤害
            wall: 0  // 撞墙伤害（如果有）
        },
        originalDamageDealt: {
            snakeCollision: 0,
            bullet: 0,
            bomb: 0,
            base: 0,
            wall: 0
        },
        
        // 防御统计
        shieldDamageAbsorbed: 0,
        shieldBlocks: 0,
        shieldBreaks: 0,
        immuneDamagePrevented: {},
        immuneBlocks: 0,
        toughImmuneDamagePrevented: {},
        toughImmuneBlocks: 0,
        toughReducedDamage: {},
        
        // 移动统计
        distanceTraveled: 0,
        
        // 总计
        totalDamageReceived: 0,
        totalOriginalDamageReceived: 0,
        totalDamageDealt: 0,        // 确保这个存在
        totalOriginalDamageDealt: 0 // 确保这个存在
    },
    snake2: {
        // 同样的结构
        damageReceived: {
            wall: 0,
            snakeCollision: 0,
            bullet: 0,
            base: 0,
            lava: 0,
            home: 0,
            bomb: 0
        },
        originalDamageReceived: {
            wall: 0,
            snakeCollision: 0,
            bullet: 0,
            base: 0,
            lava: 0,
            home: 0,
            bomb: 0
        },
        
        // === 输出伤害统计 ===
        damageDealt: {
            snakeCollision: 0,
            bullet: 0,
            bomb: 0,
            base: 0,
            wall: 0
        },
        originalDamageDealt: {
            snakeCollision: 0,
            bullet: 0,
            bomb: 0,
            base: 0,
            wall: 0
        },
        
        // 防御统计
        shieldDamageAbsorbed: 0,
        shieldBlocks: 0,
        shieldBreaks: 0,
        immuneDamagePrevented: {},
        immuneBlocks: 0,
        toughImmuneDamagePrevented: {},
        toughImmuneBlocks: 0,
        toughReducedDamage: {},
        
        distanceTraveled: 0,
        totalDamageReceived: 0,
        totalOriginalDamageReceived: 0,
        totalDamageDealt: 0,
        totalOriginalDamageDealt: 0
    }
};
let storeOpen = {
    snake1: false,
    snake2: false
};

let storeSelectedItem = {
    snake1: 0,
    snake2: 0
};
// 在游戏变量中添加护盾状态
let shields = {
    snake1: {
        active: false,
        health: 0,
        maxHealth: 10
    },
    snake2: {
        active: false,
        health: 0,
        maxHealth: 10
    }
};
let dashState = {
    snake1: {
        active: false,
        lastKey: null,
        lastKeyTime: 0,
        endTime: 0
    },
    snake2: {
        active: false,
        lastKey: null,
        lastKeyTime: 0,
        endTime: 0
    }
};
let lastDashTime = {
    snake1: 0,
    snake2: 0
};
let lastImmunityDashTime = {
    snake1: 0,
    snake2: 0
};
// 商店项目定义
const storeItems = [
    {
        id: 'shield',
        name: '能量护盾',
        description: '获得10点护盾值，优先抵挡伤害',
        price: 400,
        icon: '🛡️',
        color: '#00BCD4',
        type: 'shield',
        maxLevel: 1  // 只能购买一次
    },
    {
        id: 'random_balls',
        name: '随机魔法球礼包',
        description: '获得3个随机魔法球 (攻击/血球/无敌/反转/炸弹)',
        price: 400,
        icon: '🎁',
        color: '#9C27B0',
        type: 'consumable'
    },
    {
        id: 'speed_upgrade',
        name: '速度属性升级',
        description: '永久增加移动速度15% (最多叠加2次)',
        price: 500,
        icon: '⚡',
        color: '#FFD700',
        type: 'upgrade',
        maxLevel: 2
    },
    {
        id: 'tough_upgrade',
        name: '坚硬属性升级',
        description: '永久增加生命值上限2点 (最多叠加2次)',
        price: 500,
        icon: '🛡️',
        color: '#C0C0C0',
        type: 'upgrade',
        maxLevel: 2
    },
    {
        id: 'magic_upgrade',
        name: '魔法属性升级',
        description: '永久延长特殊效果时间20% (最多叠加2次)',
        price: 500,
        icon: '✨',
        color: '#2196F3',
        type: 'upgrade',
        maxLevel: 2
    }
];

// 玩家升级状态
let playerUpgrades = {
    snake1: {
        speed: 0,
        tough: 0,
        magic: 0
    },
    snake2: {
        speed: 0,
        tough: 0,
        magic: 0
    }
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
        // 在游戏变量中添加
        let homes = {
            player1: {
                x: 20,
                y: 20,
                width: 100,
                height: 80,
                health: 20,
                maxHealth: 20,
                destroyed: false,
                lastHealTime: 0,
                lastDamageTime: 0
            },
            player2: {
                x: 0, // 将在初始化时计算
                y: 0, // 将在初始化时计算
                width: 100,
                height: 80,
                health: 20,
                maxHealth: 20,
                destroyed: false,
                lastHealTime: 0,
                lastDamageTime: 0
            }
        };
 const dashCooldown = {
    snake1: 0,
    snake2: 0
};       
        // 修改initGame函数，在生成火山后初始化基地

        // 初始化基地的位置
function initHomes() {
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    
    // 增大基地的尺寸
    const homeWidth = 250;
    const homeHeight = 200;
    
    // 玩家1的基地在左上角
    homes.player1 = {
        x: 20,
        y: 110, // 避开计分板
        width: homeWidth,
        height: homeHeight,
        health: 50,
        maxHealth: 50,
        destroyed: false,
        lastHealTime: 0,
        lastDamageTime: 0
    };
    
    // 玩家2的基地在右下角
    homes.player2 = {
        x: boardWidth - homeWidth - 20,
        y: boardHeight - homeHeight - 80, // 避开底部UI
        width: homeWidth,
        height: homeHeight,
        health: 50,
        maxHealth: 50,
        destroyed: false,
        lastHealTime: 0,
        lastDamageTime: 0
    };
}
function resetDeathCauses() {
    deathCause = {
        snake1: null,
        snake2: null
    };
}     
// 统一的伤害处理函数
// 在applyDamage函数中添加坚硬蛇子弹免疫
// 修改applyDamage函数，添加护盾处理
function applyDamage(snakeId, damage, source = 'unknown', details = {}) {
    if (!gameStarted || health[snakeId] <= 0) return false;
    
    const otherSnakeId = snakeId === 'snake1' ? 'snake2' : 'snake1';
    const snakeName = snakeId === 'snake1' ? '玩家1' : '玩家2';
    const head = snakes[snakeId][0];
    
    // === 第一步：记录原始伤害（无论是否被抵挡）===
    // 初始化伤害类型统计（如果不存在）
    if (!gameStats[snakeId].originalDamageReceived) {
        gameStats[snakeId].originalDamageReceived = {};
    }
    if (!gameStats[snakeId].originalDamageReceived[source]) {
        gameStats[snakeId].originalDamageReceived[source] = 0;
    }
    gameStats[snakeId].originalDamageReceived[source] += damage;
    
    // === 第二步：检查是否有护盾 ===
    if (shields[snakeId].active && shields[snakeId].health > 0) {
        // 护盾优先抵挡伤害
        const shield = shields[snakeId];
        const damageToShield = Math.min(damage, shield.health);
        const damageToHealth = damage - damageToShield;
        
        // 减少护盾值
        shield.health -= damageToShield;
        
        // 记录护盾伤害统计
        if (!gameStats[snakeId].shieldDamageAbsorbed) {
            gameStats[snakeId].shieldDamageAbsorbed = 0;
        }
        gameStats[snakeId].shieldDamageAbsorbed += damageToShield;
        
        // 显示护盾抵挡提示
        showNotice(`护盾抵挡${damageToShield}点伤害`, '#00BCD4', head.x, head.y);
        createParticles(head.x + 10, head.y + 10, damageToShield * 2, '#00BCD4');
        
        // 更新护盾显示
        updateShieldDisplay(snakeId);
        
        // 添加护盾被攻击的视觉反馈
        const shieldIndicator = document.getElementById(`shield-indicator-${snakeId === 'snake1' ? '1' : '2'}`);
        if (shieldIndicator) {
            shieldIndicator.classList.add('shield-hit');
            setTimeout(() => {
                shieldIndicator.classList.remove('shield-hit');
            }, 300);
        }
        
        // 如果护盾被打破
        if (shield.health <= 0) {
            shield.active = false;
            shield.health = 0;
            showNotice('护盾被打破!', '#FF5722', head.x, head.y);
            createParticles(head.x + 10, head.y + 10, 20, '#FF5722');
            
            // 更新护盾显示
            updateShieldDisplay(snakeId);
            
            // 记录护盾被打破
            if (!gameStats[snakeId].shieldBreaks) {
                gameStats[snakeId].shieldBreaks = 0;
            }
            gameStats[snakeId].shieldBreaks++;
        }
        
        // 记录护盾抵挡统计
        if (!gameStats[snakeId].shieldBlocks) {
            gameStats[snakeId].shieldBlocks = 0;
        }
        gameStats[snakeId].shieldBlocks++;
        
        // 如果有剩余伤害，继续处理
        if (damageToHealth > 0) {
            // 递归调用处理剩余伤害
            return applyDamage(snakeId, damageToHealth, source, {
                ...details,
                shieldBroken: true,
                originalDamage: damage,
                shieldAbsorbed: damageToShield
            });
        }
        
        console.log(`${snakeName}的护盾抵挡了${damageToShield}点${source}伤害`);
        return true;
    }
    
    // === 第三步：检查免疫效果 ===
    const isImmune = (snakeId === 'snake1' && immunity.snake1) || 
                     (snakeId === 'snake2' && immunity.snake2);
    
    if (isImmune) {
        // 记录免疫统计
        if (!gameStats[snakeId].immuneDamagePrevented) {
            gameStats[snakeId].immuneDamagePrevented = {};
        }
        if (!gameStats[snakeId].immuneDamagePrevented[source]) {
            gameStats[snakeId].immuneDamagePrevented[source] = 0;
        }
        gameStats[snakeId].immuneDamagePrevented[source] += damage;
        
        if (!gameStats[snakeId].immuneBlocks) {
            gameStats[snakeId].immuneBlocks = 0;
        }
        gameStats[snakeId].immuneBlocks++;
        
        // 显示免疫提示
        showNotice('免疫伤害!', '#FFFF00', head.x, head.y);
        createParticles(head.x + 10, head.y + 10, 15, '#FFFF00');
        
        console.log(`${snakeName}免疫了${damage}点${source}伤害`);
        return false;
    }
    
    // === 第四步：检查坚硬蛇特性 ===
    let finalDamage = damage;
    const isToughSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'tough' : snakeTypes.snake2 === 'tough';
    let isToughImmune = false;
    let isToughReduced = false;
    
// 完整修复后的坚硬蛇伤害处理逻辑
if (isToughSnake) {
    // 检查是否是子弹类伤害
    const isBulletType = source === 'bullet' || source === 'base';
    
    if (isBulletType) {
        // 对子弹类伤害有50%概率免疫
        if (Math.random() < 0.5) {
            const bulletTypeName = source === 'bullet' ? '子弹' : '基地子弹';
            
            // 记录免疫统计
            if (!gameStats[snakeId].toughImmuneDamagePrevented) {
                gameStats[snakeId].toughImmuneDamagePrevented = {};
            }
            if (!gameStats[snakeId].toughImmuneDamagePrevented[source]) {
                gameStats[snakeId].toughImmuneDamagePrevented[source] = 0;
            }
            gameStats[snakeId].toughImmuneDamagePrevented[source] += damage;
            
            if (!gameStats[snakeId].toughImmuneBlocks) {
                gameStats[snakeId].toughImmuneBlocks = 0;
            }
            gameStats[snakeId].toughImmuneBlocks++;
            
            showNotice(`坚硬免疫${bulletTypeName}!`, '#C0C0C0', head.x, head.y);
            createParticles(head.x + 10, head.y + 10, 15, '#C0C0C0');
            return false;
        }
    } else {
        // 对非子弹类伤害减半
        const originalDamage = damage;
        finalDamage = Math.ceil(damage / 2);
        
        // 记录减伤统计
        if (!gameStats[snakeId].toughReducedDamage) {
            gameStats[snakeId].toughReducedDamage = {};
        }
        if (!gameStats[snakeId].toughReducedDamage[source]) {
            gameStats[snakeId].toughReducedDamage[source] = 0;
        }
        gameStats[snakeId].toughReducedDamage[source] += (originalDamage - finalDamage);
        
        if (finalDamage < damage) {
            showNotice(`坚硬减伤! (-${finalDamage}HP)`, '#C0C0C0', head.x, head.y);
        }
    }
}
    // === 第五步：应用实际伤害 ===
    health[snakeId] = Math.max(0, health[snakeId] - finalDamage);
    
    // 更新血条显示
    updateHealthBars();
    
    // 显示伤害提示
    let damageMessage = `-${finalDamage}HP`;
    if (source !== 'unknown') {
        const sourceNames = {
            'wall': '撞墙',
            'snakeCollision': '蛇相撞',
            'bullet': '子弹',
            'base': '基地防御',
            'lava': '岩浆',
            'home': '敌方基地',
            'bomb': '炸弹'
        };
        damageMessage += ` (${sourceNames[source] || source})`;
    }
    
    // 添加备注信息
    const notes = [];
    if (details.shieldBroken) notes.push('破盾后');
    if (isToughReduced) notes.push('坚硬减伤');
    if (notes.length > 0) {
        damageMessage += ` (${notes.join('+')})`;
    }
    
    showNotice(damageMessage, '#FF0000', head.x, head.y);
    
    // 创建伤害特效
    createParticles(head.x + 10, head.y + 10, finalDamage * 3, '#FF0000');
    
    // === 第六步：记录实际承受伤害统计 ===
    if (!gameStats[snakeId].damageReceived[source]) {
        gameStats[snakeId].damageReceived[source] = 0;
    }
    gameStats[snakeId].damageReceived[source] += finalDamage;
    gameStats[snakeId].totalDamageReceived += finalDamage;
    
    // 记录输出伤害统计（如果有攻击者）
// 在applyDamage函数中找到输出伤害统计部分，确保存在
// === 记录输出伤害统计（如果有攻击者）===
if (details.attacker) {
    const attackerSnakeId = details.attacker === 'snake1' ? 'snake1' : 'snake2';
    
    // 记录攻击者的原始伤害输出
    if (!gameStats[attackerSnakeId].originalDamageDealt) {
        gameStats[attackerSnakeId].originalDamageDealt = {};
    }
    if (!gameStats[attackerSnakeId].originalDamageDealt[source]) {
        gameStats[attackerSnakeId].originalDamageDealt[source] = 0;
    }
    gameStats[attackerSnakeId].originalDamageDealt[source] += damage;
    
    // 记录攻击者的实际伤害输出
    if (!gameStats[attackerSnakeId].damageDealt) {
        gameStats[attackerSnakeId].damageDealt = {};
    }
    if (!gameStats[attackerSnakeId].damageDealt[source]) {
        gameStats[attackerSnakeId].damageDealt[source] = 0;
    }
    gameStats[attackerSnakeId].damageDealt[source] += finalDamage;
    gameStats[attackerSnakeId].totalDamageDealt += finalDamage;
    gameStats[attackerSnakeId].totalOriginalDamageDealt += damage;
}
    // === 第七步：检查死亡 ===
    if (health[snakeId] <= 0) {
        // 设置死亡原因
        const causeNames = {
            'wall': '撞墙而死',
            'snakeCollision': '蛇相撞而死',
            'bullet': '被子弹击中',
            'base': '被基地防御系统击杀',
            'lava': '被岩浆烧死',
            'home': '在对方基地中致死',
            'bomb': '被炸弹炸死'
        };
        
        deathCause[snakeId] = causeNames[source] || '未知原因死亡';
        
        // 添加备注信息
        const deathNotes = [];
        if (details.shieldBroken) deathNotes.push('护盾被破后');
        if (isToughSnake && isToughReduced) deathNotes.push('坚硬蛇减伤后');
        if (deathNotes.length > 0) {
            deathCause[snakeId] += ` (${deathNotes.join('+')})`;
        }
        
        console.log(`${snakeName}死亡，原因: ${deathCause[snakeId]}`);
        gameOver();
        return true;
    }

    return true;
}
// 统一的治疗函数
function applyHealing(snakeId, amount, source = 'unknown') {
    if (!gameStarted || health[snakeId] <= 0) return false;
    
    // 计算最大生命值（考虑坚硬蛇和升级）
    let maxHealth = 10;
    const isToughSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'tough' : snakeTypes.snake2 === 'tough';
    
    if (isToughSnake) {
        maxHealth = 15;
        // 添加升级效果
        const toughUpgradeLevel = playerUpgrades[snakeId]?.tough || 0;
        maxHealth += toughUpgradeLevel * 2;
    }
    
    const oldHealth = health[snakeId];
    health[snakeId] = Math.min(maxHealth, health[snakeId] + amount);
    const actualHeal = health[snakeId] - oldHealth;
    
    if (actualHeal > 0) {
        // 更新血条
        updateHealthBars();
        
        // 显示治疗提示
        const head = snakes[snakeId][0];
        showNotice(`+${actualHeal}HP`, '#4CAF50', head.x, head.y);
        
        // 创建治疗特效
        createParticles(head.x + 10, head.y + 10, actualHeal * 3, '#4CAF50');
        
        console.log(`${snakeId === 'snake1' ? '玩家1' : '玩家2'}恢复了${actualHeal}点血量`);
        return true;
    }
    
    return false;
}
// 添加护盾显示更新函数
function updateShieldDisplay(snakeId) {
    const shield = shields[snakeId];
    const shieldElementId = snakeId === 'snake1' ? 'shield-indicator-1' : 'shield-indicator-2';
    let shieldElement = document.getElementById(shieldElementId);
    
    // 如果元素不存在，创建它
    if (!shieldElement) {
        const scoreBoard = snakeId === 'snake1' ? 
            document.querySelector('.player-score.player-1') : 
            document.querySelector('.player-score.player-2');
        
        if (scoreBoard) {
            shieldElement = document.createElement('div');
            shieldElement.id = shieldElementId;
            shieldElement.className = 'shield-indicator';
            shieldElement.style.marginTop = '5px';
            shieldElement.style.padding = '3px 8px';
            shieldElement.style.borderRadius = '10px';
            shieldElement.style.fontSize = '12px';
            shieldElement.style.display = 'flex';
            shieldElement.style.alignItems = 'center';
            shieldElement.style.gap = '5px';
            
            scoreBoard.appendChild(shieldElement);
        }
    }
    
    if (shieldElement) {
        if (shield.active && shield.health > 0) {
            shieldElement.style.display = 'flex';
            shieldElement.style.background = 'linear-gradient(45deg, rgba(0, 188, 212, 0.3), rgba(0, 150, 136, 0.3))';
            shieldElement.style.border = '1px solid rgba(0, 188, 212, 0.5)';
            shieldElement.style.color = '#00BCD4';
            shieldElement.innerHTML = `
                <i class="fas fa-shield-alt"></i>
                <span>护盾: ${shield.health}/${shield.maxHealth}</span>
            `;
            
            // 添加护盾动画效果
            shieldElement.style.animation = 'shieldPulse 2s infinite';
        } else {
            shieldElement.style.display = 'none';
        }
    }
}

// 添加护盾动画CSS
const shieldStyle = document.createElement('style');
shieldStyle.textContent = `
    @keyframes shieldPulse {
        0%, 100% { 
            box-shadow: 0 0 5px rgba(0, 188, 212, 0.5);
        }
        50% { 
            box-shadow: 0 0 15px rgba(0, 188, 212, 0.8);
        }
    }
    
    .shield-indicator {
        transition: all 0.3s ease;
    }
    
    /* 护盾被攻击时的效果 */
    .shield-hit {
        animation: shieldHit 0.3s ease;
    }
    
    @keyframes shieldHit {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); box-shadow: 0 0 20px #00BCD4; }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(shieldStyle);
// 创建护盾环绕特效
function createShieldEffect(snakeId) {
    // 移除旧的护盾特效
    const oldEffects = document.querySelectorAll(`.shield-effect-${snakeId}`);
    oldEffects.forEach(effect => effect.remove());
    
    // 创建新的护盾特效
    const shieldEffect = document.createElement('div');
    shieldEffect.className = `shield-effect shield-effect-${snakeId}`;
    shieldEffect.style.position = 'absolute';
    shieldEffect.style.width = '40px';
    shieldEffect.style.height = '40px';
    shieldEffect.style.borderRadius = '50%';
    shieldEffect.style.border = '2px solid rgba(0, 188, 212, 0.7)';
    shieldEffect.style.boxShadow = '0 0 20px rgba(0, 188, 212, 0.5)';
    shieldEffect.style.animation = 'shieldRotate 3s linear infinite';
    shieldEffect.style.zIndex = '2';
    shieldEffect.style.pointerEvents = 'none';
    
    // 添加到游戏板
    gameBoard.appendChild(shieldEffect);
    
    // 更新护盾位置
    function updateShieldPosition() {
        if (shields[snakeId].active && shields[snakeId].health > 0) {
            const head = snakes[snakeId][0];
            shieldEffect.style.left = `${head.x}px`;
            shieldEffect.style.top = `${head.y}px`;
            requestAnimationFrame(updateShieldPosition);
        } else {
            shieldEffect.remove();
        }
    }
    
    updateShieldPosition();
}

// 添加护盾旋转动画CSS
const shieldRotateStyle = document.createElement('style');
shieldRotateStyle.textContent = `
    @keyframes shieldRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(shieldRotateStyle);
function drawHomes() {
    // 移除现有的基地元素
    document.querySelectorAll('.home-base').forEach(el => el.remove());
    
    // 绘制玩家1的基地（左上角）
    if (!homes.player1.destroyed) {
        const home1 = document.createElement('div');
        home1.className = `home-base player1 ${homes.player1.health < homes.player1.maxHealth * 0.3 ? 'home-under-attack' : ''}`;
        
        // 如果基地防御激活，添加激活样式
        if (baseDefense.player1.active && baseDefense.player1.targetSnake) {
            home1.classList.add('defense-active');
            
            const targetHead = snakes[baseDefense.player1.targetSnake][0];
            const isInside = isPointInRect(targetHead, homes.player1);
            const firingPoints = calculateFiringPoints(homes.player1, targetHead, isInside);
            
            // 计算哪些边在攻击
            const activeSides = {};
            firingPoints.forEach(point => {
                if (point.side) {
                    activeSides[point.side] = true;
                }
            });
            
            // 为每个攻击边添加高亮边框
            Object.keys(activeSides).forEach(side => {
                const sideHighlighter = document.createElement('div');
                sideHighlighter.className = 'active-side-highlight';
                sideHighlighter.style.position = 'absolute';
                sideHighlighter.style.background = 'linear-gradient(90deg, transparent, rgba(255, 87, 34, 0.7), transparent)';
                sideHighlighter.style.animation = 'sidePulse 1s infinite alternate';
                sideHighlighter.style.zIndex = '1';
                
                switch(side) {
                    case 'top':
                        sideHighlighter.style.top = '-5px';
                        sideHighlighter.style.left = '0';
                        sideHighlighter.style.width = '100%';
                        sideHighlighter.style.height = '10px';
                        break;
                    case 'bottom':
                        sideHighlighter.style.bottom = '-5px';
                        sideHighlighter.style.left = '0';
                        sideHighlighter.style.width = '100%';
                        sideHighlighter.style.height = '10px';
                        break;
                    case 'left':
                        sideHighlighter.style.left = '-5px';
                        sideHighlighter.style.top = '0';
                        sideHighlighter.style.width = '10px';
                        sideHighlighter.style.height = '100%';
                        break;
                    case 'right':
                        sideHighlighter.style.right = '-5px';
                        sideHighlighter.style.top = '0';
                        sideHighlighter.style.width = '10px';
                        sideHighlighter.style.height = '100%';
                        break;
                }
                
                home1.appendChild(sideHighlighter);
            });
            
            // 为每个发射点添加指示器
            firingPoints.forEach(point => {
                const turretIndicator = document.createElement('div');
                turretIndicator.className = 'base-turret-indicator';
                turretIndicator.style.position = 'absolute';
                turretIndicator.style.left = `${point.x - homes.player1.x}px`;
                turretIndicator.style.top = `${point.y - homes.player1.y}px`;
                turretIndicator.style.transform = 'translate(-50%, -50%)';
                
                turretIndicator.style.width = '8px';
                turretIndicator.style.height = '8px';
                turretIndicator.style.background = 'radial-gradient(circle, #FF5722, #FF0000)';
                turretIndicator.style.borderRadius = '50%';
                turretIndicator.style.boxShadow = '0 0 8px #FF0000';
                turretIndicator.style.animation = 'turretPulse 1s infinite alternate';
                turretIndicator.style.zIndex = '3';
                
                home1.appendChild(turretIndicator);
            });
            
            // 添加防御激活文字提示
            const defenseText = document.createElement('div');
            defenseText.style.position = 'absolute';
            defenseText.style.top = '5px';
            defenseText.style.left = '0';
            defenseText.style.width = '100%';
            defenseText.style.textAlign = 'center';
            defenseText.style.fontSize = '12px';
            defenseText.style.color = '#FFFF00';
            defenseText.style.fontWeight = 'bold';
            defenseText.textContent = '防御激活';
            defenseText.style.textShadow = '0 0 5px #000';
            defenseText.style.zIndex = '2';
            home1.appendChild(defenseText);
        }
        
        home1.style.left = `${homes.player1.x}px`;
        home1.style.top = `${homes.player1.y}px`;
        home1.style.width = `${homes.player1.width}px`;
        home1.style.height = `${homes.player1.height}px`;
        home1.style.zIndex = '2';
        
        // 添加基地的图标和名称
        const name1 = document.createElement('div');
        name1.innerHTML = `<i class="fas fa-home"></i> ${localStorage.getItem('username') || '玩家1'}的基地`;
        name1.style.textAlign = 'center';
        name1.style.marginTop = '25px';
        name1.style.fontSize = '16px';
        name1.style.fontWeight = 'bold';
        name1.style.zIndex = '2';
        home1.appendChild(name1);
        
        // 添加血条
        const healthBar1 = document.createElement('div');
        healthBar1.className = 'home-health-bar';
        healthBar1.style.bottom = '-22px';
        healthBar1.style.zIndex = '2';
        
        const healthFill1 = document.createElement('div');
        healthFill1.className = 'home-health-fill home1-health-fill';
        healthFill1.style.width = `${(homes.player1.health / homes.player1.maxHealth) * 100}%`;
        
        const healthText1 = document.createElement('div');
        healthText1.className = 'home-health-text';
        healthText1.textContent = `HP: ${homes.player1.health}/${homes.player1.maxHealth}`;
        healthText1.style.fontSize = '12px';
        healthText1.style.zIndex = '2';
        
        healthBar1.appendChild(healthFill1);
        home1.appendChild(healthText1);
        home1.appendChild(healthBar1);
        
        gameBoard.appendChild(home1);
    }
    
    // 绘制玩家2的基地（右下角）
    if (!homes.player2.destroyed) {
        const home2 = document.createElement('div');
        home2.className = `home-base player2 ${homes.player2.health < homes.player2.maxHealth * 0.3 ? 'home-under-attack' : ''}`;
        
        // 如果基地防御激活，添加激活样式
        if (baseDefense.player2.active && baseDefense.player2.targetSnake) {
            home2.classList.add('defense-active');
            
            const targetHead = snakes[baseDefense.player2.targetSnake][0];
            const isInside = isPointInRect(targetHead, homes.player2);
            const firingPoints = calculateFiringPoints(homes.player2, targetHead, isInside);
            
            // 计算哪些边在攻击
            const activeSides = {};
            firingPoints.forEach(point => {
                if (point.side) {
                    activeSides[point.side] = true;
                }
            });
            
            // 为每个攻击边添加高亮边框
            Object.keys(activeSides).forEach(side => {
                const sideHighlighter = document.createElement('div');
                sideHighlighter.className = 'active-side-highlight';
                sideHighlighter.style.position = 'absolute';
                sideHighlighter.style.background = 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.7), transparent)';
                sideHighlighter.style.animation = 'sidePulse 1s infinite alternate';
                sideHighlighter.style.zIndex = '1';
                sideHighlighter.style.boxShadow = '0 0 10px rgba(33, 150, 243, 0.5)';
                
                switch(side) {
                    case 'top':
                        sideHighlighter.style.top = '-5px';
                        sideHighlighter.style.left = '0';
                        sideHighlighter.style.width = '100%';
                        sideHighlighter.style.height = '10px';
                        break;
                    case 'bottom':
                        sideHighlighter.style.bottom = '-5px';
                        sideHighlighter.style.left = '0';
                        sideHighlighter.style.width = '100%';
                        sideHighlighter.style.height = '10px';
                        break;
                    case 'left':
                        sideHighlighter.style.left = '-5px';
                        sideHighlighter.style.top = '0';
                        sideHighlighter.style.width = '10px';
                        sideHighlighter.style.height = '100%';
                        break;
                    case 'right':
                        sideHighlighter.style.right = '-5px';
                        sideHighlighter.style.top = '0';
                        sideHighlighter.style.width = '10px';
                        sideHighlighter.style.height = '100%';
                        break;
                }
                
                home2.appendChild(sideHighlighter);
            });
            
            // 为每个发射点添加指示器
            firingPoints.forEach(point => {
                const turretIndicator = document.createElement('div');
                turretIndicator.className = 'base-turret-indicator';
                turretIndicator.style.position = 'absolute';
                turretIndicator.style.left = `${point.x - homes.player2.x}px`;
                turretIndicator.style.top = `${point.y - homes.player2.y}px`;
                turretIndicator.style.transform = 'translate(-50%, -50%)';
                
                turretIndicator.style.width = '8px';
                turretIndicator.style.height = '8px';
                turretIndicator.style.background = 'radial-gradient(circle, #2196F3, #0000FF)';
                turretIndicator.style.borderRadius = '50%';
                turretIndicator.style.boxShadow = '0 0 8px #0000FF';
                turretIndicator.style.animation = 'turretPulse 1s infinite alternate';
                turretIndicator.style.zIndex = '3';
                
                home2.appendChild(turretIndicator);
            });
            
            // 添加防御激活文字提示
            const defenseText = document.createElement('div');
            defenseText.style.position = 'absolute';
            defenseText.style.top = '5px';
            defenseText.style.left = '0';
            defenseText.style.width = '100%';
            defenseText.style.textAlign = 'center';
            defenseText.style.fontSize = '12px';
            defenseText.style.color = '#FFFF00';
            defenseText.style.fontWeight = 'bold';
            defenseText.textContent = '防御激活';
            defenseText.style.textShadow = '0 0 5px #000';
            defenseText.style.zIndex = '2';
            home2.appendChild(defenseText);
        }
        
        home2.style.left = `${homes.player2.x}px`;
        home2.style.top = `${homes.player2.y}px`;
        home2.style.width = `${homes.player2.width}px`;
        home2.style.height = `${homes.player2.height}px`;
        home2.style.zIndex = '2';
        
        // 添加基地的图标和名称
        const name2 = document.createElement('div');
        name2.innerHTML = `<i class="fas fa-home"></i> ${localStorage.getItem('player2_username') || '玩家2'}的基地`;
        name2.style.textAlign = 'center';
        name2.style.marginTop = '25px';
        name2.style.fontSize = '16px';
        name2.style.fontWeight = 'bold';
        name2.style.zIndex = '2';
        home2.appendChild(name2);
        
        // 添加血条
        const healthBar2 = document.createElement('div');
        healthBar2.className = 'home-health-bar';
        healthBar2.style.bottom = '-22px';
        healthBar2.style.zIndex = '2';
        
        const healthFill2 = document.createElement('div');
        healthFill2.className = 'home-health-fill home2-health-fill';
        healthFill2.style.width = `${(homes.player2.health / homes.player2.maxHealth) * 100}%`;
        
        const healthText2 = document.createElement('div');
        healthText2.className = 'home-health-text';
        healthText2.textContent = `HP: ${homes.player2.health}/${homes.player2.maxHealth}`;
        healthText2.style.fontSize = '12px';
        healthText2.style.zIndex = '2';
        
        healthBar2.appendChild(healthFill2);
        home2.appendChild(healthText2);
        home2.appendChild(healthBar2);
        
        gameBoard.appendChild(home2);
    }
}
const baseDefenseStyle = document.createElement('style');
baseDefenseStyle.textContent = `
    /* 基地防御特效 - 更新 */
    .base-turret-indicator {
        position: absolute;
        animation: turretPulse 1s infinite alternate;
    }
    
    @keyframes turretPulse {
        from {
            transform: scale(1);
            box-shadow: 0 0 10px;
            opacity: 0.7;
        }
        to {
            transform: scale(1.3);
            box-shadow: 0 0 20px;
            opacity: 1;
        }
    }
    
    /* 防御激活时的基地边框效果 */
    .home-base.defense-active {
        box-shadow: 0 0 40px;
    }
    
    .home-base.defense-active.player1 {
        box-shadow: 0 0 40px rgba(255, 87, 34, 0.8);
    }
    
    .home-base.defense-active.player2 {
        box-shadow: 0 0 40px rgba(33, 150, 243, 0.8);
    }
`;
document.head.appendChild(baseDefenseStyle);
// 添加新的CSS样式
const activeSideStyle = document.createElement('style');
activeSideStyle.textContent = `
    /* 激活边的闪烁效果 */
    .active-side-highlight {
        z-index: 1;
    }
    
    @keyframes sidePulse {
        from {
            opacity: 0.3;
            box-shadow: 0 0 10px rgba(255, 87, 34, 0.5);
        }
        to {
            opacity: 0.7;
            box-shadow: 0 0 20px rgba(255, 87, 34, 0.8);
        }
    }
    
    /* 玩家2的颜色 */
    .home-base.player2 .active-side-highlight {
        background: linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.7), transparent) !important;
        box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
    }
`;
document.head.appendChild(activeSideStyle);
// 初始化游戏
function initGame() {
    document.getElementById("back").style.display ="none"
    viewRecords.style.display = 'none';
    const player1Name = localStorage.getItem('username') || '玩家1';
    document.getElementById('player1-name').textContent = player1Name + ': ';
    resetDeathCauses();        
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
document.querySelectorAll('.bullet').forEach(bullet => bullet.remove());
let dashCooldown = {
    snake1: 0,
    snake2: 0
};
// 修改游戏统计数据初始化
gameStats = {
    startTime: 0,
    snake1: {
        damageReceived: {
            wall: 0,
            snakeCollision: 0,
            bullet: 0,
            base: 0,
            lava: 0,
            home: 0,
            bomb: 0
        },
        originalDamageReceived: {
            wall: 0,
            snakeCollision: 0,
            bullet: 0,
            base: 0,
            lava: 0,
            home: 0,
            bomb: 0
        },
        damageDealt: {
            snakeCollision: 0,
            bullet: 0,
            bomb: 0
        },
        originalDamageDealt: {
            snakeCollision: 0,
            bullet: 0,
            bomb: 0
        },
        // 防御统计
        shieldDamageAbsorbed: 0,
        shieldBlocks: 0,
        shieldBreaks: 0,
        immuneDamagePrevented: {},
        immuneBlocks: 0,
        toughImmuneDamagePrevented: {},
        toughImmuneBlocks: 0,
        toughReducedDamage: {},
        
        distanceTraveled: 0,
        totalDamageReceived: 0,
        totalOriginalDamageReceived: 0,
        totalDamageDealt: 0,
        totalOriginalDamageDealt: 0
    },
    snake2: {
        damageReceived: {
            wall: 0,
            snakeCollision: 0,
            bullet: 0,
            base: 0,
            lava: 0,
            home: 0,
            bomb: 0
        },
        originalDamageReceived: {
            wall: 0,
            snakeCollision: 0,
            bullet: 0,
            base: 0,
            lava: 0,
            home: 0,
            bomb: 0
        },
        damageDealt: {
            snakeCollision: 0,
            bullet: 0,
            bomb: 0
        },
        originalDamageDealt: {
            snakeCollision: 0,
            bullet: 0,
            bomb: 0
        },
        // 防御统计
        shieldDamageAbsorbed: 0,
        shieldBlocks: 0,
        shieldBreaks: 0,
        immuneDamagePrevented: {},
        immuneBlocks: 0,
        toughImmuneDamagePrevented: {},
        toughImmuneBlocks: 0,
        toughReducedDamage: {},
        
        distanceTraveled: 0,
        totalDamageReceived: 0,
        totalOriginalDamageReceived: 0,
        totalDamageDealt: 0,
        totalOriginalDamageDealt: 0
    }
};
     dashState = {
        snake1: {
            active: false,
            lastKey: null,
            lastKeyTime: 0,
            endTime: 0
        },
        snake2: {
            active: false,
            lastKey: null,
            lastKeyTime: 0,
            endTime: 0
        }
    };   
    // 移除护盾显示
    document.querySelectorAll('.shield-indicator, .shield-effect').forEach(el => el.remove());
    storeOpen = {
        snake1: false,
        snake2: false
    };
    storeSelectedItem = {
        snake1: 0,
        snake2: 0
    };
    
    // 关闭商店界面
    document.getElementById('store-player1').style.display = 'none';
    document.getElementById('store-player2').style.display = 'none';
    
    // 移除暂停效果
    document.querySelector('.game-container').classList.remove('game-paused');
    
// 2. 完全重置攻击模式状态
if (attackMode.intervalId1) {
    clearInterval(attackMode.intervalId1);
    attackMode.intervalId1 = null;
}
if (attackMode.intervalId2) {
    clearInterval(attackMode.intervalId2);
    attackMode.intervalId2 = null;
}
        // 重置速度加成
    speedBoosts = {
        snake1: 0,
        snake2: 0
    };
// 3. 重置攻击模式的所有状态
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
// 4. 重置子弹发射的计时器
lastMoveTime = {
    snake1: 0,
    snake2: 0
};

    // 重置特殊物品
    specialItems = [];
    lastSpecialItemSpawn = 0;
    
    // 重置状态效果
    immunity = { snake1: false, snake2: false, timer1: 0, timer2: 0 };
    reversedControls = { snake1: false, snake2: false, timer1: 0, timer2: 0 };
    
    // 重置墙碰撞计时
    lastWallHitTime = {
        snake1: 0,
        snake2: 0
    };
    
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
    
    // 初始化基地
    initHomes();
    
    // 初始化蛇
    snakes.snake1 = [
        { x: homes.player1.x + 75, y: homes.player1.y + 50 },
        { x: homes.player1.x + 55, y: homes.player1.y + 50 },
        { x: homes.player1.x + 35, y: homes.player1.y + 50 }
    ];
    
    snakes.snake2 = [
        { x: homes.player2.x + 75, y: homes.player2.y + 50 },
        { x: homes.player2.x + 55, y: homes.player2.y + 50 },
        { x: homes.player2.x + 35, y: homes.player2.y + 50 }
    ];
    
    // 重置方向和血量
    directions = {
        snake1: 'right',
        snake2: 'left'
    };
    nextDirections = {
        snake1: 'right',
        snake2: 'left'
    };
    health = {
        snake1: 10,
        snake2: 10
    };
    
    // 游戏开始时给蛇3秒免疫时间
    const currentTime = performance.now();
    immunity.snake1 = true;
    immunity.timer1 = currentTime + 3000; // 3秒免疫
    
    immunity.snake2 = true;
    immunity.timer2 = currentTime + 3000; // 3秒免疫
    
    // 显示免疫提示
    showNotice('游戏开始! 3秒无敌时间', '#FFFF00', 
              homes.player1.x + homes.player1.width/2, 
              homes.player1.y - 20);
    showNotice('游戏开始! 3秒无敌时间', '#FFFF00', 
              homes.player2.x + homes.player2.width/2, 
              homes.player2.y - 20);
    
    // 重置分数
    scores = {
        snake1: 0,
        snake2: 0
    };
    if (snakeTypes.snake1 === 'tough') {
        health.snake1 = 15;
    }
    if (snakeTypes.snake2 === 'tough') {
        health.snake2 = 15;
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
let baseDefense = {
    player1: {
        lastShotTime: 0,
        bulletSpeed: 1, // 稍微降低速度
        attackRange: 15, // 20格 = 400像素
        active: false,
        targetSnake: null,
        damage: 0.5,
        shootInterval: 1000 // 2秒间隔
    },
    player2: {
        lastShotTime: 0,
        bulletSpeed: 1,
        attackRange: 15,
        active: false,
        targetSnake: null,
        damage: 0.5,
        shootInterval: 1000
    }
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
function getSnakeSpeed(snakeId) {
    const isSpeedSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'speed' : snakeTypes.snake2 === 'speed';
    const isToughSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'tough' : snakeTypes.snake2 === 'tough';
    const isMagicSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'magic' : snakeTypes.snake2 === 'magic';
    
    let baseSpeed = gameSpeed;
    
    // 基础速度调整
    if (isSpeedSnake) {
        baseSpeed *= 0.7; // 稍微降低基础速度（原来是0.55，现在是0.7）
    } else if (isMagicSnake) {
        baseSpeed *= 0.85;
    } else if (isToughSnake) {
        // 坚硬蛇保持原速
        baseSpeed *= 1.0;
    }
    
    // 速度加成
    const speedBoost = speedBoosts[snakeId] || 0;
    baseSpeed /= (1 + speedBoost);
    
    // 暴风雪减速
    if (currentMap === 'snow' && blizzardActive && !immunity[snakeId]) {
        baseSpeed /= snakeSpeedModifiers[snakeId];
    }
    
    // 俯冲加速（速度蛇专属）
    if (isSpeedSnake && dashState[snakeId].active) {
        // 俯冲时速度极快（原速度的3倍）
        baseSpeed *= 0.2; // 移动间隔减少到20%
    }
    
    return baseSpeed;
}
const dashStyle = document.createElement('style');
dashStyle.textContent = `
    /* 俯冲动画 */
    @keyframes dashPulse {
        from {
            box-shadow: 0 0 10px #FFD700;
            transform: scale(1);
        }
        to {
            box-shadow: 0 0 30px #FFD700;
            transform: scale(1.05);
        }
    }
    
    .snake-segment.dashing {
        z-index: 4 !important;
    }
    
    .snake-segment.dashing.snake-head {
        z-index: 5 !important;
    }
    
    /* 俯冲拖尾效果 */
    .snake-segment.dashing::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        background: radial-gradient(circle, transparent 30%, #FFD700 70%);
        transform: translate(-50%, -50%);
        opacity: 0.5;
        filter: blur(5px);
        animation: dashTrail 0.3s forwards;
        z-index: 3;
    }
    
    @keyframes dashTrail {
        from {
            opacity: 0.5;
            transform: translate(-50%, -50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
        }
    }
`;
document.head.appendChild(dashStyle);



// 添加移动统计，记录俯冲次数
gameStats.snake1.dashCount = 0;
gameStats.snake2.dashCount = 0;

// 修改checkDoubleTap函数，记录俯冲次数
function checkDoubleTap(snakeId, key) {
    const now = performance.now();
    const state = dashState[snakeId];
    
    // 检查是否是速度蛇
    const isSpeedSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'speed' : snakeTypes.snake2 === 'speed';
    if (!isSpeedSnake) return false;
    
    // 转换玩家2的方向键
    let normalizedKey = key;
    if (snakeId === 'snake2') {
        switch(key) {
            case 'ArrowUp': normalizedKey = 'w'; break;
            case 'ArrowDown': normalizedKey = 's'; break;
            case 'ArrowLeft': normalizedKey = 'a'; break;
            case 'ArrowRight': normalizedKey = 'd'; break;
            default: return false;
        }
    }
    
    // 检查是否是对应的方向键
    const directionKeys = ['w', 's', 'a', 'd'];
    if (!directionKeys.includes(normalizedKey)) return false;
    
    // 检查是否是连续按相同键（500毫秒内）
    if (state.lastKey === normalizedKey && now - state.lastKeyTime < 500) {
        // 重置按键记录
        state.lastKey = null;
        state.lastKeyTime = 0;
        
        // 检查是否已经在俯冲中
        if (state.active) {
            // 如果在俯冲中再次触发，只延长俯冲时间，不给予任何免疫
            state.endTime = now + 500; // 延长俯冲时间
            
            // 显示提示（无免疫）
            const head = snakes[snakeId][0];
            showNotice('俯冲延长 (无免疫)', '#FFA500', head.x, head.y);
            createParticles(head.x + 10, head.y + 10, 8, '#FFA500');
            
            // 记录俯冲时间（但这不是有免疫的俯冲）
            lastDashTime[snakeId] = now;
            
            return true;
        } else {
            // 新的俯冲开始
            state.active = true;
            state.endTime = now + 500; // 俯冲0.5秒
            
            // 记录本次俯冲时间
            lastDashTime[snakeId] = now;
            
            // 计算距离上次有免疫的俯冲的时间间隔
            const timeSinceLastImmunityDash = now - lastImmunityDashTime[snakeId];
            
            // 决定是否给予免疫
            let giveImmunity = false;
            let message = '';
            let color = '';
            let particleColor = '';
            
            if (timeSinceLastImmunityDash > 1000) {
                // 距离上次有免疫的俯冲超过1秒，给予免疫
                giveImmunity = true;
                message = '俯冲+免疫!';
                color = snakeId === 'snake1' ? '#FF5722' : '#2196F3';
                particleColor = '#FFD700';
                
                // 记录这次是有免疫的俯冲
                lastImmunityDashTime[snakeId] = now;
                
                // 给予0.5秒免疫
                const immunityDuration = 500;
                if (snakeId === 'snake1') {
                    immunity.snake1 = true;
                    immunity.timer1 = Math.max(immunity.timer1, now + immunityDuration);
                } else {
                    immunity.snake2 = true;
                    immunity.timer2 = Math.max(immunity.timer2, now + immunityDuration);
                }
            } else {
                // 距离上次有免疫的俯冲小于1秒，不给免疫
                giveImmunity = false;
                message = '俯冲! (无免疫)';
                color = '#FFA500';
                particleColor = '#FFA500';
            }
            
            // 记录俯冲次数
            gameStats[snakeId].dashCount = (gameStats[snakeId].dashCount || 0) + 1;
            
            // 显示提示
            const head = snakes[snakeId][0];
            showNotice(message, color, head.x, head.y);
            createParticles(head.x + 10, head.y + 10, giveImmunity ? 15 : 10, particleColor);
            
            return true;
        }
    }
    
    // 记录按键
    state.lastKey = normalizedKey;
    state.lastKeyTime = now;
    
    return false;
}
function generateAllWalls() {
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    const gridSize = 20;
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
            
            // 新增：检查是否在基地区域内
            if (validWall) {
                if (isInHomeArea(x, y, homes.player1) || 
                    isInHomeArea(x, y, homes.player2)) {
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
            
            // 新增：检查是否在基地区域内
            if (validWall) {
                if (isInHomeArea(x, y, homes.player1) || 
                    isInHomeArea(x, y, homes.player2)) {
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

// 新增：检查是否在基地区域内
function isInHomeArea(x, y, home) {
    if (home.destroyed) return false;
    return x >= home.x && 
           x <= home.x + home.width && 
           y >= home.y && 
           y <= home.y + home.height;
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
    // 只清除DOM元素，不清除游戏数据数组
    document.querySelectorAll('.bullet').forEach(bullet => bullet.remove());
    document.querySelectorAll('.home-base').forEach(home => home.remove());
    document.querySelectorAll('.snake-segment').forEach(segment => segment.remove());
    document.querySelectorAll('.food').forEach(food => food.remove());
    document.querySelectorAll('.special-food').forEach(item => item.remove());
    document.querySelectorAll('.wall-segment').forEach(wall => wall.remove());
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
                    slot.style.background = 'linear-gradient(45deg, #00BFFF, #87CEFA)'; // 浅蓝色
                    slot.style.boxShadow = '0 0 10px #00BFFF';
                    break;
                case 'bomb':
                    slot.style.background = 'linear-gradient(45deg, #FF4500, #FF8C00)';
                    slot.style.boxShadow = '0 0 10px #FF4500';
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
                    slot.style.background = 'linear-gradient(45deg, #00BFFF, #87CEFA)'; // 浅蓝色
                    slot.style.boxShadow = '0 0 10px #00BFFF';
                    break;
                 case 'bomb':
                    slot.style.background = 'linear-gradient(45deg, #FF4500, #FF8C00)';
                    slot.style.boxShadow = '0 0 10px #FF4500';
                    break;    
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
// 修改蛇的绘制，添加俯冲视觉效果
function drawSnakes(withAnimation = false) {
    for (const snakeId in snakes) {
        const snake = snakes[snakeId];
        const isSnake1 = snakeId === 'snake1';
        const isSpeedSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'speed' : snakeTypes.snake2 === 'speed';
        
        snake.forEach((segment, index) => {
            const segmentElement = document.createElement('div');
            segmentElement.className = `snake-segment ${snakeId}`;
            
            // 添加俯冲效果
            if (isSpeedSnake && dashState[snakeId].active) {
                segmentElement.classList.add('dashing');
                segmentElement.style.boxShadow = '0 0 20px #FFD700';
                segmentElement.style.animation = 'dashPulse 0.2s infinite alternate';
                
                if (index === 0) {
                    segmentElement.innerHTML = '⚡';
                    segmentElement.style.display = 'flex';
                    segmentElement.style.justifyContent = 'center';
                    segmentElement.style.alignItems = 'center';
                    segmentElement.style.fontSize = '16px';
                }
            }
            
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
function handleHomes(timestamp) {
    for (const snakeId in snakes) {
        const head = snakes[snakeId][0];
        const playerNum = snakeId === 'snake1' ? 'player1' : 'player2';
        const opponentNum = snakeId === 'snake1' ? 'player2' : 'player1';
        
        // 检查是否在自己的基地中
        const inOwnHome = isPointInRect(head, homes[playerNum]);
        const inOpponentHome = isPointInRect(head, homes[opponentNum]);
        
        // 检查是否有免疫效果
        const hasImmunity = (snakeId === 'snake1' && immunity.snake1) || 
                           (snakeId === 'snake2' && immunity.snake2);
        
        // 检查是否是坚硬蛇
        const isToughSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'tough' : snakeTypes.snake2 === 'tough';
        
        if (inOwnHome && !homes[playerNum].destroyed) {
            // 在自己的基地中回血
            if (timestamp - homes[playerNum].lastHealTime > 1000) {
                // 使用统一的治疗函数
                const healed = applyHealing(snakeId, 1, 'home');
                
                if (healed) {
                    createParticles(
                        homes[playerNum].x + homes[playerNum].width/2,
                        homes[playerNum].y + homes[playerNum].height/2,
                        10,
                        '#4CAF50'
                    );
                }
                
                homes[playerNum].lastHealTime = timestamp;
            }
        } else if (inOpponentHome && !homes[opponentNum].destroyed) {
            // 在对方基地中造成伤害
            if (timestamp - homes[opponentNum].lastDamageTime > 1000) {
                
                let damageToHome = 3; // 对基地的固定伤害
                let damageToSelf = 1; // 对自己的伤害
                
                // 如果是坚硬蛇，自己受到的伤害减半
                if (isToughSnake) {
                    damageToSelf = Math.ceil(damageToSelf / 2);
                }
                
                if (!hasImmunity) {
                    // 没有免疫效果：双方都掉血
                    // 对方基地掉血
                    homes[opponentNum].health = Math.max(0, homes[opponentNum].health - damageToHome);
                    
                    // 记录蛇对基地的伤害（输出伤害）- 这部分统计已经在applyDamage中处理
                    
                    // 自己掉血（使用统一的伤害函数）
                    const damageApplied = applyDamage(snakeId, damageToSelf, 'home', {
                        home: opponentNum,
                        damageToHome: damageToHome,
                        isToughSnake: isToughSnake
                    });
                    
                    if (damageApplied) {
                        // 显示伤害效果
                        let selfDamageMessage = `-${damageToSelf}HP`;
                        if (isToughSnake) {
                            selfDamageMessage += ' (坚硬减半)';
                            showNotice(`攻击对方基地! ${selfDamageMessage}`, '#FFA500',
                                     homes[opponentNum].x + homes[opponentNum].width/2,
                                     homes[opponentNum].y + homes[opponentNum].height/2);
                            createParticles(head.x + 10, head.y + 10, 8, '#C0C0C0'); // 银色粒子
                        } else {
                            showNotice(`攻击对方基地! ${selfDamageMessage}`, '#FF0000',
                                     homes[opponentNum].x + homes[opponentNum].width/2,
                                     homes[opponentNum].y + homes[opponentNum].height/2);
                            createParticles(head.x + 10, head.y + 10, 10, '#FF0000');
                        }
                    }
                    
                } else {
                    // 有免疫效果：只对对方基地造成伤害，自己不受伤
                    homes[opponentNum].health = Math.max(0, homes[opponentNum].health - damageToHome);
                    
                    // 显示免疫攻击效果
                    showNotice('免疫攻击对方基地!', '#FFFF00',
                             homes[opponentNum].x + homes[opponentNum].width/2,
                             homes[opponentNum].y + homes[opponentNum].height/2);
                    
                    // 创建免疫攻击效果
                    createParticles(
                        homes[opponentNum].x + homes[opponentNum].width/2,
                        homes[opponentNum].y + homes[opponentNum].height/2,
                        15,
                        '#FFFF00'
                    );
                }
                
                // 检查基地是否被摧毁（无论是否有免疫）
                if (homes[opponentNum].health <= 0) {
                    homes[opponentNum].destroyed = true;
                    const playerName = opponentNum === 'player1' ? 
                        (localStorage.getItem('username') || '玩家1') : 
                        (localStorage.getItem('player2_username') || '玩家2');
                    
                    showNotice(`${playerName}的基地被摧毁了!`, '#FF0000', 
                             homes[opponentNum].x + homes[opponentNum].width/2, 
                             homes[opponentNum].y + homes[opponentNum].height/2);
                    
                    // 基地被摧毁的大爆炸效果
                    createParticles(
                        homes[opponentNum].x + homes[opponentNum].width/2,
                        homes[opponentNum].y + homes[opponentNum].height/2,
                        30,
                        opponentNum === 'player1' ? '#FF5722' : '#2196F3'
                    );
                }
                
                homes[opponentNum].lastDamageTime = timestamp;
            }
        }
    }
}
function calculateFiringPoints(home, targetPoint, isInsideHome) {
    const points = [];
    
    if (isInsideHome) {
        // 如果在基地内部，从所有边的所有点发射
        return getAllHomeBorderPoints(home);
    }
    
    // 计算目标相对于基地的位置
    const targetX = targetPoint.x;
    const targetY = targetPoint.y;
    const homeLeft = home.x;
    const homeRight = home.x + home.width;
    const homeTop = home.y;
    const homeBottom = home.y + home.height;
    
    // 确定目标在基地的哪个象限/方向
    const isLeft = targetX < homeLeft;
    const isRight = targetX > homeRight;
    const isAbove = targetY < homeTop;
    const isBelow = targetY > homeBottom;
    
    // 根据目标位置确定攻击的边
    if (isAbove && !isLeft && !isRight) {
        // 正上方 → 上边整条边攻击
        points.push(...getHomeBorderPointsBySide(home, 'top'));
    } 
    else if (isBelow && !isLeft && !isRight) {
        // 正下方 → 下边整条边攻击
        points.push(...getHomeBorderPointsBySide(home, 'bottom'));
    }
    else if (isLeft && !isAbove && !isBelow) {
        // 正左方 → 左边整条边攻击
        points.push(...getHomeBorderPointsBySide(home, 'left'));
    }
    else if (isRight && !isAbove && !isBelow) {
        // 正右方 → 右边整条边攻击
        points.push(...getHomeBorderPointsBySide(home, 'right'));
    }
    else {
        // 斜方向 → 用接近的两条边整条边攻击
        // 优先考虑更接近的边
        const horizontalSide = targetX < (homeLeft + homeRight) / 2 ? 'left' : 'right';
        const verticalSide = targetY < (homeTop + homeBottom) / 2 ? 'top' : 'bottom';
        
        // 计算距离权重
        const horizontalDistance = horizontalSide === 'left' ? homeLeft - targetX : targetX - homeRight;
        const verticalDistance = verticalSide === 'top' ? homeTop - targetY : targetY - homeBottom;
        
        // 如果目标更接近水平边，主要从水平边攻击，次要从垂直边攻击
        if (Math.abs(horizontalDistance) < Math.abs(verticalDistance)) {
            // 主要攻击水平边（整条边）
            points.push(...getHomeBorderPointsBySide(home, horizontalSide));
            
            // 次要攻击垂直边的接近部分
            const verticalPoints = getHomeBorderPointsBySide(home, verticalSide);
            const closestVerticalPoints = getClosestBorderPoints(home, verticalSide, targetPoint, 0.5); // 50%的边
            points.push(...closestVerticalPoints);
        } else {
            // 主要攻击垂直边（整条边）
            points.push(...getHomeBorderPointsBySide(home, verticalSide));
            
            // 次要攻击水平边的接近部分
            const horizontalPoints = getHomeBorderPointsBySide(home, horizontalSide);
            const closestHorizontalPoints = getClosestBorderPoints(home, horizontalSide, targetPoint, 0.5);
            points.push(...closestHorizontalPoints);
        }
    }
    
    return points;
}


// 新增函数：检查投影点是否在边上
function isProjectionOnSide(home, side, projectionPoint) {
    switch(side) {
        case 'top':
        case 'bottom':
            return projectionPoint.x >= home.x && projectionPoint.x <= home.x + home.width;
        case 'left':
        case 'right':
            return projectionPoint.y >= home.y && projectionPoint.y <= home.y + home.height;
        default:
            return false;
    }
}

// 新增函数：计算点到边的距离
function getDistanceToSide(point, home, side) {
    switch(side) {
        case 'top':
            return Math.abs(point.y - home.y);
        case 'bottom':
            return Math.abs(point.y - (home.y + home.height));
        case 'left':
            return Math.abs(point.x - home.x);
        case 'right':
            return Math.abs(point.x - (home.x + home.width));
        default:
            return Infinity;
    }
}

// 新增函数：获取边接近目标的部分
function getClosestBorderPoints(home, side, targetPoint, proportion = 0.3) {
    const points = [];
    const allPoints = getHomeBorderPointsBySide(home, side);
    
    if (allPoints.length <= 3) {
        return allPoints;
    }
    
    // 找到边上距离目标最近的点
    let closestIndex = 0;
    let minDistance = Infinity;
    
    allPoints.forEach((point, index) => {
        const distance = Math.sqrt(
            Math.pow(point.x - targetPoint.x, 2) + 
            Math.pow(point.y - targetPoint.y, 2)
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });
    
    // 根据比例计算应该取多少点
    const pointsToTake = Math.max(3, Math.floor(allPoints.length * proportion));
    const halfPoints = Math.floor(pointsToTake / 2);
    
    const startIndex = Math.max(0, closestIndex - halfPoints);
    const endIndex = Math.min(allPoints.length - 1, startIndex + pointsToTake - 1);
    
    for (let i = startIndex; i <= endIndex; i++) {
        points.push(allPoints[i]);
    }
    
    return points;
}
// 新增函数：获取所有边的所有点
function getAllHomeBorderPoints(home) {
    const points = [];
    const gridSize = 20;
    
    const startX = home.x;
    const startY = home.y;
    const endX = home.x + home.width;
    const endY = home.y + home.height;
    
    // 上边框
    for (let x = startX; x < endX; x += gridSize) {
        points.push({ x: x, y: startY, side: 'top' });
    }
    
    // 下边框
    for (let x = startX; x < endX; x += gridSize) {
        points.push({ x: x, y: endY - 2, side: 'bottom' });
    }
    
    // 左边框
    for (let y = startY; y < endY; y += gridSize) {
        points.push({ x: startX, y: y, side: 'left' });
    }
    
    // 右边框
    for (let y = startY; y < endY; y += gridSize) {
        points.push({ x: endX - 2, y: y, side: 'right' });
    }
    
    return points;
}
        
        // 检查点是否在矩形内
        function isPointInRect(point, rect) {
            return point.x >= rect.x && 
                   point.x <= rect.x + rect.width && 
                   point.y >= rect.y && 
                   point.y <= rect.y + rect.height;
        }
        
        // 在clearBoard函数中添加清除基地元素
        function clearBoard() {
            document.querySelectorAll('.bullet').forEach(bullet => bullet.remove());
            document.querySelectorAll('.home-base').forEach(home => home.remove());
            while (gameBoard.firstChild) {
                gameBoard.removeChild(gameBoard.firstChild);
            }
        }
function updateBaseDefense(playerHomeId, timestamp) {
    const defense = baseDefense[playerHomeId];
    const home = homes[playerHomeId];
    const targetSnakeId = playerHomeId === 'player1' ? 'snake2' : 'snake1';
    const targetSnake = snakes[targetSnakeId];
    const targetHead = targetSnake[0];
    
    // 检查是否在攻击范围内（20格 = 400像素）
    const distance = calculateDistanceToRect(targetHead, home);
    const inRange = distance <= defense.attackRange * 20;
    
    // 检查目标蛇是否在基地内部
    const isInsideHome = isPointInRect(targetHead, home);
    
    // 激活防御条件：目标在攻击范围内
    defense.active = inRange || isInsideHome;
    defense.targetSnake = defense.active ? targetSnakeId : null;
    
    // 如果防御激活，发射子弹
    if (defense.active && timestamp - defense.lastShotTime > defense.shootInterval) {
        // 计算应该发射子弹的边和具体位置
        const firingPoints = calculateFiringPoints(home, targetHead, isInsideHome);
        
        if (firingPoints.length > 0) {
            fireBaseBullet(playerHomeId, targetHead, firingPoints, timestamp);
            defense.lastShotTime = timestamp;
            
            // 显示攻击方向提示（可选）
            showAttackDirectionHint(playerHomeId, targetHead, home);
        }
    }
}
function showAttackDirectionHint(playerHomeId, targetHead, home) {
    const targetX = targetHead.x;
    const targetY = targetHead.y;
    const homeCenterX = home.x + home.width / 2;
    const homeCenterY = home.y + home.height / 2;
    
    // 计算方向
    const isLeft = targetX < home.x;
    const isRight = targetX > home.x + home.width;
    const isAbove = targetY < home.y;
    const isBelow = targetY > home.y + home.height;
    
    let direction = '';
    
    if (isAbove && !isLeft && !isRight) {
        direction = '上方';
    } else if (isBelow && !isLeft && !isRight) {
        direction = '下方';
    } else if (isLeft && !isAbove && !isBelow) {
        direction = '左方';
    } else if (isRight && !isAbove && !isBelow) {
        direction = '右方';
    } else if (isAbove && isLeft) {
        direction = '左上方';
    } else if (isAbove && isRight) {
        direction = '右上方';
    } else if (isBelow && isLeft) {
        direction = '左下方';
    } else if (isBelow && isRight) {
        direction = '右下方';
    } else {
        direction = '内部';
    }
    
    // 显示方向提示（只在基地中心附近显示，避免干扰）
    const showX = home.x + home.width / 2;
    const showY = home.y + home.height / 2 - 20;
    
    showNotice(`${direction}防御!`, playerHomeId === 'player1' ? '#FF5722' : '#2196F3',
              showX, showY);
}

function handleBaseDefense(timestamp) {
    // 检查玩家1的基地防御
    if (!homes.player1.destroyed) {
        updateBaseDefense('player1', timestamp);
    }
    
    // 检查玩家2的基地防御
    if (!homes.player2.destroyed) {
        updateBaseDefense('player2', timestamp);
    }
}
// 新增函数：计算应该从哪边发射子弹
function calculateFiringSides(home, targetPoint, isInsideHome) {
    const sides = [];
    
    if (isInsideHome) {
        // 如果在基地内部，从所有边发射
        return ['top', 'bottom', 'left', 'right'];
    }
    
    // 计算目标相对于基地的位置
    const homeCenterX = home.x + home.width / 2;
    const homeCenterY = home.y + home.height / 2;
    
    // 计算角度（0度是正右方，逆时针增加）
    const angle = Math.atan2(targetPoint.y - homeCenterY, targetPoint.x - homeCenterX) * 180 / Math.PI;
    
    // 标准化角度到0-360度
    const normalizedAngle = (angle + 360) % 360;
    
    // 根据角度确定应该从哪边发射
    if (normalizedAngle >= 45 && normalizedAngle < 135) {
        // 下方（目标在基地下方）
        sides.push('bottom');
    } else if (normalizedAngle >= 135 && normalizedAngle < 225) {
        // 左方（目标在基地左方）
        sides.push('left');
    } else if (normalizedAngle >= 225 && normalizedAngle < 315) {
        // 上方（目标在基地上方）
        sides.push('top');
    } else {
        // 右方（目标在基地右方）
        sides.push('right');
    }
    
    return sides;
}

// 修改fireBaseBullet函数，只从指定边发射
function fireBaseBullet(playerHomeId, targetHead, firingPoints, timestamp) {
    const defense = baseDefense[playerHomeId];
    const home = homes[playerHomeId];
    const targetSnakeId = playerHomeId === 'player1' ? 'snake2' : 'snake1';
    
    // 从所有发射点发射子弹
    firingPoints.forEach(point => {
        // 检查子弹数量是否达到上限
        if (bullets.length >= MAX_BULLETS) {
            // 移除最旧的子弹
            bullets.shift();
        }
        
        // 计算子弹方向（朝向目标蛇头）
        const angle = Math.atan2(
            targetHead.y + 10 - point.y,
            targetHead.x + 10 - point.x
        );
        
        const bullet = {
            x: point.x,
            y: point.y,
            angle: angle,
            speed: defense.bulletSpeed,
            player: 'base_' + playerHomeId, // 确保正确标识基地
            size: 6,
            damage: defense.damage,
            fromSide: point.side || 'unknown',
            createTime: performance.now() // 添加创建时间戳
        };
        
        bullets.push(bullet);
        
        // 发射特效
        const particleColor = playerHomeId === 'player1' ? '#FF5722' : '#2196F3';
        createParticles(point.x, point.y, 3, particleColor);
    });
    
    // 显示基地攻击提示
    if (timestamp - defense.lastShotTime > 4000) {
        const sideCount = {};
        firingPoints.forEach(point => {
            if (point.side) {
                sideCount[point.side] = (sideCount[point.side] || 0) + 1;
            }
        });
        
        const sides = Object.keys(sideCount);
        if (sides.length > 0) {
            const directionText = sides.map(side => {
                switch(side) {
                    case 'top': return '上方';
                    case 'bottom': return '下方';
                    case 'left': return '左方';
                    case 'right': return '右方';
                    default: return '';
                }
            }).join('、');
            
            showNotice(`基地${directionText}防御激活!`, playerHomeId === 'player1' ? '#FF5722' : '#2196F3',
                      home.x + home.width/2, home.y + home.height/2);
        }
    }
}
// 添加子弹样式到CSS
const bulletStyles = document.createElement('style');
bulletStyles.textContent = `
    /* 子弹样式 */
    .bullet {
        transition: transform 0.1s ease-out;
    }
    
    .bullet:hover {
        transform: scale(1.2);
    }
    
    /* 子弹旋转动画 */
    @keyframes bulletSpin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    /* 子弹拖尾效果 */
    .bullet-tail {
        transition: opacity 0.2s ease-out;
    }
    
    /* 不同玩家子弹的特殊效果 */
    .bullet[style*="FF5722"] {
        animation: pulseOrange 0.5s infinite alternate;
    }
    
    .bullet[style*="2196F3"] {
        animation: pulseBlue 0.5s infinite alternate;
    }
    
    @keyframes pulseOrange {
        from {
            box-shadow: 0 0 8px #FF5722;
        }
        to {
            box-shadow: 0 0 15px #FF5722;
        }
    }
    
    @keyframes pulseBlue {
        from {
            box-shadow: 0 0 8px #2196F3;
        }
        to {
            box-shadow: 0 0 15px #2196F3;
        }
    }
`;
document.head.appendChild(bulletStyles);

// 新增函数：获取基地指定边的发射点
function getHomeBorderPointsBySide(home, side) {
    const points = [];
    const gridSize = 20;
    
    const startX = home.x;
    const startY = home.y;
    const endX = home.x + home.width;
    const endY = home.y + home.height;
    
    switch(side) {
        case 'top':
            for (let x = startX; x < endX; x += gridSize) {
                points.push({ x: x, y: startY, side: 'top' });
            }
            break;
            
        case 'bottom':
            for (let x = startX; x < endX; x += gridSize) {
                points.push({ x: x, y: endY - 2, side: 'bottom' });
            }
            break;
            
        case 'left':
            for (let y = startY; y < endY; y += gridSize) {
                points.push({ x: startX, y: y, side: 'left' });
            }
            break;
            
        case 'right':
            for (let y = startY; y < endY; y += gridSize) {
                points.push({ x: endX - 2, y: y, side: 'right' });
            }
            break;
    }
    
    return points;
}
function updateDashState(timestamp) {
    for (const snakeId of ['snake1', 'snake2']) {
        const state = dashState[snakeId];
        if (state.active && timestamp > state.endTime) {
            state.active = false;
            
            // 俯冲结束提示
            const head = snakes[snakeId][0];
            showNotice('俯冲结束', '#888888', head.x, head.y);
        }
    }
}
// 游戏主循环
function gameLoop(timestamp) {
    if (!gameStarted) return;
    
    if (currentMap === 'snow') {
        handleBlizzard(timestamp);
    } else if (currentMap === 'volcano') {
        handleVolcanoEruption(timestamp);
    }  
    updateDashState(timestamp);
requestAnimationFrame(gameLoop);
                // 处理基地相关逻辑
    handleHomes(timestamp);
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
// 在moveSnake函数开头附近，修改速度计算
    const snake1Speed = getSnakeSpeed('snake1');
    const snake2Speed = getSnakeSpeed('snake2');
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
    
    
    // 检查墙碰撞
    checkWallCollisions(timestamp);
    // 重新绘制
    clearBoard();
    drawWalls();
    drawBullets(); // 绘制子弹
    drawSpecialItems();
    drawVolcanoes();
    drawSnakes();
    handleBaseDefense(timestamp);
    drawHomes();
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
            
            // 新增：检查是否在基地区域内
            if (validPosition) {
                if (isInHomeArea(volcanoX, volcanoY, homes.player1) || 
                    isInHomeArea(volcanoX, volcanoY, homes.player2)) {
                    validPosition = false;
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
            nextEruptionTime = timestamp + 20; // 30秒后下次喷发
        }, 15000);
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
        const headGridX = Math.floor(head.x / 20) * 20;
        const headGridY = Math.floor(head.y / 20) * 20;
        
        for (const lava of lavaTiles) {
            // 精确网格对齐检查
            if (headGridX === lava.x && headGridY === lava.y) {
                // 检查是否移动到这个岩浆格
                const lastMove = lastMoveTime[snakeId];
                const justMovedToLava = timestamp - lastMove < 200;
                
                // 只在刚刚移动过来时造成伤害
                if (justMovedToLava) {
                    // 检查距离上次伤害是否超过1秒
                    const lastDamageTime = lava.lastDamageTime || 0;
                    if (timestamp - lastDamageTime > 1000) {
                        // 使用统一的伤害函数
                        applyDamage(snakeId, 2, 'lava', {
                            lavaTile: lava,
                            timestamp: timestamp
                        });
                        
                        // 记录伤害时间
                        lava.lastDamageTime = timestamp;
                    }
                }
                
                // 更新岩浆接触时间
                if (!lava.lastContactTime || timestamp - lava.lastContactTime > 500) {
                    createParticles(head.x + 10, head.y + 10, 5, '#FF4500');
                    lava.lastContactTime = timestamp;
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
// 修改checkWallCollisions函数中的伤害处理
function checkWallCollisions(timestamp) {
    for (const snakeId in snakes) {
        const head = snakes[snakeId][0];
        const headCenterX = head.x + 10;
        const headCenterY = head.y + 10;
        
        // 遍历所有墙
        for (let w = walls.length - 1; w >= 0; w--) {
            const wall = walls[w];
            
            // 遍历墙的所有段
            for (let s = wall.segments.length - 1; s >= 0; s--) {
                const segment = wall.segments[s];
                const wallCenterX = segment.x + 10;
                const wallCenterY = segment.y + 10;
                
                // 计算距离
                const distance = Math.sqrt(
                    Math.pow(headCenterX - wallCenterX, 2) + 
                    Math.pow(headCenterY - wallCenterY, 2)
                );
                
                // 距离小于20像素就算碰撞
                if (distance < 20) {
                    // 检查是否是新碰撞
                    if (timestamp - lastWallHitTime[snakeId] > 1000) {
                        lastWallHitTime[snakeId] = timestamp;
                        
                        // 使用统一的伤害函数
                        applyDamage(snakeId, 5, 'wall', {
                            wallSegment: segment,
                            distance: distance
                        });
                        
                        // 无论是否免疫，都能撞烂墙
                        createParticles(head.x + 10, head.y + 10, 10, '#FF0000');
                        wall.segments.splice(s, 1);
                        
                        // 如果这面墙的所有段都被撞烂了，移除整面墙
                        if (wall.segments.length === 0) {
                            walls.splice(w, 1);
                        }
                    }
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
    
    if (randomValue < 0.3) { // 30% 攻击球
        ballType = 'attack';
    } else if (randomValue < 0.5) { // 20% 血球
        ballType = 'health';
    } else if (randomValue < 0.6) { // 10% 无敌球
        ballType = 'immunity';
    } else if (randomValue < 0.7) { // 10% 反转球
        ballType = 'reverse';
    } else { // 30% 炸弹球
        ballType = 'bomb';
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
        
        // 根据子弹所属玩家设置颜色
        if (bullet.player === 'snake1') {
            // 玩家1子弹：橙色渐变
            bulletElement.style.background = 'linear-gradient(45deg, #FF5722, #FF9800)';
            bulletElement.style.boxShadow = '0 0 8px #FF5722, 0 0 12px rgba(255, 87, 34, 0.7)';
        } else if (bullet.player === 'snake2') {
            // 玩家2子弹：蓝色渐变
            bulletElement.style.background = 'linear-gradient(45deg, #2196F3, #00BCD4)';
            bulletElement.style.boxShadow = '0 0 8px #2196F3, 0 0 12px rgba(33, 150, 243, 0.7)';
        } else if (bullet.player === 'base_player1') {
            // 玩家1基地子弹：深橙色，更明显
            bulletElement.style.background = 'radial-gradient(circle, #FF5722, #FF3300)';
            bulletElement.style.boxShadow = '0 0 10px #FF3300, 0 0 15px rgba(255, 51, 0, 0.8)';
            // 添加旋转动画
            bulletElement.style.animation = 'bulletSpin 1s linear infinite';
        } else if (bullet.player === 'base_player2') {
            // 玩家2基地子弹：深蓝色，更明显
            bulletElement.style.background = 'radial-gradient(circle, #2196F3, #0066FF)';
            bulletElement.style.boxShadow = '0 0 10px #0066FF, 0 0 15px rgba(0, 102, 255, 0.8)';
            bulletElement.style.animation = 'bulletSpin 1s linear infinite';
        }
        
        // 添加拖尾效果
        const tail = document.createElement('div');
        tail.className = 'bullet-tail';
        tail.style.position = 'absolute';
        tail.style.left = '50%';
        tail.style.top = '50%';
        tail.style.width = `${bullet.size * 3}px`;
        tail.style.height = '2px';
        tail.style.background = 'inherit';
        tail.style.transform = 'translate(-50%, -50%) rotate(180deg)';
        tail.style.opacity = '0.6';
        tail.style.filter = 'blur(1px)';
        bulletElement.appendChild(tail);
        
        gameBoard.appendChild(bulletElement);
    });
}
function checkBulletHitHome(bullet) {
    // 根据子弹所属玩家确定目标基地
    const targetHome = bullet.player === 'snake1' ? homes.player2 : homes.player1;
    
    // 如果目标基地已被摧毁，跳过检查
    if (targetHome.destroyed) return false;
    
    // 检查子弹是否在基地的范围内
    if (bullet.x >= targetHome.x && 
        bullet.x <= targetHome.x + targetHome.width &&
        bullet.y >= targetHome.y && 
        bullet.y <= targetHome.y + targetHome.height) {
        
        // 子弹对基地造成伤害
        targetHome.health = Math.max(0, targetHome.health - 2); // 子弹造成0.5点伤害
        
        // 显示伤害效果
        showNotice('-2HP', bullet.player === 'snake1' ? '#FF5722' : '#2196F3', 
                 targetHome.x + targetHome.width/2, targetHome.y + targetHome.height/2);
        
        // 创建击中效果
        createParticles(bullet.x, bullet.y, 15, bullet.player === 'snake1' ? '#FF5722' : '#2196F3');
        
        // 检查基地是否被摧毁
        if (targetHome.health <= 0) {
            targetHome.destroyed = true;
            const playerName = bullet.player === 'snake1' ? 
                (localStorage.getItem('player2_username') || '玩家2') : 
                (localStorage.getItem('username') || '玩家1');
            
            showNotice(`${playerName}的基地被摧毁了!`, '#FF0000', 
                     targetHome.x + targetHome.width/2, targetHome.y + targetHome.height/2);
            
            // 基地被摧毁的大爆炸效果
            createParticles(
                targetHome.x + targetHome.width/2,
                targetHome.y + targetHome.height/2,
                40,
                bullet.player === 'snake1' ? '#2196F3' : '#FF5722'
            );
        }
        
        return true; // 子弹已击中目标
    }
    
    return false; // 子弹未击中
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
    
    // 检查子弹数量是否达到上限
    if (bullets.length >= MAX_BULLETS) {
        // 查找并移除最旧的蛇子弹（不是基地子弹）
        const oldestSnakeBulletIndex = bullets.findIndex(bullet => 
            bullet.player === 'snake1' || bullet.player === 'snake2');
        
        if (oldestSnakeBulletIndex !== -1) {
            bullets.splice(oldestSnakeBulletIndex, 1);
        } else {
            // 如果没有找到蛇子弹，就移除最旧的子弹
            bullets.shift();
        }
    }
    
    // 创建子弹
    const bullet = {
        x: head.x + 10, // 从蛇头中心发射
        y: head.y + 10,
        direction: direction,
        player: snakeId, // 确保正确标识玩家
        speed: 30,
        size: 8,
        createTime: currentTime // 添加创建时间戳
    };
    
    bullets.push(bullet);
    
    // 播放发射音效或动画
    const particleColor = snakeId === 'snake1' ? '#FF5722' : '#2196F3';
    createParticles(head.x + 10, head.y + 10, 10, particleColor);
}
// 新增/修改函数：检查蛇子弹是否击中
function checkSnakeBulletHit(bullet, targetSnakeId, bulletIndex) {
    const targetSnake = snakes[targetSnakeId];
    
    for (let j = 0; j < targetSnake.length; j++) {
        const segment = targetSnake[j];
        const distance = Math.sqrt(
            Math.pow(bullet.x - segment.x - 10, 2) + 
            Math.pow(bullet.y - segment.y - 10, 2)
        );
        
        if (distance < (20 + bullet.size) / 2) {
            // 击中目标
            bullets.splice(bulletIndex, 1);
            
            // 使用统一的伤害函数
            const damageApplied = applyDamage(targetSnakeId, 0.5, 'bullet', {
                attacker: bullet.player,
                bulletSize: bullet.size,
                hitSegment: j
            });
            
            // 如果没有应用伤害（免疫或坚硬免疫），已经显示过提示
            if (!damageApplied) {
                break;
            }
            
            break;
        }
    }
}


// 修改后的moveBullets函数
function moveBullets(timestamp) {
    // 首先检查子弹数量，如果超过限制，移除最旧的
    if (bullets.length > MAX_BULLETS) {
        // 按创建时间排序，移除最旧的
        bullets.sort((a, b) => (a.createTime || 0) - (b.createTime || 0));
        const bulletsToRemove = bullets.length - MAX_BULLETS;
        bullets.splice(0, bulletsToRemove);
        
        // 清理对应的DOM元素
        setTimeout(() => {
            const bulletElements = document.querySelectorAll('.bullet');
            if (bulletElements.length > MAX_BULLETS) {
                for (let i = 0; i < bulletsToRemove && i < bulletElements.length; i++) {
                    bulletElements[i].remove();
                }
            }
        }, 0);
    }
    
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        
        // 根据子弹类型移动
        if (bullet.player.startsWith('base_')) {
            // 基地子弹：按角度移动
            bullet.x += Math.cos(bullet.angle) * bullet.speed;
            bullet.y += Math.sin(bullet.angle) * bullet.speed;
        } else {
            // 蛇子弹：按方向移动
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
                
                if (distance < 15) {
                    hitWall = true;
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
        
        // 检查是否击中蛇
        if (bullet.player.startsWith('base_')) {
            // 基地子弹检查
            const targetSnakeId = bullet.player === 'base_player1' ? 'snake2' : 'snake1';
            checkBaseBulletHit(bullet, targetSnakeId, i);
        } else {
            // 蛇子弹检查
            const targetSnakeId = bullet.player === 'snake1' ? 'snake2' : 'snake1';
            checkSnakeBulletHit(bullet, targetSnakeId, i);
        }
        
        // 检查是否击中基地
        if (!bullet.player.startsWith('base_')) { // 只有蛇子弹可以伤害基地
            checkBulletHitHome(bullet, i);
        }
    }
}


// 新增函数：检查子弹是否击中基地（从原checkBulletHitHome分离）
function checkBulletHitHome(bullet, bulletIndex) {
    // 根据子弹所属玩家确定目标基地
    const targetHome = bullet.player === 'snake1' ? homes.player2 : homes.player1;
    
    // 如果目标基地已被摧毁，跳过检查
    if (targetHome.destroyed) return false;
    
    // 检查子弹是否在基地的范围内
    if (bullet.x >= targetHome.x && 
        bullet.x <= targetHome.x + targetHome.width &&
        bullet.y >= targetHome.y && 
        bullet.y <= targetHome.y + targetHome.height) {
        
        // 检查目标基地所属玩家是否有免疫效果
        const targetSnakeId = bullet.player === 'snake1' ? 'snake2' : 'snake1';
        const hasImmunity = (targetSnakeId === 'snake1' && immunity.snake1) || 
                           (targetSnakeId === 'snake2' && immunity.snake2);
        
        if (!hasImmunity) {
            // 没有免疫效果：子弹对基地造成伤害
            targetHome.health = Math.max(0, targetHome.health - 1);
            
            // 显示伤害效果
            showNotice('-1HP', bullet.player === 'snake1' ? '#FF5722' : '#2196F3', 
                     targetHome.x + targetHome.width/2, targetHome.y + targetHome.height/2);
            
            // 创建击中效果
            createParticles(bullet.x, bullet.y, 15, bullet.player === 'snake1' ? '#FF5722' : '#2196F3');
            
            // 移除子弹
            bullets.splice(bulletIndex, 1);
            
        } else {
            // 有免疫效果：显示免疫提示
            showNotice('免疫子弹伤害!', '#FFFF00', 
                     targetHome.x + targetHome.width/2, targetHome.y + targetHome.height/2);
            
            // 创建免疫效果
            createParticles(bullet.x, bullet.y, 15, '#FFFF00');
        }
        
        // 检查基地是否被摧毁（无论是否有免疫）
        if (targetHome.health <= 0) {
            targetHome.destroyed = true;
            const playerName = bullet.player === 'snake1' ? 
                (localStorage.getItem('player2_username') || '玩家2') : 
                (localStorage.getItem('username') || '玩家1');
            
            showNotice(`${playerName}的基地被摧毁了!`, '#FF0000', 
                     targetHome.x + targetHome.width/2, targetHome.y + targetHome.height/2);
            
            // 基地被摧毁的大爆炸效果
            createParticles(
                targetHome.x + targetHome.width/2,
                targetHome.y + targetHome.height/2,
                40,
                bullet.player === 'snake1' ? '#2196F3' : '#FF5722'
            );
        }
        
        return true; // 子弹已击中目标
    }
    
    return false; // 子弹未击中
}
function checkBaseBulletHit(bullet, targetSnakeId, bulletIndex) {
    const targetSnake = snakes[targetSnakeId];
    
    for (let j = 0; j < targetSnake.length; j++) {
        const segment = targetSnake[j];
        const distance = Math.sqrt(
            Math.pow(bullet.x - segment.x - 10, 2) + 
            Math.pow(bullet.y - segment.y - 10, 2)
        );
        
        if (distance < (20 + bullet.size) / 2) {
            // 击中目标
            bullets.splice(bulletIndex, 1);
            
            // 使用统一的伤害函数
            const damageApplied = applyDamage(targetSnakeId, bullet.damage, 'base', {
                attacker: bullet.player,
                fromBase: true,
                bulletSize: bullet.size,
                hitSegment: j
            });
            
            if (!damageApplied) {
                break;
            }
            
            break;
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
        // 检查是否是坚硬蛇
    const isToughSnake1 = snakeTypes.snake1 === 'tough';
    const isToughSnake2 = snakeTypes.snake2 === 'tough';
    
    // 显示坚硬蛇状态
    if (isToughSnake1) {
        effect1.textContent += '坚硬(伤害减半) ';
    }
    if (isToughSnake2) {
        effect2.textContent += '坚硬(伤害减半) ';
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
    gameStats[snakeId].distanceTraveled += 1;
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
                
                // 使用统一的伤害函数 - 玩家1受到玩家2的伤害
                applyDamage('snake1', damage2, 'snakeCollision', {
                    attacker: 'snake2',
                    isHeadCollision: true,
                    collisionPoint: head
                });
                
                // 使用统一的伤害函数 - 玩家2受到玩家1的伤害
                applyDamage('snake2', damage1, 'snakeCollision', {
                    attacker: 'snake1',
                    isHeadCollision: true,
                    collisionPoint: snakes[otherSnakeId][0]
                });
                
                // 双方碰撞特效
                createParticles(head.x + 10, head.y + 10, 30, '#FF0000');
                createParticles(snakes[otherSnakeId][0].x + 10, snakes[otherSnakeId][0].y + 10, 30, '#FF0000');
                
            } else if (isImmune && !isOtherImmune) {
                // 只有当前蛇有免疫，只扣对方血
                const damage = snakeTypes[otherSnakeId] === 'tough' ? 2 : 1;
                
                // 使用统一的伤害函数 - 对方受到伤害
                const damageApplied = applyDamage(otherSnakeId, damage, 'snakeCollision', {
                    attacker: snakeId,
                    isHeadCollision: true,
                    collisionPoint: head,
                    immuneAttacker: true
                });
                
                if (damageApplied) {
                    // 显示免疫提示
                    showNotice('免疫!', '#FFFF00', head.x, head.y);
                    
                    // 特效
                    createParticles(head.x + 10, head.y + 10, 15, '#FFFF00');
                    createParticles(snakes[otherSnakeId][0].x + 10, snakes[otherSnakeId][0].y + 10, 30, '#FF0000');
                }
                
            } else if (!isImmune && isOtherImmune) {
                // 只有对方蛇有免疫，只扣当前蛇血
                const damage = snakeTypes[snakeId] === 'tough' ? 2 : 1;
                
                // 使用统一的伤害函数 - 当前蛇受到伤害
                const damageApplied = applyDamage(snakeId, damage, 'snakeCollision', {
                    attacker: otherSnakeId,
                    isHeadCollision: true,
                    collisionPoint: snakes[otherSnakeId][0],
                    immuneTarget: true
                });
                
                if (damageApplied) {
                    // 显示免疫提示
                    showNotice('免疫!', '#FFFF00', snakes[otherSnakeId][0].x, snakes[otherSnakeId][0].y);
                    
                    // 特效
                    createParticles(head.x + 10, head.y + 10, 30, '#FF0000');
                    createParticles(snakes[otherSnakeId][0].x + 10, snakes[otherSnakeId][0].y + 10, 15, '#FFFF00');
                }
                
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
            
            // 使用统一的伤害函数
            const damageApplied = applyDamage(snakeId, damage, 'snakeCollision', {
                attacker: otherSnakeId,
                isHeadCollision: false,
                collisionIndex: collisionResult.collisionIndex
            });
            
            if (damageApplied) {
                // 被撞的蛇从碰撞点开始截断
                snakes[otherSnakeId] = snakes[otherSnakeId].slice(0, collisionResult.collisionIndex);
                
                // 碰撞特效
                createParticles(head.x + 10, head.y + 10, 20, snakeId === 'snake1' ? '#FF5722' : '#2196F3');
            }
            
        } else {
            // 如果有免疫效果，显示免疫提示，不扣血
            showNotice('免疫!', '#FFFF00', head.x, head.y);
            createParticles(head.x + 10, head.y + 10, 15, '#FFFF00');
        }
    }
    
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
                scores[snakeId] += 50;
                updateScoreDisplay();
                
                // 增加速度（最多15%）
                if (speedBoosts[snakeId] < 0.3) {
                    speedBoosts[snakeId] = Math.min(0.30, speedBoosts[snakeId] + 0.03);
                    showNotice('+50分! 速度+3%', '#4CAF50', head.x, head.y);
                } else {
                    showNotice('+50分! 速度已达上限', '#4CAF50', head.x, head.y);
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
// 添加CSS样式
const bombStyle = document.createElement('style');
bombStyle.textContent = `
    /* 炸弹爆炸效果 */
    .bomb-wave {
        animation: bombWave 1s forwards;
    }
    
    @keyframes bombWave {
        0% { 
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% { 
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
        }
    }
    
    /* 炸弹球颜色提示 */
    .ball-slot.filled[style*="FF4500"] {
        position: relative;
    }
    
    .ball-slot.filled[style*="FF4500"]::before {
        content: "💣";
        font-size: 14px;
    }
`;
document.head.appendChild(bombStyle);
// 应用特殊物品效果
function applySpecialItemEffect(snakeId, itemType) {
    const currentTime = performance.now();
    
    // 检查是否是魔法蛇，如果是则延长效果时间50%
    const isMagicSnake = snakeId === 'snake1' ? snakeTypes.snake1 === 'magic' : snakeTypes.snake2 === 'magic';
    const timeMultiplier = isMagicSnake ? 1.5 : 1; // 魔法蛇效果时间延长50%
    
    switch(itemType) {
        case 'immunity':
            const immunityDuration = 10000 * timeMultiplier;
            if (snakeId === 'snake1') {
                immunity.snake1 = true;
                immunity.timer1 = currentTime + immunityDuration;
                document.getElementById('player1-effect').textContent = '免疫' + (isMagicSnake || magicUpgradeLevel > 0 ? ' (延长)' : '');
                showNotice('完全免疫激活!' + (isMagicSnake || magicUpgradeLevel > 0 ? ' (效果延长)' : ''), '#FFFF00', snakes.snake1[0].x, snakes.snake1[0].y);
            } else {
                immunity.snake2 = true;
                immunity.timer2 = currentTime + immunityDuration;
                document.getElementById('player2-effect').textContent = '免疫' + (isMagicSnake || magicUpgradeLevel > 0 ? ' (延长)' : '');
                showNotice('完全免疫激活!' + (isMagicSnake || magicUpgradeLevel > 0 ? ' (效果延长)' : ''), '#FFFF00', snakes.snake2[0].x, snakes.snake2[0].y);
            }
            break;
            
        case 'health':
            // 加血效果：增加5点生命值
            applyHealing(snakeId, 5, 'special_item');
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
            case 'bomb':
            // 炸弹球：存储起来，而不是立即使用
            if (ballStorage[snakeId].length < 5) {
                ballStorage[snakeId].push({type: 'bomb'});
                updateStorageDisplay();
                showNotice('炸弹球已储存!', '#FF4500', 
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
        if (ball.type === 'bomb') {
            triggerBomb(snakeId);
        }
        else if (ball.type === 'attack') {
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
function triggerBomb(snakeId) {
    const snakeHead = snakes[snakeId][0];
    const otherSnakeId = snakeId === 'snake1' ? 'snake2' : 'snake1';
    
    // 创建爆炸视觉效果
    createBombExplosion(snakeHead.x + 10, snakeHead.y + 10);
    
    // 计算对对方蛇的伤害
    applyBombDamageToSnake(snakeId, otherSnakeId, snakeHead);
    
    // 计算对基地的伤害
    applyBombDamageToHomes(snakeId, snakeHead);
    
    // 显示提示
    showNotice('炸弹爆炸!', '#FF4500', snakeHead.x, snakeHead.y);
}

// 新增函数：创建炸弹爆炸效果
function createBombExplosion(centerX, centerY) {
    // 中心爆炸效果
    createParticles(centerX, centerY, 50, '#FF4500');
    
    // 冲击波效果
    for (let i = 0; i < 5; i++) {
        const wave = document.createElement('div');
        wave.className = 'bomb-wave';
        wave.style.left = `${centerX}px`;
        wave.style.top = `${centerY}px`;
        wave.style.width = '0px';
        wave.style.height = '0px';
        wave.style.borderRadius = '50%';
        wave.style.border = '2px solid rgba(255, 69, 0, 0.8)';
        wave.style.position = 'absolute';
        wave.style.zIndex = '4';
        
        // 动画
        wave.animate([
            { 
                width: '0px', 
                height: '0px',
                opacity: 1,
                transform: 'translate(-50%, -50%)'
            },
            { 
                width: '200px', 
                height: '200px',
                opacity: 0,
                transform: 'translate(-50%, -50%)'
            }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });
        
        gameBoard.appendChild(wave);
        
        // 移除效果元素
        setTimeout(() => wave.remove(), 1000);
    }
}

// 新增函数：对蛇应用炸弹伤害
function applyBombDamageToSnake(snakeId, targetSnakeId, explosionCenter) {
    const targetSnake = snakes[targetSnakeId];
    const hasImmunity = targetSnakeId === 'snake1' ? immunity.snake1 : immunity.snake2;
    const isToughSnake = targetSnakeId === 'snake1' ? snakeTypes.snake1 === 'tough' : snakeTypes.snake2 === 'tough';
    
    let totalDamage = 0;
    let maxSegmentDistance = 0;
    
    // 找到离爆炸中心最近的蛇身段
    for (let i = 0; i < targetSnake.length; i++) {
        const segment = targetSnake[i];
        const distance = calculateDistance(segment, explosionCenter);
        
        if (i === 0 || distance < maxSegmentDistance) {
            maxSegmentDistance = distance;
        }
    }
    
    // 根据最近蛇身段计算基础伤害
    const gridDistance = Math.floor(maxSegmentDistance / 20);
    
    if (gridDistance <= 3) {
        totalDamage = 5;
    } else if (gridDistance <= 6) {
        totalDamage = 2;
    } else if (gridDistance <= 10) {
        totalDamage = 1;
    }
    
    if (totalDamage > 0) {
        // 使用统一的伤害函数
        const damageApplied = applyDamage(targetSnakeId, totalDamage, 'bomb', {
            attacker: snakeId,
            explosionCenter: explosionCenter,
            distance: gridDistance,
            isToughSnake: isToughSnake
        });
        
        if (damageApplied) {
        }
    } else {
        // 在安全距离外
        const targetHead = targetSnake[0];
        showNotice('安全距离', '#00FF00', targetHead.x, targetHead.y);
    }
}
function calculateDistanceToRect(point, rect) {
    // 计算点到矩形四条边的最短距离
    const dx = Math.max(rect.x - point.x, 0, point.x - (rect.x + rect.width));
    const dy = Math.max(rect.y - point.y, 0, point.y - (rect.y + rect.height));
    
    // 如果在矩形内，距离为0
    if (dx === 0 && dy === 0) {
        return 0;
    }
    
    // 计算欧几里得距离
    return Math.sqrt(dx * dx + dy * dy);
}


// 新增函数：对基地应用炸弹伤害
function applyBombDamageToHomes(snakeId, explosionCenter) {
    const otherHomeId = snakeId === 'snake1' ? 'player2' : 'player1';
    const otherHome = homes[otherHomeId];
    
    if (otherHome.destroyed) return;
    
    // 计算爆炸中心到基地边框的最短距离
    const distance = calculateDistanceToRect(explosionCenter, otherHome);
    const gridDistance = Math.floor(distance / 20);
    
    let damage = 0;
    let message = '';
    
    if (gridDistance <= 3) {
        damage = 5;
        message = '炸弹击中! -5HP';
    } else if (gridDistance <= 6) {
        damage = 2;
        message = '炸弹冲击! -2HP';
    } else if (gridDistance <= 10) {
        damage = 1;
        message = '炸弹波及! -1HP';
    }
    
    if (damage > 0) {
        otherHome.health = Math.max(0, otherHome.health - damage);
        
        // 在基地中心显示伤害效果
        const homeCenter = {
            x: otherHome.x + otherHome.width / 2,
            y: otherHome.y + otherHome.height / 2
        };
        
        // 显示伤害效果
        showNotice(message, '#FF4500', homeCenter.x, homeCenter.y);
        createParticles(homeCenter.x, homeCenter.y, damage * 3, '#FF4500');
        
        // 检查基地是否被摧毁
        if (otherHome.health <= 0) {
            otherHome.destroyed = true;
            const playerName = otherHomeId === 'player1' ? 
                (localStorage.getItem('username') || '玩家1') : 
                (localStorage.getItem('player2_username') || '玩家2');
            
            showNotice(`${playerName}的基地被炸毁了!`, '#FF0000', homeCenter.x, homeCenter.y);
            
            // 大爆炸效果
            createParticles(homeCenter.x, homeCenter.y, 50, '#FF4500');
        }
    }
}
function calculateDistance(point1, point2) {
    // 确保point1和point2都有x和y属性
    const x1 = point1.x || point1.left || 0;
    const y1 = point1.y || point1.top || 0;
    const x2 = point2.x || point2.left || 0;
    const y2 = point2.y || point2.top || 0;
    
    return Math.sqrt(
        Math.pow(x1 - x2, 2) + 
        Math.pow(y1 - y2, 2)
    );
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
// 在updateHealthBars函数中调用护盾显示更新
function updateHealthBars() {
    const maxHealth1 = snakeTypes.snake1 === 'tough' ? 13 + (playerUpgrades.snake1?.tough || 0) * 2 : 10;
    const maxHealth2 = snakeTypes.snake2 === 'tough' ? 13 + (playerUpgrades.snake2?.tough || 0) * 2 : 10;
    
    health1El.style.width = `${(health.snake1 / maxHealth1) * 100}%`;
    health2El.style.width = `${(health.snake2 / maxHealth2) * 100}%`;
    document.getElementById('health-text-1').textContent = `${health.snake1}HP`;
    document.getElementById('health-text-2').textContent = `${health.snake2}HP`;
    
    // 更新护盾显示
    updateShieldDisplay('snake1');
    updateShieldDisplay('snake2');
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
function getDeathCause(snakeId) {
    // 如果没有直接记录，尝试分析原因
    if (deathCause[snakeId]) {
        return deathCause[snakeId];
    }
    
    // 分析可能的死亡原因
    const otherSnakeId = snakeId === 'snake1' ? 'snake2' : 'snake1';
    
    // 检查血量
    if (health[snakeId] <= 0) {
        if (health[otherSnakeId] > 0) {
            // 只有自己死了
            return '未知原因死亡';
        } else {
            // 双方都死了
            return '同归于尽';
        }
    }
    
    return '未知原因';
}

// 新增函数：生成详细的死亡分析
function generateDeathAnalysis() {
    const analysis = {
        snake1: {
            cause: deathCause.snake1 || '存活',
            health: health.snake1,
            score: scores.snake1,
            type: snakeTypes.snake1 || '未选择'
        },
        snake2: {
            cause: deathCause.snake2 || '存活',
            health: health.snake2,
            score: scores.snake2,
            type: snakeTypes.snake2 || '未选择'
        }
    };
    
    return analysis;
}
const deathCauseStyle = document.createElement('style');
deathCauseStyle.textContent = `
    /* 死亡原因样式 */
    .death-cause {
        animation: fadeInDeath 1s ease-out;
    }
    
    @keyframes fadeInDeath {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .death-info {
        min-height: 18px;
    }
    
    /* 不同类型的死亡图标 */
    .death-cause[data-type="collision"] i {
        color: #FF5722;
    }
    
    .death-cause[data-type="bullet"] i {
        color: #2196F3;
    }
    
    .death-cause[data-type="bomb"] i {
        color: #FF4500;
    }
    
    .death-cause[data-type="wall"] i {
        color: #555;
    }
    
    .death-cause[data-type="home"] i {
        color: #4CAF50;
    }
`;
document.head.appendChild(deathCauseStyle);
// 修改showGameStats函数，显示更详细的统计
function showGameStats() {
    const modal = document.getElementById('game-stats-modal');
    const content = document.getElementById('game-stats-content');
    
    // 计算游戏总时间
    let totalTime;
    if (gameStats.endTime) {
        totalTime = Math.floor((gameStats.endTime - gameStats.startTime) / 1000);
    } else {
        totalTime = Math.floor((performance.now() - gameStats.startTime) / 1000);
    }
    
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const timeString = `${minutes}分${seconds}秒`;
    
    // 计算防御效率
    const calculateDefenseEfficiency = (snakeId) => {
        const stats = gameStats[snakeId];
        const totalOriginal = stats.totalOriginalDamageReceived || 0;
        const totalActual = stats.totalDamageReceived || 0;
        
        if (totalOriginal === 0) return 0;
        return Math.round(((totalOriginal - totalActual) / totalOriginal) * 100);
    };
    
    // 生成统计数据HTML
    content.innerHTML = `
        <div class="game-time-display">
            <i class="fas fa-clock"></i> 游戏时长: <strong>${timeString}</strong>
        </div>
        
        <div class="stats-grid">
            <!-- 玩家1统计 -->
            <div class="player-stats-box player1">
                <div class="stats-header">
                    <h3 style="color: #FF5722;">
                        <i class="fas fa-fire"></i> ${localStorage.getItem("username") || "玩家1"}
                    </h3>
                    <div style="font-size: 12px; color: #aaa;">
                        ${snakeTypes.snake1 === 'speed' ? '⚡ 速度蛇' : 
                          snakeTypes.snake1 === 'tough' ? '🛡️ 坚硬蛇' : 
                          snakeTypes.snake1 === 'magic' ? '✨ 魔法蛇' : '未选择'}
                    </div>
                </div>
                
                <!-- 输出伤害统计 -->
    <div class="stats-section">
        <div class="section-title">
            <i class="fas fa-crosshairs" style="color: #4CAF50;"></i>
            <span>输出伤害统计</span>
        </div>
    <div class="stats-section">

            <div class="stats-items">
                ${gameStats.snake1.totalDamageDealt > 0 ? `
                    <div class="stat-item">
                        <span>总输出伤害:</span>
                        <span style="color: #4CAF50;">${gameStats.snake1.totalDamageDealt.toFixed(1)}</span>
                    </div>
                ` : ''}
                
                ${gameStats.snake1.damageDealt.snakeCollision > 0 ? `
                    <div class="stat-item">
                        <span>蛇相撞伤害:</span>
                        <span style="color: #4CAF50;">${gameStats.snake1.damageDealt.snakeCollision.toFixed(1)}</span>
                    </div>
                ` : ''}
                
                ${gameStats.snake1.damageDealt.bullet > 0 ? `
                    <div class="stat-item">
                        <span>子弹伤害:</span>
                        <span style="color: #4CAF50;">${gameStats.snake1.damageDealt.bullet.toFixed(1)}</span>
                    </div>
                ` : ''}
                
                ${gameStats.snake1.damageDealt.bomb > 0 ? `
                    <div class="stat-item">
                        <span>炸弹伤害:</span>
                        <span style="color: #4CAF50;">${gameStats.snake1.damageDealt.bomb.toFixed(1)}</span>
                    </div>
                ` : ''}
                
                ${(gameStats.snake1.damageDealt.base || 0) > 0 ? `
                    <div class="stat-item">
                        <span>基地子弹伤害:</span>
                        <span style="color: #4CAF50;">${(gameStats.snake1.damageDealt.base || 0).toFixed(1)}</span>
                    </div>
                ` : ''}
                
                ${gameStats.snake1.totalDamageDealt <= 0 ? `
                    <div class="stat-item">无输出伤害记录</div>
                ` : ''}
            </div>
        </div>
        </div>
                
                <!-- 防御统计 -->
                <div class="stats-section">
                    <div class="section-title">
                        <i class="fas fa-shield-alt" style="color: #00BCD4;"></i>
                        <span>防御统计</span>
                    </div>
                    <div class="stats-items">
                        ${gameStats.snake1.shieldDamageAbsorbed > 0 ? `
                        <div class="stat-item">
                            <span>护盾吸收:</span>
                            <span style="color: #00BCD4;">${gameStats.snake1.shieldDamageAbsorbed.toFixed(1)}</span>
                        </div>
                        <div class="stat-item">
                            <span>护盾格挡:</span>
                            <span style="color: #00BCD4;">${gameStats.snake1.shieldBlocks || 0}</span>
                        </div>
                        ` : ''}
                        
                        ${gameStats.snake1.immuneBlocks > 0 ? `
                        <div class="stat-item">
                            <span>免疫格挡:</span>
                            <span style="color: #FFFF00;">${gameStats.snake1.immuneBlocks}</span>
                        </div>
                        <div class="stat-item">
                            <span>免疫免伤:</span>
                            <span style="color: #FFFF00;">${getTotalImmuneDamage('snake1').toFixed(1)}</span>
                        </div>
                        ` : ''}
                        
                        ${gameStats.snake1.toughImmuneBlocks > 0 ? `
                        <div class="stat-item">
                            <span>坚硬免疫:</span>
                            <span style="color: #C0C0C0;">${gameStats.snake1.toughImmuneBlocks}</span>
                        </div>
                        ` : ''}
                        
                        ${getTotalToughReducedDamage('snake1') > 0 ? `
                        <div class="stat-item">
                            <span>坚硬减伤:</span>
                            <span style="color: #C0C0C0;">${getTotalToughReducedDamage('snake1').toFixed(1)}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- 承受伤害详情 -->
                <div class="stats-section">
                    <div class="section-title">
                        <i class="fas fa-heartbeat" style="color: #ff6b6b;"></i>
                        <span>承受伤害详情</span>
                    </div>
                    <div class="stats-items">
                        ${generateDamageDetailStats('snake1')}
                    </div>
                </div>
                
                <!-- 移动统计 -->
                <div class="stats-section">
                    <div class="section-title">
                        <i class="fas fa-road" style="color: #00BCD4;"></i>
                        <span>移动统计</span>
                    </div>
                    <div style="text-align: center; padding: 10px; background: rgba(0, 188, 212, 0.2); border-radius: 8px;">
                        <div style="font-size: 24px; color: #00BCD4; font-weight: bold;">
                            ${gameStats.snake1.distanceTraveled}
                        </div>
                        <div style="font-size: 14px; color: white;">格 (20px/格)</div>
                    </div>
                </div>
            </div>
            <!-- 玩家2统计 -->
            <div class="player-stats-box player2">
                <div class="stats-header">
                    <h3 style="color: #2196F3;">
                        <i class="fas fa-tint"></i> ${localStorage.getItem("player2_username") || "玩家2"}
                    </h3>
                    <div style="font-size: 12px; color: #aaa;">
                        ${snakeTypes.snake2 === 'speed' ? '⚡ 速度蛇' : 
                          snakeTypes.snake2 === 'tough' ? '🛡️ 坚硬蛇' : 
                          snakeTypes.snake2 === 'magic' ? '✨ 魔法蛇' : '未选择'}

                    </div>
                </div>
                
                <!-- 输出伤害统计 -->
                <div class="stats-section">
    <div class="stats-section">
        <div class="section-title">
            <i class="fas fa-crosshairs" style="color: #4CAF50;"></i>
            <span>输出伤害统计</span>
        </div>
        <div class="stats-items">
            ${gameStats.snake2.totalDamageDealt > 0 ? `
                <div class="stat-item">
                    <span>总输出伤害:</span>
                    <span style="color: #4CAF50;">${gameStats.snake2.totalDamageDealt.toFixed(1)}</span>
                </div>
            ` : ''}
            
            ${gameStats.snake2.damageDealt.snakeCollision > 0 ? `
                <div class="stat-item">
                    <span>蛇相撞伤害:</span>
                    <span style="color: #4CAF50;">${gameStats.snake2.damageDealt.snakeCollision.toFixed(1)}</span>
                </div>
            ` : ''}
            
            ${gameStats.snake2.damageDealt.bullet > 0 ? `
                <div class="stat-item">
                    <span>子弹伤害:</span>
                    <span style="color: #4CAF50;">${gameStats.snake2.damageDealt.bullet.toFixed(1)}</span>
                </div>
            ` : ''}
            
            ${gameStats.snake2.damageDealt.bomb > 0 ? `
                <div class="stat-item">
                    <span>炸弹伤害:</span>
                    <span style="color: #4CAF50;">${gameStats.snake2.damageDealt.bomb.toFixed(1)}</span>
                </div>
            ` : ''}
            
            ${(gameStats.snake2.damageDealt.base || 0) > 0 ? `
                <div class="stat-item">
                    <span>基地子弹伤害:</span>
                    <span style="color: #4CAF50;">${(gameStats.snake2.damageDealt.base || 0).toFixed(1)}</span>
                </div>
            ` : ''}
            
            ${gameStats.snake2.totalDamageDealt <= 0 ? `
                <div class="stat-item">无输出伤害记录</div>
            ` : ''}
        </div>
    </div>
                </div>
                
                <!-- 防御统计 -->
                <div class="stats-section">
                    <div class="section-title">
                        <i class="fas fa-shield-alt" style="color: #00BCD4;"></i>
                        <span>防御统计</span>
                    </div>
                    <div class="stats-items">
                        ${gameStats.snake2.shieldDamageAbsorbed > 0 ? `
                        <div class="stat-item">
                            <span>护盾吸收:</span>
                            <span style="color: #00BCD4;">${gameStats.snake2.shieldDamageAbsorbed.toFixed(1)}</span>
                        </div>
                        <div class="stat-item">
                            <span>护盾格挡:</span>
                            <span style="color: #00BCD4;">${gameStats.snake2.shieldBlocks || 0}</span>
                        </div>
                        ` : ''}
                        
                        ${gameStats.snake2.immuneBlocks > 0 ? `
                        <div class="stat-item">
                            <span>免疫格挡:</span>
                            <span style="color: #FFFF00;">${gameStats.snake2.immuneBlocks}</span>
                        </div>
                        <div class="stat-item">
                            <span>免疫免伤:</span>
                            <span style="color: #FFFF00;">${getTotalImmuneDamage('snake2').toFixed(1)}</span>
                        </div>
                        ` : ''}
                        
                        ${gameStats.snake2.toughImmuneBlocks > 0 ? `
                        <div class="stat-item">
                            <span>坚硬免疫:</span>
                            <span style="color: #C0C0C0;">${gameStats.snake2.toughImmuneBlocks}</span>
                        </div>
                        ` : ''}
                        
                        ${getTotalToughReducedDamage('snake2') > 0 ? `
                        <div class="stat-item">
                            <span>坚硬减伤:</span>
                            <span style="color: #C0C0C0;">${getTotalToughReducedDamage('snake2').toFixed(1)}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <!-- 承受伤害详情 -->
                <div class="stats-section">
                    <div class="section-title">
                        <i class="fas fa-heartbeat" style="color: #ff6b6b;"></i>
                        <span>承受伤害详情</span>
                    </div>
                    <div class="stats-items">
                        ${generateDamageDetailStats('snake2')}
                    </div>
                </div>
                
                <!-- 移动统计 -->
                <div class="stats-section">
                    <div class="section-title">
                        <i class="fas fa-road" style="color: #00BCD4;"></i>
                        <span>移动统计</span>
                    </div>
                    <div style="text-align: center; padding: 10px; background: rgba(0, 188, 212, 0.2); border-radius: 8px;">
                        <div style="font-size: 24px; color: #00BCD4; font-weight: bold;">
                            ${gameStats.snake2.distanceTraveled}
                        </div>
                        <div style="font-size: 14px; color: white;">格 (20px/格)</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 10px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; font-size: 12px; color: #aaa;">
            <i class="fas fa-info-circle"></i> 注：原始伤害包括所有受到的攻击伤害，实际伤害为扣除防御后的实际血量减少
        </div>
    `;

    
    modal.style.display = 'block';
}
function generateDefenseStats(snakeId) {
    const stats = gameStats[snakeId];
    let html = '';
    
    if (stats.shieldDamageAbsorbed > 0) {
        html += `
            <div class="stat-item">
                <span>护盾吸收:</span>
                <span style="color: #00BCD4;">${stats.shieldDamageAbsorbed.toFixed(1)}</span>
            </div>
            <div class="stat-item">
                <span>护盾格挡:</span>
                <span style="color: #00BCD4;">${stats.shieldBlocks || 0}</span>
            </div>
        `;
    }
    
    if (stats.immuneBlocks > 0) {
        html += `
            <div class="stat-item">
                <span>免疫格挡:</span>
                <span style="color: #FFFF00;">${stats.immuneBlocks}</span>
            </div>
        `;
    }
    
    if (stats.toughImmuneBlocks > 0) {
        html += `
            <div class="stat-item">
                <span>坚硬免疫:</span>
                <span style="color: #C0C0C0;">${stats.toughImmuneBlocks}</span>
            </div>
        `;
    }
    
    const toughReduced = getTotalToughReducedDamage(snakeId);
    if (toughReduced > 0) {
        html += `
            <div class="stat-item">
                <span>坚硬减伤:</span>
                <span style="color: #C0C0C0;">${toughReduced.toFixed(1)}</span>
            </div>
        `;
    }
    
    return html || '<div class="stat-item">无防御记录</div>';
}
// 辅助函数：计算总免疫伤害
function getTotalImmuneDamage(snakeId) {
    const stats = gameStats[snakeId];
    if (!stats.immuneDamagePrevented) return 0;
    
    let total = 0;
    for (const source in stats.immuneDamagePrevented) {
        total += stats.immuneDamagePrevented[source];
    }
    return total;
}

// 辅助函数：计算总坚硬减伤
function getTotalToughReducedDamage(snakeId) {
    const stats = gameStats[snakeId];
    if (!stats.toughReducedDamage) return 0;
    
    let total = 0;
    for (const source in stats.toughReducedDamage) {
        total += stats.toughReducedDamage[source];
    }
    return total;
}

// 辅助函数：生成伤害详情统计
function generateDamageDetailStats(snakeId) {
    const stats = gameStats[snakeId];
    const damageTypes = ['wall', 'snakeCollision', 'bullet', 'base', 'lava', 'home', 'bomb'];
    const typeNames = {
        'wall': '撞墙',
        'snakeCollision': '蛇相撞',
        'bullet': '子弹',
        'base': '基地防御',
        'lava': '岩浆',
        'home': '敌方基地',
        'bomb': '炸弹'
    };
    
    let html = '';
    
    damageTypes.forEach(type => {
        const original = stats.originalDamageReceived?.[type] || 0;
        const actual = stats.damageReceived?.[type] || 0;
        
        if (original > 0) {
            const reduction = original - actual;
            const reductionPercent = original > 0 ? Math.round((reduction / original) * 100) : 0;
            
            html += `
                <div class="stat-item">
                    <span>${typeNames[type]}:</span>
                    <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <div style="font-size: 11px; color: #aaa;">
                            原始: ${original.toFixed(1)}
                        </div>
                        <div style="font-size: 12px; color: #ff6b6b;">
                            实际: ${actual.toFixed(1)}
                        </div>
                        ${reduction > 0 ? `
                        <div style="font-size: 10px; color: #4CAF50;">
                            减免: ${reduction.toFixed(1)} (${reductionPercent}%)
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    });
    
    return html || '<div class="stat-item">无伤害记录</div>';
}
function gameOver() {
    gameOverScreen.style.display = '';
    gameStarted = false;
    let hasUploaded = false;
        // 1. 清除所有子弹
    if (attackMode.intervalId1) {
        clearInterval(attackMode.intervalId1);
        attackMode.intervalId1 = null;
    }
    if (attackMode.intervalId2) {
        clearInterval(attackMode.intervalId2);
        attackMode.intervalId2 = null;
    }
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
    // 清除子弹数组和DOM元素
    bullets = [];
    document.querySelectorAll('.bullet').forEach(bullet => bullet.remove());
    
    // 重置攻击模式状态
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
    homes.player1.destroyed = false;
    homes.player1.health = homes.player1.maxHealth;
    homes.player2.destroyed = false;
    homes.player2.health = homes.player2.maxHealth;
    document.querySelectorAll('.bullet').forEach(bullet => bullet.remove());
    document.getElementById("back").style.display = "block";
    viewRecords.style.display = 'block';
    gameOverScreen.classList.remove('show');
        if (health.snake1 <= 0) {
        deathCause.snake1 = getDeathCause('snake1');
    }
    if (health.snake2 <= 0) {
        deathCause.snake2 = getDeathCause('snake2');
    }
    document.getElementById("back").onclick = function(){ 
        if(!gameStarted){     
            gameOverScreen.classList.remove('show');
            characterSelection.classList.add('show');
            gameStarted = true;
        } else {
            document.getElementById("back").onclick=goBackOrHome();
        }
    }
document.getElementById("store-player1").style.display="none";
document.getElementById("store-player2").style.display="none";
    let winner = null;
    let loser = null;
    let currentWin1 = 0;
    let currentWin2 = 0;
    
    if (health.snake1 <= 0 && health.snake2 <= 0) {
        winner = 'draw';
    } else if (health.snake1 <= 0) {
        winner = 'snake2';
        loser = 'snake1';
        currentWin2 = 1;
    } else {
        winner = 'snake1';
        loser = 'snake2';
        currentWin1 = 1;
    }

    // 获取服务器数据并显示
    getServerRecords().then(serverData => {
        // 只显示历史战绩，不包含本次结果
        let player1Wins = serverData?.player1Wins || 0;
        let player2Wins = serverData?.player2Wins || 0;
        const deathAnalysis = generateDeathAnalysis();
        const loserName = loser === 'snake1' ? 
        localStorage.getItem('username') || '玩家1' : 
        localStorage.getItem('player2_username') || '玩家2';
        const loserCause = deathAnalysis[loser]?.cause || '未知原因';
        
        const currentTime = performance.now();
        const totalTime = Math.floor((currentTime - gameStats.startTime) / 1000);
        gameStats.endTime = performance.now();
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        const timeString = `${minutes}分${seconds}秒`;
        
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
            
            <!-- 失败者死亡原因 -->
            ${loser ? `
                <div class="death-cause" style="
                    margin: 15px auto;
                    padding: 10px;
                    background: ${loser === 'snake1' ? 'rgba(255, 87, 34, 0.2)' : 'rgba(33, 150, 243, 0.2)'};
                    border-radius: 10px;
                    max-width: 400px;
                    text-align: center;
                    border: 1px solid ${loser === 'snake1' ? '#FF5722' : '#2196F3'};
                ">
                    <div style="font-size: 14px; color: #ccc; margin-bottom: 5px;">
                        <i class="fas fa-skull-crossbones"></i> 原因
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: white;">
                        ${loserName}${loserCause}
                    </div>
                    <div style="font-size: 12px; color: #aaa; margin-top: 5px;">
                        血量: ${deathAnalysis[loser].health} | 分数: ${deathAnalysis[loser].score}
                    </div>
                </div>
            ` : ''}
            
            <!-- 详细统计 -->
            <div class="stats-container">
                <div class="player-stats player-1-stats">
                    <div class="player-avatar">
                        <i class="fas fa-user" style="color: #FF5722;"></i>
                    </div>
                    <div class="player-name">${localStorage.getItem("username") || "玩家1"}</div>
                    <div class="player-type" style="font-size: 12px; color: #FFA500; margin: 5px 0;">
                        ${snakeTypes.snake1 === 'speed' ? '⚡ 速度蛇' : 
                          snakeTypes.snake1 === 'tough' ? '🛡️ 坚硬蛇' : 
                          snakeTypes.snake1 === 'magic' ? '✨ 魔法蛇' : '未选择'}
                    </div>
                    <div class="win-count">
                        <span class="history-wins">${player1Wins}</span>
                        ${currentWin1 > 0 ? `<span class="current-win">+${currentWin1}</span>` : ''}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${calculateWinPercentage(player1Wins, player2Wins)}%; background: linear-gradient(to right, #FF5722, #FF9800);"></div>
                    </div>
                    <div class="death-info" style="font-size: 12px; color: #ff6b6b; margin-top: 5px;">
                        ${deathCause.snake1 ? `💀 ${deathCause.snake1}` : health.snake1 > 0 ? '👍 存活' : ''}
                    </div>
                </div>
                
                <div class="vs-text">VS</div>
                
                <div class="player-stats player-2-stats">
                    <div class="player-avatar">
                        <i class="fas fa-user" style="color: #2196F3;"></i>
                    </div>
                    <div class="player-name">${localStorage.getItem("player2_username") || "玩家2"}</div>
                    <div class="player-type" style="font-size: 12px; color: #00BCD4; margin: 5px 0;">
                        ${snakeTypes.snake2 === 'speed' ? '⚡ 速度蛇' : 
                          snakeTypes.snake2 === 'tough' ? '🛡️ 坚硬蛇' : 
                          snakeTypes.snake2 === 'magic' ? '✨ 魔法蛇' : '未选择'}
                    </div>
                    <div class="win-count">
                        <span class="history-wins">${player2Wins}</span>
                        ${currentWin2 > 0 ? `<span class="current-win">+${currentWin2}</span>` : ''}
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${calculateWinPercentage(player2Wins, player1Wins)}%; background: linear-gradient(to right, #2196F3, #00BCD4);"></div>
                    </div>
                    <div class="death-info" style="font-size: 12px; color: #ff6b6b; margin-top: 5px;">
                        ${deathCause.snake2 ? `💀 ${deathCause.snake2}` : health.snake2 > 0 ? '👍 存活' : ''}
                    </div>
                </div>
            </div>
            
            <div class="buttons-container">
                <button class="restart-btn" id="show-game-stats">
                    <i class="fas fa-chart-bar"></i> 显示本局数据
                </button>
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
        // 修改关闭模态框的事件处理
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal') || 'records-modal';
                document.getElementById(modalId).style.display = 'none';
            });
        });

        // 点击外部关闭所有模态框
        window.addEventListener('click', function(event) {
            const modals = ['records-modal', 'game-stats-modal'];
            modals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        document.getElementById('show-game-stats').addEventListener('click', showGameStats);
        resetDeathCauses();
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
let isTabKeyPressed = false;
// 键盘控制
document.addEventListener('keydown', (e) => {
    // 修改手动暂停/恢复的逻辑
if (e.key === 'q' || e.key === 'Q') {
    // 如果商店打开，不允许手动暂停/恢复
    if (storeOpen.snake1) {
        e.preventDefault();
        return;
    }
    
    // 切换暂停状态
    pausedSnakes.snake1 = !pausedSnakes.snake1;
    
    // 显示状态提示
    const head = snakes.snake1[0];
    showNotice(pausedSnakes.snake1 ? '玩家1已暂停' : '玩家1已恢复', 
              '#FF5722', head.x, head.y);
    
    // 添加音效或特效（可选）
    if (pausedSnakes.snake1) {
        // 暂停特效
        createParticles(head.x + 10, head.y + 10, 10, '#FF5722');
    } else {
        // 恢复特效
        createParticles(head.x + 10, head.y + 10, 10, '#4CAF50');
    }
    
    e.preventDefault();
    return;
}

if (e.key === '/' || e.key === '?') {
    // 如果商店打开，不允许手动暂停/恢复
    if (storeOpen.snake2) {
        e.preventDefault();
        return;
    }
    
    // 切换暂停状态
    pausedSnakes.snake2 = !pausedSnakes.snake2;
    
    // 显示状态提示
    const head = snakes.snake2[0];
    showNotice(pausedSnakes.snake2 ? '玩家2已暂停' : '玩家2已恢复', 
              '#2196F3', head.x, head.y);
    
    // 添加音效或特效（可选）
    if (pausedSnakes.snake2) {
        // 暂停特效
        createParticles(head.x + 10, head.y + 10, 10, '#2196F3');
    } else {
        // 恢复特效
        createParticles(head.x + 10, head.y + 10, 10, '#4CAF50');
    }
    
    e.preventDefault();
    return;
}
    // 防止默认行为
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
    }
    
    // === 商店控制逻辑 ===
    // 玩家1商店：E键打开/关闭
    if (e.key === 'e' || e.key === 'E') {
        openStore('snake1');
        e.preventDefault();
        return;
    }
    
    // 玩家2商店：.或>键打开/关闭
    if (e.key === '+' || e.key === '+') {
        openStore('snake2');
        e.preventDefault();
        return;
    }
    
    // === 商店内控制（修改这里）===
    // 玩家1商店内控制 - 只阻止玩家1的控制键
    if (storeOpen.snake1) {
        // W/S选择
        if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
            if (e.key === 'w' || e.key === 'W') {
                storeSelectedItem.snake1 = Math.max(0, storeSelectedItem.snake1 - 1);
            } else {
                storeSelectedItem.snake1 = Math.min(storeItems.length - 1, storeSelectedItem.snake1 + 1);
            }
            updateStoreDisplay('snake1');
            e.preventDefault();
            return;
        }
        
        // R键购买并关闭
        if (e.key === 'r' || e.key === 'R') {
            const selectedItem = storeItems[storeSelectedItem.snake1];
            const upgradeLevel = playerUpgrades.snake1[selectedItem.id.split('_')[0]] || 0;
            const isMaxLevel = selectedItem.type === 'upgrade' && selectedItem.maxLevel && upgradeLevel >= selectedItem.maxLevel;
            const canAfford = scores.snake1 >= selectedItem.price && !isMaxLevel;
            
            if (canAfford) {
                buyStoreItem('snake1');
                setTimeout(() => closeStore('snake1'), 300);
            } else {
                const head = snakes.snake1[0];
                if (isMaxLevel) {
                    showNotice('已经达到最大等级!', '#FF0000', head.x, head.y);
                } else {
                    showNotice('分数不足!', '#FF0000', head.x, head.y);
                }
            }
            e.preventDefault();
            return;
        }
        
        // E键关闭商店
        if (e.key === 'e' || e.key === 'E') {
            closeStore('snake1');
            e.preventDefault();
            return;
        }
    }
    
    // 玩家2商店内控制 - 只阻止玩家2的控制键
    if (storeOpen.snake2) {
        // 上下方向键选择
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (e.key === 'ArrowUp') {
                storeSelectedItem.snake2 = Math.max(0, storeSelectedItem.snake2 - 1);
            } else {
                storeSelectedItem.snake2 = Math.min(storeItems.length - 1, storeSelectedItem.snake2 + 1);
            }
            updateStoreDisplay('snake2');
            e.preventDefault();
            return;
        }
        
        // Enter键购买并关闭
        if (e.key === 'Enter') {
            const selectedItem = storeItems[storeSelectedItem.snake2];
            const upgradeLevel = playerUpgrades.snake2[selectedItem.id.split('_')[0]] || 0;
            const isMaxLevel = selectedItem.type === 'upgrade' && selectedItem.maxLevel && upgradeLevel >= selectedItem.maxLevel;
            const canAfford = scores.snake2 >= selectedItem.price && !isMaxLevel;
            
            if (canAfford) {
                buyStoreItem('snake2');
                setTimeout(() => closeStore('snake2'), 300);
            } else {
                const head = snakes.snake2[0];
                if (isMaxLevel) {
                    showNotice('已经达到最大等级!', '#FF0000', head.x, head.y);
                } else {
                    showNotice('分数不足!', '#FF0000', head.x, head.y);
                }
            }
            e.preventDefault();
            return;
        }
        
        // .或>键关闭商店
        if (e.key === '+' || e.key === '+') {
            closeStore('snake2');
            e.preventDefault();
            return;
        }
    }
        if (e.key >= '1' && e.key <= '5') {
        const slotIndex = parseInt(e.key) - 1;
        releaseBall('snake1', slotIndex);
        e.preventDefault();
        return;
    }
    
    // 玩家2释放球体 (按键6-0)
    if ((e.key >= '6' && e.key <= '9') || e.key === '0') {
        const slotIndex = e.key === '0' ? 4 : parseInt(e.key) - 6;
        releaseBall('snake2', slotIndex);
        e.preventDefault();
        return;
    }
    // === 原有游戏控制逻辑 ===
    // 注意：这里不再阻止所有按键，只阻止特定商店控制键
    
    // 检查蛇是否暂停
    if (pausedSnakes.snake1 && isPlayer1ControlKey(e.key)) {
        // 如果蛇1暂停，只阻止玩家1的控制键
        if (isPlayer1ControlKey(e.key)) {
            e.preventDefault();
            return;
        }
    }
    
    if (pausedSnakes.snake2 && isPlayer2ControlKey(e.key)) {
        // 如果蛇2暂停，只阻止玩家2的控制键
        if (isPlayer2ControlKey(e.key)) {
            e.preventDefault();
            return;
        }
    }
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
    if (e.key === 'q' || e.key === 'Q') {
        pausedSnakes.snake1 = !pausedSnakes.snake1;
        showNotice(pausedSnakes.snake1 ? '玩家1已暂停' : '玩家1已恢复', 
                  '#FF5722', snakes.snake1[0].x, snakes.snake1[0].y);
        return;
    }
    
    if (e.key === '/' || e.key === '?') {
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
                // 检查俯冲
                if (checkDoubleTap('snake1', e.key.toLowerCase())) {
                    // 俯冲时立即设置方向
                    nextDirections.snake1 = 'down';
                } else if (directions.snake1 !== 'up') {
                    nextDirections.snake1 = 'down';
                }
                break;
            case 's':
            case 'S':
                if (checkDoubleTap('snake1', e.key.toLowerCase())) {
                    nextDirections.snake1 = 'up';
                } else if (directions.snake1 !== 'down') {
                    nextDirections.snake1 = 'up';
                }
                break;
            case 'a':
            case 'A':
                if (checkDoubleTap('snake1', e.key.toLowerCase())) {
                    nextDirections.snake1 = 'right';
                } else if (directions.snake1 !== 'right') {
                    nextDirections.snake1 = 'right';
                }
                break;
            case 'd':
            case 'D':
                if (checkDoubleTap('snake1', e.key.toLowerCase())) {
                    nextDirections.snake1 = 'left';
                } else if (directions.snake1 !== 'left') {
                    nextDirections.snake1 = 'left';
                }
                break;
        }
    } else {
        // 正常控制
        switch (e.key) {
            case 'w':
            case 'W':
                if (checkDoubleTap('snake1', e.key.toLowerCase())) {
                    nextDirections.snake1 = 'up';
                } else if (directions.snake1 !== 'down') {
                    nextDirections.snake1 = 'up';
                }
                break;
            case 's':
            case 'S':
                if (checkDoubleTap('snake1', e.key.toLowerCase())) {
                    nextDirections.snake1 = 'down';
                } else if (directions.snake1 !== 'up') {
                    nextDirections.snake1 = 'down';
                }
                break;
            case 'a':
            case 'A':
                if (checkDoubleTap('snake1', e.key.toLowerCase())) {
                    nextDirections.snake1 = 'left';
                } else if (directions.snake1 !== 'right') {
                    nextDirections.snake1 = 'left';
                }
                break;
            case 'd':
            case 'D':
                if (checkDoubleTap('snake1', e.key.toLowerCase())) {
                    nextDirections.snake1 = 'right';
                } else if (directions.snake1 !== 'left') {
                    nextDirections.snake1 = 'right';
                }
                break;
        }
    }
    
    // 处理玩家2控制 (方向键)
    if (reversedControls.snake2) {
        // 反向控制
        switch (e.key) {
            case 'ArrowUp':
                if (checkDoubleTap('snake2', e.key)) {
                    nextDirections.snake2 = 'down';
                } else if (directions.snake2 !== 'up') {
                    nextDirections.snake2 = 'down';
                }
                break;
            case 'ArrowDown':
                if (checkDoubleTap('snake2', e.key)) {
                    nextDirections.snake2 = 'up';
                } else if (directions.snake2 !== 'down') {
                    nextDirections.snake2 = 'up';
                }
                break;
            case 'ArrowLeft':
                if (checkDoubleTap('snake2', e.key)) {
                    nextDirections.snake2 = 'right';
                } else if (directions.snake2 !== 'right') {
                    nextDirections.snake2 = 'right';
                }
                break;
            case 'ArrowRight':
                if (checkDoubleTap('snake2', e.key)) {
                    nextDirections.snake2 = 'left';
                } else if (directions.snake2 !== 'left') {
                    nextDirections.snake2 = 'left';
                }
                break;
        }
    } else {
        // 正常控制
        switch (e.key) {
            case 'ArrowUp':
                if (checkDoubleTap('snake2', e.key)) {
                    nextDirections.snake2 = 'up';
                } else if (directions.snake2 !== 'down') {
                    nextDirections.snake2 = 'up';
                }
                break;
            case 'ArrowDown':
                if (checkDoubleTap('snake2', e.key)) {
                    nextDirections.snake2 = 'down';
                } else if (directions.snake2 !== 'up') {
                    nextDirections.snake2 = 'down';
                }
                break;
            case 'ArrowLeft':
                if (checkDoubleTap('snake2', e.key)) {
                    nextDirections.snake2 = 'left';
                } else if (directions.snake2 !== 'right') {
                    nextDirections.snake2 = 'left';
                }
                break;
            case 'ArrowRight':
                if (checkDoubleTap('snake2', e.key)) {
                    nextDirections.snake2 = 'right';
                } else if (directions.snake2 !== 'left') {
                    nextDirections.snake2 = 'right';
                }
                break;
        }
    }
});
function isPlayer1ControlKey(key) {
    const player1Keys = ['w', 'W', 's', 'S', 'a', 'A', 'd', 'D', 'q', 'Q'];
    const player1Numbers = ['1', '2', '3', '4', '5'];
    return player1Keys.includes(key) || player1Numbers.includes(key);
}

function isPlayer2ControlKey(key) {
    const player2Keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const player2Numbers = ['6', '7', '8', '9', '0'];
    const player2Special = ['/', '?'];
    return player2Keys.includes(key) || player2Numbers.includes(key) || player2Special.includes(key);
}
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
});});

        // 添加玩家2登录功能
function loginPlayer2() {
    document.querySelector('.map-selection .start-game-btn').style.display = 'none';
    
    // 第一步：询问用户名
    Swal.fire({
        title: "玩家2登录",
        text: "请输入用户名",
        input: "text",
        inputPlaceholder: "请输入用户名",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonText: "下一步",
        showLoaderOnConfirm: true,
        preConfirm: (username) => {
            if (!username) {
                Swal.showValidationMessage("请输入用户名");
                return false;
            }
            
            // 检查是否与玩家1用户名相同
            const player1Username = localStorage.getItem('username');
            if (player1Username && username === player1Username) {
                Swal.showValidationMessage("用户名不能与玩家1相同");
                return false;
            }
            
            return username;
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            const username = result.value;
            
            // 第二步：询问密码
            Swal.fire({
                title: "玩家2登录",
                text: "请输入密码",
                input: "password",
                inputPlaceholder: "请输入密码",
                showCancelButton: true,
                cancelButtonText: "上一步",
                confirmButtonText: "登录",
                showLoaderOnConfirm: true,
                preConfirm: (password) => {
                    if (!password) {
                        Swal.showValidationMessage("请输入密码");
                        return false;
                    }
                    
                    // 发送登录请求
                    return fetch(`${serverurl}/login`, {
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
                            return { username, password };
                        } else if (data.includes('登录失败')) {
                            throw new Error('用户名或密码错误');
                        } else {
                            throw new Error('登录失败，请重试');
                        }
                    })
                    .catch(error => {
                        Swal.showValidationMessage(error.message);
                    });
                },
                allowOutsideClick: () => !Swal.isLoading()
            }).then((result) => {
                if (result.isConfirmed) {
                    const username = result.value.username;
                    
                    // 获取用户ID
                    fetch(`${serverurl}/get-user-id-by-username`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username: username })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            const userId = data.data.userId;
                            localStorage.setItem('player2_username', username);
                            localStorage.setItem('player2_userid', userId);
                            
                            // 更新界面
                            document.getElementById('player2-name').textContent = username + ': ';
                            document.getElementById('player-label1').textContent = localStorage.getItem('username') + '(橙色)';
                            document.getElementById('player-label2').textContent = localStorage.getItem('player2_username') + '(蓝色)';
                            document.getElementById('storage-title1').textContent = localStorage.getItem('username') + '储存:';
                            document.getElementById('storage-title2').textContent = localStorage.getItem('player2_username') + '储存:';
                            document.querySelector('.map-selection .start-game-btn').style.display = 'block';
                            
                            Swal.fire('登录成功', '玩家2已登录', 'success');
                        } else {
                            console.log(data.message);
                            Swal.fire('错误', '获取用户信息失败', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        Swal.fire('错误', '获取用户信息时发生错误', 'error');
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // 点击上一步，返回用户名输入
                    loginPlayer2();
                }
            });
        }
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
            opponentAvatar: `${serverurl}/get-icon-by-id?username=${encodeURIComponent(opponentName)}`
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
// 修改后的打开商店函数
function openStore(snakeId) {
    if (gameOverScreen.classList.contains('show')) return;
    
    const storeId = snakeId === 'snake1' ? 'store-player1' : 'store-player2';
    const storeElement = document.getElementById(storeId);
    
    if (storeOpen[snakeId]) {
        closeStore(snakeId);
        return;
    }
    
    // 记录商店打开前的暂停状态
    const wasPausedBeforeStore = pausedSnakes[snakeId];
    
    // 暂停蛇的移动（如果还没暂停）
    pausedSnakes[snakeId] = true;
    
    // 将状态存储在数据属性中
    storeElement.dataset.wasPaused = wasPausedBeforeStore;
    
    // 更新商店信息
    updateStoreDisplay(snakeId);
    
    storeElement.style.display = 'flex';
    storeOpen[snakeId] = true;
}


// 关闭商店
function closeStore(snakeId) {
    const storeId = snakeId === 'snake1' ? 'store-player1' : 'store-player2';
    const storeElement = document.getElementById(storeId);
    
    // 获取商店打开前的状态
    const wasPaused = storeElement.dataset.wasPaused === 'true';
    
    // 恢复商店打开前的状态
    pausedSnakes[snakeId] = wasPaused;
    
    // 移除数据属性
    delete storeElement.dataset.wasPaused;
    
    storeElement.style.display = 'none';
    storeOpen[snakeId] = false;
    storeSelectedItem[snakeId] = 0;
}

// 更新商店显示
// 修改updateStoreDisplay函数，添加护盾检查
// 修改updateStoreDisplay函数，修复变量作用域问题
function updateStoreDisplay(snakeId) {
    const playerNum = snakeId === 'snake1' ? '1' : '2';
    const storeItemsElement = document.getElementById(`store-player${playerNum}-items`);
    const storeScoreElement = document.getElementById(`store-player${playerNum}-score`);
    const storeNameElement = document.getElementById(`store-player${playerNum}-name`);
    const storeBuyBtn = document.getElementById(`store-player${playerNum}-buy`);
    
    // 更新玩家名称和分数
    const playerName = snakeId === 'snake1' ? 
        localStorage.getItem('username') || '玩家1' : 
        localStorage.getItem('player2_username') || '玩家2';
    storeNameElement.textContent = playerName;
    storeScoreElement.textContent = scores[snakeId];
    
    // 生成商店项目列表
    storeItemsElement.innerHTML = '';
    
    storeItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = `store-item ${index === storeSelectedItem[snakeId] ? 'selected' : ''}`;
        itemElement.dataset.index = index;
        
        // 检查是否已购买并达到最大等级
        let isMaxLevel = false;
        let canAfford = scores[snakeId] >= item.price;
        let upgradeLevel = 0; // 在这里定义upgradeLevel变量
        
        if (item.type === 'upgrade') {
            upgradeLevel = playerUpgrades[snakeId][item.id.split('_')[0]] || 0;
            isMaxLevel = item.maxLevel && upgradeLevel >= item.maxLevel;
            canAfford = canAfford && !isMaxLevel;
        } else if (item.id === 'shield') {
            // 护盾：如果已经有护盾，不能购买
            isMaxLevel = shields[snakeId].active && shields[snakeId].health > 0;
            canAfford = canAfford && !isMaxLevel;
        } else if (item.id === 'random_balls') {
            // 随机球礼包：可以重复购买
            canAfford = canAfford;
        }
        
        // 项目内容 - 现在upgradeLevel在作用域内
        itemElement.innerHTML = `
            <div class="store-item-icon" style="background: ${item.color};">
                ${item.icon}
            </div>
            <div class="store-item-info">
                <div class="store-item-name">
                    ${item.name}
                    ${isMaxLevel ? '<span style="color:#4CAF50;">(已拥有)</span>' : ''}
                </div>
                <div class="store-item-desc">${item.description}</div>
                <div class="store-item-price">
                    <i class="fas fa-coins"></i> ${item.price}分
                    ${item.type === 'upgrade' ? 
                        `<span style="margin-left:10px;color:#aaa;">等级: ${upgradeLevel}/${item.maxLevel}</span>` : 
                        ''}
                </div>
            </div>
        `;
        
        // 点击事件
        itemElement.addEventListener('click', () => {
            if (!isMaxLevel) {
                storeSelectedItem[snakeId] = index;
                updateStoreDisplay(snakeId);
            }
        });
        
        storeItemsElement.appendChild(itemElement);
    });
    
    // 更新购买按钮状态
    const selectedItem = storeItems[storeSelectedItem[snakeId]];
    
    // 重新计算选择项的状态
    let selectedIsMaxLevel = false;
    let selectedUpgradeLevel = 0; // 为选中项定义变量
    
    if (selectedItem.type === 'upgrade') {
        selectedUpgradeLevel = playerUpgrades[snakeId][selectedItem.id.split('_')[0]] || 0;
        selectedIsMaxLevel = selectedItem.maxLevel && selectedUpgradeLevel >= selectedItem.maxLevel;
    } else if (selectedItem.id === 'shield') {
        selectedIsMaxLevel = shields[snakeId].active && shields[snakeId].health > 0;
    }
    
    const selectedCanAfford = scores[snakeId] >= selectedItem.price && !selectedIsMaxLevel;
    
    storeBuyBtn.disabled = !selectedCanAfford;
    if (selectedIsMaxLevel) {
        if (selectedItem.id === 'shield') {
            storeBuyBtn.textContent = '已有护盾';
        } else if (selectedItem.id === 'random_balls') {
            storeBuyBtn.textContent = '可购买';
        } else {
            storeBuyBtn.textContent = '已满级';
        }
    } else {
        storeBuyBtn.textContent = selectedCanAfford ? '购买' : '分数不足';
    }
}

// 购买商店物品
function buyStoreItem(snakeId) {
    if (!storeOpen[snakeId]) return;
    
    const selectedIndex = storeSelectedItem[snakeId];
    const item = storeItems[selectedIndex];
    const playerName = snakeId === 'snake1' ? 
        localStorage.getItem('username') || '玩家1' : 
        localStorage.getItem('player2_username') || '玩家2';
    
    // 检查是否已满级
    const upgradeLevel = playerUpgrades[snakeId][item.id.split('_')[0]] || 0;
    if (item.type === 'upgrade' && item.maxLevel && upgradeLevel >= item.maxLevel) {
        showNotice('已经达到最大等级!', '#FF0000', 
                  snakes[snakeId][0].x, snakes[snakeId][0].y);
        return;
    }
    
    // 检查分数是否足够
    if (scores[snakeId] < item.price) {
        showNotice('分数不足!', '#FF0000', 
                  snakes[snakeId][0].x, snakes[snakeId][0].y);
        return;
    }
    
    // 扣除分数
    scores[snakeId] -= item.price;
    updateScoreDisplay();
    
    // 应用物品效果
    applyStoreItemEffect(snakeId, item);
    
    // 显示购买成功提示
    showNotice(`购买成功! -${item.price}分`, '#4CAF50', 
              snakes[snakeId][0].x, snakes[snakeId][0].y);
    
    // 播放购买特效
    createParticles(snakes[snakeId][0].x + 10, snakes[snakeId][0].y + 10, 20, '#FFD700');
    
    // 更新商店显示
    updateStoreDisplay(snakeId);
}

// 应用商店物品效果
// 修改applyStoreItemEffect函数，添加护盾效果
function applyStoreItemEffect(snakeId, item) {
    const head = snakes[snakeId][0];
    
    switch(item.id) {
        case 'shield':
            // 激活护盾
            if (!shields[snakeId].active) {
                shields[snakeId].active = true;
                shields[snakeId].health = shields[snakeId].maxHealth;
                
                // 更新护盾显示
                updateShieldDisplay(snakeId);
                
                // 显示护盾激活特效
                showNotice('护盾已激活!', '#00BCD4', head.x, head.y);
                createParticles(head.x + 10, head.y + 10, 30, '#00BCD4');
                
                // 创建护盾环绕特效
                createShieldEffect(snakeId);
            }
            break;
            
        case 'random_balls':
            // 给予3个随机魔法球
            for (let i = 0; i < 3; i++) {
                if (ballStorage[snakeId].length < 5) {
                    const ballTypes = ['attack', 'health', 'immunity', 'reverse', 'bomb'];
                    const randomType = ballTypes[Math.floor(Math.random() * ballTypes.length)];
                    ballStorage[snakeId].push({type: randomType});
                    
                    // 显示获得提示
                    showNotice(`获得${getBallName(randomType)}!`, getBallColor(randomType), 
                              head.x, head.y - i * 20);
                }
            }
            updateStorageDisplay();
            break;
            
        case 'speed_upgrade':
            // 增加速度
            playerUpgrades[snakeId].speed++;
            speedBoosts[snakeId] += 0.15; // 增加15%速度
            showNotice('速度增加15%!', '#FFD700', head.x, head.y);
            break;
            
        case 'tough_upgrade':
            // 增加生命值上限
            playerUpgrades[snakeId].tough++;
            const maxHealthIncrease = 2;
            
            // 更新最大生命值
            if (snakeId === 'snake1') {
                health.snake1 += maxHealthIncrease;
            } else {
                health.snake2 += maxHealthIncrease;
            }
            
            showNotice(`生命值上限+${maxHealthIncrease}!`, '#C0C0C0', head.x, head.y);
            updateHealthBars();
            break;
            
        case 'magic_upgrade':
            // 延长特殊效果时间
            playerUpgrades[snakeId].magic++;
            showNotice('魔法效果时间延长20%!', '#2196F3', head.x, head.y);
            break;
    }
}

// 获取球体名称
function getBallName(ballType) {
    const names = {
        'attack': '攻击球',
        'health': '血球',
        'immunity': '无敌球',
        'reverse': '反转球',
        'bomb': '炸弹球'
    };
    return names[ballType] || '魔法球';
}

// 获取球体颜色
function getBallColor(ballType) {
    const colors = {
        'attack': '#00BFFF',
        'health': '#FF0000',
        'immunity': '#FFFF00',
        'reverse': '#800080',
        'bomb': '#FF4500'
    };
    return colors[ballType] || '#FFFFFF';
}
document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('store-player1-buy').addEventListener('click', () => {
        if (storeOpen.snake1) {
            buyStoreItem('snake1');
        }
    });
    
    document.getElementById('store-player2-buy').addEventListener('click', () => {
        if (storeOpen.snake2) {
            buyStoreItem('snake2');
        }
    });
    

});