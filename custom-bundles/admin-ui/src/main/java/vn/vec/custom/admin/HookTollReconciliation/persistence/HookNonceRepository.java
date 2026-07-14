package vn.vec.custom.admin.HookTollReconciliation.persistence;

import com.liferay.portal.kernel.util.InfrastructureUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

import java.time.Instant;

import javax.sql.DataSource;

import org.osgi.service.component.annotations.Component;

/** JDBC repository cho nonce chống replay. Mọi lệnh ghi dùng portal DataSource. */
@Component(service = HookNonceRepository.class)
public class HookNonceRepository {

	/**
	 * Xóa nonce cùng khóa nếu đã hết hạn rồi đăng ký nonce mới theo unique key.
	 * Hai request đồng thời chỉ một request insert thành công.
	 */
	public boolean register(
			String clientId, String nonce, Instant receivedAt, Instant expiresAt)
		throws Exception {

		try (Connection connection = _getConnection()) {
			boolean originalAutoCommit = connection.getAutoCommit();

			try {
				connection.setAutoCommit(false);

				try (PreparedStatement preparedStatement =
						connection.prepareStatement(
							"delete from vec_hook_nonce where client_id = ? and " +
								"nonce = ? and expires_at <= ?")) {

					preparedStatement.setString(1, clientId);
					preparedStatement.setString(2, nonce);
					preparedStatement.setTimestamp(
						3, Timestamp.from(receivedAt), _utcCalendar());
					preparedStatement.executeUpdate();
				}

				try (PreparedStatement preparedStatement =
						connection.prepareStatement(
							"insert into vec_hook_nonce " +
								"(client_id, nonce, received_at, expires_at) " +
								"values (?, ?, ?, ?)")) {

					preparedStatement.setString(1, clientId);
					preparedStatement.setString(2, nonce);
					preparedStatement.setTimestamp(
						3, Timestamp.from(receivedAt), _utcCalendar());
					preparedStatement.setTimestamp(
						4, Timestamp.from(expiresAt), _utcCalendar());
					preparedStatement.executeUpdate();
				}

				connection.commit();

				return true;
			}
			catch (SQLException sqlException) {
				_rollback(connection);

				if (_isDuplicateKey(sqlException)) {
					return false;
				}

				throw sqlException;
			}
			finally {
				try {
					connection.setAutoCommit(originalAutoCommit);
				}
				catch (SQLException sqlException) {
					// Connection close ngay sau đó; không che lỗi nghiệp vụ ban đầu.
				}
			}
		}
	}

	public int deleteExpired(Instant now) throws Exception {
		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"delete from vec_hook_nonce where expires_at < ?")) {

			preparedStatement.setTimestamp(
				1, Timestamp.from(now), _utcCalendar());

			return preparedStatement.executeUpdate();
		}
	}

	private Connection _getConnection() throws Exception {
		DataSource dataSource = InfrastructureUtil.getDataSource();

		if (dataSource == null) {
			throw new IllegalStateException("Liferay data source is not available");
		}

		return dataSource.getConnection();
	}

	private boolean _isDuplicateKey(SQLException sqlException) {
		SQLException current = sqlException;

		while (current != null) {
			if ((current.getErrorCode() == 1062) ||
				"23000".equals(current.getSQLState()) ||
				"23505".equals(current.getSQLState())) {

				return true;
			}

			current = current.getNextException();
		}

		return false;
	}

	private java.util.Calendar _utcCalendar() {
		return java.util.Calendar.getInstance(
			java.util.TimeZone.getTimeZone("UTC"));
	}

	private void _rollback(Connection connection) {
		try {
			connection.rollback();
		}
		catch (SQLException sqlException) {
			// Giữ nguyên lỗi gốc.
		}
	}
}
