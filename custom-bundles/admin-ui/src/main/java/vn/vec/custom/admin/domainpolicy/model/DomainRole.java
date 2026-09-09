package vn.vec.custom.admin.domainpolicy.model;

/**
 * Vai trò của một domain đang trỏ về cùng một Liferay instance.
 *
 * <p>Cả 4 domain của VEC đều được nginx forward về cùng backend, nên việc phân
 * biệt môi trường sử dụng phải dựa vào host của request.</p>
 */
public enum DomainRole {

	/**
	 * Cổng quản trị: bắt buộc đăng nhập, landing vào Control Panel.
	 */
	ADMIN,

	/**
	 * Cổng nội bộ: bắt buộc đăng nhập, mọi trang đều đưa về intranet.
	 */
	INTRANET,

	/**
	 * Cổng công khai: xem tự do, không đăng nhập và không cho phép đăng nhập.
	 */
	PUBLIC_SITE,

	/**
	 * Host không nằm trong danh sách khai báo (IP nội bộ, localhost, health
	 * check...). Filter bỏ qua hoàn toàn, giữ nguyên hành vi mặc định.
	 */
	UNKNOWN

}
