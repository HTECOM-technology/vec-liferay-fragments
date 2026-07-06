package vn.vec.custom.admin.survey;

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
import java.text.SimpleDateFormat;

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
				"AND (s.startDate IS NULL OR s.startDate <= NOW(6)) " +
				"AND (s.endDate IS NULL OR s.endDate >= NOW(6)) ";
		}
		else if ("expired".equals(normalizedState)) {
			where += "AND (s.status != 'ACTIVE' " +
				"OR (s.endDate IS NOT NULL AND s.endDate < NOW(6))) ";
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
				"    o.parentOrganizationId = p.organizationId" +
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

				String databaseNow = _getDatabaseNowString(con);
				int total = _countSurveys(
					con, where, search, status, hasSearch, hasStatus,
					normalizedFilter, userId);
				JSONArray items = JSONFactoryUtil.createJSONArray();
				PreparedStatement ps = con.prepareStatement(
					"SELECT s.* FROM VEC_InternalSurvey s " + where +
					"ORDER BY s.createDate " + order + " LIMIT ? OFFSET ?");

				try {
					int idx = _bindSurveyFilters(
						ps, search, status, hasSearch, hasStatus,
						normalizedFilter, userId);
					ps.setInt(idx++, pageSize);
					ps.setInt(idx, (page - 1) * pageSize);

					ResultSet rs = ps.executeQuery();

					try {
						while (rs.next()) {
							items.put(_toSurveyJson(con, rs, userId, databaseNow));
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
				String databaseNow = _getDatabaseNowString(con);
				PreparedStatement ps = con.prepareStatement(
					"SELECT * FROM VEC_InternalSurvey WHERE surveyId = ? AND status != 'DELETED'");

				try {
					ps.setLong(1, surveyId);

					ResultSet rs = ps.executeQuery();

					try {
						if (!rs.next()) {
							return _notFound("Survey not found");
						}

						return _ok(_toSurveyJson(con, rs, userId, databaseNow));
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

				if (!_isSurveyOwner(con, surveyId, userId)) {
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

				if (!_isSurveyOwner(con, surveyId, userId)) {
					return _forbidden("Bạn không có quyền xóa cuộc bình chọn này.");
				}

				if (_hasAnyVote(con, surveyId)) {
					return _badRequest("Không thể xóa cuộc bình chọn đã có người tham gia.");
				}

				PreparedStatement ps = con.prepareStatement(
					"UPDATE VEC_InternalSurvey SET status = 'DELETED', modifiedDate = ? " +
					"WHERE surveyId = ?");

				try {
					ps.setTimestamp(1, _now());
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
					!_isSurveyOwner(con, surveyId, userId)) {

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
			boolean hasSearch, boolean hasStatus, String filter, long userId)
		throws Exception {

		int idx = 1;

		if (hasSearch) {
			ps.setString(idx++, "%" + search.trim() + "%");
		}

		if (hasStatus) {
			ps.setString(idx++, status.trim());
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
		if (departmentId > 0) {
			return "INNER JOIN Users_Orgs uo ON u.userId = uo.userId " +
				"AND uo.organizationId = " + departmentId + " ";
		}

		if (organizationId > 0) {
			return "INNER JOIN Users_Orgs uo ON u.userId = uo.userId " +
				"INNER JOIN Organization_ o ON uo.organizationId = o.organizationId " +
				"AND (o.organizationId = " + organizationId +
				" OR o.parentOrganizationId = " + organizationId + ") ";
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
			"  o.parentOrganizationId = p.organizationId" +
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
			boolean hasSearch, boolean hasStatus, String filter, long userId)
		throws Exception {

		PreparedStatement ps = con.prepareStatement(
			"SELECT COUNT(*) FROM VEC_InternalSurvey s " + where);

		try {
			_bindSurveyFilters(
				ps, search, status, hasSearch, hasStatus, filter, userId);

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
				survey.put("databaseNow", _getDatabaseNowString(con));

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
			"SELECT o.organizationId, o.parentOrganizationId FROM Users_Orgs uo " +
			"INNER JOIN Organization_ o ON uo.organizationId = o.organizationId " +
			"WHERE uo.userId = ? ORDER BY o.parentOrganizationId DESC");

		try {
			orgPs.setLong(1, userId);

			ResultSet rs = orgPs.executeQuery();

			try {
				while (rs.next()) {
					long orgId = rs.getLong("organizationId");
					long parentOrgId = rs.getLong("parentOrganizationId");

					if (parentOrgId > 0 && context.departmentId == 0) {
						context.departmentId = orgId;
						context.organizationId = parentOrgId;
					}
					else if (parentOrgId == 0 && context.organizationId == 0) {
						context.organizationId = orgId;
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
		if (!"ACTIVE".equalsIgnoreCase(survey.getString("status"))) {
			return "Cuộc bình chọn không còn hoạt động.";
		}

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
			Timestamp now = _now();

			ps.setLong(1, payload.getLong("companyId"));
			ps.setLong(2, payload.getLong("groupId"));
			ps.setLong(3, userId);
			ps.setString(4, userContext.userName);
			ps.setString(5, title);
			ps.setString(6, payload.getString("description", ""));
			ps.setBoolean(7, payload.getBoolean("multipleChoice"));
			ps.setString(8, payload.getString("status", "ACTIVE"));
			ps.setTimestamp(9, _parseTimestamp(payload.getString("startDate")));
			ps.setTimestamp(10, _parseTimestamp(payload.getString("endDate")));
			ps.setTimestamp(11, now);
			ps.setTimestamp(12, now);
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
			ps.setTimestamp(7, _now());
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

	private Timestamp _parseTimestamp(String value) {
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

		return Timestamp.valueOf(normalized);
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

				Timestamp now = _now();

				insertPs.setLong(1, surveyId);
				insertPs.setString(2, optionText);
				insertPs.setInt(3, i);
				insertPs.setTimestamp(4, now);
				insertPs.setTimestamp(5, now);
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
			ps.setTimestamp(6, _now());
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
			ps.setTimestamp(5, _parseTimestamp(payload.getString("startDate")));
			ps.setTimestamp(6, _parseTimestamp(payload.getString("endDate")));
			ps.setTimestamp(7, _now());
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
			Connection con, ResultSet rs, long userId, String databaseNow)
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
		item.put(
			"canParticipate",
			_canParticipate(con, surveyId, userId) ||
				_isSurveyOwner(con, surveyId, userId));

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

	private String _getDatabaseNowString(Connection con) throws Exception {
		PreparedStatement ps = con.prepareStatement("SELECT NOW(6)");

		try {
			ResultSet rs = ps.executeQuery();

			try {
				if (rs.next()) {
					return _formatDateTimeString(rs.getString(1));
				}
			}
			finally {
				DataAccess.cleanUp(rs);
			}
		}
		finally {
			DataAccess.cleanUp(ps);
		}

		return "";
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

	private Timestamp _now() {
		return new Timestamp(System.currentTimeMillis());
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

	private static final long _DEV_USER_ID = 1;

	private static final Log _log = LogFactoryUtil.getLog(SurveyResource.class);

}
