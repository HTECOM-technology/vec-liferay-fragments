package vn.vec.custom.admin.webcontent.advancedsearch;

import com.liferay.dynamic.data.mapping.model.DDMStructure;
import com.liferay.dynamic.data.mapping.service.DDMStructureLocalServiceUtil;
import com.liferay.journal.model.JournalFolder;
import com.liferay.journal.service.JournalFolderLocalServiceUtil;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.service.GroupLocalServiceUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = WebContentAdvancedSearchService.class)
public class WebContentAdvancedSearchService {

	public WebContentAdvancedSearchResult search(
			WebContentAdvancedSearchQuery query,
			HttpServletRequest httpServletRequest)
		throws Exception {

		int total = _webContentAdvancedSearchRepository.count(query);
		List<WebContentAdvancedSearchRepository.RowRecord> rowRecords =
			_webContentAdvancedSearchRepository.search(query);
		List<WebContentAdvancedSearchRow> rows = new ArrayList<>();
		Map<Long, Group> groups = new HashMap<>();
		Map<Long, JournalFolder> folders = new HashMap<>();

		for (WebContentAdvancedSearchRepository.RowRecord rowRecord : rowRecords) {
			Group group = _getGroup(groups, rowRecord.getGroupId());
			JournalFolder folder = _getFolder(folders, rowRecord.getFolderId());

			rows.add(
				new WebContentAdvancedSearchRow(
					rowRecord.getArticleId(), rowRecord.getResourcePrimKey(),
					rowRecord.getGroupId(), _getGroupName(group),
					rowRecord.getFolderId(), _getFolderName(folder),
					rowRecord.getTitle(), rowRecord.getVersion(),
					rowRecord.getStatus(),
					WebContentAdvancedSearchUtil.toStatusLabel(
						rowRecord.getStatus()),
					rowRecord.getUserId(), rowRecord.getUserName(),
					rowRecord.getCreateDate(), rowRecord.getModifiedDate(),
					rowRecord.getDisplayDate(),
					WebContentAdvancedSearchUtil.buildEditUrl(
						httpServletRequest, group, rowRecord.getArticleId(),
						rowRecord.getGroupId(), rowRecord.getVersion()),
					""));
		}

		return new WebContentAdvancedSearchResult(
			rows, total, query.getPage(), query.getPageSize());
	}

	public String toStructureLabel(long structureId) {
		if (structureId <= 0) {
			return "";
		}

		try {
			DDMStructure ddmStructure =
				DDMStructureLocalServiceUtil.fetchDDMStructure(structureId);

			return (ddmStructure == null) ? "" : ddmStructure.getNameCurrentValue();
		}
		catch (Exception exception) {
			return "";
		}
	}

	private JournalFolder _getFolder(
		Map<Long, JournalFolder> folders, long folderId) {

		if (folderId <= 0) {
			return null;
		}

		if (folders.containsKey(folderId)) {
			return folders.get(folderId);
		}

		JournalFolder journalFolder =
			JournalFolderLocalServiceUtil.fetchFolder(folderId);

		folders.put(folderId, journalFolder);

		return journalFolder;
	}

	private String _getFolderName(JournalFolder folder) {
		if (folder == null) {
			return "Root";
		}

		return folder.getName();
	}

	private Group _getGroup(Map<Long, Group> groups, long groupId) {
		if (groups.containsKey(groupId)) {
			return groups.get(groupId);
		}

		Group group = GroupLocalServiceUtil.fetchGroup(groupId);

		groups.put(groupId, group);

		return group;
	}

	private String _getGroupName(Group group) {
		if (group == null) {
			return "";
		}

		try {
			return group.getDescriptiveName();
		}
		catch (Exception exception) {
			return group.getName();
		}
	}

	@Reference
	private WebContentAdvancedSearchRepository _webContentAdvancedSearchRepository;

}
