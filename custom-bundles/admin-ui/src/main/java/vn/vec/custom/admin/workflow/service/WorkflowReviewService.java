package vn.vec.custom.admin.workflow.service;

import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.service.JournalArticleLocalServiceUtil;
import com.liferay.message.boards.model.MBMessage;
import com.liferay.message.boards.service.MBMessageLocalServiceUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.workflow.model.WorkflowReviewItem;
import vn.vec.custom.admin.workflow.model.WorkflowReviewQuery;

@Component(service = WorkflowReviewService.class)
public class WorkflowReviewService {

	public List<WorkflowReviewItem> getWorkflowReviewItems(
			long companyId, long userId, WorkflowReviewQuery query)
		throws PortalException {

		List<WorkflowReviewItem> items = new ArrayList<>();
		List<WorkflowTask> tasks = new ArrayList<>();

		// Order theo ngày tạo, mới nhất lên trước (ascending = false). Order
		// ngay ở tầng query để phân trang đúng thứ tự trên toàn bộ kết quả.
		OrderByComparator<WorkflowTask> orderByComparator =
			_workflowComparatorFactory.getTaskCreateDateComparator(false);

		// Get workflow tasks based on tab
		if ("mine".equals(query.getTab())) {
			// "Tôi xử lý": task đang gán cho user hiện tại.
			tasks = WorkflowTaskManagerUtil.getWorkflowTasksByUser(
				companyId, userId, false, query.getStart(), query.getEnd(),
				orderByComparator);
		} else {
			// "Tất cả": toàn bộ task chưa hoàn thành của company (góc nhìn
			// quản trị). Không dùng getWorkflowTasksByUserRoles vì task gán cho
			// một user cụ thể (vd workflow comment) sẽ bị bỏ sót.
			tasks = WorkflowTaskManagerUtil.getWorkflowTasks(
				companyId, false, query.getStart(), query.getEnd(),
				orderByComparator);
		}

		for (WorkflowTask task : tasks) {
			WorkflowReviewItem item = _buildWorkflowReviewItem(
				companyId, task, query);

			if (item != null) {
				items.add(item);
			}
		}

		return items;
	}

	public int getWorkflowReviewItemsCount(
			long companyId, long userId, WorkflowReviewQuery query)
		throws PortalException {

		if ("mine".equals(query.getTab())) {
			return WorkflowTaskManagerUtil.getWorkflowTaskCountByUser(
				companyId, userId, false);
		} else {
			return WorkflowTaskManagerUtil.getWorkflowTaskCount(
				companyId, false);
		}
	}

	public WorkflowReviewItem getWorkflowReviewItemDetail(
			long companyId, long workflowTaskId)
		throws PortalException {

		WorkflowTask task = WorkflowTaskManagerUtil.getWorkflowTask(
			companyId, workflowTaskId);

		// Query rỗng -> không filter, luôn trả về item.
		WorkflowReviewItem item = _buildWorkflowReviewItem(
			companyId, task, new WorkflowReviewQuery());

		if (item != null) {
			_populateContentHtml(item);
		}

		return item;
	}

	public void approveWorkflowTask(
			long companyId, long userId, long workflowTaskId,
			String comment)
		throws PortalException {

		WorkflowTask task = WorkflowTaskManagerUtil.getWorkflowTask(
			companyId, workflowTaskId);

		if (task.getAssigneeUserId() != userId) {
			WorkflowTaskManagerUtil.assignWorkflowTaskToUser(
				companyId, userId, workflowTaskId, userId, null, null, null);
		}

		String transitionName = _resolveTransitionName(
			companyId, userId, workflowTaskId, true);

		Map<String, Serializable> workflowContext = new HashMap<>();
		WorkflowTaskManagerUtil.completeWorkflowTask(
			companyId, userId, workflowTaskId, transitionName, comment,
			workflowContext);
	}

	public void rejectWorkflowTask(
			long companyId, long userId, long workflowTaskId,
			String comment)
		throws PortalException {

		WorkflowTask task = WorkflowTaskManagerUtil.getWorkflowTask(
			companyId, workflowTaskId);

		if (task.getAssigneeUserId() != userId) {
			WorkflowTaskManagerUtil.assignWorkflowTaskToUser(
				companyId, userId, workflowTaskId, userId, null, null, null);
		}

		String transitionName = _resolveTransitionName(
			companyId, userId, workflowTaskId, false);

		Map<String, Serializable> workflowContext = new HashMap<>();
		WorkflowTaskManagerUtil.completeWorkflowTask(
			companyId, userId, workflowTaskId, transitionName, comment,
			workflowContext);
	}

	public void assignWorkflowTask(
			long companyId, long userId, long workflowTaskId,
			long assigneeUserId)
		throws PortalException {

		WorkflowTaskManagerUtil.assignWorkflowTaskToUser(
			companyId, userId, workflowTaskId, assigneeUserId, null, null,
			null);
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

	private WorkflowReviewItem _buildWorkflowReviewItem(
			long companyId, WorkflowTask task, WorkflowReviewQuery query)
		throws PortalException {

		WorkflowReviewItem item = new WorkflowReviewItem();

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
				item.setAssetContent(article.getDescriptionCurrentValue());
				item.setCreatorUserId(article.getUserId());
				item.setCreatorUserName(article.getUserName());
				item.setModifiedDate(article.getModifiedDate());
				item.setAssetStatus(article.getStatus());
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
				item.setAssetTitle(HtmlUtil.stripHtml(message.getBody()));
				item.setCreatorUserId(message.getUserId());
				item.setCreatorUserName(message.getUserName());
				item.setModifiedDate(message.getModifiedDate());
				item.setAssetStatus(message.getStatus());

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
			!query.getAssetType().equals(item.getAssetType())) {

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

	private static final String _CLASS_NAME_JOURNAL_ARTICLE =
		"com.liferay.journal.model.JournalArticle";

	private static final String _CLASS_NAME_MB_DISCUSSION =
		"com.liferay.message.boards.model.MBDiscussion";

	private static final String _CLASS_NAME_MB_MESSAGE =
		"com.liferay.message.boards.model.MBMessage";

	private static final Log _log = LogFactoryUtil.getLog(
		WorkflowReviewService.class);

	@Reference
	private WorkflowComparatorFactory _workflowComparatorFactory;

}
