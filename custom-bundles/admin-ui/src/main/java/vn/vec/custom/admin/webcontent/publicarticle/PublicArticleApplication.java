package vn.vec.custom.admin.webcontent.publicarticle;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"auth.verifier.guest.allowed=true",
		"liferay.access.control.disable=true",
		"osgi.jaxrs.application.base=/vec-public-webcontent",
		"osgi.jaxrs.name=VecPublicWebContentApp"
	},
	service = Application.class
)
public class PublicArticleApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		Set<Object> singletons = new HashSet<>();

		singletons.add(new PublicArticleResource());

		return singletons;
	}

}
