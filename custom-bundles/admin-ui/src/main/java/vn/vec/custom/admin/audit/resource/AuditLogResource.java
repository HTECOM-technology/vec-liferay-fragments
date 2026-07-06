package vn.vec.custom.admin.audit.resource;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;

import java.text.SimpleDateFormat;

import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditLogEntry;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogQuery;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.util.AuditJsonUtil;
import vn.vec.custom.admin.audit.util.AuditSanitizer;

@Component(
	property = {
		"osgi.jaxrs.application.select=(osgi.jaxrs.name=VecAuditLog)",
		"osgi.jaxrs.resource=true"
	},
	service = AuditLogResource.class
)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/audit-logs")
@Produces(MediaType.APPLICATION_JSON)
public class AuditLogResource {

	@GET
	@Path("/{auditLogId}")
	public Response getAuditLog(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("auditLogId") long auditLogId) {

		User user = _getSignedInUser(_getSignedInUserId(httpServletRequest));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Only administrators can access audit logs.");
		}

		try {
			AuditLogEntry auditLogEntry = _auditLogService.findById(auditLogId);

			if (auditLogEntry == null) {
				return _jsonError(Response.Status.NOT_FOUND, "Audit log not found.");
			}

			return _cors(
				Response.ok(_toDetailJSONObject(auditLogEntry).toString())
			).build();
		}
		catch (Exception exception) {
			return _serverError(exception);
		}
	}

	@GET
	public Response getAuditLogs(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("keyword") String keyword,
		@QueryParam("fromDate") String fromDate,
		@QueryParam("toDate") String toDate,
		@QueryParam("userId") long userId,
		@QueryParam("groupId") long groupId,
		@QueryParam("actionType") String actionType,
		@QueryParam("targetType") String targetType,
		@QueryParam("status") String status,
		@QueryParam("errorCode") String errorCode,
		@QueryParam("sort") @DefaultValue("createDate:desc") String sort,
		@QueryParam("page") @DefaultValue("1") int page,
		@QueryParam("pageSize") @DefaultValue("20") int pageSize) {

		User user = _getSignedInUser(_getSignedInUserId(httpServletRequest));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Only administrators can access audit logs.");
		}

		try {
			AuditLogQuery auditLogQuery = new AuditLogQuery();

			auditLogQuery.setKeyword(keyword);
			auditLogQuery.setFromDate(_parseStartDate(fromDate));
			auditLogQuery.setToDate(_parseEndDateExclusive(toDate));
			auditLogQuery.setUserId(userId);
			auditLogQuery.setGroupId(groupId);
			auditLogQuery.setActionType(actionType);
			auditLogQuery.setTargetType(targetType);
			auditLogQuery.setStatus(status);
			auditLogQuery.setErrorCode(errorCode);
			auditLogQuery.setSort(sort);
			auditLogQuery.setPage(page);
			auditLogQuery.setPageSize(pageSize);

			List<AuditLogEntry> auditLogEntries = _auditLogService.search(
				auditLogQuery);
			int total = _auditLogService.count(auditLogQuery);
			JSONObject jsonObject = JSONFactoryUtil.createJSONObject();
			JSONArray jsonArray = JSONFactoryUtil.createJSONArray();

			for (AuditLogEntry auditLogEntry : auditLogEntries) {
				jsonArray.put(_toSummaryJSONObject(auditLogEntry));
			}

			jsonObject.put("items", jsonArray);
			jsonObject.put("total", total);
			jsonObject.put("page", auditLogQuery.getPage());
			jsonObject.put("pageSize", auditLogQuery.getPageSize());

			return _cors(Response.ok(jsonObject.toString())).build();
		}
		catch (IllegalArgumentException exception) {
			return _jsonError(Response.Status.BAD_REQUEST, exception.getMessage());
		}
		catch (Exception exception) {
			return _serverError(exception);
		}
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response options() {
		return _cors(Response.ok()).build();
	}

	/**
	 * Diagnostic endpoint: returns the HTTP status passed via {@code error_code}
	 * so the {@code HttpErrorAuditFilter} can be exercised. Only audited status
	 * codes (5xx, 401, 403, 429) produce an audit log entry.
	 *
	 * <p>Example: {@code GET /o/vec-admin/audit-logs/test-error?error_code=500}</p>
	 */
	@GET
	@Path("/test-error")
	public Response testError(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("error_code") @DefaultValue("500") int errorCode) {

		if ((errorCode < 400) || (errorCode > 599)) {
			return _jsonError(
				Response.Status.BAD_REQUEST,
				"error_code must be between 400 and 599.");
		}

		// Return the exact requested status so any 4xx/5xx code can be tested
		// deterministically (a thrown exception would always collapse to 500).

		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("message", "VEC audit test error");
		jsonObject.put("status", errorCode);

		return _cors(
			Response.status(errorCode).entity(jsonObject.toString())
		).build();
	}

	@POST
	@Path("/client-event")
	public Response postClientEvent(
		@Context HttpServletRequest httpServletRequest, String body) {

		User user = _getSignedInUser(_getSignedInUserId(httpServletRequest));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Only administrators can write client events.");
		}

		if ((body == null) || body.trim().isEmpty()) {
			return _jsonError(
				Response.Status.BAD_REQUEST, "Request body must not be empty.");
		}

		ServiceContext serviceContext = new ServiceContext();

		try {
			serviceContext.setCompanyId(PortalUtil.getCompanyId(httpServletRequest));
			serviceContext.setScopeGroupId(
				PortalUtil.getScopeGroupId(httpServletRequest));
		}
		catch (Exception exception) {
		}

		serviceContext.setUserId(_getSignedInUserId(httpServletRequest));
		serviceContext.setRequest(httpServletRequest);

		_auditLogService.logSuccess(
			AuditActionType.UNKNOWN, AuditTargetType.UNKNOWN,
			"client-event", null, "Client Event", null, null,
			AuditSanitizer.sanitizeJson(body),
			serviceContext);

		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("status", "accepted");

		return _cors(Response.ok(jsonObject.toString())).build();
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder responseBuilder) {
		return responseBuilder
			.header("Access-Control-Allow-Origin", "*")
			.header(
				"Access-Control-Allow-Headers",
				"Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			.header("Access-Control-Allow-Credentials", "true");
	}

	private Response _forbidden(String message) {
		return _jsonError(Response.Status.FORBIDDEN, message);
	}

	private User _getSignedInUser(long userId) {
		if (userId <= 0) {
			return null;
		}

		try {
			User user = UserLocalServiceUtil.fetchUser(userId);

			if ((user == null) || user.isGuestUser()) {
				return null;
			}

			return user;
		}
		catch (Exception exception) {
			return null;
		}
	}

	private long _getSignedInUserId(HttpServletRequest httpServletRequest) {
		try {
			PermissionChecker permissionChecker =
				PermissionThreadLocal.getPermissionChecker();

			if (permissionChecker != null) {
				return permissionChecker.getUserId();
			}

			if (httpServletRequest != null) {
				long requestUserId = PortalUtil.getUserId(httpServletRequest);

				if (requestUserId > 0) {
					return requestUserId;
				}
			}

			String principalName = PrincipalThreadLocal.getName();

			if ((principalName == null) || principalName.trim().isEmpty()) {
				return 0;
			}

			return Long.parseLong(principalName.trim());
		}
		catch (Exception exception) {
			return 0;
		}
	}

	private boolean _isAdminUser(User user) {
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

		try {
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

	private Response _jsonError(Response.Status status, String message) {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("message", message);
		jsonObject.put("status", status.getStatusCode());

		return _cors(Response.status(status).entity(jsonObject.toString())).build();
	}

	private Date _parseEndDateExclusive(String value) {
		if ((value == null) || value.trim().isEmpty()) {
			return null;
		}

		try {
			return Date.from(
				LocalDate.parse(value.trim()).plusDays(
					1).atStartOfDay(
						ZoneId.systemDefault()
					).toInstant());
		}
		catch (DateTimeParseException dateTimeParseException) {
			throw new IllegalArgumentException("Invalid toDate format. Use yyyy-MM-dd.");
		}
	}

	private Date _parseStartDate(String value) {
		if ((value == null) || value.trim().isEmpty()) {
			return null;
		}

		try {
			return Date.from(
				LocalDate.parse(value.trim()).atStartOfDay(
					ZoneId.systemDefault()
				).toInstant());
		}
		catch (DateTimeParseException dateTimeParseException) {
			throw new IllegalArgumentException(
				"Invalid fromDate format. Use yyyy-MM-dd.");
		}
	}

	private Response _serverError(Exception exception) {
		return _jsonError(
			Response.Status.INTERNAL_SERVER_ERROR,
			(exception.getMessage() != null) ? exception.getMessage() :
				"Unexpected server error");
	}

	private JSONObject _toDetailJSONObject(AuditLogEntry auditLogEntry) {
		JSONObject jsonObject = _toSummaryJSONObject(auditLogEntry);

		jsonObject.put(
			"beforeData", AuditJsonUtil.toJSONObject(auditLogEntry.getBeforeData()));
		jsonObject.put(
			"afterData", AuditJsonUtil.toJSONObject(auditLogEntry.getAfterData()));
		jsonObject.put(
			"changedKeys",
			AuditJsonUtil.toJSONArray(auditLogEntry.getChangedKeys()));
		jsonObject.put(
			"diffData", AuditJsonUtil.toJSONArray(auditLogEntry.getDiffData()));
		jsonObject.put(
			"errorMessage",
			(auditLogEntry.getErrorMessage() != null) ?
				auditLogEntry.getErrorMessage() : "");
		jsonObject.put(
			"errorCode", _value(auditLogEntry.getErrorCode()));

		return jsonObject;
	}

	private JSONObject _toSummaryJSONObject(AuditLogEntry auditLogEntry) {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("auditLogId", auditLogEntry.getAuditLogId());
		jsonObject.put("companyId", auditLogEntry.getCompanyId());
		jsonObject.put("groupId", auditLogEntry.getGroupId());
		jsonObject.put("siteName", _value(auditLogEntry.getSiteName()));
		jsonObject.put("userId", auditLogEntry.getUserId());
		jsonObject.put("userName", _value(auditLogEntry.getUserName()));
		jsonObject.put("userEmail", _value(auditLogEntry.getUserEmail()));
		jsonObject.put("actionType", _value(auditLogEntry.getActionType()));
		jsonObject.put("targetType", _value(auditLogEntry.getTargetType()));
		jsonObject.put("className", _value(auditLogEntry.getClassName()));
		jsonObject.put("classPK", _value(auditLogEntry.getClassPK()));
		jsonObject.put("pid", _value(auditLogEntry.getPid()));
		jsonObject.put("factoryPid", _value(auditLogEntry.getFactoryPid()));
		jsonObject.put("scope", _value(auditLogEntry.getScope()));
		jsonObject.put("targetTitle", _value(auditLogEntry.getTargetTitle()));
		jsonObject.put("targetUrl", _value(auditLogEntry.getTargetUrl()));
		jsonObject.put("requestUri", _value(auditLogEntry.getRequestUri()));
		jsonObject.put("ipAddress", _value(auditLogEntry.getIpAddress()));
		jsonObject.put("userAgent", _value(auditLogEntry.getUserAgent()));
		jsonObject.put("sessionId", _value(auditLogEntry.getSessionId()));
		jsonObject.put("status", _value(auditLogEntry.getStatus()));
		jsonObject.put("errorCode", _value(auditLogEntry.getErrorCode()));
		jsonObject.put("createDate", _formatDate(auditLogEntry.getCreateDate()));
		jsonObject.put(
			"completedDate", _formatDate(auditLogEntry.getCompletedDate()));

		return jsonObject;
	}

	private Response _unauthorized() {
		return _jsonError(
			Response.Status.UNAUTHORIZED, "Login is required to access audit logs.");
	}

	private String _formatDate(Date date) {
		if (date == null) {
			return "";
		}

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss", Locale.US);

		return simpleDateFormat.format(date);
	}

	private String _value(String value) {
		if (value == null) {
			return "";
		}

		return value;
	}

	@Reference
	private AuditLogService _auditLogService;

}
