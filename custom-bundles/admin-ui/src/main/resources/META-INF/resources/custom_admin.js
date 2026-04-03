function __getCurrentLiferayScreen() {
    const params = new URLSearchParams(window.location.search);
    const portletId = params.get('p_p_id') ?? '';

    // Tách suffix ngắn gọn hơn (phần sau dấu _ cuối cùng nếu có)
    const shortId = portletId.split('_').pop(); // "R6F7" — unique per instance

    // Các param riêng của portlet đó đều có prefix:
    const prefix = `_${portletId}_`;
    const portletParams = {};
    for (const [key, val] of params.entries()) {
        if (key.startsWith(prefix)) {
            portletParams[key.replace(prefix, '')] = val;
        }
    }

    return {
        portletId,
        shortId,
        lifecycle: params.get('p_p_lifecycle'),
        state: params.get('p_p_state'),
        groupId: params.get('p_v_l_s_g_id'),
        portletParams,
    };
}

function __setDefaultValueForInputPublishInNewPost() {
    const inputPublishDate = document.querySelector('[data-field-name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Date75635616"]');
    if (!inputPublishDate) {
        return;
    }

    const currentDate = new Date();
    const dd = String(currentDate.getDate()).padStart(2, '0');
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const yyyy = currentDate.getFullYear();
    const formattedLocal = `${dd}/${mm}/${yyyy}`;
    const formatted = `${yyyy}-${mm}-${dd}`;

    const tooltip = inputPublishDate.querySelector('[data-tooltip-align]');
    if (tooltip) {
        tooltip.setAttribute('title', formattedLocal);
    }

    const nativeSetter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype, 'value'
    ).set;

    const setValue = (selector, value) => {
        const input = inputPublishDate.querySelector(selector);
        if (input) {
            nativeSetter.call(input, value);
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
        }
    }

    const parentNode = inputPublishDate.closest('.ddm-row');
    if (parentNode) {
        parentNode.style.display = 'none';
    }

    setTimeout(() => {
        setValue('[name="datePicker"]', formattedLocal);
        setValue('[id^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Date75635616"]', formattedLocal);
        setValue('[name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Date75635616"]', formatted);
    }, 5000);
}

function __setDefaultPostTypeInNewPost() {
    const groupEl = document.querySelector('[aria-labelledby^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Radio68088030"]');
    if (!groupEl) {
        return;
    }

    const input = groupEl.querySelector('input[value="Option92128051"]');
    if (input) {
        input.click();
    }
}

function __appendCreateNewPostToLeftMenu() {
    const interval = setInterval(() => {
        const liMenuElement = document.querySelector('#_com_liferay_product_navigation_product_menu_web_portlet_ProductMenuPortlet_site_administration_panel li');
        if (!liMenuElement) {
            return;
        }

        clearInterval(interval);

        const html = `<a aria-expanded="false" class="nav-link list-group-heading panel-header collapsed" href="/group/guest/~/control_panel/manage?p_p_id=com_liferay_journal_web_portlet_JournalPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_journal_web_portlet_JournalPortlet_mvcRenderCommandName=%2Fjournal%2Fedit_article&_com_liferay_journal_web_portlet_JournalPortlet_redirect=%2Fgroup%2Fguest%2F%7E%2Fcontrol_panel%2Fmanage%3Fp_p_id%3Dcom_liferay_journal_web_portlet_JournalPortlet%26p_p_lifecycle%3D0%26p_p_state%3Dmaximized%26p_p_mode%3Dview%26_com_liferay_journal_web_portlet_JournalPortlet_displayStyle%3Ddescriptive%26_com_liferay_journal_web_portlet_JournalPortlet_folderId%3D719056%26_com_liferay_journal_web_portlet_JournalPortlet_groupId%3D20117%26p_p_auth%3DiLMlc0kw&_com_liferay_journal_web_portlet_JournalPortlet_backURL=%2Fgroup%2Fguest%2F%7E%2Fcontrol_panel%2Fmanage%3Fp_p_id%3Dcom_liferay_journal_web_portlet_JournalPortlet%26p_p_lifecycle%3D0%26p_p_state%3Dmaximized%26p_p_mode%3Dview%26_com_liferay_journal_web_portlet_JournalPortlet_displayStyle%3Ddescriptive%26_com_liferay_journal_web_portlet_JournalPortlet_folderId%3D719056%26_com_liferay_journal_web_portlet_JournalPortlet_groupId%3D20117%26p_p_auth%3DiLMlc0kw&_com_liferay_journal_web_portlet_JournalPortlet_backURLTitle=B%C3%A0i+vi%E1%BA%BFt-C%E1%BA%A5u+tr%C3%BAc-Bi%E1%BB%83u+m%E1%BA%ABu&_com_liferay_journal_web_portlet_JournalPortlet_ddmStructureId=38305&_com_liferay_journal_web_portlet_JournalPortlet_folderId=719056&_com_liferay_journal_web_portlet_JournalPortlet_groupId=20117&_com_liferay_journal_web_portlet_JournalPortlet_showSelectFolder=false&p_p_auth=iLMlc0kw" role="menuitem" tabindex="0">
            Tạo nhanh Tin tức hoạt động
        </a>`;

        if (liMenuElement.querySelector('[href*="ddmStructureId=38305"]')) {
            return;
        }

        liMenuElement.insertAdjacentHTML('afterbegin', html);
    }, 50);
}


async function __custom_admin_js() {
    const screen = __getCurrentLiferayScreen();

    const isPageCreateNewPost = screen.portletId === 'com_liferay_journal_web_portlet_JournalPortlet';

    setTimeout(__appendCreateNewPostToLeftMenu, 10);

    if (isPageCreateNewPost) {
        const currentTryCount = 1;
        const maxTry = 100;
        const timeRetry = 300;

        const hiddenInputPublistDateInterval = setInterval(() => {
            if (currentTryCount > maxTry) {
                clearInterval(hiddenInputPublistDateInterval);
                return;
            }

            // hidden input publish date
            const inputPublishDate = document.querySelector('[data-field-name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Date75635616"]');
            if (inputPublishDate) {
                clearInterval(hiddenInputPublistDateInterval);
                __setDefaultValueForInputPublishInNewPost();
            }

            // group post type
            const groupPostType = document.querySelector('[aria-labelledby^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Radio68088030"]');
            if (groupPostType) {
                clearInterval(hiddenInputPublistDateInterval);
                __setDefaultPostTypeInNewPost();
            }
        }, timeRetry);
    }
}

(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', __custom_admin_js);
    } else {
        __custom_admin_js();
    }
})();
