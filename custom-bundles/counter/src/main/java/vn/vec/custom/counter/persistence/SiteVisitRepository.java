package vn.vec.custom.counter.persistence;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import java.time.LocalDate;
import java.time.ZoneId;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.counter.constants.CounterConstants;
import vn.vec.custom.counter.model.DailyVisit;
import vn.vec.custom.counter.model.SiteVisitSummary;
import vn.vec.custom.counter.service.CounterRequestContext;

/**
 * Counter 1: lượt truy cập website.
 *
 * <p>
 * Số liệu được tổng hợp theo ngày ở {@code VEC_CounterSiteVisit}; chi tiết từng
 * visitor trong ngày nằm ở {@code VEC_CounterSiteVisitor} và chỉ dùng để đếm
 * unique visitor cũng như chặn tăng ảo khi reload trang.
 * </p>
 */
@Component(service = SiteVisitRepository.class)
public class SiteVisitRepository {

	public int deleteVisitorsBefore(LocalDate localDate) throws Exception {
		_counterTableManager.ensureTables();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"delete from VEC_CounterSiteVisitor where visitDate < ?")) {

			preparedStatement.setDate(1, java.sql.Date.valueOf(localDate));

			return preparedStatement.executeUpdate();
		}
	}

	public List<DailyVisit> getDailyVisits(
			long companyId, long groupId, LocalDate startDate,
			LocalDate endDate)
		throws Exception {

		_counterTableManager.ensureTables();

		StringBuilder sql = new StringBuilder(
			"select visitDate, sum(totalVisits) as totalVisits, " +
				"sum(uniqueVisitors) as uniqueVisitors " +
					"from VEC_CounterSiteVisit where companyId = ? " +
						"and visitDate >= ? and visitDate <= ?");

		if (groupId > 0) {
			sql.append(" and groupId = ?");
		}

		sql.append(" group by visitDate order by visitDate asc");

		List<DailyVisit> dailyVisits = new ArrayList<>();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql.toString())) {

			int index = 1;

			preparedStatement.setLong(index++, companyId);
			preparedStatement.setDate(index++, java.sql.Date.valueOf(startDate));
			preparedStatement.setDate(index++, java.sql.Date.valueOf(endDate));

			if (groupId > 0) {
				preparedStatement.setLong(index++, groupId);
			}

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				while (resultSet.next()) {
					java.sql.Date visitDate = resultSet.getDate("visitDate");

					dailyVisits.add(
						new DailyVisit(
							(visitDate == null) ? null : visitDate.toString(),
							resultSet.getLong("totalVisits"),
							resultSet.getLong("uniqueVisitors")));
				}
			}
		}

		return dailyVisits;
	}

	/**
	 * Tổng hợp lượt truy cập. {@code groupId <= 0} nghĩa là tính trên toàn bộ
	 * site của company.
	 */
	public SiteVisitSummary getSummary(long companyId, long groupId)
		throws Exception {

		_counterTableManager.ensureTables();

		LocalDate today = LocalDate.now();

		StringBuilder sql = new StringBuilder(
			"select coalesce(sum(totalVisits), 0) as totalVisits, " +
				"coalesce(sum(uniqueVisitors), 0) as uniqueVisitors, " +
				"coalesce(sum(case when visitDate = ? then totalVisits " +
					"else 0 end), 0) as visitsToday, " +
				"coalesce(sum(case when visitDate = ? then uniqueVisitors " +
					"else 0 end), 0) as uniqueVisitorsToday, " +
				"coalesce(sum(case when visitDate = ? then totalVisits " +
					"else 0 end), 0) as visitsYesterday, " +
				"coalesce(sum(case when visitDate >= ? then totalVisits " +
					"else 0 end), 0) as visitsThisWeek, " +
				"coalesce(sum(case when visitDate >= ? then totalVisits " +
					"else 0 end), 0) as visitsThisMonth, " +
				"coalesce(sum(case when visitDate >= ? then totalVisits " +
					"else 0 end), 0) as visitsThisYear, " +
				"min(visitDate) as firstVisitDate " +
					"from VEC_CounterSiteVisit where companyId = ?");

		if (groupId > 0) {
			sql.append(" and groupId = ?");
		}

		SiteVisitSummary siteVisitSummary = new SiteVisitSummary();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql.toString())) {

			int index = 1;

			preparedStatement.setDate(index++, java.sql.Date.valueOf(today));
			preparedStatement.setDate(index++, java.sql.Date.valueOf(today));
			preparedStatement.setDate(
				index++, java.sql.Date.valueOf(today.minusDays(1)));
			preparedStatement.setDate(
				index++,
				java.sql.Date.valueOf(
					today.minusDays(today.getDayOfWeek().getValue() - 1)));
			preparedStatement.setDate(
				index++, java.sql.Date.valueOf(today.withDayOfMonth(1)));
			preparedStatement.setDate(
				index++, java.sql.Date.valueOf(today.withDayOfYear(1)));
			preparedStatement.setLong(index++, companyId);

			if (groupId > 0) {
				preparedStatement.setLong(index++, groupId);
			}

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				if (resultSet.next()) {
					siteVisitSummary.setTotalVisits(
						resultSet.getLong("totalVisits"));
					siteVisitSummary.setUniqueVisitors(
						resultSet.getLong("uniqueVisitors"));
					siteVisitSummary.setTotalVisitsToday(
						resultSet.getLong("visitsToday"));
					siteVisitSummary.setUniqueVisitorsToday(
						resultSet.getLong("uniqueVisitorsToday"));
					siteVisitSummary.setTotalVisitsYesterday(
						resultSet.getLong("visitsYesterday"));
					siteVisitSummary.setTotalVisitsThisWeek(
						resultSet.getLong("visitsThisWeek"));
					siteVisitSummary.setTotalVisitsThisMonth(
						resultSet.getLong("visitsThisMonth"));
					siteVisitSummary.setTotalVisitsThisYear(
						resultSet.getLong("visitsThisYear"));

					java.sql.Date firstVisitDate = resultSet.getDate(
						"firstVisitDate");

					if (firstVisitDate != null) {
						siteVisitSummary.setFirstVisitDate(
							new Date(firstVisitDate.getTime()));
					}
				}
			}
		}

		return siteVisitSummary;
	}

	/**
	 * Ghi nhận một lượt truy cập.
	 *
	 * @return {@code true} nếu lượt truy cập được tính, {@code false} nếu bị
	 *         chặn bởi ngưỡng chống tăng ảo
	 *         ({@link CounterConstants#SITE_VISIT_THROTTLE_SECONDS})
	 */
	public boolean recordVisit(CounterRequestContext counterRequestContext)
		throws Exception {

		_counterTableManager.ensureTables();

		Date now = new Date();

		LocalDate visitDate = now.toInstant(
		).atZone(
			ZoneId.systemDefault()
		).toLocalDate();

		try (Connection connection = DataAccess.getConnection()) {
			boolean newVisitor = _insertVisitor(
				connection, counterRequestContext, visitDate, now);
			boolean counted = newVisitor;

			if (!newVisitor) {
				counted = _touchVisitor(
					connection, counterRequestContext, visitDate, now);
			}

			if (!counted) {
				return false;
			}

			_upsertDailyVisit(
				connection, counterRequestContext, visitDate, now,
				newVisitor ? 1 : 0);

			return true;
		}
	}

	private boolean _insertVisitor(
			Connection connection,
			CounterRequestContext counterRequestContext, LocalDate visitDate,
			Date now)
		throws Exception {

		// "insert ignore" để hai request song song của cùng visitor không làm
		// hỏng unique key; dòng thứ hai trả về 0 row.

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				"insert ignore into VEC_CounterSiteVisitor (companyId, " +
					"groupId, visitDate, visitorKey, userId, visits, " +
						"firstVisitDate, lastVisitDate) values " +
							"(?, ?, ?, ?, ?, 1, ?, ?)")) {

			int index = 1;

			preparedStatement.setLong(
				index++, counterRequestContext.getCompanyId());
			preparedStatement.setLong(
				index++, counterRequestContext.getGroupId());
			preparedStatement.setDate(index++, java.sql.Date.valueOf(visitDate));
			preparedStatement.setString(
				index++, counterRequestContext.getVisitorKey());
			preparedStatement.setLong(index++, counterRequestContext.getUserId());
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));

			return preparedStatement.executeUpdate() > 0;
		}
	}

	private boolean _touchVisitor(
			Connection connection,
			CounterRequestContext counterRequestContext, LocalDate visitDate,
			Date now)
		throws Exception {

		long thresholdTime =
			now.getTime() -
				(CounterConstants.SITE_VISIT_THROTTLE_SECONDS * 1000L);

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				"update VEC_CounterSiteVisitor set visits = visits + 1, " +
					"lastVisitDate = ?, userId = ? where companyId = ? and " +
						"groupId = ? and visitDate = ? and visitorKey = ? " +
							"and (lastVisitDate is null or " +
								"lastVisitDate <= ?)")) {

			int index = 1;

			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setLong(index++, counterRequestContext.getUserId());
			preparedStatement.setLong(
				index++, counterRequestContext.getCompanyId());
			preparedStatement.setLong(
				index++, counterRequestContext.getGroupId());
			preparedStatement.setDate(index++, java.sql.Date.valueOf(visitDate));
			preparedStatement.setString(
				index++, counterRequestContext.getVisitorKey());
			preparedStatement.setTimestamp(
				index++, new Timestamp(thresholdTime));

			return preparedStatement.executeUpdate() > 0;
		}
	}

	private void _upsertDailyVisit(
			Connection connection,
			CounterRequestContext counterRequestContext, LocalDate visitDate,
			Date now, int uniqueVisitorDelta)
		throws Exception {

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				"insert into VEC_CounterSiteVisit (companyId, groupId, " +
					"visitDate, totalVisits, uniqueVisitors, createDate, " +
						"modifiedDate) values (?, ?, ?, 1, ?, ?, ?) on " +
							"duplicate key update totalVisits = " +
								"totalVisits + 1, uniqueVisitors = " +
									"uniqueVisitors + ?, modifiedDate = ?")) {

			int index = 1;

			preparedStatement.setLong(
				index++, counterRequestContext.getCompanyId());
			preparedStatement.setLong(
				index++, counterRequestContext.getGroupId());
			preparedStatement.setDate(index++, java.sql.Date.valueOf(visitDate));
			preparedStatement.setInt(index++, uniqueVisitorDelta);
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setInt(index++, uniqueVisitorDelta);
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));

			preparedStatement.executeUpdate();
		}
	}

	@Reference
	private CounterTableManager _counterTableManager;

}
