(() => {
  const get = window.waitForElement || null;
  const set = window.__reactJs_setValueForInput || null;
  const WEB_CONTENT_FORM_MAPPING_CACHE_KEY = 'vec_webcontent_form_mapping_settings_cache';
  const WEB_CONTENT_FORM_MAPPING_CACHE_TTL = 24 * 60 * 60 * 1000;

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

  function readWebContentFormMappingCache() {
    try {
      const raw = window.localStorage.getItem(WEB_CONTENT_FORM_MAPPING_CACHE_KEY);

      if (!raw) {
        return null;
      }

      const cacheEntry = JSON.parse(raw);

      if (!cacheEntry || !cacheEntry.ts || !Array.isArray(cacheEntry.items)) {
        return null;
      }

      if (Date.now() - cacheEntry.ts > WEB_CONTENT_FORM_MAPPING_CACHE_TTL) {
        window.localStorage.removeItem(WEB_CONTENT_FORM_MAPPING_CACHE_KEY);
        return null;
      }

      return cacheEntry.items;
    } catch (error) {
      return null;
    }
  }

  function writeWebContentFormMappingCache(items) {
    try {
      window.localStorage.setItem(WEB_CONTENT_FORM_MAPPING_CACHE_KEY, JSON.stringify({
        ts: Date.now(),
        items,
      }));
    } catch (error) {
    }
  }

  function buildWebContentFormMappingData(items, folderId) {
    return items.reduce((acc, item) => {
      const folderID = item?.folderID;
      const structureID = item?.structureID;
      const categoryIDs = item?.categoryIDs || '';
      const displayPageID = item?.displayPageID || '';
      const tags = item?.tags || '';

      if (!folderID || !structureID || String(folderID) !== String(folderId)) {
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
  }

  async function getWebContentFormMappingSettings() {
    const folderId = __fcnw_urlParam.portletParams.folderId || '0';
    const csrfToken = window.Liferay?.authToken || '';

    try {
      let items = readWebContentFormMappingCache();

      if (!items) {
        const response = await fetch('/o/c/webcontentformmappingsettingses/?pageSize=200', {
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

        items = Array.isArray(result?.items) ? result.items : [];
        writeWebContentFormMappingCache(items);
      }

      return buildWebContentFormMappingData(items, folderId);
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
      get('[data-qa-id="creationMenuNewButton"]', (btn) => {
        document.querySelectorAll('[data-qa-id="creationMenuNewButton"]').forEach((btn) => {
          btn.style.setProperty('display', 'none', 'important');
        });
      });
      return;
    }

    const currentFolderMapping = mappingData[folderId];
    const newStructId = currentFolderMapping.structureID;

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
