package vn.vec.custom.admin.survey;

import com.liferay.mail.kernel.model.MailMessage;
import com.liferay.mail.kernel.service.MailServiceUtil;
import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.HtmlUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.PrefsPropsUtil;
import com.liferay.portal.kernel.util.PropsKeys;

import java.nio.charset.StandardCharsets;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.mail.internet.InternetAddress;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import javax.servlet.http.HttpServletRequest;

@Path("/")
public class SurveyResource {

	@GET
	@Path("/surveys")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listSurveys(
		@Context HttpServletRequest request,
		@QueryParam("search") String search,
		@QueryParam("status") String status,
		@QueryParam("filter") @DefaultValue("all") String filter,
		@QueryParam("state") @DefaultValue("all") String state,
		@QueryParam("orderBy") @DefaultValue("desc") String orderBy,
		@QueryParam("page") @DefaultValue("1") int page,
		@QueryParam("pageSize") @DefaultValue("12") int pageSize) {

		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		page = Math.max(page, 1);
		pageSize = Math.max(1, Math.min(pageSize, 100));

		boolean hasSearch = search != null && !search.trim().isEmpty();
		boolean hasStatus = status != null && !status.trim().isEmpty();
		String normalizedFilter = _normalizeSurveyFilter(filter);
		String normalizedState = _normalizeSurveyState(state);
		String order = "asc".equalsIgnoreCase(orderBy) ? "ASC" : "DESC";

		String where = "WHERE s.status != 'DELETED' ";

		if (hasSearch) {
			where += "AND s.title LIKE ? ";
		}

		if (hasStatus) {
			where += "AND s.status = ? ";
		}

		if ("active".equals(normalizedState)) {
			where += "AND s.status = 'ACTIVE' " +
				"AND (s.startDate IS NULL OR s.startDate <= ?) " +
				"AND (s.endDate IS NULL OR s.endDate >= ?) ";
		}
		else if ("expired".equals(normalizedState)) {
			where += "AND (s.status != 'ACTIVE' " +
				"OR (s.endDate IS NOT NULL AND s.endDate < ?)) ";
		}

		if ("my_surveys".equals(normalizedFilter)) {
			where += "AND s.userId = ? ";
		}
		else if ("invited".equals(normalizedFilter)) {
			where +=
				"AND EXISTS (" +
				" SELECT 1 FROM VEC_InternalSurveyParticipant p " +
				" WHERE p.surveyId = s.surveyId AND (" +
				"  p.scopeType = 'ALL' OR " +
				"  (p.scopeType = 'USER' AND p.userId = ?) OR " +
				"  (p.scopeType IN ('ORGANIZATION', 'DEPARTMENT') AND EXISTS (" +
				"   SELECT 1 FROM Users_Orgs uo LEFT JOIN Organization_ o " +
				"   ON uo.organizationId = o.organizationId " +
				"   WHERE uo.userId = ? AND (" +
				"    uo.organizationId = p.organizationId OR " +
				"    uo.organizationId = p.departmentId OR " +
				"    (p.organizationId > 0 AND o.treePath LIKE " +
				"     CONCAT('%/', p.organizationId, '/%')) OR " +
				"    (p.departmentId > 0 AND o.treePath LIKE " +
				"     CONCAT('%/', p.departmentId, '/%'))" +
				"   )" +
				"  ))" +
				" )" +
				") ";
		}

		try {
			Connection con = DataAccess.getConnection();

			try {
				_logSurveyListRequest(
					con, request, userId, normalizedFilter, normalizedState, order,
					status, search, page, pageSize);

				String databaseNow = _vnNow();
				boolean isAdmin = _isAdminUser(userId);
				int total = _countSurveys(
					con, where, search, status, hasSearch, hasStatus,
					normalizedState, databaseNow, normalizedFilter, userId);
				JSONArray items = JSONFactoryUtil.createJSONArray();
				PreparedStatement ps = con.prepareStatement(
					"SELECT s.* FROM VEC_InternalSurvey s " + where +
					"ORDER BY s.createDate " + order + " LIMIT ? OFFSET ?");

				try {
					int idx = _bindSurveyFilters(
						ps, search, status, hasSearch, hasStatus,
						normalizedState, databaseNow, normalizedFilter, userId);
					ps.setInt(idx++, pageSize);
					ps.setInt(idx, (page - 1) * pageSize);

					ResultSet rs = ps.executeQuery();

					try {
						while (rs.next()) {
							items.put(
								_toSurveyJson(
									con, rs, userId, isAdmin, databaseNow));
						}
					}
					finally {
						DataAccess.cleanUp(rs);
					}
				}
				finally {
					DataAccess.cleanUp(ps);
				}

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("total", total);
				result.put("page", page);
				result.put("pageSize", pageSize);
				result.put("items", items);

				if (_log.isInfoEnabled()) {
					_log.info(
						"Survey API list result: userId=" + userId +
							", filter=" + normalizedFilter + ", state=" +
								normalizedState + ", total=" + total +
									", returned=" + items.length() + ", page=" +
										page + ", pageSize=" + pageSize);
				}

				return _ok(result);
			}
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error("Error listing surveys: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@GET
	@Path("/surveys/{surveyId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSurvey(
		@Context HttpServletRequest request,
		@PathParam("surveyId") long surveyId) {

		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		try {
			Connection con = DataAccess.getConnection();

			try {
				String databaseNow = _vnNow();
				boolean isAdmin = _isAdminUser(userId);
				PreparedStatement ps = con.prepareStatement(
					"SELECT * FROM VEC_InternalSurvey WHERE surveyId = ? AND status != 'DELETED'");

				try {
					ps.setLong(1, surveyId);

					ResultSet rs = ps.executeQuery();

					try {
						if (!rs.next()) {
							return _notFound("Survey not found");
						}

						return _ok(
							_toSurveyJson(con, rs, userId, isAdmin, databaseNow));
					}
					finally {
						DataAccess.cleanUp(rs);
					}
				}
				finally {
					DataAccess.cleanUp(ps);
				}
			}
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error("Error getting survey " + surveyId + ": " + e.getMessage(), e);

			return _serverError();
		}
	}

	@POST
	@Path("/surveys")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createSurvey(
		@Context HttpServletRequest request, String body) {

		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		try {
			JSONObject payload = JSONFactoryUtil.createJSONObject(body);
			String title = payload.getString("title", "").trim();

			if (title.isEmpty()) {
				return _badRequest("title is required");
			}

			JSONArray options = payload.getJSONArray("options");

			if (options == null || options.length() < 2) {
				return _badRequest("At least two options are required");
			}

			Connection con = DataAccess.getConnection();

			try {
				con.setAutoCommit(false);

				long surveyId = _insertSurvey(con, payload, userId, title);

				_replaceOptions(con, surveyId, options);
				_replaceParticipants(con, surveyId, payload);

				con.commit();

				_sendSurveyInvitationEmails(con, surveyId, userId, title, payload);

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("surveyId", surveyId);

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
			_log.error("Error creating survey: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@PUT
	@Path("/surveys/{surveyId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response updateSurvey(
		@Context HttpServletRequest request,
		@PathParam("surveyId") long surveyId, String body) {

		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		try {
			JSONObject payload = JSONFactoryUtil.createJSONObject(body);
			String title = payload.getString("title", "").trim();

			if (title.isEmpty()) {
				return _badRequest("title is required");
			}

			JSONArray options = payload.getJSONArray("options");

			if (options == null || options.length() < 2) {
				return _badRequest("At least two options are required");
			}

			Connection con = DataAccess.getConnection();

			try {
				if (!_surveyExists(con, surveyId)) {
					return _notFound("Survey not found");
				}

				if (!_canManageSurvey(con, surveyId, userId)) {
					return _forbidden("Bạn không có quyền chỉnh sửa cuộc bình chọn này.");
				}

				if (_hasAnyVote(con, surveyId)) {
					return _badRequest("Không thể chỉnh sửa cuộc bình chọn đã có người tham gia.");
				}

				con.setAutoCommit(false);
				_updateSurvey(con, surveyId, payload, title);
				_replaceOptions(con, surveyId, options);
				_replaceParticipants(con, surveyId, payload);
				con.commit();

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("surveyId", surveyId);

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
			_log.error("Error updating survey " + surveyId + ": " + e.getMessage(), e);

			return _serverError();
		}
	}

	@DELETE
	@Path("/surveys/{surveyId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response deleteSurvey(
		@Context HttpServletRequest request,
		@PathParam("surveyId") long surveyId) {

		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		try {
			Connection con = DataAccess.getConnection();

			try {
				if (!_surveyExists(con, surveyId)) {
					return _notFound("Survey not found");
				}

				if (!_canManageSurvey(con, surveyId, userId)) {
					return _forbidden("Bạn không có quyền xóa cuộc bình chọn này.");
				}

				PreparedStatement ps = con.prepareStatement(
					"UPDATE VEC_InternalSurvey SET status = 'DELETED', modifiedDate = ? " +
					"WHERE surveyId = ?");

				try {
					ps.setString(1, _vnNow());
					ps.setLong(2, surveyId);

					if (ps.executeUpdate() == 0) {
						return _notFound("Survey not found");
					}
				}
				finally {
					DataAccess.cleanUp(ps);
				}

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("deleted", true);

				return _ok(result);
			}
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error("Error deleting survey " + surveyId + ": " + e.getMessage(), e);

			return _serverError();
		}
	}

	@POST
	@Path("/surveys/{surveyId}/end")
	@Produces(MediaType.APPLICATION_JSON)
	public Response endSurvey(
		@Context HttpServletRequest request,
		@PathParam("surveyId") long surveyId) {

		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		try {
			Connection con = DataAccess.getConnection();

			try {
				JSONObject survey = _getSurveyConfig(con, surveyId);

				if (survey == null) {
					return _notFound("Survey not found");
				}

				if (!_canManageSurvey(con, surveyId, userId)) {
					return _forbidden("Bạn không có quyền kết thúc cuộc bình chọn này.");
				}

				if (!"ACTIVE".equalsIgnoreCase(survey.getString("status"))) {
					return _badRequest("Cuộc bình chọn đã kết thúc trước đó.");
				}

				PreparedStatement ps = con.prepareStatement(
					"UPDATE VEC_InternalSurvey SET status = 'ENDED', modifiedDate = ? " +
					"WHERE surveyId = ?");

				try {
					ps.setString(1, _vnNow());
					ps.setLong(2, surveyId);
					ps.executeUpdate();
				}
				finally {
					DataAccess.cleanUp(ps);
				}

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("ended", true);

				return _ok(result);
			}
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error("Error ending survey " + surveyId + ": " + e.getMessage(), e);

			return _serverError();
		}
	}

	@GET
	@Path("/surveys/{surveyId}/results")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getSurveyResults(
		@Context HttpServletRequest request,
		@PathParam("surveyId") long surveyId) {

		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		try {
			Connection con = DataAccess.getConnection();

			try {
				if (!_surveyExists(con, surveyId)) {
					return _notFound("Survey not found");
				}

				if (!_canManageSurvey(con, surveyId, userId)) {
					return _forbidden("Bạn không có quyền xem kết quả cuộc bình chọn này.");
				}

				JSONArray options = _getOptions(con, surveyId);
				Map<Long, JSONArray> votersByOption = _getVotersByOption(
					con, surveyId);

				for (int i = 0; i < options.length(); i++) {
					JSONObject option = options.getJSONObject(i);
					JSONArray voters = votersByOption.get(
						option.getLong("optionId"));

					option.put(
						"voters",
						voters != null ? voters :
							JSONFactoryUtil.createJSONArray());
				}

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("surveyId", surveyId);
				result.put("options", options);

				return _ok(result);
			}
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error(
				"Error getting survey results " + surveyId + ": " +
					e.getMessage(),
				e);

			return _serverError();
		}
	}

	@POST
	@Path("/surveys/{surveyId}/vote")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response vote(
		@Context HttpServletRequest request,
		@PathParam("surveyId") long surveyId, String body) {

		long userId = _getSignedInUserId(request);

		if (userId <= 0) {
			return _unauthorized();
		}

		try {
			JSONObject payload = JSONFactoryUtil.createJSONObject(body);
			JSONArray optionIds = payload.getJSONArray("optionIds");

			if (optionIds == null || optionIds.length() == 0) {
				return _badRequest("optionIds is required");
			}

			Connection con = DataAccess.getConnection();

			try {
				JSONObject survey = _getSurveyConfig(con, surveyId);

				if (survey == null) {
					return _notFound("Survey not found");
				}

				String unavailableReason = _getUnavailableVoteReason(survey);

				if (unavailableReason != null) {
					return _badRequest(unavailableReason);
				}

				if (!_canParticipate(con, surveyId, userId) &&
					!_canManageSurvey(con, surveyId, userId)) {

					return _forbidden("Bạn không nằm trong danh sách người tham gia bình chọn này.");
				}

				if (!survey.getBoolean("multipleChoice") && optionIds.length() > 1) {
					return _badRequest("Only one option is allowed");
				}

				con.setAutoCommit(false);
				_deleteUserVotes(con, surveyId, userId);

				UserContext userContext = _getUserContext(con, userId);

				for (int i = 0; i < optionIds.length(); i++) {
					long optionId = optionIds.getLong(i);

					if (!_optionBelongsToSurvey(con, surveyId, optionId)) {
						con.rollback();

						return _badRequest("Invalid optionId: " + optionId);
					}

					_insertVote(con, surveyId, optionId, userContext);
				}

				con.commit();

				JSONObject result = JSONFactoryUtil.createJSONObject();

				result.put("voted", true);

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
			_log.error("Error voting survey " + surveyId + ": " + e.getMessage(), e);

			return _serverError();
		}
	}

	@GET
	@Path("/organizations")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listOrganizations(
		@Context HttpServletRequest request,
		@QueryParam("parentOrganizationId") @DefaultValue("0") long parentOrganizationId,
		@QueryParam("search") String search) {

		if (_getSignedInUserId(request) <= 0) {
			return _unauthorized();
		}

		try {
			Connection con = DataAccess.getConnection();

			try {
				boolean hasSearch = search != null && !search.trim().isEmpty();
				PreparedStatement ps = con.prepareStatement(
					"SELECT organizationId, parentOrganizationId, name, type_ " +
					"FROM Organization_ WHERE parentOrganizationId = ? " +
					(hasSearch ? "AND name LIKE ? " : "") +
					"ORDER BY name ASC");

				try {
					ps.setLong(1, parentOrganizationId);

					if (hasSearch) {
						ps.setString(2, "%" + search.trim() + "%");
					}

					ResultSet rs = ps.executeQuery();
					JSONArray items = JSONFactoryUtil.createJSONArray();

					try {
						while (rs.next()) {
							JSONObject item = JSONFactoryUtil.createJSONObject();

							item.put("organizationId", rs.getLong("organizationId"));
							item.put("parentOrganizationId", rs.getLong("parentOrganizationId"));
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
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error("Error listing organizations: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@GET
	@Path("/users")
	@Produces(MediaType.APPLICATION_JSON)
	public Response listUsers(
		@Context HttpServletRequest request,
		@QueryParam("organizationId") long organizationId,
		@QueryParam("departmentId") long departmentId,
		@QueryParam("search") String search,
		@QueryParam("page") @DefaultValue("1") int page,
		@QueryParam("pageSize") @DefaultValue("50") int pageSize) {

		if (_getSignedInUserId(request) <= 0) {
			return _unauthorized();
		}

		page = Math.max(page, 1);
		pageSize = Math.max(1, Math.min(pageSize, 200));

		try {
			Connection con = DataAccess.getConnection();

			try {
				boolean hasSearch = search != null && !search.trim().isEmpty();
				String orgFilter = _buildUserOrganizationFilter(organizationId, departmentId);
				PreparedStatement ps = con.prepareStatement(
					"SELECT DISTINCT u.userId, u.screenName, u.emailAddress, " +
					"u.firstName, u.middleName, u.lastName " +
					"FROM User_ u " + orgFilter +
					"WHERE u.status = 0 " +
					(hasSearch ? "AND (u.screenName LIKE ? OR u.emailAddress LIKE ? " +
						"OR u.firstName LIKE ? OR u.lastName LIKE ?) " : "") +
					"ORDER BY u.lastName ASC, u.firstName ASC LIMIT ? OFFSET ?");

				try {
					int idx = 1;

					if (hasSearch) {
						String like = "%" + search.trim() + "%";
						ps.setString(idx++, like);
						ps.setString(idx++, like);
						ps.setString(idx++, like);
						ps.setString(idx++, like);
					}

					ps.setInt(idx++, pageSize);
					ps.setInt(idx, (page - 1) * pageSize);

					ResultSet rs = ps.executeQuery();
					JSONArray items = JSONFactoryUtil.createJSONArray();

					try {
						while (rs.next()) {
							JSONObject item = JSONFactoryUtil.createJSONObject();

							item.put("userId", rs.getLong("userId"));
							item.put("screenName", rs.getString("screenName"));
							item.put("emailAddress", rs.getString("emailAddress"));
							item.put("fullName", _fullName(rs));

							items.put(item);
						}
					}
					finally {
						DataAccess.cleanUp(rs);
					}

					JSONObject result = JSONFactoryUtil.createJSONObject();

					result.put("items", items);
					result.put("page", page);
					result.put("pageSize", pageSize);

					return _ok(result);
				}
				finally {
					DataAccess.cleanUp(ps);
				}
			}
			finally {
				DataAccess.cleanUp(con);
			}
		}
		catch (Exception e) {
			_log.error("Error listing users: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@OPTIONS
	@Path("{path: .*}")
	public Response options() {
		return _cors(Response.ok()).build();
	}

	private int _bindSurveyFilters(
			PreparedStatement ps, String search, String status,
			boolean hasSearch, boolean hasStatus, String state, String now,
			String filter, long userId)
		throws Exception {

		int idx = 1;

		if (hasSearch) {
			ps.setString(idx++, "%" + search.trim() + "%");
		}

		if (hasStatus) {
			ps.setString(idx++, status.trim());
		}

		if ("active".equals(state)) {
			ps.setString(idx++, now);
			ps.setString(idx++, now);
		}
		else if ("expired".equals(state)) {
			ps.setString(idx++, now);
		}

		if ("my_surveys".equals(filter)) {
			ps.setLong(idx++, userId);
		}
		else if ("invited".equals(filter)) {
			ps.setLong(idx++, userId);
			ps.setLong(idx++, userId);
		}

		return idx;
	}

	private String _normalizeSurveyFilter(String filter) {
		if ("invited".equals(filter) || "my_surveys".equals(filter)) {
			return filter;
		}

		return "all";
	}

	private String _normalizeSurveyState(String state) {
		if ("active".equals(state) || "expired".equals(state)) {
			return state;
		}

		return "all";
	}

	private String _buildUserOrganizationFilter(long organizationId, long departmentId) {
		long rootOrganizationId = departmentId > 0 ?
			departmentId : organizationId;

		if (rootOrganizationId > 0) {
			return "INNER JOIN Users_Orgs uo ON u.userId = uo.userId " +
				"INNER JOIN Organization_ o ON uo.organizationId = o.organizationId " +
				"AND (o.organizationId = " + rootOrganizationId +
				" OR o.treePath LIKE '%/" + rootOrganizationId + "/%') ";
		}

		return "";
	}

	private boolean _canParticipate(Connection con, long surveyId, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_InternalSurveyParticipant p " +
			"WHERE p.surveyId = ? AND (" +
			"p.scopeType = 'ALL' OR " +
			"(p.scopeType = 'USER' AND p.userId = ?) OR " +
			"(p.scopeType IN ('ORGANIZATION', 'DEPARTMENT') AND EXISTS (" +
			" SELECT 1 FROM Users_Orgs uo LEFT JOIN Organization_ o " +
			" ON uo.organizationId = o.organizationId " +
			" WHERE uo.userId = ? AND (" +
			"  uo.organizationId = p.organizationId OR " +
			"  uo.organizationId = p.departmentId OR " +
			"  (p.organizationId > 0 AND o.treePath LIKE " +
			"   CONCAT('%/', p.organizationId, '/%')) OR " +
			"  (p.departmentId > 0 AND o.treePath LIKE " +
			"   CONCAT('%/', p.departmentId, '/%'))" +
			" )))" +
			")");

		try {
			ps.setLong(1, surveyId);
			ps.setLong(2, userId);
			ps.setLong(3, userId);

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

	private void _logSurveyListRequest(
		Connection con, HttpServletRequest request, long userId, String filter,
		String state, String order, String status, String search, int page,
		int pageSize) {

		if (!_log.isInfoEnabled()) {
			return;
		}

		try {
			User user = UserLocalServiceUtil.fetchUser(userId);
			UserContext userContext = _getUserContext(con, userId);

			_log.info(
				"Survey API list request: userId=" + userId +
					", screenName=" + _safe(user == null ? "" : user.getScreenName()) +
					", emailAddress=" + _safe(user == null ? "" : user.getEmailAddress()) +
					", defaultUser=" + (user != null && user.isDefaultUser()) +
					", guestUser=" + (user != null && user.isGuestUser()) +
					", contextOrganizationId=" + userContext.organizationId +
					", contextDepartmentId=" + userContext.departmentId +
					", remoteUser=" + _safe(request == null ? "" : request.getRemoteUser()) +
					", requestUserPrincipal=" +
						_safe(
							request == null || request.getUserPrincipal() == null ?
								"" : request.getUserPrincipal().getName()) +
					", requestedSessionIdValid=" +
						(request != null && request.isRequestedSessionIdValid()) +
					", filter=" + filter + ", state=" + state + ", order=" + order +
					", status=" + _safe(status) + ", search=" + _safe(search) +
					", page=" + page + ", pageSize=" + pageSize);
		}
		catch (Exception e) {
			_log.info(
				"Survey API list request: userId=" + userId +
					", filter=" + filter + ", state=" + state +
					", page=" + page + ", pageSize=" + pageSize +
					", contextError=" + e.getMessage());
		}
	}

	private String _safe(String value) {
		if (value == null) {
			return "";
		}

		return value.replace('\n', ' ').replace('\r', ' ');
	}

	private boolean _isSurveyOwner(Connection con, long surveyId, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_InternalSurvey " +
			"WHERE surveyId = ? AND userId = ? AND status != 'DELETED'");

		try {
			ps.setLong(1, surveyId);
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

	private int _countSurveys(
			Connection con, String where, String search, String status,
			boolean hasSearch, boolean hasStatus, String state, String now,
			String filter, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_InternalSurvey s " + where);

		try {
			_bindSurveyFilters(
				ps, search, status, hasSearch, hasStatus, state, now, filter,
				userId);

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

	private void _deleteUserVotes(Connection con, long surveyId, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"DELETE FROM VEC_InternalSurveyVote WHERE surveyId = ? AND userId = ?");

		try {
			ps.setLong(1, surveyId);
			ps.setLong(2, userId);
			ps.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONObject _getSurveyConfig(Connection con, long surveyId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT surveyId, multipleChoice, status, startDate, endDate " +
			"FROM VEC_InternalSurvey WHERE surveyId = ? AND status != 'DELETED'");

		try {
			ps.setLong(1, surveyId);

			ResultSet rs = ps.executeQuery();

			try {
				if (!rs.next()) {
					return null;
				}

				JSONObject survey = JSONFactoryUtil.createJSONObject();

				survey.put("surveyId", rs.getLong("surveyId"));
				survey.put("multipleChoice", rs.getBoolean("multipleChoice"));
				survey.put("status", rs.getString("status"));
				survey.put("startDate", _formatDateTimeString(rs.getString("startDate")));
				survey.put("endDate", _formatDateTimeString(rs.getString("endDate")));
				survey.put("databaseNow", _vnNow());

				return survey;
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private UserContext _getUserContext(Connection con, long userId) throws Exception {
		UserContext context = new UserContext();
		context.userId = userId;

		PreparedStatement userPs = con.prepareStatement(
			"SELECT firstName, middleName, lastName, screenName FROM User_ WHERE userId = ?");

		try {
			userPs.setLong(1, userId);

			ResultSet rs = userPs.executeQuery();

			try {
				if (rs.next()) {
					String fullName = _fullName(rs);

					context.userName = fullName.isEmpty() ? rs.getString("screenName") : fullName;
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(userPs);
		}

		PreparedStatement orgPs = con.prepareStatement(
			"SELECT o.organizationId, o.parentOrganizationId, o.treePath " +
			"FROM Users_Orgs uo " +
			"INNER JOIN Organization_ o ON uo.organizationId = o.organizationId " +
			"WHERE uo.userId = ? ORDER BY o.parentOrganizationId DESC");

		try {
			orgPs.setLong(1, userId);

			ResultSet rs = orgPs.executeQuery();

			try {
				while (rs.next()) {
					long orgId = rs.getLong("organizationId");
					long parentOrgId = rs.getLong("parentOrganizationId");

					// treePath dạng /cấp1/cấp2/.../chínhNó/ nên user ở cấp sâu
					// hơn 2 vẫn được quy về organization=cấp 1, department=cấp 2
					long rootId = 0;
					long secondLevelId = 0;

					String treePath = rs.getString("treePath");

					if (treePath != null) {
						for (String part : treePath.split("/")) {
							if (part.isEmpty()) {
								continue;
							}

							long id;

							try {
								id = Long.parseLong(part.trim());
							}
							catch (NumberFormatException numberFormatException) {
								continue;
							}

							if (rootId == 0) {
								rootId = id;
							}
							else {
								secondLevelId = id;

								break;
							}
						}
					}

					if (rootId == 0) {
						rootId = (parentOrgId > 0) ? parentOrgId : orgId;
						secondLevelId = (parentOrgId > 0) ? orgId : 0;
					}

					if ((secondLevelId > 0) && (context.departmentId == 0)) {
						context.organizationId = rootId;
						context.departmentId = secondLevelId;
					}
					else if (context.organizationId == 0) {
						context.organizationId = rootId;
					}
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(orgPs);
		}

		return context;
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

	private boolean _isOpenSurvey(JSONObject survey) {
		return _getUnavailableVoteReason(survey) == null;
	}

	private String _getUnavailableVoteReason(JSONObject survey) {
		return _getUnavailableVoteReason(
			survey.getString("status"), survey.getString("startDate"),
			survey.getString("endDate"), survey.getString("databaseNow"));
	}

	private long _insertSurvey(
			Connection con, JSONObject payload, long userId, String title)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_InternalSurvey " +
			"(companyId, groupId, userId, userName, title, description, " +
			"multipleChoice, status, startDate, endDate, createDate, modifiedDate) " +
			"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			Statement.RETURN_GENERATED_KEYS);

		try {
			UserContext userContext = _getUserContext(con, userId);
			String now = _vnNow();

			ps.setLong(1, payload.getLong("companyId"));
			ps.setLong(2, payload.getLong("groupId"));
			ps.setLong(3, userId);
			ps.setString(4, userContext.userName);
			ps.setString(5, title);
			ps.setString(6, payload.getString("description", ""));
			ps.setBoolean(7, payload.getBoolean("multipleChoice"));
			ps.setString(8, payload.getString("status", "ACTIVE"));
			_setDateTime(ps, 9, _normalizeDateTime(payload.getString("startDate")));
			_setDateTime(ps, 10, _normalizeDateTime(payload.getString("endDate")));
			ps.setString(11, now);
			ps.setString(12, now);
			ps.executeUpdate();

			ResultSet rs = ps.getGeneratedKeys();

			try {
				if (rs.next()) {
					return rs.getLong(1);
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			throw new IllegalStateException("Cannot read generated surveyId");
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private void _insertVote(
			Connection con, long surveyId, long optionId, UserContext userContext)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_InternalSurveyVote " +
			"(surveyId, optionId, userId, userName, organizationId, departmentId, createDate) " +
			"VALUES (?, ?, ?, ?, ?, ?, ?)");

		try {
			ps.setLong(1, surveyId);
			ps.setLong(2, optionId);
			ps.setLong(3, userContext.userId);
			ps.setString(4, userContext.userName);
			ps.setLong(5, userContext.organizationId);
			ps.setLong(6, userContext.departmentId);
			ps.setString(7, _vnNow());
			ps.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private boolean _optionBelongsToSurvey(Connection con, long surveyId, long optionId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_InternalSurveyOption WHERE surveyId = ? AND optionId = ?");

		try {
			ps.setLong(1, surveyId);
			ps.setLong(2, optionId);

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

	private String _normalizeDateTime(String value) {
		if (value == null || value.trim().isEmpty()) {
			return null;
		}

		String normalized = value.trim().replace("T", " ").replace("Z", "");

		if (normalized.length() == 10) {
			normalized += " 00:00:00";
		}

		if (normalized.length() > 19) {
			normalized = normalized.substring(0, 19);
		}

		return normalized;
	}

	private void _setDateTime(PreparedStatement ps, int index, String value)
		throws Exception {

		if (value == null || value.isEmpty()) {
			ps.setNull(index, Types.TIMESTAMP);
		}
		else {
			ps.setString(index, value);
		}
	}

	private void _replaceOptions(Connection con, long surveyId, JSONArray options)
		throws Exception {

		PreparedStatement deleteVotePs = con.prepareStatement(
			"DELETE FROM VEC_InternalSurveyVote WHERE surveyId = ?");

		try {
			deleteVotePs.setLong(1, surveyId);
			deleteVotePs.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(deleteVotePs);
		}

		PreparedStatement deletePs = con.prepareStatement(
			"DELETE FROM VEC_InternalSurveyOption WHERE surveyId = ?");

		try {
			deletePs.setLong(1, surveyId);
			deletePs.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(deletePs);
		}

		PreparedStatement insertPs = con.prepareStatement(
			"INSERT INTO VEC_InternalSurveyOption " +
			"(surveyId, optionText, sortOrder, createDate, modifiedDate) " +
			"VALUES (?, ?, ?, ?, ?)");

		try {
			for (int i = 0; i < options.length(); i++) {
				String optionText;
				Object option = options.get(i);

				if (option instanceof JSONObject) {
					optionText = ((JSONObject)option).getString("optionText", "").trim();
				}
				else {
					optionText = String.valueOf(option).trim();
				}

				if (optionText.isEmpty()) {
					continue;
				}

				String now = _vnNow();

				insertPs.setLong(1, surveyId);
				insertPs.setString(2, optionText);
				insertPs.setInt(3, i);
				insertPs.setString(4, now);
				insertPs.setString(5, now);
				insertPs.addBatch();
			}

			insertPs.executeBatch();
		}
		finally {
			DataAccess.cleanUp(insertPs);
		}
	}

	private void _replaceParticipants(
			Connection con, long surveyId, JSONObject payload)
		throws Exception {

		PreparedStatement deletePs = con.prepareStatement(
			"DELETE FROM VEC_InternalSurveyParticipant WHERE surveyId = ?");

		try {
			deletePs.setLong(1, surveyId);
			deletePs.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(deletePs);
		}

		if (payload.getBoolean("allParticipants", true)) {
			_insertParticipant(con, surveyId, "ALL", 0, 0, 0);

			return;
		}

		_insertParticipantArray(
			con, surveyId, "ORGANIZATION", payload.getJSONArray("organizationIds"));
		_insertParticipantArray(
			con, surveyId, "DEPARTMENT", payload.getJSONArray("departmentIds"));
		_insertParticipantArray(
			con, surveyId, "USER", payload.getJSONArray("userIds"));
	}

	private void _insertParticipant(
			Connection con, long surveyId, String scopeType,
			long organizationId, long departmentId, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"INSERT INTO VEC_InternalSurveyParticipant " +
			"(surveyId, scopeType, organizationId, departmentId, userId, createDate) " +
			"VALUES (?, ?, ?, ?, ?, ?)");

		try {
			ps.setLong(1, surveyId);
			ps.setString(2, scopeType);
			ps.setLong(3, organizationId);
			ps.setLong(4, departmentId);
			ps.setLong(5, userId);
			ps.setString(6, _vnNow());
			ps.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private void _insertParticipantArray(
			Connection con, long surveyId, String scopeType, JSONArray ids)
		throws Exception {

		if (ids == null) {
			return;
		}

		for (int i = 0; i < ids.length(); i++) {
			long id = ids.getLong(i);

			if (id <= 0) {
				continue;
			}

			_insertParticipant(
				con, surveyId, scopeType,
				"ORGANIZATION".equals(scopeType) ? id : 0,
				"DEPARTMENT".equals(scopeType) ? id : 0,
				"USER".equals(scopeType) ? id : 0);
		}
	}

	private void _updateSurvey(
			Connection con, long surveyId, JSONObject payload, String title)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"UPDATE VEC_InternalSurvey SET title = ?, description = ?, " +
			"multipleChoice = ?, status = ?, startDate = ?, endDate = ?, modifiedDate = ? " +
			"WHERE surveyId = ?");

		try {
			ps.setString(1, title);
			ps.setString(2, payload.getString("description", ""));
			ps.setBoolean(3, payload.getBoolean("multipleChoice"));
			ps.setString(4, payload.getString("status", "ACTIVE"));
			_setDateTime(ps, 5, _normalizeDateTime(payload.getString("startDate")));
			_setDateTime(ps, 6, _normalizeDateTime(payload.getString("endDate")));
			ps.setString(7, _vnNow());
			ps.setLong(8, surveyId);
			ps.executeUpdate();
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private boolean _surveyExists(Connection con, long surveyId) throws Exception {
		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_InternalSurvey WHERE surveyId = ? AND status != 'DELETED'");

		try {
			ps.setLong(1, surveyId);

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

	private JSONObject _toSurveyJson(
			Connection con, ResultSet rs, long userId, boolean isAdmin,
			String databaseNow)
		throws Exception {

		long surveyId = rs.getLong("surveyId");
		String startDate = _formatDateTimeString(rs.getString("startDate"));
		String endDate = _formatDateTimeString(rs.getString("endDate"));
		JSONObject item = JSONFactoryUtil.createJSONObject();

		item.put("surveyId", surveyId);
		item.put("title", rs.getString("title"));
		item.put("description", rs.getString("description"));
		item.put("multipleChoice", rs.getBoolean("multipleChoice"));
		item.put("status", rs.getString("status"));
		item.put("userId", rs.getLong("userId"));
		item.put("userName", rs.getString("userName"));
		item.put("startDate", startDate);
		item.put("endDate", endDate);
		item.put("createDate", _format(rs.getTimestamp("createDate")));
		item.put("modifiedDate", _format(rs.getTimestamp("modifiedDate")));
		item.put(
			"votingOpen",
			_isVotingOpen(rs.getString("status"), startDate, endDate, databaseNow));
		item.put(
			"voteUnavailableReason",
			_getUnavailableVoteReason(
				rs.getString("status"), startDate, endDate, databaseNow));
		item.put("options", _getOptions(con, surveyId));
		item.put("participants", _getParticipants(con, surveyId));
		item.put("hasVoted", _hasVoted(con, surveyId, userId));
		item.put("votedOptions", _getVotedOptions(con, surveyId, userId));

		boolean isOwner = rs.getLong("userId") == userId;

		item.put(
			"canParticipate",
			isAdmin || isOwner || _canParticipate(con, surveyId, userId));
		item.put("canManage", isAdmin || isOwner);

		return item;
	}

	private JSONArray _getOptions(Connection con, long surveyId) throws Exception {
		PreparedStatement ps = con.prepareStatement(
			"SELECT o.optionId, o.optionText, o.sortOrder, COUNT(v.voteId) AS voteCount " +
			"FROM VEC_InternalSurveyOption o LEFT JOIN VEC_InternalSurveyVote v " +
			"ON o.optionId = v.optionId WHERE o.surveyId = ? " +
			"GROUP BY o.optionId, o.optionText, o.sortOrder ORDER BY o.sortOrder ASC");

		try {
			ps.setLong(1, surveyId);

			ResultSet rs = ps.executeQuery();
			JSONArray options = JSONFactoryUtil.createJSONArray();

			try {
				while (rs.next()) {
					JSONObject option = JSONFactoryUtil.createJSONObject();

					option.put("optionId", rs.getLong("optionId"));
					option.put("optionText", rs.getString("optionText"));
					option.put("sortOrder", rs.getInt("sortOrder"));
					option.put("voteCount", rs.getInt("voteCount"));

					options.put(option);
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			return options;
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONArray _getParticipants(Connection con, long surveyId) throws Exception {
		PreparedStatement ps = con.prepareStatement(
			"SELECT scopeType, organizationId, departmentId, userId " +
			"FROM VEC_InternalSurveyParticipant WHERE surveyId = ? ORDER BY participantId ASC");

		try {
			ps.setLong(1, surveyId);

			ResultSet rs = ps.executeQuery();
			JSONArray participants = JSONFactoryUtil.createJSONArray();

			try {
				while (rs.next()) {
					JSONObject participant = JSONFactoryUtil.createJSONObject();

					participant.put("scopeType", rs.getString("scopeType"));
					participant.put("organizationId", rs.getLong("organizationId"));
					participant.put("departmentId", rs.getLong("departmentId"));
					participant.put("userId", rs.getLong("userId"));

					participants.put(participant);
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			return participants;
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private JSONArray _getVotedOptions(Connection con, long surveyId, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT optionId FROM VEC_InternalSurveyVote " +
			"WHERE surveyId = ? AND userId = ? ORDER BY voteId ASC");

		try {
			ps.setLong(1, surveyId);
			ps.setLong(2, userId);

			ResultSet rs = ps.executeQuery();
			JSONArray optionIds = JSONFactoryUtil.createJSONArray();

			try {
				while (rs.next()) {
					optionIds.put(rs.getLong("optionId"));
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}

			return optionIds;
		}
		finally {
			DataAccess.cleanUp(ps);
		}
	}

	private boolean _hasVoted(Connection con, long surveyId, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_InternalSurveyVote WHERE surveyId = ? AND userId = ?");

		try {
			ps.setLong(1, surveyId);
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

	private boolean _isVotingOpen(
		String status, String startDate, String endDate, String databaseNow) {

		return _getUnavailableVoteReason(
			status, startDate, endDate, databaseNow) == null;
	}

	private String _getUnavailableVoteReason(
		String status, String startDate, String endDate, String databaseNow) {

		if ("ENDED".equalsIgnoreCase(status)) {
			return "Cuộc bình chọn đã kết thúc.";
		}

		if (!"ACTIVE".equalsIgnoreCase(status)) {
			return "Cuộc bình chọn không còn hoạt động.";
		}

		String now = _formatDateTimeString(databaseNow);

		if (!startDate.isEmpty() && !now.isEmpty() && now.compareTo(startDate) < 0) {
			return "Cuộc bình chọn chưa bắt đầu.";
		}

		if (!endDate.isEmpty() && !now.isEmpty() && now.compareTo(endDate) > 0) {
			return "Cuộc bình chọn đã kết thúc.";
		}

		return null;
	}

	private boolean _hasAnyVote(Connection con, long surveyId) throws Exception {
		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_InternalSurveyVote WHERE surveyId = ?");

		try {
			ps.setLong(1, surveyId);

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

	private String _format(Timestamp timestamp) {
		if (timestamp == null) {
			return "";
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		return sdf.format(timestamp);
	}

	private String _formatDateTimeString(String value) {
		if (value == null || value.trim().isEmpty()) {
			return "";
		}

		String normalized = value.trim().replace("T", " ").replace("Z", "");

		if (normalized.length() > 19) {
			normalized = normalized.substring(0, 19);
		}

		return normalized;
	}

	private String _fullName(ResultSet rs) throws Exception {
		String firstName = rs.getString("firstName");
		String middleName = rs.getString("middleName");
		String lastName = rs.getString("lastName");

		return ((firstName != null ? firstName : "") + " " +
			(middleName != null ? middleName : "") + " " +
			(lastName != null ? lastName : "")).replaceAll("\\s+", " ").trim();
	}

	private String _vnNow() {
		return LocalDateTime.now(_VN_ZONE).format(_DATE_TIME_FORMATTER);
	}

	private boolean _isAdminUser(long userId) {
		try {
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return false;
			}

			PermissionChecker permissionChecker =
				PermissionThreadLocal.getPermissionChecker();

			if ((permissionChecker != null) && permissionChecker.isOmniadmin()) {
				return true;
			}

			if ("admin".equalsIgnoreCase(user.getScreenName())) {
				return true;
			}

			for (Role role : user.getRoles()) {
				if ("Administrator".equalsIgnoreCase(role.getName())) {
					return true;
				}
			}
		}
		catch (Exception exception) {
		}

		return false;
	}

	private boolean _canManageSurvey(Connection con, long surveyId, long userId)
		throws Exception {

		return _isSurveyOwner(con, surveyId, userId) || _isAdminUser(userId);
	}

	private Map<Long, JSONArray> _getVotersByOption(Connection con, long surveyId)
		throws Exception {

		Map<Long, JSONArray> votersByOption = new HashMap<>();

		PreparedStatement ps = con.prepareStatement(
			"SELECT v.optionId, v.userId, v.userName, v.createDate, " +
			"od.name AS departmentName, oo.name AS organizationName " +
			"FROM VEC_InternalSurveyVote v " +
			"LEFT JOIN Organization_ od ON v.departmentId = od.organizationId " +
			"LEFT JOIN Organization_ oo ON v.organizationId = oo.organizationId " +
			"WHERE v.surveyId = ? ORDER BY v.createDate ASC, v.voteId ASC");

		try {
			ps.setLong(1, surveyId);

			ResultSet rs = ps.executeQuery();

			try {
				while (rs.next()) {
					long optionId = rs.getLong("optionId");
					JSONArray voters = votersByOption.get(optionId);

					if (voters == null) {
						voters = JSONFactoryUtil.createJSONArray();

						votersByOption.put(optionId, voters);
					}

					JSONObject voter = JSONFactoryUtil.createJSONObject();

					voter.put("userId", rs.getLong("userId"));
					voter.put("userName", rs.getString("userName"));
					voter.put(
						"departmentName",
						rs.getString("departmentName") != null ?
							rs.getString("departmentName") : "");
					voter.put(
						"organizationName",
						rs.getString("organizationName") != null ?
							rs.getString("organizationName") : "");
					voter.put(
						"votedAt",
						_formatDateTimeString(rs.getString("createDate")));

					voters.put(voter);
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}

		return votersByOption;
	}

	private void _sendSurveyInvitationEmails(
		Connection con, long surveyId, long creatorUserId, String title,
		JSONObject payload) {

		try {
			User creator = UserLocalServiceUtil.fetchUser(creatorUserId);

			if (creator == null) {
				return;
			}

			List<InternetAddress> recipients = _getSurveyInvitationRecipients(
				con, surveyId, creator);

			if (recipients.isEmpty()) {
				_log.info(
					"Survey " + surveyId +
						" was created but no participant has a valid email " +
							"address");

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
					"Survey " + surveyId +
						" was created but Liferay sender email is invalid");

				return;
			}

			String subject =
				"[Khảo sát nội bộ] " + title.replaceAll("[\\r\\n]+", " ");
			String body = _buildSurveyInvitationEmailBody(
				creator, title,
				_normalizeDateTime(payload.getString("startDate")),
				_normalizeDateTime(payload.getString("endDate")));

			for (int i = 0; i < recipients.size();
					i += _EMAIL_BCC_BATCH_SIZE) {

				List<InternetAddress> batch = recipients.subList(
					i, Math.min(i + _EMAIL_BCC_BATCH_SIZE, recipients.size()));

				MailMessage mailMessage = new MailMessage();

				mailMessage.setFrom(fromAddress);
				mailMessage.setTo(fromAddress);
				mailMessage.setBCC(
					batch.toArray(new InternetAddress[batch.size()]));
				mailMessage.setSubject(subject);
				mailMessage.setBody(body);
				mailMessage.setHTMLFormat(true);

				MailServiceUtil.sendEmail(mailMessage);
			}

			_log.info(
				"Queued invitation email for survey " + surveyId + " to " +
					recipients.size() + " participant(s)");
		}
		catch (Exception e) {
			_log.error(
				"Survey " + surveyId +
					" was created but invitation email could not be sent: " +
						e.getMessage(),
				e);
		}
	}

	private List<InternetAddress> _getSurveyInvitationRecipients(
			Connection con, long surveyId, User creator)
		throws Exception {

		List<InternetAddress> recipients = new ArrayList<>();
		Set<String> seenEmailAddresses = new HashSet<>();

		PreparedStatement ps = con.prepareStatement(
			"SELECT DISTINCT u.userId, u.emailAddress, u.firstName, " +
			"u.middleName, u.lastName FROM User_ u " +
			"WHERE u.status = 0 AND u.companyId = ? AND u.userId != ? " +
			"AND u.emailAddress IS NOT NULL AND u.emailAddress != '' " +
			"AND u.emailAddress NOT LIKE '%@liferay.com' " +
			"AND EXISTS (" +
			" SELECT 1 FROM VEC_InternalSurveyParticipant p " +
			" WHERE p.surveyId = ? AND (" +
			"  p.scopeType = 'ALL' OR " +
			"  (p.scopeType = 'USER' AND p.userId = u.userId) OR " +
			"  (p.scopeType IN ('ORGANIZATION', 'DEPARTMENT') AND EXISTS (" +
			"   SELECT 1 FROM Users_Orgs uo LEFT JOIN Organization_ o " +
			"   ON uo.organizationId = o.organizationId " +
			"   WHERE uo.userId = u.userId AND (" +
			"    uo.organizationId = p.organizationId OR " +
			"    uo.organizationId = p.departmentId OR " +
			"    (p.organizationId > 0 AND o.treePath LIKE " +
			"     CONCAT('%/', p.organizationId, '/%')) OR " +
			"    (p.departmentId > 0 AND o.treePath LIKE " +
			"     CONCAT('%/', p.departmentId, '/%'))" +
			"   )" +
			"  ))" +
			" ))");

		try {
			ps.setLong(1, creator.getCompanyId());
			ps.setLong(2, creator.getUserId());
			ps.setLong(3, surveyId);

			ResultSet rs = ps.executeQuery();

			try {
				while (rs.next()) {
					String emailAddress = rs.getString("emailAddress");

					if (emailAddress == null) {
						continue;
					}

					String normalizedEmailAddress = emailAddress.trim(
						).toLowerCase();

					if (normalizedEmailAddress.isEmpty() ||
						!seenEmailAddresses.add(normalizedEmailAddress)) {

						continue;
					}

					InternetAddress recipient = _createInternetAddress(
						emailAddress, _fullName(rs));

					if (recipient != null) {
						recipients.add(recipient);
					}
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}

		return recipients;
	}

	private String _buildSurveyInvitationEmailBody(
		User creator, String title, String startDate, String endDate) {

		StringBuilder body = new StringBuilder();

		body.append(
			"<div style=\"font-family:Arial,Helvetica,sans-serif;" +
				"font-size:14px;color:#1f2937;line-height:1.6\">");
		body.append("<p>Kính gửi Anh/Chị,</p>");
		body.append(
			"<p>Anh/Chị được mời tham gia cuộc bình chọn: <strong>");
		body.append(HtmlUtil.escape(title));
		body.append("</strong></p>");
		body.append("<p>Người tạo: <strong>");
		body.append(HtmlUtil.escape(creator.getFullName()));
		body.append("</strong></p>");

		if (startDate != null || endDate != null) {
			body.append("<p>Thời gian: <strong>");

			if (startDate != null) {
				body.append(
					"từ " + HtmlUtil.escape(_displayDateTime(startDate)));
			}

			if (endDate != null) {
				body.append(
					(startDate != null ? " " : "") + "đến " +
						HtmlUtil.escape(_displayDateTime(endDate)));
			}

			body.append("</strong></p>");
		}

		body.append(
			"<p style=\"margin:24px 0\"><a href=\"" + _SURVEY_PORTAL_URL +
				"\" style=\"display:inline-block;padding:10px 24px;" +
					"background:#0090CF;color:#ffffff;text-decoration:none;" +
						"border-radius:4px;font-weight:600\">" +
							"Tham gia bình chọn</a></p>");
		body.append(
			"<p>Hoặc truy cập đường dẫn: <a href=\"" + _SURVEY_PORTAL_URL +
				"\">" + _SURVEY_PORTAL_URL + "</a></p>");
		body.append(
			"<p style=\"color:#6b7280;font-size:12px\">Email được gửi tự " +
				"động từ hệ thống, vui lòng không trả lời email này.</p>");
		body.append("</div>");

		return body.toString();
	}

	private String _displayDateTime(String value) {
		try {
			return LocalDateTime.parse(value, _DATE_TIME_FORMATTER).format(
				_DISPLAY_DATE_TIME_FORMATTER);
		}
		catch (Exception e) {
			return value;
		}
	}

	private InternetAddress _createInternetAddress(
		String emailAddress, String personalName) {

		String normalizedEmailAddress =
			emailAddress != null ? emailAddress.trim() : "";

		if (normalizedEmailAddress.isEmpty()) {
			return null;
		}

		try {
			InternetAddress internetAddress = new InternetAddress(
				normalizedEmailAddress,
				personalName != null ? personalName.trim() : "",
				StandardCharsets.UTF_8.name());

			internetAddress.validate();

			return internetAddress;
		}
		catch (Exception e) {
			_log.warn(
				"Invalid survey notification email address: " +
					normalizedEmailAddress);

			return null;
		}
	}

	private Response _badRequest(String message) {
		return _cors(Response.status(Response.Status.BAD_REQUEST)
			.type(MediaType.APPLICATION_JSON)
			.entity("{\"error\":\"" + message + "\"}")
		).build();
	}

	private Response _notFound(String message) {
		return _cors(Response.status(Response.Status.NOT_FOUND)
			.type(MediaType.APPLICATION_JSON)
			.entity("{\"error\":\"" + message + "\"}")
		).build();
	}

	private Response _forbidden(String message) {
		return _cors(Response.status(Response.Status.FORBIDDEN)
			.type(MediaType.APPLICATION_JSON)
			.entity("{\"error\":\"" + message + "\"}")
		).build();
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder builder) {
		return builder
			.header("Access-Control-Allow-Origin", "*")
			.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
			.header("Access-Control-Allow-Headers", "Content-Type,Authorization,x-csrf-token");
	}

	private Response _ok(JSONObject json) {
		return _cors(Response.ok(json.toString(), MediaType.APPLICATION_JSON)).build();
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

	private static class UserContext {
		long departmentId;
		long organizationId;
		long userId;
		String userName = "";
	}

	private static final DateTimeFormatter _DATE_TIME_FORMATTER =
		DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

	private static final long _DEV_USER_ID = 1;

	private static final DateTimeFormatter _DISPLAY_DATE_TIME_FORMATTER =
		DateTimeFormatter.ofPattern("HH:mm 'ngày' dd/MM/yyyy");

	private static final int _EMAIL_BCC_BATCH_SIZE = 50;

	private static final Log _log = LogFactoryUtil.getLog(SurveyResource.class);

	private static final String _SURVEY_PORTAL_URL =
		"https://portal.tctvec.vn/en/intranet#/khao-sat-va-bieu-quyet-noi-bo";

	private static final ZoneId _VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

}
