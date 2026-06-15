package vn.vec.custom.admin.backup;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalThreadLocal;
import com.liferay.portal.kernel.service.UserLocalServiceUtil;
import com.liferay.portal.kernel.util.PortalUtil;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Serializable;

import java.net.URLEncoder;

import java.nio.file.Files;
import java.nio.charset.StandardCharsets;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.Deque;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

@Path("/")
public class BackupAdminResource {

	@GET
	@Path("/auth")
	@Produces(MediaType.APPLICATION_JSON)
	public Response auth(@Context HttpServletRequest request) {
		User user = _getSignedInUser(_getSignedInUserId(request));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Chỉ user admin mới được truy cập màn hình Backup & Restore.");
		}

		JSONObject result = JSONFactoryUtil.createJSONObject();

		result.put("authorized", true);
		result.put("userId", user.getUserId());
		result.put("screenName", user.getScreenName());
		result.put("fullName", user.getFullName());

		return _ok(result);
	}

	@GET
	@Path("/overview")
	@Produces(MediaType.APPLICATION_JSON)
	public Response overview(@Context HttpServletRequest request) {
		User user = _getSignedInUser(_getSignedInUserId(request));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Chỉ user admin mới được truy cập màn hình Backup & Restore.");
		}

		try {
			JSONObject result = JSONFactoryUtil.createJSONObject();
			File scriptFile = _resolveScriptFile();
			Map<String, String> config = _loadConfig(scriptFile);
			JSONObject auth = JSONFactoryUtil.createJSONObject();
			JSONObject autoBackup = _toAutoBackupJson(scriptFile, config);

			auth.put("userId", user.getUserId());
			auth.put("screenName", user.getScreenName());
			auth.put("fullName", user.getFullName());

			result.put("auth", auth);
			result.put("script", _toScriptJson(scriptFile, config));
			result.put("autoBackup", autoBackup);
			result.put("warning", _toWarningJson(config));
			result.put("functions", _toFunctionsJson(autoBackup.getBoolean("enabled")));
			result.put("backups", _toBackupsJson(config));
			result.put("activeJob", _jobStore.toJsonObject(_jobStore.getActiveJob()));
			result.put("hasActiveJob", _jobStore.getActiveJob() != null);
			result.put("jobs", _jobStore.toJsonArray());
			result.put("defaultLogDate", _todayDate());
			result.put("serverTimeZone", TimeZone.getDefault().getID());

			return _ok(result);
		}
		catch (Exception e) {
			_log.error("Error loading backup overview: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@GET
	@Path("/jobs")
	@Produces(MediaType.APPLICATION_JSON)
	public Response jobs(@Context HttpServletRequest request) {
		User user = _getSignedInUser(_getSignedInUserId(request));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Chỉ user admin mới được xem tiến trình backup.");
		}

		JSONObject result = JSONFactoryUtil.createJSONObject();

		result.put("activeJob", _jobStore.toJsonObject(_jobStore.getActiveJob()));
		result.put("hasActiveJob", _jobStore.getActiveJob() != null);
		result.put("items", _jobStore.toJsonArray());

		return _ok(result);
	}

	@GET
	@Path("/logs")
	@Produces(MediaType.APPLICATION_JSON)
	public Response logs(
		@Context HttpServletRequest request, @QueryParam("date") String date) {

		User user = _getSignedInUser(_getSignedInUserId(request));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Chỉ user admin mới được xem log backup.");
		}

		try {
			File scriptFile = _resolveScriptFile();
			Map<String, String> config = _loadConfig(scriptFile);
			String resolvedDate = _normalizeLogDate(date);
			File logFile = _resolveDailyLogFile(
				config, scriptFile, resolvedDate,
				_resolveActionLogBaseName(config), "actions.log");
			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("date", resolvedDate);
			result.put("timeZone", TimeZone.getDefault().getID());
			result.put("available", logFile.isFile());
			result.put("logFile", logFile.getAbsolutePath());
			result.put("output", _readTextFile(logFile));

			return _ok(result);
		}
		catch (Exception e) {
			_log.error("Error loading backup logs: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@GET
	@Path("/backup-history")
	@Produces(MediaType.APPLICATION_JSON)
	public Response backupHistory(
		@Context HttpServletRequest request, @QueryParam("date") String date) {

		User user = _getSignedInUser(_getSignedInUserId(request));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Chỉ user admin mới được xem lịch sử backup.");
		}

		try {
			File scriptFile = _resolveScriptFile();
			Map<String, String> config = _loadConfig(scriptFile);
			String resolvedDate = _normalizeLogDate(date);
			File historyFile = _resolveDailyLogFile(
				config, scriptFile, resolvedDate,
				_value(
					config, "BACKUP_HISTORY_FILE_BASENAME",
					"backup-history.log"),
				"backup-history.log");
			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("date", resolvedDate);
			result.put("timeZone", TimeZone.getDefault().getID());
			result.put("available", historyFile.isFile());
			result.put("logFile", historyFile.getAbsolutePath());
			result.put("items", _toBackupHistoryJson(historyFile));

			return _ok(result);
		}
		catch (Exception e) {
			_log.error("Error loading backup history: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@GET
	@Path("/restore-history")
	@Produces(MediaType.APPLICATION_JSON)
	public Response restoreHistory(
		@Context HttpServletRequest request, @QueryParam("date") String date) {

		User user = _getSignedInUser(_getSignedInUserId(request));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Chỉ user admin mới được xem lịch sử restore.");
		}

		try {
			File scriptFile = _resolveScriptFile();
			Map<String, String> config = _loadConfig(scriptFile);
			String resolvedDate = _normalizeLogDate(date);
			File historyFile = _resolveDailyLogFile(
				config, scriptFile, resolvedDate,
				_value(
					config, "RESTORE_HISTORY_FILE_BASENAME",
					"restore-history.log"),
				"restore-history.log");
			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("date", resolvedDate);
			result.put("timeZone", TimeZone.getDefault().getID());
			result.put("available", historyFile.isFile());
			result.put("logFile", historyFile.getAbsolutePath());
			result.put("items", _toRestoreHistoryJson(historyFile));

			return _ok(result);
		}
		catch (Exception e) {
			_log.error("Error loading restore history: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@POST
	@Path("/actions/{action}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response runAction(
		@Context HttpServletRequest request, @PathParam("action") String action,
		String body) {

		User user = _getSignedInUser(_getSignedInUserId(request));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Chỉ user admin mới được chạy lệnh backup.");
		}

		if (!_isSupportedAction(action)) {
			return _badRequest("Action không hợp lệ: " + action);
		}

		try {
			File scriptFile = _resolveScriptFile();
			Map<String, String> config = _loadConfig(scriptFile);
			BackupJob activeJob = _jobStore.getActiveJob();

			if (scriptFile == null) {
				return _badRequest(
					"Không tìm thấy script backup. Hãy cấu hình VEC_BACKUP_SCRIPT_PATH hoặc đặt script tại đường dẫn chuẩn trên server.");
			}

			if (activeJob != null) {
				JSONObject conflictResult = JSONFactoryUtil.createJSONObject();

				conflictResult.put(
					"error",
					"Đang có một tiến trình backup/restore chạy nền. Vui lòng chờ tiến trình hiện tại hoàn tất.");
				conflictResult.put("activeJob", activeJob.toJson());

				return _cors(
					Response.status(Response.Status.CONFLICT)
						.type(MediaType.APPLICATION_JSON)
						.entity(conflictResult.toString())
				).build();
			}

			JSONObject payload = _toJson(body);
			List<String> commandArgs = new ArrayList<>();
			String backupName = "";

			commandArgs.add(action);

			if ("restore".equals(action) || "delete".equals(action)) {
				backupName = payload.getString("backupName");

				if (backupName != null && !backupName.trim().isEmpty()) {
					int resolvedIndex = _resolveBackupIndexByName(
						backupName, _getBackupEntries(config));

					commandArgs.add(String.valueOf(resolvedIndex));
				}
				else {
					String index = payload.getString("index");

					if (index == null || index.trim().isEmpty()) {
						return _badRequest(
							"Thiếu tên backup cho action " + action);
					}

					commandArgs.add(index.trim());
				}
			}

			BackupJob job = _jobStore.createJobIfIdle(
				action, commandArgs, scriptFile, user.getScreenName());

			if (job == null) {
				BackupJob latestActiveJob = _jobStore.getActiveJob();
				JSONObject conflictResult = JSONFactoryUtil.createJSONObject();

				conflictResult.put(
					"error",
					"Đang có một tiến trình backup/restore chạy nền. Vui lòng chờ tiến trình hiện tại hoàn tất.");
				conflictResult.put(
					"activeJob", _jobStore.toJsonObject(latestActiveJob));

				return _cors(
					Response.status(Response.Status.CONFLICT)
						.type(MediaType.APPLICATION_JSON)
						.entity(conflictResult.toString())
				).build();
			}

			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("queued", true);
			result.put("job", job.toJson());

			return _cors(
				Response.status(Response.Status.ACCEPTED)
					.type(MediaType.APPLICATION_JSON)
					.entity(result.toString())
			).build();
		}
		catch (IllegalArgumentException e) {
			return _badRequest(e.getMessage());
		}
		catch (Exception e) {
			_log.error("Error queueing backup action: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@GET
	@Path("/backups/{backupName}/download")
	@Produces(MediaType.APPLICATION_OCTET_STREAM)
	public Response downloadBackup(
		@Context HttpServletRequest request,
		@PathParam("backupName") String backupName,
		@QueryParam("type") String type, @QueryParam("token") String token) {

		try {
			DownloadGrant downloadGrant = null;

			if (token != null && !token.trim().isEmpty()) {
				downloadGrant = _downloadTokenStore.consume(
					token.trim(), backupName, type);

				if (downloadGrant == null) {
					return _forbidden("Token tải file không hợp lệ hoặc đã hết hạn.");
				}
			}
			else {
				User user = _getSignedInUser(_getSignedInUserId(request));

				if (user == null) {
					return _unauthorized();
				}

				if (!_isAdminUser(user)) {
					return _forbidden("Chỉ user admin mới được tải backup.");
				}

				downloadGrant = _buildDownloadGrant(backupName, type);
			}

			File downloadFile = downloadGrant.file;

			if (downloadFile == null || !downloadFile.isFile()) {
				return _notFound(
					"Backup này không có file " + downloadGrant.type + " để tải.");
			}

			final File finalFile = downloadFile;
			StreamingOutput stream = new StreamingOutput() {

				@Override
				public void write(OutputStream outputStream) {
					byte[] buffer = new byte[8192];
					int length;

					try (InputStream inputStream = new FileInputStream(finalFile)) {
						while ((length = inputStream.read(buffer)) != -1) {
							outputStream.write(buffer, 0, length);
						}
					}
					catch (Exception e) {
						throw new RuntimeException(e);
					}
				}

			};

			return _cors(
				Response.ok(stream, MediaType.APPLICATION_OCTET_STREAM)
					.header(
						"Content-Disposition",
						"attachment; filename=\"" + finalFile.getName() + "\"")
					.header("Content-Length", String.valueOf(finalFile.length()))
			).build();
		}
		catch (IllegalArgumentException e) {
			return _badRequest(e.getMessage());
		}
		catch (Exception e) {
			_log.error("Error downloading backup file: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@POST
	@Path("/backups/{backupName}/download-token")
	@Produces(MediaType.APPLICATION_JSON)
	public Response createDownloadToken(
		@Context HttpServletRequest request,
		@PathParam("backupName") String backupName,
		@QueryParam("type") String type) {

		User user = _getSignedInUser(_getSignedInUserId(request));

		if (user == null) {
			return _unauthorized();
		}

		if (!_isAdminUser(user)) {
			return _forbidden("Chỉ user admin mới được tải backup.");
		}

		try {
			DownloadGrant downloadGrant = _buildDownloadGrant(backupName, type);
			String token = _downloadTokenStore.create(downloadGrant);
			JSONObject result = JSONFactoryUtil.createJSONObject();
			String encodedBackupName = _encodePathSegment(backupName);

			result.put("token", token);
			result.put(
				"downloadUrl",
				"/o/vec-backup-admin/backups/" + encodedBackupName +
					"/download?type=" + downloadGrant.type + "&token=" + token);
			result.put(
				"expiresAt",
				_formatDate(downloadGrant.expiresAt));
			result.put("fileName", downloadGrant.file.getName());

			return _ok(result);
		}
		catch (IllegalArgumentException e) {
			return _badRequest(e.getMessage());
		}
		catch (Exception e) {
			_log.error("Error creating download token: " + e.getMessage(), e);

			return _serverError();
		}
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response options() {
		return _cors(Response.ok()).build();
	}

	private JSONObject _toScriptJson(
		File scriptFile, Map<String, String> config) {

		JSONObject result = JSONFactoryUtil.createJSONObject();
		File configFile = _resolveConfigFile(scriptFile);

		result.put("available", scriptFile != null && scriptFile.isFile());
		result.put("path", scriptFile == null ? "" : scriptFile.getAbsolutePath());
		result.put(
			"configPath", configFile == null ? "" : configFile.getAbsolutePath());
		result.put("configLoaded", !config.isEmpty());
		result.put("backupDir", _value(config, "BACKUP_DIR"));
		result.put("bundleDir", _value(config, "BUNDLE_DIR"));

		return result;
	}

	private JSONObject _toAutoBackupJson(
		File scriptFile, Map<String, String> config) {

		JSONObject result = JSONFactoryUtil.createJSONObject();
		String schedule = _value(config, "CRON_SCHEDULE", "30 0 * * *");
		String cronLine = "";
		boolean enabled = false;

		try {
			CommandResult commandResult = _runSystemCommand(
				new String[] {"/bin/bash", "-lc", "crontab -l 2>/dev/null || true"},
				15);
			String scriptPath = scriptFile == null ? "" : scriptFile.getAbsolutePath();
			String[] lines = commandResult.output.split("\\r?\\n");

			for (String line : lines) {
				String trimmed = line.trim();

				if (_isAutoBackupCronLine(trimmed, scriptPath, schedule)) {
					enabled = true;
					cronLine = trimmed;
					break;
				}
			}
		}
		catch (Exception e) {
			_log.warn("Cannot inspect crontab: " + e.getMessage());
		}

		result.put("enabled", enabled);
		result.put("schedule", schedule);
		result.put("cronLine", cronLine);
		result.put(
			"toggleAction", enabled ? "cron-uninstall" : "cron-install");
		result.put(
			"toggleLabel", enabled ? "Tắt auto backup" : "Bật auto backup");
		result.put(
			"toggleDescription",
			enabled
				? "Gỡ cron job backup tự động đang tồn tại."
				: "Thêm cron job chạy backup tự động nếu chưa tồn tại.");

		return result;
	}

	private JSONObject _toWarningJson(Map<String, String> config) {
		JSONObject result = JSONFactoryUtil.createJSONObject();
		String retention = _value(config, "BACKUP_RETENTION_COUNT", "3");

		result.put("retentionCount", retention);
		result.put(
			"message",
			"Hệ thống chỉ giữ tối đa " + retention +
				" bản backup gần nhất. Backup cũ hơn sẽ bị xóa tự động khi tạo bản mới.");

		return result;
	}

	private JSONArray _toFunctionsJson(boolean autoBackupEnabled) {
		JSONArray items = JSONFactoryUtil.createJSONArray();

		items.put(
			_toFunction(
				"health", "Kiểm tra hệ thống",
				"Kiểm tra dung lượng ổ đĩa backup và kết nối MySQL.",
				true, false));
		items.put(
			_toFunction(
				"backup", "Tạo backup mới",
				"Tạo một bản backup mới gồm bundles và database.",
				true, false));
		items.put(
			_toFunction(
				"backup-database", "Chỉ backup database",
				"Tạo một bản backup mới chỉ chứa database, vẫn giữ nguyên cấu trúc thư mục backup.",
				true, false));
		items.put(
			_toFunction(
				"backup-bundles", "Chỉ backup bundles",
				"Tạo một bản backup mới chỉ chứa bundles, vẫn giữ nguyên cấu trúc thư mục backup.",
				true, false));
		items.put(
			_toFunction(
				autoBackupEnabled ? "cron-uninstall" : "cron-install",
				autoBackupEnabled ? "Tắt auto backup" : "Bật auto backup",
				autoBackupEnabled
					? "Gỡ cron job backup tự động đang tồn tại."
					: "Thêm cron job chạy backup tự động nếu chưa tồn tại.",
				true, false));

		return items;
	}

	private JSONObject _toFunction(
		String key, String title, String description, boolean executable,
		boolean requiresBackupSelection) {

		JSONObject item = JSONFactoryUtil.createJSONObject();

		item.put("key", key);
		item.put("title", title);
		item.put("description", description);
		item.put("executable", executable);
		item.put("requiresBackupSelection", requiresBackupSelection);

		return item;
	}

	private JSONArray _toBackupsJson(Map<String, String> config) {
		JSONArray items = JSONFactoryUtil.createJSONArray();

		for (BackupEntry entry : _getBackupEntries(config)) {
			items.put(entry.toJson());
		}

		return items;
	}

	private List<BackupEntry> _getBackupEntries(Map<String, String> config) {
		String backupDirPath = _value(config, "BACKUP_DIR");

		if (backupDirPath.isEmpty()) {
			return Collections.emptyList();
		}

		File backupDir = new File(backupDirPath);

		if (!backupDir.isDirectory()) {
			return Collections.emptyList();
		}

		File[] files = backupDir.listFiles();

		if (files == null || files.length == 0) {
			return Collections.emptyList();
		}

		List<File> candidates = new ArrayList<>();

		for (File file : files) {
			String name = file.getName();

			if ((file.isDirectory() && name.startsWith("liferay_backup_")) ||
				(file.isFile() && name.startsWith("liferay_full_backup_") &&
					name.endsWith(".tar.gz"))) {

				candidates.add(file);
			}
		}

		Collections.sort(
			candidates,
			new Comparator<File>() {

				@Override
				public int compare(File left, File right) {
					return Long.compare(right.lastModified(), left.lastModified());
				}

			});

		List<BackupEntry> entries = new ArrayList<>();

		for (int i = 0; i < candidates.size(); i++) {
			entries.add(_toBackupEntry(i, candidates.get(i)));
		}

		return entries;
	}

	private DownloadGrant _buildDownloadGrant(
		String backupName, String type) {

		Map<String, String> config = _loadConfig(_resolveScriptFile());
		List<BackupEntry> entries = _getBackupEntries(config);
		int index = _resolveBackupIndexByName(backupName, entries);
		BackupEntry entry = entries.get(index);

		String safeType = _normalizeDownloadType(type);
		File downloadFile;

		if ("bundles".equals(safeType)) {
			downloadFile = entry.bundleArchive;
		}
		else {
			downloadFile = entry.databaseArchive;
		}

		if (downloadFile == null || !downloadFile.isFile()) {
			throw new IllegalArgumentException(
				"Backup này không có file " + safeType + " để tải.");
		}

		DownloadGrant downloadGrant = new DownloadGrant();

		downloadGrant.backupName = entry.name;
		downloadGrant.type = safeType;
		downloadGrant.file = downloadFile;
		downloadGrant.expiresAt =
			System.currentTimeMillis() + _DOWNLOAD_TOKEN_TTL_MS;

		return downloadGrant;
	}

	private String _normalizeDownloadType(String type) {
		String safeType = type == null ? "" : type.trim().toLowerCase(Locale.ROOT);

		if ("bundles".equals(safeType)) {
			return safeType;
		}

		if ("database".equals(safeType) || "db".equals(safeType)) {
			return "database";
		}

		throw new IllegalArgumentException("type phải là bundles hoặc database");
	}

	private BackupEntry _toBackupEntry(int index, File file) {
		BackupEntry entry = new BackupEntry();
		String manifestCreatedAt = _readManifestValue(file, "created_at");
		String manifestCreatedAtLocal = _readManifestValue(
			file, "created_at_local");
		String manifestCompletedAtLocal = _readManifestValue(
			file, "completed_at_local");
		String fallbackCreatedAt = _formatBackupNameTimestamp(file.getName());

		entry.index = index;
		entry.name = file.getName();
		entry.path = file.getAbsolutePath();
		entry.modifiedTime = file.lastModified();
		entry.directory = file.isDirectory();
		entry.totalSizeBytes = _calculateSize(file);
		entry.totalSizeLabel = _humanSize(entry.totalSizeBytes);
		entry.bundleArchive = _findArchive(file, "bundles_backup_", ".tar.gz");
		entry.databaseArchive = _findArchive(file, "sql_backup_", ".tar.gz");
		entry.bundleSizeBytes = entry.bundleArchive == null ? 0 : entry.bundleArchive.length();
		entry.bundleSizeLabel = _humanSize(entry.bundleSizeBytes);
		entry.databaseSizeBytes = entry.databaseArchive == null ? 0 : entry.databaseArchive.length();
		entry.databaseSizeLabel = _humanSize(entry.databaseSizeBytes);
		entry.createdAt = _firstNonBlank(
			manifestCreatedAtLocal, _formatCompactTimestamp(manifestCreatedAt),
			fallbackCreatedAt, _formatDate(file.lastModified()));
		entry.modifiedLabel = _firstNonBlank(
			manifestCompletedAtLocal, entry.createdAt, _formatDate(file.lastModified()));

		return entry;
	}

	private File _findArchive(File backupRoot, String prefix, String suffix) {
		if (backupRoot == null || !backupRoot.exists()) {
			return null;
		}

		if (backupRoot.isFile()) {
			return null;
		}

		File[] files = backupRoot.listFiles();

		if (files == null) {
			return null;
		}

		for (File file : files) {
			String name = file.getName();

			if (file.isFile() && name.startsWith(prefix) && name.endsWith(suffix)) {
				return file;
			}
		}

		return null;
	}

	private String _readManifestValue(File backupRoot, String key) {
		if (backupRoot == null || !backupRoot.isDirectory()) {
			return "";
		}

		File[] files = backupRoot.listFiles();

		if (files == null) {
			return "";
		}

		for (File file : files) {
			if (!file.isFile() || !file.getName().startsWith("manifest_")) {
				continue;
			}

			try (BufferedReader reader = new BufferedReader(
					new InputStreamReader(
						new FileInputStream(file), StandardCharsets.UTF_8))) {

				String line;

				while ((line = reader.readLine()) != null) {
					if (line.startsWith(key + "=")) {
						return line.substring((key + "=").length()).trim();
					}
				}
			}
			catch (Exception e) {
				_log.warn("Cannot read manifest " + file.getAbsolutePath(), e);
			}
		}

		return "";
	}

	private long _calculateSize(File file) {
		if (file == null || !file.exists()) {
			return 0;
		}

		if (file.isFile()) {
			return file.length();
		}

		long total = 0;
		File[] children = file.listFiles();

		if (children == null) {
			return 0;
		}

		for (File child : children) {
			total += _calculateSize(child);
		}

		return total;
	}

	private JSONObject _toJson(String body) {
		if (body == null || body.trim().isEmpty()) {
			return JSONFactoryUtil.createJSONObject();
		}

		try {
			return JSONFactoryUtil.createJSONObject(body);
		}
		catch (Exception e) {
			_log.warn("Cannot parse request body as JSON: " + e.getMessage());

			return JSONFactoryUtil.createJSONObject();
		}
	}

	private boolean _isSupportedAction(String action) {
		return "health".equals(action) || "backup".equals(action) ||
			"backup-database".equals(action) ||
			"backup-bundles".equals(action) ||
			"restore".equals(action) || "delete".equals(action) ||
			"cron-install".equals(action) ||
			"cron-uninstall".equals(action);
	}

	private File _resolveScriptFile() {
		List<String> candidates = new ArrayList<>();

		_addIfPresent(candidates, System.getProperty("vec.backup.script.path"));
		_addIfPresent(candidates, System.getenv("VEC_BACKUP_SCRIPT_PATH"));
		candidates.add("/opt/vec-backup/script.sh");
		candidates.add("/root/vec/auto-backup/script.sh");
		candidates.add("/root/vec-liferay-fragments/auto-backup/script.sh");
		candidates.add("/opt/liferay/auto-backup/script.sh");
		candidates.add("/root/auto-backup/script.sh");

		for (String candidate : candidates) {
			File file = new File(candidate);

			if (file.isFile()) {
				return file;
			}
		}

		return null;
	}

	private void _addIfPresent(List<String> values, String value) {
		if (value != null && !value.trim().isEmpty()) {
			values.add(value.trim());
		}
	}

	private File _resolveConfigFile(File scriptFile) {
		if (scriptFile == null) {
			return null;
		}

		File parent = scriptFile.getParentFile();

		if (parent == null) {
			return null;
		}

		File configFile = new File(parent, ".env");

		if (configFile.isFile()) {
			return configFile;
		}

		return null;
	}

	private Map<String, String> _loadConfig(File scriptFile) {
		File configFile = _resolveConfigFile(scriptFile);

		if (configFile == null) {
			return Collections.emptyMap();
		}

		Map<String, String> values = new LinkedHashMap<>();

		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(
					new FileInputStream(configFile), StandardCharsets.UTF_8))) {

			String line;

			while ((line = reader.readLine()) != null) {
				String trimmed = line.trim();

				if (trimmed.isEmpty() || trimmed.startsWith("#")) {
					continue;
				}

				int separatorIndex = trimmed.indexOf('=');

				if (separatorIndex <= 0) {
					continue;
				}

				String key = trimmed.substring(0, separatorIndex).trim();
				String value = trimmed.substring(separatorIndex + 1).trim();

				values.put(key, _stripQuotes(value));
			}
		}
		catch (Exception e) {
			_log.warn("Cannot read backup config: " + configFile.getAbsolutePath(), e);
		}

		return values;
	}

	private String _stripQuotes(String value) {
		if (value == null) {
			return "";
		}

		String trimmed = value.trim();

		if (trimmed.length() >= 2 &&
			((trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
				(trimmed.startsWith("'") && trimmed.endsWith("'")))) {

			return trimmed.substring(1, trimmed.length() - 1);
		}

		return trimmed;
	}

	private String _value(Map<String, String> values, String key) {
		return _value(values, key, "");
	}

	private String _value(
		Map<String, String> values, String key, String defaultValue) {

		String value = values.get(key);

		if (value == null || value.trim().isEmpty()) {
			return defaultValue;
		}

		return value.trim();
	}

	private int _resolveBackupIndexByName(
		String backupName, List<BackupEntry> entries) {

		String safeBackupName = backupName == null ? "" : backupName.trim();

		if (safeBackupName.isEmpty()) {
			throw new IllegalArgumentException("Thiếu tên backup.");
		}

		for (int i = 0; i < entries.size(); i++) {
			BackupEntry entry = entries.get(i);

			if (entry != null && safeBackupName.equals(entry.name)) {
				return i;
			}
		}

		throw new IllegalArgumentException(
			"Không tìm thấy backup với tên " + safeBackupName);
	}

	private boolean _isAutoBackupCronLine(
		String line, String scriptPath, String schedule) {

		if (line == null || line.isEmpty()) {
			return false;
		}

		if (line.contains("# vec-liferay-auto-backup")) {
			return true;
		}

		if (!scriptPath.isEmpty() && line.contains(scriptPath + " backup")) {
			return true;
		}

		if (line.contains("script.sh backup")) {
			return true;
		}

		return line.contains(schedule) && line.contains(" backup");
	}

	private String _todayDate() {
		SimpleDateFormat dateFormat = new SimpleDateFormat(
			"yyyy-MM-dd", Locale.US);

		dateFormat.setTimeZone(TimeZone.getDefault());

		return dateFormat.format(new Date());
	}

	private String _normalizeLogDate(String date) throws ParseException {
		SimpleDateFormat dateFormat = new SimpleDateFormat(
			"yyyy-MM-dd", Locale.US);

		dateFormat.setLenient(false);
		dateFormat.setTimeZone(TimeZone.getDefault());

		if (date == null || date.trim().isEmpty()) {
			return _todayDate();
		}

		Date parsed = dateFormat.parse(date.trim());

		return dateFormat.format(parsed);
	}

	private File _resolveLogDir(File scriptFile, Map<String, String> config) {
		String explicitLogDir = _value(config, "LOG_DIR");

		if (!explicitLogDir.isEmpty()) {
			return new File(explicitLogDir);
		}

		String legacyLogFile = _value(config, "LOG_FILE");

		if (!legacyLogFile.isEmpty()) {
			File legacyFile = new File(legacyLogFile);
			File parent = legacyFile.getParentFile();

			if (parent != null) {
				return parent;
			}
		}

		File baseDir = scriptFile == null ? null : scriptFile.getParentFile();

		if (baseDir == null) {
			baseDir = new File(".");
		}

		return new File(baseDir, "logs");
	}

	private String _resolveActionLogBaseName(Map<String, String> config) {
		String logBaseName = _value(config, "LOG_FILE_BASENAME");

		if (!logBaseName.isEmpty()) {
			return logBaseName;
		}

		String legacyLogFile = _value(config, "LOG_FILE");

		if (!legacyLogFile.isEmpty()) {
			return new File(legacyLogFile).getName();
		}

		return "actions.log";
	}

	private File _resolveDailyLogFile(
		Map<String, String> config, File scriptFile, String date,
		String baseName, String defaultBaseName) {

		File logDir = _resolveLogDir(scriptFile, config);
		String safeBaseName = baseName == null || baseName.trim().isEmpty() ?
			defaultBaseName : baseName.trim();

		return new File(new File(logDir, date), safeBaseName);
	}

	private String _readTextFile(File file) {
		if (file == null || !file.isFile()) {
			return "";
		}

		try {
			return new String(
				Files.readAllBytes(file.toPath()), StandardCharsets.UTF_8);
		}
		catch (Exception e) {
			_log.warn("Cannot read file " + file.getAbsolutePath(), e);

			return "";
		}
	}

	private JSONArray _toRestoreHistoryJson(File historyFile) {
		JSONArray items = JSONFactoryUtil.createJSONArray();

		if (historyFile == null || !historyFile.isFile()) {
			return items;
		}

		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(
					new FileInputStream(historyFile), StandardCharsets.UTF_8))) {

			List<JSONObject> rows = new ArrayList<>();
			String line;

			while ((line = reader.readLine()) != null) {
				JSONObject row = _parseRestoreHistoryLine(line);

				if (!row.getString("backupName").isEmpty() ||
					!row.getString("startedAt").isEmpty()) {

					rows.add(0, row);
				}
			}

			for (JSONObject row : rows) {
				items.put(row);
			}
		}
		catch (Exception e) {
			_log.warn(
				"Cannot read restore history " + historyFile.getAbsolutePath(), e);
		}

		return items;
	}

	private JSONArray _toBackupHistoryJson(File historyFile) {
		JSONArray items = JSONFactoryUtil.createJSONArray();

		if (historyFile == null || !historyFile.isFile()) {
			return items;
		}

		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(
					new FileInputStream(historyFile), StandardCharsets.UTF_8))) {

			List<JSONObject> rows = new ArrayList<>();
			String line;

			while ((line = reader.readLine()) != null) {
				JSONObject row = _parseBackupHistoryLine(line);

				if (!row.getString("backupName").isEmpty() ||
					!row.getString("startedAt").isEmpty()) {

					rows.add(0, row);
				}
			}

			for (JSONObject row : rows) {
				items.put(row);
			}
		}
		catch (Exception e) {
			_log.warn(
				"Cannot read backup history " + historyFile.getAbsolutePath(), e);
		}

		return items;
	}

	private JSONObject _parseBackupHistoryLine(String line) {
		JSONObject item = JSONFactoryUtil.createJSONObject();

		if (line == null || line.trim().isEmpty()) {
			return item;
		}

		String[] parts = line.split("\\|");

		for (String part : parts) {
			int separatorIndex = part.indexOf('=');

			if (separatorIndex <= 0) {
				continue;
			}

			String key = part.substring(0, separatorIndex).trim();
			String value = part.substring(separatorIndex + 1).trim();

			if ("started_at".equals(key)) {
				item.put("startedAt", value);
			}
			else if ("finished_at".equals(key)) {
				item.put("finishedAt", value);
			}
			else if ("backup_name".equals(key)) {
				item.put("backupName", value);
			}
			else if ("backup_mode".equals(key)) {
				item.put("backupMode", value);
			}
			else if ("status".equals(key)) {
				item.put("status", value);
			}
			else if ("bundle_archive".equals(key)) {
				item.put("bundleArchive", value);
			}
			else if ("sql_archive".equals(key)) {
				item.put("sqlArchive", value);
			}
			else if ("total_size_bytes".equals(key)) {
				item.put("totalSizeBytes", value);
				item.put("totalSizeLabel", _humanSize(_parseLong(value)));
			}
			else if ("log_file".equals(key)) {
				item.put("logFile", value);
			}
		}

		return item;
	}

	private JSONObject _parseRestoreHistoryLine(String line) {
		JSONObject item = JSONFactoryUtil.createJSONObject();

		if (line == null || line.trim().isEmpty()) {
			return item;
		}

		String[] parts = line.split("\\|");

		for (String part : parts) {
			int separatorIndex = part.indexOf('=');

			if (separatorIndex <= 0) {
				continue;
			}

			String key = part.substring(0, separatorIndex).trim();
			String value = part.substring(separatorIndex + 1).trim();

			if ("started_at".equals(key)) {
				item.put("startedAt", value);
			}
			else if ("finished_at".equals(key)) {
				item.put("finishedAt", value);
			}
			else if ("backup_name".equals(key)) {
				item.put("backupName", value);
			}
			else if ("restore_mode".equals(key)) {
				item.put("restoreMode", value);
			}
			else if ("status".equals(key)) {
				item.put("status", value);
			}
			else if ("log_file".equals(key)) {
				item.put("logFile", value);
			}
		}

		return item;
	}

	private String _formatBackupNameTimestamp(String backupName) {
		if (backupName == null) {
			return "";
		}

		String normalizedName = backupName;

		if (normalizedName.endsWith(".tar.gz")) {
			normalizedName = normalizedName.substring(
				0, normalizedName.length() - ".tar.gz".length());
		}

		int separatorIndex = normalizedName.lastIndexOf("backup_");

		if (separatorIndex < 0) {
			return "";
		}

		return _formatCompactTimestamp(
			normalizedName.substring(separatorIndex + "backup_".length()));
	}

	private String _formatCompactTimestamp(String value) {
		if (value == null || value.trim().isEmpty()) {
			return "";
		}

		SimpleDateFormat inputFormat = new SimpleDateFormat(
			"yyyyMMdd_HHmmss", Locale.US);
		SimpleDateFormat outputFormat = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss", Locale.US);

		inputFormat.setLenient(false);
		inputFormat.setTimeZone(TimeZone.getDefault());
		outputFormat.setTimeZone(TimeZone.getDefault());

		try {
			Date parsed = inputFormat.parse(value.trim());

			return outputFormat.format(parsed);
		}
		catch (ParseException e) {
			return "";
		}
	}

	private String _firstNonBlank(String... values) {
		if (values == null) {
			return "";
		}

		for (String value : values) {
			if (value != null && !value.trim().isEmpty()) {
				return value.trim();
			}
		}

		return "";
	}

	private String _encodePathSegment(String value) throws Exception {
		return URLEncoder.encode(
			value == null ? "" : value, StandardCharsets.UTF_8.name()
		).replace("+", "%20");
	}

	private static CommandResult _runScriptCommand(
			File scriptFile, List<String> args, int timeoutSeconds)
		throws Exception {

		List<String> command = _buildScriptCommand(scriptFile, args);

		return _runSystemCommand(command.toArray(new String[0]), timeoutSeconds);
	}

	private static int _runScriptCommandStreaming(
			File scriptFile, List<String> args, BackupJob job)
		throws Exception {

		List<String> command = _buildScriptCommand(scriptFile, args);
		ProcessBuilder processBuilder = new ProcessBuilder(command);

		processBuilder.redirectErrorStream(true);

		Process process = processBuilder.start();

		job.appendOutput("$ " + _joinCommand(command) + "\n\n");

		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(
					process.getInputStream(), StandardCharsets.UTF_8))) {

			String line;

			while ((line = reader.readLine()) != null) {
				job.appendOutput(line + "\n");
			}
		}

		return process.waitFor();
	}

	private static List<String> _buildScriptCommand(
		File scriptFile, List<String> args) {

		List<String> command = new ArrayList<>();

		command.add("/bin/bash");
		command.add(scriptFile.getAbsolutePath());
		command.addAll(args);

		return command;
	}

	private static CommandResult _runSystemCommand(
			String[] command, int timeoutSeconds)
		throws Exception {

		ProcessBuilder processBuilder = new ProcessBuilder(command);

		processBuilder.redirectErrorStream(true);

		Process process = processBuilder.start();
		StringBuilder output = new StringBuilder();

		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(
					process.getInputStream(), StandardCharsets.UTF_8))) {

			String line;

			while ((line = reader.readLine()) != null) {
				output.append(line).append('\n');
			}
		}

		boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);

		if (!finished) {
			process.destroyForcibly();
			throw new RuntimeException("Command timeout after " + timeoutSeconds + "s");
		}

		CommandResult result = new CommandResult();

		result.exitCode = process.exitValue();
		result.output = output.toString();

		return result;
	}

	private String _formatDate(long time) {
		if (time <= 0) {
			return "";
		}

		SimpleDateFormat dateFormat = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss", Locale.US);

		dateFormat.setTimeZone(TimeZone.getDefault());

		return dateFormat.format(new Date(time));
	}

	private long _parseLong(String value) {
		if (value == null || value.trim().isEmpty()) {
			return 0;
		}

		try {
			return Long.parseLong(value.trim());
		}
		catch (NumberFormatException numberFormatException) {
			return 0;
		}
	}

	private String _humanSize(long bytes) {
		if (bytes <= 0) {
			return "0 B";
		}

		String[] units = {"B", "KB", "MB", "GB", "TB"};
		double size = bytes;
		int unitIndex = 0;

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		return String.format(Locale.US, "%.2f %s", size, units[unitIndex]);
	}

	private long _getSignedInUserId(HttpServletRequest request) {
		try {
			if (_isLocalDevReferer(request)) {
				return _DEV_USER_ID;
			}

			User requestUser = null;

			if (request != null) {
				requestUser = PortalUtil.getUser(request);
			}

			if (requestUser != null && !requestUser.isGuestUser()) {
				return requestUser.getUserId();
			}

			if (request != null) {
				String remoteUser = request.getRemoteUser();

				if (remoteUser != null && !remoteUser.trim().isEmpty()) {
					long remoteUserId = Long.parseLong(remoteUser.trim());
					User remoteUserValue = UserLocalServiceUtil.fetchUser(remoteUserId);

					if (remoteUserValue != null && !remoteUserValue.isGuestUser()) {
						return remoteUserId;
					}
				}
			}

			String name = PrincipalThreadLocal.getName();

			if (name == null || name.trim().isEmpty()) {
				return 0;
			}

			long userId = Long.parseLong(name);
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null || user.isGuestUser()) {
				return 0;
			}

			return userId;
		}
		catch (Exception e) {
			return 0;
		}
	}

	private User _getSignedInUser(long userId) {
		if (userId <= 0) {
			return null;
		}

		try {
			User user = UserLocalServiceUtil.fetchUser(userId);

			if (user == null || user.isGuestUser()) {
				return null;
			}

			return user;
		}
		catch (Exception e) {
			return null;
		}
	}

	private boolean _isAdminUser(User user) {
		return user != null && "admin".equals(user.getScreenName());
	}

	private boolean _isLocalDevReferer(HttpServletRequest request) {
		if (request == null) {
			return false;
		}

		String referer = request.getHeader("Referer");

		return referer != null &&
			(referer.equals("http://localhost:3000") ||
				referer.startsWith("http://localhost:3000/"));
	}

	private Response _ok(JSONObject jsonObject) {
		return _cors(
			Response.ok(jsonObject.toString(), MediaType.APPLICATION_JSON)
		).build();
	}

	private Response _badRequest(String message) {
		return _cors(
			Response.status(Response.Status.BAD_REQUEST)
				.type(MediaType.APPLICATION_JSON)
				.entity("{\"error\":\"" + _escapeJson(message) + "\"}")
		).build();
	}

	private Response _notFound(String message) {
		return _cors(
			Response.status(Response.Status.NOT_FOUND)
				.type(MediaType.APPLICATION_JSON)
				.entity("{\"error\":\"" + _escapeJson(message) + "\"}")
		).build();
	}

	private Response _forbidden(String message) {
		return _cors(
			Response.status(Response.Status.FORBIDDEN)
				.type(MediaType.APPLICATION_JSON)
				.entity("{\"error\":\"" + _escapeJson(message) + "\"}")
		).build();
	}

	private Response _serverError() {
		return _cors(
			Response.serverError()
				.type(MediaType.APPLICATION_JSON)
				.entity(
					"{\"error\":\"Máy chủ đang gặp lỗi. Vui lòng thử lại sau.\"}")
		).build();
	}

	private Response _unauthorized() {
		return _cors(
			Response.status(Response.Status.UNAUTHORIZED)
				.type(MediaType.APPLICATION_JSON)
				.entity(
					"{\"error\":\"Bạn cần đăng nhập để sử dụng chức năng này.\"}")
		).build();
	}

	private String _escapeJson(String value) {
		if (value == null) {
			return "";
		}

		return value.replace("\\", "\\\\").replace("\"", "\\\"");
	}

	private Response.ResponseBuilder _cors(Response.ResponseBuilder builder) {
		return builder
			.header("Access-Control-Allow-Origin", "*")
			.header(
				"Access-Control-Allow-Headers",
				"Content-Type, x-csrf-token, X-Requested-With")
			.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			.header("Access-Control-Allow-Credentials", "true");
	}

	private static class BackupEntry implements Serializable {

		public JSONObject toJson() {
			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("index", index);
			result.put("backupName", name);
			result.put("name", name);
			result.put("path", path);
			result.put("directory", directory);
			result.put("createdAt", createdAt);
			result.put("modifiedAt", modifiedLabel);
			result.put("totalSizeBytes", totalSizeBytes);
			result.put("totalSizeLabel", totalSizeLabel);
			result.put("bundleSizeBytes", bundleSizeBytes);
			result.put("bundleSizeLabel", bundleSizeLabel);
			result.put("databaseSizeBytes", databaseSizeBytes);
			result.put("databaseSizeLabel", databaseSizeLabel);
			result.put(
				"hasBundleArchive",
				bundleArchive != null && bundleArchive.isFile());
			result.put(
				"hasDatabaseArchive",
				databaseArchive != null && databaseArchive.isFile());

			return result;
		}

		private static final long serialVersionUID = 1L;

		private File bundleArchive;
		private long bundleSizeBytes;
		private String bundleSizeLabel = "0 B";
		private String createdAt = "";
		private File databaseArchive;
		private long databaseSizeBytes;
		private String databaseSizeLabel = "0 B";
		private boolean directory;
		private int index;
		private String modifiedLabel = "";
		private long modifiedTime;
		private String name = "";
		private String path = "";
		private long totalSizeBytes;
		private String totalSizeLabel = "0 B";

	}

	private static class CommandResult {

		private int exitCode;
		private String output = "";

	}

	private static class DownloadGrant {

		private String backupName = "";
		private long expiresAt;
		private File file;
		private String type = "";

	}

	private static class BackupJob {

		public JSONObject toJson() {
			JSONObject result = JSONFactoryUtil.createJSONObject();

			result.put("id", id);
			result.put("action", action);
			result.put("status", status);
			result.put("requestedBy", requestedBy);
			result.put("commandLine", commandLine);
			result.put("createdAt", _formatStaticDate(createdAt));
			result.put("startedAt", _formatStaticDate(startedAt));
			result.put("finishedAt", _formatStaticDate(finishedAt));
			result.put("updatedAt", _formatStaticDate(updatedAt));
			result.put("exitCode", exitCode);
			result.put("output", getOutput());
			result.put("running", isRunning());

			JSONArray args = JSONFactoryUtil.createJSONArray();

			for (String argument : arguments) {
				args.put(argument);
			}

			result.put("arguments", args);

			return result;
		}

		public synchronized void appendOutput(String text) {
			if (text == null || text.isEmpty()) {
				return;
			}

			outputBuffer.append(text);

			if (outputBuffer.length() > _MAX_JOB_OUTPUT_CHARS) {
				outputBuffer.delete(
					0, outputBuffer.length() - _MAX_JOB_OUTPUT_CHARS);
			}

			updatedAt = System.currentTimeMillis();
		}

		public synchronized String getOutput() {
			return outputBuffer.toString();
		}

		public boolean isRunning() {
			return "queued".equals(status) || "running".equals(status);
		}

		private String action = "";
		private List<String> arguments = Collections.emptyList();
		private String commandLine = "";
		private long createdAt = System.currentTimeMillis();
		private volatile int exitCode = -1;
		private volatile long finishedAt;
		private String id = UUID.randomUUID().toString();
		private final StringBuilder outputBuffer = new StringBuilder();
		private String requestedBy = "";
		private volatile long startedAt;
		private volatile String status = "queued";
		private volatile long updatedAt = createdAt;

	}

	private static class BackupJobStore {

		public BackupJob createJobIfIdle(
			String action, List<String> args, File scriptFile, String requestedBy) {

			BackupJob job = new BackupJob();

			job.action = action;
			job.arguments = new ArrayList<>(args);
			job.commandLine = _joinCommand(_buildScriptCommand(scriptFile, args));
			job.requestedBy = requestedBy;

			synchronized (_lock) {
				if (_getActiveJobUnsafe() != null) {
					return null;
				}

				_jobs.put(job.id, job);
				_jobOrder.addFirst(job.id);

				while (_jobOrder.size() > 20) {
					String jobId = _jobOrder.removeLast();

					_jobs.remove(jobId);
				}
			}

			_executor.submit(
				new Runnable() {

					@Override
					public void run() {
						_runJob(job, scriptFile);
					}

				});

			return job;
		}

		public JSONArray toJsonArray() {
			JSONArray items = JSONFactoryUtil.createJSONArray();

			synchronized (_lock) {
				for (String jobId : _jobOrder) {
					BackupJob job = _jobs.get(jobId);

					if (job != null) {
						items.put(job.toJson());
					}
				}
			}

			return items;
		}

		public BackupJob getActiveJob() {
			synchronized (_lock) {
				return _getActiveJobUnsafe();
			}
		}

		public JSONObject toJsonObject(BackupJob job) {
			if (job == null) {
				return JSONFactoryUtil.createJSONObject();
			}

			return job.toJson();
		}

		private void _runJob(BackupJob job, File scriptFile) {
			job.status = "running";
			job.startedAt = System.currentTimeMillis();
			job.updatedAt = job.startedAt;

			try {
				int exitCode = _runScriptCommandStreaming(
					scriptFile, job.arguments, job);

				job.exitCode = exitCode;
				job.status = exitCode == 0 ? "success" : "failed";
			}
			catch (Exception e) {
				job.exitCode = -1;
				job.appendOutput(
					"\n[ERROR] " +
						(e.getMessage() == null ? "Unknown error" : e.getMessage()) +
						"\n");
				job.status = "failed";
			}
			finally {
				job.finishedAt = System.currentTimeMillis();
				job.updatedAt = job.finishedAt;
			}
		}

		private BackupJob _getActiveJobUnsafe() {
			for (String jobId : _jobOrder) {
				BackupJob job = _jobs.get(jobId);

				if (job != null && job.isRunning()) {
					return job;
				}
			}

			return null;
		}

		private final Object _lock = new Object();
		private final Map<String, BackupJob> _jobs = new ConcurrentHashMap<>();
		private final Deque<String> _jobOrder = new ArrayDeque<>();
		private final ExecutorService _executor = Executors.newSingleThreadExecutor(
			new ThreadFactory() {

				@Override
				public Thread newThread(Runnable runnable) {
					Thread thread = new Thread(runnable, "vec-backup-admin-worker");

					thread.setDaemon(true);

					return thread;
				}

			});

	}

	private static class DownloadTokenStore {

		public String create(DownloadGrant downloadGrant) {
			cleanupExpired();

			String token = UUID.randomUUID().toString().replace("-", "");

			_tokens.put(token, downloadGrant);

			return token;
		}

		public DownloadGrant consume(String token, String backupName, String type) {
			cleanupExpired();

			DownloadGrant downloadGrant = _tokens.remove(token);

			if (downloadGrant == null) {
				return null;
			}

			if (downloadGrant.expiresAt < System.currentTimeMillis()) {
				return null;
			}

			if (!downloadGrant.backupName.equals(backupName)) {
				return null;
			}

			try {
				if (!downloadGrant.type.equals(_normalizeStaticDownloadType(type))) {
					return null;
				}
			}
			catch (Exception e) {
				return null;
			}

			if (downloadGrant.file == null || !downloadGrant.file.isFile()) {
				return null;
			}

			return downloadGrant;
		}

		private void cleanupExpired() {
			long now = System.currentTimeMillis();
			Iterator<Map.Entry<String, DownloadGrant>> iterator =
				_tokens.entrySet().iterator();

			while (iterator.hasNext()) {
				Map.Entry<String, DownloadGrant> entry = iterator.next();
				DownloadGrant downloadGrant = entry.getValue();

				if (downloadGrant == null || downloadGrant.expiresAt < now) {
					iterator.remove();
				}
			}
		}

		private final Map<String, DownloadGrant> _tokens =
			new ConcurrentHashMap<>();

	}

	private static String _formatStaticDate(long time) {
		if (time <= 0) {
			return "";
		}

		SimpleDateFormat dateFormat = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss", Locale.US);

		dateFormat.setTimeZone(TimeZone.getDefault());

		return dateFormat.format(new Date(time));
	}

	private static String _joinCommand(List<String> command) {
		StringBuilder stringBuilder = new StringBuilder();
		Iterator<String> iterator = command.iterator();

		while (iterator.hasNext()) {
			String part = iterator.next();

			if (stringBuilder.length() > 0) {
				stringBuilder.append(' ');
			}

			if (part.contains(" ")) {
				stringBuilder.append('"').append(part).append('"');
			}
			else {
				stringBuilder.append(part);
			}
		}

		return stringBuilder.toString();
	}

	private static String _normalizeStaticDownloadType(String type) {
		String safeType = type == null ? "" : type.trim().toLowerCase(Locale.ROOT);

		if ("bundles".equals(safeType)) {
			return safeType;
		}

		if ("database".equals(safeType) || "db".equals(safeType)) {
			return "database";
		}

		throw new IllegalArgumentException("type phải là bundles hoặc database");
	}

	private static final int _MAX_JOB_OUTPUT_CHARS = 120000;
	private static final long _DOWNLOAD_TOKEN_TTL_MS = 5 * 60 * 1000;

	private static final long _DEV_USER_ID = 1;

	private static final DownloadTokenStore _downloadTokenStore =
		new DownloadTokenStore();

	private static final BackupJobStore _jobStore = new BackupJobStore();

	private static final Log _log = LogFactoryUtil.getLog(
		BackupAdminResource.class);

}
