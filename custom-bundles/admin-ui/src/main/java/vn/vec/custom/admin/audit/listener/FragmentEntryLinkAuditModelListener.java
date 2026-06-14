package vn.vec.custom.admin.audit.listener;

import com.liferay.fragment.model.FragmentEntryLink;
import com.liferay.portal.kernel.model.BaseModelListener;
import com.liferay.portal.kernel.model.ModelListener;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;
import vn.vec.custom.admin.audit.util.AuditThreadLocal;

@Component(service = ModelListener.class)
public class FragmentEntryLinkAuditModelListener
	extends BaseModelListener<FragmentEntryLink> {

	@Override
	public void onAfterRemove(FragmentEntryLink fragmentEntryLink) {
		String classPK = String.valueOf(
			fragmentEntryLink.getFragmentEntryLinkId());

		if (AuditThreadLocal.consumeHandled(
				FragmentEntryLink.class.getName(), classPK,
				AuditActionType.DELETE)) {

			return;
		}

		_auditLogService.logSuccess(
			AuditActionType.DELETE, AuditTargetType.FRAGMENT_ENTRY_LINK,
			FragmentEntryLink.class.getName(), classPK,
			_title(fragmentEntryLink), "plid:" + fragmentEntryLink.getPlid(),
			_auditSnapshotService.snapshotFragmentEntryLink(fragmentEntryLink),
			null, null);
	}

	@Override
	public void onAfterUpdate(
		FragmentEntryLink originalFragmentEntryLink,
		FragmentEntryLink fragmentEntryLink) {

		String classPK = String.valueOf(
			fragmentEntryLink.getFragmentEntryLinkId());

		if (AuditThreadLocal.consumeHandled(
				FragmentEntryLink.class.getName(), classPK,
				AuditActionType.UPDATE)) {

			return;
		}

		_auditLogService.logSuccess(
			AuditActionType.UPDATE, AuditTargetType.FRAGMENT_ENTRY_LINK,
			FragmentEntryLink.class.getName(), classPK, _title(fragmentEntryLink),
			"plid:" + fragmentEntryLink.getPlid(),
			_auditSnapshotService.snapshotFragmentEntryLink(
				originalFragmentEntryLink),
			_auditSnapshotService.snapshotFragmentEntryLink(fragmentEntryLink),
			null);
	}

	private String _title(FragmentEntryLink fragmentEntryLink) {
		if ((fragmentEntryLink.getRendererKey() != null) &&
			!fragmentEntryLink.getRendererKey().trim().isEmpty()) {

			return fragmentEntryLink.getRendererKey();
		}

		return "Fragment Link #" + fragmentEntryLink.getFragmentEntryLinkId();
	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
