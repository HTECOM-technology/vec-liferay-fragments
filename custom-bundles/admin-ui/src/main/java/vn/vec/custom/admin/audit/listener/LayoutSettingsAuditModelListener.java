package vn.vec.custom.admin.audit.listener;

import com.liferay.portal.kernel.model.BaseModelListener;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.model.ModelListener;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditDiffService;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;

@Component(service = ModelListener.class)
public class LayoutSettingsAuditModelListener extends BaseModelListener<Layout> {

	@Override
	public void onAfterUpdate(Layout originalLayout, Layout layout) {
		// TODO: Layout updates may still include page-content side effects because
		// Liferay stores several page settings in Layout.typeSettings. We log this
		// path explicitly as SETTING, but screen-level separation may need a later
		// refinement if duplicate/noisy records are observed in production.
		String beforeData = _auditSnapshotService.snapshotLayout(originalLayout);
		String afterData = _auditSnapshotService.snapshotLayout(layout);
		String classPK = String.valueOf(layout.getPlid());
		String targetTitle = "Layout Settings: " + layout.getNameCurrentValue();

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.SETTING,
			Layout.class.getName(), classPK, targetTitle, null, beforeData, null,
			null, null, null,
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
