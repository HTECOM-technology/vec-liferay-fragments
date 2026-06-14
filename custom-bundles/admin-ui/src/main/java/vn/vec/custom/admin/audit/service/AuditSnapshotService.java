package vn.vec.custom.admin.audit.service;

import com.liferay.fragment.model.FragmentEntry;
import com.liferay.fragment.model.FragmentEntryLink;
import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.model.JournalFolder;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.model.ResourceAction;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.service.ResourceActionLocalServiceUtil;
import com.liferay.portal.kernel.service.RoleLocalServiceUtil;

import java.text.SimpleDateFormat;

import java.util.ArrayList;
import java.util.Date;
import java.util.Dictionary;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.audit.util.AuditJsonUtil;
import vn.vec.custom.admin.audit.util.AuditSanitizer;

@Component(service = AuditSnapshotService.class)
public class AuditSnapshotService {

	public String snapshotConfiguration(
		String pid, Dictionary<String, Object> properties) {

		Map<String, Object> values = new LinkedHashMap<>();

		values.put("pid", pid);

		if (properties != null) {
			Enumeration<String> keys = properties.keys();
			Map<String, Object> propertyValues = new LinkedHashMap<>();

			while (keys.hasMoreElements()) {
				String key = keys.nextElement();

				propertyValues.put(key, properties.get(key));
			}

			values.put("properties", propertyValues);
		}

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

	private String _sanitizeAndSerialize(Map<String, Object> values) {
		return AuditSanitizer.sanitizeJson(AuditJsonUtil.toJsonString(values));
	}

}
