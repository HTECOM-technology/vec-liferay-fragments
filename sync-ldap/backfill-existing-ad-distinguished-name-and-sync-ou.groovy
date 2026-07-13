import com.liferay.portal.kernel.module.util.SystemBundleUtil
import com.liferay.portal.kernel.model.User
import com.liferay.portal.kernel.search.IndexerRegistryUtil
import com.liferay.portal.kernel.service.UserLocalServiceUtil
import com.liferay.portal.kernel.util.PortalUtil

import java.util.ArrayList
import java.util.LinkedHashMap
import java.util.List
import java.util.Map

import javax.naming.Binding
import javax.naming.directory.Attribute
import javax.naming.directory.Attributes
import javax.naming.directory.SearchResult

import org.osgi.framework.BundleContext
import org.osgi.framework.ServiceReference

// Chạy tại: Control Panel / Server Administration / Script / Groovy.
// Chỉ cập nhật adDistinguishedName cho user Liferay đã tồn tại và đúng LDAP ID.
// Không tạo user mới, không thay đổi các thông tin profile khác.

final boolean DRY_RUN = false
final boolean RUN_AD_OU_SYNC_AFTER_BACKFILL = true
final boolean REINDEX_MATCHED_USERS_AFTER_AD_OU_SYNC = true
final int AD_OU_SYNC_BATCH_SIZE = 200
final int MAX_LOGGED_ACTIONS = 50

final String CONFIGURATION_PROVIDER_SERVICE_CLASS_NAME =
    "com.liferay.portal.security.ldap.configuration.ConfigurationProvider"
final String LDAP_SERVER_CONFIGURATION_FACTORY_PID =
    "com.liferay.portal.security.ldap.configuration.LDAPServerConfiguration"
final String SAFE_PORTAL_LDAP_SERVICE_CLASS_NAME =
    "com.liferay.portal.security.ldap.SafePortalLDAP"
final String AD_OU_SYNC_SERVICE_CLASS_NAME =
    "vn.vec.custom.admin.ldap.organization.ADOUOrganizationSyncService"

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

String getFirstAttributeValue(Attributes attributes, String attributeName) {
    if (attributes == null || !attributeName) {
        return ""
    }

    Attribute attribute = attributes.get(attributeName)

    if (attribute == null || attribute.size() == 0) {
        return ""
    }

    Object value = attribute.get()

    return value == null ? "" : String.valueOf(value).trim()
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
ServiceReference adOuSyncServiceReference = bundleContext.getServiceReference(
    AD_OU_SYNC_SERVICE_CLASS_NAME
)

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

if (RUN_AD_OU_SYNC_AFTER_BACKFILL && adOuSyncServiceReference == null) {
    throw new IllegalStateException(
        "Không tìm thấy OSGi service " + AD_OU_SYNC_SERVICE_CLASS_NAME
    )
}

Object ldapServerConfigurationService = null
Object safePortalLdapService = null
Object adOuSyncService = null

try {
    ldapServerConfigurationService = bundleContext.getService(
        ldapServerConfigurationServiceReference
    )
    safePortalLdapService = bundleContext.getService(
        safePortalLdapServiceReference
    )

    if (RUN_AD_OU_SYNC_AFTER_BACKFILL) {
        adOuSyncService = bundleContext.getService(adOuSyncServiceReference)
    }

    if (ldapServerConfigurationService == null ||
        safePortalLdapService == null) {

        throw new IllegalStateException(
            "Không lấy được LDAP ConfigurationProvider/SafePortalLDAP instance."
        )
    }

    if (RUN_AD_OU_SYNC_AFTER_BACKFILL && adOuSyncService == null) {
        throw new IllegalStateException(
            "Không lấy được AD OU Organization Sync service instance."
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

    if (ldapServerConfigurations.isEmpty()) {
        throw new IllegalStateException(
            "Company chưa có LDAP server configuration."
        )
    }

    out.println("=== BACKFILL EXISTING USER AD DISTINGUISHED NAME ===")
    out.println("Company ID                  : " + companyId)
    out.println("LDAP server count           : " +
        ldapServerConfigurations.size())
    out.println("Dry run                     : " + DRY_RUN)
    out.println("Run AD OU sync after backfill: " +
        RUN_AD_OU_SYNC_AFTER_BACKFILL)
    out.println("Reindex users after AD OU sync: " +
        REINDEX_MATCHED_USERS_AFTER_AD_OU_SYNC)
    out.println("")

    int totalAdUsersScanned = 0
    int totalMatched = 0
    int totalUpdated = 0
    int totalWouldUpdate = 0
    int totalUnchanged = 0
    int totalMissingDn = 0
    int totalNotFound = 0
    int totalLdapServerMismatch = 0
    int totalMissingCustomField = 0
    int totalFailed = 0
    int loggedActions = 0
    Map<Long, User> matchedLiferayUsers = new LinkedHashMap<Long, User>()

    for (def ldapServerConfiguration : ldapServerConfigurations) {
        long ldapServerId = ldapServerConfiguration.ldapServerId()
        Map<String, String> userMappings = parseMappings(
            ldapServerConfiguration.userMappings()
        )
        Map<String, String> customMappings = parseMappings(
            ldapServerConfiguration.userCustomMappings()
        )

        String screenNameAttribute = userMappings.get("screenName") ?: "cn"
        String emailAttribute = userMappings.get("emailAddress") ?: "mail"
        String distinguishedNameAttribute =
            customMappings.get("adDistinguishedName")

        if (!distinguishedNameAttribute) {
            throw new IllegalStateException(
                "LDAP server " + ldapServerId +
                " thiếu mapping adDistinguishedName=distinguishedName."
            )
        }

        out.println("--- LDAP SERVER " + ldapServerId + " ---")
        out.println("User search filter: " +
            ldapServerConfiguration.userSearchFilter())
        out.println("DN attribute      : " + distinguishedNameAttribute)

        def safeLdapContext = safePortalLdapService.getSafeLdapContext(
            ldapServerId, companyId
        )

        if (safeLdapContext == null) {
            throw new IllegalStateException(
                "Không kết nối được LDAP server " + ldapServerId
            )
        }

        byte[] cookie = new byte[0]
        int serverScanned = 0
        int serverUpdated = 0
        int serverUnchanged = 0
        int serverSkipped = 0
        int serverFailed = 0

        try {
            while (cookie != null) {
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

                for (SearchResult searchResult : searchResults) {
                    serverScanned++
                    totalAdUsersScanned++

                    try {
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
                        String screenName = getFirstAttributeValue(
                            attributes, screenNameAttribute
                        )
                        String emailAddress = getFirstAttributeValue(
                            attributes, emailAttribute
                        )
                        String distinguishedName = getFirstAttributeValue(
                            attributes, distinguishedNameAttribute
                        )

                        if (!distinguishedName) {
                            totalMissingDn++
                            serverSkipped++
                            continue
                        }

                        User liferayUser = findLiferayUser(
                            companyId, screenName, emailAddress
                        )

                        if (liferayUser == null) {
                            totalNotFound++
                            serverSkipped++
                            continue
                        }

                        totalMatched++

                        if (liferayUser.getLdapServerId() != ldapServerId) {
                            totalLdapServerMismatch++
                            serverSkipped++

                            if (loggedActions < MAX_LOGGED_ACTIONS) {
                                loggedActions++
                                out.println(
                                    "SKIP LDAP ID mismatch: userId=" +
                                    liferayUser.getUserId() + ", screenName=" +
                                    liferayUser.getScreenName() +
                                    ", expected=" + ldapServerId +
                                    ", actual=" +
                                    liferayUser.getLdapServerId()
                                )
                            }

                            continue
                        }

                        matchedLiferayUsers.put(
                            liferayUser.getUserId(), liferayUser
                        )

                        def expandoBridge = liferayUser.getExpandoBridge()

                        if (!expandoBridge.hasAttribute(
                                "adDistinguishedName")) {

                            totalMissingCustomField++
                            serverSkipped++
                            continue
                        }

                        Object currentValue = expandoBridge.getAttribute(
                            "adDistinguishedName", false
                        )
                        String currentDistinguishedName =
                            currentValue == null ? "" :
                                String.valueOf(currentValue).trim()

                        if (currentDistinguishedName == distinguishedName) {
                            totalUnchanged++
                            serverUnchanged++
                            continue
                        }

                        if (DRY_RUN) {
                            totalWouldUpdate++

                            if (loggedActions < MAX_LOGGED_ACTIONS) {
                                loggedActions++
                                out.println(
                                    "WOULD UPDATE: userId=" +
                                    liferayUser.getUserId() +
                                    ", screenName=" +
                                    liferayUser.getScreenName()
                                )
                            }

                            continue
                        }

                        expandoBridge.setAttribute(
                            "adDistinguishedName", distinguishedName, false
                        )

                        String savedValue = String.valueOf(
                            expandoBridge.getAttribute(
                                "adDistinguishedName", false
                            )
                        ).trim()

                        if (savedValue != distinguishedName) {
                            throw new IllegalStateException(
                                "Không xác minh được custom field sau khi ghi"
                            )
                        }

                        totalUpdated++
                        serverUpdated++

                        if (loggedActions < MAX_LOGGED_ACTIONS) {
                            loggedActions++
                            out.println(
                                "UPDATED: userId=" +
                                liferayUser.getUserId() + ", screenName=" +
                                liferayUser.getScreenName()
                            )
                        }
                    }
                    catch (Exception userException) {
                        totalFailed++
                        serverFailed++

                        if (loggedActions < MAX_LOGGED_ACTIONS) {
                            loggedActions++
                            out.println(
                                "FAIL: " + userException.getClass().getName() +
                                ": " + userException.getMessage()
                            )
                        }
                    }
                }
            }
        }
        finally {
            safeLdapContext.close()
        }

        out.println("Server scanned  : " + serverScanned)
        out.println("Server updated  : " + serverUpdated)
        out.println("Server unchanged: " + serverUnchanged)
        out.println("Server skipped  : " + serverSkipped)
        out.println("Server failed   : " + serverFailed)
        out.println("")
    }

    out.println("=== BACKFILL SUMMARY ===")
    out.println("AD users scanned          : " + totalAdUsersScanned)
    out.println("Matched Liferay users     : " + totalMatched)
    out.println("Updated                   : " + totalUpdated)
    out.println("Would update              : " + totalWouldUpdate)
    out.println("Already up to date        : " + totalUnchanged)
    out.println("AD DN missing             : " + totalMissingDn)
    out.println("Liferay user not found    : " + totalNotFound)
    out.println("LDAP server ID mismatch   : " + totalLdapServerMismatch)
    out.println("Custom field missing      : " + totalMissingCustomField)
    out.println("Failed                    : " + totalFailed)
    out.println("")

    if (DRY_RUN) {
        out.println(
            "DRY RUN: không ghi custom field và không chạy AD OU sync."
        )
    }
    else if (RUN_AD_OU_SYNC_AFTER_BACKFILL) {
        out.println("=== AD OU ORGANIZATION SYNC ===")

        def result = adOuSyncService.sync(AD_OU_SYNC_BATCH_SIZE, false)

        out.println("Scanned: " + result.scanned)
        out.println("Synced : " + result.synced)
        out.println("Skipped: " + result.skipped)
        out.println("  - Missing DN: " +
            result.skippedMissingDistinguishedName)
        out.println("  - DN no OU  : " +
            result.skippedWithoutOrganization)
        out.println("  - Up to date: " + result.skippedAlreadySynced)
        out.println("Errors : " + result.errors)

        if (REINDEX_MATCHED_USERS_AFTER_AD_OU_SYNC &&
            !matchedLiferayUsers.isEmpty()) {

            def userIndexer = IndexerRegistryUtil.nullSafeGetIndexer(
                User.class
            )

            userIndexer.reindex(matchedLiferayUsers.values())

            out.println(
                "Reindexed matched LDAP users: " +
                matchedLiferayUsers.size()
            )
        }
    }

    out.println("=== DONE ===")
}
finally {
    if (adOuSyncService != null) {
        bundleContext.ungetService(adOuSyncServiceReference)
    }

    if (safePortalLdapService != null) {
        bundleContext.ungetService(safePortalLdapServiceReference)
    }

    if (ldapServerConfigurationService != null) {
        bundleContext.ungetService(ldapServerConfigurationServiceReference)
    }
}
