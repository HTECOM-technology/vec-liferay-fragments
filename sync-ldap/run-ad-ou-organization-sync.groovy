import com.liferay.portal.kernel.module.util.SystemBundleUtil
import com.liferay.portal.kernel.util.PortalUtil

import org.osgi.framework.BundleContext
import org.osgi.framework.ServiceReference

// Chạy tại: Control Panel / Server Administration / Script / Groovy.
// Bước 1: chạy full LDAP import bằng cấu hình LDAP hiện tại của Liferay.
// Bước 2: chỉ sau khi LDAP import hoàn tất mới đồng bộ AD OU -> Organization.

final int BATCH_SIZE = 200
final boolean DRY_RUN = false
final String CONFIGURATION_PROVIDER_SERVICE_CLASS_NAME =
    "com.liferay.portal.security.ldap.configuration.ConfigurationProvider"
final String LDAP_IMPORT_CONFIGURATION_FACTORY_PID =
    "com.liferay.portal.security.ldap.exportimport.configuration." +
    "LDAPImportConfiguration"
final String LDAP_SERVER_CONFIGURATION_FACTORY_PID =
    "com.liferay.portal.security.ldap.configuration.LDAPServerConfiguration"
final String LDAP_IMPORTER_SERVICE_CLASS_NAME =
    "com.liferay.portal.security.ldap.exportimport.LDAPUserImporter"
final String AD_OU_SYNC_SERVICE_CLASS_NAME =
    "vn.vec.custom.admin.ldap.organization.ADOUOrganizationSyncService"

BundleContext bundleContext = SystemBundleUtil.getBundleContext()
ServiceReference[] ldapImportConfigurationServiceReferences =
    bundleContext.getServiceReferences(
        CONFIGURATION_PROVIDER_SERVICE_CLASS_NAME,
        "(factoryPid=" + LDAP_IMPORT_CONFIGURATION_FACTORY_PID + ")"
    )
ServiceReference[] ldapServerConfigurationServiceReferences =
    bundleContext.getServiceReferences(
        CONFIGURATION_PROVIDER_SERVICE_CLASS_NAME,
        "(factoryPid=" + LDAP_SERVER_CONFIGURATION_FACTORY_PID + ")"
    )
ServiceReference ldapImportConfigurationServiceReference =
    ldapImportConfigurationServiceReferences ?
        ldapImportConfigurationServiceReferences[0] : null
ServiceReference ldapServerConfigurationServiceReference =
    ldapServerConfigurationServiceReferences ?
        ldapServerConfigurationServiceReferences[0] : null
ServiceReference ldapImporterServiceReference =
    bundleContext.getServiceReference(LDAP_IMPORTER_SERVICE_CLASS_NAME)
ServiceReference adOuSyncServiceReference = bundleContext.getServiceReference(
    AD_OU_SYNC_SERVICE_CLASS_NAME
)

if (ldapImportConfigurationServiceReference == null) {
    throw new IllegalStateException(
        "Không tìm thấy ConfigurationProvider cho " +
        LDAP_IMPORT_CONFIGURATION_FACTORY_PID
    )
}

if (ldapServerConfigurationServiceReference == null) {
    throw new IllegalStateException(
        "Không tìm thấy ConfigurationProvider cho " +
        LDAP_SERVER_CONFIGURATION_FACTORY_PID
    )
}

if (ldapImporterServiceReference == null) {
    throw new IllegalStateException(
        "Không tìm thấy OSGi service " + LDAP_IMPORTER_SERVICE_CLASS_NAME +
        ". Hãy kiểm tra module LDAP của Liferay đang ACTIVE."
    )
}

if (adOuSyncServiceReference == null) {
    throw new IllegalStateException(
        "Không tìm thấy OSGi service " + AD_OU_SYNC_SERVICE_CLASS_NAME +
        ". Hãy kiểm tra bundle vn.vec.custom.admin.ui đã ACTIVE và đúng version."
    )
}

Object ldapImportConfigurationService = null
Object ldapServerConfigurationService = null
Object ldapImporterService = null
Object adOuSyncService = null

try {
    ldapImportConfigurationService = bundleContext.getService(
        ldapImportConfigurationServiceReference
    )
    ldapServerConfigurationService = bundleContext.getService(
        ldapServerConfigurationServiceReference
    )
    ldapImporterService = bundleContext.getService(
        ldapImporterServiceReference
    )
    adOuSyncService = bundleContext.getService(adOuSyncServiceReference)

    if (ldapImportConfigurationService == null) {
        throw new IllegalStateException(
            "Không lấy được LDAP import ConfigurationProvider instance."
        )
    }

    if (ldapServerConfigurationService == null) {
        throw new IllegalStateException(
            "Không lấy được LDAP server ConfigurationProvider instance."
        )
    }

    if (ldapImporterService == null) {
        throw new IllegalStateException(
            "OSGi service tồn tại nhưng không lấy được instance: " +
            LDAP_IMPORTER_SERVICE_CLASS_NAME
        )
    }

    if (adOuSyncService == null) {
        throw new IllegalStateException(
            "OSGi service tồn tại nhưng không lấy được instance: " +
            AD_OU_SYNC_SERVICE_CLASS_NAME
        )
    }

    long companyId = PortalUtil.getCompany(actionRequest).getCompanyId()
    def ldapImportConfiguration =
        ldapImportConfigurationService.getConfiguration(companyId)
    List ldapServerConfigurations =
        ldapServerConfigurationService.getConfigurations(companyId)

    out.println("=== PREFLIGHT ===")
    out.println("Company ID       : " + companyId)
    out.println("Import enabled   : " + ldapImportConfiguration.importEnabled())
    out.println("Import method    : " + ldapImportConfiguration.importMethod())
    out.println("LDAP server count: " + ldapServerConfigurations.size())

    if (!ldapImportConfiguration.importEnabled()) {
        throw new IllegalStateException(
            "LDAP Import đang Disabled. Hãy bật Enable Import trước khi chạy."
        )
    }

    if (!"user".equalsIgnoreCase(ldapImportConfiguration.importMethod())) {
        throw new IllegalStateException(
            "Import Method phải là 'user' để bảo đảm quét toàn bộ tài khoản AD. " +
            "Cấu hình hiện tại: " + ldapImportConfiguration.importMethod()
        )
    }

    if (ldapServerConfigurations.isEmpty()) {
        throw new IllegalStateException(
            "Company chưa có LDAP server configuration."
        )
    }

    List<String> ldapServersMissingDistinguishedNameMapping = []

    for (def ldapServerConfiguration : ldapServerConfigurations) {
        boolean hasDistinguishedNameMapping = false

        for (String mappings : ldapServerConfiguration.userCustomMappings()) {
            for (String mapping : mappings.split("\\|")) {
                int separatorIndex = mapping.indexOf("=")

                if (separatorIndex <= 0) {
                    continue
                }

                String customFieldName =
                    mapping.substring(0, separatorIndex).trim()
                String ldapAttributeName =
                    mapping.substring(separatorIndex + 1).trim()

                if (customFieldName == "adDistinguishedName" &&
                    ldapAttributeName.equalsIgnoreCase("distinguishedName")) {

                    hasDistinguishedNameMapping = true
                    break
                }
            }

            if (hasDistinguishedNameMapping) {
                break
            }
        }

        out.println(
            "LDAP server " + ldapServerConfiguration.ldapServerId() +
            " custom DN mapping: " + hasDistinguishedNameMapping
        )

        if (!hasDistinguishedNameMapping) {
            ldapServersMissingDistinguishedNameMapping.add(
                String.valueOf(ldapServerConfiguration.ldapServerId())
            )
        }
    }

    if (!ldapServersMissingDistinguishedNameMapping.isEmpty()) {
        throw new IllegalStateException(
            "Thiếu custom mapping adDistinguishedName=distinguishedName tại " +
            "LDAP server ID: " +
            ldapServersMissingDistinguishedNameMapping.join(", ")
        )
    }

    out.println("Preflight hợp lệ.")
    out.println("")

    long lastImportTimeBefore = ldapImporterService.getLastImportTime()

    out.println("=== STEP 1/2: FULL LDAP IMPORT ===")
    out.println("Company ID             : " + companyId)
    out.println("Last import time before: " + lastImportTimeBefore)
    out.println("")

    // Đây là lời gọi đồng bộ. Method chỉ trả về sau khi LDAP import hoàn tất.
    ldapImporterService.importUsers(companyId)

    long lastImportTimeAfter = ldapImporterService.getLastImportTime()

    out.println("Last import time after : " + lastImportTimeAfter)

    if (lastImportTimeAfter <= lastImportTimeBefore) {
        throw new IllegalStateException(
            "LDAP import không được khởi chạy. Không tiếp tục AD OU sync. " +
            "Hãy kiểm tra LDAP Import đang Enabled, LDAP server đã cấu hình, " +
            "kết nối AD và xem portal log để biết có import khác đang giữ lock hay không."
        )
    }

    out.println("Lời gọi LDAP import đã kết thúc.")
    out.println("Kiểm tra portal log để phát hiện lỗi import từng user/group.")
    out.println("")
    out.println("=== STEP 2/2: AD OU ORGANIZATION SYNC ===")
    out.println("Batch size: " + BATCH_SIZE)
    out.println("Dry run   : " + DRY_RUN)
    out.println("")

    def result = adOuSyncService.sync(BATCH_SIZE, DRY_RUN)

    out.println("=== DONE ===")
    out.println("Scanned        : " + result.scanned)
    out.println("Synced         : " + result.synced)
    out.println("Skipped        : " + result.skipped)
    out.println("  - Missing DN : " +
        result.skippedMissingDistinguishedName)
    out.println("  - DN no OU   : " + result.skippedWithoutOrganization)
    out.println("  - Up to date : " + result.skippedAlreadySynced)
    out.println("Dry-run actions: " + result.dryRunActions)
    out.println("Errors         : " + result.errors)
    out.println("")
    out.println(
        "Lưu ý: user thiếu custom field adDistinguishedName hoặc DN không có OU " +
        "sẽ nằm trong nhóm Skipped."
    )
}
finally {
    if (adOuSyncService != null) {
        bundleContext.ungetService(adOuSyncServiceReference)
    }

    if (ldapImporterService != null) {
        bundleContext.ungetService(ldapImporterServiceReference)
    }

    if (ldapServerConfigurationService != null) {
        bundleContext.ungetService(ldapServerConfigurationServiceReference)
    }

    if (ldapImportConfigurationService != null) {
        bundleContext.ungetService(ldapImportConfigurationServiceReference)
    }
}
