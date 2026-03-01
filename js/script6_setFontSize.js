(function() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        var fontSizeSelect = document.getElementById('fontSizeSelect');
        var fontSize = localStorage.getItem('fontSize') || 'medium';
        var currentFactor = getFactorBySize(fontSize);
        
        // 获取倍数因子
        function getFactorBySize(size) {
            switch (size) {
                case 'small': return 0.7;
                case 'large': return 1.5;
                case 'x-large': return 2.0;
                case 'medium':
                default: return 1.0;
            }
        }
        
        // 确保body存在
        if (!document.body) {
            console.warn('Body not found, waiting...');
            setTimeout(init, 50);
            return;
        }
        
        // 初始化：保存原始字体大小并应用当前设置
        try {
            saveOriginalFontSizes(document.body);
            applyFontSizeToElement(document.body, currentFactor);
        } catch (e) {
            console.error('Error during initialization:', e);
        }
        
        // 设置MutationObserver监听动态添加的元素
        if (document.body) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    // 处理新增的节点
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(function(node) {
                            // 如果是元素节点
                            if (node.nodeType === 1) {
                                try {
                                    // 保存该节点及其子节点的原始大小
                                    saveOriginalFontSizes(node);
                                    // 应用当前字体大小
                                    applyFontSizeToElement(node, currentFactor);
                                } catch (e) {
                                    console.error('Error processing new node:', e);
                                }
                            }
                        });
                    }
                });
            });
            
            // 开始观察整个文档的变化
            observer.observe(document.body, {
                childList: true,      // 监听子节点的添加/移除
                subtree: true,        // 监听所有后代节点
                attributes: false,    // 不监听属性变化（提高性能）
                characterData: false  // 不监听文本变化
            });
        }
        
        if (fontSizeSelect) {
            fontSizeSelect.value = fontSize;
            fontSizeSelect.addEventListener('change', function() {
                fontSize = fontSizeSelect.value;
                currentFactor = getFactorBySize(fontSize);
                localStorage.setItem('fontSize', fontSize);
                
                // 重新应用字体大小到所有元素
                try {
                    saveOriginalFontSizes(document.body);
                    applyFontSizeToElement(document.body, currentFactor);
                } catch (e) {
                    console.error('Error applying new font size:', e);
                }
            });
        }
        
        /**
         * 保存元素的原始字体大小（如果尚未保存）
         * @param {Element} rootElement 起始元素
         */
        function saveOriginalFontSizes(rootElement) {
            if (!rootElement || rootElement.nodeType !== 1) return;
            
            // 保存rootElement本身的原始大小
            saveElementOriginalSize(rootElement);
            
            // 获取rootElement的所有后代元素
            try {
                var elements = rootElement.querySelectorAll('*');
                elements.forEach(function(el) {
                    if (el && el.nodeType === 1) {
                        saveElementOriginalSize(el);
                    }
                });
            } catch (e) {
                // 忽略某些元素可能不支持querySelectorAll的情况
                console.debug('Could not query elements from:', rootElement);
            }
        }
        
        /**
         * 保存单个元素的原始字体大小
         */
        function saveElementOriginalSize(el) {
            if (!el || el.nodeType !== 1) return;
            
            try {
                if (!el.hasAttribute('data-original-font-size')) {
                    // 获取当前计算后的字体大小
                    var computedSize = window.getComputedStyle(el).fontSize;
                    var match = computedSize.match(/^([\d.]+)px$/);
                    if (match && match[1]) {
                        var sizeInPx = parseFloat(match[1]);
                        el.setAttribute('data-original-font-size', sizeInPx.toFixed(2));
                    } else {
                        // 如果获取不到，使用父元素的原始值或默认值
                        var parent = el.parentElement;
                        if (parent && parent.hasAttribute('data-original-font-size')) {
                            el.setAttribute('data-original-font-size', parent.getAttribute('data-original-font-size'));
                        } else {
                            el.setAttribute('data-original-font-size', '16');
                        }
                    }
                }
            } catch (e) {
                console.debug('Could not save original size for element:', el);
            }
        }
        
        /**
         * 为元素及其后代应用字体大小
         * @param {Element} rootElement 起始元素
         * @param {number} factor 倍数因子
         */
        function applyFontSizeToElement(rootElement, factor) {
            if (!rootElement || rootElement.nodeType !== 1) return;
            
            try {
                // 处理rootElement本身
                applySingleElement(rootElement, factor);
                
                // 处理所有后代
                var descendants = rootElement.querySelectorAll('*');
                descendants.forEach(function(el) {
                    if (el && el.nodeType === 1) {
                        applySingleElement(el, factor);
                    }
                });
            } catch (e) {
                console.debug('Could not apply font size to:', rootElement);
            }
        }
        
        /**
         * 为单个元素应用字体大小
         */
        function applySingleElement(el, factor) {
            if (!el || el.nodeType !== 1) return;
            
            try {
                var original = el.getAttribute('data-original-font-size');
                if (original) {
                    var newSize = parseFloat(original) * factor;
                    el.style.fontSize = newSize + 'px';
                } else {
                    // 如果没有原始值，尝试获取并保存
                    saveElementOriginalSize(el);
                    original = el.getAttribute('data-original-font-size');
                    if (original) {
                        var newSize = parseFloat(original) * factor;
                        el.style.fontSize = newSize + 'px';
                    }
                }
            } catch (e) {
                console.debug('Could not apply font size to element:', el);
            }
        }
    }
})();