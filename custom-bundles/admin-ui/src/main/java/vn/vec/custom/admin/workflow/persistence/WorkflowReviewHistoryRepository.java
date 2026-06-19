package vn.vec.custom.admin.workflow.persistence;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.List;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.workflow.model.WorkflowReviewItem;

@Component(service = WorkflowReviewHistoryRepository.class)
public class WorkflowReviewHistoryRepository {

	public List<WorkflowReviewItem> getItems(long companyId)
		throws Exception {

		_ensureTable();

		List<WorkflowReviewItem> items = new ArrayList<>();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"select * from VEC_WorkflowReviewHistory where companyId = ?")) {

			preparedStatement.setLong(1, companyId);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				while (resultSet.next()) {
					items.add(_mapItem(resultSet));
				}
			}
		}

		return items;
	}

	public WorkflowReviewItem getItem(
			long companyId, long workflowTaskId)
		throws Exception {

		_ensureTable();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"select * from VEC_WorkflowReviewHistory where companyId = ? " +
					"and workflowTaskId = ?")) {

			preparedStatement.setLong(1, companyId);
			preparedStatement.setLong(2, workflowTaskId);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				if (resultSet.next()) {
					return _mapItem(resultSet);
				}
			}
		}

		return null;
	}

	public WorkflowReviewItem getLatestItemByAsset(
			long companyId, String assetType, long assetPrimaryKey)
		throws Exception {

		_ensureTable();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"select * from VEC_WorkflowReviewHistory where companyId = ? " +
					"and assetType = ? and assetPrimaryKey = ? " +
					"order by completedDate desc, historyId desc limit 1")) {

			preparedStatement.setLong(1, companyId);
			preparedStatement.setString(2, assetType);
			preparedStatement.setLong(3, assetPrimaryKey);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				if (resultSet.next()) {
					return _mapItem(resultSet);
				}
			}
		}

		return null;
	}

	public void saveCompletedItem(WorkflowReviewItem item)
		throws Exception {

		_ensureTable();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"insert into VEC_WorkflowReviewHistory (" +
					"companyId, workflowTaskId, workflowInstanceId, assetType, " +
					"assetPrimaryKey, assetTitle, assetContent, " +
					"parentClassName, parentClassPK, creatorUserId, " +
					"creatorUserName, assigneeUserId, assigneeUserName, " +
					"completedByUserId, completedByUserName, reviewComment, " +
					"status, taskName, createDate, modifiedDate, dueDate, " +
					"completedDate" +
				") values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +
					"?, ?, ?, CURRENT_TIMESTAMP(6)) " +
				"on duplicate key update workflowInstanceId = values(workflowInstanceId), " +
					"assetType = values(assetType), " +
					"assetPrimaryKey = values(assetPrimaryKey), " +
					"assetTitle = values(assetTitle), " +
					"assetContent = values(assetContent), " +
					"parentClassName = values(parentClassName), " +
					"parentClassPK = values(parentClassPK), " +
					"creatorUserId = values(creatorUserId), " +
					"creatorUserName = values(creatorUserName), " +
					"assigneeUserId = values(assigneeUserId), " +
					"assigneeUserName = values(assigneeUserName), " +
					"completedByUserId = values(completedByUserId), " +
					"completedByUserName = values(completedByUserName), " +
					"reviewComment = values(reviewComment), " +
					"status = values(status), taskName = values(taskName), " +
					"createDate = values(createDate), " +
					"modifiedDate = values(modifiedDate), " +
					"dueDate = values(dueDate), completedDate = CURRENT_TIMESTAMP(6)")) {

			int index = 1;

			preparedStatement.setLong(index++, item.getCompanyId());
			preparedStatement.setLong(index++, item.getWorkflowTaskId());
			preparedStatement.setLong(index++, item.getWorkflowInstanceId());
			preparedStatement.setString(index++, item.getAssetType());
			preparedStatement.setLong(index++, item.getAssetPrimaryKey());
			preparedStatement.setString(index++, item.getAssetTitle());
			preparedStatement.setString(index++, item.getAssetContent());
			preparedStatement.setString(index++, item.getParentClassName());
			preparedStatement.setLong(index++, item.getParentClassPK());
			preparedStatement.setLong(index++, item.getCreatorUserId());
			preparedStatement.setString(index++, item.getCreatorUserName());
			preparedStatement.setLong(index++, item.getAssigneeUserId());
			preparedStatement.setString(index++, item.getAssigneeUserName());
			preparedStatement.setLong(index++, item.getCompletedByUserId());
			preparedStatement.setString(index++, item.getCompletedByUserName());
			preparedStatement.setString(index++, item.getReviewComment());
			preparedStatement.setString(index++, item.getStatus());
			preparedStatement.setString(index++, item.getTaskName());
			preparedStatement.setTimestamp(index++, _toTimestamp(item.getCreateDate()));
			preparedStatement.setTimestamp(index++, _toTimestamp(item.getModifiedDate()));
			preparedStatement.setTimestamp(index++, _toTimestamp(item.getDueDate()));

			preparedStatement.executeUpdate();
		}
	}

	private void _ensureTable() throws Exception {
		if (_tableReady) {
			return;
		}

		synchronized (this) {
			if (_tableReady) {
				return;
			}

			try (Connection connection = DataAccess.getConnection();
				PreparedStatement preparedStatement = connection.prepareStatement(
					"create table if not exists VEC_WorkflowReviewHistory (" +
						"historyId BIGINT not null auto_increment, " +
						"companyId BIGINT not null default 0, " +
						"workflowTaskId BIGINT not null, " +
						"workflowInstanceId BIGINT null default 0, " +
						"assetType VARCHAR(255) null, " +
						"assetPrimaryKey BIGINT null default 0, " +
						"assetTitle VARCHAR(500) null, " +
						"assetContent LONGTEXT null, " +
						"parentClassName VARCHAR(255) null, " +
						"parentClassPK BIGINT null default 0, " +
						"creatorUserId BIGINT null default 0, " +
						"creatorUserName VARCHAR(255) null, " +
						"assigneeUserId BIGINT null default 0, " +
						"assigneeUserName VARCHAR(255) null, " +
						"completedByUserId BIGINT null default 0, " +
						"completedByUserName VARCHAR(255) null, " +
						"reviewComment LONGTEXT null, " +
						"status VARCHAR(50) null, " +
						"taskName VARCHAR(255) null, " +
						"createDate DATETIME(6) null, " +
						"modifiedDate DATETIME(6) null, " +
						"dueDate DATETIME(6) null, " +
						"completedDate DATETIME(6) null, " +
						"primary key (historyId), " +
						"unique key IX_VEC_WorkflowReviewHistory_Task " +
							"(workflowTaskId), " +
						"key IX_VEC_WorkflowReviewHistory_Company_Status " +
							"(companyId, status, createDate), " +
						"key IX_VEC_WorkflowReviewHistory_Asset " +
							"(assetType, assetPrimaryKey), " +
						"key IX_VEC_WorkflowReviewHistory_Assignee " +
							"(companyId, assigneeUserId), " +
						"key IX_VEC_WorkflowReviewHistory_CompletedBy " +
							"(companyId, completedByUserId)" +
					") engine=InnoDB default charset=utf8mb4 " +
						"collate=utf8mb4_unicode_ci")) {

				preparedStatement.executeUpdate();
			}

			_ensureReviewCommentColumn();

			_tableReady = true;
		}
	}

	private void _ensureReviewCommentColumn() throws Exception {
		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"alter table VEC_WorkflowReviewHistory add column " +
					"reviewComment LONGTEXT null after completedByUserName")) {

			preparedStatement.executeUpdate();
		}
		catch (Exception exception) {
			String message = exception.getMessage();

			if ((message == null) ||
				!message.toLowerCase().contains("duplicate")) {

				throw exception;
			}
		}
	}

	private WorkflowReviewItem _mapItem(ResultSet resultSet)
		throws Exception {

		WorkflowReviewItem item = new WorkflowReviewItem();

		item.setCompanyId(resultSet.getLong("companyId"));
		item.setWorkflowTaskId(resultSet.getLong("workflowTaskId"));
		item.setWorkflowInstanceId(resultSet.getLong("workflowInstanceId"));
		item.setAssetType(resultSet.getString("assetType"));
		item.setAssetPrimaryKey(resultSet.getLong("assetPrimaryKey"));
		item.setAssetTitle(resultSet.getString("assetTitle"));
		item.setAssetContent(resultSet.getString("assetContent"));
		item.setContentHtml(resultSet.getString("assetContent"));
		item.setParentClassName(resultSet.getString("parentClassName"));
		item.setParentClassPK(resultSet.getLong("parentClassPK"));
		item.setCreatorUserId(resultSet.getLong("creatorUserId"));
		item.setCreatorUserName(resultSet.getString("creatorUserName"));
		item.setAssigneeUserId(resultSet.getLong("assigneeUserId"));
		item.setAssigneeUserName(resultSet.getString("assigneeUserName"));
		item.setCompletedByUserId(resultSet.getLong("completedByUserId"));
		item.setCompletedByUserName(resultSet.getString("completedByUserName"));
		item.setReviewComment(resultSet.getString("reviewComment"));
		item.setStatus(resultSet.getString("status"));
		item.setTaskName(resultSet.getString("taskName"));
		item.setCreateDate(resultSet.getTimestamp("createDate"));
		item.setModifiedDate(resultSet.getTimestamp("modifiedDate"));
		item.setDueDate(resultSet.getTimestamp("dueDate"));
		item.setReviewable(false);

		return item;
	}

	private Timestamp _toTimestamp(java.util.Date date) {
		if (date == null) {
			return null;
		}

		return new Timestamp(date.getTime());
	}

	private volatile boolean _tableReady;

}
