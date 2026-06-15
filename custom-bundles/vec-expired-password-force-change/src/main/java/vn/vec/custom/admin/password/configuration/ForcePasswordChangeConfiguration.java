package vn.vec.custom.admin.password.configuration;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;

public class ForcePasswordChangeConfiguration {

	public static ForcePasswordChangeConfiguration fromProperties(
		Map<String, Object> properties) {

		ForcePasswordChangeConfiguration configuration =
			new ForcePasswordChangeConfiguration();

		configuration._enabled = _booleanValue(properties, "enabled", false);
		configuration._changePasswordURL = _stringValue(
			properties, "changePasswordURL",
			DEFAULT_CHANGE_PASSWORD_URL);
		configuration._excludedPathPatterns = _stringList(
			properties, "excludedPathPatterns",
			DEFAULT_EXCLUDED_PATH_PATTERNS);
		configuration._includeOmniAdmin = _booleanValue(
			properties, "includeOmniAdmin", false);
		configuration._checkOnEveryRequest = _booleanValue(
			properties, "checkOnEveryRequest", true);
		configuration._logDeniedNavigation = _booleanValue(
			properties, "logDeniedNavigation", true);

		return configuration;
	}

	public String getChangePasswordURL() {
		return _changePasswordURL;
	}

	public List<String> getExcludedPathPatterns() {
		return _excludedPathPatterns;
	}

	public boolean isCheckOnEveryRequest() {
		return _checkOnEveryRequest;
	}

	public boolean isEnabled() {
		return _enabled;
	}

	public boolean isIncludeOmniAdmin() {
		return _includeOmniAdmin;
	}

	public boolean isLogDeniedNavigation() {
		return _logDeniedNavigation;
	}

	public static final String DEFAULT_CHANGE_PASSWORD_URL =
		"/c/portal/update_password";

	public static final String[] DEFAULT_EXCLUDED_PATH_PATTERNS = {
		"/c/portal/login",
		"/c/portal/logout",
		"/c/portal/update_password",
		"/c/portal/update_password/*",
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
		"*.eot",
		"*.otf"
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

	private static String _stringValue(
		Map<String, Object> properties, String key, String defaultValue) {

		if ((properties == null) || !properties.containsKey(key)) {
			return defaultValue;
		}

		Object value = properties.get(key);

		if ((value == null) || String.valueOf(value).trim().isEmpty()) {
			return defaultValue;
		}

		return String.valueOf(value).trim();
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

	private String _changePasswordURL = DEFAULT_CHANGE_PASSWORD_URL;
	private boolean _checkOnEveryRequest = true;
	private boolean _enabled;
	private List<String> _excludedPathPatterns = new ArrayList<>();
	private boolean _includeOmniAdmin;
	private boolean _logDeniedNavigation = true;

}
