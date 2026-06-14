package vn.vec.custom.admin.audit.util;

import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextThreadLocal;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class AuditRequestUtil {

	public static HttpServletRequest getRequest(ServiceContext serviceContext) {
		ServiceContext resolvedServiceContext = resolveServiceContext(
			serviceContext);

		if (resolvedServiceContext == null) {
			return null;
		}

		return resolvedServiceContext.getRequest();
	}

	public static String getRequestUri(HttpServletRequest httpServletRequest) {
		if (httpServletRequest == null) {
			return null;
		}

		String requestURI = httpServletRequest.getRequestURI();
		String queryString = httpServletRequest.getQueryString();

		if ((queryString == null) || queryString.isEmpty()) {
			return requestURI;
		}

		return requestURI + "?" + queryString;
	}

	public static String getSessionId(HttpServletRequest httpServletRequest) {
		if (httpServletRequest == null) {
			return null;
		}

		HttpSession httpSession = httpServletRequest.getSession(false);

		if (httpSession == null) {
			return null;
		}

		return httpSession.getId();
	}

	public static ServiceContext resolveServiceContext(
		ServiceContext serviceContext) {

		if (serviceContext != null) {
			return serviceContext;
		}

		return ServiceContextThreadLocal.getServiceContext();
	}

}
