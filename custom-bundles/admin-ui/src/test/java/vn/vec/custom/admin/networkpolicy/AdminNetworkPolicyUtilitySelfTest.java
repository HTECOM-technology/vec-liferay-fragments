package vn.vec.custom.admin.networkpolicy;

import java.util.Arrays;

import vn.vec.custom.admin.networkpolicy.filter.AdminNetworkPolicyFilterConfiguration;
import vn.vec.custom.admin.networkpolicy.filter.AdminNetworkPolicyUrlMatcher;
import vn.vec.custom.admin.networkpolicy.util.IPv4NetworkUtil;

public class AdminNetworkPolicyUtilitySelfTest {

	public static void main(String[] args) {
		_assertTrue(
			IPv4NetworkUtil.isValidSingleIp("203.113.10.20"),
			"valid IPv4 single IP");
		_assertFalse(
			IPv4NetworkUtil.isValidSingleIp("203.113.10.999"),
			"invalid IPv4 single IP");
		_assertTrue(
			IPv4NetworkUtil.isValidCidr("192.168.1.0/24"),
			"valid IPv4 CIDR");
		_assertFalse(
			IPv4NetworkUtil.isValidCidr("192.168.1.0/33"),
			"invalid IPv4 CIDR prefix");
		_assertTrue(
			IPv4NetworkUtil.contains("10.0.0.0/8", "10.20.30.40"),
			"IP inside CIDR");
		_assertFalse(
			IPv4NetworkUtil.contains("10.0.0.0/8", "172.16.0.10"),
			"IP outside CIDR");
		_assertEquals(
			"192.168.1.0/24",
			IPv4NetworkUtil.normalize("192.168.1.12/24"),
			"canonical CIDR");

		AdminNetworkPolicyUrlMatcher matcher =
			new AdminNetworkPolicyUrlMatcher();

		_assertTrue(
			matcher.isProtected(
				"/group/guest/~/control_panel/manage",
				Arrays.asList(
					AdminNetworkPolicyFilterConfiguration.DEFAULT_PROTECTED_URL_PATTERNS),
				Arrays.asList(
					AdminNetworkPolicyFilterConfiguration.DEFAULT_EXCLUDED_URL_PATTERNS)),
			"protected Control Panel URL");
		_assertFalse(
			matcher.isProtected(
				"/o/vec-custom-admin-ui/admin-network-policy/index.js",
				Arrays.asList(
					AdminNetworkPolicyFilterConfiguration.DEFAULT_PROTECTED_URL_PATTERNS),
				Arrays.asList(
					AdminNetworkPolicyFilterConfiguration.DEFAULT_EXCLUDED_URL_PATTERNS)),
			"excluded static resource");
	}

	private static void _assertFalse(boolean value, String label) {
		if (value) {
			throw new AssertionError(label);
		}
	}

	private static void _assertEquals(
		String expectedValue, String actualValue, String label) {

		if (!expectedValue.equals(actualValue)) {
			throw new AssertionError(
				label + ": expected " + expectedValue + " but got " + actualValue);
		}
	}

	private static void _assertTrue(boolean value, String label) {
		if (!value) {
			throw new AssertionError(label);
		}
	}

}
