package vn.vec.custom.counter.util;

import com.liferay.portal.kernel.json.JSONObject;

import java.text.SimpleDateFormat;

import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

/**
 * Tiện ích dựng response JSON cho counter API. API dùng cho fragment ở
 * frontend nên mọi response đều kèm header CORS.
 */
public class CounterResponseUtil {

	public static Response badRequest(String message) {
		return _error(Response.Status.BAD_REQUEST, message);
	}

	public static Response.ResponseBuilder cors(
		Response.ResponseBuilder responseBuilder) {

		return responseBuilder.header(
			"Access-Control-Allow-Origin", "*"
		).header(
			"Access-Control-Allow-Headers",
			"Content-Type, x-csrf-token, X-Requested-With"
		).header(
			"Access-Control-Allow-Methods", "GET, POST, OPTIONS"
		).header(
			"Cache-Control", "no-store"
		);
	}

	/** Định dạng ISO-8601 UTC, hoặc {@code null} nếu không có giá trị. */
	public static String formatDate(Date date) {
		if (date == null) {
			return null;
		}

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
			"yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US);

		simpleDateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));

		return simpleDateFormat.format(date);
	}

	public static Response internalError(String message) {
		return _error(Response.Status.INTERNAL_SERVER_ERROR, message);
	}

	public static Response noContent() {
		return cors(
			Response.noContent()
		).build();
	}

	public static Response ok(JSONObject jsonObject) {
		return cors(
			Response.ok(jsonObject.toString(), MediaType.APPLICATION_JSON)
		).build();
	}

	public static Response options() {
		return cors(
			Response.ok()
		).build();
	}

	private static Response _error(Response.Status status, String message) {
		return cors(
			Response.status(
				status
			).type(
				MediaType.APPLICATION_JSON
			).entity(
				"{\"error\":\"" + _escapeJson(message) + "\"}"
			)
		).build();
	}

	private static String _escapeJson(String value) {
		if (value == null) {
			return "";
		}

		return value.replace(
			"\\", "\\\\"
		).replace(
			"\"", "\\\""
		).replace(
			"\n", " "
		).replace(
			"\r", " "
		);
	}

	private CounterResponseUtil() {
	}

}
