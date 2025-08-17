document.addEventListener('DOMContentLoaded',function(){var animationToggle=document.getElementById('animationToggle');var isAnimationEnabled=localStorage.getItem('animation');if(isAnimationEnabled===null){isAnimationEnabled=true;localStorage.setItem('animation','enabled');}else{isAnimationEnabled=isAnimationEnabled==='enabled';}
if(animationToggle){animationToggle.checked=isAnimationEnabled;toggleAnimations(isAnimationEnabled);animationToggle.addEventListener('change',function(){isAnimationEnabled=animationToggle.checked;localStorage.setItem('animation',isAnimationEnabled?'enabled':'disabled');toggleAnimations(isAnimationEnabled);});}else{toggleAnimations(isAnimationEnabled);}
function toggleAnimations(enable){if(!enable){disableAllTransitionsAndAnimations();}else{enableAllTransitionsAndAnimations();}}
function disableAllTransitionsAndAnimations(){let style=document.getElementById('disable-animations-style');if(!style){style=document.createElement('style');style.id='disable-animations-style';style.innerHTML=`
                * {
                    animation: none !important;
                    transition: none !important;
                }
            `;document.head.appendChild(style);}
setTimeout(function(){var ripple=document.querySelector('.ripple');if(ripple){ripple.style.opacity='0';}},0);}
function enableAllTransitionsAndAnimations(){let style=document.getElementById('disable-animations-style');if(style){style.remove();}}});