package vn.vec.custom.admin.webcontent.advancedsearch;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.util.PortalUtil;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(
	property = {
		"osgi.jaxrs.application.select=(osgi.jaxrs.name=VecAuditLog)",
		"osgi.jaxrs.resource=true"
	},
	service = WebContentAdvancedSearchResource.class
)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/web-content-advanced-search")
@Produces(MediaType.APPLICATION_JSON)
public class WebContentAdvancedSearchResource {

	@GET
	public Response getWebContentAdvancedSearch(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("keyword") String keyword,
		@QueryParam("groupId") String groupId,
		@QueryParam("folderId") String folderId,
		@QueryParam("status") @DefaultValue("-1") String status,
		@QueryParam("structureId") String structureId,
		@QueryParam("userId") String userId,
		@QueryParam("userName") String userName,
		@QueryParam("dateField") @DefaultValue("modifiedDate") String dateField,
		@QueryParam("fromDate") String fromDate,
		@QueryParam("toDate") String toDate,
		@QueryParam("page") @DefaultValue("1") String page,
		@QueryParam("pageSize") @DefaultValue("20") String pageSize,
		@QueryParam("sortField") @DefaultValue("modifiedDate") String sortField,
		@QueryParam("sortOrder") @DefaultValue("desc") String sortOrder) {

		try {
			long requestedGroupId = _parseLong(groupId, "groupId", false);
			WebContentAdvancedSearchPermission.AccessContext accessContext =
				_webContentAdvancedSearchPermission.getAccessContext(
					httpServletRequest, requestedGroupId);
			User user = accessContext.getUser();
			WebContentAdvancedSearchQuery query = _buildQuery(
				httpServletRequest, user, requestedGroupId, folderId, status,
				structureId, userId, userName, keyword, dateField, fromDate,
				toDate, page, pageSize, sortField, sortOrder, accessContext);
			WebContentAdvancedSearchResult result =
				_webContentAdvancedSearchService.search(
					query, httpServletRequest);

			return _cors(Response.ok(_toJSONObject(result).toString())).build();
		}
		catch (SecurityException securityException) {
			return _jsonError(
				Response.Status.FORBIDDEN, securityException.getMessage());
		}
		catch (DateTimeParseException dateTimeParseException) {
			return _jsonError(
				Response.Status.BAD_REQUEST,
				"fromDate/toDate phải đúng định dạng yyyy-MM-dd.");
		}
		catch (IllegalArgumentException illegalArgumentException) {
			return _jsonError(
				Response.Status.BAD_REQUEST, illegalArgumentException.getMessage());
		}
		catch (Exception exception) {
			return _jsonError(
				Response.Status.INTERNAL_SERVER_ERROR,
				"Không thể tải danh sách Web Content nâng cao.");
		}
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response options() {
		return _cors(Response.ok()).build();
	}

	private WebContentAdvancedSearchQuery _buildQuery(
			HttpServletRequest httpServletRequest, User user, long requestedGroupId,
			String folderId, String status, String structureId, String userId,
			String userName, String keyword, String dateField, String fromDate,
			String toDate, String page, String pageSize, String sortField,
			String sortOrder,
			WebContentAdvancedSearchPermission.AccessContext accessContext)
		throws Exception {

		long parsedFolderId = _parseLong(folderId, "folderId", false);
		int parsedStatus = _parseInt(status, "status", true);
		long parsedStructureId = _parseLong(structureId, "structureId", false);
		long parsedUserId = _parseLong(userId, "userId", false);
		int parsedPage = _parsePositiveInt(page, "page");
		int parsedPageSize = _parsePositiveInt(pageSize, "pageSize");
		String normalizedDateField = _normalizeDateField(dateField);
		String normalizedSortField = _normalizeSortField(sortField);
		String normalizedSortOrder = _normalizeSortOrder(sortOrder);
		Date parsedFromDate = WebContentAdvancedSearchUtil.parseStartDate(
			fromDate);
		Date parsedToDateExclusive =
			WebContentAdvancedSearchUtil.parseEndDateExclusive(toDate);

		if (!_ALLOWED_STATUSES.contains(parsedStatus)) {
			throw new IllegalArgumentException(
				"status không hợp lệ. Chỉ hỗ trợ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8.");
		}

		if (!_ALLOWED_PAGE_SIZES.contains(parsedPageSize)) {
			throw new IllegalArgumentException(
				"pageSize chỉ hỗ trợ 10, 20, 50 hoặc 100.");
		}

		if ((fromDate != null) && !fromDate.trim().isEmpty() &&
			(toDate != null) && !toDate.trim().isEmpty() &&
			LocalDate.parse(fromDate.trim()).isAfter(LocalDate.parse(toDate.trim()))) {

			throw new IllegalArgumentException(
				"fromDate không được lớn hơn toDate.");
		}

		return new WebContentAdvancedSearchQuery(
			PortalUtil.getCompanyId(httpServletRequest), requestedGroupId,
			parsedFolderId, parsedStatus, parsedStructureId, parsedUserId,
			WebContentAdvancedSearchUtil.sanitizeKeyword(userName),
			WebContentAdvancedSearchUtil.sanitizeKeyword(keyword),
			normalizedDateField, parsedFromDate, parsedToDateExclusive,
			parsedPage, parsedPageSize, normalizedSortField, normalizedSortOrder,
			WebContentAdvancedSearchUtil.toUserLanguageId(user, httpServletRequest),
			accessContext.getAllowedGroupIds(),
			accessContext.isUnrestrictedGroupScope());
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder builder) {
		return builder
			.header("Access-Control-Allow-Origin", "*")
			.header(
				"Access-Control-Allow-Headers",
				"Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, OPTIONS")
			.header("Access-Control-Allow-Credentials", "true");
	}

	private Response _jsonError(Response.Status status, String message) {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("message", message);
		jsonObject.put("status", status.getStatusCode());

		return _cors(Response.status(status).entity(jsonObject.toString())).build();
	}

	private String _normalizeDateField(String value) {
		if (!_ALLOWED_DATE_FIELDS.contains(value)) {
			throw new IllegalArgumentException(
				"dateField chỉ hỗ trợ createDate, modifiedDate, displayDate.");
		}

		return value;
	}

	private String _normalizeSortField(String value) {
		if (!_ALLOWED_SORT_FIELDS.contains(value)) {
			throw new IllegalArgumentException(
				"sortField chỉ hỗ trợ title, createDate, modifiedDate, displayDate, status, userName.");
		}

		return value;
	}

	private String _normalizeSortOrder(String value) {
		if (!"asc".equals(value) && !"desc".equals(value)) {
			throw new IllegalArgumentException("sortOrder chỉ hỗ trợ asc hoặc desc.");
		}

		return value;
	}

	private int _parseInt(String value, String fieldName, boolean allowNegative) {
		if ((value == null) || value.trim().isEmpty()) {
			return allowNegative ? -1 : 0;
		}

		try {
			return Integer.parseInt(value.trim());
		}
		catch (NumberFormatException numberFormatException) {
			throw new IllegalArgumentException(fieldName + " phải là số nguyên.");
		}
	}

	private long _parseLong(
		String value, String fieldName, boolean required) {

		if ((value == null) || value.trim().isEmpty()) {
			if (required) {
				throw new IllegalArgumentException(fieldName + " là bắt buộc.");
			}

			return 0;
		}

		try {
			return Long.parseLong(value.trim());
		}
		catch (NumberFormatException numberFormatException) {
			throw new IllegalArgumentException(fieldName + " phải là số.");
		}
	}

	private int _parsePositiveInt(String value, String fieldName) {
		int parsedValue = _parseInt(value, fieldName, false);

		if (parsedValue < 1) {
			throw new IllegalArgumentException(fieldName + " phải lớn hơn hoặc bằng 1.");
		}

		return parsedValue;
	}

	private JSONObject _toJSONObject(WebContentAdvancedSearchResult result) {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();
		JSONArray items = JSONFactoryUtil.createJSONArray();

		for (WebContentAdvancedSearchRow row : result.getItems()) {
			JSONObject item = JSONFactoryUtil.createJSONObject();

			item.put("articleId", row.getArticleId());
			item.put("resourcePrimKey", row.getResourcePrimKey());
			item.put("groupId", row.getGroupId());
			item.put("groupName", row.getGroupName());
			item.put("folderId", row.getFolderId());
			item.put("folderName", row.getFolderName());
			item.put("title", row.getTitle());
			item.put("version", row.getVersion());
			item.put("status", row.getStatus());
			item.put("statusLabel", row.getStatusLabel());
			item.put("userId", row.getUserId());
			item.put("userName", row.getUserName());
			item.put(
				"createDate",
				WebContentAdvancedSearchUtil.toDateTimeString(
					row.getCreateDate()));
			item.put(
				"modifiedDate",
				WebContentAdvancedSearchUtil.toDateTimeString(
					row.getModifiedDate()));
			item.put(
				"displayDate",
				WebContentAdvancedSearchUtil.toDateTimeString(
					row.getDisplayDate()));
			item.put("editUrl", row.getEditUrl());
			item.put("viewUrl", row.getViewUrl());

			items.put(item);
		}

		jsonObject.put("items", items);
		jsonObject.put("total", result.getTotal());
		jsonObject.put("page", result.getPage());
		jsonObject.put("pageSize", result.getPageSize());

		return jsonObject;
	}

	private static final Set<String> _ALLOWED_DATE_FIELDS = new HashSet<>(
		Arrays.asList("createDate", "modifiedDate", "displayDate"));
	private static final Set<Integer> _ALLOWED_PAGE_SIZES = new HashSet<>(
		Arrays.asList(10, 20, 50, 100));
	private static final Set<String> _ALLOWED_SORT_FIELDS = new HashSet<>(
		Arrays.asList(
			"title", "createDate", "modifiedDate", "displayDate", "status",
			"userName"));
	private static final Set<Integer> _ALLOWED_STATUSES = new HashSet<>(
		Arrays.asList(-1, 0, 1, 2, 3, 4, 5, 6, 7, 8));

	@Reference
	private WebContentAdvancedSearchPermission _webContentAdvancedSearchPermission;

	@Reference
	private WebContentAdvancedSearchService _webContentAdvancedSearchService;

}
