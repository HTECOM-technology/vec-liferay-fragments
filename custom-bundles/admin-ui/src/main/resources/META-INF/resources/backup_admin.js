(function () {
    if (window.location.pathname.startsWith('/o/vec-custom-admin-ui/')) {
        return;
    }

    const MENU_ATTR = 'data-vec-backup-restore-menu';
    const BACKUP_URL = '/backup-restore';
    const TARGET_SELECTOR = 'a[href*="com_liferay_staging_processes_web_portlet_StagingProcessesPortlet"]';

    function waitForElement(selector, callback, { maxTry = 200, interval = 100 } = {}) {
        let tryCount = 0;
        const timer = setInterval(() => {
            if (++tryCount > maxTry) {
                clearInterval(timer);
                return;
            }

            const element = document.querySelector(selector);
            if (!element) {
                return;
            }

            clearInterval(timer);
            callback(element);
        }, interval);
    }

    function createMenuLink() {
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = BACKUP_URL;
        link.setAttribute('role', 'menuitem');
        link.setAttribute(MENU_ATTR, '1');
        link.textContent = 'Backup & Restore';

        return link;
    }

    function appendBackupMenu() {
        waitForElement(TARGET_SELECTOR, (targetLink) => {
            if (document.querySelector('[' + MENU_ATTR + ']')) {
                return;
            }

            const menuLink = createMenuLink();
            targetLink.insertAdjacentElement('beforebegin', menuLink);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', appendBackupMenu);
    } else {
        appendBackupMenu();
    }
})();
