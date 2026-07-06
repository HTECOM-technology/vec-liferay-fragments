(function () {
    var state = {
        page: 1,
        pageSize: 20,
        total: 0,
        keyword: ""
    };

    var apiBase = "/o/vec-admin/admin-network-policies";
    var csrfToken = getAuthToken();

    var form = document.getElementById("policyForm");
    var message = document.getElementById("message");
    var tableBody = document.getElementById("policyTableBody");
    var summary = document.getElementById("summary");
    var pager = document.getElementById("pager");

    document.getElementById("searchForm").addEventListener("submit", function (event) {
        event.preventDefault();
        state.page = 1;
        state.keyword = valueOf("keyword");
        loadPolicies();
    });

    document.getElementById("reloadList").addEventListener("click", loadPolicies);
    document.getElementById("cancelEdit").addEventListener("click", resetForm);

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        savePolicy();
    });

    function loadPolicies() {
        var params = new URLSearchParams();
        params.set("page", String(state.page));
        params.set("pageSize", String(state.pageSize));

        if (state.keyword) {
            params.set("keyword", state.keyword);
        }

        tableBody.innerHTML = "<tr><td colspan='7'>Đang tải...</td></tr>";
        summary.textContent = "Đang tải...";

        request(apiBase + "?" + params.toString())
            .then(function (data) {
                state.total = Number(data.total || 0);
                renderTable(data.items || []);
                renderPager();
            })
            .catch(function (error) {
                tableBody.innerHTML = "<tr><td colspan='7'>Không thể tải dữ liệu.</td></tr>";
                summary.textContent = error.message || "Không thể tải dữ liệu.";
            });
    }

    function savePolicy() {
        var payload = {
            name: valueOf("name"),
            networkAddress: valueOf("networkAddress"),
            priority: Number(valueOf("priority") || 100),
            description: valueOf("description"),
            enabled: document.getElementById("enabled").checked
        };
        var policyId = valueOf("policyId");
        var url = policyId ? apiBase + "/" + encodeURIComponent(policyId) : apiBase;
        var method = policyId ? "PUT" : "POST";

        clearMessage();

        if (!payload.name) {
            showMessage("Tên policy không được rỗng.", "error");
            return;
        }

        if (!isValidNetworkAddress(payload.networkAddress)) {
            showMessage("Địa chỉ mạng chỉ hỗ trợ IPv4 hoặc IPv4 CIDR.", "error");
            return;
        }

        document.getElementById("savePolicy").disabled = true;

        request(url, {
            method: method,
            body: JSON.stringify(payload)
        })
            .then(function () {
                showMessage("Đã lưu policy.", "success");
                resetForm();
                loadPolicies();
            })
            .catch(function (error) {
                showMessage(error.message || "Không thể lưu policy.", "error");
            })
            .finally(function () {
                document.getElementById("savePolicy").disabled = false;
            });
    }

    function renderTable(items) {
        if (!items.length) {
            tableBody.innerHTML = "<tr><td colspan='7'>Chưa có policy nào.</td></tr>";
            summary.textContent = "0 policy";
            return;
        }

        tableBody.innerHTML = items.map(function (item) {
            return "" +
                "<tr>" +
                    "<td><strong>" + escapeHtml(item.name) + "</strong><div class='muted'>" + escapeHtml(item.description || "") + "</div></td>" +
                    "<td>" + escapeHtml(item.networkAddress) + "</td>" +
                    "<td>" + escapeHtml(item.networkType) + "</td>" +
                    "<td>" + renderEnabled(item.enabled) + "</td>" +
                    "<td>" + escapeHtml(item.priority) + "</td>" +
                    "<td>" + escapeHtml(item.modifiedDate || "") + "<div class='muted'>" + escapeHtml(item.lastModifiedByUserName || item.userName || "") + "</div></td>" +
                    "<td>" + renderActions(item) + "</td>" +
                "</tr>";
        }).join("");

        summary.textContent = state.total + " policy";

        tableBody.querySelectorAll("[data-edit]").forEach(function (button) {
            button.addEventListener("click", function () {
                editPolicy(JSON.parse(button.getAttribute("data-edit")));
            });
        });

        tableBody.querySelectorAll("[data-toggle-id]").forEach(function (button) {
            button.addEventListener("click", function () {
                setEnabled(
                    button.getAttribute("data-toggle-id"),
                    button.getAttribute("data-enabled") === "true"
                );
            });
        });

        tableBody.querySelectorAll("[data-delete-id]").forEach(function (button) {
            button.addEventListener("click", function () {
                deletePolicy(button.getAttribute("data-delete-id"));
            });
        });
    }

    function renderEnabled(enabled) {
        return enabled ?
            "<span class='badge badge-on'>Đang bật</span>" :
            "<span class='badge badge-off'>Đang tắt</span>";
    }

    function renderActions(item) {
        var encoded = escapeHtml(JSON.stringify(item));
        var nextEnabled = !item.enabled;

        return "" +
            "<div class='row-actions'>" +
                "<button type='button' class='secondary' data-edit='" + encoded + "'>Sửa</button>" +
                "<button type='button' class='secondary' data-toggle-id='" + escapeHtml(item.policyId) + "' data-enabled='" + nextEnabled + "'>" + (nextEnabled ? "Bật" : "Tắt") + "</button>" +
                "<button type='button' class='danger' data-delete-id='" + escapeHtml(item.policyId) + "'>Xóa</button>" +
            "</div>";
    }

    function renderPager() {
        var maxPage = Math.max(1, Math.ceil(state.total / state.pageSize));
        var html = "";
        var i;

        html += "<button type='button' " + (state.page <= 1 ? "disabled" : "") + " data-page='" + (state.page - 1) + "'>Trước</button>";

        for (i = 1; i <= maxPage; i++) {
            if ((i === 1) || (i === maxPage) || Math.abs(i - state.page) <= 1) {
                html += "<button type='button' class='" + (i === state.page ? "active" : "") + "' data-page='" + i + "'>" + i + "</button>";
            }
            else if (Math.abs(i - state.page) === 2) {
                html += "<span>...</span>";
            }
        }

        html += "<button type='button' " + (state.page >= maxPage ? "disabled" : "") + " data-page='" + (state.page + 1) + "'>Sau</button>";
        pager.innerHTML = html;

        pager.querySelectorAll("[data-page]").forEach(function (button) {
            button.addEventListener("click", function () {
                var page = Number(button.getAttribute("data-page"));

                if (page >= 1 && page <= maxPage && page !== state.page) {
                    state.page = page;
                    loadPolicies();
                }
            });
        });
    }

    function editPolicy(item) {
        document.getElementById("policyId").value = item.policyId || "";
        document.getElementById("name").value = item.name || "";
        document.getElementById("networkAddress").value = item.networkAddress || "";
        document.getElementById("priority").value = item.priority || 100;
        document.getElementById("description").value = item.description || "";
        document.getElementById("enabled").checked = Boolean(item.enabled);
        document.getElementById("formTitle").textContent = "Cập nhật policy";
        document.getElementById("cancelEdit").classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function resetForm() {
        form.reset();
        document.getElementById("policyId").value = "";
        document.getElementById("priority").value = "100";
        document.getElementById("formTitle").textContent = "Thêm policy";
        document.getElementById("cancelEdit").classList.add("hidden");
    }

    function setEnabled(policyId, enabled) {
        clearMessage();

        request(apiBase + "/" + encodeURIComponent(policyId) + "/enabled?enabled=" + enabled, {
            method: "PUT"
        })
            .then(function () {
                showMessage("Đã cập nhật trạng thái policy.", "success");
                loadPolicies();
            })
            .catch(function (error) {
                showMessage(error.message || "Không thể cập nhật trạng thái.", "error");
            });
    }

    function deletePolicy(policyId) {
        if (!window.confirm("Xóa policy này?")) {
            return;
        }

        clearMessage();

        request(apiBase + "/" + encodeURIComponent(policyId), {
            method: "DELETE"
        })
            .then(function () {
                showMessage("Đã xóa policy.", "success");
                loadPolicies();
            })
            .catch(function (error) {
                showMessage(error.message || "Không thể xóa policy.", "error");
            });
    }

    function request(url, options) {
        var requestOptions = options || {};
        requestOptions.credentials = "same-origin";
        requestOptions.headers = Object.assign({
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken
        }, requestOptions.headers || {});

        return fetch(buildApiUrl(url), requestOptions)
            .then(function (response) {
                return response.text().then(function (text) {
                    var data = text ? JSON.parse(text) : {};

                    if (!response.ok) {
                        throw new Error(data.message || "HTTP " + response.status);
                    }

                    return data;
                });
            });
    }

    function getAuthToken() {
        if (window.Liferay && window.Liferay.authToken) {
            return window.Liferay.authToken;
        }

        return new URLSearchParams(window.location.search).get("p_auth") || "";
    }

    function buildApiUrl(url) {
        if (!csrfToken || !url || /^https?:\/\//i.test(url) || url.indexOf("p_auth=") >= 0) {
            return url;
        }

        return url + (url.indexOf("?") >= 0 ? "&" : "?") + "p_auth=" + encodeURIComponent(csrfToken);
    }

    function isValidNetworkAddress(value) {
        return isValidSingleIp(value) || isValidCidr(value);
    }

    function isValidCidr(value) {
        var parts;
        var prefix;

        if (!value || value.indexOf("/") < 0) {
            return false;
        }

        parts = value.trim().split("/");

        if (parts.length !== 2 || !isValidSingleIp(parts[0])) {
            return false;
        }

        prefix = Number(parts[1]);

        return String(prefix) === parts[1] && prefix >= 0 && prefix <= 32;
    }

    function isValidSingleIp(value) {
        var parts;

        if (!value || value.indexOf("/") >= 0) {
            return false;
        }

        parts = value.trim().split(".");

        if (parts.length !== 4) {
            return false;
        }

        return parts.every(function (part) {
            if (!/^(0|[1-9][0-9]{0,2})$/.test(part)) {
                return false;
            }

            return Number(part) <= 255;
        });
    }

    function valueOf(id) {
        var element = document.getElementById(id);

        return element && element.value ? element.value.trim() : "";
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = "message " + type;
    }

    function clearMessage() {
        message.textContent = "";
        message.className = "message hidden";
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    loadPolicies();
})();
