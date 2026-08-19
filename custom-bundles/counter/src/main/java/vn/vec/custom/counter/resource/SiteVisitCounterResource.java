package vn.vec.custom.counter.resource;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.counter.constants.CounterConstants;
import vn.vec.custom.counter.model.DailyVisit;
import vn.vec.custom.counter.model.OnlineCount;
import vn.vec.custom.counter.model.SiteVisitSummary;
import vn.vec.custom.counter.persistence.OnlineSessionRepository;
import vn.vec.custom.counter.persistence.SiteVisitRepository;
import vn.vec.custom.counter.service.CounterRequestContext;
import vn.vec.custom.counter.service.CounterRequestResolver;
import vn.vec.custom.counter.util.CounterParamUtil;
import vn.vec.custom.counter.util.CounterResponseUtil;

/**
 * Counter 1 — lượt truy cập website. Không yêu cầu xác thực.
 *
 * <ul>
 * <li>{@code POST /o/vec-counter/site-visits/hit}</li>
 * <li>{@code GET /o/vec-counter/site-visits/summary}</li>
 * <li>{@code GET /o/vec-counter/site-visits/daily}</li>
 * </ul>
 */
@Component(
	property = {
		"osgi.jaxrs.application.select=" +
			CounterConstants.JAXRS_APPLICATION_SELECT,
		"osgi.jaxrs.resource=true"
	},
	service = SiteVisitCounterResource.class
)
@Path("/site-visits")
@Produces(MediaType.APPLICATION_JSON)
public class SiteVisitCounterResource {

	/**
	 * Số liệu theo từng ngày để vẽ biểu đồ. Dùng {@code days} (mặc định 30) hoặc
	 * cặp {@code startDate}/{@code endDate} dạng {@code yyyy-MM-dd}.
	 */
	@GET
	@Path("/daily")
	public Response getDailyVisits(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("groupId") Long groupId,
		@QueryParam("days") @DefaultValue("30") int days,
		@QueryParam("startDate") String startDate,
		@QueryParam("endDate") String endDate) {

		try {
			CounterRequestContext counterRequestContext =
				_counterRequestResolver.resolve(
					httpServletRequest, groupId, null, null);

			LocalDate end = _parseLocalDate(endDate, LocalDate.now());
			LocalDate start;

			if ((startDate != null) && !startDate.trim().isEmpty()) {
				start = _parseLocalDate(startDate, end.minusDays(29));
			}
			else {
				start = end.minusDays(Math.max(days, 1) - 1);
			}

			if (start.isAfter(end)) {
				return CounterResponseUtil.badRequest(
					"startDate phải nhỏ hơn hoặc bằng endDate.");
			}

			if (start.isBefore(
					end.minusDays(CounterConstants.MAX_DAILY_RANGE_DAYS))) {

				start = end.minusDays(CounterConstants.MAX_DAILY_RANGE_DAYS);
			}

			List<DailyVisit> dailyVisits = _siteVisitRepository.getDailyVisits(
				counterRequestContext.getCompanyId(),
				counterRequestContext.getGroupId(), start, end);

			JSONArray itemsJSONArray = JSONFactoryUtil.createJSONArray();

			for (DailyVisit dailyVisit : dailyVisits) {
				JSONObject itemJSONObject = JSONFactoryUtil.createJSONObject();

				itemJSONObject.put("date", dailyVisit.getVisitDate());
				itemJSONObject.put("totalVisits", dailyVisit.getTotalVisits());
				itemJSONObject.put(
					"uniqueVisitors", dailyVisit.getUniqueVisitors());

				itemsJSONArray.put(itemJSONObject);
			}

			JSONObject resultJSONObject = JSONFactoryUtil.createJSONObject();

			resultJSONObject.put(
				"companyId", counterRequestContext.getCompanyId());
			resultJSONObject.put("groupId", counterRequestContext.getGroupId());
			resultJSONObject.put("startDate", start.toString());
			resultJSONObject.put("endDate", end.toString());
			resultJSONObject.put("items", itemsJSONArray);

			return CounterResponseUtil.ok(resultJSONObject);
		}
		catch (DateTimeParseException dateTimeParseException) {
			return CounterResponseUtil.badRequest(
				"startDate và endDate phải có dạng yyyy-MM-dd.");
		}
		catch (Exception exception) {
			_log.error("Unable to read daily site visits", exception);

			return CounterResponseUtil.internalError(
				"Không đọc được số liệu truy cập theo ngày.");
		}
	}

	@GET
	@Path("/summary")
	public Response getSummary(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("groupId") Long groupId) {

		try {
			CounterRequestContext counterRequestContext =
				_counterRequestResolver.resolve(
					httpServletRequest, groupId, null, null);

			return CounterResponseUtil.ok(
				_toSummaryJSONObject(counterRequestContext, null));
		}
		catch (Exception exception) {
			_log.error("Unable to read site visit summary", exception);

			return CounterResponseUtil.internalError(
				"Không đọc được số liệu truy cập.");
		}
	}

	@OPTIONS
	public Response options() {
		return CounterResponseUtil.options();
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response optionsAny() {
		return CounterResponseUtil.options();
	}

	/**
	 * Ghi nhận một lượt truy cập website và đồng thời cập nhật heartbeat online,
	 * để fragment chỉ cần gọi một API khi trang được mở.
	 */
	@POST
	@Path("/hit")
	public Response recordVisit(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("groupId") Long groupId,
		@QueryParam("visitorKey") String visitorKey,
		@QueryParam("path") String path) {

		try {
			JSONObject bodyJSONObject = CounterParamUtil.readBody(
				httpServletRequest);

			CounterRequestContext counterRequestContext =
				_counterRequestResolver.resolve(
					httpServletRequest,
					CounterParamUtil.getLong(
						(groupId == null) ? null : String.valueOf(groupId),
						bodyJSONObject, "groupId"),
					CounterParamUtil.getString(
						visitorKey, bodyJSONObject, "visitorKey"),
					CounterParamUtil.getString(path, bodyJSONObject, "path"));

			boolean counted = _siteVisitRepository.recordVisit(
				counterRequestContext);

			_onlineSessionRepository.heartbeat(counterRequestContext);

			return CounterResponseUtil.ok(
				_toSummaryJSONObject(counterRequestContext, counted));
		}
		catch (Exception exception) {
			_log.error("Unable to record site visit", exception);

			return CounterResponseUtil.internalError(
				"Không ghi nhận được lượt truy cập.");
		}
	}

	private LocalDate _parseLocalDate(String value, LocalDate defaultValue) {
		if ((value == null) || value.trim().isEmpty()) {
			return defaultValue;
		}

		return LocalDate.parse(value.trim());
	}

	private JSONObject _toSummaryJSONObject(
			CounterRequestContext counterRequestContext, Boolean counted)
		throws Exception {

		SiteVisitSummary siteVisitSummary = _siteVisitRepository.getSummary(
			counterRequestContext.getCompanyId(),
			counterRequestContext.getGroupId());

		OnlineCount onlineCount = _onlineSessionRepository.countOnline(
			counterRequestContext.getCompanyId(),
			counterRequestContext.getGroupId());

		JSONObject onlineJSONObject = JSONFactoryUtil.createJSONObject();

		onlineJSONObject.put("total", onlineCount.getTotal());
		onlineJSONObject.put("guests", onlineCount.getGuests());
		onlineJSONObject.put("members", onlineCount.getMembers());

		JSONObject resultJSONObject = JSONFactoryUtil.createJSONObject();

		resultJSONObject.put("companyId", counterRequestContext.getCompanyId());
		resultJSONObject.put("groupId", counterRequestContext.getGroupId());
		resultJSONObject.put("totalVisits", siteVisitSummary.getTotalVisits());
		resultJSONObject.put(
			"totalVisitsToday", siteVisitSummary.getTotalVisitsToday());
		resultJSONObject.put(
			"totalVisitsYesterday",
			siteVisitSummary.getTotalVisitsYesterday());
		resultJSONObject.put(
			"totalVisitsThisWeek", siteVisitSummary.getTotalVisitsThisWeek());
		resultJSONObject.put(
			"totalVisitsThisMonth", siteVisitSummary.getTotalVisitsThisMonth());
		resultJSONObject.put(
			"totalVisitsThisYear", siteVisitSummary.getTotalVisitsThisYear());

		// uniqueVisitors = tổng unique visitor của từng ngày. Khách quay lại ở
		// ngày khác được tính lại, nên số này luôn >= số người thật.

		resultJSONObject.put(
			"uniqueVisitors", siteVisitSummary.getUniqueVisitors());
		resultJSONObject.put(
			"uniqueVisitorsToday", siteVisitSummary.getUniqueVisitorsToday());
		resultJSONObject.put(
			"firstVisitDate",
			CounterResponseUtil.formatDate(
				siteVisitSummary.getFirstVisitDate()));
		resultJSONObject.put("online", onlineJSONObject);
		resultJSONObject.put(
			"onlineWindowSeconds", CounterConstants.ONLINE_WINDOW_SECONDS);

		if (counted != null) {
			resultJSONObject.put("counted", counted.booleanValue());
		}

		return resultJSONObject;
	}

	private static final Log _log = LogFactoryUtil.getLog(
		SiteVisitCounterResource.class);

	@Reference
	private CounterRequestResolver _counterRequestResolver;

	@Reference
	private OnlineSessionRepository _onlineSessionRepository;

	@Reference
	private SiteVisitRepository _siteVisitRepository;

}
