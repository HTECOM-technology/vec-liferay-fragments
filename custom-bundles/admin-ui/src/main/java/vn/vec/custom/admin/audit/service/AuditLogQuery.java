package vn.vec.custom.admin.audit.service;

import java.util.Date;

public class AuditLogQuery {

	public String getActionType() {
		return _actionType;
	}

	public Date getFromDate() {
		return _fromDate;
	}

	public long getGroupId() {
		return _groupId;
	}

	public String getKeyword() {
		return _keyword;
	}

	public int getLimit() {
		return Math.max(1, Math.min(_pageSize, 200));
	}

	public int getOffset() {
		return (getPage() - 1) * getLimit();
	}

	public int getPage() {
		return Math.max(_page, 1);
	}

	public int getPageSize() {
		return getLimit();
	}

	public String getSort() {
		return _sort;
	}

	public String getStatus() {
		return _status;
	}

	public AuditSort getSortInfo() {
		return AuditSort.parse(_sort);
	}

	public String getTargetType() {
		return _targetType;
	}

	public Date getToDate() {
		return _toDate;
	}

	public long getUserId() {
		return _userId;
	}

	public void setActionType(String actionType) {
		_actionType = actionType;
	}

	public void setFromDate(Date fromDate) {
		_fromDate = fromDate;
	}

	public void setGroupId(long groupId) {
		_groupId = groupId;
	}

	public void setKeyword(String keyword) {
		_keyword = keyword;
	}

	public void setPage(int page) {
		_page = page;
	}

	public void setPageSize(int pageSize) {
		_pageSize = pageSize;
	}

	public void setSort(String sort) {
		_sort = sort;
	}

	public void setStatus(String status) {
		_status = status;
	}

	public void setTargetType(String targetType) {
		_targetType = targetType;
	}

	public void setToDate(Date toDate) {
		_toDate = toDate;
	}

	public void setUserId(long userId) {
		_userId = userId;
	}

	public static class AuditSort {

		public static AuditSort parse(String sort) {
			if ((sort == null) || sort.trim().isEmpty()) {
				return new AuditSort("createDate", false);
			}

			String[] parts = sort.split(":");
			String field = parts[0].trim();
			boolean ascending = (parts.length > 1) &&
				"asc".equalsIgnoreCase(parts[1].trim());

			return new AuditSort(field, ascending);
		}

		public boolean isAscending() {
			return _ascending;
		}

		public String getField() {
			return _field;
		}

		private AuditSort(String field, boolean ascending) {
			_ascending = ascending;
			_field = field;
		}

		private final boolean _ascending;
		private final String _field;

	}

	private String _actionType;
	private Date _fromDate;
	private long _groupId;
	private String _keyword;
	private int _page = 1;
	private int _pageSize = 20;
	private String _sort;
	private String _status;
	private String _targetType;
	private Date _toDate;
	private long _userId;

}
