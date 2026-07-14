package vn.vec.custom.admin.HookTollReconciliation;

import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.HookTollReconciliation.persistence.TollReconciliationQueryRepository;

/** API đọc dữ liệu thật cho màn hình tổng hợp Đối soát thu phí. */
@Component(
	property = {
		"osgi.jaxrs.application.select=(osgi.jaxrs.name=Vec.Toll.Reconciliation)",
		"osgi.jaxrs.resource=true"
	},
	service = TollReconciliationDashboardResource.class
)
@Path("/dashboard")
@Produces(MediaType.APPLICATION_JSON)
public class TollReconciliationDashboardResource {

	@GET
	public Response getDashboard(
		@Context HttpServletRequest request,
		@QueryParam("fromDate") String fromDateValue,
		@QueryParam("toDate") String toDateValue,
		@QueryParam("limit") String limitValue) {

		User user = _getSignedInUser(request);

		if (user == null) {
			return _error(
				Response.Status.UNAUTHORIZED.getStatusCode(), "UNAUTHORIZED",
				"Bạn cần đăng nhập Liferay để xem dữ liệu đối soát thu phí.");
		}

		try {
			LocalDate toDate = _parseDate(
				toDateValue, LocalDate.now(_DISPLAY_ZONE_ID), "toDate");
			LocalDate fromDate = _parseDate(
				fromDateValue,
				toDate.minusDays(HookConstants.DASHBOARD_DEFAULT_DAYS - 1L),
				"fromDate");

			if (fromDate.isAfter(toDate)) {
				return _badRequest("fromDate không được sau toDate.");
			}

			long numberOfDays = ChronoUnit.DAYS.between(fromDate, toDate) + 1;

			if (numberOfDays > HookConstants.DASHBOARD_MAX_DAYS) {
				return _badRequest(
					"Khoảng ngày không được vượt quá " +
						HookConstants.DASHBOARD_MAX_DAYS + " ngày.");
			}

			int limit = _parseLimit(limitValue);
			JSONObject result = _tollReconciliationQueryRepository.getDashboard(
				fromDate, toDate, limit);

			result.put("success", true);
			result.put("fromDate", fromDate.toString());
			result.put("toDate", toDate.toString());
			result.put("tableLimit", limit);

			return Response.ok(
				result.toString(), MediaType.APPLICATION_JSON
			).build();
		}
		catch (IllegalArgumentException illegalArgumentException) {
			return _badRequest(illegalArgumentException.getMessage());
		}
		catch (Exception exception) {
			_log.error(
				"Unable to read toll reconciliation dashboard for userId=" +
					user.getUserId(),
				exception);

			return _error(
				Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(),
				"INTERNAL_ERROR", "Không thể tải dữ liệu đối soát thu phí.");
		}
	}

	private Response _badRequest(String message) {
		return _error(
			Response.Status.BAD_REQUEST.getStatusCode(), "INVALID_PARAMETER",
			message);
	}

	private Response _error(int status, String errorCode, String message) {
		JSONObject result = JSONFactoryUtil.createJSONObject();

		result.put("success", false);
		result.put("errorCode", errorCode);
		result.put("message", message);

		return Response.status(status).type(
			MediaType.APPLICATION_JSON
		).entity(
			result.toString()
		).build();
	}

	private User _getSignedInUser(HttpServletRequest request) {
		try {
			User requestUser = null;

			if (request != null) {
				requestUser = PortalUtil.getUser(request);
			}

			if ((requestUser != null) && !requestUser.isGuestUser()) {
				return requestUser;
			}

			String principalName = PrincipalThreadLocal.getName();

			if ((principalName == null) || principalName.trim().isEmpty()) {
				return null;
			}

			User principalUser = UserLocalServiceUtil.fetchUser(
				Long.parseLong(principalName));

			if ((principalUser == null) || principalUser.isGuestUser()) {
				return null;
			}

			return principalUser;
		}
		catch (Exception exception) {
			return null;
		}
	}

	private LocalDate _parseDate(
		String value, LocalDate defaultValue, String parameterName) {

		if ((value == null) || value.trim().isEmpty()) {
			return defaultValue;
		}

		try {
			return LocalDate.parse(value.trim());
		}
		catch (DateTimeParseException dateTimeParseException) {
			throw new IllegalArgumentException(
				parameterName + " phải có định dạng YYYY-MM-DD.");
		}
	}

	private int _parseLimit(String value) {
		if ((value == null) || value.trim().isEmpty()) {
			return HookConstants.DASHBOARD_DEFAULT_TABLE_LIMIT;
		}

		try {
			int limit = Integer.parseInt(value.trim());

			if ((limit < 1) ||
				(limit > HookConstants.DASHBOARD_MAX_TABLE_LIMIT)) {

				throw new IllegalArgumentException(
					"limit phải nằm trong khoảng 1 đến " +
						HookConstants.DASHBOARD_MAX_TABLE_LIMIT + ".");
			}

			return limit;
		}
		catch (NumberFormatException numberFormatException) {
			throw new IllegalArgumentException("limit phải là số nguyên.");
		}
	}

	@Reference
	private TollReconciliationQueryRepository
		_tollReconciliationQueryRepository;

	private static final ZoneId _DISPLAY_ZONE_ID = ZoneId.of(
		"Asia/Ho_Chi_Minh");

	private static final Log _log = LogFactoryUtil.getLog(
		TollReconciliationDashboardResource.class);
}
