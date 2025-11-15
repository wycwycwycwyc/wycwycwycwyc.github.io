document.addEventListener('DOMContentLoaded', function() {
    // 应用主题函数
    function applyTheme() {
        const followSystem = localStorage.getItem('followSystem');
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        
        // 如果跟随系统
        if (followSystem === 'true') {
            // 检测系统颜色偏好
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        } else {
            // 不跟随系统，使用用户手动设置
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    }
    
    // 初始化设置
    if (localStorage.getItem('followSystem') === null) {
        localStorage.setItem('followSystem', 'true');
    }
    
    // 初始应用主题
    applyTheme();
    
    // 监听storage事件，当followSystem或darkMode变化时
    window.addEventListener('storage', function(e) {
        if (e.key === 'followSystem' || e.key === 'darkMode') {
            applyTheme();
            
            // 如果从跟随系统变为不跟随，移除系统主题监听
            if (e.key === 'followSystem' && e.oldValue === 'true' && e.newValue !== 'true') {
                // 系统主题监听器会在下次applyTheme时不再生效
            }
            // 如果从不跟随系统变为跟随，重新应用系统主题
            else if (e.key === 'followSystem' && e.oldValue !== 'true' && e.newValue === 'true') {
                applyTheme();
                setupSystemThemeListener();
            }
        }
    });
    
    // 自定义事件监听，用于同一页面内的设置变化
    function setupLocalChangeListener() {
        // 重写localStorage的setItem方法，监听本页面的设置变化
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            const event = new Event('localStorageChanged');
            event.key = key;
            event.oldValue = localStorage.getItem(key);
            event.newValue = value;
            originalSetItem.apply(this, arguments);
            window.dispatchEvent(event);
        };
    }
    
    // 设置系统主题变化监听
    function setupSystemThemeListener() {
        if (window.matchMedia) {
            const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
            
            const systemThemeChangeHandler = function(e) {
                const currentFollowSystem = localStorage.getItem('followSystem');
                if (currentFollowSystem === 'true') {
                    if (e.matches) {
                        document.body.classList.add('dark-mode');
                    } else {
                        document.body.classList.remove('dark-mode');
                    }
                }
            };
            
            // 移除旧的监听器（如果有）
            systemThemeMedia.removeEventListener('change', systemThemeChangeHandler);
            // 添加新的监听器
            systemThemeMedia.addEventListener('change', systemThemeChangeHandler);
        }
    }
    
    // 初始化监听器
    setupLocalChangeListener();
    setupSystemThemeListener();
    
    // 监听本页面的localStorage变化
    window.addEventListener('localStorageChanged', function(e) {
        if (e.key === 'followSystem' || e.key === 'darkMode') {
            applyTheme();
            
            if (e.key === 'followSystem') {
                if (e.newValue === 'true') {
                    // 开始跟随系统，设置系统主题监听
                    setupSystemThemeListener();
                } else {
                    // 停止跟随系统，系统主题监听器会在下次applyTheme时不再生效
                }
            }
        }
    });
});