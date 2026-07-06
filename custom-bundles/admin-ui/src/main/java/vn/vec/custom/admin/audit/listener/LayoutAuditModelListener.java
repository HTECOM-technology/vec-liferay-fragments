package vn.vec.custom.admin.audit.listener;

import com.liferay.portal.kernel.model.BaseModelListener;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.model.ModelListener;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;
import vn.vec.custom.admin.audit.util.AuditThreadLocal;

@Component(service = ModelListener.class)
public class LayoutAuditModelListener extends BaseModelListener<Layout> {

	@Override
	public void onAfterRemove(Layout layout) {
		String classPK = String.valueOf(layout.getPlid());

		if (AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.DELETE)) {

			return;
		}

		_auditLogService.logSuccess(
			AuditActionType.DELETE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, layout.getNameCurrentValue(),
			layout.getFriendlyURL(java.util.Locale.getDefault()),
			_auditSnapshotService.snapshotLayout(layout), null, null);
	}

	@Override
	public void onAfterUpdate(Layout originalLayout, Layout layout) {
		String classPK = String.valueOf(layout.getPlid());

		if (AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.UPDATE)) {

			return;
		}

		_auditLogService.logSuccess(
			AuditActionType.UPDATE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, layout.getNameCurrentValue(),
			layout.getFriendlyURL(java.util.Locale.getDefault()),
			_auditSnapshotService.snapshotLayout(originalLayout),
			_auditSnapshotService.snapshotLayout(layout), null);
	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
