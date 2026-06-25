package vn.vec.custom.admin.password.portlet.action;

import com.liferay.portal.kernel.exception.CompanyMaxUsersException;
import com.liferay.portal.kernel.exception.CookieNotSupportedException;
import com.liferay.portal.kernel.exception.NoSuchUserException;
import com.liferay.portal.kernel.exception.PasswordExpiredException;
import com.liferay.portal.kernel.exception.UserActiveException;
import com.liferay.portal.kernel.exception.UserEmailAddressException;
import com.liferay.portal.kernel.exception.UserIdException;
import com.liferay.portal.kernel.exception.UserLockoutException;
import com.liferay.portal.kernel.exception.UserPasswordException;
import com.liferay.portal.kernel.exception.UserScreenNameException;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.CompanyConstants;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.PortletPreferencesFactoryUtil;
import com.liferay.portal.kernel.portlet.PortletURLFactoryUtil;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCActionCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCActionCommand;
import com.liferay.portal.kernel.portlet.url.builder.PortletURLBuilder;
import com.liferay.portal.kernel.security.auth.AuthException;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionCheckerFactoryUtil;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextFactory;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.servlet.SessionErrors;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.Http;
import com.liferay.portal.kernel.util.HttpComponentsUtil;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.security.auth.session.AuthenticatedSessionManagerUtil;

import java.util.Map;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletPreferences;
import javax.portlet.PortletRequest;
import javax.portlet.PortletSession;
import javax.portlet.PortletURL;
import javax.portlet.WindowState;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.password.configuration.ForcePasswordChangeConfiguration;
import vn.vec.custom.admin.password.util.PasswordExpirationUtil;

/**
 * Intercepts the native LoginPortlet submit so password-expired users can be
 * redirected before Liferay falls back to the default login error page.
 *
 * This is the only reliable hook for GraceLimit = 0 because login.events.post
 * never runs in that scenario.
 */
@Component(
	configurationPid = "vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter",
	property = {
		"javax.portlet.name=com_liferay_login_web_portlet_LoginPortlet",
		"mvc.command.name=/login/login",
		"service.ranking:Integer=1000"
	},
	service = MVCActionCommand.class
)
public class ForcePasswordChangeLoginMVCActionCommand
	extends BaseMVCActionCommand {

	@Activate
	@Modified
	protected void activate(Map<String, Object> properties) {
		_configuration =
			ForcePasswordChangeConfiguration.fromProperties(properties);
	}

	@Override
	protected void doProcessAction(
			ActionRequest actionRequest, ActionResponse actionResponse)
		throws Exception {

		ThemeDisplay themeDisplay = (ThemeDisplay)actionRequest.getAttribute(
			WebKeys.THEME_DISPLAY);

		try {
			_login(themeDisplay, actionRequest, actionResponse);

			boolean doActionAfterLogin = ParamUtil.getBoolean(
				actionRequest, "doActionAfterLogin");

			if (doActionAfterLogin) {
				actionRequest.setAttribute(
					WebKeys.REDIRECT,
					PortletURLBuilder.createRenderURL(
						_portal.getLiferayPortletResponse(actionResponse)
					).setMVCRenderCommandName(
						"/login/login_redirect"
					).buildString());
			}
		}
		catch (Exception exception) {
			User resolvedUser = _fetchRequestedUser(actionRequest, themeDisplay);
			Throwable passwordExpiredThrowable =
				_getPasswordExpiredThrowable(exception);

			if ((passwordExpiredThrowable != null) &&
				_handlePasswordExpiredRedirect(
					actionRequest, actionResponse, resolvedUser)) {

				return;
			}

			_handleDefaultFailure(
				exception, actionRequest, actionResponse, themeDisplay,
				resolvedUser);
		}
	}

	private User _fetchRequestedUser(
		ActionRequest actionRequest, ThemeDisplay themeDisplay) {

		try {
			String login = ParamUtil.getString(actionRequest, "login");

			if (Validator.isNull(login)) {
				return null;
			}

			String authType = _getAuthType(actionRequest, themeDisplay);

			if (CompanyConstants.AUTH_TYPE_EA.equals(authType)) {
				return _userLocalService.getUserByEmailAddress(
					themeDisplay.getCompanyId(), login);
			}

			if (CompanyConstants.AUTH_TYPE_SN.equals(authType)) {
				return _userLocalService.getUserByScreenName(
					themeDisplay.getCompanyId(), login);
			}

			if (CompanyConstants.AUTH_TYPE_ID.equals(authType)) {
				return _userLocalService.getUserById(GetterUtil.getLong(login));
			}
		}
		catch (Exception exception) {
			if (_log.isDebugEnabled()) {
				_log.debug(
					"Unable to resolve requested login user: " +
						exception.getMessage(),
					exception);
			}
		}

		return null;
	}

	private String _getAuthType(
		ActionRequest actionRequest, ThemeDisplay themeDisplay) {

		PortletPreferences portletPreferences = actionRequest.getPreferences();

		if (portletPreferences != null) {
			String authType = portletPreferences.getValue("authType", null);

			if (Validator.isNotNull(authType)) {
				return authType;
			}
		}

		Company company = themeDisplay.getCompany();

		return company.getAuthType();
	}

	private Throwable _getPasswordExpiredThrowable(Throwable throwable) {
		Throwable current = throwable;

		while (current != null) {
			if (current instanceof PasswordExpiredException) {
				return current;
			}

			current = current.getCause();
		}

		return null;
	}

	private boolean _handlePasswordExpiredRedirect(
			ActionRequest actionRequest, ActionResponse actionResponse,
			User resolvedUser)
		throws Exception {

		ForcePasswordChangeConfiguration configuration = _configuration;

		if ((configuration == null) || !configuration.isEnabled()) {
			return false;
		}

		if ((resolvedUser != null) && !configuration.isIncludeOmniAdmin() &&
			_isOmniAdmin(resolvedUser)) {

			return false;
		}

		String redirectLogin = ParamUtil.getString(actionRequest, "login");

		if (Validator.isNull(redirectLogin) && (resolvedUser != null)) {
			redirectLogin = resolvedUser.getScreenName();
		}

		PortletSession portletSession = actionRequest.getPortletSession();

		if (Validator.isNotNull(redirectLogin)) {
			portletSession.setAttribute(
				WebKeys.FORGOT_PASSWORD_REMINDER_USER_EMAIL_ADDRESS,
				redirectLogin);
		}

		portletSession.removeAttribute(WebKeys.FORGOT_PASSWORD_REMINDER_USER);
		portletSession.removeAttribute(
			WebKeys.FORGOT_PASSWORD_REMINDER_ATTEMPTS);

		String targetURL = _getRedirectURL(configuration, redirectLogin);

		_log.info(
			_buildExpiredRedirectLog(
				actionRequest, resolvedUser, redirectLogin, targetURL));

		actionResponse.sendRedirect(targetURL);

		return true;
	}

	private String _buildExpiredRedirectLog(
		ActionRequest actionRequest, User resolvedUser, String redirectLogin,
		String targetURL) {

		HttpServletRequest httpServletRequest =
			_portal.getHttpServletRequest(actionRequest);

		StringBuilder sb = new StringBuilder();

		sb.append(
			"VEC Force Password Change intercepted PasswordExpiredException");
		sb.append(": login=");
		sb.append(redirectLogin);
		sb.append(", targetURL=");
		sb.append(targetURL);
		sb.append(", remoteAddr=");
		sb.append(httpServletRequest.getRemoteAddr());

		if (resolvedUser != null) {
			sb.append(", userId=");
			sb.append(resolvedUser.getUserId());
			sb.append(", screenName=");
			sb.append(resolvedUser.getScreenName());
			sb.append(", companyId=");
			sb.append(resolvedUser.getCompanyId());
			sb.append(", graceLoginCount=");
			sb.append(PasswordExpirationUtil.getGraceLoginCount(resolvedUser));
		}

		return sb.toString();
	}

	private String _getRedirectURL(
		ForcePasswordChangeConfiguration configuration, String redirectLogin) {

		String redirectURL = configuration.getChangePasswordURL();

		if (Validator.isNull(redirectLogin) ||
			Validator.isNull(redirectURL) || redirectURL.contains("login=")) {

			return redirectURL;
		}

		return HttpComponentsUtil.addParameter(
			redirectURL, "login", redirectLogin);
	}

	private void _handleDefaultFailure(
			Exception exception, ActionRequest actionRequest,
			ActionResponse actionResponse, ThemeDisplay themeDisplay,
			User resolvedUser)
		throws Exception {

		if (exception instanceof AuthException) {
			Throwable throwable = exception.getCause();

			if ((throwable instanceof PasswordExpiredException) ||
				(throwable instanceof UserLockoutException)) {

				SessionErrors.add(
					actionRequest, throwable.getClass(), throwable);
			}
			else {
				if (_log.isInfoEnabled()) {
					_log.info("Authentication failed");
				}

				SessionErrors.add(actionRequest, exception.getClass());
			}

			_redirectBackToLogin(actionRequest, actionResponse);
			hideDefaultErrorMessage(actionRequest);

			return;
		}
		else if (exception instanceof
					UserLockoutException.PasswordPolicyLockout) {

			Company company = themeDisplay.getCompany();

			if (!company.isSendPasswordResetLink() && (resolvedUser != null)) {
				_sendPasswordLockout(actionRequest, resolvedUser);
			}

			SessionErrors.add(actionRequest, exception.getClass(), exception);
			_redirectBackToLogin(actionRequest, actionResponse);
			hideDefaultErrorMessage(actionRequest);

			return;
		}

		if ((exception instanceof CompanyMaxUsersException) ||
			(exception instanceof CookieNotSupportedException) ||
			(exception instanceof NoSuchUserException) ||
			(exception instanceof PasswordExpiredException) ||
			(exception instanceof UserEmailAddressException) ||
			(exception instanceof UserIdException) ||
			(exception instanceof UserLockoutException) ||
			(exception instanceof UserPasswordException) ||
			(exception instanceof UserScreenNameException)) {

			SessionErrors.add(actionRequest, exception.getClass(), exception);
			_redirectBackToLogin(actionRequest, actionResponse);
			hideDefaultErrorMessage(actionRequest);

			return;
		}

		_log.error(exception);
		_portal.sendError(exception, actionRequest, actionResponse);
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
					user.getUserId() + "; treating as omniadmin for safety");

			return true;
		}
	}

	private void _login(
			ThemeDisplay themeDisplay, ActionRequest actionRequest,
			ActionResponse actionResponse)
		throws Exception {

		HttpServletRequest httpServletRequest =
			_portal.getOriginalServletRequest(
				_portal.getHttpServletRequest(actionRequest));

		if (!themeDisplay.isSignedIn()) {
			HttpServletResponse httpServletResponse =
				_portal.getHttpServletResponse(actionResponse);

			String login = ParamUtil.getString(actionRequest, "login");
			String password = actionRequest.getParameter("password");
			boolean rememberMe = ParamUtil.getBoolean(
				actionRequest, "rememberMe");

			PortletPreferences portletPreferences =
				PortletPreferencesFactoryUtil.getStrictPortletSetup(
					themeDisplay.getLayout(),
					_portal.getPortletId(actionRequest));

			String authType = portletPreferences.getValue("authType", null);

			AuthenticatedSessionManagerUtil.login(
				httpServletRequest, httpServletResponse, login, password,
				rememberMe, authType);
		}

		String redirect = ParamUtil.getString(actionRequest, "redirect");
		String mainPath = themeDisplay.getPathMain();

		if (Validator.isNotNull(redirect)) {
			if (!themeDisplay.isSignedIn()) {
				actionRequest.setAttribute(
					WebKeys.REDIRECT,
					HttpComponentsUtil.addParameter(
						_portal.getPathMain() + "/portal/login", "redirect",
						redirect));

				return;
			}

			redirect = _portal.escapeRedirect(redirect);

			if (Validator.isNotNull(redirect) &&
				!redirect.startsWith(Http.HTTP)) {

				redirect = _portal.getPortalURL(
					httpServletRequest
				).concat(
					redirect
				);
			}
		}

		if (Validator.isNotNull(redirect)) {
			actionResponse.sendRedirect(redirect);
		}
		else {
			boolean doActionAfterLogin = ParamUtil.getBoolean(
				actionRequest, "doActionAfterLogin");

			if (doActionAfterLogin) {
				return;
			}

			actionResponse.sendRedirect(mainPath);
		}
	}

	private void _redirectBackToLogin(
			ActionRequest actionRequest, ActionResponse actionResponse)
		throws Exception {

		ThemeDisplay themeDisplay = (ThemeDisplay)actionRequest.getAttribute(
			WebKeys.THEME_DISPLAY);

		String login = ParamUtil.getString(actionRequest, "login");

		if (Validator.isNotNull(login)) {
			SessionErrors.add(actionRequest, "login", login);
		}

		PortletURL portletURL = PortletURLBuilder.create(
			PortletURLFactoryUtil.create(
				actionRequest, _portal.getPortletId(actionRequest),
				themeDisplay.getLayout(), PortletRequest.RENDER_PHASE)
		).setMVCRenderCommandName(
			"/login/login"
		).setRedirect(
			() -> {
				String redirect = ParamUtil.getString(
					actionRequest, "redirect");

				if (Validator.isNotNull(redirect)) {
					return redirect;
				}

				return null;
			}
		).setParameter(
			"saveLastPath", false
		).buildPortletURL();

		portletURL.setWindowState(actionRequest.getWindowState());

		actionResponse.sendRedirect(portletURL.toString());
	}

	private void _sendPasswordLockout(
			ActionRequest actionRequest, User user)
		throws Exception {

		ServiceContext serviceContext = ServiceContextFactory.getInstance(
			User.class.getName(), actionRequest);

		UserLocalServiceUtil.sendPasswordLockout(
			user.getCompanyId(), user.getEmailAddress(), null, null, null, null,
			serviceContext);
	}

	private static final Log _log = LogFactoryUtil.getLog(
		ForcePasswordChangeLoginMVCActionCommand.class);

	private volatile ForcePasswordChangeConfiguration _configuration =
		ForcePasswordChangeConfiguration.fromProperties(null);

	@Reference
	private Portal _portal;

	@Reference
	private UserLocalService _userLocalService;

}
