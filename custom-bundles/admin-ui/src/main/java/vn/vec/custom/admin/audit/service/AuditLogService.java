package vn.vec.custom.admin.audit.service;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.service.ServiceContext;

import java.io.PrintWriter;
import java.io.StringWriter;

import java.util.Date;
import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditLogEntry;
import vn.vec.custom.admin.audit.model.AuditStatus;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.persistence.AuditLogRepository;
import vn.vec.custom.admin.audit.util.AuditJsonUtil;
import vn.vec.custom.admin.audit.util.AuditSanitizer;

@Component(service = AuditLogService.class)
public class AuditLogService {

	public void completeFailure(
		long auditLogId, String classPK, String targetTitle, String targetUrl,
		Throwable throwable) {

		if (auditLogId <= 0) {
			return;
		}

		try {
			_auditLogRepository.updateFailed(
				auditLogId, classPK, targetTitle, targetUrl,
				_toErrorMessage(throwable), new Date());
		}
		catch (Exception exception) {
			_log.error(
				"Unable to update failed audit log " + auditLogId, exception);
		}
	}

	public void completeSuccess(
		long auditLogId, String classPK, String targetTitle, String targetUrl,
		String beforeData, String afterData) {

		if (auditLogId <= 0) {
			return;
		}

		try {
			String sanitizedBeforeData = _sanitize(beforeData);
			String sanitizedAfterData = _sanitize(afterData);

			_auditLogRepository.updateSuccess(
				auditLogId, classPK, targetTitle, targetUrl,
				sanitizedAfterData,
				_auditDiffService.diffJson(
					sanitizedBeforeData, sanitizedAfterData),
				new Date());
		}
		catch (Exception exception) {
			_log.error(
				"Unable to update successful audit log " + auditLogId, exception);
		}
	}

	public int count(AuditLogQuery auditLogQuery) throws Exception {
		return _auditLogRepository.count(auditLogQuery);
	}

	public AuditLogEntry findById(long auditLogId) throws Exception {
		return _auditLogRepository.findById(auditLogId);
	}

	public void logSuccess(
		AuditActionType auditActionType, AuditTargetType auditTargetType,
		String className, String classPK, String targetTitle, String targetUrl,
		String beforeData, String afterData, ServiceContext serviceContext) {

		long auditLogId = startPending(
			auditActionType, auditTargetType, className, classPK, targetTitle,
			targetUrl, beforeData, serviceContext);

		completeSuccess(
			auditLogId, classPK, targetTitle, targetUrl, beforeData, afterData);
	}

	public List<AuditLogEntry> search(AuditLogQuery auditLogQuery)
		throws Exception {

		return _auditLogRepository.search(auditLogQuery);
	}

	public long startPending(
		AuditActionType auditActionType, AuditTargetType auditTargetType,
		String className, String classPK, String targetTitle, String targetUrl,
		String beforeData, ServiceContext serviceContext) {

		return startPending(
			auditActionType, auditTargetType, className, classPK, targetTitle,
			targetUrl, beforeData, serviceContext, null, null, null, null);
	}

	public long startPending(
		AuditActionType auditActionType, AuditTargetType auditTargetType,
		String className, String classPK, String targetTitle, String targetUrl,
		String beforeData, ServiceContext serviceContext, String pid,
		String factoryPid, String scope, String changedKeys) {

		try {
			AuditContextService.AuditContext auditContext =
				_auditContextService.build(serviceContext);
			AuditLogEntry auditLogEntry = new AuditLogEntry();

			auditLogEntry.setCompanyId(auditContext.getCompanyId());
			auditLogEntry.setGroupId(auditContext.getGroupId());
			auditLogEntry.setSiteName(auditContext.getSiteName());
			auditLogEntry.setUserId(auditContext.getUserId());
			auditLogEntry.setUserName(auditContext.getUserName());
			auditLogEntry.setUserEmail(auditContext.getUserEmail());
			auditLogEntry.setActionType(auditActionType.name());
			auditLogEntry.setTargetType(auditTargetType.name());
			auditLogEntry.setClassName(className);
			auditLogEntry.setClassPK(classPK);
			auditLogEntry.setPid(pid);
			auditLogEntry.setFactoryPid(factoryPid);
			auditLogEntry.setScope(scope);
			auditLogEntry.setChangedKeys(_sanitize(changedKeys));
			auditLogEntry.setTargetTitle(targetTitle);
			auditLogEntry.setTargetUrl(targetUrl);
			auditLogEntry.setBeforeData(_sanitize(beforeData));
			auditLogEntry.setAfterData(null);
			auditLogEntry.setDiffData(null);
			auditLogEntry.setRequestUri(auditContext.getRequestUri());
			auditLogEntry.setIpAddress(auditContext.getIpAddress());
			auditLogEntry.setUserAgent(auditContext.getUserAgent());
			auditLogEntry.setSessionId(auditContext.getSessionId());
			auditLogEntry.setStatus(AuditStatus.PENDING.name());
			auditLogEntry.setErrorMessage(null);
			auditLogEntry.setCreateDate(new Date());
			auditLogEntry.setCompletedDate(null);

			return _auditLogRepository.insertPending(auditLogEntry);
		}
		catch (Exception exception) {
			_log.error("Unable to insert pending audit log", exception);

			return 0;
		}
	}

	private String _toErrorMessage(Throwable throwable) {
		if (throwable == null) {
			return null;
		}

		try (StringWriter stringWriter = new StringWriter();
			PrintWriter printWriter = new PrintWriter(stringWriter)) {

			throwable.printStackTrace(printWriter);

			return AuditJsonUtil.truncate(stringWriter.toString(), 8000);
		}
		catch (Exception exception) {
			return throwable.toString();
		}
	}

	private String _sanitize(String value) {
		return AuditSanitizer.sanitizeJson(AuditJsonUtil.normalizeJson(value));
	}

	private static final Log _log = LogFactoryUtil.getLog(
		AuditLogService.class);

	@Reference
	private AuditContextService _auditContextService;

	@Reference
	private AuditDiffService _auditDiffService;

	@Reference
	private AuditLogRepository _auditLogRepository;

}
