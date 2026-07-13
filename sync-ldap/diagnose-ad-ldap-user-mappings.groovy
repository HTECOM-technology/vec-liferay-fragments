import com.liferay.portal.kernel.module.util.SystemBundleUtil
import com.liferay.portal.kernel.model.User
import com.liferay.portal.kernel.service.UserLocalServiceUtil
import com.liferay.portal.kernel.util.PortalUtil

import java.util.ArrayList
import java.util.LinkedHashMap
import java.util.List
import java.util.Map

import javax.naming.NamingEnumeration
import javax.naming.Binding
import javax.naming.directory.Attribute
import javax.naming.directory.Attributes
import javax.naming.directory.SearchResult
import javax.naming.ldap.LdapName
import javax.naming.ldap.Rdn

import org.osgi.framework.BundleContext
import org.osgi.framework.ServiceReference

// Chạy tại: Control Panel / Server Administration / Script / Groovy.
// Script chỉ đọc cấu hình, AD và Liferay; không cập nhật dữ liệu.

final int MAX_LOGGED_USERS_PER_SERVER = 30
final int MAX_VALUES_PER_ATTRIBUTE = 5
final int MAX_VALUE_LENGTH = 300

final String CONFIGURATION_PROVIDER_SERVICE_CLASS_NAME =
    "com.liferay.portal.security.ldap.configuration.ConfigurationProvider"
final String LDAP_SERVER_CONFIGURATION_FACTORY_PID =
    "com.liferay.portal.security.ldap.configuration.LDAPServerConfiguration"
final String SAFE_PORTAL_LDAP_SERVICE_CLASS_NAME =
    "com.liferay.portal.security.ldap.SafePortalLDAP"

Map<String, String> parseMappings(String[] mappingGroups) {
    Map<String, String> mappings = new LinkedHashMap<String, String>()

    if (mappingGroups == null) {
        return mappings
    }

    for (String mappingGroup : mappingGroups) {
        if (!mappingGroup) {
            continue
        }

        for (String mapping : mappingGroup.split("\\|")) {
            int separatorIndex = mapping.indexOf("=")

            if (separatorIndex <= 0) {
                continue
            }

            String portalField = mapping.substring(0, separatorIndex).trim()
            String ldapAttribute = mapping.substring(separatorIndex + 1).trim()

            if (portalField && ldapAttribute) {
                mappings.put(portalField, ldapAttribute)
            }
        }
    }

    return mappings
}

boolean isSensitiveMapping(String portalField, String ldapAttribute) {
    String value = ((portalField ?: "") + " " +
        (ldapAttribute ?: "")).toLowerCase()

    return value.contains("password") || value.contains("credential") ||
        value.contains("secret")
}

String formatValue(Object value, int maxLength) {
    if (value == null) {
        return "<null>"
    }

    if (value instanceof byte[]) {
        return "<binary " + ((byte[])value).length + " bytes>"
    }

    String text = String.valueOf(value).replaceAll("[\\r\\n\\t]+", " ")

    if (text.length() > maxLength) {
        return text.substring(0, maxLength) + "..."
    }

    return text
}

List<String> getAttributeValues(
    Attributes attributes,
    String attributeName,
    int maxValues,
    int maxLength
) {
    List<String> values = []

    if (attributes == null || !attributeName) {
        return values
    }

    Attribute attribute = attributes.get(attributeName)

    if (attribute == null) {
        return values
    }

    NamingEnumeration enumeration = null

    try {
        enumeration = attribute.getAll()

        while (enumeration.hasMore() && values.size() < maxValues) {
            values.add(formatValue(enumeration.next(), maxLength))
        }

        if (attribute.size() > maxValues) {
            values.add("... +" + (attribute.size() - maxValues) + " values")
        }
    }
    finally {
        try {
            enumeration?.close()
        }
        catch (Exception ignored) {
        }
    }

    return values
}

String getFirstAttributeValue(Attributes attributes, String attributeName) {
    List<String> values = getAttributeValues(attributes, attributeName, 1, 2000)

    if (values.isEmpty()) {
        return ""
    }

    return values[0]
}

String getCustomField(User user, String fieldName) {
    if (user == null || !user.getExpandoBridge().hasAttribute(fieldName)) {
        return ""
    }

    Object value = user.getExpandoBridge().getAttribute(fieldName, false)

    return value == null ? "" : String.valueOf(value).trim()
}

String toOrganizationPath(String distinguishedName) {
    if (!distinguishedName) {
        return ""
    }

    LdapName ldapName = new LdapName(distinguishedName)
    List<String> organizationNames = []

    for (Rdn rdn : ldapName.getRdns()) {
        if (!"OU".equalsIgnoreCase(rdn.getType())) {
            continue
        }

        String value = String.valueOf(rdn.getValue()).trim()

        if (value) {
            organizationNames.add(value)
        }
    }

    return organizationNames.join("/")
}

User findLiferayUser(long companyId, String screenName, String emailAddress) {
    User user = null

    if (screenName) {
        user = UserLocalServiceUtil.fetchUserByScreenName(companyId, screenName)
    }

    if (user == null && emailAddress) {
        user = UserLocalServiceUtil.fetchUserByEmailAddress(
            companyId, emailAddress
        )
    }

    return user
}

BundleContext bundleContext = SystemBundleUtil.getBundleContext()
ServiceReference[] ldapServerConfigurationServiceReferences =
    bundleContext.getServiceReferences(
        CONFIGURATION_PROVIDER_SERVICE_CLASS_NAME,
        "(factoryPid=" + LDAP_SERVER_CONFIGURATION_FACTORY_PID + ")"
    )
ServiceReference ldapServerConfigurationServiceReference =
    ldapServerConfigurationServiceReferences ?
        ldapServerConfigurationServiceReferences[0] : null
ServiceReference safePortalLdapServiceReference =
    bundleContext.getServiceReference(SAFE_PORTAL_LDAP_SERVICE_CLASS_NAME)

if (ldapServerConfigurationServiceReference == null) {
    throw new IllegalStateException(
        "Không tìm thấy ConfigurationProvider cho " +
        LDAP_SERVER_CONFIGURATION_FACTORY_PID
    )
}

if (safePortalLdapServiceReference == null) {
    throw new IllegalStateException(
        "Không tìm thấy OSGi service " + SAFE_PORTAL_LDAP_SERVICE_CLASS_NAME
    )
}

Object ldapServerConfigurationService = null
Object safePortalLdapService = null

try {
    ldapServerConfigurationService = bundleContext.getService(
        ldapServerConfigurationServiceReference
    )
    safePortalLdapService = bundleContext.getService(
        safePortalLdapServiceReference
    )

    if (ldapServerConfigurationService == null ||
        safePortalLdapService == null) {

        throw new IllegalStateException(
            "Không lấy được LDAP ConfigurationProvider/SafePortalLDAP instance."
        )
    }

    Class safeLdapNameFactoryClass =
        safePortalLdapService.getClass().getClassLoader().loadClass(
            "com.liferay.portal.security.ldap.SafeLdapNameFactory"
        )
    def safeLdapNameFromBindingMethod =
        safeLdapNameFactoryClass.getMethod("from", Binding.class)

    long companyId = PortalUtil.getCompany(actionRequest).getCompanyId()
    List ldapServerConfigurations =
        ldapServerConfigurationService.getConfigurations(companyId) ?: []

    out.println("=== LDAP USER MAPPING DIAGNOSTIC ===")
    out.println("Company ID                 : " + companyId)
    out.println("LDAP server count          : " +
        ldapServerConfigurations.size())
    out.println("Max logged users per server: " +
        MAX_LOGGED_USERS_PER_SERVER)
    out.println("Read only                  : true")
    out.println("")

    if (ldapServerConfigurations.isEmpty()) {
        throw new IllegalStateException(
            "Company chưa có LDAP server configuration."
        )
    }

    for (def ldapServerConfiguration : ldapServerConfigurations) {
        long ldapServerId = ldapServerConfiguration.ldapServerId()
        Map<String, String> userMappings = parseMappings(
            ldapServerConfiguration.userMappings()
        )
        Map<String, String> customMappings = parseMappings(
            ldapServerConfiguration.userCustomMappings()
        )
        Map<String, String> allMappings =
            new LinkedHashMap<String, String>()

        allMappings.putAll(userMappings)
        allMappings.putAll(customMappings)

        String screenNameAttribute = userMappings.get("screenName") ?: "cn"
        String emailAttribute = userMappings.get("emailAddress") ?: "mail"
        String distinguishedNameAttribute =
            customMappings.get("adDistinguishedName") ?:
                "distinguishedName"

        out.println("=== LDAP SERVER " + ldapServerId + " ===")
        out.println("Server name       : " +
            ldapServerConfiguration.serverName())
        out.println("Base provider URL : " +
            ldapServerConfiguration.baseProviderURL())
        out.println("Base DN           : " + ldapServerConfiguration.baseDN())
        out.println("User search filter: " +
            ldapServerConfiguration.userSearchFilter())
        out.println("")
        out.println("--- EFFECTIVE USER MAPPINGS (Liferay <- LDAP) ---")

        for (def mapping : allMappings.entrySet()) {
            out.println(
                mapping.getKey() + " <- " + mapping.getValue() +
                (isSensitiveMapping(mapping.getKey(), mapping.getValue()) ?
                    " [VALUE REDACTED]" : "")
            )
        }

        out.println("")

        def safeLdapContext = safePortalLdapService.getSafeLdapContext(
            ldapServerId, companyId
        )

        if (safeLdapContext == null) {
            out.println("ERROR - Không kết nối được LDAP server " + ldapServerId)
            out.println("")
            continue
        }

        byte[] cookie = new byte[0]
        int page = 0
        int scanned = 0
        int logged = 0
        int rawAdDnPresent = 0
        int rawAdDnMissing = 0
        int ldapDnPresent = 0
        int ldapDnMissing = 0
        int modifyTimestampPresent = 0
        int modifyTimestampMissing = 0
        int dnWithOu = 0
        int dnWithoutOu = 0
        int liferayMatched = 0
        int liferayNotMatched = 0
        int liferayDnPresent = 0
        int liferayDnMissing = 0
        int liferayDnDifferent = 0
        int ouPathAlreadySynced = 0
        int ouPathNeedsSync = 0
        int failed = 0

        try {
            while (cookie != null) {
                page++

                List<SearchResult> searchResults = new ArrayList<SearchResult>()

                cookie = safePortalLdapService.getUsers(
                    ldapServerId,
                    companyId,
                    safeLdapContext,
                    cookie,
                    0,
                    [screenNameAttribute] as String[],
                    searchResults
                )

                out.println(
                    "--- PAGE " + page + " | users=" +
                    searchResults.size() + " ---"
                )

                for (SearchResult searchResult : searchResults) {
                    scanned++

                    try {
                        String searchDn = searchResult.getNameInNamespace()
                        def safeUserLdapName =
                            safeLdapNameFromBindingMethod.invoke(
                                null, searchResult
                            )
                        Attributes attributes =
                            safePortalLdapService.getUserAttributes(
                                ldapServerId,
                                companyId,
                                safeLdapContext,
                                safeUserLdapName
                            )
                        Attributes rawDiagnosticAttributes =
                            safeLdapContext.getAttributes(
                                safeUserLdapName,
                                [
                                    "distinguishedName",
                                    "modifyTimestamp",
                                    "whenChanged",
                                    "sAMAccountName",
                                    "userPrincipalName",
                                    "mail"
                                ] as String[]
                            )
                        String screenName = getFirstAttributeValue(
                            attributes, screenNameAttribute
                        )
                        String emailAddress = getFirstAttributeValue(
                            attributes, emailAttribute
                        )
                        String ldapDistinguishedName = getFirstAttributeValue(
                            attributes, distinguishedNameAttribute
                        )
                        String rawDistinguishedName = getFirstAttributeValue(
                            rawDiagnosticAttributes, "distinguishedName"
                        )
                        String modifyTimestamp = getFirstAttributeValue(
                            attributes, "modifyTimestamp"
                        )
                        String whenChanged = getFirstAttributeValue(
                            rawDiagnosticAttributes, "whenChanged"
                        )
                        String organizationPath = ""

                        if (rawDistinguishedName) {
                            rawAdDnPresent++
                        }
                        else {
                            rawAdDnMissing++
                        }

                        if (modifyTimestamp) {
                            modifyTimestampPresent++
                        }
                        else {
                            modifyTimestampMissing++
                        }

                        if (ldapDistinguishedName) {
                            ldapDnPresent++

                            organizationPath = toOrganizationPath(
                                ldapDistinguishedName
                            )

                            if (organizationPath) {
                                dnWithOu++
                            }
                            else {
                                dnWithoutOu++
                            }
                        }
                        else {
                            ldapDnMissing++
                        }

                        User liferayUser = findLiferayUser(
                            companyId, screenName, emailAddress
                        )
                        String savedDistinguishedName = ""
                        String savedOrganizationPath = ""

                        if (liferayUser == null) {
                            liferayNotMatched++
                        }
                        else {
                            liferayMatched++
                            savedDistinguishedName = getCustomField(
                                liferayUser, "adDistinguishedName"
                            )
                            savedOrganizationPath = getCustomField(
                                liferayUser, "adSyncedOrganizationPath"
                            )

                            if (savedDistinguishedName) {
                                liferayDnPresent++
                            }
                            else {
                                liferayDnMissing++
                            }

                            if (ldapDistinguishedName &&
                                savedDistinguishedName !=
                                    ldapDistinguishedName) {

                                liferayDnDifferent++
                            }

                            if (organizationPath) {
                                if (organizationPath == savedOrganizationPath) {
                                    ouPathAlreadySynced++
                                }
                                else {
                                    ouPathNeedsSync++
                                }
                            }
                        }

                        if (logged < MAX_LOGGED_USERS_PER_SERVER) {
                            logged++

                            out.println("USER #" + scanned)
                            out.println("  search DN       : " + searchDn)
                            out.println("  raw AD DN       : " +
                                (rawDistinguishedName ?: "<EMPTY>"))
                            out.println("  mapped screen   : " + screenName)
                            out.println("  mapped email    : " + emailAddress)
                            out.println("  mapped AD DN    : " +
                                (ldapDistinguishedName ?: "<EMPTY>"))
                            out.println("  modifyTimestamp : " +
                                (modifyTimestamp ?: "<EMPTY>"))
                            out.println("  whenChanged     : " +
                                (whenChanged ?: "<EMPTY>"))
                            out.println("  derived OU path : " +
                                (organizationPath ?: "<EMPTY>"))

                            for (def mapping : allMappings.entrySet()) {
                                if (isSensitiveMapping(
                                        mapping.getKey(), mapping.getValue())) {

                                    continue
                                }

                                List<String> values = getAttributeValues(
                                    attributes,
                                    mapping.getValue(),
                                    MAX_VALUES_PER_ATTRIBUTE,
                                    MAX_VALUE_LENGTH
                                )

                                out.println(
                                    "  map " + mapping.getKey() + " <- " +
                                    mapping.getValue() + " : " +
                                    (values.isEmpty() ? "<EMPTY>" :
                                        values.join(" | "))
                                )
                            }

                            if (liferayUser == null) {
                                out.println("  Liferay match    : <NOT FOUND>")
                            }
                            else {
                                out.println("  Liferay userId  : " +
                                    liferayUser.getUserId())
                                out.println("  Liferay LDAP ID : " +
                                    liferayUser.getLdapServerId())
                                out.println("  saved AD DN     : " +
                                    (savedDistinguishedName ?: "<EMPTY>"))
                                out.println("  saved OU path  : " +
                                    (savedOrganizationPath ?: "<EMPTY>"))
                            }

                            out.println("")
                        }
                    }
                    catch (Exception userException) {
                        failed++

                        if (logged < MAX_LOGGED_USERS_PER_SERVER) {
                            logged++
                            out.println(
                                "FAIL user #" + scanned + " - " +
                                userException.getClass().getName() + ": " +
                                userException.getMessage()
                            )
                        }
                    }
                }
            }
        }
        finally {
            safeLdapContext.close()
        }

        out.println("--- SUMMARY LDAP SERVER " + ldapServerId + " ---")
        out.println("AD users scanned           : " + scanned)
        out.println("Raw AD DN set              : " + rawAdDnPresent)
        out.println("Raw AD DN empty            : " + rawAdDnMissing)
        out.println("Mapped AD DN set           : " + ldapDnPresent)
        out.println("Mapped AD DN empty         : " + ldapDnMissing)
        out.println("modifyTimestamp set        : " +
            modifyTimestampPresent)
        out.println("modifyTimestamp empty      : " +
            modifyTimestampMissing)
        out.println("DN with OU                  : " + dnWithOu)
        out.println("DN without OU               : " + dnWithoutOu)
        out.println("Matched Liferay users       : " + liferayMatched)
        out.println("Unmatched Liferay users     : " + liferayNotMatched)
        out.println("Liferay saved AD DN set     : " + liferayDnPresent)
        out.println("Liferay saved AD DN empty   : " + liferayDnMissing)
        out.println("LDAP/Liferay DN different   : " + liferayDnDifferent)
        out.println("OU path already synced      : " + ouPathAlreadySynced)
        out.println("OU path needs sync          : " + ouPathNeedsSync)
        out.println("Failed                      : " + failed)

        if (rawAdDnPresent > 0 && ldapDnPresent == 0) {
            out.println(
                "DIAGNOSIS: AD có distinguishedName nhưng mapping của " +
                "Liferay không đọc được giá trị."
            )
        }

        if (ldapDnPresent > 0 && liferayDnPresent == 0) {
            out.println(
                "DIAGNOSIS: LDAP importer đã nhận được distinguishedName " +
                "nhưng chưa lưu vào custom field adDistinguishedName."
            )
        }

        if (modifyTimestampMissing > 0) {
            out.println(
                "DIAGNOSIS: Có user thiếu modifyTimestamp; Liferay có thể " +
                "bỏ qua cập nhật user đã tồn tại. So sánh thêm whenChanged " +
                "trong log mẫu."
            )
        }

        if (liferayMatched > 0 &&
            ouPathAlreadySynced == liferayMatched) {

            out.println(
                "DIAGNOSIS: Toàn bộ user khớp đã có adSyncedOrganizationPath " +
                "bằng OU path hiện tại; ADOUOrganizationSyncService skipped " +
                "là đúng thiết kế."
            )
        }

        out.println("")
    }

    out.println("=== DIAGNOSTIC DONE ===")
}
finally {
    if (safePortalLdapService != null) {
        bundleContext.ungetService(safePortalLdapServiceReference)
    }

    if (ldapServerConfigurationService != null) {
        bundleContext.ungetService(ldapServerConfigurationServiceReference)
    }
}
