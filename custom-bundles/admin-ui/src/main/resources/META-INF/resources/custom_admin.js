function waitForElement(selector, callback, { maxTry = 50, interval = 100 } = {}) {
    return new Promise((resolve) => {
        let tryCount = 0;
        const timer = setInterval(() => {
            if (++tryCount > maxTry) {
                clearInterval(timer);
                resolve(false);
                return;
            }
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                callback?.(el);
                resolve(el);
            }
        }, interval);
    });
}

function forceSetDisplayPage(fields) {
    const ns = '_com_liferay_journal_web_portlet_JournalPortlet_';

    //   const fields = {
    //     assetDisplayPageId: '181120',
    //     displayPageType: '2',
    //     layoutUuid: '',
    //   };

    function fireEvents(el) {
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    function setAllByName(name, value) {
        const elements = [...document.querySelectorAll(`[name="${name}"]`)];

        elements.forEach((el) => {
            el.disabled = false;
            el.removeAttribute('disabled');

            el.value = value;
            el.setAttribute('value', value);

            fireEvents(el);
        });

        return elements;
    }

    if (fields.name) {
        waitForElement('label[for="_com_liferay_journal_web_portlet_JournalPortlet_assetDisplayPageId"]', (el) => {
            const input = el.parentNode.querySelector('input');
            if (input) {
                input.value = fields.name;
                fireEvents(input);
            }
        });
    }

    Object.entries(fields).forEach(([key, value]) => {
        setAllByName(`${ns}${key}`, value);
    });
}

function repeatCallback(callback, times = 3, intervalMs = 300) {
    if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function');
    }

    if (times <= 0) {
        return () => { };
    }

    let count = 0;
    let timerId = null;

    const run = () => {
        count++;

        callback(count);

        if (count >= times) {
            clearInterval(timerId);
        }
    };

    run();

    if (times > 1) {
        timerId = setInterval(run, intervalMs);
    }

    return () => {
        clearInterval(timerId);
    };
}

function parseJson(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

window.waitForElement = waitForElement;

function __getUserRole() {
    return new Promise((resolve) => {
        window.Liferay.Service(
            "/role/get-user-roles",
            { userId: window.Liferay.ThemeDisplay.getUserId() },
            resolve,
            () => resolve([]),
        );
    })
}

function __isCustomAdminStandalonePage() {
    return window.location.pathname.startsWith('/o/vec-custom-admin-ui/');
}

function __reactJs_setValueForInput(input, value) {
    const proto = input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    let nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value');
    if (nativeSetter && nativeSetter.set) {
        nativeSetter = nativeSetter.set;
        nativeSetter.call(input, value);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('blur', { bubbles: true }));
    } else {
        input.value = value;
    }
}

function __getCurrentLiferayScreen() {
    const params = new URLSearchParams(window.location.search);
    const portletId = params.get('p_p_id') ?? '';

    // Tách suffix ngắn gọn hơn (phần sau dấu _ cuối cùng nếu có)
    const shortId = portletId.split('_').pop(); // "R6F7" — unique per instance

    // Các param riêng của portlet đó đều có prefix:
    const prefix = `_${portletId}_`;
    const explicitKeys = new Set(['p_p_id', 'p_p_lifecycle', 'p_p_state', 'p_v_l_s_g_id']);
    const portletParams = {};
    const remainingParams = {};
    for (const [key, val] of params.entries()) {
        if (key.startsWith(prefix)) {
            portletParams[key.replace(prefix, '')] = val;
        } else if (!explicitKeys.has(key)) {
            remainingParams[key] = val;
        }
    }

    let redirectUrl = params.get('redirectUrl');
    if (!redirectUrl) {
        redirectUrl = params.get('_com_liferay_login_web_portlet_LoginPortlet_redirect');
    }
    if (!redirectUrl) {
        if (typeof remainingParams.portletParams !== 'undefined') {
            redirectUrl = remainingParams.portletParams.redirect;
        }
    }
    if (!redirectUrl) {
        redirectUrl = params.get('redirect');
    }
    if (!redirectUrl) {
        redirectUrl = '';
    }

    return {
        portletId,
        shortId,
        lifecycle: params.get('p_p_lifecycle'),
        state: params.get('p_p_state'),
        groupId: params.get('p_v_l_s_g_id'),
        portletParams,
        objectDefinitionId: params.get('_com_liferay_object_web_internal_object_definitions_portlet_ObjectDefinitionsPortlet_S4B0_objectDefinitionId'),
        redirectUrl,
        ...remainingParams,
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

    const parentNode = inputPublishDate.closest('.ddm-row');
    if (parentNode) {
        parentNode.style.display = 'none';
    }

    const setValue = (selector, value) => {
        const input = inputPublishDate.querySelector(selector);
        if (input) __reactJs_setValueForInput(input, value);
    };

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

    const inputChecked = document.querySelector('[data-field-name*="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Radio68088030"] input:checked');
    if (inputChecked) {
        return;
    }

    const input = groupEl.querySelector('input[value="Option92128051"]');
    if (input) {
        input.click();
    }
}

function __appendAIChatHistoryAndAuditLogMenu() {
    const ATTR_AI_CHAT = 'data-vec-ai-history';
    const ATTR_AUDIT_LOG = 'data-vec-audit-log';
    const roleCanAccess = [
        '20100',
    ];

    if (!window.Liferay) {
        setTimeout(__appendAIChatHistoryAndAuditLogMenu, 50);
        return;
    }

    const userId = window.Liferay.ThemeDisplay.getUserId();
    window.Liferay.Service('/role/get-user-roles', { userId }, (roles) => {
        const isAllowed = roles.some(r => roleCanAccess.includes(r.roleId));
        if (!isAllowed) {
            return;
        }

        waitForElement(
            '#_com_liferay_product_navigation_product_menu_web_portlet_ProductMenuPortlet_site_administration_panel',
            (panel) => {
                if (!panel.querySelector('[' + ATTR_AI_CHAT + ']')) {
                    const link = document.createElement('a');
                    link.setAttribute(ATTR_AI_CHAT, '1');
                    link.className = 'nav-link list-group-heading panel-header collapsed';
                    link.href = '/o/vec-custom-admin-ui/chat-history.html';
                    link.target = '_blank';
                    link.setAttribute('role', 'menuitem');
                    link.textContent = 'Xem lịch sử AI';

                    panel.appendChild(link);
                }

                if (!panel.querySelector('[' + ATTR_AUDIT_LOG + ']')) {
                    const link = document.createElement('a');
                    link.setAttribute(ATTR_AUDIT_LOG, '1');
                    link.className = 'nav-link list-group-heading panel-header collapsed';
                    link.href = '/web/guest/audit-log';
                    link.setAttribute('role', 'menuitem');
                    link.textContent = 'Nhật ký kiểm tra';

                    panel.appendChild(link);
                }
            },
            { maxTry: 200, interval: 50 }
        );
    });
}

function __appendOnlyAdminMenu() {
    const roleCanAccess = [
        '20100', // admin role id
    ];

    if (!window.Liferay) {
        return;
    }

    const userId = window.Liferay.ThemeDisplay.getUserId();
    window.Liferay.Service('/role/get-user-roles', { userId }, (roles) => {
        const isAllowed = roles.some(r => roleCanAccess.includes(r.roleId));
        if (!isAllowed) {
            return;
        }

        waitForElement(
            '[aria-labelledby="panel-manage-site_administration_configuration-link"]',
            (panel) => {
                const ATTR_MODULE_MANAGER = 'data-vec-module-manager';
                if (!panel.querySelector('[' + ATTR_MODULE_MANAGER + ']')) {
                    const html = `
                    <li class=" nav-item" role="presentation">
                        <a data-vec-module-manager="1" id="data-vec-module-manager" class="nav-link" href="/web/guest/module-manager" role="menuitem" tabindex="-1">
                            Quản lý module hệ thống
                        </a>
                    </li>`;

                    panel.insertAdjacentHTML('beforeend', html);
                }
            },
            { maxTry: 200, interval: 50 }
        );
    });
}

async function __appendCreateNewPostToLeftMenu() {
    const userRole = await __getUserRole();
    const roleCanAccess = [
        '20100',
        '1384085'
    ];

    let canAccess = false;
    for (const role of userRole) {
        if (roleCanAccess.includes(role.roleId)) {
            canAccess = true;
            break;
        }
    }

    if (!canAccess) {
        return;
    }

    const html = `<a aria-expanded="false" class="nav-link list-group-heading panel-header collapsed" href="/group/guest/~/control_panel/manage?p_p_id=com_liferay_journal_web_portlet_JournalPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_journal_web_portlet_JournalPortlet_mvcRenderCommandName=%2Fjournal%2Fedit_article&_com_liferay_journal_web_portlet_JournalPortlet_redirect=%2Fgroup%2Fguest%2F~%2Fcontrol_panel%2Fmanage%3Fp_p_id%3Dcom_liferay_journal_web_portlet_JournalPortlet%26p_p_lifecycle%3D0%26p_p_state%3Dmaximized%26p_p_mode%3Dview%26_com_liferay_journal_web_portlet_JournalPortlet_displayStyle%3Ddescriptive%26_com_liferay_journal_web_portlet_JournalPortlet_folderId%3D1414353%26_com_liferay_journal_web_portlet_JournalPortlet_groupId%3D20117%26p_p_auth%3DdlLYWvGG&_com_liferay_journal_web_portlet_JournalPortlet_backURL=%2Fgroup%2Fguest%2F~%2Fcontrol_panel%2Fmanage%3Fp_p_id%3Dcom_liferay_journal_web_portlet_JournalPortlet%26p_p_lifecycle%3D0%26p_p_state%3Dmaximized%26p_p_mode%3Dview%26_com_liferay_journal_web_portlet_JournalPortlet_displayStyle%3Ddescriptive%26_com_liferay_journal_web_portlet_JournalPortlet_folderId%3D1414353%26_com_liferay_journal_web_portlet_JournalPortlet_groupId%3D20117%26p_p_auth%3DdlLYWvGG&_com_liferay_journal_web_portlet_JournalPortlet_backURLTitle=Bài+viết+-+Cấu+trúc+-+Biểu+mẫu&_com_liferay_journal_web_portlet_JournalPortlet_ddmStructureId=38305&_com_liferay_journal_web_portlet_JournalPortlet_folderId=1414353&_com_liferay_journal_web_portlet_JournalPortlet_groupId=20117&_com_liferay_journal_web_portlet_JournalPortlet_showSelectFolder=false&p_p_auth=dlLYWvGG&_com_liferay_journal_web_portlet_JournalPortlet_isCreateHotNew=1" role="menuitem" tabindex="0">
        Tạo Tin vắn
    </a>`;

    waitForElement(
        '#_com_liferay_product_navigation_product_menu_web_portlet_ProductMenuPortlet_site_administration_panel li',
        (liMenuElement) => {
            if (liMenuElement.querySelector('[href*="ddmStructureId=38305"]')) return;
            liMenuElement.insertAdjacentHTML('afterbegin', html);
        },
        { maxTry: 200, interval: 50 }
    );
}

function __appendWebContentStatisticsMenu() {
    const screenData = __getCurrentLiferayScreen();
    if (screenData.portletId !== 'com_liferay_journal_web_portlet_JournalPortlet') {
        return;
    }

    const token = window.Liferay.authToken || 'IwcBcpOP';
    const groupId = screenData.groupId || screenData.portletParams.groupId || '20117';
    const folderId = screenData.portletParams?.folderId || null;

    let href = `/o/vec-admin/v1.0/webcontent-statistics/export.xlsx?groupId=${encodeURIComponent(groupId)}&status=-1&latestOnly=true&includeRawData=false&p_auth=${encodeURIComponent(token)}`;
    if (!!folderId) {
        href += `&folderId=${encodeURIComponent(folderId)}`;
    }

    waitForElement('[data-qa-id="creationMenuNewButton"]', (btn) => {
        const liParent = btn.closest('li');
        liParent.insertAdjacentHTML('beforebegin', `
            <li class="nav-item">
                <a href="${href}" class="btn btn-success btn-sm">
                    Xuất báo cáo
                </a>
            </li>
        `);
    });
}

function __appendWebContentAdvancedSearchMenu() {
    const screenData = __getCurrentLiferayScreen();
    const ATTR_BUTTON = 'data-vec-advanced-search-button';

    if (screenData.portletId !== 'com_liferay_journal_web_portlet_JournalPortlet') {
        return;
    }

    const params = new URLSearchParams();
    const groupId = screenData.groupId || screenData.portletParams.groupId;
    const folderId = screenData.portletParams && screenData.portletParams.folderId;

    if (groupId) {
        params.set('groupId', groupId);
    }

    if (folderId) {
        params.set('folderId', folderId);
    }

    params.set('pageSize', '20');
    params.set('sortField', 'modifiedDate');
    params.set('sortOrder', 'desc');

    params.set('backUrl', window.location.href);
    const href = '/web/guest/web-content-advance-search?' + params.toString();

    waitForElement('[data-qa-id="creationMenuNewButton"]', (button) => {
        const listItem = button.closest('li');
        const parentList = listItem ? listItem.parentNode : null;

        if (!listItem || !parentList || parentList.querySelector('[' + ATTR_BUTTON + ']')) {
            return;
        }

        const li = document.createElement('li');
        li.className = 'nav-item';

        li.innerHTML = '' +
            '<a ' +
            ATTR_BUTTON + '="1" ' +
            'href="' + href + '" ' +
            'rel="noopener noreferrer" ' +
            'class="btn btn-secondary btn-sm ml-2">' +
            'Tìm kiếm nâng cao' +
            '</a>';

        listItem.insertAdjacentElement('beforebegin', li);
    });
}

function __appendButtonImportCourtFee() {
    waitForElement('[data-testid="fdsCreationActionButton"]', (buttonCreate) => {
        const parentUl = buttonCreate.closest('ul');
        if (!parentUl) return;

        parentUl.insertAdjacentHTML('beforeend', `
<li class="nav-item">
  <a href="/web/guest/nhap-gia-cuoc-tuyen-duong" target="_blank">
    <button class="nav-btn nav-btn-monospaced btn btn-success" type="button" aria-label="Upload Thông tin trạm thu phí"
      data-testid="fdsUploadActionButton" data-tooltip-align="top" title="Upload Thông tin trạm thu phí">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="lucide lucide-upload-icon lucide-upload">
        <path d="M12 3v12"></path>
        <path d="m17 8-5-5-5 5"></path>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      </svg>
    </button>
  </a>
</li>
`);
    });
}

async function __customizeFormCreatePost() {
    const screen = __getCurrentLiferayScreen();

    waitForElement('[aria-controls="_com_liferay_journal_web_portlet_JournalPortlet_fieldsContent"]', () => {
        document.querySelector('[aria-controls="_com_liferay_journal_web_portlet_JournalPortlet_fieldsContent"]').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
        });
    });

    const folderId = screen.portletParams?.folderId;
    const folderIdsIntranet = [
        "1215213",
        "1216901",
        "1216903",
        "1216899",
        "1216897",
        "1215252",
    ];
    waitForElement('fieldset#categorization', (fieldset) => {
        if (folderIdsIntranet.includes(folderId)) {
            const idsHidden = [
                'namespace_assetCategoriesSelector_49318',
                'namespace_assetCategoriesSelector_63815',
                'namespace_assetCategoriesSelector_36237',
                'namespace_assetCategoriesSelector_1035270',
                'namespace_assetCategoriesSelector_38320',
            ];
            for (const id of idsHidden) {
                waitForElement(`#${id}`, (element) => {
                    element.style.display = 'none';
                });
            }
        }
        fieldset.classList.add('show');
    });

    const stateElement = await waitForElement('[name="_com_liferay_journal_web_portlet_JournalPortlet_titleMapAsXML"]');
    if (!stateElement) {
        return;
    }

    const headingSelectorsMapping = [
        '[name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Text64056903"]',
        '[name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Text05273714"]',
        '[name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Text89111708"]',
        '[name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Text54004659"]',
        '[name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Text89111708"]',
        '[name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Text19236682"]',
        '[name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Text30616905"]',
    ];

    for (const selector of headingSelectorsMapping) {
        waitForElement(selector, (element) => {
            const targetInput = document.querySelector('[name="_com_liferay_journal_web_portlet_JournalPortlet_titleMapAsXML"]');
            if (targetInput) {
                element.addEventListener('input', (e) => {
                    __reactJs_setValueForInput(targetInput, e.target.value);
                });
            }
        }, { maxTry: 20, interval: 300 });
    }

    waitForElement("#_com_liferay_journal_web_portlet_JournalPortlet_selectDisplayPageType", (element) => {
        __reactJs_setValueForInput(element, '2');
    });

    waitForElement('#_com_liferay_journal_web_portlet_JournalPortlet_Aria', (element) => {
        element.innerText = 'Tiêu đề của Metadata';
    });

    (() => {
        if (!screen.portletParams?.defaultData) {
            return;
        }

        const defaultData = parseJson(screen.portletParams.defaultData);
        if (!defaultData) {
            return;
        }

        if (defaultData.displayPageID) {
            const data = parseJson(defaultData.displayPageID);
            repeatCallback(() => {
                forceSetDisplayPage({
                    assetDisplayPageId: data.id,
                    displayPageType: '2',
                    // layoutUuid: data.uuid,
                    name: data.name
                })
            }, 5, 3000);
        }

        if (defaultData.categoryIDs) {
            const categoryIds = parseJson(defaultData.categoryIDs) ?? [];

            for (const data of categoryIds) {
                waitForElement(`#${data.id_selector}`).then((el) => {
                    const groupEl = el.querySelector('.input-group-item.d-contents');
                    if (groupEl) {
                        groupEl.insertAdjacentHTML('beforeend', `
                        <span role="row" tabindex="-1" class="label label-secondary">
                            <span id="clay-id-27-label-${data.id}-span" role="gridcell" tabindex="-1" class="label-item label-item-expand" style="outline: none;">
                                ${data.title}
                            </span>
                            <span role="gridcell" class="label-item label-item-after">
                                <button aria-label="Remove ${data.title}" class="close" id="clay-id-27-label-${data.id}-close" tabindex="-1" type="button">
                                    <svg class="lexicon-icon lexicon-icon-times-small" role="presentation">
                                        <use href="/o/admin-theme/images/clay/icons.svg#times-small"></use>
                                    </svg>
                                </button>
                            </span>
                        </span>
                        <input name="_com_liferay_journal_web_portlet_JournalPortlet_assetCategoryIds_38320" type="hidden" value="${data.id}">
                    `);
                        groupEl.querySelector(`#clay-id-27-label-${data.id}-close`).addEventListener('click', function () {
                            const parent = this.closest('[role="row"]');
                            parent.nextElementSibling.remove();
                            parent.remove();
                        });
                    }
                });
            }
        }
    })();
}

function __hiddenFramentDefaultList() {
    const hiddenElement = (element) => {
        const menubar = element.closest('.menubar');
        if (!menubar) {
            return false;
        }
        const scope = menubar.parentNode;
        if (!scope) {
            return false;
        }
        scope.style.display = 'none';
        scope.previousElementSibling.style.display = 'none';

        setTimeout(() => {
            const leftCol = document.querySelector('#portlet_com_liferay_fragment_web_portlet_FragmentPortlet .col-lg-3');
            if (leftCol) {
                leftCol.style.opacity = '1';
            }
        }, 100);

        return true;
    }
    waitForElement('a[href*="_com_liferay_fragment_web_portlet_FragmentPortlet_fragmentCollectionKey=COMMERCE_ACCOUNT_FRAGMENTS"]', hiddenElement);
}

function __redirectToHomepageIfNotCorrectLoginScreen() {
    const pathname = window.location.pathname;
    const screenData = __getCurrentLiferayScreen();

    if (pathname.endsWith('/login') && screenData.portletId === 'com_liferay_login_web_portlet_LoginPortlet') {
        const hasRedirect = typeof screenData.redirectUrl !== 'undefined' && !!screenData.redirectUrl;
        if (hasRedirect) {
            window.location.href = '/c/admin?redirect=' + screenData.redirectUrl;
        } else {
            window.location.href = '/';
        }
    }
}

function __redirectMyWorkflowTasksLink() {
    console.log('__redirectMyWorkflowTasksLink ran');
    const SELECTOR = 'a[href*="com_liferay_portal_workflow_task_web_portlet_MyWorkflowTaskPortlet"]';
    const ATTR_OLD = 'data-old-href';

    // URI hiện tại để màn workflow-tasks biết quay lại đâu.
    const backUri = window.location.pathname + window.location.search;
    const newHref = '/web/guest/workflow-tasks?backUrl=' +
        encodeURIComponent(backUri);

    const rewrite = (anchor) => {
        if (anchor.getAttribute(ATTR_OLD)) {
            return;
        }
        anchor.setAttribute(ATTR_OLD, anchor.getAttribute('href'));
        anchor.setAttribute('href', newHref);
    };

    waitForElement(
        SELECTOR,
        () => {
            document.querySelectorAll(`${SELECTOR}:not([${ATTR_OLD}])`).forEach(rewrite);
        },
        { maxTry: 200, interval: 50 }
    );
}

function __initTableScroll(scrollClass = 'table-scrollable-horizotal') {
    const INTERACTIVE_SELECTOR = [
        'a',
        'button',
        'input',
        'select',
        'textarea',
        'label',
        'summary',
        'video',
        'audio',
        'iframe',
        '[onclick]',
        '[role="button"]',
        '[role="link"]',
        '[contenteditable="true"]',
        '[data-drag-scroll-ignore]',
        '.dnd-th-resizer',
    ].join(',');

    document.querySelectorAll(`.${scrollClass}`).forEach((el) => {
        if (el.classList.contains(`${scrollClass}-initialized`)) {
            return;
        }

        el.classList.add(`${scrollClass}-initialized`);

        let isPointerDown = false;
        let isDragging = false;
        let startX = 0;
        let startScrollLeft = 0;
        let pointerId = null;

        el.addEventListener(
            'pointerdown',
            function (event) {
                if (event.pointerType === 'mouse' && event.button !== 0) return;

                if (event.target.closest(INTERACTIVE_SELECTOR)) return;

                if (el.scrollWidth <= el.clientWidth) return;

                isPointerDown = true;
                isDragging = false;
                pointerId = event.pointerId;

                startX = event.clientX;
                startScrollLeft = el.scrollLeft;

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                el.setPointerCapture(pointerId);
            },
            true,
        );

        el.addEventListener(
            'pointermove',
            function (event) {
                if (!isPointerDown) return;

                const deltaX = event.clientX - startX;

                if (Math.abs(deltaX) > 5) {
                    isDragging = true;

                    el.classList.add('is-dragging');
                    document.documentElement.classList.add('table-horizontal-dragging');
                }

                if (isDragging) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();

                    el.scrollLeft = startScrollLeft - deltaX;
                }
            },
            true
        );

        el.addEventListener(
            'pointerup',
            function (event) {
                if (isDragging) {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                }

                endDrag();
            },
            true
        );

        el.addEventListener('pointercancel', endDrag, true);
        el.addEventListener('lostpointercapture', endDrag, true);

        el.addEventListener(
            'dragstart',
            function (event) {
                if (event.target.closest(INTERACTIVE_SELECTOR)) return;

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            },
            true
        );

        el.addEventListener(
            'click',
            function (event) {
                if (!isDragging) return;

                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            },
            true
        );

        function endDrag() {
            if (!isPointerDown) return;

            if (pointerId !== null) {
                try {
                    el.releasePointerCapture(pointerId);
                } catch (_) { }
            }

            isPointerDown = false;
            pointerId = null;

            setTimeout(() => {
                isDragging = false;
                el.classList.remove('is-dragging');
                document.documentElement.classList.remove('table-horizontal-dragging');
            }, 0);
        }
    });
};

function __appendTableScrollToListElement() {
    const elements = [
        '[data-searchcontainerid="_com_liferay_asset_list_web_portlet_AssetListPortlet_assetListEntries"]',
        '[data-searchcontainerid="_com_liferay_journal_web_portlet_JournalPortlet_articles"]',
        '[data-searchcontainerid="_com_liferay_journal_web_portlet_JournalPortlet_ddmStructures"]',
        '[data-searchcontainerid="_com_liferay_asset_categories_admin_web_portlet_AssetCategoriesAdminPortlet_assetCategories"]',
        '[id^="portlet_com_liferay_object_web_internal_object_definitions_portlet_ObjectDefinitionsPortlet"] .data-set-content-wrapper .dnd-table .dnd-tbody',
    ];

    setInterval(() => {
        elements.forEach((selector) => {
            waitForElement(selector, (el) => {
                if (!el.classList.contains('table-scrollable-horizotal')) {
                    el.parentNode.classList.add('table-scrollable-horizotal');
                }
                __initTableScroll();
            });
        });
    }, 2000);
}

function __initGlobalFolder(folderId = "1388027") {
    waitForElement(`[data-folder-id="${folderId}"]`, (item) => {
        const checkboxWrapper = item.querySelector('.custom-control.custom-checkbox');
        if (checkboxWrapper) {
            checkboxWrapper.querySelector('input[type="checkbox"]').style.display = 'none';
            checkboxWrapper.querySelector('.custom-control-label').style.display = 'none';
        }

        const dropdownBtn = item.querySelector('.dropdown-toggle');
        if (dropdownBtn) {
            dropdownBtn.addEventListener('click', function () {
                setTimeout(function () {
                    const menuId = dropdownBtn.getAttribute('aria-controls');
                    const menu = document.getElementById(menuId);
                    if (!menu) return;

                    menu.querySelectorAll('li').forEach(function (li) {
                        if (!li.textContent.trim().toLowerCase().includes('permission')) {
                            li.style.display = 'none';
                        }
                    });
                }, 150);
            });
        }

        item.style.order = '-1';
        item.style.gridColumn = '1 / -1';
        item.style.width = '100%';
        item.style.maxWidth = '100%';

        const folderLink = item.querySelector('a.text-truncate');
        const folderUrl = folderLink ? folderLink.href : null;

        item.addEventListener('click', function (e) {
            if (e.target.closest('.dropdown')) return;
            e.stopImmediatePropagation();
            e.preventDefault();
            if (folderUrl) window.location.href = folderUrl;
        }, true);

        item.style.cursor = 'pointer';
    });
}

async function __custom_admin_js() {
    if (__isCustomAdminStandalonePage()) {
        return;
    }

    const screen = __getCurrentLiferayScreen();

    const isPageCreateNewPost = screen.shortId === 'JournalPortlet'
        && screen.portletParams.articleId === undefined
        && screen.portletParams.mvcRenderCommandName === '/journal/edit_article';

    const isSettingCourtFee = screen.portletId.includes('com_liferay_object_web_internal_object_definitions_portlet_ObjectDefinitionsPortlet')
        && screen.groupId === '20117'
        && screen.objectDefinitionId === '42207';

    const isUsersAdminPage = screen.portletId === 'com_liferay_users_admin_web_portlet_UsersAdminPortlet';

    __redirectToHomepageIfNotCorrectLoginScreen();
    __appendOnlyAdminMenu();
    __appendAIChatHistoryAndAuditLogMenu();
    __appendCreateNewPostToLeftMenu();
    __appendWebContentStatisticsMenu();
    __appendWebContentAdvancedSearchMenu();
    __hiddenFramentDefaultList();
    __appendTableScrollToListElement();
    __initGlobalFolder();
    repeatCallback(__redirectMyWorkflowTasksLink, 5, 1000);

    if (isPageCreateNewPost) {
        waitForElement(
            '[data-field-name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Date75635616"]',
            () => __setDefaultValueForInputPublishInNewPost()
        );
        waitForElement(
            '[aria-labelledby^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Radio68088030"]',
            () => __setDefaultPostTypeInNewPost()
        );

        try {
            __customizeFormCreatePost();
        } catch {
            console.error('Custom Admin: Failed to customize form create post');
        }
    }

    if (isSettingCourtFee) {
        __appendButtonImportCourtFee();
    }

    if (isUsersAdminPage && typeof window.__initDownloadUser === 'function') {
        window.__initDownloadUser();
    }
}

(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', __custom_admin_js);
    } else {
        __custom_admin_js();
    }
})();

// === CKEditor Custom Override ===
(function loadCKEditorOverride() {
    if (__isCustomAdminStandalonePage()) {
        return;
    }

    function load() {
        var script = document.createElement('script');
        script.src = '/o/vec-custom-admin-ui/js/ckeditor_override.js?v=' + Date.now();
        script.async = true;
        script.onerror = function () {
            console.warn('[Admin UI] Could not load ckeditor_override.js');
        };
        document.head.appendChild(script);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', load);
    } else {
        load();
    }
})();
