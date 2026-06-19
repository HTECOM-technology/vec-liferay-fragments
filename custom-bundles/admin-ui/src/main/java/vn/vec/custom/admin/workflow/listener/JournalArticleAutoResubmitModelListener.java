package vn.vec.custom.admin.workflow.listener;

import com.liferay.journal.model.JournalArticle;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.BaseModelListener;
import com.liferay.portal.kernel.model.ModelListener;
import com.liferay.portal.kernel.model.WorkflowInstanceLink;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.WorkflowInstanceLinkLocalServiceUtil;
import com.liferay.portal.kernel.transaction.TransactionCommitCallbackUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.workflow.WorkflowConstants;
import com.liferay.portal.kernel.workflow.WorkflowTask;
import com.liferay.portal.kernel.workflow.WorkflowTaskManagerUtil;

import java.io.Serializable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.osgi.service.component.annotations.Component;

/**
 * Khi tác giả chỉnh sửa một Web Content đang bị từ chối (đang nằm ở task
 * "update" của workflow) và lưu lại, tự động hoàn tất task đó bằng transition
 * resubmit để bài quay lại bước duyệt ngay — tác giả không phải vào màn
 * "My Workflow Tasks" của Liferay để bấm resubmit thủ công.
 */
@Component(service = ModelListener.class)
public class JournalArticleAutoResubmitModelListener
	extends BaseModelListener<JournalArticle> {

	@Override
	public void onAfterUpdate(
		JournalArticle originalArticle, JournalArticle article) {

		// Tránh đệ quy khi chính thao tác hoàn tất task lại sinh ra update.
		if (_resubmitting.get()) {
			return;
		}

		// Phân biệt thao tác của tác giả với cập nhật-trạng-thái của workflow:
		// - Khi reject, workflow đổi status (PENDING -> DENIED -> PENDING) ->
		//   status THAY ĐỔI giữa original và bản mới -> bỏ qua.
		// - Khi tác giả lưu lại bài đang chờ duyệt (đang ở task update), status
		//   giữ nguyên PENDING -> đây là tín hiệu để tự resubmit.
		if (originalArticle.getStatus() != article.getStatus()) {
			return;
		}

		if (article.getStatus() != WorkflowConstants.STATUS_PENDING) {
			return;
		}

		long companyId = article.getCompanyId();
		long groupId = article.getGroupId();
		long classPK = article.getId();

		WorkflowInstanceLink workflowInstanceLink =
			WorkflowInstanceLinkLocalServiceUtil.fetchWorkflowInstanceLink(
				companyId, groupId, JournalArticle.class.getName(), classPK);

		if (workflowInstanceLink == null) {
			return;
		}

		long workflowInstanceId =
			workflowInstanceLink.getWorkflowInstanceId();

		// Hoàn tất task sau khi transaction lưu bài commit xong, tránh can thiệp
		// vào transaction hiện tại (completeWorkflowTask là thao tác nặng).
		TransactionCommitCallbackUtil.registerCallback(
			() -> {
				_resubmitPendingTask(companyId, workflowInstanceId);

				return null;
			});
	}

	private void _resubmitPendingTask(
		long companyId, long workflowInstanceId) {

		_resubmitting.set(Boolean.TRUE);

		try {
			List<WorkflowTask> tasks =
				WorkflowTaskManagerUtil.getWorkflowTasksByWorkflowInstance(
					companyId, null, workflowInstanceId, Boolean.FALSE, 0,
					_MAX_TASKS, null);

			for (WorkflowTask task : tasks) {
				_resubmitTask(companyId, task);
			}
		}
		catch (Exception exception) {
			_log.warn(
				"Không tự động resubmit được workflow instance=" +
					workflowInstanceId,
				exception);
		}
		finally {
			_resubmitting.remove();
		}
	}

	private void _resubmitTask(long companyId, WorkflowTask task)
		throws Exception {

		long taskId = task.getWorkflowTaskId();

		long userId = task.getAssigneeUserId();

		if (userId <= 0) {
			userId = GetterUtil.getLong(PrincipalThreadLocal.getName());
		}

		if (userId <= 0) {
			return;
		}

		List<String> transitionNames =
			WorkflowTaskManagerUtil.getNextTransitionNames(
				companyId, userId, taskId);

		// Không bao giờ tự complete task duyệt (review): nếu task có transition
		// kiểu approve/reject thì đây là task của người duyệt, bỏ qua.
		if (_hasReviewTransition(transitionNames)) {
			return;
		}

		String transitionName = _resolveResubmitTransition(transitionNames);

		if (transitionName == null) {
			return;
		}

		Map<String, Serializable> workflowContext = new HashMap<>();

		WorkflowTaskManagerUtil.completeWorkflowTask(
			companyId, userId, taskId, transitionName, null, workflowContext);
	}

	private boolean _hasReviewTransition(List<String> transitionNames) {
		for (String transitionName : transitionNames) {
			String lower = transitionName.toLowerCase();

			for (String keyword : _REVIEW_TRANSITION_KEYWORDS) {
				if (lower.contains(keyword)) {
					return true;
				}
			}
		}

		return false;
	}

	private String _resolveResubmitTransition(List<String> transitionNames) {
		if (transitionNames.isEmpty()) {
			return null;
		}

		for (String transitionName : transitionNames) {
			String lower = transitionName.toLowerCase();

			for (String keyword : _RESUBMIT_TRANSITION_KEYWORDS) {
				if (lower.contains(keyword)) {
					return transitionName;
				}
			}
		}

		// Task "update" chuẩn chỉ có một transition (resubmit) -> dùng luôn.
		if (transitionNames.size() == 1) {
			return transitionNames.get(0);
		}

		return null;
	}

	private static final int _MAX_TASKS = 50;

	private static final String[] _RESUBMIT_TRANSITION_KEYWORDS = {
		"resubmit", "review", "submit", "gửi", "duyệt lại"
	};

	private static final String[] _REVIEW_TRANSITION_KEYWORDS = {
		"approve", "reject", "accept", "deny", "decline", "chấp thuận",
		"từ chối"
	};

	private static final Log _log = LogFactoryUtil.getLog(
		JournalArticleAutoResubmitModelListener.class);

	private static final ThreadLocal<Boolean> _resubmitting =
		ThreadLocal.withInitial(() -> Boolean.FALSE);

}
