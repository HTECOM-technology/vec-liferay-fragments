package vn.vec.custom.admin.audit.util;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;

import java.lang.reflect.Array;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Dictionary;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeSet;

public class AuditConfigurationUtil {

	public static String determineScope(Dictionary<String, Object> properties) {
		if (properties == null) {
			return "UNKNOWN";
		}

		if (_hasValue(properties, _GROUP_ID)) {
			return "GROUP";
		}

		if (_hasValue(properties, _COMPANY_ID)) {
			return "COMPANY";
		}

		if (_hasValue(properties, _PORTLET_INSTANCE_ID)) {
			return "PORTLET";
		}

		return "SYSTEM";
	}

	public static String getDisplayPid(String pid, String factoryPid) {
		if ((factoryPid != null) && !factoryPid.trim().isEmpty()) {
			return factoryPid;
		}

		if (pid == null) {
			return null;
		}

		if (pid.endsWith(_SCOPED_SUFFIX)) {
			return pid.substring(0, pid.length() - _SCOPED_SUFFIX.length());
		}

		return pid;
	}

	public static String getFactoryPid(Dictionary<String, Object> properties) {
		String factoryPid = _string(properties, _SERVICE_FACTORY_PID);

		if ((factoryPid != null) && factoryPid.endsWith(_SCOPED_SUFFIX)) {
			return factoryPid.substring(
				0, factoryPid.length() - _SCOPED_SUFFIX.length());
		}

		return factoryPid;
	}

	public static String getScopeValue(Dictionary<String, Object> properties) {
		if (properties == null) {
			return null;
		}

		if (_hasValue(properties, _GROUP_ID)) {
			return _string(properties, _GROUP_ID);
		}

		if (_hasValue(properties, _COMPANY_ID)) {
			return _string(properties, _COMPANY_ID);
		}

		if (_hasValue(properties, _PORTLET_INSTANCE_ID)) {
			return _string(properties, _PORTLET_INSTANCE_ID);
		}

		return null;
	}

	public static String toChangedKeysJson(
		Dictionary<String, Object> beforeProperties,
		Dictionary<String, Object> afterProperties) {

		Map<String, Object> beforeValues = toPropertyMap(beforeProperties);
		Map<String, Object> afterValues = toPropertyMap(afterProperties);
		TreeSet<String> keys = new TreeSet<>();

		keys.addAll(beforeValues.keySet());
		keys.addAll(afterValues.keySet());

		JSONArray jsonArray = JSONFactoryUtil.createJSONArray();

		for (String key : keys) {
			if (Objects.equals(beforeValues.get(key), afterValues.get(key))) {
				continue;
			}

			jsonArray.put(key);
		}

		return jsonArray.toString();
	}

	public static Map<String, Object> toPropertyMap(
		Dictionary<String, Object> properties) {

		Map<String, Object> values = new LinkedHashMap<>();

		if (properties == null) {
			return values;
		}

		List<String> keys = new ArrayList<>();
		Enumeration<String> enumeration = properties.keys();

		while (enumeration.hasMoreElements()) {
			keys.add(enumeration.nextElement());
		}

		Collections.sort(keys);

		for (String key : keys) {
			values.put(key, _normalize(properties.get(key)));
		}

		return values;
	}

	private static boolean _hasValue(
		Dictionary<String, Object> properties, String key) {

		String value = _string(properties, key);

		return (value != null) && !value.trim().isEmpty();
	}

	private static Object _normalize(Object value) {
		if (value == null) {
			return null;
		}

		Class<?> clazz = value.getClass();

		if (!clazz.isArray()) {
			return value;
		}

		int length = Array.getLength(value);
		List<Object> values = new ArrayList<>(length);

		for (int i = 0; i < length; i++) {
			values.add(_normalize(Array.get(value, i)));
		}

		return values;
	}

	private static String _string(
		Dictionary<String, Object> properties, String key) {

		if ((properties == null) || (key == null)) {
			return null;
		}

		Object value = properties.get(key);

		if (value == null) {
			return null;
		}

		return String.valueOf(value);
	}

	private static final String _COMPANY_ID = "companyId";

	private static final String _GROUP_ID = "groupId";

	private static final String _PORTLET_INSTANCE_ID = "portletInstanceId";

	private static final String _SCOPED_SUFFIX = ".scoped";

	private static final String _SERVICE_FACTORY_PID = "service.factoryPid";

}
