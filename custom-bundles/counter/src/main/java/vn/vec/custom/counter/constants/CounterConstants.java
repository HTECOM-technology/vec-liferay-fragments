package vn.vec.custom.counter.constants;

/**
 * Hằng số dùng chung cho module counter.
 */
public class CounterConstants {

	/**
	 * Base path của JAX-RS application. URL đầy đủ:
	 * {@code /o/vec-counter/...}
	 */
	public static final String JAXRS_APPLICATION_BASE = "/vec-counter";

	public static final String JAXRS_APPLICATION_NAME = "VecCounter";

	public static final String JAXRS_APPLICATION_SELECT =
		"(osgi.jaxrs.name=" + JAXRS_APPLICATION_NAME + ")";

	/**
	 * Khoảng thời gian tính là "đang online". Client nên gửi heartbeat với chu
	 * kỳ nhỏ hơn giá trị này (khuyến nghị 60s).
	 */
	public static final int ONLINE_WINDOW_SECONDS = 300;

	/**
	 * Cùng một visitor đọc lại cùng một bài viết trong khoảng này thì không
	 * tăng totalReads, tránh F5 làm tăng ảo.
	 */
	public static final int ARTICLE_READ_THROTTLE_SECONDS = 1800;

	/**
	 * Cùng một visitor truy cập lại website trong khoảng này thì không tăng
	 * totalVisits, tránh reload liên tục làm tăng ảo.
	 */
	public static final int SITE_VISIT_THROTTLE_SECONDS = 60;

	/**
	 * Số ngày giữ lại dòng chi tiết trong VEC_CounterSiteVisitor. Số liệu tổng
	 * hợp theo ngày nằm ở VEC_CounterSiteVisit nên không bị ảnh hưởng.
	 */
	public static final int VISITOR_RETENTION_DAYS = 180;

	/** Cron dọn session online hết hạn và dòng visitor quá cũ. */
	public static final String CLEANUP_CRON = "0 */5 * * * ?";

	/**
	 * Session online cũ hơn ngưỡng này sẽ bị xoá. Lớn hơn
	 * {@link #ONLINE_WINDOW_SECONDS} để truy vấn đếm online không phụ thuộc vào
	 * thời điểm job dọn dữ liệu chạy.
	 */
	public static final int ONLINE_SESSION_PURGE_SECONDS =
		ONLINE_WINDOW_SECONDS * 3;

	public static final int MAX_DAILY_RANGE_DAYS = 366;

	public static final int MAX_BATCH_ARTICLE_IDS = 100;

	public static final int MAX_TOP_ARTICLES = 100;

	private CounterConstants() {
	}

}
