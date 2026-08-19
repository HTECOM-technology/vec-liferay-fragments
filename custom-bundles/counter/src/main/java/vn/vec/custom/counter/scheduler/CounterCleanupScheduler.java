package vn.vec.custom.counter.scheduler;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.messaging.DestinationNames;
import com.liferay.portal.kernel.messaging.Message;
import com.liferay.portal.kernel.messaging.MessageListener;
import com.liferay.portal.kernel.scheduler.SchedulerEngine;
import com.liferay.portal.kernel.scheduler.SchedulerEngineHelper;
import com.liferay.portal.kernel.scheduler.StorageType;
import com.liferay.portal.kernel.scheduler.Trigger;
import com.liferay.portal.kernel.scheduler.TriggerFactory;

import java.time.LocalDate;

import java.util.Date;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.counter.constants.CounterConstants;
import vn.vec.custom.counter.persistence.OnlineSessionRepository;
import vn.vec.custom.counter.persistence.SiteVisitRepository;

/**
 * Dọn dữ liệu counter theo cron {@link CounterConstants#CLEANUP_CRON}:
 *
 * <ul>
 * <li>xoá session online đã hết hạn</li>
 * <li>xoá dòng visitor chi tiết quá
 * {@link CounterConstants#VISITOR_RETENTION_DAYS} ngày — số liệu tổng hợp theo
 * ngày trong {@code VEC_CounterSiteVisit} không bị ảnh hưởng</li>
 * </ul>
 */
@Component(
	immediate = true,
	property = "destination.name=" + DestinationNames.SCHEDULER_DISPATCH,
	service = {CounterCleanupScheduler.class, MessageListener.class}
)
public class CounterCleanupScheduler implements MessageListener {

	@Override
	public void receive(Message message) {
		if (!_isOwnMessage(message)) {
			return;
		}

		try {
			int deletedSessions =
				_onlineSessionRepository.deleteStaleSessions();
			int deletedVisitors = _siteVisitRepository.deleteVisitorsBefore(
				LocalDate.now().minusDays(
					CounterConstants.VISITOR_RETENTION_DAYS));

			if (_log.isDebugEnabled()) {
				_log.debug(
					"Deleted " + deletedSessions + " online sessions and " +
						deletedVisitors + " visitor rows");
			}
		}
		catch (Exception exception) {
			_log.warn("Unable to clean counter data", exception);
		}
	}

	@Activate
	protected void activate() {
		try {
			_deleteScheduledJob();

			Trigger trigger = _triggerFactory.createTrigger(
				_JOB_NAME, _GROUP_NAME, new Date(), null,
				CounterConstants.CLEANUP_CRON);

			_schedulerEngineHelper.schedule(
				trigger, StorageType.MEMORY_CLUSTERED,
				"Clean expired counter data", DestinationNames.SCHEDULER_DISPATCH,
				new Message());

			_scheduled = true;
		}
		catch (Exception exception) {
			_scheduled = false;

			_log.error("Unable to schedule counter cleanup", exception);
		}
	}

	@Deactivate
	protected void deactivate() {
		if (!_scheduled) {
			return;
		}

		try {
			_deleteScheduledJob();
		}
		catch (Exception exception) {
			_log.warn("Unable to unschedule counter cleanup", exception);
		}
		finally {
			_scheduled = false;
		}
	}

	private void _deleteScheduledJob() throws Exception {
		_schedulerEngineHelper.delete(
			_JOB_NAME, _GROUP_NAME, StorageType.MEMORY_CLUSTERED);
	}

	private boolean _isOwnMessage(Message message) {
		return (message != null) &&
			_JOB_NAME.equals(message.getString(SchedulerEngine.JOB_NAME)) &&
			_GROUP_NAME.equals(message.getString(SchedulerEngine.GROUP_NAME));
	}

	private static final String _GROUP_NAME =
		CounterCleanupScheduler.class.getName();

	private static final String _JOB_NAME =
		CounterCleanupScheduler.class.getName();

	private static final Log _log = LogFactoryUtil.getLog(
		CounterCleanupScheduler.class);

	@Reference
	private OnlineSessionRepository _onlineSessionRepository;

	private volatile boolean _scheduled;

	@Reference
	private SchedulerEngineHelper _schedulerEngineHelper;

	@Reference
	private SiteVisitRepository _siteVisitRepository;

	@Reference
	private TriggerFactory _triggerFactory;

}
