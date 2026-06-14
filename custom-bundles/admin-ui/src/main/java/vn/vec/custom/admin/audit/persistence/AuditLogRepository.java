package vn.vec.custom.admin.audit.persistence;

import com.liferay.counter.kernel.service.CounterLocalServiceUtil;
import com.liferay.portal.kernel.util.InfrastructureUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.sql.DataSource;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.audit.model.AuditLogEntry;
import vn.vec.custom.admin.audit.service.AuditLogQuery;

@Component(service = AuditLogRepository.class)
public class AuditLogRepository {

	public int count(AuditLogQuery auditLogQuery) throws Exception {
		List<Object> parameters = new ArrayList<>();
		StringBuilder stringBuilder = new StringBuilder(
			"select count(1) from VEC_AUDIT_LOG where 1 = 1");

		_appendFilters(stringBuilder, parameters, auditLogQuery);

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				stringBuilder.toString())) {

			_fillParameters(preparedStatement, parameters);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				if (resultSet.next()) {
					return resultSet.getInt(1);
				}
			}
		}

		return 0;
	}

	public AuditLogEntry findById(long auditLogId) throws Exception {
		String sql = "select * from VEC_AUDIT_LOG where auditLogId = ?";

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql)) {

			preparedStatement.setLong(1, auditLogId);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				if (resultSet.next()) {
					return _mapRow(resultSet);
				}
			}
		}

		return null;
	}

	public long insertPending(AuditLogEntry auditLogEntry) throws Exception {
		long auditLogId = CounterLocalServiceUtil.increment("VEC_AUDIT_LOG");
		String sql =
			"insert into VEC_AUDIT_LOG (" +
				"auditLogId, companyId, groupId, siteName, userId, userName, " +
				"userEmail, actionType, targetType, className, classPK, " +
				"targetTitle, targetUrl, beforeData, afterData, diffData, " +
				"requestUri, ipAddress, userAgent, sessionId, status, " +
				"errorMessage, createDate, completedDate" +
			") values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql)) {

			int index = 1;

			preparedStatement.setLong(index++, auditLogId);
			preparedStatement.setLong(index++, auditLogEntry.getCompanyId());
			preparedStatement.setLong(index++, auditLogEntry.getGroupId());
			preparedStatement.setString(index++, auditLogEntry.getSiteName());
			preparedStatement.setLong(index++, auditLogEntry.getUserId());
			preparedStatement.setString(index++, auditLogEntry.getUserName());
			preparedStatement.setString(index++, auditLogEntry.getUserEmail());
			preparedStatement.setString(index++, auditLogEntry.getActionType());
			preparedStatement.setString(index++, auditLogEntry.getTargetType());
			preparedStatement.setString(index++, auditLogEntry.getClassName());
			preparedStatement.setString(index++, auditLogEntry.getClassPK());
			preparedStatement.setString(index++, auditLogEntry.getTargetTitle());
			preparedStatement.setString(index++, auditLogEntry.getTargetUrl());
			preparedStatement.setString(index++, auditLogEntry.getBeforeData());
			preparedStatement.setString(index++, auditLogEntry.getAfterData());
			preparedStatement.setString(index++, auditLogEntry.getDiffData());
			preparedStatement.setString(index++, auditLogEntry.getRequestUri());
			preparedStatement.setString(index++, auditLogEntry.getIpAddress());
			preparedStatement.setString(index++, auditLogEntry.getUserAgent());
			preparedStatement.setString(index++, auditLogEntry.getSessionId());
			preparedStatement.setString(index++, auditLogEntry.getStatus());
			preparedStatement.setString(index++, auditLogEntry.getErrorMessage());
			preparedStatement.setTimestamp(
				index++, _toTimestamp(auditLogEntry.getCreateDate()));
			preparedStatement.setTimestamp(
				index++, _toTimestamp(auditLogEntry.getCompletedDate()));
			preparedStatement.executeUpdate();
		}

		return auditLogId;
	}

	public List<AuditLogEntry> search(AuditLogQuery auditLogQuery)
		throws Exception {

		List<Object> parameters = new ArrayList<>();
		StringBuilder stringBuilder = new StringBuilder(
			"select * from VEC_AUDIT_LOG where 1 = 1");

		_appendFilters(stringBuilder, parameters, auditLogQuery);
		stringBuilder.append(" order by ");
		stringBuilder.append(_toOrderBy(auditLogQuery));
		stringBuilder.append(" limit ? offset ?");
		parameters.add(auditLogQuery.getLimit());
		parameters.add(auditLogQuery.getOffset());

		List<AuditLogEntry> auditLogEntries = new ArrayList<>();

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				stringBuilder.toString())) {

			_fillParameters(preparedStatement, parameters);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				while (resultSet.next()) {
					auditLogEntries.add(_mapRow(resultSet));
				}
			}
		}

		return auditLogEntries;
	}

	public void updateFailed(
			long auditLogId, String classPK, String targetTitle, String targetUrl,
			String errorMessage, Date completedDate)
		throws Exception {

		String sql =
			"update VEC_AUDIT_LOG set classPK = ?, targetTitle = ?, " +
				"targetUrl = ?, status = ?, errorMessage = ?, completedDate = ? " +
			"where auditLogId = ?";

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql)) {

			preparedStatement.setString(1, classPK);
			preparedStatement.setString(2, targetTitle);
			preparedStatement.setString(3, targetUrl);
			preparedStatement.setString(4, "FAILED");
			preparedStatement.setString(5, errorMessage);
			preparedStatement.setTimestamp(6, _toTimestamp(completedDate));
			preparedStatement.setLong(7, auditLogId);
			preparedStatement.executeUpdate();
		}
	}

	public void updateSuccess(
			long auditLogId, String classPK, String targetTitle, String targetUrl,
			String afterData, String diffData, Date completedDate)
		throws Exception {

		String sql =
			"update VEC_AUDIT_LOG set classPK = ?, targetTitle = ?, " +
				"targetUrl = ?, afterData = ?, diffData = ?, status = ?, " +
				"errorMessage = ?, completedDate = ? where auditLogId = ?";

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql)) {

			preparedStatement.setString(1, classPK);
			preparedStatement.setString(2, targetTitle);
			preparedStatement.setString(3, targetUrl);
			preparedStatement.setString(4, afterData);
			preparedStatement.setString(5, diffData);
			preparedStatement.setString(6, "SUCCESS");
			preparedStatement.setString(7, null);
			preparedStatement.setTimestamp(8, _toTimestamp(completedDate));
			preparedStatement.setLong(9, auditLogId);
			preparedStatement.executeUpdate();
		}
	}

	private void _appendFilters(
		StringBuilder stringBuilder, List<Object> parameters,
		AuditLogQuery auditLogQuery) {

		if ((auditLogQuery.getKeyword() != null) &&
			!auditLogQuery.getKeyword().trim().isEmpty()) {

			stringBuilder.append(
				" and (" +
					"lower(coalesce(targetTitle, '')) like ? or " +
					"lower(coalesce(userName, '')) like ? or " +
					"lower(coalesce(userEmail, '')) like ? or " +
					"lower(coalesce(classPK, '')) like ? or " +
					"lower(coalesce(requestUri, '')) like ?" +
				")");

			String keyword = "%" + auditLogQuery.getKeyword().trim().toLowerCase() +
				"%";

			parameters.add(keyword);
			parameters.add(keyword);
			parameters.add(keyword);
			parameters.add(keyword);
			parameters.add(keyword);
		}

		if (auditLogQuery.getFromDate() != null) {
			stringBuilder.append(" and createDate >= ?");
			parameters.add(new Timestamp(auditLogQuery.getFromDate().getTime()));
		}

		if (auditLogQuery.getToDate() != null) {
			stringBuilder.append(" and createDate < ?");
			parameters.add(new Timestamp(auditLogQuery.getToDate().getTime()));
		}

		if (auditLogQuery.getUserId() > 0) {
			stringBuilder.append(" and userId = ?");
			parameters.add(auditLogQuery.getUserId());
		}

		if (auditLogQuery.getGroupId() > 0) {
			stringBuilder.append(" and groupId = ?");
			parameters.add(auditLogQuery.getGroupId());
		}

		if ((auditLogQuery.getActionType() != null) &&
			!auditLogQuery.getActionType().trim().isEmpty()) {

			stringBuilder.append(" and actionType = ?");
			parameters.add(auditLogQuery.getActionType().trim());
		}

		if ((auditLogQuery.getTargetType() != null) &&
			!auditLogQuery.getTargetType().trim().isEmpty()) {

			stringBuilder.append(" and targetType = ?");
			parameters.add(auditLogQuery.getTargetType().trim());
		}

		if ((auditLogQuery.getStatus() != null) &&
			!auditLogQuery.getStatus().trim().isEmpty()) {

			stringBuilder.append(" and status = ?");
			parameters.add(auditLogQuery.getStatus().trim());
		}
	}

	private void _fillParameters(
			PreparedStatement preparedStatement, List<Object> parameters)
		throws Exception {

		for (int i = 0; i < parameters.size(); i++) {
			Object value = parameters.get(i);

			if (value instanceof Timestamp) {
				preparedStatement.setTimestamp(i + 1, (Timestamp)value);
			}
			else if (value instanceof Integer) {
				preparedStatement.setInt(i + 1, (Integer)value);
			}
			else if (value instanceof Long) {
				preparedStatement.setLong(i + 1, (Long)value);
			}
			else {
				preparedStatement.setObject(i + 1, value);
			}
		}
	}

	private Connection _getConnection() throws Exception {
		DataSource dataSource = InfrastructureUtil.getDataSource();

		if (dataSource == null) {
			throw new IllegalStateException("Liferay data source is not available");
		}

		return dataSource.getConnection();
	}

	private AuditLogEntry _mapRow(ResultSet resultSet) throws Exception {
		AuditLogEntry auditLogEntry = new AuditLogEntry();

		auditLogEntry.setAuditLogId(resultSet.getLong("auditLogId"));
		auditLogEntry.setCompanyId(resultSet.getLong("companyId"));
		auditLogEntry.setGroupId(resultSet.getLong("groupId"));
		auditLogEntry.setSiteName(resultSet.getString("siteName"));
		auditLogEntry.setUserId(resultSet.getLong("userId"));
		auditLogEntry.setUserName(resultSet.getString("userName"));
		auditLogEntry.setUserEmail(resultSet.getString("userEmail"));
		auditLogEntry.setActionType(resultSet.getString("actionType"));
		auditLogEntry.setTargetType(resultSet.getString("targetType"));
		auditLogEntry.setClassName(resultSet.getString("className"));
		auditLogEntry.setClassPK(resultSet.getString("classPK"));
		auditLogEntry.setTargetTitle(resultSet.getString("targetTitle"));
		auditLogEntry.setTargetUrl(resultSet.getString("targetUrl"));
		auditLogEntry.setBeforeData(resultSet.getString("beforeData"));
		auditLogEntry.setAfterData(resultSet.getString("afterData"));
		auditLogEntry.setDiffData(resultSet.getString("diffData"));
		auditLogEntry.setRequestUri(resultSet.getString("requestUri"));
		auditLogEntry.setIpAddress(resultSet.getString("ipAddress"));
		auditLogEntry.setUserAgent(resultSet.getString("userAgent"));
		auditLogEntry.setSessionId(resultSet.getString("sessionId"));
		auditLogEntry.setStatus(resultSet.getString("status"));
		auditLogEntry.setErrorMessage(resultSet.getString("errorMessage"));
		auditLogEntry.setCreateDate(_toDate(resultSet.getTimestamp("createDate")));
		auditLogEntry.setCompletedDate(
			_toDate(resultSet.getTimestamp("completedDate")));

		return auditLogEntry;
	}

	private Date _toDate(Timestamp timestamp) {
		if (timestamp == null) {
			return null;
		}

		return new Date(timestamp.getTime());
	}

	private String _toOrderBy(AuditLogQuery auditLogQuery) {
		AuditLogQuery.AuditSort auditSort = auditLogQuery.getSortInfo();
		String field = auditSort.getField();

		if ("completedDate".equalsIgnoreCase(field)) {
			return "completedDate " + (auditSort.isAscending() ? "asc" : "desc");
		}

		if ("userName".equalsIgnoreCase(field)) {
			return "userName " + (auditSort.isAscending() ? "asc" : "desc");
		}

		if ("actionType".equalsIgnoreCase(field)) {
			return "actionType " + (auditSort.isAscending() ? "asc" : "desc");
		}

		if ("targetType".equalsIgnoreCase(field)) {
			return "targetType " + (auditSort.isAscending() ? "asc" : "desc");
		}

		if ("status".equalsIgnoreCase(field)) {
			return "status " + (auditSort.isAscending() ? "asc" : "desc");
		}

		return "createDate " + (auditSort.isAscending() ? "asc" : "desc");
	}

	private Timestamp _toTimestamp(Date date) {
		if (date == null) {
			return null;
		}

		return new Timestamp(date.getTime());
	}

}
