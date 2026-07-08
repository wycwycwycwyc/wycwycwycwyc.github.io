window.weatherApp = {
  currentWeatherData: null,
  currentStationCode: null,
  currentPublishTime: null,
  tempChart: null,
  forecastChart: null,
  climateChart: null,

  API_PROVINCE: 'https://www.nmc.cn/rest/province/all',
  API_STATION: (code) => `https://www.nmc.cn/rest/province/${code}`,
  API_WEATHER: (code) => `https://www.nmc.cn/rest/weather?stationid=${code}`,
  API_SEARCH: (q) => `https://www.nmc.cn/essearch/api/autocomplete?q=${encodeURIComponent(q)}`,
  IMAGE_BASE: 'https://image.nmc.cn',

  RANK_TYPES: {
    'wind_1h': { label: '极大风速(1h)', unit: 'm/s', api: 'wind/1' },
    'maxtemp_1h': { label: '最高气温(1h)', unit: '°C', api: 'maxtemp/1' },
    'rain_1h': { label: '降水量(1h)', unit: 'mm', api: 'rain/1' },
    'maxtemp_6h': { label: '最高气温(6h)', unit: '°C', api: 'maxtemp/6' },
    'rain_6h': { label: '降水量(6h)', unit: 'mm', api: 'rain/6' },
    'rain_24h_08': { label: '降水量(24h-08时)', unit: 'mm', api: 'rain/24' },
    'rain_24h_20': { label: '降水量(24h-20时)', unit: 'mm', api: 'rain/24' },
    'maxtemp_24h': { label: '最高气温(24h)', unit: '°C', api: 'maxtemp/24' },
    'mintemp_24h': { label: '最低气温(24h)', unit: '°C', api: 'mintemp/24' },
  },

  getTempColor(temp) {
    if (temp === undefined || temp === null || isNaN(temp)) return '#888888';
    const t = parseFloat(temp);
    if (t <= -30) return '#1a1a5e';
    if (t <= -10) {
      const ratio = (t + 30) / 20;
      return this._interpolateColor('#1a1a5e', '#1e3a8a', ratio);
    }
    if (t <= 0) {
      const ratio = (t + 10) / 10;
      return this._interpolateColor('#1e3a8a', '#3b82f6', ratio);
    }
    if (t <= 15) {
      const ratio = t / 15;
      return this._interpolateColor('#3b82f6', '#06b6d4', ratio);
    }
    if (t <= 25) {
      const ratio = (t - 15) / 10;
      return this._interpolateColor('#06b6d4', '#22c55e', ratio);
    }
    if (t <= 30) {
      const ratio = (t - 25) / 5;
      return this._interpolateColor('#22c55e', '#a3e635', ratio);
    }
    if (t <= 35) {
      const ratio = (t - 30) / 5;
      return this._interpolateColor('#a3e635', '#f97316', ratio);
    }
    if (t <= 40) {
      const ratio = (t - 35) / 5;
      return this._interpolateColor('#f97316', '#ef4444', ratio);
    }
    if (t <= 45) {
      const ratio = (t - 40) / 5;
      return this._interpolateColor('#ef4444', '#b91c1c', ratio);
    }
    if (t <= 50) {
      const ratio = (t - 45) / 5;
      return this._interpolateColor('#b91c1c', '#7f1d1d', ratio);
    }
    return '#7f1d1d';
  },

  _interpolateColor(color1, color2, ratio) {
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  },

  isValid(val) {
    if (val === undefined || val === null) return false;
    if (val === '9999' || val === 9999) return false;
    if (typeof val === 'string' && val.trim() === '9999') return false;
    if (typeof val === 'string' && val.trim() === '-') return false;
    return true;
  },

  getAQIColor(aqi) {
    if (!this.isValid(aqi)) return '#888';
    const a = parseInt(aqi);
    if (a <= 50) return '#22c55e';
    if (a <= 100) return '#eab308';
    if (a <= 150) return '#f97316';
    if (a <= 200) return '#ef4444';
    if (a <= 300) return '#8b5cf6';
    return '#b91c1c';
  },

  getWeatherIcon(info) {
    if (!info) return '';
    if (info.includes('晴')) return '☀️';
    if (info.includes('多云')) return '⛅';
    if (info.includes('阴')) return '☁️';
    if (info.includes('雨')) return '🌧️';
    if (info.includes('雪')) return '❄️';
    if (info.includes('雷')) return '⛈️';
    if (info.includes('雾')) return '🌫️';
    if (info.includes('阵雨')) return '🌦️';
    return '';
  },

  generateTimeOptions(publishTime) {
    if (!publishTime) return [];
    const match = publishTime.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
    if (!match) return [];

    const [, year, month, day, hour] = match;
    const baseDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), 0);

    const options = [];
    for (let i = 0; i < 24; i++) {
      const d = new Date(baseDate.getTime() - i * 3600000);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const hh = String(d.getHours()).padStart(2, '0');
      const timeStr = `${yyyy}${mm}${dd}${hh}`;
      const displayStr = `${mm}月${dd}日${hh}时`;
      options.push({ value: timeStr, display: displayStr });
    }
    return options;
  },

  getDefaultTime(publishTime) {
    if (!publishTime) return '';
    const match = publishTime.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):\d{2}/);
    if (!match) return '';
    return `${match[1]}${match[2]}${match[3]}${match[4]}`;
  },

  async fetchWeather(code) {
    const app = window.weatherApp;
    app.currentStationCode = code;
    document.getElementById('weatherContainer').innerHTML =
      '<div style="text-align:center;padding:2rem;"><span class="loading-spinner"></span>加载中...</div>';
    try {
      const res = await fetch(app.API_WEATHER(code));
      const result = await res.json();
      if (result.code === 0 && result.data) {
        app.currentWeatherData = result.data;
        app.currentPublishTime = result.data.real?.publish_time || null;
        app.renderWeather(result.data);
      } else {
        document.getElementById('weatherContainer').innerHTML =
          '<div style="text-align:center;padding:2rem;">未获取到数据</div>';
      }
    } catch (e) {
      document.getElementById('weatherContainer').innerHTML =
        '<div style="text-align:center;padding:2rem;">网络错误</div>';
    }
  },

  setDefaultStation() {
    const app = window.weatherApp;
    if (app.currentStationCode) {
      localStorage.setItem('defaultStationCode', app.currentStationCode);
      Qmsg.success('已设为默认站点');
    }
  },

  showWarnDetail() {
    const app = window.weatherApp;
    const warn = app.currentWeatherData?.real?.warn;
    if (!warn) return;
    let html = '';
    html += `<h3>⚠️ ${warn.signaltype || ''}${app.isValid(warn.signallevel) ? ' ' + warn.signallevel : ''}预警</h3>`;
    if (app.isValid(warn.alert)) html += `<p><strong>预警信息：</strong>${warn.alert}</p>`;
    if (app.isValid(warn.issuecontent)) html += `<p>${warn.issuecontent}</p>`;
    if (app.isValid(warn.fmeans)) html += `<p><strong>防御指南：</strong>${warn.fmeans}</p>`;
    if (app.isValid(warn.province) || app.isValid(warn.city)) {
      html += `<p>发布单位：${warn.province || ''} ${warn.city || ''}</p>`;
    }
    document.getElementById('warnModalContent').innerHTML = html;
    document.getElementById('warnModal').classList.add('active');
  },

  closeWarnModal() {
    document.getElementById('warnModal').classList.remove('active');
  },

  showRadarModal() {
    const app = window.weatherApp;
    const radar = app.currentWeatherData?.radar;
    if (radar && app.isValid(radar.image)) {
      document.getElementById('radarModalImg').src = app.IMAGE_BASE + radar.image;
      document.getElementById('radarModal').classList.add('active');
    }
  },

  closeRadarModal() {
    document.getElementById('radarModal').classList.remove('active');
  },

  showRankModal() {
    const app = window.weatherApp;
    const defaultTime = app.getDefaultTime(app.currentPublishTime) ||
      new Date().toISOString().slice(0, 10).replace(/-/g, '') +
      String(new Date().getHours()).padStart(2, '0');

    const timeOptions = app.generateTimeOptions(app.currentPublishTime);
    let optionsHtml = '';
    timeOptions.forEach(t => {
      const selected = t.value === defaultTime ? ' selected' : '';
      optionsHtml += `<option value="${t.value}"${selected}>${t.display}</option>`;
    });

    let html = `
      <h3>📊 实况排行</h3>
      <div style="display:flex;gap:0.8rem;flex-wrap:wrap;align-items:center;margin:1rem 0;">
        <select id="rankTypeSelect" onchange="window.weatherApp.fetchRankData()" style="padding:0.5rem 1rem;border-radius:2rem;border:1px solid #cbd5e1;background:rgba(255,255,255,0.8);color:#1a2b3c;">
          <option value="maxtemp_1h">最高气温(1h)</option>
          <option value="rain_1h">降水量(1h)</option>
          <option value="wind_1h">极大风速(1h)</option>
          <option value="maxtemp_6h">最高气温(6h)</option>
          <option value="rain_6h">降水量(6h)</option>
          <option value="rain_24h_08">降水量(24h-08时)</option>
          <option value="rain_24h_20">降水量(24h-20时)</option>
          <option value="maxtemp_24h">最高气温(24h)</option>
          <option value="mintemp_24h">最低气温(24h)</option>
        </select>
        <select id="rankTimeSelect" onchange="window.weatherApp.fetchRankData()" style="padding:0.5rem 1rem;border-radius:2rem;border:1px solid #cbd5e1;background:rgba(255,255,255,0.8);color:#1a2b3c;">
          ${optionsHtml}
        </select>
      </div>
      <div id="rankDataContainer" style="max-height:55vh;overflow-y:auto;">
        <div style="text-align:center;padding:2rem;color:#888;">请选择类型和时间后点击查询</div>
      </div>
    `;
    document.getElementById('warnModalContent').innerHTML = html;
    document.getElementById('warnModal').classList.add('active');

    // 自动加载默认数据
    setTimeout(() => app.fetchRankData(), 100);
  },

  async fetchRankData() {
    const typeSelect = document.getElementById('rankTypeSelect');
    const timeSelect = document.getElementById('rankTimeSelect');
    if (!typeSelect || !timeSelect) return;

    const type = typeSelect.value;
    const time = timeSelect.value;
    const rankConfig = this.RANK_TYPES[type];
    if (!rankConfig) return;

    let apiPath = rankConfig.api;
    const url = `https://www.nmc.cn/rest/realrank/${apiPath}/${time}`;

    document.getElementById('rankDataContainer').innerHTML =
      '<div style="text-align:center;padding:2rem;"><span class="loading-spinner"></span>加载中...</div>';

    try {
      const res = await fetch(url);
      const result = await res.json();
      if (result.code === 0 && result.data) {
        this.renderRankData(result.data, rankConfig, type, time);
      } else {
        document.getElementById('rankDataContainer').innerHTML =
          '<div style="text-align:center;padding:2rem;">未获取到数据</div>';
      }
    } catch (e) {
      document.getElementById('rankDataContainer').innerHTML =
        '<div style="text-align:center;padding:2rem;">网络错误</div>';
    }
  },

  renderRankData(data, config, type, time) {
    const list = data.data || [];
    const timeStr = data.format_time || data.time || '';

    // 查找默认城市排名
    const app = this;
    const station = app.currentWeatherData?.real?.station || app.currentWeatherData?.predict?.station || {};
    const cityName = station.city || '';
    const cityRank = cityName ? list.findIndex(item => item.name === cityName) : -1;

    let html = `<div style="margin-bottom:1rem;font-weight:600;">📅 ${timeStr} · ${config.label}</div>`;

    // 显示默认城市排名
    if (cityName && cityRank >= 0) {
      html += `<div style="padding:0.5rem 1rem;background:rgba(59,130,246,0.1);border-radius:1rem;margin-bottom:0.8rem;font-weight:600;">
        📍 ${cityName} 排名: <span style="color:#3b82f6;">第${cityRank + 1}名</span> (${list[cityRank].value} ${config.unit})
      </div>`;
    } else if (cityName) {
      html += `<div style="padding:0.5rem 1rem;background:rgba(148,163,184,0.1);border-radius:1rem;margin-bottom:0.8rem;color:#888;">
        📍 ${cityName} 未进入前10名
      </div>`;
    }

    if (!list.length) {
      html += '<div style="text-align:center;padding:1rem;">暂无数据</div>';
    } else {
      html += '<div style="display:flex;flex-direction:column;gap:0.4rem;">';
      list.forEach((item, i) => {
        const rankColor = i < 3 ? ['#fbbf24', '#94a3b8', '#cd853f'][i] : '#64748b';
        const valueColor = this.getTempColor(item.value);
        const isCurrentCity = item.name === cityName;
        html += `
          <div style="display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0.8rem;background:${isCurrentCity ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.5)'};border-radius:1rem;${isCurrentCity ? 'border:1px solid rgba(59,130,246,0.3);' : ''}">
            <span style="font-weight:700;color:${rankColor};min-width:24px;text-align:center;">${i + 1}</span>
            <span style="flex:1;${isCurrentCity ? 'font-weight:600;' : ''}">${item.pname} · ${item.name}${isCurrentCity ? ' ⭐' : ''}</span>
            <span style="font-weight:700;color:${valueColor};font-size:1.05rem;">${item.value} ${config.unit}</span>
          </div>
        `;
      });
      html += '</div>';
    }

    // 查看全部数据按钮
    if (type === 'maxtemp_1h') {
      html += `
        <div style="text-align:center;margin-top:1rem;">
          <button onclick="window.weatherApp.showAllTemperature('${time}')" 
            style="padding:0.5rem 1.5rem;border-radius:2rem;background:#3b82f6;color:white;border:none;cursor:pointer;font-weight:600;">
            📋 查看全部逐小时气温数据
          </button>
        </div>`;
    }
    if (type === 'maxtemp_24h') {
      const ymd = time.slice(0, 8);
      html += `
        <div style="text-align:center;margin-top:1rem;">
          <button onclick="window.weatherApp.showAllMaxTemperature('${ymd}')" 
            style="padding:0.5rem 1.5rem;border-radius:2rem;background:#ef4444;color:white;border:none;cursor:pointer;font-weight:600;">
            📋 查看全部24小时最高气温数据
          </button>
        </div>`;
    }
    if (type === 'mintemp_24h') {
      const ymd = time.slice(0, 8);
      html += `
        <div style="text-align:center;margin-top:1rem;">
          <button onclick="window.weatherApp.showAllMinTemperature('${ymd}')" 
            style="padding:0.5rem 1.5rem;border-radius:2rem;background:#3b82f6;color:white;border:none;cursor:pointer;font-weight:600;">
            📋 查看全部24小时最低气温数据
          </button>
        </div>`;
    }

    document.getElementById('rankDataContainer').innerHTML = html;
  },

  // 查看全部逐小时气温
  async showAllTemperature(ymdh) {
    const app = this;
    const modal = document.getElementById('warnModal');
    const content = document.getElementById('warnModalContent');

    content.innerHTML = '<div style="text-align:center;padding:2rem;"><span class="loading-spinner"></span>加载全部数据...</div>';

    try {
      const url = `https://www.nmc.cn/rest/wxapi/getTemperature?ymdh=${ymdh}&type=ET1`;
      const res = await fetch(url);
      const result = await res.json();

      if (result.code === 0 && result.data) {
        const allData = result.data.stations || [];
        const cityName = app.currentWeatherData?.real?.station?.city || '';

        let html = `<h3>📋 全部逐小时气温数据</h3>`;
        html += `<div style="margin:0.5rem 0;color:#888;">${result.data.formatTime || ''}</div>`;

        // 搜索过滤
        html += `<input type="text" id="allDataSearch" placeholder="搜索城市..." 
          oninput="window.weatherApp.filterAllData()" 
          style="width:100%;padding:0.6rem 1rem;border-radius:2rem;border:1px solid #cbd5e1;margin:0.5rem 0;background:rgba(255,255,255,0.8);">`;

        html += `<div id="allDataList" style="max-height:55vh;overflow-y:auto;display:flex;flex-direction:column;gap:0.4rem;">`;
        allData.forEach((item, i) => {
          const prov = item[0] || '';
          const name = item[1] || '';
          const value = item[5] || '--';
          const isCurrent = name === cityName;
          const vColor = app.getTempColor(value);
          html += `
            <div class="all-data-item" data-search="${prov} ${name}" style="display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0.8rem;background:${isCurrent ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.5)'};border-radius:1rem;${isCurrent ? 'border:1px solid rgba(59,130,246,0.3);' : ''}">
              <span style="min-width:30px;color:#888;">${i + 1}</span>
              <span style="flex:1;${isCurrent ? 'font-weight:600;' : ''}">${prov} · ${name}${isCurrent ? ' ⭐' : ''}</span>
              <span style="font-weight:700;color:${vColor};">${value}°C</span>
            </div>`;
        });
        html += '</div>';

        content.innerHTML = html;
      }
    } catch (e) {
      content.innerHTML = '<div style="text-align:center;padding:2rem;">加载失败</div>';
    }
  },

  // 查看全部24小时最高气温
  async showAllMaxTemperature(ymd) {
    const app = this;
    const content = document.getElementById('warnModalContent');

    content.innerHTML = '<div style="text-align:center;padding:2rem;"><span class="loading-spinner"></span>加载全部数据...</div>';

    try {
      const url = `https://www.nmc.cn/rest/wxapi/getMaxTemperature?ymd=${ymd}`;
      const res = await fetch(url);
      const result = await res.json();

      if (result.code === 0 && result.data) {
        const allData = result.data.stations || [];
        const cityName = app.currentWeatherData?.real?.station?.city || '';

        let html = `<h3>📋 全部24小时最高气温数据</h3>`;
        html += `<div style="margin:0.5rem 0;color:#888;">${ymd}</div>`;
        html += `<input type="text" id="allDataSearch" placeholder="搜索城市..." 
          oninput="window.weatherApp.filterAllData()" 
          style="width:100%;padding:0.6rem 1rem;border-radius:2rem;border:1px solid #cbd5e1;margin:0.5rem 0;background:rgba(255,255,255,0.8);">`;
        html += `<div id="allDataList" style="max-height:55vh;overflow-y:auto;display:flex;flex-direction:column;gap:0.4rem;">`;
        allData.forEach((item, i) => {
          const prov = item[0] || '';
          const name = item[1] || '';
          const value = item[5] || '--';
          const isCurrent = name === cityName;
          const vColor = app.getTempColor(value);
          html += `
            <div class="all-data-item" data-search="${prov} ${name}" style="display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0.8rem;background:${isCurrent ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.5)'};border-radius:1rem;${isCurrent ? 'border:1px solid rgba(239,68,68,0.3);' : ''}">
              <span style="min-width:30px;color:#888;">${i + 1}</span>
              <span style="flex:1;${isCurrent ? 'font-weight:600;' : ''}">${prov} · ${name}${isCurrent ? ' ⭐' : ''}</span>
              <span style="font-weight:700;color:${vColor};">${value}°C</span>
            </div>`;
        });
        html += '</div>';
        content.innerHTML = html;
      }
    } catch (e) {
      content.innerHTML = '<div style="text-align:center;padding:2rem;">加载失败</div>';
    }
  },

  // 查看全部24小时最低气温
  async showAllMinTemperature(ymd) {
    const app = this;
    const content = document.getElementById('warnModalContent');

    content.innerHTML = '<div style="text-align:center;padding:2rem;"><span class="loading-spinner"></span>加载全部数据...</div>';

    try {
      const url = `https://www.nmc.cn/rest/wxapi/getMinTemperature?ymd=${ymd}`;
      const res = await fetch(url);
      const result = await res.json();

      if (result.code === 0 && result.data) {
        const allData = result.data.stations || [];
        const cityName = app.currentWeatherData?.real?.station?.city || '';

        let html = `<h3>📋 全部24小时最低气温数据</h3>`;
        html += `<div style="margin:0.5rem 0;color:#888;">${ymd}</div>`;
        html += `<input type="text" id="allDataSearch" placeholder="搜索城市..." 
          oninput="window.weatherApp.filterAllData()" 
          style="width:100%;padding:0.6rem 1rem;border-radius:2rem;border:1px solid #cbd5e1;margin:0.5rem 0;background:rgba(255,255,255,0.8);">`;
        html += `<div id="allDataList" style="max-height:55vh;overflow-y:auto;display:flex;flex-direction:column;gap:0.4rem;">`;
        allData.forEach((item, i) => {
          const prov = item[0] || '';
          const name = item[1] || '';
          const value = item[5] || '--';
          const isCurrent = name === cityName;
          const vColor = app.getTempColor(value);
          html += `
            <div class="all-data-item" data-search="${prov} ${name}" style="display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0.8rem;background:${isCurrent ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.5)'};border-radius:1rem;${isCurrent ? 'border:1px solid rgba(59,130,246,0.3);' : ''}">
              <span style="min-width:30px;color:#888;">${i + 1}</span>
              <span style="flex:1;${isCurrent ? 'font-weight:600;' : ''}">${prov} · ${name}${isCurrent ? ' ⭐' : ''}</span>
              <span style="font-weight:700;color:${vColor};">${value}°C</span>
            </div>`;
        });
        html += '</div>';
        content.innerHTML = html;
      }
    } catch (e) {
      content.innerHTML = '<div style="text-align:center;padding:2rem;">加载失败</div>';
    }
  },

  // 过滤全部数据列表
  filterAllData() {
    const searchInput = document.getElementById('allDataSearch');
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    const items = document.querySelectorAll('.all-data-item');
    items.forEach(item => {
      const searchData = (item.getAttribute('data-search') || '').toLowerCase();
      item.style.display = query === '' || searchData.includes(query) ? 'flex' : 'none';
    });
  },

  renderWeather(data) {
    const app = window.weatherApp;
    const real = data.real || {};
    const predict = data.predict || {};
    const station = real.station || predict.station || {};
    const weather = real.weather || {};
    const wind = real.wind || {};
    const warn = real.warn;
    const sunrise = real.sunriseSunset;
    const detail = predict.detail || [];
    const air = data.air || {};
    const passedchart = data.passedchart || [];
    const tempchart = data.tempchart || [];
    const climate = data.climate;
    const radar = data.radar;

    let html = '<div class="weather-panel">';
    html += `<div class="station-header"><strong style="font-size:1.4rem;">📍 ${station.province || ''} ${station.city || ''}</strong>`;
    html += `<div><span style="opacity:0.7;margin-right:1rem;">${real.publish_time || ''}</span><button class="default-btn" onclick="window.weatherApp.setDefaultStation()">⭐设为默认</button></div>`;
    html += '</div>';

    const temp = weather.temperature;
    const tempColor = app.getTempColor(temp);
    html += `<div class="temp-color-bar"></div>`;

    html += '<div class="real-time-card">';
    html += '<div class="temp-main">';
    html += `<span class="temp-display" style="color:${tempColor};">${app.isValid(temp) ? temp + '°' : '--'}</span>`;
    html += '<div class="weather-summary">';
    html += `<span class="info">${app.isValid(weather.info) ? weather.info : '--'}</span>`;
    if (app.isValid(weather.feelst)) html += `<span class="feel">体感 ${weather.feelst}°</span>`;
    html += '</div>';
    html += '</div>';
    html += '<div class="real-meta">';
    if (app.isValid(weather.humidity)) html += `<span>💧 ${weather.humidity}%</span>`;
    if (app.isValid(wind.direct)) html += `<span>🌬️ ${wind.direct} ${app.isValid(wind.power) ? wind.power : ''}</span>`;
    if (app.isValid(weather.rain)) html += `<span>🌧️ ${weather.rain}mm</span>`;
    if (app.isValid(weather.temperatureDiff)) html += `<span>📉 ${weather.temperatureDiff}°</span>`;
    if (air && app.isValid(air.text) && app.isValid(air.aqi)) {
      const aqiColor = app.getAQIColor(air.aqi);
      html += `<span>🌫️ 空气 <strong style="color:${aqiColor};">${air.text}</strong> AQI:${air.aqi}</span>`;
    }
    html += '</div>';
    html += '</div>';

    html += '<div class="detail-grid">';
    if (app.isValid(weather.airpressure)) html += `<div>🌀气压 ${weather.airpressure}hPa</div>`;
    html += '</div>';

    if (warn && app.isValid(warn.signaltype)) {
      html += `<div class="warn-box" onclick="window.weatherApp.showWarnDetail()">`;
      if (app.isValid(warn.pic)) {
        html += `<img src="${warn.pic}" onerror="this.style.display='none'" alt="预警图标">`;
      }
      html += `<div><strong>⚠️${warn.signaltype}${app.isValid(warn.signallevel) ? ' ' + warn.signallevel : ''}预警</strong> - 点击查看详情</div>`;
      html += `</div>`;
    }

    if (radar && app.isValid(radar.image)) {
      html += `<div style="margin:0.5rem 0;"><span class="radar-btn" onclick="window.weatherApp.showRadarModal()">📡 查看雷达图 - ${radar.title || ''}</span></div>`;
    }

    if (detail.length) {
      html += '<div class="section-title">📅 七天预报</div>';
      html += '<div class="forecast-scroll">';
      detail.forEach(d => {
        const dObj = d.date ? new Date(d.date) : null;
        const dateStr = dObj ? `${dObj.getMonth() + 1}/${dObj.getDate()}` : d.date;
        const dayInfo = d.day?.weather?.info;
        const high = d.day?.weather?.temperature;
        const low = d.night?.weather?.temperature;
        const showDayInfo = app.isValid(dayInfo) ? dayInfo : '';
        const showHigh = app.isValid(high) ? high : null;
        const hColor = showHigh ? app.getTempColor(showHigh) : '#888';
        const lColor = app.getTempColor(low);
        html += `<div class="forecast-day">
          <div><strong>${dateStr}</strong></div>
          <div>${showDayInfo || '--'}</div>
          <div>${showHigh ? `<span style="color:${hColor};font-weight:700;font-size:1.1rem;">${showHigh}°</span>` : '--'} <span style="color:${lColor};font-weight:600;">${app.isValid(low) ? low + '°' : '--'}</span></div>
          <div style="font-size:0.8rem;">🌙${app.isValid(d.night?.weather?.info) ? d.night.weather.info : '--'}</div>
        </div>`;
      });
      html += '</div>';
    }

    if (sunrise && (app.isValid(sunrise.sunrise) || app.isValid(sunrise.sunset))) {
      html += '<div class="section-title">🌅 日出日落</div>';
      html += '<div class="sunrise-box">';
      if (app.isValid(sunrise.sunrise)) html += `<span>🌅 日出 ${sunrise.sunrise.split(' ')[1] || sunrise.sunrise}</span>`;
      if (app.isValid(sunrise.sunset)) html += `<span>🌇 日落 ${sunrise.sunset.split(' ')[1] || sunrise.sunset}</span>`;
      html += '</div>';
    }

    if (tempchart.length > 0) {
      html += '<div class="section-title">📈 14天温度预报趋势</div>';
      html += '<div class="chart-container"><canvas id="forecastChart"></canvas></div>';
    }

    if (passedchart.length > 0) {
      html += '<div class="section-title">📉 24小时实况曲线</div>';
      html += '<div class="chart-container"><canvas id="tempChart"></canvas></div>';
    }

    if (climate && climate.month && climate.month.length > 0) {
      html += '<div class="section-title">📊 月平均气温与降水</div>';
      html += '<div class="chart-container"><canvas id="climateChart"></canvas></div>';
    }

    html += '</div>';
    document.getElementById('weatherContainer').innerHTML = html;

    setTimeout(() => {
      if (tempchart.length > 0) {
        const ctx0 = document.getElementById('forecastChart');
        if (ctx0) {
          if (app.forecastChart) app.forecastChart.destroy();
          const labels = tempchart.map(t => {
            const parts = (t.time || '').split('/');
            return parts.length === 3 ? `${parts[1]}/${parts[2]}` : t.time;
          });
          const maxTemps = tempchart.map(t => t.max_temp);
          const minTemps = tempchart.map(t => t.min_temp);

          app.forecastChart = new Chart(ctx0, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: '最高温 °C',
                data: maxTemps,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239,68,68,0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#ef4444',
                yAxisID: 'y',
              }, {
                label: '最低温 °C',
                data: minTemps,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59,130,246,0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6',
                yAxisID: 'y',
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                datalabels: {
                  anchor: 'end',
                  align: 'top',
                  offset: 4,
                  font: { weight: 'bold', size: 10 },
                  formatter: (value) => value + '°',
                  color: '#333',
                  display: true,
                }
              },
              scales: {
                y: { type: 'linear', position: 'left', title: { display: true, text: '温度 °C' } }
              }
            },
            plugins: [ChartDataLabels, {
              id: 'weatherLabels',
              afterDraw(chart) {
                const ctx = chart.ctx;
                const meta0 = chart.getDatasetMeta(0);
                if (!meta0 || !meta0.data) return;
                const tempchartData = tempchart;
                meta0.data.forEach((point, i) => {
                  const d = tempchartData[i];
                  if (!d) return;
                  const dayText = app.isValid(d.day_text) ? d.day_text : '';
                  const nightText = app.isValid(d.night_text) ? d.night_text : '';
                  const weatherText = dayText || nightText;
                  if (!weatherText) return;
                  const icon = app.getWeatherIcon(weatherText);
                  if (!icon) return;
                  const x = point.x;
                  const y = point.y - 28;
                  ctx.save();
                  ctx.font = '16px sans-serif';
                  ctx.textAlign = 'center';
                  ctx.fillText(icon, x, y);
                  ctx.restore();
                });
              }
            }]
          });
        }
      }

      if (passedchart.length > 0) {
        const ctx = document.getElementById('tempChart');
        if (ctx) {
          if (app.tempChart) app.tempChart.destroy();
          const reversed = [...passedchart].reverse();
          const labels = reversed.map(p => {
            const parts = (p.time || '').split(' ');
            return parts[1] || p.time;
          });
          const temps = reversed.map(p => p.temperature);
          const humidity = reversed.map(p => p.humidity);
          const pressure = reversed.map(p => p.pressure);
          const rain = reversed.map(p => p.rain1h);

          app.tempChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: '降水 mm',
                data: rain,
                backgroundColor: 'rgba(168,85,247,0.5)',
                borderColor: '#a855f7',
                yAxisID: 'y3',
                order: 1,
                barPercentage: 0.6,
              }, {
                label: '温度 °C',
                data: temps,
                type: 'line',
                borderColor: '#f97316',
                backgroundColor: 'rgba(249,115,22,0.05)',
                yAxisID: 'y',
                tension: 0.3,
                pointRadius: 1,
                order: 0,
                fill: false,
              }, {
                label: '湿度 %',
                data: humidity,
                type: 'line',
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                yAxisID: 'y1',
                tension: 0.3,
                pointRadius: 1,
                borderDash: [4, 3],
                order: 0,
                fill: false,
              }, {
                label: '气压 hPa',
                data: pressure,
                type: 'line',
                borderColor: '#22c55e',
                backgroundColor: 'transparent',
                yAxisID: 'y2',
                tension: 0.3,
                pointRadius: 1,
                borderDash: [2, 2],
                order: 0,
                fill: false,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: 'index', intersect: false },
              plugins: { legend: { position: 'top' } },
              scales: {
                y: { type: 'linear', position: 'left', title: { display: true, text: '温度 °C' } },
                y1: { type: 'linear', position: 'right', title: { display: true, text: '湿度 %' }, grid: { drawOnChartArea: false }, min: 0, max: 100 },
                y2: { type: 'linear', position: 'right', title: { display: true, text: '气压 hPa' }, grid: { drawOnChartArea: false } },
                y3: { type: 'linear', position: 'right', title: { display: true, text: '降水 mm' }, grid: { drawOnChartArea: false } }
              }
            }
          });
        }
      }

      if (climate && climate.month && climate.month.length > 0) {
        const ctx2 = document.getElementById('climateChart');
        if (ctx2) {
          if (app.climateChart) app.climateChart.destroy();
          const months = climate.month.map(m => `${m.month}月`);
          const maxTemps = climate.month.map(m => m.maxTemp);
          const minTemps = climate.month.map(m => m.minTemp);
          const precip = climate.month.map(m => m.precipitation);

          app.climateChart = new Chart(ctx2, {
            type: 'bar',
            data: {
              labels: months,
              datasets: [{
                label: '降水量 mm',
                data: precip,
                backgroundColor: '#60a5fa',
                yAxisID: 'y1',
                order: 1,
                barPercentage: 0.6,
              }, {
                label: '最高温 °C',
                data: maxTemps,
                type: 'line',
                borderColor: '#ef4444',
                backgroundColor: 'transparent',
                yAxisID: 'y',
                order: 0,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#ef4444'
              }, {
                label: '最低温 °C',
                data: minTemps,
                type: 'line',
                borderColor: '#3b82f6',
                backgroundColor: 'transparent',
                yAxisID: 'y',
                order: 0,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                datalabels: {
                  anchor: 'end',
                  align: 'top',
                  offset: 2,
                  font: { weight: 'bold', size: 10 },
                  formatter: (value, context) => {
                    if (context.dataset.label.includes('温')) return value + '°';
                    if (context.dataset.label.includes('降水')) return value + 'mm';
                    return value;
                  },
                  color: '#444'
                }
              },
              scales: {
                y: { type: 'linear', position: 'left', title: { display: true, text: '温度 °C' } },
                y1: { type: 'linear', position: 'right', title: { display: true, text: '降水 mm' }, grid: { drawOnChartArea: false } }
              }
            },
            plugins: [ChartDataLabels]
          });
        }
      }
    }, 200);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const app = window.weatherApp;
  const provinceSelect = document.getElementById('provinceSelect');
  const stationSelect = document.getElementById('stationSelect');
  const citySearch = document.getElementById('citySearch');
  const searchResults = document.getElementById('searchResults');

  let searchTimer = null;

  document.getElementById('warnModal').addEventListener('click', function (e) {
    if (e.target === this) app.closeWarnModal();
  });
  document.getElementById('radarModal').addEventListener('click', function (e) {
    if (e.target === this) app.closeRadarModal();
  });

  fetch(app.API_PROVINCE)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        provinceSelect.innerHTML = '<option value="">-- 选择省份 --</option>';
        data.forEach(p => {
          const opt = document.createElement('option');
          opt.value = p.code;
          opt.textContent = p.name;
          provinceSelect.appendChild(opt);
        });
      }
    });

  provinceSelect.addEventListener('change', function () {
    if (this.value) {
      stationSelect.innerHTML = '<option value="">加载中...</option>';
      stationSelect.disabled = true;
      fetch(app.API_STATION(this.value))
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length) {
            stationSelect.innerHTML = '<option value="">-- 选择城市 --</option>';
            data.forEach(s => {
              const opt = document.createElement('option');
              opt.value = s.code;
              opt.textContent = s.city || s.name;
              stationSelect.appendChild(opt);
            });
            stationSelect.disabled = false;
          }
        });
    } else {
      stationSelect.innerHTML = '<option value="">-- 请先选择省份 --</option>';
      stationSelect.disabled = true;
    }
  });

  stationSelect.addEventListener('change', function () {
    if (this.value) app.fetchWeather(this.value);
  });

  citySearch.addEventListener('input', function () {
    clearTimeout(searchTimer);
    const q = this.value.trim();
    if (!q) {
      searchResults.style.display = 'none';
      return;
    }
    searchTimer = setTimeout(() => {
      fetch(app.API_SEARCH(q))
        .then(res => res.json())
        .then(result => {
          if (result.code === 0 && Array.isArray(result.data)) {
            searchResults.innerHTML = '';
            result.data.forEach(item => {
              const parts = item.split('|');
              if (parts.length >= 3) {
                const li = document.createElement('li');
                li.textContent = `${parts[1]} · ${parts[2]}`;
                li.addEventListener('click', () => {
                  searchResults.style.display = 'none';
                  citySearch.value = '';
                  app.fetchWeather(parts[0]);
                });
                searchResults.appendChild(li);
              }
            });
            searchResults.style.display = 'block';
          }
        });
    }, 300);
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-wrapper')) searchResults.style.display = 'none';
  });

  const defaultCode = localStorage.getItem('defaultStationCode');
  if (defaultCode) {
    app.fetchWeather(defaultCode);
  }
});