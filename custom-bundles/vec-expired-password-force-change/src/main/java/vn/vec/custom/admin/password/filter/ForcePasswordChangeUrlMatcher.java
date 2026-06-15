package vn.vec.custom.admin.password.filter;

import java.util.List;
import java.util.regex.Pattern;

public class ForcePasswordChangeUrlMatcher {

	public boolean isExcluded(String requestUri, List<String> excludedPatterns) {
		String normalized = _normalize(requestUri);

		if (normalized.isEmpty()) {
			return true;
		}

		return _matchesAny(normalized, excludedPatterns);
	}

	/**
	 * Returns true if the requestUri starts with or equals the configured
	 * changePasswordURL (ignoring query string). Used to prevent redirect loops
	 * when the changePasswordURL is not in the excludedPathPatterns list.
	 */
	public boolean isChangePasswordUrl(
		String requestUri, String changePasswordURL) {

		if ((changePasswordURL == null) || changePasswordURL.trim().isEmpty()) {
			return false;
		}

		String normalized = _normalize(requestUri);
		String changeNormalized = _normalize(changePasswordURL);

		return normalized.equals(changeNormalized) ||
			normalized.startsWith(changeNormalized + "/") ||
			normalized.startsWith(changeNormalized + "?");
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
				uri.startsWith(normalizedPattern + "/") ||
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

		String normalized = requestUri.trim();
		int queryIndex = normalized.indexOf('?');

		if (queryIndex >= 0) {
			normalized = normalized.substring(0, queryIndex);
		}

		return normalized;
	}

}
