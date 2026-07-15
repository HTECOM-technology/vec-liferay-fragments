package vn.vec.custom.admin.HookTollReconciliation.model;

public class HookRequestLog {

	public boolean isAuthOk() {
		return _authOk;
	}

	public void setAuthOk(boolean authOk) {
		_authOk = authOk;
	}

	public int getBodySize() {
		return _bodySize;
	}

	public void setBodySize(int bodySize) {
		_bodySize = bodySize;
	}

	public String getClientId() {
		return _clientId;
	}

	public void setClientId(String clientId) {
		_clientId = clientId;
	}

	public String getErrorCode() {
		return _errorCode;
	}

	public void setErrorCode(String errorCode) {
		_errorCode = errorCode;
	}

	public String getErrorMessage() {
		return _errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		_errorMessage = errorMessage;
	}

	public String getExternalId() {
		return _externalId;
	}

	public void setExternalId(String externalId) {
		_externalId = externalId;
	}

	public int getHttpStatus() {
		return _httpStatus;
	}

	public void setHttpStatus(int httpStatus) {
		_httpStatus = httpStatus;
	}

	public String getRawBody() {
		return _rawBody;
	}

	public void setRawBody(String rawBody) {
		_rawBody = rawBody;
	}

	public String getRecordType() {
		return _recordType;
	}

	public void setRecordType(String recordType) {
		_recordType = recordType;
	}

	public String getRemoteIp() {
		return _remoteIp;
	}

	public void setRemoteIp(String remoteIp) {
		_remoteIp = remoteIp;
	}

	public String getResultAction() {
		return _resultAction;
	}

	public void setResultAction(String resultAction) {
		_resultAction = resultAction;
	}

	public String getSourceSystem() {
		return _sourceSystem;
	}

	public void setSourceSystem(String sourceSystem) {
		_sourceSystem = sourceSystem;
	}

	public String getTransId() {
		return _transId;
	}

	public void setTransId(String transId) {
		_transId = transId;
	}

	private boolean _authOk;
	private int _bodySize;
	private String _clientId;
	private String _errorCode;
	private String _errorMessage;
	private String _externalId;
	private int _httpStatus;
	private String _rawBody;
	private String _recordType;
	private String _remoteIp;
	private String _resultAction;
	private String _sourceSystem;
	private String _transId;
}
