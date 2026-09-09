package vn.vec.custom.admin.domainpolicy.filter;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import vn.vec.custom.admin.domainpolicy.model.DomainRole;

/**
 * Bảng luật tĩnh cho {@link DomainAccessPolicyFilter}: ánh xạ host sang
 * {@link DomainRole} và phân loại đường dẫn.
 *
 * <p>Danh sách domain được hardcode có chủ đích để không phụ thuộc cấu hình
 * runtime; đổi domain đồng nghĩa với build lại module.</p>
 */
public class DomainPolicyRules {

	/**
	 * Trang đích duy nhất của cổng nội bộ.
	 */
	public static final String INTRANET_LANDING_PATH = "/web/guest/intranet";

	/**
	 * Trang đích của cổng quản trị, tương đương Control Panel hiện tại.
	 */
	public static final String ADMIN_LANDING_PATH = "/group/control_panel/manage";

	public static DomainRole resolveRole(String host) {
		if ((host == null) || host.isEmpty()) {
			return DomainRole.UNKNOWN;
		}

		for (String adminHost : _ADMIN_HOSTS) {
			if (host.equals(adminHost)) {
				return DomainRole.ADMIN;
			}
		}

		for (String intranetHost : _INTRANET_HOSTS) {
			if (host.equals(intranetHost)) {
				return DomainRole.INTRANET;
			}
		}

		for (String publicDomain : _PUBLIC_DOMAINS) {
			if (host.equals(publicDomain) ||
				host.endsWith("." + publicDomain)) {

				return DomainRole.PUBLIC_SITE;
			}
		}

		return DomainRole.UNKNOWN;
	}

	/**
	 * Lấy host thật của request. nginx luôn ghi đè {@code X-Forwarded-Host} và
	 * {@code Host} nên hai header này tin cậy được; giá trị client tự gửi bị
	 * thay thế trước khi tới Liferay.
	 */
	public static String resolveHost(HttpServletRequest httpServletRequest) {
		if (httpServletRequest == null) {
			return "";
		}

		String host = _firstValue(
			httpServletRequest.getHeader("X-Forwarded-Host"));

		if (host.isEmpty()) {
			host = _firstValue(httpServletRequest.getHeader("Host"));
		}

		if (host.isEmpty()) {
			host = _firstValue(httpServletRequest.getServerName());
		}

		return _normalizeHost(host);
	}

	/**
	 * Bỏ query string và chuẩn hoá dấu {@code /} cuối.
	 */
	public static String normalizePath(String requestUri) {
		if (requestUri == null) {
			return "/";
		}

		String path = requestUri.trim();
		int queryIndex = path.indexOf('?');

		if (queryIndex >= 0) {
			path = path.substring(0, queryIndex);
		}

		if (path.isEmpty()) {
			return "/";
		}

		while ((path.length() > 1) && path.endsWith("/")) {
			path = path.substring(0, path.length() - 1);
		}

		return path;
	}

	/**
	 * Bỏ tiền tố locale của Liferay ({@code /en}, {@code /vi}, {@code /en_US},
	 * {@code /en-us}) để so khớp đường dẫn không phụ thuộc ngôn ngữ.
	 */
	public static String stripLocale(String path) {
		if ((path == null) || (path.length() < 3) || (path.charAt(0) != '/')) {
			return path;
		}

		int end = path.indexOf('/', 1);
		String segment = (end < 0) ? path.substring(1) : path.substring(1, end);

		if (!_isLocaleSegment(segment)) {
			return path;
		}

		if (end < 0) {
			return "/";
		}

		return path.substring(end);
	}

	/**
	 * Tài nguyên tĩnh và endpoint máy-đọc-máy: filter không bao giờ redirect
	 * những đường dẫn này vì sẽ làm hỏng asset, REST API và tải file.
	 */
	public static boolean isResourceRequest(String path) {
		if (path == null) {
			return false;
		}

		for (String prefix : _RESOURCE_PREFIXES) {
			if (path.startsWith(prefix)) {
				return true;
			}
		}

		String lowerCasePath = path.toLowerCase(Locale.ROOT);

		for (String extension : _RESOURCE_EXTENSIONS) {
			if (lowerCasePath.endsWith(extension)) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Các đường dẫn phục vụ việc đăng nhập / khôi phục tài khoản.
	 */
	public static boolean isLoginPath(String path) {
		if (path == null) {
			return false;
		}

		for (String loginPath : _LOGIN_PATHS) {
			if (path.equals(loginPath)) {
				return true;
			}
		}

		String localeFreePath = stripLocale(path);

		return localeFreePath.endsWith("/login") ||
			localeFreePath.endsWith("/sign-in");
	}

	public static boolean isLogoutPath(String path) {
		return "/c/portal/logout".equals(path);
	}

	/**
	 * Đăng nhập, đăng xuất và các bước bắt buộc sau đăng nhập (đổi mật khẩu,
	 * chấp nhận điều khoản...). Trên cổng nội bộ và cổng quản trị các đường dẫn
	 * này luôn được đi qua, nếu không sẽ tạo vòng lặp redirect.
	 */
	public static boolean isAuthPath(String path) {
		if (path == null) {
			return false;
		}

		for (String authPath : _AUTH_PATHS) {
			if (path.equals(authPath)) {
				return true;
			}
		}

		return isLoginPath(path);
	}

	/**
	 * Request đang hiển thị chính giao diện đăng nhập, kể cả khi Liferay bounce
	 * sang một trang thường mang theo LoginPortlet trên query string thay vì
	 * một friendly URL kết thúc bằng {@code /login}.
	 */
	public static boolean isAuthRequest(String path, String queryString) {
		if (isAuthPath(path)) {
			return true;
		}

		if (queryString == null) {
			return false;
		}

		return queryString.contains("LoginPortlet");
	}

	/**
	 * Trang thuộc phạm vi intranet, không bị đưa về {@link
	 * #INTRANET_LANDING_PATH}.
	 */
	public static boolean isIntranetPath(String path) {
		String localeFreePath = stripLocale(path);

		for (String prefix : _INTRANET_PATH_PREFIXES) {
			if (localeFreePath.equals(prefix) ||
				localeFreePath.startsWith(prefix + "/")) {

				return true;
			}
		}

		return false;
	}

	/**
	 * Trang mở đầu trên cổng quản trị: đưa thẳng về Control Panel thay vì hiển
	 * thị trang public hoặc intranet.
	 */
	public static boolean isAdminLandingPath(String path) {
		String localeFreePath = stripLocale(path);

		for (String landingPath : _ADMIN_LANDING_SOURCE_PATHS) {
			if (localeFreePath.equals(landingPath)) {
				return true;
			}
		}

		return false;
	}

	private static String _firstValue(String headerValue) {
		if (headerValue == null) {
			return "";
		}

		String value = headerValue.trim();
		int commaIndex = value.indexOf(',');

		if (commaIndex >= 0) {
			value = value.substring(0, commaIndex).trim();
		}

		return value;
	}

	private static boolean _isLocaleSegment(String segment) {
		int length = segment.length();

		if ((length != 2) && (length != 5)) {
			return false;
		}

		if (!Character.isLetter(segment.charAt(0)) ||
			!Character.isLetter(segment.charAt(1))) {

			return false;
		}

		if (length == 2) {
			return true;
		}

		char separator = segment.charAt(2);

		if ((separator != '_') && (separator != '-')) {
			return false;
		}

		return Character.isLetter(segment.charAt(3)) &&
			Character.isLetter(segment.charAt(4));
	}

	private static String _normalizeHost(String host) {
		if (host.isEmpty()) {
			return "";
		}

		String normalizedHost = host.toLowerCase(Locale.ROOT);

		// IPv6 literal: [::1]:8080
		if (normalizedHost.startsWith("[")) {
			int closeIndex = normalizedHost.indexOf(']');

			if (closeIndex > 0) {
				return normalizedHost.substring(0, closeIndex + 1);
			}

			return normalizedHost;
		}

		int colonIndex = normalizedHost.indexOf(':');

		if (colonIndex >= 0) {
			normalizedHost = normalizedHost.substring(0, colonIndex);
		}

		while (normalizedHost.endsWith(".")) {
			normalizedHost = normalizedHost.substring(
				0, normalizedHost.length() - 1);
		}

		if (normalizedHost.startsWith("www.")) {
			normalizedHost = normalizedHost.substring(4);
		}

		return normalizedHost;
	}

	private static final String[] _ADMIN_HOSTS = {"portal-admin.tctvec.vn"};

	private static final String[] _INTRANET_HOSTS = {"portal.tctvec.vn"};

	private static final String[] _PUBLIC_DOMAINS = {
		"duongcaotoc.com.vn", "expressway.com.vn"
	};

	private static final String[] _ADMIN_LANDING_SOURCE_PATHS = {
		"/", "/home", "/intranet", "/web/guest", "/web/guest/home",
		"/web/guest/intranet", "/web/intranet"
	};

	private static final String[] _AUTH_PATHS = {
		"/c/portal/expire_session", "/c/portal/extend_session",
		"/c/portal/logout", "/c/portal/update_email_address",
		"/c/portal/update_password", "/c/portal/update_reminder_query",
		"/c/portal/update_terms_of_use", "/c/portal/verify_email_address"
	};

	private static final String[] _INTRANET_PATH_PREFIXES = {
		"/intranet", "/web/guest/intranet", "/web/intranet"
	};

	private static final String[] _LOGIN_PATHS = {
		"/c/portal/create_account", "/c/portal/forgot_password",
		"/c/portal/login", "/c/portal/reset_password"
	};

	private static final String[] _RESOURCE_EXTENSIONS = {
		".css", ".eot", ".gif", ".ico", ".jpeg", ".jpg", ".js", ".json", ".m3u8",
		".map", ".mp4", ".pdf", ".png", ".svg", ".ttf", ".webp", ".woff",
		".woff2", ".xml"
	};

	private static final String[] _RESOURCE_PREFIXES = {
		"/api/", "/combo", "/documents/", "/html/", "/image/", "/o/", "/osgi/",
		"/tunnel-web/"
	};

	private DomainPolicyRules() {
	}

}
