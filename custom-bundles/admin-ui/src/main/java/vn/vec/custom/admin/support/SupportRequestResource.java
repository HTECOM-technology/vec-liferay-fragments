package vn.vec.custom.admin.support;

import com.liferay.mail.kernel.model.MailMessage;
import com.liferay.mail.kernel.service.MailServiceUtil;
import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.PrefsPropsUtil;
import com.liferay.portal.kernel.util.PropsKeys;

import java.net.URLEncoder;

import java.nio.charset.StandardCharsets;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.mail.internet.InternetAddress;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/")
public class SupportRequestResource {

	@GET
	@Path("/requests")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRequests(
		@Context HttpServletRequest request,
		@QueryParam("mine") @DefaultValue("false") boolean mine,
		@QueryParam("search") String search,
		@QueryParam("status") String status,
		@QueryParam("priority") String priority,
		@QueryParam("processKey") String processKey,
		@QueryParam("requestTypeKey") String requestTypeKey,
		@QueryParam("createdFrom") String createdFrom,
		@QueryParam("createdTo") String createdTo,
		@QueryParam("dueFrom") String dueFrom,
		@QueryParam("dueTo") String dueTo,
		@QueryParam("page") @DefaultValue("1") int page,
		@QueryParam("pageSize") @DefaultValue("15") int pageSize) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		page = Math.max(page, 1);
		pageSize = Math.max(1, Math.min(pageSize, 100));

		StringBuilder where = new StringBuilder(
			" WHERE request.companyId = ? ");
		List<Object> parameters = new ArrayList<>();

		parameters.add(Long.valueOf(user.getCompanyId()));

		if (mine) {
			where.append("AND request.creatorUserId = ? ");
			parameters.add(Long.valueOf(user.getUserId()));
		}

		if (!_trim(search).isEmpty()) {
			where.append(
				"AND (request.title LIKE ? OR request.creatorUserName LIKE ?) ");
			String like = "%" + _trim(search) + "%";

			parameters.add(like);
			parameters.add(like);
		}

		_appendStringFilter(where, parameters, "request.status", status);
		_appendStringFilter(where, parameters, "request.priority", priority);
		_appendStringFilter(where, parameters, "request.processKey", processKey);
		_appendStringFilter(
			where, parameters, "request.requestTypeKey", requestTypeKey);
		_appendDateFilter(
			where, parameters, "request.createDate", ">=", createdFrom, false);
		_appendDateFilter(
			where, parameters, "request.createDate", "<=", createdTo, true);
		_appendDateFilter(
			where, parameters, "request.dueDate", ">=", dueFrom, false);
		_appendDateFilter(
			where, parameters, "request.dueDate", "<=", dueTo, true);

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			long total = _countRequests(con, where.toString(), parameters);
			PreparedStatement ps = con.prepareStatement(
				"SELECT request.*, EXISTS (SELECT 1 " +
				"FROM VEC_SupportRequestHandler permissionHandler " +
				"WHERE permissionHandler.requestId = request.requestId " +
				"AND permissionHandler.userId = ?) AS assignedToCurrentUser " +
				"FROM VEC_SupportRequest request " + where +
				"ORDER BY request.createDate DESC, request.requestId DESC " +
				"LIMIT ? OFFSET ?");

			try {
				int parameterIndex = 1;

				ps.setLong(parameterIndex++, user.getUserId());
				parameterIndex = _bindParameters(
					ps, parameterIndex, parameters);
				ps.setInt(parameterIndex++, pageSize);
				ps.setInt(parameterIndex, (page - 1) * pageSize);

				ResultSet rs = ps.executeQuery();
				JSONArray items = JSONFactoryUtil.createJSONArray();

				try {
					while (rs.next()) {
						items.put(_toBasicRequest(rs, user));
					}
				}
				finally {
					DataAccess.cleanUp(rs);
				}

				for (int i = 0; i < items.length(); i++) {
					_enrichPeople(con, items.getJSONObject(i));
				}

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("items", items);
				result.put("total", total);
				result.put("page", page);
				result.put("pageSize", pageSize);

				return _ok(result);
			}
			finally {
				DataAccess.cleanUp(ps);
			}
		}
		catch (IllegalArgumentException e) {
			return _badRequest(e.getMessage());
		}
		catch (Exception e) {
			_log.error("Error getting support requests: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@GET
	@Path("/requests/{requestId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRequest(
		@Context HttpServletRequest request,
		@PathParam("requestId") long requestId) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			JSONObject item = _getRequest(
				con, requestId, user, true);

			if (item == null) {
				return _notFound("Không tìm thấy yêu cầu hỗ trợ.");
			}

			return _ok(item);
		}
		catch (Exception e) {
			_log.error(
				"Error getting support request " + requestId + ": " +
					e.getMessage(),
				e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@POST
	@Path("/requests")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createRequest(
		@Context HttpServletRequest request, String body) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		Connection con = null;

		try {
			JSONObject payload = JSONFactoryUtil.createJSONObject(body);
			String processKey = _trim(payload.getString("processKey"));
			String requestTypeKey = _trim(
				payload.getString("requestTypeKey"));
			String title = _trim(payload.getString("title"));
			String priority = _trim(payload.getString("priority"));

			if (!_isValidRequestType(processKey, requestTypeKey)) {
				return _badRequest("Loại yêu cầu hỗ trợ không hợp lệ.");
			}

			if (title.isEmpty()) {
				return _badRequest("Tiêu đề là bắt buộc.");
			}

			if (title.length() > 500) {
				return _badRequest("Tiêu đề không được vượt quá 500 ký tự.");
			}

			if (!_PRIORITIES.contains(priority)) {
				priority = "thuong";
			}

			con = DataAccess.getConnection();
			long configId = _getConfigurationId(
				con, user.getCompanyId(), processKey, requestTypeKey);

			if (configId <= 0 || _countConfigurationUsers(con, configId) <= 0) {
				return _badRequest(
					"Loại yêu cầu chưa được cấu hình người xử lý");
			}

			JSONArray followerIds = payload.getJSONArray("followerIds");
			JSONArray attachments = payload.getJSONArray("attachments");
			_validateFollowers(con, user.getCompanyId(), followerIds);
			_validateAttachments(attachments);

			Timestamp now = _now();
			long requestId;

			con.setAutoCommit(false);

			try {
				requestId = _insertRequest(
					con, request, user, payload, processKey, requestTypeKey,
					title, priority, now);
				if (_copyConfiguredHandlers(
						con, requestId, configId, user.getUserId(), now) <= 0) {

					throw new IllegalStateException(
						"Cấu hình người xử lý đã thay đổi. Vui lòng thử lại.");
				}
				_insertFollowers(con, requestId, followerIds, now);
				_insertAttachments(con, requestId, attachments, now);

				con.commit();
			}
			catch (Exception e) {
				con.rollback();

				throw e;
			}
			finally {
				con.setAutoCommit(true);
			}

			JSONObject createdRequest = _getRequest(
				con, requestId, user, true);

			_sendRequestCreatedEmail(request, createdRequest, user);

			return _created(createdRequest);
		}
		catch (IllegalArgumentException e) {
			return _badRequest(e.getMessage());
		}
		catch (Exception e) {
			_log.error("Error creating support request: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@PUT
	@Path("/requests/{requestId}/status")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateStatus(
		@Context HttpServletRequest request,
		@PathParam("requestId") long requestId, String body) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		try {
			JSONObject payload = JSONFactoryUtil.createJSONObject(body);
			String nextStatus = _trim(payload.getString("status"));

			if (!_STATUSES.contains(nextStatus)) {
				return _badRequest("Trạng thái yêu cầu không hợp lệ.");
			}

			Connection con = DataAccess.getConnection();

			try {
				String currentStatus = _getRequestStatus(
					con, requestId, user.getCompanyId());

				if (currentStatus.isEmpty()) {
					return _notFound("Không tìm thấy yêu cầu hỗ trợ.");
				}

				if (!_isAdminUser(user) &&
					!_isAssignedHandler(con, requestId, user.getUserId())) {

					return _forbidden(
						"Chỉ người xử lý được chỉ định hoặc admin mới có thể " +
							"thay đổi trạng thái.");
				}

				if (currentStatus.equals(nextStatus)) {
					return _ok(_getRequest(con, requestId, user, true));
				}

				Timestamp now = _now();

				con.setAutoCommit(false);

				try {
					_updateRequestStatus(con, requestId, nextStatus, now);
					_insertStatusHistory(
						con, requestId, currentStatus, nextStatus, user, now);

					con.commit();
				}
				catch (Exception e) {
					con.rollback();

					throw e;
				}
				finally {
					con.setAutoCommit(true);
				}

				return _ok(_getRequest(con, requestId, user, true));
			}
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error(
				"Error updating support request status: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@POST
	@Path("/requests/{requestId}/comments")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addComment(
		@Context HttpServletRequest request,
		@PathParam("requestId") long requestId, String body) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		Connection con = null;

		try {
			JSONObject payload = JSONFactoryUtil.createJSONObject(body);
			String content = _trim(payload.getString("content"));

			if (content.isEmpty()) {
				return _badRequest("Nội dung bình luận là bắt buộc.");
			}

			if (content.length() > 4000) {
				return _badRequest(
					"Nội dung bình luận không được vượt quá 4000 ký tự.");
			}

			con = DataAccess.getConnection();

			if (_getRequestStatus(
					con, requestId, user.getCompanyId()).isEmpty()) {

				return _notFound("Không tìm thấy yêu cầu hỗ trợ.");
			}

			Timestamp now = _now();
			PreparedStatement ps = con.prepareStatement(
				"INSERT INTO VEC_SupportRequestComment " +
				"(requestId, userId, userName, content, createDate) " +
				"VALUES (?, ?, ?, ?, ?)", Statement.RETURN_GENERATED_KEYS);

			try {
				ps.setLong(1, requestId);
				ps.setLong(2, user.getUserId());
				ps.setString(3, user.getFullName());
				ps.setString(4, content);
				ps.setTimestamp(5, now);
				ps.executeUpdate();

				ResultSet keys = ps.getGeneratedKeys();
				long commentId = 0;

				try {
					if (keys.next()) {
						commentId = keys.getLong(1);
					}
				}
				finally {
					DataAccess.cleanUp(keys);
				}

				JSONObject comment = JSONFactoryUtil.createJSONObject();

				comment.put("commentId", commentId);
				comment.put("userId", user.getUserId());
				comment.put("userName", user.getFullName());
				comment.put("content", content);
				comment.put("createDate", now.toString());

				return _created(comment);
			}
			finally {
				DataAccess.cleanUp(ps);
			}
		}
		catch (Exception e) {
			_log.error("Error adding support request comment: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@GET
	@Path("/requests/{requestId}/attachments/{attachmentId}")
	public Response downloadAttachment(
		@Context HttpServletRequest request,
		@PathParam("requestId") long requestId,
		@PathParam("attachmentId") long attachmentId) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();

			if (_getRequestStatus(
					con, requestId, user.getCompanyId()).isEmpty()) {

				return _notFound("Không tìm thấy yêu cầu hỗ trợ.");
			}

			PreparedStatement ps = con.prepareStatement(
				"SELECT fileName, contentType, fileContent " +
				"FROM VEC_SupportRequestAttachment " +
				"WHERE attachmentId = ? AND requestId = ?");

			try {
				ps.setLong(1, attachmentId);
				ps.setLong(2, requestId);

				ResultSet rs = ps.executeQuery();

				try {
					if (!rs.next()) {
						return _notFound("Không tìm thấy tệp đính kèm.");
					}

					String fileName = rs.getString("fileName");
					String contentType = _trim(rs.getString("contentType"));
					String encodedFileName = URLEncoder.encode(
						fileName, StandardCharsets.UTF_8.name()).replace("+", "%20");

					if (contentType.isEmpty()) {
						contentType = MediaType.APPLICATION_OCTET_STREAM;
					}

					return _cors(
						Response.ok(rs.getBytes("fileContent"), contentType)
							.header(
								"Content-Disposition",
								"attachment; filename*=UTF-8''" + encodedFileName)
					).build();
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
			_log.error("Error downloading support attachment: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	@GET
	@Path("/request-users")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getRequestUsers(
		@Context HttpServletRequest request,
		@QueryParam("search") String search) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _unauthorized();
		}

		Connection con = null;

		try {
			con = DataAccess.getConnection();
			boolean hasSearch = !_trim(search).isEmpty();
			PreparedStatement ps = con.prepareStatement(
				"SELECT userId, screenName, emailAddress, firstName, middleName, " +
				"lastName FROM User_ WHERE companyId = ? AND status = 0 " +
				(hasSearch ?
					"AND (screenName LIKE ? OR emailAddress LIKE ? OR firstName LIKE ? " +
						"OR lastName LIKE ?) " : "") +
				"ORDER BY lastName ASC, firstName ASC LIMIT 200");

			try {
				int index = 1;

				ps.setLong(index++, user.getCompanyId());

				if (hasSearch) {
					String like = "%" + _trim(search) + "%";

					ps.setString(index++, like);
					ps.setString(index++, like);
					ps.setString(index++, like);
					ps.setString(index, like);
				}

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
			_log.error("Error getting users for support request: " + e.getMessage(), e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(con);
		}
	}

	private long _countRequests(
			Connection con, String where, List<Object> parameters)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_SupportRequest request " + where);

		try {
			_bindParameters(ps, 1, parameters);

			ResultSet rs = ps.executeQuery();

			try {
				return rs.next() ? rs.getLong(1) : 0;
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONObject _getRequest(
			Connection con, long requestId, User user, boolean detailed)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT request.*, EXISTS (SELECT 1 " +
			"FROM VEC_SupportRequestHandler permissionHandler " +
			"WHERE permissionHandler.requestId = request.requestId " +
			"AND permissionHandler.userId = ?) AS assignedToCurrentUser " +
			"FROM VEC_SupportRequest request " +
			"WHERE request.requestId = ? AND request.companyId = ?");

		try {
			ps.setLong(1, user.getUserId());
			ps.setLong(2, requestId);
			ps.setLong(3, user.getCompanyId());

			ResultSet rs = ps.executeQuery();
			JSONObject item;

			try {
				if (!rs.next()) {
					return null;
				}

				item = _toBasicRequest(rs, user);
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			_enrichPeople(con, item);

			if (detailed) {
				item.put("attachments", _readAttachments(con, requestId));
				item.put("comments", _readComments(con, requestId));
				item.put("statusHistory", _readStatusHistory(con, requestId));
			}

			return item;
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONObject _toBasicRequest(ResultSet rs, User currentUser)
		throws Exception {

		JSONObject item = JSONFactoryUtil.createJSONObject();
		long requestId = rs.getLong("requestId");
		Timestamp createDate = rs.getTimestamp("createDate");

		item.put("requestId", requestId);
		item.put("requestCode", _requestCode(requestId, createDate));
		item.put("companyId", rs.getLong("companyId"));
		item.put("groupId", rs.getLong("groupId"));
		item.put("creatorUserId", rs.getLong("creatorUserId"));
		item.put("creatorUserName", rs.getString("creatorUserName"));
		item.put("processKey", rs.getString("processKey"));
		item.put("requestTypeKey", rs.getString("requestTypeKey"));
		item.put("title", rs.getString("title"));
		item.put("content", rs.getString("content"));
		item.put("status", rs.getString("status"));
		item.put("priority", rs.getString("priority"));
		item.put("notificationTypes", rs.getString("notificationTypes"));
		item.put("dueDate", _timestamp(rs.getTimestamp("dueDate")));
		item.put("startDate", _timestamp(rs.getTimestamp("startDate")));
		item.put("endDate", _timestamp(rs.getTimestamp("endDate")));
		item.put("periodType", rs.getString("periodType"));
		item.put("createDate", _timestamp(createDate));
		item.put("modifiedDate", _timestamp(rs.getTimestamp("modifiedDate")));
		item.put("isOwner", rs.getLong("creatorUserId") == currentUser.getUserId());
		item.put(
			"canUpdateStatus",
			_isAdminUser(currentUser) || rs.getBoolean("assignedToCurrentUser"));

		return item;
	}

	private void _enrichPeople(Connection con, JSONObject request)
		throws Exception {

		long requestId = request.getLong("requestId");

		request.put("handlers", _readRequestUsers(
			con, "VEC_SupportRequestHandler", requestId, true));
		request.put("followers", _readRequestUsers(
			con, "VEC_SupportRequestFollower", requestId, false));
	}

	private JSONArray _readRequestUsers(
			Connection con, String tableName, long requestId,
			boolean includeOrganizations)
		throws Exception {

		String sql;

		if (includeOrganizations) {
			sql = "SELECT relation.userId, u.screenName, u.emailAddress, " +
				"u.firstName, u.middleName, u.lastName, " +
				"relation.organizationId, ho.name AS organizationName, " +
				"relation.departmentId, hd.name AS departmentName FROM " +
				tableName + " relation " +
				"LEFT JOIN User_ u ON relation.userId = u.userId " +
				"LEFT JOIN Organization_ ho " +
				"ON relation.organizationId = ho.organizationId " +
				"LEFT JOIN Organization_ hd " +
				"ON relation.departmentId = hd.organizationId " +
				"WHERE relation.requestId = ? " +
				"ORDER BY u.lastName ASC, u.firstName ASC";
		}
		else {
			sql = "SELECT relation.userId, u.screenName, u.emailAddress, " +
				"u.firstName, u.middleName, u.lastName FROM " + tableName +
				" relation LEFT JOIN User_ u ON relation.userId = u.userId " +
				"WHERE relation.requestId = ? " +
				"ORDER BY u.lastName ASC, u.firstName ASC";
		}

		PreparedStatement ps = con.prepareStatement(sql);

		try {
			ps.setLong(1, requestId);

			ResultSet rs = ps.executeQuery();
			JSONArray users = JSONFactoryUtil.createJSONArray();

			try {
				while (rs.next()) {
					JSONObject user = _toUserJSONObject(rs, "userId");

					if (includeOrganizations) {
						user.put(
							"organizationId", rs.getLong("organizationId"));
						user.put(
							"organizationName",
							_trim(rs.getString("organizationName")));
						user.put("departmentId", rs.getLong("departmentId"));
						user.put(
							"departmentName",
							_trim(rs.getString("departmentName")));
					}

					users.put(user);
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			return users;
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONArray _readAttachments(Connection con, long requestId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT attachmentId, fileName, contentType, fileSize, createDate " +
			"FROM VEC_SupportRequestAttachment WHERE requestId = ? " +
			"ORDER BY attachmentId ASC");

		try {
			ps.setLong(1, requestId);
			ResultSet rs = ps.executeQuery();
			JSONArray items = JSONFactoryUtil.createJSONArray();

			try {
				while (rs.next()) {
					JSONObject item = JSONFactoryUtil.createJSONObject();

					item.put("attachmentId", rs.getLong("attachmentId"));
					item.put("fileName", rs.getString("fileName"));
					item.put("contentType", rs.getString("contentType"));
					item.put("fileSize", rs.getLong("fileSize"));
					item.put(
						"createDate", _timestamp(rs.getTimestamp("createDate")));

					items.put(item);
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			return items;
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONArray _readComments(Connection con, long requestId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT commentId, userId, userName, content, createDate " +
			"FROM VEC_SupportRequestComment WHERE requestId = ? " +
			"ORDER BY createDate ASC, commentId ASC");

		try {
			ps.setLong(1, requestId);
			ResultSet rs = ps.executeQuery();
			JSONArray items = JSONFactoryUtil.createJSONArray();

			try {
				while (rs.next()) {
					JSONObject item = JSONFactoryUtil.createJSONObject();

					item.put("commentId", rs.getLong("commentId"));
					item.put("userId", rs.getLong("userId"));
					item.put("userName", rs.getString("userName"));
					item.put("content", rs.getString("content"));
					item.put(
						"createDate", _timestamp(rs.getTimestamp("createDate")));

					items.put(item);
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			return items;
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONArray _readStatusHistory(Connection con, long requestId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT historyId, fromStatus, toStatus, changedByUserId, " +
			"changedByUserName, createDate " +
			"FROM VEC_SupportRequestStatusHistory WHERE requestId = ? " +
			"ORDER BY createDate ASC, historyId ASC");

		try {
			ps.setLong(1, requestId);
			ResultSet rs = ps.executeQuery();
			JSONArray items = JSONFactoryUtil.createJSONArray();

			try {
				while (rs.next()) {
					JSONObject item = JSONFactoryUtil.createJSONObject();

					item.put("historyId", rs.getLong("historyId"));
					item.put("fromStatus", rs.getString("fromStatus"));
					item.put("toStatus", rs.getString("toStatus"));
					item.put("changedByUserId", rs.getLong("changedByUserId"));
					item.put(
						"changedByUserName", rs.getString("changedByUserName"));
					item.put(
						"createDate", _timestamp(rs.getTimestamp("createDate")));

					items.put(item);
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			return items;
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private long _insertRequest(
			Connection con, HttpServletRequest request, User user,
			JSONObject payload, String processKey, String requestTypeKey,
			String title, String priority, Timestamp now)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_SupportRequest " +
			"(companyId, groupId, creatorUserId, creatorUserName, processKey, " +
			"requestTypeKey, title, content, status, priority, " +
			"notificationTypes, dueDate, startDate, endDate, periodType, " +
			"createDate, modifiedDate) " +
			"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			Statement.RETURN_GENERATED_KEYS);

		try {
			ps.setLong(1, user.getCompanyId());
			ps.setLong(2, _getScopeGroupId(request));
			ps.setLong(3, user.getUserId());
			ps.setString(4, user.getFullName());
			ps.setString(5, processKey);
			ps.setString(6, requestTypeKey);
			ps.setString(7, title);
			ps.setString(8, payload.getString("content"));
			ps.setString(9, _PENDING_STATUS);
			ps.setString(10, priority);
			ps.setString(
				11, _joinStrings(payload.getJSONArray("notificationTypes")));
			ps.setTimestamp(12, _parseTimestamp(payload.getString("dueDate")));
			ps.setTimestamp(13, _parseTimestamp(payload.getString("startDate")));
			ps.setTimestamp(14, _parseTimestamp(payload.getString("endDate")));
			ps.setString(15, _trim(payload.getString("periodType")));
			ps.setTimestamp(16, now);
			ps.setTimestamp(17, now);
			ps.executeUpdate();

			ResultSet keys = ps.getGeneratedKeys();

			try {
				if (keys.next()) {
					return keys.getLong(1);
				}
			}
			finally {
				DataAccess.cleanUp(keys);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}

		throw new IllegalStateException("Không tạo được yêu cầu hỗ trợ.");
	}

	private int _copyConfiguredHandlers(
			Connection con, long requestId, long configId, long assignedByUserId,
			Timestamp now)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_SupportRequestHandler " +
			"(requestId, userId, organizationId, departmentId, " +
			"assignedByUserId, createDate) " +
			"SELECT ?, userId, organizationId, departmentId, ?, ? " +
			"FROM VEC_SupportHandlerConfigUser WHERE configId = ?");

		try {
			ps.setLong(1, requestId);
			ps.setLong(2, assignedByUserId);
			ps.setTimestamp(3, now);
			ps.setLong(4, configId);
			return ps.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private void _insertFollowers(
			Connection con, long requestId, JSONArray followerIds, Timestamp now)
		throws Exception {

		if (followerIds == null || followerIds.length() == 0) {
			return;
		}

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_SupportRequestFollower " +
			"(requestId, userId, createDate) VALUES (?, ?, ?)");

		try {
			Set<Long> seen = new HashSet<>();

			for (int i = 0; i < followerIds.length(); i++) {
				long userId = followerIds.getLong(i);

				if (!seen.add(Long.valueOf(userId))) {
					continue;
				}

				ps.setLong(1, requestId);
				ps.setLong(2, userId);
				ps.setTimestamp(3, now);
				ps.addBatch();
			}

			ps.executeBatch();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private void _insertAttachments(
			Connection con, long requestId, JSONArray attachments, Timestamp now)
		throws Exception {

		if (attachments == null || attachments.length() == 0) {
			return;
		}

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_SupportRequestAttachment " +
			"(requestId, fileName, contentType, fileSize, fileContent, createDate) " +
			"VALUES (?, ?, ?, ?, ?, ?)");

		try {
			for (int i = 0; i < attachments.length(); i++) {
				JSONObject attachment = attachments.getJSONObject(i);
				byte[] content = Base64.getDecoder().decode(
					attachment.getString("base64Content"));

				ps.setLong(1, requestId);
				ps.setString(2, _trim(attachment.getString("fileName")));
				ps.setString(3, _trim(attachment.getString("contentType")));
				ps.setLong(4, content.length);
				ps.setBytes(5, content);
				ps.setTimestamp(6, now);
				ps.addBatch();
			}

			ps.executeBatch();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private void _validateFollowers(
			Connection con, long companyId, JSONArray followerIds)
		throws Exception {

		if (followerIds == null) {
			return;
		}

		Set<Long> seen = new HashSet<>();

		for (int i = 0; i < followerIds.length(); i++) {
			long userId = followerIds.getLong(i);

			if (userId <= 0 || !seen.add(Long.valueOf(userId)) ||
				!_isActiveCompanyUser(con, companyId, userId)) {

				throw new IllegalArgumentException(
					"Danh sách người theo dõi không hợp lệ.");
			}
		}
	}

	private void _validateAttachments(JSONArray attachments) {
		if (attachments == null) {
			return;
		}

		long totalSize = 0;

		for (int i = 0; i < attachments.length(); i++) {
			JSONObject attachment = attachments.getJSONObject(i);

			if (attachment == null ||
				_trim(attachment.getString("fileName")).isEmpty()) {

				throw new IllegalArgumentException("Tệp đính kèm không hợp lệ.");
			}

			byte[] content;

			try {
				content = Base64.getDecoder().decode(
					attachment.getString("base64Content"));
			}
			catch (Exception e) {
				throw new IllegalArgumentException("Nội dung tệp đính kèm không hợp lệ.");
			}

			if (content.length > _MAX_ATTACHMENT_SIZE) {
				throw new IllegalArgumentException(
					"Mỗi tệp đính kèm không được vượt quá 10 MB.");
			}

			totalSize += content.length;

			if (totalSize > _MAX_TOTAL_ATTACHMENT_SIZE) {
				throw new IllegalArgumentException(
					"Tổng dung lượng tệp đính kèm không được vượt quá 20 MB.");
			}
		}
	}

	private String _buildRequestCreatedEmailBody(
		HttpServletRequest request, JSONObject createdRequest) {

		String requestUrl = PortalUtil.getPortalURL(request) +
			"/web/intranet/quy-trinh-yeu-cau-ho-tro";
		String content = _trim(createdRequest.getString("content"));

		if (content.length() > _MAIL_CONTENT_MAX_LENGTH) {
			content = content.substring(0, _MAIL_CONTENT_MAX_LENGTH) + "…";
		}

		StringBuilder body = new StringBuilder();

		body.append("<div style=\"font-family:Arial,sans-serif;color:#1f2937;" +
			"line-height:1.6\">");
		body.append("<p>Kính gửi Anh/Chị,</p>");
		body.append("<p>Một yêu cầu hỗ trợ mới đã được tạo và chuyển đến " +
			"những người xử lý được chỉ định.</p>");
		body.append("<table style=\"border-collapse:collapse;width:100%;" +
			"max-width:760px\">");
		_appendEmailRow(
			body, "Mã yêu cầu", createdRequest.getString("requestCode"));
		_appendEmailRow(
			body, "Loại yêu cầu",
			_requestTypeLabel(createdRequest.getString("requestTypeKey")));
		_appendEmailRow(body, "Tiêu đề", createdRequest.getString("title"));
		_appendEmailRow(
			body, "Mức độ", _priorityLabel(
				createdRequest.getString("priority")));
		_appendEmailRow(
			body, "Người tạo", createdRequest.getString("creatorUserName"));
		_appendEmailRow(
			body, "Thời gian tạo", createdRequest.getString("createDate"));

		if (!content.isEmpty()) {
			_appendEmailRow(
				body, "Nội dung",
				HtmlUtil.escape(content).replace("\r\n", "<br />").replace(
					"\n", "<br />"),
				true);
		}

		body.append("</table>");
		body.append("<p style=\"margin-top:20px\"><a href=\"");
		body.append(HtmlUtil.escape(requestUrl));
		body.append("\" style=\"background:#0090cf;color:#fff;" +
			"text-decoration:none;padding:10px 18px;border-radius:4px;" +
			"display:inline-block\">Xem danh sách yêu cầu hỗ trợ</a></p>");
		body.append("<p style=\"color:#6b7280;font-size:13px\">Đây là email " +
			"được gửi tự động từ hệ thống Intranet VEC.</p>");
		body.append("</div>");

		return body.toString();
	}

	private void _appendEmailRow(
		StringBuilder body, String label, String value) {

		_appendEmailRow(body, label, value, false);
	}

	private void _appendEmailRow(
		StringBuilder body, String label, String value, boolean htmlValue) {

		body.append("<tr><td style=\"border:1px solid #d1d5db;padding:8px 12px;" +
			"font-weight:600;width:150px;background:#f3f4f6\">");
		body.append(HtmlUtil.escape(label));
		body.append("</td><td style=\"border:1px solid #d1d5db;" +
			"padding:8px 12px\">");
		body.append(htmlValue ? value : HtmlUtil.escape(_trim(value)));
		body.append("</td></tr>");
	}

	private InternetAddress _createInternetAddress(
		String emailAddress, String personalName) {

		String normalizedEmailAddress = _trim(emailAddress);

		if (normalizedEmailAddress.isEmpty()) {
			return null;
		}

		try {
			InternetAddress internetAddress = new InternetAddress(
				normalizedEmailAddress, _trim(personalName),
				StandardCharsets.UTF_8.name());

			internetAddress.validate();

			return internetAddress;
		}
		catch (Exception e) {
			_log.warn("Invalid support notification email address: " +
				normalizedEmailAddress);

			return null;
		}
	}

	private String _priorityLabel(String priority) {
		switch (_trim(priority)) {
			case "khan":
				return "Khẩn";
			case "rat-khan":
				return "Rất khẩn";
			default:
				return "Thường";
		}
	}

	private String _requestTypeLabel(String requestTypeKey) {
		switch (_trim(requestTypeKey)) {
			case "gop-y-cai-tien":
				return "Góp ý cải tiến";
			case "ho-tro-dao-tao-hdsd":
				return "Hỗ trợ đào tạo - HDSD";
			case "ho-tro-hoi-nghi-truyen-hinh":
				return "Hỗ trợ hội nghị truyền hình";
			case "yc-cap-tai-khoan-quyen-truy-cap":
				return "YC cấp tài khoản & quyền truy cập";
			case "yc-ho-tro-phan-mem":
				return "YC hỗ trợ phần mềm";
			case "yc-kiem-tra-may-nang-cap-ssd":
				return "YC kiểm tra máy, nâng cấp SSD";
			case "yc-su-co-ket-noi-mang":
				return "YC sự cố kết nối mạng";
			case "yc-sua-chua-khac-phuc-thiet-bi-cntt":
				return "YC sửa chữa, khắc phục thiết bị CNTT";
			default:
				return requestTypeKey;
		}
	}

	private void _sendRequestCreatedEmail(
		HttpServletRequest request, JSONObject createdRequest, User creator) {

		if (createdRequest == null) {
			_log.warn(
				"A support request was created but its notification data " +
					"could not be loaded");

			return;
		}

		try {
			JSONArray handlers = createdRequest.getJSONArray("handlers");
			List<InternetAddress> toAddresses = new ArrayList<>();
			Set<String> seenEmailAddresses = new HashSet<>();

			if (handlers != null) {
				for (int i = 0; i < handlers.length(); i++) {
					JSONObject handler = handlers.getJSONObject(i);
					String emailAddress = _trim(
						handler.getString("emailAddress"));
					String normalizedEmailAddress = emailAddress.toLowerCase(
						Locale.ROOT);

					if (normalizedEmailAddress.isEmpty() ||
						!seenEmailAddresses.add(normalizedEmailAddress)) {

						continue;
					}

					InternetAddress toAddress = _createInternetAddress(
						emailAddress, handler.getString("fullName"));

					if (toAddress != null) {
						toAddresses.add(toAddress);
					}
				}
			}

			if (toAddresses.isEmpty()) {
				_log.warn(
					"Support request " +
						createdRequest.getString("requestCode") +
						" was created but no handler has a valid email address");

				return;
			}

			long companyId = creator.getCompanyId();
			InternetAddress fromAddress = _createInternetAddress(
				PrefsPropsUtil.getString(
					companyId, PropsKeys.ADMIN_EMAIL_FROM_ADDRESS),
				PrefsPropsUtil.getString(
					companyId, PropsKeys.ADMIN_EMAIL_FROM_NAME));

			if (fromAddress == null) {
				_log.warn(
					"Support request " +
						createdRequest.getString("requestCode") +
						" was created but Liferay sender email is invalid");

				return;
			}

			MailMessage mailMessage = new MailMessage();

			mailMessage.setFrom(fromAddress);
			mailMessage.setTo(
				toAddresses.toArray(new InternetAddress[toAddresses.size()]));

			InternetAddress creatorAddress = _createInternetAddress(
				creator.getEmailAddress(), creator.getFullName());

			if (creatorAddress != null) {
				mailMessage.setCC(creatorAddress);
			}
			else {
				_log.warn(
					"Support request " +
						createdRequest.getString("requestCode") +
						" was created but creator has no valid email address");
			}

			String subjectTitle = _trim(createdRequest.getString("title"))
				.replaceAll("[\\r\\n]+", " ");

			mailMessage.setSubject(
				"[Yêu cầu hỗ trợ] " +
					createdRequest.getString("requestCode") + " - " + subjectTitle);
			mailMessage.setBody(
				_buildRequestCreatedEmailBody(request, createdRequest));
			mailMessage.setHTMLFormat(true);

			MailServiceUtil.sendEmail(mailMessage);

			_log.info(
				"Queued creation email for support request " +
					createdRequest.getString("requestCode") + " to " +
					toAddresses.size() + " handler(s)");
		}
		catch (Exception e) {
			_log.error(
				"Support request " +
					createdRequest.getString("requestCode") +
					" was created but notification email could not be sent: " +
					e.getMessage(),
				e);
		}
	}

	private long _getConfigurationId(
			Connection con, long companyId, String processKey,
			String requestTypeKey)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT configId FROM VEC_SupportHandlerConfig " +
			"WHERE companyId = ? AND processKey = ? AND requestTypeKey = ?");

		try {
			ps.setLong(1, companyId);
			ps.setString(2, processKey);
			ps.setString(3, requestTypeKey);
			ResultSet rs = ps.executeQuery();

			try {
				return rs.next() ? rs.getLong(1) : 0;
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private int _countConfigurationUsers(Connection con, long configId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_SupportHandlerConfigUser " +
			"WHERE configId = ?");

		try {
			ps.setLong(1, configId);
			ResultSet rs = ps.executeQuery();

			try {
				return rs.next() ? rs.getInt(1) : 0;
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private String _getRequestStatus(
			Connection con, long requestId, long companyId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT status FROM VEC_SupportRequest " +
			"WHERE requestId = ? AND companyId = ?");

		try {
			ps.setLong(1, requestId);
			ps.setLong(2, companyId);
			ResultSet rs = ps.executeQuery();

			try {
				return rs.next() ? _trim(rs.getString("status")) : "";
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private boolean _isAssignedHandler(
			Connection con, long requestId, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_SupportRequestHandler " +
			"WHERE requestId = ? AND userId = ?");

		try {
			ps.setLong(1, requestId);
			ps.setLong(2, userId);
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

	private void _updateRequestStatus(
			Connection con, long requestId, String status, Timestamp now)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"UPDATE VEC_SupportRequest SET status = ?, modifiedDate = ? " +
			"WHERE requestId = ?");

		try {
			ps.setString(1, status);
			ps.setTimestamp(2, now);
			ps.setLong(3, requestId);
			ps.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private void _insertStatusHistory(
			Connection con, long requestId, String fromStatus, String toStatus,
			User user, Timestamp now)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_SupportRequestStatusHistory " +
			"(requestId, fromStatus, toStatus, changedByUserId, " +
			"changedByUserName, createDate) VALUES (?, ?, ?, ?, ?, ?)");

		try {
			ps.setLong(1, requestId);
			ps.setString(2, fromStatus);
			ps.setString(3, toStatus);
			ps.setLong(4, user.getUserId());
			ps.setString(5, user.getFullName());
			ps.setTimestamp(6, now);
			ps.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private boolean _isActiveCompanyUser(
			Connection con, long companyId, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM User_ WHERE companyId = ? " +
			"AND userId = ? AND status = 0");

		try {
			ps.setLong(1, companyId);
			ps.setLong(2, userId);
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

	private int _bindParameters(
			PreparedStatement ps, int startIndex, List<Object> parameters)
		throws Exception {

		int index = startIndex;

		for (Object value : parameters) {
			if (value instanceof Long) {
				ps.setLong(index++, ((Long)value).longValue());
			}
			else if (value instanceof Timestamp) {
				ps.setTimestamp(index++, (Timestamp)value);
			}
			else {
				ps.setString(index++, String.valueOf(value));
			}
		}

		return index;
	}

	private void _appendStringFilter(
		StringBuilder where, List<Object> parameters, String column,
		String value) {

		String normalizedValue = _trim(value);

		if (!normalizedValue.isEmpty() && !"all".equals(normalizedValue)) {
			where.append("AND ").append(column).append(" = ? ");
			parameters.add(normalizedValue);
		}
	}

	private void _appendDateFilter(
		StringBuilder where, List<Object> parameters, String column,
		String operator, String value, boolean endOfDay) {

		String normalizedValue = _trim(value);

		if (normalizedValue.isEmpty()) {
			return;
		}

		Timestamp timestamp = _parseTimestamp(
			normalizedValue + (endOfDay ? " 23:59:59" : " 00:00:00"));

		if (timestamp == null) {
			throw new IllegalArgumentException("Khoảng ngày lọc không hợp lệ.");
		}

		where.append("AND ").append(column).append(" ").append(operator)
			.append(" ? ");
		parameters.add(timestamp);
	}

	private long _getScopeGroupId(HttpServletRequest request) {
		try {
			return PortalUtil.getScopeGroupId(request);
		}
		catch (Exception e) {
			return 0;
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

			User user = UserLocalServiceUtil.fetchUser(Long.parseLong(name));

			return user == null || user.isGuestUser() ? null : user;
		}
		catch (Exception e) {
			return null;
		}
	}

	private JSONObject _toUserJSONObject(ResultSet rs, String userIdColumn)
		throws Exception {

		JSONObject user = JSONFactoryUtil.createJSONObject();
		String screenName = _trim(rs.getString("screenName"));
		String fullName = (_trim(rs.getString("firstName")) + " " +
			_trim(rs.getString("middleName")) + " " +
			_trim(rs.getString("lastName"))).replaceAll("\\s+", " ").trim();

		user.put("userId", rs.getLong(userIdColumn));
		user.put("screenName", screenName);
		user.put("emailAddress", _trim(rs.getString("emailAddress")));
		user.put("fullName", fullName.isEmpty() ? screenName : fullName);

		return user;
	}

	private boolean _isValidRequestType(
		String processKey, String requestTypeKey) {

		return _PROCESS_KEY.equals(processKey) &&
			_REQUEST_TYPE_KEYS.contains(requestTypeKey);
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

	private Timestamp _parseTimestamp(String value) {
		String normalizedValue = _trim(value).replace('T', ' ');

		if (normalizedValue.isEmpty()) {
			return null;
		}

		if (normalizedValue.length() == 10) {
			normalizedValue += " 00:00:00";
		}
		else if (normalizedValue.length() == 16) {
			normalizedValue += ":00";
		}

		try {
			return Timestamp.valueOf(normalizedValue);
		}
		catch (Exception e) {
			return null;
		}
	}

	private String _joinStrings(JSONArray values) {
		if (values == null) {
			return "";
		}

		StringBuilder result = new StringBuilder();

		for (int i = 0; i < values.length(); i++) {
			String value = _trim(values.getString(i));

			if (value.isEmpty()) {
				continue;
			}

			if (result.length() > 0) {
				result.append(',');
			}

			result.append(value);
		}

		return result.toString();
	}

	private String _requestCode(long requestId, Timestamp createDate) {
		Timestamp date = createDate == null ? _now() : createDate;

		return String.format("YC-%tY-%06d", date, Long.valueOf(requestId));
	}

	private String _timestamp(Timestamp timestamp) {
		return timestamp == null ? "" : timestamp.toString();
	}

	private String _trim(String value) {
		return value == null ? "" : value.trim();
	}

	private Timestamp _now() {
		return new Timestamp(System.currentTimeMillis());
	}

	private Response _ok(JSONObject object) {
		return _cors(
			Response.ok(object.toString(), MediaType.APPLICATION_JSON)
		).build();
	}

	private Response _created(JSONObject object) {
		return _cors(
			Response.status(Response.Status.CREATED)
				.type(MediaType.APPLICATION_JSON)
				.entity(object.toString())
		).build();
	}

	private Response _badRequest(String message) {
		return _error(Response.Status.BAD_REQUEST, message);
	}

	private Response _notFound(String message) {
		return _error(Response.Status.NOT_FOUND, message);
	}

	private Response _forbidden(String message) {
		return _error(Response.Status.FORBIDDEN, message);
	}

	private Response _unauthorized() {
		return _error(
			Response.Status.UNAUTHORIZED,
			"Bạn cần đăng nhập để sử dụng chức năng này.");
	}

	private Response _serverError() {
		return _error(
			Response.Status.INTERNAL_SERVER_ERROR,
			"Máy chủ đang gặp lỗi. Vui lòng thử lại sau.");
	}

	private Response _error(Response.Status status, String message) {
		JSONObject error = JSONFactoryUtil.createJSONObject();

		error.put("error", message);

		return _cors(
			Response.status(status)
				.type(MediaType.APPLICATION_JSON)
				.entity(error.toString())
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
	private static final int _MAIL_CONTENT_MAX_LENGTH = 1000;
	private static final long _MAX_ATTACHMENT_SIZE = 10L * 1024L * 1024L;
	private static final long _MAX_TOTAL_ATTACHMENT_SIZE = 20L * 1024L * 1024L;

	private static final String _PENDING_STATUS = "cho-xu-ly";
	private static final String _PROCESS_KEY = "dich-vu-cntt";

	private static final Set<String> _PRIORITIES = new HashSet<>(
		Arrays.asList("thuong", "khan", "rat-khan"));
	private static final Set<String> _STATUSES = new HashSet<>(
		Arrays.asList("cho-xu-ly", "dang-xu-ly", "hoan-thanh", "huy"));
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
		SupportRequestResource.class);

}
