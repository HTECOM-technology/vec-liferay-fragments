package vn.vec.custom.admin.audit.wrapper;

import com.liferay.portal.kernel.model.PortalPreferences;
import com.liferay.portal.kernel.service.PortalPreferenceValueLocalService;
import com.liferay.portal.kernel.service.PortalPreferencesLocalServiceWrapper;
import com.liferay.portal.kernel.service.ServiceWrapper;
import com.liferay.portal.kernel.util.PortletKeys;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;

@Component(service = ServiceWrapper.class)
public class PortalPreferencesAuditServiceWrapper
	extends PortalPreferencesLocalServiceWrapper {

	@Override
	public PortalPreferences updatePreferences(
		long ownerId, int ownerType,
		com.liferay.portal.kernel.portlet.PortalPreferences portalPreferences) {

		String beforeData = _snapshot(ownerId, ownerType);
		String targetTitle = _targetTitle(ownerId, ownerType);
		String classPK = _classPK(ownerId, ownerType);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.SETTING,
			PortalPreferences.class.getName(), classPK, targetTitle, null,
			beforeData, null);

		try {
			PortalPreferences updatedPortalPreferences = super.updatePreferences(
				ownerId, ownerType, portalPreferences);

			_auditLogService.completeSuccess(
				auditLogId, classPK, targetTitle, null, beforeData,
				_snapshot(updatedPortalPreferences, ownerId, ownerType));

			return updatedPortalPreferences;
		}
		catch (RuntimeException runtimeException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, targetTitle, null, runtimeException);

			throw runtimeException;
		}
	}

	@Override
	public PortalPreferences updatePreferences(
		long ownerId, int ownerType, String xml) {

		String beforeData = _snapshot(ownerId, ownerType);
		String targetTitle = _targetTitle(ownerId, ownerType);
		String classPK = _classPK(ownerId, ownerType);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.SETTING,
			PortalPreferences.class.getName(), classPK, targetTitle, null,
			beforeData, null);

		try {
			PortalPreferences updatedPortalPreferences = super.updatePreferences(
				ownerId, ownerType, xml);

			_auditLogService.completeSuccess(
				auditLogId, classPK, targetTitle, null, beforeData,
				_snapshot(updatedPortalPreferences, ownerId, ownerType));

			return updatedPortalPreferences;
		}
		catch (RuntimeException runtimeException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, targetTitle, null, runtimeException);

			throw runtimeException;
		}
	}

	private String _classPK(long ownerId, int ownerType) {
		return ownerType + ":" + ownerId;
	}

	private boolean _isSignedIn(int ownerType) {
		return ownerType == PortletKeys.PREFS_OWNER_TYPE_USER;
	}

	private String _snapshot(long ownerId, int ownerType) {
		PortalPreferences portalPreferences = super.fetchPortalPreferences(
			ownerId, ownerType);

		return _snapshot(portalPreferences, ownerId, ownerType);
	}

	private String _snapshot(
		PortalPreferences portalPreferences, long ownerId, int ownerType) {

		if (portalPreferences == null) {
			return null;
		}

		return _auditSnapshotService.snapshotPortalPreferences(
			ownerId, ownerType,
			_portalPreferenceValueLocalService.getPortalPreferences(
				portalPreferences, _isSignedIn(ownerType)));
	}

	private String _targetTitle(long ownerId, int ownerType) {
		return "Portal Preferences [" + ownerType + ":" + ownerId + "]";
	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

	@Reference
	private PortalPreferenceValueLocalService _portalPreferenceValueLocalService;

}
