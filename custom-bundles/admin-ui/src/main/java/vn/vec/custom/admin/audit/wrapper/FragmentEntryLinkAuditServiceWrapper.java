package vn.vec.custom.admin.audit.wrapper;

import com.liferay.fragment.model.FragmentEntryLink;
import com.liferay.fragment.service.FragmentEntryLinkLocalServiceWrapper;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceWrapper;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;
import vn.vec.custom.admin.audit.util.AuditThreadLocal;

@Component(service = ServiceWrapper.class)
public class FragmentEntryLinkAuditServiceWrapper
	extends FragmentEntryLinkLocalServiceWrapper {

	@Override
	public FragmentEntryLink addFragmentEntryLink(
			String externalReferenceCode, long userId, long groupId,
			long originalFragmentEntryLinkId, long fragmentEntryId,
			long segmentsExperienceId, long plid, String css, String html,
			String js, String configuration, String editableValues,
			String namespace, int position, String rendererKey, int type,
			ServiceContext serviceContext)
		throws PortalException {

		long auditLogId = _auditLogService.startPending(
			AuditActionType.ADD, AuditTargetType.FRAGMENT_ENTRY_LINK,
			FragmentEntryLink.class.getName(), null, rendererKey,
			"plid:" + plid, null, serviceContext);

		try {
			FragmentEntryLink fragmentEntryLink = super.addFragmentEntryLink(
				externalReferenceCode, userId, groupId,
				originalFragmentEntryLinkId, fragmentEntryId,
				segmentsExperienceId, plid, css, html, js, configuration,
				editableValues, namespace, position, rendererKey, type,
				serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(fragmentEntryLink), _title(fragmentEntryLink),
				_targetUrl(fragmentEntryLink), null,
				_auditSnapshotService.snapshotFragmentEntryLink(
					fragmentEntryLink));

			return fragmentEntryLink;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, null, rendererKey, "plid:" + plid, portalException);

			throw portalException;
		}
	}

	@Override
	public FragmentEntryLink deleteFragmentEntryLink(long fragmentEntryLinkId)
		throws PortalException {

		FragmentEntryLink beforeFragmentEntryLink = super.fetchFragmentEntryLink(
			fragmentEntryLinkId);
		String beforeData = _auditSnapshotService.snapshotFragmentEntryLink(
			beforeFragmentEntryLink);
		String classPK = _classPK(beforeFragmentEntryLink);

		AuditThreadLocal.markHandled(
			FragmentEntryLink.class.getName(), classPK,
			AuditActionType.DELETE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.FRAGMENT_ENTRY_LINK,
			FragmentEntryLink.class.getName(), classPK,
			_title(beforeFragmentEntryLink), _targetUrl(beforeFragmentEntryLink),
			beforeData, null);

		try {
			FragmentEntryLink fragmentEntryLink = super.deleteFragmentEntryLink(
				fragmentEntryLinkId);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(beforeFragmentEntryLink),
				_targetUrl(beforeFragmentEntryLink), beforeData, null);

			return fragmentEntryLink;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeFragmentEntryLink),
				_targetUrl(beforeFragmentEntryLink), portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				FragmentEntryLink.class.getName(), classPK,
				AuditActionType.DELETE);
		}
	}

	@Override
	public FragmentEntryLink deleteFragmentEntryLink(
		FragmentEntryLink fragmentEntryLink) {

		String beforeData = _auditSnapshotService.snapshotFragmentEntryLink(
			fragmentEntryLink);
		String classPK = _classPK(fragmentEntryLink);

		AuditThreadLocal.markHandled(
			FragmentEntryLink.class.getName(), classPK,
			AuditActionType.DELETE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.FRAGMENT_ENTRY_LINK,
			FragmentEntryLink.class.getName(), classPK, _title(fragmentEntryLink),
			_targetUrl(fragmentEntryLink), beforeData, null);

		try {
			FragmentEntryLink deletedFragmentEntryLink =
				super.deleteFragmentEntryLink(fragmentEntryLink);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(fragmentEntryLink),
				_targetUrl(fragmentEntryLink), beforeData, null);

			return deletedFragmentEntryLink;
		}
		catch (RuntimeException runtimeException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(fragmentEntryLink),
				_targetUrl(fragmentEntryLink), runtimeException);

			throw runtimeException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				FragmentEntryLink.class.getName(), classPK,
				AuditActionType.DELETE);
		}
	}

	@Override
	public FragmentEntryLink updateDeleted(
			long userId, long fragmentEntryLinkId, boolean deleted)
		throws PortalException {

		AuditActionType auditActionType = deleted ? AuditActionType.DELETE :
			AuditActionType.UPDATE;

		return _updateFragmentEntryLink(
			super.fetchFragmentEntryLink(fragmentEntryLinkId), null,
			auditActionType, new UnsafeFragmentEntryLinkSupplier() {

				@Override
				public FragmentEntryLink get() throws PortalException {
					return FragmentEntryLinkAuditServiceWrapper.super.updateDeleted(
						userId, fragmentEntryLinkId, deleted);
				}

			});
	}

	@Override
	public FragmentEntryLink updateFragmentEntryLink(
			long userId, long fragmentEntryLinkId,
			long originalFragmentEntryLinkId, long fragmentEntryId, long plid,
			String css, String html, String js, String configuration,
			String editableValues, String namespace, int position, int type,
			ServiceContext serviceContext)
		throws PortalException {

		return _updateFragmentEntryLink(
			super.fetchFragmentEntryLink(fragmentEntryLinkId), serviceContext,
			AuditActionType.UPDATE, new UnsafeFragmentEntryLinkSupplier() {

				@Override
				public FragmentEntryLink get() throws PortalException {
					return FragmentEntryLinkAuditServiceWrapper.super.
						updateFragmentEntryLink(
							userId, fragmentEntryLinkId,
							originalFragmentEntryLinkId, fragmentEntryId, plid,
							css, html, js, configuration, editableValues,
							namespace, position, type, serviceContext);
				}

			});
	}

	@Override
	public FragmentEntryLink updateFragmentEntryLink(
			long userId, long fragmentEntryLinkId, String editableValues)
		throws PortalException {

		return _updateFragmentEntryLink(
			super.fetchFragmentEntryLink(fragmentEntryLinkId), null,
			AuditActionType.UPDATE, new UnsafeFragmentEntryLinkSupplier() {

				@Override
				public FragmentEntryLink get() throws PortalException {
					return FragmentEntryLinkAuditServiceWrapper.super.
						updateFragmentEntryLink(
							userId, fragmentEntryLinkId, editableValues);
				}

			});
	}

	@Override
	public FragmentEntryLink updateFragmentEntryLink(
			long userId, long fragmentEntryLinkId, String editableValues,
			boolean updateClassedModel)
		throws PortalException {

		return _updateFragmentEntryLink(
			super.fetchFragmentEntryLink(fragmentEntryLinkId), null,
			AuditActionType.UPDATE, new UnsafeFragmentEntryLinkSupplier() {

				@Override
				public FragmentEntryLink get() throws PortalException {
					return FragmentEntryLinkAuditServiceWrapper.super.
						updateFragmentEntryLink(
							userId, fragmentEntryLinkId, editableValues,
							updateClassedModel);
				}

			});
	}

	private String _classPK(FragmentEntryLink fragmentEntryLink) {
		if (fragmentEntryLink == null) {
			return null;
		}

		return String.valueOf(fragmentEntryLink.getFragmentEntryLinkId());
	}

	private String _targetUrl(FragmentEntryLink fragmentEntryLink) {
		if (fragmentEntryLink == null) {
			return null;
		}

		return "plid:" + fragmentEntryLink.getPlid();
	}

	private String _title(FragmentEntryLink fragmentEntryLink) {
		if (fragmentEntryLink == null) {
			return null;
		}

		if ((fragmentEntryLink.getRendererKey() != null) &&
			!fragmentEntryLink.getRendererKey().trim().isEmpty()) {

			return fragmentEntryLink.getRendererKey();
		}

		return "Fragment Link #" + fragmentEntryLink.getFragmentEntryLinkId();
	}

	private FragmentEntryLink _updateFragmentEntryLink(
			FragmentEntryLink beforeFragmentEntryLink,
			ServiceContext serviceContext, AuditActionType auditActionType,
			UnsafeFragmentEntryLinkSupplier unsafeFragmentEntryLinkSupplier)
		throws PortalException {

		String beforeData = _auditSnapshotService.snapshotFragmentEntryLink(
			beforeFragmentEntryLink);
		String classPK = _classPK(beforeFragmentEntryLink);

		AuditThreadLocal.markHandled(
			FragmentEntryLink.class.getName(), classPK, auditActionType);

		long auditLogId = _auditLogService.startPending(
			auditActionType, AuditTargetType.FRAGMENT_ENTRY_LINK,
			FragmentEntryLink.class.getName(), classPK,
			_title(beforeFragmentEntryLink), _targetUrl(beforeFragmentEntryLink),
			beforeData, serviceContext);

		try {
			FragmentEntryLink fragmentEntryLink =
				unsafeFragmentEntryLinkSupplier.get();

			_auditLogService.completeSuccess(
				auditLogId, _classPK(fragmentEntryLink), _title(fragmentEntryLink),
				_targetUrl(fragmentEntryLink), beforeData,
				_auditSnapshotService.snapshotFragmentEntryLink(
					fragmentEntryLink));

			return fragmentEntryLink;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeFragmentEntryLink),
				_targetUrl(beforeFragmentEntryLink), portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				FragmentEntryLink.class.getName(), classPK, auditActionType);
		}
	}

	private interface UnsafeFragmentEntryLinkSupplier {

		public FragmentEntryLink get() throws PortalException;

	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
