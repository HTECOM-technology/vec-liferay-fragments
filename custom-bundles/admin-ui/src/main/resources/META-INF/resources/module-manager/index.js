(function () {
    var API_URL = "/o/vec-admin/system-modules";
    var CONFIRM_TEXT = "CONFIRM";
    var queryParams = new URLSearchParams(window.location.search);
    var csrfToken =
        (window.Liferay && window.Liferay.authToken) ||
        queryParams.get("p_auth") ||
        "";

    var state = {
        items: [],
        filteredItems: [],
        pendingAction: null
    };

    var tableBody = document.getElementById("moduleTableBody");
    var summary = document.getElementById("summary");
    var toast = document.getElementById("toast");
    var detailModal = document.getElementById("detailModal");
    var detailTitle = document.getElementById("detailTitle");
    var detailMeta = document.getElementById("detailMeta");
    var detailHeaders = document.getElementById("detailHeaders");
    var detailRegisteredServices = document.getElementById("detailRegisteredServices");
    var detailServicesInUse = document.getElementById("detailServicesInUse");
    var confirmModal = document.getElementById("confirmModal");
    var confirmTitle = document.getElementById("confirmTitle");
    var confirmMessage = document.getElementById("confirmMessage");
    var confirmInput = document.getElementById("confirmInput");
    var confirmError = document.getElementById("confirmError");
    var submitConfirm = document.getElementById("submitConfirm");

    document.getElementById("reloadButton").addEventListener("click", loadModules);
    document.getElementById("filterForm").addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilters();
    });
    document.getElementById("resetFilters").addEventListener("click", function () {
        document.getElementById("filterForm").reset();
        applyFilters();
    });
    document.getElementById("closeDetailModal").addEventListener("click", closeDetailModal);
    detailModal.addEventListener("click", function (event) {
        if (event.target && event.target.getAttribute("data-close-modal") === "true") {
            closeDetailModal();
        }
    });
    document.getElementById("closeConfirmModal").addEventListener("click", closeConfirmModal);
    document.getElementById("cancelConfirm").addEventListener("click", closeConfirmModal);
    confirmModal.addEventListener("click", function (event) {
        if (event.target && event.target.getAttribute("data-close-confirm") === "true") {
            closeConfirmModal();
        }
    });
    submitConfirm.addEventListener("click", submitPendingAction);
    confirmInput.addEventListener("input", function () {
        confirmError.classList.add("hidden");
    });

    loadModules();
    activateWebContentMenu();
    requestAnimationFrame(() => window.__initTableScroll());

    function activateWebContentMenu() {
        var tries = 0;
        function attempt() {
            var panelId = "panel-manage-site_administration_configuration-link";
            var panel = document.getElementById(panelId);
            if (!panel) {
                if (++tries < 50) { setTimeout(attempt, 100); }
                return;
            }
            var active = panel.querySelector("li.active.nav-item");
            if (active) { active.classList.remove("active"); }
            var link = document.querySelector("a[id='data-vec-module-manager']");
            if (link) {
                var li = link.closest("li.nav-item");
                if (li) { li.classList.add("active"); }
            }
            panel.classList.remove("collapsed");
            var buildPanel = document.getElementById("panel-manage-site_administration_configuration");
            if (buildPanel) { buildPanel.classList.add("show"); }
        }
        attempt();
    }

    function loadModules() {
        tableBody.innerHTML = "<tr><td colspan='14'>Đang tải...</td></tr>";
        summary.textContent = "Đang tải...";

        fetch(withAuth(API_URL), {
            credentials: "same-origin",
            headers: { "X-CSRF-Token": csrfToken }
        })
            .then(assertOk)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                state.items = data.items || [];
                applyFilters();
            })
            .catch(function (error) {
                tableBody.innerHTML = "<tr><td colspan='14'>Không thể tải danh sách module.</td></tr>";
                summary.textContent = error.message || "Không thể tải danh sách module.";
            });
    }

    function applyFilters() {
        var nameFilter = normalize(valueOf("nameFilter"));
        var codeFilter = normalize(valueOf("codeFilter"));
        var stateFilter = valueOf("stateFilter");
        var typeFilter = valueOf("typeFilter");

        state.filteredItems = state.items.filter(function (item) {
            var nameText = normalize([
                item.name,
                item.description,
                item.vendor,
                item.category
            ].join(" "));
            var codeText = normalize([
                item.bundleId,
                item.symbolicName,
                item.location,
                item.activator
            ].join(" "));

            if (nameFilter && nameText.indexOf(nameFilter) === -1) {
                return false;
            }

            if (codeFilter && codeText.indexOf(codeFilter) === -1) {
                return false;
            }

            if (stateFilter && item.state !== stateFilter) {
                return false;
            }

            if (typeFilter === "fragment" && !item.fragment) {
                return false;
            }

            if (typeFilter === "bundle" && item.fragment) {
                return false;
            }

            if (typeFilter === "current" && !item.currentBundle) {
                return false;
            }

            return true;
        });

        renderTable();
    }

    function renderTable() {
        if (!state.filteredItems.length) {
            tableBody.innerHTML = "<tr><td colspan='14'>Không tìm thấy module nào.</td></tr>";
            summary.textContent = "0 / " + state.items.length + " module";
            return;
        }

        tableBody.innerHTML = state.filteredItems.map(function (item) {
            return "" +
                "<tr>" +
                    "<td class='mono'>" + escapeHtml(item.bundleId) + "</td>" +
                    "<td class='module-name-column'>" + renderName(item) + "</td>" +
                    "<td><span class='truncate mono' title='" + escapeAttr(item.symbolicName || "") + "'>" + escapeHtml(item.symbolicName || "") + "</span></td>" +
                    "<td class='mono'>" + escapeHtml(item.version || "") + "</td>" +
                    "<td>" + renderState(item) + "</td>" +
                    "<td class='mono'>" + escapeHtml(item.startLevel || "") + "</td>" +
                    "<td>" + renderType(item) + "</td>" +
                    "<td>" + escapeHtml(item.vendor || "") + "</td>" +
                    "<td>" + escapeHtml(item.category || "") + "</td>" +
                    "<td>" + escapeHtml(item.registeredServiceCount || 0) + "</td>" +
                    "<td>" + escapeHtml(item.servicesInUseCount || 0) + "</td>" +
                    "<td class='mono'>" + escapeHtml(item.lastModified || "") + "</td>" +
                    "<td><span class='truncate mono' title='" + escapeAttr(item.location || "") + "'>" + escapeHtml(item.location || "") + "</span></td>" +
                    "<td class='module-actions-column'>" + renderActions(item) + "</td>" +
                "</tr>";
        }).join("");

        summary.textContent = state.filteredItems.length + " / " + state.items.length + " module";

        tableBody.querySelectorAll("[data-detail-id]").forEach(function (button) {
            button.addEventListener("click", function () {
                openDetail(button.getAttribute("data-detail-id"));
            });
        });

        tableBody.querySelectorAll("[data-toggle-id]").forEach(function (button) {
            button.addEventListener("click", function () {
                openConfirm(
                    button.getAttribute("data-toggle-id"),
                    button.getAttribute("data-toggle-enabled") === "true"
                );
            });
        });
    }

    function renderName(item) {
        var html = "<strong>" + escapeHtml(item.name || "(Không có tên)") + "</strong>";

        if (item.description) {
            html += "<div class='description'>" + escapeHtml(item.description) + "</div>";
        }

        return html;
    }

    function renderState(item) {
        var className = item.active ? "badge badge-on" : "badge badge-off";
        var label = item.active ? "ACTIVE" : item.state;

        if (item.state === "STARTING" || item.state === "STOPPING") {
            className = "badge badge-warning";
        }

        return "<span class='" + className + "'>" + escapeHtml(label || "") + "</span>";
    }

    function renderType(item) {
        if (item.currentBundle) {
            return "<span class='badge badge-warning'>Admin UI</span>";
        }

        if (item.fragment) {
            return "<span class='badge badge-off'>Fragment</span>";
        }

        return "<span class='badge badge-on'>Bundle</span>";
    }

    function renderActions(item) {
        var targetEnabled = !item.active;
        var toggleLabel = item.active ? "Tắt" : "Bật";
        var disabled = item.canToggle ? "" : " disabled title='" + escapeAttr(item.disabledReason || "") + "'";

        return "" +
            "<div class='row-actions'>" +
                "<button type='button' class='link-button' data-detail-id='" + escapeAttr(item.bundleId) + "'>Chi tiết</button>" +
                "<button type='button' class='" + (item.active ? "danger" : "primary") + "' data-toggle-id='" + escapeAttr(item.bundleId) + "' data-toggle-enabled='" + targetEnabled + "'" + disabled + ">" + toggleLabel + "</button>" +
            "</div>";
    }

    function openDetail(bundleId) {
        var item = findItem(bundleId);

        if (!item) {
            return;
        }

        detailTitle.textContent = item.name || item.symbolicName || ("Bundle " + item.bundleId);
        detailMeta.innerHTML = [
            metaItem("ID", item.bundleId),
            metaItem("Mã module", item.symbolicName),
            metaItem("Version", item.version),
            metaItem("Trạng thái", item.state),
            metaItem("Start level", item.startLevel),
            metaItem("Location", item.location)
        ].join("");
        detailHeaders.textContent = JSON.stringify(item.headers || {}, null, 2);
        detailRegisteredServices.textContent = item.registeredServices || "(Không có)";
        detailServicesInUse.textContent = item.servicesInUse || "(Không có)";
        detailModal.classList.remove("hidden");
        detailModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeDetailModal() {
        detailModal.classList.add("hidden");
        detailModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function openConfirm(bundleId, enabled) {
        var item = findItem(bundleId);

        if (!item) {
            return;
        }

        state.pendingAction = {
            bundleId: bundleId,
            enabled: enabled
        };

        confirmTitle.textContent = enabled ? "Bật module" : "Tắt module";
        confirmMessage.textContent =
            (enabled ? "Bạn chuẩn bị bật " : "Bạn chuẩn bị tắt ") +
            (item.name || item.symbolicName || ("Bundle " + item.bundleId)) +
            " (" + (item.symbolicName || item.bundleId) + ").";
        confirmInput.value = "";
        confirmError.classList.add("hidden");
        confirmModal.classList.remove("hidden");
        confirmModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        setTimeout(function () {
            confirmInput.focus();
        }, 0);
    }

    function closeConfirmModal() {
        state.pendingAction = null;
        confirmModal.classList.add("hidden");
        confirmModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function submitPendingAction() {
        if (!state.pendingAction) {
            return;
        }

        if (confirmInput.value.trim() !== CONFIRM_TEXT) {
            confirmError.textContent = "Vui lòng nhập CONFIRM để xác nhận thao tác.";
            confirmError.classList.remove("hidden");
            return;
        }

        submitConfirm.disabled = true;

        fetch(
            withAuth(API_URL + "/" + encodeURIComponent(state.pendingAction.bundleId) +
                "/state?enabled=" + encodeURIComponent(state.pendingAction.enabled)
            ),
            {
                credentials: "same-origin",
                headers: { "X-CSRF-Token": csrfToken },
                method: "PUT"
            }
        )
            .then(assertOk)
            .then(function (response) {
                return response.json();
            })
            .then(function () {
                showToast("Đã cập nhật trạng thái module.");
                closeConfirmModal();
                loadModules();
            })
            .catch(function (error) {
                confirmError.textContent = error.message || "Không thể cập nhật trạng thái module.";
                confirmError.classList.remove("hidden");
            })
            .finally(function () {
                submitConfirm.disabled = false;
            });
    }

    function findItem(bundleId) {
        return state.items.find(function (item) {
            return String(item.bundleId) === String(bundleId);
        });
    }

    function metaItem(label, value) {
        return "<div><span>" + escapeHtml(label) + "</span>" + escapeHtml(value || "") + "</div>";
    }

    function valueOf(id) {
        var node = document.getElementById(id);
        var value = node ? node.value : "";

        return value ? value.trim() : "";
    }

    function normalize(value) {
        return String(value || "").toLowerCase();
    }

    function assertOk(response) {
        if (response.ok) {
            return response;
        }

        return response.text().then(function (text) {
            var message = text || response.statusText;

            try {
                message = JSON.parse(text).message || message;
            }
            catch (error) {
            }

            throw new Error(message);
        });
    }

    function withAuth(url) {
        if (!csrfToken) {
            return url;
        }

        return url + (url.indexOf("?") === -1 ? "?" : "&") +
            "p_auth=" + encodeURIComponent(csrfToken);
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove("hidden");

        setTimeout(function () {
            toast.classList.add("hidden");
        }, 2600);
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, "&#096;");
    }
})();
