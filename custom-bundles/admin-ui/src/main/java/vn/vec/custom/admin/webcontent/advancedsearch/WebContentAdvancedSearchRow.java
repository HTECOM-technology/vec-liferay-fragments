package vn.vec.custom.admin.webcontent.advancedsearch;

import java.util.Date;

public class WebContentAdvancedSearchRow {

	public WebContentAdvancedSearchRow(
		String articleId, long resourcePrimKey, long groupId, String groupName,
		long folderId, String folderName, String title, double version, int status,
		String statusLabel, long userId, String userName, Date createDate,
		Date modifiedDate, Date displayDate, String editUrl, String viewUrl) {

		_articleId = articleId;
		_resourcePrimKey = resourcePrimKey;
		_groupId = groupId;
		_groupName = groupName;
		_folderId = folderId;
		_folderName = folderName;
		_title = title;
		_version = version;
		_status = status;
		_statusLabel = statusLabel;
		_userId = userId;
		_userName = userName;
		_createDate = createDate;
		_modifiedDate = modifiedDate;
		_displayDate = displayDate;
		_editUrl = editUrl;
		_viewUrl = viewUrl;
	}

	public String getArticleId() {
		return _articleId;
	}

	public Date getCreateDate() {
		return _createDate;
	}

	public Date getDisplayDate() {
		return _displayDate;
	}

	public String getEditUrl() {
		return _editUrl;
	}

	public long getFolderId() {
		return _folderId;
	}

	public String getFolderName() {
		return _folderName;
	}

	public long getGroupId() {
		return _groupId;
	}

	public String getGroupName() {
		return _groupName;
	}

	public Date getModifiedDate() {
		return _modifiedDate;
	}

	public long getResourcePrimKey() {
		return _resourcePrimKey;
	}

	public int getStatus() {
		return _status;
	}

	public String getStatusLabel() {
		return _statusLabel;
	}

	public String getTitle() {
		return _title;
	}

	public long getUserId() {
		return _userId;
	}

	public String getUserName() {
		return _userName;
	}

	public double getVersion() {
		return _version;
	}

	public String getViewUrl() {
		return _viewUrl;
	}

	private final String _articleId;
	private final Date _createDate;
	private final Date _displayDate;
	private final String _editUrl;
	private final long _folderId;
	private final String _folderName;
	private final long _groupId;
	private final String _groupName;
	private final Date _modifiedDate;
	private final long _resourcePrimKey;
	private final int _status;
	private final String _statusLabel;
	private final String _title;
	private final long _userId;
	private final String _userName;
	private final double _version;
	private final String _viewUrl;

}
