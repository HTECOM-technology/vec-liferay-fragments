package vn.vec.custom.admin.backup;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"osgi.jaxrs.application.base=/vec-backup-admin",
		"osgi.jaxrs.name=VecBackupAdminApp"
	},
	service = Application.class
)
public class BackupAdminApplication extends Application {

	@Override
	public Set<Object> getSingletons() {
		Set<Object> singletons = new HashSet<>();

		singletons.add(new BackupAdminResource());

		return singletons;
	}

}
