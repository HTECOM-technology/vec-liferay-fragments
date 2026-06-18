package vn.vec.custom.admin.audit.wrapper;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.service.LayoutLocalServiceWrapper;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceWrapper;

import java.util.Locale;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.audit.model.AuditActionType;
import vn.vec.custom.admin.audit.model.AuditTargetType;
import vn.vec.custom.admin.audit.service.AuditLogService;
import vn.vec.custom.admin.audit.service.AuditSnapshotService;
import vn.vec.custom.admin.audit.util.AuditThreadLocal;

@Component(service = ServiceWrapper.class)
public class LayoutAuditServiceWrapper extends LayoutLocalServiceWrapper {

	@Override
	public Layout addLayout(
			String externalReferenceCode, long userId, long groupId,
			boolean privateLayout, long parentLayoutId, long classNameId,
			long classPK, Map<Locale, String> nameMap,
			Map<Locale, String> titleMap, Map<Locale, String> descriptionMap,
			Map<Locale, String> keywordsMap, Map<Locale, String> robotsMap,
			String type, String typeSettings, boolean hidden, boolean system,
			Map<Locale, String> friendlyURLMap, long masterLayoutPlid,
			ServiceContext serviceContext)
		throws PortalException {

		long auditLogId = _auditLogService.startPending(
			AuditActionType.ADD, AuditTargetType.LAYOUT, Layout.class.getName(),
			null, _name(nameMap), null, null, serviceContext);

		try {
			Layout layout;

			try {
				AuditThreadLocal.suppressPermissionAudit();

				layout = super.addLayout(
					externalReferenceCode, userId, groupId, privateLayout,
					parentLayoutId, classNameId, classPK, nameMap, titleMap,
					descriptionMap, keywordsMap, robotsMap, type, typeSettings,
					hidden, system, friendlyURLMap, masterLayoutPlid,
					serviceContext);
			}
			finally {
				AuditThreadLocal.restorePermissionAudit();
			}

			_auditLogService.completeSuccess(
				auditLogId, _classPK(layout), _title(layout), _targetUrl(layout),
				null, _auditSnapshotService.snapshotLayout(layout));

			return layout;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, null, _name(nameMap), null, portalException);

			throw portalException;
		}
	}

	@Override
	public Layout addLayout(
			String externalReferenceCode, long userId, long groupId,
			boolean privateLayout, long parentLayoutId,
			Map<Locale, String> nameMap, Map<Locale, String> titleMap,
			Map<Locale, String> descriptionMap,
			Map<Locale, String> keywordsMap, Map<Locale, String> robotsMap,
			String type, String typeSettings, boolean hidden, boolean system,
			Map<Locale, String> friendlyURLMap, ServiceContext serviceContext)
		throws PortalException {

		long auditLogId = _auditLogService.startPending(
			AuditActionType.ADD, AuditTargetType.LAYOUT, Layout.class.getName(),
			null, _name(nameMap), null, null, serviceContext);

		try {
			Layout layout;

			try {
				AuditThreadLocal.suppressPermissionAudit();

				layout = super.addLayout(
					externalReferenceCode, userId, groupId, privateLayout,
					parentLayoutId, nameMap, titleMap, descriptionMap, keywordsMap,
					robotsMap, type, typeSettings, hidden, system, friendlyURLMap,
					serviceContext);
			}
			finally {
				AuditThreadLocal.restorePermissionAudit();
			}

			_auditLogService.completeSuccess(
				auditLogId, _classPK(layout), _title(layout), _targetUrl(layout),
				null, _auditSnapshotService.snapshotLayout(layout));

			return layout;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, null, _name(nameMap), null, portalException);

			throw portalException;
		}
	}

	@Override
	public void deleteLayout(long plid, ServiceContext serviceContext)
		throws PortalException {

		Layout beforeLayout = super.fetchLayout(plid);
		String beforeData = _auditSnapshotService.snapshotLayout(beforeLayout);
		String classPK = _classPK(beforeLayout);

		AuditThreadLocal.markHandled(
			Layout.class.getName(), classPK, AuditActionType.DELETE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, _title(beforeLayout),
			_targetUrl(beforeLayout), beforeData, serviceContext);

		try {
			super.deleteLayout(plid, serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(beforeLayout), _targetUrl(beforeLayout),
				beforeData, null);
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeLayout), _targetUrl(beforeLayout),
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.DELETE);
		}
	}

	@Override
	public void deleteLayout(Layout layout, ServiceContext serviceContext)
		throws PortalException {

		Layout beforeLayout = layout;
		String beforeData = _auditSnapshotService.snapshotLayout(beforeLayout);
		String classPK = _classPK(beforeLayout);

		AuditThreadLocal.markHandled(
			Layout.class.getName(), classPK, AuditActionType.DELETE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.DELETE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, _title(beforeLayout),
			_targetUrl(beforeLayout), beforeData, serviceContext);

		try {
			super.deleteLayout(layout, serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, classPK, _title(beforeLayout), _targetUrl(beforeLayout),
				beforeData, null);
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeLayout), _targetUrl(beforeLayout),
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.DELETE);
		}
	}

	@Override
	public Layout updateFriendlyURL(
			long userId, long plid, String friendlyURL, String languageId)
		throws PortalException {

		Layout beforeLayout = super.fetchLayout(plid);
		String beforeData = _auditSnapshotService.snapshotLayout(beforeLayout);
		String classPK = _classPK(beforeLayout);

		AuditThreadLocal.markHandled(
			Layout.class.getName(), classPK, AuditActionType.UPDATE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, _title(beforeLayout),
			_targetUrl(beforeLayout), beforeData, null);

		try {
			Layout layout = super.updateFriendlyURL(
				userId, plid, friendlyURL, languageId);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(layout), _title(layout), _targetUrl(layout),
				beforeData, _auditSnapshotService.snapshotLayout(layout));

			return layout;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeLayout), _targetUrl(beforeLayout),
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.UPDATE);
		}
	}

	@Override
	public Layout updateLayout(Layout layout) {
		Layout beforeLayout = super.fetchLayout(layout.getPlid());
		String beforeData = _auditSnapshotService.snapshotLayout(beforeLayout);
		String classPK = _classPK(beforeLayout);

		AuditThreadLocal.markHandled(
			Layout.class.getName(), classPK, AuditActionType.UPDATE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, _title(beforeLayout),
			_targetUrl(beforeLayout), beforeData, null);

		try {
			Layout updatedLayout = super.updateLayout(layout);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(updatedLayout), _title(updatedLayout),
				_targetUrl(updatedLayout), beforeData,
				_auditSnapshotService.snapshotLayout(updatedLayout));

			return updatedLayout;
		}
		catch (Exception exception) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeLayout),
				_targetUrl(beforeLayout),
				exception instanceof PortalException ?
					(PortalException)exception : new PortalException(exception));

			throw new RuntimeException(exception);
		}
		finally {
			AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.UPDATE);
		}
	}

	@Override
	public Layout updateLayout(
			long groupId, boolean privateLayout, long layoutId,
			long parentLayoutId, Map<Locale, String> nameMap,
			Map<Locale, String> titleMap, Map<Locale, String> descriptionMap,
			Map<Locale, String> keywordsMap, Map<Locale, String> robotsMap,
			String type, boolean hidden, Map<Locale, String> friendlyURLMap,
			boolean hasIconImage, byte[] iconBytes, long styleBookEntryId,
			long faviconFileEntryId, long masterLayoutPlid,
			ServiceContext serviceContext)
		throws PortalException {

		Layout beforeLayout = super.fetchLayout(groupId, privateLayout, layoutId);
		String beforeData = _auditSnapshotService.snapshotLayout(beforeLayout);
		String classPK = _classPK(beforeLayout);

		AuditThreadLocal.markHandled(
			Layout.class.getName(), classPK, AuditActionType.UPDATE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, _title(beforeLayout),
			_targetUrl(beforeLayout), beforeData, serviceContext);

		try {
			Layout layout = super.updateLayout(
				groupId, privateLayout, layoutId, parentLayoutId, nameMap,
				titleMap, descriptionMap, keywordsMap, robotsMap, type,
				hidden, friendlyURLMap, hasIconImage, iconBytes,
				styleBookEntryId, faviconFileEntryId, masterLayoutPlid,
				serviceContext);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(layout), _title(layout), _targetUrl(layout),
				beforeData, _auditSnapshotService.snapshotLayout(layout));

			return layout;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeLayout), _targetUrl(beforeLayout),
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.UPDATE);
		}
	}

	@Override
	public Layout updateLayout(
			long groupId, boolean privateLayout, long layoutId,
			String typeSettings, byte[] iconBytes, String themeId,
			String colorSchemeId, long styleBookEntryId, String css,
			long faviconFileEntryId, long masterLayoutPlid)
		throws PortalException {

		Layout beforeLayout = super.fetchLayout(groupId, privateLayout, layoutId);
		String beforeData = _auditSnapshotService.snapshotLayout(beforeLayout);
		String classPK = _classPK(beforeLayout);

		AuditThreadLocal.markHandled(
			Layout.class.getName(), classPK, AuditActionType.UPDATE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, _title(beforeLayout),
			_targetUrl(beforeLayout), beforeData, null);

		try {
			Layout layout = super.updateLayout(
				groupId, privateLayout, layoutId, typeSettings, iconBytes,
				themeId, colorSchemeId, styleBookEntryId, css,
				faviconFileEntryId, masterLayoutPlid);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(layout), _title(layout), _targetUrl(layout),
				beforeData, _auditSnapshotService.snapshotLayout(layout));

			return layout;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeLayout), _targetUrl(beforeLayout),
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.UPDATE);
		}
	}

	@Override
	public Layout updateLookAndFeel(
			long groupId, boolean privateLayout, long layoutId, String themeId,
			String colorSchemeId, String css)
		throws PortalException {

		Layout beforeLayout = super.fetchLayout(groupId, privateLayout, layoutId);
		String beforeData = _auditSnapshotService.snapshotLayout(beforeLayout);
		String classPK = _classPK(beforeLayout);

		AuditThreadLocal.markHandled(
			Layout.class.getName(), classPK, AuditActionType.UPDATE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, _title(beforeLayout),
			_targetUrl(beforeLayout), beforeData, null);

		try {
			Layout layout = super.updateLookAndFeel(
				groupId, privateLayout, layoutId, themeId, colorSchemeId, css);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(layout), _title(layout), _targetUrl(layout),
				beforeData, _auditSnapshotService.snapshotLayout(layout));

			return layout;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeLayout), _targetUrl(beforeLayout),
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.UPDATE);
		}
	}

	@Override
	public Layout updateName(long plid, String name, String languageId)
		throws PortalException {

		Layout beforeLayout = super.fetchLayout(plid);
		String beforeData = _auditSnapshotService.snapshotLayout(beforeLayout);
		String classPK = _classPK(beforeLayout);

		AuditThreadLocal.markHandled(
			Layout.class.getName(), classPK, AuditActionType.UPDATE);

		long auditLogId = _auditLogService.startPending(
			AuditActionType.UPDATE, AuditTargetType.LAYOUT,
			Layout.class.getName(), classPK, _title(beforeLayout),
			_targetUrl(beforeLayout), beforeData, null);

		try {
			Layout layout = super.updateName(plid, name, languageId);

			_auditLogService.completeSuccess(
				auditLogId, _classPK(layout), _title(layout), _targetUrl(layout),
				beforeData, _auditSnapshotService.snapshotLayout(layout));

			return layout;
		}
		catch (PortalException portalException) {
			_auditLogService.completeFailure(
				auditLogId, classPK, _title(beforeLayout), _targetUrl(beforeLayout),
				portalException);

			throw portalException;
		}
		finally {
			AuditThreadLocal.consumeHandled(
				Layout.class.getName(), classPK, AuditActionType.UPDATE);
		}
	}

	private String _classPK(Layout layout) {
		if (layout == null) {
			return null;
		}

		return String.valueOf(layout.getPlid());
	}

	private String _name(Map<Locale, String> nameMap) {
		if ((nameMap == null) || nameMap.isEmpty()) {
			return null;
		}

		for (String value : nameMap.values()) {
			if ((value != null) && !value.trim().isEmpty()) {
				return value;
			}
		}

		return null;
	}

	private String _targetUrl(Layout layout) {
		if (layout == null) {
			return null;
		}

		return layout.getFriendlyURL(Locale.getDefault());
	}

	private String _title(Layout layout) {
		if (layout == null) {
			return null;
		}

		return layout.getNameCurrentValue();
	}

	@Reference
	private AuditLogService _auditLogService;

	@Reference
	private AuditSnapshotService _auditSnapshotService;

}
