package vn.vec.custom.admin.password.lifecycle;

import com.liferay.portal.kernel.events.ActionException;
import com.liferay.portal.kernel.events.LifecycleAction;
import com.liferay.portal.kernel.events.LifecycleEvent;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionCheckerFactoryUtil;
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
			User user = PortalUtil.getUser(request);

			if ((user == null) || user.isDefaultUser()) {
				return;
			}

			if (!configuration.isIncludeOmniAdmin() && _isOmniAdmin(user)) {
				return;
			}

			boolean expired = PasswordExpirationUtil.isPasswordExpired(user);

			HttpSession session = request.getSession(false);

			if (session == null) {
				return;
			}

			if (expired) {
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
						user.getCompanyId() +
						", reason=PASSWORD_EXPIRED_FORCE_CHANGE");
			}
			else {
				session.removeAttribute(SESSION_ATTR_FORCE_CHANGE);
			}
		}
		catch (Exception exception) {
			_log.error(
				"VEC Force Password Change: error in post-login hook",
				exception);
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

}
