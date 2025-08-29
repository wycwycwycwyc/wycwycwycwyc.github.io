function openPage(url) {        
    window.location.href = url; // 将 'your_second_html_page.html' 替换为您要跳转到的另一个HTML页面的文件路径。        
}    
    
function startAnimation() {    
    document.querySelector('.custom-button').style.animationPlayState = 'running'; // 开始动画    
}    
    
document.querySelector('.custom-button').addEventListener('click', startAnimation);