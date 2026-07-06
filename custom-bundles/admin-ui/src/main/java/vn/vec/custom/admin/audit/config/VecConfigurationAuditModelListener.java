package vn.vec.custom.admin.audit.config;

import com.liferay.portal.configuration.persistence.listener.ConfigurationModelListener;
import com.liferay.portal.configuration.persistence.listener.ConfigurationModelListenerException;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;

import java.util.Dictionary;
import java.util.HashMap;
import java.util.Map;

import org.osgi.service.cm.Configuration;
import org.osgi.service.cm.ConfigurationAdmin;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;
import vn.vec.custom.admin.audit.util.AuditConfigurationUtil;

@Component(
	property = "model.class.name=*",
	service = ConfigurationModelListener.class
)
public class VecConfigurationAuditModelListener
	implements ConfigurationModelListener {

	@Override
	public void onAfterDelete(String pid)
		throws ConfigurationModelListenerException {

		_PendingAudit pendingAudit = _pendingAudits.get().remove(
			_toKey(AuditActionType.DELETE, pid));

		if (pendingAudit == null) {
			return;
		}

		_auditLogService.completeSuccess(
			pendingAudit.auditLogId, pendingAudit.classPK, pendingAudit.targetTitle,
			null, pendingAudit.beforeData, null);
	}

	@Override
	public void onAfterSave(String pid, Dictionary<String, Object> properties)
		throws ConfigurationModelListenerException {

		_PendingAudit pendingAudit = _pendingAudits.get().remove(
			_toKey(AuditActionType.CONFIG_UPDATE, pid));

		if (pendingAudit == null) {
			return;
		}

		_auditLogService.completeSuccess(
			pendingAudit.auditLogId, pendingAudit.classPK, pendingAudit.targetTitle,
			null, pendingAudit.beforeData,
			_auditSnapshotService.snapshotConfiguration(
				pendingAudit.pid, pendingAudit.factoryPid, pendingAudit.scope,
				properties));
	}

	@Override
	public void onBeforeDelete(String pid)
		throws ConfigurationModelListenerException {

		Dictionary<String, Object> beforeProperties = _getProperties(pid);
		String factoryPid = AuditConfigurationUtil.getFactoryPid(beforeProperties);
		String scope = AuditConfigurationUtil.determineScope(beforeProperties);
		String beforeData = _auditSnapshotService.snapshotConfiguration(
			pid, factoryPid, scope, beforeProperties);
		String targetTitle = _targetTitle(pid, factoryPid, scope, beforeProperties);
		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.CONFIGURATION,
			_CONFIGURATION_CLASS_NAME, pid, targetTitle, null, beforeData, null,
			pid, factoryPid, scope,
			AuditConfigurationUtil.toChangedKeysJson(beforeProperties, null));

		_pendingAudits.get().put(
			_toKey(AuditActionType.DELETE, pid),
			new _PendingAudit(
				auditLogId, pid, pid, factoryPid, scope, targetTitle,
				beforeData));
	}

	@Override
	public void onBeforeSave(String pid, Dictionary<String, Object> properties)
		throws ConfigurationModelListenerException {

		Dictionary<String, Object> beforeProperties = _getProperties(pid);
		String factoryPid = AuditConfigurationUtil.getFactoryPid(properties);
		String scope = AuditConfigurationUtil.determineScope(properties);
		String beforeData = _auditSnapshotService.snapshotConfiguration(
			pid, factoryPid, scope, beforeProperties);
		String targetTitle = _targetTitle(pid, factoryPid, scope, properties);
		long auditLogId = _auditLogService.startPending(
			AuditActionType.CONFIG_UPDATE, AuditTargetType.CONFIGURATION,
			_CONFIGURATION_CLASS_NAME, pid, targetTitle, null, beforeData, null,
			pid, factoryPid, scope,
			AuditConfigurationUtil.toChangedKeysJson(beforeProperties, properties));

		_pendingAudits.get().put(
			_toKey(AuditActionType.CONFIG_UPDATE, pid),
			new _PendingAudit(
				auditLogId, pid, pid, factoryPid, scope, targetTitle,
				beforeData));
	}

	private Dictionary<String, Object> _getProperties(String pid) {
		try {
			Configuration[] configurations = _configurationAdmin.listConfigurations(
				"(service.pid=" + _escapeFilter(pid) + ")");

			if ((configurations == null) || (configurations.length == 0)) {
				return null;
			}

			return configurations[0].getProperties();
		}
		catch (Exception exception) {
			_log.warn("Unable to resolve current configuration " + pid, exception);

			return null;
		}
	}

	private String _escapeFilter(String value) {
		if (value == null) {
			return "";
		}

		return value.replace("\\", "\\\\").replace("(", "\\(").replace(
			")", "\\)").replace("*", "\\*");
	}

	private String _targetTitle(
		String pid, String factoryPid, String scope,
		Dictionary<String, Object> properties) {

		String displayPid = AuditConfigurationUtil.getDisplayPid(pid, factoryPid);
		String scopeValue = AuditConfigurationUtil.getScopeValue(properties);

		if ((scopeValue == null) || scopeValue.trim().isEmpty()) {
			return displayPid + " [" + scope + "]";
		}

		return displayPid + " [" + scope + ":" + scopeValue + "]";
	}

	private String _toKey(AuditActionType auditActionType, String pid) {
		return auditActionType.name() + "#" + String.valueOf(pid);
	}

	private static final String _CONFIGURATION_CLASS_NAME = "configuration";

	private static final Log _log = LogFactoryUtil.getLog(
		VecConfigurationAuditModelListener.class);

	private final ThreadLocal<Map<String, _PendingAudit>> _pendingAudits =
		ThreadLocal.withInitial(HashMap::new);

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

	@Reference
	private ConfigurationAdmin _configurationAdmin;

	private static class _PendingAudit {

		private _PendingAudit(
			long auditLogId, String classPK, String pid, String factoryPid,
			String scope, String targetTitle, String beforeData) {

			this.auditLogId = auditLogId;
			this.beforeData = beforeData;
			this.classPK = classPK;
			this.factoryPid = factoryPid;
			this.pid = pid;
			this.scope = scope;
			this.targetTitle = targetTitle;
		}

		private final long auditLogId;
		private final String beforeData;
		private final String classPK;
		private final String factoryPid;
		private final String pid;
		private final String scope;
		private final String targetTitle;

	}

}
