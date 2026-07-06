package vn.vec.custom.admin.webcontent.statistics;

import com.liferay.dynamic.data.mapping.model.DDMStructure;
import com.liferay.dynamic.data.mapping.service.DDMStructureLocalServiceUtil;
import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.model.JournalFolder;
import com.liferay.journal.service.JournalArticleLocalServiceUtil;
import com.liferay.journal.service.JournalFolderLocalServiceUtil;
import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.dao.orm.OrderFactoryUtil;
import com.liferay.portal.kernel.dao.orm.RestrictionsFactoryUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.workflow.WorkflowConstants;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
public class WebContentStatisticsExportService {

	public File export(WebContentStatisticsQuery query) throws Exception {
		File rawDataFile = null;
		WebContentStatisticsSummary summary = new WebContentStatisticsSummary();

		try {
			if (query.isIncludeRawData()) {
				rawDataFile = File.createTempFile(
					"webcontent-statistics-raw-", ".tsv");
			}

			_collectRows(query, summary, rawDataFile);

			return _webContentStatisticsExcelWriter.write(
				query, summary, rawDataFile);
		}
		finally {
			if ((rawDataFile != null) && rawDataFile.exists() &&
				!rawDataFile.delete() && _log.isWarnEnabled()) {

				_log.warn("Unable to delete temp raw data file " + rawDataFile);
			}
		}
	}

	private void _addDateFilters(
		DynamicQuery dynamicQuery, String propertyName, Date fromDate,
		Date toDateExclusive) {

		if (fromDate != null) {
			dynamicQuery.add(
				RestrictionsFactoryUtil.ge(propertyName, fromDate));
		}

		if (toDateExclusive != null) {
			dynamicQuery.add(
				RestrictionsFactoryUtil.lt(propertyName, toDateExclusive));
		}
	}

	private void _collectRows(
			WebContentStatisticsQuery query, WebContentStatisticsSummary summary,
			File rawDataFile)
		throws Exception {

		DynamicQuery dynamicQuery = JournalArticleLocalServiceUtil.dynamicQuery();

		dynamicQuery.add(RestrictionsFactoryUtil.eq("groupId", query.getGroupId()));

		if (query.getStatus() != WorkflowConstants.STATUS_ANY) {
			dynamicQuery.add(
				RestrictionsFactoryUtil.eq("status", query.getStatus()));
		}

		if (query.getFolderId() >= 0) {
			dynamicQuery.add(
				RestrictionsFactoryUtil.eq("folderId", query.getFolderId()));
		}

		if (query.getStructureId() >= 0) {
			dynamicQuery.add(
				RestrictionsFactoryUtil.eq(
					"DDMStructureId", query.getStructureId()));
		}

		if (query.getUserId() >= 0) {
			dynamicQuery.add(RestrictionsFactoryUtil.eq("userId", query.getUserId()));
		}

		_addDateFilters(
			dynamicQuery, "createDate", query.getFromCreateDate(),
			query.getToCreateDateExclusive());
		_addDateFilters(
			dynamicQuery, "modifiedDate", query.getFromModifiedDate(),
			query.getToModifiedDateExclusive());

		dynamicQuery.addOrder(OrderFactoryUtil.asc("resourcePrimKey"));
		dynamicQuery.addOrder(OrderFactoryUtil.desc("version"));

		int start = 0;
		Set<Long> seenResourcePrimKeys = new HashSet<>();
		Map<Long, String> folderPaths = new HashMap<>();
		Map<Long, String> structureNames = new HashMap<>();

		BufferedWriter bufferedWriter = null;

		try {
			if (rawDataFile != null) {
				bufferedWriter = new BufferedWriter(
					new OutputStreamWriter(
						new FileOutputStream(rawDataFile), StandardCharsets.UTF_8));
			}

			while (true) {
				List<JournalArticle> articles =
					JournalArticleLocalServiceUtil.dynamicQuery(
						dynamicQuery, start, start + _BATCH_SIZE);

				if (articles.isEmpty()) {
					break;
				}

				for (JournalArticle article : articles) {
					long resourcePrimKey = article.getResourcePrimKey();

					if (resourcePrimKey <= 0) {
						resourcePrimKey = article.getId();
					}

					if (query.isLatestOnlyEffective() &&
						!seenResourcePrimKeys.add(resourcePrimKey)) {

						continue;
					}

					WebContentStatisticsRow row = _toRow(
						article, query.getLanguageId(), folderPaths,
						structureNames);

					summary.accept(row);

					if (bufferedWriter != null) {
						bufferedWriter.write(row.serialize());
						bufferedWriter.newLine();
					}
				}

				if (bufferedWriter != null) {
					bufferedWriter.flush();
				}

				if (articles.size() < _BATCH_SIZE) {
					break;
				}

				start += _BATCH_SIZE;
			}
		}
		finally {
			if (bufferedWriter != null) {
				bufferedWriter.close();
			}
		}
	}

	private String _formatDate(Date date) {
		if (date == null) {
			return "";
		}

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss", Locale.US);

		simpleDateFormat.setTimeZone(TimeZone.getDefault());

		return simpleDateFormat.format(date);
	}

	private String _formatMonth(Date date) {
		if (date == null) {
			return "";
		}

		SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
			"yyyy-MM", Locale.US);

		simpleDateFormat.setTimeZone(TimeZone.getDefault());

		return simpleDateFormat.format(date);
	}

	private String _getFolderPath(long folderId, Map<Long, String> folderPaths) {
		if (folderId <= 0) {
			return "/";
		}

		String cachedValue = folderPaths.get(folderId);

		if (cachedValue != null) {
			return cachedValue;
		}

		String folderPath = "/[folderId=" + folderId + "]";

		try {
			StringBuilder stringBuilder = new StringBuilder();
			JournalFolder folder = JournalFolderLocalServiceUtil.fetchFolder(
				folderId);
			int guard = 0;

			while (folder != null && guard++ < 200) {
				StringBuilder segment = new StringBuilder();

				segment.append('/');
				segment.append(folder.getName());
				segment.append(stringBuilder);

				stringBuilder = segment;

				if (folder.getParentFolderId() <= 0) {
					break;
				}

				folder = JournalFolderLocalServiceUtil.fetchFolder(
					folder.getParentFolderId());
			}

			if (stringBuilder.length() > 0) {
				folderPath = stringBuilder.toString();
			}
		}
		catch (Exception e) {
			if (_log.isWarnEnabled()) {
				_log.warn(
					"Unable to resolve folder path for folderId " + folderId, e);
			}
		}

		folderPaths.put(folderId, folderPath);

		return folderPath;
	}

	private String _getTitle(JournalArticle article, String languageId) {
		String title = article.getTitle(languageId, true);

		if (Validator.isNotNull(title)) {
			return title;
		}

		title = article.getTitleCurrentValue();

		if (Validator.isNotNull(title)) {
			return title;
		}

		return article.getArticleId();
	}

	private String _getStructureName(
		long structureId, String languageId, Map<Long, String> structureNames) {

		if (structureId <= 0) {
			return "";
		}

		String cachedValue = structureNames.get(structureId);

		if (cachedValue != null) {
			return cachedValue;
		}

		String structureName = "";

		try {
			DDMStructure ddmStructure = DDMStructureLocalServiceUtil.fetchDDMStructure(
				structureId);

			if (ddmStructure != null) {
				structureName = ddmStructure.getName(languageId, true);

				if (Validator.isNull(structureName)) {
					structureName = ddmStructure.getNameCurrentValue();
				}
			}
		}
		catch (Exception e) {
			if (_log.isWarnEnabled()) {
				_log.warn(
					"Unable to resolve structure name for structureId " +
						structureId,
					e);
			}
		}

		structureNames.put(structureId, structureName);

		return structureName;
	}

	private WebContentStatisticsRow _toRow(
		JournalArticle article, String languageId, Map<Long, String> folderPaths,
		Map<Long, String> structureNames) {

		return new WebContentStatisticsRow(
			String.valueOf(article.getId()), article.getUuid(),
			String.valueOf(article.getResourcePrimKey()),
			String.valueOf(article.getGroupId()),
			String.valueOf(article.getCompanyId()),
			String.valueOf(article.getFolderId()),
			_getFolderPath(article.getFolderId(), folderPaths),
			article.getArticleId(), String.valueOf(article.getVersion()),
			_getTitle(article, languageId), article.getUrlTitle(),
			String.valueOf(article.getDDMStructureId()), article.getDDMTemplateKey(),
			_getStructureName(
				article.getDDMStructureId(), languageId, structureNames),
			String.valueOf(article.getUserId()), article.getUserName(),
			String.valueOf(article.getStatus()),
			WebContentStatisticsRow.toStatusLabel(article.getStatus()),
			String.valueOf(article.getStatusByUserId()),
			article.getStatusByUserName(), _formatDate(article.getCreateDate()),
			_formatDate(article.getModifiedDate()),
			_formatDate(article.getDisplayDate()),
			_formatDate(article.getExpirationDate()),
			_formatDate(article.getReviewDate()),
			String.valueOf(article.isIndexable()),
			String.valueOf(article.isSmallImage()),
			String.valueOf(article.getSmallImageId()), article.getSmallImageURL(),
			article.getStatus(), article.getDDMStructureId(), article.getFolderId(),
			article.getUserId(), _formatMonth(article.getCreateDate()),
			_formatMonth(article.getModifiedDate()));
	}

	private static final int _BATCH_SIZE = 500;

	private static final Log _log = LogFactoryUtil.getLog(
		WebContentStatisticsExportService.class);

	private final WebContentStatisticsExcelWriter
		_webContentStatisticsExcelWriter =
			new WebContentStatisticsExcelWriter();

}
