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
			tasks = WorkflowTaskManagerUtil.getWorkflowTasksByUser(
				companyId, userId, false, query.getStart(), query.getEnd(),
				orderByComparator);
		} else {
			// For "all" tab, get tasks assigned to user's roles
			tasks = WorkflowTaskManagerUtil.getWorkflowTasksByUserRoles(
				companyId, userId, false, query.getStart(), query.getEnd(),
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
			return WorkflowTaskManagerUtil.getWorkflowTaskCountByUserRoles(
				companyId, userId, false);
		}
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

		Map<String, Serializable> workflowContext = new HashMap<>();
		WorkflowTaskManagerUtil.completeWorkflowTask(
			companyId, userId, workflowTaskId, "approve", comment,
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

		Map<String, Serializable> workflowContext = new HashMap<>();
		WorkflowTaskManagerUtil.completeWorkflowTask(
			companyId, userId, workflowTaskId, "reject", comment,
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
			}
		}
		catch (Exception exception) {
			_log.warn(
				"Không lấy được bình luận classPK=" + classPK, exception);
		}
	}

	private void _setItemStatus(
			WorkflowReviewItem item, WorkflowTask task)
		throws PortalException {

		// Chỉ các task chưa hoàn thành mới được truy vấn về đây, nên mỗi item
		// luôn có một task đang hoạt động. Tên task quyết định trạng thái:
		//  - "review": đang chờ người duyệt xử lý  -> Chưa duyệt / Hết hạn
		//  - "update": đã bị từ chối và TRẢ VỀ cho tác giả chỉnh sửa rồi
		//    resubmit. Đây KHÔNG phải denied vĩnh viễn, workflow đã gửi email
		//    "Creator Modification Notification" cho tác giả.
		String taskName = task.getName();

		if ("update".equals(taskName)) {
			item.setStatus("denied");

			// Task này thuộc về tác giả để chỉnh sửa, người duyệt không thể
			// duyệt/từ chối tiếp -> ẩn nút thao tác trên UI.
			item.setReviewable(false);

			return;
		}

		// Task "review": kiểm tra quá hạn duyệt.
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
