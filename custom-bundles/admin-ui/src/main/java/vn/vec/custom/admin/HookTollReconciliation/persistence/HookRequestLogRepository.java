package vn.vec.custom.admin.HookTollReconciliation.persistence;

import com.liferay.portal.kernel.util.InfrastructureUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;

import java.time.Instant;

import javax.sql.DataSource;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.HookTollReconciliation.HookConstants;
import vn.vec.custom.admin.HookTollReconciliation.model.HookRequestLog;

/** Ghi audit request; không có cột credential hay chữ ký. */
@Component(service = HookRequestLogRepository.class)
public class HookRequestLogRepository {

	public void insert(HookRequestLog requestLog) throws Exception {
		String sql =
			"insert into vec_hook_request_log (" +
				"trans_id, client_id, source_system, external_id, record_type, " +
				"http_status, auth_ok, result_action, error_code, error_message, " +
				"remote_ip, body_size, raw_body, received_at" +
			") values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(sql)) {

			preparedStatement.setString(
				1, _limit(requestLog.getTransId(), 64));
			preparedStatement.setString(
				2, _limit(requestLog.getClientId(), 100));
			preparedStatement.setString(
				3, _limit(requestLog.getSourceSystem(), 100));
			preparedStatement.setString(
				4, _limit(requestLog.getExternalId(), 255));
			preparedStatement.setString(
				5, _limit(requestLog.getRecordType(), 32));
			preparedStatement.setInt(6, requestLog.getHttpStatus());
			preparedStatement.setBoolean(7, requestLog.isAuthOk());
			preparedStatement.setString(
				8, _limit(requestLog.getResultAction(), 16));
			preparedStatement.setString(
				9, _limit(requestLog.getErrorCode(), 64));
			preparedStatement.setString(
				10, _limit(requestLog.getErrorMessage(), 1000));
			preparedStatement.setString(
				11, _limit(requestLog.getRemoteIp(), 64));
			preparedStatement.setInt(12, Math.max(requestLog.getBodySize(), 0));
			preparedStatement.setString(
				13,
				HookConstants.LOG_RAW_BODY ? requestLog.getRawBody() : null);
			preparedStatement.setTimestamp(
				14, Timestamp.from(Instant.now()), _utcCalendar());
			preparedStatement.executeUpdate();
		}
	}

	private Connection _getConnection() throws Exception {
		DataSource dataSource = InfrastructureUtil.getDataSource();

		if (dataSource == null) {
			throw new IllegalStateException("Liferay data source is not available");
		}

		return dataSource.getConnection();
	}

	private String _limit(String value, int maxLength) {
		if ((value == null) || (value.length() <= maxLength)) {
			return value;
		}

		return value.substring(0, maxLength);
	}

	private java.util.Calendar _utcCalendar() {
		return java.util.Calendar.getInstance(
			java.util.TimeZone.getTimeZone("UTC"));
	}
}
