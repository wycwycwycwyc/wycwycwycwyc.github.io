
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

    // 走棋：短促木质"嗒"
    function playMoveSound() {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(720, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.28, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.14);
    }

    // 吃子：更响、更透的三段叠加
    function playCaptureSound() {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;

      // 1) 主撞击音
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.16);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.42, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.24);

      // 2) 高频噪声（"透"感）
      const dur = 0.1;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1800;
      const nGain = ctx.createGain();
      nGain.gain.value = 0.18;
      noise.connect(hp).connect(nGain).connect(ctx.destination);
      noise.start(now);

      // 3) 低频厚度
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(180, now);
      bass.frequency.exponentialRampToValueAtTime(60, now + 0.18);
      bassGain.gain.setValueAtTime(0.0001, now);
      bassGain.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      bass.connect(bassGain).connect(ctx.destination);
      bass.start(now); bass.stop(now + 0.26);
    }

    // 翻棋：清脆"啪"
    function playFlipSound() {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.24, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.15);
    }

    // 胜利：上行四音 C-E-G-C
    function playVictorySound() {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const t = now + i * 0.14;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.6);
      });
    }

    // 失败：下行四音
    function playDefeatSound() {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [392, 349.23, 293.66, 261.63];
      notes.forEach((freq, i) => {
        const t = now + i * 0.16;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.55);
      });
    }

    // 和棋：中性两音
    function playDrawSound() {
      const ctx = getAudioCtx(); if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 523.25].forEach((freq, i) => {
        const t = now + i * 0.2;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.4);
      });
    }

    // ============================================================
    //                        全局状态
    // ============================================================
    let ws = null;
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

    const ROWS = 8, COLS = 4;
    const CELL_SIZE = 76, PIECE_SIZE = 68;
    const OFFSET = (CELL_SIZE - PIECE_SIZE) / 2;

    const WS_BASE = 'wss://scripthub.serveousercontent.com/ws';
    const SERVER_URL = serverurl;

    const RANK = {
      '將': 7, '帥': 7, '士': 6, '仕': 6, '象': 5, '相': 5,
      '車': 4, '俥': 4, '馬': 3, '傌': 3, '炮': 2, '砲': 2, '卒': 1, '兵': 1
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

    // ============================================================
    //                 用户信息
    // ============================================================
    async function fetchUserIdByUsername(username) {
      const res = await fetch(`${SERVER_URL}/get-user-id-by-username`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username })
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      if (data && data.success && data.data && data.data.userId) {
        return data.data.userId;
      }
      throw new Error((data && data.message) || '获取 userId 失败');
    }

    async function loadUserInfo() {
      let uname = localStorage.getItem('username') || '';
      let uid = localStorage.getItem('userid') || '';

      if (!uid && uname) {
        try {
          uid = await fetchUserIdByUsername(uname);
          localStorage.setItem('userid', uid);
          console.log('已从服务器获取 userId:', uid);
        } catch (e) {
          console.error('获取 userId 失败:', e);
        }
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

    function hideAll() {
      menuPanel.classList.add('hidden');
      lobbyPanel.classList.add('hidden');
      waitPanel.classList.add('hidden');
      gamePanel.classList.add('hidden');
      recordsPanel.classList.add('hidden');
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
      myColor = null;
      hostColor = null;
      myRole = '';
      roomId = '';
      opponentUserId = '';
      opponentUsername = '';
      document.getElementById('gameRoomLabel').textContent = '离线';
      document.getElementById('gameRoleLabel').textContent = '';
      document.getElementById('gameColorLabel').textContent = '';
      document.getElementById('gameOppLabel').textContent = '';
      document.getElementById('connDot').style.display = 'none';
      resetGame();
      applyModeButtons();
    }
    function showOnline() {
      hideAll();
      lobbyPanel.classList.remove('hidden');
      document.getElementById('lobbyHint').textContent = '';
      updateLobbyUserLabel();
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
          if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
            ws.close(1000, 'client closing');
          }
        } catch (e) { }
        ws = null;
      }
    }

    function connectWS(room, userId) {
      return new Promise((resolve, reject) => {
        closeExistingWS();
        const url = WS_BASE + '?room=' + encodeURIComponent(room) + '&userId=' + encodeURIComponent(userId);
        netLog('连接 ' + url);
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
          if (!intentionalClose) handleDisconnect(e.code);
        };
        ws.onmessage = (e) => handleMessage(e.data);
      });
    }

    function handleDisconnect() {
      if (leavingToHome) return;
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

    // ============================================================
    //                        消息处理
    // ============================================================
    function handleMessage(raw) {
      let msg;
      try { msg = JSON.parse(raw); } catch (e) { return; }
      netLog('收到: ' + msg.type);

      switch (msg.type) {
        case 'hello': {
          if (myRole !== 'host') return;
          if (opponentUserId && opponentUserId !== msg.userId) {
            send({ type: 'roomFull', hostId: myUserId, oppId: opponentUserId });
            return;
          }
          if (msg.userId === myUserId) {
            waitHint('相同 userId，无法对战', 'error');
            send({ type: 'exit', userId: myUserId });
            setTimeout(() => leaveRoom(), 1500);
            return;
          }
          opponentUserId = msg.userId;
          opponentUsername = msg.username || msg.userId;
          send({ type: 'hello-ack', userId: myUserId, username: myUsername, role: myRole });
          updateWaitUI();
          waitHint('对手已加入：' + opponentUsername, 'ok');
          break;
        }
        case 'hello-ack': {
          if (myRole !== 'guest') return;
          if (msg.userId === myUserId) {
            waitHint('相同 userId，无法对战', 'error');
            send({ type: 'exit', userId: myUserId });
            setTimeout(() => leaveRoom(), 1500);
            return;
          }
          opponentUserId = msg.userId;
          opponentUsername = msg.username || msg.userId;
          updateWaitUI();
          waitHint('对手已加入：' + opponentUsername, 'ok');
          break;
        }
        case 'roomFull':
          if (msg.hostId === myUserId || msg.oppId === myUserId) break;
          if (roomFullHandled) break;
          roomFullHandled = true;
          showBanner('房间已满，无法加入', 'error', 3000);
          setTimeout(() => { roomFullHandled = false; leaveRoom(); }, 1500);
          break;
        case 'ready':
          if (msg.userId === opponentUserId || !opponentUserId) {
            oppReady = msg.ready;
            updateWaitUI();
            checkBothReady();
          }
          break;
        case 'start':
          if (myRole === 'guest') applyStartState(msg.state);
          break;
        case 'move':
        case 'flip':
          if (myRole === 'host') handleGuestAction(msg);
          break;
        case 'sync':
          if (myRole === 'guest') applySyncState(msg.state);
          break;
        case 'requestUndo':
          incomingUndoRequest();
          break;
        case 'undoAccepted':
          if (myRole === 'host') {
            doUndoLocal();
            broadcastSync();
          }
          pendingUndoRequest = false;
          showBanner('对方同意悔棋', 'info', 1500);
          break;
        case 'undoRejected':
          pendingUndoRequest = false;
          showBanner('对方拒绝了悔棋', 'error', 2500);
          break;
        case 'yieldFirst':
          if (msg.userId !== myUserId) {
            showBanner('对手让先，请你先走', 'info', 3000);
          }
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
        case 'exit':
          handleOpponentExit();
          break;
        default:
          break;
      }
    }

    function incomingUndoRequest() {
      const who = opponentUsername || '对方';
      showConfirm(who + ' 请求悔棋，是否同意？', () => {
        send({ type: 'undoAccepted', userId: myUserId });
        if (myRole === 'host') {
          doUndoLocal();
          broadcastSync();
        }
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

    function handleOpponentExit() {
      if (leavingToHome) return;
      if (gameStarted && !gameOver) {
        endGame('对方已离开，你赢了', 'win');
        setTimeout(() => {
          leavingToHome = true;
          goHome();
        }, 2500);
        return;
      }
      leavingToHome = true;
      const who = opponentUsername || '对手';
      showBanner('⚠ ' + who + ' 已离开，即将返回主页...', 'error', 2500);
      setTimeout(() => goHome(), 2000);
    }

    function goHome() {
      intentionalClose = true;
      if (ws) { try { ws.close(); } catch (e) { } ws = null; }
      window.removeEventListener('beforeunload', onBeforeUnload);
      opponentUserId = ''; opponentUsername = '';
      selfReady = false; oppReady = false;
      gameStarted = false;
      onlineMode = false;
      myColor = null;
      hostColor = null;
      gameOver = false;
      gameEndReason = '';
      leavingToHome = false;
      roomFullHandled = false;
      pendingUndoRequest = false;
      pendingDrawRequest = false;
      recordUploaded = false;
      hideBanner();
      hideAll();
      menuPanel.classList.remove('hidden');
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
    //                        房间
    // ============================================================
    function generateRoomId() {
      return String(Math.floor(100000 + Math.random() * 900000));
    }
    async function createRoom() {
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
    async function enterRoom() {
      intentionalClose = false;
      leavingToHome = false;
      roomFullHandled = false;
      try {
        await connectWS(roomId, myUserId);
      } catch (e) {
        lobbyHint('连接失败：' + e.message, 'error');
        return;
      }

      onlineMode = true;
      applyModeButtons();

      hideAll();
      waitPanel.classList.remove('hidden');
      document.getElementById('waitRoomLabel').textContent = roomId;
      document.getElementById('netLog').textContent = '';
      selfReady = false; oppReady = false;
      gameStarted = false;
      opponentUserId = '';
      opponentUsername = '';
      myColor = null;
      hostColor = null;
      updateWaitUI();
      waitHint('等待对手加入...');
      send({ type: 'hello', userId: myUserId, username: myUsername, role: myRole });
      window.addEventListener('beforeunload', onBeforeUnload);
    }
    function onBeforeUnload() {
      if (ws && ws.readyState === 1) {
        try { ws.send(JSON.stringify({ type: 'exit', userId: myUserId })); } catch (e) { }
      }
    }
    function leaveRoom() {
      intentionalClose = true;
      send({ type: 'exit', userId: myUserId });
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
      initBoard();
      myColor = null;
      hostColor = null;
      currentPlayer = 'host';
      gameOver = false;
      gameEndReason = '';
      selectedRow = -1; selectedCol = -1;
      lastMovedRow = -1; lastMovedCol = -1;
      deadRed = []; deadBlack = [];
      history = [];
      recordUploaded = false;
      gameStarted = true;

      enterGameUI();
      buildBoardDOM();
      renderFullBoard();
      renderGraveyards();

      send({ type: 'start', state: serializeState(), firstMover: 'host' });
    }

    function applyStartState(state) {
      deserializeState(state);
      gameStarted = true;
      gameOver = false;
      gameEndReason = '';
      recordUploaded = false;
      enterGameUI();
      buildBoardDOM();
      renderFullBoard();
      renderGraveyards();
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
        hostColor
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

      hostColor = state.hostColor || null;
      if (myRole === 'host') {
        myColor = hostColor;
      } else if (myRole === 'guest') {
        myColor = hostColor ? (hostColor === 'red' ? 'black' : 'red') : null;
      }
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
      document.getElementById('gameRoomLabel').textContent = roomId || '离线';
      document.getElementById('gameRoleLabel').textContent =
        myRole === 'host' ? '（房主）' : (myRole === 'guest' ? '（客机）' : '');
      document.getElementById('gameOppLabel').textContent =
        opponentUserId ? '对手：' + (opponentUsername || opponentUserId) : '';
      document.getElementById('gameOppLabel').style.color = '#b32b2b';
      document.getElementById('connDot').style.display = onlineMode ? 'inline-block' : 'none';
      updateColorLabel();
      applyModeButtons();
    }
    function exitGame() {
      if (onlineMode && !gameOver) {
        if (!confirm('确定要离开棋局吗？对手将同时结束对局。')) return;
      }
      leaveRoom();
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

    // ============================================================
    //      棋盘 DOM（一次性构建，之后只增量更新 → 保留动画）
    // ============================================================
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
          cell.dataset.row = r;
          cell.dataset.col = c;
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
        el.style.left = '0px';
        el.style.top = '0px';
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
      renderFullBoard();
      renderGraveyards();
      updateColorLabel();
    }
    function undo() {
      if (gameOver) return;
      if (!onlineMode) { doUndoLocal(); return; }
      if (pendingUndoRequest) {
        showBanner('已发送悔棋请求，等待确认...', 'info', 2000);
        return;
      }
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
              if (isValidCannonCapture(row, col, nr, nc)) moves.push({ row: nr, col: nc, isCapture: true });
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
          if (d && d.id !== undefined && d.id !== null) {
            idPos[d.id] = { r, c, data: d };
          }
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
        el.dataset.row = r;
        el.dataset.col = c;

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

        if (selectedRow === r && selectedCol === c && !data.hidden && !gameOver) {
          el.classList.add('selected');
        }
        if (lastMovedRow === r && lastMovedCol === c) {
          el.classList.add('last-moved');
        }

        if (wasHidden && !data.hidden) {
          playAnim(el, 'flip-in');
        }
      }

      updateCellHighlights();
      updateTurnIcon();
      updateButtons();
    }

    function playAnim(el, cls) {
      el.classList.remove(cls);
      void el.offsetWidth;
      el.classList.add(cls);
      const onEnd = () => {
        el.classList.remove(cls);
        el.removeEventListener('animationend', onEnd);
      };
      el.addEventListener('animationend', onEnd);
    }

    function updateTurnIcon() {
      const el = document.getElementById('turnIcon');
      const st = document.getElementById('statusText');
      el.className = 'turn-icon';

      if (gameOver) {
        el.classList.add('unknown-icon');
        el.textContent = '';
        st.textContent = gameEndReason || '对局结束';
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
        yieldBtn.disabled = true;
        undoBtn.disabled = true;
        drawBtn.disabled = true;
        resignBtn.disabled = true;
        return;
      }

      if (!onlineMode) {
        undoBtn.disabled = history.length === 0;
        return;
      }

      yieldBtn.disabled = !(myRole === 'host' && currentPlayer === 'host');
      undoBtn.disabled = history.length === 0;
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
          const myWinNum = myWin ? 1 : 0;
          const oppWinNum = myWin ? 0 : 1;
          uploadMyRecord(opponentUserId, myWinNum, oppWinNum);
        } else {
          gameEndReason = (winnerColor === 'red' ? '红方胜' : '黑方胜');
        }
        // ★ 胜利音效 + 弹窗
        if (onlineMode && myColor) {
          if (myColor === winnerColor) playVictorySound();
          else playDefeatSound();
        } else {
          playVictorySound();
        }
        showWinnerModal(winnerColor);
        return true;
      }
      return false;
    }

    function isValidCannonCapture(fromRow, fromCol, toRow, toCol) {
      if (fromRow !== toRow && fromCol !== toCol) return false;
      if (fromRow === toRow && fromCol === toCol) return false;
      let count = 0;
      if (fromRow === toRow) {
        const minCol = Math.min(fromCol, toCol), maxCol = Math.max(fromCol, toCol);
        for (let c = minCol + 1; c < maxCol; c++) if (board[fromRow][c] !== null) count++;
      } else {
        const minRow = Math.min(fromRow, toRow), maxRow = Math.max(fromRow, toRow);
        for (let r = minRow + 1; r < maxRow; r++) if (board[r][fromCol] !== null) count++;
      }
      return count === 1;
    }

    // ============================================================
    //                        点击处理
    // ============================================================
    function handleCellClick(row, col) {
      if (gameOver) return;

      if (onlineMode && !isMyTurn()) {
        if (currentPlayer === 'host') showBanner('等待房主先翻棋...', 'info', 1000);
        else if (currentPlayer === 'guest') showBanner('等待客机先翻棋...', 'info', 1000);
        else showBanner('还没轮到你走棋', 'info', 1000);
        return;
      }

      const cellData = board[row][col];

      // 空格
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
          pushHistory();
          executeMove(fromRow, fromCol, row, col, movingPiece, null, true);
          send({ type: 'move', userId: myUserId, from: { row: fromRow, col: fromCol }, to: { row, col } });
          return;
        }
        pushHistory();
        executeMove(fromRow, fromCol, row, col, movingPiece, null);
        return;
      }

      // 暗棋
      if (cellData.hidden) {
        if (selectedRow !== -1) { selectedRow = -1; selectedCol = -1; refreshSelection(); return; }
        if (onlineMode && myRole === 'guest') {
          pushHistory();
          executeFlip(row, col, true);
          send({ type: 'flip', userId: myUserId, row, col });
          return;
        }
        pushHistory();
        executeFlip(row, col);
        return;
      }

      // 明棋
      const pieceColor = getPieceColor(cellData.piece);
      if (currentPlayer !== 'red' && currentPlayer !== 'black') return;
      if (pieceColor === currentPlayer) {
        if (selectedRow === row && selectedCol === col) { selectedRow = -1; selectedCol = -1; }
        else { selectedRow = row; selectedCol = col; }
        refreshSelection();
        return;
      }

      // 吃子
      if (selectedRow !== -1 && selectedCol !== -1) {
        const fromRow = selectedRow, fromCol = selectedCol;
        const movingPiece = board[fromRow][fromCol]?.piece;
        if (!movingPiece) { selectedRow = -1; selectedCol = -1; refreshSelection(); return; }
        const movingColor = getPieceColor(movingPiece);
        if (movingColor !== currentPlayer) { selectedRow = -1; selectedCol = -1; refreshSelection(); return; }
        const targetPiece = cellData.piece;

        if (movingPiece === '炮' || movingPiece === '砲') {
          if (!isValidCannonCapture(fromRow, fromCol, row, col)) { refreshSelection(); return; }
        } else {
          if (!canCapture(movingPiece, targetPiece)) { refreshSelection(); return; }
          const rowDiff = Math.abs(fromRow - row), colDiff = Math.abs(fromCol - col);
          if (rowDiff + colDiff !== 1) { refreshSelection(); return; }
        }

        if (onlineMode && myRole === 'guest') {
          pushHistory();
          executeMove(fromRow, fromCol, row, col, movingPiece, targetPiece, true);
          send({ type: 'move', userId: myUserId, from: { row: fromRow, col: fromCol }, to: { row, col } });
          return;
        }
        pushHistory();
        executeMove(fromRow, fromCol, row, col, movingPiece, targetPiece);
        return;
      }
      refreshSelection();
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

      // ★ 音效
      if (targetPiece) playCaptureSound();
      else playMoveSound();

      checkGameOver();
      if (!gameOver) {
        currentPlayer = (currentPlayer === 'red' ? 'black' : 'red');
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

      // ★ 翻棋音效
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
      renderFullBoard();
      renderGraveyards();
      updateColorLabel();
      if (!skipBroadcast && onlineMode && myRole === 'host') broadcastSync();
    }

    function handleGuestAction(msg) {
      if (isHostTurnLocal()) {
        broadcastSync();
        return;
      }

      if (msg.type === 'move') {
        const { from, to } = msg;
        if (!board[from.row] || !board[from.row][from.col]) { broadcastSync(); return; }
        const movingPiece = board[from.row][from.col].piece;
        if (!movingPiece) { broadcastSync(); return; }
        if (getPieceColor(movingPiece) !== currentPlayer) { broadcastSync(); return; }
        const targetPiece = board[to.row]?.[to.col]?.piece || null;
        if (targetPiece && getPieceColor(targetPiece) === getPieceColor(movingPiece)) { broadcastSync(); return; }
        if (movingPiece === '炮' || movingPiece === '砲') {
          if (!isValidCannonCapture(from.row, from.col, to.row, to.col)) { broadcastSync(); return; }
        } else {
          if (targetPiece && !canCapture(movingPiece, targetPiece)) { broadcastSync(); return; }
          const rd = Math.abs(from.row - to.row), cd = Math.abs(from.col - to.col);
          if (rd + cd !== 1) { broadcastSync(); return; }
        }
        pushHistory();
        executeMove(from.row, from.col, to.row, to.col, movingPiece, targetPiece);
      } else if (msg.type === 'flip') {
        const { row, col } = msg;
        if (!board[row] || !board[row][col] || !board[row][col].hidden) { broadcastSync(); return; }
        if (currentPlayer !== 'host' && currentPlayer !== 'guest' &&
          currentPlayer !== 'red' && currentPlayer !== 'black') { broadcastSync(); return; }
        pushHistory();
        executeFlip(row, col);
      }
    }

    function resetGame() {
      initBoard();
      currentPlayer = 'host';
      gameOver = false;
      gameEndReason = '';
      selectedRow = -1; selectedCol = -1;
      lastMovedRow = -1; lastMovedCol = -1;
      deadRed = []; deadBlack = [];
      history = [];
      pendingUndoRequest = false;
      pendingDrawRequest = false;
      recordUploaded = false;
      buildBoardDOM();
      renderFullBoard();
      renderGraveyards();
    }

    document.getElementById('resetBtn').addEventListener('click', () => {
      if (onlineMode) {
        if (myRole === 'host') {
          if (confirm('确定重新开局？')) startGameAsHost();
        } else {
          showBanner('只有房主可以重新开局', 'error', 2000);
        }
      } else {
        resetGame();
      }
    });
    document.getElementById('undoBtn').addEventListener('click', undo);

    // ============================================================
    //                    让先 / 和棋 / 认输
    // ============================================================
    function yieldFirst() {
      if (gameOver) return;
      if (!onlineMode) { showBanner('离线模式无需让先', 'error', 1500); return; }
      if (myRole !== 'host') { showBanner('只有房主可以让先', 'error', 1500); return; }
      if (currentPlayer !== 'host') { showBanner('开局后才能让先', 'error', 1500); return; }
      currentPlayer = 'guest';
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
      } else {
        endGame('你认输了', 'loss');
      }
    }

    function endGame(reason, type) {
      if (gameOver) return;
      gameOver = true;
      currentPlayer = null;
      gameEndReason = reason;
      selectedRow = -1; selectedCol = -1;
      renderFullBoard();
      showBanner(reason, 'info', 5000);

      if (onlineMode && !recordUploaded) {
        let myWin = 0, oppWin = 0;
        if (type === 'win') { myWin = 1; oppWin = 0; }
        else if (type === 'loss') { myWin = 0; oppWin = 1; }
        else { myWin = 0; oppWin = 0; }
        uploadMyRecord(opponentUserId, myWin, oppWin);
      }

      // ★ 音效 + 弹窗
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
      if (!onlineMode) {
        return color === 'red' ? '红方' : '黑方';
      }
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
      } catch (e) {
        console.error('getUserCustomData:', e);
        throw e;
      }
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

    // ★ 上传我方战绩：前缀 chessflip_record_with_
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

    // ============================================================
    //                    排行榜
    // ============================================================
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
            // ★ 只看象棋翻棋战绩
            if (!rec.startsWith('chessflip_record_with_')) return;
            const parts = rec.split(':');
            if (parts.length !== 2) return;
            const [w, l] = parts[1].split(',').map(Number);
            if (isNaN(w) || isNaN(l)) return;
            totalW += w;
            totalL += l;
            matches++;
          });

          if (matches > 0) {
            stats.push({
              username: user.username || '未知用户',
              wins: totalW,
              losses: totalL,
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
            <div class="stats">
              胜 ${s.wins} / 负 ${s.losses}<br>
              胜率 ${s.winRate}%
            </div>
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
    //                    刷新恢复
    // ============================================================
    window.addEventListener('load', async () => {
      hideAll();
      menuPanel.classList.remove('hidden');

      await loadUserInfo();
      updateLobbyUserLabel();
    });
  