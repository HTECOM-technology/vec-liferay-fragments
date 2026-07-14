package vn.vec.custom.admin.HookTollReconciliation.auth;

import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;

import java.util.ArrayList;
import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.HookTollReconciliation.HookConstants;
import vn.vec.custom.admin.HookTollReconciliation.persistence.HookNonceRepository;

/** Xác thực credential, timestamp, nonce và HMAC theo đúng thứ tự fail-fast. */
@Component(service = HookAuthenticator.class)
public class HookAuthenticator {

	public AuthenticationResult authenticate(
			String clientId, String apiKey, String timestamp, String nonce,
			String signature, byte[] rawBody)
		throws Exception {

		if (!HookConstants.ENABLED) {
			return AuthenticationResult.failure(
				503, "HOOK_DISABLED", "Hook Đối soát thu phí đang tạm dừng.");
		}

		List<String> missingHeaders = new ArrayList<>();

		_addIfBlank(missingHeaders, HookConstants.H_CLIENT_ID, clientId);
		_addIfBlank(missingHeaders, HookConstants.H_API_KEY, apiKey);
		_addIfBlank(missingHeaders, HookConstants.H_TIMESTAMP, timestamp);
		_addIfBlank(missingHeaders, HookConstants.H_NONCE, nonce);
		_addIfBlank(missingHeaders, HookConstants.H_SIGNATURE, signature);

		if (!missingHeaders.isEmpty()) {
			return AuthenticationResult.failure(
				400, "HEADER_MISSING",
				"Thiếu header bắt buộc: " + String.join(", ", missingHeaders));
		}

		String normalizedClientId = clientId.trim();
		String normalizedTimestamp = timestamp.trim();
		String normalizedNonce = nonce.trim();
		String normalizedSignature = signature.trim();

		if (normalizedClientId.length() > HookConstants.MAX_CLIENT_ID_LENGTH) {
			return AuthenticationResult.failure(
				401, "CLIENT_UNKNOWN", "Client không hợp lệ.");
		}

		if (normalizedNonce.length() > HookConstants.MAX_NONCE_LENGTH) {
			return AuthenticationResult.failure(
				400, "NONCE_INVALID", "X-Nonce vượt quá độ dài cho phép.");
		}

		HookConstants.Partner partner = HookConstants.PARTNERS.get(
			normalizedClientId);

		if (partner == null) {
			return AuthenticationResult.failure(
				401, "CLIENT_UNKNOWN", "Client không hợp lệ.");
		}

		if (!SignatureUtil.constantTimeEquals(partner.apiKey(), apiKey)) {
			return AuthenticationResult.failure(
				401, "API_KEY_INVALID", "Credential không hợp lệ.");
		}

		Instant requestInstant;

		try {
			requestInstant = OffsetDateTime.parse(normalizedTimestamp).toInstant();
		}
		catch (DateTimeParseException dateTimeParseException) {
			return AuthenticationResult.failure(
				401, "TIMESTAMP_INVALID",
				"X-Timestamp phải là ISO 8601 có offset.");
		}

		Instant now = Instant.now();
		Duration skew = Duration.between(requestInstant, now).abs();

		if (skew.compareTo(
				Duration.ofSeconds(HookConstants.CLOCK_SKEW_SECONDS)) > 0) {
			return AuthenticationResult.failure(
				401, "TIMESTAMP_EXPIRED",
				"X-Timestamp nằm ngoài cửa sổ thời gian cho phép.");
		}

		boolean nonceRegistered = _hookNonceRepository.register(
			normalizedClientId, normalizedNonce, now,
			now.plusSeconds(HookConstants.NONCE_RETENTION_SECONDS));

		if (!nonceRegistered) {
			return AuthenticationResult.failure(
				401, "NONCE_REPLAY", "Request đã được sử dụng trước đó.");
		}

		byte[] stringToSign = SignatureUtil.buildStringToSign(
			normalizedTimestamp, normalizedNonce, rawBody);

		if (!SignatureUtil.verifyHmacSha256Hex(
				partner.secretKey(), stringToSign, normalizedSignature)) {

			return AuthenticationResult.failure(
				401, "SIGNATURE_INVALID", "Chữ ký request không hợp lệ.");
		}

		return AuthenticationResult.success(partner);
	}

	private void _addIfBlank(
		List<String> missingHeaders, String headerName, String value) {

		if ((value == null) || value.trim().isEmpty()) {
			missingHeaders.add(headerName);
		}
	}

	@Reference
	private HookNonceRepository _hookNonceRepository;
}
