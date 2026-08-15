// ===== 中英文支持函数（外部可覆盖） =====
    // ===== 主代码 =====
    (function () {
      'use strict';

      // ===== DOM =====
      var video = document.getElementById('videoPlayer');
      var emptyState = document.getElementById('emptyState');
      var playBtn = document.getElementById('playBtn');
      var rewindBtn = document.getElementById('rewindBtn');
      var forwardBtn = document.getElementById('forwardBtn');
      var seekSlider = document.getElementById('seekSlider');
      var timeDisplay = document.getElementById('timeDisplay');
      var fileInput = document.getElementById('fileInput');
      var uploadTrigger = document.getElementById('uploadTrigger');
      var fileNameDisplay = document.getElementById('fileNameDisplay');
      var statusBadge = document.getElementById('statusBadge');

      var extractSingleBtn = document.getElementById('extractSingleBtn');
      var extractKeyframesBtn = document.getElementById('extractKeyframesBtn');
      var extractAllBtn = document.getElementById('extractAllBtn');
      var qualitySelect = document.getElementById('qualitySelect');
      var losslessCheck = document.getElementById('losslessCheck');
      var progressFill = document.getElementById('progressFill');
      var progressText = document.getElementById('progressText');
      var progressPercent = document.getElementById('progressPercent');
      var logBox = document.getElementById('logBox');
      var frameHint = document.getElementById('frameHint');

      // ===== 状态 =====
      var currentFile = null;
      var videoUrl = null;
      var isPlaying = false;
      var videoDuration = 0;
      var isProcessing = false;
      var videoData = null;
      var videoSamples = [];
      var isDemuxReady = false;
      var videoConfig = null;

      // ===== 日志 =====
      function log(msg, type) {
        type = type || 'info';
        var entry = document.createElement('div');
        entry.className = type;
        entry.textContent = msg;
        logBox.appendChild(entry);
        logBox.scrollTop = logBox.scrollHeight;
        while (logBox.children.length > 100) logBox.removeChild(logBox.firstChild);
      }

      function setProgress(pct, text) {
        var v = Math.min(100, Math.max(0, pct));
        progressFill.style.width = v + '%';
        progressPercent.textContent = v.toFixed(0) + '%';
        if (text) progressText.textContent = text;
      }

      function setBadge(text, type) {
        type = type || '';
        statusBadge.textContent = text;
        statusBadge.className = 'badge ' + type;
      }

      function fmtTime(sec) {
        if (!sec || isNaN(sec) || !isFinite(sec)) return '00:00:00';
        var h = Math.floor(sec / 3600);
        var m = Math.floor((sec % 3600) / 60);
        var s = Math.floor(sec % 60);
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
      }

      function updatePlayerUI() {
        if (!video.duration) return;
        var pct = (video.currentTime / video.duration) * 100;
        seekSlider.value = pct;
        timeDisplay.textContent = fmtTime(video.currentTime) + ' / ' + fmtTime(video.duration);
      }

      // ===== 使用 MP4Box 解析视频 =====
      function demuxWithMP4Box(data) {
        return new Promise(function (resolve, reject) {
          try {
            var mp4box = MP4Box.createFile();
            var videoTrackId = null;
            var videoChunks = [];
            var readyResolved = false;

            mp4box.onError = function (e) {
              log('MP4Box error: ' + e, 'error');
              if (!readyResolved) reject(e);
            };

            mp4box.onReady = function (info) {
              readyResolved = true;
              info.tracks.forEach(function (t) {
                if (t.type === 'video') {
                  videoTrackId = t.id;
                  videoConfig = {
                    codec: t.codec || 'avc1.4D401E',
                    width: t.width || 640,
                    height: t.height || 360,
                  };
                  mp4box.setExtractionOptions(t.id);
                }
              });
              mp4box.start();
            };

            mp4box.onSamples = function (trackId, user, samples) {
              samples.forEach(function (sample) {
                if (trackId === videoTrackId) {
                  videoChunks.push({
                    data: sample.data,
                    is_sync: sample.is_sync,
                    cts: sample.cts,
                    dts: sample.dts
                  });
                }
              });
            };

            var buffer = data;
            buffer.fileStart = 0;
            mp4box.appendBuffer(buffer);
            mp4box.flush();

            var checkReady = function () {
              if (readyResolved) {
                videoSamples = videoChunks;
                isDemuxReady = true;
                setBadge(getLocalizedText('就绪', 'Ready'), 'ready');
                setProgress(100, getLocalizedText('就绪', 'Ready'));
                enableButtons(true);
                if (videoChunks.length > 1000) {
                  frameHint.classList.add('show');
                } else {
                  frameHint.classList.remove('show');
                }
                resolve({ videoChunks: videoChunks });
              } else {
                setTimeout(checkReady, 100);
              }
            };
            setTimeout(checkReady, 200);
          } catch (e) {
            log('Parse failed: ' + e.message, 'error');
            reject(e);
          }
        });
      }

      // ===== 加载视频 =====
      function loadVideoFile(file) {
        if (!file) return;
        if (videoUrl) { URL.revokeObjectURL(videoUrl); }
        currentFile = file;
        fileNameDisplay.textContent = file.name;
        setBadge(getLocalizedText('加载中...', 'Loading...'), '');

        videoUrl = URL.createObjectURL(file);
        video.src = videoUrl;

        emptyState.style.display = 'none';
        videoData = null;
        videoSamples = [];
        isDemuxReady = false;
        frameHint.classList.remove('show');
        enableButtons(false);

        var reader = new FileReader();
        reader.onload = function (e) {
          var buffer = e.target.result;
          videoData = buffer;
          demuxWithMP4Box(buffer).then(function () {
            if (isDemuxReady) {
              setBadge(getLocalizedText('就绪', 'Ready'), 'ready');
              enableButtons(true);
            }
          }).catch(function (err) {
            log('Parse error: ' + err.message, 'error');
            setBadge(getLocalizedText('解析失败', 'Parse failed'), 'error');
          });
        };
        reader.readAsArrayBuffer(file);

        video.addEventListener('loadedmetadata', function onMeta() {
          video.removeEventListener('loadedmetadata', onMeta);
          videoDuration = video.duration;
          updatePlayerUI();
          playBtn.disabled = false;
          rewindBtn.disabled = false;
          forwardBtn.disabled = false;
          seekSlider.disabled = false;
        });

        video.addEventListener('timeupdate', updatePlayerUI);
        video.addEventListener('play', function () {
          isPlaying = true;
          playBtn.textContent = '⏸';
        });
        video.addEventListener('pause', function () {
          isPlaying = false;
          playBtn.textContent = '▶';
        });
      }

      function enableButtons(enabled) {
        var btns = [extractSingleBtn, extractKeyframesBtn, extractAllBtn];
        btns.forEach(function (b) { b.disabled = !enabled; });
        if (!enabled) {
          btns.forEach(function (b) { b.disabled = true; });
        }
        if (videoData && isDemuxReady) {
          btns.forEach(function (b) { b.disabled = false; });
        }
      }

      // ===== 创建临时视频元素 =====
      function createTempVideo(src) {
        return new Promise(function (resolve, reject) {
          var temp = document.createElement('video');
          temp.preload = 'auto';
          temp.muted = true;
          temp.playsInline = true;
          temp.crossOrigin = 'anonymous';
          var timeout = setTimeout(function () {
            reject(new Error('Load timeout'));
          }, 30000);
          temp.addEventListener('loadedmetadata', function () {
            clearTimeout(timeout);
            resolve(temp);
          });
          temp.addEventListener('error', function () {
            clearTimeout(timeout);
            reject(new Error('Load failed'));
          });
          temp.src = src;
          temp.load();
        });
      }

      // ===== 从临时视频截取帧 =====
      function captureFrameFromTemp(tempVideo, time) {
        return new Promise(function (resolve) {
          if (time < 0) time = 0;
          if (time > tempVideo.duration) time = tempVideo.duration - 0.001;
          var handler = function () {
            tempVideo.removeEventListener('seeked', handler);
            var canvas = document.createElement('canvas');
            var w = tempVideo.videoWidth || videoConfig?.width || 640;
            var h = tempVideo.videoHeight || videoConfig?.height || 360;
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(tempVideo, 0, 0, w, h);
            resolve(canvas);
          };
          tempVideo.addEventListener('seeked', handler);
          tempVideo.currentTime = time;
          setTimeout(function () {
            tempVideo.removeEventListener('seeked', handler);
            resolve(null);
          }, 8000);
        });
      }

      // ===== 单帧 =====
      async function extractSingleFrame() {
        if (!video || !video.duration) { log(getLocalizedText('请先加载视频', 'Please load video first'), 'warn'); return; }
        if (!videoUrl) { log(getLocalizedText('视频 URL 未就绪', 'Video URL not ready'), 'warn'); return; }
        var useLossless = losslessCheck.checked;
        var quality = parseFloat(qualitySelect.value);
        try {
          var temp = await createTempVideo(videoUrl);
          var canvas = await captureFrameFromTemp(temp, video.currentTime);
          temp.src = '';
          temp.load();
          if (!canvas) {
            log(getLocalizedText('截取帧失败', 'Frame capture failed'), 'error');
            return;
          }
          var mime = useLossless ? 'image/png' : 'image/jpeg';
          var blob = await new Promise(function (resolve) {
            canvas.toBlob(resolve, mime, useLossless ? undefined : quality);
          });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.download = 'frame_' + Date.now() + (useLossless ? '.png' : '.jpg');
          a.href = url;
          a.click();
          setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
          log(getLocalizedText('单帧已提取', 'Single frame extracted'), 'success');
        } catch (e) {
          log(getLocalizedText('单帧提取失败: ', 'Single frame failed: ') + e.message, 'error');
        }
      }

      // ===== 通用帧提取函数 =====
      async function extractFrames(mode) {
        if (!isDemuxReady || videoSamples.length === 0) {
          log(getLocalizedText('请等待解析完成', 'Please wait for parsing to finish'), 'warn');
          return;
        }
        if (!videoUrl) { log(getLocalizedText('视频 URL 未就绪', 'Video URL not ready'), 'warn'); return; }
        if (isProcessing) { log(getLocalizedText('正在处理...', 'Processing...'), 'warn'); return; }

        if (videoSamples.length > 1000) {
          log(getLocalizedText('帧数超过1000，建议使用 Python 多线程版本', 'Frame count >1000, consider Python multi-thread version'), 'warn');
        }

        isProcessing = true;
        var useLossless = losslessCheck.checked;
        var quality = parseFloat(qualitySelect.value);
        var ext = useLossless ? 'png' : 'jpg';
        var mime = useLossless ? 'image/png' : 'image/jpeg';

        setProgress(0, getLocalizedText('准备...', 'Preparing...'));
        log(getLocalizedText('开始提取...', 'Extracting...'), 'info');

        try {
          var temp = await createTempVideo(videoUrl);
          if (!temp) {
            log(getLocalizedText('临时视频加载失败', 'Temp video load failed'), 'error');
            isProcessing = false;
            return;
          }

          var samplesToExtract;
          var label;
          if (mode === 'keyframes') {
            samplesToExtract = videoSamples.filter(function (s) { return s.is_sync; });
            label = getLocalizedText('关键帧', 'Keyframes');
          } else {
            samplesToExtract = videoSamples;
            label = getLocalizedText('全部帧', 'All frames');
          }

          var total = samplesToExtract.length;
          log(label + ' ' + getLocalizedText('总数: ', 'total: ') + total, 'info');

          var zip = new JSZip();
          var decodedCount = 0;
          var lastTime = -1;

          for (var j = 0; j < total; j++) {
            var sample = samplesToExtract[j];
            var time = sample.cts / 1000;
            if (time === lastTime) time += 0.001;
            lastTime = time;

            var canvas = await captureFrameFromTemp(temp, time);
            if (!canvas) {
              continue;
            }
            var blob = await new Promise(function (resolve) {
              canvas.toBlob(resolve, mime, useLossless ? undefined : quality);
            });
            var idx = String(decodedCount + 1).padStart(5, '0');
            zip.file((mode === 'keyframes' ? 'keyframe_' : 'frame_') + idx + '.' + ext, blob);
            decodedCount++;

            setProgress((decodedCount / total) * 95 + 2, decodedCount + '/' + total);
          }

          temp.src = '';
          temp.load();

          setProgress(97, getLocalizedText('打包 ZIP...', 'Zipping...'));
          var zipBlob = await zip.generateAsync({ type: 'blob' });
          var url = URL.createObjectURL(zipBlob);
          var a = document.createElement('a');
          a.download = (mode === 'keyframes' ? 'keyframes_' : 'all_frames_') + Date.now() + '.zip';
          a.href = url;
          a.click();
          setTimeout(function () { URL.revokeObjectURL(url); }, 5000);

          setProgress(100, getLocalizedText('完成', 'Done'));
          log(label + ' ' + getLocalizedText('提取完成: ', 'extracted: ') + decodedCount + ' ' + getLocalizedText('帧',
            'frames'), 'success');

        } catch (e) {
          log(getLocalizedText('提取失败: ', 'Extract failed: ') + e.message, 'error');
          console.error(e);
        }
        isProcessing = false;
      }

      function extractKeyframes() {
        extractFrames('keyframes');
      }

      function extractAllFrames() {
        extractFrames('all');
      }

      // ===== 清空日志 =====
      function clearLog() {
        logBox.innerHTML = '';
      }

      // ===== 事件绑定 =====
      playBtn.addEventListener('click', function () {
        if (video.paused) { video.play().catch(function () { }); } else { video.pause(); }
      });
      rewindBtn.addEventListener('click', function () { video.currentTime = Math.max(0, video.currentTime - 5); });
      forwardBtn.addEventListener('click', function () {
        video.currentTime = Math.min(video.duration, video
          .currentTime + 5);
      });

      seekSlider.addEventListener('input', function (e) {
        if (video.duration) {
          var pct = parseFloat(e.target.value);
          video.currentTime = (pct / 100) * video.duration;
          updatePlayerUI();
        }
      });

      uploadTrigger.addEventListener('click', function () { fileInput.click(); });
      fileInput.addEventListener('change', function () {
        if (fileInput.files.length) loadVideoFile(fileInput.files[0]);
      });

      var appEl = document.getElementById('app');
      appEl.addEventListener('dragover', function (e) { e.preventDefault(); });
      appEl.addEventListener('drop', function (e) {
        e.preventDefault();
        if (e.dataTransfer.files.length && e.dataTransfer.files[0].type.startsWith('video/')) {
          loadVideoFile(e.dataTransfer.files[0]);
        }
      });

      extractSingleBtn.addEventListener('click', extractSingleFrame);
      extractKeyframesBtn.addEventListener('click', extractKeyframes);
      extractAllBtn.addEventListener('click', extractAllFrames);

      losslessCheck.addEventListener('change', function () {
        qualitySelect.disabled = losslessCheck.checked;
        if (losslessCheck.checked) qualitySelect.value = '1.0';
      });

      document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT') return;
        if (e.key === ' ') {
          e.preventDefault();
          playBtn.click();
        }
        if (e.key === 'ArrowRight') { video.currentTime = Math.min(video.duration, video.currentTime + 1); }
        if (e.key === 'ArrowLeft') { video.currentTime = Math.max(0, video.currentTime - 1); }
        if (e.key === 's') { extractSingleBtn.click(); }
      });

      // ===== 双击标题清空日志 =====
      document.querySelector('.brand').addEventListener('dblclick', function () {
        clearLog();
      });

      // ===== 初始化 =====
      log(getLocalizedText('视频帧提取器已启动', 'Video Frame Extractor started'), 'info');
      setProgress(0, getLocalizedText('等待加载', 'Waiting for load'));
      setBadge(getLocalizedText('等待', 'Waiting'), '');
      qualitySelect.disabled = false;

      window.__frameCut = {
        video: video,
        extractAll: extractAllFrames,
        extractKeyframes: extractKeyframes,
        extractSingle: extractSingleFrame,
        clearLog: clearLog,
        log: log,
        setProgress: setProgress,
        isDemuxReady: function () { return isDemuxReady; }
      };

    })();