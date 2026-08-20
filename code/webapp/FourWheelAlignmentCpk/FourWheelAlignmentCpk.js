// ==================== 可配置区域 ====================
var VIN_MODEL_MAP = {
    'C0': 'N111',
    'C1': 'N111P',
    'C5': 'CF510V',
    'C6': 'CN115',
    'C7': 'CN112',
    'C8': 'CN110V',
    'C9': 'CN110V',
};

var SPECS = {
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

var COLS = ['左前前束', '右前前束', '左前外倾', '右前外倾', '方向盘角度'];
var COL_LABELS = {
    '左前前束': '左前前束CPK',
    '右前前束': '右前前束CPK',
    '左前外倾': '左前外倾CPK',
    '右前外倾': '右前外倾CPK',
    '方向盘角度': '方向盘角度CPK',
};

// ==================== 全局状态 ====================
var allData = [];
var currentRows = [];
var currentDim = '日';

// ==================== 工具函数 ====================
function getWeekOfMonth(date) {
    var d = new Date(date);
    var firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    var dayOfMonth = d.getDate();
    var firstDayOfWeek = firstDay.getDay();
    var adjusted = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;
    var weekNum = Math.ceil((dayOfMonth + adjusted) / 7);
    return weekNum;
}

function extractModel(v) {
    if (!v || typeof v !== 'string') return '未知';
    v = v.trim().toUpperCase();
    if (v.length < 12) return '未知';
    return VIN_MODEL_MAP[v.substring(10, 12)] || '未知';
}

function calcCpk(vals, lo, hi) {
    var d = vals.filter(function(v) { return typeof v === 'number' && !isNaN(v) && isFinite(v); });
    if (d.length < 3) return null;
    var m = d.reduce(function(a, b) { return a + b; }, 0) / d.length;
    var s = Math.sqrt(d.reduce(function(a, b) { return a + (b - m) * (b - m); }, 0) / (d.length - 1));
    if (s === 0) return null;
    return Math.min((hi - m) / (3 * s), (m - lo) / (3 * s));
}

function getStatus(c) {
    if (c === null || c === undefined || isNaN(c)) return 'na';
    if (c >= 1.0) return 'excellent';
    if (c >= 0.67) return 'good';
    return 'poor';
}

function getCls(c) {
    var s = getStatus(c);
    if (s === 'excellent') return 'cpk-excellent';
    if (s === 'good') return 'cpk-good';
    if (s === 'poor') return 'cpk-poor';
    return 'cpk-na';
}

function readExcelFile(file) {
    return new Promise(function(resolve, reject) {
        var r = new FileReader();
        r.onload = function(e) {
            try {
                var wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                var ws = wb.Sheets[wb.SheetNames[0]];
                resolve(XLSX.utils.sheet_to_json(ws, { defval: '' }));
            } catch (err) { reject(err); }
        };
        r.onerror = reject;
        r.readAsArrayBuffer(file);
    });
}

function loadFromFile(file) {
    document.getElementById('loadingIndicator').classList.add('active');
    readExcelFile(file).then(function(raw) {
        document.getElementById('loadingIndicator').classList.remove('active');
        processData(raw);
        var msg = typeof getLocalizedText !== 'undefined' ?
            getLocalizedText('数据加载成功！共 ' + allData.length + ' 条合格记录', 'Data loaded successfully! ' + allData
                .length + ' qualified records') :
            '数据加载成功！共 ' + allData.length + ' 条合格记录';
        Swal.fire({
            icon: 'success',
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('成功', 'Success') : '成功',
            text: msg,
            timer: 2000,
            showConfirmButton: false
        });
    }).catch(function(err) {
        document.getElementById('loadingIndicator').classList.remove('active');
        Swal.fire({
            icon: 'error',
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('读取失败', 'Load Failed') : '读取失败',
            text: err.message
        });
    });
}

function processData(raw) {
    var cm = {};
    var h = Object.keys(raw[0] || {});
    h.forEach(function(k) {
        var s = String(k).trim();
        if (s.indexOf('VIN') !== -1 || s.indexOf('车辆识别码') !== -1) cm['VIN'] = k;
        else if (s.indexOf('检测结果') !== -1) cm['检测结果'] = k;
        else if (s.indexOf('检测线号') !== -1) cm['检测线号'] = k;
        else if (s.indexOf('检测结束时间') !== -1) cm['检测结束时间'] = k;
        else if (s.indexOf('左前前束') !== -1) cm['左前前束'] = k;
        else if (s.indexOf('右前前束') !== -1) cm['右前前束'] = k;
        else if (s.indexOf('左前外倾') !== -1) cm['左前外倾'] = k;
        else if (s.indexOf('右前外倾') !== -1) cm['右前外倾'] = k;
        else if (s.indexOf('方向盘角度') !== -1) cm['方向盘角度'] = k;
    });

    var processed = raw.map(function(row) {
        var item = {
            VIN: String(row[cm['VIN']] || ''),
            检测结果: String(row[cm['检测结果']] || ''),
            检测线号: String(row[cm['检测线号']] || '')
        };
        COLS.forEach(function(c) {
            var v = parseFloat(row[cm[c]]);
            item[c] = isNaN(v) ? null : v;
        });
        item.车型 = extractModel(item.VIN);
        var dt = row[cm['检测结束时间']];
        if (typeof dt === 'string') {
            var d = new Date(dt);
            item.日期 = isNaN(d) ? null : d;
        } else if (dt instanceof Date) {
            item.日期 = dt;
        } else {
            item.日期 = null;
        }
        if (item.日期 && !isNaN(item.日期)) {
            var d = new Date(item.日期);
            item.年 = d.getFullYear();
            item.月数字 = d.getMonth() + 1;
            item.月 = String(item.月数字).padStart(2, '0');
            item.日 = String(d.getDate()).padStart(2, '0');
            item.年月日 = item.年 + '-' + item.月 + '-' + item.日;
            var weekNum = getWeekOfMonth(d);
            item.周 = item.月数字 + '月第' + weekNum + '周';
            item.周排序 = item.年 * 100 + item.月数字 * 10 + weekNum;
            item.月显示 = item.年 + '-' + item.月;
            item.年显示 = String(item.年);
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
        }
        return item;
    });

    allData = processed.filter(function(r) { return r.检测结果 === 'P'; });
    updateDropdowns();
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelector('[data-dim="日"]').classList.add('active');
    currentDim = '日';
    computeAndRender('日');
    var statusText = typeof getLocalizedText !== 'undefined' ?
        getLocalizedText('已加载 ' + allData.length + ' 条', 'Loaded ' + allData.length + ' records') :
        '已加载 ' + allData.length + ' 条';
    document.getElementById('dataStatus').textContent = statusText;
    displayConfig();
}

function displayConfig() {
    var vinHtml = '';
    for (var key in VIN_MODEL_MAP) {
        if (VIN_MODEL_MAP.hasOwnProperty(key)) {
            vinHtml += key + ' → ' + VIN_MODEL_MAP[key] + '  ';
        }
    }
    document.getElementById('vinMapDisplay').textContent = vinHtml || '（请配置VIN映射）';

    var specHtml = '';
    for (var model in SPECS) {
        if (SPECS.hasOwnProperty(model)) {
            specHtml += model + ':\n';
            for (var col in SPECS[model]) {
                if (SPECS[model].hasOwnProperty(col)) {
                    var lo = SPECS[model][col][0];
                    var hi = SPECS[model][col][1];
                    specHtml += '  ' + col + ': [' + lo + ', ' + hi + ']\n';
                }
            }
        }
    }
    document.getElementById('specsDisplay').textContent = specHtml || '（请配置规格）';

    var configObj = {
        VIN_MODEL_MAP: VIN_MODEL_MAP,
        SPECS: SPECS
    };
    document.getElementById('configEditor').value = JSON.stringify(configObj, null, 2);
}

function updateDropdowns() {
    var models = [];
    var seen = {};
    allData.forEach(function(r) {
        if (r.车型 !== '未知' && SPECS[r.车型] && !seen[r.车型]) {
            seen[r.车型] = true;
            models.push(r.车型);
        }
    });
    models.sort();

    var sel = document.getElementById('modelSelect');
    if (!sel) return;
    var cur = sel.value || 'all';
    sel.innerHTML = '';
    var allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = '全部';
    sel.appendChild(allOpt);
    models.forEach(function(m) {
        var opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        sel.appendChild(opt);
    });
    if (cur && models.indexOf(cur) !== -1) {
        sel.value = cur;
    } else {
        sel.value = 'all';
    }

    var lines = [];
    var seenLines = {};
    allData.forEach(function(r) {
        if (r.检测线号 && r.检测线号 !== '' && !seenLines[r.检测线号]) {
            seenLines[r.检测线号] = true;
            lines.push(r.检测线号);
        }
    });
    lines.sort();

    var sl = document.getElementById('lineFilter');
    if (!sl) return;
    var cl = sl.value || 'all';
    sl.innerHTML = '';
    var allLineOpt = document.createElement('option');
    allLineOpt.value = 'all';
    allLineOpt.textContent = '全部';
    sl.appendChild(allLineOpt);
    lines.forEach(function(l) {
        var opt = document.createElement('option');
        opt.value = l;
        opt.textContent = l;
        sl.appendChild(opt);
    });
    if (cl && lines.indexOf(cl) !== -1) {
        sl.value = cl;
    } else {
        sl.value = 'all';
    }
}

// ==================== 核心计算 ====================
function computeDimensionData(dim, modelFilter, lineFilter) {
    var data = allData;

    if (modelFilter && modelFilter !== 'all') {
        data = data.filter(function(r) { return r.车型 === modelFilter; });
    }
    if (lineFilter && lineFilter !== 'all') {
        data = data.filter(function(r) { return r.检测线号 === lineFilter; });
    }

    if (data.length === 0) {
        return [];
    }

    var models = [];
    var seenModels = {};
    data.forEach(function(r) {
        if (r.车型 !== '未知' && SPECS[r.车型] && !seenModels[r.车型]) {
            seenModels[r.车型] = true;
            models.push(r.车型);
        }
    });
    models.sort();

    var allLines = [];
    var seenLines2 = {};
    data.forEach(function(r) {
        if (r.检测线号 && r.检测线号 !== '' && !seenLines2[r.检测线号]) {
            seenLines2[r.检测线号] = true;
            allLines.push(r.检测线号);
        }
    });
    allLines.sort();

    var groupKey, sortKey;
    if (dim === '日') { groupKey = '年月日'; sortKey = '年月日'; } else if (dim === '周') { groupKey = '周';
        sortKey = '周排序'; } else if (dim === '月') { groupKey = '月显示'; sortKey = '月显示'; } else { groupKey =
            '年显示'; sortKey = '年显示'; }

    var timeVals = new Set();
    data.forEach(function(r) {
        if (r[groupKey] !== null && r[groupKey] !== undefined && r[groupKey] !== '') {
            timeVals.add(r[groupKey]);
        }
    });
    var times = Array.from(timeVals);
    times.sort(function(a, b) {
        if (dim === '周') {
            var aData = data.find(function(r) { return r[groupKey] === a; });
            var bData = data.find(function(r) { return r[groupKey] === b; });
            var aSort = aData ? aData[sortKey] : 0;
            var bSort = bData ? bData[sortKey] : 0;
            return (aSort || 0) - (bSort || 0);
        }
        return String(a).localeCompare(String(b));
    });

    var rows = [];

    models.forEach(function(model) {
        var modelData = data.filter(function(r) { return r.车型 === model; });

        // 只有选择了"全部"线号时，才显示"全部"汇总行
        var isAllLine = !lineFilter || lineFilter === 'all';

        if (isAllLine) {
            times.forEach(function(t) {
                var groupData = modelData.filter(function(r) { return r[groupKey] === t; });
                if (groupData.length < 3) return;

                var row = {
                    '时间': String(t),
                    '车型': model,
                    '检测线号': '全部',
                    '_isTotal': true
                };
                COLS.forEach(function(c) {
                    var spec = SPECS[model] ? SPECS[model][c] : null;
                    if (spec) {
                        var vals = groupData.map(function(r) { return r[c]; }).filter(function(v) {
                            return v !== null && !isNaN(v);
                        });
                        var cpk = calcCpk(vals, spec[0], spec[1]);
                        row[COL_LABELS[c]] = (cpk !== null && !isNaN(cpk)) ? cpk : null;
                    } else {
                        row[COL_LABELS[c]] = null;
                    }
                });
                rows.push(row);
            });
        }

        // 再按每个检测线号单独计算
        allLines.forEach(function(line) {
            var lineData = modelData.filter(function(r) { return r.检测线号 === line; });
            if (lineData.length === 0) return;

            times.forEach(function(t) {
                var groupData = lineData.filter(function(r) { return r[groupKey] === t; });
                if (groupData.length < 3) return;

                var row = {
                    '时间': String(t),
                    '车型': model,
                    '检测线号': line,
                    '_isTotal': false
                };
                COLS.forEach(function(c) {
                    var spec = SPECS[model] ? SPECS[model][c] : null;
                    if (spec) {
                        var vals = groupData.map(function(r) { return r[c]; }).filter(function(v) {
                            return v !== null && !isNaN(v);
                        });
                        var cpk = calcCpk(vals, spec[0], spec[1]);
                        row[COL_LABELS[c]] = (cpk !== null && !isNaN(cpk)) ? cpk : null;
                    } else {
                        row[COL_LABELS[c]] = null;
                    }
                });
                rows.push(row);
            });
        });
    });

    rows.sort(function(a, b) {
        if (a['车型'] !== b['车型']) return a['车型'].localeCompare(b['车型']);
        if (a['检测线号'] === '全部' && b['检测线号'] !== '全部') return -1;
        if (a['检测线号'] !== '全部' && b['检测线号'] === '全部') return 1;
        if (dim === '周') {
            var aSort = 0,
                bSort = 0;
            data.forEach(function(r) {
                if (r['周'] === a['时间']) aSort = r.周排序 || 0;
                if (r['周'] === b['时间']) bSort = r.周排序 || 0;
            });
            return aSort - bSort;
        }
        return String(a['时间']).localeCompare(String(b['时间']));
    });

    return rows;
}

function computeAndRender(dim) {
    currentDim = dim || '日';
    var modelSelect = document.getElementById('modelSelect');
    var lineFilterEl = document.getElementById('lineFilter');

    if (!modelSelect || !lineFilterEl) return;

    var modelFilter = modelSelect.value || 'all';
    var lineFilter = lineFilterEl.value || 'all';

    currentRows = computeDimensionData(currentDim, modelFilter, lineFilter);
    renderTable(currentRows);
    updateSummary(currentRows);

    var countText = typeof getLocalizedText !== 'undefined' ?
        getLocalizedText('显示 ' + currentRows.length + ' 行', 'Showing ' + currentRows.length + ' rows') :
        '显示 ' + currentRows.length + ' 行';
    document.getElementById('rowCount').textContent = countText;
}

function renderTable(rows) {
    var wrapper = document.getElementById('tableWrapper');
    if (rows.length === 0) {
        wrapper.innerHTML =
            '<div class="empty-state"><div class="icon">📭</div><p style="font-size:16px;font-weight:500;">没有数据</p><p style="font-size:13px;color:var(--text-light);">每组至少需要3条记录才能计算Cpk</p></div>';
        return;
    }

    var html = '<table><thead><tr>' +
        '<th>车型</th>' +
        '<th>时间</th>' +
        '<th>检测线号</th>' +
        '<th>左前前束CPK</th>' +
        '<th>右前前束CPK</th>' +
        '<th>左前外倾CPK</th>' +
        '<th>右前外倾CPK</th>' +
        '<th>方向盘角度CPK</th>' +
        '</tr></thead><tbody>';

    rows.forEach(function(row) {
        var isTotal = row['检测线号'] === '全部';
        var bgStyle = isTotal ? 'background:var(--bg-tab);font-weight:600;' : '';

        html += '<tr style="' + bgStyle + '">' +
            '<td class="col-model">' + row['车型'] + '</td>' +
            '<td>' + row['时间'] + '</td>' +
            '<td>' + (isTotal ? '全部' : row['检测线号']) + '</td>';

        COLS.forEach(function(c) {
            var v = row[COL_LABELS[c]];
            if (v !== null && v !== undefined && !isNaN(v) && isFinite(v)) {
                html += '<td class="cpk-value ' + getCls(v) + '">' + v.toFixed(4) + '</td>';
            } else {
                html += '<td class="cpk-na">—</td>';
            }
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    wrapper.innerHTML = html;
}

function updateSummary(rows) {
    document.getElementById('totalRecords').textContent = allData.length;
    var models = [];
    var seen = {};
    allData.forEach(function(r) {
        if (r.车型 !== '未知' && SPECS[r.车型] && !seen[r.车型]) {
            seen[r.车型] = true;
            models.push(r.车型);
        }
    });
    document.getElementById('totalModels').textContent = models.length;

    var ex = 0,
        gd = 0,
        pr = 0;
    rows.forEach(function(row) {
        COLS.forEach(function(c) {
            var v = row[COL_LABELS[c]];
            if (v !== null && v !== undefined && !isNaN(v) && isFinite(v)) {
                var s = getStatus(v);
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
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('没有数据', 'No Data') : '没有数据',
            text: typeof getLocalizedText !== 'undefined' ? getLocalizedText('请先加载数据', 'Please load data first') :
                '请先加载数据'
        });
        return;
    }

    var allRows = [];
    var dimOrder = ['日', '周', '月', '年'];
    dimOrder.forEach(function(dim) {
        var rows = computeDimensionData(dim, 'all', 'all');
        if (rows.length === 0) return;
        rows.forEach(function(row) {
            var exportRow = {
                '车型': row['车型'],
                '时间': row['时间'],
                '检测线号': row['检测线号'],
            };
            COLS.forEach(function(c) {
                var v = row[COL_LABELS[c]];
                exportRow[COL_LABELS[c]] = (v !== null && v !== undefined && !isNaN(v) &&
                    isFinite(v)) ? v.toFixed(4) : '';
            });
            allRows.push(exportRow);
        });
    });

    if (allRows.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('没有数据', 'No Data') : '没有数据',
            text: typeof getLocalizedText !== 'undefined' ? getLocalizedText('没有可导出的数据', 'No data to export') :
                '没有可导出的数据'
        });
        return;
    }

    allRows.sort(function(a, b) {
        if (a['车型'] !== b['车型']) return a['车型'].localeCompare(b['车型']);
        return String(a['时间']).localeCompare(String(b['时间']));
    });

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(allRows);
    XLSX.utils.book_append_sheet(wb, ws);
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    var blob = new Blob([wbout], { type: 'application/octet-stream' });
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Cpk全部数据.xlsx';
    link.click();
    URL.revokeObjectURL(link.href);

    Swal.fire({
        icon: 'success',
        title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('导出成功', 'Export Success') : '导出成功',
        text: typeof getLocalizedText !== 'undefined' ? getLocalizedText('已导出 ' + allRows.length + ' 行数据',
            'Exported ' + allRows.length + ' rows') : '已导出 ' + allRows.length + ' 行数据',
        timer: 1500,
        showConfirmButton: false
    });
}

// ==================== 应用配置 ====================
function applyConfig() {
    try {
        var editor = document.getElementById('configEditor');
        var config = JSON.parse(editor.value);

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
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('配置已应用', 'Config Applied') :
                '配置已应用',
            timer: 1500,
            showConfirmButton: false
        });
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('JSON格式错误', 'JSON Format Error') :
                'JSON格式错误',
            text: e.message
        });
    }
}

// ==================== 事件绑定 ====================
document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        computeAndRender(this.dataset.dim);
    });
});

document.getElementById('modelSelect').addEventListener('change', function() {
    computeAndRender(currentDim);
});

document.getElementById('lineFilter').addEventListener('change', function() {
    computeAndRender(currentDim);
});

document.getElementById('loadBtn').addEventListener('click', function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = function(e) {
        if (this.files && this.files[0]) loadFromFile(this.files[0]);
    };
    input.click();
});

document.getElementById('exportBtn').addEventListener('click', exportAllData);
document.getElementById('applyConfigBtn').addEventListener('click', applyConfig);

document.addEventListener('dragover', function(e) { e.preventDefault(); });
document.addEventListener('drop', function(e) {
    e.preventDefault();
    var files = e.dataTransfer.files;
    if (files && files.length > 0 && (files[0].name.endsWith('.xlsx') || files[0].name.endsWith('.xls'))) {
        loadFromFile(files[0]);
    }
});

// ==================== 初始化 ====================
function init() {
    displayConfig();
    console.log('Cpk工具已加载');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}