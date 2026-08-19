package vn.vec.custom.counter.service;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.CompanyThreadLocal;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import java.nio.charset.StandardCharsets;

import java.security.MessageDigest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.osgi.service.component.annotations.Component;

/**
 * Dựng {@link CounterRequestContext} từ HTTP request. API không cần xác thực
 * nên visitor được định danh theo thứ tự ưu tiên:
 *
 * <ol>
 * <li>userId nếu đã đăng nhập (chính xác nhất)</li>
 * <li>tham số {@code visitorKey} do frontend gửi lên (nên lưu ở localStorage
 * dạng UUID)</li>
 * <li>session id của servlet container</li>
 * <li>IP + User-Agent (kém chính xác nhất, nhiều người sau cùng NAT bị gộp)</li>
 * </ol>
 *
 * Giá trị cuối cùng luôn được băm SHA-256 nên bảng counter không lưu IP hay
 * session id dạng thô.
 */
@Component(service = CounterRequestResolver.class)
public class CounterRequestResolver {

	public CounterRequestContext resolve(
		HttpServletRequest httpServletRequest, Long groupIdParam,
		String visitorKeyParam, String pathParam) {

		long companyId = _getCompanyId(httpServletRequest);
		long userId = _getUserId(httpServletRequest);
		long groupId = _getGroupId(httpServletRequest, groupIdParam);

		return new CounterRequestContext(
			companyId, groupId, userId,
			_resolveVisitorKey(
				httpServletRequest, userId, companyId, visitorKeyParam),
			_normalizePath(httpServletRequest, pathParam));
	}

	private long _getCompanyId(HttpServletRequest httpServletRequest) {
		if (httpServletRequest != null) {
			try {
				long companyId = PortalUtil.getCompanyId(httpServletRequest);

				if (companyId > 0) {
					return companyId;
				}
			}
			catch (Exception exception) {
				if (_log.isDebugEnabled()) {
					_log.debug(
						"Unable to read companyId from request", exception);
				}
			}
		}

		Long companyId = CompanyThreadLocal.getCompanyId();

		if ((companyId != null) && (companyId > 0)) {
			return companyId;
		}

		return 0;
	}

	private long _getGroupId(
		HttpServletRequest httpServletRequest, Long groupIdParam) {

		if ((groupIdParam != null) && (groupIdParam > 0)) {
			return groupIdParam;
		}

		if (httpServletRequest == null) {
			return 0;
		}

		// Request tới /o/... thường không có ThemeDisplay nên giá trị này hay
		// bằng 0. Khi đó counter được tính ở phạm vi toàn portal (groupId = 0).

		try {
			return PortalUtil.getScopeGroupId(httpServletRequest);
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug("Unable to read scope groupId", exception);
			}

			return 0;
		}
	}

	private String _getRemoteAddress(HttpServletRequest httpServletRequest) {
		for (String headerName : _FORWARDED_FOR_HEADERS) {
			String value = httpServletRequest.getHeader(headerName);

			if ((value == null) || value.trim().isEmpty()) {
				continue;
			}

			int index = value.indexOf(',');

			if (index > 0) {
				value = value.substring(0, index);
			}

			value = value.trim();

			if (!value.isEmpty() && !value.equalsIgnoreCase("unknown")) {
				return value;
			}
		}

		return httpServletRequest.getRemoteAddr();
	}

	private long _getUserId(HttpServletRequest httpServletRequest) {
		try {
			if (httpServletRequest != null) {
				User user = PortalUtil.getUser(httpServletRequest);

				if ((user != null) && !user.isGuestUser()) {
					return user.getUserId();
				}
			}

			String name = PrincipalThreadLocal.getName();

			if ((name == null) || name.trim().isEmpty()) {
				return 0;
			}

			User user = UserLocalServiceUtil.fetchUser(Long.parseLong(name));

			if ((user == null) || user.isGuestUser()) {
				return 0;
			}

			return user.getUserId();
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug("Unable to resolve current user", exception);
			}

			return 0;
		}
	}

	private String _hash(String value) {
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");

			byte[] bytes = messageDigest.digest(
				value.getBytes(StandardCharsets.UTF_8));

			StringBuilder stringBuilder = new StringBuilder(bytes.length * 2);

			for (byte b : bytes) {
				stringBuilder.append(Character.forDigit((b >> 4) & 0xf, 16));
				stringBuilder.append(Character.forDigit(b & 0xf, 16));
			}

			return stringBuilder.toString();
		}
		catch (Exception exception) {

			// SHA-256 luôn có trên JVM; nhánh này chỉ để không làm vỡ request.

			_log.error("Unable to hash visitor key", exception);

			return String.format("%064x", (long)value.hashCode());
		}
	}

	private String _normalizePath(
		HttpServletRequest httpServletRequest, String pathParam) {

		String path = pathParam;

		if ((path == null) || path.trim().isEmpty()) {
			if (httpServletRequest == null) {
				return null;
			}

			path = httpServletRequest.getHeader("Referer");
		}

		if ((path == null) || path.trim().isEmpty()) {
			return null;
		}

		path = path.trim();

		if (path.length() > _MAX_PATH_LENGTH) {
			return path.substring(0, _MAX_PATH_LENGTH);
		}

		return path;
	}

	private String _resolveVisitorKey(
		HttpServletRequest httpServletRequest, long userId, long companyId,
		String visitorKeyParam) {

		if (userId > 0) {
			return _hash("user:" + companyId + ":" + userId);
		}

		if ((visitorKeyParam != null) && !visitorKeyParam.trim().isEmpty()) {
			String value = visitorKeyParam.trim();

			if (value.length() > _MAX_VISITOR_KEY_PARAM_LENGTH) {
				value = value.substring(0, _MAX_VISITOR_KEY_PARAM_LENGTH);
			}

			return _hash("vid:" + companyId + ":" + value);
		}

		if (httpServletRequest != null) {
			HttpSession httpSession = httpServletRequest.getSession(false);

			if (httpSession != null) {
				return _hash("session:" + companyId + ":" + httpSession.getId());
			}

			return _hash(
				"agent:" + companyId + ":" +
					_getRemoteAddress(httpServletRequest) + "|" +
						String.valueOf(
							httpServletRequest.getHeader("User-Agent")));
		}

		return _hash("anonymous:" + companyId);
	}

	private static final String[] _FORWARDED_FOR_HEADERS = {
		"X-Forwarded-For", "X-Real-IP"
	};

	private static final int _MAX_PATH_LENGTH = 500;

	private static final int _MAX_VISITOR_KEY_PARAM_LENGTH = 128;

	private static final Log _log = LogFactoryUtil.getLog(
		CounterRequestResolver.class);

}
