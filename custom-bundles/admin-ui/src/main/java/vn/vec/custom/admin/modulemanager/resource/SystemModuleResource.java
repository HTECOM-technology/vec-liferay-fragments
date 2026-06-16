package vn.vec.custom.admin.modulemanager.resource;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.model.User;

import java.text.SimpleDateFormat;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Dictionary;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.Constants;
import org.osgi.framework.ServiceReference;
import org.osgi.framework.startlevel.BundleStartLevel;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.networkpolicy.service.AdminNetworkPolicyPermission;

@Component(
	property = {
		"osgi.jaxrs.application.select=(osgi.jaxrs.name=VecAuditLog)",
		"osgi.jaxrs.resource=true"
	},
	service = SystemModuleResource.class
)
@Consumes(MediaType.APPLICATION_JSON)
@Path("/system-modules")
@Produces(MediaType.APPLICATION_JSON)
public class SystemModuleResource {

	@GET
	public Response getModules(@Context HttpServletRequest httpServletRequest) {
		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			return _forbidden();
		}

		try {
			JSONObject jsonObject = JSONFactoryUtil.createJSONObject();
			JSONArray jsonArray = JSONFactoryUtil.createJSONArray();
			List<Bundle> bundles = new ArrayList<>();

			Collections.addAll(bundles, _bundleContext.getBundles());

			bundles.sort(
				Comparator.comparing(
					this::_sortName, String.CASE_INSENSITIVE_ORDER));

			for (Bundle bundle : bundles) {
				jsonArray.put(_toJSONObject(bundle));
			}

			jsonObject.put("items", jsonArray);
			jsonObject.put("total", jsonArray.length());
			jsonObject.put(
				"warning",
				"Tắt module có thể ảnh hưởng nghiêm trọng tới module khác.");

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
	@Path("/{bundleId}/state")
	public Response setState(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("bundleId") long bundleId,
		@QueryParam("enabled") @DefaultValue("true") boolean enabled) {

		User user = _permission.getSignedInAdminUser(httpServletRequest);

		if (user == null) {
			return _forbidden();
		}

		try {
			Bundle bundle = _bundleContext.getBundle(bundleId);

			if (bundle == null) {
				return _jsonError(
					Response.Status.NOT_FOUND, "Không tìm thấy module.");
			}

			String disabledReason = _getDisabledReason(bundle);

			if (disabledReason != null) {
				return _jsonError(Response.Status.BAD_REQUEST, disabledReason);
			}

			if (enabled) {
				bundle.start();
			}
			else {
				bundle.stop();
			}

			JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

			jsonObject.put("item", _toJSONObject(bundle));
			jsonObject.put("success", true);

			return _cors(Response.ok(jsonObject.toString())).build();
		}
		catch (Exception exception) {
			return _serverError(exception);
		}
	}

	@Activate
	protected void activate(BundleContext bundleContext) {
		_bundleContext = bundleContext;
		_currentBundleId = bundleContext.getBundle().getBundleId();
	}

	private void _addHeader(
		JSONObject jsonObject, Dictionary<String, String> headers, String key,
		String jsonKey) {

		String value = headers.get(key);

		jsonObject.put(jsonKey, (value == null) ? "" : value);
	}

	private void _addHeaderSummary(
		JSONObject jsonObject, Dictionary<String, String> headers, String key) {

		String value = headers.get(key);

		if ((value != null) && !value.trim().isEmpty()) {
			jsonObject.put(key, value);
		}
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder responseBuilder) {
		return responseBuilder
			.header("Access-Control-Allow-Origin", "*")
			.header(
				"Access-Control-Allow-Headers",
				"Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
			.header("Access-Control-Allow-Credentials", "true");
	}

	private Response _forbidden() {
		return _jsonError(
			Response.Status.FORBIDDEN,
			"Chỉ quản trị viên mới có quyền quản lý module hệ thống.");
	}

	private int _getCount(ServiceReference<?>[] serviceReferences) {
		return (serviceReferences == null) ? 0 : serviceReferences.length;
	}

	private String _getDisabledReason(Bundle bundle) {
		if (bundle.getBundleId() == 0) {
			return "Không thể tắt/bật system bundle của OSGi framework.";
		}

		if (bundle.getBundleId() == _currentBundleId) {
			return "Không thể tắt/bật chính module đang cung cấp màn hình quản trị này.";
		}

		if (_isFragment(bundle)) {
			return "Fragment bundle không hỗ trợ start/stop trực tiếp.";
		}

		return null;
	}

	private String _getHeader(Dictionary<String, String> headers, String key) {
		String value = headers.get(key);

		return (value == null) ? "" : value;
	}

	private String _getServices(ServiceReference<?>[] serviceReferences) {
		if ((serviceReferences == null) || (serviceReferences.length == 0)) {
			return "";
		}

		List<String> serviceNames = new ArrayList<>();

		for (ServiceReference<?> serviceReference : serviceReferences) {
			Object value = serviceReference.getProperty(Constants.OBJECTCLASS);

			if (value instanceof String[]) {
				for (String serviceName : (String[])value) {
					serviceNames.add(serviceName);
				}
			}
			else if (value != null) {
				serviceNames.add(String.valueOf(value));
			}
		}

		Collections.sort(serviceNames, String.CASE_INSENSITIVE_ORDER);

		return String.join(", ", serviceNames);
	}

	private String _getStartLevel(Bundle bundle) {
		BundleStartLevel bundleStartLevel = bundle.adapt(BundleStartLevel.class);

		if (bundleStartLevel == null) {
			return "";
		}

		return String.valueOf(bundleStartLevel.getStartLevel());
	}

	private boolean _isFragment(Bundle bundle) {
		return !_getHeader(
			bundle.getHeaders(null), Constants.FRAGMENT_HOST
		).isEmpty();
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

	private String _sortName(Bundle bundle) {
		Dictionary<String, String> headers = bundle.getHeaders(null);
		String name = _getHeader(headers, Constants.BUNDLE_NAME);

		if (name.isEmpty()) {
			name = bundle.getSymbolicName();
		}

		if (name == null) {
			name = String.valueOf(bundle.getBundleId());
		}

		return name;
	}

	private JSONObject _toJSONObject(Bundle bundle) {
		Dictionary<String, String> headers = bundle.getHeaders(null);
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();
		JSONObject headerSummary = JSONFactoryUtil.createJSONObject();
		String disabledReason = _getDisabledReason(bundle);

		jsonObject.put("bundleId", bundle.getBundleId());
		jsonObject.put("symbolicName", _value(bundle.getSymbolicName()));
		jsonObject.put("name", _getHeader(headers, Constants.BUNDLE_NAME));
		jsonObject.put("version", String.valueOf(bundle.getVersion()));
		jsonObject.put("state", _state(bundle.getState()));
		jsonObject.put("active", bundle.getState() == Bundle.ACTIVE);
		jsonObject.put("lastModified", _formatDate(bundle.getLastModified()));
		jsonObject.put("location", _value(bundle.getLocation()));
		jsonObject.put("startLevel", _getStartLevel(bundle));
		jsonObject.put("fragment", _isFragment(bundle));
		jsonObject.put("currentBundle", bundle.getBundleId() == _currentBundleId);
		jsonObject.put("canToggle", disabledReason == null);
		jsonObject.put("disabledReason", (disabledReason == null) ? "" : disabledReason);
		jsonObject.put("registeredServiceCount", _getCount(bundle.getRegisteredServices()));
		jsonObject.put("servicesInUseCount", _getCount(bundle.getServicesInUse()));
		jsonObject.put("registeredServices", _getServices(bundle.getRegisteredServices()));
		jsonObject.put("servicesInUse", _getServices(bundle.getServicesInUse()));

		_addHeader(jsonObject, headers, Constants.BUNDLE_VENDOR, "vendor");
		_addHeader(jsonObject, headers, Constants.BUNDLE_DESCRIPTION, "description");
		_addHeader(jsonObject, headers, Constants.BUNDLE_CATEGORY, "category");
		_addHeader(jsonObject, headers, Constants.BUNDLE_ACTIVATOR, "activator");
		_addHeader(jsonObject, headers, Constants.BUNDLE_CLASSPATH, "classPath");
		_addHeader(jsonObject, headers, Constants.FRAGMENT_HOST, "fragmentHost");

		_addHeaderSummary(headerSummary, headers, Constants.BUNDLE_NAME);
		_addHeaderSummary(headerSummary, headers, Constants.BUNDLE_SYMBOLICNAME);
		_addHeaderSummary(headerSummary, headers, Constants.BUNDLE_VERSION);
		_addHeaderSummary(headerSummary, headers, Constants.BUNDLE_VENDOR);
		_addHeaderSummary(headerSummary, headers, Constants.BUNDLE_DESCRIPTION);
		_addHeaderSummary(headerSummary, headers, Constants.BUNDLE_CATEGORY);
		_addHeaderSummary(headerSummary, headers, Constants.FRAGMENT_HOST);
		_addHeaderSummary(headerSummary, headers, Constants.EXPORT_PACKAGE);
		_addHeaderSummary(headerSummary, headers, Constants.IMPORT_PACKAGE);
		_addHeaderSummary(headerSummary, headers, Constants.REQUIRE_BUNDLE);
		_addHeaderSummary(headerSummary, headers, Constants.REQUIRE_CAPABILITY);
		_addHeaderSummary(headerSummary, headers, Constants.PROVIDE_CAPABILITY);

		jsonObject.put("headers", headerSummary);

		return jsonObject;
	}

	private String _formatDate(long timestamp) {
		if (timestamp <= 0) {
			return "";
		}

		return _simpleDateFormat.format(new Date(timestamp));
	}

	private String _state(int state) {
		if (state == Bundle.ACTIVE) {
			return "ACTIVE";
		}
		else if (state == Bundle.INSTALLED) {
			return "INSTALLED";
		}
		else if (state == Bundle.RESOLVED) {
			return "RESOLVED";
		}
		else if (state == Bundle.STARTING) {
			return "STARTING";
		}
		else if (state == Bundle.STOPPING) {
			return "STOPPING";
		}
		else if (state == Bundle.UNINSTALLED) {
			return "UNINSTALLED";
		}

		return String.valueOf(state);
	}

	private String _value(String value) {
		return (value == null) ? "" : value;
	}

	private BundleContext _bundleContext;
	private long _currentBundleId;
	private final SimpleDateFormat _simpleDateFormat = new SimpleDateFormat(
		"yyyy-MM-dd HH:mm:ss");

	@Reference
	private AdminNetworkPolicyPermission _permission;

}
