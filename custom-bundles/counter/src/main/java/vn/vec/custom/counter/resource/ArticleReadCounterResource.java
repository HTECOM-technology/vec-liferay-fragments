package vn.vec.custom.counter.resource;

import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import javax.ws.rs.DefaultValue;
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

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import vn.vec.custom.counter.constants.CounterConstants;
import vn.vec.custom.counter.model.ArticleReadStats;
import vn.vec.custom.counter.persistence.ArticleReadRepository;
import vn.vec.custom.counter.service.CounterRequestContext;
import vn.vec.custom.counter.service.CounterRequestResolver;
import vn.vec.custom.counter.util.CounterParamUtil;
import vn.vec.custom.counter.util.CounterResponseUtil;

/**
 * Counter 3 — số lượt đọc một bài viết. Không yêu cầu xác thực.
 *
 * <ul>
 * <li>{@code POST /o/vec-counter/articles/{articleId}/reads}</li>
 * <li>{@code GET /o/vec-counter/articles/{articleId}/reads}</li>
 * <li>{@code GET /o/vec-counter/articles/reads?articleIds=a,b,c}</li>
 * <li>{@code GET /o/vec-counter/articles/top?limit=10}</li>
 * </ul>
 *
 * <p>
 * {@code articleId} là {@code JournalArticle.articleId} của Liferay.
 * </p>
 */
@Component(
	property = {
		"osgi.jaxrs.application.select=" +
			CounterConstants.JAXRS_APPLICATION_SELECT,
		"osgi.jaxrs.resource=true"
	},
	service = ArticleReadCounterResource.class
)
@Path("/articles")
@Produces(MediaType.APPLICATION_JSON)
public class ArticleReadCounterResource {

	/** Số liệu của nhiều bài viết trong một lần gọi, dùng cho trang danh sách. */
	@GET
	@Path("/reads")
	public Response getBatchReads(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("articleIds") String articleIds,
		@QueryParam("groupId") Long groupId) {

		List<String> normalizedArticleIds = _splitArticleIds(articleIds);

		if (normalizedArticleIds.isEmpty()) {
			return CounterResponseUtil.badRequest(
				"articleIds là bắt buộc, các giá trị cách nhau bằng dấu phẩy.");
		}

		try {
			CounterRequestContext counterRequestContext =
				_counterRequestResolver.resolve(
					httpServletRequest, groupId, null, null);

			Map<String, ArticleReadStats> statsMap =
				_articleReadRepository.getStats(
					counterRequestContext.getCompanyId(),
					counterRequestContext.getGroupId(), normalizedArticleIds);

			JSONArray itemsJSONArray = JSONFactoryUtil.createJSONArray();

			for (ArticleReadStats articleReadStats : statsMap.values()) {
				itemsJSONArray.put(_toJSONObject(articleReadStats));
			}

			JSONObject resultJSONObject = JSONFactoryUtil.createJSONObject();

			resultJSONObject.put(
				"companyId", counterRequestContext.getCompanyId());
			resultJSONObject.put("groupId", counterRequestContext.getGroupId());
			resultJSONObject.put("total", itemsJSONArray.length());
			resultJSONObject.put("items", itemsJSONArray);

			return CounterResponseUtil.ok(resultJSONObject);
		}
		catch (Exception exception) {
			_log.error("Unable to read article counters", exception);

			return CounterResponseUtil.internalError(
				"Không đọc được số lượt đọc bài viết.");
		}
	}

	@GET
	@Path("/{articleId}/reads")
	public Response getReads(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("articleId") String articleId,
		@QueryParam("groupId") Long groupId) {

		String normalizedArticleId = _normalizeArticleId(articleId);

		if (normalizedArticleId == null) {
			return CounterResponseUtil.badRequest("articleId là bắt buộc.");
		}

		try {
			CounterRequestContext counterRequestContext =
				_counterRequestResolver.resolve(
					httpServletRequest, groupId, null, null);

			ArticleReadStats articleReadStats =
				_articleReadRepository.getStats(
					counterRequestContext.getCompanyId(),
					counterRequestContext.getGroupId(), normalizedArticleId);

			return CounterResponseUtil.ok(_toJSONObject(articleReadStats));
		}
		catch (Exception exception) {
			_log.error("Unable to read article counter", exception);

			return CounterResponseUtil.internalError(
				"Không đọc được số lượt đọc bài viết.");
		}
	}

	/** Danh sách bài viết được đọc nhiều nhất. */
	@GET
	@Path("/top")
	public Response getTopArticles(
		@Context HttpServletRequest httpServletRequest,
		@QueryParam("groupId") Long groupId,
		@QueryParam("limit") @DefaultValue("10") int limit) {

		try {
			CounterRequestContext counterRequestContext =
				_counterRequestResolver.resolve(
					httpServletRequest, groupId, null, null);

			List<ArticleReadStats> topArticles =
				_articleReadRepository.getTopArticles(
					counterRequestContext.getCompanyId(),
					counterRequestContext.getGroupId(),
					Math.max(
						1,
						Math.min(limit, CounterConstants.MAX_TOP_ARTICLES)));

			JSONArray itemsJSONArray = JSONFactoryUtil.createJSONArray();

			for (ArticleReadStats articleReadStats : topArticles) {
				itemsJSONArray.put(_toJSONObject(articleReadStats));
			}

			JSONObject resultJSONObject = JSONFactoryUtil.createJSONObject();

			resultJSONObject.put(
				"companyId", counterRequestContext.getCompanyId());
			resultJSONObject.put("groupId", counterRequestContext.getGroupId());
			resultJSONObject.put("total", itemsJSONArray.length());
			resultJSONObject.put("items", itemsJSONArray);

			return CounterResponseUtil.ok(resultJSONObject);
		}
		catch (Exception exception) {
			_log.error("Unable to read top article counters", exception);

			return CounterResponseUtil.internalError(
				"Không đọc được danh sách bài viết đọc nhiều nhất.");
		}
	}

	@OPTIONS
	public Response options() {
		return CounterResponseUtil.options();
	}

	@OPTIONS
	@Path("{path:.*}")
	public Response optionsAny() {
		return CounterResponseUtil.options();
	}

	/**
	 * Ghi nhận một lượt đọc bài viết. Cùng một người đọc lại trong
	 * {@link CounterConstants#ARTICLE_READ_THROTTLE_SECONDS} giây thì không tăng
	 * thêm; response trả về {@code counted} để frontend biết.
	 */
	@POST
	@Path("/{articleId}/reads")
	public Response recordRead(
		@Context HttpServletRequest httpServletRequest,
		@PathParam("articleId") String articleId,
		@QueryParam("groupId") Long groupId,
		@QueryParam("visitorKey") String visitorKey,
		@QueryParam("resourcePrimKey") @DefaultValue("0")
			long resourcePrimKey) {

		String normalizedArticleId = _normalizeArticleId(articleId);

		if (normalizedArticleId == null) {
			return CounterResponseUtil.badRequest("articleId là bắt buộc.");
		}

		try {
			JSONObject bodyJSONObject = CounterParamUtil.readBody(
				httpServletRequest);

			CounterRequestContext counterRequestContext =
				_counterRequestResolver.resolve(
					httpServletRequest,
					CounterParamUtil.getLong(
						(groupId == null) ? null : String.valueOf(groupId),
						bodyJSONObject, "groupId"),
					CounterParamUtil.getString(
						visitorKey, bodyJSONObject, "visitorKey"),
					null);

			Long bodyResourcePrimKey = CounterParamUtil.getLong(
				(resourcePrimKey > 0) ? String.valueOf(resourcePrimKey) : null,
				bodyJSONObject, "resourcePrimKey");

			ArticleReadStats articleReadStats =
				_articleReadRepository.recordRead(
					counterRequestContext, normalizedArticleId,
					(bodyResourcePrimKey == null) ? 0 : bodyResourcePrimKey);

			return CounterResponseUtil.ok(_toJSONObject(articleReadStats));
		}
		catch (Exception exception) {
			_log.error("Unable to record article read", exception);

			return CounterResponseUtil.internalError(
				"Không ghi nhận được lượt đọc bài viết.");
		}
	}

	private String _normalizeArticleId(String articleId) {
		if ((articleId == null) || articleId.trim().isEmpty()) {
			return null;
		}

		String normalizedArticleId = articleId.trim();

		if (normalizedArticleId.length() > _MAX_ARTICLE_ID_LENGTH) {
			return normalizedArticleId.substring(0, _MAX_ARTICLE_ID_LENGTH);
		}

		return normalizedArticleId;
	}

	private List<String> _splitArticleIds(String articleIds) {
		Set<String> normalizedArticleIds = new LinkedHashSet<>();

		if ((articleIds == null) || articleIds.trim().isEmpty()) {
			return new ArrayList<>(normalizedArticleIds);
		}

		for (String articleId : articleIds.split(",")) {
			String normalizedArticleId = _normalizeArticleId(articleId);

			if (normalizedArticleId == null) {
				continue;
			}

			normalizedArticleIds.add(normalizedArticleId);

			if (normalizedArticleIds.size() >=
					CounterConstants.MAX_BATCH_ARTICLE_IDS) {

				break;
			}
		}

		return new ArrayList<>(normalizedArticleIds);
	}

	private JSONObject _toJSONObject(ArticleReadStats articleReadStats) {
		JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

		jsonObject.put("articleId", articleReadStats.getArticleId());
		jsonObject.put("groupId", articleReadStats.getGroupId());
		jsonObject.put("resourcePrimKey", articleReadStats.getResourcePrimKey());
		jsonObject.put("totalReads", articleReadStats.getTotalReads());
		jsonObject.put("uniqueReaders", articleReadStats.getUniqueReaders());
		jsonObject.put(
			"lastReadDate",
			CounterResponseUtil.formatDate(articleReadStats.getLastReadDate()));
		if (articleReadStats.getCounted() != null) {
			jsonObject.put(
				"counted", articleReadStats.getCounted().booleanValue());
		}

		return jsonObject;
	}

	private static final int _MAX_ARTICLE_ID_LENGTH = 75;

	private static final Log _log = LogFactoryUtil.getLog(
		ArticleReadCounterResource.class);

	@Reference
	private ArticleReadRepository _articleReadRepository;

	@Reference
	private CounterRequestResolver _counterRequestResolver;

}
