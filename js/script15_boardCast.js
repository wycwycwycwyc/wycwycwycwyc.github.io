// ============================================================
// 广播展示扩展 - broadcast-display.js
// 功能：页面加载时检查并展示广播
// 预览模式（?preview）下不请求广播
// ============================================================

(function() {
    'use strict';

    var STORAGE_KEY = 'broadcast_shown_ids';

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
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('[Broadcast] 读取已展示列表失败:', e);
        }
        return [];
    }

    function saveShownBroadcastIds(ids) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch (e) {
            console.warn('[Broadcast] 保存已展示列表失败:', e);
        }
    }

    function addShownBroadcastId(broadcastId) {
        var ids = getShownBroadcastIds();
        if (ids.indexOf(broadcastId) === -1) {
            ids.push(broadcastId);
            saveShownBroadcastIds(ids);
        }
    }

    function removeShownBroadcastId(broadcastId) {
        var ids = getShownBroadcastIds();
        var index = ids.indexOf(broadcastId);
        if (index !== -1) {
            ids.splice(index, 1);
            saveShownBroadcastIds(ids);
        }
    }

    function cleanShownBroadcastIds(activeBroadcasts) {
        var activeIds = activeBroadcasts.map(function(b) { return b.broadcastId; });
        var shownIds = getShownBroadcastIds();
        var newShownIds = shownIds.filter(function(id) {
            return activeIds.indexOf(id) !== -1;
        });
        if (newShownIds.length !== shownIds.length) {
            saveShownBroadcastIds(newShownIds);
        }
    }

    // ============================================================
    // 获取广播列表
    // ============================================================
    function fetchBroadcasts() {
        var userId = getCurrentUserId();
        var url = serverurl + '/broadcast/list';
        if (userId) {
            url += '?userId=' + encodeURIComponent(userId);
        }

        return fetch(url)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('网络请求失败: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    return data.data || [];
                } else {
                    throw new Error(data.message || '获取广播失败');
                }
            });
    }

    // ============================================================
    // 检查并展示广播
    // ============================================================
    function checkAndDisplayBroadcasts() {
        // 预览模式不请求广播
        if (isPreviewMode()) {
            console.log('[Broadcast] 预览模式，跳过广播请求');
            return;
        }

        if (typeof serverurl === 'undefined') {
            console.warn('[Broadcast] serverurl 未定义，跳过检查');
            return;
        }

        console.log('[Broadcast] 检查广播...');

        fetchBroadcasts()
            .then(function(broadcasts) {
                if (!broadcasts || broadcasts.length === 0) {
                    console.log('[Broadcast] 暂无广播');
                    return;
                }

                console.log('[Broadcast] 获取到 ' + broadcasts.length + ' 条广播');

                cleanShownBroadcastIds(broadcasts);

                var shownIds = getShownBroadcastIds();
                var toShow = [];

                broadcasts.forEach(function(broadcast) {
                    var isShown = shownIds.indexOf(broadcast.broadcastId) !== -1;

                    if (broadcast.displayCount === 'always') {
                        if (isShown) {
                            removeShownBroadcastId(broadcast.broadcastId);
                            console.log('[Broadcast] 永久广播，清除已展示记录:', broadcast.broadcastId);
                        }
                        toShow.push(broadcast);
                    } else if (broadcast.displayCount === 'once') {
                        if (!isShown) {
                            toShow.push(broadcast);
                        } else {
                            console.log('[Broadcast] 一次性广播已展示过，跳过:', broadcast.broadcastId);
                        }
                    }
                });

                if (toShow.length === 0) {
                    console.log('[Broadcast] 没有需要展示的广播');
                    return;
                }

                toShow.sort(function(a, b) {
                    if (a.createdAt && b.createdAt) {
                        return b.createdAt.localeCompare(a.createdAt);
                    }
                    return b.broadcastId.localeCompare(a.broadcastId);
                });

                showBroadcastsSequentially(toShow);
            })
            .catch(function(error) {
                console.warn('[Broadcast] 获取广播失败:', error.message);
            });
    }

    // ============================================================
    // 顺序展示广播
    // ============================================================
    function showBroadcastsSequentially(broadcasts) {
        if (!broadcasts || broadcasts.length === 0) {
            return;
        }

        var index = 0;

        function showNext() {
            if (index >= broadcasts.length) {
                console.log('[Broadcast] 所有广播已展示完毕');
                return;
            }

            var broadcast = broadcasts[index];
            var shownIds = getShownBroadcastIds();

            if (shownIds.indexOf(broadcast.broadcastId) !== -1) {
                if (broadcast.displayCount === 'always') {
                    removeShownBroadcastId(broadcast.broadcastId);
                } else {
                    index++;
                    showNext();
                    return;
                }
            }

            displayBroadcast(broadcast);

            if (broadcast.type === 'html') {
                var checkInterval = setInterval(function() {
                    var overlay = document.getElementById('broadcast-overlay');
                    if (!overlay) {
                        clearInterval(checkInterval);
                        index++;
                        setTimeout(showNext, 300);
                    }
                }, 200);
            } else {
                var swalCheck = setInterval(function() {
                    var swalContainer = document.querySelector('.swal2-container');
                    if (!swalContainer) {
                        clearInterval(swalCheck);
                        index++;
                        setTimeout(showNext, 300);
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
        console.log('[Broadcast] 展示广播:', broadcast.broadcastId, broadcast.title);

        if (broadcast.displayCount === 'once') {
            addShownBroadcastId(broadcast.broadcastId);
        }

        if (broadcast.type === 'html') {
            displayHtmlBroadcast(broadcast);
        } else {
            displayTextBroadcast(broadcast);
        }
    }

    // ============================================================
    // 展示文本广播（SweetAlert2）
    // ============================================================
    function displayTextBroadcast(broadcast) {
        if (typeof Swal === 'undefined') {
            console.warn('[Broadcast] SweetAlert2 未加载，使用 alert 替代');
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
    // 展示HTML广播（iframe弹窗）- 宽高80%
    // ============================================================
function displayHtmlBroadcast(broadcast) {
    var overlay = document.createElement('div');
    overlay.id = 'broadcast-overlay';
    overlay.style.cssText = [
        'position: fixed',
        'top: 0',
        'left: 0',
        'width: 100%',
        'height: 100%',
        'background: rgba(0,0,0,0.65)',
        'z-index: 99999',
        'display: flex',
        'justify-content: center',
        'align-items: center',
        'animation: broadcastFadeIn 0.3s ease-out'
    ].join(';');

    var container = document.createElement('div');
    container.style.cssText = [
        'position: relative',
        'width: 80%',
        'height: 80%',
        'max-width: 80vw',
        'max-height: 80vh',
        'background: #fff',
        'border-radius: 12px',
        'box-shadow: 0 20px 60px rgba(0,0,0,0.3)',
        'overflow: hidden',
        'animation: broadcastSlideUp 0.3s ease-out',
        'display: flex',
        'flex-direction: column'
    ].join(';');

    // ====== 加载提示 ======
    var loadingDiv = document.createElement('div');
    loadingDiv.id = 'broadcast-loading';
    loadingDiv.style.cssText = [
        'position: absolute',
        'top: 50%',
        'left: 50%',
        'transform: translate(-50%, -50%)',
        'z-index: 1',
        'font-size: 18px',
        'color: #666',
        'text-align: center',
        'pointer-events: none'
    ].join(';');
    loadingDiv.innerHTML = '⏳ 正在加载内容...';

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = [
        'position: absolute',
        'top: 10px',
        'right: 15px',
        'z-index: 10',
        'font-size: 28px',
        'font-weight: bold',
        'color: #999',
        'background: none',
        'border: none',
        'cursor: pointer',
        'transition: color 0.2s',
        'line-height: 1'
    ].join(';');
    closeBtn.onmouseover = function() { this.style.color = '#333'; };
    closeBtn.onmouseout = function() { this.style.color = '#999'; };
    closeBtn.onclick = function() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    };

    var iframe = document.createElement('iframe');
    iframe.style.cssText = [
        'width: 100%',
        'height: 100%',
        'border: none',
        'display: block',
        'flex: 1',
        'position: relative',
        'z-index: 2'
    ].join(';');
    iframe.srcdoc = broadcast.content || '';

    // iframe 加载完成后隐藏加载提示
    iframe.onload = function() {
        var loading = document.getElementById('broadcast-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    };

    // 如果内容为空或加载失败，隐藏加载提示
    setTimeout(function() {
        var loading = document.getElementById('broadcast-loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }, 3000);

    container.appendChild(loadingDiv);
    container.appendChild(closeBtn);
    container.appendChild(iframe);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay && document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    });

    if (!document.getElementById('broadcast-animations')) {
        var style = document.createElement('style');
        style.id = 'broadcast-animations';
        style.textContent = [
            '@keyframes broadcastFadeIn {',
            '  from { opacity: 0; }',
            '  to { opacity: 1; }',
            '}',
            '@keyframes broadcastSlideUp {',
            '  from { opacity: 0; transform: translateY(30px); }',
            '  to { opacity: 1; transform: translateY(0); }',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }
}

    // ============================================================
    // 初始化
    // ============================================================
    function init() {
        if (typeof serverurl === 'undefined') {
            console.warn('[Broadcast] serverurl 未定义，扩展将不会运行');
            return;
        }

        if (isPreviewMode()) {
            console.log('[Broadcast] 预览模式，广播扩展已禁用');
            return;
        }

        console.log('[Broadcast] 扩展已初始化, API: ' + serverurl);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                checkAndDisplayBroadcasts();
            });
        } else {
            checkAndDisplayBroadcasts();
        }

        window.BroadcastExtension = {
            check: checkAndDisplayBroadcasts,
            getShownIds: getShownBroadcastIds,
            clearShownIds: function() {
                saveShownBroadcastIds([]);
                console.log('[Broadcast] 已清除所有展示记录');
            }
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();