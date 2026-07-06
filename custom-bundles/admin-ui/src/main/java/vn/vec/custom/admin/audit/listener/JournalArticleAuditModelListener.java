package vn.vec.custom.admin.audit.listener;

import com.liferay.journal.model.JournalArticle;
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
public class JournalArticleAuditModelListener
	extends BaseModelListener<JournalArticle> {

	@Override
	public void onAfterRemove(JournalArticle journalArticle) {
		String classPK = String.valueOf(journalArticle.getResourcePrimKey());

		if (AuditThreadLocal.consumeHandled(
				JournalArticle.class.getName(), classPK,
				AuditActionType.DELETE)) {

			return;
		}

		_auditLogService.logSuccess(
			AuditActionType.DELETE, AuditTargetType.JOURNAL_ARTICLE,
			JournalArticle.class.getName(), classPK,
			journalArticle.getTitleCurrentValue(), journalArticle.getUrlTitle(),
			_auditSnapshotService.snapshotJournalArticle(journalArticle), null,
			null);
	}

	@Override
	public void onAfterUpdate(
		JournalArticle originalJournalArticle, JournalArticle journalArticle) {

		String classPK = String.valueOf(journalArticle.getResourcePrimKey());

		if (AuditThreadLocal.consumeHandled(
				JournalArticle.class.getName(), classPK,
				AuditActionType.UPDATE) ||
			AuditThreadLocal.consumeHandled(
				JournalArticle.class.getName(), classPK,
				AuditActionType.PUBLISH)) {

			return;
		}

		_auditLogService.logSuccess(
			AuditActionType.UPDATE, AuditTargetType.JOURNAL_ARTICLE,
			JournalArticle.class.getName(), classPK,
			journalArticle.getTitleCurrentValue(), journalArticle.getUrlTitle(),
			_auditSnapshotService.snapshotJournalArticle(originalJournalArticle),
			_auditSnapshotService.snapshotJournalArticle(journalArticle), null);
	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
