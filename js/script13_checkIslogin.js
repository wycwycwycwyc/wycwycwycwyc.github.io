document.addEventListener('DOMContentLoaded', function () {
    var isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    function getCurrentPageFullUrl() {
        return window.location.href;
    }

    var currentPageUrl = getCurrentPageFullUrl();

    if (!isLoggedIn) {
        Swal.fire({
            title: "你还未登录",
            text: "请登录后使用",
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: "确定"
        }).then((result) => {
            if (result.isConfirmed) {
                location.href = `/account/Login/index.html?redirect=${encodeURIComponent(currentPageUrl)}`;
            }
        });
    }
});