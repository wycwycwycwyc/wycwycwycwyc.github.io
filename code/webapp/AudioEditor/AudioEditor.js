(function () {
      'use strict';

      // ============================
      //  中英文支持（仅提供函数，无切换逻辑）
      // ============================


      // ============================
      //  DOM 引用
      // ============================
      const dropzone = document.getElementById('dropzone');
      const fileInput = document.getElementById('fileInput');
      const fileBar = document.getElementById('fileBar');
      const statusLabel = document.getElementById('statusLabel');

      const volSlider = document.getElementById('volSlider');
      const volVal = document.getElementById('volVal');
      const spdSlider = document.getElementById('spdSlider');
      const spdVal = document.getElementById('spdVal');

      const waveCanvas = document.getElementById('waveCanvas');
      const waveArea = document.getElementById('waveArea');
      const playhead = document.getElementById('playhead');
      const selOverlay = document.getElementById('selOverlay');
      const hdlL = document.getElementById('hdlL');
      const hdlR = document.getElementById('hdlR');

      const keepStart = document.getElementById('keepStart');
      const keepEnd = document.getElementById('keepEnd');
      const delLeft = document.getElementById('delLeft');
      const delRight = document.getElementById('delRight');
      const btnKeep = document.getElementById('btnKeep');
      const btnCut = document.getElementById('btnCut');

      const seekSlider = document.getElementById('seekSlider');
      const curTime = document.getElementById('curTime');
      const totTime = document.getElementById('totTime');

      const playBtn = document.getElementById('playBtn');
      const pauseBtn = document.getElementById('pauseBtn');
      const stopBtn = document.getElementById('stopBtn');
      const resetBtn = document.getElementById('resetBtn');

      const convertBtn = document.getElementById('convertBtn');

      const logBox = document.getElementById('logBox');

      // ============================
      //  核心状态
      // ============================
      let ctx = null;
      let buffer = null;
      let fileMap = {};
      let fileList = [];
      let currentFile = null;

      let isPlaying = false;
      let srcNode = null;
      let gainNode = null;
      let playStart = 0;
      let pausedAt = 0;

      let sel = { start: 0, end: 1 };

      // ============================
      //  日志
      // ============================
      function log(msg, type) {
        type = type || 'info';
        const el = document.createElement('div');
        el.className = type;
        const enMap = {
          '就绪': 'Ready',
          '加载成功': 'Loaded',
          '加载失败': 'Failed to load',
          '保留中间完成': 'Keep middle completed',
          '切除中间完成': 'Cut middle completed',
          '导出 WAV 成功': 'WAV exported successfully',
          '导出失败': 'Export failed',
          '已重置': 'Reset',
          '已移除': 'Removed',
          '切换到': 'Switched to',
          '请先加载音频': 'Please load audio first',
          '选区太小': 'Selection too small',
          '不能删除全部音频': 'Cannot delete entire audio',
          '正在导出...': 'Exporting...'
        };
        let translated = msg;
        for (const [zh, en] of Object.entries(enMap)) {
          if (msg.includes(zh)) {
            translated = msg.replace(zh, window.getLocalizedText(zh, en));
            break;
          }
        }
        el.textContent = '● ' + translated;
        logBox.appendChild(el);
        logBox.scrollTop = logBox.scrollHeight;
        while (logBox.children.length > 60) logBox.removeChild(logBox.firstChild);
      }

      function setStatus(key) {
        const enMap = {
          '就绪': 'Ready',
          '导出中...': 'Exporting...',
          '裁剪中...': 'Cutting...'
        };
        const zh = key;
        const en = enMap[zh] || zh;
        statusLabel.textContent = window.getLocalizedText(zh, en);
      }

      // ============================
      //  工具
      // ============================
      function fmt(sec) {
        if (!sec || isNaN(sec)) return '00:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      }

      function fmtD(sec) {
        if (!sec || isNaN(sec)) return '0.00';
        return sec.toFixed(2);
      }

      function getCtx() {
        if (!ctx) {
          ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
      }

      // ============================
      //  波形绘制
      // ============================
      function drawWave() {
        const canvas = waveCanvas;
        const rect = waveArea.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const w = rect.width || 600;
        const h = rect.height || 160;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        const c = canvas.getContext('2d');
        c.scale(dpr, dpr);

        // 深色模式背景自适应：使用 CSS 变量
        const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-wave').trim() || '#f1f5f9';
        c.fillStyle = bgColor;
        c.fillRect(0, 0, w, h);

        if (!buffer) {
          playhead.style.display = 'none';
          return;
        }

        const data = buffer.getChannelData(0);
        const vol = parseFloat(volSlider.value) / 100;
        const spd = parseFloat(spdSlider.value) / 100;
        const len = data.length;
        const displayLen = Math.min(len / spd, len);
        const step = Math.max(1, Math.floor(displayLen / w));
        const amp = h / 2 - 6;

        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6366f1';
        c.beginPath();
        c.strokeStyle = accentColor;
        c.lineWidth = 1.5;
        for (let i = 0; i < w; i++) {
          const idx = Math.floor(i * step);
          if (idx >= len) break;
          const val = data[idx] || 0;
          const scaled = Math.max(-1, Math.min(1, val * vol));
          const x = i;
          const y = amp + scaled * amp * 0.9;
          if (i === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();

        c.beginPath();
        for (let i = 0; i < w; i++) {
          const idx = Math.floor(i * step);
          if (idx >= len) break;
          const val = data[idx] || 0;
          const scaled = Math.max(-1, Math.min(1, val * vol));
          const x = i;
          const y = amp - scaled * amp * 0.9;
          if (i === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();

        // 中线
        c.beginPath();
        c.strokeStyle = 'rgba(99,102,241,0.12)';
        c.lineWidth = 1;
        c.moveTo(0, amp);
        c.lineTo(w, amp);
        c.stroke();

        updateSel(w);
        updatePlayhead(w);
      }

      function updateSel(canvasWidth) {
        const w = canvasWidth || waveArea.getBoundingClientRect().width || 600;
        const s = Math.max(0, Math.min(1, sel.start));
        const e = Math.max(0, Math.min(1, sel.end));

        if (s < e) {
          selOverlay.classList.add('show');
          selOverlay.style.left = (s * w) + 'px';
          selOverlay.style.width = ((e - s) * w) + 'px';
          selOverlay.style.background = 'var(--sel-bg)';
          selOverlay.style.borderLeftColor = 'var(--sel-border)';
          selOverlay.style.borderRightColor = 'var(--sel-border)';
        } else {
          selOverlay.classList.remove('show');
        }

        const oldL = waveArea.querySelector('.del-left');
        const oldR = waveArea.querySelector('.del-right');
        if (oldL) oldL.remove();
        if (oldR) oldR.remove();

        if (s > 0) {
          const d = document.createElement('div');
          d.className = 'del-left';
          d.style.left = '0';
          d.style.width = (s * w) + 'px';
          waveArea.appendChild(d);
        }
        if (e < 1) {
          const d = document.createElement('div');
          d.className = 'del-right';
          d.style.left = (e * w) + 'px';
          d.style.width = ((1 - e) * w) + 'px';
          waveArea.appendChild(d);
        }

        if (buffer) {
          const dur = buffer.duration;
          const ss = s * dur,
            ee = e * dur;
          keepStart.textContent = fmtD(ss);
          keepEnd.textContent = fmtD(ee);
          delLeft.textContent = fmtD(0) + ' / ' + fmtD(ee);
          delRight.textContent = fmtD(ss) + ' / ' + fmtD(dur);
        }
      }

      function updatePlayhead(canvasWidth) {
        const w = canvasWidth || waveArea.getBoundingClientRect().width || 600;
        if (!buffer || !isPlaying) {
          if (buffer && !isPlaying && pausedAt > 0) {
            const pct = pausedAt / buffer.duration;
            const x = pct * w;
            playhead.style.display = 'block';
            playhead.style.left = x + 'px';
          } else {
            playhead.style.display = 'none';
          }
          return;
        }
        const dur = buffer.duration;
        const elapsed = Math.min(pausedAt || 0, dur);
        const pct = dur > 0 ? elapsed / dur : 0;
        const x = pct * w;
        playhead.style.display = 'block';
        playhead.style.left = x + 'px';
      }

      function setPlayheadPosition(percent) {
        if (!buffer) return;
        const w = waveArea.getBoundingClientRect().width || 600;
        const x = percent * w;
        playhead.style.display = 'block';
        playhead.style.left = x + 'px';
        seekSlider.value = percent * 100;
        curTime.textContent = fmt(percent * buffer.duration);
      }

      // ============================
      //  选区拖拽
      // ============================
      function initDrag() {
        let down = false,
          target = null,
          sx = 0,
          orig = { s: 0, e: 1 };

        function onDown(e) {
          if (!buffer) return;
          const rect = waveArea.getBoundingClientRect();
          const w = rect.width || 600;
          const x = (e.clientX || e.pageX) - rect.left;
          const pos = Math.max(0, Math.min(1, x / w));
          const s = sel.start,
            es = sel.end;
          const ls = s * w,
            rs = es * w;

          if (Math.abs(x - ls) < 20) target = 'left';
          else if (Math.abs(x - rs) < 20) target = 'right';
          else if (x > ls && x < rs) target = 'move';
          else target = 'new';

          down = true;
          sx = pos;
          orig = { s: sel.start, e: sel.end };
          e.preventDefault();
        }

        function onMove(e) {
          if (!down || !buffer) return;
          const rect = waveArea.getBoundingClientRect();
          const w = rect.width || 600;
          const x = (e.clientX || e.pageX) - rect.left;
          const pos = Math.max(0, Math.min(1, x / w));

          if (target === 'left') {
            sel.start = Math.max(0, Math.min(sel.end - 0.001, pos));
          } else if (target === 'right') {
            sel.end = Math.min(1, Math.max(sel.start + 0.001, pos));
          } else if (target === 'move') {
            const delta = pos - sx;
            const ns = Math.max(0, Math.min(1 - (orig.e - orig.s), orig.s + delta));
            const ne = ns + (orig.e - orig.s);
            sel.start = ns;
            sel.end = ne;
          } else if (target === 'new') {
            if (pos < orig.s) {
              sel.start = pos;
              sel.end = orig.s;
            } else {
              sel.start = orig.s;
              sel.end = pos;
            }
            if (sel.end - sel.start < 0.01) {
              sel.start = Math.max(0, pos - 0.02);
              sel.end = Math.min(1, pos + 0.02);
            }
          }
          if (sel.start > sel.end) [sel.start, sel.end] = [sel.end, sel.start];
          drawWave();
          e.preventDefault();
        }

        function onUp() {
          down = false;
          target = null;
        }

        waveArea.addEventListener('mousedown', onDown);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        waveArea.addEventListener('touchstart', function (e) {
          const t = e.touches[0];
          onDown({
            clientX: t.clientX, pageX: t.pageX, preventDefault: function () {
              e
                .preventDefault();
            }
          });
        }, { passive: false });
        document.addEventListener('touchmove', function (e) {
          const t = e.touches[0];
          onMove({
            clientX: t.clientX, pageX: t.pageX, preventDefault: function () {
              e
                .preventDefault();
            }
          });
        }, { passive: false });
        document.addEventListener('touchend', onUp);
      }

      // ============================
      //  播放头拖拽
      // ============================
      function initPlayheadDrag() {
        let dragging = false;

        function startDrag(e) {
          if (!buffer) return;
          dragging = true;
          movePlayhead(e);
          e.preventDefault();
        }

        function movePlayhead(e) {
          if (!dragging || !buffer) return;
          const rect = waveArea.getBoundingClientRect();
          const w = rect.width || 600;
          const x = (e.clientX || e.pageX) - rect.left;
          const pct = Math.max(0, Math.min(1, x / w));
          const time = pct * buffer.duration;
          setPlayheadPosition(pct);
          seekSlider.value = pct * 100;
          curTime.textContent = fmt(time);
          if (isPlaying && srcNode) {
            const wasPlaying = isPlaying;
            pauseAudio();
            pausedAt = time;
            if (wasPlaying) playAudio();
          } else {
            pausedAt = time;
          }
        }

        function endDrag() {
          dragging = false;
        }

        waveArea.addEventListener('mousedown', function (e) {
          const rect = waveArea.getBoundingClientRect();
          const w = rect.width || 600;
          const x = (e.clientX || e.pageX) - rect.left;
          const s = sel.start,
            es = sel.end;
          const ls = s * w,
            rs = es * w;
          if (Math.abs(x - ls) < 20 || Math.abs(x - rs) < 20) return;
          startDrag(e);
        });
        document.addEventListener('mousemove', function (e) {
          if (dragging) movePlayhead(e);
        });
        document.addEventListener('mouseup', endDrag);

        waveArea.addEventListener('touchstart', function (e) {
          const t = e.touches[0];
          const rect = waveArea.getBoundingClientRect();
          const w = rect.width || 600;
          const x = t.clientX - rect.left;
          const s = sel.start,
            es = sel.end;
          const ls = s * w,
            rs = es * w;
          if (Math.abs(x - ls) < 20 || Math.abs(x - rs) < 20) return;
          startDrag({
            clientX: t.clientX, pageX: t.pageX, preventDefault: function () {
              e
                .preventDefault();
            }
          });
        }, { passive: false });
        document.addEventListener('touchmove', function (e) {
          if (dragging) {
            const t = e.touches[0];
            movePlayhead({
              clientX: t.clientX, pageX: t.pageX, preventDefault: function () {
                e
                  .preventDefault();
              }
            });
          }
        }, { passive: false });
        document.addEventListener('touchend', endDrag);
      }

      // ============================
      //  裁剪操作
      // ============================
      function doKeep() {
        if (!buffer) { log('请先加载音频', 'warn'); return; }
        const dur = buffer.duration;
        const s = sel.start * dur,
          e = sel.end * dur;
        if (e - s < 0.05) { log('选区太小', 'warn'); return; }
        setStatus('裁剪中...');
        const ch = buffer.numberOfChannels;
        const sr = buffer.sampleRate;
        const ss = Math.floor(s * sr),
          ee = Math.floor(e * sr);
        const len = ee - ss;
        const nb = getCtx().createBuffer(ch, len, sr);
        for (let c = 0; c < ch; c++) {
          const src = buffer.getChannelData(c);
          const dst = nb.getChannelData(c);
          for (let i = 0; i < len; i++) dst[i] = src[ss + i];
        }
        const newName = currentFile + '_keep.wav';
        addFile(newName, nb);
        switchFile(newName);
        log('保留中间完成', 'ok');
        setStatus('就绪');
      }

      function doCut() {
        if (!buffer) { log('请先加载音频', 'warn'); return; }
        const dur = buffer.duration;
        const s = sel.start * dur,
          e = sel.end * dur;
        if (e - s < 0.05) { log('选区太小', 'warn'); return; }
        if (s < 0.001 && e > dur - 0.001) { log('不能删除全部音频', 'warn'); return; }
        setStatus('裁剪中...');
        const ch = buffer.numberOfChannels;
        const sr = buffer.sampleRate;
        const ss = Math.floor(s * sr),
          ee = Math.floor(e * sr);
        const total = buffer.length;
        const leftLen = ss,
          rightLen = total - ee;
        const nb = getCtx().createBuffer(ch, leftLen + rightLen, sr);
        for (let c = 0; c < ch; c++) {
          const src = buffer.getChannelData(c);
          const dst = nb.getChannelData(c);
          for (let i = 0; i < leftLen; i++) dst[i] = src[i];
          for (let i = 0; i < rightLen; i++) dst[leftLen + i] = src[ee + i];
        }
        const newName = currentFile + '_cut.wav';
        addFile(newName, nb);
        switchFile(newName);
        log('切除中间完成', 'ok');
        setStatus('就绪');
      }

      // ============================
      //  文件管理
      // ============================
      function addFile(name, buf) {
        fileMap[name] = buf;
        if (!fileList.includes(name)) fileList.push(name);
        renderFiles();
      }

      function switchFile(name) {
        if (name === currentFile) return;
        if (isPlaying) stopAudio();
        currentFile = name;
        buffer = fileMap[name];
        sel = { start: 0, end: 1 };
        pausedAt = 0;
        drawWave();
        updateTimeDisplay(buffer.duration);
        setStatus('就绪');
        renderFiles();
        log('切换到: ' + name, 'info');
      }

      function removeFile(name) {
        if (fileList.length <= 1) { log('至少保留一个文件', 'warn'); return; }
        const idx = fileList.indexOf(name);
        if (idx > -1) fileList.splice(idx, 1);
        delete fileMap[name];
        if (currentFile === name) {
          currentFile = fileList[0] || null;
          buffer = currentFile ? fileMap[currentFile] : null;
          if (buffer) {
            drawWave();
            updateTimeDisplay(buffer.duration);
          } else {
            drawWave();
            updateTimeDisplay(0);
          }
        }
        renderFiles();
        log('已移除: ' + name, 'info');
      }

      function renderFiles() {
        fileBar.innerHTML = '';
        fileList.forEach(name => {
          const chip = document.createElement('span');
          chip.className = 'file-chip' + (name === currentFile ? ' active' : '');
          chip.innerHTML = name + ' <span class="remove" data-name="' + name + '">×</span>';
          chip.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove')) return;
            switchFile(name);
          });
          const rm = chip.querySelector('.remove');
          rm.addEventListener('click', function (e) {
            e.stopPropagation();
            removeFile(name);
          });
          fileBar.appendChild(chip);
        });
      }

      function updateTimeDisplay(dur) {
        totTime.textContent = fmt(dur);
        curTime.textContent = '00:00';
        seekSlider.value = 0;
        if (dur > 0) {
          sel = { start: 0, end: 1 };
          drawWave();
        }
      }

      // ============================
      //  加载音频
      // ============================
      async function loadFile(file) {
        try {
          const ab = await file.arrayBuffer();
          const c = getCtx();
          const buf = await c.decodeAudioData(ab);
          const name = file.name;
          addFile(name, buf);
          if (!currentFile) {
            currentFile = name;
            buffer = buf;
            sel = { start: 0, end: 1 };
            pausedAt = 0;
            drawWave();
            updateTimeDisplay(buf.duration);
            setStatus('就绪');
          }
          renderFiles();
          log('加载成功: ' + name + ' (时长 ' + fmt(buf.duration) + ')', 'ok');
        } catch (e) {
          log('加载失败: ' + file.name + ' - ' + e.message, 'err');
        }
      }

      // ============================
      //  WAV 导出（直接根据原始 buffer）
      // ============================
      function toWav(buf) {
        const numChannels = buf.numberOfChannels;
        const sampleRate = buf.sampleRate;
        const bitDepth = 16;
        const bytesPerSample = bitDepth / 8;
        const blockAlign = numChannels * bytesPerSample;

        const channelData = [];
        let totalSamples = 0;
        for (let ch = 0; ch < numChannels; ch++) {
          const data = buf.getChannelData(ch);
          channelData.push(data);
          totalSamples += data.length;
        }
        const dataSize = totalSamples * bytesPerSample;

        const arrayBuffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(arrayBuffer);

        view.setUint32(0, 0x52494646);
        view.setUint32(4, 36 + dataSize, true);
        view.setUint32(8, 0x57415645);
        view.setUint32(12, 0x666D7420);
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * blockAlign, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitDepth, true);
        view.setUint32(36, 0x64617461);
        view.setUint32(40, dataSize, true);

        let offset = 44;
        const numFrames = buf.length;
        for (let i = 0; i < numFrames; i++) {
          for (let ch = 0; ch < numChannels; ch++) {
            const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
            const int16 = Math.round(sample * 0x7FFF);
            view.setInt16(offset, int16, true);
            offset += 2;
          }
        }

        return new Blob([arrayBuffer], { type: 'audio/wav' });
      }

      // ============================
      //  导出 WAV（应用音量和速度）
      // ============================
      async function doConvert() {
        if (!buffer) { log('请先加载音频', 'warn'); return; }
        const vol = parseFloat(volSlider.value) / 100;
        const speed = parseFloat(spdSlider.value) / 100;
        setStatus('导出中...');
        log('正在导出...', 'info');
        try {
          const sampleRate = buffer.sampleRate;
          const channels = buffer.numberOfChannels;
          const length = buffer.length;
          const newLength = Math.ceil(length / speed);
          const offlineCtx = new OfflineAudioContext(channels, newLength, sampleRate);
          const source = offlineCtx.createBufferSource();
          source.buffer = buffer;
          source.playbackRate.value = speed;
          const gain = offlineCtx.createGain();
          gain.gain.value = vol;
          source.connect(gain);
          gain.connect(offlineCtx.destination);
          source.start();
          const renderedBuffer = await offlineCtx.startRendering();
          const blob = toWav(renderedBuffer);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'audio_processed.wav';
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
          log('导出 WAV 成功', 'ok');
          setStatus('就绪');
        } catch (e) {
          log('导出失败: ' + e.message, 'err');
          setStatus('就绪');
        }
      }

      // ============================
      //  播放控制
      // ============================
      function playAudio() {
        if (!buffer) { log('请先加载音频', 'warn'); return; }
        const c = getCtx();
        if (isPlaying) return;
        srcNode = c.createBufferSource();
        gainNode = c.createGain();
        srcNode.buffer = buffer;
        const spd = parseFloat(spdSlider.value) / 100;
        srcNode.playbackRate.value = spd;
        gainNode.gain.value = parseFloat(volSlider.value) / 100;
        srcNode.connect(gainNode);
        gainNode.connect(c.destination);
        const off = pausedAt || 0;
        srcNode.start(0, off);
        playStart = c.currentTime - off;
        isPlaying = true;
        playBtn.textContent = '⏸ 播放中';

        playhead.style.display = 'block';

        srcNode.onended = () => stopAudio();

        function updateProgress() {
          if (!isPlaying) return;
          const elapsed = c.currentTime - playStart;
          const dur = buffer.duration;
          const pct = Math.min(100, (elapsed / dur) * 100);
          seekSlider.value = pct;
          curTime.textContent = fmt(Math.min(elapsed, dur));
          const w = waveArea.getBoundingClientRect().width || 600;
          const x = (pct / 100) * w;
          playhead.style.left = x + 'px';
          if (elapsed >= dur) { stopAudio(); return; }
          requestAnimationFrame(updateProgress);
        }
        updateProgress();
      }

      function pauseAudio() {
        if (!isPlaying || !srcNode) return;
        const c = getCtx();
        pausedAt = c.currentTime - playStart;
        srcNode.stop();
        srcNode.disconnect();
        srcNode = null;
        isPlaying = false;
        playBtn.textContent = '▶ 播放';
      }

      function stopAudio() {
        if (srcNode) {
          try { srcNode.stop(); } catch (e) { } srcNode.disconnect();
          srcNode = null;
        }
        isPlaying = false;
        pausedAt = 0;
        seekSlider.value = 0;
        curTime.textContent = '00:00';
        playBtn.textContent = '▶ 播放';
        playhead.style.display = 'none';
        if (buffer) drawWave();
      }

      function resetAudio() {
        stopAudio();
        pausedAt = 0;
        seekSlider.value = 0;
        curTime.textContent = '00:00';
        if (buffer) drawWave();
        log('已重置', 'info');
      }

      // ============================
      //  事件绑定
      // ============================
      // 上传点击
      dropzone.addEventListener('click', () => fileInput.click());
      // 拖拽上传
      dropzone.addEventListener('dragover', e => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--accent)';
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = '';
      });
      dropzone.addEventListener('drop', e => {
        e.preventDefault();
        dropzone.style.borderColor = '';
        const files = e.dataTransfer.files;
        for (const f of files) {
          if (f.type.startsWith('audio/')) loadFile(f);
        }
      });
      fileInput.addEventListener('change', function () {
        for (const f of this.files) loadFile(f);
        this.value = '';
      });

      playBtn.addEventListener('click', () => {
        if (isPlaying) pauseAudio();
        else playAudio();
      });
      pauseBtn.addEventListener('click', pauseAudio);
      stopBtn.addEventListener('click', stopAudio);
      resetBtn.addEventListener('click', resetAudio);

      volSlider.addEventListener('input', function () {
        volVal.textContent = this.value + '%';
        if (gainNode) gainNode.gain.value = parseFloat(this.value) / 100;
        if (buffer) drawWave();
      });
      spdSlider.addEventListener('input', function () {
        const v = parseFloat(this.value) / 100;
        spdVal.textContent = v.toFixed(1) + 'x';
        if (srcNode) srcNode.playbackRate.value = v;
        if (buffer) drawWave();
      });

      seekSlider.addEventListener('input', function () {
        if (!buffer) return;
        const pct = parseFloat(this.value) / 100;
        const time = pct * buffer.duration;
        curTime.textContent = fmt(time);
        if (!isPlaying) {
          setPlayheadPosition(pct);
        }
      });
      seekSlider.addEventListener('change', function () {
        if (!buffer || !isPlaying) return;
        const pct = parseFloat(this.value) / 100;
        const t = pct * buffer.duration;
        if (srcNode) {
          const was = isPlaying;
          pauseAudio();
          pausedAt = t;
          if (was) playAudio();
        }
      });

      btnKeep.addEventListener('click', doKeep);
      btnCut.addEventListener('click', doCut);
      convertBtn.addEventListener('click', doConvert);

      window.addEventListener('resize', () => { if (buffer) drawWave(); });

      // ============================
      //  初始化
      // ============================
      initDrag();
      initPlayheadDrag();
      log('就绪', 'info');
      setStatus('就绪');
      drawWave();
      updateTimeDisplay(0);

      // 深色模式由外部添加 body.dark-mode 类控制

      // 暴露一些常用函数便于调试
      window.__editor = {
        loadFile,
        playAudio,
        pauseAudio,
        stopAudio,
        resetAudio,
        doConvert,
        doKeep,
        doCut
      };

    })();