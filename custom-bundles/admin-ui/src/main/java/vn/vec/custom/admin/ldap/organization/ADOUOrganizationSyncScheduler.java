package vn.vec.custom.admin.ldap.organization;

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

import java.util.Date;
import java.util.Map;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;

@Component(
	configurationPid = "vn.vec.custom.admin.ldap.organization.ADOUOrganizationSyncConfiguration",
	immediate = true,
	property = "destination.name=" + DestinationNames.SCHEDULER_DISPATCH,
	service = {ADOUOrganizationSyncScheduler.class, MessageListener.class}
)
@Designate(ocd = ADOUOrganizationSyncConfiguration.class)
public class ADOUOrganizationSyncScheduler implements MessageListener {

	@Override
	public void receive(Message message) {
		if (!_isOwnMessage(message)) {
			return;
		}

		if (!_enabled) {
			if (_log.isDebugEnabled()) {
				_log.debug("AD OU organization sync scheduler is disabled");
			}

			return;
		}

		try {
			_adouOrganizationSyncService.sync(_batchSize, _dryRun);
		}
		catch (Exception exception) {
			_log.error("AD OU organization sync scheduler failed", exception);
		}
	}

	@Activate
	@Modified
	protected void activate(Map<String, Object> properties) {
		_enabled = _booleanValue(properties, "enabled", true);
		_cronExpression = _stringValue(
			properties, "cronExpression", _DEFAULT_CRON_EXPRESSION);
		_batchSize = Math.max(_intValue(properties, "batchSize", 200), 1);
		_dryRun = _booleanValue(properties, "dryRun", false);

		unschedule();

		if (!_enabled) {
			_log.info("AD OU organization sync scheduler is disabled");

			return;
		}

		schedule();
	}

	@Deactivate
	protected void deactivate() {
		unschedule();
	}

	protected void schedule() {
		try {
			_deleteScheduledJob();

			Trigger trigger = _triggerFactory.createTrigger(
				_JOB_NAME, _GROUP_NAME, new Date(), null, _cronExpression);

			_schedulerEngineHelper.schedule(
				trigger, StorageType.MEMORY_CLUSTERED,
				"Synchronize AD OU distinguished names to Liferay organizations",
				DestinationNames.SCHEDULER_DISPATCH, new Message());

			_scheduled = true;

			_log.info(
				"AD OU organization sync scheduler registered with cron " +
					_cronExpression);
		}
		catch (Exception exception) {
			_scheduled = false;

			_log.error("Unable to register AD OU organization sync scheduler", exception);
		}
	}

	protected void unschedule() {
		if (!_scheduled) {
			return;
		}

		try {
			_deleteScheduledJob();
		}
		catch (Exception exception) {
			_log.warn("Unable to unregister AD OU organization sync scheduler", exception);
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
		return _JOB_NAME.equals(message.getString(SchedulerEngine.JOB_NAME)) &&
			_GROUP_NAME.equals(message.getString(SchedulerEngine.GROUP_NAME));
	}

	private boolean _booleanValue(
		Map<String, Object> properties, String key, boolean defaultValue) {

		Object value = (properties == null) ? null : properties.get(key);

		if (value == null) {
			return defaultValue;
		}

		if (value instanceof Boolean) {
			return (Boolean)value;
		}

		return Boolean.parseBoolean(String.valueOf(value));
	}

	private int _intValue(
		Map<String, Object> properties, String key, int defaultValue) {

		Object value = (properties == null) ? null : properties.get(key);

		if (value == null) {
			return defaultValue;
		}

		if (value instanceof Number) {
			return ((Number)value).intValue();
		}

		try {
			return Integer.parseInt(String.valueOf(value));
		}
		catch (NumberFormatException numberFormatException) {
			_log.warn(
				"Invalid AD OU organization sync integer configuration " + key +
					"=" + value + ", using default " + defaultValue);

			return defaultValue;
		}
	}

	private String _stringValue(
		Map<String, Object> properties, String key, String defaultValue) {

		Object value = (properties == null) ? null : properties.get(key);

		if (value == null) {
			return defaultValue;
		}

		String stringValue = String.valueOf(value).trim();

		if (stringValue.isEmpty()) {
			return defaultValue;
		}

		return stringValue;
	}

	private static final String _DEFAULT_CRON_EXPRESSION = "0 0/5 * * * ?";

	private static final String _GROUP_NAME =
		ADOUOrganizationSyncScheduler.class.getName();

	private static final String _JOB_NAME =
		ADOUOrganizationSyncScheduler.class.getName();

	private static final Log _log = LogFactoryUtil.getLog(
		ADOUOrganizationSyncScheduler.class);

	@Reference
	private ADOUOrganizationSyncService _adouOrganizationSyncService;

	private volatile int _batchSize = 200;
	private volatile String _cronExpression = _DEFAULT_CRON_EXPRESSION;
	private volatile boolean _dryRun;
	private volatile boolean _enabled = true;

	private volatile boolean _scheduled;

	@Reference
	private SchedulerEngineHelper _schedulerEngineHelper;

	@Reference
	private TriggerFactory _triggerFactory;

}
