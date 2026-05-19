package vn.vec.custom.admin.dashboard.layout;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"osgi.jaxrs.application.base=/vec-dashboard-layout",
		"osgi.jaxrs.name=VecDashboardLayoutApp"
	},
	service = Application.class
)
public class DashboardLayoutApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		Set<Object> singletons = new HashSet<>();

		singletons.add(new DashboardLayoutResource());

		return singletons;
	}

}
