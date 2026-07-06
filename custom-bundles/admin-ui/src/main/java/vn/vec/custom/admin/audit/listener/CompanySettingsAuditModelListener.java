package vn.vec.custom.admin.audit.listener;

import com.liferay.portal.kernel.model.BaseModelListener;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.ModelListener;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditDiffService;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;

@Component(service = ModelListener.class)
public class CompanySettingsAuditModelListener
	extends BaseModelListener<Company> {

	@Override
	public void onAfterUpdate(Company originalCompany, Company company) {
		String beforeData = _auditSnapshotService.snapshotCompany(originalCompany);
		String afterData = _auditSnapshotService.snapshotCompany(company);
		String classPK = String.valueOf(company.getCompanyId());

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.SETTING,
			Company.class.getName(), classPK, "Company Settings", null,
			beforeData, null, null, null, null,
			_auditDiffService.changedKeysJson(beforeData, afterData));

		_auditLogService.completeSuccess(
			auditLogId, classPK, "Company Settings", null, beforeData, afterData);
	}

	@Reference
	private AuditDiffService _auditDiffService;

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
