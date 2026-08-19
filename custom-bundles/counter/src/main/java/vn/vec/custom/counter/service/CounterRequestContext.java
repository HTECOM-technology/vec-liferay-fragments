package vn.vec.custom.counter.service;

/**
 * Thông tin đã chuẩn hoá của một request tới counter API: company, site,
 * người dùng và khoá định danh visitor.
 */
public class CounterRequestContext {

	public CounterRequestContext(
		long companyId, long groupId, long userId, String visitorKey,
		String currentPath) {

		_companyId = companyId;
		_groupId = groupId;
		_userId = userId;
		_visitorKey = visitorKey;
		_currentPath = currentPath;
	}

	public long getCompanyId() {
		return _companyId;
	}

	public String getCurrentPath() {
		return _currentPath;
	}

	public long getGroupId() {
		return _groupId;
	}

	public long getUserId() {
		return _userId;
	}

	/** Chuỗi hex 64 ký tự (SHA-256), không chứa dữ liệu cá nhân dạng thô. */
	public String getVisitorKey() {
		return _visitorKey;
	}

	private final long _companyId;
	private final String _currentPath;
	private final long _groupId;
	private final long _userId;
	private final String _visitorKey;

}
