package vn.vec.custom.admin.networkpolicy.filter;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.osgi.service.component.annotations.Component;

import vn.vec.custom.admin.networkpolicy.util.IPv4NetworkUtil;

@Component(service = ClientIpResolver.class)
public class ClientIpResolver {

	public ResolvedClientIp resolve(
		HttpServletRequest request, List<String> trustedProxyCidrs) {

		String remoteAddr = _trim(request.getRemoteAddr());
		boolean trustedProxy = _isTrustedProxy(remoteAddr, trustedProxyCidrs);

		if (trustedProxy) {
			String forwardedFor = _firstForwardedFor(
				request.getHeader("X-Forwarded-For"));

			if (IPv4NetworkUtil.isValidSingleIp(forwardedFor)) {
				return new ResolvedClientIp(forwardedFor, remoteAddr, true);
			}

			String realIp = _trim(request.getHeader("X-Real-IP"));

			if (IPv4NetworkUtil.isValidSingleIp(realIp)) {
				return new ResolvedClientIp(realIp, remoteAddr, true);
			}
		}

		return new ResolvedClientIp(remoteAddr, remoteAddr, false);
	}

	private String _firstForwardedFor(String value) {
		if ((value == null) || value.trim().isEmpty()) {
			return "";
		}

		String[] parts = value.split(",");

		if (parts.length == 0) {
			return "";
		}

		return _trim(parts[0]);
	}

	private boolean _isTrustedProxy(String remoteAddr, List<String> cidrs) {
		if (!IPv4NetworkUtil.isValidSingleIp(remoteAddr) || (cidrs == null)) {
			return false;
		}

		for (String cidr : cidrs) {
			if (IPv4NetworkUtil.contains(cidr, remoteAddr)) {
				return true;
			}
		}

		return false;
	}

	private String _trim(String value) {
		if (value == null) {
			return "";
		}

		return value.trim();
	}

	public static class ResolvedClientIp {

		public ResolvedClientIp(
			String clientIp, String remoteAddr, boolean trustedHeaderUsed) {

			this.clientIp = clientIp;
			this.remoteAddr = remoteAddr;
			this.trustedHeaderUsed = trustedHeaderUsed;
		}

		public final String clientIp;
		public final String remoteAddr;
		public final boolean trustedHeaderUsed;

	}

}
