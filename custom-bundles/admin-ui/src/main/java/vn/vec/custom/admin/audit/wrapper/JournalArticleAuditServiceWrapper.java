package vn.vec.custom.admin.audit.wrapper;

import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.service.JournalArticleLocalServiceWrapper;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceWrapper;
import com.liferay.portal.kernel.workflow.WorkflowConstants;

import java.io.File;

import java.util.Locale;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;
import vn.vec.custom.admin.audit.util.AuditThreadLocal;

@Component(service = ServiceWrapper.class)
public class JournalArticleAuditServiceWrapper
	extends JournalArticleLocalServiceWrapper {

	@Override
	public JournalArticle addArticle(
			String externalReferenceCode, long userId, long groupId,
			long folderId, Map<Locale, String> titleMap,
			Map<Locale, String> descriptionMap, String content,
			long ddmStructureId, String ddmTemplateKey,
			ServiceContext serviceContext)
		throws PortalException {

		long auditLogId = _auditLogService.startPending(
			AuditActionType.ADD, AuditTargetType.JOURNAL_ARTICLE,
			JournalArticle.class.getName(), null,
			_titleFromMap(titleMap, null), null, null, serviceContext);

		try {
			JournalArticle journalArticle = super.addArticle(
				externalReferenceCode, userId, groupId, folderId, titleMap,
				descriptionMap, content, ddmStructureId, ddmTemplateKey,
				serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(journalArticle), _title(journalArticle),
				_targetUrl(journalArticle), null,
				_auditSnapshotService.snapshotJournalArticle(journalArticle));

			return journalArticle;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, null, _titleFromMap(titleMap, null), null,
				portalException);

			throw portalException;
		}
	}

	@Override
	public JournalArticle addArticle(
			String externalReferenceCode, long userId, long groupId,
			long folderId, long classNameId, long classPK, String articleId,
			boolean autoArticleId, double version, Map<Locale, String> titleMap,
			Map<Locale, String> descriptionMap,
			Map<Locale, String> friendlyURLMap, String content,
			long ddmStructureId, String ddmTemplateKey, String layoutUuid,
			int displayDateMonth, int displayDateDay, int displayDateYear,
			int displayDateHour, int displayDateMinute, int expirationDateMonth,
			int expirationDateDay, int expirationDateYear,
			int expirationDateHour, int expirationDateMinute,
			boolean neverExpire, int reviewDateMonth, int reviewDateDay,
			int reviewDateYear, int reviewDateHour, int reviewDateMinute,
			boolean neverReview, boolean indexable, boolean smallImage,
			long smallImageId, int smallImageSource, String smallImageURL,
			File smallImageFile, Map<String, byte[]> images, String articleURL,
			ServiceContext serviceContext)
		throws PortalException {

		long auditLogId = _auditLogService.startPending(
			AuditActionType.ADD, AuditTargetType.JOURNAL_ARTICLE,
			JournalArticle.class.getName(), null,
			_titleFromMap(titleMap, articleId), articleURL, null,
			serviceContext);

		try {
			JournalArticle journalArticle = super.addArticle(
				externalReferenceCode, userId, groupId, folderId, classNameId,
				classPK, articleId, autoArticleId, version, titleMap,
				descriptionMap, friendlyURLMap, content, ddmStructureId,
				ddmTemplateKey, layoutUuid, displayDateMonth, displayDateDay,
				displayDateYear, displayDateHour, displayDateMinute,
				expirationDateMonth, expirationDateDay, expirationDateYear,
				expirationDateHour, expirationDateMinute, neverExpire,
				reviewDateMonth, reviewDateDay, reviewDateYear, reviewDateHour,
				reviewDateMinute, neverReview, indexable, smallImage,
				smallImageId, smallImageSource, smallImageURL, smallImageFile,
				images, articleURL, serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(journalArticle), _title(journalArticle),
				_targetUrl(journalArticle), null,
				_auditSnapshotService.snapshotJournalArticle(journalArticle));

			return journalArticle;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, null, _titleFromMap(titleMap, articleId), articleURL,
				portalException);

			throw portalException;
		}
	}

	@Override
	public void deleteArticle(
			long groupId, String articleId, ServiceContext serviceContext)
		throws PortalException {

		JournalArticle beforeJournalArticle = super.fetchArticle(
			groupId, articleId);
		String beforeData = _auditSnapshotService.snapshotJournalArticle(
			beforeJournalArticle);
		String classPK = _classPK(beforeJournalArticle);

		AuditThreadLocal.markHandled(
			JournalArticle.class.getName(), classPK, AuditActionType.DELETE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.JOURNAL_ARTICLE,
			JournalArticle.class.getName(), classPK, _title(beforeJournalArticle),
			_targetUrl(beforeJournalArticle), beforeData, serviceContext);

		try {
			super.deleteArticle(groupId, articleId, serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(beforeJournalArticle),
				_targetUrl(beforeJournalArticle), beforeData, null);
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeJournalArticle),
				_targetUrl(beforeJournalArticle), portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				JournalArticle.class.getName(), classPK, AuditActionType.DELETE);
		}
	}

	@Override
	public JournalArticle deleteArticle(
			long groupId, String articleId, double version, String articleURL,
			ServiceContext serviceContext)
		throws PortalException {

		JournalArticle beforeJournalArticle = super.fetchArticle(
			groupId, articleId, version);
		String beforeData = _auditSnapshotService.snapshotJournalArticle(
			beforeJournalArticle);
		String classPK = _classPK(beforeJournalArticle);

		AuditThreadLocal.markHandled(
			JournalArticle.class.getName(), classPK, AuditActionType.DELETE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.JOURNAL_ARTICLE,
			JournalArticle.class.getName(), classPK, _title(beforeJournalArticle),
			articleURL, beforeData, serviceContext);

		try {
			JournalArticle deletedJournalArticle = super.deleteArticle(
				groupId, articleId, version, articleURL, serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(beforeJournalArticle), articleURL,
				beforeData, null);

			return deletedJournalArticle;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeJournalArticle), articleURL,
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				JournalArticle.class.getName(), classPK, AuditActionType.DELETE);
		}
	}

	@Override
	public JournalArticle updateArticle(
			long userId, long groupId, long folderId, String articleId,
			double version, Map<Locale, String> titleMap,
			Map<Locale, String> descriptionMap, String content,
			String layoutUuid, ServiceContext serviceContext)
		throws PortalException {

		return _updateArticle(
			super.fetchArticle(groupId, articleId, version), serviceContext,
			new UnsafeArticleSupplier() {

				@Override
				public JournalArticle get() throws PortalException {
					return JournalArticleAuditServiceWrapper.super.updateArticle(
						userId, groupId, folderId, articleId, version, titleMap,
						descriptionMap, content, layoutUuid, serviceContext);
				}

			});
	}

	@Override
	public JournalArticle updateArticle(
			long userId, long groupId, long folderId, String articleId,
			double version, Map<Locale, String> titleMap,
			Map<Locale, String> descriptionMap,
			Map<Locale, String> friendlyURLMap, String content,
			String ddmTemplateKey, String layoutUuid, int displayDateMonth,
			int displayDateDay, int displayDateYear, int displayDateHour,
			int displayDateMinute, int expirationDateMonth, int expirationDateDay,
			int expirationDateYear, int expirationDateHour,
			int expirationDateMinute, boolean neverExpire, int reviewDateMonth,
			int reviewDateDay, int reviewDateYear, int reviewDateHour,
			int reviewDateMinute, boolean neverReview, boolean indexable,
			boolean smallImage, long smallImageId, int smallImageSource,
			String smallImageURL, File smallImageFile, Map<String, byte[]> images,
			String articleURL, ServiceContext serviceContext)
		throws PortalException {

		return _updateArticle(
			super.fetchArticle(groupId, articleId, version), serviceContext,
			new UnsafeArticleSupplier() {

				@Override
				public JournalArticle get() throws PortalException {
					return JournalArticleAuditServiceWrapper.super.updateArticle(
						userId, groupId, folderId, articleId, version, titleMap,
						descriptionMap, friendlyURLMap, content, ddmTemplateKey,
						layoutUuid, displayDateMonth, displayDateDay,
						displayDateYear, displayDateHour, displayDateMinute,
						expirationDateMonth, expirationDateDay,
						expirationDateYear, expirationDateHour,
						expirationDateMinute, neverExpire, reviewDateMonth,
						reviewDateDay, reviewDateYear, reviewDateHour,
						reviewDateMinute, neverReview, indexable, smallImage,
						smallImageId, smallImageSource, smallImageURL,
						smallImageFile, images, articleURL, serviceContext);
				}

			});
	}

	@Override
	public JournalArticle updateArticle(
			long userId, long groupId, long folderId, String articleId,
			double version, String content, ServiceContext serviceContext)
		throws PortalException {

		return _updateArticle(
			super.fetchArticle(groupId, articleId, version), serviceContext,
			new UnsafeArticleSupplier() {

				@Override
				public JournalArticle get() throws PortalException {
					return JournalArticleAuditServiceWrapper.super.updateArticle(
						userId, groupId, folderId, articleId, version, content,
						serviceContext);
				}

			});
	}

	@Override
	public JournalArticle updateStatus(
			long userId, long groupId, String articleId, double version,
			int status, String articleURL,
			Map<String, java.io.Serializable> workflowContext,
			ServiceContext serviceContext)
		throws PortalException {

		JournalArticle beforeJournalArticle = super.fetchArticle(
			groupId, articleId, version);
		String beforeData = _auditSnapshotService.snapshotJournalArticle(
			beforeJournalArticle);
		String classPK = _classPK(beforeJournalArticle);
		AuditActionType auditActionType =
			(status == WorkflowConstants.STATUS_APPROVED) ?
				AuditActionType.PUBLISH : AuditActionType.UPDATE;

		AuditThreadLocal.markHandled(
			JournalArticle.class.getName(), classPK, auditActionType);

		long auditLogId = _auditLogService.startPending(
			auditActionType, AuditTargetType.JOURNAL_ARTICLE,
			JournalArticle.class.getName(), classPK, _title(beforeJournalArticle),
			articleURL, beforeData, serviceContext);

		try {
			JournalArticle journalArticle = super.updateStatus(
				userId, groupId, articleId, version, status, articleURL,
				workflowContext, serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(journalArticle), _title(journalArticle),
				articleURL, beforeData,
				_auditSnapshotService.snapshotJournalArticle(journalArticle));

			return journalArticle;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeJournalArticle), articleURL,
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				JournalArticle.class.getName(), classPK, auditActionType);
		}
	}

	private String _classPK(JournalArticle journalArticle) {
		if (journalArticle == null) {
			return null;
		}

		return String.valueOf(journalArticle.getResourcePrimKey());
	}

	private String _targetUrl(JournalArticle journalArticle) {
		if (journalArticle == null) {
			return null;
		}

		return journalArticle.getUrlTitle();
	}

	private String _title(JournalArticle journalArticle) {
		if (journalArticle == null) {
			return null;
		}

		return journalArticle.getTitleCurrentValue();
	}

	private String _titleFromMap(
		Map<Locale, String> titleMap, String fallbackValue) {

		if ((titleMap == null) || titleMap.isEmpty()) {
			return fallbackValue;
		}

		for (String value : titleMap.values()) {
			if ((value != null) && !value.trim().isEmpty()) {
				return value;
			}
		}

		return fallbackValue;
	}

	private JournalArticle _updateArticle(
			JournalArticle beforeJournalArticle, ServiceContext serviceContext,
			UnsafeArticleSupplier unsafeArticleSupplier)
		throws PortalException {

		String beforeData = _auditSnapshotService.snapshotJournalArticle(
			beforeJournalArticle);
		String classPK = _classPK(beforeJournalArticle);

		AuditThreadLocal.markHandled(
			JournalArticle.class.getName(), classPK, AuditActionType.UPDATE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.JOURNAL_ARTICLE,
			JournalArticle.class.getName(), classPK, _title(beforeJournalArticle),
			_targetUrl(beforeJournalArticle), beforeData, serviceContext);

		try {
			JournalArticle journalArticle = unsafeArticleSupplier.get();

			_auditLogService.completeSuccess(
				auditLogId, _classPK(journalArticle), _title(journalArticle),
				_targetUrl(journalArticle), beforeData,
				_auditSnapshotService.snapshotJournalArticle(journalArticle));

			return journalArticle;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeJournalArticle),
				_targetUrl(beforeJournalArticle), portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				JournalArticle.class.getName(), classPK, AuditActionType.UPDATE);
		}
	}

	private interface UnsafeArticleSupplier {

		public JournalArticle get() throws PortalException;

	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
