let currentTab = 'all';
let currentPage = 1;
const pageSize = 20;
let pendingAction = null;
let pendingTaskId = null;

function searchWorkflowItems() {
    currentPage = 1;
    loadWorkflowItems();
}

function clearFilters() {
    document.getElementById('keyword').value = '';
    document.getElementById('status').value = '';
    document.getElementById('assetType').value = '';
    currentPage = 1;
    loadWorkflowItems();
}

function switchTab(tab, buttonEl) {
    currentTab = tab;
    currentPage = 1;
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    if (buttonEl) {
        buttonEl.classList.add('active');
    }
    loadWorkflowItems();
}

async function loadWorkflowItems(silent) {
    const keyword = document.getElementById('keyword').value;
    const status = document.getElementById('status').value;
    const assetType = document.getElementById('assetType').value;
    const start = (currentPage - 1) * pageSize;

    const params = new URLSearchParams({
        keyword: keyword || '',
        status: status || '',
        assetType: assetType || '',
        tab: currentTab,
        start: start,
        end: start + pageSize
    });

    try {
        // silent = true: giữ nguyên bảng hiện tại, chỉ thay nội dung khi có
        // dữ liệu mới (dùng sau khi duyệt/từ chối, tránh nháy trắng bảng).
        if (!silent) {
            showLoading();
        }
        const response = await fetch(
            `/o/vec-admin/workflow-review?${params.toString()}`,
            {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': getCsrfToken()
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        renderWorkflowItems(data.items || [], data.total || 0);
    } catch (error) {
        console.error('Error loading workflow items:', error);
        showError('Không thể tải dữ liệu. Vui lòng thử lại.');
        showEmpty();
    }
}

function renderWorkflowItems(items, total) {
    const tbody = document.getElementById('workflow-table-body');
    tbody.innerHTML = '';

    if (items.length === 0) {
        showEmpty();
        return;
    }

    hideEmpty();
    showTable();

    items.forEach(item => {
        const row = document.createElement('tr');
        const statusClass = `status-${item.status}`;
        const statusLabel = getStatusLabel(item.status);
        const assetTypeLabel = getAssetTypeLabel(item.assetType);

        // Chỉ cho duyệt/từ chối khi item còn ở bước review (reviewable).
        const actionsHtml = item.reviewable
            ? `<div class="action-buttons">
                    <button type="button" class="btn-approve" data-action="approve" data-task-id="${item.workflowTaskId}">Duyệt</button>
                    <button type="button" class="btn-reject" data-action="reject" data-task-id="${item.workflowTaskId}">Từ chối</button>
                </div>`
            : getActionNoteHtml(item);

        row.innerHTML = `
            <td class="title-cell" data-task-id="${item.workflowTaskId}" title="Xem chi tiết">${escapeHtml(truncate(item.assetTitle || 'N/A', 50))}</td>
            <td><span class="asset-type-badge">${escapeHtml(assetTypeLabel)}</span></td>
            <td>${escapeHtml(item.creatorUserName || 'N/A')}</td>
            <td>${escapeHtml(getProcessorLabel(item))}</td>
            <td><span class="status-badge ${statusClass}">${escapeHtml(statusLabel)}</span></td>
            <td>${formatDate(item.createDate)}</td>
            <td>${item.dueDate ? formatDate(item.dueDate) : 'Không có'}</td>
            <td>${actionsHtml}</td>
        `;
        tbody.appendChild(row);
    });

    renderPagination(total);
}

function renderPagination(total) {
    const container = document.getElementById('pagination-container');
    container.innerHTML = '';

    const totalPages = Math.ceil(total / pageSize);

    if (totalPages <= 1) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.textContent = '← Trước';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadWorkflowItems();
        }
    });
    container.appendChild(prevBtn);

    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.style.padding = '6px 10px';
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
    container.appendChild(pageInfo);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.textContent = 'Sau →';
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadWorkflowItems();
        }
    });
    container.appendChild(nextBtn);
}

async function openDetailModal(taskId) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailModalBody');
    const actions = document.getElementById('detailModalActions');

    body.innerHTML = '<div class="detail-loading">Đang tải...</div>';
    actions.innerHTML = '';
    modal.classList.add('active');
    syncBodyScrollLock();

    try {
        const response = await fetch(
            `/o/vec-admin/workflow-review/${taskId}/detail`,
            {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': getCsrfToken()
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        renderDetail(await response.json());
    } catch (error) {
        console.error('Error loading detail:', error);
        body.innerHTML = '<div class="detail-loading">Không thể tải chi tiết.</div>';
    }
}

function renderDetail(data) {
    const body = document.getElementById('detailModalBody');
    const actions = document.getElementById('detailModalActions');

    const content = formatDetailContent(data);
    const typeLabel = getAssetTypeLabel(data.assetType);
    const statusLabel = getStatusLabel(data.status);
    const reviewComment = formatReviewComment(data.reviewComment);

    // Link tới bài viết mà bình luận đính kèm (nếu có).
    let parentRow = '';
    if (data.parentUrl) {
        parentRow = `<div class="detail-meta-item">
            <span>Bài viết</span>
            <strong><a href="${escapeHtml(data.parentUrl)}" target="_blank" rel="noopener noreferrer">Mở bài viết</a></strong>
        </div>`;
    } else if (data.parentClassName) {
        parentRow = `<div class="detail-meta-item">
            <span>Bài viết</span>
            <strong class="detail-muted">Không tạo được link</strong>
        </div>`;
    }

    body.innerHTML = `
        <section class="detail-summary">
            <div class="detail-title-row">
                <span class="asset-type-badge">${escapeHtml(typeLabel)}</span>
                <span class="status-badge status-${data.status}">${escapeHtml(statusLabel)}</span>
            </div>
            <h2>${escapeHtml(data.assetTitle || 'N/A')}</h2>
        </section>

        <div class="detail-meta">
            <div class="detail-meta-item">
                <span>Tác giả</span>
                <strong>${escapeHtml(data.creatorUserName || 'N/A')}</strong>
            </div>
            <div class="detail-meta-item">
                <span>Người xử lý</span>
                <strong>${escapeHtml(getProcessorLabel(data))}</strong>
            </div>
            <div class="detail-meta-item">
                <span>Ngày tạo</span>
                <strong>${formatDate(data.createDate)}</strong>
            </div>
            <div class="detail-meta-item">
                <span>Cập nhật</span>
                <strong>${data.modifiedDate ? formatDate(data.modifiedDate) : 'N/A'}</strong>
            </div>
            <div class="detail-meta-item">
                <span>Hạn duyệt</span>
                <strong>${data.dueDate ? formatDate(data.dueDate) : 'Không có'}</strong>
            </div>
            ${parentRow}
        </div>

        ${reviewComment ? `
            <section class="detail-review-comment">
                <div class="detail-content-label">Ghi chú xử lý</div>
                <div class="detail-review-comment-body">${reviewComment}</div>
            </section>
        ` : ''}

        <section class="detail-content-section">
            <div class="detail-content-label">Nội dung</div>
            <div class="detail-content ${isCommentAsset(data.assetType) ? 'detail-content-comment' : ''}">${content}</div>
        </section>
    `;

    // Cho phép duyệt/từ chối ngay trong modal chi tiết nếu còn xử lý được.
    if (data.reviewable) {
        actions.innerHTML = `
            <button type="button" class="btn-confirm-approve" data-detail-action="approve" data-task-id="${data.workflowTaskId}">Duyệt</button>
            <button type="button" class="btn-confirm-reject" data-detail-action="reject" data-task-id="${data.workflowTaskId}">Từ chối</button>
        `;
    } else {
        actions.innerHTML = '';
    }
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
    syncBodyScrollLock();
}

function openApproveModal(taskId) {
    pendingAction = 'approve';
    pendingTaskId = taskId;
    document.getElementById('modalTitle').textContent = 'Xác nhận duyệt';
    document.getElementById('confirmActionBtn').className = 'btn-confirm-approve';
    document.getElementById('confirmActionBtn').textContent = 'Duyệt';
    document.getElementById('actionComment').value = '';
    document.getElementById('actionModal').classList.add('active');
    syncBodyScrollLock();
}

function openRejectModal(taskId) {
    pendingAction = 'reject';
    pendingTaskId = taskId;
    document.getElementById('modalTitle').textContent = 'Xác nhận từ chối';
    document.getElementById('confirmActionBtn').className = 'btn-confirm-reject';
    document.getElementById('confirmActionBtn').textContent = 'Từ chối';
    document.getElementById('actionComment').value = '';
    document.getElementById('actionModal').classList.add('active');
    syncBodyScrollLock();
}

function closeActionModal() {
    document.getElementById('actionModal').classList.remove('active');
    syncBodyScrollLock();
    pendingAction = null;
    pendingTaskId = null;
}

async function confirmAction() {
    if (!pendingAction || !pendingTaskId) return;

    const comment = document.getElementById('actionComment').value;
    const endpoint = `/o/vec-admin/workflow-review/${pendingTaskId}/${pendingAction}`;

    const taskId = pendingTaskId;
    const processingCell = document.querySelector(
        `[data-task-id="${taskId}"]`);
    const processingRow = processingCell ? processingCell.closest('tr') : null;

    try {
        closeActionModal();

        // Mờ ngay dòng đang xử lý để phản hồi tức thì (không reload trang).
        if (processingRow) {
            processingRow.style.opacity = '0.5';
            processingRow.style.pointerEvents = 'none';
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': getCsrfToken()
            },
            body: JSON.stringify({ comment: comment })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            showSuccess(data.message || 'Thao tác thành công');
            // Refresh im lặng: cập nhật bảng bằng JS, không reload trang.
            await loadWorkflowItems(true);
        } else {
            showError(data.message || 'Thao tác không thành công');
            if (processingRow) {
                processingRow.style.opacity = '';
                processingRow.style.pointerEvents = '';
            }
        }
    } catch (error) {
        console.error('Error performing action:', error);
        showError('Không thể thực hiện thao tác. Vui lòng thử lại.');
        if (processingRow) {
            processingRow.style.opacity = '';
            processingRow.style.pointerEvents = '';
        }
    }
}

function getCsrfToken() {
    return (window.Liferay && window.Liferay.authToken) || '';
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Chưa duyệt',
        'approved': 'Đã duyệt',
        'denied': 'Đã từ chối',
        'expired': 'Hết hạn duyệt'
    };
    return labels[status] || status;
}

function getActionNoteHtml(item) {
    if (item.status === 'denied' && isWebContentAsset(item.assetType)) {
        return '<span class="action-note">Chờ chỉnh sửa</span>';
    }
    return '';
}

function getProcessorLabel(item) {
    if (item.reviewable || item.status === 'pending' || item.status === 'expired') {
        return 'Chưa xử lý';
    }

    return item.completedByUserName || '';
}

function getAssetTypeLabel(assetType) {
    const labels = {
        'com.liferay.journal.model.JournalArticle': 'Bài viết (Web Content)',
        'com.liferay.message.boards.model.MBDiscussion': 'Bình luận',
        'com.liferay.message.boards.model.MBMessage': 'Bình luận'
    };
    return labels[assetType] || assetType || 'N/A';
}

function isWebContentAsset(assetType) {
    return assetType === 'com.liferay.journal.model.JournalArticle';
}

function isCommentAsset(assetType) {
    return assetType === 'com.liferay.message.boards.model.MBDiscussion' ||
        assetType === 'com.liferay.message.boards.model.MBMessage';
}

function formatDetailContent(data) {
    const rawContent = data.contentHtml || data.assetContent || '';

    if (!rawContent) {
        return '<span class="detail-muted">Không có nội dung.</span>';
    }

    if (isCommentAsset(data.assetType)) {
        return escapeHtml(htmlToText(rawContent)).replace(/\n/g, '<br>');
    }

    return removeEmptyHtmlTags(rawContent);
}

function formatReviewComment(comment) {
    const value = normalizeEmptyContent(comment);

    if (!value) {
        return '';
    }

    return escapeHtml(value).replace(/\n/g, '<br>');
}

function htmlToText(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || div.innerText || html).trim();
}

function removeEmptyHtmlTags(html) {
    const container = document.createElement('div');
    container.innerHTML = html;

    let removed = true;

    while (removed) {
        removed = false;

        // eslint-disable-next-line no-loop-func
        Array.from(container.querySelectorAll('*')).reverse().forEach(element => {
            if (isEmptyHtmlElement(element)) {
                element.remove();
                removed = true;
            }
        });
    }

    return container.innerHTML;
}

function isEmptyHtmlElement(element) {
    return !hasMeaningfulAttribute(element) &&
        normalizeEmptyContent(element.textContent) === '' &&
        element.children.length === 0;
}

function hasMeaningfulAttribute(element) {
    return Array.from(element.attributes).some(attribute => {
        const name = attribute.name.toLowerCase();
        const value = normalizeEmptyContent(attribute.value);

        if (!value) {
            return false;
        }

        if (
            name === 'class' ||
            name === 'style' ||
            name === 'id' ||
            name.startsWith('data-') ||
            name.startsWith('aria-')
        ) {
            return false;
        }

        return true;
    });
}

function normalizeEmptyContent(content) {
    return String(content || '')
        .replace(/\u00a0/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';

    try {
        const date = parseUtcDate(dateString);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleString('vi-VN', {
            hour12: false
        });
    } catch (e) {
        return dateString;
    }
}

function parseUtcDate(dateString) {
    const value = String(dateString).trim();

    if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(value)) {
        return new Date(value);
    }

    const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);

    if (!match) {
        return new Date(value);
    }

    return new Date(Date.UTC(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6] || 0)
    ));
}

function truncate(text, length) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

function syncBodyScrollLock() {
    const hasOpenModal = Boolean(document.querySelector('.modal.active'));
    document.documentElement.classList.toggle(
        'workflow-modal-open', hasOpenModal);
    document.body.classList.toggle('workflow-modal-open', hasOpenModal);
}

function showLoading() {
    document.getElementById('loading-spinner').style.display = 'block';
    document.getElementById('table-container').style.display = 'none';
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('pagination-container').style.display = 'none';
}

function showTable() {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('table-container').style.display = 'block';
}

function showEmpty() {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('table-container').style.display = 'none';
    document.getElementById('empty-state').style.display = 'block';
    document.getElementById('pagination-container').style.display = 'none';
}

function hideEmpty() {
    document.getElementById('empty-state').style.display = 'none';
}

function showError(message) {
    const container = document.getElementById('message-container');
    container.innerHTML = `<div class="error-message">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function showSuccess(message) {
    const container = document.getElementById('message-container');
    container.innerHTML = `<div class="success-message">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function bindEvents() {
    // Bộ lọc
    document.getElementById('btn-search').addEventListener('click', searchWorkflowItems);
    document.getElementById('btn-clear').addEventListener('click', clearFilters);

    // Tabs (event delegation)
    document.getElementById('tabs').addEventListener('click', (e) => {
        const button = e.target.closest('.tab-button');
        if (button) {
            switchTab(button.dataset.tab, button);
        }
    });

    // Click trong bảng (sinh động -> event delegation):
    // - click tiêu đề -> mở modal chi tiết
    // - nút Duyệt/Từ chối
    document.getElementById('workflow-table-body').addEventListener('click', (e) => {
        const titleCell = e.target.closest('.title-cell');
        if (titleCell) {
            openDetailModal(Number(titleCell.dataset.taskId));
            return;
        }

        const button = e.target.closest('button[data-action]');
        if (!button) {
            return;
        }

        const taskId = Number(button.dataset.taskId);

        if (button.dataset.action === 'approve') {
            openApproveModal(taskId);
        } else if (button.dataset.action === 'reject') {
            openRejectModal(taskId);
        }
    });

    // Modal thao tác
    document.getElementById('btn-cancel').addEventListener('click', closeActionModal);
    document.getElementById('confirmActionBtn').addEventListener('click', confirmAction);

    document.getElementById('actionModal').addEventListener('click', (e) => {
        if (e.target.id === 'actionModal') {
            closeActionModal();
        }
    });

    // Modal chi tiết
    document.getElementById('btn-detail-close').addEventListener('click', closeDetailModal);

    document.getElementById('detailModal').addEventListener('click', (e) => {
        if (e.target.id === 'detailModal') {
            closeDetailModal();
        }
    });

    // Nút Duyệt/Từ chối bên trong modal chi tiết (event delegation)
    document.getElementById('detailModalActions').addEventListener('click', (e) => {
        const button = e.target.closest('button[data-detail-action]');
        if (!button) {
            return;
        }

        const taskId = Number(button.dataset.taskId);
        closeDetailModal();

        if (button.dataset.detailAction === 'approve') {
            openApproveModal(taskId);
        } else if (button.dataset.detailAction === 'reject') {
            openRejectModal(taskId);
        }
    });
}

function init() {
    bindEvents();
    loadWorkflowItems();
}

// Hỗ trợ cả khi script được inject sau khi DOM đã sẵn sàng.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
