package vn.vec.custom.admin.HookTollReconciliation.model;

import java.util.Collections;
import java.util.List;

public class ValidationResult {

	public static ValidationResult failure(List<String> errors) {
		return new ValidationResult(null, errors);
	}

	public static ValidationResult failure(
		HookPayload payload, List<String> errors) {

		return new ValidationResult(payload, errors);
	}

	public static ValidationResult success(HookPayload payload) {
		return new ValidationResult(payload, Collections.emptyList());
	}

	public List<String> getErrors() {
		return _errors;
	}

	public HookPayload getPayload() {
		return _payload;
	}

	public boolean isValid() {
		return _errors.isEmpty();
	}

	private ValidationResult(HookPayload payload, List<String> errors) {
		_payload = payload;
		_errors = Collections.unmodifiableList(errors);
	}

	private final List<String> _errors;
	private final HookPayload _payload;
}
