package vn.vec.custom.admin.audit.filter;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.util.PortalUtil;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.service.AuditLogService;

/**
 * Records HTTP error responses (5xx and selected 4xx) into VEC_AUDIT_LOG so the
 * Audit Log screen surfaces application level errors without tailing
 * catalina.out.
 *
 * <p>Registered as a portal servlet filter on {@code /*} so it wraps both
 * portal pages and module/REST requests under {@code /o/...}. Static assets and
 * other noise are skipped, and only meaningful status codes are persisted.</p>
 */
@Component(
	property = {
		"after-filter=Auto Login Filter",
		"dispatcher=REQUEST",
		"servlet-context-name=",
		"servlet-filter-name=VEC Audit HTTP Error Filter",
		"url-pattern=/*"
	},
	service = Filter.class
)
public class HttpErrorAuditFilter implements Filter {

	@Override
	public void destroy() {
	}

	@Override
	public void doFilter(
			ServletRequest servletRequest, ServletResponse servletResponse,
			FilterChain filterChain)
		throws IOException, ServletException {

		if (!(servletRequest instanceof HttpServletRequest) ||
			!(servletResponse instanceof HttpServletResponse)) {

			filterChain.doFilter(servletRequest, servletResponse);

			return;
		}

		HttpServletRequest httpServletRequest =
			(HttpServletRequest)servletRequest;
		HttpServletResponse httpServletResponse =
			(HttpServletResponse)servletResponse;

		try {
			filterChain.doFilter(servletRequest, servletResponse);
		}
		catch (IOException | RuntimeException | ServletException exception) {

			// An uncaught exception propagating out of the chain is rendered by
			// the container as HTTP 500. Capture it before re-throwing.

			if (!_isStaticOrNoise(httpServletRequest)) {
				_audit(
					httpServletRequest, httpServletResponse,
					HttpServletResponse.SC_INTERNAL_SERVER_ERROR, exception);
			}

			throw exception;
		}

		int status = httpServletResponse.getStatus();

		if (_shouldAudit(status) && !_isStaticOrNoise(httpServletRequest)) {
			_audit(httpServletRequest, httpServletResponse, status, null);
		}
	}

	@Override
	public void init(FilterConfig filterConfig) {
	}

	private void _audit(
		HttpServletRequest httpServletRequest,
		HttpServletResponse httpServletResponse, int status,
		Throwable throwable) {

		try {
			ServiceContext serviceContext = new ServiceContext();

			try {
				serviceContext.setCompanyId(
					PortalUtil.getCompanyId(httpServletRequest));
				serviceContext.setScopeGroupId(
					PortalUtil.getScopeGroupId(httpServletRequest));
			}
			catch (Exception exception) {
			}

			try {
				serviceContext.setUserId(
					PortalUtil.getUserId(httpServletRequest));
			}
			catch (Exception exception) {
			}

			serviceContext.setRequest(httpServletRequest);

			_auditLogService.logHttpError(
				status, httpServletRequest.getMethod(),
				httpServletRequest.getRequestURI(), throwable, serviceContext);
		}
		catch (Exception exception) {
			_log.error("Unable to record HTTP error audit log", exception);
		}
	}

	private boolean _isStaticOrNoise(HttpServletRequest httpServletRequest) {
		String requestUri = httpServletRequest.getRequestURI();

		if ((requestUri == null) || requestUri.isEmpty()) {
			return true;
		}

		String lowerCaseRequestUri = requestUri.toLowerCase();

		for (String suffix : _STATIC_SUFFIXES) {
			if (lowerCaseRequestUri.endsWith(suffix)) {
				return true;
			}
		}

		for (String fragment : _NOISE_FRAGMENTS) {
			if (lowerCaseRequestUri.contains(fragment)) {
				return true;
			}
		}

		return false;
	}

	private boolean _shouldAudit(int status) {
		if (status >= 500) {
			return true;
		}

		if ((status == HttpServletResponse.SC_UNAUTHORIZED) ||
			(status == HttpServletResponse.SC_FORBIDDEN) ||
			(status == 429)) {

			return true;
		}

		return false;
	}

	private static final String[] _NOISE_FRAGMENTS = {
		"/combo", "/css_cached/", "/documents/", "/favicon.ico", "/html/themes/",
		"/o/dynamic-resources/", "/o/frontend-css-web/", "/o/js_bundle_config",
		"/o/js_loader_modules"
	};

	private static final String[] _STATIC_SUFFIXES = {
		".css", ".eot", ".gif", ".ico", ".jpeg", ".jpg", ".js", ".map", ".png",
		".svg", ".ttf", ".woff", ".woff2"
	};

	private static final Log _log = LogFactoryUtil.getLog(
		HttpErrorAuditFilter.class);

	@Reference
	private AuditLogService _auditLogService;

}
