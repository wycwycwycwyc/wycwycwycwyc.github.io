            const imageUrl = `${serverurl}/get-icon-by-id?id=${localStorage.getItem('userid')}`;
            document.getElementById('previewold').src = imageUrl;
            function previewImage(input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = new Image();
                        img.onload = function () {
                            // 创建canvas元素
                            var canvas = document.createElement('canvas');
                            var ctx = canvas.getContext('2d');

                            // 原始图片的宽高比
                            var aspectRatio = img.width / img.height;

                            // 根据宽高比确定压缩后的尺寸
                            var targetWidth, targetHeight;
                            if (aspectRatio > 1) {
                                // 宽度大于高度，按照宽度压缩
                                targetWidth = 200;
                                targetHeight = 200;
                            } else if (aspectRatio < 1) {
                                // 高度大于宽度，按照高度压缩
                                targetHeight = 200;
                                targetWidth = 200;
                            } else {
                                // 正方形图片，直接压缩
                                targetWidth = 200;
                                targetHeight = 200;
                            }

                            // 绘制压缩后的图片
                            canvas.width = 200;
                            canvas.height = 200;
                            ctx.drawImage(img, (200 - targetWidth) / 2, (200 - targetHeight) / 2, targetWidth, targetHeight);

                            // 将canvas转换为DataURL并设置为预览图片的源
                            var preview = document.getElementById('preview');
                            preview.src = canvas.toDataURL('image/png');
                            preview.style.display = 'inline';
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            }

            function uploadImage() {
                var userId = localStorage.getItem('userid');
                var preview = document.getElementById('preview');
                var uploadProgress = document.getElementById('uploadProgress');
                var progressInfo = document.getElementById('progressInfo');

                if (!preview.src) {
                    Qmsg.error('请先选择文件');
                    return;
                }

                // 将DataURL转换为Blob
                fetch(preview.src)
                    .then(res => res.blob())
                    .then(blob => {
                        if (!['image/jpeg', 'image/png'].includes(blob.type)) {
                            Qmsg.error('只能上传不超过1MB的图片,格式为png或jpg');
                            return;
                        }

                        var formData = new FormData();
                        formData.append('userId', userId);
                        formData.append('avatar', blob);

                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', `${serverurl}/upload-image`, true);

                        xhr.upload.onprogress = function (event) {
                            if (event.lengthComputable) {
                                var percentComplete = Math.round((event.loaded / event.total) * 100);
                                uploadProgress.value = percentComplete;
                                progressInfo.textContent = '上传进度: ' + percentComplete + '%';
                            }
                        };

                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                Swal.fire('图片上传成功', '你的账号头像已更新', 'success');
                                location.href = '/settings.html';
                            } else {
                                Swal.fire('图片上传失败: ', xhr.statusText, 'error');
                            }
                            uploadProgress.value = 0; // 重置进度条
                            progressInfo.textContent = '';
                        };

                        xhr.send(formData);
                    })
                    .catch(error => {
                        console.error('Error converting image to blob', error);
                        Qmsg.error('无法转换图片');
                    });
            }