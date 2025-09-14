// 全局变量
let codeReader;
let scanning = false;

// DOM元素
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const generateBtn = document.getElementById('generate-btn');
const clearBtn = document.getElementById('clear-btn');
const inputText = document.getElementById('input-text');
const barcodeType = document.getElementById('barcode-type');
const barcodeResult = document.getElementById('barcode-result');
const qrcodeResult = document.getElementById('qrcode-result');
const noResult = document.getElementById('no-result');
const downloadBtn = document.getElementById('download-btn');
const generateLoading = document.getElementById('generate-loading');
const startScanBtn = document.getElementById('start-scan-btn');
const stopScanBtn = document.getElementById('stop-scan-btn');
const uploadImageBtn = document.getElementById('upload-image-btn');
const fileInput = document.getElementById('file-input');
const scannerVideo = document.getElementById('scanner-video');
const scanLoading = document.getElementById('scan-loading');
const scannedResult = document.getElementById('scanned-result');
const scannedText = document.getElementById('scanned-text');
const toast = document.getElementById('toast');

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    // 初始化ZXing扫描器
    codeReader = new ZXing.BrowserMultiFormatReader();

    // 标签切换
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabId = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });

            // 停止扫描当切换到生成标签
            if (tabId === 'generate' && scanning) {
                stopScanning();
            }
        });
    });

    // 生成条码
    generateBtn.addEventListener('click', generateBarcode);

    // 清空
    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        barcodeResult.innerHTML = '';
        qrcodeResult.getContext('2d').clearRect(0, 0, qrcodeResult.width, qrcodeResult.height);
        noResult.style.display = 'block';
        downloadBtn.style.display = 'none';
    });

    // 下载图像
    downloadBtn.addEventListener('click', downloadImage);

    // 开始扫描
    startScanBtn.addEventListener('click', startScanning);

    // 停止扫描
    stopScanBtn.addEventListener('click', stopScanning);

    // 上传图片扫描
    uploadImageBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileUpload);
});

// 生成条码/二维码
function generateBarcode() {
    const text = inputText.value.trim();
    if (!text) {
        showToast('请输入要编码的内容');
        return;
    }

    generateLoading.style.display = 'block';
    noResult.style.display = 'none';
    barcodeResult.innerHTML = '';
    downloadBtn.style.display = 'none';

    // 模拟加载延迟
    setTimeout(() => {
        try {
            const type = barcodeType.value;

            if (type === 'qrcode') {
                // 生成二维码
                QRCode.toCanvas(qrcodeResult, text, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                }, function (error) {
                    generateLoading.style.display = 'none';
                    if (error) {
                        showToast('生成二维码失败: ' + error);
                        noResult.style.display = 'block';
                    } else {
                        barcodeResult.style.display = 'none';
                        qrcodeResult.style.display = 'block';
                        downloadBtn.style.display = 'inline-flex';
                    }
                });
            } else {
                // 生成条形码
                JsBarcode(barcodeResult, text, {
                    format: type,
                    width: 2,
                    height: 100,
                    displayValue: true,
                    fontSize: 16,
                    margin: 10
                });

                generateLoading.style.display = 'none';
                barcodeResult.style.display = 'block';
                qrcodeResult.style.display = 'none';
                downloadBtn.style.display = 'inline-flex';
            }
        } catch (error) {
            generateLoading.style.display = 'none';
            showToast('生成失败: ' + error.message);
            noResult.style.display = 'block';
        }
    }, 500);
}

// 下载图像
function downloadImage() {
    const type = barcodeType.value;
    let canvas, filename;

    if (type === 'qrcode') {
        canvas = qrcodeResult;
        filename = 'qrcode.png';
    } else {
        // 将SVG转换为Canvas
        canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(barcodeResult);
        const img = new Image();

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            triggerDownload(canvas, 'barcode.png');
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        return;
    }

    triggerDownload(canvas, filename);
}

function triggerDownload(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 开始扫描
function startScanning() {
    scanLoading.style.display = 'block';
    scannedResult.style.display = 'none';
    startScanBtn.disabled = true;
    stopScanBtn.disabled = false;

    codeReader.decodeFromVideoDevice(null, scannerVideo, (result, error) => {
        scanLoading.style.display = 'none';

        if (result) {
            scanning = false;
            codeReader.reset();
            scannedText.textContent = result.text;
            scannedResult.style.display = 'block';
            startScanBtn.disabled = false;
            stopScanBtn.disabled = true;

            // 自动滚动到结果
            scannedResult.scrollIntoView({ behavior: 'smooth' });
        }

        if (error && !(error instanceof ZXing.NotFoundException)) {
            console.error(error);
            showToast('扫描错误: ' + error.message);
            stopScanning();
        }
    }).then(() => {
        scanning = true;
        scanLoading.style.display = 'none';
    }).catch(error => {
        scanLoading.style.display = 'none';
        showToast('无法启动摄像头: ' + error.message);
        startScanBtn.disabled = false;
        stopScanBtn.disabled = true;
    });
}

// 停止扫描
function stopScanning() {
    if (scanning) {
        codeReader.reset();
        scanning = false;
    }
    startScanBtn.disabled = false;
    stopScanBtn.disabled = true;
    scanLoading.style.display = 'none';
}

// 处理文件上传
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    scanLoading.style.display = 'block';
    scannedResult.style.display = 'none';

    const img = new Image();
    img.onload = function () {
        codeReader.decodeFromImage(img).then(result => {
            scannedText.textContent = result.text;
            scannedResult.style.display = 'block';
            scanLoading.style.display = 'none';

            // 自动滚动到结果
            scannedResult.scrollIntoView({ behavior: 'smooth' });
        }).catch(error => {
            scanLoading.style.display = 'none';
            showToast('扫描失败: ' + error.message);
        });
    };

    img.onerror = function () {
        scanLoading.style.display = 'none';
        showToast('无法加载图像');
    };

    img.src = URL.createObjectURL(file);
}

// 显示Toast通知
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}