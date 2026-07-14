package vn.vec.custom.admin.HookTollReconciliation.persistence;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.util.InfrastructureUtil;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import java.time.LocalDate;
import java.time.ZoneId;

import java.util.Calendar;
import java.util.TimeZone;

import javax.sql.DataSource;

import org.osgi.service.component.annotations.Component;

/** JDBC query cho màn hình tổng hợp Đối soát thu phí. */
@Component(service = TollReconciliationQueryRepository.class)
public class TollReconciliationQueryRepository {

	public JSONObject getDashboard(
			LocalDate fromDate, LocalDate toDate, int tableLimit)
		throws Exception {

		try (Connection connection = _getConnection()) {
			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put(
				"traffic", _getTraffic(connection, fromDate, toDate));
			result.put(
				"revenue", _getRevenue(connection, fromDate, toDate));
			result.put("incidents", _getIncidents(connection, tableLimit));
			result.put("events", _getEvents(connection, tableLimit));
			result.put("errors", _getErrors(connection, tableLimit));

			return result;
		}
	}

	private Connection _getConnection() throws Exception {
		DataSource dataSource = InfrastructureUtil.getDataSource();

		if (dataSource == null) {
			throw new IllegalStateException("Liferay data source is not available");
		}

		return dataSource.getConnection();
	}

	private JSONArray _getErrors(Connection connection, int limit)
		throws Exception {

		String sql =
			"select id, external_id, error_id, request_name, error_type, " +
				"error_description, priority, route_code, route_name, " +
				"station_code, station_name, occurred_at, src_created_at, " +
				"src_updated_at, src_created_by, status, note, " +
				"ingest_updated_at from vec_recon_error " +
			"order by occurred_at desc, id desc limit ?";

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				sql)) {

			preparedStatement.setInt(1, limit);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				JSONArray items = JSONFactoryUtil.createJSONArray();

				while (resultSet.next()) {
					JSONObject item = _commonItem(resultSet);

					item.put("errorId", resultSet.getString("error_id"));
					item.put("requestName", resultSet.getString("request_name"));
					item.put("errorType", resultSet.getString("error_type"));
					item.put(
						"errorDescription",
						resultSet.getString("error_description"));
					item.put("priority", resultSet.getString("priority"));

					items.put(item);
				}

				return items;
			}
		}
	}

	private JSONArray _getEvents(Connection connection, int limit)
		throws Exception {

		String sql =
			"select id, external_id, event_id, event_name, event_type, " +
				"event_content, route_code, route_name, station_code, " +
				"station_name, occurred_at, src_created_at, src_updated_at, " +
				"src_created_by, status, note, ingest_updated_at " +
			"from vec_recon_event order by occurred_at desc, id desc limit ?";

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				sql)) {

			preparedStatement.setInt(1, limit);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				JSONArray items = JSONFactoryUtil.createJSONArray();

				while (resultSet.next()) {
					JSONObject item = _commonItem(resultSet);

					item.put("eventId", resultSet.getString("event_id"));
					item.put("eventName", resultSet.getString("event_name"));
					item.put("eventType", resultSet.getString("event_type"));
					item.put("eventContent", resultSet.getString("event_content"));

					items.put(item);
				}

				return items;
			}
		}
	}

	private JSONArray _getIncidents(Connection connection, int limit)
		throws Exception {

		String sql =
			"select id, external_id, incident_id, incident_type, " +
				"incident_title, incident_description, route_code, route_name, " +
				"station_code, station_name, occurred_at, src_created_at, " +
				"src_updated_at, src_created_by, status, note, resolved_at, " +
				"resolution_note, ingest_updated_at from vec_recon_incident " +
			"order by occurred_at desc, id desc limit ?";

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				sql)) {

			preparedStatement.setInt(1, limit);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				JSONArray items = JSONFactoryUtil.createJSONArray();

				while (resultSet.next()) {
					JSONObject item = _commonItem(resultSet);

					item.put("incidentId", resultSet.getString("incident_id"));
					item.put(
						"incidentType", resultSet.getString("incident_type"));
					item.put(
						"incidentTitle", resultSet.getString("incident_title"));
					item.put(
						"incidentDescription",
						resultSet.getString("incident_description"));
					_putTimestamp(item, "resolvedAt", resultSet, "resolved_at");
					item.put(
						"resolutionNote", resultSet.getString("resolution_note"));

					items.put(item);
				}

				return items;
			}
		}
	}

	private JSONArray _getRevenue(
			Connection connection, LocalDate fromDate, LocalDate toDate)
		throws Exception {

		String sql =
			"select revenue_date, sum(amount) as total_amount " +
				"from vec_recon_revenue where revenue_date between ? and ? " +
			"group by revenue_date order by revenue_date asc";

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				sql)) {

			preparedStatement.setDate(1, Date.valueOf(fromDate));
			preparedStatement.setDate(2, Date.valueOf(toDate));

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				JSONArray items = JSONFactoryUtil.createJSONArray();

				while (resultSet.next()) {
					JSONObject item = JSONFactoryUtil.createJSONObject();

					item.put(
						"date", resultSet.getDate("revenue_date").toString());
					item.put(
						"value",
						resultSet.getBigDecimal("total_amount").doubleValue());

					items.put(item);
				}

				return items;
			}
		}
	}

	private JSONArray _getTraffic(
			Connection connection, LocalDate fromDate, LocalDate toDate)
		throws Exception {

		String sql =
			"select traffic_date, sum(vehicle_count) as total_vehicle_count " +
				"from vec_recon_traffic where traffic_date between ? and ? " +
			"group by traffic_date order by traffic_date asc";

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				sql)) {

			preparedStatement.setDate(1, Date.valueOf(fromDate));
			preparedStatement.setDate(2, Date.valueOf(toDate));

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				JSONArray items = JSONFactoryUtil.createJSONArray();

				while (resultSet.next()) {
					JSONObject item = JSONFactoryUtil.createJSONObject();

					item.put(
						"date", resultSet.getDate("traffic_date").toString());
					item.put(
						"value", resultSet.getLong("total_vehicle_count"));

					items.put(item);
				}

				return items;
			}
		}
	}

	private JSONObject _commonItem(ResultSet resultSet) throws Exception {
		JSONObject item = JSONFactoryUtil.createJSONObject();

		item.put("id", resultSet.getLong("id"));
		item.put("externalId", resultSet.getString("external_id"));
		item.put("routeCode", resultSet.getString("route_code"));
		item.put("routeName", resultSet.getString("route_name"));
		item.put("stationCode", resultSet.getString("station_code"));
		item.put("stationName", resultSet.getString("station_name"));
		item.put("createdBy", resultSet.getString("src_created_by"));
		item.put("status", resultSet.getString("status"));
		item.put("note", resultSet.getString("note"));

		_putTimestamp(item, "occurredAt", resultSet, "occurred_at");
		_putTimestamp(item, "createdAt", resultSet, "src_created_at");
		_putTimestamp(item, "updatedAt", resultSet, "src_updated_at");

		if (!item.has("updatedAt")) {
			_putTimestamp(
				item, "updatedAt", resultSet, "ingest_updated_at");
		}

		return item;
	}

	private void _putTimestamp(
			JSONObject jsonObject, String jsonKey, ResultSet resultSet,
			String columnName)
		throws Exception {

		Timestamp timestamp = resultSet.getTimestamp(columnName, _utcCalendar());

		if (timestamp == null) {
			return;
		}

		jsonObject.put(
			jsonKey,
			timestamp.toInstant().atZone(_DISPLAY_ZONE_ID).toOffsetDateTime(
			).toString());
	}

	private Calendar _utcCalendar() {
		return Calendar.getInstance(TimeZone.getTimeZone("UTC"));
	}

	private static final ZoneId _DISPLAY_ZONE_ID = ZoneId.of(
		"Asia/Ho_Chi_Minh");
}
