package vn.vec.custom.admin.networkpolicy.service;

import java.util.ArrayList;
import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.networkpolicy.model.AdminNetworkPolicy;
import vn.vec.custom.admin.networkpolicy.model.AdminNetworkPolicyInput;
import vn.vec.custom.admin.networkpolicy.persistence.AdminNetworkPolicyRepository;
import vn.vec.custom.admin.networkpolicy.util.IPv4NetworkUtil;

@Component(service = AdminNetworkPolicyService.class)
public class AdminNetworkPolicyService {

	public AdminNetworkPolicy addAdminNetworkPolicy(
			long companyId, long userId, String userName,
			AdminNetworkPolicyInput input)
		throws Exception {

		_validateInput(companyId, input, 0);

		AdminNetworkPolicy policy = new AdminNetworkPolicy();

		policy.setCompanyId(companyId);
		policy.setName(_trim(input.getName()));
		policy.setNetworkAddress(IPv4NetworkUtil.normalize(input.getNetworkAddress()));
		policy.setNetworkType(
			IPv4NetworkUtil.detectNetworkType(policy.getNetworkAddress()));
		policy.setEnabled(input.isEnabled());
		policy.setDescription(_trimToNull(input.getDescription()));
		policy.setPriority(input.getPriority());
		policy.setUserId(userId);
		policy.setUserName(userName);
		policy.setLastModifiedByUserId(userId);
		policy.setLastModifiedByUserName(userName);

		AdminNetworkPolicy addedPolicy = _repository.insert(policy);

		_cache.clear(companyId);

		return addedPolicy;
	}

	public int count(long companyId, String keyword) throws Exception {
		return _repository.count(companyId, keyword);
	}

	public void deleteAdminNetworkPolicy(long companyId, long policyId)
		throws Exception {

		AdminNetworkPolicy policy = _repository.fetch(policyId);

		if ((policy == null) || (policy.getCompanyId() != companyId)) {
			throw new IllegalArgumentException("Policy not found.");
		}

		_repository.delete(policyId);
		_cache.clear(companyId);
	}

	public AdminNetworkPolicy fetch(long companyId, long policyId)
		throws Exception {

		AdminNetworkPolicy policy = _repository.fetch(policyId);

		if ((policy == null) || (policy.getCompanyId() != companyId)) {
			return null;
		}

		return policy;
	}

	public List<AdminNetworkPolicy> getEnabledPolicies(long companyId)
		throws Exception {

		List<AdminNetworkPolicy> policies = _cache.get(companyId);

		if (policies != null) {
			return policies;
		}

		policies = _repository.getEnabled(companyId);
		_cache.put(companyId, new ArrayList<>(policies));

		return policies;
	}

	public boolean isClientAllowed(long companyId, String clientIp)
		throws Exception {

		if (!IPv4NetworkUtil.isValidSingleIp(clientIp)) {
			return false;
		}

		for (AdminNetworkPolicy policy : getEnabledPolicies(companyId)) {
			if (IPv4NetworkUtil.contains(policy.getNetworkAddress(), clientIp)) {
				return true;
			}
		}

		return false;
	}

	public List<AdminNetworkPolicy> search(
			long companyId, String keyword, int page, int pageSize)
		throws Exception {

		int normalizedPage = Math.max(1, page);
		int normalizedPageSize = Math.max(1, Math.min(pageSize, 200));
		int start = (normalizedPage - 1) * normalizedPageSize;

		return _repository.search(
			companyId, keyword, start, start + normalizedPageSize);
	}

	public AdminNetworkPolicy setEnabled(
			long companyId, long policyId, boolean enabled, long userId,
			String userName)
		throws Exception {

		AdminNetworkPolicy policy = fetch(companyId, policyId);

		if (policy == null) {
			throw new IllegalArgumentException("Policy not found.");
		}

		AdminNetworkPolicyInput input = new AdminNetworkPolicyInput();

		input.setName(policy.getName());
		input.setNetworkAddress(policy.getNetworkAddress());
		input.setDescription(policy.getDescription());
		input.setPriority(policy.getPriority());
		input.setEnabled(enabled);

		return updateAdminNetworkPolicy(
			companyId, policyId, userId, userName, input);
	}

	public AdminNetworkPolicy updateAdminNetworkPolicy(
			long companyId, long policyId, long userId, String userName,
			AdminNetworkPolicyInput input)
		throws Exception {

		AdminNetworkPolicy policy = fetch(companyId, policyId);

		if (policy == null) {
			throw new IllegalArgumentException("Policy not found.");
		}

		_validateInput(companyId, input, policyId);

		policy.setName(_trim(input.getName()));
		policy.setNetworkAddress(IPv4NetworkUtil.normalize(input.getNetworkAddress()));
		policy.setNetworkType(
			IPv4NetworkUtil.detectNetworkType(policy.getNetworkAddress()));
		policy.setEnabled(input.isEnabled());
		policy.setDescription(_trimToNull(input.getDescription()));
		policy.setPriority(input.getPriority());
		policy.setLastModifiedByUserId(userId);
		policy.setLastModifiedByUserName(userName);

		AdminNetworkPolicy updatedPolicy = _repository.update(policy);

		_cache.clear(companyId);

		return updatedPolicy;
	}

	public String validateNetworkAddress(String networkAddress) {
		String normalizedAddress = IPv4NetworkUtil.normalize(networkAddress);

		if (normalizedAddress.isEmpty()) {
			return "Network address must not be empty.";
		}

		if (!IPv4NetworkUtil.isValidNetworkAddress(normalizedAddress)) {
			return "Only IPv4 single IP or IPv4 CIDR is supported.";
		}

		return null;
	}

	private String _trim(String value) {
		if (value == null) {
			return "";
		}

		return value.trim();
	}

	private String _trimToNull(String value) {
		String trimmedValue = _trim(value);

		if (trimmedValue.isEmpty()) {
			return null;
		}

		return trimmedValue;
	}

	private void _validateInput(
			long companyId, AdminNetworkPolicyInput input, long excludedPolicyId)
		throws Exception {

		if (companyId <= 0) {
			throw new IllegalArgumentException("Company context is required.");
		}

		if ((input == null) || _trim(input.getName()).isEmpty()) {
			throw new IllegalArgumentException("Name must not be empty.");
		}

		if ((input.getPriority() < 0) || (input.getPriority() > 999999)) {
			throw new IllegalArgumentException(
				"Priority must be between 0 and 999999.");
		}

		String networkAddress = IPv4NetworkUtil.normalize(
			input.getNetworkAddress());
		String validationMessage = validateNetworkAddress(networkAddress);

		if (validationMessage != null) {
			throw new IllegalArgumentException(validationMessage);
		}

		if (_repository.hasDuplicate(
				companyId, networkAddress, input.isEnabled(), excludedPolicyId)) {

			throw new IllegalArgumentException(
				"A policy with the same company, network address and enabled " +
					"state already exists.");
		}
	}

	@Reference
	private AdminNetworkPolicyCache _cache;

	@Reference
	private AdminNetworkPolicyRepository _repository;

}
