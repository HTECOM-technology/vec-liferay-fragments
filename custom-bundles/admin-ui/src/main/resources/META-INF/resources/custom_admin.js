async function __custom_admin_js() {
    //
}

(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', __custom_admin_js);
    } else {
        __custom_admin_js();
    }
})();
