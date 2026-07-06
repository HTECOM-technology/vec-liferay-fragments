package vn.vec.custom.admin.networkpolicy.portlet;

import com.liferay.application.list.BasePanelApp;
import com.liferay.application.list.PanelApp;
import com.liferay.application.list.constants.PanelCategoryKeys;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Portlet;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.service.PortletLocalService;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(
	immediate = true,
	property = {
		"panel.app.order:Integer=260",
		"panel.category.key=" + PanelCategoryKeys.CONTROL_PANEL_SECURITY
	},
	service = PanelApp.class
)
public class AdminNetworkPolicyPanelApp extends BasePanelApp {

	@Override
	public Portlet getPortlet() {
		return _portletLocalService.getPortletById(getPortletId());
	}

	@Override
	public String getPortletId() {
		return AdminNetworkPolicyPortletKeys.ADMIN_NETWORK_POLICY;
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

		if (user == null) {
			return false;
		}

		if ("admin".equalsIgnoreCase(user.getScreenName())) {
			return true;
		}

		for (Role role : user.getRoles()) {
			if ("Administrator".equalsIgnoreCase(role.getName())) {
				return true;
			}
		}

		return false;
	}

	@Reference(unbind = "-")
	public void setPortletLocalService(
		PortletLocalService portletLocalService) {

		_portletLocalService = portletLocalService;

		super.setPortletLocalService(portletLocalService);
	}

	private PortletLocalService _portletLocalService;

}
