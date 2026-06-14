(function () {
    var state = {
        page: 1,
        pageSize: 20,
        total: 0,
        filters: {}
    };

    var tableBody = document.getElementById("auditTableBody");
    var summary = document.getElementById("summary");
    var pager = document.getElementById("pager");
    var detailModal = document.getElementById("detailModal");
    var detailTitle = document.getElementById("detailTitle");
    var detailMeta = document.getElementById("detailMeta");
    var beforeData = document.getElementById("beforeData");
    var afterData = document.getElementById("afterData");
    var diffData = document.getElementById("diffData");

    var csrfToken = (window.Liferay && window.Liferay.authToken) || "";

    var ACTION_LABELS = {
        ADD: "Thêm mới",
        UPDATE: "Cập nhật",
        DELETE: "Xóa",
        MOVE: "Di chuyển",
        PUBLISH: "Xuất bản",
        CONFIG_UPDATE: "Cập nhật cấu hình",
        PERMISSION_UPDATE: "Cập nhật quyền",
        UNKNOWN: "Không xác định"
    };

    var TARGET_LABELS = {
        JOURNAL_ARTICLE: "Bài viết",
        JOURNAL_FOLDER: "Thư mục bài viết",
        LAYOUT: "Trang",
        FRAGMENT_ENTRY_LINK: "Fragment (trang)",
        FRAGMENT_ENTRY: "Fragment",
        CONFIGURATION: "Cấu hình",
        DL_FILE_ENTRY: "Tệp tin",
        DL_FOLDER: "Thư mục tệp",
        DDM_STRUCTURE: "Cấu trúc dữ liệu",
        DDM_TEMPLATE: "Mẫu hiển thị",
        ASSET_CATEGORY: "Danh mục",
        ASSET_TAG: "Nhãn",
        UNKNOWN: "Không xác định"
    };

    var STATUS_LABELS = {
        PENDING: "Đang xử lý",
        SUCCESS: "Thành công",
        FAILED: "Thất bại"
    };

    function labelAction(value) {
        return ACTION_LABELS[value] || value || "";
    }

    function labelTarget(value) {
        return TARGET_LABELS[value] || value || "";
    }

    function labelStatus(value) {
        return STATUS_LABELS[value] || value || "";
    }

    document.getElementById("filterForm").addEventListener("submit", function (event) {
        event.preventDefault();
        state.page = 1;
        state.filters = collectFilters();
        loadList();
    });

    document.getElementById("resetFilters").addEventListener("click", function () {
        document.getElementById("filterForm").reset();
        state.page = 1;
        state.filters = {};
        loadList();
    });

    document.getElementById("closeModal").addEventListener("click", closeModal);
    detailModal.addEventListener("click", function (event) {
        if (event.target && event.target.getAttribute("data-close-modal") === "true") {
            closeModal();
        }
    });

    function collectFilters() {
        return {
            keyword: valueOf("keyword"),
            fromDate: valueOf("fromDate"),
            toDate: valueOf("toDate"),
            actionType: valueOf("actionType"),
            targetType: valueOf("targetType"),
            status: valueOf("status"),
            userId: valueOf("userId"),
            groupId: valueOf("groupId")
        };
    }

    function valueOf(id) {
        var value = document.getElementById(id).value;

        return value ? value.trim() : "";
    }

    function buildQuery() {
        var params = new URLSearchParams();
        var key;

        for (key in state.filters) {
            if (Object.prototype.hasOwnProperty.call(state.filters, key) && state.filters[key]) {
                params.set(key, state.filters[key]);
            }
        }

        params.set("page", String(state.page));
        params.set("pageSize", String(state.pageSize));
        params.set("sort", "createDate:desc");

        return params.toString();
    }

    function loadList() {
        tableBody.innerHTML = "<tr><td colspan='8'>Đang tải...</td></tr>";
        summary.textContent = "Đang tải...";

        fetch("/o/vec-admin/audit-logs?" + buildQuery(), {
            credentials: "same-origin",
            headers: { "X-CSRF-Token": csrfToken }
        })
            .then(assertOk)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                state.total = Number(data.total || 0);
                renderTable(data.items || []);
                renderPager();
            })
            .catch(function (error) {
                tableBody.innerHTML = "<tr><td colspan='8'>Không thể tải dữ liệu nhật ký.</td></tr>";
                summary.textContent = error.message || "Không thể tải dữ liệu nhật ký.";
            });
    }

    function renderTable(items) {
        if (!items.length) {
            tableBody.innerHTML = "<tr><td colspan='8'>Không tìm thấy bản ghi nào.</td></tr>";
            summary.textContent = "0 bản ghi";
            return;
        }

        tableBody.innerHTML = items.map(function (item) {
            return "" +
                "<tr>" +
                    "<td>" + escapeHtml(item.auditLogId) + "</td>" +
                    "<td>" + escapeHtml(item.createDate || "") + "</td>" +
                    "<td>" + escapeHtml(item.userName || "Hệ thống") + "</td>" +
                    "<td>" + escapeHtml(labelAction(item.actionType)) + "</td>" +
                    "<td>" + escapeHtml(labelTarget(item.targetType)) + "</td>" +
                    "<td>" + escapeHtml(item.targetTitle || item.classPK || "") + "</td>" +
                    "<td>" + renderStatus(item.status) + "</td>" +
                    "<td><button class='link-button' data-audit-id='" + escapeHtml(item.auditLogId) + "'>Xem</button></td>" +
                "</tr>";
        }).join("");

        summary.textContent = state.total + " bản ghi";

        tableBody.querySelectorAll("[data-audit-id]").forEach(function (button) {
            button.addEventListener("click", function () {
                openDetail(button.getAttribute("data-audit-id"));
            });
        });
    }

    function buildPageNumbers(current, maxPage) {
        if (maxPage <= 7) {
            var all = [];
            var i;

            for (i = 1; i <= maxPage; i++) {
                all.push(i);
            }

            return all;
        }

        var result = [1];
        var start = Math.max(2, current - 1);
        var end = Math.min(maxPage - 1, current + 1);
        var j;

        if (start > 2) {
            result.push("...");
        }

        for (j = start; j <= end; j++) {
            result.push(j);
        }

        if (end < maxPage - 1) {
            result.push("...");
        }

        result.push(maxPage);

        return result;
    }

    function renderPager() {
        var maxPage = Math.max(1, Math.ceil(state.total / state.pageSize));
        var pages = buildPageNumbers(state.page, maxPage);
        var html = "";

        html += "<button class='pager-btn'" + (state.page <= 1 ? " disabled" : "") + " data-page='" + (state.page - 1) + "'>&lsaquo; Trước</button>";

        pages.forEach(function (p) {
            if (p === "...") {
                html += "<span class='pager-ellipsis'>…</span>";
            } else {
                html += "<button class='pager-btn" + (p === state.page ? " active" : "") + "' data-page='" + p + "'>" + p + "</button>";
            }
        });

        html += "<button class='pager-btn'" + (state.page >= maxPage ? " disabled" : "") + " data-page='" + (state.page + 1) + "'>Sau &rsaquo;</button>";

        pager.innerHTML = html;

        pager.querySelectorAll("[data-page]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var targetPage = Number(btn.getAttribute("data-page"));

                if (targetPage >= 1 && targetPage <= maxPage && targetPage !== state.page) {
                    state.page = targetPage;
                    loadList();
                }
            });
        });
    }

    function openDetail(auditLogId) {
        detailTitle.textContent = "Đang tải...";
        detailMeta.innerHTML = "";
        beforeData.textContent = "";
        afterData.textContent = "";
        diffData.textContent = "";
        detailModal.classList.remove("hidden");
        detailModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        fetch("/o/vec-admin/audit-logs/" + encodeURIComponent(auditLogId), {
            credentials: "same-origin",
            headers: { "X-CSRF-Token": csrfToken }
        })
            .then(assertOk)
            .then(function (response) {
                return response.json();
            })
            .then(function (item) {
                detailTitle.textContent = item.targetTitle || (labelTarget(item.targetType) + " #" + item.auditLogId);
                detailMeta.innerHTML = [
                    chip("Hành động", labelAction(item.actionType)),
                    chip("Đối tượng", labelTarget(item.targetType)),
                    chip("Trạng thái", labelStatus(item.status)),
                    chip("Người dùng", item.userName || "Hệ thống"),
                    chip("Thời gian", item.createDate || ""),
                    chip("Mã định danh", item.classPK || "")
                ].join("");
                beforeData.textContent = JSON.stringify(item.beforeData || {}, null, 2);
                afterData.textContent = JSON.stringify(item.afterData || {}, null, 2);
                diffData.textContent = JSON.stringify(item.diffData || [], null, 2);
            })
            .catch(function (error) {
                detailTitle.textContent = "Không thể tải dữ liệu";
                diffData.textContent = error.message || "Không thể tải chi tiết bản ghi.";
            });
    }

    function closeModal() {
        detailModal.classList.add("hidden");
        detailModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function chip(label, value) {
        return "<span class='detail-chip'><strong>" + escapeHtml(label) + ":</strong> " + escapeHtml(value || "") + "</span>";
    }

    function renderStatus(status) {
        var normalized = String(status || "").toLowerCase();

        return "<span class='status-badge status-" + normalized + "'>" + escapeHtml(labelStatus(status)) + "</span>";
    }

    function assertOk(response) {
        if (!response.ok) {
            return response.text().then(function (text) {
                throw new Error(text || ("HTTP " + response.status));
            });
        }

        return response;
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    var CACHE_TTL = 6 * 60 * 60 * 1000;

    function loadFilterOptions() {
        var cacheKey = "vec_audit_select_userId";
        var cached = _readCache(cacheKey);

        if (cached) {
            _initSearchableSelect("userId", cached);
        } else {
            fetch("/o/headless-admin-user/v1.0/user-accounts?pageSize=200&sort=name:asc", {
                credentials: "same-origin",
                headers: { "X-CSRF-Token": csrfToken }
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

                    _writeCache(cacheKey, items);
                    _initSearchableSelect("userId", items);
                })
                .catch(function () {});
        }

        document.getElementById("groupId").innerHTML = "<option value=\"\">Tất cả</option>";
    }

    function _initSearchableSelect(id, items) {
        var input = document.getElementById(id + "-input");
        var hidden = document.getElementById(id);
        var list = document.getElementById(id + "-list");

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
                li.addEventListener("mousedown", function (e) {
                    e.preventDefault();
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
            list.classList.add("hidden");
            if (!hidden.value) {
                input.value = "";
            }
        });
    }

    function _readCache(key) {
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
        }
        catch (e) {
            return null;
        }
    }

    function _writeCache(key, items) {
        try {
            localStorage.setItem(key, JSON.stringify({ ts: Date.now(), items: items }));
        }
        catch (e) {
        }
    }

    state.filters = collectFilters();
    loadFilterOptions();
    loadList();
})();
