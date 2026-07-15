package vn.vec.custom.admin.HookTollReconciliation.auth;

import java.io.ByteArrayOutputStream;

import java.nio.charset.StandardCharsets;

import java.security.GeneralSecurityException;
import java.security.MessageDigest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import vn.vec.custom.admin.HookTollReconciliation.HookConstants;

/** Tiện ích tạo và kiểm tra chữ ký, không ghi log dữ liệu bí mật. */
public final class SignatureUtil {

	private SignatureUtil() {
	}

	/**
	 * Tạo đúng chuỗi byte dùng để ký tại một vị trí duy nhất.
	 *
	 * <p>BODY_ONLY giữ nguyên raw body. TS_NONCE_BODY tạo
	 * {@code timestamp + "\n" + nonce + "\n" + rawBody}.</p>
	 */
	public static byte[] buildStringToSign(
		String timestamp, String nonce, byte[] rawBody) {

		byte[] safeBody = (rawBody == null) ? new byte[0] : rawBody;

		if (HookConstants.SIGNATURE_SCHEME ==
				HookConstants.SignatureScheme.BODY_ONLY) {

			return safeBody;
		}

		byte[] timestampBytes = _utf8(timestamp);
		byte[] nonceBytes = _utf8(nonce);
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(
			timestampBytes.length + nonceBytes.length + safeBody.length + 2);

		outputStream.write(timestampBytes, 0, timestampBytes.length);
		outputStream.write('\n');
		outputStream.write(nonceBytes, 0, nonceBytes.length);
		outputStream.write('\n');
		outputStream.write(safeBody, 0, safeBody.length);

		return outputStream.toByteArray();
	}

	public static boolean constantTimeEquals(String expected, String actual) {
		return MessageDigest.isEqual(_utf8(expected), _utf8(actual));
	}

	public static String hmacSha256Hex(String secretKey, byte[] bytes)
		throws GeneralSecurityException {

		return _toLowerHex(_hmacSha256(secretKey, bytes));
	}

	public static boolean verifyHmacSha256Hex(
			String secretKey, byte[] bytes, String providedSignature)
		throws GeneralSecurityException {

		byte[] expected = _hmacSha256(secretKey, bytes);
		byte[] provided = _decodeLowerHex(providedSignature);

		if (provided == null) {
			provided = new byte[expected.length];
		}

		return MessageDigest.isEqual(expected, provided) &&
			(providedSignature != null) && (providedSignature.length() == 64);
	}

	private static byte[] _decodeLowerHex(String value) {
		if ((value == null) || (value.length() != 64)) {
			return null;
		}

		byte[] bytes = new byte[value.length() / 2];

		for (int i = 0; i < value.length(); i += 2) {
			int high = _lowerHexDigit(value.charAt(i));
			int low = _lowerHexDigit(value.charAt(i + 1));

			if ((high < 0) || (low < 0)) {
				return null;
			}

			bytes[i / 2] = (byte)((high << 4) | low);
		}

		return bytes;
	}

	private static byte[] _hmacSha256(String secretKey, byte[] bytes)
		throws GeneralSecurityException {

		Mac mac = Mac.getInstance(HookConstants.HMAC_ALGO);
		byte[] keyBytes = _utf8(secretKey);

		mac.init(new SecretKeySpec(keyBytes, HookConstants.HMAC_ALGO));

		return mac.doFinal((bytes == null) ? new byte[0] : bytes);
	}

	private static int _lowerHexDigit(char value) {
		if ((value >= '0') && (value <= '9')) {
			return value - '0';
		}

		if ((value >= 'a') && (value <= 'f')) {
			return value - 'a' + 10;
		}

		return -1;
	}

	private static String _toLowerHex(byte[] bytes) {
		char[] digits = "0123456789abcdef".toCharArray();
		char[] output = new char[bytes.length * 2];

		for (int i = 0; i < bytes.length; i++) {
			int value = bytes[i] & 0xff;

			output[i * 2] = digits[value >>> 4];
			output[(i * 2) + 1] = digits[value & 0x0f];
		}

		return new String(output);
	}

	private static byte[] _utf8(String value) {
		return ((value == null) ? "" : value).getBytes(StandardCharsets.UTF_8);
	}
}
