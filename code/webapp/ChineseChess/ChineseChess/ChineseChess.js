// ============================================================
//                      音效模块
// ============================================================
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    } catch (e) {}
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
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
function playCheckSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  [880, 1174.66].forEach((freq, i) => {
    const t = now + i * 0.12;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.2);
  });
}
function playTimeoutWarningSound() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const now = ctx.currentTime;
  [0, 0.15, 0.3].forEach(offset => {
    const t = now + offset;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = 'square'; osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.13);
  });
}

// ============================================================
//                      全局状态
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
let gameWinnerColor = null;
let selectedRow = -1, selectedCol = -1;
let lastMovedRow = -1, lastMovedCol = -1;
let deadRed = [];
let deadBlack = [];
let history = [];
let myColor = null;
let hostColor = null;
let gameMode = 'classic';

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

let pendingInviteTargetId = null;
let onlineUsers = {};
let pendingInviteTimer = null;
let timeSelectMode = 'create';
let inviteRoomId = '';

let timeSettings = { enabled: true, totalMs: 15 * 60 * 1000, stepMs: 60 * 1000 };
let hostTimeLeft = 0, guestTimeLeft = 0, turnStartTs = 0;
let timerInterval = null, timeoutHandled = false;
let unreadChatCount = 0;

let stepWarningIssued = false;
let gameWarningIssued = false;
let lastActionSent = null;
let moveActionSequence = 0;
const pendingMoveActions = new Map();
const processedMoveActions = new Map();
const MOVE_ACK_TIMEOUT_MS = 5000;

let pendingDisconnectCheck = null;

const ROWS = 10, COLS = 9;

const WS_BASE = 'wss://scripthub.serveousercontent.com/ws';
const SERVER_URL = (typeof serverurl !== 'undefined') ? serverurl : 'https://scripthub.serveousercontent.com';
const LOBBY_ROOM = 'lobby';
const WS_ROOM_PREFIX = 'chinesechess:';
const RECORD_PREFIX = 'chinesechess_record_with_';

function getWsRoomName(room) { return WS_ROOM_PREFIX + room; }

const RANK = {
  '帥': 7, '將': 7, '仕': 6, '士': 6, '相': 5, '象': 5,
  '俥': 4, '車': 4, '傌': 3, '馬': 3, '炮': 2, '砲': 2, '兵': 1, '卒': 1
};

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

let isReconnecting = false;
let reconnectTimer = null;
let reconnectDeadline = 0;
const RECONNECT_TIMEOUT_MS = 120 * 1000;
const RECONNECT_INTERVAL_MS = 3000;
let reconnectWasInGame = false;

const CHAT_PRESETS = [
  '请神速些吧！', '容我再思量思量！', '一着不慎，满盘皆输！',
  '再与我对弈一局？', '观棋不语真君子，落子无悔大丈夫！',
  '胜败乃兵家常事！', '快点吧，等的花儿都谢了！',
  '对不起，刚才卡了！', '下次再玩吧，我要走了。'
];

// ============================================================
//                      棋盘初始化
// ============================================================
function initClassicBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const blackBack = ['車','馬','象','士','將','士','象','馬','車'];
  for (let c = 0; c < 9; c++) board[0][c] = { piece: blackBack[c], hidden: false, id: c };
  board[2][1] = { piece: '砲', hidden: false, id: 9 };
  board[2][7] = { piece: '砲', hidden: false, id: 10 };
  for (let c = 0; c < 9; c += 2) board[3][c] = { piece: '卒', hidden: false, id: 11 + c/2 };
  const redBack = ['俥','傌','相','仕','帥','仕','相','傌','俥'];
  for (let c = 0; c < 9; c++) board[9][c] = { piece: redBack[c], hidden: false, id: 16 + c };
  board[7][1] = { piece: '炮', hidden: false, id: 25 };
  board[7][7] = { piece: '炮', hidden: false, id: 26 };
  for (let c = 0; c < 9; c += 2) board[6][c] = { piece: '兵', hidden: false, id: 27 + c/2 };
}

function initFlipBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const pool = [
    '仕','仕','相','相','俥','俥','傌','傌','炮','炮','兵','兵','兵','兵','兵', 
    '士','士','象','象','車','車','馬','馬','砲','砲','卒','卒','卒','卒','卒'
  ]; // 30个
  
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  let idx = 0;
  // 将帅为明棋
  board[0][4] = { piece: '將', hidden: false, id: idx++ };
  board[9][4] = { piece: '帥', hidden: false, id: idx++ };
  
  const blackPos = [];
  for (let c = 0; c < 9; c++) if (c !== 4) blackPos.push([0, c]);
  blackPos.push([2, 1], [2, 7]);
  for (let c = 0; c < 9; c += 2) blackPos.push([3, c]);
  
  const redPos = [];
  for (let c = 0; c < 9; c++) if (c !== 4) redPos.push([9, c]);
  redPos.push([7, 1], [7, 7]);
  for (let c = 0; c < 9; c += 2) redPos.push([6, c]);

  blackPos.forEach(([r, c]) => {
    board[r][c] = { piece: pool.pop(), hidden: true, id: idx++ };
  });
  redPos.forEach(([r, c]) => {
    board[r][c] = { piece: pool.pop(), hidden: true, id: idx++ };
  });
}

function initBoard() {
  if (gameMode === 'flip') initFlipBoard();
  else initClassicBoard();
}

// 获取某位置起初“本该存在的棋子”
function getOriginalPieceAt(row, col) {
  const blackBack = ['車','馬','象','士','將','士','象','馬','車'];
  const redBack = ['俥','傌','相','仕','帥','仕','相','傌','俥'];
  if (row === 0) return blackBack[col];
  if (row === 2 && (col === 1 || col === 7)) return '砲';
  if (row === 3 && col % 2 === 0) return '卒';
  if (row === 9) return redBack[col];
  if (row === 7 && (col === 1 || col === 7)) return '炮';
  if (row === 6 && col % 2 === 0) return '兵';
  return null;
}

// ============================================================
//                      走子规则
// ============================================================
function inPalace(row, col, color) {
  if (color === 'red') return row >= 7 && row <= 9 && col >= 3 && col <= 5;
  else return row >= 0 && row <= 2 && col >= 3 && col <= 5;
}

function isValidCannonCapture(fromRow, fromCol, toRow, toCol, b) {
  if (fromRow !== toRow && fromCol !== toCol) return false;
  if (fromRow === toRow && fromCol === toCol) return false;
  let count = 0;
  if (fromRow === toRow) {
    const minC = Math.min(fromCol, toCol), maxC = Math.max(fromCol, toCol);
    for (let c = minC + 1; c < maxC; c++) if (b[fromRow][c] !== null) count++;
  } else {
    const minR = Math.min(fromRow, toRow), maxR = Math.max(fromRow, toRow);
    for (let r = minR + 1; r < maxR; r++) if (b[r][fromCol] !== null) count++;
  }
  return count === 1;
}

function getValidMoves(row, col, b, ignoreColor) {
  const cell = b[row]?.[col];
  if (!cell) return [];
  
  let piece = cell.piece;
  let color = getPieceColor(piece);
  
  if (cell.hidden) {
    const virtualPiece = getOriginalPieceAt(row, col);
    if (!virtualPiece) return [];
    piece = virtualPiece;
    color = getPieceColor(piece);
  }

  if (!color) return [];
  if (!ignoreColor && color !== currentPlayer) return [];
  
  const moves = [];
  const add = (r, c) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
    const target = b[r][c];
    if (target === null) { moves.push({ row: r, col: c, isCapture: false }); return true; }
    
    // 判断目标棋子的归属
    let targetColor = null;
    if (target.hidden) {
      // 暗棋根据位置判断归属：row>=5 为红，row<=4 为黑
      targetColor = (r >= 5) ? 'red' : 'black';
    } else {
      targetColor = getPieceColor(target.piece);
    }
    
    if (targetColor === color) return false; // 己方棋子不能吃
    moves.push({ row: r, col: c, isCapture: true });
    return false;
  };

  switch (piece) {
    case '帥': case '將': {
      const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) {
        const nr = row + dr, nc = col + dc;
        if (!inPalace(nr, nc, color)) continue;
        add(nr, nc);
      }
      if (col === 4) {
        const dir = color === 'red' ? -1 : 1;
        let r = row + dir;
        while (r >= 0 && r < ROWS) {
          const t = b[r][4];
          if (t !== null) {
            if (!t.hidden && (t.piece === '帥' || t.piece === '將') && getPieceColor(t.piece) !== color) {
              moves.push({ row: r, col: 4, isCapture: true });
            }
            break;
          }
          r += dir;
        }
      }
      break;
    }
    case '仕': case '士': {
      const dirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
      for (const [dr, dc] of dirs) {
        const nr = row + dr, nc = col + dc;
        if (gameMode === 'classic') {
          if (inPalace(row, col, color)) {
            if (!inPalace(nr, nc, color)) continue;
          } else {
            const oppColor = color === 'red' ? 'black' : 'red';
            if (!inPalace(nr, nc, oppColor)) continue;
          }
        }
        add(nr, nc);
      }
      break;
    }
    case '相': case '象': {
      const dirs = [[-2,-2],[-2,2],[2,-2],[2,2]];
      for (const [dr, dc] of dirs) {
        const nr = row + dr, nc = col + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (gameMode === 'classic') {
          if (color === 'red') {
            if (row >= 5 && nr < 5) continue;
            if (row < 5 && nr >= 5) continue;
          } else {
            if (row <= 4 && nr > 4) continue;
            if (row > 4 && nr <= 4) continue;
          }
        }
        const eyeR = row + dr/2, eyeC = col + dc/2;
        if (b[eyeR][eyeC] !== null) continue;
        add(nr, nc);
      }
      break;
    }
    case '俥': case '車': {
      const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) {
        let nr = row + dr, nc = col + dc;
        while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          const target = b[nr][nc];
          if (target === null) {
            moves.push({ row: nr, col: nc, isCapture: false });
          } else {
            if (!target.hidden) {
              const tc = getPieceColor(target.piece);
              if (tc !== color) moves.push({ row: nr, col: nc, isCapture: true });
            } else {
              const tc = (nr >= 5) ? 'red' : 'black';
              if (tc !== color) moves.push({ row: nr, col: nc, isCapture: true });
            }
            break;
          }
          nr += dr; nc += dc;
        }
      }
      break;
    }
    case '傌': case '馬': {
      const jumps = [
        [-2,-1,-1,0],[-2,1,-1,0],[2,-1,1,0],[2,1,1,0],
        [-1,-2,0,-1],[1,-2,0,-1],[-1,2,0,1],[1,2,0,1]
      ];
      for (const [dr, dc, blockR, blockC] of jumps) {
        const nr = row + dr, nc = col + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (b[row + blockR][col + blockC] !== null) continue;
        add(nr, nc);
      }
      break;
    }
    case '炮': case '砲': {
      const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) {
        let nr = row + dr, nc = col + dc;
        while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          const target = b[nr][nc];
          if (target === null) moves.push({ row: nr, col: nc, isCapture: false });
          else break;
          nr += dr; nc += dc;
        }
        let sr = row + dr, sc = col + dc, foundScreen = false;
        while (sr >= 0 && sr < ROWS && sc >= 0 && sc < COLS) {
          if (b[sr][sc] !== null) { foundScreen = true; break; }
          sr += dr; sc += dc;
        }
        if (!foundScreen) continue;
        let tr = sr + dr, tc = sc + dc;
        while (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS) {
          const t = b[tr][tc];
          if (t !== null) {
            if (!t.hidden) {
              const tc2 = getPieceColor(t.piece);
              if (tc2 !== color) moves.push({ row: tr, col: tc, isCapture: true });
            } else {
              const tc2 = (tr >= 5) ? 'red' : 'black';
              if (tc2 !== color) moves.push({ row: tr, col: tc, isCapture: true });
            }
            break;
          }
          tr += dr; tc += dc;
        }
      }
      break;
    }
    case '兵': case '卒': {
      const forward = color === 'red' ? -1 : 1;
      add(row + forward, col);
      const crossedRiver = color === 'red' ? row <= 4 : row >= 5;
      if (crossedRiver) { add(row, col - 1); add(row, col + 1); }
      break;
    }
  }
  return moves;
}

function isKingInCheck(color, b) {
  let kingPos = null;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const cell = b[r][c];
    if (cell && !cell.hidden && (cell.piece === '帥' || cell.piece === '將') && getPieceColor(cell.piece) === color) {
      kingPos = { r, c };
    }
  }
  if (!kingPos) return true; // 将帅死了视为被将军
  const oppColor = color === 'red' ? 'black' : 'red';
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const cell = b[r][c];
    if (!cell || cell.hidden) continue;
    if (getPieceColor(cell.piece) !== oppColor) continue;
    const moves = getValidMoves(r, c, b, true);
    if (moves.some(m => m.row === kingPos.r && m.col === kingPos.c)) return true;
  }
  return false;
}

function getLegalMoves(row, col, b, ignoreColor = false) {
  const cell = b[row]?.[col];
  if (!cell) return [];
  const moves = getValidMoves(row, col, b, ignoreColor);
  const color = cell.hidden
    ? getPieceColor(getOriginalPieceAt(row, col))
    : getPieceColor(cell.piece);
  if (!color) return [];
  return moves.filter(move => {
    const target = b[move.row][move.col];
    if (target && !target.hidden && (target.piece === '帥' || target.piece === '將')) return false;
    const nextBoard = cloneBoardState(b);
    nextBoard[move.row][move.col] = { ...cell, hidden: false };
    nextBoard[row][col] = null;
    return !isKingInCheck(color, nextBoard);
  });
}

function hasAnyLegalMove(color, b) {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const cell = b[r][c];
    if (!cell) continue;
    
    let pieceColor = null;
    if (cell.hidden) {
      pieceColor = (r >= 5) ? 'red' : 'black';
    } else {
      pieceColor = getPieceColor(cell.piece);
    }
    
    if (pieceColor !== color) continue;
    
    if (getLegalMoves(r, c, b, true).length > 0) return true;
  }
  return false;
}

function cloneBoardState(b) {
  return b.map(row => row.map(c => c ? { ...c } : null));
}

function findKingPos(color, b) {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const cell = b[r][c];
    if (cell && !cell.hidden && (cell.piece === '帥' || cell.piece === '將') && getPieceColor(cell.piece) === color) {
      return { r, c };
    }
  }
  return null;
}

// ============================================================
//                      界面切换
// ============================================================
const menuPanel = document.getElementById('menuPanel');
const offlineModePanel = document.getElementById('offlineModePanel');
const lobbyPanel = document.getElementById('lobbyPanel');
const waitPanel = document.getElementById('waitPanel');
const gamePanel = document.getElementById('gamePanel');
const recordsPanel = document.getElementById('recordsPanel');
const globalBanner = document.getElementById('globalBanner');
const chatFab = document.getElementById('chatFab');

function hideAll() {
  menuPanel.classList.add('hidden');
  offlineModePanel.classList.add('hidden');
  lobbyPanel.classList.add('hidden');
  waitPanel.classList.add('hidden');
  gamePanel.classList.add('hidden');
  recordsPanel.classList.add('hidden');
  chatFab.classList.add('hidden');
  document.body.classList.remove('game-active');
}
function showGamePanel() {
  gamePanel.classList.remove('hidden');
  document.body.classList.add('game-active');
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

function showOfflineMenu() {
  hideAll(); offlineModePanel.classList.remove('hidden');
}
function startOffline(mode) {
  hideAll(); showGamePanel();
  onlineMode = false; gameMode = mode;
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
  updateModeUI();
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

function updateModeUI() {
  const tag = document.getElementById('modeTag');
  const info = document.getElementById('flipInfo');
  if (gameMode === 'flip') {
    tag.textContent = '揭棋';
    info.textContent = '除将帅外全暗棋，翻开前按原位规则走';
  } else {
    tag.textContent = '普通象棋';
    info.textContent = '';
  }
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
//                      大厅
// ============================================================
function connectLobby() {
  if (lobbyWs && (lobbyWs.readyState === WebSocket.OPEN || lobbyWs.readyState === WebSocket.CONNECTING)) return;
  if (!myUserId) return;
  const url = WS_BASE + '?room=' + encodeURIComponent(getWsRoomName(LOBBY_ROOM)) + '&userId=' + encodeURIComponent(myUserId);
  let socket;
  try { socket = new WebSocket(url); } catch (e) { return; }
  lobbyWs = socket;
  socket.onopen = () => {
    if (lobbyWs !== socket) return;
    sendLobby({ type: 'hello', userId: myUserId, username: myUsername, role: 'lobby' });
    setTimeout(() => queryOnlineUsers(), 200);
  };
  socket.onmessage = (e) => { if (lobbyWs === socket) handleLobbyMessage(e.data); };
  socket.onclose = () => {
    if (lobbyWs !== socket) return;
    lobbyWs = null;
    if (!window._pageUnloading) setTimeout(() => { if (!window._pageUnloading) connectLobby(); }, 3000);
  };
  socket.onerror = () => {};
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
    try { localStorage.setItem('userid', uid); } catch (e) {}
  }
  if (!uname) {
    uname = '玩家' + uid.slice(-4);
    try { localStorage.setItem('username', uname); } catch (e) {}
  }
  myUserId = uid; myUsername = uname;
}
function updateLobbyUserLabel() {
  const el = document.getElementById('lobbyUserLabel');
  if (el) el.textContent = myUsername;
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
  sendLobby({ type: 'invite', fromUserId: myUserId, fromUsername: myUsername, toUserId, roomId: newRoomId, timeSettings: { ...timeSettings }, gameMode });
  const modeText = gameMode === 'flip' ? '【揭棋】' : '【普通象棋】';
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
    sendLobby({ type: 'joinGameAccept', fromUserId: myUserId, toUserId: msg.fromUserId, roomId, continueGame: true, hostColor, timeSettings: { ...timeSettings }, gameMode, assignRole: requesterRole });
    showBanner('已允许对方加入棋局', 'info', 2000);
  }, () => {
    sendLobby({ type: 'joinGameReject', fromUserId: myUserId, toUserId: msg.fromUserId, reason: 'refused' });
  });
}
function handleJoinAccepted(msg) {
  if (!msg.continueGame) { showBanner('对方拒绝了加入请求', 'error', 2500); return; }
  if (msg.timeSettings) Object.assign(timeSettings, msg.timeSettings);
  if (msg.gameMode) gameMode = msg.gameMode;
  if (msg.assignRole) myRole = msg.assignRole;
  else if (!myRole) myRole = 'guest';
  roomId = msg.roomId;
  showBanner('对方已允许你加入，正在进入对局...', 'info', 2000);
  enterRoom(true);
}
function handleIncomingInvite(msg) {
  if (msg.gameMode) gameMode = msg.gameMode;
  if (gameStarted && !gameOver && onlineMode) {
    showConfirm(`${msg.fromUsername} 想加入棋局，是否允许？`, () => {
      const requesterRole = (myRole === 'host') ? 'guest' : 'host';
      sendLobby({ type: 'joinGameAccept', fromUserId: myUserId, toUserId: msg.fromUserId, roomId, continueGame: true, hostColor, timeSettings: { ...timeSettings }, gameMode, assignRole: requesterRole });
    }, () => {
      sendLobby({ type: 'joinGameReject', fromUserId: myUserId, toUserId: msg.fromUserId, reason: 'refused' });
    });
    return;
  }
  const modeText = gameMode === 'flip' ? '【揭棋】' : '【普通象棋】';
  showConfirm(`${msg.fromUsername} ${modeText} 邀请你下棋，是否接受？`, () => {
    if (msg.timeSettings) Object.assign(timeSettings, msg.timeSettings);
    sendLobby({ type: 'inviteAccept', fromUserId: myUserId, toUserId: msg.fromUserId, roomId: msg.roomId });
    myRole = 'guest'; roomId = msg.roomId; enterRoom();
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
    enterRoom(true);
  } else {
    myRole = 'host'; roomId = msg.roomId;
    const modeText = gameMode === 'flip' ? '【揭棋】' : '【普通象棋】';
    showBanner(modeText + ' 对方接受邀请，进入房间...', 'info', 2000);
    enterRoom();
  }
}

// ============================================================
//                      网络
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
    } catch (e) {}
    ws = null;
  }
}
function connectWS(room, userId, isReconnect) {
  return new Promise((resolve, reject) => {
    closeExistingWS();
    const url = WS_BASE + '?room=' + encodeURIComponent(getWsRoomName(room)) + '&userId=' + encodeURIComponent(userId);
    netLog('连接 ' + url + (isReconnect ? ' (重连)' : ''));
    let socket;
    try { socket = new WebSocket(url); } catch (e) { reject(e); return; }
    ws = socket;
    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return; settled = true;
      netLog('连接超时');
      try { socket.close(); } catch (e) {}
      reject(new Error('连接超时'));
    }, 8000);
    socket.onopen = () => {
      if (ws !== socket || settled) return;
      settled = true;
      clearTimeout(timeout);
      netLog('已连接'); setConnIndicator('');
      resolve();
    };
    socket.onerror = () => {
      if (ws !== socket || settled) return;
      settled = true;
      clearTimeout(timeout);
      netLog('连接错误'); setConnIndicator('dead');
      reject(new Error('连接错误'));
    };
    socket.onclose = (e) => {
      clearTimeout(timeout);
      if (ws !== socket) return;
      netLog('关闭 code=' + e.code);
      setConnIndicator('dead'); ws = null;
      if (!settled) { settled = true; reject(new Error('连接已关闭')); }
      if (!intentionalClose) handleDisconnect(e.code);
    };
    socket.onmessage = (e) => { if (ws === socket) handleMessage(e.data); };
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
    if (obj.type === 'move' || obj.type === 'flip' || obj.type === 'flipMove') {
      lastActionSent = { type: obj.type, payload: { ...obj }, timestamp: Date.now() };
    }
  }
  ws.send(typeof obj === 'string' ? obj : JSON.stringify(obj));
  return true;
}
function clearPendingMoveActions() {
  for (const action of pendingMoveActions.values()) clearTimeout(action.timer);
  pendingMoveActions.clear();
}
function transmitMoveAction(action) {
  clearTimeout(action.timer);
  if (!send(action.payload)) return;
  action.timer = setTimeout(() => transmitMoveAction(action), MOVE_ACK_TIMEOUT_MS);
}
function sendReliableMove(payload) {
  const actionId = `${myUserId || myRole}-${Date.now()}-${++moveActionSequence}`;
  const action = { payload: { ...payload, actionId }, timer: null };
  pendingMoveActions.set(actionId, action);
  transmitMoveAction(action);
  return actionId;
}
function acknowledgeMoveAction(actionId, accepted = true) {
  if (!actionId) return;
  send({ type: 'moveAck', actionId, accepted, userId: myUserId, toUserId: opponentUserId });
}
function rememberProcessedMoveAction(actionId, accepted) {
  if (!actionId) return;
  processedMoveActions.set(actionId, accepted);
  if (processedMoveActions.size > 100) {
    processedMoveActions.delete(processedMoveActions.keys().next().value);
  }
}
function resendPendingMoveActions() {
  for (const action of pendingMoveActions.values()) transmitMoveAction(action);
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
    send({ type: 'hello', userId: myUserId, username: myUsername, role: myRole, reconnect: true, gameMode });
    resendPendingMoveActions();
    isReconnecting = false; hideBanner();
    showBanner('已重新连接', 'info', 2000);
    startTimer();
    if (reconnectWasInGame && gameStarted) {
      hideAll(); showGamePanel(); chatFab.classList.remove('hidden');
      initCornerButtons();
      if (myRole === 'host') broadcastSync();
      appendChatMessage('', '你已重新连接', 'sys');
    }
  }).catch(() => {
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(attemptReconnect, RECONNECT_INTERVAL_MS);
  });
}

// ============================================================
//                      计时
// ============================================================
function resetTimersForNewGame() {
  hostTimeLeft = timeSettings.totalMs; guestTimeLeft = timeSettings.totalMs;
  turnStartTs = performance.now(); timeoutHandled = false;
  stepWarningIssued = false;
  gameWarningIssued = false;
}
function startTimer() {
  stopTimer();
  if (!turnStartTs) turnStartTs = performance.now();
  timerInterval = setInterval(tickTimer, 200);
  tickTimer();
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
function commitTurnTime() {
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
        Swal.fire({ icon: 'warning', title: '步时不足 10 秒', text: '请尽快落子', timer: 3000, showConfirmButton: false });
      } catch (e) {}
    }
    if (!gameWarningIssued && curLeft <= 10000 && curLeft > 0) {
      gameWarningIssued = true;
      playTimeoutWarningSound();
      try {
        Swal.fire({ icon: 'warning', title: '局时不足 10 秒', text: '你的总时间即将耗尽', timer: 3000, showConfirmButton: false });
      } catch (e) {}
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
//                      聊天
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
//                      消息处理
// ============================================================
function handleMessage(raw) {
  let msg; try { msg = JSON.parse(raw); } catch (e) { return; }
  netLog('收到: ' + msg.type);

  switch (msg.type) {
    case 'ping': break;
    case 'checkDisconnect': if (msg.userId !== myUserId) onReceiveCheckDisconnect(msg); break;
    case 'checkDisconnectReply': if (msg.toUserId === myUserId) onReceiveCheckDisconnectReply(msg); break;
    case 'moveAck':
      if (msg.toUserId === myUserId && msg.userId !== myUserId) {
        const action = pendingMoveActions.get(msg.actionId);
        if (action) {
          clearTimeout(action.timer);
          pendingMoveActions.delete(msg.actionId);
          if (!msg.accepted) {
            showBanner('对方未能执行这步棋，正在重新同步棋盘', 'error', 2500);
            send({ type: 'requestSync', userId: myUserId });
          }
        }
      }
      break;
    case 'flipMove': if (myRole === 'host') handleGuestAction(msg); break;
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
        send({ type: 'hello-ack', userId: myUserId, username: myUsername, role: myRole, gameMode });
        if (gameStarted && !gameOver) {
          broadcastSync();
          hideAll(); showGamePanel(); chatFab.classList.remove('hidden');
          startTimer();
          initCornerButtons();
          appendChatMessage('', (msg.username || '对手') + ' 已重新加入，对局继续', 'sys');
          showBanner('对手已重新加入，对局继续', 'info', 2500);
        } else { updateWaitUI(); waitHint('对手已加入：' + opponentUsername, 'ok'); }
      } else if (myRole === 'guest') {
        if (msg.gameMode) gameMode = msg.gameMode;
        opponentUserId = msg.userId;
        opponentUsername = msg.username || msg.userId;
        const oppLabel = document.getElementById('gameOppLabel');
        if (oppLabel) { oppLabel.textContent = '对手：' + opponentUsername; oppLabel.style.color = '#b32b2b'; }
        send({ type: 'hello-ack', userId: myUserId, username: myUsername, role: myRole, gameMode });
        if (gameStarted && !gameOver) {
          hideAll(); showGamePanel(); chatFab.classList.remove('hidden');
          startTimer(); initCornerButtons();
        } else { updateWaitUI(); waitHint('对手已加入：' + opponentUsername, 'ok'); }
      }
      break;
    }
    case 'hello-ack': {
      if (msg.userId === myUserId) break;
      if (myRole === 'guest' && msg.gameMode) gameMode = msg.gameMode;
      opponentUserId = msg.userId;
      opponentUsername = msg.username || msg.userId;
      const oppLabel = document.getElementById('gameOppLabel');
      if (oppLabel) { oppLabel.textContent = '对手：' + opponentUsername; oppLabel.style.color = '#b32b2b'; }
      if (gameStarted && !gameOver) {
        if (gamePanel.classList.contains('hidden')) {
          hideAll(); showGamePanel(); chatFab.classList.remove('hidden');
          startTimer(); initCornerButtons();
        }
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
        applyStartState(msg.state);
      }
      break;
    case 'move':
    case 'flip':
      if (myRole === 'host') handleGuestAction(msg);
      break;
    case 'sync':
      gameStarted = true;
      if (myRole === 'guest' && msg.actionId) {
        const wasProcessed = processedMoveActions.get(msg.actionId);
        if (wasProcessed !== undefined) {
          acknowledgeMoveAction(msg.actionId, wasProcessed);
          break;
        }
      }
      applySyncState(msg.state);
      if (myRole === 'guest' && msg.actionId) {
        rememberProcessedMoveAction(msg.actionId, true);
        acknowledgeMoveAction(msg.actionId);
      }
      hideAll(); showGamePanel(); chatFab.classList.remove('hidden');
      initCornerButtons();
      if (!msg.state.gameOver) startTimer();
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
  clearPendingMoveActions();
  processedMoveActions.clear();
  intentionalClose = true;
  if (ws) { try { ws.close(); } catch (e) {} ws = null; }
  window.removeEventListener('beforeunload', onBeforeUnload);
  stopTimer();
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  if (pendingInviteTimer) { clearTimeout(pendingInviteTimer); pendingInviteTimer = null; }
  if (pendingDisconnectCheck) { clearTimeout(pendingDisconnectCheck.timer); pendingDisconnectCheck = null; }
  isReconnecting = false; reconnectWasInGame = false;
  sendLobby({ type: 'idle', userId: myUserId, username: myUsername });
  opponentUserId = ''; opponentUsername = '';
  lastOpponentUserId = '';
  selfReady = false; oppReady = false;
  gameStarted = false; onlineMode = false; gameMode = 'classic';
  myColor = null; hostColor = null;
  gameOver = false; gameEndReason = ''; gameWinnerColor = null;
  leavingToHome = false; roomFullHandled = false;
  pendingUndoRequest = false; pendingDrawRequest = false; recordUploaded = false;
  unreadChatCount = 0;
  updateChatBadge();
  const log = document.getElementById('chatLog'); if (log) log.innerHTML = '';
  const nc = document.getElementById('chatNoticeContainer'); if (nc) nc.innerHTML = '';
  hideBanner(); hideAll(); menuPanel.classList.remove('hidden');
  connectLobby();
}

// ============================================================
//                      确认弹窗
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
//                      房间 / 模式选择
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
  document.getElementById('timeControlModal').classList.add('show');
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
  roomFullHandled = false; reconnectWasInGame = false;
  try { await connectWS(roomId, myUserId, false); }
  catch (e) { lobbyHint('连接失败：' + e.message, 'error'); return; }
  onlineMode = true; applyModeButtons();
  if (directEnter) {
    hideAll(); showGamePanel(); chatFab.classList.remove('hidden');
    gameStarted = true;
    updateModeUI();
    if (!boardDomBuilt) { initBoard(); buildBoardDOM(); renderFullBoard(); renderGraveyards(); }
    initCornerButtons();
  } else {
    hideAll(); waitPanel.classList.remove('hidden');
    document.getElementById('waitRoomLabel').textContent = roomId;
    document.getElementById('netLog').textContent = '';
    selfReady = false; oppReady = false; gameStarted = false;
    opponentUserId = ''; opponentUsername = '';
    myColor = null; hostColor = null;
    updateWaitUI(); waitHint('等待对手加入...');
  }
  send({ type: 'hello', userId: myUserId, username: myUsername, role: myRole, gameMode });
  window.addEventListener('beforeunload', onBeforeUnload);
  sendLobby({ type: 'busy', userId: myUserId, username: myUsername });
}
function onBeforeUnload() {
  if (ws && ws.readyState === 1) {
    try { ws.send(JSON.stringify({ type: 'exit', userId: myUserId })); } catch (e) {}
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
//                      开局
// ============================================================
function startGameAsHost() {
  clearPendingMoveActions();
  processedMoveActions.clear();
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  lastOpponentUserId = '';
  initBoard();
  myColor = 'red'; hostColor = 'red';
  currentPlayer = 'red';
  gameOver = false; gameEndReason = ''; gameWinnerColor = null;
  selectedRow = -1; selectedCol = -1;
  lastMovedRow = -1; lastMovedCol = -1;
  deadRed = []; deadBlack = []; history = []; recordUploaded = false;
  gameStarted = true;
  lastActionSent = null;
  resetTimersForNewGame();
  enterGameUI();
  updateModeUI();
  buildBoardDOM(); renderFullBoard(); renderGraveyards();
  const log = document.getElementById('chatLog'); if (log) log.innerHTML = '';
  startTimer();
  send({ type: 'start', state: serializeState(), firstMover: 'host', timeSettings, gameMode });
}
function applyStartState(state) {
  clearPendingMoveActions();
  processedMoveActions.clear();
  deserializeState(state);
  gameStarted = true;
  gameOver = false; gameEndReason = ''; gameWinnerColor = null;
  recordUploaded = false;
  lastActionSent = null;
  enterGameUI();
  updateModeUI();
  buildBoardDOM(); renderFullBoard(); renderGraveyards();
  const log = document.getElementById('chatLog'); if (log) log.innerHTML = '';
  startTimer();
}

// ============================================================
//                      序列化
// ============================================================
function serializeState() {
  return {
    board: board.map(row => row.map(c => c ? { piece: c.piece, hidden: c.hidden, id: c.id } : null)),
    currentPlayer, gameOver, gameEndReason, gameWinnerColor, lastMovedRow, lastMovedCol,
    deadRed: [...deadRed], deadBlack: [...deadBlack],
    hostColor, hostTimeLeft, guestTimeLeft,
    timeSettings: { ...timeSettings },
    gameMode
  };
}
function deserializeState(state) {
  board = state.board.map(row => row.map(c => c ? { piece: c.piece, hidden: c.hidden, id: c.id } : null));
  currentPlayer = state.currentPlayer;
  gameOver = state.gameOver;
  gameEndReason = state.gameEndReason || '';
  gameWinnerColor = state.gameWinnerColor || null;
  lastMovedRow = state.lastMovedRow; lastMovedCol = state.lastMovedCol;
  deadRed = [...state.deadRed]; deadBlack = [...state.deadBlack];
  history = [];
  if (state.timeSettings) Object.assign(timeSettings, state.timeSettings);
  if (state.gameMode) gameMode = state.gameMode;
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
  const wasGameOver = gameOver;
  deserializeState(state);
  selectedRow = -1; selectedCol = -1;
  updateColorLabel();
  renderFullBoard();
  renderGraveyards();
  if (gameOver && !wasGameOver) showSyncedGameResult();
}
function updateColorLabel() {
  const el = document.getElementById('gameColorLabel');
  if (el) {
    if (!onlineMode) el.textContent = '';
    else if (!myColor) el.textContent = '（等待颜色确定）';
    else el.textContent = myColor === 'red' ? '我执红方' : '我执黑方';
  }
}

function getDisplayPosition(row, col) {
  if (onlineMode && myColor === 'black') {
    return { row: ROWS - 1 - row, col: COLS - 1 - col };
  }
  return { row, col };
}

// ============================================================
//                      游戏界面
// ============================================================
function enterGameUI() {
  hideAll(); showGamePanel(); chatFab.classList.remove('hidden');
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
//                      棋盘 DOM
// ============================================================
let cellEls = [];
let pieceElMap = {};
let boardDomBuilt = false;

function buildBoardDOM() {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  pieceElMap = {}; cellEls = []; boardDomBuilt = true;
  
  // 1. 底层 SVG 网格
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'board-lines');
  svg.setAttribute('viewBox', '0 0 900 1000');
  svg.setAttribute('preserveAspectRatio', 'none');
  
  const lineColor = 'rgba(90, 60, 30, 0.75)';
  const lineWidth = 2;
  
  for (let r = 0; r < 10; r++) {
    const y = r * 100 + 50;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', 50); line.setAttribute('y1', y);
    line.setAttribute('x2', 850); line.setAttribute('y2', y);
    line.setAttribute('stroke', lineColor);
    line.setAttribute('stroke-width', lineWidth);
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(line);
  }
  
  for (let c = 0; c < 9; c++) {
    const x = c * 100 + 50;
    if (c === 0 || c === 8) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x); line.setAttribute('y1', 50);
      line.setAttribute('x2', x); line.setAttribute('y2', 950);
      line.setAttribute('stroke', lineColor);
      line.setAttribute('stroke-width', lineWidth);
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.appendChild(line);
    } else {
      const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line1.setAttribute('x1', x); line1.setAttribute('y1', 50);
      line1.setAttribute('x2', x); line1.setAttribute('y2', 450);
      line1.setAttribute('stroke', lineColor);
      line1.setAttribute('stroke-width', lineWidth);
      line1.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.appendChild(line1);
      
      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line2.setAttribute('x1', x); line2.setAttribute('y1', 550);
      line2.setAttribute('x2', x); line2.setAttribute('y2', 950);
      line2.setAttribute('stroke', lineColor);
      line2.setAttribute('stroke-width', lineWidth);
      line2.setAttribute('vector-effect', 'non-scaling-stroke');
      svg.appendChild(line2);
    }
  }
  
  const palaceLines = [
    [[3,0],[5,2]], [[5,0],[3,2]],
    [[3,7],[5,9]], [[5,7],[3,9]]
  ];
  palaceLines.forEach(([p1, p2]) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p1[0] * 100 + 50);
    line.setAttribute('y1', p1[1] * 100 + 50);
    line.setAttribute('x2', p2[0] * 100 + 50);
    line.setAttribute('y2', p2[1] * 100 + 50);
    line.setAttribute('stroke', lineColor);
    line.setAttribute('stroke-width', lineWidth);
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(line);
  });
  
  const riverRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  riverRect.setAttribute('x', 0); riverRect.setAttribute('y', 450);
  riverRect.setAttribute('width', 900); riverRect.setAttribute('height', 100);
  riverRect.setAttribute('fill', 'rgba(180, 140, 90, 0.25)');
  svg.appendChild(riverRect);

  const riverChars = [
    { text: '楚', x: 200 }, { text: '河', x: 300 },
    { text: '汉', x: 600 }, { text: '界', x: 700 }
  ];
  riverChars.forEach(ch => {
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', ch.x);
    txt.setAttribute('y', 515);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('fill', 'rgba(80, 50, 25, 0.85)');
    txt.setAttribute('font-size', '56');
    txt.setAttribute('font-family', 'KaiTi, STKaiti, SimSun, serif');
    txt.setAttribute('font-weight', 'bold');
    txt.textContent = ch.text;
    svg.appendChild(txt);
  });
  
  boardEl.appendChild(svg);

  // 2. 交互层与棋子层
  for (let r = 0; r < ROWS; r++) {
    cellEls[r] = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r; cell.dataset.col = c;
      cell.style.left = `calc(${c} * var(--cell-size))`;
      cell.style.top = `calc(${r} * var(--cell-size))`;
      cell.addEventListener('click', () => {
        const position = getDisplayPosition(r, c);
        handleCellClick(position.row, position.col);
      });
      boardEl.appendChild(cell);
      cellEls[r][c] = cell;
    }
  }
  
  for (let id = 0; id < 32; id++) {
    const el = document.createElement('div');
    el.className = 'piece';
    el.style.display = 'none';
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
    const position = getDisplayPosition(r, c);
    el.style.left = `calc(${position.col} * var(--cell-size) + var(--offset))`;
    el.style.top = `calc(${position.row} * var(--cell-size) + var(--offset))`;
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
    if (selectedRow === r && selectedCol === c && !gameOver) el.classList.add('selected');
    if (lastMovedRow === r && lastMovedCol === c) el.classList.add('last-moved');
    if (wasHidden && !data.hidden) playAnim(el, 'flip-in');
  }
  updateCellHighlights();
  updateTurnIcon();
  updateButtons();
  updateCheckBanner();
}
function playAnim(el, cls) {
  el.classList.remove(cls); void el.offsetWidth;
  el.classList.add(cls);
  const onEnd = () => { el.classList.remove(cls); el.removeEventListener('animationend', onEnd); };
  el.addEventListener('animationend', onEnd);
}

function updateCheckBanner() {
  const banner = document.getElementById('checkBanner');
  if (!banner) return;
  if (gameOver) { banner.classList.add('hidden'); return; }
  let checkedColor = null;
  if (currentPlayer === 'red' || currentPlayer === 'black') {
    if (isKingInCheck(currentPlayer, board)) checkedColor = currentPlayer;
  }
  if (checkedColor) {
    const colorName = checkedColor === 'red' ? '红方' : '黑方';
    const pieceName = checkedColor === 'red' ? '帥' : '將';
    banner.textContent = `⚠ 将军！${colorName}${pieceName}被将军 ⚠`;
    banner.classList.remove('hidden');
    const kp = findKingPos(checkedColor, board);
    for (let id = 0; id < 32; id++) {
      const el = pieceElMap[id];
      if (el) el.classList.remove('in-check');
    }
    if (kp) {
      const cell = board[kp.r][kp.c];
      if (cell && cell.id !== undefined) {
        const el = pieceElMap[cell.id];
        if (el) el.classList.add('in-check');
      }
    }
  } else {
    banner.classList.add('hidden');
    for (let id = 0; id < 32; id++) {
      const el = pieceElMap[id];
      if (el) el.classList.remove('in-check');
    }
  }
}

function updateTurnIcon() {
  const el = document.getElementById('turnIcon');
  const st = document.getElementById('statusText');
  el.className = 'turn-icon';
  if (gameOver) { el.classList.add('unknown-icon'); el.textContent = ''; st.textContent = gameEndReason || '对局结束'; return; }
  if (currentPlayer === 'red') { el.classList.add('red-icon'); el.textContent = '帥'; }
  else if (currentPlayer === 'black') { el.classList.add('black-icon'); el.textContent = '將'; }
  else { el.classList.add('unknown-icon'); el.textContent = ''; }
  if (!onlineMode) {
    if (currentPlayer === 'red') st.textContent = '轮到红方';
    else if (currentPlayer === 'black') st.textContent = '轮到黑方';
    else st.textContent = '';
  } else if (currentPlayer) st.textContent = isMyTurn() ? '★ 轮到你走棋' : '等待对方走棋...';
  else st.textContent = '';
}
function updateButtons() {
  const yieldBtn = document.getElementById('yieldBtn');
  const undoBtn = document.getElementById('undoBtn');
  const drawBtn = document.getElementById('drawBtn');
  const resignBtn = document.getElementById('resignBtn');
  if (gameOver) { yieldBtn.disabled = true; undoBtn.disabled = true; drawBtn.disabled = true; resignBtn.disabled = true; return; }
  undoBtn.disabled = false;
  if (!onlineMode) return;
  yieldBtn.disabled = !(myRole === 'host' && currentPlayer === 'red' && history.length === 0);
  drawBtn.disabled = false; resignBtn.disabled = false;
}
function updateCellHighlights() {
  let validMoves = [];
  if (selectedRow !== -1 && selectedCol !== -1 && !gameOver) {
    validMoves = getLegalMoves(selectedRow, selectedCol, board, false);
  }
  const moveMap = {};
  validMoves.forEach(m => { moveMap[m.row + ',' + m.col] = m.isCapture; });
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const position = getDisplayPosition(r, c);
      const cellEl = cellEls[position.row]?.[position.col];
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
    if (d && d.id !== undefined) {
      const el = pieceElMap[d.id];
      if (el) el.classList.add('selected');
    }
  }
  updateCellHighlights();
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
function countPiecesByColor(color) {
  let n = 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const cell = board[r][c];
    if (cell && cell.piece && getPieceColor(cell.piece) === color) n++;
  }
  return n;
}

// ============================================================
//                      游戏逻辑
// ============================================================
function isMyTurn() {
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

function pushHistory() {
  history.push({
    board: cloneBoardState(board), currentPlayer, gameOver,
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
  updateColorLabel(); renderFullBoard(); renderGraveyards();
}
function undo() {
  if (gameOver) return;
  if (history.length === 0) { showBanner('当前没有可悔棋的步骤', 'info', 1500); return; }
  if (!onlineMode) { doUndoLocal(); return; }
  if (pendingUndoRequest) { showBanner('已发送悔棋请求，等待确认...', 'info', 2000); return; }
  pendingUndoRequest = true;
  send({ type: 'requestUndo', userId: myUserId });
  showBanner('已发送悔棋请求，等待确认...', 'info', 3000);
}

function evaluateGameResult() {
  const redKing = findKingPos('red', board);
  const blackKing = findKingPos('black', board);
  if (!redKing) return 'black';
  if (!blackKing) return 'red';
  
  // 检查当前玩家是否无路可走
  if (currentPlayer === 'red' || currentPlayer === 'black') {
    if (!hasAnyLegalMove(currentPlayer, board)) {
      return currentPlayer === 'red' ? 'black' : 'red';
    }
  }
  return null;
}

function checkGameOver() {
  const winner = evaluateGameResult();
  if (!winner) return false;
  gameOver = true; currentPlayer = null;
  const winnerColor = winner;
  gameWinnerColor = winnerColor;
  if (onlineMode && myColor) {
    const myWin = (myColor === winnerColor);
    const reason = myWin ? '你赢了！' : '你输了';
    gameEndReason = reason + `（${winnerColor === 'red' ? '红方' : '黑方'}获胜）`;
    if (!recordUploaded) uploadMyRecord(opponentUserId, myWin ? 1 : 0, myWin ? 0 : 1);
  } else {
    gameEndReason = (winnerColor === 'red' ? '红方胜' : '黑方胜');
  }
  if (onlineMode && myColor) { if (myColor === winnerColor) playVictorySound(); else playDefeatSound(); }
  else playVictorySound();
  showWinnerModal(winnerColor); stopTimer();
  return true;
}

// ============================================================
//                      点击处理
// ============================================================
function handleCellClick(row, col) {
  if (gameOver) return;
  if (isReconnecting) { showBanner('正在重连，请稍候...', 'error', 1500); return; }
  if (onlineMode && !isMyTurn()) {
    if (currentPlayer === 'host') showBanner('等待房主走棋...', 'info', 1000);
    else if (currentPlayer === 'guest') showBanner('等待客机走棋...', 'info', 1000);
    else showBanner('还没轮到你走棋', 'info', 1000);
    return;
  }

  const cellData = board[row][col];

  // 优先处理已选中棋子的落子/吃子行为
  if (selectedRow !== -1 && selectedCol !== -1) {
    const movingCell = board[selectedRow][selectedCol];
    if (movingCell) {
      const valid = getLegalMoves(selectedRow, selectedCol, board, false);
      const mv = valid.find(m => m.row === row && m.col === col);
      
      if (mv) {
        commitTurnTime(); pushHistory();
        if (movingCell.hidden) {
          executeFlipMove(selectedRow, selectedCol, row, col, onlineMode && myRole === 'guest');
        } else {
          const targetPiece = cellData ? cellData.piece : null;
          executeMove(selectedRow, selectedCol, row, col, movingCell.piece, targetPiece, onlineMode && myRole === 'guest');
        }
        return;
      }
    }
  }

  // 如果没落子（点了原位置，或者点了别的地方），先看是不是需要选中新棋子
  if (cellData && cellData.hidden) {
    const isMySide = (currentPlayer === 'red' && row >= 5) || (currentPlayer === 'black' && row <= 4);
    if (isMySide) {
      if (selectedRow === row && selectedCol === col) { selectedRow = -1; selectedCol = -1; }
      else { selectedRow = row; selectedCol = col; }
      refreshSelection(); 
      return;
    } else {
      // 点了敌方的暗棋，但没有合法移动可以吃它，取消选中
      selectedRow = -1; selectedCol = -1; refreshSelection();
      return;
    }
  }

  if (cellData && !cellData.hidden) {
    if (getPieceColor(cellData.piece) === currentPlayer) {
      if (selectedRow === row && selectedCol === col) { selectedRow = -1; selectedCol = -1; }
      else { selectedRow = row; selectedCol = col; }
      refreshSelection(); return;
    }
  }
  
  selectedRow = -1; selectedCol = -1; refreshSelection();
}

function executeFlipMove(fromRow, fromCol, toRow, toCol, skipBroadcast, remoteAction = false) {
  const cellData = board[fromRow][fromCol];
  if (!cellData || !cellData.hidden) return;
  
  const movingId = cellData.id;
  const piece = cellData.piece;
  
  const targetCell = board[toRow][toCol];
  if (targetCell) {
    const tc = getPieceColor(targetCell.piece);
    if (tc === 'red') deadRed.push(targetCell.piece);
    else deadBlack.push(targetCell.piece);
  }

  board[toRow][toCol] = { piece, hidden: true, id: movingId };
  board[fromRow][fromCol] = null;
  
  board[toRow][toCol].hidden = false;
  const flippedColor = getPieceColor(piece);
  
  if (currentPlayer === 'host') {
    hostColor = flippedColor;
    if (onlineMode && myRole === 'host') myColor = flippedColor;
    currentPlayer = (flippedColor === 'red' ? 'black' : 'red');
  } else if (currentPlayer === 'guest') {
    hostColor = (flippedColor === 'red' ? 'black' : 'red');
    if (onlineMode) { if (myRole === 'guest') myColor = flippedColor; else if (myRole === 'host') myColor = hostColor; }
    currentPlayer = (flippedColor === 'red' ? 'black' : 'red');
  } else if (currentPlayer === 'red' || currentPlayer === 'black') {
    currentPlayer = (currentPlayer === 'red' ? 'black' : 'red');
  }
  
  lastMovedRow = toRow; lastMovedCol = toCol;
  selectedRow = -1; selectedCol = -1;
  playFlipSound();
  
  const ended = checkGameOver();
  if (!ended) {
    if (currentPlayer === 'red' || currentPlayer === 'black') {
      if (isKingInCheck(currentPlayer, board)) setTimeout(() => playCheckSound(), 200);
    }
  }
  updateColorLabel(); renderFullBoard(); renderGraveyards();
  
  if (!skipBroadcast && onlineMode && myRole === 'host') {
    if (remoteAction) broadcastSync();
    else sendReliableMove({ type: 'sync', state: serializeState() });
  }
  if (skipBroadcast && onlineMode && myRole === 'guest') {
    sendReliableMove({ type: 'flipMove', userId: myUserId, from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } });
  }
}

function executeMove(fromRow, fromCol, toRow, toCol, movingPiece, targetPiece, skipBroadcast, remoteAction = false) {
  const targetColor = targetPiece ? getPieceColor(targetPiece) : null;
  if (targetPiece) { if (targetColor === 'red') deadRed.push(targetPiece); else if (targetColor === 'black') deadBlack.push(targetPiece); }
  const movingId = board[fromRow][fromCol]?.id;
  board[toRow][toCol] = { piece: movingPiece, hidden: false, id: movingId };
  board[fromRow][fromCol] = null;
  lastMovedRow = toRow; lastMovedCol = toCol;
  selectedRow = -1; selectedCol = -1;
  if (targetPiece) playCaptureSound(); else playMoveSound();
  if (!gameOver) {
    currentPlayer = (currentPlayer === 'red' ? 'black' : 'red');
    turnStartTs = performance.now();
  }
  const ended = checkGameOver();
  if (!ended) {
    if (currentPlayer === 'red' || currentPlayer === 'black') {
      if (isKingInCheck(currentPlayer, board)) setTimeout(() => playCheckSound(), 200);
    }
  }
  renderFullBoard(); renderGraveyards();
  if (!skipBroadcast && onlineMode && myRole === 'host') {
    if (remoteAction) broadcastSync();
    else sendReliableMove({ type: 'sync', state: serializeState() });
  }
  if (skipBroadcast && onlineMode && myRole === 'guest') {
    sendReliableMove({ type: 'move', userId: myUserId, from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } });
  }
}

function handleGuestAction(msg) {
  const actionId = msg.actionId;
  const previouslyProcessed = actionId ? processedMoveActions.get(actionId) : undefined;
  if (previouslyProcessed !== undefined) {
    acknowledgeMoveAction(actionId, previouslyProcessed);
    return;
  }
  const rejectAction = () => {
    rememberProcessedMoveAction(actionId, false);
    acknowledgeMoveAction(actionId, false);
    broadcastSync();
  };
  if (isHostTurnLocal()) { rejectAction(); return; }
  if (!msg.from || !msg.to || !Number.isInteger(msg.from.row) || !Number.isInteger(msg.from.col) ||
      !Number.isInteger(msg.to.row) || !Number.isInteger(msg.to.col) ||
      msg.from.row < 0 || msg.from.row >= ROWS || msg.from.col < 0 || msg.from.col >= COLS ||
      msg.to.row < 0 || msg.to.row >= ROWS || msg.to.col < 0 || msg.to.col >= COLS) {
    rejectAction();
    return;
  }
  if (msg.type === 'move') {
    const { from, to } = msg;
    if (!board[from.row] || !board[from.row][from.col]) { rejectAction(); return; }
    const movingCell = board[from.row][from.col];
    if (movingCell.hidden) { rejectAction(); return; }
    const movingPiece = movingCell.piece;
    if (getPieceColor(movingPiece) !== currentPlayer) { rejectAction(); return; }
    const targetPiece = board[to.row]?.[to.col]?.piece || null;
    if (targetPiece && getPieceColor(targetPiece) === getPieceColor(movingPiece)) { rejectAction(); return; }
    const valid = getLegalMoves(from.row, from.col, board, false);
    if (!valid.some(m => m.row === to.row && m.col === to.col)) { rejectAction(); return; }
    commitTurnTime(); pushHistory();
    executeMove(from.row, from.col, to.row, to.col, movingPiece, targetPiece, false, true);
    rememberProcessedMoveAction(actionId, true);
    acknowledgeMoveAction(actionId);
  } else if (msg.type === 'flipMove' || msg.type === 'flip') {
    const { from, to } = msg;
    if (!board[from.row] || !board[from.row][from.col] || !board[from.row][from.col].hidden) { rejectAction(); return; }
    const valid = getLegalMoves(from.row, from.col, board, false);
    if (!valid.some(m => m.row === to.row && m.col === to.col)) { rejectAction(); return; }
    commitTurnTime(); pushHistory();
    executeFlipMove(from.row, from.col, to.row, to.col, false, true);
    rememberProcessedMoveAction(actionId, true);
    acknowledgeMoveAction(actionId);
  } else rejectAction();
}

function resetGame() {
  clearPendingMoveActions();
  processedMoveActions.clear();
  if (oppDisconnectTimer) { clearInterval(oppDisconnectTimer); oppDisconnectTimer = null; }
  lastOpponentUserId = '';
  initBoard();
  currentPlayer = 'red';
  gameOver = false; gameEndReason = ''; gameWinnerColor = null;
  selectedRow = -1; selectedCol = -1;
  lastMovedRow = -1; lastMovedCol = -1;
  deadRed = []; deadBlack = []; history = [];
  pendingUndoRequest = false; pendingDrawRequest = false; recordUploaded = false;
  lastActionSent = null;
  hostColor = 'red'; myColor = onlineMode ? 'red' : null;
  resetTimersForNewGame();
  buildBoardDOM(); renderFullBoard(); renderGraveyards();
  const log = document.getElementById('chatLog'); if (log) log.innerHTML = '';
  startTimer();
}
document.getElementById('resetBtn').addEventListener('click', () => {
  if (onlineMode) {
    if (myRole === 'host') { if (confirm('确定重新开局？')) startGameAsHost(); }
    else showBanner('只有房主可以重新开局', 'error', 2000);
  } else resetGame();
});
document.getElementById('undoBtn').addEventListener('click', undo);

// ============================================================
//                      让先 / 和棋 / 认输
// ============================================================
function yieldFirst() {
  if (gameOver) return;
  if (!onlineMode) { showBanner('离线模式无需让先', 'error', 1500); return; }
  if (myRole !== 'host') { showBanner('只有房主可以让先', 'error', 1500); return; }
  if (currentPlayer !== 'red' || history.length !== 0) { showBanner('让先只能在开局第一步前使用', 'error', 1500); return; }
  currentPlayer = 'black';
  turnStartTs = performance.now();
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
  gameWinnerColor = type === 'draw'
    ? 'draw'
    : (type === 'win' ? (myColor || hostColor || 'red') : (myColor === 'red' ? 'black' : 'red'));
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
    showWinnerModal(gameWinnerColor);
  } else if (type === 'loss') {
    playDefeatSound();
    showWinnerModal(gameWinnerColor);
  } else {
    playDrawSound();
    showWinnerModal(null);
  }
}

function showSyncedGameResult() {
  if (!gameWinnerColor) {
    if (gameEndReason.includes('和棋')) gameWinnerColor = 'draw';
    else {
      const winnerMatch = gameEndReason.match(/[（(](红方|黑方)获胜[）)]/);
      if (winnerMatch) gameWinnerColor = winnerMatch[1] === '红方' ? 'red' : 'black';
    }
  }
  const winnerColor = gameWinnerColor === 'red' || gameWinnerColor === 'black' ? gameWinnerColor : null;
  if (winnerColor) {
    const myWin = myColor === winnerColor;
    gameEndReason = `${myWin ? '你赢了！' : '你输了'}（${winnerColor === 'red' ? '红方' : '黑方'}获胜）`;
    if (!recordUploaded) uploadMyRecord(opponentUserId, myWin ? 1 : 0, myWin ? 0 : 1);
    if (myWin) playVictorySound();
    else playDefeatSound();
  } else {
    gameEndReason = '双方和棋';
    playDrawSound();
  }
  renderFullBoard();
  showWinnerModal(winnerColor);
  stopTimer();
}

// ============================================================
//                      胜利弹窗
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
//                      战绩上传 & 排行榜（独立数据）
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
    const record = `${RECORD_PREFIX}${oppUserId}:${myWin},${oppWin}`;
    const currentData = await getUserCustomData(myUserId);
    const updated = updateRecord(currentData, record);
    await updateUserCustomData(myUserId, updated);
    console.log('战绩已上传:', record);
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
        if (!rec.startsWith(RECORD_PREFIX)) return;
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
      listEl.innerHTML = '<div style="text-align:center; padding:20px; color:#5a3f28;">暂无战绩</div>';
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
//                      棋桌右上角按钮
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
  container.style.display = 'flex';
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
}
function onReceiveCheckDisconnectReply(msg) {
  if (pendingDisconnectCheck) {
    clearTimeout(pendingDisconnectCheck.timer);
    pendingDisconnectCheck = null;
    showBanner('对方在线 ✓', 'info', 2000);
  }
}

function resendLastAction() {
  if (!onlineMode || !ws || ws.readyState !== 1) { showBanner('未连接', 'error', 1500); return; }
  if (!gameStarted || gameOver) { showBanner('未在对局中', 'error', 1500); return; }
  if (myRole === 'host') {
    broadcastSync();
    showBanner('已重新同步棋盘给对手', 'info', 2000);
    return;
  }
  if (lastActionSent && Date.now() - lastActionSent.timestamp < 60000) {
    send(lastActionSent.payload);
    showBanner('已重发上一步走棋', 'info', 2000);
  } else {
    send({ type: 'requestSync', userId: myUserId });
    showBanner('已请求主机重新同步', 'info', 2000);
  }
}

function updateBoardSizing() {
  const viewport = window.visualViewport;
  const width = Math.min(document.documentElement.clientWidth || window.innerWidth, viewport ? viewport.width : window.innerWidth);
  const height = viewport ? viewport.height : window.innerHeight;
  const mobile = width <= 700;
  const horizontalSpace = mobile ? 64 : 280;
  const verticalSpace = mobile ? 120 : 40;
  const cellSize = Math.max(24, Math.min(76, (width - horizontalSpace) / COLS, (height - verticalSpace) / ROWS));
  const root = document.documentElement;
  root.style.setProperty('--cell-size', cellSize + 'px');
  root.style.setProperty('--piece-size', (cellSize * 0.9) + 'px');
  if (boardDomBuilt) renderFullBoard();
}

// ============================================================
//                      页面加载
// ============================================================
window.addEventListener('resize', updateBoardSizing);
window.addEventListener('orientationchange', updateBoardSizing);
if (window.visualViewport) window.visualViewport.addEventListener('resize', updateBoardSizing);
window.addEventListener('load', async () => {
  updateBoardSizing();
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