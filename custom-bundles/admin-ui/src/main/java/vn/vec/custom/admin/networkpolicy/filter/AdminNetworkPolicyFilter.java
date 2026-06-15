package vn.vec.custom.admin.networkpolicy.filter;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.servlet.BaseFilter;
import com.liferay.portal.kernel.servlet.TryFilter;
import com.liferay.portal.kernel.util.PortalUtil;

import java.util.List;
import java.util.Map;

import javax.servlet.Filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.networkpolicy.filter.ClientIpResolver.ResolvedClientIp;
import vn.vec.custom.admin.networkpolicy.model.AdminNetworkPolicy;
import vn.vec.custom.admin.networkpolicy.service.AdminNetworkPolicyPermission;
import vn.vec.custom.admin.networkpolicy.service.AdminNetworkPolicyService;
import vn.vec.custom.admin.networkpolicy.util.IPv4NetworkUtil;

@Component(
	configurationPid = "vn.vec.custom.admin.networkpolicy.filter.AdminNetworkPolicyFilter",
	property = {
		"after-filter=Auto Login Filter",
		"dispatcher=REQUEST",
		"servlet-context-name=",
		"servlet-filter-name=VEC Admin Network Policy Filter",
		"url-pattern=/*"
	},
	service = Filter.class
)
public class AdminNetworkPolicyFilter extends BaseFilter implements TryFilter {

	@Activate
	@Modified
	protected void activate(Map<String, Object> properties) {
		_configuration = AdminNetworkPolicyFilterConfiguration.fromProperties(
			properties);
	}

	@Override
	public Object doFilterTry(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws Exception {

		AdminNetworkPolicyFilterConfiguration configuration = _configuration;

		if ((configuration == null) || !configuration.isEnabled()) {
			return true;
		}

		String requestUri = httpServletRequest.getRequestURI();

		if (!_urlMatcher.isProtected(
				requestUri, configuration.getProtectedUrlPatterns(),
				configuration.getExcludedUrlPatterns())) {

			return true;
		}

		long companyId = _getCompanyId(httpServletRequest);
		ResolvedClientIp resolvedClientIp = _clientIpResolver.resolve(
			httpServletRequest, configuration.getTrustedProxyCidrs());

		try {
			List<AdminNetworkPolicy> enabledPolicies =
				_adminNetworkPolicyService.getEnabledPolicies(companyId);

			if (enabledPolicies.isEmpty() &&
				configuration.isAllowWhenNoPolicy()) {

				return true;
			}

			if (!IPv4NetworkUtil.isValidSingleIp(resolvedClientIp.clientIp)) {
				_deny(
					httpServletRequest, httpServletResponse, companyId,
					resolvedClientIp, "Client IP is not a valid IPv4 address");

				return false;
			}

			if (_adminNetworkPolicyService.isClientAllowed(
					companyId, resolvedClientIp.clientIp)) {

				return true;
			}

			_deny(
				httpServletRequest, httpServletResponse, companyId, resolvedClientIp,
				"Client IP is not in enabled admin network policy whitelist");

			return false;
		}
		catch (Exception exception) {
			if (!configuration.isFailClosed()) {
				_log.warn(
					"Admin Network Policy check failed; allowing request because " +
						"failClosed=false",
					exception);

				return true;
			}

			_deny(
				httpServletRequest, httpServletResponse, companyId, resolvedClientIp,
				"Policy check failed and failClosed=true: " +
					exception.getMessage());

			return false;
		}
	}

	@Override
	public boolean isFilterEnabled() {
		AdminNetworkPolicyFilterConfiguration configuration = _configuration;

		return (configuration != null) && configuration.isEnabled();
	}

	@Override
	protected Log getLog() {
		return _log;
	}

	private void _deny(
			HttpServletRequest request, HttpServletResponse response, long companyId,
			ResolvedClientIp resolvedClientIp, String reason)
		throws Exception {

		User user = _permission.getSignedInUser(request);
		long userId = (user == null) ? 0 : user.getUserId();
		String userAgent = request.getHeader("User-Agent");
		String queryString = request.getQueryString();

		_log.warn(
			"Admin network access denied: companyId=" + companyId +
				", userId=" + userId +
				", clientIp=" + resolvedClientIp.clientIp +
				", remoteAddr=" + resolvedClientIp.remoteAddr +
				", trustedHeaderUsed=" + resolvedClientIp.trustedHeaderUsed +
				", method=" + request.getMethod() +
				", requestURI=" + request.getRequestURI() +
				", queryString=" + ((queryString == null) ? "" : queryString) +
				", userAgent=" + ((userAgent == null) ? "" : userAgent) +
				", reason=" + reason);

		response.setStatus(HttpServletResponse.SC_FORBIDDEN);
		response.setContentType("text/plain;charset=UTF-8");
		response.getWriter().write("403 Forbidden: admin network access denied.");
	}

	private long _getCompanyId(HttpServletRequest httpServletRequest) {
		try {
			return PortalUtil.getCompanyId(httpServletRequest);
		}
		catch (Exception exception) {
			return 0;
		}
	}

	private static final Log _log = LogFactoryUtil.getLog(
		AdminNetworkPolicyFilter.class);

	private final AdminNetworkPolicyUrlMatcher _urlMatcher =
		new AdminNetworkPolicyUrlMatcher();

	private volatile AdminNetworkPolicyFilterConfiguration _configuration =
		AdminNetworkPolicyFilterConfiguration.fromProperties(null);

	@Reference
	private AdminNetworkPolicyService _adminNetworkPolicyService;

	@Reference
	private ClientIpResolver _clientIpResolver;

	@Reference
	private AdminNetworkPolicyPermission _permission;

}
