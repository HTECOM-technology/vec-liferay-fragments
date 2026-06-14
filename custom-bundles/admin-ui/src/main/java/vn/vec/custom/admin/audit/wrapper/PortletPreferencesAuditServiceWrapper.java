package vn.vec.custom.admin.audit.wrapper;

import com.liferay.portal.kernel.model.PortletPreferences;
import com.liferay.portal.kernel.service.PortletPreferencesLocalServiceWrapper;
import com.liferay.portal.kernel.service.ServiceWrapper;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;

@Component(service = ServiceWrapper.class)
public class PortletPreferencesAuditServiceWrapper
	extends PortletPreferencesLocalServiceWrapper {

	@Override
	public PortletPreferences updatePreferences(
		long ownerId, int ownerType, long plid, String portletId,
		javax.portlet.PortletPreferences portletPreferences) {

		return _updatePortletPreferences(ownerId, ownerType, plid, portletId,
			new _UnsafePortletPreferencesSupplier() {

				@Override
				public PortletPreferences get() {
					return PortletPreferencesAuditServiceWrapper.super.
						updatePreferences(
							ownerId, ownerType, plid, portletId,
							portletPreferences);
				}

			});
	}

	@Override
	public PortletPreferences updatePreferences(
		long ownerId, int ownerType, long plid, String portletId, String xml) {

		return _updatePortletPreferences(ownerId, ownerType, plid, portletId,
			new _UnsafePortletPreferencesSupplier() {

				@Override
				public PortletPreferences get() {
					return PortletPreferencesAuditServiceWrapper.super.
						updatePreferences(ownerId, ownerType, plid, portletId, xml);
				}

			});
	}

	private String _classPK(
		long ownerId, int ownerType, long plid, String portletId) {

		return ownerType + ":" + ownerId + ":" + plid + ":" + portletId;
	}

	private String _snapshot(
		PortletPreferences portletPreferences, long ownerId, int ownerType,
		long plid, String portletId) {

		if (portletPreferences == null) {
			return null;
		}

		return _auditSnapshotService.snapshotPortletPreferences(
			ownerId, ownerType, plid, portletId,
			super.fetchPreferences(
				portletPreferences.getCompanyId(), ownerId, ownerType, plid,
				portletId));
	}

	private String _targetTitle(String portletId) {
		return "Portlet Preferences [" + portletId + "]";
	}

	private PortletPreferences _updatePortletPreferences(
		long ownerId, int ownerType, long plid, String portletId,
		_UnsafePortletPreferencesSupplier unsafePortletPreferencesSupplier) {

		PortletPreferences beforePortletPreferences = super.fetchPortletPreferences(
			ownerId, ownerType, plid, portletId);
		String beforeData = _snapshot(
			beforePortletPreferences, ownerId, ownerType, plid, portletId);
		String targetTitle = _targetTitle(portletId);
		String classPK = _classPK(ownerId, ownerType, plid, portletId);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.SETTING,
			PortletPreferences.class.getName(), classPK, targetTitle, null,
			beforeData, null);

		try {
			PortletPreferences updatedPortletPreferences =
				unsafePortletPreferencesSupplier.get();

			_auditLogService.completeSuccess(
				auditLogId, classPK, targetTitle, null, beforeData,
				_snapshot(
					updatedPortletPreferences, ownerId, ownerType, plid,
					portletId));

			return updatedPortletPreferences;
		}
		catch (RuntimeException runtimeException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, targetTitle, null, runtimeException);

			throw runtimeException;
		}
	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

	private interface _UnsafePortletPreferencesSupplier {

		public PortletPreferences get();

	}

}
