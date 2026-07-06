package vn.vec.custom.admin.password.lifecycle;

import com.liferay.portal.kernel.events.ActionException;
import com.liferay.portal.kernel.events.LifecycleAction;
import com.liferay.portal.kernel.events.LifecycleEvent;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionCheckerFactoryUtil;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.PortalUtil;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;

import vn.vec.custom.admin.password.configuration.ForcePasswordChangeConfiguration;
import vn.vec.custom.admin.password.util.PasswordExpirationUtil;

/**
 * Runs after successful login. Sets VEC_FORCE_PASSWORD_CHANGE in the HTTP
 * session when the authenticated user's password has expired.
 *
 * NOTE: This hook only fires when the user actually logs in (grace login
 * succeeds). If the Password Policy has GraceLimit = 0, Liferay blocks
 * login before this action runs, and the force-change flow cannot work.
 * GraceLimit >= 1 is required.
 */
@Component(
	configurationPid = "vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter",
	property = "key=login.events.post",
	service = LifecycleAction.class
)
public class ForcePasswordChangePostLoginAction implements LifecycleAction {

	public static final String SESSION_ATTR_FORCE_CHANGE =
		"VEC_FORCE_PASSWORD_CHANGE";

	@Activate
	@Modified
	protected void activate(Map<String, Object> properties) {
		_configuration =
			ForcePasswordChangeConfiguration.fromProperties(properties);
	}

	@Override
	public void processLifecycleEvent(LifecycleEvent lifecycleEvent)
		throws ActionException {

		ForcePasswordChangeConfiguration configuration = _configuration;

		if ((configuration == null) || !configuration.isEnabled()) {
			return;
		}

		HttpServletRequest request = lifecycleEvent.getRequest();

		try {
			User user = _getCurrentUser(request);

			if ((user == null) || user.isDefaultUser()) {
				_log.info(
					"VEC Force Password Change post-login hook invoked but no " +
						"authenticated user was resolved. requestURI=" +
						request.getRequestURI());

				return;
			}

			long remainingGraceLogins =
				PasswordExpirationUtil.getRemainingGraceLogins(user);

			boolean forceChangeRequired =
				PasswordExpirationUtil.isForceChangeRequired(user);

			_log.info(
				"VEC Force Password Change post-login hook invoked: userId=" +
					user.getUserId() + ", screenName=" + user.getScreenName() +
					", companyId=" + user.getCompanyId() +
					", graceLoginCount=" +
					PasswordExpirationUtil.getGraceLoginCount(user) +
					", remainingGraceLogins=" + remainingGraceLogins +
					", forceChangeRequired=" + forceChangeRequired +
					", requestURI=" + request.getRequestURI());

			if (!configuration.isIncludeOmniAdmin() && _isOmniAdmin(user)) {
				_log.info(
					"VEC Force Password Change post-login hook skipping " +
						"omniadmin userId=" + user.getUserId());

				return;
			}

			HttpSession session = request.getSession(false);

			if (session == null) {
				_log.warn(
					"VEC Force Password Change post-login hook found no HTTP " +
						"session for userId=" + user.getUserId());

				return;
			}

			if (forceChangeRequired) {
				session.setAttribute(SESSION_ATTR_FORCE_CHANGE, Boolean.TRUE);

				if (PasswordExpirationUtil.hasGraceLimitZero(user)) {
					_log.warn(
						"VEC Force Password Change: userId=" +
							user.getUserId() + " companyId=" +
							user.getCompanyId() +
							" — password expired but GraceLimit=0 in the " +
							"active Password Policy. This post-login hook " +
							"should not be reachable in that state. " +
							"Verify Password Policy configuration.");
				}

				_log.info(
					"VEC Force Password Change required: userId=" +
						user.getUserId() + ", screenName=" +
						user.getScreenName() + ", companyId=" +
						user.getCompanyId() + ", graceLoginCount=" +
						PasswordExpirationUtil.getGraceLoginCount(user) +
						", remainingGraceLogins=" +
						PasswordExpirationUtil.getRemainingGraceLogins(user) +
						", reason=PASSWORD_EXPIRED_FORCE_CHANGE");
			}
			else {
				session.removeAttribute(SESSION_ATTR_FORCE_CHANGE);

				_log.info(
					"VEC Force Password Change post-login hook cleared force " +
						"change flag for userId=" + user.getUserId());
			}
		}
		catch (Exception exception) {
			_log.error(
				"VEC Force Password Change: error in post-login hook",
				exception);
		}
	}

	private User _getCurrentUser(HttpServletRequest request) {
		try {
			long userId = PortalUtil.getUserId(request);

			if (userId > 0) {
				User user = _userLocalService.fetchUser(userId);

				if (user != null) {
					return user;
				}
			}

			return PortalUtil.getUser(request);
		}
		catch (Exception exception) {
			return null;
		}
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

	private static final Log _log = LogFactoryUtil.getLog(
		ForcePasswordChangePostLoginAction.class);

	private volatile ForcePasswordChangeConfiguration _configuration =
		ForcePasswordChangeConfiguration.fromProperties(null);

	@org.osgi.service.component.annotations.Reference
	private UserLocalService _userLocalService;

}
