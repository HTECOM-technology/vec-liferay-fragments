package vn.vec.custom.counter.util;

import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;

import java.io.BufferedReader;

import javax.servlet.http.HttpServletRequest;

/**
 * Đọc tham số từ query string, và nếu thiếu thì đọc tiếp từ JSON body. Nhờ vậy
 * fragment có thể gọi API bằng query string hay JSON body đều được.
 */
public class CounterParamUtil {

	public static Long getLong(
		String queryValue, JSONObject bodyJSONObject, String key) {

		String value = getString(queryValue, bodyJSONObject, key);

		if (value == null) {
			return null;
		}

		try {
			return Long.valueOf(value);
		}
		catch (NumberFormatException numberFormatException) {
			return null;
		}
	}

	public static String getString(
		String queryValue, JSONObject bodyJSONObject, String key) {

		if ((queryValue != null) && !queryValue.trim().isEmpty()) {
			return queryValue.trim();
		}

		if (bodyJSONObject == null) {
			return null;
		}

		String value = bodyJSONObject.getString(key);

		if ((value == null) || value.trim().isEmpty()) {
			return null;
		}

		return value.trim();
	}

	/**
	 * Đọc body của request rồi parse thành JSON, trả về {@code null} nếu body
	 * rỗng hoặc không phải JSON.
	 *
	 * <p>
	 * Body được đọc trực tiếp từ servlet request thay vì khai báo tham số entity
	 * của JAX-RS, để không phụ thuộc vào MessageBodyReader cho {@code String}
	 * (CXF có thể trả 415 với {@code Content-Type: application/json}). Nhờ vậy
	 * client gửi JSON, text/plain hay {@code navigator.sendBeacon} đều đọc được.
	 * </p>
	 */
	public static JSONObject readBody(HttpServletRequest httpServletRequest) {
		if (httpServletRequest == null) {
			return null;
		}

		try {
			int contentLength = httpServletRequest.getContentLength();

			if (contentLength == 0) {
				return null;
			}

			StringBuilder stringBuilder = new StringBuilder();

			try (BufferedReader bufferedReader =
					httpServletRequest.getReader()) {

				char[] buffer = new char[1024];
				int read = 0;
				int total = 0;

				while ((read = bufferedReader.read(buffer)) > 0) {
					total += read;

					if (total > _MAX_BODY_LENGTH) {
						return null;
					}

					stringBuilder.append(buffer, 0, read);
				}
			}

			String body = stringBuilder.toString();

			if (body.trim().isEmpty()) {
				return null;
			}

			return JSONFactoryUtil.createJSONObject(body);
		}
		catch (Exception exception) {

			// Body không phải JSON hoặc đã bị đọc trước đó: bỏ qua, các tham số
			// trên query string vẫn dùng được.

			return null;
		}
	}

	private static final int _MAX_BODY_LENGTH = 8192;

	private CounterParamUtil() {
	}

}
