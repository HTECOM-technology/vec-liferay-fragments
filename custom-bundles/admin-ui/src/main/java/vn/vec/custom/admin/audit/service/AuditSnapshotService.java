package vn.vec.custom.admin.audit.service;

import com.liferay.fragment.model.FragmentEntry;
import com.liferay.fragment.model.FragmentEntryLink;
import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.model.JournalFolder;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.model.LayoutSet;
import com.liferay.portal.kernel.model.ResourceAction;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.portlet.PortletPreferencesFactoryUtil;
import com.liferay.portal.kernel.service.ResourceActionLocalServiceUtil;
import com.liferay.portal.kernel.service.RoleLocalServiceUtil;
import com.liferay.portal.kernel.util.PortletKeys;
import com.liferay.portal.kernel.util.UnicodeProperties;

import java.text.SimpleDateFormat;

import java.util.ArrayList;
import java.util.Date;
import java.util.Dictionary;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import javax.xml.parsers.DocumentBuilderFactory;

import org.osgi.service.component.annotations.Component;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import vn.vec.custom.admin.audit.util.AuditJsonUtil;
import vn.vec.custom.admin.audit.util.AuditConfigurationUtil;
import vn.vec.custom.admin.audit.util.AuditSanitizer;

@Component(service = AuditSnapshotService.class)
public class AuditSnapshotService {

	public String snapshotConfiguration(
		String pid, Dictionary<String, Object> properties) {

		return snapshotConfiguration(pid, null, null, properties);
	}

	public String snapshotConfiguration(
		String pid, String factoryPid, String scope,
		Dictionary<String, Object> properties) {

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("pid", pid);
		values.put("factoryPid", factoryPid);
		values.put("scope", scope);
		values.put("scopeValue", AuditConfigurationUtil.getScopeValue(properties));
		values.put("properties", AuditConfigurationUtil.toPropertyMap(properties));

		return _sanitizeAndSerialize(values);
	}

	public String snapshotCompany(Company company) {
		if (company == null) {
			return null;
		}

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("companyId", company.getCompanyId());
		values.put("groupId", company.getGroupId());
		values.put("webId", company.getWebId());
		values.put("virtualHostname", company.getVirtualHostname());
		values.put("mx", company.getMx());
		values.put("homeURL", company.getHomeURL());
		values.put("authType", company.getAuthType());
		values.put("siteLogo", company.isSiteLogo());
		values.put("strangers", company.isStrangers());
		values.put("strangersVerify", company.isStrangersVerify());
		values.put("strangersWithMx", company.isStrangersWithMx());
		values.put(
			"sendPasswordResetLink", company.isSendPasswordResetLink());
		values.put(
			"updatePasswordRequired", company.isUpdatePasswordRequired());
		values.put("autoLogin", company.isAutoLogin());

		return _sanitizeAndSerialize(values);
	}

	public String snapshotGroup(Group group) {
		if (group == null) {
			return null;
		}

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("groupId", group.getGroupId());
		values.put("companyId", group.getCompanyId());
		values.put("classNameId", group.getClassNameId());
		values.put("classPK", group.getClassPK());
		values.put("liveGroupId", group.getLiveGroupId());
		values.put("friendlyURL", group.getFriendlyURL());
		values.put("site", group.isSite());
		values.put("active", group.isActive());
		values.put("type", group.getType());
		values.put("manualMembership", group.isManualMembership());
		values.put("membershipRestriction", group.getMembershipRestriction());
		values.put(
			"typeSettings", _unicodeProperties(group.getTypeSettingsProperties()));

		return _sanitizeAndSerialize(values);
	}

	public String snapshotLayout(Layout layout) {
		if (layout == null) {
			return null;
		}

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("plid", layout.getPlid());
		values.put("layoutId", layout.getLayoutId());
		values.put("groupId", layout.getGroupId());
		values.put("privateLayout", layout.isPrivateLayout());
		values.put("name", layout.getNameCurrentValue());
		values.put(
			"friendlyURL", layout.getFriendlyURL(Locale.getDefault()));
		values.put("type", layout.getType());
		values.put("hidden", layout.isHidden());
		values.put("themeId", layout.getThemeId());
		values.put("colorSchemeId", layout.getColorSchemeId());
		values.put("css", _preview(layout.getCss()));
		values.put("typeSettings", _preview(layout.getTypeSettings()));

		return _sanitizeAndSerialize(values);
	}

	public String snapshotLayoutSet(LayoutSet layoutSet) {
		if (layoutSet == null) {
			return null;
		}

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("layoutSetId", layoutSet.getLayoutSetId());
		values.put("groupId", layoutSet.getGroupId());
		values.put("privateLayout", layoutSet.isPrivateLayout());
		values.put("themeId", layoutSet.getThemeId());
		values.put("colorSchemeId", layoutSet.getColorSchemeId());
		values.put("css", _preview(layoutSet.getCss()));
		values.put(
			"settings", _unicodeProperties(layoutSet.getSettingsProperties()));
		values.put("virtualHostnames", layoutSet.getVirtualHostnames());

		return _sanitizeAndSerialize(values);
	}

	public String snapshotFragmentEntry(FragmentEntry fragmentEntry) {
		if (fragmentEntry == null) {
			return null;
		}

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("fragmentEntryId", fragmentEntry.getFragmentEntryId());
		values.put("groupId", fragmentEntry.getGroupId());
		values.put(
			"fragmentCollectionId", fragmentEntry.getFragmentCollectionId());
		values.put("name", fragmentEntry.getName());
		values.put("configuration", _preview(fragmentEntry.getConfiguration()));
		values.put("cssHash", AuditJsonUtil.hash(fragmentEntry.getCss()));
		values.put("htmlHash", AuditJsonUtil.hash(fragmentEntry.getHtml()));
		values.put("jsHash", AuditJsonUtil.hash(fragmentEntry.getJs()));
		values.put("type", fragmentEntry.getType());
		values.put("status", fragmentEntry.getStatus());
		values.put("readOnly", fragmentEntry.isReadOnly());

		return _sanitizeAndSerialize(values);
	}

	public String snapshotFragmentEntryLink(FragmentEntryLink fragmentEntryLink) {
		if (fragmentEntryLink == null) {
			return null;
		}

		Map<String, Object> values = new LinkedHashMap<>();

		values.put(
			"fragmentEntryLinkId", fragmentEntryLink.getFragmentEntryLinkId());
		values.put("groupId", fragmentEntryLink.getGroupId());
		values.put("plid", fragmentEntryLink.getPlid());
		values.put(
			"segmentsExperienceId", fragmentEntryLink.getSegmentsExperienceId());
		values.put("fragmentEntryId", fragmentEntryLink.getFragmentEntryId());
		values.put("rendererKey", fragmentEntryLink.getRendererKey());
		values.put("editableValues", _preview(fragmentEntryLink.getEditableValues()));
		values.put("configuration", _preview(fragmentEntryLink.getConfiguration()));
		values.put("htmlHash", AuditJsonUtil.hash(fragmentEntryLink.getHtml()));
		values.put("cssHash", AuditJsonUtil.hash(fragmentEntryLink.getCss()));
		values.put("jsHash", AuditJsonUtil.hash(fragmentEntryLink.getJs()));
		values.put("position", fragmentEntryLink.getPosition());

		return _sanitizeAndSerialize(values);
	}

	public String snapshotJournalArticle(JournalArticle journalArticle) {
		if (journalArticle == null) {
			return null;
		}

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("id", journalArticle.getId());
		values.put("resourcePrimKey", journalArticle.getResourcePrimKey());
		values.put("articleId", journalArticle.getArticleId());
		values.put("groupId", journalArticle.getGroupId());
		values.put("folderId", journalArticle.getFolderId());
		values.put("title", journalArticle.getTitleCurrentValue());
		values.put("urlTitle", journalArticle.getUrlTitle());
		values.put("description", journalArticle.getDescriptionCurrentValue());
		values.put("status", journalArticle.getStatus());
		values.put("version", journalArticle.getVersion());
		values.put("displayDate", _formatDate(journalArticle.getDisplayDate()));
		values.put(
			"expirationDate", _formatDate(journalArticle.getExpirationDate()));
		values.put("reviewDate", _formatDate(journalArticle.getReviewDate()));
		values.put("contentHash", AuditJsonUtil.hash(journalArticle.getContent()));
		values.put("contentPreview", _preview(journalArticle.getContent()));

		return _sanitizeAndSerialize(values);
	}

	public String snapshotJournalFolder(JournalFolder journalFolder) {
		if (journalFolder == null) {
			return null;
		}

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("folderId", journalFolder.getFolderId());
		values.put("groupId", journalFolder.getGroupId());
		values.put("parentFolderId", journalFolder.getParentFolderId());
		values.put("name", journalFolder.getName());
		values.put("description", journalFolder.getDescription());

		return _sanitizeAndSerialize(values);
	}

	public String snapshotPortalPreferences(
		long ownerId, int ownerType,
		com.liferay.portal.kernel.portlet.PortalPreferences portalPreferences) {

		if (portalPreferences == null) {
			return null;
		}

		return snapshotPortalPreferences(
			ownerId, ownerType,
			PortletPreferencesFactoryUtil.toXML(portalPreferences));
	}

	public String snapshotPortalPreferences(
		long ownerId, int ownerType, String xml) {

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("ownerId", ownerId);
		values.put("ownerType", ownerType);
		values.put("ownerTypeLabel", _ownerTypeLabel(ownerType));
		values.put("preferences", _preferences(xml));

		return _sanitizeAndSerialize(values);
	}

	public String snapshotPortletPreferences(
		long ownerId, int ownerType, long plid, String portletId,
		javax.portlet.PortletPreferences portletPreferences) {

		if (portletPreferences == null) {
			return null;
		}

		return snapshotPortletPreferences(
			ownerId, ownerType, plid, portletId,
			PortletPreferencesFactoryUtil.toXML(portletPreferences));
	}

	public String snapshotPortletPreferences(
		long ownerId, int ownerType, long plid, String portletId, String xml) {

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("ownerId", ownerId);
		values.put("ownerType", ownerType);
		values.put("ownerTypeLabel", _ownerTypeLabel(ownerType));
		values.put("plid", plid);
		values.put("portletId", portletId);
		values.put("preferences", _preferences(xml));

		return _sanitizeAndSerialize(values);
	}

	private String _formatDate(Date date) {
		if (date == null) {
			return null;
		}

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
			"yyyy-MM-dd'T'HH:mm:ss.SSSXXX", Locale.US);

		simpleDateFormat.setTimeZone(TimeZone.getDefault());

		return simpleDateFormat.format(date);
	}

	private String _preview(String value) {
		return AuditJsonUtil.truncate(value, 2000);
	}

	private Map<String, Object> _preferences(String xml) {
		Map<String, Object> preferences = new LinkedHashMap<>();

		if ((xml == null) || xml.trim().isEmpty()) {
			return preferences;
		}

		try {
			DocumentBuilderFactory documentBuilderFactory =
				DocumentBuilderFactory.newInstance();

			documentBuilderFactory.setFeature(
				"http://apache.org/xml/features/disallow-doctype-decl", true);

			Document document = documentBuilderFactory.newDocumentBuilder().parse(
				new java.io.ByteArrayInputStream(
					xml.getBytes(java.nio.charset.StandardCharsets.UTF_8)));
			NodeList preferenceNodes = document.getElementsByTagName(
				"preference");

			for (int i = 0; i < preferenceNodes.getLength(); i++) {
				org.w3c.dom.Element preferenceElement =
					(org.w3c.dom.Element)preferenceNodes.item(i);
				String name = _text(preferenceElement, "name");
				NodeList valueNodes = preferenceElement.getElementsByTagName(
					"value");
				List<String> values = new ArrayList<>();

				for (int j = 0; j < valueNodes.getLength(); j++) {
					values.add(valueNodes.item(j).getTextContent());
				}

				preferences.put(name, values);
			}
		}
		catch (Exception exception) {
			preferences.put("_rawXml", AuditJsonUtil.truncate(xml, 4000));
		}

		return preferences;
	}

	public String snapshotPermission(
		long roleId, long actionIds, String resourceName) {

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("roleName", _getRoleName(roleId));
		values.put("permissions", _decodeActionIds(resourceName, actionIds));

		return _sanitizeAndSerialize(values);
	}

	private List<String> _decodeActionIds(String resourceName, long actionIds) {
		List<String> actionNames = new ArrayList<>();

		try {
			List<ResourceAction> resourceActions =
				ResourceActionLocalServiceUtil.getResourceActions(resourceName);

			for (ResourceAction resourceAction : resourceActions) {
				if ((actionIds & resourceAction.getBitwiseValue()) != 0) {
					actionNames.add(resourceAction.getActionId());
				}
			}
		}
		catch (Exception exception) {
			actionNames.add(String.valueOf(actionIds));
		}

		return actionNames;
	}

	private String _getRoleName(long roleId) {
		try {
			Role role = RoleLocalServiceUtil.fetchRole(roleId);

			if (role != null) {
				return role.getName();
			}
		}
		catch (Exception exception) {
		}

		return String.valueOf(roleId);
	}

	private String _ownerTypeLabel(int ownerType) {
		if (ownerType == PortletKeys.PREFS_OWNER_TYPE_COMPANY) {
			return "COMPANY";
		}

		if (ownerType == PortletKeys.PREFS_OWNER_TYPE_GROUP) {
			return "GROUP";
		}

		if (ownerType == PortletKeys.PREFS_OWNER_TYPE_LAYOUT) {
			return "LAYOUT";
		}

		if (ownerType == PortletKeys.PREFS_OWNER_TYPE_USER) {
			return "USER";
		}

		if (ownerType == PortletKeys.PREFS_OWNER_TYPE_ARCHIVED) {
			return "ARCHIVED";
		}

		if (ownerType == PortletKeys.PREFS_OWNER_TYPE_ORGANIZATION) {
			return "ORGANIZATION";
		}

		return String.valueOf(ownerType);
	}

	private String _sanitizeAndSerialize(Map<String, Object> values) {
		return AuditSanitizer.sanitizeJson(AuditJsonUtil.toJsonString(values));
	}

	private String _text(org.w3c.dom.Element element, String tagName) {
		NodeList nodeList = element.getElementsByTagName(tagName);

		if (nodeList.getLength() == 0) {
			return null;
		}

		return nodeList.item(0).getTextContent();
	}

	private Map<String, String> _unicodeProperties(
		UnicodeProperties unicodeProperties) {

		Map<String, String> values = new LinkedHashMap<>();

		if (unicodeProperties == null) {
			return values;
		}

		for (Object keyObject : unicodeProperties.keySet()) {
			String key = String.valueOf(keyObject);

			values.put(key, unicodeProperties.getProperty(key));
		}

		return values;
	}

}
