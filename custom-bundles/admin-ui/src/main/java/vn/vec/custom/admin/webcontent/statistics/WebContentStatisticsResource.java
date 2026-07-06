package vn.vec.custom.admin.webcontent.statistics;

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
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.workflow.WorkflowConstants;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
@Path("/webcontent-statistics")
public class WebContentStatisticsResource {

	@GET
	@Path("/export.xlsx")
	@Produces(_XLSX_CONTENT_TYPE)
	public Response export(
		@Context HttpServletRequest request,
		@QueryParam("groupId") long groupId,
		@QueryParam("status") @DefaultValue("-1") int status,
		@QueryParam("latestOnly") @DefaultValue("true") boolean latestOnly,
		@QueryParam("includeVersions") @DefaultValue("false") boolean includeVersions,
		@QueryParam("fromCreateDate") String fromCreateDate,
		@QueryParam("toCreateDate") String toCreateDate,
		@QueryParam("fromModifiedDate") String fromModifiedDate,
		@QueryParam("toModifiedDate") String toModifiedDate,
		@QueryParam("folderId") @DefaultValue("-1") long folderId,
		@QueryParam("structureId") @DefaultValue("-1") long structureId,
		@QueryParam("userId") @DefaultValue("-1") long userId,
		@QueryParam("languageId") @DefaultValue("vi_VN") String languageId,
		@QueryParam("includeRawData") @DefaultValue("true") boolean includeRawData) {

		User user = _getSignedInUser(_getSignedInUserId(request));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden(
				"Chỉ omniadmin hoặc user có quyền Administrator mới được export thống kê Web Content.");
		}

		try {
			WebContentStatisticsQuery query = _buildQuery(
				groupId, status, latestOnly, includeVersions, fromCreateDate,
				toCreateDate, fromModifiedDate, toModifiedDate, folderId,
				structureId, userId, languageId, includeRawData);
			File outputFile = _webContentStatisticsExportService.export(query);
			String fileName = _buildFileName(groupId);

			StreamingOutput streamingOutput = new StreamingOutput() {

				@Override
				public void write(OutputStream outputStream) {
					byte[] buffer = new byte[8192];
					int length;

					try (InputStream inputStream = new FileInputStream(outputFile)) {
						while ((length = inputStream.read(buffer)) != -1) {
							outputStream.write(buffer, 0, length);
						}
					}
					catch (Exception e) {
						throw new RuntimeException(e);
					}
					finally {
						if (outputFile.exists() && !outputFile.delete() &&
							_log.isWarnEnabled()) {

							_log.warn("Unable to delete temp export file " + outputFile);
						}
					}
				}

			};

			return _cors(
				Response.ok(streamingOutput, _XLSX_CONTENT_TYPE)
					.header(
						"Content-Disposition",
						"attachment; filename=\"" + fileName + "\"")
					.header("Content-Length", String.valueOf(outputFile.length()))
					.header(
						"Access-Control-Expose-Headers",
						"Content-Disposition, Content-Length")
			).build();
		}
		catch (IllegalArgumentException e) {
			return _badRequest(e.getMessage());
		}
		catch (Exception e) {
			_log.error("Error exporting web content statistics: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response options() {
		return _cors(Response.ok()).build();
	}

	private WebContentStatisticsQuery _buildQuery(
		long groupId, int status, boolean latestOnly, boolean includeVersions,
		String fromCreateDate, String toCreateDate, String fromModifiedDate,
		String toModifiedDate, long folderId, long structureId, long userId,
		String languageId, boolean includeRawData) {

		if (groupId <= 0) {
			throw new IllegalArgumentException("groupId phải lớn hơn 0.");
		}

		if (!_ALLOWED_STATUSES.contains(status)) {
			throw new IllegalArgumentException(
				"status không hợp lệ. Chỉ hỗ trợ -1, 0, 1, 2, 3, 4, 7, 8.");
		}

		Date createFrom = _parseDate(fromCreateDate, "fromCreateDate");
		Date createToExclusive = _parseDateExclusive(toCreateDate, "toCreateDate");
		Date modifiedFrom = _parseDate(fromModifiedDate, "fromModifiedDate");
		Date modifiedToExclusive = _parseDateExclusive(
			toModifiedDate, "toModifiedDate");

		_validateDateRange(createFrom, createToExclusive, "createDate");
		_validateDateRange(modifiedFrom, modifiedToExclusive, "modifiedDate");

		if (languageId == null || languageId.trim().isEmpty()) {
			languageId = "vi_VN";
		}

		return new WebContentStatisticsQuery(
			groupId, status, latestOnly, includeVersions, createFrom,
			createToExclusive, modifiedFrom, modifiedToExclusive, folderId,
			structureId, userId, languageId.trim(), includeRawData);
	}

	private String _buildFileName(long groupId) {
		java.text.SimpleDateFormat simpleDateFormat = new java.text.SimpleDateFormat(
			"yyyyMMdd-HHmmss", Locale.US);

		return "webcontent-statistics-" + groupId + "-" +
			simpleDateFormat.format(new Date()) + ".xlsx";
	}

	private Response _badRequest(String message) {
		return _jsonError(Response.Status.BAD_REQUEST, message);
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder builder) {
		return builder
			.header("Access-Control-Allow-Origin", "*")
			.header(
				"Access-Control-Allow-Headers",
				"Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, OPTIONS")
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

			if (user == null || user.isGuestUser()) {
				return null;
			}

			return user;
		}
		catch (Exception e) {
			return null;
		}
	}

	private long _getSignedInUserId(HttpServletRequest request) {
		try {
			PermissionChecker permissionChecker =
				PermissionThreadLocal.getPermissionChecker();

			if (permissionChecker != null) {
				long permissionCheckerUserId = permissionChecker.getUserId();

				if (permissionCheckerUserId > 0) {
					User permissionUser = UserLocalServiceUtil.fetchUser(
						permissionCheckerUserId);

					if (permissionUser != null && !permissionUser.isGuestUser()) {
						return permissionCheckerUserId;
					}
				}
			}

			User requestUser = null;

			if (request != null) {
				long requestUserId = PortalUtil.getUserId(request);

				if (requestUserId > 0) {
					User portalUser = UserLocalServiceUtil.fetchUser(requestUserId);

					if (portalUser != null && !portalUser.isGuestUser()) {
						return requestUserId;
					}
				}

				requestUser = PortalUtil.getUser(request);
			}

			if (requestUser != null && !requestUser.isGuestUser()) {
				return requestUser.getUserId();
			}

			if (request != null) {
				String remoteUser = request.getRemoteUser();

				if (remoteUser != null && !remoteUser.trim().isEmpty()) {
					long remoteUserId = Long.parseLong(remoteUser.trim());
					User remoteUserValue = UserLocalServiceUtil.fetchUser(remoteUserId);

					if (remoteUserValue != null && !remoteUserValue.isGuestUser()) {
						return remoteUserId;
					}
				}
			}

			String name = PrincipalThreadLocal.getName();

			if (name == null || name.trim().isEmpty()) {
				return 0;
			}

			long userId = Long.parseLong(name.trim());
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

	private boolean _isAdminUser(User user) {
		if (user == null) {
			return false;
		}

		PermissionChecker permissionChecker =
			PermissionThreadLocal.getPermissionChecker();

		if (permissionChecker != null && permissionChecker.isOmniadmin()) {
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
		catch (Exception e) {
			if (_log.isWarnEnabled()) {
				_log.warn("Unable to resolve roles for user " + user.getUserId(), e);
			}
		}

		return false;
	}

	private Response _jsonError(Response.Status status, String message) {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("error", message == null ? "" : message);

		return _cors(
			Response.status(status)
				.type(MediaType.APPLICATION_JSON)
				.entity(jsonObject.toString())
		).build();
	}

	private Date _parseDate(String value, String fieldName) {
		if (value == null || value.trim().isEmpty()) {
			return null;
		}

		try {
			LocalDate localDate = LocalDate.parse(
				value.trim(), _DATE_FORMATTER);

			return Date.from(
				localDate.atStartOfDay(
					ZoneId.systemDefault()
				).toInstant());
		}
		catch (DateTimeParseException e) {
			throw new IllegalArgumentException(
				fieldName + " phải theo định dạng yyyy-MM-dd.");
		}
	}

	private Date _parseDateExclusive(String value, String fieldName) {
		if (value == null || value.trim().isEmpty()) {
			return null;
		}

		try {
			LocalDate localDate = LocalDate.parse(
				value.trim(), _DATE_FORMATTER);

			return Date.from(
				localDate.plusDays(
					1
				).atStartOfDay(
					ZoneId.systemDefault()
				).toInstant());
		}
		catch (DateTimeParseException e) {
			throw new IllegalArgumentException(
				fieldName + " phải theo định dạng yyyy-MM-dd.");
		}
	}

	private Response _serverError() {
		return _jsonError(
			Response.Status.INTERNAL_SERVER_ERROR,
			"Máy chủ đang gặp lỗi. Vui lòng thử lại sau.");
	}

	private Response _unauthorized() {
		return _jsonError(
			Response.Status.UNAUTHORIZED,
			"Bạn cần đăng nhập để sử dụng chức năng này.");
	}

	private void _validateDateRange(
		Date fromDate, Date toDateExclusive, String fieldName) {

		if (fromDate == null || toDateExclusive == null) {
			return;
		}

		if (!fromDate.before(toDateExclusive)) {
			throw new IllegalArgumentException(
				"from" + _capitalize(fieldName) + " không được lớn hơn to" +
					_capitalize(fieldName) + ".");
		}
	}

	private String _capitalize(String value) {
		if (value == null || value.isEmpty()) {
			return "";
		}

		return Character.toUpperCase(value.charAt(0)) + value.substring(1);
	}

	private static final Set<Integer> _ALLOWED_STATUSES = new HashSet<>(
		Arrays.asList(
			WorkflowConstants.STATUS_ANY, WorkflowConstants.STATUS_APPROVED,
			WorkflowConstants.STATUS_PENDING, WorkflowConstants.STATUS_DRAFT,
			WorkflowConstants.STATUS_EXPIRED, WorkflowConstants.STATUS_DENIED,
			WorkflowConstants.STATUS_SCHEDULED,
			WorkflowConstants.STATUS_IN_TRASH));

	private static final DateTimeFormatter _DATE_FORMATTER =
		DateTimeFormatter.ofPattern("yyyy-MM-dd");

	private static final Log _log = LogFactoryUtil.getLog(
		WebContentStatisticsResource.class);

	private static final String _XLSX_CONTENT_TYPE =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

	private final WebContentStatisticsExportService
		_webContentStatisticsExportService =
			new WebContentStatisticsExportService();

}
