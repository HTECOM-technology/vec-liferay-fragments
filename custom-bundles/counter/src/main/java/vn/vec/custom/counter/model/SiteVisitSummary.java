package vn.vec.custom.counter.model;

import java.util.Date;

/**
 * Số liệu tổng hợp lượt truy cập website.
 */
public class SiteVisitSummary {

	public Date getFirstVisitDate() {
		return _firstVisitDate;
	}

	public long getTotalVisits() {
		return _totalVisits;
	}

	public long getTotalVisitsThisMonth() {
		return _totalVisitsThisMonth;
	}

	public long getTotalVisitsThisWeek() {
		return _totalVisitsThisWeek;
	}

	public long getTotalVisitsThisYear() {
		return _totalVisitsThisYear;
	}

	public long getTotalVisitsToday() {
		return _totalVisitsToday;
	}

	public long getTotalVisitsYesterday() {
		return _totalVisitsYesterday;
	}

	public long getUniqueVisitors() {
		return _uniqueVisitors;
	}

	public long getUniqueVisitorsToday() {
		return _uniqueVisitorsToday;
	}

	public void setFirstVisitDate(Date firstVisitDate) {
		_firstVisitDate = firstVisitDate;
	}

	public void setTotalVisits(long totalVisits) {
		_totalVisits = totalVisits;
	}

	public void setTotalVisitsThisMonth(long totalVisitsThisMonth) {
		_totalVisitsThisMonth = totalVisitsThisMonth;
	}

	public void setTotalVisitsThisWeek(long totalVisitsThisWeek) {
		_totalVisitsThisWeek = totalVisitsThisWeek;
	}

	public void setTotalVisitsThisYear(long totalVisitsThisYear) {
		_totalVisitsThisYear = totalVisitsThisYear;
	}

	public void setTotalVisitsToday(long totalVisitsToday) {
		_totalVisitsToday = totalVisitsToday;
	}

	public void setTotalVisitsYesterday(long totalVisitsYesterday) {
		_totalVisitsYesterday = totalVisitsYesterday;
	}

	public void setUniqueVisitors(long uniqueVisitors) {
		_uniqueVisitors = uniqueVisitors;
	}

	public void setUniqueVisitorsToday(long uniqueVisitorsToday) {
		_uniqueVisitorsToday = uniqueVisitorsToday;
	}

	private Date _firstVisitDate;
	private long _totalVisits;
	private long _totalVisitsThisMonth;
	private long _totalVisitsThisWeek;
	private long _totalVisitsThisYear;
	private long _totalVisitsToday;
	private long _totalVisitsYesterday;
	private long _uniqueVisitors;
	private long _uniqueVisitorsToday;

}
