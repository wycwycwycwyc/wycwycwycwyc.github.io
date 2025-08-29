document.addEventListener('DOMContentLoaded', function () {
    var isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    function getCurrentPageFullUrl() {
        return window.location.href;
    }

    var currentPageUrl = getCurrentPageFullUrl();

    if (!isLoggedIn) {
        swal({
            title: "你还未登录",
            text: "请登录后使用",
            type: "warning",
            showCancelButton: false,
            confirmButtonText: "确定",
            closeOnConfirm: true
        }, function () {
            location.href = `/account/Login.html?redirect=${encodeURIComponent(currentPageUrl)}`;
        });
    }
});