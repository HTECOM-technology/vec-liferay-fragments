package vn.vec.custom.admin.audit.application;

import java.util.Collections;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"osgi.jaxrs.application.base=/vec-admin",
		"osgi.jaxrs.name=VecAuditLog"
	},
	service = Application.class
)
public class AuditLogApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		return Collections.emptySet();
	}

}
