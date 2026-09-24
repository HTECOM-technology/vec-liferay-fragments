package vn.vec.custom.admin.domainpolicy.filter;

import com.liferay.portal.kernel.log.Jdk14LogFactoryImpl;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.GroupLocalService;

import java.io.PrintWriter;
import java.io.StringWriter;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.DispatcherType;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import vn.vec.custom.admin.domainpolicy.model.DomainRole;
import vn.vec.custom.admin.networkpolicy.service.AdminNetworkPolicyPermission;
import vn.vec.custom.admin.ui.TopHeadDynamicInclude;

/** Kiểm tra filter thật bằng request/session giả, không cần Liferay server. */
public class DomainAccessPolicySelfTest {

	public static void main(String[] args) throws Exception {
		LogFactoryUtil.setLogFactory(new Jdk14LogFactoryImpl());

		_assertEquals(
			DomainRole.PUBLIC_SITE,
			DomainPolicyRules.resolveRole("duongcaotoc.com.vn"),
			"Vai trò duongcaotoc.com.vn");
		_assertEquals(
			DomainRole.PUBLIC_SITE,
			DomainPolicyRules.resolveRole("news.duongcaotoc.com.vn"),
			"Vai trò subdomain duongcaotoc.com.vn");
		_assertEquals(
			DomainRole.UNKNOWN,
			DomainPolicyRules.resolveRole("duongcaotoc.com.vn.attacker.invalid"),
			"Không nhận nhầm host có hậu tố khác");
		_checkHead("duongcaotoc.com.vn", true);
		_checkHead("www.duongcaotoc.com.vn", true);
		_checkHead("expressway.com.vn", true);
		_checkHead("news.duongcaotoc.com.vn", true);
		_checkHead("admin-portal.tctvec.vn", false);

		// Cổng công khai: không đăng nhập được, phiên đăng nhập bị đăng xuất.
		for (String host : new String[] {
				"duongcaotoc.com.vn", "WWW.DUONGCAOTOC.COM.VN.:443",
				"expressway.com.vn", "www.expressway.com.vn",
				"news.duongcaotoc.com.vn"}) {

			for (boolean signedIn : new boolean[] {false, true}) {
				for (String path : new String[] {"/", "/web/guest/home", "/vi/tin-tuc"}) {
					_check(host, path, null, "GET", signedIn,
						signedIn ? "/c/portal/logout" : null);
				}

				for (String path : new String[] {
						"/c/portal/login", "/web/guest/login", "/vi/sign-in",
						"/c/portal/forgot_password", "/c/portal/reset_password"}) {

					_check(host, path, null, "GET", signedIn, "/");
				}

				_check(host, "/c/portal/logout", null, "GET", signedIn, null);
			}
		}

		_check("admin-portal.tctvec.vn", "/", null, "GET", false,
			"/c/portal/login?redirect=%2Fgroup%2Fcontrol_panel%2Fmanage");

		// Không tìm thấy site internet thì quay về Control Panel, không lặp.
		_check("admin-portal.tctvec.vn", "/", null, "GET", true,
			DomainPolicyRules.ADMIN_LANDING_PATH);
		_check("admin-portal.tctvec.vn", "/group/control_panel/manage", null, "GET", true, null);
		_check("admin-portal.tctvec.vn", "/group/control_panel/manage",
			"p_p_id=com_liferay_users_admin_web_portlet_UsersAdminPortlet", "GET", true, null);
		_check("admin-portal.tctvec.vn", "/group/guest/~/control_panel/manage", null, "GET", true, null);
		_assertEquals(true, DomainPolicyRules.isEmptyControlPanelRequest(
			"/group/control_panel/manage", null), "Control Panel trống");
		_assertEquals(true, DomainPolicyRules.isEmptyControlPanelRequest(
			"/vi/group/control_panel/manage", "p_p_id=&refererPlid=1"), "Control Panel p_p_id rỗng");
		_assertEquals(false, DomainPolicyRules.isEmptyControlPanelRequest(
			"/group/control_panel/manage", "a=1&p_p_id=x"), "Control Panel đã chọn ứng dụng");

		_check("portal.tctvec.vn", "/", null, "GET", false,
			"/c/portal/login?redirect=%2Fweb%2Fguest%2Fintranet");
		_check("portal.tctvec.vn", "/group/control_panel/manage", null, "GET", true,
			DomainPolicyRules.INTRANET_LANDING_PATH);
		_check("portal.tctvec.vn", "/web/guest/intranet", null, "GET", true, null);
		_check("localhost", "/", null, "GET", false, null);
		_check("duongcaotoc.com.vn.attacker.invalid", "/", null, "GET", true, null);

		String intranetLogin = "/c/portal/login?redirect=%2Fweb%2Fguest%2Fintranet";

		// Client giữ cookie nhưng không theo redirect, mở lần lượt nhiều trang
		// khác nhau: không bao giờ được cho qua.
		Map<String, Object> crawlerSession = new HashMap<>();

		for (int i = 0; i < 10; i++) {
			_check("portal.tctvec.vn", "/web/guest/w/bai-" + i, null, "GET", false,
				intranetLogin, crawlerSession);
			_check("portal.tctvec.vn", "/web/guest/intranet", null, "GET", false,
				intranetLogin, crawlerSession);
		}

		// Cùng path, query redirect= lồng nhau khác nhau (log crawler thật).
		Map<String, Object> nestedSession = new HashMap<>();

		for (int i = 0; i < 10; i++) {
			_check("portal.tctvec.vn", "/web/guest/w/quy-hoach-thu-do", "redirect=%2Fw%2Fbai-" + i,
				"GET", false, intranetLogin, nestedSession);
		}

		// Trang intranet không bao giờ mở cầu dao, kể cả cùng URL lặp lại.
		Map<String, Object> intranetSession = new HashMap<>();

		for (int i = 0; i < 10; i++) {
			_check("portal.tctvec.vn", "/web/guest/intranet", null, "GET", false,
				intranetLogin, intranetSession);
		}

		// Vòng lặp thật trên cùng một URL: cho qua đúng một request rồi đếm lại.
		Map<String, Object> loopSession = new HashMap<>();

		for (int round = 0; round < 2; round++) {
			for (int i = 0; i < 3; i++) {
				_check("portal.tctvec.vn", "/web/guest/sso-landing", null, "GET", false,
					intranetLogin, loopSession);
			}

			_check("portal.tctvec.vn", "/web/guest/sso-landing", null, "GET", false,
				null, loopSession);
		}

		// Chạm trang đăng nhập thì bộ đếm được xoá.
		Map<String, Object> resetSession = new HashMap<>();

		for (int i = 0; i < 3; i++) {
			_check("portal.tctvec.vn", "/web/guest/sso-landing", null, "GET", false,
				intranetLogin, resetSession);
		}

		_check("portal.tctvec.vn", "/c/portal/login", null, "GET", false, null, resetSession);
		_check("portal.tctvec.vn", "/web/guest/sso-landing", null, "GET", false,
			intranetLogin, resetSession);

		System.out.println("DomainAccessPolicySelfTest OK");
	}

	private static void _check(
		String host, String path, String query, String method, boolean signedIn,
		String expectedRedirect) throws Exception {

		_check(host, path, query, method, signedIn, expectedRedirect, new HashMap<>());
	}

	private static void _check(
		String host, String path, String query, String method, boolean signedIn,
		String expectedRedirect, Map<String, Object> sessionAttributes)
		throws Exception {

		Map<String, Object> attributes = new HashMap<>();
		HttpSession session = _proxy(HttpSession.class, (proxy, called, args) -> {
			switch (called.getName()) {
				case "getAttribute": return sessionAttributes.get(args[0]);
				case "setAttribute": return sessionAttributes.put((String)args[0], args[1]);
				case "removeAttribute": return sessionAttributes.remove(args[0]);
				default: return null;
			}
		});
		HttpServletRequest request = _proxy(HttpServletRequest.class, (proxy, called, args) -> {
			switch (called.getName()) {
				case "getAttribute": return attributes.get(args[0]);
				case "setAttribute": return attributes.put((String)args[0], args[1]);
				case "getHeader":
					if ("X-Forwarded-Host".equals(args[0])) { return host; }
					if ("Accept".equals(args[0])) { return "text/html"; }
					return null;
				case "getRequestURI": return path;
				case "getQueryString": return query;
				case "getMethod": return method;
				case "getSession": return session;
				case "getDispatcherType": return DispatcherType.REQUEST;
				default: return null;
			}
		});
		String[] redirect = {null};
		HttpServletResponse response = _proxy(HttpServletResponse.class, (proxy, called, args) -> {
			if ("isCommitted".equals(called.getName())) { return false; }
			if ("sendRedirect".equals(called.getName())) { redirect[0] = (String)args[0]; }
			return null;
		});

		User user = signedIn ? _proxy(User.class, (proxy, called, args) ->
			"getCompanyId".equals(called.getName()) ? 20097L : null) : null;
		DomainAccessPolicyFilter filter = new DomainAccessPolicyFilter();
		Field permission = DomainAccessPolicyFilter.class.getDeclaredField("_permission");
		permission.setAccessible(true);
		permission.set(filter, new AdminNetworkPolicyPermission() {
			@Override
			public User getSignedInUser(HttpServletRequest ignored) {
				return user;
			}
		});
		Field groupLocalService = DomainAccessPolicyFilter.class.getDeclaredField(
			"_groupLocalService");
		groupLocalService.setAccessible(true);
		groupLocalService.set(filter, _proxy(GroupLocalService.class, (proxy, called, args) -> null));

		String label = host + " " + method + " " + path + " signedIn=" + signedIn;
		_assertEquals(expectedRedirect == null, filter.doFilterTry(request, response), label);
		_assertEquals(expectedRedirect, redirect[0], label);
		_assertEquals(true, filter.doFilterTry(request, response), label + " dispatch tiếp theo");
	}

	private static void _checkHead(String host, boolean hideLogin) throws Exception {
		HttpServletRequest request = _proxy(HttpServletRequest.class, (proxy, called, args) -> {
			if ("getHeader".equals(called.getName()) && "Host".equals(args[0])) {
				return host;
			}
			if ("getRequestURI".equals(called.getName())) { return "/web/guest/home"; }
			return null;
		});
		StringWriter html = new StringWriter();
		PrintWriter writer = new PrintWriter(html);
		HttpServletResponse response = _proxy(HttpServletResponse.class, (proxy, called, args) -> {
			return "getWriter".equals(called.getName()) ? writer : null;
		});
		new TopHeadDynamicInclude().include(request, response, "/html/common/themes/top_head.jsp#pre");
		_assertEquals(hideLogin, html.toString().contains("domain-policy/public-domain.css"),
			host + " CSS ẩn đăng nhập");
	}

	private static <T> T _proxy(Class<T> type, InvocationHandler handler) {
		return type.cast(Proxy.newProxyInstance(
			type.getClassLoader(), new Class<?>[] {type}, handler));
	}

	private static void _assertEquals(Object expected, Object actual, String label) {
		if (!java.util.Objects.equals(expected, actual)) {
			throw new AssertionError(label + ": expected " + expected + " but got " + actual);
		}
	}
}
