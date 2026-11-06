// ============================================================
    // 中英双语适配逻辑 (模拟你提供的 script14_setLanguage.js)
    // ============================================================
    (function initLanguage() {
      // 获取当前期望的语言，这里假设外部可能有 localStorage 记录
      const currentLang = localStorage.getItem('site_lang') || 'zh';
      if (currentLang === 'en') {
        document.querySelectorAll('[data-en]').forEach(el => {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            // 如果是输入框，看是否有特定的 placeholder 翻译
            if (el.hasAttribute('data-en-placeholder')) {
              el.placeholder = el.getAttribute('data-en-placeholder');
            }
          } else if (el.tagName === 'TITLE') {
            document.title = el.getAttribute('data-en');
          } else {
            el.textContent = el.getAttribute('data-en');
          }
        });
      }
    })();

    let currentMode = 'qr'; // 'qr' 或 'barcode'
    let currentImageUrl = '';

    // 尺寸同步
    const sizeSlider = document.getElementById('qrSizeSlider');
    const sizeInput = document.getElementById('qrSizeInput');
    sizeSlider.addEventListener('input', () => { sizeInput.value = sizeSlider.value; });
    sizeInput.addEventListener('input', () => {
      const val = parseInt(sizeInput.value);
      if (val >= 200 && val <= 2000) sizeSlider.value = val;
      else sizeSlider.value = 2000;
    });

    function updateFileName(input) {
      const text = document.getElementById('fileNameText');
      if (input.files && input.files.length > 0) {
        text.textContent = input.files[0].name;
        text.style.color = "var(--primary-color)";
      } else {
        text.textContent = document.body.classList.contains('dark-mode') ? "Click to select image" : "点击选择图片";
        if (localStorage.getItem('site_lang') === 'en') text.textContent = "Click to select image";
        text.style.color = "var(--text-main)";
      }
    }

    // UI 切换逻辑
    function switchTab(mode) {
      currentMode = mode;
      document.getElementById('tab-qr').classList.toggle('active', mode === 'qr');
      document.getElementById('tab-barcode').classList.toggle('active', mode === 'barcode');
      document.getElementById('panel-qr').classList.toggle('hidden', mode !== 'qr');
      document.getElementById('panel-barcode').classList.toggle('hidden', mode !== 'barcode');
      document.getElementById('qrcode-canvas-container').classList.toggle('hidden', mode !== 'qr');
      document.getElementById('barcode-container').classList.toggle('hidden', mode !== 'barcode');
    }

    function generateCode() {
      if (currentMode === 'qr') {
        generateQRCode();
      } else {
        generateBarcode();
      }
    }

    // ============================================================
    // 二维码生成（含 UTF-8 与 Logo 挖空）
    // ============================================================
    function utf16to8(str) {
      let out = "";
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c >= 0xD800 && c <= 0xDBFF && i + 1 < str.length) {
          const c2 = str.charCodeAt(i + 1);
          if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
            const codePoint = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00);
            out += String.fromCharCode(0xF0 | ((codePoint >> 18) & 0x07));
            out += String.fromCharCode(0x80 | ((codePoint >> 12) & 0x3F));
            out += String.fromCharCode(0x80 | ((codePoint >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | (codePoint & 0x3F));
            i++; continue;
          }
        }
        if (c >= 0x0001 && c <= 0x007F) {
          out += str.charAt(i);
        } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
          out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
          out += String.fromCharCode(0x80 | (c & 0x3F));
        } else {
          out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
          out += String.fromCharCode(0x80 | (c & 0x3F));
        }
      }
      return out;
    }

    function isFunctionModule(row, col, moduleCount, qr) {
      const finderSize = 9;
      if (row < finderSize && col < finderSize) return true;
      if (row < finderSize && col >= moduleCount - finderSize) return true;
      if (row >= moduleCount - finderSize && col < finderSize) return true;
      if (row === 6 || col === 6) return true;
      if (row === 8 && (col < 9 || col >= moduleCount - 8)) return true;
      if (col === 8 && (row < 9 || row >= moduleCount - 8)) return true;
      if (qr.getModuleCount() >= 45) {
        if (row < 6 && col >= moduleCount - 11 && col < moduleCount - 8) return true;
        if (col < 6 && row >= moduleCount - 11 && row < moduleCount - 8) return true;
      }
      const alignSize = 5, margin = 6;
      if (row >= moduleCount - margin - alignSize && row < moduleCount - margin &&
        col >= moduleCount - margin - alignSize && col < moduleCount - margin) return true;
      if (row >= moduleCount - margin - alignSize && row < moduleCount - margin &&
        col >= margin && col < margin + alignSize) return true;
      if (row >= margin && row < margin + alignSize &&
        col >= moduleCount - margin - alignSize && col < moduleCount - margin) return true;
      return false;
    }

    function generateQRCode() {
      const textInput = document.getElementById('qrText').value;
      const text = textInput.length === 0 ? ' ' : textInput;
      let size = parseInt(sizeInput.value) || 400;
      if (size < 200) { size = 200; sizeInput.value = 200; sizeSlider.value = 200; Swal.fire('提示', '最小尺寸为 200px', 'info'); }
      else if (size > 5000) { size = 5000; sizeInput.value = 5000; sizeSlider.value = 2000; Swal.fire('提示', '最大尺寸为 5000px', 'info'); }

      const correctStr = document.getElementById('qrCorrect').value;
      const fgColor = document.getElementById('qrFg').value;
      const bgColor = document.getElementById('qrBg').value;
      const style = document.getElementById('qrStyle').value;
      const logoInput = document.getElementById('qrLogo');
      const logoStyle = document.getElementById('qrLogoStyle').value;
      const container = document.getElementById('qrcode-canvas-container');
      container.innerHTML = '';

      let qr;
      try {
        qr = qrcode(0, correctStr);
        qr.addData(utf16to8(text), 'Byte');
        qr.make();
      } catch (err) {
        Swal.fire('生成失败', '内容过长，请缩短文本或调低容错率', 'error');
        return;
      }

      const moduleCount = qr.getModuleCount();
      const cell = size / moduleCount;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, size, size);

      let logoModuleRange = null;
      const hasLogo = logoInput.files && logoInput.files[0];
      if (hasLogo) {
        const logoModules = Math.ceil(moduleCount * 0.22);
        const start = Math.floor((moduleCount - logoModules) / 2);
        logoModuleRange = { start, end: start + logoModules };
      }

      ctx.fillStyle = fgColor;

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (!qr.isDark(row, col)) continue;
          if (logoModuleRange &&
            row >= logoModuleRange.start && row < logoModuleRange.end &&
            col >= logoModuleRange.start && col < logoModuleRange.end) {
            if (!isFunctionModule(row, col, moduleCount, qr)) continue;
          }

          const x0 = Math.round(col * cell);
          const y0 = Math.round(row * cell);
          const x1 = Math.round((col + 1) * cell);
          const y1 = Math.round((row + 1) * cell);
          const w = Math.max(1, x1 - x0), h = Math.max(1, y1 - y0);

          if (style === 'dot') {
            ctx.beginPath(); ctx.arc(x0 + w / 2, y0 + h / 2, Math.min(w, h) / 2.2, 0, Math.PI * 2); ctx.fill();
          } else if (style === 'fluid') {
            ctx.beginPath(); ctx.arc(x0 + w / 2, y0 + h / 2, Math.min(w, h) / 1.6, 0, Math.PI * 2); ctx.fill();
          } else if (style === 'rounded') {
            const pad = Math.max(0.5, Math.min(w, h) * 0.08);
            const rw = Math.max(1, w - pad * 2), rh = Math.max(1, h - pad * 2);
            const r = Math.min(rw, rh) * 0.35;
            ctx.beginPath();
            if (ctx.roundRect) ctx.roundRect(x0 + pad, y0 + pad, rw, rh, r);
            else ctx.rect(x0 + pad, y0 + pad, rw, rh);
            ctx.fill();
          } else {
            ctx.fillRect(x0, y0, w, h);
          }
        }
      }

      if (hasLogo) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = new Image();
          img.onload = function () {
            const logoSize = size * 0.18;
            const logoX = (size - logoSize) / 2;
            const logoY = (size - logoSize) / 2;

            if (logoStyle !== 'none') {
              ctx.fillStyle = bgColor;
              ctx.beginPath();
              if (logoStyle === 'circle') {
                ctx.arc(size / 2, size / 2, logoSize / 2 + size * 0.015, 0, Math.PI * 2); ctx.fill();
              } else {
                const r = size * 0.02, padding = size * 0.015;
                const bx = logoX - padding, by = logoY - padding;
                const bs = logoSize + padding * 2;
                if (ctx.roundRect) ctx.roundRect(bx, by, bs, bs, r);
                else ctx.rect(bx, by, bs, bs);
                ctx.fill();
              }
            }

            if (logoStyle === 'circle') {
              ctx.save();
              ctx.beginPath(); ctx.arc(size / 2, size / 2, logoSize / 2, 0, Math.PI * 2); ctx.clip();
              ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
              ctx.restore();
            } else {
              ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
            }
            finishGenerate(canvas);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(logoInput.files[0]);
      } else {
        finishGenerate(canvas);
      }
    }

    // ============================================================
    // 条形码生成（4倍超采样抗锯齿处理）
    // ============================================================
    function generateBarcode() {
      let text = document.getElementById('barcodeText').value.trim();
      const format = document.getElementById('barcodeFormat').value;
      const displayValue = document.getElementById('barcodeDisplayValue').value === 'true';

      if (!text) {
        Swal.fire('提示', '请输入条码内容', 'warning');
        return;
      }

      if (format === 'EAN13' && text.length === 13) text = text.substring(0, 12);
      if (format === 'UPC' && text.length === 12) text = text.substring(0, 11);

      const container = document.getElementById('barcode-container');
      container.innerHTML = '';

      try {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        JsBarcode(svg, text, {
          format: format,
          displayValue: displayValue,
          width: 2,
          height: 100,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000"
        });

        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();

        img.onload = function () {
          const RESOLUTION_SCALE = 4;
          const canvas = document.createElement('canvas');
          canvas.width = (img.width || 600) * RESOLUTION_SCALE;
          canvas.height = (img.height || 200) * RESOLUTION_SCALE;

          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          URL.revokeObjectURL(url);
          finishGenerate(canvas);
        };
        img.src = url;

      } catch (err) {
        console.error(err);
        Swal.fire('生成失败', '条码内容与格式不匹配，请检查位数或字符。', 'error');
      }
    }

    function finishGenerate(canvas) {
      currentImageUrl = canvas.toDataURL("image/png");
      const container = currentMode === 'qr' ? document.getElementById('qrcode-canvas-container') : document.getElementById('barcode-container');
      container.innerHTML = '';

      const displayCanvas = document.createElement('canvas');
      displayCanvas.width = canvas.width;
      displayCanvas.height = canvas.height;
      displayCanvas.getContext('2d').drawImage(canvas, 0, 0);

      displayCanvas.style.maxWidth = '100%';
      displayCanvas.style.maxHeight = '300px';
      displayCanvas.style.objectFit = 'contain';
      container.appendChild(displayCanvas);

      if (window.innerWidth <= 768) {
        document.getElementById('mobileImg').src = currentImageUrl;
        const modal = document.getElementById('mobileModal');
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
      }
    }

    function closeMobileModal() {
      const modal = document.getElementById('mobileModal');
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }

    function downloadCode() {
      if (!currentImageUrl) return;
      const a = document.createElement('a');
      a.href = currentImageUrl;
      a.download = currentMode === 'qr' ? 'qrcode.png' : 'barcode.png';
      a.click();
    }

    // ============================================================
    // 图片扫码（zxing-wasm）
    // ============================================================
    async function scanFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = window.ZXingWASM;
      if (!reader || typeof reader.readBarcodesFromImageFile !== 'function') {
        Swal.fire('错误', '扫码引擎未加载完成，请刷新页面后重试', 'error');
        event.target.value = '';
        return;
      }

      try {
        const results = await reader.readBarcodesFromImageFile(file, {
          tryHarder: true,
          maxNumberOfSymbols: 1
        });

        if (results && results.length > 0 && results[0].text) {
          onScanSuccess(results[0].text);
        } else {
          Swal.fire('失败', '未能从图片中识别到有效信息', 'error');
        }
      } catch (e) {
        console.error('zxing-wasm 解码异常:', e);
        Swal.fire('失败', '图片解析出错，请换一张图试试', 'error');
      }
      event.target.value = '';
    }

    function onScanSuccess(decodedText) {
      if (navigator.vibrate) navigator.vibrate(100);
      document.getElementById('scanResult').value = decodedText;
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: '识别成功', showConfirmButton: false, timer: 2000 });
    }

    function editScannedContent() {
      const result = document.getElementById('scanResult').value;
      if (!result) return Swal.fire('提示', '没有可编辑的内容', 'warning');

      if (/^\d{8,14}$/.test(result) && currentMode === 'barcode') {
        document.getElementById('barcodeText').value = result;
      } else {
        document.getElementById('qrText').value = result;
      }
      document.getElementById('scanResult').value = '';
      Swal.fire({ toast: true, position: 'top-center', icon: 'success', title: '已导入到编辑器', showConfirmButton: false, timer: 1500 });
    }