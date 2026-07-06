package vn.vec.custom.admin.webcontent.advancedsearch;

import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.GroupLocalServiceUtil;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.service.permission.GroupPermissionUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.osgi.service.component.annotations.Component;

@Component(service = WebContentAdvancedSearchPermission.class)
public class WebContentAdvancedSearchPermission {

	public AccessContext getAccessContext(
			HttpServletRequest httpServletRequest, long requestedGroupId)
		throws Exception {

		PermissionChecker permissionChecker =
			PermissionThreadLocal.getPermissionChecker();
		User user = getSignedInUser(httpServletRequest);

		if ((user == null) || (permissionChecker == null)) {
			throw new SecurityException("Vui lòng đăng nhập để truy cập màn hình này.");
		}

		if (_isAdminUser(user, permissionChecker)) {
			return new AccessContext(user, permissionChecker, true, null);
		}

		Set<Long> allowedGroupIds = new LinkedHashSet<>();

		if (requestedGroupId > 0) {
			if (_canManageGroup(permissionChecker, requestedGroupId)) {
				allowedGroupIds.add(requestedGroupId);
			}
		}
		else {
			List<Group> groups = GroupLocalServiceUtil.getUserSitesGroups(
				user.getUserId(), true);

			for (Group group : groups) {
				if ((group != null) && _canManageGroup(
						permissionChecker, group.getGroupId())) {

					allowedGroupIds.add(group.getGroupId());
				}
			}
		}

		if (allowedGroupIds.isEmpty()) {
			throw new SecurityException(
				"Bạn không có quyền quản trị Web Content/Site phù hợp để dùng màn hình này.");
		}

		return new AccessContext(
			user, permissionChecker, false, new ArrayList<>(allowedGroupIds));
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
				long permissionCheckerUserId = permissionChecker.getUserId();

				if (permissionCheckerUserId > 0) {
					return permissionCheckerUserId;
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

				String remoteUser = httpServletRequest.getRemoteUser();

				if ((remoteUser != null) && !remoteUser.trim().isEmpty()) {
					return Long.parseLong(remoteUser.trim());
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

	private boolean _canManageGroup(
		PermissionChecker permissionChecker, long groupId) {

		try {
			return GroupPermissionUtil.contains(
				permissionChecker, groupId, ActionKeys.MANAGE_LAYOUTS) ||
				GroupPermissionUtil.contains(
					permissionChecker, groupId, ActionKeys.UPDATE);
		}
		catch (Exception exception) {
			return false;
		}
	}

	private boolean _isAdminUser(
		User user, PermissionChecker permissionChecker) {

		try {
			if ((permissionChecker != null) && permissionChecker.isOmniadmin()) {
				return true;
			}

			if ("admin".equalsIgnoreCase(user.getScreenName())) {
				return true;
			}

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

	public static class AccessContext {

		public AccessContext(
			User user, PermissionChecker permissionChecker,
			boolean unrestrictedGroupScope, List<Long> allowedGroupIds) {

			_allowedGroupIds = allowedGroupIds;
			_permissionChecker = permissionChecker;
			_unrestrictedGroupScope = unrestrictedGroupScope;
			_user = user;
		}

		public List<Long> getAllowedGroupIds() {
			return _allowedGroupIds;
		}

		public PermissionChecker getPermissionChecker() {
			return _permissionChecker;
		}

		public User getUser() {
			return _user;
		}

		public boolean isUnrestrictedGroupScope() {
			return _unrestrictedGroupScope;
		}

		private final List<Long> _allowedGroupIds;
		private final PermissionChecker _permissionChecker;
		private final boolean _unrestrictedGroupScope;
		private final User _user;

	}

}
