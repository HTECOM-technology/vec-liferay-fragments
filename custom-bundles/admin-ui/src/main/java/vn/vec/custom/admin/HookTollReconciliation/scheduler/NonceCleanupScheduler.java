package vn.vec.custom.admin.HookTollReconciliation.scheduler;

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

import java.time.Instant;

import java.util.Date;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.admin.HookTollReconciliation.HookConstants;
import vn.vec.custom.admin.HookTollReconciliation.persistence.HookNonceRepository;

/** Dọn nonce hết hạn theo cron tập trung trong HookConstants. */
@Component(
	immediate = true,
	property = "destination.name=" + DestinationNames.SCHEDULER_DISPATCH,
	service = {NonceCleanupScheduler.class, MessageListener.class}
)
public class NonceCleanupScheduler implements MessageListener {

	@Override
	public void receive(Message message) {
		if (!_isOwnMessage(message)) {
			return;
		}

		try {
			int deleted = _hookNonceRepository.deleteExpired(Instant.now());

			if (_log.isDebugEnabled()) {
				_log.debug("Deleted " + deleted + " expired toll hook nonces");
			}
		}
		catch (Exception exception) {
			_log.warn("Unable to clean expired toll hook nonces", exception);
		}
	}

	@Activate
	protected void activate() {
		try {
			_deleteScheduledJob();

			Trigger trigger = _triggerFactory.createTrigger(
				_JOB_NAME, _GROUP_NAME, new Date(), null,
				HookConstants.NONCE_CLEANUP_CRON);

			_schedulerEngineHelper.schedule(
				trigger, StorageType.MEMORY_CLUSTERED,
				"Clean expired toll reconciliation hook nonces",
				DestinationNames.SCHEDULER_DISPATCH, new Message());

			_scheduled = true;
		}
		catch (Exception exception) {
			_scheduled = false;
			_log.error("Unable to schedule toll hook nonce cleanup", exception);
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
			_log.warn("Unable to unschedule toll hook nonce cleanup", exception);
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
		NonceCleanupScheduler.class.getName();
	private static final String _JOB_NAME =
		NonceCleanupScheduler.class.getName();

	private static final Log _log = LogFactoryUtil.getLog(
		NonceCleanupScheduler.class);

	@Reference
	private HookNonceRepository _hookNonceRepository;

	private volatile boolean _scheduled;

	@Reference
	private SchedulerEngineHelper _schedulerEngineHelper;

	@Reference
	private TriggerFactory _triggerFactory;
}
