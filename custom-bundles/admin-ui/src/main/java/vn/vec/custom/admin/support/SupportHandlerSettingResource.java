package vn.vec.custom.admin.support;

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

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
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
public class SupportHandlerSettingResource {

	@GET
	@Path("/configurations")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getConfigurations(@Context HttpServletRequest request) {
		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden();
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("items", _readConfigurations(con, user.getCompanyId()));

			return _ok(result);
		}
		catch (Exception e) {
			_log.error(
				"Error getting support handler configurations: " + e.getMessage(),
				e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@GET
	@Path("/assignment")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAssignment(
		@Context HttpServletRequest request,
		@QueryParam("processKey") String processKey,
		@QueryParam("requestTypeKey") String requestTypeKey) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		String normalizedProcessKey = _trim(processKey);
		String normalizedRequestTypeKey = _trim(requestTypeKey);

		if (!_isValidRequestType(
				normalizedProcessKey, normalizedRequestTypeKey)) {

			return _badRequest("Loại yêu cầu hỗ trợ không hợp lệ.");
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			JSONArray configurations = _readConfigurations(
				con, user.getCompanyId());
			JSONObject assignment = null;

			for (int i = 0; i < configurations.length(); i++) {
				JSONObject item = configurations.getJSONObject(i);

				if (normalizedProcessKey.equals(item.getString("processKey")) &&
					normalizedRequestTypeKey.equals(
						item.getString("requestTypeKey"))) {

					assignment = item;

					break;
				}
			}

			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("configured", assignment != null);
			result.put("processKey", normalizedProcessKey);
			result.put("requestTypeKey", normalizedRequestTypeKey);
			result.put(
				"userIds",
				assignment == null ? JSONFactoryUtil.createJSONArray() :
					assignment.getJSONArray("userIds"));
			result.put(
				"users",
				assignment == null ? JSONFactoryUtil.createJSONArray() :
					assignment.getJSONArray("users"));

			return _ok(result);
		}
		catch (Exception e) {
			_log.error(
				"Error getting support handler assignment: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@GET
	@Path("/organizations")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getOrganizations(
		@Context HttpServletRequest request,
		@QueryParam("parentOrganizationId") long parentOrganizationId) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden();
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			PreparedStatement ps = con.prepareStatement(
				"SELECT organizationId, parentOrganizationId, name, type_ " +
				"FROM Organization_ WHERE companyId = ? " +
				"AND parentOrganizationId = ? ORDER BY name ASC");

			try {
				ps.setLong(1, user.getCompanyId());
				ps.setLong(2, Math.max(parentOrganizationId, 0));

				ResultSet rs = ps.executeQuery();
				JSONArray items = JSONFactoryUtil.createJSONArray();

				try {
					while (rs.next()) {
						JSONObject item = JSONFactoryUtil.createJSONObject();

						item.put(
							"organizationId", rs.getLong("organizationId"));
						item.put(
							"parentOrganizationId",
							rs.getLong("parentOrganizationId"));
						item.put("name", rs.getString("name"));
						item.put("type", rs.getString("type_"));

						items.put(item);
					}
				}
				finally {
					DataAccess.cleanUp(rs);
				}

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("items", items);

				return _ok(result);
			}
			finally {
				DataAccess.cleanUp(ps);
			}
		}
		catch (Exception e) {
			_log.error(
				"Error getting organizations for support settings: " +
					e.getMessage(),
				e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@GET
	@Path("/users")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUsers(
		@Context HttpServletRequest request,
		@QueryParam("organizationId") long organizationId,
		@QueryParam("departmentId") long departmentId) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden();
		}

		if (organizationId <= 0 || departmentId <= 0) {
			return _badRequest("Đơn vị và phòng ban là bắt buộc.");
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			if (!_isValidOrganizationSelection(
					con, user.getCompanyId(), organizationId, departmentId)) {

				return _badRequest("Đơn vị hoặc phòng ban không hợp lệ.");
			}

			PreparedStatement ps = con.prepareStatement(
				"SELECT DISTINCT u.userId, u.screenName, u.emailAddress, " +
					"u.firstName, u.middleName, u.lastName FROM User_ u " +
					"INNER JOIN Users_Orgs uo ON u.userId = uo.userId " +
					"INNER JOIN Organization_ memberOrganization ON " +
					"uo.organizationId = memberOrganization.organizationId " +
					"WHERE u.companyId = ? AND memberOrganization.companyId = ? " +
					"AND u.status = 0 AND (memberOrganization.organizationId = ? " +
					"OR memberOrganization.treePath LIKE ?) " +
					"ORDER BY u.lastName ASC, u.firstName ASC");

			try {
				ps.setLong(1, user.getCompanyId());
				ps.setLong(2, user.getCompanyId());
				ps.setLong(3, departmentId);
				ps.setString(4, "%/" + departmentId + "/%");

				ResultSet rs = ps.executeQuery();
				JSONArray items = JSONFactoryUtil.createJSONArray();

				try {
					while (rs.next()) {
						items.put(_toUserJSONObject(rs, "userId"));
					}
				}
				finally {
					DataAccess.cleanUp(rs);
				}

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("items", items);

				return _ok(result);
			}
			finally {
				DataAccess.cleanUp(ps);
			}
		}
		catch (Exception e) {
			_log.error(
				"Error getting users for support settings: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@PUT
	@Path("/configurations")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response saveConfigurations(
		@Context HttpServletRequest request, String body) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden();
		}

		Connection con = null;

		try {
			JSONObject payload = JSONFactoryUtil.createJSONObject(body);
			JSONArray items = payload.getJSONArray("items");

			if (items == null) {
				return _badRequest("items là bắt buộc.");
			}

			con = DataAccess.getConnection();
			JSONArray normalizedItems = _validateAndNormalizeItems(
				con, user.getCompanyId(), items);
			Timestamp now = _now();
			int updatedPendingRequestCount;

			con.setAutoCommit(false);

			try {
				updatedPendingRequestCount = _replaceConfigurations(
					con, user, normalizedItems, now);

				con.commit();
			}
			catch (Exception e) {
				con.rollback();

				throw e;
			}
			finally {
				con.setAutoCommit(true);
			}

			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("items", _readConfigurations(con, user.getCompanyId()));
			result.put("updatedByUserId", user.getUserId());
			result.put("updatedByScreenName", user.getScreenName());
			result.put("modifiedDate", now.toString());
			result.put(
				"updatedPendingRequestCount", updatedPendingRequestCount);

			return _ok(result);
		}
		catch (IllegalArgumentException e) {
			return _badRequest(e.getMessage());
		}
		catch (Exception e) {
			_log.error(
				"Error saving support handler configurations: " + e.getMessage(),
				e);

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

	private JSONArray _readConfigurations(Connection con, long companyId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT c.configId, c.processKey, c.requestTypeKey, " +
			"c.organizationId, o.name AS organizationName, " +
			"c.departmentId, d.name AS departmentName, " +
			"c.createDate, c.modifiedDate, cu.userId AS handlerUserId, " +
			"u.screenName, u.emailAddress, u.firstName, u.middleName, " +
			"u.lastName FROM VEC_SupportHandlerConfig c " +
			"INNER JOIN Organization_ o ON c.organizationId = o.organizationId " +
			"INNER JOIN Organization_ d ON c.departmentId = d.organizationId " +
			"LEFT JOIN VEC_SupportHandlerConfigUser cu " +
			"ON c.configId = cu.configId " +
			"LEFT JOIN User_ u ON cu.userId = u.userId " +
			"WHERE c.companyId = ? " +
			"ORDER BY c.requestTypeKey ASC, u.lastName ASC, u.firstName ASC");

		try {
			ps.setLong(1, companyId);

			ResultSet rs = ps.executeQuery();
			Map<Long, JSONObject> configurations = new LinkedHashMap<>();

			try {
				while (rs.next()) {
					long configId = rs.getLong("configId");
					JSONObject item = configurations.get(configId);

					if (item == null) {
						item = JSONFactoryUtil.createJSONObject();
						item.put("configured", true);
						item.put("configId", configId);
						item.put("processKey", rs.getString("processKey"));
						item.put(
							"requestTypeKey", rs.getString("requestTypeKey"));
						item.put(
							"organizationId", rs.getLong("organizationId"));
						item.put(
							"organizationName", rs.getString("organizationName"));
						item.put("departmentId", rs.getLong("departmentId"));
						item.put(
							"departmentName", rs.getString("departmentName"));
						item.put(
							"createDate", _timestamp(rs.getTimestamp("createDate")));
						item.put(
							"modifiedDate",
							_timestamp(rs.getTimestamp("modifiedDate")));
						item.put("userIds", JSONFactoryUtil.createJSONArray());
						item.put("users", JSONFactoryUtil.createJSONArray());

						configurations.put(configId, item);
					}

					long handlerUserId = rs.getLong("handlerUserId");

					if (!rs.wasNull() && handlerUserId > 0) {
						item.getJSONArray("userIds").put(handlerUserId);
						item.getJSONArray("users").put(
							_toUserJSONObject(rs, "handlerUserId"));
					}
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			JSONArray items = JSONFactoryUtil.createJSONArray();

			for (JSONObject item : configurations.values()) {
				items.put(item);
			}

			return items;
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONArray _validateAndNormalizeItems(
			Connection con, long companyId, JSONArray items)
		throws Exception {

		if (items.length() != _REQUEST_TYPE_KEYS.size()) {
			throw new IllegalArgumentException(
				"Phải cấu hình người xử lý cho đầy đủ tất cả loại yêu cầu.");
		}

		JSONArray normalizedItems = JSONFactoryUtil.createJSONArray();
		Set<String> requestTypeKeys = new HashSet<>();

		for (int i = 0; i < items.length(); i++) {
			JSONObject item = items.getJSONObject(i);

			if (item == null) {
				throw new IllegalArgumentException(
					"items[" + i + "] phải là một object.");
			}

			String processKey = _trim(item.getString("processKey"));
			String requestTypeKey = _trim(item.getString("requestTypeKey"));

			if (!_isValidRequestType(processKey, requestTypeKey)) {
				throw new IllegalArgumentException(
					"Loại yêu cầu hỗ trợ không hợp lệ: " + requestTypeKey);
			}

			if (!requestTypeKeys.add(requestTypeKey)) {
				throw new IllegalArgumentException(
					"Loại yêu cầu bị trùng: " + requestTypeKey);
			}

			long organizationId = item.getLong("organizationId");
			long departmentId = item.getLong("departmentId");

			if (!_isValidOrganizationSelection(
					con, companyId, organizationId, departmentId)) {

				throw new IllegalArgumentException(
					"Đơn vị hoặc phòng ban không hợp lệ cho " + requestTypeKey);
			}

			JSONArray userIds = item.getJSONArray("userIds");

			if (userIds == null || userIds.length() == 0) {
				throw new IllegalArgumentException(
					"Phải chọn ít nhất một người xử lý cho " + requestTypeKey);
			}

			Set<Long> normalizedUserIds = new LinkedHashSet<>();

			for (int userIndex = 0; userIndex < userIds.length(); userIndex++) {
				long userId = userIds.getLong(userIndex);

				if (userId <= 0 || !normalizedUserIds.add(userId)) {
					throw new IllegalArgumentException(
						"Danh sách người xử lý không hợp lệ cho " +
							requestTypeKey);
				}

				if (!_isValidHandlerUser(
						con, companyId, departmentId, userId)) {

					throw new IllegalArgumentException(
						"Người xử lý không thuộc phòng ban đã chọn hoặc " +
							"các phòng ban cấp dưới: " + userId);
				}
			}

			JSONObject normalizedItem = JSONFactoryUtil.createJSONObject();
			JSONArray normalizedUserIdArray = JSONFactoryUtil.createJSONArray();

			for (Long userId : normalizedUserIds) {
				normalizedUserIdArray.put(userId.longValue());
			}

			normalizedItem.put("processKey", processKey);
			normalizedItem.put("requestTypeKey", requestTypeKey);
			normalizedItem.put("organizationId", organizationId);
			normalizedItem.put("departmentId", departmentId);
			normalizedItem.put("userIds", normalizedUserIdArray);

			normalizedItems.put(normalizedItem);
		}

		return normalizedItems;
	}

	private int _replaceConfigurations(
			Connection con, User user, JSONArray items, Timestamp now)
		throws Exception {

		PreparedStatement deleteUsers = con.prepareStatement(
			"DELETE cu FROM VEC_SupportHandlerConfigUser cu " +
			"INNER JOIN VEC_SupportHandlerConfig c " +
			"ON cu.configId = c.configId WHERE c.companyId = ?");

		try {
			deleteUsers.setLong(1, user.getCompanyId());
			deleteUsers.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(deleteUsers);
		}

		PreparedStatement deleteConfigurations = con.prepareStatement(
			"DELETE FROM VEC_SupportHandlerConfig WHERE companyId = ?");

		try {
			deleteConfigurations.setLong(1, user.getCompanyId());
			deleteConfigurations.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(deleteConfigurations);
		}

		for (int i = 0; i < items.length(); i++) {
			JSONObject item = items.getJSONObject(i);
			long configId = _insertConfiguration(con, user, item, now);

			_insertHandlerUsers(con, configId, item.getJSONArray("userIds"));
		}

		return _reassignPendingRequests(con, user, now);
	}

	private int _reassignPendingRequests(
			Connection con, User user, Timestamp now)
		throws Exception {

		PreparedStatement deleteHandlers = con.prepareStatement(
			"DELETE handler FROM VEC_SupportRequestHandler handler " +
			"INNER JOIN VEC_SupportRequest request " +
			"ON handler.requestId = request.requestId " +
			"WHERE request.companyId = ? AND request.status = ?");

		try {
			deleteHandlers.setLong(1, user.getCompanyId());
			deleteHandlers.setString(2, _PENDING_STATUS);
			deleteHandlers.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(deleteHandlers);
		}

		PreparedStatement insertHandlers = con.prepareStatement(
			"INSERT INTO VEC_SupportRequestHandler " +
			"(requestId, userId, assignedByUserId, createDate) " +
			"SELECT request.requestId, configUser.userId, ?, ? " +
			"FROM VEC_SupportRequest request " +
			"INNER JOIN VEC_SupportHandlerConfig config " +
			"ON config.companyId = request.companyId " +
			"AND config.processKey = request.processKey " +
			"AND config.requestTypeKey = request.requestTypeKey " +
			"INNER JOIN VEC_SupportHandlerConfigUser configUser " +
			"ON config.configId = configUser.configId " +
			"WHERE request.companyId = ? AND request.status = ?");

		try {
			insertHandlers.setLong(1, user.getUserId());
			insertHandlers.setTimestamp(2, now);
			insertHandlers.setLong(3, user.getCompanyId());
			insertHandlers.setString(4, _PENDING_STATUS);
			insertHandlers.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(insertHandlers);
		}

		PreparedStatement updateRequests = con.prepareStatement(
			"UPDATE VEC_SupportRequest SET modifiedDate = ? " +
			"WHERE companyId = ? AND status = ?");

		try {
			updateRequests.setTimestamp(1, now);
			updateRequests.setLong(2, user.getCompanyId());
			updateRequests.setString(3, _PENDING_STATUS);

			return updateRequests.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(updateRequests);
		}
	}

	private long _insertConfiguration(
			Connection con, User user, JSONObject item, Timestamp now)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_SupportHandlerConfig " +
			"(companyId, processKey, requestTypeKey, organizationId, " +
			"departmentId, createUserId, modifiedUserId, createDate, " +
			"modifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
			Statement.RETURN_GENERATED_KEYS);

		try {
			ps.setLong(1, user.getCompanyId());
			ps.setString(2, item.getString("processKey"));
			ps.setString(3, item.getString("requestTypeKey"));
			ps.setLong(4, item.getLong("organizationId"));
			ps.setLong(5, item.getLong("departmentId"));
			ps.setLong(6, user.getUserId());
			ps.setLong(7, user.getUserId());
			ps.setTimestamp(8, now);
			ps.setTimestamp(9, now);
			ps.executeUpdate();

			ResultSet generatedKeys = ps.getGeneratedKeys();

			try {
				if (generatedKeys.next()) {
					return generatedKeys.getLong(1);
				}
			}
			finally {
				DataAccess.cleanUp(generatedKeys);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}

		throw new IllegalStateException("Không tạo được cấu hình người xử lý.");
	}

	private void _insertHandlerUsers(
			Connection con, long configId, JSONArray userIds)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_SupportHandlerConfigUser (configId, userId) " +
			"VALUES (?, ?)");

		try {
			for (int i = 0; i < userIds.length(); i++) {
				ps.setLong(1, configId);
				ps.setLong(2, userIds.getLong(i));
				ps.addBatch();
			}

			ps.executeBatch();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private boolean _isValidOrganizationSelection(
			Connection con, long companyId, long organizationId,
			long departmentId)
		throws Exception {

		if (organizationId <= 0 || departmentId <= 0) {
			return false;
		}

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM Organization_ organization " +
			"INNER JOIN Organization_ department " +
			"ON department.parentOrganizationId = organization.organizationId " +
			"WHERE organization.companyId = ? AND department.companyId = ? " +
			"AND organization.organizationId = ? " +
			"AND department.organizationId = ?");

		try {
			ps.setLong(1, companyId);
			ps.setLong(2, companyId);
			ps.setLong(3, organizationId);
			ps.setLong(4, departmentId);

			ResultSet rs = ps.executeQuery();

			try {
				return rs.next() && rs.getInt(1) > 0;
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private boolean _isValidHandlerUser(
			Connection con, long companyId, long departmentId, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(DISTINCT u.userId) FROM User_ u " +
				"INNER JOIN Users_Orgs uo ON u.userId = uo.userId " +
				"INNER JOIN Organization_ memberOrganization ON " +
				"uo.organizationId = memberOrganization.organizationId " +
				"WHERE u.companyId = ? AND memberOrganization.companyId = ? " +
				"AND u.status = 0 AND u.userId = ? " +
				"AND (memberOrganization.organizationId = ? " +
				"OR memberOrganization.treePath LIKE ?)");

		try {
			ps.setLong(1, companyId);
			ps.setLong(2, companyId);
			ps.setLong(3, userId);
			ps.setLong(4, departmentId);
			ps.setString(5, "%/" + departmentId + "/%");

			ResultSet rs = ps.executeQuery();

			try {
				return rs.next() && rs.getInt(1) > 0;
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONObject _toUserJSONObject(ResultSet rs, String userIdColumn)
		throws Exception {

		JSONObject user = JSONFactoryUtil.createJSONObject();
		String fullName = _fullName(rs);
		String screenName = _trim(rs.getString("screenName"));

		user.put("userId", rs.getLong(userIdColumn));
		user.put("screenName", screenName);
		user.put("emailAddress", _trim(rs.getString("emailAddress")));
		user.put("fullName", fullName.isEmpty() ? screenName : fullName);

		return user;
	}

	private String _fullName(ResultSet rs) throws Exception {
		String firstName = _trim(rs.getString("firstName"));
		String middleName = _trim(rs.getString("middleName"));
		String lastName = _trim(rs.getString("lastName"));

		return (firstName + " " + middleName + " " + lastName)
			.replaceAll("\\s+", " ").trim();
	}

	private boolean _isValidRequestType(
		String processKey, String requestTypeKey) {

		return _PROCESS_KEY.equals(processKey) &&
			_REQUEST_TYPE_KEYS.contains(requestTypeKey);
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

	private String _trim(String value) {
		return value == null ? "" : value.trim();
	}

	private Timestamp _now() {
		return new Timestamp(System.currentTimeMillis());
	}

	private String _timestamp(Timestamp timestamp) {
		return timestamp == null ? "" : timestamp.toString();
	}

	private Response _ok(JSONObject jsonObject) {
		return _cors(
			Response.ok(jsonObject.toString(), MediaType.APPLICATION_JSON)
		).build();
	}

	private Response _badRequest(String message) {
		JSONObject error = JSONFactoryUtil.createJSONObject();

		error.put("error", message);

		return _cors(
			Response.status(Response.Status.BAD_REQUEST)
				.type(MediaType.APPLICATION_JSON)
				.entity(error.toString())
		).build();
	}

	private Response _forbidden() {
		return _cors(
			Response.status(Response.Status.FORBIDDEN)
				.type(MediaType.APPLICATION_JSON)
				.entity(
					"{\"error\":\"Chỉ user admin mới được cấu hình người xử lý.\"}")
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

	private Response _serverError() {
		return _cors(
			Response.serverError()
				.type(MediaType.APPLICATION_JSON)
				.entity(
					"{\"error\":\"Máy chủ đang gặp lỗi. Vui lòng thử lại sau.\"}")
		).build();
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder builder) {
		return builder
			.header("Access-Control-Allow-Origin", "*")
			.header(
				"Access-Control-Allow-Headers",
				"Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
			.header("Access-Control-Allow-Credentials", "true");
	}

	private static final long _DEV_USER_ID = 1;

	private static final String _PROCESS_KEY = "dich-vu-cntt";
	private static final String _PENDING_STATUS = "cho-xu-ly";

	private static final Set<String> _REQUEST_TYPE_KEYS = new HashSet<>(
		Arrays.asList(
			"gop-y-cai-tien",
			"ho-tro-dao-tao-hdsd",
			"ho-tro-hoi-nghi-truyen-hinh",
			"yc-cap-tai-khoan-quyen-truy-cap",
			"yc-ho-tro-phan-mem",
			"yc-kiem-tra-may-nang-cap-ssd",
			"yc-su-co-ket-noi-mang",
			"yc-sua-chua-khac-phuc-thiet-bi-cntt"));

	private static final Log _log = LogFactoryUtil.getLog(
		SupportHandlerSettingResource.class);

}
