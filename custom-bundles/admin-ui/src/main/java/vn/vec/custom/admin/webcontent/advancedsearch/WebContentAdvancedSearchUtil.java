package vn.vec.custom.admin.webcontent.advancedsearch;

import com.liferay.journal.constants.JournalPortletKeys;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.url.builder.PortletURLBuilder;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.kernel.workflow.WorkflowConstants;

import java.text.SimpleDateFormat;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import java.util.Date;
import java.util.Locale;

import javax.portlet.PortletRequest;
import javax.portlet.PortletURL;

import javax.servlet.http.HttpServletRequest;

public class WebContentAdvancedSearchUtil {

	public static String buildEditUrl(
		HttpServletRequest httpServletRequest, Group group, String articleId,
		long groupId, double version) {

		if ((httpServletRequest == null) || (group == null) ||
			Validator.isNull(articleId)) {

			return "";
		}

		try {
			Group targetGroup = group;

			if (group.isCompany()) {
				ThemeDisplay themeDisplay =
					(ThemeDisplay)httpServletRequest.getAttribute(
						WebKeys.THEME_DISPLAY);

				if ((themeDisplay != null) &&
					(themeDisplay.getScopeGroup() != null)) {

					targetGroup = themeDisplay.getScopeGroup();
				}
			}

			String referer = httpServletRequest.getHeader("referer");
			PortletURL portletURL = PortletURLBuilder.create(
				PortalUtil.getControlPanelPortletURL(
					httpServletRequest, targetGroup, JournalPortletKeys.JOURNAL,
					0, 0, PortletRequest.RENDER_PHASE)
			).setMVCRenderCommandName(
				"/journal/edit_article"
			).setParameter(
				"articleId", articleId
			).setParameter(
				"groupId", groupId
			).setParameter(
				"version", version
			).setParameter(
				"redirect", Validator.isNotNull(referer) ? referer : null
			).buildPortletURL();

			return portletURL.toString();
		}
		catch (Exception exception) {
			return "";
		}
	}

	public static Date parseEndDateExclusive(String value) {
		if (Validator.isNull(value)) {
			return null;
		}

		LocalDate localDate = LocalDate.parse(
			value.trim(), DateTimeFormatter.ISO_LOCAL_DATE);

		return Date.from(
			localDate.plusDays(1).atStartOfDay(
				ZoneId.systemDefault()
			).toInstant());
	}

	public static Date parseStartDate(String value) {
		if (Validator.isNull(value)) {
			return null;
		}

		LocalDate localDate = LocalDate.parse(
			value.trim(), DateTimeFormatter.ISO_LOCAL_DATE);

		return Date.from(
			localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
	}

	public static String sanitizeKeyword(String value) {
		if (Validator.isNull(value)) {
			return null;
		}

		String normalized = StringUtil.trim(value);

		return Validator.isNull(normalized) ? null : normalized;
	}

	public static String toDateTimeString(Date date) {
		if (date == null) {
			return "";
		}

		return _dateTimeFormat.get().format(date);
	}

	public static String toStatusLabel(int status) {
		return WorkflowConstants.getStatusLabel(status);
	}

	public static String toUserLanguageId(User user, HttpServletRequest request) {
		if ((user != null) && Validator.isNotNull(user.getLanguageId())) {
			return user.getLanguageId();
		}

		Locale locale = PortalUtil.getLocale(request);

		if (locale == null) {
			return "vi_VN";
		}

		return locale.toString();
	}

	private static final ThreadLocal<SimpleDateFormat> _dateTimeFormat =
		new ThreadLocal<SimpleDateFormat>() {

			@Override
			protected SimpleDateFormat initialValue() {
				return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			}

		};

}
