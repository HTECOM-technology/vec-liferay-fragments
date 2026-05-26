import com.liferay.portal.kernel.model.User
import com.liferay.portal.kernel.model.role.RoleConstants
import com.liferay.portal.kernel.service.OrganizationLocalServiceUtil
import com.liferay.portal.kernel.service.RoleLocalServiceUtil
import com.liferay.portal.kernel.service.ServiceContext
import com.liferay.portal.kernel.service.UserGroupLocalServiceUtil
import com.liferay.portal.kernel.service.UserLocalServiceUtil
import com.liferay.portal.kernel.util.PortalUtil
import com.liferay.portal.kernel.workflow.WorkflowConstants

import java.util.Calendar
import java.util.Hashtable
import java.util.LinkedHashSet
import java.util.Locale

import javax.naming.Context
import javax.naming.NamingEnumeration
import javax.naming.PartialResultException
import javax.naming.directory.Attribute
import javax.naming.directory.Attributes
import javax.naming.directory.SearchControls
import javax.naming.directory.SearchResult
import javax.naming.ldap.Control
import javax.naming.ldap.InitialLdapContext
import javax.naming.ldap.PagedResultsControl
import javax.naming.ldap.PagedResultsResponseControl

// ============================================================
// CONFIG
// ============================================================
final String AD_URL = "ldap://10.2.18.2:389"
final String AD_BIND_DN = "VEC\\portal_ldap"
final String AD_BIND_PASSWORD = "Vec@1234"
final String AD_BASE_DN = "DC=vec,DC=vn"

// Lấy toàn bộ user AD, kể cả disabled để còn deactivate/reactivate
final String AD_FILTER =
    "(&(objectCategory=person)(objectClass=user)(!(objectClass=computer))(sAMAccountName=*))"

final String DEFAULT_LANGUAGE_ID = "vi_VN"
final int PAGE_SIZE = 500

// Nếu AD disabled mà user chưa tồn tại trong Liferay thì bỏ qua, không create
final boolean SKIP_CREATE_IF_AD_DISABLED = true

// Cho phép auto create target ở Liferay nếu chưa có
final boolean CREATE_MISSING_ORGANIZATIONS = true
final boolean CREATE_MISSING_REGULAR_ROLES = true
final boolean CREATE_MISSING_USERGROUPS = true

// Bật/tắt sync từng loại membership
final boolean SYNC_MANAGED_ORGANIZATIONS = true
final boolean SYNC_MANAGED_REGULAR_ROLES = true
final boolean SYNC_MANAGED_USERGROUPS = true

// -----------------------------------------------------------------
// MAP RULES
// Chỉ các target khai báo trong các map này mới bị add/remove bởi script
// -----------------------------------------------------------------

// Map từ AD department -> Liferay Organization name
final Map<String, List<String>> ORG_BY_DEPARTMENT = [:]
// Ví dụ:
// ORG_BY_DEPARTMENT["CNTT"] = ["Ban CNTT"]
// ORG_BY_DEPARTMENT["Kế toán"] = ["Phòng Kế toán"]

// Map từ AD title -> Liferay Regular Role name
final Map<String, List<String>> ROLE_BY_TITLE = [:]
// Ví dụ:
// ROLE_BY_TITLE["Trưởng ban"] = ["Portal Manager"]
// ROLE_BY_TITLE["Biên tập viên"] = ["News Editor"]

// Map từ AD memberOf CN -> Liferay Organization name
final Map<String, List<String>> ORG_BY_AD_GROUP_CN = [:]
// Ví dụ:
// ORG_BY_AD_GROUP_CN["GG_BAN_CNTT"] = ["Ban CNTT"]

// Map từ AD memberOf CN -> Liferay Regular Role name
final Map<String, List<String>> ROLE_BY_AD_GROUP_CN = [:]
// Ví dụ:
// ROLE_BY_AD_GROUP_CN["PORTAL_ADMIN"] = ["Administrator"]
// ROLE_BY_AD_GROUP_CN["PORTAL_EDITOR"] = ["News Editor"]

// Map từ AD memberOf CN -> Liferay UserGroup name
final Map<String, List<String>> USERGROUP_BY_AD_GROUP_CN = [:]
// Ví dụ:
// USERGROUP_BY_AD_GROUP_CN["PORTAL_NEWS_TEAM"] = ["News Team"]

// ============================================================
// HELPERS
// ============================================================
String getAttr(Attributes attrs, String name) {
    Attribute attr = attrs.get(name)
    if (attr == null) {
        return null
    }

    def value = attr.get()
    if (value == null) {
        return null
    }

    String s = String.valueOf(value).trim()
    return s ? s : null
}

List<String> getAttrValues(Attributes attrs, String name) {
    List<String> values = []

    Attribute attr = attrs.get(name)
    if (attr == null) {
        return values
    }

    NamingEnumeration all = null

    try {
        all = attr.getAll()

        while (all.hasMore()) {
            def value = all.next()

            if (value != null) {
                String s = String.valueOf(value).trim()

                if (s) {
                    values.add(s)
                }
            }
        }
    }
    finally {
        try {
            all?.close()
        }
        catch (Exception ignored) {
        }
    }

    return values
}

byte[] getAttrBytes(Attributes attrs, String name) {
    Attribute attr = attrs.get(name)
    if (attr == null) {
        return null
    }

    def value = attr.get()
    if (value instanceof byte[]) {
        return (byte[]) value
    }

    return null
}

String toHex(byte b) {
    return String.format("%02x", b & 0xff)
}

// objectGUID AD -> UUID string để dùng làm externalReferenceCode
String objectGuidToUuid(byte[] bytes) {
    if (bytes == null || bytes.length != 16) {
        return null
    }

    String data1 = toHex(bytes[3]) + toHex(bytes[2]) + toHex(bytes[1]) + toHex(bytes[0])
    String data2 = toHex(bytes[5]) + toHex(bytes[4])
    String data3 = toHex(bytes[7]) + toHex(bytes[6])
    String data4 = toHex(bytes[8]) + toHex(bytes[9])
    String data5 = toHex(bytes[10]) + toHex(bytes[11]) + toHex(bytes[12]) + toHex(bytes[13]) + toHex(bytes[14]) + toHex(bytes[15])

    return (data1 + "-" + data2 + "-" + data3 + "-" + data4 + "-" + data5).toLowerCase(Locale.ROOT)
}

boolean isAdDisabled(Attributes attrs) {
    String uac = getAttr(attrs, "userAccountControl")
    if (!uac) {
        return false
    }

    try {
        int flags = Integer.parseInt(uac)
        return (flags & 0x0002) != 0
    }
    catch (Exception ignored) {
        return false
    }
}

String normalizeEmail(String mail, String upn) {
    String value = mail?.trim()

    if (!value) {
        String candidate = upn?.trim()

        if (candidate && candidate.contains("@")) {
            value = candidate
        }
    }

    return value ? value.toLowerCase(Locale.ROOT) : null
}

User findLegacyUser(long companyId, String emailAddress, String screenName) {
    User user = null

    if (emailAddress) {
        user = UserLocalServiceUtil.fetchUserByEmailAddress(companyId, emailAddress)
    }

    if (user == null && screenName) {
        user = UserLocalServiceUtil.fetchUserByScreenName(companyId, screenName)
    }

    return user
}

String extractRdnValue(String dn, String rdnType) {
    if (!dn || !rdnType) {
        return null
    }

    String[] parts = dn.split("(?<!\\\\),")

    for (String part : parts) {
        int idx = part.indexOf("=")

        if (idx <= 0) {
            continue
        }

        String key = part.substring(0, idx).trim()
        String value = part.substring(idx + 1).trim()

        if (key.equalsIgnoreCase(rdnType)) {
            return value.replace("\\,", ",")
        }
    }

    return null
}

List<String> extractGroupCns(List<String> memberOfDns) {
    List<String> groupCns = []

    for (String dn : memberOfDns) {
        String cn = extractRdnValue(dn, "CN")

        if (cn) {
            groupCns.add(cn)
        }
    }

    return groupCns
}

List<String> lookupMappedValues(Map<String, List<String>> mapping, String key) {
    if (mapping == null || !key) {
        return []
    }

    if (mapping.containsKey(key)) {
        return mapping[key] ?: []
    }

    for (def entry : mapping.entrySet()) {
        if (entry.key != null && entry.key.equalsIgnoreCase(key)) {
            return entry.value ?: []
        }
    }

    return []
}

Set<String> collectManagedNames(Map... mappings) {
    Set<String> names = new LinkedHashSet<String>()

    for (Map mapping : mappings) {
        if (mapping == null) {
            continue
        }

        for (def value : mapping.values()) {
            if (value instanceof Collection) {
                for (def item : value) {
                    if (item != null) {
                        names.add(String.valueOf(item))
                    }
                }
            }
        }
    }

    return names
}

Set<Long> toLongSet(long[] values) {
    Set<Long> set = new LinkedHashSet<Long>()

    if (values == null) {
        return set
    }

    for (long value : values) {
        set.add(value)
    }

    return set
}

long resolveOrganizationId(
    String name,
    boolean createIfMissing,
    long companyId,
    long creatorUserId
) {
    if (!name) {
        return 0L
    }

    long organizationId = OrganizationLocalServiceUtil.getOrganizationId(companyId, name)

    if (organizationId > 0) {
        return organizationId
    }

    if (!createIfMissing) {
        return 0L
    }

    def organization = OrganizationLocalServiceUtil.getOrAddEmptyOrganization(
        "AD-ORG:" + name,
        companyId,
        creatorUserId,
        name
    )

    return organization.getOrganizationId()
}

long resolveRegularRoleId(
    String name,
    boolean createIfMissing,
    long companyId,
    long creatorUserId
) {
    if (!name) {
        return 0L
    }

    def role = RoleLocalServiceUtil.fetchRole(companyId, name)

    if (role != null) {
        if (role.getType() == RoleConstants.TYPE_REGULAR) {
            return role.getRoleId()
        }

        return 0L
    }

    if (!createIfMissing) {
        return 0L
    }

    role = RoleLocalServiceUtil.getOrAddEmptyRole(
        "AD-ROLE:" + name,
        companyId,
        creatorUserId,
        "",
        0L,
        name,
        RoleConstants.TYPE_REGULAR
    )

    return role.getRoleId()
}

long resolveUserGroupId(
    String name,
    boolean createIfMissing,
    long companyId,
    long creatorUserId
) {
    if (!name) {
        return 0L
    }

    try {
        def userGroup = UserGroupLocalServiceUtil.getUserGroup(companyId, name)

        if (userGroup != null) {
            return userGroup.getUserGroupId()
        }
    }
    catch (Exception ignored) {
    }

    if (!createIfMissing) {
        return 0L
    }

    def userGroup = UserGroupLocalServiceUtil.getOrAddEmptyUserGroup(
        "AD-UG:" + name,
        companyId,
        creatorUserId,
        name
    )

    return userGroup.getUserGroupId()
}

// ============================================================
// MAIN
// ============================================================
def company = PortalUtil.getCompany(actionRequest)
def currentUser = PortalUtil.getUser(actionRequest)

long companyId = company.getCompanyId()
long creatorUserId = currentUser.getUserId()

Locale defaultLocale = Locale.forLanguageTag(DEFAULT_LANGUAGE_ID.replace("_", "-"))

ServiceContext serviceContext = new ServiceContext()
serviceContext.setCompanyId(companyId)
serviceContext.setUserId(creatorUserId)

Set<String> managedOrganizationNames = collectManagedNames(
    ORG_BY_DEPARTMENT,
    ORG_BY_AD_GROUP_CN
)

Set<String> managedRegularRoleNames = collectManagedNames(
    ROLE_BY_TITLE,
    ROLE_BY_AD_GROUP_CN
)

Set<String> managedUserGroupNames = collectManagedNames(
    USERGROUP_BY_AD_GROUP_CN
)

Set<Long> managedOrganizationIds = new LinkedHashSet<Long>()
Set<Long> managedRegularRoleIds = new LinkedHashSet<Long>()
Set<Long> managedUserGroupIds = new LinkedHashSet<Long>()

if (SYNC_MANAGED_ORGANIZATIONS) {
    for (String name : managedOrganizationNames) {
        long id = resolveOrganizationId(
            name, CREATE_MISSING_ORGANIZATIONS, companyId, creatorUserId
        )

        if (id > 0) {
            managedOrganizationIds.add(id)
        }
    }
}

if (SYNC_MANAGED_REGULAR_ROLES) {
    for (String name : managedRegularRoleNames) {
        long id = resolveRegularRoleId(
            name, CREATE_MISSING_REGULAR_ROLES, companyId, creatorUserId
        )

        if (id > 0) {
            managedRegularRoleIds.add(id)
        }
    }
}

if (SYNC_MANAGED_USERGROUPS) {
    for (String name : managedUserGroupNames) {
        long id = resolveUserGroupId(
            name, CREATE_MISSING_USERGROUPS, companyId, creatorUserId
        )

        if (id > 0) {
            managedUserGroupIds.add(id)
        }
    }
}

out.println("=== START MANUAL AD -> LIFERAY SYNC V2 ===")
out.println("CompanyId                 : " + companyId)
out.println("Run by userId             : " + creatorUserId)
out.println("AD URL                    : " + AD_URL)
out.println("AD BASE DN                : " + AD_BASE_DN)
out.println("AD FILTER                 : " + AD_FILTER)
out.println("PAGE SIZE                 : " + PAGE_SIZE)
out.println("SKIP_CREATE_IF_AD_DISABLED: " + SKIP_CREATE_IF_AD_DISABLED)
out.println("SYNC ORG / ROLE / UG      : " +
    SYNC_MANAGED_ORGANIZATIONS + " / " +
    SYNC_MANAGED_REGULAR_ROLES + " / " +
    SYNC_MANAGED_USERGROUPS)
out.println("Managed org count         : " + managedOrganizationIds.size())
out.println("Managed role count        : " + managedRegularRoleIds.size())
out.println("Managed user group count  : " + managedUserGroupIds.size())
out.println("")

Hashtable<String, Object> env = new Hashtable<>()
env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory")
env.put(Context.PROVIDER_URL, AD_URL)
env.put(Context.SECURITY_AUTHENTICATION, "simple")
env.put(Context.SECURITY_PRINCIPAL, AD_BIND_DN)
env.put(Context.SECURITY_CREDENTIALS, AD_BIND_PASSWORD)
env.put(Context.REFERRAL, "ignore")
env.put("java.naming.ldap.attributes.binary", "objectGUID")
env.put("com.sun.jndi.ldap.connect.timeout", "10000")
env.put("com.sun.jndi.ldap.read.timeout", "30000")

InitialLdapContext ctx = null
byte[] cookie = null

int page = 0
int processed = 0
int created = 0
int updated = 0
int skipped = 0
int failed = 0
int deactivated = 0
int reactivated = 0
int organizationAdds = 0
int organizationRemoves = 0
int roleAdds = 0
int roleRemoves = 0
int userGroupAdds = 0
int userGroupRemoves = 0
int partialResultWarnings = 0

try {
    ctx = new InitialLdapContext(env, null)

    SearchControls searchControls = new SearchControls()
    searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE)
    searchControls.setReturningAttributes([
        "objectGUID",
        "sAMAccountName",
        "userPrincipalName",
        "mail",
        "givenName",
        "sn",
        "displayName",
        "department",
        "title",
        "memberOf",
        "userAccountControl"
    ] as String[])

    while (true) {
        page++

        ctx.setRequestControls([
            new PagedResultsControl(PAGE_SIZE, cookie, Control.CRITICAL)
        ] as Control[])

        out.println("--- PAGE " + page + " ---")

        NamingEnumeration results = ctx.search(
            AD_BASE_DN,
            AD_FILTER,
            searchControls
        )

        try {
            while (true) {
                SearchResult sr = null

                try {
                    if (!results.hasMore()) {
                        break
                    }

                    sr = (SearchResult) results.next()
                }
                catch (PartialResultException pre) {
                    partialResultWarnings++
                    out.println(
                        "WARN - PartialResultException on page " + page +
                        ": " + pre.getMessage()
                    )
                    break
                }

                processed++

                try {
                    Attributes attrs = sr.getAttributes()

                    String samAccountName = getAttr(attrs, "sAMAccountName")
                    String userPrincipalName = getAttr(attrs, "userPrincipalName")
                    String emailAddress = normalizeEmail(getAttr(attrs, "mail"), userPrincipalName)
                    String givenName = getAttr(attrs, "givenName")
                    String sn = getAttr(attrs, "sn")
                    String displayName = getAttr(attrs, "displayName")
                    String department = getAttr(attrs, "department")
                    String jobTitle = getAttr(attrs, "title") ?: ""
                    List<String> memberOfDns = getAttrValues(attrs, "memberOf")
                    List<String> memberOfCns = extractGroupCns(memberOfDns)

                    if (!samAccountName) {
                        skipped++
                        out.println("SKIP - missing sAMAccountName")
                        continue
                    }

                    byte[] guidBytes = getAttrBytes(attrs, "objectGUID")
                    String externalReferenceCode = objectGuidToUuid(guidBytes)

                    if (!externalReferenceCode) {
                        skipped++
                        out.println("SKIP - no objectGUID: " + samAccountName)
                        continue
                    }

                    if (!emailAddress) {
                        skipped++
                        out.println("SKIP - no mail/UPN-email: " + samAccountName)
                        continue
                    }

                    boolean adDisabled = isAdDisabled(attrs)
                    String screenName = samAccountName.trim()
                    String firstName = givenName ?: displayName ?: samAccountName
                    String lastName = sn ?: samAccountName

                    User liferayUser = UserLocalServiceUtil.fetchUserByExternalReferenceCode(
                        externalReferenceCode, companyId
                    )

                    if (liferayUser == null) {
                        liferayUser = findLegacyUser(companyId, emailAddress, screenName)

                        if (liferayUser != null) {
                            String oldErc = liferayUser.getExternalReferenceCode()

                            if (oldErc && oldErc.trim() && oldErc != externalReferenceCode) {
                                failed++
                                out.println(
                                    "FAIL - ERC conflict for " + screenName +
                                    " | existingUserId=" + liferayUser.getUserId() +
                                    " | existingERC=" + oldErc +
                                    " | adERC=" + externalReferenceCode
                                )
                                continue
                            }

                            if (!oldErc || !oldErc.trim()) {
                                liferayUser.setExternalReferenceCode(externalReferenceCode)
                                liferayUser = UserLocalServiceUtil.updateUser(liferayUser)
                            }
                        }
                    }

                    boolean existedBefore = (liferayUser != null)

                    if (!existedBefore && adDisabled && SKIP_CREATE_IF_AD_DISABLED) {
                        skipped++
                        out.println("SKIP - AD disabled and Liferay user does not exist: " + screenName)
                        continue
                    }

                    User syncedUser = UserLocalServiceUtil.addOrUpdateUser(
                        externalReferenceCode,
                        creatorUserId,
                        companyId,
                        true,
                        "",
                        "",
                        false,
                        screenName,
                        emailAddress,
                        defaultLocale,
                        firstName,
                        "",
                        lastName,
                        0L,
                        0L,
                        true,
                        Calendar.JANUARY,
                        1,
                        1970,
                        jobTitle,
                        false,
                        serviceContext
                    )

                    if (existedBefore) {
                        updated++
                    }
                    else {
                        created++
                    }

                    if (adDisabled) {
                        if (syncedUser.getStatus() != WorkflowConstants.STATUS_INACTIVE) {
                            syncedUser = UserLocalServiceUtil.updateStatus(
                                syncedUser.getUserId(),
                                WorkflowConstants.STATUS_INACTIVE,
                                serviceContext
                            )
                            deactivated++
                        }
                    }
                    else {
                        if (syncedUser.getStatus() == WorkflowConstants.STATUS_INACTIVE) {
                            syncedUser = UserLocalServiceUtil.updateStatus(
                                syncedUser.getUserId(),
                                WorkflowConstants.STATUS_APPROVED,
                                serviceContext
                            )
                            reactivated++
                        }
                    }

                    int userOrgAdds = 0
                    int userOrgRemoves = 0
                    int userRoleAdds = 0
                    int userRoleRemoves = 0
                    int userUgAdds = 0
                    int userUgRemoves = 0

                    // ----------------------------------------------------
                    // Derive target memberships from AD attrs
                    // ----------------------------------------------------
                    Set<String> targetOrganizationNames = new LinkedHashSet<String>()
                    Set<String> targetRegularRoleNames = new LinkedHashSet<String>()
                    Set<String> targetUserGroupNames = new LinkedHashSet<String>()

                    if (department) {
                        targetOrganizationNames.addAll(
                            lookupMappedValues(ORG_BY_DEPARTMENT, department)
                        )
                    }

                    if (jobTitle) {
                        targetRegularRoleNames.addAll(
                            lookupMappedValues(ROLE_BY_TITLE, jobTitle)
                        )
                    }

                    for (String memberOfCn : memberOfCns) {
                        targetOrganizationNames.addAll(
                            lookupMappedValues(ORG_BY_AD_GROUP_CN, memberOfCn)
                        )
                        targetRegularRoleNames.addAll(
                            lookupMappedValues(ROLE_BY_AD_GROUP_CN, memberOfCn)
                        )
                        targetUserGroupNames.addAll(
                            lookupMappedValues(USERGROUP_BY_AD_GROUP_CN, memberOfCn)
                        )
                    }

                    // ----------------------------------------------------
                    // Resolve target IDs
                    // ----------------------------------------------------
                    Set<Long> targetOrganizationIds = new LinkedHashSet<Long>()
                    Set<Long> targetRegularRoleIds = new LinkedHashSet<Long>()
                    Set<Long> targetUserGroupIds = new LinkedHashSet<Long>()

                    for (String name : targetOrganizationNames) {
                        long organizationId = resolveOrganizationId(
                            name,
                            CREATE_MISSING_ORGANIZATIONS,
                            companyId,
                            creatorUserId
                        )

                        if (organizationId > 0) {
                            targetOrganizationIds.add(organizationId)
                        }
                        else {
                            out.println(
                                "WARN - organization not found: " + name +
                                " | user=" + screenName
                            )
                        }
                    }

                    for (String name : targetRegularRoleNames) {
                        long roleId = resolveRegularRoleId(
                            name,
                            CREATE_MISSING_REGULAR_ROLES,
                            companyId,
                            creatorUserId
                        )

                        if (roleId > 0) {
                            targetRegularRoleIds.add(roleId)
                        }
                        else {
                            out.println(
                                "WARN - regular role not found or not regular: " + name +
                                " | user=" + screenName
                            )
                        }
                    }

                    for (String name : targetUserGroupNames) {
                        long userGroupId = resolveUserGroupId(
                            name,
                            CREATE_MISSING_USERGROUPS,
                            companyId,
                            creatorUserId
                        )

                        if (userGroupId > 0) {
                            targetUserGroupIds.add(userGroupId)
                        }
                        else {
                            out.println(
                                "WARN - user group not found: " + name +
                                " | user=" + screenName
                            )
                        }
                    }

                    // ----------------------------------------------------
                    // Sync organizations (managed only)
                    // ----------------------------------------------------
                    if (SYNC_MANAGED_ORGANIZATIONS) {
                        Set<Long> currentOrganizationIds = toLongSet(
                            UserLocalServiceUtil.getOrganizationPrimaryKeys(syncedUser.getUserId())
                        )

                        Set<Long> addOrgIds = new LinkedHashSet<Long>(targetOrganizationIds)
                        addOrgIds.removeAll(currentOrganizationIds)

                        Set<Long> removeOrgIds = new LinkedHashSet<Long>(currentOrganizationIds)
                        removeOrgIds.retainAll(managedOrganizationIds)
                        removeOrgIds.removeAll(targetOrganizationIds)

                        for (Long organizationId : addOrgIds) {
                            OrganizationLocalServiceUtil.addUserOrganization(
                                syncedUser.getUserId(),
                                organizationId.longValue()
                            )
                            organizationAdds++
                            userOrgAdds++
                        }

                        for (Long organizationId : removeOrgIds) {
                            UserLocalServiceUtil.deleteOrganizationUser(
                                organizationId.longValue(),
                                syncedUser.getUserId()
                            )
                            organizationRemoves++
                            userOrgRemoves++
                        }
                    }

                    // ----------------------------------------------------
                    // Sync regular roles (managed only)
                    // ----------------------------------------------------
                    if (SYNC_MANAGED_REGULAR_ROLES) {
                        Set<Long> currentRoleIds = toLongSet(
                            UserLocalServiceUtil.getRolePrimaryKeys(syncedUser.getUserId())
                        )

                        Set<Long> addRoleIds = new LinkedHashSet<Long>(targetRegularRoleIds)
                        addRoleIds.removeAll(currentRoleIds)

                        Set<Long> removeRoleIds = new LinkedHashSet<Long>(currentRoleIds)
                        removeRoleIds.retainAll(managedRegularRoleIds)
                        removeRoleIds.removeAll(targetRegularRoleIds)

                        for (Long roleId : addRoleIds) {
                            RoleLocalServiceUtil.addUserRole(
                                syncedUser.getUserId(),
                                roleId.longValue()
                            )
                            roleAdds++
                            userRoleAdds++
                        }

                        for (Long roleId : removeRoleIds) {
                            UserLocalServiceUtil.deleteRoleUser(
                                roleId.longValue(),
                                syncedUser.getUserId()
                            )
                            roleRemoves++
                            userRoleRemoves++
                        }
                    }

                    // ----------------------------------------------------
                    // Sync user groups (managed only)
                    // ----------------------------------------------------
                    if (SYNC_MANAGED_USERGROUPS) {
                        Set<Long> currentUserGroupIds = new LinkedHashSet<Long>()

                        for (def userGroup : UserGroupLocalServiceUtil.getUserUserGroups(syncedUser.getUserId())) {
                            currentUserGroupIds.add(userGroup.getUserGroupId())
                        }

                        Set<Long> addUserGroupIds = new LinkedHashSet<Long>(targetUserGroupIds)
                        addUserGroupIds.removeAll(currentUserGroupIds)

                        Set<Long> removeUserGroupIds = new LinkedHashSet<Long>(currentUserGroupIds)
                        removeUserGroupIds.retainAll(managedUserGroupIds)
                        removeUserGroupIds.removeAll(targetUserGroupIds)

                        for (Long userGroupId : addUserGroupIds) {
                            UserGroupLocalServiceUtil.addUserUserGroup(
                                syncedUser.getUserId(),
                                userGroupId.longValue()
                            )
                            userGroupAdds++
                            userUgAdds++
                        }

                        for (Long userGroupId : removeUserGroupIds) {
                            UserGroupLocalServiceUtil.deleteUserUserGroup(
                                syncedUser.getUserId(),
                                userGroupId.longValue()
                            )
                            userGroupRemoves++
                            userUgRemoves++
                        }
                    }

                    out.println(
                        "SYNCED - userId=" + syncedUser.getUserId() +
                        " | screenName=" + syncedUser.getScreenName() +
                        " | email=" + syncedUser.getEmailAddress() +
                        " | status=" + syncedUser.getStatus() +
                        " | org(+" + userOrgAdds + "/-" + userOrgRemoves + ")" +
                        " | role(+" + userRoleAdds + "/-" + userRoleRemoves + ")" +
                        " | ug(+" + userUgAdds + "/-" + userUgRemoves + ")"
                    )
                }
                catch (Exception userEx) {
                    failed++
                    out.println(
                        "FAIL - " + userEx.getClass().getName() +
                        ": " + userEx.getMessage()
                    )
                }
            }
        }
        finally {
            try {
                results?.close()
            }
            catch (Exception ignored) {
            }
        }

        cookie = null

        Control[] responseControls = ctx.getResponseControls()

        if (responseControls != null) {
            for (Control responseControl : responseControls) {
                if (responseControl instanceof PagedResultsResponseControl) {
                    cookie = ((PagedResultsResponseControl) responseControl).getCookie()
                }
            }
        }

        if (cookie == null || cookie.length == 0) {
            break
        }
    }
}
catch (Exception e) {
    out.println("FATAL - " + e.getClass().getName() + ": " + e.getMessage())
    e.printStackTrace(out)
}
finally {
    try {
        ctx?.close()
    }
    catch (Exception ignored) {
    }
}

out.println("")
out.println("=== DONE ===")
out.println("Processed             : " + processed)
out.println("Created               : " + created)
out.println("Updated               : " + updated)
out.println("Skipped               : " + skipped)
out.println("Failed                : " + failed)
out.println("Deactivated           : " + deactivated)
out.println("Reactivated           : " + reactivated)
out.println("Org added             : " + organizationAdds)
out.println("Org removed           : " + organizationRemoves)
out.println("Role added            : " + roleAdds)
out.println("Role removed          : " + roleRemoves)
out.println("UserGroup added       : " + userGroupAdds)
out.println("UserGroup removed     : " + userGroupRemoves)
out.println("PartialResult warnings: " + partialResultWarnings)
