package vn.vec.custom.admin.audit.service;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;

import java.util.Map;
import java.util.Objects;
import java.util.TreeSet;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.audit.util.AuditJsonUtil;

@Component(service = AuditDiffService.class)
public class AuditDiffService {

	public JSONArray diff(String beforeJson, String afterJson) {
		Map<String, String> beforeValues = AuditJsonUtil.flatten(beforeJson);
		Map<String, String> afterValues = AuditJsonUtil.flatten(afterJson);
		TreeSet<String> keys = AuditJsonUtil.unionKeys(beforeValues, afterValues);
		JSONArray jsonArray = JSONFactoryUtil.createJSONArray();

		for (String key : keys) {
			String beforeValue = beforeValues.get(key);
			String afterValue = afterValues.get(key);

			if (Objects.equals(beforeValue, afterValue)) {
				continue;
			}

			JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

			jsonObject.put("field", key);
			jsonObject.put(
				"oldValue", AuditJsonUtil.truncate(beforeValue, 1000));
			jsonObject.put(
				"newValue", AuditJsonUtil.truncate(afterValue, 1000));

			jsonArray.put(jsonObject);
		}

		return jsonArray;
	}

	public String diffJson(String beforeJson, String afterJson) {
		return diff(beforeJson, afterJson).toString();
	}

}
