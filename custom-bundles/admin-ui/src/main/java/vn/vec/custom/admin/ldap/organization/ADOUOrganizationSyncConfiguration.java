package vn.vec.custom.admin.ldap.organization;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(
	id = "vn.vec.custom.admin.ldap.organization.ADOUOrganizationSyncConfiguration",
	name = "VEC AD OU Organization Sync"
)
public @interface ADOUOrganizationSyncConfiguration {

	@AttributeDefinition(name = "Enabled")
	public boolean enabled() default true;

	@AttributeDefinition(name = "Cron Expression")
	public String cronExpression() default "0 0/5 * * * ?";

	@AttributeDefinition(name = "Batch Size")
	public int batchSize() default 200;

	@AttributeDefinition(name = "Dry Run")
	public boolean dryRun() default false;

}
