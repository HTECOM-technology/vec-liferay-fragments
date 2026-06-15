package vn.vec.custom.admin.networkpolicy.model;

public class AdminNetworkPolicyInput {

	public String getDescription() {
		return _description;
	}

	public String getName() {
		return _name;
	}

	public String getNetworkAddress() {
		return _networkAddress;
	}

	public int getPriority() {
		return _priority;
	}

	public boolean isEnabled() {
		return _enabled;
	}

	public void setDescription(String description) {
		_description = description;
	}

	public void setEnabled(boolean enabled) {
		_enabled = enabled;
	}

	public void setName(String name) {
		_name = name;
	}

	public void setNetworkAddress(String networkAddress) {
		_networkAddress = networkAddress;
	}

	public void setPriority(int priority) {
		_priority = priority;
	}

	private String _description;
	private boolean _enabled;
	private String _name;
	private String _networkAddress;
	private int _priority = 100;

}
