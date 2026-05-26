package vn.vec.custom.admin.camera;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"osgi.jaxrs.application.base=/vec-setting-camera-show-state",
		"osgi.jaxrs.name=VecCameraShowStateApp"
	},
	service = Application.class
)
public class CameraShowStateApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		Set<Object> singletons = new HashSet<>();

		singletons.add(new CameraShowStateResource());

		return singletons;
	}

}
