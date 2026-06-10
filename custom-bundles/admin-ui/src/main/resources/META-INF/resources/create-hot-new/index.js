function __chn_forceSetDisplayPage() {
  const ns = '_com_liferay_journal_web_portlet_JournalPortlet_';

  const fields = {
    assetDisplayPageId: '181120',
    displayPageType: '2',
    layoutUuid: '',
  };

  function fireEvents(el) {
    el.dispatchEvent(new Event('input', {bubbles: true}));
    el.dispatchEvent(new Event('change', {bubbles: true}));
    el.dispatchEvent(new Event('blur', {bubbles: true}));
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

  Object.entries(fields).forEach(([key, value]) => {
    setAllByName(`${ns}${key}`, value);
  });
}

(() => {
  const get = window.waitForElement || null;
  const set = window.__reactJs_setValueForInput || null;

  if (!get || !set) {
    return;
  }

  get('[aria-controls="_com_liferay_journal_web_portlet_JournalPortlet_fieldsContent"]', (el) => {
    el.querySelector('span > div').innerText = 'Nội dung Tin vắn';
  });

  const fieldHidden = [
    'Text19450995',
    'Radio68088030',
    'Checkbox97101110',
    'Checkbox25277414',
    'Text77547655',
    'Image70093546',
  ];

  for (const field of fieldHidden) {
    get(`[data-field-name="${field}"]`, (el) => {
      el.closest('.ddm-row').style.display = 'none';
    });
  }

  get('[name^="_com_liferay_journal_web_portlet_JournalPortlet_ddm$$Checkbox25277414" ]', (el) => {
    if (!el.checked) {
      el.click();
    }
  });

  get('#namespace_assetCategoriesSelector_38320 .d-contents.input-group-prepend', (el) => {
    el.insertAdjacentHTML('beforeend', '<span role="row" tabindex="-1" class="label label-secondary"><span aria-describedby="clay-id-24" id="clay-id-27-label-38321-span" role="gridcell" tabindex="-1" class="label-item label-item-expand" style="outline: none;">Tin hoạt động</span><span role="gridcell" class="label-item label-item-after"><button aria-label="Remove Tin hoạt động" class="close" id="clay-id-27-label-38321-close" tabindex="0" type="button"><svg class="lexicon-icon lexicon-icon-times-small" role="presentation"><use href="/o/admin-theme/images/clay/icons.svg#times-small"></use></svg></button></span></span>');
    el.insertAdjacentHTML('beforeend', '<input name="_com_liferay_journal_web_portlet_JournalPortlet_assetCategoryIds_38320" type="hidden" value="38321">');
  });

  get('.contextual-sidebar.edit-article-sidebar', (el) => {
    el.classList.add('always-hidden');
  });

  get('[aria-controls="_com_liferay_journal_web_portlet_JournalPortlet_contextualSidebarContainer"]', (el) => {
    el.parentNode.style.display = 'none';
  });

  get('#_com_liferay_journal_web_portlet_JournalPortlet_fm1', (el) => {
    el.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  get('#_com_liferay_journal_web_portlet_JournalPortlet_fm1 [type="button"][form="_com_liferay_journal_web_portlet_JournalPortlet_fm1"]', (el) => {
    el.insertAdjacentHTML('afterend', '<div class="btn btn-primary" id="_fast_publish_custom">Xuất bản ngay</div>');
    
    const menu1 = el.parentNode.querySelector('[aria-controls="clay-dropdown-menu-1"]');
    if (menu1) {
      menu1.style.display = 'none';
    }

    get('#_fast_publish_custom', (elBtn) => {
      elBtn.addEventListener('click', () => {
        const btns = document.querySelectorAll('[type="button"][form="_com_liferay_journal_web_portlet_JournalPortlet_fm1"]');
        for (const btn of btns) {
          if (btn.closest('#_com_liferay_journal_web_portlet_JournalPortlet_fm1')) {
            continue;
          }
          btn.click();
        }
      });
    });
  });

  setTimeout(__chn_forceSetDisplayPage, 3000);
  setTimeout(__chn_forceSetDisplayPage, 6000);
  setTimeout(__chn_forceSetDisplayPage, 9000);
  setTimeout(__chn_forceSetDisplayPage, 12000);
})();
