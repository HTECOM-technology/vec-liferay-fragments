package vn.vec.custom.admin.webcontent.advancedsearch;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.osgi.service.component.annotations.Component;

@Component(service = WebContentAdvancedSearchRepository.class)
public class WebContentAdvancedSearchRepository {

	public int count(WebContentAdvancedSearchQuery query) throws Exception {
		List<Object> parameters = new ArrayList<>();
		String sql =
			"select count(1) " + _buildFromAndWhereClause(query, parameters);

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

			_fillParameters(preparedStatement, parameters);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				if (resultSet.next()) {
					return resultSet.getInt(1);
				}
			}
		}

		return 0;
	}

	public List<RowRecord> search(WebContentAdvancedSearchQuery query)
		throws Exception {

		List<Object> parameters = new ArrayList<>();
		StringBundler sql = new StringBundler();

		sql.append(
			"select ja.articleId, ja.resourcePrimKey, ja.groupId, ja.folderId, ");
		sql.append("coalesce(jal.title, jalDefault.title, ja.articleId) as title, ");
		sql.append("ja.version, ja.status, ja.userId, ja.userName, ");
		sql.append("ja.createDate, ja.modifiedDate, ja.displayDate ");
		sql.append(_buildFromAndWhereClause(query, parameters));
		sql.append(" order by ");
		sql.append(_getOrderBy(query));
		sql.append(" limit ? offset ?");

		parameters.add(query.getPageSize());
		parameters.add(query.getOffset());

		List<RowRecord> rowRecords = new ArrayList<>();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql.toString())) {

			_fillParameters(preparedStatement, parameters);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				while (resultSet.next()) {
					rowRecords.add(
						new RowRecord(
							resultSet.getString("articleId"),
							resultSet.getLong("resourcePrimKey"),
							resultSet.getLong("groupId"),
							resultSet.getLong("folderId"),
							resultSet.getString("title"),
							resultSet.getDouble("version"),
							resultSet.getInt("status"),
							resultSet.getLong("userId"),
							resultSet.getString("userName"),
							resultSet.getTimestamp("createDate"),
							resultSet.getTimestamp("modifiedDate"),
							resultSet.getTimestamp("displayDate")));
				}
			}
		}

		return rowRecords;
	}

	private String _buildFromAndWhereClause(
		WebContentAdvancedSearchQuery query, List<Object> parameters) {

		StringBundler sql = new StringBundler();

		sql.append(" from JournalArticle ja ");
		sql.append(
			"inner join (select resourcePrimKey, max(version) as maxVersion " +
				"from JournalArticle where companyId = ? and ctCollectionId = 0 " +
				"group by resourcePrimKey) latest ");
		sql.append(
			"on latest.resourcePrimKey = ja.resourcePrimKey and latest.maxVersion = ja.version ");
		sql.append(
			"left join JournalArticleLocalization jal on jal.articlePK = ja.id_ and jal.languageId = ? ");
		sql.append(
			"left join JournalArticleLocalization jalDefault on jalDefault.articlePK = ja.id_ and jalDefault.languageId = ja.defaultLanguageId ");
		sql.append("where ja.companyId = ? and ja.ctCollectionId = 0");

		parameters.add(query.getCompanyId());
		parameters.add(query.getLanguageId());
		parameters.add(query.getCompanyId());

		if (!query.isUnrestrictedGroupScope()) {
			sql.append(" and ja.groupId in (");

			for (int i = 0; i < query.getAllowedGroupIds().size(); i++) {
				if (i > 0) {
					sql.append(", ");
				}

				sql.append("?");
				parameters.add(query.getAllowedGroupIds().get(i));
			}

			sql.append(")");
		}

		if (query.getGroupId() > 0) {
			sql.append(" and ja.groupId = ?");
			parameters.add(query.getGroupId());
		}

		if (!query.getFolderIds().isEmpty()) {
			if (query.getFolderIds().size() == 1) {
				sql.append(" and ja.folderId = ?");
				parameters.add(query.getFolderIds().get(0));
			}
			else {
				sql.append(" and ja.folderId in (");

				for (int i = 0; i < query.getFolderIds().size(); i++) {
					if (i > 0) {
						sql.append(", ");
					}

					sql.append("?");
					parameters.add(query.getFolderIds().get(i));
				}

				sql.append(")");
			}
		}

		if (query.getStatus() >= 0) {
			sql.append(" and ja.status = ?");
			parameters.add(query.getStatus());
		}

		if (query.getStructureId() > 0) {
			sql.append(" and ja.DDMStructureId = ?");
			parameters.add(query.getStructureId());
		}

		if (query.getUserId() > 0) {
			sql.append(" and ja.userId = ?");
			parameters.add(query.getUserId());
		}

		if (query.getUserName() != null) {
			sql.append(" and lower(coalesce(ja.userName, '')) like ?");
			parameters.add("%" + query.getUserName().toLowerCase() + "%");
		}

		if (query.getKeyword() != null) {
			sql.append(
				" and (" +
					"lower(coalesce(jal.title, jalDefault.title, '')) like ? or " +
					"lower(coalesce(ja.articleId, '')) like ? or " +
					"lower(coalesce(ja.urlTitle, '')) like ?" +
				")");

			String keyword = "%" + query.getKeyword().toLowerCase() + "%";

			parameters.add(keyword);
			parameters.add(keyword);
			parameters.add(keyword);
		}

		if (query.getFromDate() != null) {
			sql.append(" and ja.");
			sql.append(_toDateColumn(query.getDateField()));
			sql.append(" >= ?");
			parameters.add(new Timestamp(query.getFromDate().getTime()));
		}

		if (query.getToDateExclusive() != null) {
			sql.append(" and ja.");
			sql.append(_toDateColumn(query.getDateField()));
			sql.append(" < ?");
			parameters.add(new Timestamp(query.getToDateExclusive().getTime()));
		}

		return sql.toString();
	}

	private void _fillParameters(
			PreparedStatement preparedStatement, List<Object> parameters)
		throws Exception {

		for (int i = 0; i < parameters.size(); i++) {
			Object value = parameters.get(i);
			int index = i + 1;

			if (value instanceof Long) {
				preparedStatement.setLong(index, (Long)value);
			}
			else if (value instanceof Integer) {
				preparedStatement.setInt(index, (Integer)value);
			}
			else if (value instanceof Timestamp) {
				preparedStatement.setTimestamp(index, (Timestamp)value);
			}
			else if (value instanceof Date) {
				preparedStatement.setTimestamp(
					index, new Timestamp(((Date)value).getTime()));
			}
			else {
				preparedStatement.setString(index, String.valueOf(value));
			}
		}
	}

	private String _getOrderBy(WebContentAdvancedSearchQuery query) {
		String field = query.getSortField();
		String direction = "asc".equals(query.getSortOrder()) ? "asc" : "desc";

		if ("title".equals(field)) {
			return "lower(coalesce(jal.title, jalDefault.title, ja.articleId)) " +
				direction + ", ja.resourcePrimKey desc";
		}

		if ("createDate".equals(field)) {
			return "ja.createDate " + direction + ", ja.resourcePrimKey desc";
		}

		if ("displayDate".equals(field)) {
			return "ja.displayDate " + direction + ", ja.resourcePrimKey desc";
		}

		if ("status".equals(field)) {
			return "ja.status " + direction + ", ja.resourcePrimKey desc";
		}

		if ("userName".equals(field)) {
			return "lower(coalesce(ja.userName, '')) " + direction +
				", ja.resourcePrimKey desc";
		}

		return "ja.modifiedDate " + direction + ", ja.resourcePrimKey desc";
	}

	private String _toDateColumn(String dateField) {
		if ("createDate".equals(dateField)) {
			return "createDate";
		}

		if ("displayDate".equals(dateField)) {
			return "displayDate";
		}

		return "modifiedDate";
	}

	public static class RowRecord {

		public RowRecord(
			String articleId, long resourcePrimKey, long groupId, long folderId,
			String title, double version, int status, long userId, String userName,
			Date createDate, Date modifiedDate, Date displayDate) {

			_articleId = articleId;
			_createDate = createDate;
			_displayDate = displayDate;
			_folderId = folderId;
			_groupId = groupId;
			_modifiedDate = modifiedDate;
			_resourcePrimKey = resourcePrimKey;
			_status = status;
			_title = title;
			_userId = userId;
			_userName = userName;
			_version = version;
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

		public long getFolderId() {
			return _folderId;
		}

		public long getGroupId() {
			return _groupId;
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

		private final String _articleId;
		private final Date _createDate;
		private final Date _displayDate;
		private final long _folderId;
		private final long _groupId;
		private final Date _modifiedDate;
		private final long _resourcePrimKey;
		private final int _status;
		private final String _title;
		private final long _userId;
		private final String _userName;
		private final double _version;

	}

	private static class StringBundler {

		public void append(String value) {
			_stringBuilder.append(value);
		}

		@Override
		public String toString() {
			return _stringBuilder.toString();
		}

		private final StringBuilder _stringBuilder = new StringBuilder();

	}

}
