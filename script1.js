function copySourceCode() {  
  // 获取源代码元素  
  var sourceCodeElement = document.getElementById('sourceCode');  
  
  // 创建一个新的 <pre> 元素  
  var preElement = document.createElement('pre');  
  preElement.textContent = sourceCodeElement.textContent;  
    
  // 将新的 <pre> 元素添加到 body 中  
  document.body.appendChild(preElement);  
    
  // 使用 Clipboard API 复制文本  
  navigator.clipboard.writeText(sourceCodeElement.textContent)  
    .then(() => {  
      // 提示复制成功  
      alert('源代码已复制到剪贴板！');  
    })  
    .catch(err => {  
      // 提示复制失败  
      alert('无法复制源代码！');  
    });  
    
  // 移除 <pre> 元素  
  document.body.removeChild(preElement);  
}