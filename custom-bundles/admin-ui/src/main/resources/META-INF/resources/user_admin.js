const COLUMNS_USER = [
    { key: "id", label: "ID (không chỉnh sửa)" },
    { key: "alternateName", label: "Tên đăng nhập" },
    { key: "emailAddress", label: "Email" },
    { key: "givenName", label: "Tên" },
    { key: "familyName", label: "Họ" },
    { key: "birthDate", label: "Ngày sinh" },
    { key: "gender", label: "Giới tính" },
    { key: "status", label: "Trạng thái" },
];

async function __exportUsersHandler(btn) {
    const BASE_URL = window.location.origin;
    const toast = (message, type) => window.Liferay.Util.openToast({ message, type });

    const setBtn = (loading) => {
        btn.disabled = loading;
        btn.innerText = loading ? "Đang xuất danh sách..." : "Xuất danh sách người dùng";
    };

    const buildFilename = () => {
        const now = new Date();
        const pad = n => String(n).padStart(2, "0");
        const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
        const time = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
        return `users_${date}_${time}.xlsx`;
    };

    const exportExcel = (users) => {
        const keys = COLUMNS_USER.map(c => c.key);
        const labels = COLUMNS_USER.map(c => c.label);
        const rows = users.map(u => COLUMNS_USER.map(c => u[c.key] ?? ""));

        const ws = window.XLSX.utils.aoa_to_sheet([keys, labels, ...rows]);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, "Users");

        const data = window.XLSX.write(wb, { bookType: "xlsx", type: "base64" });
        const a = Object.assign(document.createElement("a"), {
            href: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${data}`,
            download: buildFilename()
        });
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    setBtn(true);
    try {
        const allUsers = [];
        for (let page = 1; ; page++) {
            const res = await fetch(
                `${BASE_URL}/o/headless-admin-user/v1.0/user-accounts?filter=status eq 0 or status eq 5&page=${page}&pageSize=200`,
                { headers: { "Content-Type": "application/json", "x-csrf-token": window.Liferay.authToken }, credentials: "include" }
            );
            if (!res.ok) throw new Error("HTTP " + res.status);

            const { items = [], totalCount } = await res.json();
            allUsers.push(...items);
            if (!items.length || allUsers.length >= totalCount) break;
        }

        if (!allUsers.length) return toast("Không có user", "danger");

        exportExcel(allUsers);
        toast(`Export ${allUsers.length} user`, "success");
    } catch {
        toast("Lỗi", "danger");
    } finally {
        setBtn(false);
    }
}

async function __importUsersHandler(btn) {
    const BASE_URL = window.location.origin;
    const toast = (message, type) => window.Liferay.Util.openToast({ message, type });

    const OVERLAY_ID = '__importUsersOverlay';

    const showOverlay = () => {
        if (document.getElementById(OVERLAY_ID)) return;
        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:99999',
            'background:rgba(0,0,0,0.55)',
            'display:flex', 'align-items:center', 'justify-content:center',
        ].join(';');
        overlay.innerHTML = `
            <div style="background:#fff;border-radius:12px;padding:36px 48px;display:flex;flex-direction:column;align-items:center;gap:20px;min-width:280px;box-shadow:0 8px 32px rgba(0,0,0,0.18);">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0b5fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="animation:__importSpin 1s linear infinite;">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <span style="font-size:15px;font-weight:600;color:#333;text-align:center;">Đang nhập người dùng vào hệ thống</span>
            </div>
            <style>@keyframes __importSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style>
        `;
        document.body.appendChild(overlay);
        btn.disabled = true;
    };

    const removeOverlay = () => {
        document.getElementById(OVERLAY_ID)?.remove();
        btn.disabled = false;
    };

    const ERROR_OVERLAY_ID = '__importUsersErrorOverlay';

    const showErrorOverlay = (errors) => {
        document.getElementById(ERROR_OVERLAY_ID)?.remove();
        const overlay = document.createElement('div');
        overlay.id = ERROR_OVERLAY_ID;
        overlay.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:100000',
            'background:rgba(0,0,0,0.55)',
            'display:flex', 'align-items:center', 'justify-content:center',
        ].join(';');
        const listItems = errors.map(e => `<li style="padding:4px 0;border-bottom:1px solid #f3e0e0;color:#c0392b;">${e}</li>`).join('');
        overlay.innerHTML = `
            <div style="background:#fff;border-radius:12px;padding:32px 40px;display:flex;flex-direction:column;gap:16px;min-width:360px;max-width:600px;max-height:80vh;box-shadow:0 8px 32px rgba(0,0,0,0.18);">
                <div style="display:flex;align-items:center;gap:10px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span style="font-size:16px;font-weight:700;color:#c0392b;">File có ${errors.length} lỗi</span>
                </div>
                <ul style="margin:0;padding:0 0 0 4px;list-style:none;overflow-y:auto;max-height:50vh;font-size:13px;">
                    ${listItems}
                </ul>
                <button id="${ERROR_OVERLAY_ID}_close" style="align-self:flex-end;padding:8px 24px;background:#0b5fff;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;">Đóng</button>
            </div>
        `;
        document.body.appendChild(overlay);
        document.getElementById(`${ERROR_OVERLAY_ID}_close`).onclick = () => overlay.remove();
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    };

    const setBtn = (loading) => {
        if (loading) {
            showOverlay();
        } else {
            removeOverlay();
        }
    };

    const pickFile = () => new Promise((resolve, reject) => {
        const input = Object.assign(document.createElement("input"), {
            type: "file",
            accept: ".xlsx,.xls"
        });
        input.onchange = () => input.files[0] ? resolve(input.files[0]) : reject();
        input.oncancel = () => reject();
        input.click();
    });

    const parseExcel = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const wb = window.XLSX.read(new Uint8Array(e.target.result), { type: "array" });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows = window.XLSX.utils.sheet_to_json(ws, { header: 1 });

                const keys = rows[0];
                const dataRows = rows.slice(2)
                    .map((row, idx) => ({ row, _row: idx + 3 }))
                    .filter(({ row }) => row.some(Boolean));

                if (!dataRows.length) {
                    return reject(new Error("File không có dữ liệu"));
                }

                const users = dataRows.map(({ row, _row }) => ({
                    _row,
                    ...Object.fromEntries(keys.map((k, i) => [k, row[i] ?? ""]))
                }));

                resolve(users);
            } catch {
                reject(new Error("Không thể đọc file Excel"));
            }
        };
        reader.onerror = () => reject(new Error("Lỗi đọc file"));
        reader.readAsArrayBuffer(file);
    });

    const validate = (users) => {
        const validUsers = [];
        const failedUsers = [];
        const REQUIRED = ["emailAddress", "givenName", "familyName"];

        const seenIds = new Map();
        const seenEmails = new Map();
        const seenUsernames = new Map();

        users.forEach((u) => {
            const row = u._row;
            const rowErrors = [];

            REQUIRED.forEach(key => {
                if (!u[key]) {
                    rowErrors.push(`thiếu "${key}"`);
                }
            });

            if (u.id) {
                if (isNaN(Number(u.id))) {
                    rowErrors.push(`ID không hợp lệ`);
                } else {
                    const idKey = String(u.id).trim();
                    if (seenIds.has(idKey)) {
                        rowErrors.push(`ID "${idKey}" bị trùng với Row ${seenIds.get(idKey)}`);
                    } else {
                        seenIds.set(idKey, row);
                    }
                }
            }

            if (u.emailAddress) {
                const emailKey = u.emailAddress.trim().toLowerCase();
                if (seenEmails.has(emailKey)) {
                    rowErrors.push(`Email "${u.emailAddress}" bị trùng với Row ${seenEmails.get(emailKey)}`);
                } else {
                    seenEmails.set(emailKey, row);
                }
            }

            if (u.userName) {
                const usernameKey = u.userName.trim().toLowerCase();
                if (seenUsernames.has(usernameKey)) {
                    rowErrors.push(`Username "${u.userName}" bị trùng với Row ${seenUsernames.get(usernameKey)}`);
                } else {
                    seenUsernames.set(usernameKey, row);
                }
            }

            if (rowErrors.length) {
                failedUsers.push({ ...u, _error: `Row ${row}: ${rowErrors.join('; ')}` });
            } else {
                validUsers.push(u);
            }
        });

        return { validUsers, failedUsers };
    };

    const pollTask = async (taskId) => {
        const url = `${BASE_URL}/o/headless-batch-engine/v1.0/import-task/${taskId}`;
        const headers = { "x-csrf-token": window.Liferay.authToken };

        while (true) {
            await new Promise(r => setTimeout(r, 1500));
            const res = await fetch(url, { headers, credentials: "include" });
            const task = await res.json();

            if (task.executeStatus === "COMPLETED" || task.executeStatus === "FAILED") return task;
        }
    };

    const exportFailedExcel = (failedUsers) => {
        const errorCol = { key: "_error", label: "Lý do lỗi" };
        const allCols = [...COLUMNS_USER, errorCol];
        const keys = allCols.map(c => c.key);
        const labels = allCols.map(c => c.label);
        const rows = failedUsers.map(u => allCols.map(c => u[c.key] ?? ""));

        const ws = window.XLSX.utils.aoa_to_sheet([keys, labels, ...rows]);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, "Failed Users");
        window.XLSX.writeFile(wb, `users_failed_${Date.now()}.xlsx`);
    };

    setBtn(true);
    try {
        const file = await pickFile();
        const users = await parseExcel(file);

        const { validUsers, failedUsers: preValidationFailed } = validate(users);

        if (!validUsers.length) {
            exportFailedExcel(preValidationFailed);
            toast(`Không có dòng hợp lệ — ${preValidationFailed.length} dòng lỗi đã xuất file`, "warning");
            return;
        }

        const toCreate = validUsers.filter(u => !u.id);
        const toUpdate = validUsers.filter(u => !!u.id);

        const headers = {
            "Content-Type": "application/json",
            "x-csrf-token": window.Liferay.authToken
        };
        const fetchOpts = (method, body) => ({
            method, headers, credentials: "include",
            body: JSON.stringify(body)
        });

        const tasks = [];

        if (toCreate.length) {
            const payload = toCreate.map(({ _row, ...u }) => u);
            const res = await fetch(
                `${BASE_URL}/o/headless-admin-user/v1.0/user-accounts/batch?importStrategy=ON_ERROR_CONTINUE`,
                fetchOpts("POST", payload)
            );
            if (!res.ok) {
                throw new Error("HTTP " + res.status);
            }
            tasks.push({ type: "create", users: toCreate, ...(await res.json()) });
        }

        if (toUpdate.length) {
            const payload = toUpdate.map(({ _row, ...u }) => u);
            const res = await fetch(
                `${BASE_URL}/o/headless-admin-user/v1.0/user-accounts/batch?importStrategy=ON_ERROR_CONTINUE`,
                fetchOpts("PUT", payload)
            );
            if (!res.ok) {
                throw new Error("HTTP " + res.status);
            }
            tasks.push({ type: "update", users: toUpdate, ...(await res.json()) });
        }

        toast("Đang xử lý...", "info");

        const results = await Promise.all(tasks.map(t => pollTask(t.id).then(r => ({ ...r, users: t.users }))));

        const batchFailed = results.flatMap(r => {
            return (r.failedItems || []).map(f => {
                const user = r.users[f.itemIndex - 1];
                if (!user) {
                    return false;
                }
                return { ...user, _error: f.message };
            });
        }).filter(Boolean);
        const allFailed = [...preValidationFailed, ...batchFailed];
        const successCount = results.reduce((sum, r) => sum + r.totalItemsCount - (r.failedItems?.length || 0), 0);

        if (allFailed.length) {
            exportFailedExcel(allFailed);
            toast(`${successCount} thành công, ${allFailed.length} thất bại — đã xuất file lỗi`, "warning");
        } else {
            toast(`${successCount} user đã được xử lý`, "success");
        }
    } catch (err) {
        if (err?.message !== undefined) {
            toast(`${err.message}`, "danger");
        }
    } finally {
        setBtn(false);
    }
}

window.__initDownloadUser = () => {
    if (typeof window.waitForElement !== 'function') {
        return;
    }
    window.waitForElement('button[data-action="_com_liferay_users_admin_web_portlet_UsersAdminPortlet_exportUsers"]', (element) => {
        const parentLi = element.closest('li');
        if (!parentLi) {
            return;
        }
        parentLi.innerHTML = '';
        parentLi.insertAdjacentHTML('beforeend', `
            <button id="__btnExportUsers" class="dropdown-item">
                Xuất danh sách người dùng
            </button>
        `);

        window.waitForElement('#__btnExportUsers', (btn) => {
            btn.addEventListener('click', () => {
                try {
                    __exportUsersHandler(btn);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    });

    window.waitForElement('a[href*="_com_liferay_expando_web_portlet_ExpandoPortlet_modelResource=com.liferay.portal.kernel.model.User"]', (element) => {
        const parentLi = element.closest('li');
        if (!parentLi) {
            return;
        }
        parentLi.innerHTML = '';
        parentLi.insertAdjacentHTML('beforeend', `
            <button id="__btnImportUsers" class="dropdown-item">
                Nhập người dùng
            </button>
        `);

        window.waitForElement('#__btnImportUsers', (btn) => {
            btn.addEventListener('click', () => {
                try {
                    __importUsersHandler(btn);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    })
}
