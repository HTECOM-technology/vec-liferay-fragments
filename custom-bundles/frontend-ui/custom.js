function __initFormLogin () {
    // Chỉ chạy trên trang login
    var loginForm = document.querySelector('form[name="_com_liferay_login_web_portlet_LoginPortlet_loginForm"]');
    if (!loginForm) return;

    // Lấy và validate __custom_redirect từ URL
    function getSafeRedirect() {
        var params = new URLSearchParams(window.location.search);
        var redirect = params.get('_com_liferay_login_web_portlet_LoginPortlet_redirect');

        if (
            redirect &&
            redirect.startsWith('/') &&
            !redirect.startsWith('//') &&
            redirect.indexOf('://') === -1 &&
            redirect.indexOf('\0') === -1
        ) {
            return redirect;
        }

        return '/web/guest';
    }

    var customRedirect = getSafeRedirect();

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var actionUrl = loginForm.getAttribute('action');
        var formData = new FormData(loginForm);

        // Disable submit button để tránh double submit
        var submitBtn = loginForm.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        fetch(actionUrl, {
            method: 'POST',
            body: new URLSearchParams(formData), // Liferay cần application/x-www-form-urlencoded
            redirect: 'follow',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(function (response) {
                // Login thành công khi Liferay redirect ra khỏi trang login
                var finalUrl = response.url || '';
                var isStillOnLogin =
                    finalUrl.indexOf('/c/portal/login') !== -1 ||
                    finalUrl.indexOf('login') !== -1;

                if (response.ok && !isStillOnLogin) {
                    // Thành công → redirect theo custom param
                    window.location.href = customRedirect;
                } else {
                    // Thất bại → để Liferay xử lý lỗi bình thường
                    loginForm.submit();
                }
            })
            .catch(function () {
                // Lỗi network → fallback submit bình thường
                if (submitBtn) submitBtn.disabled = false;
                loginForm.submit();
            });
    });
}

(function () {
    // Check login page từ URL (trước khi DOM ready)
    var isLoginPage = window.location.search.indexOf('LoginPortlet') !== -1;

    // 1. Inject loading screen chỉ trên login
    var loadingEl = null;

    if (isLoginPage) {
        loadingEl = document.createElement('div');
        loadingEl.id = 'vec-loading-screen';
        loadingEl.innerHTML =
            '<div class="vec-spinner"></div>' +
            '<span class="vec-loading-text">Đang tải...</span>';
        document.documentElement.appendChild(loadingEl);
    }

    // 2. Khi DOM ready
    function onReady() {
        // ===== CHỈ CHẠY Ở TRANG LOGIN =====
        if (isLoginPage) {
            document.querySelector('body').classList.add('vec-login-page');

            // Add class cho wrapper
            var wrapper = document.querySelector('.vec-wrapper');
            if (wrapper) {
                wrapper.classList.add('always-hide-header');
            }

            var wrapperById = document.getElementById('wrapper');
            if (wrapperById) {
                var bgDiv = document.createElement('div');
                bgDiv.className = 'testtttt';
                bgDiv.style.cssText = 'position: fixed; z-index: 0; bottom: -280px; width: 100vw; opacity: 0.6;';
                bgDiv.innerHTML = '<img style="width: 100%;" src="http://45.77.240.85:8080/documents/d/guest/login_bg">';
                wrapperById.insertBefore(bgDiv, wrapperById.firstChild);
            }

            var label = document.querySelector(
                'label[for="_com_liferay_login_web_portlet_LoginPortlet_rememberMe"]'
            );
            var navigation = document.querySelector('.c-mt-3.navigation');

            if (label && navigation) {
                navigation.appendChild(label);
            }

            var portletContent = document.querySelector('.portlet-login .portlet-content');
            if (portletContent) {
                var logoSection = document.createElement('a');
                logoSection.className = 'vec-logo-section';
                logoSection.href = '/web/guest/trangchu';
                logoSection.style.cssText = 'display: flex; flex-direction: column; justify-items: center; align-items: center; gap: 16px; width: auto; padding: 10px 0; margin-bottom: 2rem;';
                logoSection.innerHTML = '<svg width="80" height="69" viewBox="0 0 80 69" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 0.5C61.8887 0.5 79.5 15.746 79.5 34.4004C79.4998 53.0546 61.8885 68.2998 40 68.2998C18.1115 68.2998 0.500245 53.0546 0.5 34.4004C0.5 15.746 18.1113 0.5 40 0.5Z" fill="#0090CF" stroke="white"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8318 55.2912L40.2146 2.06882L26.5187 44.9827L34.7906 35.2485H36.923L23.0983 55.2768H17.8318V55.2912Z" fill="#E31C2A"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M38.1679 34.9907L36.8799 45.2848L46.5686 45.2131L45.853 43.2174L40.0856 43.0738V39.4989L44.8656 39.3553L44.5078 38.0631L40.0856 38.1349V36.1393L44.0784 36.2111L43.6491 35.1343L38.1679 34.9907Z" fill="#E31C2A"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M45.939 35.1331L53.71 34.9178L54.4255 36.7124L52.2216 36.7842L51.8638 36.1382L48.5865 36.2099L51.0052 43.1445H54.6402L54.2967 42.0677H56.7583L58.0749 45.2263L49.2019 45.2837L45.939 35.1331Z" fill="#E31C2A"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M24.9158 55.2046L41.3308 55.0754L41.3594 47.1071L30.4685 46.8917L24.9158 55.2046Z" fill="white"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M44.4651 47.0358L58.8193 47.0646L62.1681 54.961L45.2093 55.1333L44.4651 47.0358Z" fill="white"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M40.6725 14.3733L40.8156 20.1162H42.1609L41.7029 14.3733H40.6725ZM41.016 5.04105L52.9945 33.2818L43.2628 33.3966H43.2056L42.7619 27.783H41.016L41.1591 33.3966H31.9426L41.016 5.04105Z" fill="white"></path></svg>' +
                    '<div class="title-container" style="width: auto; text-align: center;">' +
                        '<p class="title-vn" style="color: #E31C2A;">TỔNG CÔNG TY</p>' +
                        '<p class="title-vn" style="color: #E31C2A;">ĐẦU TƯ PHÁT TRIỂN ĐƯỜNG CAO TỐC VIỆT NAM</p>' +
                        '<p class="title-eu" style="color: #0090CF;">Vietnam Expressway Corporation (VEC)</p>' +
                    '</div>';
                portletContent.insertBefore(logoSection, portletContent.firstChild);
            }

            var portletHeader = document.querySelector('.portlet-login .portlet-header');

            if (portletHeader) {
                var headerHtml = document.createElement('div');
                headerHtml.className = 'vec-login-heading';
                headerHtml.innerHTML = `<h1 style="text-align: center;margin-bottom: 1rem;font-size: 24px;font-weight: 700;text-transform: uppercase;letter-spacing: normal;">Trang quản trị nội dung của VEC</h1>
                <p style="text-align: center;font-size: 24px;color: #1a1a2e;letter-spacing: normal;margin-bottom: 12px;">Đăng nhập</p>`;
                portletHeader.insertAdjacentElement('afterend', headerHtml);
            }

            var labelMap = {
                '_com_liferay_login_web_portlet_LoginPortlet_login': 'Tài khoản',
                '_com_liferay_login_web_portlet_LoginPortlet_rememberMe': 'Ghi nhớ đăng nhập'
            };

            Object.keys(labelMap).forEach(function (forAttr) {
                var lbl = document.querySelector('label[for="' + forAttr + '"]');

                if (lbl) {
                    var textNode = [...lbl.childNodes].find(function (node) {
                        return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
                    });

                    if (textNode) {
                        textNode.textContent = ' ' + labelMap[forAttr];
                    } else {
                        lbl.appendChild(document.createTextNode(' ' + labelMap[forAttr]));
                    }
                }
            });

            var email = document.querySelector('#_com_liferay_login_web_portlet_LoginPortlet_login');
            var password = document.querySelector('#_com_liferay_login_web_portlet_LoginPortlet_password');

            if (email) {
                email.value = '';
                email.setAttribute('placeholder', 'Tài khoản');
            }

            if (password) {
                password.value = '';
                password.setAttribute('placeholder', 'Mật khẩu');
            }

            //__initFormLogin();

            // Ẩn loading screen
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    loadingEl.classList.add('hide');

                    setTimeout(function () {
                        if (loadingEl.parentNode) {
                            loadingEl.parentNode.removeChild(loadingEl);
                        }
                    }, 350);
                });
            });
        }
        // ===== END LOGIN PAGE =====
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
    } else {
        onReady();
    }

})();
