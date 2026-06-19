package vn.vec.custom.admin.workflow.resource;

import com.liferay.asset.kernel.AssetRendererFactoryRegistryUtil;
import com.liferay.asset.kernel.model.AssetRenderer;
import com.liferay.asset.kernel.model.AssetRendererFactory;
import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.service.JournalArticleLocalServiceUtil;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.GroupLocalServiceUtil;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;

import java.text.SimpleDateFormat;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

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
			String orderDirection) {

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
			if (requestBody != null && !requestBody.isEmpty()) {
				JSONObject json = JSONFactoryUtil.createJSONObject(
					requestBody);
				assigneeUserId = json.getLong("assigneeUserId");
			}

			_workflowReviewService.assignWorkflowTask(
				user.getCompanyId(), userId, workflowTaskId, assigneeUserId);

			JSONObject result = JSONFactoryUtil.createJSONObject();
			result.put("success", true);
			result.put("message", "Task assigned successfully");

			return Response.ok(result.toString()).build();
		} catch (Exception e) {
			return _serverError(e);
		}
	}

	private JSONArray _itemsToJSON(List<WorkflowReviewItem> items) {
		JSONArray array = JSONFactoryUtil.createJSONArray();

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		for (WorkflowReviewItem item : items) {
			JSONObject json = JSONFactoryUtil.createJSONObject();

			json.put("workflowTaskId", item.getWorkflowTaskId());
			json.put("assetType", item.getAssetType());
			json.put("assetTitle", item.getAssetTitle());
			json.put("creatorUserName", item.getCreatorUserName());
			json.put("assigneeUserName", item.getAssigneeUserName());
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
		json.put("contentHtml", item.getContentHtml());
		json.put("creatorUserName", item.getCreatorUserName());
		json.put("assigneeUserName", item.getAssigneeUserName());
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

	private boolean _canAccessWorkflowReview(User user)
		throws Exception {

		PermissionChecker permissionChecker =
			PermissionThreadLocal.getPermissionChecker();

		return permissionChecker.isCompanyAdmin() ||
			permissionChecker.hasPermission(
				user.getGroupId(), "com.liferay.portal",
				"VIEW_CONTROL_PANEL", null);
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
