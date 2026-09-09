package vn.vec.custom.admin.domainpolicy.filter;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.servlet.BaseFilter;
import com.liferay.portal.kernel.servlet.TryFilter;

import java.io.UnsupportedEncodingException;

import java.net.URLEncoder;

import javax.servlet.Filter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.domainpolicy.model.DomainRole;
import vn.vec.custom.admin.networkpolicy.service.AdminNetworkPolicyPermission;

/**
 * Tách môi trường sử dụng theo domain, trong khi cả 4 domain cùng được nginx
 * forward về một Liferay instance.
 *
 * <ul>
 * <li>{@code duongcaotoc.com.vn}, {@code expressway.com.vn} — cổng công khai:
 * xem tự do, chặn mọi đường dẫn đăng nhập; nếu phiên đang đăng nhập thì buộc
 * đăng xuất.</li>
 * <li>{@code portal.tctvec.vn} — cổng nội bộ: bắt buộc đăng nhập, mọi trang đều
 * đưa về {@value DomainPolicyRules#INTRANET_LANDING_PATH}.</li>
 * <li>{@code portal-admin.tctvec.vn} — cổng quản trị: bắt buộc đăng nhập, trang
 * mở đầu đưa về {@value DomainPolicyRules#ADMIN_LANDING_PATH}.</li>
 * </ul>
 *
 * <p>Chạy sau {@code Auto Login Filter} để đọc được người dùng đã đăng nhập.</p>
 */
@Component(
	property = {
		"after-filter=Auto Login Filter",
		"dispatcher=REQUEST",
		"servlet-context-name=",
		"servlet-filter-name=VEC Domain Access Policy Filter",
		"url-pattern=/*"
	},
	service = Filter.class
)
public class DomainAccessPolicyFilter extends BaseFilter implements TryFilter {

	@Override
	public Object doFilterTry(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws Exception {

		String host = DomainPolicyRules.resolveHost(httpServletRequest);
		DomainRole domainRole = DomainPolicyRules.resolveRole(host);

		if (domainRole == DomainRole.UNKNOWN) {
			return true;
		}

		String path = DomainPolicyRules.normalizePath(
			httpServletRequest.getRequestURI());

		try {
			if (domainRole == DomainRole.PUBLIC_SITE) {
				return _handlePublicSite(
					httpServletRequest, httpServletResponse, path);
			}

			if (domainRole == DomainRole.INTRANET) {
				return _handleIntranet(
					httpServletRequest, httpServletResponse, path);
			}

			return _handleAdmin(httpServletRequest, httpServletResponse, path);
		}
		catch (Exception exception) {

			// Không được để lỗi phân loại domain chặn toàn bộ portal.

			_log.error(
				"Unable to apply domain access policy for host " + host +
					" and path " + path,
				exception);

			return true;
		}
	}

	@Override
	protected Log getLog() {
		return _log;
	}

	private boolean _handleAdmin(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, String path)
		throws Exception {

		if (DomainPolicyRules.isAuthPath(path)) {
			return true;
		}

		boolean pageRequest = _isPageRequest(httpServletRequest, path);

		if (!_isSignedIn(httpServletRequest)) {
			if (!pageRequest) {
				return true;
			}

			return !_redirect(
				httpServletResponse, path,
				_loginUrl(DomainPolicyRules.ADMIN_LANDING_PATH));
		}

		if (pageRequest && DomainPolicyRules.isAdminLandingPath(path)) {
			return !_redirect(
				httpServletResponse, path,
				DomainPolicyRules.ADMIN_LANDING_PATH);
		}

		return true;
	}

	private boolean _handleIntranet(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, String path)
		throws Exception {

		if (DomainPolicyRules.isAuthPath(path)) {
			return true;
		}

		boolean pageRequest = _isPageRequest(httpServletRequest, path);

		if (!pageRequest) {
			return true;
		}

		if (!_isSignedIn(httpServletRequest)) {
			return !_redirect(
				httpServletResponse, path,
				_loginUrl(DomainPolicyRules.INTRANET_LANDING_PATH));
		}

		if (DomainPolicyRules.isIntranetPath(path)) {
			return true;
		}

		return !_redirect(
			httpServletResponse, path,
			DomainPolicyRules.INTRANET_LANDING_PATH);
	}

	private boolean _handlePublicSite(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, String path)
		throws Exception {

		if (DomainPolicyRules.isLogoutPath(path)) {
			return true;
		}

		if (DomainPolicyRules.isLoginPath(path)) {
			return !_redirect(httpServletResponse, path, "/");
		}

		if (_isSignedIn(httpServletRequest)) {
			return !_redirect(
				httpServletResponse, path, "/c/portal/logout");
		}

		return true;
	}

	/**
	 * Chỉ điều hướng những request thực sự là điều hướng trang trên trình
	 * duyệt. Redirect một POST của portlet, một lời gọi AJAX hay một tài nguyên
	 * tĩnh sẽ làm mất dữ liệu hoặc hỏng giao diện.
	 */
	private boolean _isPageRequest(
		HttpServletRequest httpServletRequest, String path) {

		if (DomainPolicyRules.isResourceRequest(path)) {
			return false;
		}

		String method = httpServletRequest.getMethod();

		if (!"GET".equals(method) && !"HEAD".equals(method)) {
			return false;
		}

		if ("XMLHttpRequest".equals(
				httpServletRequest.getHeader("X-Requested-With"))) {

			return false;
		}

		String accept = httpServletRequest.getHeader("Accept");

		if ((accept != null) && !accept.contains("text/html") &&
			!accept.contains("*/*")) {

			return false;
		}

		return true;
	}

	private boolean _isSignedIn(HttpServletRequest httpServletRequest) {
		return _permission.getSignedInUser(httpServletRequest) != null;
	}

	private String _loginUrl(String redirectPath) {
		return "/c/portal/login?redirect=" + _encode(redirectPath);
	}

	private String _encode(String value) {
		try {
			return URLEncoder.encode(value, "UTF-8");
		}
		catch (UnsupportedEncodingException unsupportedEncodingException) {
			return value;
		}
	}

	/**
	 * @return {@code true} nếu đã gửi redirect; {@code false} khi đích đến
	 *         chính là trang đang mở và request phải được đi tiếp bình thường
	 *         để tránh vòng lặp.
	 */
	private boolean _redirect(
			HttpServletResponse httpServletResponse, String currentPath,
			String location)
		throws Exception {

		if (currentPath.equals(DomainPolicyRules.normalizePath(location))) {
			return false;
		}

		httpServletResponse.setHeader(
			"Cache-Control", "no-store, no-cache, must-revalidate");
		httpServletResponse.setHeader("Pragma", "no-cache");
		httpServletResponse.sendRedirect(location);

		return true;
	}

	private static final Log _log = LogFactoryUtil.getLog(
		DomainAccessPolicyFilter.class);

	@Reference
	private AdminNetworkPolicyPermission _permission;

}
