package vn.vec.custom.admin.webhook;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.TimeZone;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/conversations")
public class ConversationResource {

	/**
	 * GET /o/vec-webhook/conversations
	 *
	 * Query params:
	 *   search   — tìm theo contactId, conversationId hoặc nội dung tin nhắn
	 *   orderBy  — "asc" | "desc" (mặc định "desc")
	 *   page     — trang (mặc định 1)
	 *   pageSize — số item mỗi trang (mặc định 20)
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response listConversations(
		@QueryParam("search") String search,
		@QueryParam("orderBy") @DefaultValue("desc") String orderBy,
		@QueryParam("page") @DefaultValue("1") int page,
		@QueryParam("pageSize") @DefaultValue("20") int pageSize) {

		if (!_isSignedIn()) {
			return Response.status(Response.Status.UNAUTHORIZED)
				.entity("{\"error\":\"Unauthorized\"}")
				.build();
		}

		try {
			String order = "asc".equalsIgnoreCase(orderBy) ? "ASC" : "DESC";
			int offset = (page - 1) * pageSize;
			boolean hasSearch = search != null && !search.trim().isEmpty();

			// Dùng subquery cho messageContent để GROUP BY vẫn đếm đúng tổng tin nhắn
			String where =
				"WHERE source = 'tinytalk' " +
				"AND conversationId IS NOT NULL AND conversationId != '' " +
				"AND contactId IS NOT NULL AND contactId != '' " +
				_VALID_MESSAGE_WHERE +
				(hasSearch ?
					"AND (contactId LIKE ? OR conversationId LIKE ? " +
					"OR conversationId IN (" +
					"  SELECT DISTINCT conversationId FROM VEC_WebhookLog" +
					"  WHERE source = 'tinytalk' " +
					"  AND contactId IS NOT NULL AND contactId != '' " +
					_VALID_MESSAGE_WHERE +
					"  AND messageContent LIKE ?" +
					")) " : "");

			String countSql =
				"SELECT COUNT(DISTINCT conversationId) FROM VEC_WebhookLog " + where;

			String listSql =
				"SELECT conversationId, contactId, botId, " +
				"COUNT(*) AS messageCount, " +
				"MAX(createDate) AS lastMessageDate, " +
				"MIN(createDate) AS firstMessageDate " +
				"FROM VEC_WebhookLog " + where +
				"GROUP BY conversationId, contactId, botId " +
				"ORDER BY lastMessageDate " + order + " " +
				"LIMIT ? OFFSET ?";

			Connection con = DataAccess.getConnection();

			try {
				int total = 0;

				PreparedStatement countPs = con.prepareStatement(countSql);

				try {
					if (hasSearch) {
						String like = "%" + search.trim() + "%";
						countPs.setString(1, like);
						countPs.setString(2, like);
						countPs.setString(3, like);
					}

					ResultSet rs = countPs.executeQuery();

					if (rs.next()) {
						total = rs.getInt(1);
					}

					DataAccess.cleanUp(rs);
				}
				finally {
					DataAccess.cleanUp(countPs);
				}

				JSONArray items = JSONFactoryUtil.createJSONArray();

				PreparedStatement listPs = con.prepareStatement(listSql);

				try {
					int idx = 1;

					if (hasSearch) {
						String like = "%" + search.trim() + "%";
						listPs.setString(idx++, like);
						listPs.setString(idx++, like);
						listPs.setString(idx++, like);
					}

					listPs.setInt(idx++, pageSize);
					listPs.setInt(idx, offset);

					ResultSet rs = listPs.executeQuery();
					SimpleDateFormat sdf = _newDateFormat();

					while (rs.next()) {
						JSONObject item = JSONFactoryUtil.createJSONObject();

						item.put("conversationId", rs.getString("conversationId"));
						item.put("contactId", rs.getString("contactId"));
						item.put("botId", rs.getString("botId"));
						item.put("messageCount", rs.getInt("messageCount"));

						Timestamp last = rs.getTimestamp("lastMessageDate");
						Timestamp first = rs.getTimestamp("firstMessageDate");

						item.put("lastMessageDate", last != null ? sdf.format(last) : "");
						item.put("firstMessageDate", first != null ? sdf.format(first) : "");

						items.put(item);
					}

					DataAccess.cleanUp(rs);
				}
				finally {
					DataAccess.cleanUp(listPs);
				}

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("total", total);
				result.put("page", page);
				result.put("pageSize", pageSize);
				result.put("items", items);

				return _ok(result.toString());
			}
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error("Error listing conversations: " + e.getMessage(), e);

			return Response.serverError()
				.entity("{\"error\":\"Internal server error\"}")
				.build();
		}
	}

	/**
	 * GET /o/vec-webhook/conversations/{conversationId}/messages
	 *
	 * Query params:
	 *   page          — trang (mặc định 1)
	 *   pageSize      — số tin nhắn mỗi lần load (mặc định 20)
	 *   searchContent — nếu có, trả thêm matchOffset (vị trí tin nhắn khớp đầu tiên)
	 */
	@GET
	@Path("/{conversationId}/messages")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getMessages(
		@PathParam("conversationId") String conversationId,
		@QueryParam("page") @DefaultValue("1") int page,
		@QueryParam("pageSize") @DefaultValue("20") int pageSize,
		@QueryParam("searchContent") String searchContent) {

		if (!_isSignedIn()) {
			return Response.status(Response.Status.UNAUTHORIZED)
				.entity("{\"error\":\"Unauthorized\"}")
				.build();
		}

		try {
			boolean hasSearch = searchContent != null && !searchContent.trim().isEmpty();
			int offset = (page - 1) * pageSize;

			Connection con = DataAccess.getConnection();

			try {
				// Tổng số tin nhắn
				int total = 0;

				PreparedStatement countPs = con.prepareStatement(
					"SELECT COUNT(*) FROM VEC_WebhookLog " +
					"WHERE source = 'tinytalk' " +
					"AND conversationId = ? " +
					_VALID_MESSAGE_WHERE);

				try {
					countPs.setString(1, conversationId);

					ResultSet rs = countPs.executeQuery();

					if (rs.next()) {
						total = rs.getInt(1);
					}

					DataAccess.cleanUp(rs);
				}
				finally {
					DataAccess.cleanUp(countPs);
				}

				// Tìm vị trí (offset) của tin nhắn khớp đầu tiên
				int matchOffset = -1;

				if (hasSearch) {
					PreparedStatement matchPs = con.prepareStatement(
						"SELECT COUNT(*) FROM VEC_WebhookLog " +
						"WHERE source = 'tinytalk' " +
						"AND conversationId = ? " +
						_VALID_MESSAGE_WHERE +
						"AND createDate < (" +
						"  SELECT MIN(createDate) FROM VEC_WebhookLog " +
						"  WHERE source = 'tinytalk' " +
						"  AND conversationId = ? " +
						_VALID_MESSAGE_WHERE +
						"  AND messageContent LIKE ?" +
						")");

					try {
						matchPs.setString(1, conversationId);
						matchPs.setString(2, conversationId);
						matchPs.setString(3, "%" + searchContent.trim() + "%");

						ResultSet rs = matchPs.executeQuery();

						if (rs.next()) {
							matchOffset = rs.getInt(1);
						}

						DataAccess.cleanUp(rs);
					}
					finally {
						DataAccess.cleanUp(matchPs);
					}

					// Nếu page=1 và có match, tự động nhảy đến trang chứa match
					if (page == 1 && matchOffset >= 0) {
						offset = (matchOffset / pageSize) * pageSize;
					}
				}

				// Load tin nhắn
				JSONArray items = JSONFactoryUtil.createJSONArray();

				PreparedStatement ps = con.prepareStatement(
					"SELECT logId, eventType, messageRole, messageContent, contactId, createDate " +
					"FROM VEC_WebhookLog WHERE source = 'tinytalk' " +
					"AND conversationId = ? " +
					_VALID_MESSAGE_WHERE +
					"ORDER BY createDate ASC " +
					"LIMIT ? OFFSET ?");

				try {
					ps.setString(1, conversationId);
					ps.setInt(2, pageSize);
					ps.setInt(3, offset);

					ResultSet rs = ps.executeQuery();
					SimpleDateFormat sdf = _newDateFormat();

					while (rs.next()) {
						JSONObject item = JSONFactoryUtil.createJSONObject();

						item.put("logId", rs.getLong("logId"));
						item.put("eventType", rs.getString("eventType"));
						item.put("messageRole", rs.getString("messageRole"));
						item.put("messageContent", rs.getString("messageContent"));
						item.put("contactId", rs.getString("contactId"));

						Timestamp date = rs.getTimestamp("createDate");

						item.put("createDate", date != null ? sdf.format(date) : "");

						items.put(item);
					}

					DataAccess.cleanUp(rs);
				}
				finally {
					DataAccess.cleanUp(ps);
				}

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("conversationId", conversationId);
				result.put("total", total);
				result.put("page", (offset / pageSize) + 1);
				result.put("pageSize", pageSize);
				result.put("offset", offset);
				result.put("hasMore", (offset + pageSize) < total);
				result.put("hasBefore", offset > 0);
				result.put("matchOffset", matchOffset);
				result.put("items", items);

				return _ok(result.toString());
			}
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error("Error getting messages for " + conversationId + ": " + e.getMessage(), e);

			return Response.serverError()
				.entity("{\"error\":\"Internal server error\"}")
				.build();
		}
	}

	private boolean _isSignedIn() {
		try {
			String name = PrincipalThreadLocal.getName();
			return name != null && Long.parseLong(name) > 0;
		}
		catch (Exception e) {
			return false;
		}
	}

	private Response _ok(String json) {
		return Response.ok(json)
			.header("Access-Control-Allow-Origin", "*")
			.build();
	}

	private SimpleDateFormat _newDateFormat() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

		sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

		return sdf;
	}

	private static final Log _log = LogFactoryUtil.getLog(ConversationResource.class);

	private static final String _VALID_MESSAGE_WHERE =
		"AND messageRole IN ('user', 'assistant', 'agent') " +
		"AND messageContent IS NOT NULL AND TRIM(messageContent) != '' ";

}
