(function () {
    if (window.location.pathname.startsWith('/o/vec-custom-admin-ui/')) {
        return;
    }

    const MENU_ATTR = 'data-vec-backup-restore-menu';
    const BACKUP_URL = '/backup-restore';
    const TARGET_SELECTOR = 'a[href*="com_liferay_staging_processes_web_portlet_StagingProcessesPortlet"]';

    function waitForElement(selector, callback, { maxTry = 50, interval = 100 } = {}) {
        return new Promise((resolve, reject) => {
            if (typeof document === 'undefined') {
                resolve(false);
                return;
            }

            let tryCount = 0;
            let timer = null;

            const check = async () => {
                let el;

                try {
                    el = document.querySelector(selector);
                } catch (error) {
                    if (timer) clearInterval(timer);
                    reject(error);
                    return;
                }

                if (el) {
                    if (timer) clearInterval(timer);

                    try {
                        await callback?.(el);
                        resolve(el);
                    } catch (error) {
                        reject(error);
                    }

                    return;
                }

                tryCount += 1;

                if (tryCount >= maxTry) {
                    if (timer) clearInterval(timer);
                    resolve(false);
                }
            };

            check(); // check ngay lập tức

            if (maxTry > 0) {
                timer = setInterval(check, interval);
            }
        });
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
