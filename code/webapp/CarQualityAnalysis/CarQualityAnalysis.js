// ==================== VIN映射表（四轮定位用，用户可编辑） ====================
var VIN_MODEL_MAP = {
    'C0': 'N111',
    'C1': 'N111P',
    'C5': 'CF510V',
    'C6': 'CN115',
    'C7': 'CN112',
    'C8': 'CN110V',
    'C9': 'CN110V',
};

// ==================== 模块配置 ====================
var MODULES = {
    alignment: {
        name: '四轮定位',
        nameEn: 'Alignment',
        modelSource: 'vin',
        cols: ['左前前束', '右前前束', '左前外倾', '右前外倾', '方向盘角度'],
        colLabels: {
            '左前前束': '左前前束CPK',
            '右前前束': '右前前束CPK',
            '左前外倾': '左前外倾CPK',
            '右前外倾': '右前外倾CPK',
            '方向盘角度': '方向盘角度CPK'
        },
        defaultSpecs: {
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
        }
    },
    lamp: {
        name: '大灯',
        nameEn: 'Lamp',
        modelSource: 'standard',
        cols: ['左远光强', '右远光强', '左近光上下偏', '右近光上下偏', '左近光水平偏', '右近光水平偏'],
        colLabels: {
            '左远光强': '左远光强CPK',
            '右远光强': '右远光强CPK',
            '左近光上下偏': '左近光上下偏CPK',
            '右近光上下偏': '右近光上下偏CPK',
            '左近光水平偏': '左近光水平偏CPK',
            '右近光水平偏': '右近光水平偏CPK'
        },
        defaultSpecs: {
            'CF510V': {
                '左远光强': [40000, 225000],
                '右远光强': [40000, 225000],
                '左近光上下偏': [-168, -123],
                '右近光上下偏': [-168, -123],
                '左近光水平偏': [-20, 220],
                '右近光水平偏': [-20, 220],
            },
            'N111': {
                '左远光强': [26000, 225000],
                '右远光强': [26000, 225000],
                '左近光上下偏': [-236, -79],
                '右近光上下偏': [-236, -79],
                '左近光水平偏': [-153, 315],
                '右近光水平偏': [-153, 315],
            },
            'N111P': {
                '左远光强': [26000, 225000],
                '右远光强': [26000, 225000],
                '左近光上下偏': [-236, -79],
                '右近光上下偏': [-236, -79],
                '左近光水平偏': [-153, 315],
                '右近光水平偏': [-153, 315],
            },
            'CN110V': {
                '左远光强': [30000, 225000],
                '右远光强': [30000, 225000],
                '左近光上下偏': [-257, -86],
                '右近光上下偏': [-257, -86],
                '左近光水平偏': [-153, 315],
                '右近光水平偏': [-153, 315],
            },
            'CN112': {
                '左远光强': [30000, 225000],
                '右远光强': [30000, 225000],
                '左近光上下偏': [-227, -76],
                '右近光上下偏': [-227, -76],
                '左近光水平偏': [-153, 315],
                '右近光水平偏': [-153, 315],
            },
            'CN115': {
                '左远光强': [30000, 225000],
                '右远光强': [30000, 225000],
                '左近光上下偏': [-251, -84],
                '右近光上下偏': [-251, -84],
                '左近光水平偏': [-153, 315],
                '右近光水平偏': [-153, 315],
            },
            'CN115G': {
                '左远光强': [30000, 225000],
                '右远光强': [30000, 225000],
                '左近光上下偏': [-255, -85],
                '右近光上下偏': [-255, -85],
                '左近光水平偏': [-153, 315],
                '右近光水平偏': [-153, 315],
            },
        }
    }
};

// ==================== 当前状态 ====================
var currentModule = 'alignment';
var moduleData = {
    alignment: { allData: [], currentRows: [], currentDim: '日', currentSpecs: {} },
    lamp: { allData: [], currentRows: [], currentDim: '日', currentSpecs: {} }
};
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

function extractModelFromVIN(vin) {
    if (!vin || typeof vin !== 'string') return '未知';
    vin = vin.trim().toUpperCase();
    if (vin.length < 12) return '未知';
    var key = vin.substring(10, 12);
    return VIN_MODEL_MAP[key] || '未知';
}

function extractModelFromStandard(standard) {
    if (!standard || typeof standard !== 'string') return '未知';
    var s = standard.trim();
    if (s.indexOf('BASE ') === 0) {
        return s.substring(5);
    }
    return s;
}

// ==================== 计算方法选择 ====================
// 根据用户选择计算 Cpk 或 Cp
function calculateIndex(vals, lo, hi, method) {
    var d = vals.filter(function(v) { return typeof v === 'number' && !isNaN(v) && isFinite(v); });
    if (d.length < 3) return null;
    var m = d.reduce(function(a, b) { return a + b; }, 0) / d.length;
    var s = Math.sqrt(d.reduce(function(a, b) { return a + (b - m) * (b - m); }, 0) / (d.length - 1));
    if (s === 0) return null;

    if (method === 'cp') {
        // Cp = (USL - LSL) / (6 * sigma)
        return (hi - lo) / (6 * s);
    } else {
        // Cpk = min((USL - mean) / (3 * sigma), (mean - LSL) / (3 * sigma))
        var cpu = (hi - m) / (3 * s);
        var cpl = (m - lo) / (3 * s);
        return Math.min(cpu, cpl);
    }
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

// ==================== 获取当前模块数据 ====================
function getModuleConfig() {
    return MODULES[currentModule];
}

function getCurrentData() {
    return moduleData[currentModule];
}

function getModuleCols() {
    return getModuleConfig().cols;
}

function getModuleColLabels() {
    return getModuleConfig().colLabels;
}

function getDefaultSpecs() {
    return getModuleConfig().defaultSpecs;
}

function getCurrentMethod() {
    var el = document.getElementById('methodSelect');
    return el ? el.value : 'cpk';
}

// ==================== 数据加载与处理 ====================
function loadFromFile(file) {
    document.getElementById('loadingIndicator').classList.add('active');
    readExcelFile(file).then(function(raw) {
        document.getElementById('loadingIndicator').classList.remove('active');
        processData(raw);
        var currentData = getCurrentData();
        var msg = typeof getLocalizedText !== 'undefined' ?
            getLocalizedText('数据加载成功！共 ' + currentData.allData.length + ' 条合格记录', 'Data loaded successfully! ' + currentData.allData
                .length + ' qualified records') :
            '数据加载成功！共 ' + currentData.allData.length + ' 条合格记录';
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
        else if (s.indexOf('检测类型') !== -1) cm['检测类型'] = k;
        else if (s.indexOf('检测标准') !== -1) cm['检测标准'] = k;
        // 四轮定位
        else if (s.indexOf('左前前束') !== -1) cm['左前前束'] = k;
        else if (s.indexOf('右前前束') !== -1) cm['右前前束'] = k;
        else if (s.indexOf('左前外倾') !== -1) cm['左前外倾'] = k;
        else if (s.indexOf('右前外倾') !== -1) cm['右前外倾'] = k;
        else if (s.indexOf('方向盘角度') !== -1) cm['方向盘角度'] = k;
        // 大灯
        else if (s.indexOf('左远光强(cd)') !== -1 || (s.indexOf('左远光强') !== -1 && s.indexOf('判定') === -1)) {
            cm['左远光强'] = k;
        }
        else if (s.indexOf('右远光强(cd)') !== -1 || (s.indexOf('右远光强') !== -1 && s.indexOf('判定') === -1)) {
            cm['右远光强'] = k;
        }
        else if (s.indexOf('左近光水平偏(mm)') !== -1 || (s.indexOf('左近光水平偏') !== -1 && s.indexOf('判定') === -1 && s.indexOf('合格') === -1)) {
            cm['左近光水平偏'] = k;
        }
        else if (s.indexOf('左近光上下偏(mm/h)') !== -1 || (s.indexOf('左近光上下偏') !== -1 && s.indexOf('判定') === -1 && s.indexOf('合格') === -1)) {
            cm['左近光上下偏'] = k;
        }
        else if (s.indexOf('右近光水平偏(mm)') !== -1 || (s.indexOf('右近光水平偏') !== -1 && s.indexOf('判定') === -1 && s.indexOf('合格') === -1)) {
            cm['右近光水平偏'] = k;
        }
        else if (s.indexOf('右近光上下偏(mm/h)') !== -1 || (s.indexOf('右近光上下偏') !== -1 && s.indexOf('判定') === -1 && s.indexOf('合格') === -1)) {
            cm['右近光上下偏'] = k;
        }
        else if (s.indexOf('灯光是否合格') !== -1) cm['灯光是否合格'] = k;
        else if (s.indexOf('四轮定位是否及格') !== -1) cm['四轮定位是否及格'] = k;
    });

    var moduleConfig = getModuleConfig();
    var cols = moduleConfig.cols;
    var modelSource = moduleConfig.modelSource;

    var processed = raw.map(function(row) {
        var item = {
            VIN: String(row[cm['VIN']] || ''),
            检测结果: String(row[cm['检测结果']] || ''),
            检测线号: String(row[cm['检测线号']] || ''),
            检测类型: String(row[cm['检测类型']] || ''),
            检测标准: String(row[cm['检测标准']] || '')
        };
        cols.forEach(function(c) {
            if (cm[c]) {
                var val = row[cm[c]];
                if (typeof val === 'string') {
                    val = val.replace(/,/g, '').trim();
                }
                var v = parseFloat(val);
                item[c] = isNaN(v) ? null : v;
            } else {
                item[c] = null;
            }
        });

        if (modelSource === 'vin') {
            item.车型 = extractModelFromVIN(item.VIN);
        } else {
            item.车型 = extractModelFromStandard(item.检测标准);
        }

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

    var data = processed.filter(function(r) { return r.检测结果 === 'P'; });

    var currentData = getCurrentData();
    currentData.allData = data;
    currentData.currentSpecs = JSON.parse(JSON.stringify(getDefaultSpecs()));
    currentData.currentRows = [];

    updateDropdowns();
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelector('[data-dim="日"]').classList.add('active');
    currentData.currentDim = '日';
    currentDim = '日';
    computeAndRender('日');
    var statusText = typeof getLocalizedText !== 'undefined' ?
        getLocalizedText('已加载 ' + data.length + ' 条', 'Loaded ' + data.length + ' records') :
        '已加载 ' + data.length + ' 条';
    document.getElementById('dataStatus').textContent = statusText;
    displayConfig();
}

// ==================== 配置显示 ====================
function displayConfig() {
    var currentData = getCurrentData();
    var specs = currentData.currentSpecs || {};
    var specHtml = '';
    for (var model in specs) {
        if (specs.hasOwnProperty(model)) {
            specHtml += model + ':\n';
            var cols = getModuleCols();
            cols.forEach(function(col) {
                if (specs[model].hasOwnProperty(col)) {
                    var lo = specs[model][col][0];
                    var hi = specs[model][col][1];
                    specHtml += '  ' + col + ': [' + lo + ', ' + hi + ']\n';
                }
            });
        }
    }
    document.getElementById('specsDisplay').textContent = specHtml || '（请配置规格）';

    var vinHtml = '';
    for (var key in VIN_MODEL_MAP) {
        if (VIN_MODEL_MAP.hasOwnProperty(key)) {
            vinHtml += key + ' → ' + VIN_MODEL_MAP[key] + '\n';
        }
    }
    var configObj = {
        VIN_MODEL_MAP: VIN_MODEL_MAP,
        specs: specs
    };
    document.getElementById('configEditor').value = JSON.stringify(configObj, null, 2);
}

// ==================== 下拉框更新 ====================
function updateDropdowns() {
    var currentData = getCurrentData();
    var data = currentData.allData || [];
    var specs = currentData.currentSpecs || {};

    // 车型下拉 - 实时读取
    var models = [];
    var seen = {};
    data.forEach(function(r) {
        if (r.车型 !== '未知' && specs[r.车型] && !seen[r.车型]) {
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
    allOpt.textContent = '所有车型';
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

    // 检测线号下拉 - 实时读取
    var lines = [];
    var seenLines = {};
    data.forEach(function(r) {
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

    var allResultOpt = document.createElement('option');
    allResultOpt.value = 'all';
    allResultOpt.textContent = '所有结果';
    sl.appendChild(allResultOpt);

    var totalOpt = document.createElement('option');
    totalOpt.value = 'total';
    totalOpt.textContent = '全部';
    sl.appendChild(totalOpt);

    lines.forEach(function(l) {
        var opt = document.createElement('option');
        opt.value = l;
        opt.textContent = l;
        sl.appendChild(opt);
    });

    if (cl === 'total') {
        sl.value = 'total';
    } else if (cl && lines.indexOf(cl) !== -1) {
        sl.value = cl;
    } else {
        sl.value = 'all';
    }
}

// ==================== 核心计算 ====================
function computeDimensionData(dim, modelFilter, lineFilter, method) {
    var currentData = getCurrentData();
    var data = currentData.allData || [];
    var specs = currentData.currentSpecs || {};

    // 按车型过滤
    if (modelFilter && modelFilter !== 'all') {
        data = data.filter(function(r) { return r.车型 === modelFilter; });
    }

    // 获取所有线号
    var allLines = [];
    var seenLines = {};
    var rawData = currentData.allData || [];
    rawData.forEach(function(r) {
        if (r.检测线号 && r.检测线号 !== '' && !seenLines[r.检测线号]) {
            seenLines[r.检测线号] = true;
            allLines.push(r.检测线号);
        }
    });
    allLines.sort();

    var showTotal = false;
    var showLines = [];

    if (lineFilter === 'total') {
        showTotal = true;
        showLines = [];
    } else if (lineFilter === 'all') {
        showTotal = true;
        showLines = allLines.slice();
    } else {
        showTotal = false;
        showLines = [lineFilter];
        data = data.filter(function(r) { return r.检测线号 === lineFilter; });
    }

    if (data.length === 0) {
        return [];
    }

    var models = [];
    var seenModels = {};
    data.forEach(function(r) {
        if (r.车型 !== '未知' && specs[r.车型] && !seenModels[r.车型]) {
            seenModels[r.车型] = true;
            models.push(r.车型);
        }
    });
    models.sort();

    var groupKey, sortKey;
    var cols = getModuleCols();
    var colLabels = getModuleColLabels();

    if (dim === '日') { groupKey = '年月日'; sortKey = '年月日'; }
    else if (dim === '周') { groupKey = '周'; sortKey = '周排序'; }
    else if (dim === '月') { groupKey = '月显示'; sortKey = '月显示'; }
    else { groupKey = '年显示'; sortKey = '年显示'; }

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

        if (showTotal) {
            times.forEach(function(t) {
                var groupData = modelData.filter(function(r) { return r[groupKey] === t; });
                if (groupData.length < 3) return;

                var row = {
                    '车型': model,
                    '时间': String(t),
                    '检测线号': '全部',
                    '_isTotal': true
                };
                cols.forEach(function(c) {
                    var spec = specs[model] ? specs[model][c] : null;
                    if (spec) {
                        var vals = groupData.map(function(r) { return r[c]; }).filter(function(v) {
                            return v !== null && !isNaN(v);
                        });
                        // 使用用户选择的方法
                        var idx = calculateIndex(vals, spec[0], spec[1], method);
                        row[colLabels[c]] = (idx !== null && !isNaN(idx)) ? idx : null;
                    } else {
                        row[colLabels[c]] = null;
                    }
                });
                rows.push(row);
            });
        }

        showLines.forEach(function(line) {
            var lineData = modelData.filter(function(r) { return r.检测线号 === line; });
            if (lineData.length === 0) return;

            times.forEach(function(t) {
                var groupData = lineData.filter(function(r) { return r[groupKey] === t; });
                if (groupData.length < 3) return;

                var row = {
                    '车型': model,
                    '时间': String(t),
                    '检测线号': line,
                    '_isTotal': false
                };
                cols.forEach(function(c) {
                    var spec = specs[model] ? specs[model][c] : null;
                    if (spec) {
                        var vals = groupData.map(function(r) { return r[c]; }).filter(function(v) {
                            return v !== null && !isNaN(v);
                        });
                        // 使用用户选择的方法
                        var idx = calculateIndex(vals, spec[0], spec[1], method);
                        row[colLabels[c]] = (idx !== null && !isNaN(idx)) ? idx : null;
                    } else {
                        row[colLabels[c]] = null;
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
            var aSort = 0, bSort = 0;
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
    var currentData = getCurrentData();
    currentDim = dim || '日';
    currentData.currentDim = dim || '日';

    var modelSelect = document.getElementById('modelSelect');
    var lineFilterEl = document.getElementById('lineFilter');
    var methodEl = document.getElementById('methodSelect');

    if (!modelSelect || !lineFilterEl || !methodEl) return;

    var modelFilter = modelSelect.value || 'all';
    var lineFilter = lineFilterEl.value || 'all';
    var method = methodEl.value || 'cpk';

    currentData.currentRows = computeDimensionData(currentDim, modelFilter, lineFilter, method);
    renderTable(currentData.currentRows, method);
    updateSummary(currentData.currentRows);

    var countText = typeof getLocalizedText !== 'undefined' ?
        getLocalizedText('显示 ' + currentData.currentRows.length + ' 行', 'Showing ' + currentData.currentRows.length + ' rows') :
        '显示 ' + currentData.currentRows.length + ' 行';
    document.getElementById('rowCount').textContent = countText;
}

function renderTable(rows, method) {
    var wrapper = document.getElementById('tableWrapper');
    if (rows.length === 0) {
        wrapper.innerHTML =
            '<div class="empty-state"><div class="icon">📭</div><p style="font-size:16px;font-weight:500;">没有数据</p><p style="font-size:13px;color:var(--text-light);">每组至少需要3条记录才能计算</p></div>';
        return;
    }

    var cols = getModuleCols();
    var colLabels = getModuleColLabels();
    var methodLabel = method === 'cp' ? 'Cp' : 'Cpk';

    var html = '<table><thead><tr>' +
        '<th>车型</th>' +
        '<th>时间</th>' +
        '<th>检测线号</th>';

    cols.forEach(function(c) {
        // 替换列名中的 CPK 为当前方法
        var label = colLabels[c].replace('CPK', methodLabel);
        html += '<th>' + label + '</th>';
    });

    html += '</tr></thead><tbody>';

    rows.forEach(function(row) {
        var isTotal = row['检测线号'] === '全部';
        var bgStyle = isTotal ? 'background:var(--bg-tab);font-weight:600;' : '';

        html += '<tr style="' + bgStyle + '">' +
            '<td class="col-model">' + row['车型'] + '</td>' +
            '<td>' + row['时间'] + '</td>' +
            '<td>' + (isTotal ? '全部' : row['检测线号']) + '</td>';

        cols.forEach(function(c) {
            var v = row[colLabels[c]];
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
    var currentData = getCurrentData();
    var data = currentData.allData || [];
    var specs = currentData.currentSpecs || {};

    document.getElementById('totalRecords').textContent = data.length;
    var models = [];
    var seen = {};
    data.forEach(function(r) {
        if (r.车型 !== '未知' && specs[r.车型] && !seen[r.车型]) {
            seen[r.车型] = true;
            models.push(r.车型);
        }
    });
    document.getElementById('totalModels').textContent = models.length;

    var cols = getModuleCols();
    var colLabels = getModuleColLabels();

    var ex = 0, gd = 0, pr = 0;
    rows.forEach(function(row) {
        cols.forEach(function(c) {
            var v = row[colLabels[c]];
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
// ==================== 导出 ====================
function exportAllData() {
    var currentData = getCurrentData();
    if (currentData.allData.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('没有数据', 'No Data') : '没有数据',
            text: typeof getLocalizedText !== 'undefined' ? getLocalizedText('请先加载数据', 'Please load data first') : '请先加载数据'
        });
        return;
    }

    var method = getCurrentMethod();
    var methodLabel = method === 'cp' ? 'Cp' : 'CPK';

    // 动态生成列标签
    var cols = getModuleCols();
    var colLabels = getModuleColLabels();
    var exportColLabels = {};
    cols.forEach(function(c) {
        // 把 "xxxCPK" 替换为 "xxx" + methodLabel
        var baseName = colLabels[c].replace('CPK', '');
        exportColLabels[c] = baseName + methodLabel;
    });

    var allRows = [];
    var dimOrder = ['日', '周', '月', '年'];
    dimOrder.forEach(function(dim) {
        var rows = computeDimensionData(dim, 'all', 'all', method);
        if (rows.length === 0) return;
        rows.forEach(function(row) {
            var exportRow = {
                '车型': row['车型'],
                '时间': row['时间'],
                '检测线号': row['检测线号'],
            };
            cols.forEach(function(c) {
                var v = row[colLabels[c]];
                exportRow[exportColLabels[c]] = (v !== null && v !== undefined && !isNaN(v) && isFinite(v)) ? v.toFixed(4) : '';
            });
            allRows.push(exportRow);
        });
    });

    if (allRows.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('没有数据', 'No Data') : '没有数据',
            text: typeof getLocalizedText !== 'undefined' ? getLocalizedText('没有可导出的数据', 'No data to export') : '没有可导出的数据'
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
    link.download = (currentModule === 'alignment' ? '四轮定位' : '大灯') + methodLabel + '全部数据.xlsx';
    link.click();
    URL.revokeObjectURL(link.href);

    Swal.fire({
        icon: 'success',
        title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('导出成功', 'Export Success') : '导出成功',
        text: typeof getLocalizedText !== 'undefined' ? getLocalizedText('已导出 ' + allRows.length + ' 行数据', 'Exported ' + allRows.length + ' rows') : '已导出 ' + allRows.length + ' 行数据',
        timer: 1500,
        showConfirmButton: false
    });
}

// ==================== 应用配置 ====================
function applyConfig() {
    try {
        var editor = document.getElementById('configEditor');
        var config = JSON.parse(editor.value);
        var currentData = getCurrentData();

        if (config.VIN_MODEL_MAP) {
            for (var key in config.VIN_MODEL_MAP) {
                if (config.VIN_MODEL_MAP.hasOwnProperty(key)) {
                    VIN_MODEL_MAP[key] = config.VIN_MODEL_MAP[key];
                }
            }
        }

        if (config.specs) {
            currentData.currentSpecs = config.specs;
        }

        displayConfig();

        if (currentData.allData.length > 0) {
            updateDropdowns();
            computeAndRender(currentData.currentDim || '日');
        }

        Swal.fire({
            icon: 'success',
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('配置已应用', 'Config Applied') : '配置已应用',
            timer: 1500,
            showConfirmButton: false
        });
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: typeof getLocalizedText !== 'undefined' ? getLocalizedText('JSON格式错误', 'JSON Format Error') : 'JSON格式错误',
            text: e.message
        });
    }
}

// ==================== 模块切换 ====================
function switchModule(module) {
    if (module === currentModule) return;

    var currentData = getCurrentData();
    currentData.currentRows = currentData.currentRows || [];
    currentData.currentDim = currentData.currentDim || '日';

    currentModule = module;

    document.querySelectorAll('.module-tab').forEach(function(tab) {
        tab.classList.remove('active');
    });
    document.querySelector('.module-tab[data-module="' + module + '"]').classList.add('active');

    var moduleConfig = MODULES[module];
    var titleEl = document.getElementById('pageTitle');
    var subtitleEl = document.getElementById('pageSubtitle');
    var badgeEl = document.getElementById('moduleBadge');

    if (typeof getLocalizedText !== 'undefined') {
        titleEl.textContent = getLocalizedText(moduleConfig.name + ' Cpk 计算', moduleConfig.nameEn + ' Cpk Calculator');
        subtitleEl.textContent = getLocalizedText('按车型、时间、检测线号分组 · 每个车型使用各自规格上下限', 'Group by model, time, inspection line · Each model uses its own specification limits');
        badgeEl.textContent = getLocalizedText('仅合格数据', 'Qualified Data Only');
    } else {
        titleEl.textContent = moduleConfig.name + ' Cpk 计算';
        subtitleEl.textContent = '按车型、时间、检测线号分组 · 每个车型使用各自规格上下限';
        badgeEl.textContent = '仅合格数据';
    }

    var newData = moduleData[module];
    if (!newData.currentSpecs || Object.keys(newData.currentSpecs).length === 0) {
        newData.currentSpecs = JSON.parse(JSON.stringify(moduleConfig.defaultSpecs));
    }

    updateDropdowns();

    var dim = newData.currentDim || '日';
    document.querySelectorAll('.tab').forEach(function(tab) {
        tab.classList.remove('active');
        if (tab.dataset.dim === dim) {
            tab.classList.add('active');
        }
    });

    if (newData.allData.length > 0) {
        computeAndRender(dim);
    } else {
        document.getElementById('tableWrapper').innerHTML =
            '<div class="empty-state"><div class="icon">📂</div><p style="font-size:16px;font-weight:500;">请加载数据</p><p style="font-size:13px;color:var(--text-light);">点击「加载 Excel」选择检测记录文件</p></div>';
        document.getElementById('totalRecords').textContent = '-';
        document.getElementById('totalModels').textContent = '-';
        document.getElementById('cpkExcellent').textContent = '-';
        document.getElementById('cpkGood').textContent = '-';
        document.getElementById('cpkPoor').textContent = '-';
        document.getElementById('rowCount').textContent = '显示 0 行';
        document.getElementById('dataStatus').textContent = typeof getLocalizedText !== 'undefined' ? getLocalizedText('未加载', 'Not loaded') : '未加载';
    }

    displayConfig();
}

// ==================== 事件绑定 ====================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.module-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            switchModule(this.dataset.module);
        });
    });

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

    // 计算方法切换
    document.getElementById('methodSelect').addEventListener('change', function() {
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

    moduleData.alignment.currentSpecs = JSON.parse(JSON.stringify(MODULES.alignment.defaultSpecs));
    moduleData.lamp.currentSpecs = JSON.parse(JSON.stringify(MODULES.lamp.defaultSpecs));
    displayConfig();
    console.log('Cpk工具已加载，当前模块：四轮定位');
});