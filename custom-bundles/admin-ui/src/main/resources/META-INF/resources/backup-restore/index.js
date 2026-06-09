const API = '/o/vec-backup-admin';
const WATCH_STORAGE_KEY = 'vec-backup-watch-job-id';
const WATCH_NONE = '__NONE__';
let pollTimer = null;
let currentJobs = [];
let currentActiveJob = null;
let selectedWatchJobId = '';

function getAppRoot() {
	return document.querySelector('.backup-restore-main-section') || document.body;
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
		if (error.message !== 'UNAUTHORIZED') {
			if (appRoot) {
				appRoot.innerHTML = '<div class="shell"><div class="error-box">Không thể tải dữ liệu Backup & Restore: ' + escHtml(error.message) + '</div></div>';
			}
		}
	}
}

async function loadOverview(silent) {
	try {
		const data = await fetchJson(API + '/overview');
		renderOverview(data);
	} catch (error) {
		if (!silent && error.message !== 'UNAUTHORIZED') {
			document.getElementById('jobList').innerHTML = '<div class="error-box">' + escHtml(error.message) + '</div>';
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
		renderJobs(jobs);
		schedulePolling(jobs);

		if (refreshOverviewWhenSettled && !hasRunningJobs(jobs)) {
			await loadOverview(true);
		}
	} catch (error) {
		if (!silent && error.message !== 'UNAUTHORIZED') {
			document.getElementById('jobList').innerHTML = '<div class="error-box">' + escHtml(error.message) + '</div>';
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

	currentJobs = jobs;
	currentActiveJob = activeJob;

	document.getElementById('userChip').textContent = auth.screenName
		? ('Đăng nhập: ' + auth.screenName + (auth.fullName ? ' · ' + auth.fullName : ''))
	: 'Không xác định user';

	document.getElementById('scriptChip').textContent = script.available
		? ('Script: ' + script.path)
	: 'Chưa tìm thấy script backup';

	document.getElementById('warningText').textContent = warning.message || 'Hệ thống đang dùng chính sách retention mặc định.';

	document.getElementById('autoBackupValue').textContent = autoBackup.enabled ? 'Đang bật' : 'Chưa bật';
	document.getElementById('autoBackupCopy').innerHTML = autoBackup.enabled
		? 'Cron hiện tại: <code>' + escHtml(autoBackup.cronLine || autoBackup.schedule || '') + '</code>'
	: 'Chưa phát hiện cron backup. Có thể dùng lệnh <code>cron-install</code> để thêm.';

	document.getElementById('scriptValue').textContent = script.available ? 'Sẵn sàng' : 'Thiếu script';
	document.getElementById('scriptCopy').innerHTML = script.available
		? 'Config: <code>' + escHtml(script.configPath || 'Không thấy file .env') + '</code><br>Backup dir: <code>' + escHtml(script.backupDir || '--') + '</code>'
	: 'Có thể cấu hình bằng biến môi trường <code>VEC_BACKUP_SCRIPT_PATH</code>.';

	document.getElementById('backupCountValue').textContent = String(backups.length);
	document.getElementById('backupCountCopy').innerHTML = backups.length
		? 'Bundle dir: <code>' + escHtml(script.bundleDir || '--') + '</code>'
	: 'Chưa có backup nào trong thư mục hiện tại.';

	document.getElementById('helpText').textContent = data.helpText || 'Không lấy được output từ `script.sh help`.';

	renderActionGrid(functions, script.available, hasActiveJob, activeJob);
	renderBackupTable(backups, script.available, hasActiveJob, activeJob);
	renderWatchPanel(jobs, activeJob);
	renderJobs(jobs);
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
		const buttonLabel = item.requiresBackupSelection ? 'Dùng ở bảng backup' : 'Chạy lệnh';
		const lockMessage = hasActiveJob
		? '<span class="badge warn">Đang khóa do job `' + escHtml(activeJob && activeJob.action ? activeJob.action : 'running') + '`</span>'
		: '';

		return '' +
			'<article class="action-card">' +
			'<h3>' + escHtml(item.title) + '</h3>' +
			'<p>' + escHtml(item.description) + '</p>' +
			'<div class="btn-row">' +
			(item.executable
			 ? '<button class="' + (item.key === 'backup' ? 'btn-primary' : 'btn-secondary') + '" ' +
			 (disabled ? 'disabled ' : '') +
			 'data-action="' + escHtml(item.key) + '">' + buttonLabel + '</button>'
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
			'<span class="muted">Sửa cuối: ' + escHtml(item.modifiedAt || '--') + '</span>' +
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
			'<button class="btn-secondary" ' + (!item.hasBundleArchive ? 'disabled ' : '') + 'data-download="bundles" data-index="' + escHtml(backupIndex) + '">Tải bundles</button>' +
			'<button class="btn-secondary" ' + (!item.hasDatabaseArchive ? 'disabled ' : '') + 'data-download="database" data-index="' + escHtml(backupIndex) + '">Tải database</button>' +
			'<button class="btn-primary" ' + (!scriptAvailable || hasActiveJob ? 'disabled ' : '') + 'data-row-action="restore" data-index="' + escHtml(backupIndex) + '">Restore</button>' +
			'<button class="btn-danger" ' + (!scriptAvailable || hasActiveJob ? 'disabled ' : '') + 'data-row-action="delete" data-index="' + escHtml(backupIndex) + '">Xóa</button>' +
			(hasActiveJob ? '<span class="badge warn">Khóa do job `' + escHtml(activeJob && activeJob.action ? activeJob.action : 'running') + '`</span>' : '') +
			'</div>' +
			'</td>' +
			'</tr>';
	}).join('');

	tbody.querySelectorAll('button[data-download]').forEach((button) => {
		button.addEventListener('click', async () => {
			const index = (button.getAttribute('data-index') || '').trim();
			const type = button.getAttribute('data-download');

			if (!index && index !== '0') {
				alert('Không xác định được index backup để tải file.');
				return;
			}

			try {
				button.disabled = true;

				const data = await fetchJson(
					API + '/backups/' + encodeURIComponent(index) +
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
			const index = (button.getAttribute('data-index') || '').trim();

			if (!index && index !== '0') {
				alert('Không xác định được index backup.');
				return;
			}

			runRowAction(action, index);
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

function renderJobs(jobs) {
	const container = document.getElementById('jobList');

	if (!jobs.length) {
		container.innerHTML = '<div class="empty">Chưa có tiến trình nào được ghi nhận.</div>';
		return;
	}

	container.innerHTML = jobs.map((job) => {
		const tone = job.status === 'success'
		? 'ok'
		: (job.status === 'failed' ? 'fail' : 'warn');

		const output = job.output
		? escHtml(job.output)
		: (job.running ? 'Đang chờ output từ tiến trình...' : 'Chưa có output.');

		return '' +
			'<article class="job-card ' + (job.id === selectedWatchJobId ? 'active-watch' : '') + '">' +
			'<header>' +
			'<h4>' + escHtml(job.action || 'unknown') + '</h4>' +
			'<div class="btn-row">' +
			badge(job.status || 'unknown', tone) +
			'<button class="btn-secondary" data-watch-job="' + escHtml(job.id || '') + '">Watch</button>' +
			'</div>' +
			'</header>' +
			'<div class="job-meta">' +
			'<span>ID: <code>' + escHtml(job.id || '') + '</code></span>' +
			'<span>Lệnh: <code>' + escHtml(job.commandLine || '--') + '</code></span>' +
			'<span>Người chạy: <strong>' + escHtml(job.requestedBy || '--') + '</strong></span>' +
			'<span>Tạo: ' + escHtml(job.createdAt || '--') + '</span>' +
			'<span>Bắt đầu: ' + escHtml(job.startedAt || '--') + '</span>' +
			'<span>Kết thúc: ' + escHtml(job.finishedAt || '--') + '</span>' +
			'<span>Cập nhật cuối: ' + escHtml(job.updatedAt || '--') + '</span>' +
			'<span>Exit code: ' + escHtml(job.exitCode >= 0 ? job.exitCode : '--') + '</span>' +
			'</div>' +
			'<pre class="job-output">' + output + '</pre>' +
			'</article>';
	}).join('');

	container.querySelectorAll('button[data-watch-job]').forEach((button) => {
		button.addEventListener('click', () => {
			setSelectedWatchJobId(button.getAttribute('data-watch-job'));
			renderWatchPanel(currentJobs, currentActiveJob);
			renderJobs(currentJobs);
		});
	});
}

async function runAction(action) {
	const confirmed = action === 'backup'
	? window.confirm('Tạo một bản backup mới ngay bây giờ?')
	: true;

	if (!confirmed) {
		return;
	}

	await queueAction(action, {});
}

async function runRowAction(action, index) {
	const confirmed = action === 'restore'
	? window.confirm('Restore backup #' + index + '. Thao tác này sẽ thay thế bundles hiện tại và có thể restore database nếu script đang bật tuỳ chọn đó. Tiếp tục?')
	: window.confirm('Xóa backup #' + index + '? Thao tác này không thể hoàn tác.');

	if (!confirmed) {
		return;
	}

	await queueAction(action, { index: String(index) });
}

async function queueAction(action, payload) {
	try {
		await fetchJson(API + '/actions/' + encodeURIComponent(action), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload || {})
		});
		await loadOverview(true);
		await loadJobs(true, false);
	} catch (error) {
		if (error.status === 409) {
			const activeJob = error.payload && error.payload.activeJob && error.payload.activeJob.id
			? error.payload.activeJob
			: null;

			if (activeJob) {
				setSelectedWatchJobId(activeJob.id);
			}

			await loadOverview(true);
			await loadJobs(true, false);
		}
		alert(error.message);
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
	renderJobs(currentJobs);
});

document.getElementById('btnClearWatch').addEventListener('click', () => {
	setSelectedWatchJobId('');
	renderWatchPanel(currentJobs, currentActiveJob);
	renderJobs(currentJobs);
});

init();
