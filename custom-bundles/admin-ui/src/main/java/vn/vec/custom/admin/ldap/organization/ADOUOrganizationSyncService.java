package vn.vec.custom.admin.ldap.organization;

import com.liferay.portal.kernel.dao.orm.QueryUtil;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.ListTypeConstants;
import com.liferay.portal.kernel.model.Organization;
import com.liferay.portal.kernel.model.OrganizationConstants;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.CompanyLocalService;
import com.liferay.portal.kernel.service.ListTypeLocalService;
import com.liferay.portal.kernel.service.OrganizationLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.UserLocalService;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.naming.InvalidNameException;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = ADOUOrganizationSyncService.class)
public class ADOUOrganizationSyncService {

	public SyncResult sync(int batchSize, boolean dryRun) {
		SyncResult result = new SyncResult();
		int normalizedBatchSize = Math.max(batchSize, 1);

		try {
			List<Company> companies = _companyLocalService.getCompanies();

			for (Company company : companies) {
				_syncCompany(
					company.getCompanyId(), normalizedBatchSize, dryRun, result);
			}
		}
		catch (Exception exception) {
			result.errors++;

			_log.error("Unable to list companies for AD OU organization sync", exception);
		}

		_log.info(
			"AD OU organization sync finished: scanned=" + result.scanned +
				", synced=" + result.synced + ", skipped=" + result.skipped +
				", dryRunActions=" + result.dryRunActions + ", errors=" +
					result.errors + ", dryRun=" + dryRun);

		return result;
	}

	private void _addUserToLeafOrganization(User user, Organization leafOrganization)
		throws PortalException {

		if (_organizationLocalService.hasUserOrganization(
				user.getUserId(), leafOrganization.getOrganizationId())) {

			return;
		}

		_organizationLocalService.addUserOrganization(
			user.getUserId(), leafOrganization.getOrganizationId());
	}

	private Organization _ensureOrganizationPath(
			long companyId, List<String> organizationNames)
		throws PortalException {

		long parentOrganizationId =
			OrganizationConstants.DEFAULT_PARENT_ORGANIZATION_ID;
		Organization organization = null;
		long statusListTypeId = _listTypeLocalService.getListTypeId(
			companyId, ListTypeConstants.ORGANIZATION_STATUS_DEFAULT,
			ListTypeConstants.ORGANIZATION_STATUS);
		long userId = _userLocalService.getDefaultUserId(companyId);

		for (String organizationName : organizationNames) {
			organization = _findChildOrganization(
				companyId, parentOrganizationId, organizationName);

			if (organization == null) {
				ServiceContext serviceContext = new ServiceContext();

				serviceContext.setCompanyId(companyId);
				serviceContext.setUserId(userId);

				organization = _organizationLocalService.addOrganization(
					null, userId, parentOrganizationId, organizationName,
					OrganizationConstants.TYPE_ORGANIZATION, 0, 0,
					statusListTypeId, "", false, serviceContext);

				_log.info(
					"Created organization " + organizationName +
						" under parentOrganizationId=" + parentOrganizationId +
							", companyId=" + companyId);
			}

			parentOrganizationId = organization.getOrganizationId();
		}

		return organization;
	}

	private Organization _findChildOrganization(
			long companyId, long parentOrganizationId, String organizationName)
		throws PortalException {

		List<Organization> organizations =
			_organizationLocalService.getOrganizations(
				companyId, parentOrganizationId, QueryUtil.ALL_POS,
				QueryUtil.ALL_POS);

		for (Organization organization : organizations) {
			if (organizationName.equals(organization.getName())) {
				return organization;
			}
		}

		return null;
	}

	private Organization _findOrganizationPath(
			long companyId, List<String> organizationNames)
		throws PortalException {

		long parentOrganizationId =
			OrganizationConstants.DEFAULT_PARENT_ORGANIZATION_ID;
		Organization organization = null;

		for (String organizationName : organizationNames) {
			organization = _findChildOrganization(
				companyId, parentOrganizationId, organizationName);

			if (organization == null) {
				return null;
			}

			parentOrganizationId = organization.getOrganizationId();
		}

		return organization;
	}

	private String _getCustomField(User user, String fieldName) {
		Object value = user.getExpandoBridge().getAttribute(fieldName);

		if (value == null) {
			return "";
		}

		return String.valueOf(value).trim();
	}

	private List<String> _parseSyncedPath(String syncedOrganizationPath) {
		if ((syncedOrganizationPath == null) ||
			syncedOrganizationPath.trim().isEmpty()) {

			return Collections.emptyList();
		}

		return Arrays.asList(syncedOrganizationPath.split("/"));
	}

	private void _removeUserFromOldLeafOrganization(
			User user, long companyId, String oldOrganizationPath,
			Organization newLeafOrganization)
		throws PortalException {

		List<String> oldOrganizationNames = _parseSyncedPath(oldOrganizationPath);

		if (oldOrganizationNames.isEmpty()) {
			return;
		}

		Organization oldLeafOrganization = _findOrganizationPath(
			companyId, oldOrganizationNames);

		if (oldLeafOrganization == null) {
			_log.warn(
				"Old synced organization path not found for userId=" +
					user.getUserId() + ", screenName=" + user.getScreenName() +
						", oldPath=" + oldOrganizationPath);

			return;
		}

		if (oldLeafOrganization.getOrganizationId() ==
				newLeafOrganization.getOrganizationId()) {

			return;
		}

		if (!_organizationLocalService.hasUserOrganization(
				user.getUserId(), oldLeafOrganization.getOrganizationId())) {

			return;
		}

		_organizationLocalService.deleteUserOrganization(
			user.getUserId(), oldLeafOrganization.getOrganizationId());
	}

	private void _syncCompany(
		long companyId, int batchSize, boolean dryRun, SyncResult result) {

		PermissionChecker originalPermissionChecker =
			PermissionThreadLocal.getPermissionChecker();
		String originalPrincipalName = PrincipalThreadLocal.getName();

		try {
			User defaultUser = _userLocalService.getDefaultUser(companyId);

			PrincipalThreadLocal.setName(defaultUser.getUserId());
			PermissionThreadLocal.getPermissionChecker(defaultUser, true);

			int start = 0;

			while (true) {
				List<User> users = _userLocalService.getCompanyUsers(
					companyId, start, start + batchSize);

				if (users.isEmpty()) {
					break;
				}

				for (User user : users) {
					_syncUser(companyId, user, dryRun, result);
				}

				if (users.size() < batchSize) {
					break;
				}

				start += batchSize;
			}
		}
		catch (Exception exception) {
			result.errors++;

			_log.error(
				"Unable to sync AD OU organizations for companyId=" + companyId,
				exception);
		}
		finally {
			PrincipalThreadLocal.setName(originalPrincipalName);
			PermissionThreadLocal.setPermissionChecker(originalPermissionChecker);
		}
	}

	private void _syncUser(
		long companyId, User user, boolean dryRun, SyncResult result) {

		result.scanned++;

		String distinguishedName = "";

		try {
			distinguishedName = _getCustomField(
				user, _AD_DISTINGUISHED_NAME_FIELD);

			if (distinguishedName.isEmpty()) {
				result.skipped++;

				return;
			}

			List<String> organizationNames =
				ADDistinguishedNameUtil.toOrganizationNames(distinguishedName);

			if (organizationNames.isEmpty()) {
				result.skipped++;

				return;
			}

			String organizationPath = String.join("/", organizationNames);
			String syncedOrganizationPath = _getCustomField(
				user, _AD_SYNCED_ORGANIZATION_PATH_FIELD);

			if (organizationPath.equals(syncedOrganizationPath)) {
				result.skipped++;

				return;
			}

			if (dryRun) {
				result.dryRunActions++;

				_log.info(
					"[DRY RUN] Would sync userId=" + user.getUserId() +
						", screenName=" + user.getScreenName() + ", DN=" +
							distinguishedName + ", oldPath=" +
								syncedOrganizationPath + ", newPath=" +
									organizationPath);

				return;
			}

			Organization leafOrganization = _ensureOrganizationPath(
				companyId, organizationNames);

			_addUserToLeafOrganization(user, leafOrganization);

			if (!syncedOrganizationPath.isEmpty()) {
				_removeUserFromOldLeafOrganization(
					user, companyId, syncedOrganizationPath, leafOrganization);
			}

			user.getExpandoBridge().setAttribute(
				_AD_SYNCED_ORGANIZATION_PATH_FIELD, organizationPath);

			result.synced++;
		}
		catch (InvalidNameException invalidNameException) {
			result.errors++;

			_log.warn(
				"Invalid AD distinguished name for userId=" + user.getUserId() +
					", screenName=" + user.getScreenName() + ", DN=" +
						distinguishedName,
				invalidNameException);
		}
		catch (Exception exception) {
			result.errors++;

			_log.error(
				"Unable to sync AD OU organization for userId=" + user.getUserId() +
					", screenName=" + user.getScreenName() + ", DN=" +
						distinguishedName,
				exception);
		}
	}

	private static final String _AD_DISTINGUISHED_NAME_FIELD =
		"adDistinguishedName";

	private static final String _AD_SYNCED_ORGANIZATION_PATH_FIELD =
		"adSyncedOrganizationPath";

	private static final Log _log = LogFactoryUtil.getLog(
		ADOUOrganizationSyncService.class);

	@Reference
	private CompanyLocalService _companyLocalService;

	@Reference
	private ListTypeLocalService _listTypeLocalService;

	@Reference
	private OrganizationLocalService _organizationLocalService;

	@Reference
	private UserLocalService _userLocalService;

	public static class SyncResult {

		public long dryRunActions;
		public long errors;
		public long scanned;
		public long skipped;
		public long synced;

	}

}
