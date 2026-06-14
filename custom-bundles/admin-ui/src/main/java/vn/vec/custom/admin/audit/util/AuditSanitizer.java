package vn.vec.custom.admin.audit.util;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

public class AuditSanitizer {

	public static String sanitizeJson(String value) {
		if ((value == null) || value.trim().isEmpty()) {
			return value;
		}

		String trimmed = value.trim();

		try {
			if (trimmed.startsWith("{")) {
				JSONObject jsonObject = JSONFactoryUtil.createJSONObject(trimmed);

				_sanitizeObject(jsonObject);

				return jsonObject.toString();
			}

			if (trimmed.startsWith("[")) {
				JSONArray jsonArray = JSONFactoryUtil.createJSONArray(trimmed);

				_sanitizeArray(jsonArray);

				return jsonArray.toString();
			}
		}
		catch (Exception exception) {
		}

		return value;
	}

	private static boolean _isSensitiveKey(String key) {
		String lowerCaseKey = key.toLowerCase(Locale.ROOT);

		for (String sensitiveKey : _SENSITIVE_KEYS) {
			if (lowerCaseKey.contains(sensitiveKey)) {
				return true;
			}
		}

		return false;
	}

	private static void _sanitizeArray(JSONArray jsonArray) {
		for (int i = 0; i < jsonArray.length(); i++) {
			Object value = jsonArray.get(i);

			if (value instanceof JSONObject) {
				_sanitizeObject((JSONObject)value);
			}
			else if (value instanceof JSONArray) {
				_sanitizeArray((JSONArray)value);
			}
		}
	}

	private static void _sanitizeObject(JSONObject jsonObject) {
		for (String key : jsonObject.keySet()) {
			Object value = jsonObject.get(key);

			if (_isSensitiveKey(key)) {
				jsonObject.put(key, _MASKED_VALUE);

				continue;
			}

			if (value instanceof JSONObject) {
				_sanitizeObject((JSONObject)value);
			}
			else if (value instanceof JSONArray) {
				_sanitizeArray((JSONArray)value);
			}
		}
	}

	private static final String _MASKED_VALUE = "******MASKED******";

	private static final Set<String> _SENSITIVE_KEYS = new HashSet<>(
		Arrays.asList(
			"password", "secret", "token", "accesskey", "refreshtoken",
			"clientsecret", "privatekey", "authorization", "cookie"));

}
