const API = '/o/vec-backup-admin';
const RESTORE_STATUS_PATH = '/sys/restore-status';
const RESTORE_STATUS_PORT = '18080';
const WATCH_STORAGE_KEY = 'vec-backup-watch-job-id';
const WATCH_NONE = '__NONE__';

let pollTimer = null;
let currentJobs = [];
let currentActiveJob = null;
let selectedWatchJobId = '';
let defaultLogDate = '';
let currentDailyLogDate = '';
let currentBackupHistoryDate = '';
let currentRestoreHistoryDate = '';

function getAppRoot() {
	return document.querySelector('.backup-restore-main-section') || document.body;
}

function isIpHostname(hostname) {
	return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(String(hostname || ''));
}

function getRestoreStatusUrl() {
	const hostname = window.location.hostname;

	if (isIpHostname(hostname)) {
		return window.location.protocol + '//' + hostname + ':' + RESTORE_STATUS_PORT + '/';
	}

	return RESTORE_STATUS_PATH;
}

function getLiferayAuthToken() {
	return window.Liferay && window.Liferay.authToken
		? window.Liferay.authToken
		: '';
}

function buildApiUrl(url) {
	const token = getLiferayAuthToken();

	if (!token || !url || /^https?:\/\//i.test(url)) {
		return url;
	}

	const separator = url.includes('?') ? '&' : '?';

	if (url.includes('p_auth=')) {
		return url;
	}

	return url + separator + 'p_auth=' + encodeURIComponent(token);
}

function buildRequestOptions(options) {
	const token = getLiferayAuthToken();
	const mergedOptions = Object.assign({ credentials: 'include' }, options || {});
	const mergedHeaders = Object.assign({}, mergedOptions.headers || {});

	if (token && !mergedHeaders['x-csrf-token']) {
		mergedHeaders['x-csrf-token'] = token;
	}

	if (!mergedHeaders['X-Requested-With']) {
		mergedHeaders['X-Requested-With'] = 'XMLHttpRequest';
	}

	mergedOptions.headers = mergedHeaders;

	return mergedOptions;
}

function escHtml(value) {
	return String(value || '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function badge(label, tone) {
	return '<span class="badge ' + tone + '">' + escHtml(label) + '</span>';
}

function showUnauthorizedScreen() {
	if (pollTimer) {
		clearTimeout(pollTimer);
		pollTimer = null;
	}

	const appRoot = getAppRoot();

	if (!appRoot) {
		return;
	}

	appRoot.className = 'backup-restore-main-section';
	appRoot.innerHTML =
		'<div class="auth-shell">' +
		'<div class="auth-card">' +
		'<h1>Authorization Required</h1>' +
		'<p>Bạn chưa được xác thực để truy cập màn hình Backup & Restore. Vui lòng đăng nhập đúng phiên hoặc liên hệ quản trị viên nếu lỗi này không đúng mong đợi.</p>' +
		'</div>' +
		'</div>';
}

function hasRunningJobs(jobs) {
	return jobs.some((job) => job.status === 'queued' || job.status === 'running');
}

function setSelectedWatchJobId(jobId) {
	selectedWatchJobId = jobId || '';

	if (selectedWatchJobId) {
		localStorage.setItem(WATCH_STORAGE_KEY, selectedWatchJobId);
	} else {
		localStorage.setItem(WATCH_STORAGE_KEY, WATCH_NONE);
	}
}

function getStoredWatchJobId() {
	return localStorage.getItem(WATCH_STORAGE_KEY) || '';
}

function resolveSelectedWatchJob(jobs, activeJob) {
	const preferredId = selectedWatchJobId || getStoredWatchJobId();

	if (preferredId === WATCH_NONE) {
		selectedWatchJobId = '';
		return null;
	}

	if (preferredId) {
		const matched = jobs.find((job) => job.id === preferredId);

		if (matched) {
			setSelectedWatchJobId(matched.id);
			return matched;
		}
	}

	if (activeJob && activeJob.id) {
		setSelectedWatchJobId(activeJob.id);
		return activeJob;
	}

	if (jobs.length) {
		setSelectedWatchJobId(jobs[0].id);
		return jobs[0];
	}

	setSelectedWatchJobId('');
	return null;
}

function fallbackDateString() {
	return new Date().toISOString().slice(0, 10);
}

function resolveLogDate(preferredDate) {
	return preferredDate || defaultLogDate || fallbackDateString();
}

function syncDateInput(inputId, value) {
	const input = document.getElementById(inputId);

	if (input && value) {
		input.value = value;
	}
}

function formatBackupMode(mode) {
	switch (String(mode || '').toLowerCase()) {
		case 'backup đầy đủ':
		case 'full':
			return 'Đầy đủ';
		case 'backup database':
		case 'database':
			return 'Chỉ database';
		case 'backup bundles':
		case 'bundles':
			return 'Chỉ bundles';
		default:
			return mode || '--';
	}
}

function formatRestoreMode(mode) {
	switch (String(mode || '').toLowerCase()) {
		case 'bundles+database':
			return 'Bundles + database';
		case 'bundles':
			return 'Chỉ bundles';
		case 'database':
			return 'Chỉ database';
		default:
			return mode || '--';
	}
}

async function fetchJson(url, options) {
	const res = await fetch(buildApiUrl(url), buildRequestOptions(options));

	if (res.status === 401) {
		showUnauthorizedScreen();
		throw new Error('UNAUTHORIZED');
	}

	let payload = null;
	const text = await res.text();

	if (text) {
		try {
			payload = JSON.parse(text);
		} catch (error) {
			payload = { raw: text };
		}
	}

	if (!res.ok) {
		const message = payload && payload.error ? payload.error : ('HTTP ' + res.status);
		const err = new Error(message);
		err.status = res.status;
		err.payload = payload;
		throw err;
	}

	return payload || {};
}

async function init() {
	const appRoot = getAppRoot();

	try {
		await fetchJson(API + '/auth');
		if (appRoot) {
			appRoot.classList.remove('auth-checking');
		}
		await loadOverview();
	} catch (error) {
		if (appRoot) {
			appRoot.classList.remove('auth-checking');
		}
		if (error.status === 403) {
			if (appRoot) {
				appRoot.innerHTML = '<div class="shell"><div class="error-box">Bạn không có quyền truy cập màn hình này. Chỉ `screenName=admin` mới được sử dụng.</div></div>';
			}
			return;
		}
		if (error.message !== 'UNAUTHORIZED' && appRoot) {
			appRoot.innerHTML = '<div class="shell"><div class="error-box">Không thể tải dữ liệu Backup & Restore: ' + escHtml(error.message) + '</div></div>';
		}
	}
}

async function loadOverview(silent) {
	try {
		const data = await fetchJson(API + '/overview');
		renderOverview(data);
		await loadJobs(true, false);
	} catch (error) {
		if (!silent && error.message !== 'UNAUTHORIZED') {
			const consoleEl = document.getElementById('dailyLogConsole');
			const metaEl = document.getElementById('dailyLogMeta');

			if (metaEl) {
				metaEl.textContent = 'Không thể tải dữ liệu tổng quan.';
			}

			if (consoleEl) {
				consoleEl.textContent = error.message;
			}
		}
	}
}

async function loadJobs(silent, refreshOverviewWhenSettled) {
	try {
		const data = await fetchJson(API + '/jobs');
		const jobs = Array.isArray(data.items) ? data.items : [];
		const activeJob = data.activeJob && data.activeJob.id ? data.activeJob : null;

		currentJobs = jobs;
		currentActiveJob = activeJob;
		renderWatchPanel(jobs, activeJob);
		schedulePolling(jobs);
		await Promise.all([loadDailyLog(true), loadBackupHistory(true), loadRestoreHistory(true)]);

		if (refreshOverviewWhenSettled && !hasRunningJobs(jobs)) {
			await loadOverview(true);
		}
	} catch (error) {
		if (!silent && error.message !== 'UNAUTHORIZED') {
			const consoleEl = document.getElementById('watchConsole');

			if (consoleEl) {
				consoleEl.textContent = error.message;
			}
		}
	}
}

function renderOverview(data) {
	const auth = data.auth || {};
	const script = data.script || {};
	const autoBackup = data.autoBackup || {};
	const warning = data.warning || {};
	const backups = Array.isArray(data.backups)
		? data.backups.map((item, index) => {
			const rawIndex = item && item.index;
			const hasExplicitIndex = rawIndex !== undefined && rawIndex !== null && String(rawIndex).trim() !== '';

			return Object.assign({}, item, {
				index: hasExplicitIndex ? rawIndex : index
			});
		})
		: [];
	const functions = Array.isArray(data.functions) ? data.functions : [];
	const jobs = Array.isArray(data.jobs) ? data.jobs : [];
	const activeJob = data.activeJob && data.activeJob.id ? data.activeJob : null;
	const hasActiveJob = Boolean(data.hasActiveJob);

	defaultLogDate = data.defaultLogDate || defaultLogDate || fallbackDateString();
	currentDailyLogDate = currentDailyLogDate || defaultLogDate;
	currentBackupHistoryDate = currentBackupHistoryDate || defaultLogDate;
	currentRestoreHistoryDate = currentRestoreHistoryDate || defaultLogDate;
	currentJobs = jobs;
	currentActiveJob = activeJob;

	syncDateInput('dailyLogDate', currentDailyLogDate);
	syncDateInput('backupHistoryDate', currentBackupHistoryDate);
	syncDateInput('restoreHistoryDate', currentRestoreHistoryDate);

	document.getElementById('userChip').textContent = auth.screenName
		? ('Đăng nhập: ' + auth.screenName + (auth.fullName ? ' · ' + auth.fullName : ''))
		: 'Không xác định user';

	document.getElementById('scriptChip').textContent = script.available
		? ('Script: ' + script.path)
		: 'Chưa tìm thấy script backup';

	document.getElementById('warningText').textContent = warning.message || 'Hệ thống đang dùng chính sách retention mặc định.';

	document.getElementById('autoBackupValue').textContent = autoBackup.enabled ? 'Đang bật' : 'Đang tắt';
	document.getElementById('autoBackupCopy').innerHTML = autoBackup.enabled
		? 'Cron hiện tại: <code>' + escHtml(autoBackup.cronLine || autoBackup.schedule || '') + '</code>'
		: 'Chưa phát hiện cron backup. Bạn có thể bật trực tiếp ở nhóm chức năng bên dưới.';

	document.getElementById('scriptValue').textContent = script.available ? 'Sẵn sàng' : 'Thiếu script';
	document.getElementById('scriptCopy').innerHTML = script.available
		? 'Config: <code>' + escHtml(script.configPath || 'Không thấy file .env') + '</code><br>Backup dir: <code>' + escHtml(script.backupDir || '--') + '</code>'
		: 'Có thể cấu hình bằng biến môi trường <code>VEC_BACKUP_SCRIPT_PATH</code>.';

	document.getElementById('backupCountValue').textContent = String(backups.length);
	document.getElementById('backupCountCopy').innerHTML = backups.length
		? 'Bundle dir: <code>' + escHtml(script.bundleDir || '--') + '</code>'
		: 'Chưa có backup nào trong thư mục hiện tại.';

	renderActionGrid(functions, script.available, hasActiveJob, activeJob);
	renderBackupTable(backups, script.available, hasActiveJob, activeJob);
	renderWatchPanel(jobs, activeJob);
	schedulePolling(jobs);
}

function renderActionGrid(functions, scriptAvailable, hasActiveJob, activeJob) {
	const container = document.getElementById('actionGrid');

	if (!functions.length) {
		container.innerHTML = '<div class="empty">Không có dữ liệu chức năng.</div>';
		return;
	}

	container.innerHTML = functions.map((item) => {
		const disabled = !scriptAvailable || !item.executable || item.requiresBackupSelection || hasActiveJob;
		const isCronToggle = String(item.key || '').indexOf('cron-') === 0;
		const buttonLabel = item.requiresBackupSelection
			? 'Dùng ở bảng backup'
			: (isCronToggle ? item.title : 'Chạy lệnh');
		const lockMessage = hasActiveJob
			? '<span class="badge warn">Đang khóa do job `' + escHtml(activeJob && activeJob.action ? activeJob.action : 'running') + '`</span>'
			: '';

		return '' +
			'<article class="action-card">' +
			'<h3>' + escHtml(item.title) + '</h3>' +
			'<p>' + escHtml(item.description) + '</p>' +
			'<div class="btn-row">' +
			(item.executable
				? '<button class="' + (
					(item.key === 'backup' || item.key === 'backup-database' || item.key === 'backup-bundles')
						? 'btn-primary'
						: 'btn-secondary'
				) + '" ' +
					(disabled ? 'disabled ' : '') +
					'data-action="' + escHtml(item.key) + '">' + escHtml(buttonLabel) + '</button>'
				: '<span class="badge ok">Thông tin</span>') +
			lockMessage +
			'</div>' +
			'</article>';
	}).join('');

	container.querySelectorAll('button[data-action]').forEach((button) => {
		button.addEventListener('click', () => {
			runAction(button.getAttribute('data-action'));
		});
	});
}

function renderBackupTable(backups, scriptAvailable, hasActiveJob, activeJob) {
	const tbody = document.getElementById('backupTableBody');

	if (!backups.length) {
		tbody.innerHTML = '<tr><td colspan="7" class="muted">Chưa có backup nào.</td></tr>';
		return;
	}

	tbody.innerHTML = backups.map((item, fallbackIndex) => {
		const rawIndex = item && item.index;
		const backupIndex = String(
			rawIndex !== undefined && rawIndex !== null && String(rawIndex).trim() !== ''
				? rawIndex
				: fallbackIndex
		);
		const backupName = String(item && (item.backupName || item.name) ? (item.backupName || item.name) : '');
		const canRestore = Boolean(item.hasBundleArchive || item.hasDatabaseArchive);

		return '' +
			'<tr>' +
			'<td>' + escHtml(backupIndex) + '</td>' +
			'<td>' +
			'<div class="meta-stack">' +
			'<strong>' + escHtml(item.name) + '</strong>' +
			'<span class="muted"><code>' + escHtml(item.path) + '</code></span>' +
			'</div>' +
			'</td>' +
			'<td>' +
			'<div class="meta-stack">' +
			'<span>Tạo lúc: ' + escHtml(item.createdAt || '--') + '</span>' +
			'<span class="muted">Hoàn tất: ' + escHtml(item.modifiedAt || '--') + '</span>' +
			'</div>' +
			'</td>' +
			'<td>' +
			'<div class="meta-stack">' +
			'<strong>' + escHtml(item.bundleSizeLabel || '0 B') + '</strong>' +
			'<span>' + (item.hasBundleArchive ? badge('Có file tải', 'ok') : badge('Không có file', 'warn')) + '</span>' +
			'</div>' +
			'</td>' +
			'<td>' +
			'<div class="meta-stack">' +
			'<strong>' + escHtml(item.databaseSizeLabel || '0 B') + '</strong>' +
			'<span>' + (item.hasDatabaseArchive ? badge('Có file tải', 'ok') : badge('Không có file', 'warn')) + '</span>' +
			'</div>' +
			'</td>' +
			'<td><strong>' + escHtml(item.totalSizeLabel || '0 B') + '</strong></td>' +
			'<td>' +
			'<div class="btn-row">' +
			'<button class="btn-secondary" ' + (!item.hasBundleArchive ? 'disabled ' : '') + 'data-download="bundles" data-name="' + escHtml(backupName) + '">Tải bundles</button>' +
			'<button class="btn-secondary" ' + (!item.hasDatabaseArchive ? 'disabled ' : '') + 'data-download="database" data-name="' + escHtml(backupName) + '">Tải database</button>' +
			'<button class="btn-primary" ' + (!scriptAvailable || hasActiveJob || !canRestore ? 'disabled ' : '') + 'data-row-action="restore" data-name="' + escHtml(backupName) + '">Restore</button>' +
			'<button class="btn-danger" ' + (!scriptAvailable || hasActiveJob ? 'disabled ' : '') + 'data-row-action="delete" data-name="' + escHtml(backupName) + '">Xóa</button>' +
			(hasActiveJob ? '<span class="badge warn">Khóa do job `' + escHtml(activeJob && activeJob.action ? activeJob.action : 'running') + '`</span>' : '') +
			'</div>' +
			'</td>' +
			'</tr>';
	}).join('');

	tbody.querySelectorAll('button[data-download]').forEach((button) => {
		button.addEventListener('click', async () => {
			const backupName = (button.getAttribute('data-name') || '').trim();
			const type = button.getAttribute('data-download');

			if (!backupName) {
				alert('Không xác định được tên backup để tải file.');
				return;
			}

			try {
				button.disabled = true;

				const data = await fetchJson(
					API + '/backups/' + encodeURIComponent(backupName) +
					'/download-token?type=' + encodeURIComponent(type),
					{ method: 'POST' }
				);

				if (!data.downloadUrl) {
					throw new Error('Không tạo được link tải file.');
				}

				window.location.href = data.downloadUrl;
			} catch (error) {
				alert(error.message || 'Không thể tải file backup.');
			} finally {
				button.disabled = false;
			}
		});
	});

	tbody.querySelectorAll('button[data-row-action]').forEach((button) => {
		button.addEventListener('click', () => {
			const action = button.getAttribute('data-row-action');
			const backupName = (button.getAttribute('data-name') || '').trim();

			if (!backupName) {
				alert('Không xác định được tên backup.');
				return;
			}

			runRowAction(action, backupName);
		});
	});
}

function renderWatchPanel(jobs, activeJob) {
	const watchJob = resolveSelectedWatchJob(jobs, activeJob);
	const titleEl = document.getElementById('watchTitle');
	const subtitleEl = document.getElementById('watchSubtitle');
	const consoleEl = document.getElementById('watchConsole');

	if (!watchJob) {
		titleEl.textContent = 'Live Watch';
		subtitleEl.textContent = 'Chưa có job nào để theo dõi. Khi bạn chạy backup hoặc restore, màn hình này sẽ tự gắn vào job đang chạy.';
		consoleEl.textContent = 'Chưa chọn job để theo dõi.';
		return;
	}

	const suffix = watchJob.running ? 'đang chạy' : 'đã hoàn tất';

	titleEl.textContent = 'Live Watch · ' + (watchJob.action || 'unknown');
	subtitleEl.textContent =
		'Đang theo dõi job #' + watchJob.id + ' (' + suffix + '). ' +
		'F5 xong trang sẽ cố mở lại đúng job này nếu backend vẫn còn giữ trong bộ nhớ.';
	consoleEl.textContent = watchJob.output || (watchJob.running
		? 'Đang chờ output từ tiến trình...'
		: 'Job này chưa có output.');

	if (watchJob.running) {
		consoleEl.scrollTop = consoleEl.scrollHeight;
	}
}

async function loadDailyLog(silent) {
	const requestedDate = resolveLogDate(
		(document.getElementById('dailyLogDate') || {}).value || currentDailyLogDate
	);

	try {
		const data = await fetchJson(API + '/logs?date=' + encodeURIComponent(requestedDate));
		currentDailyLogDate = data.date || requestedDate;
		syncDateInput('dailyLogDate', currentDailyLogDate);
		renderDailyLog(data);
	} catch (error) {
		if (!silent && error.message !== 'UNAUTHORIZED') {
			renderDailyLog({
				date: requestedDate,
				available: false,
				output: '',
				logFile: '',
				error: error.message
			});
		}
	}
}

function renderDailyLog(data) {
	const metaEl = document.getElementById('dailyLogMeta');
	const consoleEl = document.getElementById('dailyLogConsole');
	const requestedDate = data.date || currentDailyLogDate || defaultLogDate;

	if (!metaEl || !consoleEl) {
		return;
	}

	if (data.error) {
		metaEl.textContent = 'Không thể tải log cho ngày ' + requestedDate + '.';
		consoleEl.textContent = data.error;
		return;
	}

	if (!data.available || !data.output) {
		metaEl.textContent = 'Không có log cho ngày ' + requestedDate + '.';
		consoleEl.textContent = 'Empty';
		return;
	}

	metaEl.innerHTML = 'Log file: <code>' + escHtml(data.logFile || '--') + '</code>';
	consoleEl.textContent = data.output;
	consoleEl.scrollTop = consoleEl.scrollHeight;
}

async function loadBackupHistory(silent) {
	const requestedDate = resolveLogDate(
		(document.getElementById('backupHistoryDate') || {}).value || currentBackupHistoryDate
	);

	try {
		const data = await fetchJson(API + '/backup-history?date=' + encodeURIComponent(requestedDate));
		currentBackupHistoryDate = data.date || requestedDate;
		syncDateInput('backupHistoryDate', currentBackupHistoryDate);
		renderBackupHistory(data);
	} catch (error) {
		if (!silent && error.message !== 'UNAUTHORIZED') {
			renderBackupHistory({
				date: requestedDate,
				available: false,
				items: [],
				error: error.message
			});
		}
	}
}

function renderBackupHistory(data) {
	const tbody = document.getElementById('backupHistoryBody');
	const items = Array.isArray(data.items) ? data.items : [];

	if (!tbody) {
		return;
	}

	if (data.error) {
		tbody.innerHTML = '<tr><td colspan="7" class="error-box">' + escHtml(data.error) + '</td></tr>';
		return;
	}

	if (!items.length) {
		tbody.innerHTML = '<tr><td colspan="7" class="muted">Empty</td></tr>';
		return;
	}

	tbody.innerHTML = items.map((item) => {
		const status = String(item.status || '').toLowerCase();
		const tone = status === 'success' ? 'ok' : 'fail';

		return '' +
			'<tr>' +
			'<td><strong>' + escHtml(item.backupName || '--') + '</strong></td>' +
			'<td>' + escHtml(formatBackupMode(item.backupMode)) + '</td>' +
			'<td>' + escHtml(item.startedAt || '--') + '</td>' +
			'<td>' + escHtml(item.finishedAt || '--') + '</td>' +
			'<td>' + escHtml(item.totalSizeLabel || '--') + '</td>' +
			'<td>' + badge(status || 'unknown', tone) + '</td>' +
			'<td><code>' + escHtml(item.logFile || '--') + '</code></td>' +
			'</tr>';
	}).join('');
}

async function loadRestoreHistory(silent) {
	const requestedDate = resolveLogDate(
		(document.getElementById('restoreHistoryDate') || {}).value || currentRestoreHistoryDate
	);

	try {
		const data = await fetchJson(API + '/restore-history?date=' + encodeURIComponent(requestedDate));
		currentRestoreHistoryDate = data.date || requestedDate;
		syncDateInput('restoreHistoryDate', currentRestoreHistoryDate);
		renderRestoreHistory(data);
	} catch (error) {
		if (!silent && error.message !== 'UNAUTHORIZED') {
			renderRestoreHistory({
				date: requestedDate,
				available: false,
				items: [],
				error: error.message
			});
		}
	}
}

function renderRestoreHistory(data) {
	const tbody = document.getElementById('restoreHistoryBody');
	const items = Array.isArray(data.items) ? data.items : [];

	if (!tbody) {
		return;
	}

	if (data.error) {
		tbody.innerHTML = '<tr><td colspan="6" class="error-box">' + escHtml(data.error) + '</td></tr>';
		return;
	}

	if (!items.length) {
		tbody.innerHTML = '<tr><td colspan="6" class="muted">Empty</td></tr>';
		return;
	}

	tbody.innerHTML = items.map((item) => {
		const status = String(item.status || '').toLowerCase();
		const tone = status === 'success' ? 'ok' : 'fail';

		return '' +
			'<tr>' +
			'<td><strong>' + escHtml(item.backupName || '--') + '</strong></td>' +
			'<td>' + escHtml(formatRestoreMode(item.restoreMode)) + '</td>' +
			'<td>' + escHtml(item.startedAt || '--') + '</td>' +
			'<td>' + escHtml(item.finishedAt || '--') + '</td>' +
			'<td>' + badge(status || 'unknown', tone) + '</td>' +
			'<td><code>' + escHtml(item.logFile || '--') + '</code></td>' +
			'</tr>';
	}).join('');
}

async function runAction(action) {
	let confirmed = true;

	if (action === 'backup') {
		confirmed = window.confirm('Tạo một bản backup mới ngay bây giờ?');
	} else if (action === 'cron-install') {
		confirmed = window.confirm('Bật auto backup bằng cron job theo cấu hình hiện tại?');
	} else if (action === 'cron-uninstall') {
		confirmed = window.confirm('Tắt auto backup và gỡ cron job hiện tại?');
	}

	if (!confirmed) {
		return;
	}

	await queueAction(action, {});
}

async function runRowAction(action, backupName) {
	const confirmed = action === 'restore'
		? window.confirm('Restore backup `' + backupName + '`. Hệ thống sẽ tự kiểm tra backup này đang có bundles, database hay cả hai rồi chỉ restore đúng phần hiện diện, sau đó start lại server. Tiếp tục?')
		: window.confirm('Xóa backup `' + backupName + '`? Thao tác này không thể hoàn tác.');

	if (!confirmed) {
		return;
	}

	const queued = await queueAction(action, { backupName: String(backupName) });

	if (queued && action === 'restore') {
		window.location.href = getRestoreStatusUrl();
	}
}

async function queueAction(action, payload) {
	try {
		await fetchJson(API + '/actions/' + encodeURIComponent(action), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload || {})
		});
		await loadOverview(true);
		return true;
	} catch (error) {
		if (error.status === 409) {
			const activeJob = error.payload && error.payload.activeJob && error.payload.activeJob.id
				? error.payload.activeJob
				: null;

			if (activeJob) {
				setSelectedWatchJobId(activeJob.id);
			}

			await loadOverview(true);
		}
		alert(error.message);
		return false;
	}
}

function schedulePolling(jobs) {
	const hasRunningJob = hasRunningJobs(jobs);

	if (pollTimer) {
		clearTimeout(pollTimer);
		pollTimer = null;
	}

	if (hasRunningJob) {
		pollTimer = setTimeout(() => loadJobs(true, true), 2000);
	}
}

document.getElementById('btnWatchNewest').addEventListener('click', () => {
	const newestJob = currentJobs[0] || null;

	setSelectedWatchJobId(newestJob && newestJob.id ? newestJob.id : '');
	renderWatchPanel(currentJobs, currentActiveJob);
});

document.getElementById('btnClearWatch').addEventListener('click', () => {
	setSelectedWatchJobId('');
	renderWatchPanel(currentJobs, currentActiveJob);
});

document.getElementById('btnReloadDailyLog').addEventListener('click', () => {
	currentDailyLogDate = (document.getElementById('dailyLogDate') || {}).value || currentDailyLogDate || defaultLogDate;
	loadDailyLog(false);
});

document.getElementById('btnReloadBackupHistory').addEventListener('click', () => {
	currentBackupHistoryDate = (document.getElementById('backupHistoryDate') || {}).value || currentBackupHistoryDate || defaultLogDate;
	loadBackupHistory(false);
});

document.getElementById('btnReloadRestoreHistory').addEventListener('click', () => {
	currentRestoreHistoryDate = (document.getElementById('restoreHistoryDate') || {}).value || currentRestoreHistoryDate || defaultLogDate;
	loadRestoreHistory(false);
});

document.getElementById('dailyLogDate').addEventListener('change', (event) => {
	currentDailyLogDate = event.target.value || defaultLogDate || fallbackDateString();
	loadDailyLog(false);
});

document.getElementById('backupHistoryDate').addEventListener('change', (event) => {
	currentBackupHistoryDate = event.target.value || defaultLogDate || fallbackDateString();
	loadBackupHistory(false);
});

document.getElementById('restoreHistoryDate').addEventListener('change', (event) => {
	currentRestoreHistoryDate = event.target.value || defaultLogDate || fallbackDateString();
	loadRestoreHistory(false);
});

init();
