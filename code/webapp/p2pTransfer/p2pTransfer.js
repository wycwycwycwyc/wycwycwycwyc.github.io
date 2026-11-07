const logEl = document.getElementById('log');
const statusText = document.getElementById('statusText');
const dot = document.getElementById('dot');
const drop = document.getElementById('drop');
const fileInput = document.getElementById('fileInput');
const progress = document.getElementById('progress');
const fill = document.getElementById('fill');
const progressTxt = document.getElementById('progressTxt');
const roomInput = document.getElementById('room');
const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const incomingList = document.getElementById('incomingList');
const incomingHead = document.getElementById('incomingHead');
const incomingTitle = document.getElementById('incomingTitle');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const zipAllBtn = document.getElementById('zipAllBtn');
const saveNote = document.getElementById('saveNote');
const dropHint = document.getElementById('dropHint');

roomInput.value = String(Math.floor(100000 + Math.random() * 900000));

// 是否支持"另存为"对话框
const canPickSaveLocation = typeof window.showSaveFilePicker === 'function';

// 保存提示的双语化
if (canPickSaveLocation) {
  saveNote.setAttribute('data-en', 'Tip: Your browser supports picking a save location, a dialog will pop up when saving.');
  saveNote.textContent = '提示：当前浏览器支持选择保存位置，保存时会弹出对话框。';
} else {
  saveNote.setAttribute('data-en', 'Tip: Your browser does not support picking a save location. Files will be saved to the default downloads folder.');
  saveNote.textContent = '提示：当前浏览器不支持选择保存位置，文件会保存到浏览器默认下载目录。';
}

let peer = null;
let conn = null;
let connected = false;
let remoteReady = false;
let myId = null;

// 已接收但未保存的文件
const receivedFiles = []; // { id, name, size, blob }

// 语言更新辅助函数（支持 i18n 动态刷新）
function updateLangElements() {
  if (window.i18n && typeof window.i18n.registerAll === "function") {
    window.i18n.registerAll();
  } else if (window.i18n && typeof window.i18n.register === "function") {
    document.querySelectorAll("[data-en]").forEach(el => window.i18n.register(el));
  }
}

function log(msg, cls, msgEn) {
  const d = document.createElement('div');
  if (cls) d.className = cls;
  // 为动态日志加上 data-en 支持
  if (msgEn) {
    d.setAttribute('data-en', '[' + new Date().toLocaleTimeString() + '] ' + msgEn);
  }
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logEl.appendChild(d);
  logEl.scrollTop = logEl.scrollHeight;
  if (msgEn) updateLangElements();
}

function setStatus(text, state, textEn) {
  statusText.textContent = text;
  if (textEn) statusText.setAttribute('data-en', textEn);
  dot.className = 'dot' + (state ? ' ' + state : '');
  updateLangElements();
}

function updateDropState() {
  if (connected && remoteReady) {
    drop.classList.remove('disabled');
    dropHint.textContent = '连接已就绪';
    dropHint.setAttribute('data-en', 'Connection ready');
  } else {
    drop.classList.add('disabled');
    dropHint.textContent = '等待对方就绪…';
    dropHint.setAttribute('data-en', 'Waiting for peer...');
  }
  updateLangElements();
}

function updateIncomingHead() {
  const n = receivedFiles.length;
  if (n > 0) {
    incomingHead.classList.add('show');
    incomingTitle.textContent = '已接收文件（' + n + '）';
    incomingTitle.setAttribute('data-en', `Received Files (${n})`);
  } else {
    incomingHead.classList.remove('show');
  }
  updateLangElements();
}

function destroyPeer() {
  return new Promise((resolve) => {
    if (!peer) return resolve();
    const p = peer;
    peer = null;
    conn = null;
    connected = false;
    remoteReady = false;
    try { p.destroy(); } catch (e) { }
    setTimeout(resolve, 800);
  });
}

function loadPeerJS() {
  return new Promise((resolve, reject) => {
    if (window.Peer) return resolve(window.Peer);
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js';
    s.onload = () => resolve(window.Peer);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ===== 创建房间 =====
createBtn.addEventListener('click', async () => {
  const room = roomInput.value.trim();
  if (!/^\d{6}$/.test(room)) {
    alert('房间号必须是 6 位数字');
    return;
  }

  createBtn.disabled = true;
  joinBtn.disabled = true;
  setStatus('正在初始化…', 'wait', 'Initializing...');
  await destroyPeer();
  myId = room;

  try {
    const Peer = await loadPeerJS();
    peer = new Peer(myId, { debug: 0 });

    peer.on('open', (id) => {
      log('房间已创建，等待对方加入（ID: ' + id + '）', 'ok', 'Room created, waiting for peer (ID: ' + id + ')');
      setStatus('等待对方加入房间「' + room + '」…', 'wait', 'Waiting for peer to join room "' + room + '"...');
      createBtn.disabled = false;
      joinBtn.disabled = false;
    });

    peer.on('connection', (incoming) => {
      log('对方已连入', '', 'Peer connected');
      setupConn(incoming);
    });

    peer.on('error', (err) => {
      log('错误: ' + err.type + ' - ' + (err.message || ''), 'err', 'Error: ' + err.type + ' - ' + (err.message || ''));
      if (err.type === 'unavailable-id') {
        setStatus('该房间号已被占用，请换一个', 'err', 'Room ID is occupied, please choose another.');
      }
      createBtn.disabled = false;
      joinBtn.disabled = false;
    });

  } catch (e) {
    log('加载 PeerJS 失败: ' + e.message, 'err', 'Failed to load PeerJS: ' + e.message);
    setStatus('初始化失败', 'err', 'Initialization failed');
    createBtn.disabled = false;
    joinBtn.disabled = false;
  }
});

// ===== 加入房间 =====
joinBtn.addEventListener('click', async () => {
  const room = roomInput.value.trim();
  if (!/^\d{6}$/.test(room)) {
    alert('房间号必须是 6 位数字');
    return;
  }

  createBtn.disabled = true;
  joinBtn.disabled = true;
  setStatus('正在初始化…', 'wait', 'Initializing...');
  await destroyPeer();

  myId = 'g-' + Math.random().toString(36).slice(2, 10);

  try {
    const Peer = await loadPeerJS();
    peer = new Peer(myId, { debug: 0 });

    peer.on('open', (id) => {
      log('信令已连接（ID: ' + id + '）', '', 'Signaling connected (ID: ' + id + ')');
      log('正在连接房间「' + room + '」…', '', 'Connecting to room "' + room + '"...');
      setStatus('正在连接房间「' + room + '」…', 'wait', 'Connecting to room "' + room + '"...');
      const c = peer.connect(room, { reliable: true });
      setupConn(c);
    });

    peer.on('error', (err) => {
      log('错误: ' + err.type + ' - ' + (err.message || ''), 'err', 'Error: ' + err.type + ' - ' + (err.message || ''));
      if (err.type === 'peer-unavailable') {
        setStatus('房间不存在或对方未创建房间', 'err', 'Room does not exist or peer has not created the room.');
        createBtn.disabled = false;
        joinBtn.disabled = false;
      }
    });

  } catch (e) {
    log('加载 PeerJS 失败: ' + e.message, 'err', 'Failed to load PeerJS: ' + e.message);
    setStatus('初始化失败', 'err', 'Initialization failed');
    createBtn.disabled = false;
    joinBtn.disabled = false;
  }
});

// ===== 连接管理 =====
function setupConn(c) {
  conn = c;

  const incomingTasks = new Map();    // id -> { meta, chunks, received }
  const metaAckResolvers = new Map(); // id -> resolve
  let activeId = null;

  c.on('data', (data) => {
    const isBinary =
      data instanceof ArrayBuffer ||
      ArrayBuffer.isView(data) ||
      (typeof Blob !== 'undefined' && data instanceof Blob);

    if (!isBinary) {
      let msg;
      try { msg = JSON.parse(data); }
      catch (e) { log('控制消息解析失败: ' + data, 'err', 'Failed to parse control message: ' + data); return; }

      switch (msg.type) {
        case 'ready': {
          remoteReady = true;
          updateDropState();
          setStatus('已连接，可以传文件了', 'on', 'Connected, ready to transfer files.');
          log('对方已就绪', 'ok', 'Peer is ready');
          break;
        }
        case 'file-meta': {
          incomingTasks.set(msg.id, { meta: msg, chunks: [], received: 0 });
          activeId = msg.id;
          log('对方开始发送：' + msg.name + '（' + formatSize(msg.size) + '）', '', 'Peer started sending: ' + msg.name + ' (' + formatSize(msg.size) + ')');
          conn.send(JSON.stringify({ type: 'file-meta-ack', id: msg.id }));
          break;
        }
        case 'file-meta-ack': {
          const resolve = metaAckResolvers.get(msg.id);
          if (resolve) { metaAckResolvers.delete(msg.id); resolve(); }
          break;
        }
        case 'file-end': {
          const task = incomingTasks.get(msg.id);
          if (!task) {
            log('收到 file-end 但没有对应元信息 #' + msg.id, 'err', 'Received file-end but no meta #' + msg.id);
            break;
          }
          const blob = new Blob(task.chunks, { type: task.meta.mime || 'application/octet-stream' });
          if (blob.size !== task.meta.size) {
            log('大小不一致 #' + msg.id + '：期望 ' + task.meta.size + '，实际 ' + blob.size, 'err', 'Size mismatch #' + msg.id + ': expected ' + task.meta.size + ', actual ' + blob.size);
          } else {
            log('接收完成：' + task.meta.name + '（' + formatSize(blob.size) + '）', 'ok', 'Received: ' + task.meta.name + ' (' + formatSize(blob.size) + ')');
          }
          addReceivedFile(task.meta.name || 'file', blob);
          incomingTasks.delete(msg.id);
          if (activeId === msg.id) activeId = null;
          conn.send(JSON.stringify({ type: 'file-ack', id: msg.id, name: task.meta.name }));
          break;
        }
        case 'file-ack': {
          log('对方已收到：' + msg.name, 'ok', 'Peer received: ' + msg.name);
          break;
        }
        default:
          log('未知控制消息 type=' + msg.type, 'err', 'Unknown control message type=' + msg.type);
      }
      return;
    }

    // 二进制块
    if (!activeId) {
      log('收到二进制块但没有正在接收的文件，丢弃', 'err', 'Received binary chunk but no active receiving file, discarded');
      return;
    }
    const task = incomingTasks.get(activeId);
    if (!task) {
      log('当前接收任务不存在，丢弃', 'err', 'Active receiving task not found, discarded');
      activeId = null;
      return;
    }
    task.chunks.push(data);
    task.received += data.byteLength || data.size || 0;
    const pct = Math.min(100, (task.received / task.meta.size) * 100);
    progress.style.display = 'block';
    fill.style.width = pct + '%';
    progressTxt.textContent = '接收中：' + task.meta.name + ' ' + pct.toFixed(1) + '%';
    progressTxt.setAttribute('data-en', 'Receiving: ' + task.meta.name + ' ' + pct.toFixed(1) + '%');
    updateLangElements();
  });

  c.on('open', () => {
    log('连接建立成功', 'ok', 'Connection established');
    connected = true;
    c.send(JSON.stringify({ type: 'ready' }));
    setStatus('正在协商就绪状态…', 'wait', 'Negotiating ready state...');
    createBtn.disabled = false;
    joinBtn.disabled = false;
  });

  c.on('close', () => {
    log('连接已断开', '', 'Connection closed');
    connected = false;
    remoteReady = false;
    updateDropState();
    setStatus('连接已断开', '', 'Disconnected');
  });

  c.on('error', (err) => log('连接错误: ' + err, 'err', 'Connection error: ' + err));

  conn._metaAckResolvers = metaAckResolvers;
}

// ===== 接收文件展示 =====
function addReceivedFile(name, blob) {
  const id = 'f' + Date.now() + Math.random().toString(36).slice(2, 6);
  const item = { id, name, size: blob.size, blob };
  receivedFiles.push(item);

  const wrap = document.createElement('div');
  wrap.className = 'incoming';
  wrap.dataset.id = id;
  wrap.innerHTML =
    '<div class="name"></div>' +
    '<div class="meta"></div>' +
    '<div class="row">' +
    '<button class="save" data-en="Save">保存</button>' +
    '<button class="ghost remove" data-en="Remove">移除</button>' +
    '</div>';
  wrap.querySelector('.name').textContent = name;
  wrap.querySelector('.meta').textContent = formatSize(blob.size);

  wrap.querySelector('.save').addEventListener('click', async () => {
    await saveOne(item);
    wrap.remove();
    removeReceived(id);
  });
  wrap.querySelector('.remove').addEventListener('click', () => {
    wrap.remove();
    removeReceived(id);
  });

  incomingList.appendChild(wrap);
  updateIncomingHead();
  updateLangElements();
}

function removeReceived(id) {
  const i = receivedFiles.findIndex(f => f.id === id);
  if (i >= 0) receivedFiles.splice(i, 1);
  updateIncomingHead();
}

// ===== 保存 =====
async function saveOne(item) {
  if (canPickSaveLocation) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: item.name,
        types: [{
          description: 'File',
          accept: { [item.blob.type || 'application/octet-stream']: ['.' + (item.name.split('.').pop() || 'bin')] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(item.blob);
      await writable.close();
      log('已保存：' + item.name, 'ok', 'Saved: ' + item.name);
      return;
    } catch (e) {
      if (e.name === 'AbortError') return;
      log('另存为失败，改用普通下载：' + e.message, 'err', 'Save As failed, falling back to download: ' + e.message);
    }
  }
  const url = URL.createObjectURL(item.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = item.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  log('已下载：' + item.name, 'ok', 'Downloaded: ' + item.name);
}

downloadAllBtn.addEventListener('click', async () => {
  if (!receivedFiles.length) return;
  const list = receivedFiles.slice();
  log('开始保存全部文件（' + list.length + ' 个）', '', 'Starting to save all files (' + list.length + ')');
  for (const item of list) {
    await saveOne(item);
  }
  receivedFiles.length = 0;
  incomingList.innerHTML = '';
  updateIncomingHead();
});

zipAllBtn.addEventListener('click', async () => {
  if (!receivedFiles.length) return;
  zipAllBtn.disabled = true;
  log('正在打包 ZIP…', '', 'Packing ZIP...');
  try {
    const blob = await makeZip(receivedFiles);
    const name = 'p2p-files-' + Date.now() + '.zip';
    if (canPickSaveLocation) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: name,
          types: [{ description: 'ZIP Archive', accept: { 'application/zip': ['.zip'] } }]
        });
        const w = await handle.createWritable();
        await w.write(blob);
        await w.close();
        log('ZIP 已保存', 'ok', 'ZIP saved');
        zipAllBtn.disabled = false;
        return;
      } catch (e) {
        if (e.name === 'AbortError') { zipAllBtn.disabled = false; return; }
        log('另存为失败，改用普通下载：' + e.message, 'err', 'Save As failed, falling back to download: ' + e.message);
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    log('ZIP 已下载', 'ok', 'ZIP downloaded');
  } catch (e) {
    log('打包失败：' + e.message, 'err', 'Pack failed: ' + e.message);
  }
  zipAllBtn.disabled = false;
});

// 简易 ZIP 打包
async function makeZip(files) {
  const enc = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;

  const crcTable = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(u8) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < u8.length; i++) c = crcTable[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  const usedNames = new Set();
  function uniqueName(n) {
    let name = n;
    let i = 1;
    while (usedNames.has(name)) {
      const dot = n.lastIndexOf('.');
      name = dot > 0 ? n.slice(0, dot) + '(' + i + ')' + n.slice(dot) : n + '(' + i + ')';
      i++;
    }
    usedNames.add(name);
    return name;
  }

  for (const f of files) {
    const nameBytes = enc.encode(uniqueName(f.name));
    const data = new Uint8Array(await f.blob.arrayBuffer());
    const crc = crc32(data);
    const size = data.length;

    const local = new Uint8Array(30 + nameBytes.length);
    const dv = new DataView(local.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 0, true);
    dv.setUint16(8, 0, true);
    dv.setUint16(10, 0, true);
    dv.setUint16(12, 0, true);
    dv.setUint32(14, crc, true);
    dv.setUint32(18, size, true);
    dv.setUint32(22, size, true);
    dv.setUint16(26, nameBytes.length, true);
    dv.setUint16(28, 0, true);
    local.set(nameBytes, 30);

    parts.push(local, data);

    const cd = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    cd.set(nameBytes, 46);
    central.push(cd);

    offset += local.length + data.length;
  }

  let cdSize = 0;
  for (const c of central) cdSize += c.length;

  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, central.length, true);
  ev.setUint16(10, central.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  return new Blob([...parts, ...central, end], { type: 'application/zip' });
}

// ===== 发送 =====
drop.addEventListener('click', () => fileInput.click());
drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('over'));
drop.addEventListener('drop', (e) => {
  e.preventDefault();
  drop.classList.remove('over');
  const files = Array.from(e.dataTransfer.files);
  if (files.length) sendFiles(files);
});
fileInput.addEventListener('change', () => {
  const files = Array.from(fileInput.files);
  if (files.length) sendFiles(files);
  fileInput.value = '';
});

const CHUNK_SIZE = 16 * 1024;
let sending = false;
const queue = [];

function sendFiles(files) {
  if (!connected || !conn || !remoteReady) {
    alert('对方尚未就绪，请稍候');
    return;
  }
  for (const f of files) queue.push(f);
  log('已加入发送队列：' + files.length + ' 个文件', '', 'Added to sending queue: ' + files.length + ' files');
  processQueue();
}

async function processQueue() {
  if (sending) return;
  if (queue.length === 0) { progress.style.display = 'none'; return; }
  sending = true;
  while (queue.length > 0) {
    const file = queue.shift();
    try { await sendOneFile(file); }
    catch (e) { log('发送失败：' + file.name + ' - ' + e.message, 'err', 'Send failed: ' + file.name + ' - ' + e.message); }
  }
  sending = false;
  progress.style.display = 'none';
  log('发送队列已清空', 'ok', 'Sending queue cleared');
}

function genId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

async function sendOneFile(file) {
  const id = genId();
  log('开始发送：' + file.name + '（' + formatSize(file.size) + '）', '', 'Started sending: ' + file.name + ' (' + formatSize(file.size) + ')');

  conn.send(JSON.stringify({
    type: 'file-meta',
    id,
    name: file.name,
    size: file.size,
    mime: file.type || 'application/octet-stream'
  }));

  progress.style.display = 'block';
  fill.style.width = '0%';
  progressTxt.textContent = '等待对方确认：' + file.name;
  progressTxt.setAttribute('data-en', 'Waiting for peer confirmation: ' + file.name);
  updateLangElements();

  await new Promise((resolve) => {
    conn._metaAckResolvers.set(id, resolve);
    setTimeout(() => {
      if (conn._metaAckResolvers.has(id)) {
        conn._metaAckResolvers.delete(id);
        log('等待元信息确认超时：' + file.name, 'err', 'Timeout waiting for meta confirmation: ' + file.name);
        resolve();
      }
    }, 5000);
  });

  let offset = 0;
  fill.style.width = '0%';
  progressTxt.textContent = '发送中：' + file.name + ' 0%';
  progressTxt.setAttribute('data-en', 'Sending: ' + file.name + ' 0%');
  updateLangElements();

  const reader = file.stream().getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (let i = 0; i < value.length; i += CHUNK_SIZE) {
      const slice = value.slice(i, i + CHUNK_SIZE);
      await waitForBuffer();
      conn.send(slice);
      offset += slice.length;
      const pct = Math.min(100, (offset / file.size) * 100);
      fill.style.width = pct + '%';
      progressTxt.textContent = '发送中：' + file.name + ' ' + pct.toFixed(1) + '%';
      progressTxt.setAttribute('data-en', 'Sending: ' + file.name + ' ' + pct.toFixed(1) + '%');
      updateLangElements();
    }
  }

  await waitForBuffer(0);
  conn.send(JSON.stringify({ type: 'file-end', id }));
  log('已发出：' + file.name + '，等待对方确认…', 'ok', 'Sent: ' + file.name + ', waiting for confirmation...');
}

function waitForBuffer(threshold = 1024 * 1024) {
  return new Promise((resolve) => {
    const check = () => {
      if (!conn || !conn.dataChannel) return resolve();
      const dc = conn.dataChannel;
      if (dc.bufferedAmount > threshold) setTimeout(check, 20);
      else resolve();
    };
    check();
  });
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

// 初始化注册（确保页面加载完毕时的默认中英切换环境就绪）
document.addEventListener('DOMContentLoaded', () => {
  updateLangElements();
});