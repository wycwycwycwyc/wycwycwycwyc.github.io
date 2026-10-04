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
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => { });
  }
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

let roomHeartbeatTimer = null;
let oppLastSeen = 0;
let roomHeartbeatCheckTimer = null;
const HEARTBEAT_SEND_MS = 5000;
const HEARTBEAT_TIMEOUT_MS = 15000;

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
  '兵': 1.0, '卒': 1.0,
  '炮': 1.0, '砲': 1.0,
  '馬': 1.0, '傌': 1.0,
  '車': 1.0, '俥': 1.0,
  '士': 1.0, '仕': 1.0,
  '象': 1.0, '相': 1.0,
  '將': 1.0, '帥': 1.0
};

const FLYING_PIECES = ['炮', '砲'];

function isFlying(piece) { return FLYING_PIECES.includes(piece); }
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

// 碰撞判定专用：炮按普通等级判
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

let timeSettings = {
  enabled: true,
  totalMs: 15 * 60 * 1000,
  stepMs: 60 * 1000
};
let hostTimeLeft = 0;
let guestTimeLeft = 0;
let turnStartTs = 0;
let timerInterval = null;
let timeoutHandled = false;

const CHAT_PRESETS = [
  '请神速些吧！',
  '容我再思量思量！',
  '一着不慎，满盘皆输！',
  '再与我对弈一局？',
  '观棋不语真君子，落子无悔大丈夫！',
  '胜败乃兵家常事！',
  '快点吧，等的花儿都谢了！',
  '对不起，刚才卡了！',
  '下次再玩吧，我要走了。'
];
// ============================================================
async function fetchUserIdByUsername(username) {
  const res = await fetch(`${SERVER_URL}/get-user-id-by-username`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username })
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
    try {
      uid = await fetchUserIdByUsername(uname);
      localStorage.setItem('userid', uid);
    } catch (e) { console.error('获取 userId 失败:', e); }
  }
  if (!uid) {
    uid = 'p' + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem('userid', uid); } catch (e) { }
  }
  if (!uname) {
    uname = '玩家' + uid.slice(-4);
    try { localStorage.setItem('username', uname); } catch (e) { }
  }
  myUserId = uid;
  myUsername = uname;
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
  hideAll();
  gamePanel.classList.remove('hidden');
  onlineMode = false;
  gameMode = 'classic';
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
}

function showOnline() {
  hideAll();
  lobbyPanel.classList.remove('hidden');
  document.getElementById('lobbyHint').textContent = '';
  updateLobbyUserLabel();
  connectLobby();
  setTimeout(() => queryOnlineUsers(), 200);
}

function backToMenu() {
  hideAll();
  menuPanel.classList.remove('hidden');
}

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
//                    大厅
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
    if (!window._pageUnloading) {
      setTimeout(() => {
        if (!window._pageUnloading) connectLobby();
      }, 3000);
    }
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
  let msg;
  try { msg = JSON.parse(raw); } catch (e) { return; }

  switch (msg.type) {
    case 'hello':
      if (msg.userId === myUserId) break;
      onlineUsers[msg.userId] = {
        username: msg.username || msg.userId,
        status: onlineUsers[msg.userId] ? onlineUsers[msg.userId].status : 'idle'
      };
      renderOnlineUsers();
      break;
    case 'lobbyQuery':
      if (msg.userId === myUserId) break;
      sendLobby({
        type: 'lobbyQueryReply',
        toUserId: msg.userId,
        userId: myUserId,
        username: myUsername,
        status: (gameStarted && !gameOver && onlineMode) ? 'busy' : 'idle'
      });
      onlineUsers[msg.userId] = {
        username: msg.username || msg.userId,
        status: onlineUsers[msg.userId] ? onlineUsers[msg.userId].status : 'idle'
      };
      renderOnlineUsers();
      break;
    case 'lobbyQueryReply':
      if (msg.toUserId !== myUserId) break;
      if (msg.userId === myUserId) break;
      onlineUsers[msg.userId] = {
        username: msg.username || msg.userId,
        status: msg.status || 'idle'
      };
      renderOnlineUsers();
      break;
    case 'exit':
      if (msg.userId === myUserId) break;
      delete onlineUsers[msg.userId];
      renderOnlineUsers();
      break;
    case 'busy':
      if (msg.userId === myUserId) break;
      if (onlineUsers[msg.userId]) {
        onlineUsers[msg.userId].status = 'busy';
        renderOnlineUsers();
      }
      break;
    case 'idle':
      if (msg.userId === myUserId) break;
      if (onlineUsers[msg.userId]) {
        onlineUsers[msg.userId].status = 'idle';
        renderOnlineUsers();
      }
      break;
    case 'invite':
      if (msg.toUserId === myUserId) handleIncomingInvite(msg);
      break;
    case 'inviteAccept':
      if (msg.toUserId === myUserId) handleInviteAccepted(msg);
      break;
    case 'inviteReject':
      if (msg.toUserId === myUserId) {
        showBanner('对方拒绝了邀请', 'error', 2500);
        if (pendingInviteTimer) { clearTimeout(pendingInviteTimer); pendingInviteTimer = null; }
      }
      break;
    case 'inviteBusy':
      if (msg.toUserId === myUserId) {
        showBanner('对方在棋局中，无法接受邀请', 'error', 2500);
        if (pendingInviteTimer) { clearTimeout(pendingInviteTimer); pendingInviteTimer = null; }
      }
      break;
    case 'joinGame':
      if (msg.toUserId === myUserId) handleIncomingJoin(msg);
      break;
    case 'joinGameAccept':
      if (msg.toUserId === myUserId) handleJoinAccepted(msg);
      break;
    case 'joinGameReject':
      if (msg.toUserId === myUserId) {
        showBanner('对方拒绝了你加入棋局', 'error', 2500);
      }
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
    if (isBusy) {
      btn.textContent = '加入';
      btn.onclick = () => requestJoinGame(uid);
    } else {
      btn.textContent = '邀请';
      btn.onclick = () => inviteUser(uid);
    }
    item.appendChild(btn);
    el.appendChild(item);
  });
}

function inviteUser(toUserId) {
  if (gameStarted && !gameOver && onlineMode) {
    showBanner('你正在对局中，无法邀请他人', 'error', 2000);
    return;
  }
  if (!lobbyWs || lobbyWs.readyState !== 1) {
    showBanner('大厅未连接，请稍候', 'error', 2000);
    connectLobby();
    return;
  }
  pendingInviteTargetId = toUserId;
  timeSelectMode = 'invite';
  document.getElementById('modeSelectModal').classList.add('show');
}

function doInviteWithMode(toUserId) {
  if (!lobbyWs || lobbyWs.readyState !== 1) {
    showBanner('大厅未连接，请稍候', 'error', 2000);
    connectLobby();
    return;
  }
  const newRoomId = generateRoomId();
  inviteRoomId = newRoomId;
  sendLobby({
    type: 'invite',
    fromUserId: myUserId,
    fromUsername: myUsername,
    toUserId: toUserId,
    roomId: newRoomId,
    timeSettings: { ...timeSettings },
    gameMode: gameMode,
    syncStepsPerRound: syncStepsPerRound
  });
  const modeText = gameMode === 'sync' ? '【同步规划模式】' : '【经典模式】';
  showBanner(modeText + ' 邀请已发送，等待对方接受...', 'info', 4000);
  if (pendingInviteTimer) clearTimeout(pendingInviteTimer);
  pendingInviteTimer = setTimeout(() => {
    pendingInviteTimer = null;
    showBanner('对方未响应，邀请已过期', 'error', 2500);
  }, 30000);
}

function doInvite(toUserId) {
  doInviteWithMode(toUserId);
}

function requestJoinGame(toUserId) {
  if (gameStarted && !gameOver && onlineMode) {
    showBanner('你正在对局中，无法加入他人棋局', 'error', 2000);
    return;
  }
  if (!lobbyWs || lobbyWs.readyState !== 1) {
    showBanner('大厅未连接，请稍候', 'error', 2000);
    connectLobby();
    return;
  }
  sendLobby({
    type: 'joinGame',
    fromUserId: myUserId,
    fromUsername: myUsername,
    toUserId: toUserId,
    originalRole: myRole
  });
  showBanner('已请求加入，等待对方确认...', 'info', 4000);
}

function handleIncomingJoin(msg) {
  showConfirm(`${msg.fromUsername} 想加入棋局，是否允许？`, () => {
    const requesterRole = (myRole === 'host') ? 'guest' : 'host';
    sendLobby({
      type: 'joinGameAccept',
      fromUserId: myUserId,
      toUserId: msg.fromUserId,
      roomId: roomId,
      continueGame: true,
      hostColor: hostColor,
      timeSettings: { ...timeSettings },
      gameMode: gameMode,
      syncStepsPerRound: syncStepsPerRound,
      assignRole: requesterRole
    });
    if (myRole === 'host') {
      setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 800);
      setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 1800);
      setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 3000);
    }
    showBanner('已允许对方加入棋局', 'info', 2000);
  }, () => {
    sendLobby({
      type: 'joinGameReject',
      fromUserId: myUserId,
      toUserId: msg.fromUserId,
      reason: 'refused'
    });
  });
}

function handleJoinAccepted(msg) {
  if (!msg.continueGame) {
    showBanner('对方拒绝了加入请求', 'error', 2500);
    return;
  }
  if (msg.timeSettings) Object.assign(timeSettings, msg.timeSettings);
  if (msg.gameMode) gameMode = msg.gameMode;
  if (msg.syncStepsPerRound) syncStepsPerRound = msg.syncStepsPerRound;
  if (msg.assignRole) {
    myRole = msg.assignRole;
  } else {
    if (!myRole) myRole = 'guest';
  }
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
      sendLobby({
        type: 'joinGameAccept',
        fromUserId: myUserId,
        toUserId: msg.fromUserId,
        roomId: roomId,
        continueGame: true,
        hostColor: hostColor,
        timeSettings: { ...timeSettings },
        gameMode: gameMode,
        syncStepsPerRound: syncStepsPerRound,
        assignRole: requesterRole
      });
      if (myRole === 'host') {
        setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 800);
        setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 1800);
        setTimeout(() => { if (onlineMode && ws && ws.readyState === 1) broadcastSync(); }, 3000);
      }
    }, () => {
      sendLobby({
        type: 'joinGameReject',
        fromUserId: myUserId,
        toUserId: msg.fromUserId,
        reason: 'refused'
      });
    });
    return;
  }

  const modeText = gameMode === 'sync' ? '【同步规划模式】' : '【经典模式】';
  showConfirm(`${msg.fromUsername} ${modeText} 邀请你下棋，是否接受？`, () => {
    if (msg.timeSettings) Object.assign(timeSettings, msg.timeSettings);
    sendLobby({
      type: 'inviteAccept',
      fromUserId: myUserId,
      toUserId: msg.fromUserId,
      roomId: msg.roomId
    });
    setTimeout(() => {
      myRole = 'guest';
      roomId = msg.roomId;
      enterRoom();
    }, 150);
  }, () => {
    sendLobby({
      type: 'inviteReject',
      fromUserId: myUserId,
      toUserId: msg.fromUserId
    });
  });
}

function handleInviteAccepted(msg) {
  if (pendingInviteTimer) { clearTimeout(pendingInviteTimer); pendingInviteTimer = null; }
  if (msg.continueGame) {
    if (msg.timeSettings) Object.assign(timeSettings, msg.timeSettings);
    if (msg.assignRole) {
      myRole = msg.assignRole;
    } else if (!myRole) {
      myRole = 'guest';
    }
    roomId = msg.roomId;
    showBanner('对方已允许你重新加入对局', 'info', 2000);
    setTimeout(() => enterRoom(true), 150);
  } else {
    myRole = 'host';
    roomId = msg.roomId;
    const modeText = gameMode === 'sync' ? '【同步规划模式】' : '【经典模式】';
    showBanner(modeText + ' 对方接受邀请，进入房间...', 'info', 2000);
    setTimeout(() => enterRoom(), 150);
  }
}

// ============================================================
//                        网络（游戏房间）
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
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close(1000, 'client closing');
      }
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
      setConnIndicator('dead');
      ws = null;
      stopRoomHeartbeat();
      if (!intentionalClose) handleDisconnect(e.code);
    };
    ws.onmessage = (e) => handleMessage(e.data);
  });
}

function handleDisconnect() {
  if (leavingToHome) return;
  if (gameStarted && onlineMode) {
    startReconnect();
    return;
  }
  if (!gameStarted && waitPanel.classList.contains('hidden')) return;
  leavingToHome = true;
  showBanner('⚠ 网络连接断开，即将返回主页...', 'error', 2500);
  setTimeout(() => goHome(), 2000);
}

function send(obj) {
  if (!ws || ws.readyState !== 1) { netLog('未连接'); return false; }
  ws.send(typeof obj === 'string' ? obj : JSON.stringify(obj));
  return true;
}

function startRoomHeartbeat() {
  stopRoomHeartbeat();
  oppLastSeen = Date.now();
  roomHeartbeatTimer = setInterval(() => {
    if (ws && ws.readyState === 1) {
      try { ws.send(JSON.stringify({ type: 'ping', userId: myUserId })); } catch (e) { }
    }
  }, HEARTBEAT_SEND_MS);
  roomHeartbeatCheckTimer = setInterval(() => {
    if (!gameStarted || gameOver) return;
    if (!opponentUserId) return;
    if (Date.now() - oppLastSeen > HEARTBEAT_TIMEOUT_MS) {
      if (!oppDisconnectTimer) {
        handleOpponentDisconnect();
      }
    }
  }, 3000);
}
function stopRoomHeartbeat() {
  if (roomHeartbeatTimer) { clearInterval(roomHeartbeatTimer); roomHeartbeatTimer = null; }
  if (roomHeartbeatCheckTimer) { clearInterval(roomHeartbeatCheckTimer); roomHeartbeatCheckTimer = null; }
}

function startReconnect() {
  if (isReconnecting) return;
  isReconnecting = true;
  reconnectWasInGame = gameStarted && !gameOver;
  reconnectDeadline = Date.now() + RECONNECT_TIMEOUT_MS;
  setConnIndicator('dead');
  showBanner('⚠ 网络断开，正在重连...', 'error', 0);
  stopTimer();
  stopRoomHeartbeat();
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
    send({
      type: 'hello',
      userId: myUserId,
      username: myUsername,
      role: myRole,
      reconnect: true,
      gameMode: gameMode,
      syncStepsPerRound: syncStepsPerRound
    });
    isReconnecting = false;
    hideBanner();
    showBanner('已重新连接', 'info', 2000);
    startTimer();
    startRoomHeartbeat();

    if (reconnectWasInGame && gameStarted) {
      hideAll();
      gamePanel.classList.remove('hidden');
      chatFab.classList.remove('hidden');
      if (myRole === 'host') {
        broadcastSync();
      } else {
        send({ type: 'requestSync', userId: myUserId });
      }
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
  hostTimeLeft = timeSettings.totalMs;
  guestTimeLeft = timeSettings.totalMs;
  turnStartTs = performance.now();
  timeoutHandled = false;
}
function startTimer() {
  if (gameMode === 'sync') return;
  stopTimer();
  if (!turnStartTs) turnStartTs = performance.now();
  timerInterval = setInterval(tickTimer, 200);
  tickTimer();
}
function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}
function commitTurnTime() {
  if (gameMode === 'sync') return;
  if (!turnStartTs) return;
  const elapsed = performance.now() - turnStartTs;
  const noLimit = !timeSettings.enabled;
  const dec = (v) => noLimit ? (v - elapsed) : Math.max(0, v - elapsed);
  if (currentPlayer === 'red' || currentPlayer === 'black') {
    const isHostColor = (hostColor === currentPlayer);
    if (isHostColor) hostTimeLeft = dec(hostTimeLeft);
    else guestTimeLeft = dec(guestTimeLeft);
  } else if (currentPlayer === 'host') {
    hostTimeLeft = dec(hostTimeLeft);
  } else if (currentPlayer === 'guest') {
    guestTimeLeft = dec(guestTimeLeft);
  }
  turnStartTs = performance.now();
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
    if (isHostTurnLocal()) hostUsed += elapsedStep;
    else guestUsed += elapsedStep;
    info.textContent = `本局用时 红:${formatMs(hostUsed)} 黑:${formatMs(guestUsed)}`;
    return;
  }

  const stepLeft = timeSettings.stepMs - elapsedStep;
  let curLeft;
  if (currentPlayer === 'red' || currentPlayer === 'black') {
    const isHostColor = (hostColor === currentPlayer);
    curLeft = isHostColor ? hostTimeLeft : guestTimeLeft;
  } else if (currentPlayer === 'host') {
    curLeft = hostTimeLeft;
  } else if (currentPlayer === 'guest') {
    curLeft = guestTimeLeft;
  } else {
    curLeft = timeSettings.totalMs;
  }
  curLeft = Math.max(0, curLeft - elapsedStep);

  info.textContent = `步时 ${formatMs(stepLeft)} | 局时 红:${formatMs(hostTimeLeft)} 黑:${formatMs(guestTimeLeft)}`;

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
  unreadChatCount = 0;
  updateChatBadge();
  setTimeout(() => {
    const input = document.getElementById('chatInput');
    if (input) input.focus();
  }, 100);
}
function closeChatModal() {
  document.getElementById('chatModal').classList.remove('show');
}
function updateChatBadge() {
  const badge = document.getElementById('chatBadge');
  if (!badge) return;
  if (unreadChatCount > 0) {
    badge.textContent = unreadChatCount > 99 ? '99+' : String(unreadChatCount);
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}
function initChatUI() {
  const presetsEl = document.getElementById('chatPresets');
  if (!presetsEl) return;
  presetsEl.innerHTML = '';
  CHAT_PRESETS.forEach(msg => {
    const btn = document.createElement('button');
    btn.className = 'chat-preset-btn';
    btn.textContent = msg;
    btn.onclick = () => sendChat(msg, 'preset');
    presetsEl.appendChild(btn);
  });
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  if (sendBtn) {
    sendBtn.onclick = () => {
      const v = (input.value || '').trim();
      if (!v) return;
      sendChat(v, 'custom');
      input.value = '';
    };
  }
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        const v = (input.value || '').trim();
        if (!v) return;
        sendChat(v, 'custom');
        input.value = '';
      }
    };
  }
}
function sendChat(text, chatType) {
  if (!onlineMode) return;
  send({ type: 'chat', userId: myUserId, username: myUsername, chatType: chatType, content: text });
  appendChatMessage(myUsername || '我', text, 'me');
}
function appendChatMessage(name, text, kind) {
  const log = document.getElementById('chatLog');
  if (!log) return;
  if (kind === 'sys') {
    const line = document.createElement('div');
    line.className = 'chat-line sys';
    line.textContent = '· ' + text;
    log.appendChild(line);
  } else {
    const line = document.createElement('div');
    line.className = 'chat-line ' + (kind === 'me' ? 'me' : '');
    const nameEl = document.createElement('span');
    nameEl.className = 'chat-name';
    nameEl.textContent = name + '：';
    line.appendChild(nameEl);
    const textEl = document.createElement('span');
    textEl.textContent = text;
    line.appendChild(textEl);
    log.appendChild(line);
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
  if (document.getElementById('chatModal').classList.contains('show')) {
  } else {
    unreadChatCount++;
    updateChatBadge();
  }
  setTimeout(() => { dismissNotice(notice); }, 8000);
}
function dismissNotice(notice) {
  if (!notice || !notice.parentNode) return;
  notice.classList.add('hide');
  setTimeout(() => {
    if (notice.parentNode) notice.parentNode.removeChild(notice);
  }, 300);
}

// ============================================================
//                  消息处理（游戏房间）
// ============================================================
function handleMessage(raw) {
  let msg;
  try { msg = JSON.parse(raw); } catch (e) { return; }
  netLog('收到: ' + msg.type);

  switch (msg.type) {
    case 'ping':
      if (msg.userId !== myUserId) {
        oppLastSeen = Date.now();
      }
      break;

    case 'hello': {
      if (msg.userId === myUserId) break;
      oppLastSeen = Date.now();

      if (myRole === 'host') {
        if (opponentUserId && opponentUserId !== msg.userId) {
          send({ type: 'roomFull', hostId: myUserId, oppId: opponentUserId });
          break;
        }
        if (!opponentUserId && lastOpponentUserId && msg.userId !== lastOpponentUserId) {
          send({ type: 'roomFull', hostId: myUserId, oppId: lastOpponentUserId });
          break;
        }
        opponentUserId = msg.userId;
        opponentUsername = msg.username || msg.userId;

        if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
        const modal = document.getElementById('oppDisconnectModal');
        if (modal) modal.classList.remove('show');
        lastOpponentUserId = '';

        const oppLabel = document.getElementById('gameOppLabel');
        if (oppLabel) {
          oppLabel.textContent = '对手：' + opponentUsername;
          oppLabel.style.color = '#b32b2b';
        }

        send({
          type: 'hello-ack',
          userId: myUserId,
          username: myUsername,
          role: myRole,
          gameMode: gameMode,
          syncStepsPerRound: syncStepsPerRound
        });

        if (gameStarted && !gameOver) {
          broadcastSync();
          hideAll();
          gamePanel.classList.remove('hidden');
          chatFab.classList.remove('hidden');
          startTimer();
          startRoomHeartbeat();
          appendChatMessage('', (msg.username || '对手') + ' 已重新加入，对局继续', 'sys');
          showBanner('对手已重新加入，对局继续', 'info', 2500);
        } else {
          updateWaitUI();
          waitHint('对手已加入：' + opponentUsername, 'ok');
          startRoomHeartbeat();
        }
      } else if (myRole === 'guest') {
        if (msg.gameMode) gameMode = msg.gameMode;
        if (msg.syncStepsPerRound) syncStepsPerRound = msg.syncStepsPerRound;

        opponentUserId = msg.userId;
        opponentUsername = msg.username || msg.userId;

        const oppLabel = document.getElementById('gameOppLabel');
        if (oppLabel) {
          oppLabel.textContent = '对手：' + opponentUsername;
          oppLabel.style.color = '#b32b2b';
        }

        send({
          type: 'hello-ack',
          userId: myUserId,
          username: myUsername,
          role: myRole,
          gameMode: gameMode,
          syncStepsPerRound: syncStepsPerRound
        });

        if (gameStarted && !gameOver) {
          hideAll();
          gamePanel.classList.remove('hidden');
          chatFab.classList.remove('hidden');
          startTimer();
          startRoomHeartbeat();
          send({ type: 'requestSync', userId: myUserId });
        } else {
          updateWaitUI();
          waitHint('对手已加入：' + opponentUsername, 'ok');
          startRoomHeartbeat();
        }
      }
      break;
    }

    case 'hello-ack': {
      if (msg.userId === myUserId) break;
      oppLastSeen = Date.now();
      if (myRole === 'guest') {
        if (msg.gameMode) gameMode = msg.gameMode;
        if (msg.syncStepsPerRound) syncStepsPerRound = msg.syncStepsPerRound;
      }
      opponentUserId = msg.userId;
      opponentUsername = msg.username || msg.userId;
      const oppLabel = document.getElementById('gameOppLabel');
      if (oppLabel) {
        oppLabel.textContent = '对手：' + opponentUsername;
        oppLabel.style.color = '#b32b2b';
      }
      if (gameStarted && !gameOver) {
        if (gamePanel.classList.contains('hidden')) {
          hideAll();
          gamePanel.classList.remove('hidden');
          chatFab.classList.remove('hidden');
          startTimer();
        }
        startRoomHeartbeat();
        if (myRole === 'guest') {
          send({ type: 'requestSync', userId: myUserId });
        }
      } else {
        updateWaitUI();
        waitHint('对手已加入：' + opponentUsername, 'ok');
        startRoomHeartbeat();
      }
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
      if (msg.userId === opponentUserId || !opponentUserId) {
        oppReady = msg.ready;
        updateWaitUI();
        checkBothReady();
      }
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
      hideAll();
      gamePanel.classList.remove('hidden');
      chatFab.classList.remove('hidden');
      startRoomHeartbeat();
      if (gameMode !== 'sync' && !msg.state.gameOver) startTimer();
      if (gameMode === 'sync') {
        document.getElementById('syncBar').classList.remove('hidden');
        if (myColor && !colorTipShown) {
          colorTipShown = true;
          setTimeout(() => {
            Swal.fire({
              icon: 'info',
              title: '颜色分配',
              text: `你执 ${myColor === 'red' ? '红方' : '黑方'}`,
              confirmButtonText: '知道了'
            });
          }, 300);
        }
        if (!syncMySubmitted) renderSyncBar();
      }
      break;

    case 'requestSync':
      if (myRole === 'host' && gameStarted) broadcastSync();
      break;

    case 'requestUndo':
      incomingUndoRequest();
      break;
    case 'undoAccepted':
      if (myRole === 'host') { doUndoLocal(); broadcastSync(); }
      pendingUndoRequest = false;
      showBanner('对方同意悔棋', 'info', 1500);
      break;
    case 'undoRejected':
      pendingUndoRequest = false;
      showBanner('对方拒绝了悔棋', 'error', 2500);
      break;
    case 'yieldFirst':
      if (msg.userId !== myUserId) showBanner('对手让先，请你先走', 'info', 3000);
      break;
    case 'requestDraw':
      incomingDrawRequest();
      break;
    case 'drawAccepted':
      pendingDrawRequest = false;
      if (!gameOver) endGame('双方和棋', 'draw');
      showBanner('对方同意和棋', 'info', 2000);
      break;
    case 'drawRejected':
      pendingDrawRequest = false;
      showBanner('对方拒绝和棋', 'error', 2500);
      break;
    case 'resign':
      if (!gameOver) endGame('对方认输，你赢了', 'win');
      break;
    case 'timeout':
      if (msg.userId !== myUserId && !gameOver) {
        stopTimer();
        endGame('对方超时，你赢了', 'win');
      }
      break;
    case 'chat':
      if (msg.userId === myUserId) break;
      appendChatMessage(msg.username || '对手', msg.content, 'other');
      showChatNotice(msg.username || '对手', msg.content);
      break;
    case 'manualLeave':
      handleOpponentManualLeave();
      break;
    case 'exit':
      handleOpponentDisconnect();
      break;

    case 'syncModeSet':
      gameMode = msg.gameMode;
      syncStepsPerRound = msg.syncStepsPerRound;
      showBanner('房主选择了「同步规划模式」', 'info', 3000);
      break;

    case 'syncPlan':
      if (myRole === 'host') {
        handleOpponentSyncPlan(msg);
      }
      break;

    case 'syncPlayback':
      if (myRole === 'guest') {
        playSyncPlayback(msg.script);
      }
      break;

    case 'syncOppSubmitted':
      if (msg.userId !== myUserId) {
        syncOppSubmitted = true;
        renderSyncBar();
        if (!syncMySubmitted) {
          showBanner('对手已提交规划，请尽快完成', 'info', 3000);
        }
      }
      break;

    default:
      break;
  }
}

function incomingUndoRequest() {
  const who = opponentUsername || '对方';
  showConfirm(who + ' 请求悔棋，是否同意？', () => {
    send({ type: 'undoAccepted', userId: myUserId });
    if (myRole === 'host') { doUndoLocal(); broadcastSync(); }
  }, () => {
    send({ type: 'undoRejected', userId: myUserId });
  });
}
function incomingDrawRequest() {
  const who = opponentUsername || '对方';
  showConfirm(who + ' 请求和棋，是否同意？', () => {
    send({ type: 'drawAccepted', userId: myUserId });
    endGame('双方和棋', 'draw');
  }, () => {
    send({ type: 'drawRejected', userId: myUserId });
  });
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
  opponentUserId = '';
  opponentUsername = '';
  oppReady = false;

  const oppLabel = document.getElementById('gameOppLabel');
  if (oppLabel) {
    oppLabel.textContent = '对手断线，等待重连...';
    oppLabel.style.color = '#b32b2b';
  }

  const giveUpBtn = document.getElementById('giveUpBtn');
  if (giveUpBtn) {
    if (myRole === 'guest') giveUpBtn.style.display = 'none';
    else giveUpBtn.style.display = '';
  }

  const modal = document.getElementById('oppDisconnectModal');
  if (modal) modal.classList.add('show');
  oppDisconnectDeadline = Date.now() + OPP_WAIT_MS;
  if (oppDisconnectTimer) clearInterval(oppDisconnectTimer);
  updateOppWaitTime(Math.ceil(OPP_WAIT_MS / 1000));
  oppDisconnectTimer = setInterval(() => {
    const remain = Math.max(0, Math.ceil((oppDisconnectDeadline - Date.now()) / 1000));
    updateOppWaitTime(remain);
    if (remain <= 0) {
      clearInterval(oppDisconnectTimer);
      oppDisconnectTimer = null;
      if (modal) modal.classList.remove('show');
      if (!opponentUserId) {
        if (gameStarted && !gameOver) {
          if (myRole === 'host') endGame('对方断线超时，你赢了', 'win');
          else endGame('对方断线超时，对局结束', 'loss');
        } else {
          showBanner('对方断线超时，返回主页', 'error', 2500);
        }
        setTimeout(() => { leavingToHome = true; goHome(); }, 2500);
      }
    }
  }, 500);

  showBanner('对方断线，等待其重新加入...', 'error', 3000);
  appendChatMessage('', '对方已断线，等待重新加入...', 'sys');
}
function updateOppWaitTime(remain) {
  const el = document.getElementById('oppWaitTime');
  if (el && typeof remain === 'number') el.textContent = remain;
}
function giveUpWaiting() {
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  const modal = document.getElementById('oppDisconnectModal');
  if (modal) modal.classList.remove('show');
  if (gameStarted && !gameOver && myRole === 'host') {
    endGame('对方断线，你赢了', 'win');
    setTimeout(() => { leavingToHome = true; goHome(); }, 2500);
  } else {
    showBanner('已放弃等待', 'info', 2000);
    setTimeout(() => { leavingToHome = true; goHome(); }, 1500);
  }
}

function goHome() {
  intentionalClose = true;
  stopRoomHeartbeat();
  if (ws) { try { ws.close(); } catch (e) { } ws = null; }
  window.removeEventListener('beforeunload', onBeforeUnload);
  stopTimer();
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  if (pendingInviteTimer) { clearTimeout(pendingInviteTimer); pendingInviteTimer = null; }
  if (syncPlaybackTimer) { clearTimeout(syncPlaybackTimer); syncPlaybackTimer = null; }
  const modal = document.getElementById('oppDisconnectModal');
  if (modal) modal.classList.remove('show');
  isReconnecting = false;
  reconnectWasInGame = false;

  sendLobby({ type: 'idle', userId: myUserId, username: myUsername });

  opponentUserId = ''; opponentUsername = '';
  lastOpponentUserId = '';
  selfReady = false; oppReady = false;
  gameStarted = false;
  onlineMode = false;
  gameMode = 'classic';
  myColor = null; hostColor = null;
  gameOver = false; gameEndReason = '';
  leavingToHome = false;
  roomFullHandled = false;
  pendingUndoRequest = false;
  pendingDrawRequest = false;
  recordUploaded = false;
  unreadChatCount = 0;
  colorTipShown = false;
  lastPlaybackScript = null;
  lastPlaybackStartState = null;
  syncMyQueue = [];
  syncMySubmitted = false;
  syncOppSubmitted = false;
  syncPlaying = false;
  updateChatBadge();
  const log = document.getElementById('chatLog');
  if (log) log.innerHTML = '';
  const nc = document.getElementById('chatNoticeContainer');
  if (nc) nc.innerHTML = '';
  hideBanner();
  hideAll();
  menuPanel.classList.remove('hidden');
  connectLobby();
}

// ============================================================
//                        确认弹窗
// ============================================================
function showConfirm(text, onYes, onNo) {
  const disModal = document.getElementById('oppDisconnectModal');
  let wasShown = false;
  if (disModal && disModal.classList.contains('show')) {
    wasShown = true;
    disModal.style.visibility = 'hidden';
  }
  document.getElementById('confirmText').textContent = text;
  document.getElementById('confirmModal').classList.add('show');
  confirmCallback = {
    onYes: () => {
      if (wasShown && disModal) disModal.style.visibility = '';
      if (onYes) onYes();
    },
    onNo: () => {
      if (wasShown && disModal) disModal.style.visibility = '';
      if (onNo) onNo();
    }
  };
}
function confirmYes() {
  document.getElementById('confirmModal').classList.remove('show');
  const disModal = document.getElementById('oppDisconnectModal');
  if (disModal) disModal.style.visibility = '';
  if (confirmCallback && confirmCallback.onYes) confirmCallback.onYes();
  confirmCallback = null;
}
function confirmNo() {
  document.getElementById('confirmModal').classList.remove('show');
  const disModal = document.getElementById('oppDisconnectModal');
  if (disModal) disModal.style.visibility = '';
  if (confirmCallback && confirmCallback.onNo) confirmCallback.onNo();
  confirmCallback = null;
}

// ============================================================
//                        房间 / 模式选择
// ============================================================
function generateRoomId() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createRoom() {
  timeSelectMode = 'create';
  pendingInviteTargetId = null;
  document.getElementById('modeSelectModal').classList.add('show');
}
function cancelModeSelect() {
  document.getElementById('modeSelectModal').classList.remove('show');
  timeSelectMode = 'create';
  pendingInviteTargetId = null;
}
function pickMode(mode) {
  document.getElementById('modeSelectModal').classList.remove('show');
  gameMode = mode;

  if (mode === 'sync') {
    document.getElementById('syncModeModal').classList.add('show');
  } else {
    document.getElementById('timeControlModal').classList.add('show');
  }
}
function cancelSyncMode() {
  document.getElementById('syncModeModal').classList.remove('show');
  timeSelectMode = 'create';
  pendingInviteTargetId = null;
}
function pickSyncSteps(n) {
  syncStepOption = n;
  gameMode = 'sync';
  syncStepsPerRound = n;
  document.getElementById('syncModeModal').classList.remove('show');

  if (timeSelectMode === 'invite') {
    const target = pendingInviteTargetId;
    timeSelectMode = 'create';
    pendingInviteTargetId = null;
    doInviteWithMode(target);
  } else {
    doCreateRoom();
  }
}

function cancelTimeSelect() {
  document.getElementById('timeControlModal').classList.remove('show');
  timeSelectMode = 'create';
  pendingInviteTargetId = null;
}
function selectTimeOption(opt) {
  const presets = {
    standard: { enabled: true, totalMs: 15 * 60 * 1000, stepMs: 60 * 1000 },
    fast:     { enabled: true, totalMs: 10 * 60 * 1000, stepMs: 30 * 1000 },
    blitz:    { enabled: true, totalMs: 5 * 60 * 1000,  stepMs: 20 * 1000 },
    none:     { enabled: false, totalMs: 15 * 60 * 1000, stepMs: 60 * 1000 }
  };
  Object.assign(timeSettings, presets[opt] || presets.standard);
  document.getElementById('timeControlModal').classList.remove('show');

  if (timeSelectMode === 'invite') {
    const target = pendingInviteTargetId;
    timeSelectMode = 'create';
    pendingInviteTargetId = null;
    doInviteWithMode(target);
  } else {
    doCreateRoom();
  }
}

async function doCreateRoom() {
  myRole = 'host';
  roomId = generateRoomId();
  document.getElementById('lobbyRoom').value = roomId;
  lobbyHint('创建房间 ' + roomId + '...');
  await enterRoom();
}
async function joinRoom() {
  const rid = document.getElementById('lobbyRoom').value.trim();
  if (!rid || !/^\d{6}$/.test(rid)) { lobbyHint('请输入 6 位数字房间号', 'error'); return; }
  myRole = 'guest';
  roomId = rid;
  lobbyHint('加入房间 ' + rid + '...');
  await enterRoom();
}

async function enterRoom(directEnter) {
  intentionalClose = false;
  leavingToHome = false;
  roomFullHandled = false;
  reconnectWasInGame = false;
  colorTipShown = false;
  try {
    await connectWS(roomId, myUserId, false);
  } catch (e) {
    lobbyHint('连接失败：' + e.message, 'error');
    return;
  }
  onlineMode = true;
  applyModeButtons();
  startRoomHeartbeat();

  if (directEnter) {
    hideAll();
    gamePanel.classList.remove('hidden');
    chatFab.classList.remove('hidden');
    gameStarted = true;
    if (!boardDomBuilt) {
      initBoard();
      buildBoardDOM();
      renderFullBoard();
      renderGraveyards();
    }
    setTimeout(() => {
      if (myRole === 'host') broadcastSync();
      else send({ type: 'requestSync', userId: myUserId });
    }, 300);
    setTimeout(() => {
      if (myRole === 'host') broadcastSync();
      else send({ type: 'requestSync', userId: myUserId });
    }, 1200);
    if (gameMode === 'sync') {
      document.getElementById('syncBar').classList.remove('hidden');
      renderSyncBar();
    } else {
      document.getElementById('syncBar').classList.add('hidden');
    }
  } else {
    hideAll();
    waitPanel.classList.remove('hidden');
    document.getElementById('waitRoomLabel').textContent = roomId;
    document.getElementById('netLog').textContent = '';
    selfReady = false; oppReady = false;
    gameStarted = false;
    opponentUserId = ''; opponentUsername = '';
    myColor = null; hostColor = null;
    updateWaitUI();
    waitHint('等待对手加入...');
  }

  send({
    type: 'hello',
    userId: myUserId,
    username: myUsername,
    role: myRole,
    gameMode: gameMode,
    syncStepsPerRound: syncStepsPerRound
  });
  setTimeout(() => {
    if (ws && ws.readyState === 1 && !opponentUserId) {
      send({
        type: 'hello', userId: myUserId, username: myUsername, role: myRole,
        gameMode: gameMode, syncStepsPerRound: syncStepsPerRound, reHello: true
      });
    }
  }, 800);
  setTimeout(() => {
    if (ws && ws.readyState === 1 && !opponentUserId) {
      send({
        type: 'hello', userId: myUserId, username: myUsername, role: myRole,
        gameMode: gameMode, syncStepsPerRound: syncStepsPerRound, reHello: true
      });
    }
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
  intentionalClose = true;
  goHome();
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
  updateWaitUI();
  checkBothReady();
}
function checkBothReady() {
  if (selfReady && oppReady && opponentUserId && !gameStarted) {
    if (myRole === 'host') {
      setTimeout(() => startGameAsHost(), 400);
    }
  }
}

// ============================================================
//                    开局
// ============================================================
function startGameAsHost() {
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  lastOpponentUserId = '';

  initBoard();
  myColor = null; hostColor = null;

  if (gameMode === 'sync') {
    hostColor = Math.random() < 0.5 ? 'red' : 'black';
    myColor = hostColor;
    currentPlayer = null;
  } else {
    currentPlayer = 'host';
  }

  gameOver = false; gameEndReason = '';
  selectedRow = -1; selectedCol = -1;
  lastMovedRow = -1; lastMovedCol = -1;
  deadRed = []; deadBlack = [];
  history = [];
  recordUploaded = false;
  gameStarted = true;
  syncRoundNum = 0;
  syncMyQueue = [];
  syncMySubmitted = false;
  syncOppSubmitted = false;
  colorTipShown = false;
  lastPlaybackScript = null;
  lastPlaybackStartState = null;
  resetTimersForNewGame();

  enterGameUI();
  buildBoardDOM();
  renderFullBoard();
  renderGraveyards();
  const log = document.getElementById('chatLog');
  if (log) log.innerHTML = '';

  if (gameMode === 'sync') {
    document.getElementById('syncBar').classList.remove('hidden');
    updateColorLabel();
    setTimeout(() => {
      colorTipShown = true;
      Swal.fire({
        icon: 'info',
        title: '颜色分配',
        text: `你执 ${myColor === 'red' ? '红方' : '黑方'}`,
        confirmButtonText: '知道了'
      });
    }, 300);
    startSyncRound();
  } else {
    document.getElementById('syncBar').classList.add('hidden');
    startTimer();
  }

  send({
    type: 'start',
    state: serializeState(),
    firstMover: 'host',
    timeSettings,
    gameMode: gameMode,
    syncStepsPerRound: syncStepsPerRound
  });
}
function applyStartState(state) {
  deserializeState(state);
  gameStarted = true;
  gameOver = false; gameEndReason = '';
  recordUploaded = false;
  syncRoundNum = 0;
  syncMyQueue = [];
  syncMySubmitted = false;
  syncOppSubmitted = false;
  lastPlaybackScript = null;
  lastPlaybackStartState = null;
  enterGameUI();
  buildBoardDOM();
  renderFullBoard();
  renderGraveyards();
  const log = document.getElementById('chatLog');
  if (log) log.innerHTML = '';

  if (gameMode === 'sync') {
    document.getElementById('syncBar').classList.remove('hidden');
    updateColorLabel();
    if (myColor && !colorTipShown) {
      colorTipShown = true;
      setTimeout(() => {
        Swal.fire({
          icon: 'info',
          title: '颜色分配',
          text: `你执 ${myColor === 'red' ? '红方' : '黑方'}`,
          confirmButtonText: '知道了'
        });
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
    board: board.map(row => row.map(c => c ? { piece: c.piece, hidden: c.hidden, id: c.id } : null)),
    currentPlayer,
    gameOver,
    gameEndReason,
    lastMovedRow,
    lastMovedCol,
    deadRed: [...deadRed],
    deadBlack: [...deadBlack],
    hostColor,
    hostTimeLeft,
    guestTimeLeft,
    timeSettings: { ...timeSettings },
    gameMode: gameMode,
    syncStepsPerRound: syncStepsPerRound,
    syncRoundNum: syncRoundNum
  };
}
function deserializeState(state) {
  board = state.board.map(row => row.map(c => c ? { piece: c.piece, hidden: c.hidden, id: c.id } : null));
  currentPlayer = state.currentPlayer;
  gameOver = state.gameOver;
  gameEndReason = state.gameEndReason || '';
  lastMovedRow = state.lastMovedRow;
  lastMovedCol = state.lastMovedCol;
  deadRed = [...state.deadRed];
  deadBlack = [...state.deadBlack];
  history = [];

  if (state.timeSettings) Object.assign(timeSettings, state.timeSettings);
  if (state.gameMode) gameMode = state.gameMode;
  if (state.syncStepsPerRound) syncStepsPerRound = state.syncStepsPerRound;
  if (typeof state.syncRoundNum === 'number') syncRoundNum = state.syncRoundNum;

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
  renderFullBoard();
  renderGraveyards();
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
  hideAll();
  gamePanel.classList.remove('hidden');
  chatFab.classList.remove('hidden');
  document.getElementById('gameRoomLabel').textContent = roomId || '离线';
  document.getElementById('gameRoleLabel').textContent =
    myRole === 'host' ? '（房主）' : (myRole === 'guest' ? '（客机）' : '');
  document.getElementById('gameOppLabel').textContent =
    opponentUserId ? '对手：' + (opponentUsername || opponentUserId) : '';
  document.getElementById('gameOppLabel').style.color = '#b32b2b';
  document.getElementById('connDot').style.display = onlineMode ? 'inline-block' : 'none';
  updateColorLabel();
  applyModeButtons();
  initChatUI();
  unreadChatCount = 0;
  updateChatBadge();
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
    if (lastPlaybackScript && !syncPlaying && !syncMySubmitted) {
      replayBtn.style.display = '';
    } else {
      replayBtn.style.display = 'none';
    }
  }

  if (syncPlaying) {
    phaseEl.textContent = '播放中...';
    phaseEl.style.color = '#ffcc44';
  } else if (syncMySubmitted) {
    if (syncOppSubmitted) {
      phaseEl.textContent = '双方已完成，准备播放';
      phaseEl.style.color = '#1faa1f';
    } else {
      phaseEl.textContent = '你已完成，等待对手...';
      phaseEl.style.color = '#00e0ff';
    }
  } else {
    if (syncOppSubmitted) {
      phaseEl.textContent = '对手已完成，请尽快完成';
      phaseEl.style.color = '#ffaa00';
    } else {
      phaseEl.textContent = '规划阶段';
      phaseEl.style.color = '#eedbba';
    }
  }

  stepsEl.textContent = `步数：${syncMyQueue.length} / ${syncStepsPerRound}`;
  submitBtn.disabled = syncMySubmitted || syncPlaying || syncMyQueue.length === 0;
  submitBtn.textContent = syncMySubmitted ? '已提交' : '完成';
}

function clearSyncQueue() {
  if (syncMySubmitted || syncPlaying) return;
  syncMyQueue = [];
  selectedRow = -1; selectedCol = -1;
  highlightSyncQueue();
  renderSyncBar();
}

function submitSyncPlan() {
  if (syncMySubmitted || syncPlaying) return;
  if (syncMyQueue.length === 0) { showBanner('请至少规划一步', 'error', 1500); return; }
  syncMySubmitted = true;
  selectedRow = -1; selectedCol = -1;
  highlightSyncQueue();
  renderSyncBar();

  if (myRole === 'host') {
    checkBothSyncSubmitted();
  } else {
    send({ type: 'syncPlan', userId: myUserId, actions: syncMyQueue });
    send({ type: 'syncOppSubmitted', userId: myUserId });
    showBanner('已提交，等待对手...', 'info', 2000);
  }
}

function handleOpponentSyncPlan(msg) {
  syncOppQueue = msg.actions || [];
  syncOppSubmitted = true;
  checkBothSyncSubmitted();
}

function checkBothSyncSubmitted() {
  if (myRole !== 'host') return;
  if (!syncMySubmitted || !syncOppSubmitted) return;
  setTimeout(() => hostSimulateAndPlay(), 200);
}

function startSyncRound() {
  syncRoundNum++;
  syncMyQueue = [];
  syncMySubmitted = false;
  syncOppSubmitted = false;
  syncOppQueue = [];
  selectedRow = -1; selectedCol = -1;
  clearParabolas();
  highlightSyncQueue();
  renderSyncBar();
  // 不再设置 statusText，避免显示"请规划你的操作"
}

function hostSimulateAndPlay() {
  const allActions = [];
  syncMyQueue.forEach(a => allActions.push({ ...a, by: 'host' }));
  syncOppQueue.forEach(a => allActions.push({ ...a, by: 'guest' }));

  const script = simulateSyncRound(allActions);
  playSyncPlayback(script);
  send({ type: 'syncPlayback', script });

  syncMySubmitted = false;
  syncOppSubmitted = false;
  syncOppQueue = [];
}

function replayLastPlayback() {
  if (syncPlaying) { showBanner('播放中，请稍候', 'info', 1200); return; }
  if (gameOver) { showBanner('对局已结束', 'error', 1200); return; }
  if (!lastPlaybackScript) { showBanner('没有可回放的记录', 'error', 1200); return; }

  if (lastPlaybackStartState) {
    board = lastPlaybackStartState.board.map(row => row.map(c => c ? { ...c } : null));
    deadRed = [...lastPlaybackStartState.deadRed];
    deadBlack = [...lastPlaybackStartState.deadBlack];
    prevDeadRedCount = -1;
    prevDeadBlackCount = -1;
    renderFullBoard();
    renderGraveyards();
  }

  playSyncPlayback(lastPlaybackScript);
}

function getPieceIdAt(row, col) {
  const d = board[row]?.[col];
  return d ? d.id : -1;
}

function checkSyncQueueConflict(newAction, skipIdx) {
  const queue = syncMyQueue;

  let targetRow, targetCol;
  if (newAction.type === 'flip') {
    targetRow = newAction.row; targetCol = newAction.col;
  } else {
    targetRow = newAction.toRow; targetCol = newAction.toCol;
  }

  for (let i = 0; i < queue.length; i++) {
    if (i === skipIdx) continue;
    const a = queue[i];
    let aTargetRow, aTargetCol;
    if (a.type === 'flip') {
      aTargetRow = a.row; aTargetCol = a.col;
    } else {
      aTargetRow = a.toRow; aTargetCol = a.toCol;
    }
    if (aTargetRow === targetRow && aTargetCol === targetCol) {
      return '这个格子已经被本回合其他操作占用了';
    }
  }

  if (newAction.type === 'move' || newAction.type === 'capture') {
    const fromId = getPieceIdAt(newAction.fromRow, newAction.fromCol);
    if (fromId !== -1) {
      const alreadyPlanned = queue.some((a, idx) => {
        if (idx === skipIdx) return false;
        if (a.type !== 'move' && a.type !== 'capture') return false;
        const aFromId = getPieceIdAt(a.fromRow, a.fromCol);
        return aFromId === fromId;
      });
      if (alreadyPlanned) return '这个棋子已经被本回合其他操作占用了';
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
      if (a.toRow === target.fromRow && a.toCol === target.fromCol) {
        toRemove.add(i);
      }
    });
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
            a.toRow === rt.fromRow && a.toCol === rt.fromCol) {
          toRemove.add(i); changed = true; break;
        }
      }
    });
  }

  const arr = Array.from(toRemove).sort((a, b) => b - a);
  arr.forEach(i => syncMyQueue.splice(i, 1));

  selectedRow = -1; selectedCol = -1;
  highlightSyncQueue();
  renderSyncBar();

  if (toRemove.size > 1) {
    showBanner(`已取消 ${toRemove.size} 个相关操作`, 'info', 1500);
  }
}

// ★ 核心模拟
function simulateSyncRound(actions) {
  const events = [];
  const workBoard = board.map(row => row.map(c => c ? { ...c } : null));
  const workDeadRed = [...deadRed];
  const workDeadBlack = [...deadBlack];

  const moves = [];
  const flippedKeys = new Set();

  actions.forEach(act => {
    if (act.type === 'flip') {
      const key = act.row + ',' + act.col;
      if (flippedKeys.has(key)) return;
      const cell = workBoard[act.row]?.[act.col];
      if (!cell || !cell.hidden || !cell.piece) return;
      flippedKeys.add(key);
      cell.hidden = false;
      const color = getPieceColor(cell.piece);
      events.push({
        t: 0, type: 'flip',
        row: act.row, col: act.col,
        piece: cell.piece, color,
        by: act.by
      });
    } else if (act.type === 'move' || act.type === 'capture') {
      const fromCell = workBoard[act.fromRow]?.[act.fromCol];
      if (!fromCell) return;
      const piece = fromCell.piece;
      const speed = getPieceSpeed(piece);
      const dist = Math.abs(act.toRow - act.fromRow) + Math.abs(act.toCol - act.fromCol);
      const duration = (dist / speed) * 1000;
      moves.push({
        ...act, piece, speed, duration,
        startT: 0, endT: duration
      });
    }
  });

  const STEP = 20;
  const maxT = moves.reduce((m, mv) => Math.max(m, mv.endT), 0) + 200;
  const pieceStates = {};
  moves.forEach((mv, i) => {
    const cell = workBoard[mv.fromRow][mv.fromCol];
    const pieceId = cell.id;
    pieceStates[pieceId] = {
      pieceId,
      flying: isFlying(mv.piece),
      startT: mv.startT,
      endT: mv.endT,
      from: { row: mv.fromRow, col: mv.fromCol },
      to: { row: mv.toRow, col: mv.toCol },
      by: mv.by,
      piece: mv.piece,
      dead: false,
      hasLanded: false
    };
    events.push({
      t: mv.startT, type: 'moveStart',
      pieceId,
      from: { row: mv.fromRow, col: mv.fromCol },
      to: { row: mv.toRow, col: mv.toCol },
      piece: mv.piece,
      flying: isFlying(mv.piece),
      duration: mv.duration,
      by: mv.by
    });
  });

  // 时间轴推进 + 碰撞判定
  for (let now = 0; now <= maxT; now += STEP) {
    const activePieces = [];
    Object.values(pieceStates).forEach(ps => {
      if (ps.dead) return;
      if (ps.hasLanded) return;
      if (now >= ps.startT && now < ps.endT) {
        const prog = (now - ps.startT) / (ps.endT - ps.startT);
        const r = ps.from.row + (ps.to.row - ps.from.row) * prog;
        const c = ps.from.col + (ps.to.col - ps.from.col) * prog;
        activePieces.push({ ps, r, c });
      } else if (now >= ps.endT) {
        ps.hasLanded = true;
      }
    });

    for (let i = 0; i < activePieces.length; i++) {
      for (let j = i + 1; j < activePieces.length; j++) {
        const a = activePieces[i], b = activePieces[j];
        if (a.ps.by === b.ps.by) continue;

        // ★ 双保险：直接按棋子类型判断飞行状态
        const aFlying = isFlying(a.ps.piece);
        const bFlying = isFlying(b.ps.piece);
        if (aFlying !== bFlying) continue;   // 一方飞、一方不飞 → 不碰撞

        const dr = a.r - b.r, dc = a.c - b.c;
        if (Math.sqrt(dr * dr + dc * dc) >= 0.6) continue;

        const pieceA = a.ps.piece;
        const pieceB = b.ps.piece;
        const colorA = getPieceColor(pieceA);
        const colorB = getPieceColor(pieceB);
        if (colorA === colorB) continue;

        const aEatsB = canCaptureInCollision(pieceA, pieceB);
        const bEatsA = canCaptureInCollision(pieceB, pieceA);

        if (aEatsB && bEatsA) {
          a.ps.dead = true; b.ps.dead = true;
          events.push({
            t: now, type: 'collision',
            pieceIds: [a.ps.pieceId, b.ps.pieceId],
            deadIds: [a.ps.pieceId, b.ps.pieceId],
            result: 'bothDead'
          });
          if (colorA === 'red') workDeadRed.push(pieceA); else workDeadBlack.push(pieceA);
          if (colorB === 'red') workDeadRed.push(pieceB); else workDeadBlack.push(pieceB);
        } else if (aEatsB) {
          b.ps.dead = true;
          events.push({
            t: now, type: 'collision',
            pieceIds: [b.ps.pieceId],
            deadIds: [b.ps.pieceId],
            result: 'oneDead'
          });
          if (colorB === 'red') workDeadRed.push(pieceB); else workDeadBlack.push(pieceB);
        } else if (bEatsA) {
          a.ps.dead = true;
          events.push({
            t: now, type: 'collision',
            pieceIds: [a.ps.pieceId],
            deadIds: [a.ps.pieceId],
            result: 'oneDead'
          });
          if (colorA === 'red') workDeadRed.push(pieceA); else workDeadBlack.push(pieceA);
        }
      }
    }
  }

  // 落地：分两遍
  const sortedStates = Object.values(pieceStates).sort((a, b) => a.endT - b.endT);

  sortedStates.forEach(ps => {
    if (ps.dead) {
      const cell = workBoard[ps.from.row][ps.from.col];
      if (cell && cell.id === ps.pieceId) {
        workBoard[ps.from.row][ps.from.col] = null;
      }
    }
  });

  sortedStates.forEach(ps => {
    if (ps.dead) return;

    const targetCell = workBoard[ps.to.row][ps.to.col];
    const fromCell = workBoard[ps.from.row][ps.from.col];
    const movingPiece = ps.piece;
    const movingId = ps.pieceId;

    if (targetCell && !targetCell.hidden) {
      const targetPiece = targetCell.piece;
      if (getPieceColor(movingPiece) === getPieceColor(targetPiece)) {
        workBoard[ps.from.row][ps.from.col] = { piece: movingPiece, hidden: false, id: movingId };
        events.push({
          t: ps.endT, type: 'moveEnd',
          pieceId: ps.pieceId,
          result: 'blocked',
          from: { row: ps.from.row, col: ps.from.col },
          to: { row: ps.to.row, col: ps.to.col }
        });
        return;
      }
      let canEat = false;
      if (movingPiece === '炮' || movingPiece === '砲') {
        canEat = isValidCannonCapture(ps.from.row, ps.from.col, ps.to.row, ps.to.col, workBoard);
      } else {
        canEat = canCapture(movingPiece, targetPiece);
      }
      if (canEat) {
        const targetColor = getPieceColor(targetPiece);
        if (targetColor === 'red') workDeadRed.push(targetPiece);
        else if (targetColor === 'black') workDeadBlack.push(targetPiece);
        workBoard[ps.to.row][ps.to.col] = { piece: movingPiece, hidden: false, id: movingId };
        workBoard[ps.from.row][ps.from.col] = null;
        events.push({
          t: ps.endT, type: 'moveEnd',
          pieceId: ps.pieceId,
          result: 'capture',
          targetPiece,
          targetPieceId: targetCell.id,
          from: { row: ps.from.row, col: ps.from.col },
          to: { row: ps.to.row, col: ps.to.col }
        });
      } else {
        workBoard[ps.from.row][ps.from.col] = { piece: movingPiece, hidden: false, id: movingId };
        events.push({
          t: ps.endT, type: 'moveEnd',
          pieceId: ps.pieceId,
          result: 'blocked',
          from: { row: ps.from.row, col: ps.from.col },
          to: { row: ps.to.row, col: ps.to.col }
        });
      }
    } else if (targetCell && targetCell.hidden) {
      workBoard[ps.from.row][ps.from.col] = { piece: movingPiece, hidden: false, id: movingId };
      events.push({
        t: ps.endT, type: 'moveEnd',
        pieceId: ps.pieceId,
        result: 'blocked',
        from: { row: ps.from.row, col: ps.from.col },
        to: { row: ps.to.row, col: ps.to.col }
      });
    } else {
      workBoard[ps.to.row][ps.to.col] = { piece: movingPiece, hidden: false, id: movingId };
      const startCell = workBoard[ps.from.row][ps.from.col];
      if (startCell && startCell.id === movingId) {
        workBoard[ps.from.row][ps.from.col] = null;
      }
      events.push({
        t: ps.endT, type: 'moveEnd',
        pieceId: ps.pieceId,
        result: 'ok',
        from: { row: ps.from.row, col: ps.from.col },
        to: { row: ps.to.row, col: ps.to.col }
      });
    }
  });

  events.sort((a, b) => a.t - b.t);

  return {
    events,
    finalBoard: workBoard,
    deadRed: workDeadRed,
    deadBlack: workDeadBlack,
    totalDuration: maxT
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

function playSyncPlayback(script) {
  lastPlaybackScript = script;
  lastPlaybackStartState = {
    board: board.map(row => row.map(c => c ? { ...c } : null)),
    deadRed: [...deadRed],
    deadBlack: [...deadBlack]
  };

  syncPlaying = true;
  renderSyncBar();
  document.getElementById('statusText').textContent = '播放中...';

  renderFullBoard();

  script.events.forEach(ev => {
    if (ev.type === 'moveStart') {
      const el = pieceElMap[ev.pieceId];
      if (el && ev.from && ev.to) {
        const fromPos = getPiecePos(ev.from.row, ev.from.col);
        el.style.transition = 'none';
        el.style.left = fromPos.left + 'px';
        el.style.top = fromPos.top + 'px';
      }
    }
  });
  void document.body.offsetWidth;

  script.events.forEach(ev => {
    setTimeout(() => {
      applyPlaybackEvent(ev);
    }, ev.t);
  });

  syncPlaybackTimer = setTimeout(() => {
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

    board = script.finalBoard.map(row => row.map(c => c ? { ...c } : null));
    deadRed = [...script.deadRed];
    deadBlack = [...script.deadBlack];
    prevDeadRedCount = -1;
    prevDeadBlackCount = -1;
    renderFullBoard();
    renderGraveyards();
    syncPlaying = false;

    const redCount = countPiecesByColor('red');
    const blackCount = countPiecesByColor('black');
    if (redCount === 0 || blackCount === 0) {
      const winnerColor = redCount === 0 ? 'black' : 'red';
      gameOver = true;
      currentPlayer = null;
      if (onlineMode && myColor) {
        const myWin = (myColor === winnerColor);
        gameEndReason = myWin ? '你赢了！' : '你输了';
        if (myWin) playVictorySound(); else playDefeatSound();
        uploadMyRecord(opponentUserId, myWin ? 1 : 0, myWin ? 0 : 1);
      } else {
        playVictorySound();
      }
      showWinnerModal(winnerColor);
      stopTimer();
      return;
    }

    if (myRole === 'host') {
      startSyncRound();
    } else {
      syncMyQueue = [];
      syncMySubmitted = false;
      syncOppSubmitted = false;
      selectedRow = -1; selectedCol = -1;
      clearParabolas();
      highlightSyncQueue();
      renderSyncBar();
    }
  }, script.totalDuration + 200);
}

function applyPlaybackEvent(ev) {
  switch (ev.type) {
    case 'flip':
      playFlipSound();
      break;
    case 'moveStart':
      playMoveSound();
      animatePieceMove(ev.pieceId, ev.from, ev.to, ev.duration, ev.flying);
      break;
    case 'collision':
      playCollisionSound();
      (ev.deadIds || ev.pieceIds).forEach(pid => {
        const el = pieceElMap[pid];
        if (el) {
          el.classList.add('dead-anim');
          el.style.zIndex = '70';
        }
      });
      break;
    case 'moveEnd': {
      const moverEl = pieceElMap[ev.pieceId];
      if (!moverEl) break;

      if (ev.result === 'capture') {
        playCaptureSound();
        if (ev.to) {
          const toPos = getPiecePos(ev.to.row, ev.to.col);
          moverEl.style.transition = 'none';
          moverEl.style.left = toPos.left + 'px';
          moverEl.style.top = toPos.top + 'px';
          moverEl.style.zIndex = '';
        }
        if (ev.targetPieceId !== undefined) {
          const deadEl = pieceElMap[ev.targetPieceId];
          if (deadEl) {
            deadEl.classList.add('dead-anim');
            deadEl.style.zIndex = '70';
          }
        }
      } else if (ev.result === 'blocked') {
        if (ev.from) {
          const fromPos = getPiecePos(ev.from.row, ev.from.col);
          moverEl.style.transition = 'none';
          moverEl.style.left = fromPos.left + 'px';
          moverEl.style.top = fromPos.top + 'px';
          moverEl.style.zIndex = '';
        }
      } else {
        if (ev.to) {
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

function animatePieceMove(pieceId, from, to, duration, flying) {
  const el = pieceElMap[pieceId];
  if (!el) return;
  if (!from || !to) return;
  const toPos = getPiecePos(to.row, to.col);
  el.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
  el.style.zIndex = flying ? '60' : '50';
  if (flying) el.classList.add('flying-piece');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.left = toPos.left + 'px';
      el.style.top = toPos.top + 'px';
    });
  });
  setTimeout(() => {
    el.style.transition = '';
    el.classList.remove('flying-piece');
    el.style.zIndex = '';
  }, duration);
}

function highlightSyncQueue() {
  document.querySelectorAll('.piece.sync-selected').forEach(el => el.classList.remove('sync-selected'));
  document.querySelectorAll('.cell.sync-target').forEach(el => el.classList.remove('sync-target'));
  clearParabolas();

  if (selectedRow !== -1 && selectedCol !== -1) {
    const d = board[selectedRow][selectedCol];
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
      const fromData = board[act.fromRow]?.[act.fromCol];
      if (fromData && fromData.id !== undefined) {
        const el = pieceElMap[fromData.id];
        if (el) el.classList.add('sync-selected');
      }
      const toCell = cellEls[act.toRow]?.[act.toCol];
      if (toCell) toCell.classList.add('sync-target');
      if (act.type === 'capture') {
        drawParabola(act.fromRow, act.fromCol, act.toRow, act.toCol);
      }
    }
  });
}

function drawParabola(fromRow, fromCol, toRow, toCol) {
  const svg = document.getElementById('boardOverlay');
  if (!svg) return;
  const CELL = 76;
  const x1 = fromCol * CELL + CELL / 2;
  const y1 = fromRow * CELL + CELL / 2;
  const x2 = toCol * CELL + CELL / 2;
  const y2 = toRow * CELL + CELL / 2;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - 40;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
  path.setAttribute('stroke', '#ffaa00');
  path.setAttribute('stroke-width', '3');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-dasharray', '6 4');
  path.setAttribute('opacity', '0.9');
  path.classList.add('sync-parabola');
  svg.appendChild(path);
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x2);
  circle.setAttribute('cy', y2);
  circle.setAttribute('r', '6');
  circle.setAttribute('fill', '#ffaa00');
  circle.setAttribute('opacity', '0.85');
  circle.classList.add('sync-parabola');
  svg.appendChild(circle);
}

function clearParabolas() {
  const svg = document.getElementById('boardOverlay');
  if (!svg) return;
  svg.innerHTML = '';
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
  let idx = 0;
  board = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      row.push({ piece: allPieces[idx], hidden: true, id: idx });
      idx++;
    }
    board.push(row);
  }
}
function getCellPos(row, col) { return { left: col * CELL_SIZE, top: row * CELL_SIZE }; }
function getPiecePos(row, col) { return { left: col * CELL_SIZE + OFFSET, top: row * CELL_SIZE + OFFSET }; }
function cloneBoard(b) {
  return b.map(row => row.map(cell => cell ? { piece: cell.piece, hidden: cell.hidden, id: cell.id } : null));
}

let cellEls = [];
let pieceElMap = {};
let boardDomBuilt = false;

function buildBoardDOM() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  pieceElMap = {};
  cellEls = [];
  boardDomBuilt = true;
  for (let r = 0; r < ROWS; r++) {
    cellEls[r] = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r; cell.dataset.col = c;
      const pos = getCellPos(r, c);
      cell.style.left = pos.left + 'px';
      cell.style.top = pos.top + 'px';
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
      const rr = parseInt(el.dataset.row);
      const cc = parseInt(el.dataset.col);
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
  board = prev.board;
  currentPlayer = prev.currentPlayer;
  gameOver = prev.gameOver;
  deadRed = prev.deadRed;
  deadBlack = prev.deadBlack;
  lastMovedRow = prev.lastMovedRow;
  lastMovedCol = prev.lastMovedCol;
  selectedRow = -1; selectedCol = -1;
  turnStartTs = performance.now();
  renderFullBoard();
  renderGraveyards();
  updateColorLabel();
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
      el.className = 'dead-piece red-dead';
      el.textContent = piece;
      redEl.appendChild(el);
    });
    prevDeadRedCount = deadRed.length;
  }
  if (deadBlack.length !== prevDeadBlackCount) {
    blackEl.innerHTML = '';
    deadBlack.forEach(piece => {
      const el = document.createElement('div');
      el.className = 'dead-piece black-dead';
      el.textContent = piece;
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
        if (isCannon) {
          if (isValidCannonCapture(row, col, nr, nc, board)) moves.push({ row: nr, col: nc, isCapture: true });
        } else {
          if (canCapture(piece, target.piece)) moves.push({ row: nr, col: nc, isCapture: true });
        }
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
              if (targetColor !== color && !moves.some(m => m.row === r && m.col === c)) {
                moves.push({ row: r, col: c, isCapture: true });
              }
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
  if (selectedRow !== -1 && selectedCol !== -1 && !gameOver) {
    validMoves = getValidMoves(selectedRow, selectedCol);
  }
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
  for (let id = 0; id < 32; id++) {
    const el = pieceElMap[id];
    if (el) el.classList.remove('selected');
  }
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
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const d = board[r][c];
      if (d && d.id !== undefined && d.id !== null) idPos[d.id] = { r, c, data: d };
    }
  }
  for (let id = 0; id < 32; id++) {
    const el = pieceElMap[id];
    if (!el) continue;
    const info = idPos[id];
    if (!info) {
      if (el.style.display !== 'none') el.style.display = 'none';
      continue;
    }
    const { r, c, data } = info;
    const pos = getPiecePos(r, c);
    el.style.left = pos.left + 'px';
    el.style.top = pos.top + 'px';
    el.style.display = '';
    el.dataset.row = r; el.dataset.col = c;
    const wasHidden = el.classList.contains('hidden-piece');
    el.className = 'piece';
    if (data.hidden) {
      el.classList.add('hidden-piece');
      el.textContent = '';
    } else {
      el.textContent = data.piece;
      const color = getPieceColor(data.piece);
      if (color === 'red') el.classList.add('red-piece');
      else if (color === 'black') el.classList.add('black-piece');
    }
    if (selectedRow === r && selectedCol === c && !data.hidden && !gameOver) el.classList.add('selected');
    if (lastMovedRow === r && lastMovedCol === c) el.classList.add('last-moved');
    if (wasHidden && !data.hidden) playAnim(el, 'flip-in');
  }
  updateCellHighlights();
  updateTurnIcon();
  updateButtons();
  if (gameMode === 'sync' && !syncPlaying) {
    highlightSyncQueue();
  }
}
function playAnim(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  const onEnd = () => { el.classList.remove(cls); el.removeEventListener('animationend', onEnd); };
  el.addEventListener('animationend', onEnd);
}
function updateTurnIcon() {
  const el = document.getElementById('turnIcon');
  const st = document.getElementById('statusText');
  el.className = 'turn-icon';
  if (gameOver) {
    el.classList.add('unknown-icon'); el.textContent = '';
    st.textContent = gameEndReason || '对局结束';
    return;
  }
  if (gameMode === 'sync') {
    el.classList.add('unknown-icon'); el.textContent = '';
    // ★ 不再设置 statusText
    return;
  }
  if (currentPlayer === 'red') { el.classList.add('red-icon'); el.textContent = '帥'; }
  else if (currentPlayer === 'black') { el.classList.add('black-icon'); el.textContent = '將'; }
  else { el.classList.add('unknown-icon'); el.textContent = ''; }
  if (!onlineMode) {
    if (currentPlayer === 'red') st.textContent = '轮到红方';
    else if (currentPlayer === 'black') st.textContent = '轮到黑方';
    else st.textContent = '请翻棋开局';
  } else if (currentPlayer) {
    st.textContent = isMyTurn() ? '★ 轮到你走棋' : '等待对方走棋...';
  } else {
    st.textContent = '';
  }
}
function updateButtons() {
  const yieldBtn = document.getElementById('yieldBtn');
  const undoBtn = document.getElementById('undoBtn');
  const drawBtn = document.getElementById('drawBtn');
  const resignBtn = document.getElementById('resignBtn');
  if (gameOver) {
    yieldBtn.disabled = true; undoBtn.disabled = true;
    drawBtn.disabled = true; resignBtn.disabled = true;
    return;
  }
  if (!onlineMode) { undoBtn.disabled = history.length === 0; return; }
  yieldBtn.disabled = !(myRole === 'host' && currentPlayer === 'host');
  undoBtn.disabled = history.length === 0 || gameMode === 'sync';
  drawBtn.disabled = false;
  resignBtn.disabled = false;
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
    gameOver = true;
    currentPlayer = null;
    if (onlineMode && myColor) {
      const myWin = (myColor === winnerColor);
      const reason = myWin ? '你赢了！' : '你输了';
      gameEndReason = reason + `（${winnerColor === 'red' ? '红方' : '黑方'}获胜）`;
      if (!recordUploaded) {
        uploadMyRecord(opponentUserId, myWin ? 1 : 0, myWin ? 0 : 1);
      }
    } else {
      gameEndReason = (winnerColor === 'red' ? '红方胜' : '黑方胜');
    }
    if (onlineMode && myColor) {
      if (myColor === winnerColor) playVictorySound();
      else playDefeatSound();
    } else playVictorySound();
    showWinnerModal(winnerColor);
    stopTimer();
    return true;
  }
  return false;
}

// ============================================================
//                        点击处理
// ============================================================
function handleCellClick(row, col) {
  if (gameOver) return;
  if (isReconnecting) { showBanner('正在重连，请稍候...', 'error', 1500); return; }
  if (gameMode === 'sync') {
    handleSyncCellClick(row, col);
    return;
  }
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
    refreshSelection();
    return;
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

  const cellData = board[row][col];

  if (cellData && cellData.hidden) {
    const idx = syncMyQueue.findIndex(a => a.type === 'flip' && a.row === row && a.col === col);
    if (idx >= 0) {
      removeSyncActionWithDeps(idx);
      return;
    }
    if (!cellData.piece) { showBanner('这里没有棋子', 'error', 1200); return; }
    if (syncMyQueue.length >= syncStepsPerRound) {
      showBanner('已达本回合步数上限', 'error', 1500);
      return;
    }
    const act = { type: 'flip', row, col };
    const conflict = checkSyncQueueConflict(act);
    if (conflict) { showBanner(conflict, 'error', 1500); return; }
    syncMyQueue.push(act);
    selectedRow = -1; selectedCol = -1;
    highlightSyncQueue();
    renderSyncBar();
    return;
  }

  if (cellData && !cellData.hidden) {
    const mvIdx = syncMyQueue.findIndex(a =>
      (a.type === 'move' || a.type === 'capture') &&
      a.fromRow === row && a.fromCol === col
    );
    if (mvIdx >= 0) {
      removeSyncActionWithDeps(mvIdx);
      return;
    }
  }

  if (selectedRow !== -1 && selectedCol !== -1) {
    if (selectedRow === row && selectedCol === col) {
      selectedRow = -1; selectedCol = -1;
      highlightSyncQueue();
      return;
    }
    const fromData = board[selectedRow][selectedCol];
    const fromPiece = fromData?.piece;

    if (cellData === null && fromPiece) {
      const rd = Math.abs(selectedRow - row), cd = Math.abs(selectedCol - col);
      if (rd + cd !== 1) { showBanner('只能走一格', 'error', 1200); return; }
      if (syncMyQueue.length >= syncStepsPerRound) {
        showBanner('已达本回合步数上限', 'error', 1500);
        return;
      }
      const act = {
        type: 'move',
        fromRow: selectedRow, fromCol: selectedCol,
        toRow: row, toCol: col
      };
      const conflict = checkSyncQueueConflict(act);
      if (conflict) { showBanner(conflict, 'error', 1500); return; }
      syncMyQueue.push(act);
      selectedRow = -1; selectedCol = -1;
      highlightSyncQueue();
      renderSyncBar();
      return;
    }

    if (cellData && !cellData.hidden && fromPiece &&
        getPieceColor(fromPiece) !== getPieceColor(cellData.piece)) {
      const rd = Math.abs(selectedRow - row), cd = Math.abs(selectedCol - col);
      let canEat = false;
      if (fromPiece === '炮' || fromPiece === '砲') {
        canEat = isValidCannonCapture(selectedRow, selectedCol, row, col, board);
      } else {
        canEat = (rd + cd === 1) && canCapture(fromPiece, cellData.piece);
      }
      if (!canEat) { showBanner('无法吃这个棋子', 'error', 1200); return; }
      if (syncMyQueue.length >= syncStepsPerRound) {
        showBanner('已达本回合步数上限', 'error', 1500);
        return;
      }
      const act = {
        type: 'capture',
        fromRow: selectedRow, fromCol: selectedCol,
        toRow: row, toCol: col
      };
      const conflict = checkSyncQueueConflict(act);
      if (conflict) { showBanner(conflict, 'error', 1500); return; }
      syncMyQueue.push(act);
      selectedRow = -1; selectedCol = -1;
      highlightSyncQueue();
      renderSyncBar();
      return;
    }
  }

  if (cellData && !cellData.hidden) {
    const color = getPieceColor(cellData.piece);
    if (color !== myColor) {
      showBanner('只能操作自己的棋子', 'error', 1200);
      return;
    }
    selectedRow = row; selectedCol = col;
    highlightSyncQueue();
    return;
  }
}

function executeMove(fromRow, fromCol, toRow, toCol, movingPiece, targetPiece, skipBroadcast) {
  const targetColor = targetPiece ? getPieceColor(targetPiece) : null;
  if (targetPiece) {
    if (targetColor === 'red') deadRed.push(targetPiece);
    else if (targetColor === 'black') deadBlack.push(targetPiece);
  }
  const movingId = board[fromRow][fromCol]?.id;
  board[toRow][toCol] = { piece: movingPiece, hidden: false, id: movingId };
  board[fromRow][fromCol] = null;
  lastMovedRow = toRow; lastMovedCol = toCol;
  selectedRow = -1; selectedCol = -1;
  if (targetPiece) playCaptureSound(); else playMoveSound();
  checkGameOver();
  if (!gameOver) {
    currentPlayer = (currentPlayer === 'red' ? 'black' : 'red');
    turnStartTs = performance.now();
  }
  renderFullBoard();
  renderGraveyards();
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
    if (onlineMode) {
      if (myRole === 'guest') myColor = flippedColor;
      else if (myRole === 'host') myColor = hostColor;
    }
    currentPlayer = (flippedColor === 'red' ? 'black' : 'red');
  } else if (currentPlayer === 'red' || currentPlayer === 'black') {
    currentPlayer = (currentPlayer === 'red' ? 'black' : 'red');
  }
  selectedRow = -1; selectedCol = -1;
  checkGameOver();
  if (!gameOver) turnStartTs = performance.now();
  renderFullBoard();
  renderGraveyards();
  updateColorLabel();
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
      if (targetPiece) {
        if (!isValidCannonCapture(from.row, from.col, to.row, to.col, board)) { broadcastSync(); return; }
      } else {
        if (rd + cd !== 1) { broadcastSync(); return; }
      }
    } else {
      if (targetPiece && !canCapture(movingPiece, targetPiece)) { broadcastSync(); return; }
      if (rd + cd !== 1) { broadcastSync(); return; }
    }
    commitTurnTime();
    pushHistory();
    executeMove(from.row, from.col, to.row, to.col, movingPiece, targetPiece);
  } else if (msg.type === 'flip') {
    const { row, col } = msg;
    if (!board[row] || !board[row][col] || !board[row][col].hidden) { broadcastSync(); return; }
    if (currentPlayer !== 'host' && currentPlayer !== 'guest' &&
        currentPlayer !== 'red' && currentPlayer !== 'black') { broadcastSync(); return; }
    commitTurnTime();
    pushHistory();
    executeFlip(row, col);
  }
}
function resetGame() {
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  lastOpponentUserId = '';

  initBoard();
  currentPlayer = 'host';
  gameOver = false; gameEndReason = '';
  selectedRow = -1; selectedCol = -1;
  lastMovedRow = -1; lastMovedCol = -1;
  deadRed = []; deadBlack = [];
  history = [];
  pendingUndoRequest = false;
  pendingDrawRequest = false;
  recordUploaded = false;
  syncRoundNum = 0;
  syncMyQueue = [];
  syncMySubmitted = false;
  syncOppSubmitted = false;
  syncPlaying = false;
  lastPlaybackScript = null;
  lastPlaybackStartState = null;
  resetTimersForNewGame();
  buildBoardDOM();
  renderFullBoard();
  renderGraveyards();
  const log = document.getElementById('chatLog');
  if (log) log.innerHTML = '';
  if (gameMode === 'sync') {
    document.getElementById('syncBar').classList.remove('hidden');
    renderSyncBar();
    startSyncRound();
  } else {
    document.getElementById('syncBar').classList.add('hidden');
    startTimer();
  }
}
document.getElementById('resetBtn').addEventListener('click', () => {
  if (onlineMode) {
    if (myRole === 'host') {
      if (confirm('确定重新开局？')) startGameAsHost();
    } else showBanner('只有房主可以重新开局', 'error', 2000);
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
  currentPlayer = 'guest';
  turnStartTs = performance.now();
  broadcastSync();
  send({ type: 'yieldFirst', userId: myUserId });
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
  if (onlineMode) {
    send({ type: 'resign', userId: myUserId });
    endGame('你认输了', 'loss');
  } else endGame('你认输了', 'loss');
}
function endGame(reason, type) {
  if (gameOver) return;
  gameOver = true;
  currentPlayer = null;
  gameEndReason = reason;
  selectedRow = -1; selectedCol = -1;
  stopTimer();
  stopRoomHeartbeat();
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  const modal = document.getElementById('oppDisconnectModal');
  if (modal) modal.classList.remove('show');
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
  if (hostColor === color) {
    return myRole === 'host' ? (myUsername || '房主') : (opponentUsername || '房主');
  } else {
    return myRole === 'guest' ? (myUsername || '客机') : (opponentUsername || '客机');
  }
}
function showWinnerModal(winnerColor) {
  const modal = document.getElementById('winnerModal');
  const iconEl = document.getElementById('winnerIcon');
  const titleEl = document.getElementById('winnerTitle');
  titleEl.className = 'winner-title';
  if (!winnerColor) {
    iconEl.textContent = '🤝';
    titleEl.textContent = '和棋';
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
function closeWinnerModal() {
  document.getElementById('winnerModal').classList.remove('show');
}

// ============================================================
//                    战绩上传 & 排行榜
// ============================================================
async function getUserCustomData(userId) {
  try {
    const res = await fetch(`${SERVER_URL}/get-custom-data-by-id`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (data.success) return data.data.customData || '';
    throw new Error(data.message || '获取数据失败');
  } catch (e) { console.error('getUserCustomData:', e); throw e; }
}
async function updateUserCustomData(userId, customData) {
  const res = await fetch(`${SERVER_URL}/update-custom-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  if (!/^[a-zA-Z0-9_-]+$/.test(oppUserId)) {
    console.warn('对方 userId 格式无效，跳过上传:', oppUserId);
    return;
  }
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
  hideAll();
  recordsPanel.classList.remove('hidden');
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
      if (matches > 0) {
        stats.push({
          username: user.username || '未知用户',
          wins: totalW, losses: totalL,
          matches: totalW + totalL,
          winRate: (totalW + totalL) > 0 ? Math.round(totalW / (totalW + totalL) * 100) : 0
        });
      }
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
//                    页面加载 / 卸载
// ============================================================
window.addEventListener('load', async () => {
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