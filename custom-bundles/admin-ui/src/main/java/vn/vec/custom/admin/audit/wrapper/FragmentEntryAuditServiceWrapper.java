package vn.vec.custom.admin.audit.wrapper;

import com.liferay.fragment.model.FragmentEntry;
import com.liferay.fragment.service.FragmentEntryLocalServiceWrapper;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceWrapper;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;

@Component(service = ServiceWrapper.class)
public class FragmentEntryAuditServiceWrapper
	extends FragmentEntryLocalServiceWrapper {

	@Override
	public FragmentEntry addFragmentEntry(
			String externalReferenceCode, long userId, long groupId,
			long fragmentCollectionId, String fragmentEntryKey, String name,
			String css, String html, String js, boolean cacheable,
			String configuration, String icon, long previewFileEntryId,
			boolean readOnly, int type, String typeOptions, int status,
			ServiceContext serviceContext)
		throws PortalException {

		long auditLogId = _auditLogService.startPending(
			AuditActionType.ADD, AuditTargetType.FRAGMENT_ENTRY,
			FragmentEntry.class.getName(), null, name, null, null,
			serviceContext);

		try {
			FragmentEntry fragmentEntry = super.addFragmentEntry(
				externalReferenceCode, userId, groupId, fragmentCollectionId,
				fragmentEntryKey, name, css, html, js, cacheable,
				configuration, icon, previewFileEntryId, readOnly, type,
				typeOptions, status, serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(fragmentEntry), _title(fragmentEntry), null,
				null, _auditSnapshotService.snapshotFragmentEntry(fragmentEntry));

			return fragmentEntry;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, null, name, null, portalException);

			throw portalException;
		}
	}

	@Override
	public FragmentEntry delete(FragmentEntry publishedFragmentEntry)
		throws PortalException {

		String beforeData = _auditSnapshotService.snapshotFragmentEntry(
			publishedFragmentEntry);
		String classPK = _classPK(publishedFragmentEntry);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.FRAGMENT_ENTRY,
			FragmentEntry.class.getName(), classPK, _title(publishedFragmentEntry),
			null, beforeData, null);

		try {
			FragmentEntry fragmentEntry = super.delete(publishedFragmentEntry);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(publishedFragmentEntry), null,
				beforeData, null);

			return fragmentEntry;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(publishedFragmentEntry), null,
				portalException);

			throw portalException;
		}
	}

	@Override
	public FragmentEntry deleteFragmentEntry(long fragmentEntryId)
		throws PortalException {

		FragmentEntry beforeFragmentEntry = super.fetchFragmentEntry(
			fragmentEntryId);
		String beforeData = _auditSnapshotService.snapshotFragmentEntry(
			beforeFragmentEntry);
		String classPK = _classPK(beforeFragmentEntry);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.FRAGMENT_ENTRY,
			FragmentEntry.class.getName(), classPK, _title(beforeFragmentEntry),
			null, beforeData, null);

		try {
			FragmentEntry fragmentEntry = super.deleteFragmentEntry(
				fragmentEntryId);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(beforeFragmentEntry), null, beforeData,
				null);

			return fragmentEntry;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeFragmentEntry), null,
				portalException);

			throw portalException;
		}
	}

	@Override
	public FragmentEntry publishDraft(FragmentEntry draftFragmentEntry)
		throws PortalException {

		return _updateFragmentEntry(
			super.fetchFragmentEntry(draftFragmentEntry.getFragmentEntryId()),
			null, AuditActionType.PUBLISH, new UnsafeFragmentEntrySupplier() {

				@Override
				public FragmentEntry get() throws PortalException {
					return FragmentEntryAuditServiceWrapper.super.publishDraft(
						draftFragmentEntry);
				}

			});
	}

	@Override
	public FragmentEntry updateFragmentEntry(FragmentEntry draftFragmentEntry)
		throws PortalException {

		return _updateFragmentEntry(
			super.fetchFragmentEntry(draftFragmentEntry.getFragmentEntryId()),
			null, AuditActionType.UPDATE, new UnsafeFragmentEntrySupplier() {

				@Override
				public FragmentEntry get() throws PortalException {
					return FragmentEntryAuditServiceWrapper.super.
						updateFragmentEntry(draftFragmentEntry);
				}

			});
	}

	@Override
	public FragmentEntry updateFragmentEntry(
			long userId, long fragmentEntryId, long fragmentCollectionId,
			String name, String css, String html, String js, boolean cacheable,
			String configuration, String icon, long previewFileEntryId,
			boolean readOnly, String typeOptions, int status)
		throws PortalException {

		return _updateFragmentEntry(
			super.fetchFragmentEntry(fragmentEntryId), null,
			AuditActionType.UPDATE, new UnsafeFragmentEntrySupplier() {

				@Override
				public FragmentEntry get() throws PortalException {
					return FragmentEntryAuditServiceWrapper.super.
						updateFragmentEntry(
							userId, fragmentEntryId, fragmentCollectionId, name,
							css, html, js, cacheable, configuration, icon,
							previewFileEntryId, readOnly, typeOptions, status);
				}

			});
	}

	@Override
	public FragmentEntry updateFragmentEntry(long fragmentEntryId, String name)
		throws PortalException {

		return _updateFragmentEntry(
			super.fetchFragmentEntry(fragmentEntryId), null,
			AuditActionType.UPDATE, new UnsafeFragmentEntrySupplier() {

				@Override
				public FragmentEntry get() throws PortalException {
					return FragmentEntryAuditServiceWrapper.super.
						updateFragmentEntry(fragmentEntryId, name);
				}

			});
	}

	private String _classPK(FragmentEntry fragmentEntry) {
		if (fragmentEntry == null) {
			return null;
		}

		return String.valueOf(fragmentEntry.getFragmentEntryId());
	}

	private String _title(FragmentEntry fragmentEntry) {
		if (fragmentEntry == null) {
			return null;
		}

		return fragmentEntry.getName();
	}

	private FragmentEntry _updateFragmentEntry(
			FragmentEntry beforeFragmentEntry, ServiceContext serviceContext,
			AuditActionType auditActionType,
			UnsafeFragmentEntrySupplier unsafeFragmentEntrySupplier)
		throws PortalException {

		String beforeData = _auditSnapshotService.snapshotFragmentEntry(
			beforeFragmentEntry);
		String classPK = _classPK(beforeFragmentEntry);

		long auditLogId = _auditLogService.startPending(
			auditActionType, AuditTargetType.FRAGMENT_ENTRY,
			FragmentEntry.class.getName(), classPK, _title(beforeFragmentEntry),
			null, beforeData, serviceContext);

		try {
			FragmentEntry fragmentEntry = unsafeFragmentEntrySupplier.get();

			_auditLogService.completeSuccess(
				auditLogId, _classPK(fragmentEntry), _title(fragmentEntry), null,
				beforeData, _auditSnapshotService.snapshotFragmentEntry(
					fragmentEntry));

			return fragmentEntry;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeFragmentEntry), null,
				portalException);

			throw portalException;
		}
	}

	private interface UnsafeFragmentEntrySupplier {

		public FragmentEntry get() throws PortalException;

	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
