(function () {
    var API_URL = "/o/vec-admin/web-content-advanced-search";
    var PORTLET_ID = "com_liferay_journal_web_portlet_JournalPortlet";
    var PORTLET_NS = "_" + PORTLET_ID + "_";

    var state = { page: 1, pageSize: 20, total: 0 };

    var form            = document.getElementById("searchForm");
    var resetButton     = document.getElementById("resetButton");
    var formMessage     = document.getElementById("formMessage");
    var loadingState    = document.getElementById("loadingState");
    var errorState      = document.getElementById("errorState");
    var resultSummary   = document.getElementById("resultSummary");
    var resultTableBody = document.getElementById("resultTableBody");
    var paginationMeta  = document.getElementById("paginationMeta");
    var pagination      = document.getElementById("pagination");
    var csrfToken       = (window.Liferay && window.Liferay.authToken) || "";
    var CACHE_TTL       = 6 * 60 * 60 * 1000;

    var STATUS_LABELS = {
        approved:   "Đã duyệt",
        denied:     "Từ chối",
        draft:      "Bản nháp",
        expired:    "Hết hạn",
        pending:    "Chờ duyệt",
        scheduled:  "Lên lịch",
        incomplete: "Chưa hoàn tất",
        in_trash:   "Trong thùng rác",
        trash:      "Thùng rác"
    };

    var STATUS_BADGE = {
        approved:   "was-badge--approved",
        denied:     "was-badge--denied",
        expired:    "was-badge--expired",
        trash:      "was-badge--trash",
        in_trash:   "was-badge--trash",
        pending:    "was-badge--pending",
        scheduled:  "was-badge--scheduled",
        draft:      "was-badge--draft"
    };

    /* ── Event listeners ─────────────────────────────────────── */
    form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        state.page = 1;
        loadData();
    });

    resetButton.addEventListener("click", function () {
        var savedGroupId = document.getElementById("groupId").value;
        var savedFolderId = document.getElementById("folderId").value;
        form.reset();
        document.getElementById("groupId").value = savedGroupId;
        document.getElementById("folderId").value = savedFolderId;
        document.getElementById("userId").value = "";
        document.getElementById("userId-input").value = "";
        state.page = 1;
        state.pageSize = 20;
        document.getElementById("pageSize").value = "20";
        formMessage.textContent = "";
        errorState.classList.add("hidden");
        syncStateToUrl();
        loadData();
    });

    document.getElementById("pageSize").addEventListener("change", function () {
        state.page = 1;
        state.pageSize = Number(this.value || 20);
        loadData();
    });

    hydrateFromUrl();
    initBackLink();
    loadFolderInfo();
    loadFilterOptions();
    loadData();
    activateWebContentMenu();

    /* ── Activate Web Content menu item in product sidebar ───── */
    function activateWebContentMenu() {
        var tries = 0;
        function attempt() {
            var panelId = "_com_liferay_product_navigation_product_menu_web_portlet_ProductMenuPortlet_site_administration_panel";
            var panel = document.getElementById(panelId);
            if (!panel) {
                if (++tries < 50) { setTimeout(attempt, 100); }
                return;
            }
            var active = panel.querySelector("li.active.nav-item");
            if (active) { active.classList.remove("active"); }
            var link = panel.querySelector("a[id$='journal_web_portlet_JournalPortlet']");
            if (link) {
                var li = link.closest("li.nav-item");
                if (li) { li.classList.add("active"); }
            }
            var contentToggle = document.querySelector("a[href='#panel-manage-site_administration_content']");
            if (contentToggle) { contentToggle.classList.remove("collapsed"); }
            var buildPanel = document.getElementById("panel-manage-site_administration_content");
            if (buildPanel) { buildPanel.classList.add("show"); }
        }
        attempt();
    }

    /* ── URL builder for article edit page ───────────────────── */
    function buildEditUrl(item) {
        if (item.editUrl) {
            return item.editUrl;
        }
        var params = new URLSearchParams();
        params.set("p_p_id", PORTLET_ID);
        params.set("p_p_lifecycle", "0");
        params.set("p_p_state", "maximized");
        params.set(PORTLET_NS + "mvcRenderCommandName", "/journal/edit_article");
        params.set(PORTLET_NS + "articleId", item.articleId);
        params.set(PORTLET_NS + "groupId", String(item.groupId));
        return "/group/guest/~/control_panel/manage?" + params.toString();
    }

    /* ── Back link ───────────────────────────────────────────── */
    function initBackLink() {
        var params = new URLSearchParams(window.location.search);
        var backUrl = params.get("backUrl");
        if (!backUrl) {
            var gId = params.get("groupId");
            var fId = params.get("folderId");
            var p = new URLSearchParams();
            p.set("p_p_id", PORTLET_ID);
            p.set("p_p_lifecycle", "0");
            p.set("p_p_state", "maximized");
            if (gId) { p.set(PORTLET_NS + "groupId", gId); }
            if (fId && fId !== "0") { p.set(PORTLET_NS + "folderId", fId); }
            backUrl = "/group/guest/~/control_panel/manage?" + p.toString();
        }
        var backLink = document.getElementById("backLink");
        if (backLink) { backLink.href = backUrl; }
    }

    /* ── Folder / group info ─────────────────────────────────── */
    function loadFolderInfo() {
        var folderId = valueOf("folderId");
        var groupId  = valueOf("groupId");

        var folderInfoEl = document.getElementById("folderId-info");
        var groupInfoEl  = document.getElementById("groupId-info");

        if (folderInfoEl) {
            if (!folderId || folderId === "0") {
                folderInfoEl.textContent = "Tất cả thư mục";
            } else {
                fetch("/o/headless-delivery/v1.0/structured-content-folders/" + encodeURIComponent(folderId), {
                    credentials: "same-origin",
                    headers: { "x-csrf-token": csrfToken }
                })
                .then(function (r) { return r.ok ? r.json() : null; })
                .then(function (data) {
                    if (data && data.name) { folderInfoEl.textContent = data.name; }
                })
                .catch(function () {});
            }
        }

        if (groupInfoEl && groupId) {
            fetch("/o/headless-admin-user/v1.0/sites/" + encodeURIComponent(groupId), {
                credentials: "same-origin",
                headers: { "x-csrf-token": csrfToken }
            })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (data) {
                if (data && data.name) { groupInfoEl.textContent = data.name; }
            })
            .catch(function () {});
        }
    }

    /* ── Validation ──────────────────────────────────────────── */
    function assertValidDates() {
        var fromDate = valueOf("fromDate");
        var toDate   = valueOf("toDate");
        formMessage.textContent = "";
        if (fromDate && toDate && fromDate > toDate) {
            formMessage.textContent = "Từ ngày không được lớn hơn đến ngày.";
            return false;
        }
        return true;
    }

    /* ── Pagination helpers ──────────────────────────────────── */
    function buildPageNumbers(currentPage, maxPage) {
        if (maxPage <= 7) {
            var all = [];
            for (var i = 1; i <= maxPage; i++) { all.push(i); }
            return all;
        }
        var pages = [1];
        var start = Math.max(2, currentPage - 1);
        var end   = Math.min(maxPage - 1, currentPage + 1);
        if (start > 2) { pages.push("..."); }
        for (var p = start; p <= end; p++) { pages.push(p); }
        if (end < maxPage - 1) { pages.push("..."); }
        pages.push(maxPage);
        return pages;
    }

    /* ── Query string ────────────────────────────────────────── */
    function buildQueryString() {
        var params  = new URLSearchParams();
        var filters = collectFilters();
        for (var key in filters) {
            if (Object.prototype.hasOwnProperty.call(filters, key) && filters[key]) {
                params.set(key, filters[key]);
            }
        }
        params.set("page",     String(state.page));
        params.set("pageSize", String(state.pageSize));
        return params.toString();
    }

    function collectFilters() {
        return {
            keyword:    valueOf("keyword"),
            groupId:    valueOf("groupId"),
            folderId:   valueOf("folderId"),
            status:     valueOf("status") || "-1",
            structureId: valueOf("structureId"),
            userId:     valueOf("userId"),
            dateField:  valueOf("dateField") || "modifiedDate",
            fromDate:   valueOf("fromDate"),
            toDate:     valueOf("toDate"),
            sortField:  valueOf("sortField") || "modifiedDate",
            sortOrder:  valueOf("sortOrder") || "desc"
        };
    }

    /* ── HTML escape ─────────────────────────────────────────── */
    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    /* ── URL hydration ───────────────────────────────────────── */
    function hydrateFromUrl() {
        var params = new URLSearchParams(window.location.search);
        var fields = ["keyword","groupId","folderId","status","structureId","userId",
                      "dateField","fromDate","toDate","sortField","sortOrder","pageSize"];
        fields.forEach(function (field) {
            var el  = document.getElementById(field);
            var val = params.get(field);
            if (el && val !== null) { el.value = val; }
        });
        state.page     = Number(params.get("page") || "1");
        state.pageSize = Number(params.get("pageSize") || document.getElementById("pageSize").value || "20");
        document.getElementById("pageSize").value = String(state.pageSize);
    }

    /* ── Load user list ──────────────────────────────────────── */
    function loadFilterOptions() {
        var cacheKey = "vec_audit_select_userId";
        var cached   = readCache(cacheKey);
        if (cached) { initSearchableSelect("userId", cached); return; }
        fetch("/o/headless-admin-user/v1.0/user-accounts?pageSize=200&sort=name:asc", {
            credentials: "same-origin",
            headers: { "x-csrf-token": csrfToken }
        })
            .then(assertOk)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                var items = (data.items || []).map(function (u) {
                    return {
                        value: String(u.id),
                        label: u.name + (u.emailAddress ? " (" + u.emailAddress + ")" : "")
                    };
                });
                writeCache(cacheKey, items);
                initSearchableSelect("userId", items);
            })
            .catch(function () { initSearchableSelect("userId", []); });
    }

    /* ── Fetch data ──────────────────────────────────────────── */
    function loadData() {
        if (!assertValidDates()) { return; }
        loadingState.classList.remove("hidden");
        errorState.classList.add("hidden");
        errorState.textContent = "";
        resultSummary.textContent = "Đang tải...";
        resultTableBody.innerHTML = "<tr><td colspan='9' class='was-empty-cell'>Đang tải dữ liệu...</td></tr>";
        syncStateToUrl();

        fetch(API_URL + "?" + buildQueryString(), {
            credentials: "same-origin",
            headers: { "x-csrf-token": csrfToken }
        })
            .then(assertOk)
            .then(function (r) { return r.json(); })
            .then(function (data) {
                state.total = Number(data.total || 0);
                renderTable(data.items || []);
                renderPagination();
            })
            .catch(function (error) {
                state.total = 0;
                resultTableBody.innerHTML = "<tr><td colspan='9' class='was-empty-cell'>Không thể tải dữ liệu.</td></tr>";
                resultSummary.textContent = "Có lỗi xảy ra.";
                errorState.textContent = error.message || "Không thể tải dữ liệu.";
                errorState.classList.remove("hidden");
                pagination.innerHTML = "";
                paginationMeta.textContent = "";
            })
            .finally(function () { loadingState.classList.add("hidden"); });
    }

    /* ── Render pagination ───────────────────────────────────── */
    function renderPagination() {
        var maxPage = Math.max(1, Math.ceil(state.total / state.pageSize));
        var pages   = buildPageNumbers(state.page, maxPage);
        var start   = state.total ? ((state.page - 1) * state.pageSize + 1) : 0;
        var end     = Math.min(state.total, state.page * state.pageSize);

        paginationMeta.textContent = state.total
            ? ("Hiển thị " + start + "–" + end + " / " + state.total + " bản ghi")
            : "0 kết quả";

        var html = pageBtn(state.page - 1, "‹", state.page <= 1, false);
        pages.forEach(function (page) {
            if (page === "...") {
                html += "<span class='was-page-ellipsis'>…</span>";
                return;
            }
            html += pageBtn(page, String(page), false, page === state.page);
        });
        html += pageBtn(state.page + 1, "›", state.page >= maxPage, false);
        pagination.innerHTML = html;

        pagination.querySelectorAll("[data-page]").forEach(function (el) {
            el.addEventListener("click", function () {
                var next = Number(el.getAttribute("data-page"));
                if (next < 1 || next > maxPage || next === state.page) { return; }
                state.page = next;
                loadData();
            });
        });
    }

    /* ── Render table ────────────────────────────────────────── */
    function renderTable(items) {
        if (!items.length) {
            resultSummary.textContent = "Không có bản ghi phù hợp.";
            resultTableBody.innerHTML = "<tr><td colspan='9' class='was-empty-cell'>Không tìm thấy Bài viết phù hợp với bộ lọc hiện tại.</td></tr>";
            return;
        }
        resultSummary.textContent = "Tìm thấy " + state.total + " bản ghi.";
        resultTableBody.innerHTML = items.map(function (item) {
            var statusKey  = String(item.statusLabel || "").toLowerCase();
            var badgeClass = "was-badge " + (STATUS_BADGE[statusKey] || "");
            var editUrl    = buildEditUrl(item);
            var folderText = (item.folderName && item.folderName !== "Root")
                ? escapeHtml(item.folderName)
                : "<span style='color:#94a3b8'>Root</span>";

            return "<tr>" +
                "<td>" +
                    "<a class='was-title-link' href='" + escapeHtml(editUrl) + "' target='_blank' rel='noopener noreferrer'>" +
                        escapeHtml(item.title || "(Không có tiêu đề)") +
                    "</a>" +
                    "<span class='was-cell-meta'>" + escapeHtml(item.groupName || ("Site #" + item.groupId)) + "</span>" +
                "</td>" +
                "<td>" +
                    "<span class='was-mono'>" + escapeHtml(item.articleId) + "</span>" +
                    "<span class='was-cell-meta'>RPK: " + escapeHtml(item.resourcePrimKey) + "</span>" +
                "</td>" +
                "<td style='text-align:center'><span class='was-mono'>" + escapeHtml(item.version) + "</span></td>" +
                "<td><span class='" + badgeClass + "'>" + escapeHtml(STATUS_LABELS[statusKey] || item.statusLabel || String(item.status)) + "</span></td>" +
                "<td>" + escapeHtml(item.userName || "") + "</td>" +
                "<td class='was-date'>" + escapeHtml(item.createDate   || "—") + "</td>" +
                "<td class='was-date'>" + escapeHtml(item.modifiedDate || "—") + "</td>" +
                "<td class='was-date'>" + escapeHtml(item.displayDate  || "—") + "</td>" +
                "<td>" + folderText + "</td>" +
                "</tr>";
        }).join("");
    }

    /* ── Sync URL ────────────────────────────────────────────── */
    function syncStateToUrl() {
        var params = new URLSearchParams(buildQueryString());
        window.history.replaceState({}, "", window.location.pathname + "?" + params.toString());
    }

    /* ── Get field value ─────────────────────────────────────── */
    function valueOf(id) {
        var el = document.getElementById(id);
        return (el && el.value) ? el.value.trim() : "";
    }

    /* ── Searchable select ───────────────────────────────────── */
    function initSearchableSelect(id, items) {
        var input  = document.getElementById(id + "-input");
        var hidden = document.getElementById(id);
        var list   = document.getElementById(id + "-list");
        if (!input || !hidden || !list) { return; }
        if (input.getAttribute("data-initialized") === "true") {
            syncSSValue(hidden, input, items);
            return;
        }
        input.setAttribute("data-initialized", "true");
        syncSSValue(hidden, input, items);

        function renderList(filter) {
            var q   = (filter || "").toLowerCase().trim();
            var all = [{ value: "", label: "Tất cả" }].concat(items);
            var filtered = q
                ? all.filter(function (it) { return it.label.toLowerCase().indexOf(q) >= 0; })
                : all;

            if (!filtered.length) {
                list.innerHTML = "<li class='was-ss-item was-ss-item--empty'>Không tìm thấy</li>";
            } else {
                list.innerHTML = filtered.map(function (it) {
                    return "<li class='was-ss-item" + (it.value === hidden.value ? " selected" : "") + "'" +
                        " data-value='" + escapeHtml(it.value) + "'" +
                        " data-label='" + escapeHtml(it.label) + "'>" +
                        escapeHtml(it.label) + "</li>";
                }).join("");
            }

            list.querySelectorAll(".was-ss-item[data-value]").forEach(function (li) {
                li.addEventListener("mousedown", function (ev) {
                    ev.preventDefault();
                    hidden.value = li.getAttribute("data-value");
                    input.value  = hidden.value ? li.getAttribute("data-label") : "";
                    list.classList.add("hidden");
                });
            });
        }

        input.addEventListener("focus", function () { renderList(input.value); list.classList.remove("hidden"); });
        input.addEventListener("input", function () { hidden.value = ""; renderList(input.value); list.classList.remove("hidden"); });
        input.addEventListener("blur",  function () {
            window.setTimeout(function () {
                list.classList.add("hidden");
                if (!hidden.value) { input.value = ""; }
            }, 120);
        });
    }

    function syncSSValue(hidden, input, items) {
        var sel = items.filter(function (it) { return it.value === hidden.value; })[0];
        if (sel)              { input.value = sel.label; }
        else if (!hidden.value) { input.value = ""; }
    }

    /* ── Cache helpers ───────────────────────────────────────── */
    function readCache(key) {
        try {
            var raw   = localStorage.getItem(key);
            if (!raw) { return null; }
            var entry = JSON.parse(raw);
            if (!entry || !entry.ts || !entry.items) { return null; }
            if (Date.now() - entry.ts > CACHE_TTL) { localStorage.removeItem(key); return null; }
            return entry.items;
        } catch (e) { return null; }
    }

    function writeCache(key, items) {
        try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), items: items })); } catch (e) {}
    }

    /* ── DOM helpers ─────────────────────────────────────────── */
    function pageBtn(page, label, disabled, active) {
        return "<button type='button' class='was-page-btn" + (active ? " active" : "") + "'" +
            " data-page='" + page + "'" + (disabled ? " disabled" : "") + ">" + label + "</button>";
    }

    function assertOk(response) {
        if (!response.ok) {
            return response.text().then(function (text) {
                var message = "HTTP " + response.status;
                try { var json = JSON.parse(text); message = json.message || message; } catch (e) { message = text || message; }
                throw new Error(message);
            });
        }
        return response;
    }
})();
