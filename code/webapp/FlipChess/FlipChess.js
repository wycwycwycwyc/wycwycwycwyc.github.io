// ============================================================
//                        音效模块
// ============================================================
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    } catch (e) { }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => { });
  return audioCtx;
}
function playMoveSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(720, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.28, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now); osc.stop(now + 0.14);
}
function playCaptureSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(1100, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.16);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.42, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now); osc.stop(now + 0.24);
  const dur = 0.1;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
  const noise = ctx.createBufferSource(); noise.buffer = buf;
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
  const nGain = ctx.createGain(); nGain.gain.value = 0.18;
  noise.connect(hp).connect(nGain).connect(ctx.destination);
  noise.start(now);
  const bass = ctx.createOscillator(); const bassGain = ctx.createGain();
  bass.type = 'sine';
  bass.frequency.setValueAtTime(180, now);
  bass.frequency.exponentialRampToValueAtTime(60, now + 0.18);
  bassGain.gain.setValueAtTime(0.0001, now);
  bassGain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
  bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  bass.connect(bassGain).connect(ctx.destination);
  bass.start(now); bass.stop(now + 0.26);
}
function playFlipSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.24, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now); osc.stop(now + 0.15);
}
function playVictorySound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    const t = now + i * 0.14;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'triangle'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.6);
  });
}
function playDefeatSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  [392, 349.23, 293.66, 261.63].forEach((freq, i) => {
    const t = now + i * 0.16;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.55);
  });
}
function playDrawSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  [523.25, 523.25].forEach((freq, i) => {
    const t = now + i * 0.2;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.4);
  });
}
function playCollisionSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now); osc.stop(now + 0.32);
  const dur = 0.15;
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
  const noise = ctx.createBufferSource(); noise.buffer = buf;
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1000;
  const nGain = ctx.createGain(); nGain.gain.value = 0.25;
  noise.connect(hp).connect(nGain).connect(ctx.destination);
  noise.start(now);
}
function playSkillSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  [660, 880, 1100].forEach((f, i) => {
    const t = now + i * 0.08;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = f;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.3);
  });
}
function playTimeoutWarningSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  [0, 0.15, 0.3].forEach(offset => {
    const t = now + offset;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.13);
  });
}

// ============================================================
//                        全局状态
// ============================================================
let ws = null;
let lobbyWs = null;
let roomId = '';
let myUserId = '';
let myUsername = '';
let myRole = '';
let opponentUserId = '';
let opponentUsername = '';
let selfReady = false;
let oppReady = false;
let gameStarted = false;
let onlineMode = false;

let board = [];
let currentPlayer = null;
let gameOver = false;
let gameEndReason = '';
let selectedRow = -1, selectedCol = -1;
let lastMovedRow = -1, lastMovedCol = -1;
let deadRed = [];
let deadBlack = [];
let history = [];
let myColor = null;
let hostColor = null;

let pendingUndoRequest = false;
let pendingDrawRequest = false;
let confirmCallback = null;
let intentionalClose = false;
let leavingToHome = false;
let roomFullHandled = false;
let recordUploaded = false;
let prevDeadRedCount = 0;
let prevDeadBlackCount = 0;

let lastOpponentUserId = '';
let oppDisconnectTimer = null;
let oppDisconnectDeadline = 0;
const OPP_WAIT_MS = 120 * 1000;

let inviteRoomId = '';
let pendingInviteTimer = null;
let timeSelectMode = 'create';
let pendingInviteTargetId = null;
let onlineUsers = {};

let gameMode = 'classic';
let syncStepsPerRound = 3;
let syncRoundNum = 0;
let syncMyQueue = [];
let syncMySubmitted = false;
let syncOppSubmitted = false;
let syncPlaying = false;
let syncPlaybackTimer = null;
let syncStepOption = 3;
let syncOppQueue = [];
let colorTipShown = false;
let lastPlaybackScript = null;
let lastPlaybackStartState = null;

let syncPathPieceId = -1;
let syncPathPiece = null;
let syncPathCurrentPos = { row: -1, col: -1 };

let syncStateVersion = 0;
// ★ 碰撞阈值：0.67（深入半径一半）
const COLLISION_THRESHOLD = 0.67;
let playSyncPlaybackStartTime = 0;

let playbackRafId = 0;
let pendingPlaybackEvents = [];
const collidedIds = new Set();

const activeAnimations = {};

let skillBalls = [];
let skillEffects = [];
let skillTurnCounter = 0;
let nextBallSpawnAt = 3;
let stepBonus = { host: 0, guest: 0 };

let pendingDisconnectCheck = null;
let lastOppActivity = Date.now();
let targetPickMode = null;

let stepWarningIssued = false;
let gameWarningIssued = false;
let lastActionSent = null;

const ROWS = 8, COLS = 4;
const CELL_SIZE = 76, PIECE_SIZE = 68;
const OFFSET = (CELL_SIZE - PIECE_SIZE) / 2;

const WS_BASE = 'wss://scripthub.serveousercontent.com/ws';
const SERVER_URL = (typeof serverurl !== 'undefined') ? serverurl : 'https://scripthub.serveousercontent.com';
const LOBBY_ROOM = 'lobby';

const RANK = {
  '將': 7, '帥': 7, '士': 6, '仕': 6, '象': 5, '相': 5,
  '車': 4, '俥': 4, '馬': 3, '傌': 3, '炮': 2, '砲': 2, '卒': 1, '兵': 1
};
const SPEED = {
  '兵': 1.0, '卒': 1.0, '炮': 1.0, '砲': 1.0,
  '馬': 1.0, '傌': 1.0, '車': 1.0, '俥': 1.0,
  '士': 1.0, '仕': 1.0, '象': 1.0, '相': 1.0,
  '將': 1.0, '帥': 1.0
};
const UPGRADE = {
  '兵': '炮', '炮': '傌', '傌': '俥', '俥': '相', '相': '仕', '仕': '帥',
  '卒': '砲', '砲': '馬', '馬': '車', '車': '象', '象': '士', '士': '將',
  '帥': null, '將': null
};
const DOWNGRADE = {
  '帥': '仕', '仕': '相', '相': '俥', '俥': '傌', '傌': '炮', '炮': '兵', '兵': null,
  '將': '士', '士': '象', '象': '車', '車': '馬', '馬': '砲', '砲': '卒', '卒': null
};

function getPieceSpeed(piece) { return SPEED[piece] || 1.0; }
function getPieceColor(piece) {
  if (!piece) return null;
  if ('帥仕相俥傌炮兵'.includes(piece)) return 'red';
  if ('將士象車馬砲卒'.includes(piece)) return 'black';
  return null;
}
function getRank(piece) { return RANK[piece] || 0; }
function canCapture(piece, target) {
  if (!piece || !target) return false;
  if (getPieceColor(piece) === getPieceColor(target)) return false;
  if (piece === '炮' || piece === '砲') return true;
  if ((piece === '兵' || piece === '卒') && (target === '將' || target === '帥')) return true;
  if ((piece === '將' || piece === '帥') && (target === '兵' || target === '卒')) return false;
  return getRank(piece) >= getRank(target);
}
function canCaptureInCollision(piece, target) {
  if (!piece || !target) return false;
  if (getPieceColor(piece) === getPieceColor(target)) return false;
  if ((piece === '兵' || piece === '卒') && (target === '將' || target === '帥')) return true;
  if ((piece === '將' || piece === '帥') && (target === '兵' || target === '卒')) return false;
  return getRank(piece) >= getRank(target);
}

let isReconnecting = false;
let reconnectTimer = null;
let reconnectDeadline = 0;
const RECONNECT_TIMEOUT_MS = 120 * 1000;
const RECONNECT_INTERVAL_MS = 3000;
let reconnectWasInGame = false;

let timeSettings = { enabled: true, totalMs: 15 * 60 * 1000, stepMs: 60 * 1000 };
let hostTimeLeft = 0, guestTimeLeft = 0, turnStartTs = 0;
let timerInterval = null, timeoutHandled = false;
let unreadChatCount = 0;

const CHAT_PRESETS = [
  '请神速些吧！', '容我再思量思量！', '一着不慎，满盘皆输！',
  '再与我对弈一局？', '观棋不语真君子，落子无悔大丈夫！',
  '胜败乃兵家常事！', '快点吧，等的花儿都谢了！',
  '对不起，刚才卡了！', '下次再玩吧，我要走了。'
];

// ============================================================
//                    技能球系统
// ============================================================
const SKILL_TYPES = ['+L', '-L', '+S', '-S', '+N', '-N'];

function findPieceById(id) {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const cell = board[r][c];
    if (cell && cell.id === id) return { r, c, cell };
  }
  return null;
}

function trySpawnBall() {
  if (gameMode !== 'sync') return;
  if (skillBalls.length >= 2) return;
  const empty = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (board[r][c] === null && !skillBalls.some(b => b.row === r && b.col === c)) empty.push({ r, c });
  }
  if (empty.length === 0) return;
  const pos = empty[Math.floor(Math.random() * empty.length)];
  const type = SKILL_TYPES[Math.floor(Math.random() * SKILL_TYPES.length)];
  const golden = Math.random() < 0.2;
  skillBalls.push({ row: pos.r, col: pos.c, type, golden });
  renderSkillBalls();
}

function renderSkillBalls() {
  document.querySelectorAll('.skill-ball').forEach(el => el.remove());
  if (gameMode !== 'sync') return;
  const boardEl = document.getElementById('board');
  if (!boardEl) return;
  skillBalls.forEach(ball => {
    const el = document.createElement('div');
    el.className = 'skill-ball ' + (ball.type[0] === '+' ? 'plus' : 'minus');
    if (ball.golden) el.classList.add('golden');
    el.textContent = ball.type;
    const pos = getPiecePos(ball.row, ball.col);
    el.style.left = pos.left + 'px';
    el.style.top = pos.top + 'px';
    boardEl.appendChild(el);
  });
}

function ballAt(row, col) { return skillBalls.find(b => b.row === row && b.col === col); }

function addEffect(ef) {
  applyEffectNow(ef);
  skillEffects.push(ef);
}

function onTurnAdvance() {
  if (gameMode !== 'sync') return;
  if (onlineMode && myRole === 'guest') {
    tickSkillEffects();
    return;
  }
  skillTurnCounter++;
  if (skillTurnCounter >= nextBallSpawnAt) {
    trySpawnBall();
    nextBallSpawnAt = skillTurnCounter + 3 + Math.floor(Math.random() * 3);
  }
  tickSkillEffects();
}

function tickSkillEffects() {
  let changed = false;
  const toRemove = [];
  skillEffects.forEach((ef, i) => {
    ef.roundsLeft--;
    if (ef.roundsLeft <= 0) {
      restoreEffectNow(ef);
      toRemove.push(i);
      changed = true;
    }
  });
  for (let i = toRemove.length - 1; i >= 0; i--) skillEffects.splice(toRemove[i], 1);
  if (changed) {
    Promise.resolve().then(() => {
      if (gameMode === 'sync' && syncPlaying) return;
      renderFullBoard();
      if (gameMode === 'sync') renderSyncBar();
    });
  }
}

function applyEffectNow(ef) {
  const { type, targetId } = ef;
  if (type === '+N' || type === '-N') {
    if (targetId === 'host' || targetId === 'guest') {
      const delta = type === '+N' ? 1 : -1;
      stepBonus[targetId] = (stepBonus[targetId] || 0) + delta;
      ef.delta = delta;
      if (gameMode === 'sync') renderSyncBar();
    }
    return;
  }
  const found = findPieceById(targetId);
  if (!found) { ef.cancelled = true; return; }
  const { cell } = found;
  if (type === '+L') {
    const np = UPGRADE[cell.piece];
    if (np === null) { ef.cancelled = true; return; }
    ef.delta = +1;
    cell.piece = np;
  } else if (type === '-L') {
    const np = DOWNGRADE[cell.piece];
    ef.delta = -1;
    if (np === null) {
      board[found.r][found.c] = null;
      ef.killed = true;
      const col = getPieceColor(cell.piece);
      if (col === 'red') deadRed.push(cell.piece); else deadBlack.push(cell.piece);
      prevDeadRedCount = -1; prevDeadBlackCount = -1;
      return;
    }
    cell.piece = np;
  } else if (type === '+S') {
    ef.delta = 2;
    cell.speedMul = (cell.speedMul || 1) * 2;
  } else if (type === '-S') {
    ef.delta = 0.5;
    cell.speedMul = (cell.speedMul || 1) * 0.5;
  }
}

function restoreEffectNow(ef) {
  if (ef.cancelled) return;
  if (ef.type === '+N' || ef.type === '-N') {
    stepBonus[ef.targetId] = (stepBonus[ef.targetId] || 0) - (ef.delta || 0);
    if (gameMode === 'sync') renderSyncBar();
    return;
  }
  if (ef.killed) return;
  const found = findPieceById(ef.targetId);
  if (!found) return;
  const { cell } = found;
  if (ef.type === '+L') {
    const np = DOWNGRADE[cell.piece];
    if (np !== null) cell.piece = np;
  } else if (ef.type === '-L') {
    const np = UPGRADE[cell.piece];
    if (np !== null) cell.piece = np;
  } else if (ef.type === '+S') {
    cell.speedMul = (cell.speedMul || 1) / 2;
  } else if (ef.type === '-S') {
    cell.speedMul = (cell.speedMul || 1) * 2;
  }
}

function getPieceEffects(pieceId) {
  return skillEffects.filter(ef => ef.targetId === pieceId && ef.type !== '+N' && ef.type !== '-N');
}

function handleBallEatenClassic(ball, eaterPieceId, eaterSide) {
  const idx = skillBalls.indexOf(ball);
  if (idx >= 0) skillBalls.splice(idx, 1);
  renderSkillBalls();
  playSkillSound();

  const isStep = (ball.type === '+N' || ball.type === '-N');
  if (ball.golden && !isStep) {
    enterTargetPickMode(ball.type, eaterSide, (targetPieceId) => {
      const picked = findPieceById(targetPieceId);
      if (ball.type === '+L' && picked && (picked.cell.piece === '帥' || picked.cell.piece === '將')) {
        showBanner('帥/將已是最高等级', 'error', 1500);
        return;
      }
      const ef = { type: ball.type, targetId: targetPieceId, roundsLeft: 10, golden: true, by: eaterSide };
      addEffect(ef);
      if (onlineMode && myRole === 'host') broadcastSync();
      renderFullBoard();
    });
  } else {
    const duration = ball.golden ? 10 : 5;
    const targetId = isStep ? eaterSide : eaterPieceId;
    const ef = { type: ball.type, targetId, roundsLeft: duration, golden: ball.golden, by: eaterSide };
    addEffect(ef);
    if (onlineMode && myRole === 'host') broadcastSync();
  }
}

// ============================================================
//                    棋盘点选模式
// ============================================================
function enterTargetPickMode(effectType, side, callback) {
  targetPickMode = { effectType, side, callback };
  document.querySelectorAll('.piece').forEach(el => el.classList.add('target-pick-hint'));
  showBanner(`请点击任意棋子应用 ${effectType}（点空位取消）`, 'info', 0);
}
function cancelTargetPickMode() {
  targetPickMode = null;
  document.querySelectorAll('.piece').forEach(el => el.classList.remove('target-pick-hint'));
  hideBanner();
}
function handleTargetPickClick(row, col) {
  if (!targetPickMode) return false;
  const cell = board[row]?.[col];
  if (!cell || cell.hidden) { cancelTargetPickMode(); return true; }
  const { effectType, side, callback } = targetPickMode;
  const targetId = cell.id;
  cancelTargetPickMode();
  callback(targetId, effectType, side);
  return true;
}

// ============================================================
//                ★ 棋桌右上角按钮（检测断线 / 已走棋）
// ============================================================
function initCornerButtons() {
  const gamePanel = document.getElementById('gamePanel');
  if (!gamePanel) return;
  let container = document.getElementById('gameCornerBtns');
  if (!container) {
    container = document.createElement('div');
    container.id = 'gameCornerBtns';
    container.className = 'game-corner-btns';
    gamePanel.appendChild(container);
  }
  container.innerHTML = '';
  if (!onlineMode) {
    container.style.display = 'none';
    return;
  }
  container.style.display = '';

  const checkBtn = document.createElement('button');
  checkBtn.className = 'btn btn-draw';
  checkBtn.textContent = '检测断线';
  checkBtn.onclick = () => {
    if (!onlineMode) { showBanner('仅在线对局可用', 'error', 1500); return; }
    checkOpponentAlive();
  };
  container.appendChild(checkBtn);

  const resendBtn = document.createElement('button');
  resendBtn.className = 'btn btn-undo';
  resendBtn.textContent = '已走棋';
  resendBtn.onclick = () => {
    if (!onlineMode) { showBanner('仅在线对局可用', 'error', 1500); return; }
    resendLastAction();
  };
  container.appendChild(resendBtn);
}

// ============================================================
//                    断线 / 重发
// ============================================================
function checkOpponentAlive() {
  if (!onlineMode || !ws || ws.readyState !== 1) { showBanner('未连接', 'error', 1500); return; }
  if (pendingDisconnectCheck) { showBanner('已有检测进行中...', 'info', 1500); return; }
  pendingDisconnectCheck = {
    timer: setTimeout(() => {
      pendingDisconnectCheck = null;
      handleOpponentDisconnect();
    }, 5000)
  };
  send({ type: 'checkDisconnect', userId: myUserId });
  showBanner('已发送检测信号，等待回应...', 'info', 3000);
}
function onReceiveCheckDisconnect(msg) {
  send({ type: 'checkDisconnectReply', userId: myUserId, toUserId: msg.userId });
  lastOppActivity = Date.now();
}
function onReceiveCheckDisconnectReply(msg) {
  if (pendingDisconnectCheck) {
    clearTimeout(pendingDisconnectCheck.timer);
    pendingDisconnectCheck = null;
    showBanner('对方在线 ✓', 'info', 2000);
  }
}

function resendLastAction() {
  if (!onlineMode || !ws || ws.readyState !== 1) {
    showBanner('未连接', 'error', 1500); return;
  }
  if (!gameStarted || gameOver) {
    showBanner('未在对局中', 'error', 1500); return;
  }

  if (myRole === 'host') {
    if (gameMode === 'sync') {
      if (lastPlaybackScript && !syncPlaying) {
        send({ type: 'syncPlayback', script: lastPlaybackScript });
        showBanner('已重发本轮动画', 'info', 2000);
      } else {
        broadcastSync();
        showBanner('已重新同步棋盘给对手', 'info', 2000);
      }
    } else {
      broadcastSync();
      showBanner('已重新同步棋盘给对手', 'info', 2000);
    }
    return;
  }

  if (gameMode === 'classic') {
    if (lastActionSent && Date.now() - lastActionSent.timestamp < 60000) {
      send(lastActionSent.payload);
      showBanner('已重发上一步走棋', 'info', 2000);
    } else {
      send({ type: 'requestSync', userId: myUserId });
      showBanner('已请求主机重新同步', 'info', 2000);
    }
  } else {
    if (syncMySubmitted && syncMyQueue.length > 0) {
      send({ type: 'syncPlan', userId: myUserId, actions: syncMyQueue });
      send({ type: 'syncOppSubmitted', userId: myUserId });
      showBanner('已重发本轮规划', 'info', 2000);
    } else {
      send({ type: 'requestSync', userId: myUserId });
      showBanner('已请求主机重新同步', 'info', 2000);
    }
  }
}

// ============================================================
async function fetchUserIdByUsername(username) {
  const res = await fetch(`${SERVER_URL}/get-user-id-by-username`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  if (!res.ok) throw new Error('Network response was not ok');
  const data = await res.json();
  if (data && data.success && data.data && data.data.userId) return data.data.userId;
  throw new Error((data && data.message) || '获取 userId 失败');
}
async function loadUserInfo() {
  let uname = localStorage.getItem('username') || '';
  let uid = localStorage.getItem('userid') || '';
  if (!uid && uname) {
    try { uid = await fetchUserIdByUsername(uname); localStorage.setItem('userid', uid); }
    catch (e) { console.error('获取 userId 失败:', e); }
  }
  if (!uid) {
    uid = 'p' + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem('userid', uid); } catch (e) { }
  }
  if (!uname) {
    uname = '玩家' + uid.slice(-4);
    try { localStorage.setItem('username', uname); } catch (e) { }
  }
  myUserId = uid; myUsername = uname;
}
function updateLobbyUserLabel() {
  const el = document.getElementById('lobbyUserLabel');
  if (el) el.textContent = myUsername;
}

// ============================================================
//                        界面
// ============================================================
const menuPanel = document.getElementById('menuPanel');
const lobbyPanel = document.getElementById('lobbyPanel');
const waitPanel = document.getElementById('waitPanel');
const gamePanel = document.getElementById('gamePanel');
const recordsPanel = document.getElementById('recordsPanel');
const globalBanner = document.getElementById('globalBanner');
const chatFab = document.getElementById('chatFab');

function hideAll() {
  menuPanel.classList.add('hidden');
  lobbyPanel.classList.add('hidden');
  waitPanel.classList.add('hidden');
  gamePanel.classList.add('hidden');
  recordsPanel.classList.add('hidden');
  chatFab.classList.add('hidden');
}
function showBanner(text, type = 'error', ms = 4000) {
  globalBanner.textContent = text;
  globalBanner.className = 'banner show' + (type === 'info' ? ' info' : '');
  if (ms > 0) {
    clearTimeout(globalBanner._timer);
    globalBanner._timer = setTimeout(() => globalBanner.classList.remove('show'), ms);
  }
}
function hideBanner() { globalBanner.classList.remove('show'); }

function showOffline() {
  hideAll(); gamePanel.classList.remove('hidden');
  onlineMode = false; gameMode = 'classic';
  myColor = null; hostColor = null; myRole = '';
  roomId = ''; opponentUserId = ''; opponentUsername = '';
  lastOpponentUserId = '';
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  document.getElementById('gameRoomLabel').textContent = '离线';
  document.getElementById('gameRoleLabel').textContent = '';
  document.getElementById('gameColorLabel').textContent = '';
  document.getElementById('gameOppLabel').textContent = '';
  document.getElementById('connDot').style.display = 'none';
  document.getElementById('timeInfo').textContent = '';
  document.getElementById('syncBar').classList.add('hidden');
  resetGame();
  applyModeButtons();
  initCornerButtons();
}
function showOnline() {
  hideAll(); lobbyPanel.classList.remove('hidden');
  document.getElementById('lobbyHint').textContent = '';
  updateLobbyUserLabel();
  connectLobby();
  setTimeout(() => queryOnlineUsers(), 200);
}
function backToMenu() { hideAll(); menuPanel.classList.remove('hidden'); }

function applyModeButtons() {
  const yieldBtn = document.getElementById('yieldBtn');
  const drawBtn = document.getElementById('drawBtn');
  const resignBtn = document.getElementById('resignBtn');
  if (!onlineMode) {
    yieldBtn.style.display = 'none';
    drawBtn.style.display = 'none';
    resignBtn.style.display = 'none';
  } else {
    yieldBtn.style.display = '';
    drawBtn.style.display = '';
    resignBtn.style.display = '';
  }
  updateButtons();
}

// ============================================================
//                        大厅
// ============================================================
function connectLobby() {
  if (lobbyWs && (lobbyWs.readyState === WebSocket.OPEN || lobbyWs.readyState === WebSocket.CONNECTING)) return;
  if (!myUserId) return;
  const url = WS_BASE + '?room=' + LOBBY_ROOM + '&userId=' + encodeURIComponent(myUserId);
  try { lobbyWs = new WebSocket(url); } catch (e) { return; }
  lobbyWs.onopen = () => {
    sendLobby({ type: 'hello', userId: myUserId, username: myUsername, role: 'lobby' });
    setTimeout(() => queryOnlineUsers(), 200);
  };
  lobbyWs.onmessage = (e) => handleLobbyMessage(e.data);
  lobbyWs.onclose = () => {
    lobbyWs = null;
    if (!window._pageUnloading) setTimeout(() => { if (!window._pageUnloading) connectLobby(); }, 3000);
  };
  lobbyWs.onerror = () => { };
}
function sendLobby(obj) {
  if (!lobbyWs || lobbyWs.readyState !== 1) return false;
  lobbyWs.send(typeof obj === 'string' ? obj : JSON.stringify(obj));
  return true;
}
function queryOnlineUsers() {
  if (!lobbyWs || lobbyWs.readyState !== 1) return;
  sendLobby({ type: 'lobbyQuery', userId: myUserId, username: myUsername });
}
function handleLobbyMessage(raw) {
  let msg; try { msg = JSON.parse(raw); } catch (e) { return; }
  switch (msg.type) {
    case 'hello':
      if (msg.userId === myUserId) break;
      onlineUsers[msg.userId] = { username: msg.username || msg.userId, status: onlineUsers[msg.userId] ? onlineUsers[msg.userId].status : 'idle' };
      renderOnlineUsers(); break;
    case 'lobbyQuery':
      if (msg.userId === myUserId) break;
      sendLobby({ type: 'lobbyQueryReply', toUserId: msg.userId, userId: myUserId, username: myUsername, status: (gameStarted && !gameOver && onlineMode) ? 'busy' : 'idle' });
      onlineUsers[msg.userId] = { username: msg.username || msg.userId, status: onlineUsers[msg.userId] ? onlineUsers[msg.userId].status : 'idle' };
      renderOnlineUsers(); break;
    case 'lobbyQueryReply':
      if (msg.toUserId !== myUserId || msg.userId === myUserId) break;
      onlineUsers[msg.userId] = { username: msg.username || msg.userId, status: msg.status || 'idle' };
      renderOnlineUsers(); break;
    case 'exit':
      if (msg.userId === myUserId) break;
      delete onlineUsers[msg.userId]; renderOnlineUsers(); break;
    case 'busy':
      if (msg.userId === myUserId) break;
      if (onlineUsers[msg.userId]) { onlineUsers[msg.userId].status = 'busy'; renderOnlineUsers(); }
      break;
    case 'idle':
      if (msg.userId === myUserId) break;
      if (onlineUsers[msg.userId]) { onlineUsers[msg.userId].status = 'idle'; renderOnlineUsers(); }
      break;
    case 'invite': if (msg.toUserId === myUserId) handleIncomingInvite(msg); break;
    case 'inviteAccept': if (msg.toUserId === myUserId) handleInviteAccepted(msg); break;
    case 'inviteReject':
      if (msg.toUserId === myUserId) {
        showBanner('对方拒绝了邀请', 'error', 2500);
        if (pendingInviteTimer) { clearTimeout(pendingInviteTimer); pendingInviteTimer = null; }
      } break;
    case 'inviteBusy':
      if (msg.toUserId === myUserId) {
        showBanner('对方在棋局中，无法接受邀请', 'error', 2500);
        if (pendingInviteTimer) { clearTimeout(pendingInviteTimer); pendingInviteTimer = null; }
      } break;
    case 'joinGame': if (msg.toUserId === myUserId) handleIncomingJoin(msg); break;
    case 'joinGameAccept': if (msg.toUserId === myUserId) handleJoinAccepted(msg); break;
    case 'joinGameReject':
      if (msg.toUserId === myUserId) showBanner('对方拒绝了你加入棋局', 'error', 2500);
      break;
  }
}
function renderOnlineUsers() {
  const el = document.getElementById('onlineUsersList');
  if (!el) return;
  const entries = Object.entries(onlineUsers);
  if (entries.length === 0) {
    el.innerHTML = '<div style="text-align:center; color:#5a3f28; font-size:0.85rem; padding:8px;">暂无其他在线用户</div>';
    return;
  }
  el.innerHTML = '';
  entries.forEach(([uid, info]) => {
    const item = document.createElement('div');
    item.className = 'online-user-item';
    const isBusy = info.status === 'busy';
    const statusText = isBusy ? '（棋局中）' : '';
    item.innerHTML = `<span class="online-user-name">${escapeHtml(info.username)}<span class="online-user-status">${statusText}</span></span>`;
    const btn = document.createElement('button');
    btn.className = 'invite-btn';
    if (isBusy) { btn.textContent = '加入'; btn.onclick = () => requestJoinGame(uid); }
    else { btn.textContent = '邀请'; btn.onclick = () => inviteUser(uid); }
    item.appendChild(btn);
    el.appendChild(item);
  });
}
function inviteUser(toUserId) {
  if (gameStarted && !gameOver && onlineMode) { showBanner('你正在对局中，无法邀请他人', 'error', 2000); return; }
  if (!lobbyWs || lobbyWs.readyState !== 1) { showBanner('大厅未连接，请稍候', 'error', 2000); connectLobby(); return; }
  pendingInviteTargetId = toUserId;
  timeSelectMode = 'invite';
  document.getElementById('modeSelectModal').classList.add('show');
}
function doInviteWithMode(toUserId) {
  if (!lobbyWs || lobbyWs.readyState !== 1) { showBanner('大厅未连接，请稍候', 'error', 2000); connectLobby(); return; }
  const newRoomId = generateRoomId();
  inviteRoomId = newRoomId;
  sendLobby({ type: 'invite', fromUserId: myUserId, fromUsername: myUsername, toUserId, roomId: newRoomId, timeSettings: { ...timeSettings }, gameMode, syncStepsPerRound });
  const modeText = gameMode === 'sync' ? '【同步规划模式】' : '【经典模式】';
  showBanner(modeText + ' 邀请已发送，等待对方接受...', 'info', 4000);
  if (pendingInviteTimer) clearTimeout(pendingInviteTimer);
  pendingInviteTimer = setTimeout(() => {
    pendingInviteTimer = null;
    showBanner('对方未响应，邀请已过期', 'error', 2500);
  }, 30000);
}
function requestJoinGame(toUserId) {
  if (gameStarted && !gameOver && onlineMode) { showBanner('你正在对局中，无法加入他人棋局', 'error', 2000); return; }
  if (!lobbyWs || lobbyWs.readyState !== 1) { showBanner('大厅未连接，请稍候', 'error', 2000); connectLobby(); return; }
  sendLobby({ type: 'joinGame', fromUserId: myUserId, fromUsername: myUsername, toUserId, originalRole: myRole });
  showBanner('已请求加入，等待对方确认...', 'info', 4000);
}
function handleIncomingJoin(msg) {
  showConfirm(`${msg.fromUsername} 想加入棋局，是否允许？`, () => {
    const requesterRole = (myRole === 'host') ? 'guest' : 'host';
    sendLobby({ type: 'joinGameAccept', fromUserId: myUserId, toUserId: msg.fromUserId, roomId, continueGame: true, hostColor, timeSettings: { ...timeSettings }, gameMode, syncStepsPerRound, assignRole: requesterRole });
    if (myRole === 'host') {
      setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 800);
      setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 1800);
      setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 3000);
    }
    showBanner('已允许对方加入棋局', 'info', 2000);
  }, () => {
    sendLobby({ type: 'joinGameReject', fromUserId: myUserId, toUserId: msg.fromUserId, reason: 'refused' });
  });
}
function handleJoinAccepted(msg) {
  if (!msg.continueGame) { showBanner('对方拒绝了加入请求', 'error', 2500); return; }
  if (msg.timeSettings) Object.assign(timeSettings, msg.timeSettings);
  if (msg.gameMode) gameMode = msg.gameMode;
  if (msg.syncStepsPerRound) syncStepsPerRound = msg.syncStepsPerRound;
  if (msg.assignRole) myRole = msg.assignRole;
  else if (!myRole) myRole = 'guest';
  roomId = msg.roomId;
  showBanner('对方已允许你加入，正在进入对局...', 'info', 2000);
  setTimeout(() => enterRoom(true), 150);
}
function handleIncomingInvite(msg) {
  if (msg.gameMode) gameMode = msg.gameMode;
  if (msg.syncStepsPerRound) syncStepsPerRound = msg.syncStepsPerRound;
  if (gameStarted && !gameOver && onlineMode) {
    showConfirm(`${msg.fromUsername} 想加入棋局，是否允许？`, () => {
      const requesterRole = (myRole === 'host') ? 'guest' : 'host';
      sendLobby({ type: 'joinGameAccept', fromUserId: myUserId, toUserId: msg.fromUserId, roomId, continueGame: true, hostColor, timeSettings: { ...timeSettings }, gameMode, syncStepsPerRound, assignRole: requesterRole });
      if (myRole === 'host') {
        setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 800);
        setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 1800);
        setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 3000);
      }
    }, () => {
      sendLobby({ type: 'joinGameReject', fromUserId: myUserId, toUserId: msg.fromUserId, reason: 'refused' });
    });
    return;
  }
  const modeText = gameMode === 'sync' ? '【同步规划模式】' : '【经典模式】';
  showConfirm(`${msg.fromUsername} ${modeText} 邀请你下棋，是否接受？`, () => {
    if (msg.timeSettings) Object.assign(timeSettings, msg.timeSettings);
    sendLobby({ type: 'inviteAccept', fromUserId: myUserId, toUserId: msg.fromUserId, roomId: msg.roomId });
    setTimeout(() => { myRole = 'guest'; roomId = msg.roomId; enterRoom(); }, 150);
  }, () => {
    sendLobby({ type: 'inviteReject', fromUserId: myUserId, toUserId: msg.fromUserId });
  });
}
function handleInviteAccepted(msg) {
  if (pendingInviteTimer) { clearTimeout(pendingInviteTimer); pendingInviteTimer = null; }
  if (msg.continueGame) {
    if (msg.timeSettings) Object.assign(timeSettings, msg.timeSettings);
    if (msg.assignRole) myRole = msg.assignRole;
    else if (!myRole) myRole = 'guest';
    roomId = msg.roomId;
    showBanner('对方已允许你重新加入对局', 'info', 2000);
    setTimeout(() => enterRoom(true), 150);
  } else {
    myRole = 'host'; roomId = msg.roomId;
    const modeText = gameMode === 'sync' ? '【同步规划模式】' : '【经典模式】';
    showBanner(modeText + ' 对方接受邀请，进入房间...', 'info', 2000);
    setTimeout(() => enterRoom(), 150);
  }
}

// ============================================================
//                        网络
// ============================================================
function netLog(s) {
  const el = document.getElementById('netLog');
  if (!el) return;
  el.textContent += `[${new Date().toLocaleTimeString()}] ${s}\n`;
  el.scrollTop = el.scrollHeight;
}
function lobbyHint(s, type = '') {
  const el = document.getElementById('lobbyHint');
  el.textContent = s; el.className = 'hint' + (type ? ' ' + type : '');
}
function waitHint(s, type = '') {
  const el = document.getElementById('waitHint');
  el.textContent = s; el.className = 'hint' + (type ? ' ' + type : '');
}
function setConnIndicator(state) {
  const dot = document.getElementById('connDot');
  if (dot) dot.className = 'conn-indicator' + (state ? ' ' + state : '');
}
function closeExistingWS() {
  if (ws) {
    try {
      ws.onopen = null; ws.onclose = null; ws.onerror = null; ws.onmessage = null;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close(1000, 'client closing');
    } catch (e) { }
    ws = null;
  }
}
function connectWS(room, userId, isReconnect) {
  return new Promise((resolve, reject) => {
    closeExistingWS();
    const url = WS_BASE + '?room=' + encodeURIComponent(room) + '&userId=' + encodeURIComponent(userId);
    netLog('连接 ' + url + (isReconnect ? ' (重连)' : ''));
    try { ws = new WebSocket(url); } catch (e) { reject(e); return; }
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return; settled = true;
      netLog('连接超时');
      try { ws.close(); } catch (e) { }
      reject(new Error('连接超时'));
    }, 8000);
    ws.onopen = () => {
      if (settled) return; settled = true;
      clearTimeout(timeout);
      netLog('已连接'); setConnIndicator('');
      resolve();
    };
    ws.onerror = () => {
      if (settled) return; settled = true;
      clearTimeout(timeout);
      netLog('连接错误'); setConnIndicator('dead');
      reject(new Error('连接错误'));
    };
    ws.onclose = (e) => {
      clearTimeout(timeout);
      netLog('关闭 code=' + e.code);
      setConnIndicator('dead'); ws = null;
      if (!intentionalClose) handleDisconnect(e.code);
    };
    ws.onmessage = (e) => handleMessage(e.data);
  });
}
function handleDisconnect() {
  if (leavingToHome) return;
  if (gameStarted && onlineMode) { startReconnect(); return; }
  if (!gameStarted && waitPanel.classList.contains('hidden')) return;
  leavingToHome = true;
  showBanner('⚠ 网络连接断开，即将返回主页...', 'error', 2500);
  setTimeout(() => goHome(), 2000);
}
function send(obj) {
  if (!ws || ws.readyState !== 1) { netLog('未连接'); return false; }
  if (obj && typeof obj === 'object') {
    if (obj.type === 'move' || obj.type === 'flip' || obj.type === 'syncPlan') {
      lastActionSent = { type: obj.type, payload: { ...obj }, timestamp: Date.now() };
    }
  }
  ws.send(typeof obj === 'string' ? obj : JSON.stringify(obj));
  return true;
}
function startReconnect() {
  if (isReconnecting) return;
  isReconnecting = true;
  reconnectWasInGame = gameStarted && !gameOver;
  reconnectDeadline = Date.now() + RECONNECT_TIMEOUT_MS;
  setConnIndicator('dead');
  showBanner('⚠ 网络断开，正在重连...', 'error', 0);
  stopTimer();
  attemptReconnect();
}
function attemptReconnect() {
  if (!isReconnecting) return;
  if (Date.now() > reconnectDeadline) {
    showBanner('重连超时，对局结束', 'error', 3000);
    isReconnecting = false;
    if (!gameOver) endGame('网络断开超时，你输了', 'loss');
    setTimeout(() => { leavingToHome = true; goHome(); }, 2500);
    return;
  }
  const remain = Math.ceil((reconnectDeadline - Date.now()) / 1000);
  showBanner(`⚠ 网络断开，正在重连...（剩余 ${remain}s）`, 'error', 0);
  connectWS(roomId, myUserId, true).then(() => {
    send({ type: 'hello', userId: myUserId, username: myUsername, role: myRole, reconnect: true, gameMode, syncStepsPerRound });
    isReconnecting = false; hideBanner();
    showBanner('已重新连接', 'info', 2000);
    startTimer();
    if (reconnectWasInGame && gameStarted) {
      hideAll(); gamePanel.classList.remove('hidden'); chatFab.classList.remove('hidden');
      initCornerButtons();
      if (myRole === 'host') broadcastSync();
      else send({ type: 'requestSync', userId: myUserId });
      appendChatMessage('', '你已重新连接', 'sys');
    }
  }).catch(() => {
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(attemptReconnect, RECONNECT_INTERVAL_MS);
  });
}

// ============================================================
//                        计时
// ============================================================
function resetTimersForNewGame() {
  hostTimeLeft = timeSettings.totalMs; guestTimeLeft = timeSettings.totalMs;
  turnStartTs = performance.now(); timeoutHandled = false;
  stepWarningIssued = false;
  gameWarningIssued = false;
}
function startTimer() {
  if (gameMode === 'sync') return;
  stopTimer();
  if (!turnStartTs) turnStartTs = performance.now();
  timerInterval = setInterval(tickTimer, 200);
  tickTimer();
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
function commitTurnTime() {
  if (gameMode === 'sync') return;
  if (!turnStartTs) return;
  const elapsed = performance.now() - turnStartTs;
  const noLimit = !timeSettings.enabled;
  const dec = (v) => noLimit ? (v - elapsed) : Math.max(0, v - elapsed);
  if (currentPlayer === 'red' || currentPlayer === 'black') {
    const isHostColor = (hostColor === currentPlayer);
    if (isHostColor) hostTimeLeft = dec(hostTimeLeft); else guestTimeLeft = dec(guestTimeLeft);
  } else if (currentPlayer === 'host') hostTimeLeft = dec(hostTimeLeft);
  else if (currentPlayer === 'guest') guestTimeLeft = dec(guestTimeLeft);
  turnStartTs = performance.now();
  stepWarningIssued = false;
}
function formatMs(ms) {
  ms = Math.max(0, ms);
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
function tickTimer() {
  if (gameMode === 'sync') return;
  if (gameOver || !gameStarted || isReconnecting) return;
  const info = document.getElementById('timeInfo');
  if (!info) return;
  const elapsedStep = turnStartTs ? (performance.now() - turnStartTs) : 0;
  if (!timeSettings.enabled) {
    let hostUsed = timeSettings.totalMs - hostTimeLeft;
    let guestUsed = timeSettings.totalMs - guestTimeLeft;
    if (isHostTurnLocal()) hostUsed += elapsedStep; else guestUsed += elapsedStep;
    info.textContent = `本局用时 红:${formatMs(hostUsed)} 黑:${formatMs(guestUsed)}`;
    return;
  }
  const stepLeft = timeSettings.stepMs - elapsedStep;
  let curLeft;
  if (currentPlayer === 'red' || currentPlayer === 'black') {
    const isHostColor = (hostColor === currentPlayer);
    curLeft = isHostColor ? hostTimeLeft : guestTimeLeft;
  } else if (currentPlayer === 'host') curLeft = hostTimeLeft;
  else if (currentPlayer === 'guest') curLeft = guestTimeLeft;
  else curLeft = timeSettings.totalMs;
  curLeft = Math.max(0, curLeft - elapsedStep);
  info.textContent = `步时 ${formatMs(stepLeft)} | 局时 红:${formatMs(hostTimeLeft)} 黑:${formatMs(guestTimeLeft)}`;

  if (isMyTurn()) {
    if (!stepWarningIssued && stepLeft <= 10000 && stepLeft > 0) {
      stepWarningIssued = true;
      playTimeoutWarningSound();
      try {
        Swal.fire({
          icon: 'warning',
          title: '步时不足 10 秒',
          text: '请尽快落子',
          timer: 3000,
          showConfirmButton: false
        });
      } catch (e) { }
    }
    if (!gameWarningIssued && curLeft <= 10000 && curLeft > 0) {
      gameWarningIssued = true;
      playTimeoutWarningSound();
      try {
        Swal.fire({
          icon: 'warning',
          title: '局时不足 10 秒',
          text: '你的总时间即将耗尽',
          timer: 3000,
          showConfirmButton: false
        });
      } catch (e) { }
    }
  }

  if (timeoutHandled) return;
  if (stepLeft <= 0) { timeoutHandled = true; onMyTimeout('步时超时'); }
  else if (curLeft <= 0) { timeoutHandled = true; onMyTimeout('局时超时'); }
}
function onMyTimeout(reason) {
  if (gameOver) return;
  stopTimer();
  send({ type: 'timeout', userId: myUserId, reason });
  endGame('你' + reason + '，判负', 'loss');
}

// ============================================================
//                        聊天
// ============================================================
function openChatModal() {
  document.getElementById('chatModal').classList.add('show');
  unreadChatCount = 0; updateChatBadge();
  setTimeout(() => { const input = document.getElementById('chatInput'); if (input) input.focus(); }, 100);
}
function closeChatModal() { document.getElementById('chatModal').classList.remove('show'); }
function updateChatBadge() {
  const badge = document.getElementById('chatBadge');
  if (!badge) return;
  if (unreadChatCount > 0) {
    badge.textContent = unreadChatCount > 99 ? '99+' : String(unreadChatCount);
    badge.classList.remove('hidden');
  } else badge.classList.add('hidden');
}
function initChatUI() {
  const presetsEl = document.getElementById('chatPresets');
  if (!presetsEl) return;
  presetsEl.innerHTML = '';
  CHAT_PRESETS.forEach(msg => {
    const btn = document.createElement('button');
    btn.className = 'chat-preset-btn'; btn.textContent = msg;
    btn.onclick = () => sendChat(msg, 'preset');
    presetsEl.appendChild(btn);
  });
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  if (sendBtn) {
    sendBtn.onclick = () => {
      const v = (input.value || '').trim();
      if (!v) return;
      sendChat(v, 'custom'); input.value = '';
    };
  }
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const v = (input.value || '').trim();
        if (!v) return;
        sendChat(v, 'custom'); input.value = '';
      }
    };
  }
}
function sendChat(text, chatType) {
  if (!onlineMode) return;
  send({ type: 'chat', userId: myUserId, username: myUsername, chatType, content: text });
  appendChatMessage(myUsername || '我', text, 'me');
}
function appendChatMessage(name, text, kind) {
  const log = document.getElementById('chatLog');
  if (!log) return;
  if (kind === 'sys') {
    const line = document.createElement('div');
    line.className = 'chat-line sys'; line.textContent = '· ' + text;
    log.appendChild(line);
  } else {
    const line = document.createElement('div');
    line.className = 'chat-line ' + (kind === 'me' ? 'me' : '');
    const nameEl = document.createElement('span');
    nameEl.className = 'chat-name'; nameEl.textContent = name + '：';
    line.appendChild(nameEl);
    const textEl = document.createElement('span');
    textEl.textContent = text;
    line.appendChild(textEl); log.appendChild(line);
  }
  while (log.children.length > 100) log.removeChild(log.firstChild);
  log.scrollTop = log.scrollHeight;
}
function showChatNotice(from, text) {
  const container = document.getElementById('chatNoticeContainer');
  if (!container) return;
  const notice = document.createElement('div');
  notice.className = 'chat-notice';
  notice.innerHTML = `
    <div class="notice-from">${escapeHtml(from)}</div>
    <div class="notice-text">${escapeHtml(text)}</div>
    <button class="notice-close" aria-label="关闭">×</button>
  `;
  const closeBtn = notice.querySelector('.notice-close');
  closeBtn.onclick = (e) => { e.stopPropagation(); dismissNotice(notice); };
  notice.onclick = () => { openChatModal(); dismissNotice(notice); };
  container.appendChild(notice);
  if (!document.getElementById('chatModal').classList.contains('show')) {
    unreadChatCount++; updateChatBadge();
  }
  setTimeout(() => { dismissNotice(notice); }, 8000);
}
function dismissNotice(notice) {
  if (!notice || !notice.parentNode) return;
  notice.classList.add('hide');
  setTimeout(() => { if (notice.parentNode) notice.parentNode.removeChild(notice); }, 300);
}

// ============================================================
//                  消息处理
// ============================================================
function handleMessage(raw) {
  let msg; try { msg = JSON.parse(raw); } catch (e) { return; }
  netLog('收到: ' + msg.type);
  if (!msg.userId || msg.userId !== myUserId) lastOppActivity = Date.now();

  switch (msg.type) {
    case 'ping': break;
    case 'checkDisconnect': if (msg.userId !== myUserId) onReceiveCheckDisconnect(msg); break;
    case 'checkDisconnectReply': if (msg.toUserId === myUserId) onReceiveCheckDisconnectReply(msg); break;
    case 'goldenChoice':
      if (myRole === 'host') {
        const ef = msg.effect;
        const exists = skillEffects.some(e => e.type === ef.type && e.targetId === ef.targetId && e.by === ef.by);
        if (!exists) { addEffect(ef); broadcastSync(); }
      }
      break;
    case 'askGolden':
      if (msg.toUserId === myUserId) {
        enterTargetPickMode(msg.ballType, msg.side, (targetId) => {
          const ef = { type: msg.ballType, targetId, roundsLeft: msg.duration || 10, golden: true, by: msg.side };
          send({ type: 'goldenChoice', userId: myUserId, effect: ef });
        });
      }
      break;
    case 'hello': {
      if (msg.userId === myUserId) break;
      if (myRole === 'host') {
        if (opponentUserId && opponentUserId !== msg.userId) {
          send({ type: 'roomFull', hostId: myUserId, oppId: opponentUserId }); break;
        }
        if (!opponentUserId && lastOpponentUserId && msg.userId !== lastOpponentUserId) {
          send({ type: 'roomFull', hostId: myUserId, oppId: lastOpponentUserId }); break;
        }
        opponentUserId = msg.userId;
        opponentUsername = msg.username || msg.userId;
        if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
        hideBanner(); lastOpponentUserId = '';
        const oppLabel = document.getElementById('gameOppLabel');
        if (oppLabel) { oppLabel.textContent = '对手：' + opponentUsername; oppLabel.style.color = '#b32b2b'; }
        send({ type: 'hello-ack', userId: myUserId, username: myUsername, role: myRole, gameMode, syncStepsPerRound });
        if (gameStarted && !gameOver) {
          broadcastSync();
          hideAll(); gamePanel.classList.remove('hidden'); chatFab.classList.remove('hidden');
          startTimer();
          initCornerButtons();
          appendChatMessage('', (msg.username || '对手') + ' 已重新加入，对局继续', 'sys');
          showBanner('对手已重新加入，对局继续', 'info', 2500);
        } else { updateWaitUI(); waitHint('对手已加入：' + opponentUsername, 'ok'); }
      } else if (myRole === 'guest') {
        if (msg.gameMode) gameMode = msg.gameMode;
        if (msg.syncStepsPerRound) syncStepsPerRound = msg.syncStepsPerRound;
        opponentUserId = msg.userId;
        opponentUsername = msg.username || msg.userId;
        const oppLabel = document.getElementById('gameOppLabel');
        if (oppLabel) { oppLabel.textContent = '对手：' + opponentUsername; oppLabel.style.color = '#b32b2b'; }
        send({ type: 'hello-ack', userId: myUserId, username: myUsername, role: myRole, gameMode, syncStepsPerRound });
        if (gameStarted && !gameOver) {
          hideAll(); gamePanel.classList.remove('hidden'); chatFab.classList.remove('hidden');
          startTimer(); initCornerButtons();
          send({ type: 'requestSync', userId: myUserId });
        } else { updateWaitUI(); waitHint('对手已加入：' + opponentUsername, 'ok'); }
      }
      break;
    }
    case 'hello-ack': {
      if (msg.userId === myUserId) break;
      if (myRole === 'guest') {
        if (msg.gameMode) gameMode = msg.gameMode;
        if (msg.syncStepsPerRound) syncStepsPerRound = msg.syncStepsPerRound;
      }
      opponentUserId = msg.userId;
      opponentUsername = msg.username || msg.userId;
      const oppLabel = document.getElementById('gameOppLabel');
      if (oppLabel) { oppLabel.textContent = '对手：' + opponentUsername; oppLabel.style.color = '#b32b2b'; }
      if (gameStarted && !gameOver) {
        if (gamePanel.classList.contains('hidden')) {
          hideAll(); gamePanel.classList.remove('hidden'); chatFab.classList.remove('hidden');
          startTimer(); initCornerButtons();
        }
        if (myRole === 'guest') send({ type: 'requestSync', userId: myUserId });
      } else { updateWaitUI(); waitHint('对手已加入：' + opponentUsername, 'ok'); }
      break;
    }
    case 'roomFull':
      if (msg.hostId === myUserId || msg.oppId === myUserId) break;
      if (roomFullHandled) break;
      roomFullHandled = true;
      showBanner('房间已满，无法加入', 'error', 3000);
      setTimeout(() => { roomFullHandled = false; leaveRoom(true); }, 1500);
      break;
    case 'ready':
      if (msg.userId === opponentUserId || !opponentUserId) { oppReady = msg.ready; updateWaitUI(); checkBothReady(); }
      break;
    case 'start':
      if (myRole === 'guest') {
        if (msg.gameMode) gameMode = msg.gameMode;
        if (msg.syncStepsPerRound) syncStepsPerRound = msg.syncStepsPerRound;
        applyStartState(msg.state);
      }
      break;
    case 'move':
    case 'flip':
      if (myRole === 'host' && gameMode === 'classic') handleGuestAction(msg);
      break;
    case 'sync':
      gameStarted = true;
      applySyncState(msg.state);
      hideAll(); gamePanel.classList.remove('hidden'); chatFab.classList.remove('hidden');
      initCornerButtons();
      if (gameMode !== 'sync' && !msg.state.gameOver) startTimer();
      if (gameMode === 'sync') {
        document.getElementById('syncBar').classList.remove('hidden');
        if (myColor && !colorTipShown) {
          colorTipShown = true;
          setTimeout(() => {
            Swal.fire({ icon: 'info', title: '颜色分配', text: `你执 ${myColor === 'red' ? '红方' : '黑方'}`, confirmButtonText: '知道了' });
          }, 300);
        }
        if (!syncMySubmitted) renderSyncBar();
      }
      break;
    case 'requestSync': if (myRole === 'host' && gameStarted) broadcastSync(); break;
    case 'requestUndo': incomingUndoRequest(); break;
    case 'undoAccepted':
      if (myRole === 'host') { doUndoLocal(); broadcastSync(); }
      pendingUndoRequest = false;
      showBanner('对方同意悔棋', 'info', 1500);
      break;
    case 'undoRejected':
      pendingUndoRequest = false;
      showBanner('对方拒绝了悔棋', 'error', 2500);
      break;
    case 'yieldFirst': if (msg.userId !== myUserId) showBanner('对手让先，请你先走', 'info', 3000); break;
    case 'requestDraw': incomingDrawRequest(); break;
    case 'drawAccepted':
      pendingDrawRequest = false;
      if (!gameOver) endGame('双方和棋', 'draw');
      showBanner('对方同意和棋', 'info', 2000);
      break;
    case 'drawRejected':
      pendingDrawRequest = false;
      showBanner('对方拒绝和棋', 'error', 2500);
      break;
    case 'resign': if (!gameOver) endGame('对方认输，你赢了', 'win'); break;
    case 'timeout':
      if (msg.userId !== myUserId && !gameOver) { stopTimer(); endGame('对方超时，你赢了', 'win'); }
      break;
    case 'chat':
      if (msg.userId === myUserId) break;
      appendChatMessage(msg.username || '对手', msg.content, 'other');
      showChatNotice(msg.username || '对手', msg.content);
      break;
    case 'manualLeave': handleOpponentManualLeave(); break;
    case 'exit': handleOpponentDisconnect(); break;
    case 'syncModeSet':
      gameMode = msg.gameMode; syncStepsPerRound = msg.syncStepsPerRound;
      showBanner('房主选择了「同步规划模式」', 'info', 3000);
      break;
    case 'syncPlan': if (myRole === 'host') handleOpponentSyncPlan(msg); break;
    case 'syncPlayback': if (myRole === 'guest') playSyncPlayback(msg.script); break;
    case 'syncOppSubmitted':
      if (msg.userId !== myUserId) {
        syncOppSubmitted = true; renderSyncBar();
        if (!syncMySubmitted) showBanner('对手已提交规划，请尽快完成', 'info', 3000);
      }
      break;
    default: break;
  }
}

function incomingUndoRequest() {
  const who = opponentUsername || '对方';
  showConfirm(who + ' 请求悔棋，是否同意？', () => {
    send({ type: 'undoAccepted', userId: myUserId });
    if (myRole === 'host') { doUndoLocal(); broadcastSync(); }
  }, () => { send({ type: 'undoRejected', userId: myUserId }); });
}
function incomingDrawRequest() {
  const who = opponentUsername || '对方';
  showConfirm(who + ' 请求和棋，是否同意？', () => {
    send({ type: 'drawAccepted', userId: myUserId });
    endGame('双方和棋', 'draw');
  }, () => { send({ type: 'drawRejected', userId: myUserId }); });
}
function handleOpponentManualLeave() {
  if (leavingToHome) return;
  if (gameStarted && !gameOver) {
    endGame('对方已离开，你赢了', 'win');
    setTimeout(() => { leavingToHome = true; goHome(); }, 2500);
    return;
  }
  leavingToHome = true;
  showBanner('⚠ 对方已离开，即将返回主页...', 'error', 2500);
  setTimeout(() => goHome(), 2000);
}
function handleOpponentDisconnect() {
  if (leavingToHome) return;
  if (opponentUserId) lastOpponentUserId = opponentUserId;
  opponentUserId = ''; opponentUsername = ''; oppReady = false;
  const oppLabel = document.getElementById('gameOppLabel');
  if (oppLabel) { oppLabel.textContent = '对手断线，等待重连...'; oppLabel.style.color = '#b32b2b'; }
  oppDisconnectDeadline = Date.now() + OPP_WAIT_MS;
  if (oppDisconnectTimer) clearInterval(oppDisconnectTimer);
  showBanner(`⚠ 对手断线，等待重连... ${Math.ceil(OPP_WAIT_MS / 1000)}s`, 'error', 0);
  oppDisconnectTimer = setInterval(() => {
    const remain = Math.max(0, Math.ceil((oppDisconnectDeadline - Date.now()) / 1000));
    if (remain <= 0) {
      clearInterval(oppDisconnectTimer); oppDisconnectTimer = null;
      if (!opponentUserId) {
        if (gameStarted && !gameOver) {
          if (myRole === 'host') endGame('对方断线超时，你赢了', 'win');
          else endGame('对方断线超时，对局结束', 'loss');
        } else showBanner('对方断线超时，返回主页', 'error', 2500);
        setTimeout(() => { leavingToHome = true; goHome(); }, 2500);
      }
    } else showBanner(`⚠ 对手断线，等待重连... ${remain}s`, 'error', 0);
  }, 500);
  appendChatMessage('', '对方已断线，等待重新加入...', 'sys');
}
function goHome() {
  intentionalClose = true;
  if (ws) { try { ws.close(); } catch (e) { } ws = null; }
  window.removeEventListener('beforeunload', onBeforeUnload);
  stopTimer(); cancelTargetPickMode();
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  if (pendingInviteTimer) { clearTimeout(pendingInviteTimer); pendingInviteTimer = null; }
  if (syncPlaybackTimer) { clearTimeout(syncPlaybackTimer); syncPlaybackTimer = null; }
  if (pendingDisconnectCheck) { clearTimeout(pendingDisconnectCheck.timer); pendingDisconnectCheck = null; }
  isReconnecting = false; reconnectWasInGame = false;
  sendLobby({ type: 'idle', userId: myUserId, username: myUsername });
  opponentUserId = ''; opponentUsername = '';
  lastOpponentUserId = '';
  selfReady = false; oppReady = false;
  gameStarted = false; onlineMode = false; gameMode = 'classic';
  myColor = null; hostColor = null;
  gameOver = false; gameEndReason = '';
  leavingToHome = false; roomFullHandled = false;
  pendingUndoRequest = false; pendingDrawRequest = false; recordUploaded = false;
  unreadChatCount = 0; colorTipShown = false;
  lastPlaybackScript = null; lastPlaybackStartState = null;
  syncMyQueue = []; syncMySubmitted = false; syncOppSubmitted = false; syncPlaying = false;
  syncPathPieceId = -1; syncPathPiece = null; syncPathCurrentPos = { row: -1, col: -1 };
  skillBalls = []; skillEffects = []; skillTurnCounter = 0; nextBallSpawnAt = 3;
  stepBonus = { host: 0, guest: 0 };
  syncStateVersion = 0;
  playSyncPlaybackStartTime = 0;
  stopPlaybackLoop();
  stepWarningIssued = false;
  gameWarningIssued = false;
  lastActionSent = null;
  updateChatBadge();
  const log = document.getElementById('chatLog'); if (log) log.innerHTML = '';
  const nc = document.getElementById('chatNoticeContainer'); if (nc) nc.innerHTML = '';
  hideBanner(); hideAll(); menuPanel.classList.remove('hidden');
  connectLobby();
}

// ============================================================
//                        确认弹窗
// ============================================================
function showConfirm(text, onYes, onNo) {
  document.getElementById('confirmText').textContent = text;
  document.getElementById('confirmModal').classList.add('show');
  confirmCallback = { onYes, onNo };
}
function confirmYes() {
  document.getElementById('confirmModal').classList.remove('show');
  if (confirmCallback && confirmCallback.onYes) confirmCallback.onYes();
  confirmCallback = null;
}
function confirmNo() {
  document.getElementById('confirmModal').classList.remove('show');
  if (confirmCallback && confirmCallback.onNo) confirmCallback.onNo();
  confirmCallback = null;
}

// ============================================================
//                        房间 / 模式选择
// ============================================================
function generateRoomId() { return String(Math.floor(100000 + Math.random() * 900000)); }
function createRoom() {
  timeSelectMode = 'create'; pendingInviteTargetId = null;
  document.getElementById('modeSelectModal').classList.add('show');
}
function cancelModeSelect() {
  document.getElementById('modeSelectModal').classList.remove('show');
  timeSelectMode = 'create'; pendingInviteTargetId = null;
}
function pickMode(mode) {
  document.getElementById('modeSelectModal').classList.remove('show');
  gameMode = mode;
  if (mode === 'sync') document.getElementById('syncModeModal').classList.add('show');
  else document.getElementById('timeControlModal').classList.add('show');
}
function cancelSyncMode() {
  document.getElementById('syncModeModal').classList.remove('show');
  timeSelectMode = 'create'; pendingInviteTargetId = null;
}
function pickSyncSteps(n) {
  syncStepOption = n; gameMode = 'sync'; syncStepsPerRound = n;
  document.getElementById('syncModeModal').classList.remove('show');
  if (timeSelectMode === 'invite') {
    const target = pendingInviteTargetId;
    timeSelectMode = 'create'; pendingInviteTargetId = null;
    doInviteWithMode(target);
  } else doCreateRoom();
}
function cancelTimeSelect() {
  document.getElementById('timeControlModal').classList.remove('show');
  timeSelectMode = 'create'; pendingInviteTargetId = null;
}
function selectTimeOption(opt) {
  const presets = {
    standard: { enabled: true, totalMs: 15 * 60 * 1000, stepMs: 60 * 1000 },
    fast: { enabled: true, totalMs: 10 * 60 * 1000, stepMs: 30 * 1000 },
    blitz: { enabled: true, totalMs: 5 * 60 * 1000, stepMs: 20 * 1000 },
    none: { enabled: false, totalMs: 15 * 60 * 1000, stepMs: 60 * 1000 }
  };
  Object.assign(timeSettings, presets[opt] || presets.standard);
  document.getElementById('timeControlModal').classList.remove('show');
  if (timeSelectMode === 'invite') {
    const target = pendingInviteTargetId;
    timeSelectMode = 'create'; pendingInviteTargetId = null;
    doInviteWithMode(target);
  } else doCreateRoom();
}
async function doCreateRoom() {
  myRole = 'host'; roomId = generateRoomId();
  document.getElementById('lobbyRoom').value = roomId;
  lobbyHint('创建房间 ' + roomId + '...');
  await enterRoom();
}
async function joinRoom() {
  const rid = document.getElementById('lobbyRoom').value.trim();
  if (!rid || !/^\d{6}$/.test(rid)) { lobbyHint('请输入 6 位数字房间号', 'error'); return; }
  myRole = 'guest'; roomId = rid;
  lobbyHint('加入房间 ' + rid + '...');
  await enterRoom();
}
async function enterRoom(directEnter) {
  intentionalClose = false; leavingToHome = false;
  roomFullHandled = false; reconnectWasInGame = false; colorTipShown = false;
  try { await connectWS(roomId, myUserId, false); }
  catch (e) { lobbyHint('连接失败：' + e.message, 'error'); return; }
  onlineMode = true; applyModeButtons();
  if (directEnter) {
    hideAll(); gamePanel.classList.remove('hidden'); chatFab.classList.remove('hidden');
    gameStarted = true;
    if (!boardDomBuilt) { initBoard(); buildBoardDOM(); renderFullBoard(); renderGraveyards(); }
    initCornerButtons();
    setTimeout(() => { if (myRole === 'host') broadcastSync(); else send({ type: 'requestSync', userId: myUserId }); }, 300);
    setTimeout(() => { if (myRole === 'host') broadcastSync(); else send({ type: 'requestSync', userId: myUserId }); }, 1200);
    if (gameMode === 'sync') { document.getElementById('syncBar').classList.remove('hidden'); renderSyncBar(); }
    else document.getElementById('syncBar').classList.add('hidden');
  } else {
    hideAll(); waitPanel.classList.remove('hidden');
    document.getElementById('waitRoomLabel').textContent = roomId;
    document.getElementById('netLog').textContent = '';
    selfReady = false; oppReady = false; gameStarted = false;
    opponentUserId = ''; opponentUsername = '';
    myColor = null; hostColor = null;
    updateWaitUI(); waitHint('等待对手加入...');
  }
  send({ type: 'hello', userId: myUserId, username: myUsername, role: myRole, gameMode, syncStepsPerRound });
  setTimeout(() => {
    if (ws && ws.readyState === 1 && !opponentUserId)
      send({ type: 'hello', userId: myUserId, username: myUsername, role: myRole, gameMode, syncStepsPerRound, reHello: true });
  }, 800);
  setTimeout(() => {
    if (ws && ws.readyState === 1 && !opponentUserId)
      send({ type: 'hello', userId: myUserId, username: myUsername, role: myRole, gameMode, syncStepsPerRound, reHello: true });
  }, 2000);
  window.addEventListener('beforeunload', onBeforeUnload);
  sendLobby({ type: 'busy', userId: myUserId, username: myUsername });
}
function onBeforeUnload() {
  if (ws && ws.readyState === 1) {
    try { ws.send(JSON.stringify({ type: 'exit', userId: myUserId })); } catch (e) { }
  }
}
function leaveRoom(fromForce) {
  if (!fromForce && onlineMode && gameStarted && !gameOver) {
    send({ type: 'manualLeave', userId: myUserId });
    endGame('你已离开，判负', 'loss');
    setTimeout(() => goHome(), 600);
    return;
  }
  intentionalClose = true; goHome();
}
function updateWaitUI() {
  document.getElementById('dotSelf').className = 'ready-dot' + (selfReady ? ' ready' : '');
  document.getElementById('dotOpp').className = 'ready-dot' + (oppReady ? ' ready' : '');
  const hasOpp = !!opponentUserId;
  const readyBtn = document.getElementById('readyBtn');
  readyBtn.disabled = !hasOpp;
  readyBtn.textContent = selfReady ? '取消准备' : '准备';
  if (hasOpp && selfReady && oppReady) waitHint('双方已准备，即将开始...', 'ok');
  else if (hasOpp) waitHint('对手：' + opponentUsername + (oppReady ? '（已准备）' : '（未准备）'));
  else waitHint('等待对手加入...');
}
function toggleReady() {
  if (!opponentUserId) return;
  selfReady = !selfReady;
  send({ type: 'ready', userId: myUserId, ready: selfReady });
  updateWaitUI(); checkBothReady();
}
function checkBothReady() {
  if (selfReady && oppReady && opponentUserId && !gameStarted) {
    if (myRole === 'host') setTimeout(() => startGameAsHost(), 400);
  }
}

// ============================================================
//                    开局
// ============================================================
function resetSkillState() {
  skillBalls = []; skillEffects = [];
  skillTurnCounter = 0; nextBallSpawnAt = 3;
  stepBonus = { host: 0, guest: 0 };
  syncStateVersion = 0;
  playSyncPlaybackStartTime = 0;
  stopPlaybackLoop();
  renderSkillBalls();
}
function startGameAsHost() {
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  lastOpponentUserId = '';
  initBoard(); resetSkillState();
  myColor = null; hostColor = null;
  if (gameMode === 'sync') {
    hostColor = Math.random() < 0.5 ? 'red' : 'black';
    myColor = hostColor; currentPlayer = null;
  } else currentPlayer = 'host';
  gameOver = false; gameEndReason = '';
  selectedRow = -1; selectedCol = -1;
  lastMovedRow = -1; lastMovedCol = -1;
  deadRed = []; deadBlack = []; history = []; recordUploaded = false;
  gameStarted = true; syncRoundNum = 0;
  syncMyQueue = []; syncMySubmitted = false; syncOppSubmitted = false;
  syncPathPieceId = -1; syncPathPiece = null; syncPathCurrentPos = { row: -1, col: -1 };
  colorTipShown = false; lastPlaybackScript = null; lastPlaybackStartState = null;
  lastActionSent = null;
  resetTimersForNewGame();
  enterGameUI(); buildBoardDOM(); renderFullBoard(); renderGraveyards(); renderSkillBalls();
  const log = document.getElementById('chatLog'); if (log) log.innerHTML = '';
  if (gameMode === 'sync') {
    document.getElementById('syncBar').classList.remove('hidden');
    updateColorLabel();
    setTimeout(() => {
      colorTipShown = true;
      Swal.fire({ icon: 'info', title: '颜色分配', text: `你执 ${myColor === 'red' ? '红方' : '黑方'}`, confirmButtonText: '知道了' });
    }, 300);
    startSyncRound();
  } else {
    document.getElementById('syncBar').classList.add('hidden');
    startTimer();
  }
  send({ type: 'start', state: serializeState(), firstMover: 'host', timeSettings, gameMode, syncStepsPerRound });
}
function applyStartState(state) {
  deserializeState(state);
  gameStarted = true;
  gameOver = false; gameEndReason = '';
  recordUploaded = false; syncRoundNum = 0;
  syncMyQueue = []; syncMySubmitted = false; syncOppSubmitted = false;
  syncPathPieceId = -1; syncPathPiece = null; syncPathCurrentPos = { row: -1, col: -1 };
  lastPlaybackScript = null; lastPlaybackStartState = null;
  lastActionSent = null;
  enterGameUI(); buildBoardDOM(); renderFullBoard(); renderGraveyards(); renderSkillBalls();
  const log = document.getElementById('chatLog'); if (log) log.innerHTML = '';
  if (gameMode === 'sync') {
    document.getElementById('syncBar').classList.remove('hidden');
    updateColorLabel();
    if (myColor && !colorTipShown) {
      colorTipShown = true;
      setTimeout(() => {
        Swal.fire({ icon: 'info', title: '颜色分配', text: `你执 ${myColor === 'red' ? '红方' : '黑方'}`, confirmButtonText: '知道了' });
      }, 300);
    }
    renderSyncBar();
  } else {
    document.getElementById('syncBar').classList.add('hidden');
    startTimer();
  }
}

// ============================================================
//                        序列化
// ============================================================
function serializeState() {
  return {
    board: board.map(row => row.map(c => c ? { piece: c.piece, hidden: c.hidden, id: c.id, speedMul: c.speedMul || 1 } : null)),
    currentPlayer, gameOver, gameEndReason, lastMovedRow, lastMovedCol,
    deadRed: [...deadRed], deadBlack: [...deadBlack],
    hostColor, hostTimeLeft, guestTimeLeft,
    timeSettings: { ...timeSettings },
    gameMode, syncStepsPerRound, syncRoundNum,
    skillBalls: skillBalls.map(b => ({ ...b })),
    skillEffects: skillEffects.map(e => ({ ...e })),
    skillTurnCounter, nextBallSpawnAt,
    stepBonus: { ...stepBonus }
  };
}
function deserializeState(state) {
  syncStateVersion++;
  board = state.board.map(row => row.map(c => c ? { piece: c.piece, hidden: c.hidden, id: c.id, speedMul: c.speedMul || 1 } : null));
  currentPlayer = state.currentPlayer;
  gameOver = state.gameOver;
  gameEndReason = state.gameEndReason || '';
  lastMovedRow = state.lastMovedRow; lastMovedCol = state.lastMovedCol;
  deadRed = [...state.deadRed]; deadBlack = [...state.deadBlack];
  history = [];
  if (state.timeSettings) Object.assign(timeSettings, state.timeSettings);
  if (state.gameMode) gameMode = state.gameMode;
  if (state.syncStepsPerRound) syncStepsPerRound = state.syncStepsPerRound;
  if (typeof state.syncRoundNum === 'number') syncRoundNum = state.syncRoundNum;
  if (state.skillBalls) skillBalls = state.skillBalls.map(b => ({ ...b }));
  if (state.skillEffects) skillEffects = state.skillEffects.map(e => ({ ...e }));
  if (typeof state.skillTurnCounter === 'number') skillTurnCounter = state.skillTurnCounter;
  if (typeof state.nextBallSpawnAt === 'number') nextBallSpawnAt = state.nextBallSpawnAt;
  if (state.stepBonus) stepBonus = { ...state.stepBonus };
  hostColor = state.hostColor || null;
  if (typeof state.hostTimeLeft === 'number') hostTimeLeft = state.hostTimeLeft;
  if (typeof state.guestTimeLeft === 'number') guestTimeLeft = state.guestTimeLeft;
  turnStartTs = performance.now();
  if (myRole === 'host') myColor = hostColor;
  else if (myRole === 'guest') myColor = hostColor ? (hostColor === 'red' ? 'black' : 'red') : null;
}
function broadcastSync() {
  if (myRole !== 'host') return;
  send({ type: 'sync', state: serializeState() });
}
function applySyncState(state) {
  deserializeState(state);
  selectedRow = -1; selectedCol = -1;
  renderFullBoard(); renderGraveyards(); renderSkillBalls();
  updateColorLabel();
}
function updateColorLabel() {
  const el = document.getElementById('gameColorLabel');
  if (!onlineMode) { el.textContent = ''; return; }
  if (!myColor) el.textContent = '（等待颜色确定）';
  else el.textContent = myColor === 'red' ? '我执红方' : '我执黑方';
}

// ============================================================
//                        游戏界面
// ============================================================
function enterGameUI() {
  hideAll(); gamePanel.classList.remove('hidden'); chatFab.classList.remove('hidden');
  document.getElementById('gameRoomLabel').textContent = roomId || '离线';
  document.getElementById('gameRoleLabel').textContent =
    myRole === 'host' ? '（房主）' : (myRole === 'guest' ? '（客机）' : '');
  document.getElementById('gameOppLabel').textContent =
    opponentUserId ? '对手：' + (opponentUsername || opponentUserId) : '';
  document.getElementById('gameOppLabel').style.color = '#b32b2b';
  document.getElementById('connDot').style.display = onlineMode ? 'inline-block' : 'none';
  updateColorLabel(); applyModeButtons(); initChatUI();
  initCornerButtons();
  unreadChatCount = 0; updateChatBadge();
}
function exitGame() {
  if (onlineMode && !gameOver) {
    if (!confirm('确定要离开棋局吗？将会自动判负。')) return;
  }
  leaveRoom();
}

// ============================================================
//                    ★ 同步规划模式
// ============================================================
function renderSyncBar() {
  const bar = document.getElementById('syncBar');
  if (!bar) return;
  if (gameMode !== 'sync') { bar.classList.add('hidden'); return; }
  bar.classList.remove('hidden');
  const phaseEl = document.getElementById('syncPhase');
  const stepsEl = document.getElementById('syncSteps');
  const submitBtn = document.getElementById('syncSubmitBtn');
  const replayBtn = document.getElementById('syncReplayBtn');
  if (replayBtn) {
    if (lastPlaybackScript && !syncPlaying && !syncMySubmitted) replayBtn.style.display = '';
    else replayBtn.style.display = 'none';
  }
  if (syncPlaying) { phaseEl.textContent = '播放中...'; phaseEl.style.color = '#ffcc44'; }
  else if (syncMySubmitted) {
    if (syncOppSubmitted) { phaseEl.textContent = '双方已完成，准备播放'; phaseEl.style.color = '#1faa1f'; }
    else { phaseEl.textContent = '你已完成，等待对手...'; phaseEl.style.color = '#00e0ff'; }
  } else {
    if (syncOppSubmitted) { phaseEl.textContent = '对手已完成，请尽快完成'; phaseEl.style.color = '#ffaa00'; }
    else { phaseEl.textContent = '规划阶段'; phaseEl.style.color = '#eedbba'; }
  }
  const myBonus = stepBonus[myRole] || 0;
  const effectiveSteps = Math.max(1, syncStepsPerRound + myBonus);
  stepsEl.textContent = `步数：${syncMyQueue.length} / ${effectiveSteps}` + (myBonus !== 0 ? ` (${myBonus > 0 ? '+' : ''}${myBonus})` : '');
  submitBtn.disabled = syncMySubmitted || syncPlaying || syncMyQueue.length === 0;
  submitBtn.textContent = syncMySubmitted ? '已提交' : '完成';
}
function clearSyncQueue() {
  if (syncMySubmitted || syncPlaying) return;
  syncMyQueue = []; selectedRow = -1; selectedCol = -1;
  syncPathPieceId = -1; syncPathPiece = null;
  syncPathCurrentPos = { row: -1, col: -1 };
  highlightSyncQueue(); renderSyncBar();
}
function submitSyncPlan() {
  if (syncMySubmitted || syncPlaying) return;
  if (syncMyQueue.length === 0) { showBanner('请至少规划一步', 'error', 1500); return; }
  syncMySubmitted = true;
  selectedRow = -1; selectedCol = -1;
  syncPathPieceId = -1; syncPathPiece = null;
  syncPathCurrentPos = { row: -1, col: -1 };
  highlightSyncQueue(); renderSyncBar();
  if (myRole === 'host') checkBothSyncSubmitted();
  else {
    send({ type: 'syncPlan', userId: myUserId, actions: syncMyQueue });
    send({ type: 'syncOppSubmitted', userId: myUserId });
    showBanner('已提交，等待对手...', 'info', 2000);
  }
}
function handleOpponentSyncPlan(msg) { syncOppQueue = msg.actions || []; syncOppSubmitted = true; checkBothSyncSubmitted(); }
function checkBothSyncSubmitted() {
  if (myRole !== 'host') return;
  if (!syncMySubmitted || !syncOppSubmitted) return;
  setTimeout(() => hostSimulateAndPlay(), 200);
}
function startSyncRound() {
  syncRoundNum++;
  syncMyQueue = []; syncMySubmitted = false; syncOppSubmitted = false; syncOppQueue = [];
  selectedRow = -1; selectedCol = -1;
  syncPathPieceId = -1; syncPathPiece = null; syncPathCurrentPos = { row: -1, col: -1 };
  clearParabolas(); highlightSyncQueue(); renderSyncBar();
  onTurnAdvance();
  if (onlineMode && myRole === 'host') broadcastSync();
}
function hostSimulateAndPlay() {
  const allActions = [];
  syncMyQueue.forEach(a => allActions.push({ ...a, by: 'host' }));
  syncOppQueue.forEach(a => allActions.push({ ...a, by: 'guest' }));
  const script = simulateSyncRound(allActions);
  playSyncPlayback(script);
  send({ type: 'syncPlayback', script });
  syncMySubmitted = false; syncOppSubmitted = false; syncOppQueue = [];
}
function replayLastPlayback() {
  if (syncPlaying) { showBanner('播放中，请稍候', 'info', 1200); return; }
  if (gameOver) { showBanner('对局已结束', 'error', 1200); return; }
  if (!lastPlaybackScript) { showBanner('没有可回放的记录', 'error', 1200); return; }

  const savedState = {
    board: board.map(row => row.map(c => c ? { ...c } : null)),
    deadRed: [...deadRed], deadBlack: [...deadBlack],
    skillBalls: skillBalls.map(b => ({ ...b })),
    skillEffects: skillEffects.map(e => ({ ...e })),
    skillTurnCounter, nextBallSpawnAt,
    stepBonus: { ...stepBonus },
    syncRoundNum, currentPlayer, gameOver, gameEndReason,
    lastMovedRow, lastMovedCol,
    myColor, hostColor
  };

  if (lastPlaybackStartState) {
    board = lastPlaybackStartState.board.map(row => row.map(c => c ? { ...c } : null));
    deadRed = [...lastPlaybackStartState.deadRed];
    deadBlack = [...lastPlaybackStartState.deadBlack];
    if (lastPlaybackStartState.skillBalls) {
      skillBalls = lastPlaybackStartState.skillBalls.map(b => ({ ...b }));
    }
    prevDeadRedCount = -1;
    prevDeadBlackCount = -1;
    renderFullBoard();
    renderGraveyards();
    renderSkillBalls();
  }

  playSyncPlayback(lastPlaybackScript, savedState);
}
function checkSyncQueueConflict(newAction, skipIdx) {
  const queue = syncMyQueue;
  let targetRow, targetCol;
  if (newAction.type === 'flip') { targetRow = newAction.row; targetCol = newAction.col; }
  else { targetRow = newAction.toRow; targetCol = newAction.toCol; }
  for (let i = 0; i < queue.length; i++) {
    if (i === skipIdx) continue;
    const a = queue[i];
    let aTargetRow, aTargetCol;
    if (a.type === 'flip') { aTargetRow = a.row; aTargetCol = a.col; }
    else { aTargetRow = a.toRow; aTargetCol = a.toCol; }
    if (aTargetRow === targetRow && aTargetCol === targetCol) return '这个格子已经被本回合其他操作占用了';
  }
  if (newAction.type === 'move' || newAction.type === 'capture') {
    const pieceId = newAction.pieceId;
    if (pieceId === undefined || pieceId === -1) return null;
    let lastPos = null;
    for (let i = 0; i < queue.length; i++) {
      if (i === skipIdx) continue;
      const a = queue[i];
      if ((a.type === 'move' || a.type === 'capture') && a.pieceId === pieceId) lastPos = { row: a.toRow, col: a.toCol };
    }
    if (lastPos) {
      if (lastPos.row !== newAction.fromRow || lastPos.col !== newAction.fromCol) return '这个棋子已经被本回合其他操作占用了';
    }
  }
  return null;
}
function removeSyncActionWithDeps(idx) {
  const target = syncMyQueue[idx];
  if (!target) return;
  const toRemove = new Set([idx]);
  if (target.type === 'move' || target.type === 'capture') {
    syncMyQueue.forEach((a, i) => {
      if (i === idx) return;
      if (a.type !== 'move' && a.type !== 'capture') return;
      if (a.toRow === target.fromRow && a.toCol === target.fromCol) toRemove.add(i);
    });
    if (target.pieceId !== undefined) {
      let foundSelf = false;
      for (let i = 0; i < syncMyQueue.length; i++) {
        if (i === idx) { foundSelf = true; continue; }
        if (!foundSelf) continue;
        const a = syncMyQueue[i];
        if ((a.type === 'move' || a.type === 'capture') && a.pieceId === target.pieceId) toRemove.add(i);
      }
    }
  }
  let changed = true;
  while (changed) {
    changed = false;
    syncMyQueue.forEach((a, i) => {
      if (toRemove.has(i)) return;
      if (a.type !== 'move' && a.type !== 'capture') return;
      for (const ri of Array.from(toRemove)) {
        const rt = syncMyQueue[ri];
        if (!rt) continue;
        if ((rt.type === 'move' || rt.type === 'capture') &&
          a.toRow === rt.fromRow && a.toCol === rt.fromCol) { toRemove.add(i); changed = true; break; }
      }
    });
  }
  const arr = Array.from(toRemove).sort((a, b) => b - a);
  arr.forEach(i => syncMyQueue.splice(i, 1));
  selectedRow = -1; selectedCol = -1;
  syncPathPieceId = -1; syncPathPiece = null;
  syncPathCurrentPos = { row: -1, col: -1 };
  highlightSyncQueue(); renderSyncBar();
  if (toRemove.size > 1) showBanner(`已取消 ${toRemove.size} 个相关操作`, 'info', 1500);
}

function getMovePathCells(mv) {
  const cells = [];
  if (mv.from.row === mv.to.row) {
    const minC = Math.min(mv.from.col, mv.to.col), maxC = Math.max(mv.from.col, mv.to.col);
    for (let c = minC; c <= maxC; c++) cells.push({ row: mv.from.row, col: c });
  } else if (mv.from.col === mv.to.col) {
    const minR = Math.min(mv.from.row, mv.to.row), maxR = Math.max(mv.from.row, mv.to.row);
    for (let r = minR; r <= maxR; r++) cells.push({ row: r, col: mv.from.col });
  } else {
    cells.push({ row: mv.to.row, col: mv.to.col });
  }
  return cells;
}

function solveQuadratic(A, B, C) {
  if (Math.abs(A) < 1e-12) {
    if (Math.abs(B) < 1e-12) return [];
    return [-C / B];
  }
  const disc = B * B - 4 * A * C;
  if (disc < 0) return [];
  if (disc < 1e-12) return [-B / (2 * A)];
  const sq = Math.sqrt(disc);
  return [(-B - sq) / (2 * A), (-B + sq) / (2 * A)];
}

function findFirstCollision(mvA, mvB, threshold) {
  const tStart = Math.max(mvA.startT, mvB.startT);
  const tEnd = Math.min(mvA.endT, mvB.endT);
  if (tStart >= tEnd) return null;

  const durA = mvA.endT - mvA.startT;
  const durB = mvB.endT - mvB.startT;
  if (durA <= 0 || durB <= 0) return null;

  const vrA = (mvA.to.row - mvA.from.row) / durA;
  const vcA = (mvA.to.col - mvA.from.col) / durA;
  const vrB = (mvB.to.row - mvB.from.row) / durB;
  const vcB = (mvB.to.col - mvB.from.col) / durB;

  const rA0 = mvA.from.row + vrA * (tStart - mvA.startT);
  const cA0 = mvA.from.col + vcA * (tStart - mvA.startT);
  const rB0 = mvB.from.row + vrB * (tStart - mvB.startT);
  const cB0 = mvB.from.col + vcB * (tStart - mvB.startT);

  const dr0 = rA0 - rB0;
  const dc0 = cA0 - cB0;
  if (dr0 * dr0 + dc0 * dc0 <= threshold * threshold) {
    return {
      t: tStart,
      posA: { row: rA0, col: cA0 },
      posB: { row: rB0, col: cB0 }
    };
  }

  const vr = vrA - vrB;
  const vc = vcA - vcB;
  const A = vr * vr + vc * vc;
  const B = 2 * (dr0 * vr + dc0 * vc);
  const C = dr0 * dr0 + dc0 * dc0 - threshold * threshold;

  const dur = tEnd - tStart;
  const sCandidates = solveQuadratic(A, B, C).filter(s => s >= 0 && s <= dur);
  if (sCandidates.length === 0) return null;

  const s = Math.min(...sCandidates);
  return {
    t: tStart + s,
    posA: { row: rA0 + vrA * s, col: cA0 + vcA * s },
    posB: { row: rB0 + vrB * s, col: cB0 + vcB * s }
  };
}

function simulateSyncRound(actions) {
  const events = [];
  const workBoard = board.map(row => row.map(c => c ? { ...c } : null));
  const workDeadRed = [...deadRed];
  const workDeadBlack = [...deadBlack];
  const pieceMap = {};
  board.forEach(row => row.forEach(cell => {
    if (cell && cell.id !== undefined) pieceMap[cell.id] = cell.piece;
  }));

  const flippedKeys = new Set();
  actions.forEach(act => {
    if (act.type !== 'flip') return;
    const key = act.row + ',' + act.col;
    if (flippedKeys.has(key)) return;
    const cell = workBoard[act.row]?.[act.col];
    if (!cell || !cell.hidden || !cell.piece) return;
    flippedKeys.add(key);
    cell.hidden = false;
    events.push({ t: 0, type: 'flip', row: act.row, col: act.col, piece: cell.piece, color: getPieceColor(cell.piece), by: act.by });
  });

  const pieceMoves = {};
  const allMoves = [];
  actions.forEach(act => {
    if (act.type !== 'move' && act.type !== 'capture') return;
    let piece = pieceMap[act.pieceId];
    let speedMul = 1;
    if (!piece) {
      const fromCell = workBoard[act.fromRow]?.[act.fromCol];
      if (!fromCell) return;
      piece = fromCell.piece;
      speedMul = fromCell.speedMul || 1;
    } else {
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        if (board[r][c] && board[r][c].id === act.pieceId) speedMul = board[r][c].speedMul || 1;
      }
    }
    if (!piece) return;
    const speed = getPieceSpeed(piece) * speedMul;
    const dist = Math.abs(act.toRow - act.fromRow) + Math.abs(act.toCol - act.fromCol);
    const duration = (dist / speed) * 1000;
    const mv = {
      pieceId: act.pieceId, piece,
      from: { row: act.fromRow, col: act.fromCol },
      to: { row: act.toRow, col: act.toCol },
      type: act.type, by: act.by,
      duration,
      flying: (piece === '炮' || piece === '砲') && act.type === 'capture',
      startT: 0, endT: 0
    };
    if (!pieceMoves[act.pieceId]) pieceMoves[act.pieceId] = [];
    pieceMoves[act.pieceId].push(mv);
    allMoves.push(mv);
  });

  Object.keys(pieceMoves).forEach(pId => {
    let t = 0;
    pieceMoves[pId].forEach(mv => {
      mv.startT = t;
      mv.endT = t + mv.duration;
      t = mv.endT;
    });
  });

  const maxT = allMoves.reduce((m, mv) => Math.max(m, mv.endT), 0) + 200;
  const moveDead = new Map();
  allMoves.forEach(mv => moveDead.set(mv, false));

  const collisionPairs = [];
  for (let i = 0; i < allMoves.length; i++) {
    for (let j = i + 1; j < allMoves.length; j++) {
      const a = allMoves[i], b = allMoves[j];
      if (a.by === b.by) continue;
      if (a.flying !== b.flying) continue;
      if (a.pieceId === b.pieceId) continue;
      const colorA = getPieceColor(a.piece), colorB = getPieceColor(b.piece);
      if (colorA === colorB) continue;
      const aEatsB = canCaptureInCollision(a.piece, b.piece);
      const bEatsA = canCaptureInCollision(b.piece, a.piece);
      if (!aEatsB && !bEatsA) continue;

      const col = findFirstCollision(a, b, COLLISION_THRESHOLD);
      if (!col) continue;
      collisionPairs.push({
        a, b,
        tCollision: col.t,
        posA: col.posA, posB: col.posB,
        aEatsB, bEatsA, colorA, colorB
      });
    }
  }
  collisionPairs.sort((x, y) => x.tCollision - y.tCollision);

  for (const col of collisionPairs) {
    if (moveDead.get(col.a) || moveDead.get(col.b)) continue;

    if (col.aEatsB && col.bEatsA) {
      moveDead.set(col.a, true);
      moveDead.set(col.b, true);
      events.push({
        t: col.tCollision, type: 'collision',
        pieceIds: [col.a.pieceId, col.b.pieceId],
        deadIds: [col.a.pieceId, col.b.pieceId],
        result: 'bothDead',
        posA: col.posA, posB: col.posB
      });
      if (col.colorA === 'red') workDeadRed.push(col.a.piece); else workDeadBlack.push(col.a.piece);
      if (col.colorB === 'red') workDeadRed.push(col.b.piece); else workDeadBlack.push(col.b.piece);
    } else if (col.aEatsB) {
      moveDead.set(col.b, true);
      events.push({
        t: col.tCollision, type: 'collision',
        pieceIds: [col.b.pieceId],
        deadIds: [col.b.pieceId],
        result: 'oneDead',
        posA: col.posA, posB: col.posB
      });
      if (col.colorB === 'red') workDeadRed.push(col.b.piece); else workDeadBlack.push(col.b.piece);
    } else if (col.bEatsA) {
      moveDead.set(col.a, true);
      events.push({
        t: col.tCollision, type: 'collision',
        pieceIds: [col.a.pieceId],
        deadIds: [col.a.pieceId],
        result: 'oneDead',
        posA: col.posA, posB: col.posB
      });
      if (col.colorA === 'red') workDeadRed.push(col.a.piece); else workDeadBlack.push(col.a.piece);
    }
  }

  const sortedMoves = [...allMoves].sort((a, b) => a.endT - b.endT);

  const deadPieceIds = new Set();
  sortedMoves.forEach(mv => {
    if (moveDead.get(mv)) deadPieceIds.add(mv.pieceId);
  });

  if (deadPieceIds.size > 0) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = workBoard[r][c];
        if (cell && deadPieceIds.has(cell.id)) workBoard[r][c] = null;
      }
    }
  }

  const failedChain = new Set();
  const successfulMoves = [];
  sortedMoves.forEach(mv => {
    if (moveDead.get(mv)) return;
    if (deadPieceIds.has(mv.pieceId)) return;
    if (failedChain.has(mv.pieceId)) return;

    const sourceCell = workBoard[mv.from.row]?.[mv.from.col];
    if (!sourceCell || sourceCell.id !== mv.pieceId) {
      events.push({ t: mv.endT, type: 'moveEnd', pieceId: mv.pieceId, result: 'blocked', from: mv.from, to: mv.to });
      failedChain.add(mv.pieceId);
      return;
    }

    const targetCell = workBoard[mv.to.row]?.[mv.to.col];
    if (targetCell && targetCell.id === mv.pieceId) return;

    if (targetCell && targetCell.hidden) {
      events.push({ t: mv.endT, type: 'moveEnd', pieceId: mv.pieceId, result: 'blocked', from: mv.from, to: mv.to });
      failedChain.add(mv.pieceId);
      return;
    }

    if (targetCell && !targetCell.hidden) {
      const targetPiece = targetCell.piece;
      if (getPieceColor(mv.piece) === getPieceColor(targetPiece)) {
        events.push({ t: mv.endT, type: 'moveEnd', pieceId: mv.pieceId, result: 'blocked', from: mv.from, to: mv.to });
        failedChain.add(mv.pieceId);
        return;
      }
      let canEat = false;
      if (mv.piece === '炮' || mv.piece === '砲') {
        canEat = true;
      } else {
        canEat = canCapture(mv.piece, targetPiece);
      }
      if (canEat) {
        const tc = getPieceColor(targetPiece);
        if (tc === 'red') workDeadRed.push(targetPiece); else workDeadBlack.push(targetPiece);
        workBoard[mv.to.row][mv.to.col] = { piece: mv.piece, hidden: false, id: mv.pieceId, speedMul: sourceCell.speedMul || 1 };
        workBoard[mv.from.row][mv.from.col] = null;
        events.push({
          t: mv.endT, type: 'moveEnd', pieceId: mv.pieceId, result: 'capture',
          targetPiece, targetPieceId: targetCell.id, from: mv.from, to: mv.to
        });
        successfulMoves.push(mv);
      } else {
        events.push({ t: mv.endT, type: 'moveEnd', pieceId: mv.pieceId, result: 'blocked', from: mv.from, to: mv.to });
        failedChain.add(mv.pieceId);
        return;
      }
    } else {
      workBoard[mv.to.row][mv.to.col] = { piece: mv.piece, hidden: false, id: mv.pieceId, speedMul: sourceCell.speedMul || 1 };
      workBoard[mv.from.row][mv.from.col] = null;
      events.push({ t: mv.endT, type: 'moveEnd', pieceId: mv.pieceId, result: 'ok', from: mv.from, to: mv.to });
      successfulMoves.push(mv);
    }
  });

  const deadMoveSet = new Set();
  allMoves.forEach(mv => {
    if (moveDead.get(mv)) deadMoveSet.add(mv);
  });
  const successfulSet = new Set(successfulMoves);

  allMoves.forEach(mv => {
    if (!deadMoveSet.has(mv) && !successfulSet.has(mv)) return;
    events.push({
      t: mv.startT, type: 'moveStart', pieceId: mv.pieceId,
      from: mv.from, to: mv.to, piece: mv.piece,
      flying: mv.flying, duration: mv.duration, by: mv.by
    });
  });

  const ballsEatenSet = new Set();
  const ballEaters = [];
  successfulMoves.forEach(mv => {
    getMovePathCells(mv).forEach(p => {
      const ball = skillBalls.find(b => b.row === p.row && b.col === p.col);
      if (ball && !ballsEatenSet.has(ball)) {
        ballsEatenSet.add(ball);
        ballEaters.push({ ball, pieceId: mv.pieceId, by: mv.by });
      }
    });
  });
  const finalBalls = skillBalls.filter(b => !ballsEatenSet.has(b));

  const ballEffects = [];
  const goldenBalls = [];
  ballEaters.forEach(be => {
    const isStep = (be.ball.type === '+N' || be.ball.type === '-N');
    events.push({ t: maxT + 100, type: 'ballEaten', ball: be.ball, pieceId: be.pieceId, side: be.by, golden: be.ball.golden, ballType: be.ball.type });
    if (be.ball.golden && !isStep) {
      goldenBalls.push({ ballType: be.ball.type, side: be.by });
    } else {
      const duration = be.ball.golden ? 10 : 5;
      const targetId = isStep ? be.by : be.pieceId;
      ballEffects.push({ type: be.ball.type, targetId, duration, golden: be.ball.golden, by: be.by });
    }
  });

  events.sort((a, b) => a.t - b.t);
  return {
    events, finalBoard: workBoard,
    deadRed: workDeadRed, deadBlack: workDeadBlack,
    totalDuration: maxT + 300,
    finalBalls, ballEffects, goldenBalls
  };
}

function isValidCannonCapture(fromRow, fromCol, toRow, toCol, b) {
  if (fromRow !== toRow && fromCol !== toCol) return false;
  if (fromRow === toRow && fromCol === toCol) return false;
  let count = 0;
  if (fromRow === toRow) {
    const minCol = Math.min(fromCol, toCol), maxCol = Math.max(fromCol, toCol);
    for (let c = minCol + 1; c < maxCol; c++) if (b[fromRow][c] !== null) count++;
  } else {
    const minRow = Math.min(fromRow, toRow), maxRow = Math.max(fromRow, toRow);
    for (let r = minRow + 1; r < maxRow; r++) if (b[r][fromCol] !== null) count++;
  }
  return count === 1;
}

function startPlaybackLoop(script) {
  stopPlaybackLoop();
  pendingPlaybackEvents = [...script.events].sort((a, b) => a.t - b.t);
  playSyncPlaybackStartTime = performance.now();

  function tick() {
    if (!syncPlaying) { playbackRafId = 0; return; }
    const elapsed = performance.now() - playSyncPlaybackStartTime;
    while (pendingPlaybackEvents.length > 0 && pendingPlaybackEvents[0].t <= elapsed) {
      const ev = pendingPlaybackEvents.shift();
      applyPlaybackEvent(ev);
    }
    if (pendingPlaybackEvents.length > 0) {
      playbackRafId = requestAnimationFrame(tick);
    } else {
      playbackRafId = 0;
    }
  }
  playbackRafId = requestAnimationFrame(tick);
}

function stopPlaybackLoop() {
  if (playbackRafId) {
    cancelAnimationFrame(playbackRafId);
    playbackRafId = 0;
  }
  pendingPlaybackEvents = [];
}

function playSyncPlayback(script, replaySavedState) {
  const isReplay = !!replaySavedState;
  const startSyncVersion = syncStateVersion;

  if (!isReplay) {
    lastPlaybackScript = script;
    lastPlaybackStartState = {
      board: board.map(row => row.map(c => c ? { ...c } : null)),
      deadRed: [...deadRed], deadBlack: [...deadBlack],
      skillBalls: skillBalls.map(b => ({ ...b }))
    };
  }

  syncPlaying = true;
  collidedIds.clear();
  renderSyncBar();
  document.getElementById('statusText').textContent = isReplay ? '重播中...' : '播放中...';

  Object.keys(activeAnimations).forEach(pid => {
    cancelAnimationFrame(activeAnimations[pid].rafId);
    delete activeAnimations[pid];
  });
  renderFullBoard();
  for (let id = 0; id < 32; id++) {
    const el = pieceElMap[id];
    if (el) el.style.transition = 'none';
  }
  void document.body.offsetWidth;

  startPlaybackLoop(script);

  syncPlaybackTimer = setTimeout(() => {
    stopPlaybackLoop();
    Object.keys(activeAnimations).forEach(pid => {
      cancelAnimationFrame(activeAnimations[pid].rafId);
      delete activeAnimations[pid];
    });
    for (let id = 0; id < 32; id++) {
      const el = pieceElMap[id];
      if (el) {
        el.style.transition = 'none';
        el.classList.remove('flying-piece');
        el.classList.remove('dead-anim');
        el.style.zIndex = '';
      }
    }
    void document.body.offsetWidth;

    if (isReplay) {
      board = replaySavedState.board;
      deadRed = replaySavedState.deadRed;
      deadBlack = replaySavedState.deadBlack;
      skillBalls = replaySavedState.skillBalls;
      skillEffects = replaySavedState.skillEffects;
      skillTurnCounter = replaySavedState.skillTurnCounter;
      nextBallSpawnAt = replaySavedState.nextBallSpawnAt;
      stepBonus = replaySavedState.stepBonus;
      syncRoundNum = replaySavedState.syncRoundNum;
      currentPlayer = replaySavedState.currentPlayer;
      gameOver = replaySavedState.gameOver;
      gameEndReason = replaySavedState.gameEndReason;
      lastMovedRow = replaySavedState.lastMovedRow;
      lastMovedCol = replaySavedState.lastMovedCol;
      if (replaySavedState.myColor) myColor = replaySavedState.myColor;
      if (replaySavedState.hostColor) hostColor = replaySavedState.hostColor;
      prevDeadRedCount = -1;
      prevDeadBlackCount = -1;

      syncPlaying = false;
      playSyncPlaybackStartTime = 0;
      renderFullBoard();
      renderGraveyards();
      renderSkillBalls();
      renderSyncBar();
      document.getElementById('statusText').textContent = '';
      return;
    }

    if (syncStateVersion !== startSyncVersion) {
      syncPlaying = false;
      playSyncPlaybackStartTime = 0;
      renderFullBoard();
      renderGraveyards();
      renderSkillBalls();
      renderSyncBar();
      if (gameOver) {
        if (!document.getElementById('winnerModal').classList.contains('show')) {
          let winnerColor = null;
          const redCount = countPiecesByColor('red');
          const blackCount = countPiecesByColor('black');
          if (redCount === 0 && blackCount > 0) winnerColor = 'black';
          else if (blackCount === 0 && redCount > 0) winnerColor = 'red';
          showWinnerModal(winnerColor);
        }
        return;
      }
      if (myRole === 'host') {
        if (!gameOver) startSyncRound();
      } else {
        syncMyQueue = []; syncMySubmitted = false; syncOppSubmitted = false;
        selectedRow = -1; selectedCol = -1;
        syncPathPieceId = -1; syncPathPiece = null;
        syncPathCurrentPos = { row: -1, col: -1 };
        clearParabolas(); highlightSyncQueue(); renderSyncBar();
      }
      return;
    }

    board = script.finalBoard.map(row => row.map(c => c ? { ...c } : null));
    deadRed = [...script.deadRed]; deadBlack = [...script.deadBlack];
    prevDeadRedCount = -1; prevDeadBlackCount = -1;

    if (script.finalBalls) { skillBalls = script.finalBalls.map(b => ({ ...b })); renderSkillBalls(); }

    if (!onlineMode || myRole === 'host') {
      if (script.ballEffects) {
        script.ballEffects.forEach(ef => {
          const exists = skillEffects.some(e => e.type === ef.type && e.targetId === ef.targetId && e.by === ef.by);
          if (!exists) addEffect({ ...ef, roundsLeft: ef.duration || 5 });
        });
      }
      if (script.goldenBalls && script.goldenBalls.length > 0) {
        const myGoldens = script.goldenBalls.filter(gb => gb.side === (myRole || 'host'));
        const oppGoldens = script.goldenBalls.filter(gb => gb.side !== (myRole || 'host'));
        if (onlineMode) broadcastSync();
        myGoldens.forEach(gb => {
          setTimeout(() => {
            enterTargetPickMode(gb.ballType, gb.side, (targetId) => {
              const ef = { type: gb.ballType, targetId, roundsLeft: 10, golden: true, by: gb.side };
              addEffect(ef); broadcastSync(); renderFullBoard();
            });
          }, 300);
        });
        oppGoldens.forEach(gb => {
          send({ type: 'askGolden', userId: myUserId, toUserId: opponentUserId, ballType: gb.ballType, side: gb.side, duration: 10 });
        });
      } else {
        if (onlineMode) broadcastSync();
      }
    }

    renderFullBoard(); renderGraveyards();
    syncPlaying = false;
    playSyncPlaybackStartTime = 0;

    const redCount = countPiecesByColor('red');
    const blackCount = countPiecesByColor('black');
    if (redCount === 0 || blackCount === 0) {
      const winnerColor = redCount === 0 ? 'black' : 'red';
      gameOver = true; currentPlayer = null;
      if (onlineMode && myColor) {
        const myWin = (myColor === winnerColor);
        gameEndReason = myWin ? '你赢了！' : '你输了';
        if (myWin) playVictorySound(); else playDefeatSound();
        uploadMyRecord(opponentUserId, myWin ? 1 : 0, myWin ? 0 : 1);
      } else playVictorySound();
      showWinnerModal(winnerColor); stopTimer(); return;
    }
    if (myRole === 'host') startSyncRound();
    else {
      syncMyQueue = []; syncMySubmitted = false; syncOppSubmitted = false;
      selectedRow = -1; selectedCol = -1;
      syncPathPieceId = -1; syncPathPiece = null;
      syncPathCurrentPos = { row: -1, col: -1 };
      clearParabolas(); highlightSyncQueue(); renderSyncBar();
    }
  }, script.totalDuration + 200);
}

function applyPlaybackEvent(ev) {
  switch (ev.type) {
    case 'flip': playFlipSound(); break;
    case 'moveStart':
      playMoveSound();
      animatePieceMove(ev.pieceId, ev.from, ev.to, ev.duration, ev.flying, ev.t);
      break;
    case 'collision': {
      playCollisionSound();
      const ids = ev.pieceIds || [];
      const positions = [ev.posA, ev.posB];
      ids.forEach((pid, idx) => {
        collidedIds.add(pid);
        const el = pieceElMap[pid];
        if (!el) return;
        if (activeAnimations[pid]) {
          cancelAnimationFrame(activeAnimations[pid].rafId);
          delete activeAnimations[pid];
        }
        const p = positions[idx];
        if (p) {
          const left = p.col * CELL_SIZE + OFFSET;
          const top = p.row * CELL_SIZE + OFFSET;
          el.style.transition = 'none';
          el.style.left = left + 'px';
          el.style.top = top + 'px';
          el.style.zIndex = '70';
          el.classList.add('dead-anim');
          // ★ 监听动画结束事件，淡出完成后立即隐藏
          const hideOnEnd = () => {
            if (el.classList.contains('dead-anim')) {
              el.style.display = 'none';
            }
            el.removeEventListener('animationend', hideOnEnd);
          };
          el.addEventListener('animationend', hideOnEnd);
        }
      });
      break;
    }
    case 'ballEaten': playSkillSound(); break;
    case 'moveEnd': {
      if (collidedIds.has(ev.pieceId)) break;
      const moverEl = pieceElMap[ev.pieceId];
      if (!moverEl) break;
      const isAnimating = !!activeAnimations[ev.pieceId];
      if (ev.result === 'capture') {
        playCaptureSound();
        if (!isAnimating && ev.to) {
          const toPos = getPiecePos(ev.to.row, ev.to.col);
          moverEl.style.transition = 'none';
          moverEl.style.left = toPos.left + 'px';
          moverEl.style.top = toPos.top + 'px';
          moverEl.style.zIndex = '';
        }
        if (ev.targetPieceId !== undefined) {
          const deadEl = pieceElMap[ev.targetPieceId];
          if (deadEl && !collidedIds.has(ev.targetPieceId)) {
            deadEl.classList.add('dead-anim');
            deadEl.style.zIndex = '70';
          }
        }
      } else if (ev.result === 'blocked') {
        if (activeAnimations[ev.pieceId]) {
          cancelAnimationFrame(activeAnimations[ev.pieceId].rafId);
          delete activeAnimations[ev.pieceId];
        }
        if (ev.from) {
          const fromPos = getPiecePos(ev.from.row, ev.from.col);
          moverEl.style.transition = 'none';
          moverEl.style.left = fromPos.left + 'px';
          moverEl.style.top = fromPos.top + 'px';
          moverEl.style.zIndex = '';
          moverEl.classList.remove('flying-piece');
        }
      } else {
        if (!isAnimating && ev.to) {
          const toPos = getPiecePos(ev.to.row, ev.to.col);
          moverEl.style.transition = 'none';
          moverEl.style.left = toPos.left + 'px';
          moverEl.style.top = toPos.top + 'px';
        }
        moverEl.style.zIndex = '';
      }
      break;
    }
  }
}

function animatePieceMove(pieceId, from, to, duration, flying, logicalStartT) {
  const el = pieceElMap[pieceId];
  if (!el || !from || !to) return;
  if (activeAnimations[pieceId]) {
    cancelAnimationFrame(activeAnimations[pieceId].rafId);
    delete activeAnimations[pieceId];
  }
  const fromPos = getPiecePos(from.row, from.col);
  const toPos = getPiecePos(to.row, to.col);
  el.style.transition = 'none';
  el.style.left = fromPos.left + 'px';
  el.style.top = fromPos.top + 'px';
  el.style.zIndex = flying ? '60' : '50';
  if (flying) el.classList.add('flying-piece'); else el.classList.remove('flying-piece');

  const logicalStartTime = playSyncPlaybackStartTime + (logicalStartT || 0);
  const animObj = { rafId: 0, pieceId };
  activeAnimations[pieceId] = animObj;

  function step(now) {
    if (activeAnimations[pieceId] !== animObj) return;
    const elapsed = now - logicalStartTime;
    if (elapsed < 0) { animObj.rafId = requestAnimationFrame(step); return; }
    const t = duration > 0 ? Math.min(1, elapsed / duration) : 1;
    const x = fromPos.left + (toPos.left - fromPos.left) * t;
    const y = fromPos.top + (toPos.top - fromPos.top) * t;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    if (t < 1) animObj.rafId = requestAnimationFrame(step);
    else {
      el.style.zIndex = '';
      el.classList.remove('flying-piece');
      delete activeAnimations[pieceId];
    }
  }
  animObj.rafId = requestAnimationFrame(step);
}

function highlightSyncQueue() {
  document.querySelectorAll('.piece.sync-selected').forEach(el => el.classList.remove('sync-selected'));
  document.querySelectorAll('.cell.sync-target').forEach(el => el.classList.remove('sync-target'));
  clearParabolas();
  if (selectedRow !== -1 && selectedCol !== -1) {
    const d = board[selectedRow]?.[selectedCol];
    if (d && !d.hidden && d.id !== undefined) {
      const el = pieceElMap[d.id];
      if (el) el.classList.add('sync-selected');
    }
  }
  syncMyQueue.forEach(act => {
    if (act.type === 'flip') {
      const cell = cellEls[act.row]?.[act.col];
      if (cell) cell.classList.add('sync-target');
    } else if (act.type === 'move' || act.type === 'capture') {
      if (act.pieceId !== undefined && pieceElMap[act.pieceId]) pieceElMap[act.pieceId].classList.add('sync-selected');
      const toCell = cellEls[act.toRow]?.[act.toCol];
      if (toCell) toCell.classList.add('sync-target');
      if (act.type === 'capture') drawParabola(act.fromRow, act.fromCol, act.toRow, act.toCol);
    }
  });
}
function drawParabola(fromRow, fromCol, toRow, toCol) {
  const svg = document.getElementById('boardOverlay');
  if (!svg) return;
  const CELL = 76;
  const x1 = fromCol * CELL + CELL / 2, y1 = fromRow * CELL + CELL / 2;
  const x2 = toCol * CELL + CELL / 2, y2 = toRow * CELL + CELL / 2;
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2 - 40;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
  path.setAttribute('stroke', '#ffaa00'); path.setAttribute('stroke-width', '3');
  path.setAttribute('fill', 'none'); path.setAttribute('stroke-dasharray', '6 4');
  path.setAttribute('opacity', '0.9'); path.classList.add('sync-parabola');
  svg.appendChild(path);
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x2); circle.setAttribute('cy', y2); circle.setAttribute('r', '6');
  circle.setAttribute('fill', '#ffaa00'); circle.setAttribute('opacity', '0.85');
  circle.classList.add('sync-parabola');
  svg.appendChild(circle);
}
function clearParabolas() {
  const svg = document.getElementById('boardOverlay');
  if (svg) svg.innerHTML = '';
}

// ============================================================
//                        游戏逻辑
// ============================================================
function initBoard() {
  const redPieces = ['帥', '仕', '仕', '相', '相', '俥', '俥', '傌', '傌', '炮', '炮', '兵', '兵', '兵', '兵', '兵'];
  const blackPieces = ['將', '士', '士', '象', '象', '車', '車', '馬', '馬', '砲', '砲', '卒', '卒', '卒', '卒', '卒'];
  const allPieces = [...redPieces, ...blackPieces];
  for (let i = allPieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPieces[i], allPieces[j]] = [allPieces[j], allPieces[i]];
  }
  let idx = 0; board = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) { row.push({ piece: allPieces[idx], hidden: true, id: idx, speedMul: 1 }); idx++; }
    board.push(row);
  }
}
function getCellPos(row, col) { return { left: col * CELL_SIZE, top: row * CELL_SIZE }; }
function getPiecePos(row, col) { return { left: col * CELL_SIZE + OFFSET, top: row * CELL_SIZE + OFFSET }; }
function cloneBoard(b) {
  return b.map(row => row.map(cell => cell ? { piece: cell.piece, hidden: cell.hidden, id: cell.id, speedMul: cell.speedMul || 1 } : null));
}

let cellEls = [];
let pieceElMap = {};
let boardDomBuilt = false;

function buildBoardDOM() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  pieceElMap = {}; cellEls = []; boardDomBuilt = true;
  for (let r = 0; r < ROWS; r++) {
    cellEls[r] = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r; cell.dataset.col = c;
      const pos = getCellPos(r, c);
      cell.style.left = pos.left + 'px'; cell.style.top = pos.top + 'px';
      cell.addEventListener('click', () => handleCellClick(r, c));
      boardEl.appendChild(cell);
      cellEls[r][c] = cell;
    }
  }
  for (let id = 0; id < 32; id++) {
    const el = document.createElement('div');
    el.className = 'piece';
    el.style.display = 'none';
    el.style.left = '0px'; el.style.top = '0px';
    el.dataset.id = id;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const rr = parseInt(el.dataset.row), cc = parseInt(el.dataset.col);
      if (!isNaN(rr) && !isNaN(cc)) handleCellClick(rr, cc);
    });
    boardEl.appendChild(el);
    pieceElMap[id] = el;
  }
}
function pushHistory() {
  history.push({
    board: cloneBoard(board), currentPlayer, gameOver,
    deadRed: [...deadRed], deadBlack: [...deadBlack],
    lastMovedRow, lastMovedCol
  });
  if (history.length > 100) history.shift();
  updateButtons();
}
function doUndoLocal() {
  if (history.length === 0) return;
  const prev = history.pop();
  board = prev.board; currentPlayer = prev.currentPlayer; gameOver = prev.gameOver;
  deadRed = prev.deadRed; deadBlack = prev.deadBlack;
  lastMovedRow = prev.lastMovedRow; lastMovedCol = prev.lastMovedCol;
  selectedRow = -1; selectedCol = -1;
  turnStartTs = performance.now();
  renderFullBoard(); renderGraveyards(); updateColorLabel();
}
function undo() {
  if (gameOver) return;
  if (gameMode === 'sync') { showBanner('同步模式不支持悔棋', 'error', 1500); return; }
  if (!onlineMode) { doUndoLocal(); return; }
  if (pendingUndoRequest) { showBanner('已发送悔棋请求，等待确认...', 'info', 2000); return; }
  pendingUndoRequest = true;
  send({ type: 'requestUndo', userId: myUserId });
  showBanner('已发送悔棋请求，等待确认...', 'info', 3000);
}
function renderGraveyards() {
  const redEl = document.getElementById('redGraveyard');
  const blackEl = document.getElementById('blackGraveyard');
  if (deadRed.length !== prevDeadRedCount) {
    redEl.innerHTML = '';
    deadRed.forEach(piece => {
      const el = document.createElement('div');
      el.className = 'dead-piece red-dead'; el.textContent = piece;
      redEl.appendChild(el);
    });
    prevDeadRedCount = deadRed.length;
  }
  if (deadBlack.length !== prevDeadBlackCount) {
    blackEl.innerHTML = '';
    deadBlack.forEach(piece => {
      const el = document.createElement('div');
      el.className = 'dead-piece black-dead'; el.textContent = piece;
      blackEl.appendChild(el);
    });
    prevDeadBlackCount = deadBlack.length;
  }
}
function isMyTurn() {
  if (gameMode === 'sync') return !syncMySubmitted && !syncPlaying;
  if (!onlineMode) return true;
  if (currentPlayer === 'host') return myRole === 'host';
  if (currentPlayer === 'guest') return myRole === 'guest';
  if (currentPlayer === 'red' || currentPlayer === 'black') return myColor === currentPlayer;
  return false;
}
function isHostTurnLocal() {
  if (currentPlayer === 'host') return true;
  if (currentPlayer === 'guest') return false;
  if (currentPlayer === 'red' || currentPlayer === 'black') return hostColor === currentPlayer;
  return false;
}
function getValidMoves(row, col) {
  const piece = board[row]?.[col]?.piece;
  if (!piece || board[row][col].hidden) return [];
  const color = getPieceColor(piece);
  if (color !== currentPlayer) return [];
  const moves = [];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const isCannon = (piece === '炮' || piece === '砲');
  for (const [dr, dc] of dirs) {
    const nr = row + dr, nc = col + dc;
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
    const target = board[nr][nc];
    if (target === null) moves.push({ row: nr, col: nc, isCapture: false });
    else if (!target.hidden) {
      const targetColor = getPieceColor(target.piece);
      if (targetColor !== color) {
        if (isCannon) { if (isValidCannonCapture(row, col, nr, nc, board)) moves.push({ row: nr, col: nc, isCapture: true }); }
        else { if (canCapture(piece, target.piece)) moves.push({ row: nr, col: nc, isCapture: true }); }
      }
    }
  }
  if (isCannon) {
    for (const [dr, dc] of dirs) {
      let r = row + dr, c = col + dc, hasScreen = false;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        const target = board[r][c];
        if (target !== null) {
          if (!hasScreen) hasScreen = true;
          else {
            if (!target.hidden) {
              const targetColor = getPieceColor(target.piece);
              if (targetColor !== color && !moves.some(m => m.row === r && m.col === c)) moves.push({ row: r, col: c, isCapture: true });
            }
            break;
          }
        }
        r += dr; c += dc;
      }
    }
  }
  return moves;
}
function updateCellHighlights() {
  let validMoves = [];
  if (selectedRow !== -1 && selectedCol !== -1 && !gameOver) validMoves = getValidMoves(selectedRow, selectedCol);
  const moveMap = {};
  validMoves.forEach(m => { moveMap[m.row + ',' + m.col] = m.isCapture; });
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cellEl = cellEls[r]?.[c];
      if (!cellEl) continue;
      cellEl.classList.remove('highlight', 'move-target', 'capture-target');
      if (selectedRow === r && selectedCol === c) cellEl.classList.add('highlight');
      const mv = moveMap[r + ',' + c];
      if (mv === true) cellEl.classList.add('capture-target');
      else if (mv === false) cellEl.classList.add('move-target');
    }
  }
}
function refreshSelection() {
  if (!boardDomBuilt) return;
  for (let id = 0; id < 32; id++) { const el = pieceElMap[id]; if (el) el.classList.remove('selected'); }
  if (selectedRow !== -1 && selectedCol !== -1) {
    const d = board[selectedRow]?.[selectedCol];
    if (d && !d.hidden && d.id !== undefined) {
      const el = pieceElMap[d.id];
      if (el) el.classList.add('selected');
    }
  }
  updateCellHighlights();
}
function renderFullBoard() {
  if (!boardDomBuilt) buildBoardDOM();
  const idPos = {};
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const d = board[r][c];
    if (d && d.id !== undefined && d.id !== null) idPos[d.id] = { r, c, data: d };
  }
  for (let id = 0; id < 32; id++) {
    const el = pieceElMap[id];
    if (!el) continue;
    const info = idPos[id];
    if (!info) { if (el.style.display !== 'none') el.style.display = 'none'; continue; }
    const { r, c, data } = info;
    const pos = getPiecePos(r, c);
    el.style.left = pos.left + 'px'; el.style.top = pos.top + 'px';
    el.style.display = '';
    el.dataset.row = r; el.dataset.col = c;
    const wasHidden = el.classList.contains('hidden-piece');
    el.className = 'piece';
    if (data.hidden) { el.classList.add('hidden-piece'); el.textContent = ''; }
    else {
      el.textContent = data.piece;
      const color = getPieceColor(data.piece);
      if (color === 'red') el.classList.add('red-piece');
      else if (color === 'black') el.classList.add('black-piece');
    }
    if (selectedRow === r && selectedCol === c && !data.hidden && !gameOver) el.classList.add('selected');
    if (lastMovedRow === r && lastMovedCol === c) el.classList.add('last-moved');
    if (wasHidden && !data.hidden) playAnim(el, 'flip-in');
    if (gameMode === 'sync') {
      const efs = getPieceEffects(id);
      if (efs.length > 0) {
        const badge = document.createElement('span');
        badge.className = 'effect-badge';
        const types = efs.map(e => e.type).join('');
        badge.textContent = types;
        badge.classList.add(types[0] === '+' ? 'plus' : 'minus');
        el.appendChild(badge);
      }
    }
    if (targetPickMode && !data.hidden) el.classList.add('target-pick-hint');
  }
  updateCellHighlights(); updateTurnIcon(); updateButtons();
  if (gameMode === 'sync' && !syncPlaying) highlightSyncQueue();
}
function playAnim(el, cls) {
  el.classList.remove(cls); void el.offsetWidth;
  el.classList.add(cls);
  const onEnd = () => { el.classList.remove(cls); el.removeEventListener('animationend', onEnd); };
  el.addEventListener('animationend', onEnd);
}
function updateTurnIcon() {
  const el = document.getElementById('turnIcon');
  const st = document.getElementById('statusText');
  el.className = 'turn-icon';
  if (gameOver) { el.classList.add('unknown-icon'); el.textContent = ''; st.textContent = gameEndReason || '对局结束'; return; }
  if (gameMode === 'sync') { el.classList.add('unknown-icon'); el.textContent = ''; return; }
  if (currentPlayer === 'red') { el.classList.add('red-icon'); el.textContent = '帥'; }
  else if (currentPlayer === 'black') { el.classList.add('black-icon'); el.textContent = '將'; }
  else { el.classList.add('unknown-icon'); el.textContent = ''; }
  if (!onlineMode) {
    if (currentPlayer === 'red') st.textContent = '轮到红方';
    else if (currentPlayer === 'black') st.textContent = '轮到黑方';
    else st.textContent = '请翻棋开局';
  } else if (currentPlayer) st.textContent = isMyTurn() ? '★ 轮到你走棋' : '等待对方走棋...';
  else st.textContent = '';
}
function updateButtons() {
  const yieldBtn = document.getElementById('yieldBtn');
  const undoBtn = document.getElementById('undoBtn');
  const drawBtn = document.getElementById('drawBtn');
  const resignBtn = document.getElementById('resignBtn');
  if (gameOver) { yieldBtn.disabled = true; undoBtn.disabled = true; drawBtn.disabled = true; resignBtn.disabled = true; return; }
  if (!onlineMode) { undoBtn.disabled = history.length === 0; return; }
  yieldBtn.disabled = !(myRole === 'host' && currentPlayer === 'host');
  undoBtn.disabled = history.length === 0 || gameMode === 'sync';
  drawBtn.disabled = false; resignBtn.disabled = false;
}
function countPiecesByColor(color) {
  let n = 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const cell = board[r][c];
    if (cell && cell.piece && getPieceColor(cell.piece) === color) n++;
  }
  return n;
}
function checkGameOver() {
  const redCount = countPiecesByColor('red');
  const blackCount = countPiecesByColor('black');
  if (redCount === 0 || blackCount === 0) {
    const winnerColor = redCount === 0 ? 'black' : 'red';
    gameOver = true; currentPlayer = null;
    if (onlineMode && myColor) {
      const myWin = (myColor === winnerColor);
      const reason = myWin ? '你赢了！' : '你输了';
      gameEndReason = reason + `（${winnerColor === 'red' ? '红方' : '黑方'}获胜）`;
      if (!recordUploaded) uploadMyRecord(opponentUserId, myWin ? 1 : 0, myWin ? 0 : 1);
    } else gameEndReason = (winnerColor === 'red' ? '红方胜' : '黑方胜');
    if (onlineMode && myColor) { if (myColor === winnerColor) playVictorySound(); else playDefeatSound(); }
    else playVictorySound();
    showWinnerModal(winnerColor); stopTimer(); return true;
  }
  return false;
}

// ============================================================
//                        点击处理
// ============================================================
function handleCellClick(row, col) {
  if (targetPickMode) { handleTargetPickClick(row, col); return; }
  if (gameOver) return;
  if (isReconnecting) { showBanner('正在重连，请稍候...', 'error', 1500); return; }
  if (gameMode === 'sync') { handleSyncCellClick(row, col); return; }
  if (onlineMode && !isMyTurn()) {
    if (currentPlayer === 'host') showBanner('等待房主先翻棋...', 'info', 1000);
    else if (currentPlayer === 'guest') showBanner('等待客机先翻棋...', 'info', 1000);
    else showBanner('还没轮到你走棋', 'info', 1000);
    return;
  }
  const cellData = board[row][col];
  if (cellData === null) {
    if (selectedRow === -1 || selectedCol === -1) return;
    const fromRow = selectedRow, fromCol = selectedCol;
    const movingPiece = board[fromRow][fromCol]?.piece;
    if (!movingPiece) { selectedRow = -1; selectedCol = -1; refreshSelection(); return; }
    const movingColor = getPieceColor(movingPiece);
    if (movingColor !== currentPlayer) { selectedRow = -1; selectedCol = -1; refreshSelection(); return; }
    const rowDiff = Math.abs(fromRow - row), colDiff = Math.abs(fromCol - col);
    if (rowDiff + colDiff !== 1) { refreshSelection(); return; }
    if (onlineMode && myRole === 'guest') {
      commitTurnTime(); pushHistory();
      executeMove(fromRow, fromCol, row, col, movingPiece, null, true);
      send({ type: 'move', userId: myUserId, from: { row: fromRow, col: fromCol }, to: { row, col } });
      return;
    }
    commitTurnTime(); pushHistory();
    executeMove(fromRow, fromCol, row, col, movingPiece, null);
    return;
  }
  if (cellData.hidden) {
    if (selectedRow !== -1) { selectedRow = -1; selectedCol = -1; refreshSelection(); return; }
    if (onlineMode && myRole === 'guest') {
      commitTurnTime(); pushHistory();
      executeFlip(row, col, true);
      send({ type: 'flip', userId: myUserId, row, col });
      return;
    }
    commitTurnTime(); pushHistory();
    executeFlip(row, col);
    return;
  }
  const pieceColor = getPieceColor(cellData.piece);
  if (currentPlayer !== 'red' && currentPlayer !== 'black') return;
  if (pieceColor === currentPlayer) {
    if (selectedRow === row && selectedCol === col) { selectedRow = -1; selectedCol = -1; }
    else { selectedRow = row; selectedCol = col; }
    refreshSelection(); return;
  }
  if (selectedRow !== -1 && selectedCol !== -1) {
    const fromRow = selectedRow, fromCol = selectedCol;
    const movingPiece = board[fromRow][fromCol]?.piece;
    if (!movingPiece) { selectedRow = -1; selectedCol = -1; refreshSelection(); return; }
    const movingColor = getPieceColor(movingPiece);
    if (movingColor !== currentPlayer) { selectedRow = -1; selectedCol = -1; refreshSelection(); return; }
    const targetPiece = cellData.piece;
    if (movingPiece === '炮' || movingPiece === '砲') {
      if (!isValidCannonCapture(fromRow, fromCol, row, col, board)) { refreshSelection(); return; }
    } else {
      if (!canCapture(movingPiece, targetPiece)) { refreshSelection(); return; }
      const rowDiff = Math.abs(fromRow - row), colDiff = Math.abs(fromCol - col);
      if (rowDiff + colDiff !== 1) { refreshSelection(); return; }
    }
    if (onlineMode && myRole === 'guest') {
      commitTurnTime(); pushHistory();
      executeMove(fromRow, fromCol, row, col, movingPiece, targetPiece, true);
      send({ type: 'move', userId: myUserId, from: { row: fromRow, col: fromCol }, to: { row, col } });
      return;
    }
    commitTurnTime(); pushHistory();
    executeMove(fromRow, fromCol, row, col, movingPiece, targetPiece);
    return;
  }
  refreshSelection();
}

function handleSyncCellClick(row, col) {
  if (syncPlaying) { showBanner('播放中，请稍候', 'info', 1200); return; }
  if (syncMySubmitted) { showBanner('已提交，等待对手', 'info', 1200); return; }
  const cellData = board[row]?.[col];
  if (cellData && cellData.hidden) {
    if (syncPathPieceId !== -1) {
      syncPathPieceId = -1; syncPathPiece = null;
      selectedRow = -1; selectedCol = -1; highlightSyncQueue(); return;
    }
    const idx = syncMyQueue.findIndex(a => a.type === 'flip' && a.row === row && a.col === col);
    if (idx >= 0) { removeSyncActionWithDeps(idx); return; }
    if (!cellData.piece) { showBanner('这里没有棋子', 'error', 1200); return; }
    const myBonus = stepBonus[myRole] || 0;
    const maxSteps = Math.max(1, syncStepsPerRound + myBonus);
    if (syncMyQueue.length >= maxSteps) { showBanner('已达本回合步数上限', 'error', 1500); return; }
    const act = { type: 'flip', row, col };
    const conflict = checkSyncQueueConflict(act);
    if (conflict) { showBanner(conflict, 'error', 1500); return; }
    syncMyQueue.push(act);
    selectedRow = -1; selectedCol = -1;
    highlightSyncQueue(); renderSyncBar(); return;
  }
  if (syncPathPieceId !== -1) {
    if (cellData && !cellData.hidden && cellData.id === syncPathPieceId &&
      !(syncPathCurrentPos.row === row && syncPathCurrentPos.col === col)) {
      syncPathPieceId = -1; syncPathPiece = null;
      selectedRow = -1; selectedCol = -1; highlightSyncQueue(); return;
    }
    if (syncPathCurrentPos.row === row && syncPathCurrentPos.col === col) {
      syncPathPieceId = -1; syncPathPiece = null;
      selectedRow = -1; selectedCol = -1; highlightSyncQueue(); return;
    }
    const rd = Math.abs(syncPathCurrentPos.row - row);
    const cd = Math.abs(syncPathCurrentPos.col - col);
    const dist = rd + cd;
    const isCannonPiece = (syncPathPiece === '炮' || syncPathPiece === '砲');
    const targetCell = board[row]?.[col];
    const isTargetEnemy = targetCell && !targetCell.hidden &&
      getPieceColor(targetCell.piece) !== getPieceColor(syncPathPiece);
    const isCannonCaptureClick = isCannonPiece && isTargetEnemy &&
      (syncPathCurrentPos.row === row || syncPathCurrentPos.col === col) && dist >= 2;
    if (dist !== 1 && !isCannonCaptureClick) {
      syncPathPieceId = -1; syncPathPiece = null;
      selectedRow = -1; selectedCol = -1; highlightSyncQueue(); return;
    }
    const myBonus = stepBonus[myRole] || 0;
    const maxSteps = Math.max(1, syncStepsPerRound + myBonus);
    if (syncMyQueue.length >= maxSteps) { showBanner('已达本回合步数上限', 'error', 1500); return; }
    if (targetCell && targetCell.hidden) { showBanner('不能移动到未翻开的棋子上', 'error', 1200); return; }
    let act;
    if (targetCell === null || targetCell === undefined) {
      act = { type: 'move', fromRow: syncPathCurrentPos.row, fromCol: syncPathCurrentPos.col, toRow: row, toCol: col, pieceId: syncPathPieceId };
    } else {
      const targetColor = getPieceColor(targetCell.piece);
      const fromColor = getPieceColor(syncPathPiece);
      if (targetColor === fromColor) { showBanner('不能移动到己方棋子', 'error', 1200); return; }
      const projected = getProjectedBoard();
      let canEat = false;
      if (isCannonPiece) canEat = isValidCannonCapture(syncPathCurrentPos.row, syncPathCurrentPos.col, row, col, projected);
      else canEat = canCapture(syncPathPiece, targetCell.piece);
      if (!canEat) { showBanner('无法吃这个棋子', 'error', 1200); return; }
      act = { type: 'capture', fromRow: syncPathCurrentPos.row, fromCol: syncPathCurrentPos.col, toRow: row, toCol: col, pieceId: syncPathPieceId };
    }
    const conflict = checkSyncQueueConflict(act);
    if (conflict) { showBanner(conflict, 'error', 1500); return; }
    syncMyQueue.push(act);
    syncPathCurrentPos = { row, col };
    selectedRow = row; selectedCol = col;
    highlightSyncQueue(); renderSyncBar(); return;
  }
  if (cellData && !cellData.hidden) {
    const mvIdx = syncMyQueue.findIndex(a =>
      (a.type === 'move' || a.type === 'capture') && a.fromRow === row && a.fromCol === col);
    if (mvIdx >= 0) { removeSyncActionWithDeps(mvIdx); return; }
  }
  if (cellData && !cellData.hidden) {
    const color = getPieceColor(cellData.piece);
    if (color !== myColor) { showBanner('只能操作自己的棋子', 'error', 1200); return; }
    syncPathPieceId = cellData.id;
    syncPathPiece = cellData.piece;
    syncPathCurrentPos = { row, col };
    selectedRow = row; selectedCol = col;
    highlightSyncQueue(); return;
  }
}

function getProjectedBoard(excludeIdx) {
  const proj = board.map(row => row.map(c => c ? { ...c } : null));
  syncMyQueue.forEach((a, i) => {
    if (i === excludeIdx) return;
    if (a.type === 'move' || a.type === 'capture') {
      const fromCell = proj[a.fromRow]?.[a.fromCol];
      if (fromCell) { proj[a.toRow][a.toCol] = fromCell; proj[a.fromRow][a.fromCol] = null; }
    }
  });
  return proj;
}

function executeMove(fromRow, fromCol, toRow, toCol, movingPiece, targetPiece, skipBroadcast) {
  const targetColor = targetPiece ? getPieceColor(targetPiece) : null;
  if (targetPiece) { if (targetColor === 'red') deadRed.push(targetPiece); else if (targetColor === 'black') deadBlack.push(targetPiece); }
  const movingId = board[fromRow][fromCol]?.id;
  const speedMul = board[fromRow][fromCol]?.speedMul || 1;
  board[toRow][toCol] = { piece: movingPiece, hidden: false, id: movingId, speedMul };
  board[fromRow][fromCol] = null;
  lastMovedRow = toRow; lastMovedCol = toCol;
  selectedRow = -1; selectedCol = -1;
  if (targetPiece) playCaptureSound(); else playMoveSound();
  checkGameOver();
  if (!gameOver) { currentPlayer = (currentPlayer === 'red' ? 'black' : 'red'); turnStartTs = performance.now(); }
  if (!gameOver) onTurnAdvance();
  renderFullBoard(); renderGraveyards();
  if (!skipBroadcast && onlineMode && myRole === 'host') broadcastSync();
}
function executeFlip(row, col, skipBroadcast) {
  const cellData = board[row][col];
  if (!cellData || !cellData.hidden) return;
  cellData.hidden = false;
  const flippedColor = getPieceColor(cellData.piece);
  playFlipSound();
  if (currentPlayer === 'host') {
    hostColor = flippedColor;
    if (onlineMode && myRole === 'host') myColor = flippedColor;
    currentPlayer = (flippedColor === 'red' ? 'black' : 'red');
  } else if (currentPlayer === 'guest') {
    hostColor = (flippedColor === 'red' ? 'black' : 'red');
    if (onlineMode) { if (myRole === 'guest') myColor = flippedColor; else if (myRole === 'host') myColor = hostColor; }
    currentPlayer = (flippedColor === 'red' ? 'black' : 'red');
  } else if (currentPlayer === 'red' || currentPlayer === 'black') currentPlayer = (currentPlayer === 'red' ? 'black' : 'red');
  selectedRow = -1; selectedCol = -1;
  checkGameOver();
  if (!gameOver) turnStartTs = performance.now();
  if (!gameOver) onTurnAdvance();
  renderFullBoard(); renderGraveyards(); updateColorLabel();
  if (!skipBroadcast && onlineMode && myRole === 'host') broadcastSync();
}
function handleGuestAction(msg) {
  if (isHostTurnLocal()) { broadcastSync(); return; }
  if (msg.type === 'move') {
    const { from, to } = msg;
    if (!board[from.row] || !board[from.row][from.col]) { broadcastSync(); return; }
    const movingPiece = board[from.row][from.col].piece;
    if (!movingPiece) { broadcastSync(); return; }
    if (getPieceColor(movingPiece) !== currentPlayer) { broadcastSync(); return; }
    const targetPiece = board[to.row]?.[to.col]?.piece || null;
    if (targetPiece && getPieceColor(targetPiece) === getPieceColor(movingPiece)) { broadcastSync(); return; }
    const rd = Math.abs(from.row - to.row), cd = Math.abs(from.col - to.col);
    if (movingPiece === '炮' || movingPiece === '砲') {
      if (targetPiece) { if (!isValidCannonCapture(from.row, from.col, to.row, to.col, board)) { broadcastSync(); return; } }
      else { if (rd + cd !== 1) { broadcastSync(); return; } }
    } else {
      if (targetPiece && !canCapture(movingPiece, targetPiece)) { broadcastSync(); return; }
      if (rd + cd !== 1) { broadcastSync(); return; }
    }
    commitTurnTime(); pushHistory();
    executeMove(from.row, from.col, to.row, to.col, movingPiece, targetPiece);
  } else if (msg.type === 'flip') {
    const { row, col } = msg;
    if (!board[row] || !board[row][col] || !board[row][col].hidden) { broadcastSync(); return; }
    if (currentPlayer !== 'host' && currentPlayer !== 'guest' && currentPlayer !== 'red' && currentPlayer !== 'black') { broadcastSync(); return; }
    commitTurnTime(); pushHistory();
    executeFlip(row, col);
  }
}
function resetGame() {
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  lastOpponentUserId = '';
  initBoard(); resetSkillState();
  currentPlayer = 'host';
  gameOver = false; gameEndReason = '';
  selectedRow = -1; selectedCol = -1;
  lastMovedRow = -1; lastMovedCol = -1;
  deadRed = []; deadBlack = []; history = [];
  pendingUndoRequest = false; pendingDrawRequest = false; recordUploaded = false;
  syncRoundNum = 0; syncMyQueue = []; syncMySubmitted = false; syncOppSubmitted = false; syncPlaying = false;
  syncPathPieceId = -1; syncPathPiece = null; syncPathCurrentPos = { row: -1, col: -1 };
  lastPlaybackScript = null; lastPlaybackStartState = null;
  lastActionSent = null;
  resetTimersForNewGame();
  buildBoardDOM(); renderFullBoard(); renderGraveyards(); renderSkillBalls();
  const log = document.getElementById('chatLog'); if (log) log.innerHTML = '';
  if (gameMode === 'sync') {
    document.getElementById('syncBar').classList.remove('hidden');
    renderSyncBar(); startSyncRound();
  } else {
    document.getElementById('syncBar').classList.add('hidden');
    startTimer();
  }
}
document.getElementById('resetBtn').addEventListener('click', () => {
  if (onlineMode) {
    if (myRole === 'host') { if (confirm('确定重新开局？')) startGameAsHost(); }
    else showBanner('只有房主可以重新开局', 'error', 2000);
  } else resetGame();
});
document.getElementById('undoBtn').addEventListener('click', undo);

// ============================================================
//                    让先 / 和棋 / 认输
// ============================================================
function yieldFirst() {
  if (gameOver) return;
  if (gameMode === 'sync') { showBanner('同步模式无需让先', 'info', 1500); return; }
  if (!onlineMode) { showBanner('离线模式无需让先', 'error', 1500); return; }
  if (myRole !== 'host') { showBanner('只有房主可以让先', 'error', 1500); return; }
  if (currentPlayer !== 'host') { showBanner('开局后才能让先', 'error', 1500); return; }
  currentPlayer = 'guest'; turnStartTs = performance.now();
  broadcastSync(); send({ type: 'yieldFirst', userId: myUserId });
  showBanner('已让先给对手', 'info', 1500);
  renderFullBoard();
}
function requestDraw() {
  if (gameOver) return;
  if (!onlineMode) { showBanner('离线模式无法和棋', 'error', 1500); return; }
  if (pendingDrawRequest) { showBanner('已发送和棋请求，等待回应...', 'info', 1500); return; }
  pendingDrawRequest = true;
  send({ type: 'requestDraw', userId: myUserId });
  showBanner('已发送和棋请求，等待对方回应...', 'info', 3000);
}
function resign() {
  if (gameOver) return;
  if (!confirm('确定认输吗？')) return;
  if (onlineMode) { send({ type: 'resign', userId: myUserId }); endGame('你认输了', 'loss'); }
  else endGame('你认输了', 'loss');
}
function endGame(reason, type) {
  if (gameOver) return;
  gameOver = true; currentPlayer = null; gameEndReason = reason;
  selectedRow = -1; selectedCol = -1;
  stopTimer();
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  lastOpponentUserId = '';
  renderFullBoard();
  showBanner(reason, 'info', 5000);
  if (onlineMode && !recordUploaded) {
    let myWin = 0, oppWin = 0;
    if (type === 'win') { myWin = 1; oppWin = 0; }
    else if (type === 'loss') { myWin = 0; oppWin = 1; }
    uploadMyRecord(opponentUserId, myWin, oppWin);
  }
  if (type === 'win') {
    playVictorySound();
    const winnerColor = myColor || hostColor || 'red';
    showWinnerModal(winnerColor);
  } else if (type === 'loss') {
    playDefeatSound();
    const winnerColor = (myColor === 'red') ? 'black' : 'red';
    showWinnerModal(winnerColor);
  } else {
    playDrawSound();
    showWinnerModal(null);
  }
}

// ============================================================
//                    胜利弹窗
// ============================================================
function getPlayerNameByColor(color) {
  if (!onlineMode) return color === 'red' ? '红方' : '黑方';
  if (hostColor === color) return myRole === 'host' ? (myUsername || '房主') : (opponentUsername || '房主');
  else return myRole === 'guest' ? (myUsername || '客机') : (opponentUsername || '客机');
}
function showWinnerModal(winnerColor) {
  hideBanner();
  const modal = document.getElementById('winnerModal');
  const iconEl = document.getElementById('winnerIcon');
  const titleEl = document.getElementById('winnerTitle');
  if (!modal || !iconEl || !titleEl) return;
  titleEl.className = 'winner-title';
  if (!winnerColor) {
    iconEl.textContent = '🤝'; titleEl.textContent = '和棋';
    titleEl.classList.add('draw-title');
  } else {
    iconEl.textContent = '🏆';
    const colorName = winnerColor === 'red' ? '红方' : '黑方';
    const playerName = getPlayerNameByColor(winnerColor);
    titleEl.textContent = `${colorName}（${playerName}）获胜！`;
    titleEl.classList.add(winnerColor === 'red' ? 'red-win' : 'black-win');
  }
  modal.classList.add('show');
}
function closeWinnerModal() { document.getElementById('winnerModal').classList.remove('show'); }

// ============================================================
//                    战绩上传 & 排行榜
// ============================================================
async function getUserCustomData(userId) {
  try {
    const res = await fetch(`${SERVER_URL}/get-custom-data-by-id`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (data.success) return data.data.customData || '';
    throw new Error(data.message || '获取数据失败');
  } catch (e) { console.error('getUserCustomData:', e); throw e; }
}
async function updateUserCustomData(userId, customData) {
  const res = await fetch(`${SERVER_URL}/update-custom-data`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, customData })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || '更新失败');
}
function updateRecord(currentData, newRecord) {
  if (!currentData) return newRecord;
  const recordKey = newRecord.split(':')[0];
  const records = currentData.split(';');
  let found = false;
  const updated = records.map(record => {
    if (record.startsWith(recordKey + ':')) {
      found = true;
      const [oldW, oldL] = record.split(':')[1].split(',').map(Number);
      const [newW, newL] = newRecord.split(':')[1].split(',').map(Number);
      return `${recordKey}:${oldW + newW},${oldL + newL}`;
    }
    return record;
  });
  if (!found) updated.push(newRecord);
  return updated.filter(r => r).join(';');
}
async function uploadMyRecord(oppUserId, myWin, oppWin) {
  if (recordUploaded) return;
  if (!myUserId || !oppUserId) return;
  if (!/^[a-zA-Z0-9_-]+$/.test(oppUserId)) { console.warn('对方 userId 格式无效，跳过上传:', oppUserId); return; }
  recordUploaded = true;
  try {
    const record = `chessflip_record_with_${oppUserId}:${myWin},${oppWin}`;
    const currentData = await getUserCustomData(myUserId);
    const updated = updateRecord(currentData, record);
    await updateUserCustomData(myUserId, updated);
    console.log('象棋翻棋战绩已上传:', record);
  } catch (e) {
    console.error('上传战绩失败:', e);
    recordUploaded = false;
  }
}
async function showRecords() {
  hideAll(); recordsPanel.classList.remove('hidden');
  document.getElementById('recordsHint').textContent = '';
  await refreshRecords();
}
async function refreshRecords() {
  const listEl = document.getElementById('recordsList');
  const hintEl = document.getElementById('recordsHint');
  listEl.innerHTML = '<div style="text-align:center; padding:20px; color:#5a3f28;">加载中...</div>';
  hintEl.textContent = '';
  try {
    const res = await fetch(`${SERVER_URL}/get-all-custom-data`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || '获取失败');
    const users = data.data || [];
    const stats = [];
    users.forEach(user => {
      if (!user.customData) return;
      const records = user.customData.split(';');
      let totalW = 0, totalL = 0, matches = 0;
      records.forEach(rec => {
        if (!rec.startsWith('chessflip_record_with_')) return;
        const parts = rec.split(':');
        if (parts.length !== 2) return;
        const [w, l] = parts[1].split(',').map(Number);
        if (isNaN(w) || isNaN(l)) return;
        totalW += w; totalL += l; matches++;
      });
      if (matches > 0) stats.push({
        username: user.username || '未知用户',
        wins: totalW, losses: totalL,
        matches: totalW + totalL,
        winRate: (totalW + totalL) > 0 ? Math.round(totalW / (totalW + totalL) * 100) : 0
      });
    });
    stats.sort((a, b) => b.wins - a.wins || b.winRate - a.winRate);
    if (stats.length === 0) {
      listEl.innerHTML = '<div style="text-align:center; padding:20px; color:#5a3f28;">暂无象棋翻棋战绩</div>';
      return;
    }
    listEl.innerHTML = '';
    stats.forEach((s, i) => {
      const item = document.createElement('div');
      item.className = 'record-item';
      let rankCls = '';
      if (i === 0) rankCls = 'gold';
      else if (i === 1) rankCls = 'silver';
      else if (i === 2) rankCls = 'bronze';
      item.innerHTML = `
        <div class="rank ${rankCls}">${i + 1}</div>
        <div class="name">${escapeHtml(s.username)}</div>
        <div class="stats">胜 ${s.wins} / 负 ${s.losses}<br>胜率 ${s.winRate}%</div>
      `;
      listEl.appendChild(item);
    });
  } catch (e) {
    console.error('加载排行榜失败:', e);
    listEl.innerHTML = `<div style="text-align:center; padding:20px; color:#b32b2b;">加载失败：${e.message}</div>`;
  }
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ============================================================
//                    动态 UI 注入
// ============================================================
function injectSkillUI() {
  if (document.getElementById('skillStyle')) return;
  const style = document.createElement('style');
  style.id = 'skillStyle';
  style.textContent = `
    .skill-ball {
      position: absolute; width: 68px; height: 68px;
      border-radius: 50%; display: flex; justify-content: center; align-items: center;
      font-size: 22px; font-weight: 900; font-family: 'Segoe UI', sans-serif;
      pointer-events: none; z-index: 8;
      box-shadow: 0 4px 8px rgba(0,0,0,0.5), inset 0 -3px 6px rgba(0,0,0,0.3);
      animation: ballPulse 1.6s ease-in-out infinite;
    }
    .skill-ball.plus { background: radial-gradient(circle at 30% 30%, #ff9090, #e63946 60%, #8b1e26); color: #fff; text-shadow: 0 2px 3px rgba(0,0,0,0.6); }
    .skill-ball.minus { background: radial-gradient(circle at 30% 30%, #90b8ff, #457b9d 60%, #1d3557); color: #fff; text-shadow: 0 2px 3px rgba(0,0,0,0.6); }
    .skill-ball.golden { box-shadow: 0 0 0 4px #ffd700, 0 0 20px #ffd700, 0 4px 8px rgba(0,0,0,0.5); animation: ballPulseGold 1.2s ease-in-out infinite; }
    @keyframes ballPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
    @keyframes ballPulseGold { 0%,100% { transform: scale(1); box-shadow: 0 0 0 4px #ffd700, 0 0 20px #ffd700, 0 4px 8px rgba(0,0,0,0.5); } 50% { transform: scale(1.12); box-shadow: 0 0 0 6px #ffe066, 0 0 30px #ffe066, 0 4px 8px rgba(0,0,0,0.5); } }
    .piece .effect-badge {
      position: absolute; top: -4px; right: -4px; min-width: 20px; height: 18px;
      border-radius: 9px; font-size: 10px; font-weight: bold;
      font-family: 'Segoe UI', sans-serif;
      display: flex; align-items: center; justify-content: center;
      padding: 0 4px; color: #fff; letter-spacing: 0.5px; z-index: 15;
      border: 1px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.5);
      pointer-events: none;
    }
    .piece .effect-badge.plus { background: rgba(230,57,70,0.85); }
    .piece .effect-badge.minus { background: rgba(69,123,157,0.85); }
    .piece.target-pick-hint { cursor: crosshair; animation: targetPickPulse 1s ease-in-out infinite; }
    @keyframes targetPickPulse {
      0%,100% { box-shadow: 0 7px 0 #8a6437, 0 8px 0 #5a3f22, 0 0 16px 3px rgba(255,215,0,0.6); }
      50% { box-shadow: 0 7px 0 #8a6437, 0 8px 0 #5a3f22, 0 0 26px 8px rgba(255,215,0,0.95); }
    }

    /* ★ 棋桌右上角按钮 */
    .game-panel { position: relative; }
    .game-corner-btns {
      position: absolute;
      top: 30px;
      right: 30px;
      display: flex;
      gap: 6px;
      z-index: 50;
    }
    .game-corner-btns .btn {
      font-size: 0.72rem;
      padding: 4px 10px;
      white-space: nowrap;
    }

    /* ★ 炮飞行时不放大，仅保留阴影高亮 */
    .piece.flying-piece {
      animation: none !important;
      transform: none !important;
      filter: drop-shadow(0 12px 12px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 20px rgba(255, 220, 120, 0.6));
    }

    /* ★ 碰撞死亡动画时长缩短 */
    .piece.dead-anim {
      animation: pieceDeath 0.18s ease-out forwards;
      pointer-events: none;
    }
    @keyframes pieceDeath {
      0% { transform: scale(1); opacity: 1; filter: brightness(1); }
      50% { transform: scale(1.3); opacity: 0.9; filter: brightness(2.5); }
      100% { transform: scale(0.2); opacity: 0; filter: brightness(0.5); }
    }
  `;
  document.head.appendChild(style);
}

// ============================================================
//                    页面加载 / 卸载
// ============================================================
window.addEventListener('load', async () => {
  injectSkillUI();
  hideAll();
  menuPanel.classList.remove('hidden');
  await loadUserInfo();
  updateLobbyUserLabel();
  connectLobby();
});
window.addEventListener('beforeunload', () => {
  window._pageUnloading = true;
  sendLobby({ type: 'exit', userId: myUserId, username: myUsername });
});