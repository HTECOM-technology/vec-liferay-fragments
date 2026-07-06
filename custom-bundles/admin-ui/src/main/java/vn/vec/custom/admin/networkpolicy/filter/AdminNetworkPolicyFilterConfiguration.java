package vn.vec.custom.admin.networkpolicy.filter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class AdminNetworkPolicyFilterConfiguration {

	public static AdminNetworkPolicyFilterConfiguration fromProperties(
		Map<String, Object> properties) {

		AdminNetworkPolicyFilterConfiguration configuration =
			new AdminNetworkPolicyFilterConfiguration();

		configuration._allowWhenNoPolicy = _booleanValue(
			properties, "allowWhenNoPolicy", true);
		configuration._enabled = _booleanValue(properties, "enabled", false);
		configuration._failClosed = _booleanValue(properties, "failClosed", false);
		configuration._excludedUrlPatterns = _stringList(
			properties, "excludedUrlPatterns", DEFAULT_EXCLUDED_URL_PATTERNS);
		configuration._protectedUrlPatterns = _stringList(
			properties, "protectedUrlPatterns", DEFAULT_PROTECTED_URL_PATTERNS);
		configuration._trustedProxyCidrs = _stringList(
			properties, "trustedProxyCidrs", new String[0]);

		return configuration;
	}

	public List<String> getExcludedUrlPatterns() {
		return _excludedUrlPatterns;
	}

	public List<String> getProtectedUrlPatterns() {
		return _protectedUrlPatterns;
	}

	public List<String> getTrustedProxyCidrs() {
		return _trustedProxyCidrs;
	}

	public boolean isAllowWhenNoPolicy() {
		return _allowWhenNoPolicy;
	}

	public boolean isEnabled() {
		return _enabled;
	}

	public boolean isFailClosed() {
		return _failClosed;
	}

	public static final String[] DEFAULT_EXCLUDED_URL_PATTERNS = {
		"/c/portal/login",
		"/c/portal/logout",
		"/c/portal/favicon",
		"*.css",
		"*.js",
		"*.map",
		"*.png",
		"*.jpg",
		"*.jpeg",
		"*.gif",
		"*.svg",
		"*.ico",
		"*.woff",
		"*.woff2",
		"*.ttf",
		"*.eot"
	};

	public static final String[] DEFAULT_PROTECTED_URL_PATTERNS = {
		"/group/*/~/control_panel/*",
		"/group/control_panel/*",
		"/c/portal/layout",
		"/api/jsonws/*",
		"/api/json/*",
		"/c/portal/json_service/*",
		"/api/liferay/do",
		"/o/vec-admin/*",
		"/o/vec-custom-admin-ui/admin-network-policy/*"
	};

	private static boolean _booleanValue(
		Map<String, Object> properties, String key, boolean defaultValue) {

		if ((properties == null) || !properties.containsKey(key)) {
			return defaultValue;
		}

		Object value = properties.get(key);

		if (value instanceof Boolean) {
			return (Boolean)value;
		}

		if (value == null) {
			return defaultValue;
		}

		return Boolean.parseBoolean(String.valueOf(value));
	}

	private static List<String> _stringList(
		Map<String, Object> properties, String key, String[] defaultValues) {

		Object value = (properties == null) ? null : properties.get(key);
		List<String> values = new ArrayList<>();

		if (value == null) {
			values.addAll(Arrays.asList(defaultValues));

			return values;
		}

		if (value instanceof String[]) {
			for (String item : (String[])value) {
				_add(values, item);
			}
		}
		else if (value instanceof Collection<?>) {
			for (Object item : (Collection<?>)value) {
				_add(values, String.valueOf(item));
			}
		}
		else {
			String stringValue = String.valueOf(value);
			String[] parts = stringValue.split("[,\\n\\r]+");

			for (String part : parts) {
				_add(values, part);
			}
		}

		return values;
	}

	private static void _add(List<String> values, String value) {
		if ((value != null) && !value.trim().isEmpty()) {
			values.add(value.trim());
		}
	}

	private boolean _allowWhenNoPolicy = true;
	private boolean _enabled;
	private List<String> _excludedUrlPatterns = new ArrayList<>();
	private boolean _failClosed;
	private List<String> _protectedUrlPatterns = new ArrayList<>();
	private List<String> _trustedProxyCidrs = new ArrayList<>();

}
