package vn.vec.custom.admin.HookTollReconciliation;

import java.util.Map;
import java.util.Set;

/**
 * NƠI DUY NHẤT để thêm/sửa credential và tham số vận hành của hook Đối soát
 * thu phí.
 *
 * <p>Credential viết cứng sẽ tồn tại trong mã nguồn và JAR. Không đưa key thật
 * lên Git công khai, giới hạn quyền đọc repo/JAR và tuyệt đối không log key.</p>
 */
public final class HookConstants {

	private HookConstants() {
	}

	// ===== Credential: clientId -> apiKey, secretKey, record type được phép =====
	public static final Map<String, Partner> PARTNERS = Map.of(
		"vec-partner-0007",
		new Partner(
			"ak_live_9f2c1b7a4e8d40f3b6c25a91e0d3f7c8",
			"sk_live_a1B2c3D4e5F6g7H8i9J0kLmNoPqRsTuVwXyZ01234567",
			Set.of("traffic", "revenue", "incident", "event", "error"))
	);

	public static final class Partner {

		public Partner(
			String apiKey, String secretKey, Set<String> allowedRecordTypes) {

			_apiKey = apiKey;
			_secretKey = secretKey;
			_allowedRecordTypes = Set.copyOf(allowedRecordTypes);
		}

		public Set<String> allowedRecordTypes() {
			return _allowedRecordTypes;
		}

		public String apiKey() {
			return _apiKey;
		}

		public String secretKey() {
			return _secretKey;
		}

		@Override
		public String toString() {
			return "Partner{credentials=REDACTED, allowedRecordTypes=" +
				_allowedRecordTypes + "}";
		}

		private final Set<String> _allowedRecordTypes;
		private final String _apiKey;
		private final String _secretKey;
	}

	// ===== Tên header đã chốt với đối tác =====
	public static final String H_CLIENT_ID = "X-Client-Id";
	public static final String H_API_KEY = "X-Api-Key";
	public static final String H_TIMESTAMP = "X-Timestamp";
	public static final String H_NONCE = "X-Nonce";
	public static final String H_SIGNATURE = "X-Signature";
	public static final String H_TRANS_ID = "X-Trans-Id";

	// ===== Thuật toán/chế độ ký =====
	public static final String HMAC_ALGO = "HmacSHA256";
	public static final SignatureScheme SIGNATURE_SCHEME =
		SignatureScheme.BODY_ONLY;

	public enum SignatureScheme {
		BODY_ONLY,
		TS_NONCE_BODY
	}

	// TODO: Xác nhận lại SIGNATURE_SCHEME và tên header với đối tác trước go-live.

	// ===== Tham số vận hành: thay đổi tại đây rồi build/deploy lại =====
	public static final boolean ENABLED = true;
	public static final long CLOCK_SKEW_SECONDS = 300;
	public static final int MAX_BODY_BYTES = 262144;
	public static final long NONCE_RETENTION_SECONDS = 300;
	public static final boolean LOG_RAW_BODY = false;
	public static final String NONCE_CLEANUP_CRON = "0 0/10 * * * ?";
	public static final int DASHBOARD_DEFAULT_DAYS = 365;
	public static final int DASHBOARD_MAX_DAYS = 731;
	public static final int DASHBOARD_DEFAULT_TABLE_LIMIT = 10;
	public static final int DASHBOARD_MAX_TABLE_LIMIT = 100;

	public static final int MAX_CLIENT_ID_LENGTH = 100;
	public static final int MAX_NONCE_LENGTH = 128;
	public static final int MAX_TRANS_ID_LENGTH = 64;

	public static final Set<String> RECORD_TYPES = Set.of(
		"traffic", "revenue", "incident", "event", "error");
	public static final Set<String> ACTIONS = Set.of(
		"create", "update", "delete", "upsert");
	public static final Set<String> STATUSES = Set.of(
		"pending", "processing", "resolved", "rejected");
	public static final Set<String> PRIORITIES = Set.of(
		"low", "medium", "high", "critical");
}
