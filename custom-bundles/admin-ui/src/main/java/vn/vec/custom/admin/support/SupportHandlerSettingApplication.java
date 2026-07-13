package vn.vec.custom.admin.support;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"osgi.jaxrs.application.base=/vec-support-handler-settings",
		"osgi.jaxrs.name=VecSupportHandlerSettingApp"
	},
	service = Application.class
)
public class SupportHandlerSettingApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		Set<Object> singletons = new HashSet<>();

		singletons.add(new SupportHandlerSettingResource());
		singletons.add(new SupportRequestResource());

		return singletons;
	}

}
