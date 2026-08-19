    // ==================== 国际化工具 ====================
    function getLocalizedText(zh, en) {
      // 检测当前语言（默认中文）
      // 可以通过外部设置 window.__lang = 'en' 来切换
      const lang = window.__lang || 'zh';
      return lang === 'en' ? en : zh;
    }

    // ==================== 可配置区域 ====================
    let VIN_MODEL_MAP = {
      'C0': 'N111',
      'C1': 'N111P',
      'C5': 'CF510V',
      'C6': 'CN115',
      'C7': 'CN112',
      'C8': 'CN110V',
      'C9': 'CN110V',
    };

    let SPECS = {
      'CF510V': {
        '左前前束': [-0.05, 0.05],
        '右前前束': [-0.05, 0.05],
        '左前外倾': [-0.25, 1.25],
        '右前外倾': [-0.25, 1.25],
        '方向盘角度': [-0.3, 0.3],
      },
      'CN110V': {
        '左前前束': [-0.05, 0.05],
        '右前前束': [-0.05, 0.05],
        '左前外倾': [-0.25, 1.25],
        '右前外倾': [-0.25, 1.25],
        '方向盘角度': [-0.3, 0.3],
      },
      'CN112': {
        '左前前束': [-0.05, 0.05],
        '右前前束': [-0.05, 0.05],
        '左前外倾': [-0.25, 1.25],
        '右前外倾': [-0.25, 1.25],
        '方向盘角度': [-0.3, 0.3],
      },
      'CN115': {
        '左前前束': [-0.05, 0.05],
        '右前前束': [-0.05, 0.05],
        '左前外倾': [-0.25, 1.25],
        '右前外倾': [-0.25, 1.25],
        '方向盘角度': [-0.3, 0.3],
      },
      'N111': {
        '左前前束': [0.133, 0.3],
        '右前前束': [0.133, 0.3],
        '左前外倾': [0.08, 1.58],
        '右前外倾': [0.08, 1.58],
        '方向盘角度': [-0.3, 0.3],
      },
      'N111P': {
        '左前前束': [0.133, 0.3],
        '右前前束': [0.133, 0.3],
        '左前外倾': [0.08, 1.58],
        '右前外倾': [0.08, 1.58],
        '方向盘角度': [-0.3, 0.3],
      },
    };

    const COLS = ['左前前束', '右前前束', '左前外倾', '右前外倾', '方向盘角度'];
    const COL_LABELS = {
      '左前前束': '左前前束CPK',
      '右前前束': '右前前束CPK',
      '左前外倾': '左前外倾CPK',
      '右前外倾': '右前外倾CPK',
      '方向盘角度': '方向盘角度CPK',
    };

    // ==================== 全局状态 ====================
    let allData = [];
    let currentRows = [];
    let currentDim = '日';

    // ==================== 工具函数 ====================
    function getWeekOfMonth(date) {
      const d = new Date(date);
      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
      const dayOfMonth = d.getDate();
      const firstDayOfWeek = firstDay.getDay();
      const adjusted = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;
      const weekNum = Math.ceil((dayOfMonth + adjusted) / 7);
      return weekNum;
    }

    function extractModel(v) {
      if (!v || typeof v !== 'string') return '未知';
      v = v.trim().toUpperCase();
      if (v.length < 12) return '未知';
      return VIN_MODEL_MAP[v.substring(10, 12)] || '未知';
    }

    function calcCpk(vals, lo, hi) {
      const d = vals.filter(v => typeof v === 'number' && !isNaN(v) && isFinite(v));
      if (d.length < 3) return null;
      const m = d.reduce((a, b) => a + b, 0) / d.length;
      const s = Math.sqrt(d.reduce((a, b) => a + (b - m) ** 2, 0) / (d.length - 1));
      if (s === 0) return null;
      return Math.min((hi - m) / (3 * s), (m - lo) / (3 * s));
    }

    function getStatus(c) {
      if (c === null || c === undefined || isNaN(c)) return 'na';
      if (c >= 1.33) return 'excellent';
      if (c >= 1.0) return 'good';
      return 'poor';
    }

    function getCls(c) {
      const s = getStatus(c);
      if (s === 'excellent') return 'cpk-excellent';
      if (s === 'good') return 'cpk-good';
      if (s === 'poor') return 'cpk-poor';
      return 'cpk-na';
    }

    function readExcelFile(file) {
      return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = function (e) {
          try {
            const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            resolve(XLSX.utils.sheet_to_json(ws, { defval: '' }));
          } catch (err) { reject(err); }
        };
        r.onerror = reject;
        r.readAsArrayBuffer(file);
      });
    }

    function loadFromFile(file) {
      document.getElementById('loadingIndicator').classList.add('active');
      readExcelFile(file).then(raw => {
        document.getElementById('loadingIndicator').classList.remove('active');
        processData(raw);
        // SweetAlert2 成功提示
        const msg = getLocalizedText(
          '数据加载成功！共 ' + allData.length + ' 条合格记录',
          'Data loaded successfully! ' + allData.length + ' qualified records'
        );
        Swal.fire({
          icon: 'success',
          title: getLocalizedText('成功', 'Success'),
          text: msg,
          timer: 2000,
          showConfirmButton: false
        });
      }).catch(err => {
        document.getElementById('loadingIndicator').classList.remove('active');
        Swal.fire({
          icon: 'error',
          title: getLocalizedText('读取失败', 'Load Failed'),
          text: err.message
        });
      });
    }

    function processData(raw) {
      const cm = {};
      const h = Object.keys(raw[0] || {});
      h.forEach(k => {
        const s = String(k).trim();
        if (s.includes('VIN') || s.includes('车辆识别码')) cm['VIN'] = k;
        else if (s.includes('检测结果')) cm['检测结果'] = k;
        else if (s.includes('检测线号')) cm['检测线号'] = k;
        else if (s.includes('检测结束时间')) cm['检测结束时间'] = k;
        else if (s.includes('左前前束')) cm['左前前束'] = k;
        else if (s.includes('右前前束')) cm['右前前束'] = k;
        else if (s.includes('左前外倾')) cm['左前外倾'] = k;
        else if (s.includes('右前外倾')) cm['右前外倾'] = k;
        else if (s.includes('方向盘角度')) cm['方向盘角度'] = k;
      });

      const processed = raw.map(row => {
        const item = {
          VIN: String(row[cm['VIN']] || ''), 检测结果: String(row[cm['检测结果']] || ''),
          检测线号: String(row[cm['检测线号']] || '')
        };
        COLS.forEach(c => {
          const v = parseFloat(row[cm[c]]);
          item[c] = isNaN(v) ? null : v;
        });
        item.车型 = extractModel(item.VIN);
        let dt = row[cm['检测结束时间']];
        if (typeof dt === 'string') {
          const d = new Date(dt);
          item.日期 = isNaN(d) ? null : d;
        } else if (dt instanceof Date) { item.日期 = dt; } else {
          item
            .日期 = null;
        }
        if (item.日期 && !isNaN(item.日期)) {
          const d = new Date(item.日期);
          item.年 = d.getFullYear();
          item.月数字 = d.getMonth() + 1;
          item.月 = String(item.月数字).padStart(2, '0');
          item.日 = String(d.getDate()).padStart(2, '0');
          item.年月日 = item.年 + '-' + item.月 + '-' + item.日;
          const weekNum = getWeekOfMonth(d);
          item.周 = item.月数字 + '月第' + weekNum + '周';
          item.周排序 = item.年 * 100 + item.月数字 * 10 + weekNum;
          item.月显示 = item.年 + '-' + item.月;
          item.年显示 = String(item.年);
          const s = new Date(d.getFullYear(), 0, 1);
          const diff = (d - s + (s.getTimezoneOffset() - d.getTimezoneOffset()) * 60000) / 86400000;
          const w = Math.ceil((diff + s.getDay() + 1) / 7);
          item.年周原始 = item.年 + '-W' + String(w).padStart(2, '0');
        } else {
          item.年 = null;
          item.月 = null;
          item.月数字 = null;
          item.日 = null;
          item.年月日 = null;
          item.周 = null;
          item.周排序 = null;
          item.月显示 = null;
          item.年显示 = null;
          item.年周原始 = null;
        }
        return item;
      });

      allData = processed.filter(r => r.检测结果 === 'P');
      updateDropdowns();
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelector('[data-dim="日"]')?.classList.add('active');
      currentDim = '日';
      computeAndRender('日');
      document.getElementById('dataStatus').textContent = getLocalizedText(
        '已加载 ' + allData.length + ' 条',
        'Loaded ' + allData.length + ' records'
      );

      displayConfig();
    }

    function displayConfig() {
      let vinHtml = '';
      for (const [key, val] of Object.entries(VIN_MODEL_MAP)) {
        vinHtml += key + ' → ' + val + '  ';
      }
      document.getElementById('vinMapDisplay').textContent = vinHtml || getLocalizedText('（请配置VIN映射）',
        '(Please configure VIN mapping)');

      let specHtml = '';
      for (const [model, specs] of Object.entries(SPECS)) {
        specHtml += model + ':\n';
        for (const [col, [lo, hi]] of Object.entries(specs)) {
          specHtml += '  ' + col + ': [' + lo + ', ' + hi + ']\n';
        }
      }
      document.getElementById('specsDisplay').textContent = specHtml || getLocalizedText('（请配置规格）',
        '(Please configure specifications)');

      const configObj = {
        VIN_MODEL_MAP: VIN_MODEL_MAP,
        SPECS: SPECS
      };
      document.getElementById('configEditor').value = JSON.stringify(configObj, null, 2);
    }

    function updateDropdowns() {
      const models = [...new Set(allData.map(r => r.车型).filter(m => m !== '未知' && SPECS[m]))];
      const sel = document.getElementById('modelSelect');
      const cur = sel.value;
      sel.innerHTML = '<option value="all">' + getLocalizedText('全部', 'All') + '</option>';
      models.forEach(m => sel.innerHTML += `<option value="${m}">${m}</option>`);
      if (cur && models.includes(cur)) sel.value = cur;

      const lines = [...new Set(allData.map(r => r.检测线号).filter(l => l && l !== ''))];
      const sl = document.getElementById('lineFilter');
      const cl = sl.value;
      sl.innerHTML = '<option value="all">' + getLocalizedText('全部', 'All') + '</option>';
      lines.forEach(l => sl.innerHTML += `<option value="${l}">${l}</option>`);
      if (cl && lines.includes(cl)) sl.value = cl;
    }

    function computeDimensionData(dim, modelFilter, lineFilter) {
      let data = allData;
      if (modelFilter !== 'all') data = data.filter(r => r.车型 === modelFilter);
      if (lineFilter !== 'all') data = data.filter(r => r.检测线号 === lineFilter);

      const models = [...new Set(data.map(r => r.车型).filter(m => m !== '未知' && SPECS[m]))];
      models.sort();

      let groupKey, sortKey;
      if (dim === '日') {
        groupKey = '年月日';
        sortKey = '年月日';
      } else if (dim === '周') {
        groupKey = '周';
        sortKey = '周排序';
      } else if (dim === '月') {
        groupKey = '月显示';
        sortKey = '月显示';
      } else {
        groupKey = '年显示';
        sortKey = '年显示';
      }

      const timeVals = new Set();
      data.forEach(r => {
        if (r[groupKey] !== null && r[groupKey] !== undefined && r[groupKey] !== '') timeVals.add(r[
          groupKey]);
      });
      let times = [...timeVals];
      times.sort((a, b) => {
        if (dim === '周') {
          const aData = data.find(r => r[groupKey] === a);
          const bData = data.find(r => r[groupKey] === b);
          const aSort = aData ? aData[sortKey] : 0;
          const bSort = bData ? bData[sortKey] : 0;
          return (aSort || 0) - (bSort || 0);
        }
        return String(a).localeCompare(String(b));
      });

      const rows = [];
      models.forEach(model => {
        const modelData = data.filter(r => r.车型 === model);
        times.forEach(t => {
          const groupData = modelData.filter(r => r[groupKey] === t);
          if (groupData.length < 3) return;
          const row = { '时间': String(t), '车型': model, '检测线号': groupData[0].检测线号 || '-' };
          COLS.forEach(c => {
            const spec = SPECS[model] ? SPECS[model][c] : null;
            if (spec) {
              const vals = groupData.map(r => r[c]).filter(v => v !== null && !isNaN(v));
              const cpk = calcCpk(vals, spec[0], spec[1]);
              row[COL_LABELS[c]] = (cpk !== null && !isNaN(cpk)) ? cpk : null;
            } else {
              row[COL_LABELS[c]] = null;
            }
          });
          rows.push(row);
        });
      });

      rows.sort((a, b) => {
        if (a['车型'] !== b['车型']) return a['车型'].localeCompare(b['车型']);
        if (dim === '周') {
          const aSort = data.find(r => r['周'] === a['时间'])?.周排序 || 0;
          const bSort = data.find(r => r['周'] === b['时间'])?.周排序 || 0;
          return aSort - bSort;
        }
        return String(a['时间']).localeCompare(String(b['时间']));
      });

      return rows;
    }

    function computeAndRender(dim) {
      currentDim = dim || '日';
      const modelFilter = document.getElementById('modelSelect').value;
      const lineFilter = document.getElementById('lineFilter').value;
      currentRows = computeDimensionData(currentDim, modelFilter, lineFilter);
      renderTable(currentRows);
      updateSummary(currentRows);
      const countText = getLocalizedText('显示 ' + currentRows.length + ' 行', 'Showing ' + currentRows.length +
        ' rows');
      document.getElementById('rowCount').textContent = countText;
    }

    function renderTable(rows) {
      const wrapper = document.getElementById('tableWrapper');
      if (rows.length === 0) {
        wrapper.innerHTML =
          `<div class="empty-state"><div class="icon">📭</div><p style="font-size:16px;font-weight:500;" data-en="No data">没有数据</p><p style="font-size:13px;color:var(--text-light);" data-en="Each group needs at least 3 records to calculate Cpk">每组至少需要3条记录才能计算Cpk</p></div>`;
        return;
      }

      let html = `<table>
                <thead><tr>
                        <th data-en="Model">车型</th>
                        <th data-en="Time">时间</th>
                        <th data-en="Inspection Line">检测线号</th>
                        <th data-en="Left Front Toe CPK">左前前束CPK</th>
                        <th data-en="Right Front Toe CPK">右前前束CPK</th>
                        <th data-en="Left Front Camber CPK">左前外倾CPK</th>
                        <th data-en="Right Front Camber CPK">右前外倾CPK</th>
                        <th data-en="Steering Angle CPK">方向盘角度CPK</th>
                    </tr></thead><tbody>`;

      rows.forEach(row => {
        html += `<tr>
                        <td class="col-model">${row['车型']}</td>
                        <td>${row['时间']}</td>
                        <td>${row['检测线号']}</td>`;
        COLS.forEach(c => {
          const v = row[COL_LABELS[c]];
          if (v !== null && v !== undefined && !isNaN(v) && isFinite(v)) {
            html += `<td class="cpk-value ${getCls(v)}">${v.toFixed(4)}</td>`;
          } else {
            html += `<td class="cpk-na">—</td>`;
          }
        });
        html += `</tr>`;
      });

      html += `</tbody></table>`;
      wrapper.innerHTML = html;
    }

    function updateSummary(rows) {
      const totalText = getLocalizedText('总记录', 'Total Records');
      document.getElementById('totalRecords').textContent = allData.length;
      const models = [...new Set(allData.map(r => r.车型).filter(m => m !== '未知' && SPECS[m]))];
      document.getElementById('totalModels').textContent = models.length;
      let ex = 0,
        gd = 0,
        pr = 0;
      rows.forEach(row => {
        COLS.forEach(c => {
          const v = row[COL_LABELS[c]];
          if (v !== null && v !== undefined && !isNaN(v) && isFinite(v)) {
            const s = getStatus(v);
            if (s === 'excellent') ex++;
            else if (s === 'good') gd++;
            else if (s === 'poor') pr++;
          }
        });
      });
      document.getElementById('cpkExcellent').textContent = ex;
      document.getElementById('cpkGood').textContent = gd;
      document.getElementById('cpkPoor').textContent = pr;
    }

    // ==================== 导出 ====================
    function exportAllData() {
      if (allData.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: getLocalizedText('没有数据', 'No Data'),
          text: getLocalizedText('请先加载数据', 'Please load data first')
        });
        return;
      }

      const allRows = [];
      const dimOrder = ['日', '周', '月', '年'];
      dimOrder.forEach(dim => {
        const rows = computeDimensionData(dim, 'all', 'all');
        if (rows.length === 0) return;
        rows.forEach(row => {
          const exportRow = {
            '车型': row['车型'],
            '时间': row['时间'],
            '检测线号': row['检测线号'],
          };
          COLS.forEach(c => {
            const v = row[COL_LABELS[c]];
            exportRow[COL_LABELS[c]] = (v !== null && v !== undefined && !isNaN(v) &&
              isFinite(v)) ? v.toFixed(4) : '';
          });
          allRows.push(exportRow);
        });
      });

      if (allRows.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: getLocalizedText('没有数据', 'No Data'),
          text: getLocalizedText('没有可导出的数据', 'No data to export')
        });
        return;
      }

      allRows.sort((a, b) => {
        if (a['车型'] !== b['车型']) return a['车型'].localeCompare(b['车型']);
        return String(a['时间']).localeCompare(String(b['时间']));
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(allRows);
      XLSX.utils.book_append_sheet(wb, ws);
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Cpk全部数据.xlsx';
      link.click();
      URL.revokeObjectURL(link.href);

      Swal.fire({
        icon: 'success',
        title: getLocalizedText('导出成功', 'Export Success'),
        text: getLocalizedText('已导出 ' + allRows.length + ' 行数据', 'Exported ' + allRows.length + ' rows'),
        timer: 1500,
        showConfirmButton: false
      });
    }

    // ==================== 应用配置 ====================
    function applyConfig() {
      try {
        const editor = document.getElementById('configEditor');
        const config = JSON.parse(editor.value);

        if (config.VIN_MODEL_MAP) {
          VIN_MODEL_MAP = config.VIN_MODEL_MAP;
        }
        if (config.SPECS) {
          SPECS = config.SPECS;
        }

        displayConfig();

        if (allData.length > 0) {
          updateDropdowns();
          computeAndRender(currentDim);
        }

        Swal.fire({
          icon: 'success',
          title: getLocalizedText('配置已应用', 'Config Applied'),
          timer: 1500,
          showConfirmButton: false
        });
      } catch (e) {
        Swal.fire({
          icon: 'error',
          title: getLocalizedText('JSON格式错误', 'JSON Format Error'),
          text: e.message
        });
      }
    }

    // ==================== 事件绑定 ====================
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        computeAndRender(this.dataset.dim);
      });
    });

    document.getElementById('modelSelect').addEventListener('change', function () {
      computeAndRender(currentDim);
    });
    document.getElementById('lineFilter').addEventListener('change', function () {
      computeAndRender(currentDim);
    });

    document.getElementById('loadBtn').addEventListener('click', function () {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls';
      input.onchange = function (e) {
        if (this.files && this.files[0]) loadFromFile(this.files[0]);
      };
      input.click();
    });

    document.getElementById('exportBtn').addEventListener('click', exportAllData);
    document.getElementById('applyConfigBtn').addEventListener('click', applyConfig);

    document.addEventListener('dragover', e => e.preventDefault());
    document.addEventListener('drop', e => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files && files.length > 0 && (files[0].name.endsWith('.xlsx') || files[0].name.endsWith('.xls'))) {
        loadFromFile(files[0]);
      }
    });

    // 初始化显示配置
    displayConfig();
    console.log('Cpk工具已加载');