package vn.vec.custom.admin.password.util;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.PasswordPolicy;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.PasswordPolicyLocalServiceUtil;

import java.util.Date;

public class PasswordExpirationUtil {

	/**
	 * Returns true if the user's password has expired (age-based) or if the
	 * user has been flagged to reset their password by an admin.
	 * Returns false on error to avoid blocking users due to unexpected failures.
	 */
	public static boolean isPasswordExpired(User user) {
		if ((user == null) || user.isDefaultUser()) {
			return false;
		}

		try {
			if (user.getPasswordReset()) {
				return true;
			}

			PasswordPolicy passwordPolicy =
				PasswordPolicyLocalServiceUtil.getPasswordPolicyByUserId(
					user.getCompanyId(), user.getUserId());

			if ((passwordPolicy == null) || !passwordPolicy.getExpireable()) {
				return false;
			}

			long maxAgeSeconds = passwordPolicy.getMaxAge();

			if (maxAgeSeconds <= 0) {
				return false;
			}

			Date passwordModifiedDate = user.getPasswordModifiedDate();

			if (passwordModifiedDate == null) {
				return false;
			}

			long expiryMillis =
				passwordModifiedDate.getTime() + (maxAgeSeconds * 1000L);

			return System.currentTimeMillis() > expiryMillis;
		}
		catch (Exception exception) {
			_log.error(
				"Unable to check password expiration for userId=" +
					user.getUserId(),
				exception);

			return false;
		}
	}

	/**
	 * Returns true if the effective password policy for this user has
	 * expiration enabled and graceLimit = 0.
	 * When this is true, Liferay blocks login before post-login hooks run,
	 * making the force-change redirect impossible.
	 */
	public static boolean hasGraceLimitZero(User user) {
		try {
			PasswordPolicy passwordPolicy =
				PasswordPolicyLocalServiceUtil.getPasswordPolicyByUserId(
					user.getCompanyId(), user.getUserId());

			return (passwordPolicy != null) &&
				passwordPolicy.getExpireable() &&
				(passwordPolicy.getGraceLimit() == 0);
		}
		catch (Exception exception) {
			_log.warn(
				"Unable to check grace limit for userId=" + user.getUserId() +
					": " + exception.getMessage());

			return false;
		}
	}

	private static final Log _log = LogFactoryUtil.getLog(
		PasswordExpirationUtil.class);

}
