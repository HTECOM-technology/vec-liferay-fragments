package vn.vec.custom.admin.webcontent.advancedsearch;

import java.util.Collections;
import java.util.Date;
import java.util.List;

public class WebContentAdvancedSearchQuery {

	public WebContentAdvancedSearchQuery(
		long companyId, long groupId, List<Long> folderIds, int status,
		long structureId, long userId, String userName, String keyword,
		String dateField, Date fromDate, Date toDateExclusive, int page,
		int pageSize, String sortField, String sortOrder, String languageId,
		List<Long> allowedGroupIds, boolean unrestrictedGroupScope) {

		_companyId = companyId;
		_groupId = groupId;
		_folderIds = (folderIds == null) ? Collections.emptyList() :
			Collections.unmodifiableList(folderIds);
		_status = status;
		_structureId = structureId;
		_userId = userId;
		_userName = userName;
		_keyword = keyword;
		_dateField = dateField;
		_fromDate = fromDate;
		_toDateExclusive = toDateExclusive;
		_page = page;
		_pageSize = pageSize;
		_sortField = sortField;
		_sortOrder = sortOrder;
		_languageId = languageId;
		_allowedGroupIds = (allowedGroupIds == null) ? Collections.emptyList() :
			Collections.unmodifiableList(allowedGroupIds);
		_unrestrictedGroupScope = unrestrictedGroupScope;
	}

	public List<Long> getAllowedGroupIds() {
		return _allowedGroupIds;
	}

	public long getCompanyId() {
		return _companyId;
	}

	public String getDateField() {
		return _dateField;
	}

	public List<Long> getFolderIds() {
		return _folderIds;
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

	public String getLanguageId() {
		return _languageId;
	}

	public int getOffset() {
		return (_page - 1) * _pageSize;
	}

	public int getPage() {
		return _page;
	}

	public int getPageSize() {
		return _pageSize;
	}

	public String getSortField() {
		return _sortField;
	}

	public String getSortOrder() {
		return _sortOrder;
	}

	public int getStatus() {
		return _status;
	}

	public long getStructureId() {
		return _structureId;
	}

	public Date getToDateExclusive() {
		return _toDateExclusive;
	}

	public long getUserId() {
		return _userId;
	}

	public String getUserName() {
		return _userName;
	}

	public boolean isUnrestrictedGroupScope() {
		return _unrestrictedGroupScope;
	}

	private final List<Long> _allowedGroupIds;
	private final long _companyId;
	private final String _dateField;
	private final List<Long> _folderIds;
	private final Date _fromDate;
	private final long _groupId;
	private final String _keyword;
	private final String _languageId;
	private final int _page;
	private final int _pageSize;
	private final String _sortField;
	private final String _sortOrder;
	private final int _status;
	private final long _structureId;
	private final Date _toDateExclusive;
	private final boolean _unrestrictedGroupScope;
	private final long _userId;
	private final String _userName;

}
