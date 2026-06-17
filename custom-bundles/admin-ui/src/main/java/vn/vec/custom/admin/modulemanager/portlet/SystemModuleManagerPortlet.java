package vn.vec.custom.admin.modulemanager.portlet;

import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.AuthTokenUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.URLCodec;

import java.io.IOException;
import java.io.PrintWriter;

import javax.portlet.GenericPortlet;
import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import javax.servlet.http.HttpServletRequest;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.networkpolicy.service.AdminNetworkPolicyPermission;

@Component(
	property = {
		"com.liferay.portlet.control-panel-entry-category=security",
		"com.liferay.portlet.display-category=category.control_panel.security",
		"com.liferay.portlet.instanceable=false",
		"javax.portlet.display-name=System Module Manager",
		"javax.portlet.name=" +
			SystemModuleManagerPortletKeys.SYSTEM_MODULE_MANAGER,
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.security-role-ref=administrator"
	},
	service = Portlet.class
)
public class SystemModuleManagerPortlet extends GenericPortlet {

	@Override
	protected void doView(
			RenderRequest renderRequest, RenderResponse renderResponse)
		throws IOException, PortletException {

		renderResponse.setContentType("text/html;charset=UTF-8");

		PrintWriter writer = renderResponse.getWriter();
		HttpServletRequest httpServletRequest = PortalUtil.getHttpServletRequest(
			renderRequest);
		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			writer.write(
				"<div class=\"alert alert-danger\">Chỉ quản trị viên mới có " +
					"quyền quản lý module hệ thống.</div>");

			return;
		}

		String authToken = AuthTokenUtil.getToken(httpServletRequest);
		String targetSrc = "/web/guest/module-manager";

		writer.write(
			"<script>" +
			"window.location.replace('" + targetSrc + "?p_auth=" + URLCodec.encodeURL(authToken) + "');" +
			"</script>"
		);
	}

	@Reference
	private AdminNetworkPolicyPermission _permission;

}
