package vn.vec.custom.admin.workflow.resource;

import com.liferay.asset.kernel.AssetRendererFactoryRegistryUtil;
import com.liferay.asset.kernel.model.AssetRenderer;
import com.liferay.asset.kernel.model.AssetRendererFactory;
import com.liferay.journal.constants.JournalPortletKeys;
import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.service.JournalArticleLocalServiceUtil;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.Role;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.url.builder.PortletURLBuilder;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.GroupLocalServiceUtil;
import com.liferay.portal.kernel.service.permission.PortalPermissionUtil;
import com.liferay.portal.kernel.service.RoleLocalServiceUtil;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.kernel.workflow.WorkflowLog;

import java.net.URLEncoder;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import javax.portlet.PortletRequest;
import javax.portlet.PortletURL;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.webcontent.advancedsearch.WebContentAdvancedSearchUtil;
import vn.vec.custom.admin.workflow.model.WorkflowReviewItem;
import vn.vec.custom.admin.workflow.model.WorkflowReviewQuery;
import vn.vec.custom.admin.workflow.service.WorkflowReviewService;

@Component(
	property = {
		"osgi.jaxrs.application.select=(osgi.jaxrs.name=VecAuditLog)",
		"osgi.jaxrs.resource=true"
	},
	service = WorkflowReviewResource.class
)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/workflow-review")
@Produces(MediaType.APPLICATION_JSON)
public class WorkflowReviewResource {

	@GET
	public Response getWorkflowReviewItems(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("keyword") String keyword,
		@QueryParam("status") String status,
		@QueryParam("assetType") String assetType,
		@QueryParam("tab") @DefaultValue("all") String tab,
		@QueryParam("start") @DefaultValue("0") int start,
		@QueryParam("end") @DefaultValue("20") int end,
		@QueryParam("orderBy") @DefaultValue("createDate") String orderBy,
		@QueryParam("orderDirection") @DefaultValue("desc")
			String orderDirection,
		@QueryParam("creatorUserId") @DefaultValue("0") long creatorUserId,
		@QueryParam("assigneeUserId") @DefaultValue("0") long assigneeUserId,
		@QueryParam("completedByUserId") @DefaultValue("0")
			long completedByUserId,
		@QueryParam("createDateFrom") @DefaultValue("0") long createDateFrom,
		@QueryParam("createDateTo") @DefaultValue("0") long createDateTo) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			// Check if user can access workflow reviews (must have permission)
			if (!_canAccessWorkflowReview(user)) {
				return _forbidden(
					"You don't have permission to access workflow reviews.");
			}

			long companyId = user.getCompanyId();

			WorkflowReviewQuery query = new WorkflowReviewQuery();
			query.setKeyword(keyword);
			query.setStatus(status);
			query.setAssetType(assetType);
			query.setTab(tab);
			query.setStart(start);
			query.setEnd(end);
			query.setOrderBy(orderBy);
			query.setOrderDirection(orderDirection);
			query.setCreatorUserId(creatorUserId);
			query.setAssigneeUserId(assigneeUserId);
			query.setCompletedByUserId(completedByUserId);

			if (createDateFrom > 0) {
				query.setCreateDateFrom(new Date(createDateFrom));
			}

			if (createDateTo > 0) {
				query.setCreateDateTo(new Date(createDateTo));
			}

			List<WorkflowReviewItem> items =
				_workflowReviewService.getWorkflowReviewItems(
					companyId, userId, query);

			int total =
				_workflowReviewService.getWorkflowReviewItemsCount(
					companyId, userId, query);

			JSONObject result = JSONFactoryUtil.createJSONObject();
			result.put("total", total);
			result.put("items", _itemsToJSON(items));

			return Response.ok(result.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	@GET
	@Path("/{workflowTaskId}/detail")
	public Response getWorkflowReviewItemDetail(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("workflowTaskId") long workflowTaskId) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			if (!_canAccessWorkflowReview(user)) {
				return _forbidden(
					"You don't have permission to access workflow reviews.");
			}

			WorkflowReviewItem item =
				_workflowReviewService.getWorkflowReviewItemDetail(
					user.getCompanyId(), workflowTaskId);

			if (item == null) {
				JSONObject error = JSONFactoryUtil.createJSONObject();
				error.put("error", "Not found");

				return Response.status(Response.Status.NOT_FOUND).entity(
					error.toString()).build();
			}

			JSONObject json = _itemToDetailJSON(item);

			json.put(
				"parentUrl",
				_getParentUrl(httpServletRequest, item));

			return Response.ok(json.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	@GET
	@Path("/resolve")
	public Response resolveRejectedWorkflowTask(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("workflowTaskId") @DefaultValue("0")
			long workflowTaskId) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			JSONObject json = JSONFactoryUtil.createJSONObject();
			json.put("allowed", false);
			json.put("folderURL", "");
			json.put("editURL", "");

			if ((workflowTaskId <= 0) || !_hasEditorRole(user)) {
				return Response.ok(json.toString()).build();
			}

			WorkflowReviewItem item =
				_workflowReviewService.getWorkflowReviewItemDetail(
					user.getCompanyId(), workflowTaskId);

			if ((item == null) ||
				!"denied".equals(item.getStatus()) ||
				!"com.liferay.journal.model.JournalArticle".equals(
					item.getAssetType())) {

				return Response.ok(json.toString()).build();
			}

			JournalArticle article =
				JournalArticleLocalServiceUtil.fetchJournalArticle(
					item.getAssetPrimaryKey());

			if (article == null) {
				article = JournalArticleLocalServiceUtil.fetchLatestArticle(
					item.getAssetPrimaryKey());
			}

			if (article == null) {
				return Response.ok(json.toString()).build();
			}

			Group group = GroupLocalServiceUtil.fetchGroup(article.getGroupId());

			if (group == null) {
				return Response.ok(json.toString()).build();
			}

			json.put("allowed", true);
			json.put(
				"folderURL",
				_buildWebContentFolderURL(httpServletRequest, group, article));

			String editURL = WebContentAdvancedSearchUtil.buildEditUrl(
				httpServletRequest, group, article.getArticleId(),
				article.getGroupId(), article.getVersion());

			if (Validator.isNull(editURL)) {
				editURL = _buildWebContentEditURL(
					httpServletRequest, group, article);
			}

			json.put(
				"editURL", editURL);

			return Response.ok(json.toString()).build();
		}
		catch (Exception e) {
			return _serverError(e);
		}
	}

	@POST
	@Path("/{workflowTaskId}/approve")
	public Response approveWorkflowTask(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("workflowTaskId") long workflowTaskId,
		String requestBody) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			if (!_canAccessWorkflowReview(user)) {
				return _forbidden(
					"You don't have permission to approve workflow tasks.");
			}

			String comment = "";
			if (requestBody != null && !requestBody.isEmpty()) {
				JSONObject json = JSONFactoryUtil.createJSONObject(
					requestBody);
				comment = json.getString("comment");
				if (comment == null) {
					comment = "";
				}
			}

			_workflowReviewService.approveWorkflowTask(
				user.getCompanyId(), userId, workflowTaskId, comment);

			JSONObject result = JSONFactoryUtil.createJSONObject();
			result.put("success", true);
			result.put("message", "Task approved successfully");

			return Response.ok(result.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	@POST
	@Path("/{workflowTaskId}/reject")
	public Response rejectWorkflowTask(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("workflowTaskId") long workflowTaskId,
		String requestBody) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			if (!_canAccessWorkflowReview(user)) {
				return _forbidden(
					"You don't have permission to reject workflow tasks.");
			}

			String comment = "";
			if (requestBody != null && !requestBody.isEmpty()) {
				JSONObject json = JSONFactoryUtil.createJSONObject(
					requestBody);
				comment = json.getString("comment");
				if (comment == null) {
					comment = "";
				}
			}

			_workflowReviewService.rejectWorkflowTask(
				user.getCompanyId(), userId, workflowTaskId, comment);

			JSONObject result = JSONFactoryUtil.createJSONObject();
			result.put("success", true);
			result.put("message", "Task rejected successfully");

			return Response.ok(result.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	@POST
	@Path("/{workflowTaskId}/assign")
	public Response assignWorkflowTask(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("workflowTaskId") long workflowTaskId,
		String requestBody) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			if (!_canAccessWorkflowReview(user)) {
				return _forbidden(
					"You don't have permission to assign workflow tasks.");
			}

			long assigneeUserId = 0;
			String comment = "";
			if (requestBody != null && !requestBody.isEmpty()) {
				JSONObject json = JSONFactoryUtil.createJSONObject(
					requestBody);
				assigneeUserId = json.getLong("assigneeUserId");
				comment = json.getString("comment");
				if (comment == null) {
					comment = "";
				}
			}

			if (assigneeUserId <= 0) {
				JSONObject result = JSONFactoryUtil.createJSONObject();
				result.put("success", false);
				result.put("message", "Vui lòng chọn người xử lý.");

				return Response.ok(result.toString()).build();
			}

			_workflowReviewService.assignWorkflowTask(
				user.getCompanyId(), userId, workflowTaskId, assigneeUserId,
				comment);

			JSONObject result = JSONFactoryUtil.createJSONObject();
			result.put("success", true);
			result.put("message", "Task assigned successfully");

			return Response.ok(result.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	@GET
	@Path("/{workflowTaskId}/assignable-users")
	public Response getAssignableUsers(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("workflowTaskId") long workflowTaskId) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			if (!_canAccessWorkflowReview(user)) {
				return _forbidden(
					"You don't have permission to assign workflow tasks.");
			}

			long companyId = user.getCompanyId();

			long currentAssigneeUserId =
				_workflowReviewService.getAssigneeUserId(
					companyId, workflowTaskId);

			JSONArray users = JSONFactoryUtil.createJSONArray();

			for (User assignableUser :
					_workflowReviewService.getAssignableUsers(workflowTaskId)) {

				JSONObject userJSON = JSONFactoryUtil.createJSONObject();

				userJSON.put("userId", assignableUser.getUserId());
				userJSON.put("screenName", assignableUser.getScreenName());
				userJSON.put("fullName", assignableUser.getFullName());
				userJSON.put(
					"label",
					assignableUser.getScreenName() + " (" +
						assignableUser.getFullName() + ")");

				users.put(userJSON);
			}

			JSONObject result = JSONFactoryUtil.createJSONObject();
			result.put("users", users);
			result.put("currentAssigneeUserId", currentAssigneeUserId);

			return Response.ok(result.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	@POST
	@Path("/{workflowTaskId}/due-date")
	public Response updateWorkflowTaskDueDate(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("workflowTaskId") long workflowTaskId,
		String requestBody) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			if (!_canAccessWorkflowReview(user)) {
				return _forbidden(
					"You don't have permission to update workflow tasks.");
			}

			Date dueDate = null;
			String comment = "";

			if (requestBody != null && !requestBody.isEmpty()) {
				JSONObject json = JSONFactoryUtil.createJSONObject(
					requestBody);

				long dueDateMillis = json.getLong("dueDate");

				if (dueDateMillis > 0) {
					dueDate = new Date(dueDateMillis);
				}

				comment = json.getString("comment");
				if (comment == null) {
					comment = "";
				}
			}

			_workflowReviewService.updateWorkflowTaskDueDate(
				user.getCompanyId(), userId, workflowTaskId, dueDate, comment);

			JSONObject result = JSONFactoryUtil.createJSONObject();
			result.put("success", true);
			result.put("message", "Due date updated successfully");

			return Response.ok(result.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	@GET
	@Path("/filter-users")
	public Response getFilterUsers(
		@Context HttpServletRequest httpServletRequest) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			if (!_canAccessWorkflowReview(user)) {
				return _forbidden(
					"You don't have permission to access workflow reviews.");
			}

			WorkflowReviewQuery query = new WorkflowReviewQuery();
			query.setTab("all");
			query.setStart(0);
			query.setEnd(Integer.MAX_VALUE);

			List<WorkflowReviewItem> items =
				_workflowReviewService.getWorkflowReviewItems(
					user.getCompanyId(), userId, query);

			Map<Long, String> authors = new LinkedHashMap<>();
			Map<Long, String> assignees = new LinkedHashMap<>();
			Map<Long, String> processors = new LinkedHashMap<>();

			for (WorkflowReviewItem item : items) {
				_collectUser(
					authors, item.getCreatorUserId(),
					item.getCreatorUserName());
				_collectUser(
					assignees, item.getAssigneeUserId(),
					item.getAssigneeUserName());

				// Người xử lý: chỉ tính item đã thực sự được duyệt/từ chối.
				boolean processed =
					!item.isReviewable() &&
					("approved".equals(item.getStatus()) ||
					 "denied".equals(item.getStatus()));

				if (processed) {
					_collectUser(
						processors, item.getCompletedByUserId(),
						item.getCompletedByUserName());
				}
			}

			JSONObject result = JSONFactoryUtil.createJSONObject();
			result.put("authors", _usersToJSON(authors));
			result.put("assignees", _usersToJSON(assignees));
			result.put("processors", _usersToJSON(processors));

			return Response.ok(result.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	@GET
	@Path("/{workflowTaskId}/activities")
	public Response getWorkflowActivities(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("workflowTaskId") long workflowTaskId) {

		try {
			long userId = _getSignedInUserId(httpServletRequest);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				return _unauthorized();
			}

			if (!_canAccessWorkflowReview(user)) {
				return _forbidden(
					"You don't have permission to access workflow reviews.");
			}

			Locale locale = LocaleUtil.getSiteDefault();

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

			JSONArray activities = JSONFactoryUtil.createJSONArray();

			for (WorkflowLog workflowLog :
					_workflowReviewService.getWorkflowActivities(
						user.getCompanyId(), workflowTaskId)) {

				JSONObject activity = JSONFactoryUtil.createJSONObject();

				activity.put(
					"description",
					_buildActivityDescription(workflowLog, locale));
				activity.put(
					"createDate",
					workflowLog.getCreateDate() != null ?
						sdf.format(workflowLog.getCreateDate()) : null);

				activities.put(activity);
			}

			JSONObject result = JSONFactoryUtil.createJSONObject();
			result.put("activities", activities);

			return Response.ok(result.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	private void _collectUser(
		Map<Long, String> target, long userId, String name) {

		if ((userId <= 0) || (name == null) || name.isEmpty()) {
			return;
		}

		target.putIfAbsent(userId, name);
	}

	private JSONArray _usersToJSON(Map<Long, String> users) {
		JSONArray array = JSONFactoryUtil.createJSONArray();

		users.entrySet(
		).stream(
		).sorted(
			Map.Entry.comparingByValue(String.CASE_INSENSITIVE_ORDER)
		).forEach(
			entry -> {
				JSONObject userJSON = JSONFactoryUtil.createJSONObject();

				userJSON.put("userId", entry.getKey());
				userJSON.put("name", entry.getValue());

				array.put(userJSON);
			}
		);

		return array;
	}

	private String _buildActivityDescription(
		WorkflowLog workflowLog, Locale locale) {

		long actorUserId = workflowLog.getAuditUserId();

		if (actorUserId <= 0) {
			actorUserId = workflowLog.getUserId();
		}

		String actorName = _getUserName(actorUserId);

		String nodeLabel = workflowLog.getCurrentWorkflowNodeLabel(locale);

		int type = workflowLog.getType();

		if (type == WorkflowLog.TASK_ASSIGN) {
			if (workflowLog.getRoleId() != 0) {
				Role role = RoleLocalServiceUtil.fetchRole(
					workflowLog.getRoleId());

				String roleName = (role != null) ?
					role.getTitle(locale) :
						String.valueOf(workflowLog.getRoleId());

				return "Giao nhiệm vụ cho vai trò \"" + roleName + "\"";
			}

			long assigneeUserId = workflowLog.getUserId();

			if (assigneeUserId == workflowLog.getAuditUserId()) {
				return actorName + " đã nhận xử lý";
			}

			return actorName + " điều phối cho " +
				_getUserName(assigneeUserId);
		}

		if (type == WorkflowLog.TASK_COMPLETION) {
			String text = actorName + " đã hoàn tất bước \"" + nodeLabel + "\"";

			return _appendComment(text, workflowLog.getComment());
		}

		if (type == WorkflowLog.TASK_UPDATE) {
			return _appendComment(
				actorName + " đã cập nhật nhiệm vụ", workflowLog.getComment());
		}

		// TRANSITION
		String previousNodeLabel =
			workflowLog.getPreviousWorkflowNodeLabel(locale);

		if (Validator.isNull(previousNodeLabel)) {
			return "Bắt đầu quy trình: \"" + nodeLabel + "\"";
		}

		return "Chuyển từ \"" + previousNodeLabel + "\" sang \"" + nodeLabel +
			"\"";
	}

	private String _appendComment(String text, String comment) {
		if (Validator.isNull(comment)) {
			return text;
		}

		return text + ": " + comment;
	}

	private String _getUserName(long userId) {
		if (userId <= 0) {
			return "Hệ thống";
		}

		User user = UserLocalServiceUtil.fetchUser(userId);

		if (user == null) {
			return String.valueOf(userId);
		}

		return user.getFullName();
	}

	private JSONArray _itemsToJSON(List<WorkflowReviewItem> items) {
		JSONArray array = JSONFactoryUtil.createJSONArray();

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		for (WorkflowReviewItem item : items) {
			JSONObject json = JSONFactoryUtil.createJSONObject();

			json.put("workflowTaskId", item.getWorkflowTaskId());
			json.put("assetType", item.getAssetType());
			json.put("assetTitle", item.getAssetTitle());
			json.put("folderId", item.getFolderId());
			json.put("folderName", item.getFolderName());
			json.put("folderPath", item.getFolderPath());
			json.put("creatorUserName", item.getCreatorUserName());
			json.put("assigneeUserName", item.getAssigneeUserName());
			json.put("completedByUserName", item.getCompletedByUserName());
			json.put("status", item.getStatus());
			json.put("taskName", item.getTaskName());
			json.put(
				"createDate",
				item.getCreateDate() != null ?
					sdf.format(item.getCreateDate()) : null);
			json.put(
				"modifiedDate",
				item.getModifiedDate() != null ?
					sdf.format(item.getModifiedDate()) : null);
			json.put(
				"dueDate",
				item.getDueDate() != null ?
					sdf.format(item.getDueDate()) : null);
			json.put("isOverdue", item.isOverdue());
			json.put("reviewable", item.isReviewable());

			array.put(json);
		}

		return array;
	}

	private JSONObject _itemToDetailJSON(WorkflowReviewItem item) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		JSONObject json = JSONFactoryUtil.createJSONObject();

		json.put("workflowTaskId", item.getWorkflowTaskId());
		json.put("assetType", item.getAssetType());
		json.put("assetTitle", item.getAssetTitle());
		json.put("assetContent", item.getAssetContent());
		json.put("contentHtml", item.getContentHtml());
		json.put("folderId", item.getFolderId());
		json.put("folderName", item.getFolderName());
		json.put("folderPath", item.getFolderPath());
		json.put("creatorUserName", item.getCreatorUserName());
		json.put("assigneeUserName", item.getAssigneeUserName());
		json.put("completedByUserName", item.getCompletedByUserName());
		json.put("reviewComment", item.getReviewComment());
		json.put("status", item.getStatus());
		json.put("taskName", item.getTaskName());
		json.put("reviewable", item.isReviewable());
		json.put("parentClassName", item.getParentClassName());
		json.put("parentClassPK", item.getParentClassPK());
		json.put(
			"createDate",
			item.getCreateDate() != null ?
				sdf.format(item.getCreateDate()) : null);
		json.put(
			"modifiedDate",
			item.getModifiedDate() != null ?
				sdf.format(item.getModifiedDate()) : null);
		json.put(
			"dueDate",
			item.getDueDate() != null ?
				sdf.format(item.getDueDate()) : null);

		return json;
	}

	private String _getParentUrl(
		HttpServletRequest httpServletRequest, WorkflowReviewItem item) {

		String parentClassName = item.getParentClassName();
		long parentClassPK = item.getParentClassPK();

		if (Validator.isNull(parentClassName) || (parentClassPK <= 0)) {
			return null;
		}

		try {
			// Bình luận trên Web Content: dựng URL public dạng friendly
			// /web/{site}/w/{url-title} (không phụ thuộc ThemeDisplay nên ổn
			// định trên REST).
			if ("com.liferay.journal.model.JournalArticle".equals(
					parentClassName)) {

				JournalArticle article =
					JournalArticleLocalServiceUtil.fetchLatestArticle(
						parentClassPK);

				if (article == null) {
					article =
						JournalArticleLocalServiceUtil.fetchJournalArticle(
							parentClassPK);
				}

				if (article == null) {
					return null;
				}

				Group group = GroupLocalServiceUtil.fetchGroup(
					article.getGroupId());

				if (group == null) {
					return null;
				}

				String urlTitle = article.getUrlTitle();

				if (Validator.isNull(urlTitle)) {
					// Fallback: link control-panel chỉnh sửa bài viết.
					return WebContentAdvancedSearchUtil.buildEditUrl(
						httpServletRequest, group, article.getArticleId(),
						article.getGroupId(), article.getVersion());
				}

				return PortalUtil.getPortalURL(httpServletRequest) + "/web" +
					group.getFriendlyURL() + "/w/" + urlTitle;
			}

			// Các loại asset khác: dùng AssetRenderer nếu có ThemeDisplay.
			ThemeDisplay themeDisplay =
				(ThemeDisplay)httpServletRequest.getAttribute(
					WebKeys.THEME_DISPLAY);

			if (themeDisplay == null) {
				return null;
			}

			AssetRendererFactory<?> assetRendererFactory =
				AssetRendererFactoryRegistryUtil.
					getAssetRendererFactoryByClassName(parentClassName);

			if (assetRendererFactory == null) {
				return null;
			}

			AssetRenderer<?> assetRenderer =
				assetRendererFactory.getAssetRenderer(parentClassPK);

			if (assetRenderer == null) {
				return null;
			}

			return assetRenderer.getURLViewInContext(themeDisplay, "");
		}
		catch (Exception exception) {
			return null;
		}
	}

	private String _buildWebContentFolderURL(
		HttpServletRequest httpServletRequest, Group group,
		JournalArticle article) {

		if ((group == null) || (article == null)) {

			return "";
		}

		if (httpServletRequest == null) {
			return _buildWebContentFolderFallbackURL(group, article);
		}

		try {
			Group targetGroup = group;

			if (group.isCompany()) {
				ThemeDisplay themeDisplay =
					(ThemeDisplay)httpServletRequest.getAttribute(
						WebKeys.THEME_DISPLAY);

				if ((themeDisplay != null) &&
					(themeDisplay.getScopeGroup() != null)) {

					targetGroup = themeDisplay.getScopeGroup();
				}
			}

			PortletURL portletURL = PortletURLBuilder.create(
				PortalUtil.getControlPanelPortletURL(
					httpServletRequest, targetGroup, JournalPortletKeys.JOURNAL,
					0, 0, PortletRequest.RENDER_PHASE)
			).setParameter(
				"displayStyle", "descriptive"
			).setParameter(
				"folderId", article.getFolderId()
			).setParameter(
				"groupId", article.getGroupId()
			).buildPortletURL();

			String folderURL = portletURL.toString();

			if (Validator.isNotNull(folderURL)) {
				return folderURL;
			}
		}
		catch (Exception exception) {
		}

		return _buildWebContentFolderFallbackURL(group, article);
	}

	private String _buildWebContentEditURL(
		HttpServletRequest httpServletRequest, Group group,
		JournalArticle article) {

		if ((group == null) || (article == null)) {
			return "";
		}

		StringBuilder stringBuilder = new StringBuilder(
			_buildSiteControlPanelURL(group));
		String namespace = "_" + JournalPortletKeys.JOURNAL + "_";

		_appendURLParameter(
			stringBuilder, "p_p_id", JournalPortletKeys.JOURNAL);
		_appendURLParameter(stringBuilder, "p_p_lifecycle", "0");
		_appendURLParameter(stringBuilder, "p_p_state", "maximized");
		_appendURLParameter(stringBuilder, "p_p_mode", "view");
		_appendURLParameter(
			stringBuilder, namespace + "mvcRenderCommandName",
			"/journal/edit_article");
		_appendURLParameter(
			stringBuilder, namespace + "articleId", article.getArticleId());
		_appendURLParameter(
			stringBuilder, namespace + "groupId",
			String.valueOf(article.getGroupId()));
		_appendURLParameter(
			stringBuilder, namespace + "version",
			String.valueOf(article.getVersion()));

		String referer = httpServletRequest != null ?
			httpServletRequest.getHeader("referer") : null;

		if (Validator.isNotNull(referer)) {
			_appendURLParameter(stringBuilder, namespace + "redirect", referer);
		}

		return stringBuilder.toString();
	}

	private String _buildWebContentFolderFallbackURL(
		Group group, JournalArticle article) {

		if ((group == null) || (article == null)) {
			return "";
		}

		StringBuilder stringBuilder = new StringBuilder(
			_buildSiteControlPanelURL(group));
		String namespace = "_" + JournalPortletKeys.JOURNAL + "_";

		_appendURLParameter(
			stringBuilder, "p_p_id", JournalPortletKeys.JOURNAL);
		_appendURLParameter(stringBuilder, "p_p_lifecycle", "0");
		_appendURLParameter(stringBuilder, "p_p_state", "maximized");
		_appendURLParameter(stringBuilder, "p_p_mode", "view");
		_appendURLParameter(
			stringBuilder, namespace + "displayStyle", "descriptive");
		_appendURLParameter(
			stringBuilder, namespace + "folderId",
			String.valueOf(article.getFolderId()));
		_appendURLParameter(
			stringBuilder, namespace + "groupId",
			String.valueOf(article.getGroupId()));

		return stringBuilder.toString();
	}

	private String _buildSiteControlPanelURL(Group group) {
		String friendlyURL = group.getFriendlyURL();

		if (Validator.isNull(friendlyURL)) {
			friendlyURL = "/guest";
		}

		return "/group" + friendlyURL + "/~/control_panel/manage";
	}

	private void _appendURLParameter(
		StringBuilder stringBuilder, String name, String value) {

		if (stringBuilder.indexOf("?") < 0) {
			stringBuilder.append('?');
		}
		else {
			stringBuilder.append('&');
		}

		stringBuilder.append(_urlEncode(name));
		stringBuilder.append('=');
		stringBuilder.append(_urlEncode(value));
	}

	private String _urlEncode(String value) {
		try {
			return URLEncoder.encode(value == null ? "" : value, "UTF-8");
		}
		catch (Exception exception) {
			return "";
		}
	}

	private boolean _canAccessWorkflowReview(User user)
		throws Exception {

		PermissionChecker permissionChecker =
			PermissionThreadLocal.getPermissionChecker();

		if ((user == null) || (permissionChecker == null)) {
			return false;
		}

		try {
			if (permissionChecker.isOmniadmin() ||
				permissionChecker.isCompanyAdmin()) {

				return true;
			}

			if (PortalPermissionUtil.contains(
					permissionChecker, ActionKeys.VIEW_CONTROL_PANEL)) {

				return true;
			}
		}
		catch (Exception exception) {
			return _hasWorkflowReviewRole(user);
		}

		return _hasWorkflowReviewRole(user);
	}

	private boolean _hasEditorRole(User user) {
		if (user == null) {
			return false;
		}

		try {
			return RoleLocalServiceUtil.hasUserRoles(
				user.getUserId(), user.getCompanyId(),
				new String[] {"Biên Tập Viên"}, true);
		}
		catch (Exception exception) {
			return false;
		}
	}

	private boolean _hasWorkflowReviewRole(User user) {
		try {
			Locale locale = LocaleUtil.getSiteDefault();

			for (Role role : user.getRoles()) {
				String name = role.getName();
				String title = role.getTitle(locale);

				if (_isWorkflowReviewRole(name) ||
					_isWorkflowReviewRole(title)) {

					return true;
				}
			}
		}
		catch (Exception exception) {
			return false;
		}

		return false;
	}

	private boolean _isWorkflowReviewRole(String roleName) {
		if (Validator.isNull(roleName)) {
			return false;
		}

		String normalizedRoleName = roleName.trim().toLowerCase(Locale.ROOT);

		return "administrator".equals(normalizedRoleName) ||
			"content administrator".equals(normalizedRoleName) ||
			"site content reviewer".equals(normalizedRoleName) ||
			"quản trị nội dung".equals(normalizedRoleName) ||
			"quan tri noi dung".equals(normalizedRoleName);
	}

	private long _getSignedInUserId(HttpServletRequest httpServletRequest) {
		long userId = PortalUtil.getUserId(httpServletRequest);

		if (userId > 0) {
			return userId;
		}

		String name = PrincipalThreadLocal.getName();

		if (name != null) {
			try {
				return Long.parseLong(name);
			} catch (NumberFormatException e) {
				// Ignore
			}
		}

		return 0;
	}

	private Response _unauthorized() {
		JSONObject error = JSONFactoryUtil.createJSONObject();
		error.put("error", "Unauthorized");

		return Response.status(Response.Status.UNAUTHORIZED).entity(
			error.toString()).build();
	}

	private Response _forbidden(String message) {
		JSONObject error = JSONFactoryUtil.createJSONObject();
		error.put("error", message);

		return Response.status(Response.Status.FORBIDDEN).entity(
			error.toString()).build();
	}

	private Response _serverError(Exception e) {
		JSONObject error = JSONFactoryUtil.createJSONObject();
		error.put("error", "Internal server error");
		error.put("message", e.getMessage());

		return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(
			error.toString()).build();
	}

	@Reference
	private WorkflowReviewService _workflowReviewService;

}
