document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('settingscode');
    const codeElement = document.querySelector('code');

    // 检查 localStorage 中是否有开关状态
    const isCodeVisible = localStorage.getItem('isCodeVisible') === null ? 'true' : localStorage.getItem('isCodeVisible');
    if (checkbox) {
        // 如果存在开关元素，则根据 localStorage 设置开关状态
        if (isCodeVisible === 'true') {
            checkbox.checked = true;
            if (codeElement) {
                codeElement.removeAttribute('style');
            }
        } else if (isCodeVisible === 'false') {
            checkbox.checked = false;
            if (codeElement) {
                codeElement.setAttribute('style', 'all: unset;');
            }
        }

        // 监听开关的点击事件
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                if (codeElement) {
                    codeElement.removeAttribute('style');
                }
                localStorage.setItem('isCodeVisible', 'true');
            } else {
                if (codeElement) {
                    codeElement.setAttribute('style', 'all: unset;');
                }
                localStorage.setItem('isCodeVisible', 'false');
            }
        });
    } else {
        // 如果没有开关元素，直接根据 localStorage 设置样式
        if (isCodeVisible === 'false' && codeElement) {
            codeElement.setAttribute('style', 'all: unset;');
        }
    }
});