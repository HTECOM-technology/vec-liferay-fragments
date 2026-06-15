package vn.vec.custom.admin.networkpolicy.service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.networkpolicy.model.AdminNetworkPolicy;

@Component(service = AdminNetworkPolicyCache.class)
public class AdminNetworkPolicyCache {

	public void clear() {
		_enabledPolicies.clear();
	}

	public void clear(long companyId) {
		_enabledPolicies.remove(companyId);
	}

	public List<AdminNetworkPolicy> get(long companyId) {
		return _enabledPolicies.get(companyId);
	}

	public void put(long companyId, List<AdminNetworkPolicy> policies) {
		_enabledPolicies.put(companyId, Collections.unmodifiableList(policies));
	}

	private final ConcurrentMap<Long, List<AdminNetworkPolicy>> _enabledPolicies =
		new ConcurrentHashMap<>();

}
