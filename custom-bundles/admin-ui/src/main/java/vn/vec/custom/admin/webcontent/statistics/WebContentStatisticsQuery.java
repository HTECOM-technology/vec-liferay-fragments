package vn.vec.custom.admin.webcontent.statistics;

import java.util.Date;

public class WebContentStatisticsQuery {

	public WebContentStatisticsQuery(
		long groupId, int status, boolean latestOnly, boolean includeVersions,
		Date fromCreateDate, Date toCreateDateExclusive, Date fromModifiedDate,
		Date toModifiedDateExclusive, long folderId, long structureId, long userId,
		String languageId, boolean includeRawData) {

		_groupId = groupId;
		_status = status;
		_latestOnly = latestOnly;
		_includeVersions = includeVersions;
		_fromCreateDate = fromCreateDate;
		_toCreateDateExclusive = toCreateDateExclusive;
		_fromModifiedDate = fromModifiedDate;
		_toModifiedDateExclusive = toModifiedDateExclusive;
		_folderId = folderId;
		_structureId = structureId;
		_userId = userId;
		_languageId = languageId;
		_includeRawData = includeRawData;
	}

	public long getFolderId() {
		return _folderId;
	}

	public Date getFromCreateDate() {
		return _fromCreateDate;
	}

	public Date getFromModifiedDate() {
		return _fromModifiedDate;
	}

	public long getGroupId() {
		return _groupId;
	}

	public String getLanguageId() {
		return _languageId;
	}

	public long getStructureId() {
		return _structureId;
	}

	public int getStatus() {
		return _status;
	}

	public Date getToCreateDateExclusive() {
		return _toCreateDateExclusive;
	}

	public Date getToModifiedDateExclusive() {
		return _toModifiedDateExclusive;
	}

	public long getUserId() {
		return _userId;
	}

	public boolean isIncludeVersions() {
		return _includeVersions;
	}

	public boolean isIncludeRawData() {
		return _includeRawData;
	}

	public boolean isLatestOnly() {
		return _latestOnly;
	}

	public boolean isLatestOnlyEffective() {
		return _latestOnly && !_includeVersions;
	}

	private final long _folderId;
	private final Date _fromCreateDate;
	private final Date _fromModifiedDate;
	private final long _groupId;
	private final String _languageId;
	private final boolean _includeRawData;
	private final boolean _includeVersions;
	private final boolean _latestOnly;
	private final long _structureId;
	private final int _status;
	private final Date _toCreateDateExclusive;
	private final Date _toModifiedDateExclusive;
	private final long _userId;

}
