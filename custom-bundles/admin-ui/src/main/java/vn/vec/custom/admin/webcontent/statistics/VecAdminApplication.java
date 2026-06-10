package vn.vec.custom.admin.webcontent.statistics;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"osgi.jaxrs.application.base=/vec-admin/v1.0",
		"osgi.jaxrs.name=VecAdminApp"
	},
	service = Application.class
)
public class VecAdminApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		Set<Object> singletons = new HashSet<>();

		singletons.add(new WebContentStatisticsResource());

		return singletons;
	}

}
