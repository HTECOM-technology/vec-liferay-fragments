package vn.vec.custom.admin.networkpolicy.resource;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.util.PortalUtil;

import java.text.SimpleDateFormat;

import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.networkpolicy.model.AdminNetworkPolicy;
import vn.vec.custom.admin.networkpolicy.model.AdminNetworkPolicyInput;
import vn.vec.custom.admin.networkpolicy.service.AdminNetworkPolicyPermission;
import vn.vec.custom.admin.networkpolicy.service.AdminNetworkPolicyService;
import vn.vec.custom.admin.networkpolicy.util.IPv4NetworkUtil;

@Component(
	property = {
		"osgi.jaxrs.application.select=(osgi.jaxrs.name=VecAuditLog)",
		"osgi.jaxrs.resource=true"
	},
	service = AdminNetworkPolicyResource.class
)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/admin-network-policies")
@Produces(MediaType.APPLICATION_JSON)
public class AdminNetworkPolicyResource {

	@POST
	public Response addPolicy(
		@Context HttpServletRequest httpServletRequest, String body) {

		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			return _forbidden();
		}

		try {
			AdminNetworkPolicy policy =
				_adminNetworkPolicyService.addAdminNetworkPolicy(
					_getCompanyId(httpServletRequest), user.getUserId(),
					user.getFullName(), _toInput(body));

			return _cors(Response.ok(_toJSONObject(policy).toString())).build();
		}
		catch (IllegalArgumentException illegalArgumentException) {
			return _badRequest(illegalArgumentException.getMessage());
		}
		catch (Exception exception) {
			return _serverError(exception);
		}
	}

	@DELETE
	@Path("/{policyId}")
	public Response deletePolicy(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("policyId") long policyId) {

		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			return _forbidden();
		}

		try {
			_adminNetworkPolicyService.deleteAdminNetworkPolicy(
				_getCompanyId(httpServletRequest), policyId);

			JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

			jsonObject.put("deleted", true);

			return _cors(Response.ok(jsonObject.toString())).build();
		}
		catch (IllegalArgumentException illegalArgumentException) {
			return _badRequest(illegalArgumentException.getMessage());
		}
		catch (Exception exception) {
			return _serverError(exception);
		}
	}

	@GET
	@Path("/{policyId}")
	public Response getPolicy(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("policyId") long policyId) {

		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			return _forbidden();
		}

		try {
			AdminNetworkPolicy policy = _adminNetworkPolicyService.fetch(
				_getCompanyId(httpServletRequest), policyId);

			if (policy == null) {
				return _jsonError(Response.Status.NOT_FOUND, "Policy not found.");
			}

			return _cors(Response.ok(_toJSONObject(policy).toString())).build();
		}
		catch (Exception exception) {
			return _serverError(exception);
		}
	}

	@GET
	public Response getPolicies(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("keyword") String keyword,
		@QueryParam("page") @DefaultValue("1") int page,
		@QueryParam("pageSize") @DefaultValue("20") int pageSize) {

		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			return _forbidden();
		}

		try {
			long companyId = _getCompanyId(httpServletRequest);
			List<AdminNetworkPolicy> policies =
				_adminNetworkPolicyService.search(
					companyId, keyword, page, pageSize);
			int total = _adminNetworkPolicyService.count(companyId, keyword);
			JSONObject jsonObject = JSONFactoryUtil.createJSONObject();
			JSONArray jsonArray = JSONFactoryUtil.createJSONArray();

			for (AdminNetworkPolicy policy : policies) {
				jsonArray.put(_toJSONObject(policy));
			}

			jsonObject.put("items", jsonArray);
			jsonObject.put("page", Math.max(1, page));
			jsonObject.put("pageSize", Math.max(1, Math.min(pageSize, 200)));
			jsonObject.put("total", total);

			return _cors(Response.ok(jsonObject.toString())).build();
		}
		catch (Exception exception) {
			return _serverError(exception);
		}
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response options() {
		return _cors(Response.ok()).build();
	}

	@PUT
	@Path("/{policyId}/enabled")
	public Response setEnabled(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("policyId") long policyId,
		@QueryParam("enabled") boolean enabled) {

		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			return _forbidden();
		}

		try {
			AdminNetworkPolicy policy = _adminNetworkPolicyService.setEnabled(
				_getCompanyId(httpServletRequest), policyId, enabled,
				user.getUserId(), user.getFullName());

			return _cors(Response.ok(_toJSONObject(policy).toString())).build();
		}
		catch (IllegalArgumentException illegalArgumentException) {
			return _badRequest(illegalArgumentException.getMessage());
		}
		catch (Exception exception) {
			return _serverError(exception);
		}
	}

	@PUT
	@Path("/{policyId}")
	public Response updatePolicy(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("policyId") long policyId, String body) {

		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			return _forbidden();
		}

		try {
			AdminNetworkPolicy policy =
				_adminNetworkPolicyService.updateAdminNetworkPolicy(
					_getCompanyId(httpServletRequest), policyId, user.getUserId(),
					user.getFullName(), _toInput(body));

			return _cors(Response.ok(_toJSONObject(policy).toString())).build();
		}
		catch (IllegalArgumentException illegalArgumentException) {
			return _badRequest(illegalArgumentException.getMessage());
		}
		catch (Exception exception) {
			return _serverError(exception);
		}
	}

	@GET
	@Path("/validate")
	public Response validateAddress(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("networkAddress") String networkAddress) {

		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			return _forbidden();
		}

		String message = _adminNetworkPolicyService.validateNetworkAddress(
			networkAddress);
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("valid", message == null);
		jsonObject.put("message", (message == null) ? "" : message);
		jsonObject.put(
			"networkType",
			IPv4NetworkUtil.detectNetworkType(
				IPv4NetworkUtil.normalize(networkAddress)));

		return _cors(Response.ok(jsonObject.toString())).build();
	}

	private Response _badRequest(String message) {
		return _jsonError(Response.Status.BAD_REQUEST, message);
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder responseBuilder) {
		return responseBuilder
			.header("Access-Control-Allow-Origin", "*")
			.header(
				"Access-Control-Allow-Headers",
				"Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			.header("Access-Control-Allow-Credentials", "true");
	}

	private Response _forbidden() {
		return _jsonError(
			Response.Status.FORBIDDEN,
			"Only administrators can manage admin network policies.");
	}

	private long _getCompanyId(HttpServletRequest httpServletRequest)
		throws Exception {

		return PortalUtil.getCompanyId(httpServletRequest);
	}

	private Response _jsonError(Response.Status status, String message) {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("message", message);
		jsonObject.put("status", status.getStatusCode());

		return _cors(Response.status(status).entity(jsonObject.toString())).build();
	}

	private Response _serverError(Exception exception) {
		return _jsonError(
			Response.Status.INTERNAL_SERVER_ERROR,
			(exception.getMessage() == null) ? "Unexpected server error" :
				exception.getMessage());
	}

	private AdminNetworkPolicyInput _toInput(String body) throws Exception {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject(
			(body == null) ? "{}" : body);
		AdminNetworkPolicyInput input = new AdminNetworkPolicyInput();

		input.setName(jsonObject.getString("name"));
		input.setNetworkAddress(jsonObject.getString("networkAddress"));
		input.setEnabled(jsonObject.getBoolean("enabled"));
		input.setDescription(jsonObject.getString("description"));
		input.setPriority(_getInt(jsonObject, "priority", 100));

		return input;
	}

	private int _getInt(
		JSONObject jsonObject, String key, int defaultValue) {

		try {
			if (!jsonObject.has(key)) {
				return defaultValue;
			}

			return jsonObject.getInt(key);
		}
		catch (Exception exception) {
			return defaultValue;
		}
	}

	private JSONObject _toJSONObject(AdminNetworkPolicy policy) {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("policyId", policy.getPolicyId());
		jsonObject.put("companyId", policy.getCompanyId());
		jsonObject.put("name", policy.getName());
		jsonObject.put("networkAddress", policy.getNetworkAddress());
		jsonObject.put("networkType", policy.getNetworkType());
		jsonObject.put("enabled", policy.isEnabled());
		jsonObject.put("description", _value(policy.getDescription()));
		jsonObject.put("priority", policy.getPriority());
		jsonObject.put("createDate", _formatDate(policy.getCreateDate()));
		jsonObject.put("modifiedDate", _formatDate(policy.getModifiedDate()));
		jsonObject.put("userId", policy.getUserId());
		jsonObject.put("userName", _value(policy.getUserName()));
		jsonObject.put(
			"lastModifiedByUserId", policy.getLastModifiedByUserId());
		jsonObject.put(
			"lastModifiedByUserName",
			_value(policy.getLastModifiedByUserName()));

		return jsonObject;
	}

	private String _formatDate(Date date) {
		if (date == null) {
			return "";
		}

		return new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss", Locale.US).format(date);
	}

	private String _value(String value) {
		if (value == null) {
			return "";
		}

		return value;
	}

	@Reference
	private AdminNetworkPolicyPermission _permission;

	@Reference
	private AdminNetworkPolicyService _adminNetworkPolicyService;

}
