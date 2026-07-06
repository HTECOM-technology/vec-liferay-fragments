package vn.vec.custom.admin.audit.wrapper;

import com.liferay.journal.model.JournalFolder;
import com.liferay.journal.service.JournalFolderLocalServiceWrapper;
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
public class JournalFolderAuditServiceWrapper
	extends JournalFolderLocalServiceWrapper {

	@Override
	public JournalFolder addFolder(
			String externalReferenceCode, long userId, long groupId,
			long parentFolderId, String name, String description,
			ServiceContext serviceContext)
		throws PortalException {

		long auditLogId = _auditLogService.startPending(
			AuditActionType.ADD, AuditTargetType.JOURNAL_FOLDER,
			JournalFolder.class.getName(), null, name, null, null, serviceContext);

		try {
			JournalFolder journalFolder = super.addFolder(
				externalReferenceCode, userId, groupId, parentFolderId, name,
				description, serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(journalFolder), _title(journalFolder), null,
				null, _auditSnapshotService.snapshotJournalFolder(journalFolder));

			return journalFolder;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, null, name, null, portalException);

			throw portalException;
		}
	}

	@Override
	public JournalFolder deleteFolder(long folderId) throws PortalException {
		JournalFolder beforeJournalFolder = super.fetchFolder(folderId);
		String beforeData = _auditSnapshotService.snapshotJournalFolder(
			beforeJournalFolder);
		String classPK = _classPK(beforeJournalFolder);

		AuditThreadLocal.markHandled(
			JournalFolder.class.getName(), classPK, AuditActionType.DELETE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.JOURNAL_FOLDER,
			JournalFolder.class.getName(), classPK, _title(beforeJournalFolder),
			null, beforeData, null);

		try {
			JournalFolder journalFolder = super.deleteFolder(folderId);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(beforeJournalFolder), null, beforeData,
				null);

			return journalFolder;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeJournalFolder), null,
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				JournalFolder.class.getName(), classPK, AuditActionType.DELETE);
		}
	}

	@Override
	public JournalFolder deleteFolder(long folderId, boolean includeTrashedEntries)
		throws PortalException {

		JournalFolder beforeJournalFolder = super.fetchFolder(folderId);
		String beforeData = _auditSnapshotService.snapshotJournalFolder(
			beforeJournalFolder);
		String classPK = _classPK(beforeJournalFolder);

		AuditThreadLocal.markHandled(
			JournalFolder.class.getName(), classPK, AuditActionType.DELETE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.JOURNAL_FOLDER,
			JournalFolder.class.getName(), classPK, _title(beforeJournalFolder),
			null, beforeData, null);

		try {
			JournalFolder journalFolder = super.deleteFolder(
				folderId, includeTrashedEntries);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(beforeJournalFolder), null, beforeData,
				null);

			return journalFolder;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeJournalFolder), null,
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				JournalFolder.class.getName(), classPK, AuditActionType.DELETE);
		}
	}

	@Override
	public JournalFolder moveFolder(
			long folderId, long parentFolderId, ServiceContext serviceContext)
		throws PortalException {

		JournalFolder beforeJournalFolder = super.fetchFolder(folderId);
		String beforeData = _auditSnapshotService.snapshotJournalFolder(
			beforeJournalFolder);
		String classPK = _classPK(beforeJournalFolder);

		AuditThreadLocal.markHandled(
			JournalFolder.class.getName(), classPK, AuditActionType.MOVE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.MOVE, AuditTargetType.JOURNAL_FOLDER,
			JournalFolder.class.getName(), classPK, _title(beforeJournalFolder),
			null, beforeData, serviceContext);

		try {
			JournalFolder journalFolder = super.moveFolder(
				folderId, parentFolderId, serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(journalFolder), _title(journalFolder), null,
				beforeData, _auditSnapshotService.snapshotJournalFolder(
					journalFolder));

			return journalFolder;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeJournalFolder), null,
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				JournalFolder.class.getName(), classPK, AuditActionType.MOVE);
		}
	}

	@Override
	public JournalFolder updateFolder(
			long userId, long groupId, long folderId, long parentFolderId,
			String name, String description, boolean mergeWithParentFolder,
			ServiceContext serviceContext)
		throws PortalException {

		return _updateFolder(
			super.fetchFolder(folderId), serviceContext,
			new UnsafeFolderSupplier() {

				@Override
				public JournalFolder get() throws PortalException {
					return JournalFolderAuditServiceWrapper.super.updateFolder(
						userId, groupId, folderId, parentFolderId, name,
						description, mergeWithParentFolder, serviceContext);
				}

			});
	}

	@Override
	public JournalFolder updateFolder(
			long userId, long groupId, long folderId, long parentFolderId,
			String name, String description, long[] ddmStructureIds,
			int restrictionType, boolean mergeWithParentFolder,
			ServiceContext serviceContext)
		throws PortalException {

		return _updateFolder(
			super.fetchFolder(folderId), serviceContext,
			new UnsafeFolderSupplier() {

				@Override
				public JournalFolder get() throws PortalException {
					return JournalFolderAuditServiceWrapper.super.updateFolder(
						userId, groupId, folderId, parentFolderId, name,
						description, ddmStructureIds, restrictionType,
						mergeWithParentFolder, serviceContext);
				}

			});
	}

	private String _classPK(JournalFolder journalFolder) {
		if (journalFolder == null) {
			return null;
		}

		return String.valueOf(journalFolder.getFolderId());
	}

	private String _title(JournalFolder journalFolder) {
		if (journalFolder == null) {
			return null;
		}

		return journalFolder.getName();
	}

	private JournalFolder _updateFolder(
			JournalFolder beforeJournalFolder, ServiceContext serviceContext,
			UnsafeFolderSupplier unsafeFolderSupplier)
		throws PortalException {

		String beforeData = _auditSnapshotService.snapshotJournalFolder(
			beforeJournalFolder);
		String classPK = _classPK(beforeJournalFolder);

		AuditThreadLocal.markHandled(
			JournalFolder.class.getName(), classPK, AuditActionType.UPDATE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.JOURNAL_FOLDER,
			JournalFolder.class.getName(), classPK, _title(beforeJournalFolder),
			null, beforeData, serviceContext);

		try {
			JournalFolder journalFolder = unsafeFolderSupplier.get();

			_auditLogService.completeSuccess(
				auditLogId, _classPK(journalFolder), _title(journalFolder), null,
				beforeData, _auditSnapshotService.snapshotJournalFolder(
					journalFolder));

			return journalFolder;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeJournalFolder), null,
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				JournalFolder.class.getName(), classPK, AuditActionType.UPDATE);
		}
	}

	private interface UnsafeFolderSupplier {

		public JournalFolder get() throws PortalException;

	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
