(function () {
    var API_URL = "/o/vec-admin/web-content-advanced-search";
    var state = {
        page: 1,
        pageSize: 20,
        total: 0
    };

    var form = document.getElementById("searchForm");
    var resetButton = document.getElementById("resetButton");
    var formMessage = document.getElementById("formMessage");
    var loadingState = document.getElementById("loadingState");
    var errorState = document.getElementById("errorState");
    var resultSummary = document.getElementById("resultSummary");
    var resultTableBody = document.getElementById("resultTableBody");
    var paginationMeta = document.getElementById("paginationMeta");
    var pagination = document.getElementById("pagination");
    var csrfToken = (window.Liferay && window.Liferay.authToken) || "";
    var CACHE_TTL = 6 * 60 * 60 * 1000;

    var STATUS_LABELS = {
        approved: "Đã duyệt",
        denied: "Từ chối",
        draft: "Bản nháp",
        expired: "Hết hạn",
        pending: "Chờ duyệt",
        scheduled: "Lên lịch",
        incomplete: "Chưa hoàn tất",
        in_trash: "Trong thùng rác",
        trash: "Thùng rác"
    };

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        state.page = 1;
        loadData();
    });

    resetButton.addEventListener("click", function () {
        form.reset();
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
    loadFilterOptions();
    loadData();

    function assertValidDates() {
        var fromDate = valueOf("fromDate");
        var toDate = valueOf("toDate");

        formMessage.textContent = "";

        if (fromDate && toDate && fromDate > toDate) {
            formMessage.textContent = "Từ ngày không được lớn hơn đến ngày.";
            return false;
        }

        return true;
    }

    function buildPageNumbers(currentPage, maxPage) {
        if (maxPage <= 7) {
            var allPages = [];
            var index;

            for (index = 1; index <= maxPage; index++) {
                allPages.push(index);
            }

            return allPages;
        }

        var pages = [1];
        var start = Math.max(2, currentPage - 1);
        var end = Math.min(maxPage - 1, currentPage + 1);
        var page;

        if (start > 2) {
            pages.push("...");
        }

        for (page = start; page <= end; page++) {
            pages.push(page);
        }

        if (end < maxPage - 1) {
            pages.push("...");
        }

        pages.push(maxPage);

        return pages;
    }

    function buildQueryString() {
        var params = new URLSearchParams();
        var filters = collectFilters();
        var key;

        for (key in filters) {
            if (Object.prototype.hasOwnProperty.call(filters, key) && filters[key]) {
                params.set(key, filters[key]);
            }
        }

        params.set("page", String(state.page));
        params.set("pageSize", String(state.pageSize));

        return params.toString();
    }

    function collectFilters() {
        return {
            keyword: valueOf("keyword"),
            groupId: valueOf("groupId"),
            folderId: valueOf("folderId"),
            status: valueOf("status") || "-1",
            structureId: valueOf("structureId"),
            userId: valueOf("userId"),
            dateField: valueOf("dateField") || "modifiedDate",
            fromDate: valueOf("fromDate"),
            toDate: valueOf("toDate"),
            sortField: valueOf("sortField") || "modifiedDate",
            sortOrder: valueOf("sortOrder") || "desc"
        };
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function hydrateFromUrl() {
        var params = new URLSearchParams(window.location.search);
        var fields = [
            "keyword",
            "groupId",
            "folderId",
            "status",
            "structureId",
            "userId",
            "dateField",
            "fromDate",
            "toDate",
            "sortField",
            "sortOrder",
            "pageSize"
        ];

        fields.forEach(function (field) {
            var element = document.getElementById(field);
            var value = params.get(field);

            if (element && value !== null) {
                element.value = value;
            }
        });

        state.page = Number(params.get("page") || "1");
        state.pageSize = Number(params.get("pageSize") || document.getElementById("pageSize").value || "20");
        document.getElementById("pageSize").value = String(state.pageSize);
    }

    function loadFilterOptions() {
        var cacheKey = "vec_audit_select_userId";
        var cached = readCache(cacheKey);

        if (cached) {
            initSearchableSelect("userId", cached);
            return;
        }

        fetch("/o/headless-admin-user/v1.0/user-accounts?pageSize=200&sort=name:asc", {
            credentials: "same-origin",
            headers: {
                "x-csrf-token": csrfToken
            }
        })
            .then(assertOk)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var items = (data.items || []).map(function (user) {
                    return {
                        value: String(user.id),
                        label: user.name + (user.emailAddress ? " (" + user.emailAddress + ")" : "")
                    };
                });

                writeCache(cacheKey, items);
                initSearchableSelect("userId", items);
            })
            .catch(function () {
                initSearchableSelect("userId", []);
            });
    }

    function loadData() {
        if (!assertValidDates()) {
            return;
        }

        loadingState.classList.remove("hidden");
        errorState.classList.add("hidden");
        errorState.textContent = "";
        resultSummary.textContent = "Đang tải dữ liệu...";
        resultTableBody.innerHTML = "<tr><td colspan='10' class='vec-empty-cell'>Đang tải dữ liệu...</td></tr>";
        syncStateToUrl();

        fetch(API_URL + "?" + buildQueryString(), {
            credentials: "same-origin",
            headers: {
                "x-csrf-token": csrfToken
            }
        })
            .then(assertOk)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                state.total = Number(data.total || 0);
                renderTable(data.items || []);
                renderPagination();
            })
            .catch(function (error) {
                state.total = 0;
                resultTableBody.innerHTML = "<tr><td colspan='10' class='vec-empty-cell'>Không thể tải dữ liệu.</td></tr>";
                resultSummary.textContent = "Có lỗi xảy ra.";
                errorState.textContent = error.message || "Không thể tải dữ liệu.";
                errorState.classList.remove("hidden");
                pagination.innerHTML = "";
                paginationMeta.textContent = "";
            })
            .finally(function () {
                loadingState.classList.add("hidden");
            });
    }

    function renderPagination() {
        var maxPage = Math.max(1, Math.ceil(state.total / state.pageSize));
        var pages = buildPageNumbers(state.page, maxPage);
        var start = state.total ? ((state.page - 1) * state.pageSize + 1) : 0;
        var end = Math.min(state.total, state.page * state.pageSize);
        var html = "";

        paginationMeta.textContent = state.total
            ? ("Hiển thị " + start + " đến " + end + " trong tổng số " + state.total + " mục")
            : "0 kết quả";

        html += button(state.page - 1, "&lsaquo;", state.page <= 1, false);

        pages.forEach(function (page) {
            if (page === "...") {
                html += "<span class='vec-page-button' aria-hidden='true'>…</span>";
                return;
            }

            html += button(page, String(page), false, page === state.page);
        });

        html += button(state.page + 1, "&rsaquo;", state.page >= maxPage, false);
        pagination.innerHTML = html;

        pagination.querySelectorAll("[data-page]").forEach(function (element) {
            element.addEventListener("click", function () {
                var nextPage = Number(element.getAttribute("data-page"));

                if (nextPage < 1 || nextPage > maxPage || nextPage === state.page) {
                    return;
                }

                state.page = nextPage;
                loadData();
            });
        });
    }

    function renderTable(items) {
        if (!items.length) {
            resultSummary.textContent = "Không có bản ghi phù hợp.";
            resultTableBody.innerHTML = "<tr><td colspan='10' class='vec-empty-cell'>Không tìm thấy Web Content phù hợp với bộ lọc hiện tại.</td></tr>";
            return;
        }

        resultSummary.textContent = "Tìm thấy " + state.total + " bản ghi.";
        resultTableBody.innerHTML = items.map(function (item) {
            var statusKey = String(item.statusLabel || "").toLowerCase();
            var badgeClass = "vec-status-badge";

            if (statusKey === "approved") {
                badgeClass += " vec-status-approved";
            } else if (statusKey === "pending" || statusKey === "draft" || statusKey === "scheduled") {
                badgeClass += " vec-status-pending";
            } else if (statusKey === "denied" || statusKey === "expired" || statusKey === "in_trash" || statusKey === "trash") {
                badgeClass += " vec-status-denied";
            }

            return "" +
                "<tr>" +
                    "<td class='vec-title-cell'>" +
                        "<strong>" + escapeHtml(item.title || "(Không có tiêu đề)") + "</strong>" +
                        "<span class='vec-cell-meta'>Site: " + escapeHtml(item.groupName || ("Nhóm #" + item.groupId)) + "</span>" +
                    "</td>" +
                    "<td>" + escapeHtml(item.articleId) + "<br><span class='vec-cell-meta'>Khóa tài nguyên: " + escapeHtml(item.resourcePrimKey) + "</span></td>" +
                    "<td>" + escapeHtml(item.version) + "</td>" +
                    "<td><span class='" + badgeClass + "'>" + escapeHtml(STATUS_LABELS[statusKey] || item.statusLabel || item.status) + "</span></td>" +
                    "<td>" + escapeHtml(item.userName || "") + "<br><span class='vec-cell-meta'>Mã người dùng: " + escapeHtml(item.userId) + "</span></td>" +
                    "<td>" + escapeHtml(item.createDate || "") + "</td>" +
                    "<td>" + escapeHtml(item.modifiedDate || "") + "</td>" +
                    "<td>" + escapeHtml(item.displayDate || "") + "</td>" +
                    "<td>" + escapeHtml(item.folderName || ("Thư mục #" + item.folderId)) + "<br><span class='vec-cell-meta'>Mã thư mục: " + escapeHtml(item.folderId) + "</span></td>" +
                    "<td>" + renderActions(item) + "</td>" +
                "</tr>";
        }).join("");
    }

    function renderActions(item) {
        var actions = [];

        if (item.editUrl) {
            actions.push("<a href='" + escapeHtml(item.editUrl) + "' target='_blank' rel='noopener noreferrer'>Sửa</a>");
        } else {
            actions.push("<span>Chưa có liên kết sửa</span>");
        }

        if (item.viewUrl) {
            actions.push("<a href='" + escapeHtml(item.viewUrl) + "' target='_blank' rel='noopener noreferrer'>Xem</a>");
        } else {
            actions.push("<span>Xem: đang bổ sung</span>");
        }

        return "<div class='vec-actions'>" + actions.join("") + "</div>";
    }

    function syncStateToUrl() {
        var params = new URLSearchParams(buildQueryString());
        var nextUrl = window.location.pathname + "?" + params.toString();

        window.history.replaceState({}, "", nextUrl);
    }

    function valueOf(id) {
        var element = document.getElementById(id);

        if (!element) {
            return "";
        }

        return element.value ? element.value.trim() : "";
    }

    function initSearchableSelect(id, items) {
        var input = document.getElementById(id + "-input");
        var hidden = document.getElementById(id);
        var list = document.getElementById(id + "-list");

        if (!input || !hidden || !list) {
            return;
        }

        if (input.getAttribute("data-initialized") === "true") {
            syncSearchableSelectValue(hidden, input, items);
            return;
        }

        input.setAttribute("data-initialized", "true");
        syncSearchableSelectValue(hidden, input, items);

        function renderList(filter) {
            var normalized = (filter || "").toLowerCase().trim();
            var all = [{ value: "", label: "Tất cả" }].concat(items);
            var filtered = normalized
                ? all.filter(function (item) {
                    return item.label.toLowerCase().indexOf(normalized) >= 0;
                })
                : all;

            if (!filtered.length) {
                list.innerHTML = "<li class='ss-item ss-empty'>Không tìm thấy</li>";
            } else {
                list.innerHTML = filtered.map(function (item) {
                    var isSelected = item.value === hidden.value;

                    return "<li class='ss-item" + (isSelected ? " selected" : "") + "'" +
                        " data-value='" + escapeHtml(item.value) + "'" +
                        " data-label='" + escapeHtml(item.label) + "'>" +
                        escapeHtml(item.label) + "</li>";
                }).join("");
            }

            list.querySelectorAll(".ss-item[data-value]").forEach(function (li) {
                li.addEventListener("mousedown", function (event) {
                    event.preventDefault();
                    hidden.value = li.getAttribute("data-value");
                    input.value = hidden.value ? li.getAttribute("data-label") : "";
                    list.classList.add("hidden");
                });
            });
        }

        input.addEventListener("focus", function () {
            renderList(input.value);
            list.classList.remove("hidden");
        });

        input.addEventListener("input", function () {
            hidden.value = "";
            renderList(input.value);
            list.classList.remove("hidden");
        });

        input.addEventListener("blur", function () {
            window.setTimeout(function () {
                list.classList.add("hidden");

                if (!hidden.value) {
                    input.value = "";
                }
            }, 120);
        });
    }

    function syncSearchableSelectValue(hidden, input, items) {
        var selected = items.filter(function (item) {
            return item.value === hidden.value;
        })[0];

        if (selected) {
            input.value = selected.label;
        } else if (!hidden.value) {
            input.value = "";
        }
    }

    function readCache(key) {
        try {
            var raw = localStorage.getItem(key);

            if (!raw) {
                return null;
            }

            var entry = JSON.parse(raw);

            if (!entry || !entry.ts || !entry.items) {
                return null;
            }

            if (Date.now() - entry.ts > CACHE_TTL) {
                localStorage.removeItem(key);
                return null;
            }

            return entry.items;
        } catch (error) {
            return null;
        }
    }

    function writeCache(key, items) {
        try {
            localStorage.setItem(key, JSON.stringify({
                ts: Date.now(),
                items: items
            }));
        } catch (error) {
        }
    }

    function button(page, label, disabled, active) {
        return "<button type='button' class='vec-page-button" + (active ? " active" : "") + "'" +
            " data-page='" + page + "'" +
            (disabled ? " disabled" : "") +
            ">" + label + "</button>";
    }

    function assertOk(response) {
        if (!response.ok) {
            return response.text().then(function (text) {
                var message = "HTTP " + response.status;

                try {
                    var json = JSON.parse(text);
                    message = json.message || message;
                } catch (error) {
                    message = text || message;
                }

                throw new Error(message);
            });
        }

        return response;
    }
})();
