package vn.vec.custom.admin.webcontent.statistics;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class WebContentStatisticsRow {

	public static List<String> deserializeValues(String line) {
		if (line == null) {
			return Collections.emptyList();
		}

		List<String> values = new ArrayList<>();
		StringBuilder current = new StringBuilder();
		boolean escaped = false;

		for (int i = 0; i < line.length(); i++) {
			char ch = line.charAt(i);

			if (escaped) {
				if (ch == 'n') {
					current.append('\n');
				}
				else if (ch == 'r') {
					current.append('\r');
				}
				else if (ch == 't') {
					current.append('\t');
				}
				else {
					current.append(ch);
				}

				escaped = false;

				continue;
			}

			if (ch == '\\') {
				escaped = true;

				continue;
			}

			if (ch == '\t') {
				values.add(current.toString());
				current.setLength(0);

				continue;
			}

			current.append(ch);
		}

		values.add(current.toString());

		return values;
	}

	public static List<String> getHeaders() {
		return _HEADERS;
	}

	public static String toStatusLabel(int status) {
		switch (status) {
			case -1:
				return "Tất cả";
			case 0:
				return "Đã duyệt";
			case 1:
				return "Chờ duyệt";
			case 2:
				return "Nháp";
			case 3:
				return "Hết hạn";
			case 4:
				return "Từ chối";
			case 7:
				return "Lên lịch";
			case 8:
				return "Trong thùng rác";
			default:
				return "Không xác định";
		}
	}

	public WebContentStatisticsRow(
		String id, String uuid, String resourcePrimKey, String groupId,
		String companyId, String folderId, String folderPath, String articleId,
		String version, String title, String urlTitle, String ddmStructureId,
		String ddmTemplateKey, String structureName, String userId,
		String userName, String status, String statusLabel, String statusByUserId,
		String statusByUserName,
		String createDate, String modifiedDate, String displayDate,
		String expirationDate, String reviewDate, String indexable,
		String smallImage, String smallImageId, String smallImageURL,
		long statusKey, long structureKey, long folderKey, long userKey,
		String createMonthKey, String modifiedMonthKey) {

		_id = id;
		_uuid = uuid;
		_resourcePrimKey = resourcePrimKey;
		_groupId = groupId;
		_companyId = companyId;
		_folderId = folderId;
		_folderPath = folderPath;
		_articleId = articleId;
		_version = version;
		_title = title;
		_urlTitle = urlTitle;
		_ddmStructureId = ddmStructureId;
		_ddmTemplateKey = ddmTemplateKey;
		_structureName = structureName;
		_userId = userId;
		_userName = userName;
		_status = status;
		_statusLabel = statusLabel;
		_statusByUserId = statusByUserId;
		_statusByUserName = statusByUserName;
		_createDate = createDate;
		_modifiedDate = modifiedDate;
		_displayDate = displayDate;
		_expirationDate = expirationDate;
		_reviewDate = reviewDate;
		_indexable = indexable;
		_smallImage = smallImage;
		_smallImageId = smallImageId;
		_smallImageURL = smallImageURL;
		_statusKey = statusKey;
		_structureKey = structureKey;
		_folderKey = folderKey;
		_userKey = userKey;
		_createMonthKey = createMonthKey;
		_modifiedMonthKey = modifiedMonthKey;
	}

	public String getCreateMonthKey() {
		return _createMonthKey;
	}

	public String getFolderPath() {
		return _folderPath;
	}

	public long getFolderKey() {
		return _folderKey;
	}

	public String getModifiedMonthKey() {
		return _modifiedMonthKey;
	}

	public String getStatusLabel() {
		return _statusLabel;
	}

	public String getStructureName() {
		return _structureName;
	}

	public long getStatusKey() {
		return _statusKey;
	}

	public long getStructureKey() {
		return _structureKey;
	}

	public long getUserKey() {
		return _userKey;
	}

	public String getUserName() {
		return _userName;
	}

	public String serialize() {
		List<String> values = toValues();
		StringBuilder sb = new StringBuilder();

		for (int i = 0; i < values.size(); i++) {
			if (i > 0) {
				sb.append('\t');
			}

			sb.append(_escape(values.get(i)));
		}

		return sb.toString();
	}

	public List<String> toValues() {
		List<String> values = new ArrayList<>(_HEADERS.size());

		values.add(_id);
		values.add(_uuid);
		values.add(_resourcePrimKey);
		values.add(_groupId);
		values.add(_companyId);
		values.add(_folderId);
		values.add(_folderPath);
		values.add(_articleId);
		values.add(_version);
		values.add(_title);
		values.add(_urlTitle);
		values.add(_ddmStructureId);
		values.add(_ddmTemplateKey);
		values.add(_structureName);
		values.add(_userId);
		values.add(_userName);
		values.add(_status);
		values.add(_statusLabel);
		values.add(_statusByUserId);
		values.add(_statusByUserName);
		values.add(_createDate);
		values.add(_modifiedDate);
		values.add(_displayDate);
		values.add(_expirationDate);
		values.add(_reviewDate);
		values.add(_indexable);
		values.add(_smallImage);
		values.add(_smallImageId);
		values.add(_smallImageURL);

		return values;
	}

	private String _escape(String value) {
		if (value == null) {
			return "";
		}

		return value.replace("\\", "\\\\").replace("\t", "\\t").replace(
			"\r", "\\r").replace("\n", "\\n");
	}

	private static final List<String> _HEADERS;

	static {
		List<String> headers = new ArrayList<>();

		headers.add("id");
		headers.add("uuid");
		headers.add("resourcePrimKey");
		headers.add("groupId");
		headers.add("companyId");
		headers.add("folderId");
		headers.add("folderPath");
		headers.add("articleId");
		headers.add("version");
		headers.add("title");
		headers.add("urlTitle");
		headers.add("ddmStructureId");
		headers.add("ddmTemplateKey");
		headers.add("tenCauTruc");
		headers.add("userId");
		headers.add("userName");
		headers.add("status");
		headers.add("statusLabel");
		headers.add("statusByUserId");
		headers.add("statusByUserName");
		headers.add("createDate");
		headers.add("modifiedDate");
		headers.add("displayDate");
		headers.add("expirationDate");
		headers.add("reviewDate");
		headers.add("indexable");
		headers.add("smallImage");
		headers.add("smallImageId");
		headers.add("smallImageURL");

		_HEADERS = Collections.unmodifiableList(headers);
	}

	private final String _articleId;
	private final String _companyId;
	private final String _createDate;
	private final String _createMonthKey;
	private final String _ddmStructureId;
	private final String _ddmTemplateKey;
	private final String _displayDate;
	private final String _expirationDate;
	private final String _folderId;
	private final String _folderPath;
	private final long _folderKey;
	private final String _groupId;
	private final String _id;
	private final String _indexable;
	private final String _modifiedDate;
	private final String _modifiedMonthKey;
	private final String _resourcePrimKey;
	private final String _reviewDate;
	private final String _smallImage;
	private final String _smallImageId;
	private final String _smallImageURL;
	private final String _status;
	private final String _statusByUserId;
	private final String _statusByUserName;
	private final long _statusKey;
	private final String _statusLabel;
	private final long _structureKey;
	private final String _structureName;
	private final String _title;
	private final String _urlTitle;
	private final String _userId;
	private final long _userKey;
	private final String _userName;
	private final String _uuid;
	private final String _version;

}
