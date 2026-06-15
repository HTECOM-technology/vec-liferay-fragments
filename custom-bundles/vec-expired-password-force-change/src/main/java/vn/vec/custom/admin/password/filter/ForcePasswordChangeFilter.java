package vn.vec.custom.admin.password.filter;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionCheckerFactoryUtil;
import com.liferay.portal.kernel.servlet.BaseFilter;
import com.liferay.portal.kernel.servlet.TryFilter;
import com.liferay.portal.kernel.util.PortalUtil;

import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;

import vn.vec.custom.admin.password.configuration.ForcePasswordChangeConfiguration;
import vn.vec.custom.admin.password.lifecycle.ForcePasswordChangePostLoginAction;
import vn.vec.custom.admin.password.util.PasswordExpirationUtil;

/**
 * Intercepts every request for an authenticated user whose password has
 * expired and redirects them to the change-password page.
 *
 * The filter runs after "Auto Login Filter" so that the user identity is
 * fully resolved before we check password state.
 *
 * Safety guarantees:
 * - Feature disabled by default (enabled=false) — no behavior change on deploy.
 * - Omniadmin excluded by default (includeOmniAdmin=false).
 * - Static resources (CSS/JS/fonts) always pass through via extension matching.
 * - The changePasswordURL itself is always excluded to prevent redirect loops.
 * - Errors during expiry check are logged and the request is allowed through.
 * - If the redirect counter in session exceeds MAX_REDIRECT_SAFETY, log ERROR
 *   and let the request through to prevent a stuck state.
 */
@Component(
	configurationPid = "vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter",
	property = {
		"after-filter=Auto Login Filter",
		"dispatcher=REQUEST",
		"servlet-context-name=",
		"servlet-filter-name=VEC Force Password Change Filter",
		"url-pattern=/*"
	},
	service = Filter.class
)
public class ForcePasswordChangeFilter extends BaseFilter implements TryFilter {

	@Activate
	@Modified
	protected void activate(Map<String, Object> properties) {
		_configuration =
			ForcePasswordChangeConfiguration.fromProperties(properties);

		if (_configuration.isEnabled()) {
			_log.info(
				"VEC Force Password Change Filter activated: " +
					"changePasswordURL=" + _configuration.getChangePasswordURL() +
					", includeOmniAdmin=" + _configuration.isIncludeOmniAdmin() +
					", checkOnEveryRequest=" +
					_configuration.isCheckOnEveryRequest());
		}
	}

	@Override
	public Object doFilterTry(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws Exception {

		ForcePasswordChangeConfiguration configuration = _configuration;

		if ((configuration == null) || !configuration.isEnabled()) {
			return true;
		}

		String requestUri = httpServletRequest.getRequestURI();

		if (_urlMatcher.isExcluded(
				requestUri, configuration.getExcludedPathPatterns())) {

			return true;
		}

		// Always exclude the configured changePasswordURL to prevent loops,
		// regardless of whether it is in excludedPathPatterns.
		if (_urlMatcher.isChangePasswordUrl(
				requestUri, configuration.getChangePasswordURL())) {

			return true;
		}

		User user = _getUser(httpServletRequest);

		if ((user == null) || user.isDefaultUser()) {
			return true;
		}

		if (!configuration.isIncludeOmniAdmin() && _isOmniAdmin(user)) {
			return true;
		}

		HttpSession session = httpServletRequest.getSession(false);

		if (session == null) {
			return true;
		}

		// Loop-safety: if we've redirected too many times without resolution,
		// let the request through and log an error so the admin investigates
		// the changePasswordURL configuration.
		Integer redirectCount = (Integer)session.getAttribute(
			SESSION_ATTR_REDIRECT_COUNT);

		if ((redirectCount != null) && (redirectCount >= MAX_REDIRECT_SAFETY)) {
			_log.error(
				"VEC Force Password Change: redirect safety limit reached " +
					"(count=" + redirectCount + ") for userId=" +
					user.getUserId() + ", requestURI=" + requestUri +
					". Allowing request through. Verify changePasswordURL: " +
					configuration.getChangePasswordURL());

			session.removeAttribute(SESSION_ATTR_REDIRECT_COUNT);
			session.removeAttribute(
				ForcePasswordChangePostLoginAction.SESSION_ATTR_FORCE_CHANGE);

			return true;
		}

		boolean forceChange = _isForceChangeRequired(
			session, user, configuration);

		if (!forceChange) {
			return true;
		}

		if (configuration.isLogDeniedNavigation()) {
			_log.info(
				"VEC Force Password Change: blocking navigation, userId=" +
					user.getUserId() + ", screenName=" + user.getScreenName() +
					", companyId=" + user.getCompanyId() + ", requestURI=" +
					requestUri + ", reason=PASSWORD_EXPIRED_FORCE_CHANGE");
		}

		session.setAttribute(
			SESSION_ATTR_REDIRECT_COUNT,
			(redirectCount == null) ? 1 : redirectCount + 1);

		httpServletResponse.sendRedirect(configuration.getChangePasswordURL());

		return false;
	}

	@Override
	public boolean isFilterEnabled() {
		ForcePasswordChangeConfiguration configuration = _configuration;

		return (configuration != null) && configuration.isEnabled();
	}

	@Override
	protected Log getLog() {
		return _log;
	}

	private User _getUser(HttpServletRequest request) {
		try {
			return PortalUtil.getUser(request);
		}
		catch (Exception exception) {
			return null;
		}
	}

	private boolean _isForceChangeRequired(
		HttpSession session, User user,
		ForcePasswordChangeConfiguration configuration) {

		Boolean sessionFlag = (Boolean)session.getAttribute(
			ForcePasswordChangePostLoginAction.SESSION_ATTR_FORCE_CHANGE);

		if (Boolean.TRUE.equals(sessionFlag)) {
			// Re-validate: the user may have changed their password in another
			// tab or the session was preserved from a previous login.
			boolean stillExpired = PasswordExpirationUtil.isPasswordExpired(
				user);

			if (!stillExpired) {
				session.removeAttribute(
					ForcePasswordChangePostLoginAction.SESSION_ATTR_FORCE_CHANGE);
				session.removeAttribute(SESSION_ATTR_REDIRECT_COUNT);

				return false;
			}

			return true;
		}

		// Session flag not set. If checkOnEveryRequest is enabled, re-check
		// the user's password state to catch sessions that bypassed the
		// post-login hook (e.g. remember-me auto-login after password expired).
		if (configuration.isCheckOnEveryRequest()) {
			boolean expired = PasswordExpirationUtil.isPasswordExpired(user);

			if (expired) {
				session.setAttribute(
					ForcePasswordChangePostLoginAction.SESSION_ATTR_FORCE_CHANGE,
					Boolean.TRUE);

				_log.info(
					"VEC Force Password Change: detected expired password " +
						"without session flag (likely via auto-login), userId=" +
						user.getUserId() + ", companyId=" +
						user.getCompanyId() +
						", reason=PASSWORD_EXPIRED_FORCE_CHANGE");

				return true;
			}
		}

		return false;
	}

	private boolean _isOmniAdmin(User user) {
		try {
			PermissionChecker checker =
				PermissionCheckerFactoryUtil.create(user);

			return checker.isOmniadmin();
		}
		catch (Exception exception) {
			_log.warn(
				"Unable to check omniadmin status for userId=" +
					user.getUserId() + "; allowing through for safety");

			return true;
		}
	}

	private static final int MAX_REDIRECT_SAFETY = 5;

	private static final String SESSION_ATTR_REDIRECT_COUNT =
		"VEC_FORCE_CHANGE_REDIRECT_COUNT";

	private static final Log _log = LogFactoryUtil.getLog(
		ForcePasswordChangeFilter.class);

	private final ForcePasswordChangeUrlMatcher _urlMatcher =
		new ForcePasswordChangeUrlMatcher();

	private volatile ForcePasswordChangeConfiguration _configuration =
		ForcePasswordChangeConfiguration.fromProperties(null);

}
