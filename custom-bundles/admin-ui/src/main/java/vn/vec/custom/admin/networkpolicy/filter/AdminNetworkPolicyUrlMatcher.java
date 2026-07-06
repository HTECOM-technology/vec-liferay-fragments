package vn.vec.custom.admin.networkpolicy.filter;

import java.util.List;
import java.util.regex.Pattern;

public class AdminNetworkPolicyUrlMatcher {

	public boolean isProtected(
		String requestUri, List<String> protectedPatterns,
		List<String> excludedPatterns) {

		String normalizedUri = _normalize(requestUri);

		if (normalizedUri.isEmpty()) {
			return false;
		}

		if (_matchesAny(normalizedUri, excludedPatterns)) {
			return false;
		}

		return _matchesAny(normalizedUri, protectedPatterns);
	}

	private boolean _matches(String uri, String pattern) {
		if ((pattern == null) || pattern.trim().isEmpty()) {
			return false;
		}

		String normalizedPattern = pattern.trim();

		if (normalizedPattern.startsWith("*.")) {
			return uri.toLowerCase().endsWith(
				normalizedPattern.substring(1).toLowerCase());
		}

		if (!normalizedPattern.contains("*")) {
			return uri.equals(normalizedPattern) ||
				uri.startsWith(normalizedPattern + "?");
		}

		StringBuilder regex = new StringBuilder();

		for (int i = 0; i < normalizedPattern.length(); i++) {
			char ch = normalizedPattern.charAt(i);

			if (ch == '*') {
				regex.append("[^?]*");
			}
			else {
				regex.append(Pattern.quote(String.valueOf(ch)));
			}
		}

		return Pattern.matches(regex.toString(), uri);
	}

	private boolean _matchesAny(String uri, List<String> patterns) {
		if (patterns == null) {
			return false;
		}

		for (String pattern : patterns) {
			if (_matches(uri, pattern)) {
				return true;
			}
		}

		return false;
	}

	private String _normalize(String requestUri) {
		if (requestUri == null) {
			return "";
		}

		String normalizedUri = requestUri.trim();
		int queryIndex = normalizedUri.indexOf('?');

		if (queryIndex >= 0) {
			normalizedUri = normalizedUri.substring(0, queryIndex);
		}

		return normalizedUri;
	}

}
