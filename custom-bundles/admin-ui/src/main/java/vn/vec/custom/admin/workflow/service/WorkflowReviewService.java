package vn.vec.custom.admin.workflow.service;

import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.service.JournalArticleLocalServiceUtil;
import com.liferay.message.boards.model.MBMessage;
import com.liferay.message.boards.service.MBMessageLocalServiceUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.OrderByComparator;
import com.liferay.portal.kernel.workflow.WorkflowConstants;
import com.liferay.portal.kernel.workflow.WorkflowInstance;
import com.liferay.portal.kernel.workflow.WorkflowInstanceManagerUtil;
import com.liferay.portal.kernel.workflow.WorkflowTask;
import com.liferay.portal.kernel.workflow.WorkflowTaskManagerUtil;
import com.liferay.portal.workflow.comparator.WorkflowComparatorFactory;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.workflow.model.WorkflowReviewItem;
import vn.vec.custom.admin.workflow.model.WorkflowReviewQuery;
import vn.vec.custom.admin.workflow.persistence.WorkflowReviewHistoryRepository;

@Component(service = WorkflowReviewService.class)
public class WorkflowReviewService {

	public List<WorkflowReviewItem> getWorkflowReviewItems(
			long companyId, long userId, WorkflowReviewQuery query)
		throws PortalException {

		List<WorkflowReviewItem> items = new ArrayList<>();
		List<WorkflowReviewItem> mergedItems = _getMergedWorkflowReviewItems(
			companyId, userId, query);

		int start = Math.max(0, query.getStart());
		int end = query.getEnd();

		if ((end <= start) || (end > mergedItems.size())) {
			end = mergedItems.size();
		}

		if (start >= mergedItems.size()) {
			return items;
		}

		items.addAll(mergedItems.subList(start, end));

		return items;
	}

	public int getWorkflowReviewItemsCount(
			long companyId, long userId, WorkflowReviewQuery query)
		throws PortalException {

		return _getMergedWorkflowReviewItems(companyId, userId, query).size();
	}

	public WorkflowReviewItem getWorkflowReviewItemDetail(
			long companyId, long workflowTaskId)
		throws PortalException {

		try {
			WorkflowTask task = WorkflowTaskManagerUtil.getWorkflowTask(
				companyId, workflowTaskId);

			// Query rỗng -> không filter, luôn trả về item.
			WorkflowReviewItem item = _buildWorkflowReviewItem(
				companyId, task, new WorkflowReviewQuery());

			if (item != null) {
				_populateContentHtml(item);

				// Task đã hoàn tất: lấy trạng thái/ghi chú chính xác từ lịch sử
				// (theo workflowTaskId) thay vì suy đoán từ asset (asset có thể
				// đã sang version khác). Task chưa hoàn tất thì bổ sung thông tin
				// người xử lý gần nhất như cũ.
				if (task.isCompleted()) {
					item.setReviewable(false);
					_overlayHistoryByTask(companyId, item);
				}
				else {
					_enrichWithLatestHistory(companyId, item);
				}
			}

			return item;
		}
		catch (PortalException portalException) {
			try {
				WorkflowReviewItem item =
					_workflowReviewHistoryRepository.getItem(
						companyId, workflowTaskId);

				if (item != null) {
					_populateContentHtml(item);

					return item;
				}
			}
			catch (Exception exception) {
				_log.warn(
					"Không lấy được lịch sử workflow task=" + workflowTaskId,
					exception);
			}

			throw portalException;
		}
	}

	private List<WorkflowReviewItem> _getMergedWorkflowReviewItems(
			long companyId, long userId, WorkflowReviewQuery query)
		throws PortalException {

		List<WorkflowReviewItem> items = new ArrayList<>();
		List<WorkflowTask> tasks = new ArrayList<>();
		Map<String, WorkflowReviewItem> activeAssetItems = new HashMap<>();
		Set<Long> workflowTaskIds = new HashSet<>();

		// Lấy task Liferay theo ngày tạo để dữ liệu nguồn ổn định; sau đó merge
		// lịch sử xử lý và sort lại một lần trước khi phân trang.
		OrderByComparator<WorkflowTask> orderByComparator =
			_workflowComparatorFactory.getTaskCreateDateComparator(false);

		// Get workflow tasks based on tab
		if ("mine".equals(query.getTab())) {
			// "Tôi xử lý": task đang gán cho user hiện tại.
			int taskCount = WorkflowTaskManagerUtil.getWorkflowTaskCountByUser(
				companyId, userId, false);

			tasks = WorkflowTaskManagerUtil.getWorkflowTasksByUser(
				companyId, userId, false, 0, taskCount,
				orderByComparator);
		} else {
			// "Tất cả": toàn bộ task chưa hoàn thành của company (góc nhìn
			// quản trị). Không dùng getWorkflowTasksByUserRoles vì task gán cho
			// một user cụ thể (vd workflow comment) sẽ bị bỏ sót.
			int taskCount = WorkflowTaskManagerUtil.getWorkflowTaskCount(
				companyId, false);

			tasks = WorkflowTaskManagerUtil.getWorkflowTasks(
				companyId, false, 0, taskCount,
				orderByComparator);
		}

		List<WorkflowReviewItem> noAssetItems = new ArrayList<>();

		for (WorkflowTask task : tasks) {
			WorkflowReviewItem item = _buildWorkflowReviewItem(
				companyId, task, query);

			if (item == null) {
				continue;
			}

			workflowTaskIds.add(item.getWorkflowTaskId());

			if (!_hasAssetKey(item)) {
				noAssetItems.add(item);

				continue;
			}

			// Một asset có thể còn nhiều task active cùng lúc: ví dụ task
			// "update" cũ còn sót sau khi tác giả gửi duyệt lại (Liferay tạo
			// workflow instance mới với task "review" mà không đóng instance
			// cũ, vì sửa bài chưa duyệt không tạo version mới -> cùng classPK).
			// Chỉ giữ task mới nhất để phản ánh đúng trạng thái hiện tại, tránh
			// hiển thị "Đã từ chối" trong khi asset đã quay lại chờ duyệt.
			String assetKey = _getAssetKey(item);
			WorkflowReviewItem existing = activeAssetItems.get(assetKey);

			if ((existing == null) || _isNewerTask(item, existing)) {
				activeAssetItems.put(assetKey, item);
			}
		}

		items.addAll(activeAssetItems.values());
		items.addAll(noAssetItems);

		try {
			for (WorkflowReviewItem item :
					_workflowReviewHistoryRepository.getItems(companyId)) {

				if (workflowTaskIds.contains(item.getWorkflowTaskId()) ||
					!_matchesHistoryTab(item, userId, query) ||
					!_matchesQuery(item, query)) {

					continue;
				}

				WorkflowReviewItem activeItem = _hasAssetKey(item) ?
					activeAssetItems.get(_getAssetKey(item)) : null;

				if (activeItem != null) {
					if (_canUseHistoryForActiveItem(activeItem)) {
						_copyHistoryFields(item, activeItem);
					}

					continue;
				}

				items.add(item);
			}
		}
		catch (Exception exception) {
			_log.warn("Không lấy được lịch sử workflow review", exception);
		}

		_sortItems(items, query);

		return items;
	}

	public void approveWorkflowTask(
			long companyId, long userId, long workflowTaskId,
			String comment)
		throws PortalException {

		WorkflowTask task = WorkflowTaskManagerUtil.getWorkflowTask(
			companyId, workflowTaskId);

		// (2c) Chặn thao tác trên task đã hoàn tất (double-submit / gọi API trực
		// tiếp) -> tránh ghi đè trạng thái sai.
		_ensureTaskActionable(task);

		if (task.getAssigneeUserId() != userId) {
			WorkflowTaskManagerUtil.assignWorkflowTaskToUser(
				companyId, userId, workflowTaskId, userId, null, null, null);
		}

		task = WorkflowTaskManagerUtil.getWorkflowTask(companyId, workflowTaskId);

		WorkflowReviewItem approvedItem = _buildCompletedHistoryItem(
			companyId, userId, task, "approved", comment);

		String transitionName = _resolveTransitionName(
			companyId, userId, workflowTaskId, true);

		Map<String, Serializable> workflowContext = new HashMap<>();
		WorkflowTaskManagerUtil.completeWorkflowTask(
			companyId, userId, workflowTaskId, transitionName, comment,
			workflowContext);

		if (approvedItem != null) {
			try {
				_workflowReviewHistoryRepository.saveCompletedItem(approvedItem);
			}
			catch (Exception exception) {
				_log.warn(
					"Không lưu được lịch sử duyệt workflow task=" +
						workflowTaskId,
					exception);
			}
		}
	}

	public void rejectWorkflowTask(
			long companyId, long userId, long workflowTaskId,
			String comment)
		throws PortalException {

		WorkflowTask task = WorkflowTaskManagerUtil.getWorkflowTask(
			companyId, workflowTaskId);

		// (2c) Chặn thao tác trên task đã hoàn tất (double-submit / gọi API trực
		// tiếp) -> tránh ghi đè trạng thái sai.
		_ensureTaskActionable(task);

		if (task.getAssigneeUserId() != userId) {
			WorkflowTaskManagerUtil.assignWorkflowTaskToUser(
				companyId, userId, workflowTaskId, userId, null, null, null);
		}

		task = WorkflowTaskManagerUtil.getWorkflowTask(companyId, workflowTaskId);

		WorkflowReviewItem rejectedItem = _buildCompletedHistoryItem(
			companyId, userId, task, "denied", comment);

		String transitionName = _resolveTransitionName(
			companyId, userId, workflowTaskId, false);

		Map<String, Serializable> workflowContext = new HashMap<>();
		WorkflowTaskManagerUtil.completeWorkflowTask(
			companyId, userId, workflowTaskId, transitionName, comment,
			workflowContext);

		if (rejectedItem != null) {
			try {
				_workflowReviewHistoryRepository.saveCompletedItem(rejectedItem);
			}
			catch (Exception exception) {
				_log.warn(
					"Không lưu được lịch sử workflow task=" + workflowTaskId,
					exception);
			}
		}
	}

	public void assignWorkflowTask(
			long companyId, long userId, long workflowTaskId,
			long assigneeUserId, String comment)
		throws PortalException {

		WorkflowTaskManagerUtil.assignWorkflowTaskToUser(
			companyId, userId, workflowTaskId, assigneeUserId, comment, null,
			null);
	}

	public void updateWorkflowTaskDueDate(
			long companyId, long userId, long workflowTaskId, Date dueDate,
			String comment)
		throws PortalException {

		WorkflowTaskManagerUtil.updateDueDate(
			companyId, userId, workflowTaskId, comment, dueDate);
	}

	public List<User> getAssignableUsers(long workflowTaskId)
		throws PortalException {

		return WorkflowTaskManagerUtil.getAssignableUsers(workflowTaskId);
	}

	public long getAssigneeUserId(long companyId, long workflowTaskId)
		throws PortalException {

		WorkflowTask task = WorkflowTaskManagerUtil.getWorkflowTask(
			companyId, workflowTaskId);

		return task.getAssigneeUserId();
	}

	private void _ensureTaskActionable(WorkflowTask task)
		throws PortalException {

		if (task.isCompleted()) {
			throw new PortalException(
				"Workflow task " + task.getWorkflowTaskId() +
					" đã được xử lý.");
		}
	}

	private String _resolveTransitionName(
			long companyId, long userId, long workflowTaskId, boolean approve)
		throws PortalException {

		// Mỗi workflow đặt tên transition khác nhau (vd "approve"/"reject" và
		// "Chấp thuận (Approve)"/"Từ chối (Reject)"). Lấy danh sách transition
		// thực tế của task rồi chọn theo từ khoá.
		List<String> transitionNames =
			WorkflowTaskManagerUtil.getNextTransitionNames(
				companyId, userId, workflowTaskId);

		String[] approveKeywords = {"approve", "chấp thuận", "duyệt", "accept"};
		String[] rejectKeywords = {"reject", "từ chối", "deny", "decline"};

		String[] keywords = approve ? approveKeywords : rejectKeywords;

		for (String transitionName : transitionNames) {
			String lower = transitionName.toLowerCase();

			for (String keyword : keywords) {
				if (lower.contains(keyword)) {
					return transitionName;
				}
			}
		}

		// Fallback: nếu chỉ có 1 transition thì dùng luôn, ngược lại dùng tên
		// mặc định kiểu Single Approver.
		if (transitionNames.size() == 1) {
			return transitionNames.get(0);
		}

		return approve ? "approve" : "reject";
	}

	private WorkflowReviewItem _buildCompletedHistoryItem(
			long companyId, long userId, WorkflowTask task, String status,
			String reviewComment)
		throws PortalException {

		WorkflowReviewItem item = _buildWorkflowReviewItem(
			companyId, task, new WorkflowReviewQuery());

		if (item == null) {
			return null;
		}

		item.setStatus(status);
		item.setReviewable(false);
		item.setCompletedByUserId(userId);
		item.setReviewComment(reviewComment);

		try {
			item.setCompletedByUserName(
				UserLocalServiceUtil.getUser(userId).getFullName());
		}
		catch (Exception exception) {
			// Ignore, user name is only displayed as metadata.
		}

		return item;
	}

	private WorkflowReviewItem _buildWorkflowReviewItem(
			long companyId, WorkflowTask task, WorkflowReviewQuery query)
		throws PortalException {

		WorkflowReviewItem item = new WorkflowReviewItem();

		item.setCompanyId(companyId);
		item.setWorkflowTaskId(task.getWorkflowTaskId());
		item.setWorkflowInstanceId(task.getWorkflowInstanceId());
		item.setTaskName(task.getName());
		item.setAssigneeUserId(task.getAssigneeUserId());
		item.setCreateDate(task.getCreateDate());
		item.setDueDate(task.getDueDate());

		// Lấy thông tin asset từ workflow context của instance (cách chuẩn
		// của Liferay - xem WorkflowTaskDisplayContext). WorkflowInstanceLink
		// không truy được nếu thiếu groupId/className.
		Map<String, Serializable> workflowContext =
			_getWorkflowContext(companyId, task);

		String entryClassName = GetterUtil.getString(
			workflowContext.get(WorkflowConstants.CONTEXT_ENTRY_CLASS_NAME));
		long entryClassPK = GetterUtil.getLong(
			workflowContext.get(WorkflowConstants.CONTEXT_ENTRY_CLASS_PK));

		if (!entryClassName.isEmpty()) {
			item.setAssetType(entryClassName);
			item.setAssetPrimaryKey(entryClassPK);

			if (_CLASS_NAME_JOURNAL_ARTICLE.equals(entryClassName)) {
				_populateJournalArticle(item, entryClassPK);
			}
			else if (_CLASS_NAME_MB_DISCUSSION.equals(entryClassName) ||
					 _CLASS_NAME_MB_MESSAGE.equals(entryClassName)) {

				_populateComment(item, entryClassPK);
			}
		}

		// Set assignee user name
		if (task.getAssigneeUserId() > 0) {
			try {
				item.setAssigneeUserName(
					UserLocalServiceUtil.getUser(
						task.getAssigneeUserId()).getFullName());
			} catch (Exception e) {
				// Handle exception
			}
		}

		// Determine status
		_setItemStatus(item, task);

		// Filter based on query
		if (!_matchesQuery(item, query)) {
			return null;
		}

		return item;
	}

	private Map<String, Serializable> _getWorkflowContext(
			long companyId, WorkflowTask task)
		throws PortalException {

		WorkflowInstance workflowInstance =
			WorkflowInstanceManagerUtil.getWorkflowInstance(
				companyId, task.getWorkflowInstanceId());

		return workflowInstance.getWorkflowContext();
	}

	private void _populateJournalArticle(
		WorkflowReviewItem item, long classPK) {

		try {
			// Workflow lưu classPK là primary key (id) của JournalArticle,
			// không phải resourcePrimKey -> phải fetch theo primary key.
			JournalArticle article =
				JournalArticleLocalServiceUtil.fetchJournalArticle(classPK);

			if (article == null) {
				article = JournalArticleLocalServiceUtil.fetchLatestArticle(
					classPK);
			}

			if (article != null) {
				String title = article.getTitleCurrentValue();

				if ((title == null) || title.isEmpty()) {
					title = article.getTitle(LocaleUtil.getSiteDefault());
				}

				item.setAssetTitle(title);
				// resourcePrimKey ổn định qua các version -> dùng làm khóa nhận
				// diện asset (xem _getAssetKey), tránh trùng lặp khi bài viết được
				// sửa và gửi duyệt lại (mỗi version có primary key khác nhau).
				item.setAssetResourceKey(article.getResourcePrimKey());
				item.setAssetContent(article.getDescriptionCurrentValue());
				item.setCreatorUserId(article.getUserId());
				item.setCreatorUserName(article.getUserName());
				// Ngày tạo lấy theo nội dung (ổn định), không lấy theo
				// task.getCreateDate() vì task review bị tạo lại mỗi lần resubmit.
				item.setCreateDate(article.getCreateDate());
				item.setModifiedDate(article.getModifiedDate());
				item.setAssetStatus(article.getStatus());
				item.setCompletedByUserId(article.getStatusByUserId());
				item.setCompletedByUserName(article.getStatusByUserName());
			}
		}
		catch (Exception exception) {
			_log.warn(
				"Không lấy được Web Content classPK=" + classPK, exception);
		}
	}

	private void _populateComment(WorkflowReviewItem item, long classPK) {
		try {
			// classPK của MBDiscussion/MBMessage trong workflow context là
			// messageId của MBMessage chứa nội dung bình luận.
			MBMessage message = MBMessageLocalServiceUtil.fetchMBMessage(
				classPK);

			if (message != null) {
				item.setAssetContent(HtmlUtil.stripHtml(message.getBody()));
				item.setContentHtml(message.getBody());
				item.setAssetTitle(HtmlUtil.stripHtml(message.getBody()));
				item.setCreatorUserId(message.getUserId());
				item.setCreatorUserName(message.getUserName());
				item.setCreateDate(message.getCreateDate());
				item.setModifiedDate(message.getModifiedDate());
				item.setAssetStatus(message.getStatus());
				item.setCompletedByUserId(message.getStatusByUserId());
				item.setCompletedByUserName(message.getStatusByUserName());

				// Asset (bài viết...) mà bình luận đính kèm, dùng để tạo link.
				item.setParentClassName(message.getClassName());
				item.setParentClassPK(message.getClassPK());
			}
		}
		catch (Exception exception) {
			_log.warn(
				"Không lấy được bình luận classPK=" + classPK, exception);
		}
	}

	private void _populateContentHtml(WorkflowReviewItem item) {
		String entryClassName = item.getAssetType();
		long classPK = item.getAssetPrimaryKey();

		if (entryClassName == null) {
			return;
		}

		if (_CLASS_NAME_JOURNAL_ARTICLE.equals(entryClassName)) {
			try {
				JournalArticle article =
					JournalArticleLocalServiceUtil.fetchJournalArticle(classPK);

				if (article == null) {
					article =
						JournalArticleLocalServiceUtil.fetchLatestArticle(
							classPK);
				}

				if (article != null) {
					String languageId = LocaleUtil.toLanguageId(
						LocaleUtil.getSiteDefault());

					// Render nội dung Web Content theo template mặc định.
					item.setContentHtml(
						JournalArticleLocalServiceUtil.getArticleContent(
							article, null, "view", languageId, null, null));
				}
			}
			catch (Exception exception) {
				_log.warn(
					"Không render được Web Content classPK=" + classPK,
					exception);

				item.setContentHtml(item.getAssetContent());
			}
		}
		else if (_CLASS_NAME_MB_DISCUSSION.equals(entryClassName) ||
				 _CLASS_NAME_MB_MESSAGE.equals(entryClassName)) {

			try {
				MBMessage message = MBMessageLocalServiceUtil.fetchMBMessage(
					classPK);

				if (message != null) {
					// Bình luận giữ nguyên HTML body.
					item.setContentHtml(message.getBody());
				}
			}
			catch (Exception exception) {
				_log.warn(
					"Không lấy được nội dung bình luận classPK=" + classPK,
					exception);
			}
		}
	}

	private void _setItemStatus(
			WorkflowReviewItem item, WorkflowTask task)
		throws PortalException {

		// Map trạng thái không phụ thuộc tên task (mỗi workflow đặt tên khác
		// nhau). Ưu tiên trạng thái của asset; bổ sung heuristic tên task để
		// bắt trường hợp "trả về tác giả chỉnh sửa".
		int assetStatus = item.getAssetStatus();

		// (2a) Task đã hoàn tất thì không bao giờ duyệt/từ chối lại được, bất kể
		// asset đang ở trạng thái nào. Tránh hiện lại nút Duyệt/Từ chối khi mở
		// chi tiết một task đã xử lý xong.
		boolean completed = task.isCompleted();

		String taskName = task.getName();
		String lowerTaskName = (taskName == null) ? "" : taskName.toLowerCase();

		boolean rejectedTask =
			lowerTaskName.contains("update") ||
			lowerTaskName.contains("từ chối") ||
			lowerTaskName.contains("chỉnh sửa") ||
			lowerTaskName.contains("reject");

		// Đã bị từ chối -> trả về tác giả chỉnh sửa (không phải denied vĩnh
		// viễn). Người duyệt không thao tác tiếp -> ẩn nút.
		if ((assetStatus == WorkflowConstants.STATUS_DENIED) || rejectedTask) {
			item.setStatus("denied");
			item.setReviewable(false);

			return;
		}

		// Đã được duyệt (có thể còn bước xuất bản) -> không cần duyệt lại.
		if (assetStatus == WorkflowConstants.STATUS_APPROVED) {
			item.setStatus("approved");
			item.setReviewable(false);

			return;
		}

		// (2b) Không đọc được trạng thái asset (vd version đã bị thay thế/xóa) ->
		// không suy ra được là đang chờ duyệt, không cho thao tác tiếp.
		if (completed || (assetStatus < 0)) {
			item.setStatus(completed ? "approved" : "pending");
			item.setReviewable(false);

			return;
		}

		// Còn lại coi như đang chờ duyệt; kiểm tra quá hạn.
		if ((task.getDueDate() != null) &&
			task.getDueDate().before(new Date())) {

			item.setOverdue(true);
			item.setStatus("expired");
		}
		else {
			item.setStatus("pending");
		}

		item.setReviewable(true);
	}

	private boolean _matchesQuery(
			WorkflowReviewItem item, WorkflowReviewQuery query)
		throws PortalException {

		// Filter by status
		if (query.getStatus() != null &&
			!query.getStatus().isEmpty() &&
			!query.getStatus().equals(item.getStatus())) {

			return false;
		}

		// Filter by asset type
		if (query.getAssetType() != null &&
			!query.getAssetType().isEmpty() &&
			!_matchesAssetType(query.getAssetType(), item.getAssetType())) {

			return false;
		}

		// Filter by keyword (search in title)
		if (query.getKeyword() != null &&
			!query.getKeyword().isEmpty()) {

			String keyword = query.getKeyword().toLowerCase();

			if (item.getAssetTitle() != null &&
				item.getAssetTitle().toLowerCase().contains(keyword)) {

				return true;
			}

			if (item.getCreatorUserName() != null &&
				item.getCreatorUserName().toLowerCase().contains(keyword)) {

				return true;
			}

			return false;
		}

		return true;
	}

	private boolean _matchesAssetType(String queryAssetType, String itemAssetType) {
		if (queryAssetType.equals(itemAssetType)) {
			return true;
		}

		if (_isCommentClassName(queryAssetType)) {
			return _isCommentClassName(itemAssetType);
		}

		return false;
	}

	private boolean _isCommentClassName(String className) {
		return _CLASS_NAME_MB_DISCUSSION.equals(className) ||
			_CLASS_NAME_MB_MESSAGE.equals(className);
	}

	private boolean _matchesHistoryTab(
		WorkflowReviewItem item, long userId, WorkflowReviewQuery query) {

		if (!"mine".equals(query.getTab())) {
			return true;
		}

		return (item.getAssigneeUserId() == userId) ||
			(item.getCompletedByUserId() == userId);
	}

	private void _copyHistoryFields(
		WorkflowReviewItem source, WorkflowReviewItem target) {

		if (source.getCompletedByUserId() > 0) {
			target.setCompletedByUserId(source.getCompletedByUserId());
		}

		if (source.getCompletedByUserName() != null) {
			target.setCompletedByUserName(source.getCompletedByUserName());
		}

		if (source.getReviewComment() != null) {
			target.setReviewComment(source.getReviewComment());
		}
	}

	private void _overlayHistoryByTask(
		long companyId, WorkflowReviewItem item) {

		try {
			WorkflowReviewItem historyItem =
				_workflowReviewHistoryRepository.getItem(
					companyId, item.getWorkflowTaskId());

			if (historyItem == null) {
				return;
			}

			if (historyItem.getStatus() != null) {
				item.setStatus(historyItem.getStatus());
			}

			_copyHistoryFields(historyItem, item);
		}
		catch (Exception exception) {
			_log.warn(
				"Không lấy được lịch sử workflow task=" +
					item.getWorkflowTaskId(),
				exception);
		}
	}

	private void _enrichWithLatestHistory(
		long companyId, WorkflowReviewItem item) {

		if (!_hasAssetKey(item) || !_canUseHistoryForActiveItem(item)) {
			return;
		}

		try {
			WorkflowReviewItem historyItem =
				_workflowReviewHistoryRepository.getLatestItemByAsset(
					companyId, item.getAssetType(), item.getAssetResourceKey(),
					item.getAssetPrimaryKey());

			if (historyItem != null) {
				_copyHistoryFields(historyItem, item);
			}
		}
		catch (Exception exception) {
			_log.warn(
				"Không lấy được lịch sử workflow theo asset=" +
					item.getAssetType() + "#" + item.getAssetPrimaryKey(),
				exception);
		}
	}

	private boolean _isNewerTask(
		WorkflowReviewItem candidate, WorkflowReviewItem current) {

		Date candidateDate = candidate.getCreateDate();
		Date currentDate = current.getCreateDate();

		if ((candidateDate != null) && (currentDate != null)) {
			int compare = candidateDate.compareTo(currentDate);

			if (compare != 0) {
				return compare > 0;
			}
		}
		else if (candidateDate != null) {
			return true;
		}
		else if (currentDate != null) {
			return false;
		}

		// Cùng thời điểm (hoặc thiếu ngày): task có id lớn hơn là task tạo sau.
		return candidate.getWorkflowTaskId() > current.getWorkflowTaskId();
	}

	private String _getAssetKey(WorkflowReviewItem item) {
		// Ưu tiên resourcePrimKey (ổn định qua các version) để dedup hoạt động
		// khi bài viết bị từ chối rồi sửa và gửi duyệt lại. Fallback về primary
		// key cho các asset không có resource key (vd comment) và dữ liệu cũ.
		long key = (item.getAssetResourceKey() > 0) ?
			item.getAssetResourceKey() : item.getAssetPrimaryKey();

		return item.getAssetType() + "#" + key;
	}

	private boolean _hasAssetKey(WorkflowReviewItem item) {
		return (item.getAssetType() != null) &&
			!item.getAssetType().isEmpty() &&
			(item.getAssetPrimaryKey() > 0);
	}

	private boolean _canUseHistoryForActiveItem(WorkflowReviewItem item) {
		return "approved".equals(item.getStatus()) ||
			"denied".equals(item.getStatus());
	}

	private void _sortItems(
		List<WorkflowReviewItem> items, WorkflowReviewQuery query) {

		final boolean ascending = "asc".equalsIgnoreCase(
			query.getOrderDirection());
		final String orderBy = query.getOrderBy();

		Collections.sort(
			items,
			new Comparator<WorkflowReviewItem>() {

				@Override
				public int compare(
					WorkflowReviewItem left, WorkflowReviewItem right) {

					int dateCompare = _compareDates(
						_getOrderDate(left, orderBy),
						_getOrderDate(right, orderBy));

					if (dateCompare == 0) {
						dateCompare = Long.compare(
							left.getWorkflowTaskId(), right.getWorkflowTaskId());
					}

					return ascending ? dateCompare : -dateCompare;
				}

			});
	}

	private int _compareDates(Date left, Date right) {
		if ((left == null) && (right == null)) {
			return 0;
		}

		if (left == null) {
			return -1;
		}

		if (right == null) {
			return 1;
		}

		return left.compareTo(right);
	}

	private Date _getOrderDate(WorkflowReviewItem item, String orderBy) {
		if ("modifiedDate".equals(orderBy)) {
			return item.getModifiedDate();
		}

		if ("dueDate".equals(orderBy)) {
			return item.getDueDate();
		}

		return item.getCreateDate();
	}

	private static final String _CLASS_NAME_JOURNAL_ARTICLE =
		"com.liferay.journal.model.JournalArticle";

	private static final String _CLASS_NAME_MB_DISCUSSION =
		"com.liferay.message.boards.model.MBDiscussion";

	private static final String _CLASS_NAME_MB_MESSAGE =
		"com.liferay.message.boards.model.MBMessage";

	private static final Log _log = LogFactoryUtil.getLog(
		WorkflowReviewService.class);

	@Reference
	private WorkflowReviewHistoryRepository _workflowReviewHistoryRepository;

	@Reference
	private WorkflowComparatorFactory _workflowComparatorFactory;

}
