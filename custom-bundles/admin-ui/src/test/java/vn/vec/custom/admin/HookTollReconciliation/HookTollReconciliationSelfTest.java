package vn.vec.custom.admin.HookTollReconciliation;

import java.nio.charset.StandardCharsets;

import vn.vec.custom.admin.HookTollReconciliation.auth.SignatureUtil;

/** Self-test không cần Liferay runtime cho test vector HMAC BODY_ONLY. */
public class HookTollReconciliationSelfTest {

	public static void main(String[] args) throws Exception {
		String body =
			"{\"source_system\":\"vec-sync-service\",\"external_id\":" +
				"\"vec-sync-service:traffic:2026-07-14:Nw:MTcxMw\"," +
				"\"record_type\":\"traffic\",\"action\":\"upsert\"," +
				"\"route_code\":\"7\",\"route_name\":\"Nội Bài - Lào Cai\"," +
				"\"station_code\":\"1713\",\"station_name\":\"Km237\"," +
				"\"occurred_at\":\"2026-07-14T00:00:00+07:00\"," +
				"\"status\":\"processing\",\"traffic_date\":\"2026-07-14\"," +
				"\"vehicle_count\":6654}";
		byte[] rawBody = body.getBytes(StandardCharsets.UTF_8);
		HookConstants.Partner partner = HookConstants.PARTNERS.get(
			"vec-partner-0007");
		String actual = SignatureUtil.hmacSha256Hex(
			partner.secretKey(),
			SignatureUtil.buildStringToSign(
				"2026-07-15T09:33:20.810+07:00",
				"5bcf16d6-e856-4dc4-a422-286753fd4845", rawBody));

		_assertEquals(
			"5026e29935e45becc9973fa2f792998f34bd514e413299c2b6ed857e3a71b58e",
			actual, "BODY_ONLY HMAC test vector");
		_assertTrue(
			SignatureUtil.verifyHmacSha256Hex(
				partner.secretKey(), rawBody, actual),
			"valid lowercase signature");
		_assertFalse(
			SignatureUtil.verifyHmacSha256Hex(
				partner.secretKey(), rawBody, actual.toUpperCase()),
			"uppercase signature must be rejected");
	}

	private static void _assertEquals(
		String expected, String actual, String label) {

		if (!expected.equals(actual)) {
			throw new AssertionError(
				label + ": expected " + expected + " but got " + actual);
		}
	}

	private static void _assertFalse(boolean value, String label) {
		if (value) {
			throw new AssertionError(label);
		}
	}

	private static void _assertTrue(boolean value, String label) {
		if (!value) {
			throw new AssertionError(label);
		}
	}
}
