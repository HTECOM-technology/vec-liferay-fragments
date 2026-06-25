package vn.vec.custom.admin.password.portlet.action;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCRenderCommand;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;

import java.util.Map;

import javax.portlet.PortletException;
import javax.portlet.PortletSession;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;

import vn.vec.custom.admin.password.configuration.ForcePasswordChangeConfiguration;

/**
 * Seeds the forgot-password portlet session from request parameters so the
 * native form can pre-fill the login value after our custom redirects.
 */
@Component(
	configurationPid = "vn.vec.custom.admin.password.filter.ForcePasswordChangeFilter",
	property = {
		"javax.portlet.name=com_liferay_login_web_portlet_LoginPortlet",
		"mvc.command.name=/login/forgot_password",
		"service.ranking:Integer=1000"
	},
	service = MVCRenderCommand.class
)
public class ForcePasswordChangeForgotPasswordMVCRenderCommand
	implements MVCRenderCommand {

	@Activate
	@Modified
	protected void activate(Map<String, Object> properties) {
		_configuration =
			ForcePasswordChangeConfiguration.fromProperties(properties);
	}

	@Override
	public String render(
			RenderRequest renderRequest, RenderResponse renderResponse)
		throws PortletException {

		ForcePasswordChangeConfiguration configuration = _configuration;

		if ((configuration == null) || !configuration.isEnabled()) {
			return "/forgot_password.jsp";
		}

		String login = ParamUtil.getString(renderRequest, "login");

		if (Validator.isNull(login)) {
			login = ParamUtil.getString(renderRequest, "screenName");
		}

		if (Validator.isNotNull(login)) {
			PortletSession portletSession = renderRequest.getPortletSession();

			portletSession.setAttribute(
				WebKeys.FORGOT_PASSWORD_REMINDER_USER_EMAIL_ADDRESS, login);
			portletSession.removeAttribute(
				WebKeys.FORGOT_PASSWORD_REMINDER_USER);
			portletSession.removeAttribute(
				WebKeys.FORGOT_PASSWORD_REMINDER_ATTEMPTS);

			_log.info(
				"VEC Force Password Change prepared forgot-password form: " +
					"login=" + login);
		}

		return "/forgot_password.jsp";
	}

	private static final Log _log = LogFactoryUtil.getLog(
		ForcePasswordChangeForgotPasswordMVCRenderCommand.class);

	private volatile ForcePasswordChangeConfiguration _configuration =
		ForcePasswordChangeConfiguration.fromProperties(null);

}
