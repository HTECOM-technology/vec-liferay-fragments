package vn.vec.custom.admin.webcontent.statistics;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class WebContentStatisticsSummary {

	public void accept(WebContentStatisticsRow row) {
		_totalCount++;

		_increment(_statusCounts, row.getStatusKey());
		_incrementStructure(row.getStructureKey(), row.getStructureName());
		_incrementFolder(row.getFolderKey(), row.getFolderPath());
		_incrementUser(row.getUserKey(), row.getUserName());
		_incrementMonth(_createMonthCounts, row.getCreateMonthKey());
		_incrementMonth(_modifiedMonthCounts, row.getModifiedMonthKey());
	}

	public List<SummaryItem> getCreateMonthItems() {
		return _toMonthItems(_createMonthCounts);
	}

	public List<FolderSummaryItem> getFolderItems() {
		List<FolderSummaryItem> items = new ArrayList<>();

		for (Map.Entry<Long, FolderCount> entry : _folderCounts.entrySet()) {
			FolderCount folderCount = entry.getValue();

			items.add(
				new FolderSummaryItem(
					entry.getKey(), folderCount.folderPath, folderCount.count));
		}

		items.sort(
			Comparator.comparingLong(FolderSummaryItem::getCount).reversed()
				.thenComparing(FolderSummaryItem::getFolderPath));

		return items;
	}

	public List<SummaryItem> getModifiedMonthItems() {
		return _toMonthItems(_modifiedMonthCounts);
	}

	public List<StatusSummaryItem> getStatusItems() {
		List<StatusSummaryItem> items = new ArrayList<>();

		for (Map.Entry<Long, Long> entry : _statusCounts.entrySet()) {
			long status = entry.getKey();

			items.add(
				new StatusSummaryItem(
					(int)status, WebContentStatisticsRow.toStatusLabel(
						(int)status),
					entry.getValue()));
		}

		items.sort(
			Comparator.comparingInt(StatusSummaryItem::getSortOrder)
				.thenComparing(
					Comparator.comparingLong(
						StatusSummaryItem::getCount
					).reversed()));

		return items;
	}

	public List<StructureSummaryItem> getStructureItems() {
		List<StructureSummaryItem> items = new ArrayList<>();

		for (Map.Entry<Long, StructureCount> entry : _structureCounts.entrySet()) {
			StructureCount structureCount = entry.getValue();

			items.add(
				new StructureSummaryItem(
					entry.getKey(), structureCount.structureName,
					structureCount.count));
		}

		items.sort(
			Comparator.comparingLong(StructureSummaryItem::getCount).reversed()
				.thenComparing(StructureSummaryItem::getStructureName));

		return items;
	}

	public long getTotalCount() {
		return _totalCount;
	}

	public List<UserSummaryItem> getUserItems() {
		List<UserSummaryItem> items = new ArrayList<>();

		for (Map.Entry<Long, UserCount> entry : _userCounts.entrySet()) {
			UserCount userCount = entry.getValue();

			items.add(
				new UserSummaryItem(
					entry.getKey(), userCount.userName, userCount.count));
		}

		items.sort(
			Comparator.comparingLong(UserSummaryItem::getCount).reversed()
				.thenComparing(UserSummaryItem::getUserName));

		return items;
	}

	public double toPercentage(long count) {
		if (_totalCount <= 0) {
			return 0D;
		}

		return ((double)count * 100D) / _totalCount;
	}

	private void _increment(Map<Long, Long> counts, long key) {
		counts.put(key, counts.getOrDefault(key, 0L) + 1);
	}

	private void _incrementStructure(long structureId, String structureName) {
		StructureCount structureCount = _structureCounts.get(structureId);

		if (structureCount == null) {
			structureCount = new StructureCount(structureName, 0L);
			_structureCounts.put(structureId, structureCount);
		}

		structureCount.count++;

		if (structureCount.structureName == null ||
			structureCount.structureName.isEmpty()) {

			structureCount.structureName = structureName;
		}
	}

	private void _incrementFolder(long folderId, String folderPath) {
		FolderCount folderCount = _folderCounts.get(folderId);

		if (folderCount == null) {
			folderCount = new FolderCount(folderPath, 0L);
			_folderCounts.put(folderId, folderCount);
		}

		folderCount.count++;

		if (folderCount.folderPath == null || folderCount.folderPath.isEmpty()) {
			folderCount.folderPath = folderPath;
		}
	}

	private void _incrementMonth(Map<String, Long> counts, String monthKey) {
		if (monthKey == null || monthKey.isEmpty()) {
			return;
		}

		counts.put(monthKey, counts.getOrDefault(monthKey, 0L) + 1);
	}

	private void _incrementUser(long userId, String userName) {
		UserCount userCount = _userCounts.get(userId);

		if (userCount == null) {
			userCount = new UserCount(userName, 0L);
			_userCounts.put(userId, userCount);
		}

		userCount.count++;

		if (userCount.userName == null || userCount.userName.isEmpty()) {
			userCount.userName = userName;
		}
	}

	private List<SummaryItem> _toMonthItems(Map<String, Long> counts) {
		Map<String, Long> sortedCounts = new LinkedHashMap<>();
		List<String> keys = new ArrayList<>(counts.keySet());

		Collections.sort(keys);

		for (String key : keys) {
			sortedCounts.put(key, counts.get(key));
		}

		List<SummaryItem> items = new ArrayList<>();

		for (Map.Entry<String, Long> entry : sortedCounts.entrySet()) {
			items.add(new SummaryItem(entry.getKey(), entry.getValue()));
		}

		return items;
	}

	public static class FolderSummaryItem {

		public FolderSummaryItem(long folderId, String folderPath, long count) {
			_folderId = folderId;
			_folderPath = folderPath;
			_count = count;
		}

		public long getCount() {
			return _count;
		}

		public long getFolderId() {
			return _folderId;
		}

		public String getFolderPath() {
			return _folderPath;
		}

		public String getFolderShortName() {
			if (_folderPath == null || _folderPath.isEmpty() || "/".equals(_folderPath)) {
				return "";
			}

			String normalizedPath = _folderPath;

			while (normalizedPath.endsWith("/")) {
				normalizedPath = normalizedPath.substring(
					0, normalizedPath.length() - 1);
			}

			int index = normalizedPath.lastIndexOf('/');

			if (index >= 0) {
				return normalizedPath.substring(index + 1);
			}

			return normalizedPath;
		}

		private final long _count;
		private final long _folderId;
		private final String _folderPath;

	}

	public static class StructureSummaryItem {

		public StructureSummaryItem(
			long structureId, String structureName, long count) {

			_structureId = structureId;
			_structureName = structureName;
			_count = count;
		}

		public long getCount() {
			return _count;
		}

		public long getStructureId() {
			return _structureId;
		}

		public String getStructureName() {
			return _structureName;
		}

		private final long _count;
		private final long _structureId;
		private final String _structureName;

	}

	public static class StatusSummaryItem {

		public StatusSummaryItem(int status, String statusLabel, long count) {
			_status = status;
			_statusLabel = statusLabel;
			_count = count;
		}

		public long getCount() {
			return _count;
		}

		public int getSortOrder() {
			switch (_status) {
				case 0:
					return 0;
				case 1:
					return 1;
				case 2:
					return 2;
				case 3:
					return 3;
				case 4:
					return 4;
				case 7:
					return 5;
				case 8:
					return 6;
				default:
					return 99;
			}
		}

		public int getStatus() {
			return _status;
		}

		public String getStatusLabel() {
			return _statusLabel;
		}

		private final long _count;
		private final int _status;
		private final String _statusLabel;

	}

	public static class SummaryItem {

		public SummaryItem(String label, long count) {
			_label = label;
			_count = count;
		}

		public long getCount() {
			return _count;
		}

		public String getLabel() {
			return _label;
		}

		private final long _count;
		private final String _label;

	}

	public static class UserSummaryItem {

		public UserSummaryItem(long userId, String userName, long count) {
			_userId = userId;
			_userName = userName;
			_count = count;
		}

		public long getCount() {
			return _count;
		}

		public long getUserId() {
			return _userId;
		}

		public String getUserName() {
			return _userName;
		}

		private final long _count;
		private final long _userId;
		private final String _userName;

	}

	private static class FolderCount {

		public FolderCount(String folderPath, long count) {
			this.folderPath = folderPath;
			this.count = count;
		}

		public long count;
		public String folderPath;

	}

	private static class StructureCount {

		public StructureCount(String structureName, long count) {
			this.structureName = structureName;
			this.count = count;
		}

		public long count;
		public String structureName;

	}

	private static class UserCount {

		public UserCount(String userName, long count) {
			this.userName = userName;
			this.count = count;
		}

		public long count;
		public String userName;

	}

	private final Map<String, Long> _createMonthCounts = new HashMap<>();
	private final Map<String, Long> _modifiedMonthCounts = new HashMap<>();
	private final Map<Long, FolderCount> _folderCounts = new HashMap<>();
	private final Map<Long, Long> _statusCounts = new HashMap<>();
	private final Map<Long, StructureCount> _structureCounts = new HashMap<>();
	private long _totalCount;
	private final Map<Long, UserCount> _userCounts = new HashMap<>();

}
