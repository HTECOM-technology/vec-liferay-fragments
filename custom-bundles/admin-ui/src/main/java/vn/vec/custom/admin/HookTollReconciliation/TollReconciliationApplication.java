package vn.vec.custom.admin.HookTollReconciliation;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

/** JAX-RS Whiteboard application cho hook Đối soát thu phí. */
@Component(
	property = {
		"auth.verifier.guest.allowed=true",
		"liferay.access.control.disable=true",
		"osgi.jaxrs.application.base=/toll-reconciliation",
		"osgi.jaxrs.name=Vec.Toll.Reconciliation"
	},
	service = Application.class
)
public class TollReconciliationApplication extends Application {
}
