package vn.vec.custom.admin.webcontent.advancedsearch;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.servlet.BaseFilter;
import com.liferay.portal.kernel.util.HttpComponentsUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import java.net.URLEncoder;

import javax.servlet.Filter;
import javax.servlet.FilterChain;

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
public class WebContentAdvancedSearchPageFilter extends BaseFilter {

	/**
	 * Không dùng {@code TryFilter}: {@code InvokerFilterChain} bỏ qua giá trị
	 * trả về của {@code doFilterTry} và luôn chạy tiếp chain, nên redirect hay
	 * 403 xong Liferay vẫn render trang phía sau (gây
	 * {@code IllegalStateException: Cannot forward after response has been
	 * committed}). Ở đây chỉ gọi tiếp chain khi {@link #doFilterTry} không trả
	 * {@code false}.
	 */
	@Override
	protected void processFilter(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, FilterChain filterChain)
		throws Exception {

		if (Boolean.FALSE.equals(
				doFilterTry(httpServletRequest, httpServletResponse))) {

			return;
		}

		processFilter(
			WebContentAdvancedSearchPageFilter.class.getName(), httpServletRequest, httpServletResponse,
			filterChain);
	}

	/**
	 * @return {@code false} nếu filter đã tự trả response (redirect, 403) và
	 *         chain phải dừng; giá trị khác thì request đi tiếp
	 */
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
