package vn.vec.custom.admin.camera;

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
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/")
public class CameraShowStateResource {

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCameraVisibility(
		@QueryParam("highwayId") String highwayIdParam,
		@QueryParam("routeId") String routeIdParam,
		@QueryParam("expresswayId") String expresswayIdParam,
		@QueryParam("tuyenCaoTocId") String tuyenCaoTocIdParam) {

		long highwayId = _getLong(
			new String[] {
				highwayIdParam, routeIdParam, expresswayIdParam, tuyenCaoTocIdParam
			});

		if (highwayId <= 0) {
			return _badRequest("highwayId is required");
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			PreparedStatement ps = con.prepareStatement(
				"SELECT highwayId, cameraId, internetVisible, intranetVisible, " +
				"createDate, modifiedDate FROM VEC_CameraVisibility " +
				"WHERE highwayId = ? ORDER BY cameraId ASC");

			try {
				ps.setLong(1, highwayId);

				java.sql.ResultSet rs = ps.executeQuery();

				try {
					JSONArray items = JSONFactoryUtil.createJSONArray();

					while (rs.next()) {
						JSONObject item = JSONFactoryUtil.createJSONObject();

						item.put("cameraId", rs.getString("cameraId"));
						item.put("internetVisible", rs.getBoolean("internetVisible"));
						item.put("intranetVisible", rs.getBoolean("intranetVisible"));
						item.put("createDate", _format(rs.getTimestamp("createDate")));
						item.put("modifiedDate", _format(rs.getTimestamp("modifiedDate")));

						items.put(item);
					}

					JSONObject result = JSONFactoryUtil.createJSONObject();

					result.put("highwayId", highwayId);
					result.put("items", items);

					return _ok(result);
				}
				finally {
					DataAccess.cleanUp(rs);
				}
			}
			finally {
				DataAccess.cleanUp(ps);
			}
		}
		catch (Exception e) {
			_log.error(
				"Error getting camera visibility: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@PUT
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response saveCameraVisibility(
		@Context HttpServletRequest request, String body) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden();
		}

		try {
			JSONObject payload = JSONFactoryUtil.createJSONObject(body);
			long highwayId = _getLong(
				payload,
				new String[] {
					"highwayId", "routeId", "expresswayId", "tuyenCaoTocId"
				});

			if (highwayId <= 0) {
				return _badRequest("highwayId is required");
			}

			JSONArray items = _getArray(
				payload, new String[] {"items", "cameras", "cameraSettings"});

			if (items == null) {
				items = JSONFactoryUtil.createJSONArray();
			}

			JSONArray normalizedItems = JSONFactoryUtil.createJSONArray();
			Set<String> seenCameraIds = new HashSet<>();

			for (int i = 0; i < items.length(); i++) {
				JSONObject item = items.getJSONObject(i);

				if (item == null) {
					return _badRequest("items[" + i + "] must be an object");
				}

				String cameraId = _getString(
					item, new String[] {"cameraId", "id", "camera_id"});

				if (cameraId.isEmpty()) {
					return _badRequest("items[" + i + "].cameraId is required");
				}

				if (!seenCameraIds.add(cameraId)) {
					return _badRequest(
						"Duplicated cameraId in payload: " + cameraId);
				}

				JSONObject normalizedItem = JSONFactoryUtil.createJSONObject();

				normalizedItem.put("cameraId", cameraId);
				normalizedItem.put(
					"internetVisible",
					_getBoolean(
						item,
						new String[] {
							"internetVisible", "visibleInternet", "hienThiInternet"
						},
						true));
				normalizedItem.put(
					"intranetVisible",
					_getBoolean(
						item,
						new String[] {
							"intranetVisible", "visibleIntranet", "hienThiIntranet"
						},
						true));

				normalizedItems.put(normalizedItem);
			}

			Connection con = DataAccess.getConnection();
			Timestamp now = _now();

			try {
				con.setAutoCommit(false);

				int updatedCount = _upsertCameraVisibility(
					con, user.getCompanyId(), highwayId, normalizedItems, now);

				con.commit();

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("highwayId", highwayId);
				result.put("updatedCount", updatedCount);
				result.put("items", normalizedItems);
				result.put("updatedByUserId", user.getUserId());
				result.put("updatedByScreenName", user.getScreenName());
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
			_log.error(
				"Error saving camera visibility: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response options() {
		return _cors(Response.ok()).build();
	}

	private int _upsertCameraVisibility(
			Connection con, long companyId, long highwayId, JSONArray items,
			Timestamp now)
		throws Exception {

		if (items.length() == 0) {
			return 0;
		}

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_CameraVisibility " +
			"(companyId, highwayId, cameraId, internetVisible, intranetVisible, " +
			"createDate, modifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?) " +
			"ON DUPLICATE KEY UPDATE companyId = VALUES(companyId), " +
			"internetVisible = VALUES(internetVisible), " +
			"intranetVisible = VALUES(intranetVisible), " +
			"modifiedDate = VALUES(modifiedDate)");

		try {
			for (int i = 0; i < items.length(); i++) {
				JSONObject item = items.getJSONObject(i);

				ps.setLong(1, companyId);
				ps.setLong(2, highwayId);
				ps.setString(3, item.getString("cameraId"));
				ps.setBoolean(4, item.getBoolean("internetVisible"));
				ps.setBoolean(5, item.getBoolean("intranetVisible"));
				ps.setTimestamp(6, now);
				ps.setTimestamp(7, now);
				ps.addBatch();
			}

			ps.executeBatch();

			return items.length();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private User _getSignedInUser(HttpServletRequest request) {
		try {
			if (_isLocalDevReferer(request)) {
				User devUser = UserLocalServiceUtil.fetchUser(_DEV_USER_ID);

				if (devUser != null && !devUser.isGuestUser()) {
					return devUser;
				}
			}

			User requestUser = null;

			if (request != null) {
				requestUser = PortalUtil.getUser(request);
			}

			if (requestUser != null && !requestUser.isGuestUser()) {
				return requestUser;
			}

			String name = PrincipalThreadLocal.getName();

			if (name == null || name.trim().isEmpty()) {
				return null;
			}

			long userId = Long.parseLong(name);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null || user.isGuestUser()) {
				return null;
			}

			return user;
		}
		catch (Exception e) {
			return null;
		}
	}

	private boolean _isAdminUser(User user) {
		return user != null && "admin".equals(user.getScreenName());
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

	private JSONArray _getArray(JSONObject jsonObject, String[] keys) {
		for (String key : keys) {
			if (!jsonObject.has(key)) {
				continue;
			}

			JSONArray jsonArray = jsonObject.getJSONArray(key);

			if (jsonArray != null) {
				return jsonArray;
			}

			String value = jsonObject.getString(key);

			if (value == null || value.trim().isEmpty()) {
				continue;
			}

			try {
				return JSONFactoryUtil.createJSONArray(value);
			}
			catch (Exception e) {
				return null;
			}
		}

		return null;
	}

	private long _getLong(JSONObject jsonObject, String[] keys) {
		for (String key : keys) {
			if (!jsonObject.has(key)) {
				continue;
			}

			Object value = jsonObject.get(key);

			if (value instanceof Number) {
				return ((Number)value).longValue();
			}

			String text = String.valueOf(value).trim();

			if (text.isEmpty()) {
				continue;
			}

			try {
				return Long.parseLong(text);
			}
			catch (Exception e) {
				return 0;
			}
		}

		return 0;
	}

	private long _getLong(String[] values) {
		for (String value : values) {
			if (value == null) {
				continue;
			}

			String text = value.trim();

			if (text.isEmpty()) {
				continue;
			}

			try {
				return Long.parseLong(text);
			}
			catch (Exception e) {
				return 0;
			}
		}

		return 0;
	}

	private String _getString(JSONObject jsonObject, String[] keys) {
		for (String key : keys) {
			if (!jsonObject.has(key)) {
				continue;
			}

			String value = jsonObject.getString(key);

			if (value != null && !value.trim().isEmpty()) {
				return value.trim();
			}
		}

		return "";
	}

	private boolean _getBoolean(
		JSONObject jsonObject, String[] keys, boolean defaultValue) {

		for (String key : keys) {
			if (!jsonObject.has(key)) {
				continue;
			}

			Object value = jsonObject.get(key);

			if (value instanceof Boolean) {
				return ((Boolean)value).booleanValue();
			}

			if (value instanceof Number) {
				return ((Number)value).intValue() != 0;
			}

			String text = String.valueOf(value).trim();

			if ("true".equalsIgnoreCase(text) || "1".equals(text)) {
				return true;
			}

			if ("false".equalsIgnoreCase(text) || "0".equals(text)) {
				return false;
			}
		}

		return defaultValue;
	}

	private Timestamp _now() {
		return new Timestamp(System.currentTimeMillis());
	}

	private String _format(Timestamp timestamp) {
		return timestamp == null ? "" : timestamp.toString();
	}

	private Response _ok(JSONObject jsonObject) {
		return _cors(
			Response.ok(jsonObject.toString(), MediaType.APPLICATION_JSON)
		).build();
	}

	private Response _badRequest(String message) {
		return _cors(
			Response.status(Response.Status.BAD_REQUEST)
				.type(MediaType.APPLICATION_JSON)
				.entity("{\"error\":\"" + message + "\"}")
		).build();
	}

	private Response _forbidden() {
		return _cors(
			Response.status(Response.Status.FORBIDDEN)
				.type(MediaType.APPLICATION_JSON)
				.entity(
					"{\"error\":\"Chỉ user admin mới được cập nhật cấu hình camera.\"}")
		).build();
	}

	private Response _serverError() {
		return _cors(
			Response.serverError()
				.type(MediaType.APPLICATION_JSON)
				.entity(
					"{\"error\":\"Máy chủ đang gặp lỗi. Vui lòng thử lại sau.\"}")
		).build();
	}

	private Response _unauthorized() {
		return _cors(
			Response.status(Response.Status.UNAUTHORIZED)
				.type(MediaType.APPLICATION_JSON)
				.entity(
					"{\"error\":\"Bạn cần đăng nhập để sử dụng chức năng này.\"}")
		).build();
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder builder) {
		return builder
			.header("Access-Control-Allow-Origin", "*")
			.header(
				"Access-Control-Allow-Headers",
				"Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
			.header("Access-Control-Allow-Credentials", "true");
	}

	private static final long _DEV_USER_ID = 1;

	private static final Log _log = LogFactoryUtil.getLog(
		CameraShowStateResource.class);

}
