package vn.vec.custom.admin.audit.util;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeSet;

public class AuditJsonUtil {

	public static Map<String, String> flatten(String json) {
		Map<String, String> values = new LinkedHashMap<>();

		if ((json == null) || json.trim().isEmpty()) {
			return values;
		}

		String trimmed = json.trim();

		try {
			if (trimmed.startsWith("{")) {
				_flattenObject("", JSONFactoryUtil.createJSONObject(trimmed), values);
			}
			else if (trimmed.startsWith("[")) {
				_flattenArray("", JSONFactoryUtil.createJSONArray(trimmed), values);
			}
			else {
				values.put("_value", trimmed);
			}
		}
		catch (Exception exception) {
			values.put("_raw", trimmed);
		}

		return values;
	}

	public static String hash(String value) {
		if (value == null) {
			return null;
		}

		try {
			MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
			byte[] bytes = messageDigest.digest(
				value.getBytes(StandardCharsets.UTF_8));
			StringBuilder stringBuilder = new StringBuilder(bytes.length * 2);

			for (byte currentByte : bytes) {
				stringBuilder.append(
					String.format("%02x", Integer.valueOf(currentByte & 0xff)));
			}

			return stringBuilder.toString();
		}
		catch (Exception exception) {
			return String.valueOf(value.hashCode());
		}
	}

	public static String normalizeJson(String value) {
		if ((value == null) || value.trim().isEmpty()) {
			return null;
		}

		String trimmed = value.trim();

		try {
			if (trimmed.startsWith("{")) {
				return JSONFactoryUtil.createJSONObject(trimmed).toString();
			}

			if (trimmed.startsWith("[")) {
				return JSONFactoryUtil.createJSONArray(trimmed).toString();
			}
		}
		catch (Exception exception) {
		}

		return trimmed;
	}

	public static JSONObject toJSONObject(String value) {
		if ((value == null) || value.trim().isEmpty()) {
			return JSONFactoryUtil.createJSONObject();
		}

		String trimmed = value.trim();

		try {
			if (trimmed.startsWith("{")) {
				return JSONFactoryUtil.createJSONObject(trimmed);
			}

			if (trimmed.startsWith("[")) {
				JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

				jsonObject.put("_array", JSONFactoryUtil.createJSONArray(trimmed));

				return jsonObject;
			}
		}
		catch (Exception exception) {
		}

		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("_raw", trimmed);

		return jsonObject;
	}

	public static JSONArray toJSONArray(String value) {
		if ((value == null) || value.trim().isEmpty()) {
			return JSONFactoryUtil.createJSONArray();
		}

		String trimmed = value.trim();

		try {
			if (trimmed.startsWith("[")) {
				return JSONFactoryUtil.createJSONArray(trimmed);
			}
		}
		catch (Exception exception) {
		}

		JSONArray jsonArray = JSONFactoryUtil.createJSONArray();

		jsonArray.put(trimmed);

		return jsonArray;
	}

	public static String toJsonString(Object value) {
		if (value == null) {
			return null;
		}

		if ((value instanceof JSONObject) || (value instanceof JSONArray)) {
			return value.toString();
		}

		return JSONFactoryUtil.looseSerializeDeep(value);
	}

	public static String truncate(String value, int maxLength) {
		if ((value == null) || (value.length() <= maxLength) || (maxLength < 0)) {
			return value;
		}

		return value.substring(0, maxLength) + "...(truncated)";
	}

	public static TreeSet<String> unionKeys(
		Map<String, String> beforeValues, Map<String, String> afterValues) {

		TreeSet<String> keys = new TreeSet<>();

		keys.addAll(beforeValues.keySet());
		keys.addAll(afterValues.keySet());

		return keys;
	}

	private static void _flattenArray(
		String path, JSONArray jsonArray, Map<String, String> values) {

		for (int i = 0; i < jsonArray.length(); i++) {
			Object value = jsonArray.get(i);
			String childPath = path + "[" + i + "]";

			_flattenValue(childPath, value, values);
		}
	}

	private static void _flattenObject(
		String path, JSONObject jsonObject, Map<String, String> values) {

		for (String key : jsonObject.keySet()) {
			Object value = jsonObject.get(key);
			String childPath = path.isEmpty() ? key : path + "." + key;

			_flattenValue(childPath, value, values);
		}
	}

	private static void _flattenValue(
		String path, Object value, Map<String, String> values) {

		if (value instanceof JSONObject) {
			_flattenObject(path, (JSONObject)value, values);

			return;
		}

		if (value instanceof JSONArray) {
			_flattenArray(path, (JSONArray)value, values);

			return;
		}

		values.put(path, String.valueOf(value));
	}

}
