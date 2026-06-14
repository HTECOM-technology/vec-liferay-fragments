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

				jsonObject = _sanitizeObject(jsonObject);

				return jsonObject.toString();
			}

			if (trimmed.startsWith("[")) {
				JSONArray jsonArray = JSONFactoryUtil.createJSONArray(trimmed);

				jsonArray = _sanitizeArray(jsonArray);

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

	private static JSONArray _sanitizeArray(JSONArray jsonArray) {
		JSONArray sanitizedArray = JSONFactoryUtil.createJSONArray();

		for (int i = 0; i < jsonArray.length(); i++) {
			Object value = jsonArray.get(i);

			if (value instanceof JSONObject) {
				sanitizedArray.put(_sanitizeObject((JSONObject)value));
			}
			else if (value instanceof JSONArray) {
				sanitizedArray.put(_sanitizeArray((JSONArray)value));
			}
			else if ((value != null) && _isSensitiveKey(String.valueOf(value))) {
				sanitizedArray.put(_MASKED_VALUE);
			}
			else {
				sanitizedArray.put(value);
			}
		}

		return sanitizedArray;
	}

	private static JSONObject _sanitizeObject(JSONObject jsonObject) {
		JSONObject sanitizedObject = JSONFactoryUtil.createJSONObject();

		for (String key : jsonObject.keySet()) {
			Object value = jsonObject.get(key);

			if (_isSensitiveKey(key)) {
				sanitizedObject.put(key, _MASKED_VALUE);

				continue;
			}

			if (value instanceof JSONObject) {
				sanitizedObject.put(key, _sanitizeObject((JSONObject)value));
			}
			else if (value instanceof JSONArray) {
				sanitizedObject.put(key, _sanitizeArray((JSONArray)value));
			}
			else {
				sanitizedObject.put(key, value);
			}
		}

		return sanitizedObject;
	}

	private static final String _MASKED_VALUE = "******MASKED******";

	private static final Set<String> _SENSITIVE_KEYS = new HashSet<>(
		Arrays.asList(
			"password", "secret", "token", "accesskey", "refreshtoken",
			"clientsecret", "privatekey", "authorization", "cookie"));

}
