package vn.vec.custom.admin.networkpolicy.service;

import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import javax.servlet.http.HttpServletRequest;

import org.osgi.service.component.annotations.Component;

@Component(service = AdminNetworkPolicyPermission.class)
public class AdminNetworkPolicyPermission {

	public User getSignedInAdminUser(HttpServletRequest httpServletRequest) {
		User user = getSignedInUser(httpServletRequest);

		if ((user == null) || !isAdminUser(user)) {
			return null;
		}

		return user;
	}

	public User getSignedInUser(HttpServletRequest httpServletRequest) {
		long userId = getSignedInUserId(httpServletRequest);

		if (userId <= 0) {
			return null;
		}

		try {
			User user = UserLocalServiceUtil.fetchUser(userId);

			if ((user == null) || user.isGuestUser()) {
				return null;
			}

			return user;
		}
		catch (Exception exception) {
			return null;
		}
	}

	public long getSignedInUserId(HttpServletRequest httpServletRequest) {
		try {
			PermissionChecker permissionChecker =
				PermissionThreadLocal.getPermissionChecker();

			if (permissionChecker != null) {
				long userId = permissionChecker.getUserId();

				if (userId > 0) {
					return userId;
				}
			}

			if (httpServletRequest != null) {
				long requestUserId = PortalUtil.getUserId(httpServletRequest);

				if (requestUserId > 0) {
					return requestUserId;
				}

				User user = PortalUtil.getUser(httpServletRequest);

				if ((user != null) && !user.isGuestUser()) {
					return user.getUserId();
				}
			}

			String principalName = PrincipalThreadLocal.getName();

			if ((principalName != null) && !principalName.trim().isEmpty()) {
				return Long.parseLong(principalName.trim());
			}
		}
		catch (Exception exception) {
		}

		return 0;
	}

	public boolean isAdminUser(User user) {
		if (user == null) {
			return false;
		}

		PermissionChecker permissionChecker =
			PermissionThreadLocal.getPermissionChecker();

		if ((permissionChecker != null) && permissionChecker.isOmniadmin()) {
			return true;
		}

		if ("admin".equalsIgnoreCase(user.getScreenName())) {
			return true;
		}

		try {
			for (Role role : user.getRoles()) {
				if ("Administrator".equalsIgnoreCase(role.getName())) {
					return true;
				}
			}
		}
		catch (Exception exception) {
			return false;
		}

		return false;
	}

}
