package vn.vec.custom.admin.audit.listener;

import com.liferay.portal.kernel.exception.ModelListenerException;
import com.liferay.portal.kernel.model.BaseModelListener;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.model.ModelListener;
import com.liferay.portal.kernel.model.ResourcePermission;
import com.liferay.portal.kernel.service.LayoutLocalServiceUtil;

import java.util.HashMap;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;
import vn.vec.custom.admin.audit.util.AuditThreadLocal;

@Component(
	property = "model.class.name=com.liferay.portal.kernel.model.ResourcePermission",
	service = ModelListener.class
)
public class ResourcePermissionAuditModelListener
	extends BaseModelListener<ResourcePermission> {

	@Override
	public void onAfterCreate(ResourcePermission model)
		throws ModelListenerException {

		_log(null, model);
	}

	@Override
	public void onAfterRemove(ResourcePermission model)
		throws ModelListenerException {

		_log(model, null);
	}

	@Override
	public void onAfterUpdate(
			ResourcePermission originalModel, ResourcePermission model)
		throws ModelListenerException {

		_log(originalModel, model);
	}

	private String _getTargetTitle(String resourceName, String primKey) {
		try {
			if (Layout.class.getName().equals(resourceName)) {
				Layout layout = LayoutLocalServiceUtil.fetchLayout(
					Long.parseLong(primKey));

				if (layout != null) {
					return layout.getNameCurrentValue();
				}
			}
		}
		catch (Exception exception) {
		}

		return primKey;
	}

	private void _log(
		ResourcePermission original, ResourcePermission model) {

		ResourcePermission reference = (model != null) ? model : original;

		if (reference == null) {
			return;
		}

		AuditTargetType targetType = _AUDITED_NAMES.get(reference.getName());

		if (targetType == null) {
			return;
		}

		if (AuditThreadLocal.isPermissionAuditSuppressed()) {
			return;
		}

		long beforeActionIds = (original != null) ? original.getActionIds() : 0;
		long afterActionIds = (model != null) ? model.getActionIds() : 0;

		if (beforeActionIds == afterActionIds) {
			return;
		}

		String primKey = reference.getPrimKey();
		long roleId = reference.getRoleId();
		String resourceName = reference.getName();

		String beforeData = _auditSnapshotService.snapshotPermission(
			roleId, beforeActionIds, resourceName);
		String afterData = _auditSnapshotService.snapshotPermission(
			roleId, afterActionIds, resourceName);

		_auditLogService.logSuccess(
			AuditActionType.PERMISSION_UPDATE, targetType,
			ResourcePermission.class.getName(), primKey,
			_getTargetTitle(resourceName, primKey), null,
			beforeData, afterData, null);
	}

	private static final Map<String, AuditTargetType> _AUDITED_NAMES;

	static {
		_AUDITED_NAMES = new HashMap<>();
		_AUDITED_NAMES.put(Layout.class.getName(), AuditTargetType.LAYOUT);
		_AUDITED_NAMES.put(
			"com.liferay.journal.model.JournalArticle",
			AuditTargetType.JOURNAL_ARTICLE);
	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
