package vn.vec.custom.admin.audit.service;

import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.CompanyThreadLocal;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.GroupLocalServiceUtil;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;

import javax.servlet.http.HttpServletRequest;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.audit.util.AuditRequestUtil;

@Component(service = AuditContextService.class)
public class AuditContextService {

	public AuditContext build(ServiceContext serviceContext) {
		ServiceContext resolvedServiceContext =
			AuditRequestUtil.resolveServiceContext(serviceContext);
		HttpServletRequest httpServletRequest = AuditRequestUtil.getRequest(
			resolvedServiceContext);
		AuditContext auditContext = new AuditContext();

		auditContext.setCompanyId(_resolveCompanyId(resolvedServiceContext));
		auditContext.setGroupId(_resolveGroupId(resolvedServiceContext));
		auditContext.setRequestUri(
			AuditRequestUtil.getRequestUri(httpServletRequest));
		auditContext.setIpAddress(
			AuditRequestUtil.getRemoteAddr(httpServletRequest));
		auditContext.setUserAgent(
			AuditRequestUtil.getUserAgent(httpServletRequest));
		auditContext.setSessionId(
			AuditRequestUtil.getSessionId(httpServletRequest));
		_populateGroupContext(auditContext);
		_populateUserContext(auditContext, resolvedServiceContext);

		return auditContext;
	}

	public static class AuditContext {

		public long getCompanyId() {
			return _companyId;
		}

		public long getGroupId() {
			return _groupId;
		}

		public String getIpAddress() {
			return _ipAddress;
		}

		public String getRequestUri() {
			return _requestUri;
		}

		public String getSessionId() {
			return _sessionId;
		}

		public String getSiteName() {
			return _siteName;
		}

		public String getUserAgent() {
			return _userAgent;
		}

		public String getUserEmail() {
			return _userEmail;
		}

		public long getUserId() {
			return _userId;
		}

		public String getUserName() {
			return _userName;
		}

		public void setCompanyId(long companyId) {
			_companyId = companyId;
		}

		public void setGroupId(long groupId) {
			_groupId = groupId;
		}

		public void setIpAddress(String ipAddress) {
			_ipAddress = ipAddress;
		}

		public void setRequestUri(String requestUri) {
			_requestUri = requestUri;
		}

		public void setSessionId(String sessionId) {
			_sessionId = sessionId;
		}

		public void setSiteName(String siteName) {
			_siteName = siteName;
		}

		public void setUserAgent(String userAgent) {
			_userAgent = userAgent;
		}

		public void setUserEmail(String userEmail) {
			_userEmail = userEmail;
		}

		public void setUserId(long userId) {
			_userId = userId;
		}

		public void setUserName(String userName) {
			_userName = userName;
		}

		private long _companyId;
		private long _groupId;
		private String _ipAddress;
		private String _requestUri;
		private String _sessionId;
		private String _siteName;
		private String _userAgent;
		private String _userEmail;
		private long _userId;
		private String _userName;

	}

	private void _populateGroupContext(AuditContext auditContext) {
		if (auditContext.getGroupId() <= 0) {
			return;
		}

		try {
			Group group = GroupLocalServiceUtil.fetchGroup(auditContext.getGroupId());

			if (group != null) {
				auditContext.setSiteName(
					group.getDescriptiveName(LocaleUtil.getDefault()));
			}
		}
		catch (Exception exception) {
		}
	}

	private void _populateUserContext(
		AuditContext auditContext, ServiceContext serviceContext) {

		long userId = 0;

		if ((serviceContext != null) && (serviceContext.getUserId() > 0)) {
			userId = serviceContext.getUserId();
		}
		else {
			try {
				String principalName = PrincipalThreadLocal.getName();

				if ((principalName != null) && !principalName.trim().isEmpty()) {
					userId = Long.parseLong(principalName.trim());
				}
			}
			catch (Exception exception) {
			}
		}

		if (userId <= 0) {
			auditContext.setUserId(0);
			auditContext.setUserName("System/Unknown");
			auditContext.setUserEmail("");

			return;
		}

		auditContext.setUserId(userId);

		try {
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null) {
				auditContext.setUserName("System/Unknown");
				auditContext.setUserEmail("");

				return;
			}

			auditContext.setUserName(user.getFullName());
			auditContext.setUserEmail(user.getEmailAddress());
		}
		catch (Exception exception) {
			auditContext.setUserName("System/Unknown");
			auditContext.setUserEmail("");
		}
	}

	private long _resolveCompanyId(ServiceContext serviceContext) {
		if ((serviceContext != null) && (serviceContext.getCompanyId() > 0)) {
			return serviceContext.getCompanyId();
		}

		return CompanyThreadLocal.getCompanyId();
	}

	private long _resolveGroupId(ServiceContext serviceContext) {
		if (serviceContext == null) {
			return 0;
		}

		return serviceContext.getScopeGroupId();
	}

}
