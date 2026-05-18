package vn.vec.custom.admin.survey;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"osgi.jaxrs.application.base=/vec-survey",
		"osgi.jaxrs.name=VecSurveyApp"
	},
	service = Application.class
)
public class SurveyApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		Set<Object> singletons = new HashSet<>();

		singletons.add(new SurveyResource());

		return singletons;
	}

}
