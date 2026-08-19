package vn.vec.custom.counter.model;

/**
 * Số người đang online, tách theo khách và người đã đăng nhập.
 */
public class OnlineCount {

	public OnlineCount(long guests, long members) {
		_guests = guests;
		_members = members;
	}

	public long getGuests() {
		return _guests;
	}

	public long getMembers() {
		return _members;
	}

	public long getTotal() {
		return _guests + _members;
	}

	private final long _guests;
	private final long _members;

}
