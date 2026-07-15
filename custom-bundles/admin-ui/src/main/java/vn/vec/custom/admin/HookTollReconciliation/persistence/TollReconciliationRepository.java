package vn.vec.custom.admin.HookTollReconciliation.persistence;

import com.liferay.portal.kernel.util.InfrastructureUtil;

import java.math.BigDecimal;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Timestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.HookTollReconciliation.model.HookPayload;

/**
 * JDBC upsert cho 5 bảng đối soát.
 *
 * <p>Tất cả OffsetDateTime được đổi sang Instant/UTC trước khi bind vào
 * DATETIME. Khi đọc để hiển thị, ứng dụng phải đổi UTC về +07:00.</p>
 */
@Component(service = TollReconciliationRepository.class)
public class TollReconciliationRepository {

	public String persist(HookPayload payload, String transId) throws Exception {
		Definition definition = _DEFINITIONS.get(payload.getString("record_type"));

		if (definition == null) {
			throw new IllegalArgumentException("Unsupported record_type");
		}

		if ("delete".equals(payload.getString("action"))) {
			_delete(definition, payload);

			return "deleted";
		}

		return _upsert(definition, payload, transId);
	}

	private String _buildUpsertSql(Definition definition) {
		List<Column> columns = new ArrayList<>(_COMMON_COLUMNS);

		columns.addAll(definition.columns);

		StringBuilder sql = new StringBuilder("insert into ");

		sql.append(definition.tableName);
		sql.append(" (");

		for (int i = 0; i < columns.size(); i++) {
			if (i > 0) {
				sql.append(", ");
			}

			sql.append(columns.get(i).databaseName);
		}

		sql.append(", last_trans_id) values (");

		for (int i = 0; i < columns.size() + 1; i++) {
			if (i > 0) {
				sql.append(", ");
			}

			sql.append('?');
		}

		sql.append(") on duplicate key update id = LAST_INSERT_ID(id)");

		for (int i = 2; i < columns.size(); i++) {
			sql.append(", ");
			sql.append(columns.get(i).databaseName);
			sql.append(" = VALUES(");
			sql.append(columns.get(i).databaseName);
			sql.append(')');
		}

		sql.append(", ingest_updated_at = CURRENT_TIMESTAMP");
		sql.append(", last_trans_id = VALUES(last_trans_id)");

		return sql.toString();
	}

	private void _delete(Definition definition, HookPayload payload)
		throws Exception {

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				"delete from " + definition.tableName +
					" where source_system = ? and external_id = ?")) {

			preparedStatement.setString(1, payload.getString("source_system"));
			preparedStatement.setString(2, payload.getString("external_id"));
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

	private String _upsert(
			Definition definition, HookPayload payload, String transId)
		throws Exception {

		List<Column> columns = new ArrayList<>(_COMMON_COLUMNS);

		columns.addAll(definition.columns);

		try (Connection connection = _getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				_buildUpsertSql(definition))) {

			int index = 1;

			for (Column column : columns) {
				_bind(
					preparedStatement, index++, column.type,
					payload.getValues().get(column.payloadName));
			}

			preparedStatement.setString(index, transId);

			int affectedRows = preparedStatement.executeUpdate();

			return (affectedRows == 1) ? "created" : "updated";
		}
	}

	private void _bind(
		PreparedStatement preparedStatement, int index, ColumnType type,
		Object value) throws Exception {

		if (value == null) {
			preparedStatement.setObject(index, null);

			return;
		}

		switch (type) {
			case DATE:
				preparedStatement.setDate(index, Date.valueOf((LocalDate)value));

				break;
			case DECIMAL:
				preparedStatement.setBigDecimal(index, (BigDecimal)value);

				break;
			case INTEGER:
				preparedStatement.setInt(index, ((Integer)value).intValue());

				break;
			case STRING:
				preparedStatement.setString(index, (String)value);

				break;
			case TIMESTAMP:
				preparedStatement.setTimestamp(
					index, Timestamp.from(((OffsetDateTime)value).toInstant()),
					_utcCalendar());

				break;
			default:
				throw new IllegalArgumentException("Unsupported column type");
		}
	}

	private java.util.Calendar _utcCalendar() {
		return java.util.Calendar.getInstance(
			java.util.TimeZone.getTimeZone("UTC"));
	}

	private static Column _column(
		String databaseName, String payloadName, ColumnType type) {

		return new Column(databaseName, payloadName, type);
	}

	private static final List<Column> _COMMON_COLUMNS = Collections.unmodifiableList(
		Arrays.asList(
			_column("source_system", "source_system", ColumnType.STRING),
			_column("external_id", "external_id", ColumnType.STRING),
			_column("record_type", "record_type", ColumnType.STRING),
			_column("action", "action", ColumnType.STRING),
			_column("route_code", "route_code", ColumnType.STRING),
			_column("route_name", "route_name", ColumnType.STRING),
			_column("station_code", "station_code", ColumnType.STRING),
			_column("station_name", "station_name", ColumnType.STRING),
			_column("occurred_at", "occurred_at", ColumnType.TIMESTAMP),
			_column("src_created_at", "created_at", ColumnType.TIMESTAMP),
			_column("src_updated_at", "updated_at", ColumnType.TIMESTAMP),
			_column("src_created_by", "created_by", ColumnType.STRING),
			_column("status", "status", ColumnType.STRING),
			_column("note", "note", ColumnType.STRING)));

	private static final Map<String, Definition> _DEFINITIONS;

	static {
		Map<String, Definition> definitions = new LinkedHashMap<>();

		definitions.put(
			"traffic",
			new Definition(
				"vec_recon_traffic",
				Arrays.asList(
					_column("traffic_date", "traffic_date", ColumnType.DATE),
					_column("vehicle_count", "vehicle_count", ColumnType.INTEGER),
					_column("vehicle_type", "vehicle_type", ColumnType.STRING),
					_column("lane_code", "lane_code", ColumnType.STRING),
					_column("shift_code", "shift_code", ColumnType.STRING),
					_column("from_time", "from_time", ColumnType.TIMESTAMP),
					_column("to_time", "to_time", ColumnType.TIMESTAMP))));
		definitions.put(
			"revenue",
			new Definition(
				"vec_recon_revenue",
				Arrays.asList(
					_column("revenue_date", "revenue_date", ColumnType.DATE),
					_column("amount", "amount", ColumnType.DECIMAL),
					_column("currency", "currency", ColumnType.STRING),
					_column(
						"transaction_count", "transaction_count", ColumnType.INTEGER),
					_column("payment_method", "payment_method", ColumnType.STRING),
					_column(
						"reconciliation_status", "reconciliation_status",
						ColumnType.STRING))));
		definitions.put(
			"incident",
			new Definition(
				"vec_recon_incident",
				Arrays.asList(
					_column("incident_id", "incident_id", ColumnType.STRING),
					_column("incident_type", "incident_type", ColumnType.STRING),
					_column("incident_title", "incident_title", ColumnType.STRING),
					_column(
						"incident_description", "incident_description",
						ColumnType.STRING),
					_column("resolved_at", "resolved_at", ColumnType.TIMESTAMP),
					_column("resolution_note", "resolution_note", ColumnType.STRING))));
		definitions.put(
			"event",
			new Definition(
				"vec_recon_event",
				Arrays.asList(
					_column("event_id", "event_id", ColumnType.STRING),
					_column("event_name", "event_name", ColumnType.STRING),
					_column("event_type", "event_type", ColumnType.STRING),
					_column("event_content", "event_content", ColumnType.STRING))));
		definitions.put(
			"error",
			new Definition(
				"vec_recon_error",
				Arrays.asList(
					_column("error_id", "error_id", ColumnType.STRING),
					_column("request_name", "request_name", ColumnType.STRING),
					_column("error_type", "error_type", ColumnType.STRING),
					_column(
						"error_description", "error_description", ColumnType.STRING),
					_column("priority", "priority", ColumnType.STRING))));

		_DEFINITIONS = Collections.unmodifiableMap(definitions);
	}

	private static class Column {

		private Column(
			String databaseName, String payloadName, ColumnType type) {

			this.databaseName = databaseName;
			this.payloadName = payloadName;
			this.type = type;
		}

		private final String databaseName;
		private final String payloadName;
		private final ColumnType type;
	}

	private enum ColumnType {
		DATE,
		DECIMAL,
		INTEGER,
		STRING,
		TIMESTAMP
	}

	private static class Definition {

		private Definition(String tableName, List<Column> columns) {
			this.tableName = tableName;
			this.columns = Collections.unmodifiableList(columns);
		}

		private final List<Column> columns;
		private final String tableName;
	}
}
