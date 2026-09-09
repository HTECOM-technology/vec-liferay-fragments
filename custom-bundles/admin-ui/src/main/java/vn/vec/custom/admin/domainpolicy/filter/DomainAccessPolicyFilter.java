package vn.vec.custom.admin.domainpolicy.filter;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.servlet.BaseFilter;
import com.liferay.portal.kernel.servlet.TryFilter;
import com.liferay.portal.kernel.util.PortalUtil;

import java.io.UnsupportedEncodingException;

import java.net.URLEncoder;

import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.Filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.osgi.service.component.annotations.Activate;
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
 * đưa về {@code /web/guest/intranet}.</li>
 * <li>{@code portal-admin.tctvec.vn} — cổng quản trị: bắt buộc đăng nhập, trang
 * mở đầu đưa về {@code /group/control_panel/manage}.</li>
 * </ul>
 *
 * <p>Cách đăng ký bám sát {@code WebContentAdvancedSearchPageFilter} — filter
 * duy nhất trong module đã được xác nhận chạy đúng trên server:</p>
 * <ul>
 * <li>{@code before-filter=Auto Login Filter} chứ không phải {@code after-filter}.
 * {@code InvokerFilterHelper} bỏ qua filter khi không phân giải được tên trong
 * ràng buộc thứ tự, và đó là lý do bản dùng {@code after-filter} activate được
 * nhưng không bao giờ nằm trong chain.</li>
 * <li>{@link #isFilterEnabled()} phải override trả {@code true}:
 * {@code BaseFilter} lấy giá trị này từ init-param {@code filter-enabled} vốn
 * không được truyền vào filter đăng ký thuần OSGi.</li>
 * </ul>
 *
 * <p>Phải đăng ký cả {@code dispatcher=FORWARD}, không chỉ {@code REQUEST}:
 * {@code VirtualHostFilter} đứng trước vị trí này trong chain và nó
 * {@code forward()} {@code /} sang {@code /web/guest/...}. Forward mở một
 * dispatch mới, nên filter chỉ khai báo {@code REQUEST} sẽ không bao giờ thấy
 * request vào trang chủ — chỉ thấy các URL tường minh. Đổi lại, filter có thể
 * bị gọi nhiều lần cho cùng một request, nên {@link #_ATTRIBUTE_PROCESSED} bảo
 * đảm chỉ xét đúng một lần.</p>
 *
 * <p>Vì chạy trước Auto Login Filter nên người dùng vào bằng SSO/remember-me sẽ
 * bị đẩy sang trang đăng nhập một nhịp, rồi auto-login xử lý và đưa tiếp tới
 * {@code redirect}.</p>
 */
@Component(
	immediate = true,
	property = {
		"before-filter=Auto Login Filter",
		"dispatcher=FORWARD",
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

		// Đăng ký cả REQUEST và FORWARD nên cùng một request có thể đi qua
		// đây nhiều lần. Chỉ xét lần đầu.

		if (httpServletRequest.getAttribute(_ATTRIBUTE_PROCESSED) != null) {
			return true;
		}

		httpServletRequest.setAttribute(_ATTRIBUTE_PROCESSED, Boolean.TRUE);

		String host = DomainPolicyRules.resolveHost(httpServletRequest);
		DomainRole domainRole = DomainPolicyRules.resolveRole(host);
		String path = DomainPolicyRules.normalizePath(
			httpServletRequest.getRequestURI());

		boolean handled = false;

		try {
			if (domainRole == DomainRole.PUBLIC_SITE) {
				handled = _handlePublicSite(
					httpServletRequest, httpServletResponse, path);
			}
			else if (domainRole == DomainRole.INTRANET) {
				handled = _handleIntranet(
					httpServletRequest, httpServletResponse, path);
			}
			else if (domainRole == DomainRole.ADMIN) {
				handled = _handleAdmin(
					httpServletRequest, httpServletResponse, path);
			}
		}
		catch (Exception exception) {

			// Không được để lỗi phân loại domain chặn toàn bộ portal.

			_log.error(
				"Unable to apply domain access policy for host " + host +
					" and path " + path,
				exception);

			handled = false;
		}

		_logDecision(httpServletRequest, host, domainRole, path, handled);

		return !handled;
	}

	@Override
	public boolean isFilterEnabled() {
		return true;
	}

	/**
	 * Không gắn {@code @Override}: overload này chỉ tồn tại ở một số phiên bản
	 * {@code LiferayFilter}. Nếu có thì nó override, nếu không thì vô hại — và
	 * build không vỡ theo phiên bản Liferay.
	 */
	public boolean isFilterEnabled(
		HttpServletRequest httpServletRequest,
		HttpServletResponse httpServletResponse) {

		return true;
	}

	@Activate
	protected void activate() {
		try {
			_nodeName = PortalUtil.getComputerName();
		}
		catch (Exception exception) {
			_nodeName = "unknown";
		}

		_log.info(
			"VEC Domain Access Policy Filter activated on node " + _nodeName +
				": intranet=" + DomainPolicyRules.INTRANET_LANDING_PATH +
					", admin=" + DomainPolicyRules.ADMIN_LANDING_PATH +
						". Diagnostic INFO logging for the next " +
							_DIAGNOSTIC_LOG_LIMIT + " page requests.");
	}

	@Override
	protected Log getLog() {
		return _log;
	}

	private String _encode(String value) {
		try {
			return URLEncoder.encode(value, "UTF-8");
		}
		catch (UnsupportedEncodingException unsupportedEncodingException) {
			return value;
		}
	}

	private boolean _handleAdmin(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, String path)
		throws Exception {

		if (DomainPolicyRules.isAuthRequest(
				path, httpServletRequest.getQueryString())) {

			_resetLoginBounces(httpServletRequest);

			return false;
		}

		boolean pageRequest = _isPageRequest(httpServletRequest, path);

		if (!_isSignedIn(httpServletRequest)) {
			if (!pageRequest ||
				!_shouldBounceToLogin(httpServletRequest, path)) {

				return false;
			}

			return _redirect(
				httpServletResponse, path,
				_loginUrl(DomainPolicyRules.ADMIN_LANDING_PATH));
		}

		_resetLoginBounces(httpServletRequest);

		if (pageRequest && DomainPolicyRules.isAdminLandingPath(path)) {
			return _redirect(
				httpServletResponse, path,
				DomainPolicyRules.ADMIN_LANDING_PATH);
		}

		return false;
	}

	private boolean _handleIntranet(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, String path)
		throws Exception {

		if (DomainPolicyRules.isAuthRequest(
				path, httpServletRequest.getQueryString())) {

			_resetLoginBounces(httpServletRequest);

			return false;
		}

		if (!_isPageRequest(httpServletRequest, path)) {
			return false;
		}

		if (!_isSignedIn(httpServletRequest)) {
			if (!_shouldBounceToLogin(httpServletRequest, path)) {
				return false;
			}

			return _redirect(
				httpServletResponse, path,
				_loginUrl(DomainPolicyRules.INTRANET_LANDING_PATH));
		}

		_resetLoginBounces(httpServletRequest);

		if (DomainPolicyRules.isIntranetPath(path)) {
			return false;
		}

		return _redirect(
			httpServletResponse, path,
			DomainPolicyRules.INTRANET_LANDING_PATH);
	}

	private boolean _handlePublicSite(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, String path)
		throws Exception {

		if (DomainPolicyRules.isLogoutPath(path)) {
			return false;
		}

		if (DomainPolicyRules.isLoginPath(path)) {
			return _redirect(httpServletResponse, path, "/");
		}

		if (_isSignedIn(httpServletRequest)) {
			return _redirect(httpServletResponse, path, "/c/portal/logout");
		}

		return false;
	}

	private void _resetLoginBounces(HttpServletRequest httpServletRequest) {
		HttpSession httpSession = httpServletRequest.getSession(false);

		if ((httpSession != null) &&
			(httpSession.getAttribute(_SESSION_LOGIN_BOUNCES) != null)) {

			httpSession.removeAttribute(_SESSION_LOGIN_BOUNCES);
		}
	}

	/**
	 * Cầu dao chống vòng lặp. Nếu Liferay bounce trang đăng nhập sang một URL
	 * mà filter lại đá ngược về đăng nhập, cả portal sẽ không dùng được. Sau
	 * {@link #_MAX_LOGIN_BOUNCES} lần chuyển hướng liên tiếp mà phiên vẫn chưa
	 * chạm được giao diện đăng nhập, filter mở cổng cho request đi tiếp và ghi
	 * {@code WARN} kèm URL gây lặp.
	 *
	 * <p>Đây là fail-open có chủ đích: mất hiệu lực chính sách cho phiên đó còn
	 * hơn làm chết cả portal. Dòng {@code WARN} cho biết chính xác path nào cần
	 * thêm vào danh sách auth path.</p>
	 *
	 * @return {@code true} nếu được phép chuyển hướng sang trang đăng nhập
	 */
	private boolean _shouldBounceToLogin(
		HttpServletRequest httpServletRequest, String path) {

		HttpSession httpSession = httpServletRequest.getSession();

		Object value = httpSession.getAttribute(_SESSION_LOGIN_BOUNCES);
		int bounces = (value instanceof Integer) ? (Integer)value : 0;

		if (bounces >= _MAX_LOGIN_BOUNCES) {
			_log.warn(
				"Login redirect loop detected at " + path +
					"; letting the request through. Add this path to " +
						"DomainPolicyRules auth paths.");

			return false;
		}

		httpSession.setAttribute(_SESSION_LOGIN_BOUNCES, bounces + 1);

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

	/**
	 * Ghi lại quyết định của filter cho những request điều hướng trang đầu
	 * tiên sau khi deploy, để xác nhận filter thực sự nằm trong chain và host
	 * được phân giải đúng. Hết hạn mức thì chỉ còn ghi ở mức {@code DEBUG}.
	 */
	private void _logDecision(
		HttpServletRequest httpServletRequest, String host,
		DomainRole domainRole, String path, boolean handled) {

		boolean debugEnabled = _log.isDebugEnabled();

		if (!debugEnabled && (_diagnosticLogBudget.get() <= 0)) {
			return;
		}

		// Bỏ qua nhiễu: asset tĩnh và các lời gọi giữ phiên (
		// /c/portal/extend_session chạy mỗi giây từ mọi tab đang mở) sẽ ăn hết
		// hạn mức trước khi bắt được request cần xem.

		if (DomainPolicyRules.isResourceRequest(path) ||
			DomainPolicyRules.isAuthPath(path)) {

			return;
		}

		if (!debugEnabled && (_diagnosticLogBudget.getAndDecrement() <= 0)) {
			return;
		}

		String message =
			"Domain access policy: node=" + _nodeName + ", host=" + host +
				", role=" + domainRole +
				", dispatcher=" + httpServletRequest.getDispatcherType() +
				", method=" + httpServletRequest.getMethod() + ", path=" +
					path + ", query=" + httpServletRequest.getQueryString() +
						", xForwardedHost=" +
						httpServletRequest.getHeader("X-Forwarded-Host") +
							", hostHeader=" +
								httpServletRequest.getHeader("Host") +
									", signedIn=" +
										_isSignedIn(httpServletRequest) +
											", handled=" + handled;

		if (debugEnabled) {
			_log.debug(message);
		}
		else {
			_log.info(message);
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

		// Trên nhánh FORWARD response có thể đã commit; sendRedirect lúc đó ném
		// IllegalStateException và làm hỏng cả trang.

		if (httpServletResponse.isCommitted()) {
			_log.warn(
				"Unable to redirect " + currentPath + " to " + location +
					": response already committed");

			return false;
		}

		httpServletResponse.setHeader(
			"Cache-Control", "no-store, no-cache, must-revalidate");
		httpServletResponse.setHeader("Pragma", "no-cache");
		httpServletResponse.sendRedirect(location);

		return true;
	}

	private static final String _ATTRIBUTE_PROCESSED =
		DomainAccessPolicyFilter.class.getName() + "#PROCESSED";

	private static final int _DIAGNOSTIC_LOG_LIMIT = 200;

	private static final int _MAX_LOGIN_BOUNCES = 3;

	private static final String _SESSION_LOGIN_BOUNCES =
		DomainAccessPolicyFilter.class.getName() + "#LOGIN_BOUNCES";

	private static final Log _log = LogFactoryUtil.getLog(
		DomainAccessPolicyFilter.class);

	private volatile String _nodeName = "unknown";

	private final AtomicInteger _diagnosticLogBudget = new AtomicInteger(
		_DIAGNOSTIC_LOG_LIMIT);

	@Reference
	private AdminNetworkPolicyPermission _permission;

}
