package vn.vec.custom.admin.workflow.model;

import java.util.Date;

public class WorkflowReviewItem {
	private long workflowTaskId;
	private long workflowInstanceId;
	private String assetType;
	private long assetPrimaryKey;
	private String assetTitle;
	private String assetContent;
	private String contentHtml;
	private String parentClassName;
	private long parentClassPK;
	private int assetStatus = -1;
	private long creatorUserId;
	private String creatorUserName;
	private long assigneeUserId;
	private String assigneeUserName;
	private long completedByUserId;
	private String completedByUserName;
	private String status;
	private String taskName;
	private Date createDate;
	private Date modifiedDate;
	private Date dueDate;
	private boolean isOverdue;
	private boolean reviewable;

	public WorkflowReviewItem() {
	}

	public long getWorkflowTaskId() {
		return workflowTaskId;
	}

	public void setWorkflowTaskId(long workflowTaskId) {
		this.workflowTaskId = workflowTaskId;
	}

	public long getWorkflowInstanceId() {
		return workflowInstanceId;
	}

	public void setWorkflowInstanceId(long workflowInstanceId) {
		this.workflowInstanceId = workflowInstanceId;
	}

	public String getAssetType() {
		return assetType;
	}

	public void setAssetType(String assetType) {
		this.assetType = assetType;
	}

	public long getAssetPrimaryKey() {
		return assetPrimaryKey;
	}

	public void setAssetPrimaryKey(long assetPrimaryKey) {
		this.assetPrimaryKey = assetPrimaryKey;
	}

	public String getAssetTitle() {
		return assetTitle;
	}

	public void setAssetTitle(String assetTitle) {
		this.assetTitle = assetTitle;
	}

	public String getAssetContent() {
		return assetContent;
	}

	public void setAssetContent(String assetContent) {
		this.assetContent = assetContent;
	}

	public String getContentHtml() {
		return contentHtml;
	}

	public void setContentHtml(String contentHtml) {
		this.contentHtml = contentHtml;
	}

	public String getParentClassName() {
		return parentClassName;
	}

	public void setParentClassName(String parentClassName) {
		this.parentClassName = parentClassName;
	}

	public long getParentClassPK() {
		return parentClassPK;
	}

	public void setParentClassPK(long parentClassPK) {
		this.parentClassPK = parentClassPK;
	}

	public int getAssetStatus() {
		return assetStatus;
	}

	public void setAssetStatus(int assetStatus) {
		this.assetStatus = assetStatus;
	}

	public long getCreatorUserId() {
		return creatorUserId;
	}

	public void setCreatorUserId(long creatorUserId) {
		this.creatorUserId = creatorUserId;
	}

	public String getCreatorUserName() {
		return creatorUserName;
	}

	public void setCreatorUserName(String creatorUserName) {
		this.creatorUserName = creatorUserName;
	}

	public long getAssigneeUserId() {
		return assigneeUserId;
	}

	public void setAssigneeUserId(long assigneeUserId) {
		this.assigneeUserId = assigneeUserId;
	}

	public String getAssigneeUserName() {
		return assigneeUserName;
	}

	public void setAssigneeUserName(String assigneeUserName) {
		this.assigneeUserName = assigneeUserName;
	}

	public long getCompletedByUserId() {
		return completedByUserId;
	}

	public void setCompletedByUserId(long completedByUserId) {
		this.completedByUserId = completedByUserId;
	}

	public String getCompletedByUserName() {
		return completedByUserName;
	}

	public void setCompletedByUserName(String completedByUserName) {
		this.completedByUserName = completedByUserName;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getModifiedDate() {
		return modifiedDate;
	}

	public void setModifiedDate(Date modifiedDate) {
		this.modifiedDate = modifiedDate;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}

	public boolean isOverdue() {
		return isOverdue;
	}

	public void setOverdue(boolean overdue) {
		isOverdue = overdue;
	}

	public boolean isReviewable() {
		return reviewable;
	}

	public void setReviewable(boolean reviewable) {
		this.reviewable = reviewable;
	}

}
