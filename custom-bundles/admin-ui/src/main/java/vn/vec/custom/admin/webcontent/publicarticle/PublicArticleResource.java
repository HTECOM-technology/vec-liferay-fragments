package vn.vec.custom.admin.webcontent.publicarticle;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/")
public class PublicArticleResource {

	@GET
	@Path("/journal-articles/basic-info")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getBasicInfo(@QueryParam("urlTitle") String urlTitle) {
		String normalizedUrlTitle = _normalize(urlTitle);

		if (normalizedUrlTitle.isEmpty()) {
			return _badRequest("urlTitle là bắt buộc.");
		}

		List<String> candidateTitles = _buildCandidateTitles(normalizedUrlTitle);

		Connection con = null;
		PreparedStatement ps = null;
		ResultSet rs = null;

		try {
			con = DataAccess.getConnection();
			ps = con.prepareStatement(_buildSql(candidateTitles.size()));
			long journalArticleClassNameId = _getJournalArticleClassNameId(con);

			int index = _bindCandidates(ps, 1, candidateTitles);

			_bindCandidates(ps, index, candidateTitles);

			rs = ps.executeQuery();

			JSONArray items = JSONFactoryUtil.createJSONArray();

			while (rs.next()) {
				JSONObject item = JSONFactoryUtil.createJSONObject();

				item.put("id_", rs.getLong("id_"));
				item.put(
					"structuredContentId",
					rs.getLong("structuredContentId"));
				item.put("createDate", _format(rs.getTimestamp("createDate")));
				item.put("modifiedDate", _format(rs.getTimestamp("modifiedDate")));
				item.put("treePath", rs.getString("treePath"));
				item.put("articleId", rs.getString("articleId"));
				item.put("DDMStructureId", rs.getLong("DDMStructureId"));
				item.put("userId", rs.getLong("userId"));
				item.put("userName", _nullToBlank(rs.getString("userName")));
				item.put(
					"categories",
					_getCategories(
						con, journalArticleClassNameId,
						rs.getLong("structuredContentId")));

				items.put(item);
			}

			if (items.length() == 0) {
				return _notFound("Không tìm thấy bài viết phù hợp với urlTitle đã cung cấp.");
			}

			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("urlTitle", normalizedUrlTitle);
			result.put("total", items.length());
			result.put("items", items);

			return _ok(result);
		}
		catch (Exception e) {
			_log.error(
				"Lỗi khi lấy thông tin bài viết theo urlTitle " +
					normalizedUrlTitle + ": " + e.getMessage(),
				e);

			return _serverError();
		}
		finally {
			DataAccess.cleanUp(rs);
			DataAccess.cleanUp(ps);
			DataAccess.cleanUp(con);
		}
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response options() {
		return _cors(Response.ok()).build();
	}

	private List<String> _buildCandidateTitles(String urlTitle) {
		Set<String> candidateSet = new LinkedHashSet<>();

		candidateSet.add(urlTitle);

		if (_ENCODED_PATTERN.matcher(urlTitle).find()) {
			String decoded = _decode(urlTitle);

			candidateSet.add(decoded);
			candidateSet.add(_encode(decoded));
		}
		else {
			candidateSet.add(_decode(urlTitle));
			candidateSet.add(_encode(urlTitle));
		}

		List<String> candidates = new ArrayList<>();

		for (String candidate : candidateSet) {
			String normalizedCandidate = _normalize(candidate);

			if (!normalizedCandidate.isEmpty()) {
				candidates.add(normalizedCandidate);
			}
		}

		return candidates;
	}

	private String _buildCategoryBreadcrumb(
			Connection con, String categoryName, long categoryId, String treePath,
			String vocabularyTitle, Map<Long, String> categoryNameCache)
		throws Exception {

		List<Long> categoryIds = _parseCategoryTreePath(treePath, categoryId);
		List<String> breadcrumbParts = new ArrayList<>();

		for (Long currentCategoryId : categoryIds) {
			String currentCategoryName = categoryNameCache.get(currentCategoryId);

			if (currentCategoryName == null) {
				if (currentCategoryId == categoryId) {
					currentCategoryName = categoryName;
				}
				else {
					currentCategoryName = _getCategoryName(con, currentCategoryId);
				}

				if (!currentCategoryName.isEmpty()) {
					categoryNameCache.put(currentCategoryId, currentCategoryName);
				}
			}

			if (!currentCategoryName.isEmpty()) {
				breadcrumbParts.add(currentCategoryName);
			}
		}

		String breadcrumb = String.join(" > ", breadcrumbParts);

		if ((breadcrumbParts.size() <= 1) &&
			!_normalize(vocabularyTitle).isEmpty() &&
			!_normalize(vocabularyTitle).equalsIgnoreCase(
				_normalize(categoryName))) {

			return vocabularyTitle + " > " + categoryName;
		}

		return breadcrumb;
	}

	private String _buildPlaceholders(int count) {
		StringBuilder stringBuilder = new StringBuilder();

		for (int i = 0; i < count; i++) {
			if (i > 0) {
				stringBuilder.append(", ");
			}

			stringBuilder.append("?");
		}

		return stringBuilder.toString();
	}

	private String _buildSql(int candidateCount) {
		String placeholders = _buildPlaceholders(candidateCount);

		return "SELECT ja.id_ AS id_, ja.createDate AS createDate, " +
			"ja.resourcePrimKey AS structuredContentId, " +
			"ja.modifiedDate AS modifiedDate, ja.treePath AS treePath, " +
			"ja.articleId AS articleId, ja.DDMStructureId AS DDMStructureId, " +
			"ja.userId AS userId, ja.userName AS userName " +
			"FROM JournalArticle ja " +
			"JOIN (" +
			" SELECT resourcePrimKey, MAX(version) AS maxVersion " +
			" FROM JournalArticle " +
			" WHERE urlTitle IN (" + placeholders + ") " +
			"   AND status = 0 " +
			"   AND ctCollectionId = 0 " +
			" GROUP BY resourcePrimKey" +
			") latest ON latest.resourcePrimKey = ja.resourcePrimKey " +
			"AND latest.maxVersion = ja.version " +
			"WHERE ja.urlTitle IN (" + placeholders + ") " +
			"  AND ja.status = 0 " +
			"  AND ja.ctCollectionId = 0 " +
			"ORDER BY ja.modifiedDate DESC, ja.id_ DESC";
	}

	private JSONArray _getCategories(
			Connection con, long classNameId, long structuredContentId)
		throws Exception {

		JSONArray categories = JSONFactoryUtil.createJSONArray();
		Map<Long, String> categoryNameCache = new HashMap<>();
		PreparedStatement ps = null;
		ResultSet rs = null;

		try {
			ps = con.prepareStatement(
				"SELECT ac.categoryId, ac.parentCategoryId, ac.treePath, " +
				"ac.name, ac.vocabularyId, av.name AS vocabularyName, " +
				"av.title AS vocabularyTitle " +
				"FROM AssetEntry ae " +
				"JOIN AssetEntryAssetCategoryRel aec " +
				"ON aec.assetEntryId = ae.entryId AND aec.ctCollectionId = 0 " +
				"JOIN AssetCategory ac " +
				"ON ac.categoryId = aec.assetCategoryId AND ac.ctCollectionId = 0 " +
				"LEFT JOIN AssetVocabulary av " +
				"ON av.vocabularyId = ac.vocabularyId AND av.ctCollectionId = 0 " +
				"WHERE ae.classNameId = ? " +
				"  AND ae.classPK = ? " +
				"  AND ae.ctCollectionId = 0 " +
				"ORDER BY ac.treePath ASC, aec.priority ASC, ac.categoryId ASC");

			ps.setLong(1, classNameId);
			ps.setLong(2, structuredContentId);

			rs = ps.executeQuery();

			while (rs.next()) {
				JSONObject category = JSONFactoryUtil.createJSONObject();
				long categoryId = rs.getLong("categoryId");
				String categoryName = _nullToBlank(rs.getString("name"));
				long parentCategoryId = rs.getLong("parentCategoryId");
				String treePath = _nullToBlank(rs.getString("treePath"));
				String vocabularyTitle = _extractLocalizedTitle(
					rs.getString("vocabularyTitle"));

				category.put("categoryId", categoryId);
				category.put("name", categoryName);
				category.put("parentCategoryId", parentCategoryId);
				category.put("treePath", treePath);
				category.put("vocabularyId", rs.getLong("vocabularyId"));
				category.put(
					"vocabularyName", _nullToBlank(rs.getString("vocabularyName")));
				category.put("vocabularyTitle", vocabularyTitle);
				category.put(
					"parentName",
					_getParentName(con, parentCategoryId, vocabularyTitle));
				category.put(
					"breadcrumb",
					_buildCategoryBreadcrumb(
						con, categoryName, categoryId, treePath, vocabularyTitle,
						categoryNameCache));

				categories.put(category);
			}
		}
		finally {
			DataAccess.cleanUp(rs);
			DataAccess.cleanUp(ps);
		}

		return categories;
	}

	private int _bindCandidates(
			PreparedStatement ps, int startIndex, List<String> candidateTitles)
		throws Exception {

		int index = startIndex;

		for (String candidateTitle : candidateTitles) {
			ps.setString(index++, candidateTitle);
		}

		return index;
	}

	private String _getCategoryName(Connection con, long categoryId)
		throws Exception {

		PreparedStatement ps = null;
		ResultSet rs = null;

		try {
			ps = con.prepareStatement(
				"SELECT name FROM AssetCategory " +
				"WHERE categoryId = ? AND ctCollectionId = 0");
			ps.setLong(1, categoryId);

			rs = ps.executeQuery();

			if (rs.next()) {
				return _nullToBlank(rs.getString("name"));
			}

			return "";
		}
		finally {
			DataAccess.cleanUp(rs);
			DataAccess.cleanUp(ps);
		}
	}

	private long _getJournalArticleClassNameId(Connection con) throws Exception {
		PreparedStatement ps = null;
		ResultSet rs = null;

		try {
			ps = con.prepareStatement(
				"SELECT classNameId FROM ClassName_ WHERE value = ?");
			ps.setString(1, "com.liferay.journal.model.JournalArticle");

			rs = ps.executeQuery();

			if (rs.next()) {
				return rs.getLong("classNameId");
			}

			throw new IllegalStateException(
				"Không tìm thấy classNameId cho JournalArticle.");
		}
		finally {
			DataAccess.cleanUp(rs);
			DataAccess.cleanUp(ps);
		}
	}

	private String _getParentName(
			Connection con, long parentCategoryId, String vocabularyTitle)
		throws Exception {

		if (parentCategoryId > 0) {
			return _getCategoryName(con, parentCategoryId);
		}

		return _nullToBlank(vocabularyTitle);
	}

	private String _decode(String value) {
		try {
			return URLDecoder.decode(value, StandardCharsets.UTF_8.name());
		}
		catch (Exception e) {
			return value;
		}
	}

	private String _encode(String value) {
		try {
			return URLEncoder.encode(value, StandardCharsets.UTF_8.name()).replace(
				"+", "%20");
		}
		catch (Exception e) {
			return value;
		}
	}

	private String _extractLocalizedTitle(String rawValue) {
		String normalizedValue = _nullToBlank(rawValue).trim();

		if (normalizedValue.isEmpty()) {
			return "";
		}

		if (!normalizedValue.contains("<")) {
			return normalizedValue;
		}

		Matcher vietnameseMatcher = _VIETNAMESE_TITLE_PATTERN.matcher(
			normalizedValue);

		if (vietnameseMatcher.find()) {
			return _normalizeXmlValue(vietnameseMatcher.group(1));
		}

		Matcher defaultMatcher = _DEFAULT_TITLE_PATTERN.matcher(normalizedValue);

		if (defaultMatcher.find()) {
			return _normalizeXmlValue(defaultMatcher.group(1));
		}

		return normalizedValue;
	}

	private String _format(Timestamp timestamp) {
		if (timestamp == null) {
			return "";
		}

		return _DATE_TIME_FORMATTER.format(
			timestamp.toInstant().atZone(ZoneId.systemDefault()));
	}

	private String _nullToBlank(String value) {
		if (value == null) {
			return "";
		}

		return value;
	}

	private String _normalizeXmlValue(String value) {
		String normalizedValue = _nullToBlank(value).trim();

		if (normalizedValue.startsWith("<![CDATA[") &&
			normalizedValue.endsWith("]]>")) {

			return normalizedValue.substring(9, normalizedValue.length() - 3).trim();
		}

		return normalizedValue;
	}

	private String _normalize(String value) {
		if (value == null) {
			return "";
		}

		return value.trim();
	}

	private List<Long> _parseCategoryTreePath(String treePath, long categoryId) {
		List<Long> categoryIds = new ArrayList<>();

		if (treePath != null && !treePath.trim().isEmpty()) {
			String[] parts = treePath.split("/");

			for (String part : parts) {
				String normalizedPart = part.trim();

				if (normalizedPart.isEmpty()) {
					continue;
				}

				try {
					long parsedCategoryId = Long.parseLong(normalizedPart);

					if (parsedCategoryId > 0) {
						categoryIds.add(parsedCategoryId);
					}
				}
				catch (NumberFormatException numberFormatException) {
				}
			}
		}

		if (categoryIds.isEmpty() ||
			!categoryIds.get(categoryIds.size() - 1).equals(categoryId)) {

			categoryIds.add(categoryId);
		}

		return categoryIds;
	}

	private Response _badRequest(String message) {
		return _cors(
			Response.status(Response.Status.BAD_REQUEST)
				.type(MediaType.APPLICATION_JSON)
				.entity("{\"error\":\"" + _escapeJson(message) + "\"}")
		).build();
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder builder) {
		return builder
			.header("Access-Control-Allow-Origin", "*")
			.header(
				"Access-Control-Allow-Headers",
				"Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, OPTIONS");
	}

	private String _escapeJson(String value) {
		return value.replace("\\", "\\\\").replace("\"", "\\\"");
	}

	private Response _notFound(String message) {
		return _cors(
			Response.status(Response.Status.NOT_FOUND)
				.type(MediaType.APPLICATION_JSON)
				.entity("{\"error\":\"" + _escapeJson(message) + "\"}")
		).build();
	}

	private Response _ok(JSONObject jsonObject) {
		return _cors(
			Response.ok(jsonObject.toString(), MediaType.APPLICATION_JSON)
		).build();
	}

	private Response _serverError() {
		return _cors(
			Response.serverError()
				.type(MediaType.APPLICATION_JSON)
				.entity(
					"{\"error\":\"Máy chủ đang gặp lỗi. Vui lòng thử lại sau.\"}")
		).build();
	}

	private static final DateTimeFormatter _DATE_TIME_FORMATTER =
		DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

	private static final Pattern _ENCODED_PATTERN = Pattern.compile(
		"%[0-9A-Fa-f]{2}");

	private static final Pattern _DEFAULT_TITLE_PATTERN = Pattern.compile(
		"<Title[^>]*>(.*?)</Title>", Pattern.DOTALL);

	private static final Pattern _VIETNAMESE_TITLE_PATTERN = Pattern.compile(
		"<Title[^>]*language-id=\"vi_VN\"[^>]*>(.*?)</Title>",
		Pattern.DOTALL);

	private static final Log _log = LogFactoryUtil.getLog(
		PublicArticleResource.class);

}
