package vn.vec.custom.admin.networkpolicy.model;

import java.util.Date;

public class AdminNetworkPolicy {

	public long getCompanyId() {
		return _companyId;
	}

	public Date getCreateDate() {
		return _createDate;
	}

	public String getDescription() {
		return _description;
	}

	public long getLastModifiedByUserId() {
		return _lastModifiedByUserId;
	}

	public String getLastModifiedByUserName() {
		return _lastModifiedByUserName;
	}

	public Date getModifiedDate() {
		return _modifiedDate;
	}

	public String getName() {
		return _name;
	}

	public String getNetworkAddress() {
		return _networkAddress;
	}

	public String getNetworkType() {
		return _networkType;
	}

	public long getPolicyId() {
		return _policyId;
	}

	public int getPriority() {
		return _priority;
	}

	public long getUserId() {
		return _userId;
	}

	public String getUserName() {
		return _userName;
	}

	public boolean isEnabled() {
		return _enabled;
	}

	public void setCompanyId(long companyId) {
		_companyId = companyId;
	}

	public void setCreateDate(Date createDate) {
		_createDate = createDate;
	}

	public void setDescription(String description) {
		_description = description;
	}

	public void setEnabled(boolean enabled) {
		_enabled = enabled;
	}

	public void setLastModifiedByUserId(long lastModifiedByUserId) {
		_lastModifiedByUserId = lastModifiedByUserId;
	}

	public void setLastModifiedByUserName(String lastModifiedByUserName) {
		_lastModifiedByUserName = lastModifiedByUserName;
	}

	public void setModifiedDate(Date modifiedDate) {
		_modifiedDate = modifiedDate;
	}

	public void setName(String name) {
		_name = name;
	}

	public void setNetworkAddress(String networkAddress) {
		_networkAddress = networkAddress;
	}

	public void setNetworkType(String networkType) {
		_networkType = networkType;
	}

	public void setPolicyId(long policyId) {
		_policyId = policyId;
	}

	public void setPriority(int priority) {
		_priority = priority;
	}

	public void setUserId(long userId) {
		_userId = userId;
	}

	public void setUserName(String userName) {
		_userName = userName;
	}

	private long _companyId;
	private Date _createDate;
	private String _description;
	private boolean _enabled;
	private long _lastModifiedByUserId;
	private String _lastModifiedByUserName;
	private Date _modifiedDate;
	private String _name;
	private String _networkAddress;
	private String _networkType;
	private long _policyId;
	private int _priority;
	private long _userId;
	private String _userName;

}
