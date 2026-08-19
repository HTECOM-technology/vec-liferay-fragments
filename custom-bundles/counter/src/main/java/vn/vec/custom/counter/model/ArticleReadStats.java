package vn.vec.custom.counter.model;

import java.util.Date;

/**
 * Số liệu lượt đọc của một bài viết.
 */
public class ArticleReadStats {

	public ArticleReadStats(String articleId, long groupId) {
		_articleId = articleId;
		_groupId = groupId;
	}

	public String getArticleId() {
		return _articleId;
	}

	public long getGroupId() {
		return _groupId;
	}

	public Date getLastReadDate() {
		return _lastReadDate;
	}

	public long getResourcePrimKey() {
		return _resourcePrimKey;
	}

	public long getTotalReads() {
		return _totalReads;
	}

	public long getUniqueReaders() {
		return _uniqueReaders;
	}

	/**
	 * {@code true}/{@code false} nếu lượt đọc vừa gửi lên có được tính vào
	 * totalReads hay không, {@code null} khi chỉ đọc số liệu.
	 */
	public Boolean getCounted() {
		return _counted;
	}

	public void setCounted(boolean counted) {
		_counted = Boolean.valueOf(counted);
	}

	public void setLastReadDate(Date lastReadDate) {
		_lastReadDate = lastReadDate;
	}

	public void setResourcePrimKey(long resourcePrimKey) {
		_resourcePrimKey = resourcePrimKey;
	}

	public void setTotalReads(long totalReads) {
		_totalReads = totalReads;
	}

	public void setUniqueReaders(long uniqueReaders) {
		_uniqueReaders = uniqueReaders;
	}

	private final String _articleId;
	private Boolean _counted;
	private final long _groupId;
	private Date _lastReadDate;
	private long _resourcePrimKey;
	private long _totalReads;
	private long _uniqueReaders;

}
