(() => {
  const get = window.waitForElement || null;
  const set = window.__reactJs_setValueForInput || null;

  if (!get || !set) {
    return;
  }

  const __fcnw_urlParam = window.__getCurrentLiferayScreen();

  function replaceDdmStructureId(url, ddmStruct) {
    const paramName = '_com_liferay_journal_web_portlet_JournalPortlet_ddmStructureId';
    const parsedUrl = new URL(url, window.location.origin);

    parsedUrl.searchParams.set(paramName, String(ddmStruct));

    return parsedUrl.toString();
  }

  function remakeWithCurrentFolderIdAndNewStructId(currentFolderId, newStructId) {
    const folderId = __fcnw_urlParam.portletParams.folderId;

    console.log('folderId', folderId);
    console.log('currentFolderId', currentFolderId);

    if (folderId !== currentFolderId) {
      return;
    }

    get('[id="clay-dropdown-menu-4"] [href*="JournalPortlet_ddmStructureId=38305"]', (el) => {
      const defaultUrl = el.getAttribute('href');
      const newUrl = replaceDdmStructureId(defaultUrl, newStructId);

      get('[data-qa-id="creationMenuNewButton"]', (btn) => {
        const parent = btn.closest('.dropdown.creation-menu');

        parent.firstChild.classList.add('default-element-create-webcontent');
        parent.firstChild.style.display = 'none';

        parent.insertAdjacentHTML('beforeend', `
          <div class="custom-element-create-webcontent">
            <button class="dropdown-toggle nav-btn d-md-none nav-btn-monospaced btn btn-primary" type="button" title="Mới">
              <svg class="lexicon-icon lexicon-icon-plus" role="presentation">
                <use href="/o/admin-theme/images/clay/icons.svg#plus"></use>
              </svg>
            </button>
            <button class="dropdown-toggle nav-btn d-md-flex d-none btn btn-primary" type="button" title="Mới">
              <span class="d-md-block d-none pl-3 pr-3">Mới</span>
            </button>
          </div>
        `);

        get('.custom-element-create-webcontent', (customEl) => {
          const buttons = customEl.querySelectorAll('button');
          buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
              window.location.href = newUrl;
            });
          });
        })
      });
    });
  }

  const screenParam = window.__getCurrentLiferayScreen();
  const isWebContentScreen = screenParam.portletId === 'com_liferay_journal_web_portlet_JournalPortlet';

  if (!isWebContentScreen) {
    return;
  }

  // Hình ảnh banner ở trang chủ
  remakeWithCurrentFolderIdAndNewStructId('102538', '104412');
  remakeWithCurrentFolderIdAndNewStructId('1316505', '1316584');
})();
