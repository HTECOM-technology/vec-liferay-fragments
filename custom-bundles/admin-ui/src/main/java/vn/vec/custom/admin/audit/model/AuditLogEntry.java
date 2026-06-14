package vn.vec.custom.admin.audit.model;

import java.util.Date;

public class AuditLogEntry {

	public String getActionType() {
		return _actionType;
	}

	public long getAuditLogId() {
		return _auditLogId;
	}

	public String getAfterData() {
		return _afterData;
	}

	public String getBeforeData() {
		return _beforeData;
	}

	public String getClassName() {
		return _className;
	}

	public String getClassPK() {
		return _classPK;
	}

	public long getCompanyId() {
		return _companyId;
	}

	public Date getCompletedDate() {
		return _completedDate;
	}

	public Date getCreateDate() {
		return _createDate;
	}

	public String getDiffData() {
		return _diffData;
	}

	public String getErrorMessage() {
		return _errorMessage;
	}

	public String getFactoryPid() {
		return _factoryPid;
	}

	public long getGroupId() {
		return _groupId;
	}

	public String getChangedKeys() {
		return _changedKeys;
	}

	public String getIpAddress() {
		return _ipAddress;
	}

	public String getPid() {
		return _pid;
	}

	public String getRequestUri() {
		return _requestUri;
	}

	public String getSessionId() {
		return _sessionId;
	}

	public String getSiteName() {
		return _siteName;
	}

	public String getStatus() {
		return _status;
	}

	public String getScope() {
		return _scope;
	}

	public String getTargetTitle() {
		return _targetTitle;
	}

	public String getTargetType() {
		return _targetType;
	}

	public String getTargetUrl() {
		return _targetUrl;
	}

	public String getUserAgent() {
		return _userAgent;
	}

	public String getUserEmail() {
		return _userEmail;
	}

	public long getUserId() {
		return _userId;
	}

	public String getUserName() {
		return _userName;
	}

	public void setActionType(String actionType) {
		_actionType = actionType;
	}

	public void setAfterData(String afterData) {
		_afterData = afterData;
	}

	public void setAuditLogId(long auditLogId) {
		_auditLogId = auditLogId;
	}

	public void setBeforeData(String beforeData) {
		_beforeData = beforeData;
	}

	public void setClassName(String className) {
		_className = className;
	}

	public void setClassPK(String classPK) {
		_classPK = classPK;
	}

	public void setCompanyId(long companyId) {
		_companyId = companyId;
	}

	public void setCompletedDate(Date completedDate) {
		_completedDate = completedDate;
	}

	public void setCreateDate(Date createDate) {
		_createDate = createDate;
	}

	public void setDiffData(String diffData) {
		_diffData = diffData;
	}

	public void setErrorMessage(String errorMessage) {
		_errorMessage = errorMessage;
	}

	public void setFactoryPid(String factoryPid) {
		_factoryPid = factoryPid;
	}

	public void setGroupId(long groupId) {
		_groupId = groupId;
	}

	public void setChangedKeys(String changedKeys) {
		_changedKeys = changedKeys;
	}

	public void setIpAddress(String ipAddress) {
		_ipAddress = ipAddress;
	}

	public void setPid(String pid) {
		_pid = pid;
	}

	public void setRequestUri(String requestUri) {
		_requestUri = requestUri;
	}

	public void setSessionId(String sessionId) {
		_sessionId = sessionId;
	}

	public void setSiteName(String siteName) {
		_siteName = siteName;
	}

	public void setStatus(String status) {
		_status = status;
	}

	public void setScope(String scope) {
		_scope = scope;
	}

	public void setTargetTitle(String targetTitle) {
		_targetTitle = targetTitle;
	}

	public void setTargetType(String targetType) {
		_targetType = targetType;
	}

	public void setTargetUrl(String targetUrl) {
		_targetUrl = targetUrl;
	}

	public void setUserAgent(String userAgent) {
		_userAgent = userAgent;
	}

	public void setUserEmail(String userEmail) {
		_userEmail = userEmail;
	}

	public void setUserId(long userId) {
		_userId = userId;
	}

	public void setUserName(String userName) {
		_userName = userName;
	}

	private String _actionType;
	private String _afterData;
	private long _auditLogId;
	private String _beforeData;
	private String _className;
	private String _classPK;
	private long _companyId;
	private Date _completedDate;
	private Date _createDate;
	private String _changedKeys;
	private String _diffData;
	private String _errorMessage;
	private String _factoryPid;
	private long _groupId;
	private String _ipAddress;
	private String _pid;
	private String _requestUri;
	private String _scope;
	private String _sessionId;
	private String _siteName;
	private String _status;
	private String _targetTitle;
	private String _targetType;
	private String _targetUrl;
	private String _userAgent;
	private String _userEmail;
	private long _userId;
	private String _userName;

}
