package vn.vec.custom.counter.resource;

import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;

import javax.servlet.http.HttpServletRequest;

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
import vn.vec.custom.counter.model.OnlineCount;
import vn.vec.custom.counter.persistence.OnlineSessionRepository;
import vn.vec.custom.counter.service.CounterRequestContext;
import vn.vec.custom.counter.service.CounterRequestResolver;
import vn.vec.custom.counter.util.CounterParamUtil;
import vn.vec.custom.counter.util.CounterResponseUtil;

/**
 * Counter 2 — số người đang online. Không yêu cầu xác thực.
 *
 * <ul>
 * <li>{@code POST /o/vec-counter/online/heartbeat} — gọi lại mỗi 60 giây</li>
 * <li>{@code GET /o/vec-counter/online/count}</li>
 * <li>{@code POST /o/vec-counter/online/leave}</li>
 * </ul>
 */
@Component(
	property = {
		"osgi.jaxrs.application.select=" +
			CounterConstants.JAXRS_APPLICATION_SELECT,
		"osgi.jaxrs.resource=true"
	},
	service = OnlineCounterResource.class
)
@Path("/online")
@Produces(MediaType.APPLICATION_JSON)
public class OnlineCounterResource {

	@GET
	@Path("/count")
	public Response getOnlineCount(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("groupId") Long groupId) {

		try {
			CounterRequestContext counterRequestContext =
				_counterRequestResolver.resolve(
					httpServletRequest, groupId, null, null);

			return CounterResponseUtil.ok(
				_toOnlineJSONObject(counterRequestContext));
		}
		catch (Exception exception) {
			_log.error("Unable to count online visitors", exception);

			return CounterResponseUtil.internalError(
				"Không đọc được số người đang online.");
		}
	}

	@POST
	@Path("/heartbeat")
	public Response heartbeat(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("groupId") Long groupId,
		@QueryParam("visitorKey") String visitorKey,
		@QueryParam("path") String path) {

		try {
			CounterRequestContext counterRequestContext = _resolve(
				httpServletRequest, groupId, visitorKey, path);

			_onlineSessionRepository.heartbeat(counterRequestContext);

			return CounterResponseUtil.ok(
				_toOnlineJSONObject(counterRequestContext));
		}
		catch (Exception exception) {
			_log.error("Unable to update online heartbeat", exception);

			return CounterResponseUtil.internalError(
				"Không cập nhật được trạng thái online.");
		}
	}

	/**
	 * Bỏ visitor khỏi danh sách online. Frontend có thể gọi khi đóng tab bằng
	 * {@code navigator.sendBeacon}.
	 */
	@POST
	@Path("/leave")
	public Response leave(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("groupId") Long groupId,
		@QueryParam("visitorKey") String visitorKey) {

		try {
			CounterRequestContext counterRequestContext = _resolve(
				httpServletRequest, groupId, visitorKey, null);

			_onlineSessionRepository.removeSession(counterRequestContext);

			return CounterResponseUtil.ok(
				_toOnlineJSONObject(counterRequestContext));
		}
		catch (Exception exception) {
			_log.error("Unable to remove online session", exception);

			return CounterResponseUtil.internalError(
				"Không cập nhật được trạng thái online.");
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

	private CounterRequestContext _resolve(
		HttpServletRequest httpServletRequest, Long groupId, String visitorKey,
		String path) {

		JSONObject bodyJSONObject = CounterParamUtil.readBody(
			httpServletRequest);

		return _counterRequestResolver.resolve(
			httpServletRequest,
			CounterParamUtil.getLong(
				(groupId == null) ? null : String.valueOf(groupId),
				bodyJSONObject, "groupId"),
			CounterParamUtil.getString(visitorKey, bodyJSONObject, "visitorKey"),
			CounterParamUtil.getString(path, bodyJSONObject, "path"));
	}

	private JSONObject _toOnlineJSONObject(
			CounterRequestContext counterRequestContext)
		throws Exception {

		OnlineCount onlineCount = _onlineSessionRepository.countOnline(
			counterRequestContext.getCompanyId(),
			counterRequestContext.getGroupId());

		JSONObject resultJSONObject = JSONFactoryUtil.createJSONObject();

		resultJSONObject.put("companyId", counterRequestContext.getCompanyId());
		resultJSONObject.put("groupId", counterRequestContext.getGroupId());
		resultJSONObject.put("online", onlineCount.getTotal());
		resultJSONObject.put("guests", onlineCount.getGuests());
		resultJSONObject.put("members", onlineCount.getMembers());
		resultJSONObject.put(
			"onlineWindowSeconds", CounterConstants.ONLINE_WINDOW_SECONDS);

		return resultJSONObject;
	}

	private static final Log _log = LogFactoryUtil.getLog(
		OnlineCounterResource.class);

	@Reference
	private CounterRequestResolver _counterRequestResolver;

	@Reference
	private OnlineSessionRepository _onlineSessionRepository;

}
