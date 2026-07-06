package vn.vec.custom.admin.password.util;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.PasswordPolicy;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.PasswordPolicyLocalServiceUtil;

public class PasswordExpirationUtil {

	/**
	 * In Liferay, graceLoginCount is the number of grace logins already used.
	 * We only force redirect after the user has used up all allowed grace
	 * logins, i.e. remaining grace logins <= 0.
	 */
	public static boolean isForceChangeRequired(User user) {
		if ((user == null) || user.isDefaultUser()) {
			return false;
		}

		try {
			PasswordPolicy passwordPolicy =
				PasswordPolicyLocalServiceUtil.getPasswordPolicyByUserId(
					user.getUserId());

			if ((passwordPolicy == null) || !passwordPolicy.getExpireable()) {
				return false;
			}

			long graceLimit = passwordPolicy.getGraceLimit();

			if (graceLimit <= 0) {
				return false;
			}

			return user.getGraceLoginCount() >= graceLimit;
		}
		catch (Exception exception) {
			_log.warn(
				"Unable to evaluate grace login state for userId=" +
					user.getUserId() + ": " + exception.getMessage());

			return false;
		}
	}

	public static int getGraceLoginCount(User user) {
		if (user == null) {
			return 0;
		}

		return user.getGraceLoginCount();
	}

	public static long getRemainingGraceLogins(User user) {
		if ((user == null) || user.isDefaultUser()) {
			return 0;
		}

		try {
			PasswordPolicy passwordPolicy =
				PasswordPolicyLocalServiceUtil.getPasswordPolicyByUserId(
					user.getUserId());

			if ((passwordPolicy == null) || !passwordPolicy.getExpireable()) {
				return Long.MAX_VALUE;
			}

			return passwordPolicy.getGraceLimit() - user.getGraceLoginCount();
		}
		catch (Exception exception) {
			_log.warn(
				"Unable to get remaining grace logins for userId=" +
					user.getUserId() + ": " + exception.getMessage());

			return 0;
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
					user.getUserId());

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
