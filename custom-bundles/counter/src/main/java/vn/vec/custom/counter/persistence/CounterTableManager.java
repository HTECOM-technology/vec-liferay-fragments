package vn.vec.custom.counter.persistence;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;

import java.sql.Connection;
import java.sql.Statement;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;

/**
 * Tạo bảng cho module counter nếu chưa có. Schema tương ứng nằm ở
 * {@code counter/sql/counter.sql}; hai nơi phải giữ giống nhau.
 */
@Component(immediate = true, service = CounterTableManager.class)
public class CounterTableManager {

	/**
	 * Đảm bảo bảng đã tồn tại trước khi truy vấn. Repository gọi hàm này ở đầu
	 * mỗi thao tác vì bundle có thể start trước khi ai đó chạy SQL thủ công.
	 */
	public void ensureTables() throws Exception {
		if (_tablesReady) {
			return;
		}

		synchronized (this) {
			if (_tablesReady) {
				return;
			}

			try (Connection connection = DataAccess.getConnection();
				Statement statement = connection.createStatement()) {

				for (String sql : _CREATE_TABLE_SQLS) {
					statement.executeUpdate(sql);
				}
			}

			_tablesReady = true;
		}
	}

	@Activate
	protected void activate() {
		try {
			ensureTables();
		}
		catch (Exception exception) {

			// Không chặn bundle start: repository sẽ thử lại ở lần gọi API đầu
			// tiên (ví dụ khi DataSource chưa sẵn sàng lúc activate).

			_log.warn("Unable to create counter tables", exception);
		}
	}

	private static final String[] _CREATE_TABLE_SQLS = {
		"create table if not exists VEC_CounterSiteVisit (" +
			"siteVisitId BIGINT not null auto_increment, " +
			"companyId BIGINT not null default 0, " +
			"groupId BIGINT not null default 0, " +
			"visitDate DATE not null, " +
			"totalVisits BIGINT not null default 0, " +
			"uniqueVisitors BIGINT not null default 0, " +
			"createDate DATETIME(6) null, " +
			"modifiedDate DATETIME(6) null, " +
			"primary key (siteVisitId), " +
			"unique key IX_VEC_CounterSiteVisit_Day " +
				"(companyId, groupId, visitDate), " +
			"key IX_VEC_CounterSiteVisit_Date (visitDate)" +
		") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 " +
			"COLLATE=utf8mb4_unicode_ci",
		"create table if not exists VEC_CounterSiteVisitor (" +
			"siteVisitorId BIGINT not null auto_increment, " +
			"companyId BIGINT not null default 0, " +
			"groupId BIGINT not null default 0, " +
			"visitDate DATE not null, " +
			"visitorKey VARCHAR(64) not null, " +
			"userId BIGINT not null default 0, " +
			"visits BIGINT not null default 0, " +
			"firstVisitDate DATETIME(6) null, " +
			"lastVisitDate DATETIME(6) null, " +
			"primary key (siteVisitorId), " +
			"unique key IX_VEC_CounterSiteVisitor_Key " +
				"(companyId, groupId, visitDate, visitorKey), " +
			"key IX_VEC_CounterSiteVisitor_Date (visitDate)" +
		") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 " +
			"COLLATE=utf8mb4_unicode_ci",
		"create table if not exists VEC_CounterOnlineSession (" +
			"onlineSessionId BIGINT not null auto_increment, " +
			"companyId BIGINT not null default 0, " +
			"groupId BIGINT not null default 0, " +
			"visitorKey VARCHAR(64) not null, " +
			"userId BIGINT not null default 0, " +
			"currentPath VARCHAR(500) null, " +
			"firstSeenDate DATETIME(6) null, " +
			"lastSeenDate DATETIME(6) null, " +
			"primary key (onlineSessionId), " +
			"unique key IX_VEC_CounterOnlineSession_Key " +
				"(companyId, visitorKey), " +
			"key IX_VEC_CounterOnlineSession_Seen (lastSeenDate), " +
			"key IX_VEC_CounterOnlineSession_Group (groupId, lastSeenDate)" +
		") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 " +
			"COLLATE=utf8mb4_unicode_ci",
		"create table if not exists VEC_CounterArticleRead (" +
			"articleReadId BIGINT not null auto_increment, " +
			"companyId BIGINT not null default 0, " +
			"groupId BIGINT not null default 0, " +
			"articleId VARCHAR(75) not null, " +
			"resourcePrimKey BIGINT not null default 0, " +
			"totalReads BIGINT not null default 0, " +
			"uniqueReaders BIGINT not null default 0, " +
			"createDate DATETIME(6) null, " +
			"modifiedDate DATETIME(6) null, " +
			"lastReadDate DATETIME(6) null, " +
			"primary key (articleReadId), " +
			"unique key IX_VEC_CounterArticleRead_Key " +
				"(companyId, groupId, articleId), " +
			"key IX_VEC_CounterArticleRead_Article (articleId), " +
			"key IX_VEC_CounterArticleRead_Top " +
				"(companyId, groupId, totalReads)" +
		") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 " +
			"COLLATE=utf8mb4_unicode_ci",
		"create table if not exists VEC_CounterArticleReader (" +
			"articleReaderId BIGINT not null auto_increment, " +
			"companyId BIGINT not null default 0, " +
			"groupId BIGINT not null default 0, " +
			"articleId VARCHAR(75) not null, " +
			"visitorKey VARCHAR(64) not null, " +
			"userId BIGINT not null default 0, " +
			"readCount BIGINT not null default 0, " +
			"firstReadDate DATETIME(6) null, " +
			"lastReadDate DATETIME(6) null, " +
			"primary key (articleReaderId), " +
			"unique key IX_VEC_CounterArticleReader_Key " +
				"(companyId, groupId, articleId, visitorKey), " +
			"key IX_VEC_CounterArticleReader_Read (lastReadDate)" +
		") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 " +
			"COLLATE=utf8mb4_unicode_ci"
	};

	private static final Log _log = LogFactoryUtil.getLog(
		CounterTableManager.class);

	private volatile boolean _tablesReady;

}
