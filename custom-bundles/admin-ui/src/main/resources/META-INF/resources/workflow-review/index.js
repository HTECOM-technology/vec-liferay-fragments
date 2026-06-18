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

async function loadWorkflowItems() {
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
        showLoading();
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
        // Item đã bị từ chối (trả về tác giả chỉnh sửa) thì không thao tác được nữa.
        const actionsHtml = item.reviewable
            ? `<div class="action-buttons">
                    <button type="button" class="btn-approve" data-action="approve" data-task-id="${item.workflowTaskId}">Duyệt</button>
                    <button type="button" class="btn-reject" data-action="reject" data-task-id="${item.workflowTaskId}">Từ chối</button>
                </div>`
            : `<span class="action-note">Chờ tác giả chỉnh sửa</span>`;

        row.innerHTML = `
            <td title="${item.assetTitle || ''}">${truncate(item.assetTitle || 'N/A', 50)}</td>
            <td><span class="asset-type-badge">${assetTypeLabel}</span></td>
            <td>${item.creatorUserName || 'N/A'}</td>
            <td>${item.assigneeUserName || 'Chưa assign'}</td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
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

function openApproveModal(taskId) {
    pendingAction = 'approve';
    pendingTaskId = taskId;
    document.getElementById('modalTitle').textContent = 'Xác nhận duyệt';
    document.getElementById('confirmActionBtn').className = 'btn-confirm-approve';
    document.getElementById('confirmActionBtn').textContent = 'Duyệt';
    document.getElementById('actionComment').value = '';
    document.getElementById('actionModal').classList.add('active');
}

function openRejectModal(taskId) {
    pendingAction = 'reject';
    pendingTaskId = taskId;
    document.getElementById('modalTitle').textContent = 'Xác nhận từ chối';
    document.getElementById('confirmActionBtn').className = 'btn-confirm-reject';
    document.getElementById('confirmActionBtn').textContent = 'Từ chối';
    document.getElementById('actionComment').value = '';
    document.getElementById('actionModal').classList.add('active');
}

function closeActionModal() {
    document.getElementById('actionModal').classList.remove('active');
    pendingAction = null;
    pendingTaskId = null;
}

async function confirmAction() {
    if (!pendingAction || !pendingTaskId) return;

    const comment = document.getElementById('actionComment').value;
    const endpoint = `/o/vec-admin/workflow-review/${pendingTaskId}/${pendingAction}`;

    try {
        closeActionModal();
        showLoading();

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
            await loadWorkflowItems();
        } else {
            showError(data.message || 'Thao tác không thành công');
        }
    } catch (error) {
        console.error('Error performing action:', error);
        showError('Không thể thực hiện thao tác. Vui lòng thử lại.');
    }
}

function getCsrfToken() {
    return (window.Liferay && window.Liferay.authToken) || '';
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Chưa duyệt',
        'approved': 'Đã duyệt',
        'denied': 'Đã từ chối (chờ chỉnh sửa)',
        'expired': 'Đã hết hạn duyệt'
    };
    return labels[status] || status;
}

function getAssetTypeLabel(assetType) {
    const labels = {
        'com.liferay.journal.model.JournalArticle': 'Bài viết (Web Content)',
        'com.liferay.message.boards.model.MBDiscussion': 'Bình luận',
        'com.liferay.message.boards.model.MBMessage': 'Bình luận'
    };
    return labels[assetType] || assetType || 'N/A';
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    } catch (e) {
        return dateString;
    }
}

function truncate(text, length) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
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

    // Nút Duyệt/Từ chối trong bảng (sinh động -> event delegation)
    document.getElementById('workflow-table-body').addEventListener('click', (e) => {
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

    // Modal
    document.getElementById('btn-cancel').addEventListener('click', closeActionModal);
    document.getElementById('confirmActionBtn').addEventListener('click', confirmAction);

    // Đóng modal khi click ra ngoài
    document.getElementById('actionModal').addEventListener('click', (e) => {
        if (e.target.id === 'actionModal') {
            closeActionModal();
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
