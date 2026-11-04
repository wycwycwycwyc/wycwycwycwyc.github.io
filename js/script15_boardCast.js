// ============================================================
// 广播展示扩展 - 完整版
// 功能：根据设置决定是否自动弹出、向外部提供拉取和展示接口、HTML广播工具栏
// ============================================================
(function() {
    'use strict';

    var STORAGE_KEY = 'broadcast_shown_ids';
    var SETTINGS_KEY = 'broadcast_push_settings';

    // ============================================================
    // 获取推送设置
    // ============================================================
    function getPushSettings() {
        var defaultSettings = { enabled: true, mode: 'active' };
        try {
            var saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) {
                var parsed = JSON.parse(saved);
                return {
                    enabled: parsed.enabled !== undefined ? parsed.enabled : true,
                    mode: parsed.mode || 'active'
                };
            }
        } catch (e) {
            console.warn('[Broadcast] 读取设置失败', e);
        }
        return defaultSettings;
    }

    // ============================================================
    // 检测是否处于预览模式
    // ============================================================
    function isPreviewMode() {
        try {
            var urlParams = new URLSearchParams(window.location.search);
            return urlParams.has('preview');
        } catch (e) {
            return false;
        }
    }

    // ============================================================
    // 获取当前用户ID
    // ============================================================
    function getCurrentUserId() {
        return localStorage.getItem('userid') || '';
    }

    // ============================================================
    // 已展示广播ID管理
    // ============================================================
    function getShownBroadcastIds() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                var parsed = JSON.parse(data);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {}
        return [];
    }

    function saveShownBroadcastIds(ids) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch (e) {}
    }

    function addShownBroadcastId(id) {
        var ids = getShownBroadcastIds();
        if (ids.indexOf(id) === -1) { ids.push(id); saveShownBroadcastIds(ids); }
    }

    function removeShownBroadcastId(id) {
        var ids = getShownBroadcastIds();
        var index = ids.indexOf(id);
        if (index !== -1) { ids.splice(index, 1); saveShownBroadcastIds(ids); }
    }

    function cleanShownBroadcastIds(activeBroadcasts) {
        var activeIds = activeBroadcasts.map(function(b) { return b.broadcastId; });
        var shownIds = getShownBroadcastIds();
        var newShownIds = shownIds.filter(function(id) { return activeIds.indexOf(id) !== -1; });
        if (newShownIds.length !== shownIds.length) saveShownBroadcastIds(newShownIds);
    }

    // ============================================================
    // 获取广播列表
    // ============================================================
    function fetchBroadcasts() {
        var userId = getCurrentUserId();
        var url = serverurl + '/broadcast/list';
        if (userId) url += '?userId=' + encodeURIComponent(userId);

        return fetch(url)
            .then(function(res) {
                if (!res.ok) throw new Error('网络请求失败: ' + res.status);
                return res.json();
            })
            .then(function(data) {
                if (data.success) return data.data || [];
                throw new Error(data.message || '获取广播失败');
            });
    }

    // ============================================================
    // 检查并自动展示广播
    // ============================================================
    function checkAndDisplayBroadcasts() {
        if (isPreviewMode()) return;
        var settings = getPushSettings();
        if (!settings.enabled || settings.mode === 'passive') return;
        if (typeof serverurl === 'undefined') return;

        fetchBroadcasts().then(function(broadcasts) {
            if (!broadcasts || broadcasts.length === 0) return;
            cleanShownBroadcastIds(broadcasts);

            var shownIds = getShownBroadcastIds();
            var toShow = [];

            broadcasts.forEach(function(b) {
                var isShown = shownIds.indexOf(b.broadcastId) !== -1;
                if (b.displayCount === 'always') {
                    if (isShown) removeShownBroadcastId(b.broadcastId);
                    toShow.push(b);
                } else if (b.displayCount === 'once' && !isShown) {
                    toShow.push(b);
                }
            });

            if (toShow.length === 0) return;

            toShow.sort(function(a, b) {
                if (a.createdAt && b.createdAt) return b.createdAt.localeCompare(a.createdAt);
                return b.broadcastId.localeCompare(a.broadcastId);
            });

            showBroadcastsSequentially(toShow);
        }).catch(function(e) {
            console.warn('[Broadcast] 获取广播失败:', e.message);
        });
    }

    // ============================================================
    // 顺序展示广播
    // ============================================================
    function showBroadcastsSequentially(broadcasts) {
        if (!broadcasts || broadcasts.length === 0) return;
        var index = 0;

        function showNext() {
            if (index >= broadcasts.length) return;
            var b = broadcasts[index];
            var shownIds = getShownBroadcastIds();

            if (shownIds.indexOf(b.broadcastId) !== -1) {
                if (b.displayCount === 'always') {
                    removeShownBroadcastId(b.broadcastId);
                } else {
                    index++; showNext(); return;
                }
            }

            displayBroadcast(b);

            if (b.type === 'html') {
                var check = setInterval(function() {
                    if (!document.getElementById('broadcast-overlay')) {
                        clearInterval(check); index++; setTimeout(showNext, 300);
                    }
                }, 200);
            } else {
                var check = setInterval(function() {
                    if (!document.querySelector('.swal2-container')) {
                        clearInterval(check); index++; setTimeout(showNext, 300);
                    }
                }, 200);
            }
        }
        setTimeout(showNext, 500);
    }

    // ============================================================
    // 展示单条广播
    // ============================================================
    function displayBroadcast(broadcast) {
        if (broadcast.displayCount === 'once') addShownBroadcastId(broadcast.broadcastId);
        if (broadcast.type === 'html') displayHtmlBroadcast(broadcast);
        else displayTextBroadcast(broadcast);
    }

    // ============================================================
    // 展示文本广播
    // ============================================================
    function displayTextBroadcast(broadcast) {
        if (typeof Swal === 'undefined') {
            alert('【' + broadcast.title + '】\n\n' + broadcast.content);
            return;
        }
        Swal.fire({
            title: broadcast.title || '广播通知',
            text: broadcast.content || '',
            icon: 'info',
            confirmButtonText: '知道了',
            allowOutsideClick: false
        });
    }

    // ============================================================
    // 展示HTML广播（工具栏包含全屏切换、隐藏标题栏、关闭）
    // ============================================================
    function displayHtmlBroadcast(broadcast) {
        var overlay = document.createElement('div');
        overlay.id = 'broadcast-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);z-index:99999;display:flex;justify-content:center;align-items:center;animation:broadcastFadeIn 0.3s ease-out';

        var container = document.createElement('div');
        container.id = 'broadcast-container';
        container.style.cssText = 'position:relative;width:80%;height:80%;max-width:80vw;max-height:80vh;background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);overflow:hidden;animation:broadcastSlideUp 0.3s ease-out;display:flex;flex-direction:column;transition:all 0.3s';

        // 工具栏
        var toolbar = document.createElement('div');
        toolbar.id = 'broadcast-toolbar';
        toolbar.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 15px;background:#f5f5f5;border-bottom:1px solid #e0e0e0;z-index:10;flex-shrink:0;transition:all 0.3s;height:44px;box-sizing:border-box;';

        // 标题（左侧）
        var title = document.createElement('span');
        title.textContent = broadcast.title || '广播通知';
        title.style.cssText = 'font-weight:bold;font-size:16px;color:#333;flex:1;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';

        // 右侧控制按钮
        var rightControls = document.createElement('div');
        rightControls.style.cssText = 'display:flex;gap:12px;align-items:center';

        // 隐藏标题栏按钮 (向上箭头)
        var hideBarBtn = document.createElement('button');
        hideBarBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        hideBarBtn.style.cssText = 'background:none;border:none;cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;color:#333;border-radius:4px;transition:background 0.2s';
        hideBarBtn.onmouseover = function() { this.style.background = '#e0e0e0'; };
        hideBarBtn.onmouseout = function() { this.style.background = 'none'; };
        
        // 全屏/缩小按钮 (四个角)
        var fullBtn = document.createElement('button');
        fullBtn.style.cssText = 'background:none;border:none;cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;color:#333;border-radius:4px;transition:background 0.2s';
        fullBtn.onmouseover = function() { this.style.background = '#e0e0e0'; };
        fullBtn.onmouseout = function() { this.style.background = 'none'; };
        
        var iconFull = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>';
        var iconMinimize = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>';
        
        fullBtn.innerHTML = iconFull;
        var isFull = false;
        fullBtn.onclick = function() {
            isFull = !isFull;
            if (isFull) {
                container.style.width = '100vw'; container.style.height = '100vh';
                container.style.maxWidth = '100vw'; container.style.maxHeight = '100vh';
                container.style.borderRadius = '0';
                fullBtn.innerHTML = iconMinimize;
            } else {
                container.style.width = '80%'; container.style.height = '80%';
                container.style.maxWidth = '80vw'; container.style.maxHeight = '80vh';
                container.style.borderRadius = '12px';
                fullBtn.innerHTML = iconFull;
            }
        };

        // 关闭按钮
        var closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        closeBtn.style.cssText = 'background:none;border:none;cursor:pointer;padding:4px;display:flex;align-items:center;justify-content:center;color:#666;border-radius:4px;transition:background 0.2s';
        closeBtn.onmouseover = function() { this.style.background = '#e0e0e0'; };
        closeBtn.onmouseout = function() { this.style.background = 'none'; };
        closeBtn.onclick = function() { if (document.body.contains(overlay)) document.body.removeChild(overlay); };

        rightControls.appendChild(hideBarBtn);
        rightControls.appendChild(fullBtn);
        rightControls.appendChild(closeBtn);
        toolbar.appendChild(title);
        toolbar.appendChild(rightControls);

        // 内容区
        var iframeWrapper = document.createElement('div');
        iframeWrapper.id = 'broadcast-iframe-wrapper';
        iframeWrapper.style.cssText = 'flex:1;position:relative;overflow:hidden;background:#fff;transition:all 0.3s;';

        var loading = document.createElement('div');
        loading.id = 'broadcast-loading';
        loading.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1;font-size:18px;color:#666;text-align:center;pointer-events:none';
        loading.innerHTML = '⏳ 正在加载内容...';

        var iframe = document.createElement('iframe');
        iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;position:relative;z-index:2';
        iframe.srcdoc = broadcast.content || '';
        iframe.onload = function() { if (loading) loading.style.display = 'none'; };
        setTimeout(function() { if (loading) loading.style.display = 'none'; }, 3000);

        iframeWrapper.appendChild(loading);
        iframeWrapper.appendChild(iframe);
        container.appendChild(toolbar);
        container.appendChild(iframeWrapper);

        // 隐藏标题栏后的悬浮按钮（向下箭头）
        var showBarBtn = document.createElement('button');
        showBarBtn.id = 'broadcast-show-bar-btn';
        showBarBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
        showBarBtn.style.cssText = 'position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:15;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:20px;padding:4px 12px;cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.2s;';
        showBarBtn.onmouseover = function() { this.style.background = '#e0e0e0'; };
        showBarBtn.onmouseout = function() { this.style.background = '#f5f5f5'; };
        showBarBtn.onclick = function() {
            toolbar.style.display = 'flex';
            showBarBtn.style.display = 'none';
        };

        // 隐藏标题栏逻辑
        hideBarBtn.onclick = function() {
            toolbar.style.display = 'none';
            showBarBtn.style.display = 'flex';
        };

        container.appendChild(showBarBtn);
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay && document.body.contains(overlay)) document.body.removeChild(overlay);
        });

        if (!document.getElementById('broadcast-animations')) {
            var style = document.createElement('style');
            style.id = 'broadcast-animations';
            style.textContent = '@keyframes broadcastFadeIn{from{opacity:0}to{opacity:1}}@keyframes broadcastSlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}';
            document.head.appendChild(style);
        }
    }

    // ============================================================
    // 暴露接口供外部调用
    // ============================================================
    window.BroadcastExtension = {
        check: checkAndDisplayBroadcasts,
        fetchBroadcasts: fetchBroadcasts,
        displayBroadcast: displayBroadcast,
        getShownIds: getShownBroadcastIds,
        getPushSettings: getPushSettings,
        clearShownIds: function() {
            saveShownBroadcastIds([]);
            console.log('[Broadcast] 已清除所有展示记录');
        }
    };

    // ============================================================
    // 初始化
    // ============================================================
    function init() {
        if (typeof serverurl === 'undefined') return;
        if (isPreviewMode()) return;
        var settings = getPushSettings();
        if (!settings.enabled) return;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkAndDisplayBroadcasts);
        } else {
            checkAndDisplayBroadcasts();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();