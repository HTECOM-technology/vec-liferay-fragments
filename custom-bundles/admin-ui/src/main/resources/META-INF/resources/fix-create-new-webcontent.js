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

  async function getWebContentFormMappingSettings() {
    const folderId = __fcnw_urlParam.portletParams.folderId || '0';

    const csrfToken = window.Liferay?.authToken || '';
    try {
      const queryParams = new URLSearchParams({
        pageSize: '200',
        filter: `folderID eq '${folderId}'`,
      });

      const response = await fetch(`/o/c/webcontentformmappingsettingses/?${queryParams.toString()}`, {
        headers: {
          accept: 'application/json',
          'x-csrf-token': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        return {};
      }

      const result = await response.json();
      const items = Array.isArray(result?.items) ? result.items : [];

      return items.reduce((acc, item) => {
        const folderID = item?.folderID;
        const structureID = item?.structureID;
        const categoryIDs = item?.categoryIDs || '';
        const displayPageID = item?.displayPageID || '';
        const tags = item?.tags || '';

        if (!folderID || !structureID) {
          return acc;
        }

        acc[String(folderID)] = {
          categoryIDs: String(categoryIDs),
          structureID: String(structureID),
          displayPageID: String(displayPageID),
          folderID: String(folderID),
          tags: String(tags),
        };

        return acc;
      }, {});
    } catch (error) {
      return {};
    }
  }

  async function remakeWithCurrentFolderIdAndNewStructId() {
    if (__fcnw_urlParam.portletId !== 'com_liferay_journal_web_portlet_JournalPortlet') {
      return;
    }

    const folderId = __fcnw_urlParam.portletParams.folderId || '0';
    const mappingData = await getWebContentFormMappingSettings();

    const arrFolderWillReplace = Object.keys(mappingData);

    if (!arrFolderWillReplace.includes(folderId)) {
      return;
    }

    const currentFolderMapping = mappingData[folderId];
    const newStructId = currentFolderMapping.structureID;

    console.log('currentFolderMapping', currentFolderMapping);

    get('[id="clay-dropdown-menu-4"] [href*="JournalPortlet_ddmStructureId=38305"]', (el) => {
      const defaultUrl = el.getAttribute('href');
      let newUrl = replaceDdmStructureId(defaultUrl, newStructId);

      newUrl += `&_com_liferay_journal_web_portlet_JournalPortlet_defaultData=${encodeURIComponent(JSON.stringify(currentFolderMapping))}`;

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

  remakeWithCurrentFolderIdAndNewStructId();
})();
