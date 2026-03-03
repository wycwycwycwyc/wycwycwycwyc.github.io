// auto-i18n-with-selector.js - 修复标题翻译问题

(function() {
    // 配置
    const STORAGE_KEY = 'preferredLang';
    const DEFAULT_LANG = 'auto'; // 'auto', 'zh', 'en'
    
    // 当前语言状态
    let currentLang = 'zh'; // 实际显示的语言
    let currentSetting = DEFAULT_LANG; // 存储的设置值（auto/zh/en）
    
    // 保存所有需要翻译的元素
    const i18nElements = new Map();
    
    // 初始化
// 应用语言
function applyLanguage(lang) {
    console.log(`Applying language: ${lang}`);
    
    // 更新所有已记录的元素
    i18nElements.forEach((content, el) => {
        // 检查元素是否还在DOM中
        if (!document.body.contains(el) && el.tagName !== 'TITLE') {
            i18nElements.delete(el);
            return;
        }
        
        applyLanguageToElement(el, content, lang);
    });
    
    // 处理动态添加的元素（原有代码保持不变）
    document.querySelectorAll('[data-en]').forEach(el => {
        if (!i18nElements.has(el)) {
            const content = { en: el.dataset.en };
            
            if (el.tagName === 'TITLE') {
                content.zh = el.textContent;
                content.isTitle = true;
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                content.zh = el.value;
                content.isInput = true;
            } else {
                content.zh = el.innerHTML;
            }
            
            i18nElements.set(el, content);
            applyLanguageToElement(el, content, lang);
        }
    });
    
    // 处理动态添加的placeholder元素
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        if (!i18nElements.has(el)) {
            i18nElements.set(el, {
                zhPlaceholder: el.placeholder,
                enPlaceholder: el.dataset.enPlaceholder
            });
            if (lang === 'en' && el.dataset.enPlaceholder) {
                el.placeholder = el.dataset.enPlaceholder;
            }
        }
    });
    
    // 处理动态添加的alt属性
    document.querySelectorAll('[data-en-alt]').forEach(el => {
        if (!i18nElements.has(el)) {
            i18nElements.set(el, {
                zhAlt: el.alt,
                enAlt: el.dataset.enAlt
            });
            if (lang === 'en' && el.dataset.enAlt) {
                el.alt = el.dataset.enAlt;
            }
        }
    });
    
    // 处理动态添加的value属性
    document.querySelectorAll('[data-en-value]').forEach(el => {
        if (!i18nElements.has(el)) {
            i18nElements.set(el, {
                zhValue: el.value,
                enValue: el.dataset.enValue
            });
            if (lang === 'en' && el.dataset.enValue) {
                el.value = el.dataset.enValue;
            }
        }
    });
    
    // 更新html标签的lang属性
    document.documentElement.lang = lang;
    
    // ===== 新增：设置 hCaptcha 语言 =====
    setHcaptchaLanguage(lang);
}

// 新增：设置 hCaptcha 语言的函数
function setHcaptchaLanguage(lang) {
    // 检查 hCaptcha 是否已加载
    if (typeof hcaptcha === 'undefined') return;
    
    // 根据语言设置 hCaptcha 的显示语言
    const hcaptchaLang = lang === 'zh' ? 'zh-CN' : 'en';
    
    // 方法1：通过配置重新渲染（如果hcaptcha已经渲染过）
    const hcaptchaElements = document.querySelectorAll('.h-captcha');
    if (hcaptchaElements.length > 0) {
        hcaptchaElements.forEach(el => {
            // 获取原有的data-sitekey
            const sitekey = el.getAttribute('data-sitekey');
            if (sitekey) {
                // 清空容器
                el.innerHTML = '';
                // 重新渲染hCaptcha，指定语言
                hcaptcha.render(el, {
                    sitekey: sitekey,
                    hl: hcaptchaLang // 设置语言
                });
            }
        });
    }
    
    // 方法2：设置全局语言（如果有这个API）
    if (hcaptcha.setLanguage) {
        hcaptcha.setLanguage(hcaptchaLang);
    }
    
    console.log(`hCaptcha language set to: ${hcaptchaLang}`);
}

// 修改初始化函数，在DOM加载完成后确保hCaptcha语言正确
    function init() {
        // 读取保存的设置
        loadSavedSetting();
        
        // 收集所有带有data-en属性的元素
        collectI18nElements();
        
        // 应用当前语言
        applyLanguage(currentLang);
        
        // 初始化语言选择下拉框
        initLanguageSelector();
        
        // 监听系统语言变化
        observeSystemLanguageChange();
        
        // 监听其他标签页的语言设置变化
        observeStorageChange();
        
        // 监听DOM变化
        observeDOMChanges();
        
        // ===== 新增：确保hCaptcha在页面完全加载后也应用语言 =====
        if (document.readyState === 'complete') {
            setHcaptchaLanguage(currentLang);
        } else {
            window.addEventListener('load', function() {
                setHcaptchaLanguage(currentLang);
            });
        }
    }
    
    // 读取保存的设置
    function loadSavedSetting() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && ['auto', 'zh', 'en'].includes(saved)) {
            currentSetting = saved;
        } else {
            currentSetting = DEFAULT_LANG;
            localStorage.setItem(STORAGE_KEY, DEFAULT_LANG);
        }
        
        // 根据设置确定实际显示的语言
        updateCurrentLangFromSetting();
    }
    
    // 根据设置更新实际语言
    function updateCurrentLangFromSetting() {
        const oldLang = currentLang;
        
        if (currentSetting === 'auto') {
            // 跟随系统：检测浏览器语言
            const browserLang = navigator.language || navigator.userLanguage;
            currentLang = browserLang.startsWith('zh') ? 'zh' : 'en';
        } else {
            // 手动选择
            currentLang = currentSetting;
        }
        
        // 如果语言真的变了，返回true
        return oldLang !== currentLang;
    }
    
    // 收集所有需要翻译的元素
    function collectI18nElements() {
        // 清空Map，重新收集
        i18nElements.clear();
        
        // 处理所有带有data-en的元素
        document.querySelectorAll('[data-en]').forEach(el => {
            const content = { zh: '', en: el.dataset.en };
            
            // 根据元素类型保存中文内容
            if (el.tagName === 'TITLE') {
                content.zh = el.textContent;
                content.isTitle = true;
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                content.zh = el.value;
                content.isInput = true;
            } else {
                content.zh = el.innerHTML;
            }
            
            i18nElements.set(el, content);
        });
        
        // 处理data-en-placeholder
        document.querySelectorAll('[data-en-placeholder]').forEach(el => {
            if (i18nElements.has(el)) {
                const content = i18nElements.get(el);
                content.zhPlaceholder = el.placeholder;
                content.enPlaceholder = el.dataset.enPlaceholder;
            } else {
                i18nElements.set(el, {
                    zhPlaceholder: el.placeholder,
                    enPlaceholder: el.dataset.enPlaceholder
                });
            }
        });
        
        // 处理data-en-alt
        document.querySelectorAll('[data-en-alt]').forEach(el => {
            if (i18nElements.has(el)) {
                const content = i18nElements.get(el);
                content.zhAlt = el.alt;
                content.enAlt = el.dataset.enAlt;
            } else {
                i18nElements.set(el, {
                    zhAlt: el.alt,
                    enAlt: el.dataset.enAlt
                });
            }
        });
        
        // 处理data-en-value
        document.querySelectorAll('[data-en-value]').forEach(el => {
            if (i18nElements.has(el)) {
                const content = i18nElements.get(el);
                content.zhValue = el.value;
                content.enValue = el.dataset.enValue;
            } else {
                i18nElements.set(el, {
                    zhValue: el.value,
                    enValue: el.dataset.enValue
                });
            }
        });
    }
    
    // 初始化语言选择下拉框
    function initLanguageSelector() {
        const selector = document.getElementById('languageSelect');
        if (!selector) return;
        
        // 设置当前选中的选项
        selector.value = currentSetting;
        
        // 监听变化
        selector.addEventListener('change', (e) => {
            const newSetting = e.target.value;
            
            // 保存设置
            localStorage.setItem(STORAGE_KEY, newSetting);
            currentSetting = newSetting;
            
            // 更新实际语言并应用
            if (updateCurrentLangFromSetting()) {
                // 语言真的变了才重新应用
                applyLanguage(currentLang);
                
                // 触发自定义事件
                triggerLanguageChangeEvent();
            }
        });
    }
    
    // 监听系统语言变化
    function observeSystemLanguageChange() {
        window.addEventListener('languagechange', () => {
            console.log('System language changed');
            
            if (currentSetting === 'auto') {
                const oldLang = currentLang;
                updateCurrentLangFromSetting();
                
                if (oldLang !== currentLang) {
                    console.log(`Language switched from ${oldLang} to ${currentLang} due to system change`);
                    applyLanguage(currentLang);
                    triggerLanguageChangeEvent();
                    
                    const selector = document.getElementById('languageSelect');
                    if (selector) {
                        selector.value = 'auto';
                    }
                }
            }
        });
        
        // 备选方案：轮询检查系统语言
        let lastBrowserLang = navigator.language;
        setInterval(() => {
            const currentBrowserLang = navigator.language;
            if (currentSetting === 'auto' && lastBrowserLang !== currentBrowserLang) {
                lastBrowserLang = currentBrowserLang;
                
                const oldLang = currentLang;
                updateCurrentLangFromSetting();
                
                if (oldLang !== currentLang) {
                    console.log(`Language switched due to system change (polling)`);
                    applyLanguage(currentLang);
                    triggerLanguageChangeEvent();
                }
            }
        }, 1000);
    }
    
    // 监听其他标签页的语言设置变化
    function observeStorageChange() {
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) {
                console.log('Language setting changed in another tab:', e.newValue);
                
                const newSetting = e.newValue;
                if (newSetting && ['auto', 'zh', 'en'].includes(newSetting)) {
                    const oldSetting = currentSetting;
                    const oldLang = currentLang;
                    
                    currentSetting = newSetting;
                    updateCurrentLangFromSetting();
                    
                    if (oldSetting !== currentSetting || oldLang !== currentLang) {
                        const selector = document.getElementById('languageSelect');
                        if (selector) {
                            selector.value = currentSetting;
                        }
                        
                        applyLanguage(currentLang);
                        triggerLanguageChangeEvent();
                    }
                }
            }
        });
    }
    
    // 触发语言变更事件
    function triggerLanguageChangeEvent() {
        window.dispatchEvent(new CustomEvent('languagechanged', {
            detail: {
                setting: currentSetting,
                lang: currentLang
            }
        }));
    }
    
    // 应用语言到单个元素
    function applyLanguageToElement(el, content, lang) {
        // 处理标题
        if (content.isTitle) {
            if (lang === 'en' && content.en) {
                document.title = content.en;
            } else if (content.zh) {
                document.title = content.zh;
            }
            return;
        }
        
        // 处理普通元素的主内容
        if (content.zh !== undefined || content.en !== undefined) {
            if (lang === 'en' && content.en) {
                if (content.isInput) {
                    el.value = content.en;
                } else {
                    el.innerHTML = content.en;
                }
            } else if (content.zh) {
                if (content.isInput) {
                    el.value = content.zh;
                } else {
                    el.innerHTML = content.zh;
                }
            }
        }
        
        // 处理placeholder
        if (content.enPlaceholder || content.zhPlaceholder) {
            if (lang === 'en' && content.enPlaceholder) {
                el.placeholder = content.enPlaceholder;
            } else if (content.zhPlaceholder) {
                el.placeholder = content.zhPlaceholder;
            }
        }
        
        // 处理alt属性
        if (content.enAlt || content.zhAlt) {
            if (lang === 'en' && content.enAlt) {
                el.alt = content.enAlt;
            } else if (content.zhAlt) {
                el.alt = content.zhAlt;
            }
        }
        
        // 处理value属性
        if (content.enValue || content.zhValue) {
            if (lang === 'en' && content.enValue) {
                el.value = content.enValue;
            } else if (content.zhValue) {
                el.value = content.zhValue;
            }
        }
    }
    
    // 应用语言
    function applyLanguage(lang) {
        console.log(`Applying language: ${lang}`);
        
        // 更新所有已记录的元素
        i18nElements.forEach((content, el) => {
            // 检查元素是否还在DOM中
            if (!document.body.contains(el) && el.tagName !== 'TITLE') {
                i18nElements.delete(el);
                return;
            }
            
            applyLanguageToElement(el, content, lang);
        });
        
        // 处理动态添加的元素（原有代码保持不变）
        document.querySelectorAll('[data-en]').forEach(el => {
            if (!i18nElements.has(el)) {
                const content = { en: el.dataset.en };
                
                if (el.tagName === 'TITLE') {
                    content.zh = el.textContent;
                    content.isTitle = true;
                } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                    content.zh = el.value;
                    content.isInput = true;
                } else {
                    content.zh = el.innerHTML;
                }
                
                i18nElements.set(el, content);
                applyLanguageToElement(el, content, lang);
            }
        });
        
        // 处理动态添加的placeholder元素
        document.querySelectorAll('[data-en-placeholder]').forEach(el => {
            if (!i18nElements.has(el)) {
                i18nElements.set(el, {
                    zhPlaceholder: el.placeholder,
                    enPlaceholder: el.dataset.enPlaceholder
                });
                if (lang === 'en' && el.dataset.enPlaceholder) {
                    el.placeholder = el.dataset.enPlaceholder;
                }
            }
        });
        
        // 处理动态添加的alt属性
        document.querySelectorAll('[data-en-alt]').forEach(el => {
            if (!i18nElements.has(el)) {
                i18nElements.set(el, {
                    zhAlt: el.alt,
                    enAlt: el.dataset.enAlt
                });
                if (lang === 'en' && el.dataset.enAlt) {
                    el.alt = el.dataset.enAlt;
                }
            }
        });
        
        // 处理动态添加的value属性
        document.querySelectorAll('[data-en-value]').forEach(el => {
            if (!i18nElements.has(el)) {
                i18nElements.set(el, {
                    zhValue: el.value,
                    enValue: el.dataset.enValue
                });
                if (lang === 'en' && el.dataset.enValue) {
                    el.value = el.dataset.enValue;
                }
            }
        });
        
        // 更新html标签的lang属性
        document.documentElement.lang = lang;
        
        // ===== 新增：设置 hCaptcha 语言 =====
        setHcaptchaLanguage(lang);
    }

    // 新增：设置 hCaptcha 语言的函数
    function setHcaptchaLanguage(lang) {
        // 检查 hCaptcha 是否已加载
        if (typeof hcaptcha === 'undefined') return;
        
        // 根据语言设置 hCaptcha 的显示语言
        const hcaptchaLang = lang === 'zh' ? 'zh-CN' : 'en';
        
        // 方法1：通过配置重新渲染（如果hcaptcha已经渲染过）
        const hcaptchaElements = document.querySelectorAll('.h-captcha');
        if (hcaptchaElements.length > 0) {
            hcaptchaElements.forEach(el => {
                // 获取原有的data-sitekey
                const sitekey = el.getAttribute('data-sitekey');
                if (sitekey) {
                    // 清空容器
                    el.innerHTML = '';
                    // 重新渲染hCaptcha，指定语言
                    hcaptcha.render(el, {
                        sitekey: sitekey,
                        hl: hcaptchaLang // 设置语言
                    });
                }
            });
        }
        
        // 方法2：设置全局语言（如果有这个API）
        if (hcaptcha.setLanguage) {
            hcaptcha.setLanguage(hcaptchaLang);
        }
        
        console.log(`hCaptcha language set to: ${hcaptchaLang}`);
    }
    
    // 监听DOM变化
    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            let needsTranslation = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // 检查新添加的元素
                        const hasDataAttr = node.hasAttribute && (
                            node.hasAttribute('data-en') ||
                            node.hasAttribute('data-en-placeholder') ||
                            node.hasAttribute('data-en-alt') ||
                            node.hasAttribute('data-en-value')
                        );
                        
                        if (hasDataAttr && !i18nElements.has(node)) {
                            needsTranslation = true;
                        }
                        
                        // 检查后代元素
                        if (node.querySelectorAll) {
                            const subElements = node.querySelectorAll('[data-en], [data-en-placeholder], [data-en-alt], [data-en-value]');
                            if (subElements.length > 0) {
                                needsTranslation = true;
                            }
                        }
                        
                        // 检查语言选择下拉框
                        if (node.id === 'languageSelect' || (node.querySelector && node.querySelector('#languageSelect'))) {
                            const selector = node.id === 'languageSelect' ? node : node.querySelector('#languageSelect');
                            if (selector) {
                                setTimeout(() => initLanguageSelector(), 0);
                            }
                        }
                    }
                });
            });
            
            if (needsTranslation) {
                // 重新收集并应用
                collectI18nElements();
                applyLanguage(currentLang);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // 手动刷新语言
    function refresh() {
        collectI18nElements();
        applyLanguage(currentLang);
    }
    
    // 公共API
    window.i18n = {
        to: function(lang) {
            if (lang !== 'zh' && lang !== 'en') return;
            
            currentLang = lang;
            currentSetting = lang;
            localStorage.setItem(STORAGE_KEY, lang);
            
            const selector = document.getElementById('languageSelect');
            if (selector) selector.value = lang;
            
            applyLanguage(lang);
            triggerLanguageChangeEvent();
        },
        
        toChinese: function() {
            this.to('zh');
        },
        
        toEnglish: function() {
            this.to('en');
        },
        
        followSystem: function() {
            currentSetting = 'auto';
            localStorage.setItem(STORAGE_KEY, 'auto');
            
            const selector = document.getElementById('languageSelect');
            if (selector) selector.value = 'auto';
            
            const oldLang = currentLang;
            updateCurrentLangFromSetting();
            
            if (oldLang !== currentLang) {
                applyLanguage(currentLang);
                triggerLanguageChangeEvent();
            }
        },
        
        getCurrentLang: function() {
            return currentLang;
        },
        
        getCurrentSetting: function() {
            return currentSetting;
        },
        
        register: function(element) {
            if (!element) return;
            
            const content = {};
            
            if (element.hasAttribute('data-en')) {
                content.en = element.dataset.en;
                if (element.tagName === 'TITLE') {
                    content.zh = element.textContent;
                    content.isTitle = true;
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                    content.zh = element.value;
                    content.isInput = true;
                } else {
                    content.zh = element.innerHTML;
                }
            }
            
            if (element.hasAttribute('data-en-placeholder')) {
                content.zhPlaceholder = element.placeholder;
                content.enPlaceholder = element.dataset.enPlaceholder;
            }
            
            if (element.hasAttribute('data-en-alt')) {
                content.zhAlt = element.alt;
                content.enAlt = element.dataset.enAlt;
            }
            
            if (element.hasAttribute('data-en-value')) {
                content.zhValue = element.value;
                content.enValue = element.dataset.enValue;
            }
            
            if (Object.keys(content).length > 0) {
                i18nElements.set(element, content);
                if (currentLang === 'en') {
                    applyLanguageToElement(element, content, 'en');
                }
            }
        },
        
        refresh: refresh
    };
    
    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// 辅助函数：注册动态元素到i18n系统
function registerI18nElements(container) {
    if (!window.i18n) return;
    
    // 查找所有带有 data-en 属性的元素
    const elements = container.querySelectorAll('[data-en]');
    elements.forEach(el => window.i18n.register(el));
    
    // 查找所有带有 data-en-placeholder 属性的元素
    const placeholderElements = container.querySelectorAll('[data-en-placeholder]');
    placeholderElements.forEach(el => window.i18n.register(el));
    
    // 查找所有带有 data-en-alt 属性的元素
    const altElements = container.querySelectorAll('[data-en-alt]');
    altElements.forEach(el => window.i18n.register(el));
    
    // 查找所有带有 data-en-value 属性的元素
    const valueElements = container.querySelectorAll('[data-en-value]');
    valueElements.forEach(el => window.i18n.register(el));
}
// 翻译辅助函数 - 放在文件开头
function getLocalizedText(zhText, enText) {
    // 获取当前语言
    const currentLang = localStorage.getItem('preferredLang') || 'auto';
    const isEnglish = currentLang === 'en' || (currentLang === 'auto' && !navigator.language.startsWith('zh'));
    
    // 返回当前语言的文本
    const result = isEnglish ? enText : zhText;
    
    // 存储这个翻译及其使用位置
    if (!window._i18nTexts) {
        window._i18nTexts = [];
        
        // 监听语言变化
        window.addEventListener('languagechanged', function(e) {
            const newLang = e.detail.lang;
            
            // 重新执行所有使用 getLocalizedText 的代码
            if (window._refreshI18n) {
                window._refreshI18n();
            }
        });
    }
    
    // 记录这个调用
    const stack = new Error().stack;
    window._i18nTexts.push({
        zh: zhText,
        en: enText,
        stack: stack,
        current: result
    });
    
    return result;
}