package vn.vec.custom.admin.modulemanager.portlet;

import com.liferay.application.list.BasePanelApp;
import com.liferay.application.list.PanelApp;
import com.liferay.application.list.constants.PanelCategoryKeys;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Portlet;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.service.PortletLocalService;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.networkpolicy.service.AdminNetworkPolicyPermission;

@Component(
	immediate = true,
	property = {
		"panel.app.order:Integer=255",
		"panel.category.key=" + PanelCategoryKeys.CONTROL_PANEL_SECURITY
	},
	service = PanelApp.class
)
public class SystemModuleManagerPanelApp extends BasePanelApp {

	@Override
	public Portlet getPortlet() {
		return _portletLocalService.getPortletById(getPortletId());
	}

	@Override
	public String getPortletId() {
		return SystemModuleManagerPortletKeys.SYSTEM_MODULE_MANAGER;
	}

	@Override
	public boolean isShow(PermissionChecker permissionChecker, Group group)
		throws PortalException {

		if (permissionChecker == null) {
			return false;
		}

		if (permissionChecker.isOmniadmin()) {
			return true;
		}

		User user = UserLocalServiceUtil.fetchUser(permissionChecker.getUserId());

		return _permission.isAdminUser(user);
	}

	@Reference(unbind = "-")
	public void setPortletLocalService(
		PortletLocalService portletLocalService) {

		_portletLocalService = portletLocalService;

		super.setPortletLocalService(portletLocalService);
	}

	@Reference
	private AdminNetworkPolicyPermission _permission;

	private PortletLocalService _portletLocalService;

}
