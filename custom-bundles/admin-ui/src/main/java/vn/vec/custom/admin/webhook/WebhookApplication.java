package vn.vec.custom.admin.webhook;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"osgi.jaxrs.application.base=/vec-webhook",
		"osgi.jaxrs.name=VecWebhookApp"
	},
	service = Application.class
)
public class WebhookApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		Set<Object> singletons = new HashSet<>();

		singletons.add(new WebhookResource());
		singletons.add(new ConversationResource());

		return singletons;
	}
}
