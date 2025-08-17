function openPage(url){window.location.href=url;}
function startAnimation(){document.querySelector('.custom-button').style.animationPlayState='running';}
document.querySelector('.custom-button').addEventListener('click',startAnimation);