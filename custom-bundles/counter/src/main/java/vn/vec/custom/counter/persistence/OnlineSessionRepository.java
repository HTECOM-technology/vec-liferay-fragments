package vn.vec.custom.counter.persistence;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.sql.Types;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.counter.constants.CounterConstants;
import vn.vec.custom.counter.model.OnlineCount;
import vn.vec.custom.counter.service.CounterRequestContext;

/**
 * Counter 2: số người đang online.
 *
 * <p>
 * Mỗi visitor có tối đa một dòng trong {@code VEC_CounterOnlineSession}. Frontend
 * gửi heartbeat định kỳ; visitor được coi là online nếu {@code lastSeenDate} nằm
 * trong {@link CounterConstants#ONLINE_WINDOW_SECONDS} giây gần nhất.
 * </p>
 */
@Component(service = OnlineSessionRepository.class)
public class OnlineSessionRepository {

	public OnlineCount countOnline(long companyId, long groupId)
		throws Exception {

		_counterTableManager.ensureTables();

		Timestamp since = new Timestamp(
			System.currentTimeMillis() -
				(CounterConstants.ONLINE_WINDOW_SECONDS * 1000L));

		StringBuilder sql = new StringBuilder(
			"select coalesce(sum(case when userId > 0 then 1 else 0 end), 0) " +
				"as members, coalesce(sum(case when userId > 0 then 0 " +
					"else 1 end), 0) as guests " +
						"from VEC_CounterOnlineSession " +
							"where companyId = ? and lastSeenDate >= ?");

		if (groupId > 0) {
			sql.append(" and groupId = ?");
		}

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql.toString())) {

			int index = 1;

			preparedStatement.setLong(index++, companyId);
			preparedStatement.setTimestamp(index++, since);

			if (groupId > 0) {
				preparedStatement.setLong(index++, groupId);
			}

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				if (resultSet.next()) {
					return new OnlineCount(
						resultSet.getLong("guests"),
						resultSet.getLong("members"));
				}
			}
		}

		return new OnlineCount(0, 0);
	}

	/** Xoá session cũ hơn ngưỡng purge. Dùng bởi scheduler dọn dữ liệu. */
	public int deleteStaleSessions() throws Exception {
		_counterTableManager.ensureTables();

		Timestamp before = new Timestamp(
			System.currentTimeMillis() -
				(CounterConstants.ONLINE_SESSION_PURGE_SECONDS * 1000L));

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"delete from VEC_CounterOnlineSession where lastSeenDate " +
					"is null or lastSeenDate < ?")) {

			preparedStatement.setTimestamp(1, before);

			return preparedStatement.executeUpdate();
		}
	}

	/** Cập nhật thời điểm nhìn thấy visitor lần cuối. */
	public void heartbeat(CounterRequestContext counterRequestContext)
		throws Exception {

		_counterTableManager.ensureTables();

		Timestamp now = new Timestamp(System.currentTimeMillis());

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"insert into VEC_CounterOnlineSession (companyId, groupId, " +
					"visitorKey, userId, currentPath, firstSeenDate, " +
						"lastSeenDate) values (?, ?, ?, ?, ?, ?, ?) on " +
							"duplicate key update groupId = ?, userId = ?, " +
								"currentPath = ?, lastSeenDate = ?")) {

			int index = 1;

			preparedStatement.setLong(
				index++, counterRequestContext.getCompanyId());
			preparedStatement.setLong(
				index++, counterRequestContext.getGroupId());
			preparedStatement.setString(
				index++, counterRequestContext.getVisitorKey());
			preparedStatement.setLong(index++, counterRequestContext.getUserId());
			_setPath(preparedStatement, index++, counterRequestContext);
			preparedStatement.setTimestamp(index++, now);
			preparedStatement.setTimestamp(index++, now);
			preparedStatement.setLong(
				index++, counterRequestContext.getGroupId());
			preparedStatement.setLong(index++, counterRequestContext.getUserId());
			_setPath(preparedStatement, index++, counterRequestContext);
			preparedStatement.setTimestamp(index++, now);

			preparedStatement.executeUpdate();
		}
	}

	/** Bỏ visitor khỏi danh sách online, ví dụ khi đóng tab hoặc logout. */
	public void removeSession(CounterRequestContext counterRequestContext)
		throws Exception {

		_counterTableManager.ensureTables();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"delete from VEC_CounterOnlineSession where companyId = ? " +
					"and visitorKey = ?")) {

			preparedStatement.setLong(1, counterRequestContext.getCompanyId());
			preparedStatement.setString(
				2, counterRequestContext.getVisitorKey());

			preparedStatement.executeUpdate();
		}
	}

	private void _setPath(
			PreparedStatement preparedStatement, int index,
			CounterRequestContext counterRequestContext)
		throws Exception {

		String currentPath = counterRequestContext.getCurrentPath();

		if (currentPath == null) {
			preparedStatement.setNull(index, Types.VARCHAR);
		}
		else {
			preparedStatement.setString(index, currentPath);
		}
	}

	@Reference
	private CounterTableManager _counterTableManager;

}
