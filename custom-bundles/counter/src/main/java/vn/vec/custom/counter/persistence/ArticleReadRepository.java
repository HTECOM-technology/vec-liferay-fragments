package vn.vec.custom.counter.persistence;

import com.liferay.portal.kernel.dao.jdbc.DataAccess;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.counter.constants.CounterConstants;
import vn.vec.custom.counter.model.ArticleReadStats;
import vn.vec.custom.counter.service.CounterRequestContext;

/**
 * Counter 3: số lượt đọc một bài viết.
 *
 * <p>
 * {@code VEC_CounterArticleRead} giữ số tổng hợp theo bài viết,
 * {@code VEC_CounterArticleReader} giữ từng người đọc để đếm unique reader và
 * chặn tăng ảo khi F5
 * ({@link CounterConstants#ARTICLE_READ_THROTTLE_SECONDS}).
 * </p>
 *
 * <p>
 * Quy ước {@code groupId}: khi đọc số liệu, {@code groupId <= 0} nghĩa là gộp
 * tất cả site, nên frontend vẫn lấy đúng số dù lúc ghi có truyền groupId hay
 * không.
 * </p>
 */
@Component(service = ArticleReadRepository.class)
public class ArticleReadRepository {

	public ArticleReadStats getStats(
			long companyId, long groupId, String articleId)
		throws Exception {

		List<String> articleIds = new ArrayList<>();

		articleIds.add(articleId);

		Map<String, ArticleReadStats> statsMap = getStats(
			companyId, groupId, articleIds);

		ArticleReadStats articleReadStats = statsMap.get(articleId);

		if (articleReadStats == null) {
			return new ArticleReadStats(articleId, groupId);
		}

		return articleReadStats;
	}

	public Map<String, ArticleReadStats> getStats(
			long companyId, long groupId, List<String> articleIds)
		throws Exception {

		_counterTableManager.ensureTables();

		Map<String, ArticleReadStats> statsMap = new LinkedHashMap<>();

		for (String articleId : articleIds) {
			statsMap.put(articleId, new ArticleReadStats(articleId, groupId));
		}

		if (articleIds.isEmpty()) {
			return statsMap;
		}

		StringBuilder sql = new StringBuilder(
			"select articleId, sum(totalReads) as totalReads, " +
				"sum(uniqueReaders) as uniqueReaders, " +
					"max(resourcePrimKey) as resourcePrimKey, " +
						"max(lastReadDate) as lastReadDate " +
							"from VEC_CounterArticleRead where companyId = ? " +
								"and articleId in (");

		for (int i = 0; i < articleIds.size(); i++) {
			if (i > 0) {
				sql.append(", ");
			}

			sql.append('?');
		}

		sql.append(')');

		if (groupId > 0) {
			sql.append(" and groupId = ?");
		}

		sql.append(" group by articleId");

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql.toString())) {

			int index = 1;

			preparedStatement.setLong(index++, companyId);

			for (String articleId : articleIds) {
				preparedStatement.setString(index++, articleId);
			}

			if (groupId > 0) {
				preparedStatement.setLong(index++, groupId);
			}

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				while (resultSet.next()) {
					String articleId = resultSet.getString("articleId");

					ArticleReadStats articleReadStats = statsMap.get(articleId);

					if (articleReadStats == null) {
						articleReadStats = new ArticleReadStats(
							articleId, groupId);

						statsMap.put(articleId, articleReadStats);
					}

					_fill(articleReadStats, resultSet);
				}
			}
		}

		return statsMap;
	}

	public List<ArticleReadStats> getTopArticles(
			long companyId, long groupId, int limit)
		throws Exception {

		_counterTableManager.ensureTables();

		StringBuilder sql = new StringBuilder(
			"select articleId, sum(totalReads) as totalReads, " +
				"sum(uniqueReaders) as uniqueReaders, " +
					"max(resourcePrimKey) as resourcePrimKey, " +
						"max(lastReadDate) as lastReadDate " +
							"from VEC_CounterArticleRead where companyId = ?");

		if (groupId > 0) {
			sql.append(" and groupId = ?");
		}

		sql.append(" group by articleId order by totalReads desc limit ?");

		List<ArticleReadStats> topArticles = new ArrayList<>();

		try (Connection connection = DataAccess.getConnection();
			PreparedStatement preparedStatement = connection.prepareStatement(
				sql.toString())) {

			int index = 1;

			preparedStatement.setLong(index++, companyId);

			if (groupId > 0) {
				preparedStatement.setLong(index++, groupId);
			}

			preparedStatement.setInt(index++, limit);

			try (ResultSet resultSet = preparedStatement.executeQuery()) {
				while (resultSet.next()) {
					ArticleReadStats articleReadStats = new ArticleReadStats(
						resultSet.getString("articleId"), groupId);

					_fill(articleReadStats, resultSet);

					topArticles.add(articleReadStats);
				}
			}
		}

		return topArticles;
	}

	/**
	 * Ghi nhận một lượt đọc bài viết rồi trả về số liệu mới nhất.
	 * {@link ArticleReadStats#isCounted()} cho biết lượt đọc có được tính hay bị
	 * chặn bởi ngưỡng chống tăng ảo.
	 */
	public ArticleReadStats recordRead(
			CounterRequestContext counterRequestContext, String articleId,
			long resourcePrimKey)
		throws Exception {

		_counterTableManager.ensureTables();

		Date now = new Date();
		boolean counted;
		boolean newReader;

		try (Connection connection = DataAccess.getConnection()) {
			newReader = _insertReader(
				connection, counterRequestContext, articleId, now);
			counted = newReader;

			if (!newReader) {
				counted = _touchReader(
					connection, counterRequestContext, articleId, now);
			}

			if (counted) {
				_upsertArticleRead(
					connection, counterRequestContext, articleId,
					resourcePrimKey, now, newReader ? 1 : 0);
			}
		}

		ArticleReadStats articleReadStats = getStats(
			counterRequestContext.getCompanyId(),
			counterRequestContext.getGroupId(), articleId);

		articleReadStats.setCounted(counted);

		return articleReadStats;
	}

	private void _fill(
			ArticleReadStats articleReadStats, ResultSet resultSet)
		throws Exception {

		articleReadStats.setTotalReads(resultSet.getLong("totalReads"));
		articleReadStats.setUniqueReaders(resultSet.getLong("uniqueReaders"));
		articleReadStats.setResourcePrimKey(
			resultSet.getLong("resourcePrimKey"));

		Timestamp lastReadDate = resultSet.getTimestamp("lastReadDate");

		if (lastReadDate != null) {
			articleReadStats.setLastReadDate(new Date(lastReadDate.getTime()));
		}
	}

	private boolean _insertReader(
			Connection connection,
			CounterRequestContext counterRequestContext, String articleId,
			Date now)
		throws Exception {

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				"insert ignore into VEC_CounterArticleReader (companyId, " +
					"groupId, articleId, visitorKey, userId, readCount, " +
						"firstReadDate, lastReadDate) values " +
							"(?, ?, ?, ?, ?, 1, ?, ?)")) {

			int index = 1;

			preparedStatement.setLong(
				index++, counterRequestContext.getCompanyId());
			preparedStatement.setLong(
				index++, counterRequestContext.getGroupId());
			preparedStatement.setString(index++, articleId);
			preparedStatement.setString(
				index++, counterRequestContext.getVisitorKey());
			preparedStatement.setLong(index++, counterRequestContext.getUserId());
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));

			return preparedStatement.executeUpdate() > 0;
		}
	}

	private boolean _touchReader(
			Connection connection,
			CounterRequestContext counterRequestContext, String articleId,
			Date now)
		throws Exception {

		long thresholdTime =
			now.getTime() -
				(CounterConstants.ARTICLE_READ_THROTTLE_SECONDS * 1000L);

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				"update VEC_CounterArticleReader set readCount = " +
					"readCount + 1, lastReadDate = ?, userId = ? where " +
						"companyId = ? and groupId = ? and articleId = ? and " +
							"visitorKey = ? and (lastReadDate is null or " +
								"lastReadDate <= ?)")) {

			int index = 1;

			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setLong(index++, counterRequestContext.getUserId());
			preparedStatement.setLong(
				index++, counterRequestContext.getCompanyId());
			preparedStatement.setLong(
				index++, counterRequestContext.getGroupId());
			preparedStatement.setString(index++, articleId);
			preparedStatement.setString(
				index++, counterRequestContext.getVisitorKey());
			preparedStatement.setTimestamp(
				index++, new Timestamp(thresholdTime));

			return preparedStatement.executeUpdate() > 0;
		}
	}

	private void _upsertArticleRead(
			Connection connection,
			CounterRequestContext counterRequestContext, String articleId,
			long resourcePrimKey, Date now, int uniqueReaderDelta)
		throws Exception {

		try (PreparedStatement preparedStatement = connection.prepareStatement(
				"insert into VEC_CounterArticleRead (companyId, groupId, " +
					"articleId, resourcePrimKey, totalReads, uniqueReaders, " +
						"createDate, modifiedDate, lastReadDate) values " +
							"(?, ?, ?, ?, 1, ?, ?, ?, ?) on duplicate key " +
								"update totalReads = totalReads + 1, " +
									"uniqueReaders = uniqueReaders + ?, " +
										"resourcePrimKey = case when ? > 0 " +
											"then ? else resourcePrimKey end, " +
												"modifiedDate = ?, " +
													"lastReadDate = ?")) {

			int index = 1;

			preparedStatement.setLong(
				index++, counterRequestContext.getCompanyId());
			preparedStatement.setLong(
				index++, counterRequestContext.getGroupId());
			preparedStatement.setString(index++, articleId);
			preparedStatement.setLong(index++, resourcePrimKey);
			preparedStatement.setInt(index++, uniqueReaderDelta);
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setInt(index++, uniqueReaderDelta);
			preparedStatement.setLong(index++, resourcePrimKey);
			preparedStatement.setLong(index++, resourcePrimKey);
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));
			preparedStatement.setTimestamp(index++, new Timestamp(now.getTime()));

			preparedStatement.executeUpdate();
		}
	}

	@Reference
	private CounterTableManager _counterTableManager;

}
