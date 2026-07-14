package vn.vec.custom.admin.HookTollReconciliation.validation;

import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;

import java.math.BigDecimal;

import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.HookTollReconciliation.HookConstants;
import vn.vec.custom.admin.HookTollReconciliation.model.HookPayload;
import vn.vec.custom.admin.HookTollReconciliation.model.ValidationResult;

/** Parse JSON sau khi verify HMAC và validate trường chung/riêng. */
@Component(service = PayloadValidator.class)
public class PayloadValidator {

	public ValidationResult validate(byte[] rawBody) {
		List<String> errors = new ArrayList<>();
		String jsonText;

		try {
			jsonText = _decodeUtf8(rawBody);
		}
		catch (CharacterCodingException characterCodingException) {
			errors.add("body: phải là JSON mã hóa UTF-8 hợp lệ");

			return ValidationResult.failure(errors);
		}

		JSONObject jsonObject;

		try {
			if (jsonText.trim().isEmpty()) {
				throw new IllegalArgumentException("empty body");
			}

			jsonObject = JSONFactoryUtil.createJSONObject(jsonText);
		}
		catch (Exception exception) {
			errors.add("body: JSON object không hợp lệ");

			return ValidationResult.failure(errors);
		}

		HookPayload payload = new HookPayload();

		_requiredString(jsonObject, payload, errors, "source_system", 100);
		_requiredString(jsonObject, payload, errors, "external_id", 255);
		String recordType = _requiredEnum(
			jsonObject, payload, errors, "record_type",
			HookConstants.RECORD_TYPES, 32);
		_requiredEnum(
			jsonObject, payload, errors, "action", HookConstants.ACTIONS, 16);
		_requiredString(jsonObject, payload, errors, "route_code", 64);
		_requiredString(jsonObject, payload, errors, "route_name", 255);
		_requiredString(jsonObject, payload, errors, "station_code", 64);
		_requiredString(jsonObject, payload, errors, "station_name", 255);
		_requiredOffsetDateTime(
			jsonObject, payload, errors, "occurred_at");
		_requiredEnum(
			jsonObject, payload, errors, "status", HookConstants.STATUSES, 32);

		boolean requiresCreatedAt = "event".equals(recordType) ||
			"error".equals(recordType);

		if (requiresCreatedAt) {
			_requiredOffsetDateTime(
				jsonObject, payload, errors, "created_at");
		}
		else {
			_optionalOffsetDateTime(
				jsonObject, payload, errors, "created_at");
		}

		_optionalOffsetDateTime(
			jsonObject, payload, errors, "updated_at");
		_optionalString(jsonObject, payload, errors, "created_by", 255);
		_optionalString(jsonObject, payload, errors, "note", 1000);

		if ("traffic".equals(recordType)) {
			_validateTraffic(jsonObject, payload, errors);
		}
		else if ("revenue".equals(recordType)) {
			_validateRevenue(jsonObject, payload, errors);
		}
		else if ("incident".equals(recordType)) {
			_validateIncident(jsonObject, payload, errors);
		}
		else if ("event".equals(recordType)) {
			_validateEvent(jsonObject, payload, errors);
		}
		else if ("error".equals(recordType)) {
			_validateError(jsonObject, payload, errors);
		}

		if (!errors.isEmpty()) {
			return ValidationResult.failure(payload, errors);
		}

		return ValidationResult.success(payload);
	}

	private String _decodeUtf8(byte[] bytes) throws CharacterCodingException {
		return StandardCharsets.UTF_8.newDecoder(
		).onMalformedInput(
			CodingErrorAction.REPORT
		).onUnmappableCharacter(
			CodingErrorAction.REPORT
		).decode(
			ByteBuffer.wrap((bytes == null) ? new byte[0] : bytes)
		).toString();
	}

	private Object _get(JSONObject jsonObject, String name) {
		if ((jsonObject == null) || !jsonObject.has(name)) {
			return null;
		}

		return jsonObject.get(name);
	}

	private Integer _integer(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, boolean required, boolean nonnegative) {

		Object rawValue = _get(jsonObject, name);

		if (rawValue == null) {
			if (required) {
				errors.add(name + ": là trường bắt buộc");
			}

			return null;
		}

		if (!(rawValue instanceof Number)) {
			errors.add(name + ": phải là số nguyên");

			return null;
		}

		try {
			BigDecimal decimal = new BigDecimal(String.valueOf(rawValue));
			int value = decimal.intValueExact();

			if (nonnegative && (value < 0)) {
				errors.add(name + ": phải lớn hơn hoặc bằng 0");

				return null;
			}

			payload.put(name, Integer.valueOf(value));

			return Integer.valueOf(value);
		}
		catch (ArithmeticException | NumberFormatException exception) {
			errors.add(name + ": phải là số nguyên hợp lệ trong phạm vi INT");

			return null;
		}
	}

	private LocalDate _localDate(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, boolean required) {

		String value = _string(
			jsonObject, payload, errors, name, required, 10, false);

		if (value == null) {
			return null;
		}

		try {
			LocalDate localDate = LocalDate.parse(value);

			payload.put(name, localDate);

			return localDate;
		}
		catch (DateTimeParseException dateTimeParseException) {
			errors.add(name + ": phải có định dạng YYYY-MM-DD");

			return null;
		}
	}

	private BigDecimal _decimal(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, boolean required, boolean nonnegative) {

		Object rawValue = _get(jsonObject, name);

		if (rawValue == null) {
			if (required) {
				errors.add(name + ": là trường bắt buộc");
			}

			return null;
		}

		if (!(rawValue instanceof Number)) {
			errors.add(name + ": phải là số thập phân");

			return null;
		}

		try {
			BigDecimal value = new BigDecimal(String.valueOf(rawValue));

			if (nonnegative && (value.signum() < 0)) {
				errors.add(name + ": phải lớn hơn hoặc bằng 0");

				return null;
			}

			int integerDigits = Math.max(value.precision() - value.scale(), 0);

			if ((integerDigits > 16) || (Math.max(value.scale(), 0) > 2)) {
				errors.add(name + ": vượt quá định dạng DECIMAL(18,2)");

				return null;
			}

			payload.put(name, value);

			return value;
		}
		catch (NumberFormatException numberFormatException) {
			errors.add(name + ": phải là số thập phân hợp lệ");

			return null;
		}
	}

	private OffsetDateTime _offsetDateTime(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, boolean required) {

		String value = _string(
			jsonObject, payload, errors, name, required, 64, false);

		if (value == null) {
			return null;
		}

		try {
			OffsetDateTime offsetDateTime = OffsetDateTime.parse(value);

			payload.put(name, offsetDateTime);

			return offsetDateTime;
		}
		catch (DateTimeParseException dateTimeParseException) {
			errors.add(name + ": phải là ISO 8601 có offset");

			return null;
		}
	}

	private void _optionalInteger(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, boolean nonnegative) {

		_integer(jsonObject, payload, errors, name, false, nonnegative);
	}

	private void _optionalOffsetDateTime(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name) {

		_offsetDateTime(jsonObject, payload, errors, name, false);
	}

	private void _optionalString(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, int maxLength) {

		_string(
			jsonObject, payload, errors, name, false, maxLength, true);
	}

	private String _requiredEnum(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, Set<String> allowedValues, int maxLength) {

		String value = _string(
			jsonObject, payload, errors, name, true, maxLength, true);

		if ((value != null) && !allowedValues.contains(value)) {
			errors.add(
				name + ": giá trị hợp lệ là " + String.join(" | ", allowedValues));

			return null;
		}

		return value;
	}

	private void _requiredInteger(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, boolean nonnegative) {

		_integer(jsonObject, payload, errors, name, true, nonnegative);
	}

	private void _requiredLocalDate(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name) {

		_localDate(jsonObject, payload, errors, name, true);
	}

	private void _requiredOffsetDateTime(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name) {

		_offsetDateTime(jsonObject, payload, errors, name, true);
	}

	private String _requiredString(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, int maxLength) {

		return _string(
			jsonObject, payload, errors, name, true, maxLength, true);
	}

	private String _string(
		JSONObject jsonObject, HookPayload payload, List<String> errors,
		String name, boolean required, int maxLength, boolean trim) {

		Object rawValue = _get(jsonObject, name);

		if (rawValue == null) {
			if (required) {
				errors.add(name + ": là trường bắt buộc");
			}

			return null;
		}

		if (!(rawValue instanceof String)) {
			errors.add(name + ": phải là chuỗi");

			return null;
		}

		String value = (String)rawValue;

		if (trim) {
			value = value.trim();
		}

		if (value.isEmpty()) {
			if (required) {
				errors.add(name + ": không được để trống");
			}
			else {
				payload.put(name, null);
			}

			return null;
		}

		if (value.length() > maxLength) {
			errors.add(name + ": vượt quá " + maxLength + " ký tự");

			return null;
		}

		payload.put(name, value);

		return value;
	}

	private void _validateError(
		JSONObject jsonObject, HookPayload payload, List<String> errors) {

		_requiredString(jsonObject, payload, errors, "error_id", 255);
		_requiredString(jsonObject, payload, errors, "request_name", 255);
		_requiredString(jsonObject, payload, errors, "error_type", 255);
		_optionalString(
			jsonObject, payload, errors, "error_description", 65535);

		Object priority = _get(jsonObject, "priority");

		if (priority != null) {
			String value = _string(
				jsonObject, payload, errors, "priority", false, 16, true);

			if ((value != null) && !HookConstants.PRIORITIES.contains(value)) {
				errors.add(
					"priority: giá trị hợp lệ là " +
						String.join(" | ", HookConstants.PRIORITIES));
			}
		}
	}

	private void _validateEvent(
		JSONObject jsonObject, HookPayload payload, List<String> errors) {

		_requiredString(jsonObject, payload, errors, "event_id", 255);
		_requiredString(jsonObject, payload, errors, "event_name", 255);
		_requiredString(jsonObject, payload, errors, "event_type", 255);
		_optionalString(jsonObject, payload, errors, "event_content", 65535);
	}

	private void _validateIncident(
		JSONObject jsonObject, HookPayload payload, List<String> errors) {

		_requiredString(jsonObject, payload, errors, "incident_id", 255);
		_requiredString(jsonObject, payload, errors, "incident_type", 255);
		_optionalString(jsonObject, payload, errors, "incident_title", 255);
		_optionalString(
			jsonObject, payload, errors, "incident_description", 65535);
		_optionalOffsetDateTime(
			jsonObject, payload, errors, "resolved_at");
		_optionalString(jsonObject, payload, errors, "resolution_note", 65535);
	}

	private void _validateRevenue(
		JSONObject jsonObject, HookPayload payload, List<String> errors) {

		_requiredLocalDate(jsonObject, payload, errors, "revenue_date");
		_decimal(jsonObject, payload, errors, "amount", true, true);
		_requiredString(jsonObject, payload, errors, "currency", 8);
		_optionalInteger(
			jsonObject, payload, errors, "transaction_count", true);
		_optionalString(jsonObject, payload, errors, "payment_method", 32);
		_optionalString(
			jsonObject, payload, errors, "reconciliation_status", 64);
	}

	private void _validateTraffic(
		JSONObject jsonObject, HookPayload payload, List<String> errors) {

		_requiredLocalDate(jsonObject, payload, errors, "traffic_date");
		_requiredInteger(
			jsonObject, payload, errors, "vehicle_count", true);
		_optionalString(jsonObject, payload, errors, "vehicle_type", 64);
		_optionalString(jsonObject, payload, errors, "lane_code", 64);
		_optionalString(jsonObject, payload, errors, "shift_code", 64);
		_optionalOffsetDateTime(jsonObject, payload, errors, "from_time");
		_optionalOffsetDateTime(jsonObject, payload, errors, "to_time");
	}
}
