document.addEventListener("DOMContentLoaded",function(){var t=document.getElementById("animationToggle"),e=localStorage.getItem("animation");e===null?(e=!0,localStorage.setItem("animation","enabled")):e=e==="enabled",t?(t.checked=e,n(e),t.addEventListener("change",function(){e=t.checked,localStorage.setItem("animation",e?"enabled":"disabled"),n(e)})):n(e);function n(e){e?o():s()}function s(){let e=document.getElementById("disable-animations-style");e||(e=document.createElement("style"),e.id="disable-animations-style",e.innerHTML=`
                * {
                    animation: none !important;
                    transition: none !important;
                }
            `,document.head.appendChild(e)),setTimeout(function(){var e=document.querySelector(".ripple");e&&(e.style.opacity="0")},0)}function o(){let e=document.getElementById("disable-animations-style");e&&e.remove()}})