package vn.vec.custom.admin.webcontent.advancedsearch;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.servlet.BaseFilter;
import com.liferay.portal.kernel.servlet.TryFilter;
import com.liferay.portal.kernel.util.HttpComponentsUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import java.net.URLEncoder;

import javax.servlet.Filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.annotations.Component;

@Component(
	property = {
		"before-filter=Auto Login Filter", "dispatcher=FORWARD",
		"dispatcher=REQUEST", "servlet-context-name=",
		"servlet-filter-name=VEC Web Content Advanced Search Page Filter",
		"url-pattern=/o/vec-custom-admin-ui/webcontent-advanced-search",
		"url-pattern=/o/vec-custom-admin-ui/webcontent-advanced-search/*"
	},
	service = Filter.class
)
public class WebContentAdvancedSearchPageFilter extends BaseFilter
	implements TryFilter {

	@Override
	public Object doFilterTry(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws Exception {

		if (_webContentAdvancedSearchPermission.getSignedInUser(
				httpServletRequest) != null) {

			return true;
		}

		String currentURL = PortalUtil.getCurrentURL(httpServletRequest);
		String loginURL = "/c/portal/login";

		if ((currentURL != null) && !currentURL.isEmpty()) {
			loginURL = HttpComponentsUtil.addParameter(
				loginURL, "redirect",
				URLEncoder.encode(currentURL, "UTF-8"));
		}

		httpServletResponse.sendRedirect(loginURL);

		return false;
	}

	@Override
	public boolean isFilterEnabled() {
		return true;
	}

	@Override
	protected Log getLog() {
		return _log;
	}

	@org.osgi.service.component.annotations.Reference
	private WebContentAdvancedSearchPermission _webContentAdvancedSearchPermission;

	private static final Log _log = LogFactoryUtil.getLog(
		WebContentAdvancedSearchPageFilter.class);

}
