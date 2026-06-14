package vn.vec.custom.admin.audit.listener;

import com.liferay.portal.kernel.model.BaseModelListener;
import com.liferay.portal.kernel.model.LayoutSet;
import com.liferay.portal.kernel.model.ModelListener;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditDiffService;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;

@Component(service = ModelListener.class)
public class LayoutSetSettingsAuditModelListener
	extends BaseModelListener<LayoutSet> {

	@Override
	public void onAfterUpdate(LayoutSet originalLayoutSet, LayoutSet layoutSet) {
		String beforeData = _auditSnapshotService.snapshotLayoutSet(
			originalLayoutSet);
		String afterData = _auditSnapshotService.snapshotLayoutSet(layoutSet);
		String classPK = String.valueOf(layoutSet.getLayoutSetId());
		String targetTitle =
			"Layout Set Settings #" + layoutSet.getLayoutSetId();

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.SETTING,
			LayoutSet.class.getName(), classPK, targetTitle, null, beforeData,
			null, null, null, null,
			_auditDiffService.changedKeysJson(beforeData, afterData));

		_auditLogService.completeSuccess(
			auditLogId, classPK, targetTitle, null, beforeData, afterData);
	}

	@Reference
	private AuditDiffService _auditDiffService;

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
