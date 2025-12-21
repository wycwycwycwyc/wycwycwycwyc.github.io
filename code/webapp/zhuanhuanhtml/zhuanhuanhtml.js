document.addEventListener('DOMContentLoaded', function () {
      const dropZone = document.getElementById('dropZone');
      const downloadLinksTable = document.getElementById('downloadLinks');
      const downloadAllButton = document.getElementById('downloadAllButton');
      const fileInput = document.getElementById('fileInput');

      // 设置拖拽事件监听器
      dropZone.addEventListener('dragover', handleDragOver, false);
      dropZone.addEventListener('drop', handleDrop, false);

      function handleDragOver(event) {
        event.stopPropagation();
        event.preventDefault();
        dropZone.style.border = '2px dashed #000';
      }

      function handleDrop(event) {
        event.stopPropagation();
        event.preventDefault();
        dropZone.style.border = '2px dashed #ccc';

        const files = event.dataTransfer.files;
        processFiles(files, () => {
          downloadLinksTable.classList.remove('hidden');
          downloadAllButton.disabled = false;
        });
      }

      function processFiles(files, callback) {
        let linksCreated = 0;
        const tbody = downloadLinksTable.getElementsByTagName('tbody')[0];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type === 'application/vnd.ms-excel') {
            const reader = new FileReader();
            reader.onload = function (e) {
              const data = e.target.result;
              const workbook = XLSX.read(data, { type: 'binary' });
              const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
              const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = file.name.replace('.xls', '.xlsx');
              a.textContent = file.name.replace('.xls', '.xlsx');
              const row = document.createElement('tr');
              const filenameCell = document.createElement('td');
              const downloadCell = document.createElement('td');
              filenameCell.textContent = file.name.replace('.xls', '.xlsx');
              downloadCell.appendChild(a);
              row.appendChild(filenameCell);
              row.appendChild(downloadCell);
              tbody.appendChild(row);
              linksCreated++;
              if (linksCreated === files.length) {
                callback();
              }
            };
            reader.readAsBinaryString(file);
          } else {
            alert('请只拖拽XLS文件。');
          }
        }
      }

      // 新增一键下载所有文件的功能
      downloadAllButton.addEventListener('click', function () {
        const links = downloadLinksTable.getElementsByTagName('a');
        const zip = new JSZip();

        let filesProcessed = 0;

        function downloadAndAddToZip(link, fileName) {
          Qmsg.success("已开启下载");
          fetch(link.href)
            .then(response => response.blob())
            .then(blob => {
              // 将文件添加到zip中
              zip.file(fileName, blob);
              filesProcessed++;
              if (filesProcessed === links.length) {
                // 所有文件处理完毕，触发zip下载
                zip.generateAsync({ type: "blob" }).then(function (content) {
                  saveAs(content, "你的xlsx文件.zip");
                });
              }
            })
            .catch(error => console.error('下载失败:', error));
        }

        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          const fileName = link.download || 'filename.xlsx'; // 假设默认文件名
          downloadAndAddToZip(link, fileName);
        }
      });
      // 添加文件选择按钮的事件监听器
      document.getElementById('fileUploadButton').addEventListener('click', function () {
        fileInput.click();
      });

      // 监听文件选择事件
      fileInput.addEventListener('change', function (event) {
        processFiles(event.target.files, () => {
          downloadLinksTable.classList.remove('hidden');
          downloadAllButton.disabled = false;
        });
      });
    });