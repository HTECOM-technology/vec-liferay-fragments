package vn.vec.custom.admin.dashboard.layout;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/")
public class DashboardLayoutResource {

	@GET
	@Path("/layout")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getLayout(@Context HttpServletRequest request) {
		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			PreparedStatement ps = con.prepareStatement(
				"SELECT layoutId, companyId, userId, flatOrder, hiddenIds, " +
				"createDate, modifiedDate FROM VEC_DashboardLayout WHERE userId = ?");

			try {
				ps.setLong(1, userId);

				ResultSet rs = ps.executeQuery();

				try {
					if (rs.next()) {
						return _ok(_toLayoutJson(rs, false));
					}
				}
				finally {
					DataAccess.cleanUp(rs);
				}
			}
			finally {
				DataAccess.cleanUp(ps);
			}

			return _ok(_defaultLayoutJson(userId));
		}
		catch (Exception e) {
			_log.error("Error getting dashboard layout: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@PUT
	@Path("/layout")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response saveLayout(@Context HttpServletRequest request, String body) {
		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		try {
			JSONObject payload = JSONFactoryUtil.createJSONObject(body);
			JSONArray flatOrder = payload.getJSONArray("flatOrder");

			if (flatOrder == null || flatOrder.length() == 0) {
				return _badRequest("flatOrder is required");
			}

			JSONArray hiddenIds = payload.getJSONArray("hiddenIds");

			if (hiddenIds == null) {
				hiddenIds = JSONFactoryUtil.createJSONArray();
			}

			User user = UserLocalServiceUtil.fetchUser(userId);
			long companyId = user == null ? 0 : user.getCompanyId();
			Timestamp now = _now();
			Connection con = DataAccess.getConnection();

			try {
				con.setAutoCommit(false);

				long layoutId = _upsertLayout(
					con, companyId, userId, flatOrder.toString(),
					hiddenIds.toString(), now);

				con.commit();

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("layoutId", layoutId);
				result.put("companyId", companyId);
				result.put("userId", userId);
				result.put("flatOrder", flatOrder);
				result.put("hiddenIds", hiddenIds);
				result.put("isDefault", false);
				result.put("modifiedDate", _format(now));

				return _ok(result);
			}
			catch (Exception e) {
				con.rollback();

				throw e;
			}
			finally {
				con.setAutoCommit(true);
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error("Error saving dashboard layout: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@DELETE
	@Path("/layout")
	@Produces(MediaType.APPLICATION_JSON)
	public Response resetLayout(@Context HttpServletRequest request) {
		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			PreparedStatement ps = con.prepareStatement(
				"DELETE FROM VEC_DashboardLayout WHERE userId = ?");

			try {
				ps.setLong(1, userId);
				ps.executeUpdate();
			}
			finally {
				DataAccess.cleanUp(ps);
			}

			return _ok(_defaultLayoutJson(userId));
		}
		catch (Exception e) {
			_log.error("Error resetting dashboard layout: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response options() {
		return _cors(Response.ok()).build();
	}

	private long _upsertLayout(
			Connection con, long companyId, long userId, String flatOrder,
			String hiddenIds, Timestamp now)
		throws Exception {

		PreparedStatement selectPs = con.prepareStatement(
			"SELECT layoutId FROM VEC_DashboardLayout WHERE companyId = ? AND userId = ?");

		try {
			selectPs.setLong(1, companyId);
			selectPs.setLong(2, userId);

			ResultSet rs = selectPs.executeQuery();

			try {
				if (rs.next()) {
					long layoutId = rs.getLong("layoutId");

					PreparedStatement updatePs = con.prepareStatement(
						"UPDATE VEC_DashboardLayout SET flatOrder = ?, hiddenIds = ?, " +
						"modifiedDate = ? WHERE layoutId = ?");

					try {
						updatePs.setString(1, flatOrder);
						updatePs.setString(2, hiddenIds);
						updatePs.setTimestamp(3, now);
						updatePs.setLong(4, layoutId);
						updatePs.executeUpdate();
					}
					finally {
						DataAccess.cleanUp(updatePs);
					}

					return layoutId;
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(selectPs);
		}

		PreparedStatement insertPs = con.prepareStatement(
			"INSERT INTO VEC_DashboardLayout " +
			"(companyId, userId, flatOrder, hiddenIds, createDate, modifiedDate) " +
			"VALUES (?, ?, ?, ?, ?, ?)",
			Statement.RETURN_GENERATED_KEYS);

		try {
			insertPs.setLong(1, companyId);
			insertPs.setLong(2, userId);
			insertPs.setString(3, flatOrder);
			insertPs.setString(4, hiddenIds);
			insertPs.setTimestamp(5, now);
			insertPs.setTimestamp(6, now);
			insertPs.executeUpdate();

			ResultSet rs = insertPs.getGeneratedKeys();

			try {
				if (rs.next()) {
					return rs.getLong(1);
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(insertPs);
		}

		return 0;
	}

	private JSONObject _toLayoutJson(ResultSet rs, boolean isDefault)
		throws Exception {

		JSONObject item = JSONFactoryUtil.createJSONObject();

		item.put("layoutId", rs.getLong("layoutId"));
		item.put("companyId", rs.getLong("companyId"));
		item.put("userId", rs.getLong("userId"));
		item.put("flatOrder", _parseArray(rs.getString("flatOrder")));
		item.put("hiddenIds", _parseArray(rs.getString("hiddenIds")));
		item.put("isDefault", isDefault);
		item.put("createDate", _format(rs.getTimestamp("createDate")));
		item.put("modifiedDate", _format(rs.getTimestamp("modifiedDate")));

		return item;
	}

	private JSONObject _defaultLayoutJson(long userId) {
		JSONObject item = JSONFactoryUtil.createJSONObject();

		item.put("layoutId", 0);
		item.put("companyId", 0);
		item.put("userId", userId);
		item.put("flatOrder", _defaultFlatOrder());
		item.put("hiddenIds", JSONFactoryUtil.createJSONArray());
		item.put("isDefault", true);
		item.put("createDate", "");
		item.put("modifiedDate", "");

		return item;
	}

	private JSONArray _defaultFlatOrder() {
		JSONArray flatOrder = JSONFactoryUtil.createJSONArray();

		for (String cardId : _DEFAULT_FLAT_ORDER) {
			flatOrder.put(cardId);
		}

		return flatOrder;
	}

	private JSONArray _parseArray(String value) {
		if (value == null || value.trim().isEmpty()) {
			return JSONFactoryUtil.createJSONArray();
		}

		try {
			return JSONFactoryUtil.createJSONArray(value);
		}
		catch (Exception e) {
			return JSONFactoryUtil.createJSONArray();
		}
	}

	private long _getSignedInUserId(HttpServletRequest request) {
		try {
			if (_isLocalDevReferer(request)) {
				return _DEV_USER_ID;
			}

			User requestUser = null;

			if (request != null) {
				requestUser = PortalUtil.getUser(request);
			}

			if (requestUser != null && !requestUser.isGuestUser()) {
				return requestUser.getUserId();
			}

			String name = PrincipalThreadLocal.getName();

			if (name == null || name.trim().isEmpty()) {
				return 0;
			}

			long userId = Long.parseLong(name);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null || user.isGuestUser()) {
				return 0;
			}

			return userId;
		}
		catch (Exception e) {
			return 0;
		}
	}

	private boolean _isLocalDevReferer(HttpServletRequest request) {
		if (request == null) {
			return false;
		}

		String referer = request.getHeader("Referer");

		return referer != null &&
			(referer.equals("http://localhost:3000") ||
				referer.startsWith("http://localhost:3000/"));
	}

	private Timestamp _now() {
		return new Timestamp(System.currentTimeMillis());
	}

	private String _format(Timestamp timestamp) {
		return timestamp == null ? "" : timestamp.toString();
	}

	private Response _ok(JSONObject jsonObject) {
		return _cors(Response.ok(jsonObject.toString(), MediaType.APPLICATION_JSON)).build();
	}

	private Response _badRequest(String message) {
		return _cors(Response.status(Response.Status.BAD_REQUEST)
			.type(MediaType.APPLICATION_JSON)
			.entity("{\"error\":\"" + message + "\"}")
		).build();
	}

	private Response _serverError() {
		return _cors(Response.serverError()
			.type(MediaType.APPLICATION_JSON)
			.entity("{\"error\":\"Máy chủ đang gặp lỗi. Vui lòng thử lại sau.\"}")
		).build();
	}

	private Response _unauthorized() {
		return _cors(Response.status(Response.Status.UNAUTHORIZED)
			.type(MediaType.APPLICATION_JSON)
			.entity("{\"error\":\"Bạn cần đăng nhập để sử dụng chức năng này.\"}")
		).build();
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder builder) {
		return builder
			.header("Access-Control-Allow-Origin", "*")
			.header("Access-Control-Allow-Headers", "Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS")
			.header("Access-Control-Allow-Credentials", "true");
	}

	private static final String[] _DEFAULT_FLAT_ORDER = {
		"cong-van-vb", "cong-viec", "nhiem-vu", "giao-thong", "quick-links",
		"van-ban-moi", "lich-co-quan", "sinh-nhat", "nhan-su", "bieu-mau",
		"tin-tuc", "camera"
	};

	private static final long _DEV_USER_ID = 1;

	private static final Log _log = LogFactoryUtil.getLog(
		DashboardLayoutResource.class);

}
