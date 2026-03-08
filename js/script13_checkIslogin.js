document.addEventListener('DOMContentLoaded', function () {
    var isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    function getCurrentPageFullUrl() {
        return window.location.href;
    }

    var currentPageUrl = getCurrentPageFullUrl();

    if (!isLoggedIn) {
        Swal.fire({
            title: getLocalizedText("你还未登录", "You are not logged in"),
            text: getLocalizedText("请登录后使用", "Please login to continue"),
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: getLocalizedText("确定", "OK")
        }).then((result) => {
            if (result.isConfirmed) {
                location.href = `/account/Login/index.html?redirect=${encodeURIComponent(currentPageUrl)}`;
            }
        });
    }
});