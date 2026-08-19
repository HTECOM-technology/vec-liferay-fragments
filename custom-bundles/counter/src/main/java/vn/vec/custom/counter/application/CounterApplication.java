package vn.vec.custom.counter.application;

import java.util.Collections;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.counter.constants.CounterConstants;

/**
 * JAX-RS application của module counter, base path {@code /o/vec-counter}.
 *
 * <p>
 * {@code auth.verifier.guest.allowed} và {@code liferay.access.control.disable}
 * cho phép khách chưa đăng nhập gọi API — counter phải chạy được trên trang
 * public, không yêu cầu xác thực.
 * </p>
 *
 * <p>
 * Resource được đăng ký riêng dưới dạng OSGi component (xem package
 * {@code resource}) nên ở đây trả về tập singleton rỗng.
 * </p>
 */
@Component(
	property = {
		"auth.verifier.guest.allowed=true",
		"liferay.access.control.disable=true",
		"osgi.jaxrs.application.base=" +
			CounterConstants.JAXRS_APPLICATION_BASE,
		"osgi.jaxrs.name=" + CounterConstants.JAXRS_APPLICATION_NAME
	},
	service = Application.class
)
public class CounterApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		return Collections.emptySet();
	}

}
