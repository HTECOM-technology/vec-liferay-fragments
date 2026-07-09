package vn.vec.custom.admin.ldap.organization;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.naming.InvalidNameException;
import javax.naming.ldap.LdapName;
import javax.naming.ldap.Rdn;

public class ADDistinguishedNameUtil {

	public static String toOrganizationPath(String distinguishedName)
		throws InvalidNameException {

		return String.join("/", toOrganizationNames(distinguishedName));
	}

	public static List<String> toOrganizationNames(String distinguishedName)
		throws InvalidNameException {

		if ((distinguishedName == null) || distinguishedName.trim().isEmpty()) {
			return Collections.emptyList();
		}

		LdapName ldapName = new LdapName(distinguishedName);
		List<String> organizationNames = new ArrayList<>();

		for (Rdn rdn : ldapName.getRdns()) {
			if (!"OU".equalsIgnoreCase(rdn.getType())) {
				continue;
			}

			Object value = rdn.getValue();

			if (value == null) {
				continue;
			}

			String organizationName = String.valueOf(value).trim();

			if (!organizationName.isEmpty()) {
				organizationNames.add(organizationName);
			}
		}

		return organizationNames;
	}

	private ADDistinguishedNameUtil() {
	}

}
