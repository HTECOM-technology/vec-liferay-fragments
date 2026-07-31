<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<portlet:defineObjects/>
<portlet:resourceURL id="/getThreadComments" var="getThreadCommentsUrl"/>
<portlet:actionURL name="deleteComment" var="deleteCommentUrl"/>
<portlet:actionURL name="replyComment" var="replyCommentUrl"/>

<link rel="stylesheet" href="<%= renderRequest.getContextPath() %>/css/select2.min.css"/>
<script src="<%= renderRequest.getContextPath() %>/css/select2.min.js"></script>

<%
    List<Object[]> comments = (List<Object[]>) renderRequest.getAttribute("comments");
    int currentPage = (Integer) renderRequest.getAttribute("currentPage");
    int totalPages = (Integer) renderRequest.getAttribute("totalPages");
    long totalCount = (Long) renderRequest.getAttribute("totalCount");
    String kwAttr = (String) renderRequest.getAttribute("keyword");
    String dateFromAttr = (String) renderRequest.getAttribute("dateFrom");
    String dateToAttr = (String) renderRequest.getAttribute("dateTo");
    String categoryAttr = (String) renderRequest.getAttribute("category");
    String selectedUsersAttr = (String) renderRequest.getAttribute("selectedUsers");

    int pageSize = 20;
    long showStart = totalCount == 0 ? 0 : (long) (currentPage - 1) * pageSize + 1;
    long showEnd = Math.min((long) currentPage * pageSize, totalCount);

    String scheme = request.getScheme();
    String host = request.getServerName();
    int port = request.getServerPort();
    String baseUrl = scheme + "://" + host + ":" + port;
    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");
%>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .vec-comment-portlet {
        font-family: 'Be Vietnam Pro', sans-serif;
        background: #f8f9fc;
        padding: 24px;
        border-radius: 16px;
        margin: 20px;
    }

    /* ── FILTER BAR ── */
    .filter-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: flex-end;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 18px;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }

    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
        min-width: 160px;
    }

    .filter-group label {
        font-size: 11px;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: .5px;
    }

    .filter-group input,
    .filter-group select {
        height: 36px;
        padding: 0 10px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 13px;
        font-family: inherit;
        color: #111827;
        background: #fff;
        outline: none;
        transition: border-color .15s;
    }

    .filter-group input:focus,
    .filter-group select:focus {
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, .08);
    }

    .filter-actions {
        display: flex;
        gap: 8px;
        align-items: flex-end;
        padding-bottom: 1px;
    }

    .btn {
        height: 36px;
        padding: 0 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        border: none;
        transition: all .15s;
        white-space: nowrap;
    }

    .btn-primary {
        background: #4f46e5;
        color: #fff;
    }

    .btn-primary:hover {
        background: #4338ca;
    }

    .btn-secondary {
        background: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
        background: #e5e7eb;
    }

    /* ── TABLE WRAPPER ── */
    .table-wrapper {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
    }

    /* ── TABLE META (count + page size) ── */
    .table-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 18px;
        border-bottom: 1px solid #f0f0f0;
        background: #fafafa;
    }

    .table-meta-count {
        font-size: 13px;
        color: #6b7280;
    }

    .table-meta-count strong {
        color: #111827;
    }

    .page-size-label {
        font-size: 13px;
        color: #6b7280;
    }

    /* ── TABLE ── */
    .comment-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13.5px;
    }

    .comment-table thead th {
        background: #1f2937;
        color: #f9fafb;
        padding: 13px 14px;
        text-align: left;
        font-weight: 600;
        font-size: 12.5px;
        letter-spacing: .3px;
        white-space: nowrap;
    }

    .comment-table td {
        padding: 13px 14px;
        border-bottom: 1px solid #f0f2f5;
        vertical-align: top;
    }

    .comment-table tbody tr:last-child td {
        border-bottom: none;
    }

    .comment-table tbody tr:hover td {
        background: #f5f7ff;
    }

    .comment-table tbody tr:nth-child(even) td {
        background: #fafafa;
    }

    .comment-table tbody tr:nth-child(even):hover td {
        background: #f5f7ff;
    }

    .comment-content {
        line-height: 1.55;
        max-width: 480px;
        color: #374151;
    }

    .comment-content img {
        max-width: 100%;
    }

    .article-link {
        color: #4f46e5;
        font-weight: 600;
        text-decoration: none;
        font-size: 13px;
    }

    .article-link:hover {
        text-decoration: underline;
        color: #4338ca;
    }

    .account-name {
        font-weight: 600;
        color: #111827;
        font-size: 13px;
    }

    .screen-name {
        color: #9ca3af;
        font-size: 11.5px;
        margin-top: 2px;
    }

    .date-col {
        white-space: nowrap;
        color: #6b7280;
        font-size: 12.5px;
    }

    .no-data {
        text-align: center;
        color: #9ca3af;
        padding: 48px;
        font-size: 14px;
    }

    /* ── ACTION COLUMN ── */
    .action-cell {
        text-align: center;
        position: relative;
    }

    .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: #6b7280;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 20px;
        font-weight: 700;
        line-height: 1;
        transition: background .15s, color .15s;
        display: inline-flex;
        align-items: center;
        letter-spacing: 1px;
    }

    .action-btn:hover {
        background: #f3f4f6;
        color: #111827;
    }

    .dropdown-menu {
        display: none;
        position: fixed;
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
        width: 190px;
        z-index: 9999;
        overflow: hidden;
        animation: dropIn .12s ease;
    }

    @keyframes dropIn {
        from {
            opacity: 0;
            transform: translateY(-6px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .dropdown-menu.open {
        display: block;
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 11px 16px;
        font-size: 13.5px;
        font-family: inherit;
        color: #374151;
        cursor: pointer;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        transition: background .1s;
        font-weight: 500;
    }

    .dropdown-item:hover {
        background: #f5f7ff;
        color: #4f46e5;
    }

    .dropdown-item.danger:hover {
        background: #fff5f5;
        color: #dc2626;
    }

    .dropdown-item .item-icon {
        font-size: 15px;
        width: 18px;
        text-align: center;
    }

    .dropdown-divider {
        height: 1px;
        background: #f0f2f5;
        margin: 2px 0;
    }

    /* ── PAGINATION ── */
    .pagination-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 18px;
        border-top: 1px solid #f0f0f0;
        background: #fafafa;
    }

    .pagination-info {
        font-size: 13px;
        color: #6b7280;
    }

    .pagination-controls {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .page-btn {
        min-width: 34px;
        height: 34px;
        padding: 0 8px;
        border: 1px solid #e5e7eb;
        background: #fff;
        color: #374151;
        font-size: 13px;
        font-family: inherit;
        font-weight: 500;
        border-radius: 8px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all .15s;
    }

    .page-btn:hover:not(:disabled) {
        border-color: #4f46e5;
        color: #4f46e5;
        background: #f5f7ff;
    }

    .page-btn.active {
        background: #4f46e5;
        color: #fff;
        border-color: #4f46e5;
        font-weight: 700;
    }

    .page-btn:disabled {
        opacity: .4;
        cursor: not-allowed;
    }

    .page-ellipsis {
        color: #9ca3af;
        padding: 0 4px;
        font-size: 14px;
        user-select: none;
    }

    /* ── CUSTOM SELECT2 UI ── */

    /* Khung hiển thị chính (Selection) */
    .select2-container--default .select2-selection--multiple {
        border: 1px solid #d1d5db !important;
        border-radius: 8px !important;
        min-height: 38px !important;
        padding: 2px 8px !important;
        transition: all 0.2s ease !important;
        background-color: #fff !important;
    }

    /* Khi focus vào select */
    .select2-container--default.select2-container--focus .select2-selection--multiple {
        border-color: #4f46e5 !important;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1) !important;
    }

    /* Các item (Tags) đã chọn */
    .select2-container--default .select2-selection--multiple .select2-selection__choice {
        background-color: #eef2ff !important;
        border: 1px solid #e0e7ff !important;
        color: #4f46e5 !important;
        border-radius: 6px !important;
        padding: 2px 8px 2px 24px !important;
        margin-top: 4px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        position: relative !important;
    }

    /* Nút xóa (x) trên tag */
    .select2-container--default .select2-selection--multiple .select2-selection__choice__remove {
        color: #4f46e5 !important;
        border: none !important;
        background: transparent !important;
        font-weight: bold !important;
        margin-right: 0 !important;
        position: absolute !important;
        left: 6px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
    }

    .select2-container--default .select2-selection--multiple .select2-selection__choice__remove:hover {
        background: transparent !important;
        color: #dc2626 !important;
    }

    /* Phần Dropdown (Danh sách xổ xuống) */
    .select2-dropdown {
        border: 1px solid #e5e7eb !important;
        border-radius: 10px !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
        overflow: hidden !important;
        z-index: 9999 !important;
    }

    /* Ô tìm kiếm trong dropdown */
    .select2-container--default .select2-search--dropdown .select2-search__field {
        border: 1px solid #d1d5db !important;
        border-radius: 6px !important;
        padding: 6px 10px !important;
        margin: 8px !important;
        width: calc(100% - 16px) !important;
        outline: none !important;
    }

    /* Các option trong danh sách */
    .select2-container--default .select2-results__option {
        padding: 8px 12px !important;
        font-size: 13px !important;
        color: #374151 !important;
    }

    /* Khi hover hoặc dùng phím mũi tên chọn option */
    .select2-container--default .select2-results__option--highlighted[aria-selected] {
        background-color: #4f46e5 !important;
        color: white !important;
    }

    /* Option đang được chọn trong list */
    .select2-container--default .select2-results__option[aria-selected=true] {
        background-color: #f3f4f6 !important;
        color: #111827 !important;
    }

    /* Tùy chỉnh scrollbar cho danh sách kết quả Select2 */
    .select2-results__options::-webkit-scrollbar {
        width: 6px;  /* Giảm độ rộng scroll dọc */
        height: 4px; /* Giảm độ cao scroll ngang */
    }

    .select2-results__options::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    .select2-results__options::-webkit-scrollbar-thumb {
        background: #d1d5db; /* Màu của thanh trượt */
        border-radius: 10px;
    }

    .select2-results__options::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
    }

    .comment-modal {
        display: none;
        position: fixed;
        z-index: 10000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
    }

    .modal-content {
        background: #fff;
        margin: 5% auto;
        width: 650px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        max-height: 85vh;
    }

    .modal-header {
        padding: 16px 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-body {
        padding: 20px;
        overflow-y: auto;
    }

    .close-modal {
        font-size: 28px;
        cursor: pointer;
        color: #aaa;
    }

    .close-modal:hover {
        color: #000;
    }

    .tree-node {
        border-left: 2px solid #e5e7eb;
        margin-left: 10px;
        padding-left: 10px;
    }

    .tree-node.level-0 {
        border-left: none;
        margin-left: 0;
        padding-left: 0;
    }
</style>

<div class="vec-comment-portlet">

    <!-- ── FILTER BAR ── -->
    <div class="filter-bar">
        <div class="filter-group" style="flex: 2; min-width: 220px;">
            <label>Tìm kiếm nội dung</label>
            <input type="text" id="filterKeyword" placeholder="Nhập từ khoá comment..." value="<%= kwAttr %>">
        </div>
        <div class="filter-group" style="min-width: 200px;">
            <label>Tiêu chí</label>
            <select id="filterCategory">
                <option value="">-- Tất cả --</option>
                <option value="Tin chuyên ngành"<%= "Tin chuyên ngành".equals(categoryAttr) ? " selected" : "" %>>Tin
                    chuyên ngành
                </option>
                <option value="Tin bộ tài chính"<%= "Tin bộ tài chính".equals(categoryAttr) ? " selected" : "" %>>Tin bộ
                    tài chính
                </option>
                <option value="VEC trên báo"<%= "VEC trên báo".equals(categoryAttr) ? " selected" : "" %>>VEC trên báo
                </option>
                <option value="Tuổi trẻ VEC"<%= "Tuổi trẻ VEC".equals(categoryAttr) ? " selected" : "" %>>Tuổi trẻ VEC
                </option>
                <option value="Hình ảnh - Video"<%= "Hình ảnh - Video".equals(categoryAttr) ? " selected" : "" %>>Hình
                    ảnh - Video
                </option>
                <option value="Đảng - Đoàn thể"<%= "Đảng - Đoàn thể".equals(categoryAttr) ? " selected" : "" %>>Đảng -
                    Đoàn thể
                </option>
                <option value="Tin hoạt động"<%= "Tin hoạt động".equals(categoryAttr) ? " selected" : "" %>>Tin hoạt
                    động
                </option>
                <option value="Thông cáo báo chí"<%= "Thông cáo báo chí".equals(categoryAttr) ? " selected" : "" %>>
                    Thông cáo báo chí
                </option>
                <option value="Thông tin mời thầu"<%= "Thông tin mời thầu".equals(categoryAttr) ? " selected" : "" %>>
                    Thông tin mời thầu
                </option>
                <option value="Thông tin tuyển dụng"<%= "Thông tin tuyển dụng".equals(categoryAttr) ? " selected" : "" %>>
                    Thông tin tuyển dụng
                </option>
                <option value="Báo cáo thường niên"<%= "Báo cáo thường niên".equals(categoryAttr) ? " selected" : "" %>>
                    Báo cáo thường niên
                </option>
                <option value="ATGT Trên đường cao tốc VEC"<%= "ATGT Trên đường cao tốc VEC".equals(categoryAttr) ? " selected" : "" %>>
                    ATGT Trên đường cao tốc VEC
                </option>
                <option value="Văn hoá giao thông"<%= "Văn hoá giao thông".equals(categoryAttr) ? " selected" : "" %>>
                    Văn hoá giao thông
                </option>
                <option value="Quy định - Chính sách"<%= "Quy định - Chính sách".equals(categoryAttr) ? " selected" : "" %>>
                    Quy định - Chính sách
                </option>
            </select>
        </div>
        <div class="filter-group" style="min-width: 200px;">
            <label>Tài khoản</label>
            <select id="filterAccount" multiple>
                <%
                    List<String> users = (List<String>) renderRequest.getAttribute("users");
                    if (users != null) {
                        for (String u : users) {
                            boolean sel = selectedUsersAttr != null && java.util.Arrays.asList(selectedUsersAttr.split(",")).contains(u);
                %>
                <option value="<%= u %>"<%= sel ? " selected" : "" %>><%= u %>
                </option>
                <%
                        }
                    }
                %>
            </select>
        </div>
        <div class="filter-group">
            <label>Từ ngày</label>
            <input type="date" id="filterDateFrom" value="<%= dateFromAttr %>">
        </div>
        <div class="filter-group">
            <label>Đến ngày</label>
            <input type="date" id="filterDateTo" value="<%= dateToAttr %>">
        </div>
        <div class="filter-actions">
            <button type="button" class="btn btn-primary" onclick="applyFilter()">🔍 Tìm kiếm</button>
            <button type="button" class="btn btn-secondary" onclick="resetFilter()">↺ Đặt lại</button>
        </div>
    </div>

    <!-- ── TABLE WRAPPER ── -->
    <div class="table-wrapper">

        <!-- table meta -->
        <div class="table-meta">
            <span class="table-meta-count">
                Hiển thị <strong><%= showStart %>–<%= showEnd %></strong> / <strong><%= totalCount %></strong> comment
            </span>
            <span class="page-size-label"><%= pageSize %> dòng / trang</span>
        </div>

        <table class="comment-table" id="commentTable">
            <thead>
            <tr>
                <th style="width: 42%">Nội dung comment</th>
                <th style="width: 23%">Bài viết</th>
                <th style="width: 15%">Tài khoản</th>
                <th style="width: 13%">Ngày comment</th>
                <th style="width: 7%; text-align:center;">Thao tác</th>
            </tr>
            </thead>
            <tbody id="tableBody">
            <%
                if (comments == null || comments.isEmpty()) {
            %>
            <tr>
                <td colspan="5" class="no-data">Không có dữ liệu comment</td>
            </tr>
            <%
            } else {
                for (Object[] row : comments) {
                    String content = (String) row[0];
                    String title = (String) row[1];
                    String urlTitle = (String) row[3];
                    String siteUrl = (String) row[4];
                    String hoTen = (String) row[5];
                    String account = (String) row[6];
                    java.util.Date date = (java.util.Date) row[7];
                    String categories = (String) row[10];
                    String fullLink = baseUrl + "/web" + siteUrl + "/-/" + urlTitle;
            %>
            <tr data-thread-id="<%= row[8] %>" data-message-id="<%= row[9] %>">
                <td class="comment-content" onclick="openCommentThread(this.closest('tr'), '<%= row[9] %>')"
                    style="cursor: pointer; color: #111827; transition: color 0.2s;"><%= content != null ? content : "" %>
                </td>
                <td>
                    <a class="article-link" href="<%= fullLink %>" target="_blank"><%= title != null ? title : "" %>
                    </a>
                    <% if (categories != null && !categories.isEmpty()) { %>
                    <div style="margin-top: 4px; display: flex; flex-wrap: wrap; gap: 4px;">
                        <%
                            String[] catArray = categories.split(",");
                            for (String cat : catArray) {
                                String trimmedCat = cat.trim();
                                if (!trimmedCat.isEmpty()) {
                        %>
                        <span style="display: inline-block; background: #eef2ff; color: #4f46e5;
                                 font-size: 10px; padding: 2px 8px; border-radius: 4px;
                                 border: 1px solid #e0e7ff; font-weight: 500; white-space: nowrap;">
                            <%= trimmedCat %>
                        </span>
                        <%
                                }
                            }
                        %>
                    </div>
                    <% } %>
                </td>
                <td>
                    <div class="account-name"><%= hoTen != null ? hoTen : "" %>
                    </div>
                    <div class="screen-name">@<%= account != null ? account : "" %>
                    </div>
                </td>
                <td class="date-col"><%= date != null ? sdf.format(date) : "" %>
                </td>
                <td class="action-cell">
                    <button class="action-btn" onclick="toggleDropdown(this)" title="Thao tác">···</button>
                    <div class="dropdown-menu">
                        <button class="dropdown-item" onclick="handleReply(this)">
                            <span class="item-icon">↩️</span> Trả lời comment
                        </button>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item danger" onclick="handleDelete(this)">
                            <span class="item-icon">🗑️</span> Xóa comment
                        </button>
                    </div>
                </td>
            </tr>
            <%
                    }
                }
            %>
            </tbody>
        </table>

        <!-- ── PAGINATION ── -->
        <div class="pagination-bar">
            <span class="pagination-info">Trang <%= currentPage %> / <%= totalPages %></span>
            <div class="pagination-controls">
                <button class="page-btn" onclick="goPage(<%= currentPage - 1 %>)"
                        <%= currentPage <= 1 ? "disabled" : "" %>>&#8249;
                </button>

                <%
                    // Build page range: always show 1, last, and ±2 around current
                    java.util.TreeSet<Integer> pageSet = new java.util.TreeSet<>();
                    pageSet.add(1);
                    pageSet.add(totalPages);
                    for (int pi = Math.max(2, currentPage - 2); pi <= Math.min(totalPages - 1, currentPage + 2); pi++) {
                        pageSet.add(pi);
                    }
                    Integer prevPage = null;
                    for (int pg : pageSet) {
                        if (prevPage != null && pg - prevPage > 1) {
                %>
                <span class="page-ellipsis">…</span>
                <%
                    }
                %>
                <button class="page-btn <%= pg == currentPage ? "active" : "" %>"
                        onclick="goPage(<%= pg %>)"><%= pg %>
                </button>
                <%
                        prevPage = pg;
                    }
                %>

                <button class="page-btn" onclick="goPage(<%= currentPage + 1 %>)"
                        <%= currentPage >= totalPages ? "disabled" : "" %>>&#8250;
                </button>
            </div>
        </div>
    </div>
</div>

<%-- ── Reply modal ── --%>
<div id="replyModal" style="display:none; position:fixed; z-index:10001; left:0; top:0; width:100%; height:100%;
     background:rgba(0,0,0,0.5); backdrop-filter:blur(4px);">
    <div style="background:#fff; margin:8% auto; width:560px; border-radius:12px;
         box-shadow:0 10px 25px rgba(0,0,0,0.2); display:flex; flex-direction:column; max-height:80vh;
         font-family:'Be Vietnam Pro',sans-serif;">
        <div style="padding:16px 20px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">
            <h3 style="font-size:15px; font-weight:600; color:#111827; margin:0;">Phản hồi bình luận</h3>
            <span onclick="closeReplyModal()"
                  style="font-size:28px; cursor:pointer; color:#aaa; line-height:1;">&times;</span>
        </div>
        <div style="padding:20px; overflow-y:auto; flex:1;">
            <div id="replyPreview" style="background:#f8f9fc; border:1px solid #e5e7eb; border-radius:8px;
                 padding:12px; margin-bottom:16px; font-size:13px; color:#6b7280; line-height:1.5;
                 max-height:80px; overflow:hidden;"></div>
            <label style="font-size:11px; font-weight:600; color:#6b7280; text-transform:uppercase;
                   letter-spacing:.5px; display:block; margin-bottom:6px;">Nội dung phản hồi</label>
            <textarea id="replyContent" rows="5"
                      style="width:100%; border:1px solid #d1d5db; border-radius:8px; padding:10px;
                       font-size:13px; font-family:inherit; outline:none; resize:vertical;
                       transition:border-color .15s;"
                      onfocus="this.style.borderColor='#4f46e5'"
                      onblur="this.style.borderColor='#d1d5db'"
                      placeholder="Nhập nội dung phản hồi..."></textarea>
        </div>
        <div style="padding:14px 20px; border-top:1px solid #eee; display:flex; justify-content:flex-end; gap:8px;">
            <button onclick="closeReplyModal()" class="btn btn-secondary">Hủy</button>
            <button onclick="submitReply()" class="btn btn-primary">Gửi phản hồi</button>
        </div>
    </div>
</div>

<div id="commentModal" class="comment-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Chi tiết bình luận</h3>
            <span class="close-modal" onclick="closeModal()">&times;</span>
        </div>
        <div class="modal-body">
            <div id="commentTreeContainer"></div>
        </div>
    </div>
</div>

<script>
    (function () {
        // ── URL-based navigation (preserves portlet lifecycle params) ─────
        var renderBaseUrl = '<portlet:renderURL/>';
        var portletNamespace = '<portlet:namespace/>';
        var deleteCommentUrl = '<%= deleteCommentUrl %>';
        var replyCommentUrl = '<%= replyCommentUrl %>';
        var currentPageNum = <%= currentPage %>;

        function getFilterState() {
            return {
                page: currentPageNum,
                keyword: document.getElementById('filterKeyword').value.trim(),
                category: document.getElementById('filterCategory').value,
                dateFrom: document.getElementById('filterDateFrom').value,
                dateTo: document.getElementById('filterDateTo').value,
                selectedUsers: $('#filterAccount').val() ? $('#filterAccount').val().join(',') : ''
            };
        }

        function buildRenderUrl(params) {
            var url = new URL(renderBaseUrl);
            var ns = portletNamespace;
            Object.keys(params).forEach(function (k) {
                var v = params[k];
                if (v !== null && v !== undefined && String(v) !== '') {
                    url.searchParams.set(ns + k, v);
                }
            });
            return url.toString();
        }

        window.applyFilter = function () {
            var f = getFilterState();
            f.page = 1;
            window.location.href = buildRenderUrl(f);
        };

        window.resetFilter = function () {
            document.getElementById('filterKeyword').value = '';
            document.getElementById('filterCategory').value = '';
            document.getElementById('filterDateFrom').value = '';
            document.getElementById('filterDateTo').value = '';
            $('#filterAccount').val(null).trigger('change');
            document.getElementById('selectedUsersHidden').value = '';
            window.location.href = renderBaseUrl;
        };

        window.goPage = function (p) {
            var f = getFilterState();
            f.page = p;
            window.location.href = buildRenderUrl(f);
        };

        // ── Select2 init ──────────────────────────────────────────────────
        $('#filterAccount').select2({
            placeholder: "Chọn tài khoản",
            allowClear: true,
            width: '100%',
            closeOnSelect: false
        });

        // ── Popup Thread & Tree Logic ─────────────────────────────────────
        window.openCommentThread = function (row, messageId) {
            var threadId = row.getAttribute('data-thread-id');
            if (!threadId) return;

            var container = document.getElementById('commentTreeContainer');
            container.innerHTML = '<div style="padding:20px; text-align:center;">⌛ Đang tải dữ liệu...</div>';
            document.getElementById('commentModal').style.display = 'block';

            var url = '<%= getThreadCommentsUrl %>&<portlet:namespace/>threadId=' + threadId;

            fetch(url)
                .then(function (res) {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .then(function (data) {
                    if (!data || data.length === 0) {
                        container.innerHTML = '<div style="padding:20px; color:#9ca3af;">Không có dữ liệu.</div>';
                        return;
                    }

                    var tree = buildTree(data);
                    var target = findNode(tree, String(messageId));

                    if (!target) {
                        container.innerHTML = '<div style="padding:20px; color:#9ca3af;">Không tìm thấy bình luận.</div>';
                        return;
                    }

                    container.innerHTML = renderFlatList(flattenTree([target], 0));
                })
                .catch(function (err) {
                    container.innerHTML = '<div style="padding:20px; color:red;">Lỗi: ' + err.message + '</div>';
                    console.error("Lỗi Fetch:", err);
                });
        };

        function findNode(nodes, id) {
            for (var i = 0; i < nodes.length; i++) {
                if (String(nodes[i].id) === id) return nodes[i];
                if (nodes[i].children && nodes[i].children.length > 0) {
                    var found = findNode(nodes[i].children, id);
                    if (found) return found;
                }
            }
            return null;
        }

        function buildTree(list) {
            var map = {}, roots = [];
            list.forEach(function (item) {
                map[item.id] = Object.assign({}, item, {children: []});
            });
            list.forEach(function (item) {
                if (item.parentId !== "0" && map[item.parentId]) {
                    map[item.parentId].children.push(map[item.id]);
                } else {
                    roots.push(map[item.id]);
                }
            });
            return roots;
        }

        function flattenTree(nodes, level, result) {
            level = level || 0;
            result = result || [];
            nodes.forEach(function (node) {
                result.push(Object.assign({}, node, {level: level}));
                if (node.children && node.children.length > 0) {
                    flattenTree(node.children, level + 1, result);
                }
            });
            return result;
        }

        function renderFlatList(flatData) {
            if (!flatData || flatData.length === 0) {
                return '<div style="text-align:center; padding:20px; color:#9ca3af;">Chưa có bình luận nào.</div>';
            }

            var html = '<div style="padding: 10px; background: #fff;">';

            flatData.forEach(function (node) {
                var indent = node.level * 32;
                var isChild = node.level > 0;
                var author = node.author || 'Người dùng ẩn danh';
                var date = node.date
                    ? new Date(parseInt(node.date)).toLocaleString('vi-VN')
                    : '';

                var replyBox = '';

                if (node.level === 0) {
                    replyBox =
                        '<div style="margin-top:12px;">' +
                        '<textarea id="reply-input-' + node.id + '"' +
                        'style="width:100%; border:1px solid #d1d5db; border-radius:8px; padding:8px; font-size:13px;"' +
                        'placeholder="Nhập phản hồi..."></textarea>' +

                        '<div style="margin-top:6px; text-align:right;">' +
                        '<button onclick="submitInlineReply(\'' + node.id + '\')"' +
                        'style="background:#4f46e5;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">' +
                        'Gửi' +
                        '</button>' +
                        '</div>' +
                        '</div>';
                }

                html +=
                    '<div class="comment-wrapper" style="margin-left: ' + indent + 'px; position: relative; margin-bottom: 16px;">' +

                    (isChild
                        ? '<div style="position:absolute;left:-20px;top:-16px;width:20px;height:32px;border-left:2px solid #e5e7eb;border-bottom:2px solid #e5e7eb;border-bottom-left-radius:10px;"></div>'
                        : '') +

                    '<div style="background:' + (isChild ? '#ffffff' : '#f8f9fc') + ';border:1px solid ' + (isChild ? '#eef0f2' : '#e5e7eb') + ';border-radius:12px;padding:14px;box-shadow:' + (isChild ? 'none' : '0 2px 4px rgba(0,0,0,0.02)') + ';">' +

                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
                    '<div style="display:flex;align-items:center;gap:8px;">' +
                    '<div style="width:28px;height:28px;background:' + stringToColor(author) + ';color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;text-transform:uppercase;">' + author.charAt(0) + '</div>' +
                    '<span style="font-weight:600;color:#111827;font-size:13.5px;">' + author + '</span>' +
                    (node.level > 0 ? '<span style="background:#f3f4f6;color:#6b7280;font-size:10px;padding:1px 6px;border-radius:4px;">Phản hồi</span>' : '') +
                    '</div>' +
                    '<span style="font-size:11.5px;color:#9ca3af;">' + date + '</span>' +
                    '</div>' +

                    '<div style="font-size:14px;color:#374151;line-height:1.6;word-break:break-word;">' + node.content + '</div>' +

                    '<div style="margin-top:10px;display:flex;justify-content:flex-end;">' +
                    '<button onclick="handleDeleteInModal(\'' + node.id + '\')" style="background:none;border:none;color:#dc2626;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:4px;padding:4px 8px;border-radius:4px;" onmouseover="this.style.backgroundColor=\'#fff5f5\'" onmouseout="this.style.backgroundColor=\'transparent\'">' +
                    '<span>🗑️</span> Xóa' +
                    '</button>' +
                    '</div>' +
                    replyBox +
                    '<div id="reply-box-' + node.id + '" style="display:none; margin-top:10px;">' +
                    '<textarea id="reply-input-' + node.id + '"' +
                    'style="width:100%; border:1px solid #d1d5db; border-radius:8px; padding:8px; font-size:13px;"' +
                    'placeholder="Nhập phản hồi..."></textarea>' +

                    '<div style="margin-top:6px; text-align:right;">' +
                    '<button onClick="submitInlineReply(\'' + node.id + '\')"' +
                    'style="background:#4f46e5;color:white;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;">' +
                    'Gửi' +
                    '</button>' +
                    '</div>' +
                    '</div>' +

                    '</div></div>';
            });

            html += '</div>';
            return html;
        }

        function stringToColor(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            var c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
            return "#" + "00000".substring(0, 6 - c.length) + c;
        }

        window.closeModal = function () {
            document.getElementById('commentModal').style.display = 'none';
        };

        // ── Dropdown ──────────────────────────────────────────────────────
        window.toggleDropdown = function (btn) {
            var menu = btn.nextElementSibling;
            var isOpen = menu.classList.contains('open');
            document.querySelectorAll('.dropdown-menu.open').forEach(function (m) {
                m.classList.remove('open');
            });
            if (!isOpen) {
                menu.classList.add('open');
                var menuW = 190;
                var rect = btn.getBoundingClientRect();
                var top = rect.bottom + 4;
                var left = rect.right - menuW;
                if (left < 8) left = 8;
                if (left + menuW > window.innerWidth - 8) left = window.innerWidth - menuW - 8;
                menu.style.top = top + 'px';
                menu.style.left = left + 'px';
            }
        };

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.action-cell')) {
                document.querySelectorAll('.dropdown-menu.open').forEach(function (m) {
                    m.classList.remove('open');
                });
            }
        });

        // ── Shared: POST to an action URL, preserving current filter state ──
        function submitAction(actionUrl, params) {
            var form = document.createElement('form');
            form.method = 'post';
            form.action = actionUrl;

            function addField(name, value) {
                var inp = document.createElement('input');
                inp.type = 'hidden';
                inp.name = portletNamespace + name;
                inp.value = value !== undefined && value !== null ? value : '';
                form.appendChild(inp);
            }

            // Action-specific params
            Object.keys(params).forEach(function (k) {
                addField(k, params[k]);
            });

            // Preserve filter + page state so forwardRenderParams keeps context
            var f = getFilterState();
            Object.keys(f).forEach(function (k) {
                addField(k, f[k]);
            });

            document.body.appendChild(form);
            form.submit();
        }

        // ── Delete (table row dropdown) ───────────────────────────────────
        window.handleDelete = function (btn) {
            btn.closest('.dropdown-menu').classList.remove('open');
            var row = btn.closest('tr');
            var messageId = row.getAttribute('data-message-id');
            if (!confirm('Xóa comment này và toàn bộ phản hồi con?')) return;
            submitAction(deleteCommentUrl, {messageId: messageId});
        };

        // ── Delete (inside thread modal) ──────────────────────────────────
        window.handleDeleteInModal = function (commentId) {
            if (!confirm('Xóa comment này và toàn bộ phản hồi con?')) return;
            closeModal();
            submitAction(deleteCommentUrl, {messageId: commentId});
        };

        // ── Reply (table row dropdown) ────────────────────────────────────
        window.handleReply = function (btn) {
            btn.closest('.dropdown-menu').classList.remove('open');
            var row = btn.closest('tr');
            var messageId = row.getAttribute('data-message-id');
            var preview = row.querySelector('.comment-content')
                ? row.querySelector('.comment-content').textContent.trim().slice(0, 120)
                : '';
            openReplyModal(messageId, preview);
        };

        // ── Reply modal ───────────────────────────────────────────────────
        var replyTargetId = null;

        window.openReplyModal = function (messageId, previewText) {
            replyTargetId = messageId;
            document.getElementById('replyPreview').textContent = previewText;
            document.getElementById('replyContent').value = '';
            document.getElementById('replyModal').style.display = 'block';
            setTimeout(function () {
                document.getElementById('replyContent').focus();
            }, 100);
        };

        window.closeReplyModal = function () {
            document.getElementById('replyModal').style.display = 'none';
            replyTargetId = null;
        };

        window.submitReply = function () {
            var content = document.getElementById('replyContent').value.trim();
            var targetId = replyTargetId; // capture before closeReplyModal() nulls it
            console.log(replyTargetId)
            if (!content) {
                document.getElementById('replyContent').style.borderColor = '#dc2626';
                return;
            }
            closeReplyModal();
            submitAction(replyCommentUrl, {
                parentMessageId: targetId,
                replyContent: content
            });
        };

        // Close reply modal on backdrop click
        document.getElementById('replyModal').addEventListener('click', function (e) {
            if (e.target === this) closeReplyModal();
        });

        window.submitInlineReply = function (messageId) {
            var input = document.getElementById('reply-input-' + messageId);
            var content = input.value.trim();

            if (!content) {
                input.style.borderColor = '#dc2626';
                return;
            }

            submitAction(replyCommentUrl, {
                parentMessageId: messageId,
                replyContent: content
            });
        };
    })();
</script>