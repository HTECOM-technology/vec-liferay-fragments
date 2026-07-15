package vn.vec.custom.admin.HookTollReconciliation.auth;

import vn.vec.custom.admin.HookTollReconciliation.HookConstants;

public class AuthenticationResult {

	public static AuthenticationResult failure(
		int httpStatus, String errorCode, String message) {

		return new AuthenticationResult(
			false, httpStatus, errorCode, message, null);
	}

	public static AuthenticationResult success(
		HookConstants.Partner partner) {

		return new AuthenticationResult(true, 200, null, null, partner);
	}

	public String getErrorCode() {
		return _errorCode;
	}

	public int getHttpStatus() {
		return _httpStatus;
	}

	public String getMessage() {
		return _message;
	}

	public HookConstants.Partner getPartner() {
		return _partner;
	}

	public boolean isSuccess() {
		return _success;
	}

	private AuthenticationResult(
		boolean success, int httpStatus, String errorCode, String message,
		HookConstants.Partner partner) {

		_success = success;
		_httpStatus = httpStatus;
		_errorCode = errorCode;
		_message = message;
		_partner = partner;
	}

	private final String _errorCode;
	private final int _httpStatus;
	private final String _message;
	private final HookConstants.Partner _partner;
	private final boolean _success;
}
