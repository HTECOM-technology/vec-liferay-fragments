package vn.vec.custom.counter.model;

/**
 * Lượt truy cập của một ngày, dùng cho biểu đồ theo thời gian.
 */
public class DailyVisit {

	public DailyVisit(
		String visitDate, long totalVisits, long uniqueVisitors) {

		_visitDate = visitDate;
		_totalVisits = totalVisits;
		_uniqueVisitors = uniqueVisitors;
	}

	public long getTotalVisits() {
		return _totalVisits;
	}

	public long getUniqueVisitors() {
		return _uniqueVisitors;
	}

	/** Định dạng {@code yyyy-MM-dd}. */
	public String getVisitDate() {
		return _visitDate;
	}

	private final long _totalVisits;
	private final long _uniqueVisitors;
	private final String _visitDate;

}
