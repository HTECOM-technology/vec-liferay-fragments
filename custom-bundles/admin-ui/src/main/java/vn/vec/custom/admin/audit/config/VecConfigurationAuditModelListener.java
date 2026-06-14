package vn.vec.custom.admin.audit.config;

import com.liferay.portal.configuration.persistence.listener.ConfigurationModelListener;
import com.liferay.portal.configuration.persistence.listener.ConfigurationModelListenerException;

import java.util.Dictionary;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;

/**
 * Generic configuration auditing is intentionally scaffolded only.
 *
 * <p>
 * CE GA132 exposes the listener API, but global catch-all registration is not
 * enabled here because configuration listener binding is typically declared per
 * PID/model class. This class is kept compile-safe for future targeted PIDs.
 * </p>
 */
public class VecConfigurationAuditModelListener
	implements ConfigurationModelListener {

	public VecConfigurationAuditModelListener(
		AuditLogService auditLogService,
		AuditSnapshotService auditSnapshotService) {

		_auditLogService = auditLogService;
		_auditSnapshotService = auditSnapshotService;
	}

	@Override
	public void onAfterSave(String pid, Dictionary<String, Object> properties)
		throws ConfigurationModelListenerException {

		_auditLogService.logSuccess(
			AuditActionType.CONFIG_UPDATE, AuditTargetType.CONFIGURATION,
			"configuration", pid, pid, null, null,
			_auditSnapshotService.snapshotConfiguration(pid, properties), null);
	}

	private final AuditLogService _auditLogService;
	private final AuditSnapshotService _auditSnapshotService;

}
