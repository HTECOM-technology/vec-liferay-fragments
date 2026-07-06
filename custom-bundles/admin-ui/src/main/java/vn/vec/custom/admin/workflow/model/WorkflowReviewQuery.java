package vn.vec.custom.admin.workflow.model;

import java.util.Date;

public class WorkflowReviewQuery {
	private String keyword;
	private String status;
	private String assetType;
	private String tab;
	private int start;
	private int end;
	private String orderBy;
	private String orderDirection;
	private long creatorUserId;
	private long assigneeUserId;
	private long completedByUserId;
	private Date createDateFrom;
	private Date createDateTo;

	public WorkflowReviewQuery() {
		this.start = 0;
		this.end = 20;
		this.tab = "all";
		this.orderBy = "createDate";
		this.orderDirection = "desc";
	}

	public String getKeyword() {
		return keyword;
	}

	public void setKeyword(String keyword) {
		this.keyword = keyword;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getAssetType() {
		return assetType;
	}

	public void setAssetType(String assetType) {
		this.assetType = assetType;
	}

	public String getTab() {
		return tab;
	}

	public void setTab(String tab) {
		this.tab = tab;
	}

	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	public int getEnd() {
		return end;
	}

	public void setEnd(int end) {
		this.end = end;
	}

	public String getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(String orderBy) {
		this.orderBy = orderBy;
	}

	public String getOrderDirection() {
		return orderDirection;
	}

	public void setOrderDirection(String orderDirection) {
		this.orderDirection = orderDirection;
	}

	public long getCreatorUserId() {
		return creatorUserId;
	}

	public void setCreatorUserId(long creatorUserId) {
		this.creatorUserId = creatorUserId;
	}

	public long getAssigneeUserId() {
		return assigneeUserId;
	}

	public void setAssigneeUserId(long assigneeUserId) {
		this.assigneeUserId = assigneeUserId;
	}

	public long getCompletedByUserId() {
		return completedByUserId;
	}

	public void setCompletedByUserId(long completedByUserId) {
		this.completedByUserId = completedByUserId;
	}

	public Date getCreateDateFrom() {
		return createDateFrom;
	}

	public void setCreateDateFrom(Date createDateFrom) {
		this.createDateFrom = createDateFrom;
	}

	public Date getCreateDateTo() {
		return createDateTo;
	}

	public void setCreateDateTo(Date createDateTo) {
		this.createDateTo = createDateTo;
	}

}
