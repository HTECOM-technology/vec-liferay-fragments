import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getVocabulariesBySite,
  getCategoriesByVocabulary,
} from "../../../services/taxonomyService";
import "../styles/News.css";
import { getAllBlogBySiteId, getLatestBlogs } from "../../../services/blogService";

/**
 * News Component
 *
 * Renders a list of news articles fetched from Liferay Headless APIs.
 *
 * Features:
 * - Loads taxonomy categories for tab-based filtering
 * - Fetches structured content using a specific content structure
 * - Reloads articles when the active category changes
 *
 * Data Sources:
 * - Taxonomy Vocabulary: "News Article Types"
 * - Content Structure: "NEWS_ARTICLES"
 *
 * @component
 * @returns {JSX.Element}
 */
const News = () => {

  /** List of taxonomy categories */
  const [categories, setCategories] = useState([]);

  /** Currently selected taxonomy category ID, "latest" là tab mới nhất */
  const [activeCategoryId, setActiveCategoryId] = useState("latest");

  /** List of fetched news articles */
  const [blogs, setBlogs] = useState([]);

  /** Loading lần đầu (toàn trang) */
  const [loading, setLoading] = useState(true);
  /** Loading khi chuyển tab (không ẩn toàn bộ content) */
  const [fetching, setFetching] = useState(false);

  /** Liferay Site (Group) ID */
  const SITE_ID = 20117;

  /** Target taxonomy vocabulary name */
  // const VOCABULARY_NAME = "tin bài";
  const VOCABULARY_NAME = "Intranet";

  /**
   * Load all initial data on component mount:
   * - Taxonomy categories
   * - Content structure
   * - Default category articles
   */
  // Lần đầu load: lấy categories
  useEffect(() => {
    loadInitialData();
  }, []);

  // Mỗi khi đổi tab → gọi lại API
  useEffect(() => {
    if (!activeCategoryId) return;
    if (activeCategoryId === "latest") {
      loadLatestBlogs();
    } else {
      loadBlogsByCategory(activeCategoryId);
    }
  }, [activeCategoryId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const vocabularies = await getVocabulariesBySite(SITE_ID);
      const targetVocabulary = vocabularies.find(
        (v) => v.name === VOCABULARY_NAME
      );

      if (!targetVocabulary) return;

      const cats = await getCategoriesByVocabulary(targetVocabulary.id);
      setCategories(cats);

      // Giữ tab "Mới nhất" active mặc định, không đổi sang category đầu tiên
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBlogsByCategory = async (categoryId) => {
    try {
      setFetching(true);
      const blogsResponse = await getAllBlogBySiteId(SITE_ID, categoryId);
      setBlogs(blogsResponse);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setFetching(false);
    }
  };

  const loadLatestBlogs = async () => {
    try {
      setFetching(true);
      const blogsResponse = await getLatestBlogs();
      setBlogs(blogsResponse);
    } catch (error) {
      console.error("Error loading latest blogs:", error);
    } finally {
      setFetching(false);
    }
  };

  const currentBlogs = useMemo(() => {
    // Tab "Mới nhất" → hiển thị toàn bộ blogs đã fetch (đã sort từ API)
    if (activeCategoryId === "latest") return blogs;
    if (!activeCategoryId) return [];
    return blogs.filter((blog) =>
      blog.taxonomyCategoryBriefs?.some(
        (brief) => String(brief.taxonomyCategoryId) === String(activeCategoryId)
      )
    );
  }, [blogs, activeCategoryId]);

  /** Show loader while data is being fetched */
  if (loading) {
    return <div className="news-loading">Loading...</div>;
  }

  return (
    <div className="news-container doc-card">
      {/* Header */}
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-8">
          {/* <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
            <img src={'/documents/d/intranet/container-2-'} alt="News Icon" />
          </div> */}
          <span>Tin tức - Sự kiện</span>
        </div>

        {/* Category Tabs */}
        <div className="news-tabs-div">
          <ul className="news-tabs">
            <li
              className={activeCategoryId === "latest" ? "active" : ""}
              onClick={() => setActiveCategoryId("latest")}
            >
              Mới nhất
            </li>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={activeCategoryId === cat.id ? "active" : ""}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="news-list p-8" style={{ opacity: fetching ? 0.4 : 1, transition: "opacity 0.2s" }}>
        {currentBlogs.map((blog) => {
          // console.log(blog);

          // const publishDate = blog.datePublished?.split("T")[0] ?? '';

          // const imageUrl = blog.image?.contentUrl;

          const categoryNames = (blog.taxonomyCategoryBriefs ?? []).map(
            (cat) => cat.taxonomyCategoryName,
          );

          const getFieldValue = (contentFields, name) => {
            return contentFields.find((f) => f.name === name)?.contentFieldValue;
          };

          const fields = blog.contentFields ?? [];
          const title = getFieldValue(fields, "title")?.data;
          const date = getFieldValue(fields, "date")?.data?.slice(0, 10).split("-").reverse().join("/");
          const imageUrl = getFieldValue(fields, "image")?.image?.contentUrl;


          const categoryId = blog.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryId;
          const detailUrl = `/tin-tuc-su-kien/${categoryId}/${blog.id}`;

          return (
            <Link key={blog.id} className="news-item" to={detailUrl}>
              <div className="news-info">
                <h3>{title}</h3>

                <div className="news-date-div">
                  <span className="red-text">
                    {categoryNames.join(', ')}
                  </span>
                  <span className="dot-custom"></span>
                  <span className="news-date">{date}</span>
                </div>
              </div>

              <img src={process.env.REACT_APP_BASE_API_URL ? `${process.env.REACT_APP_BASE_API_URL}${imageUrl}` : imageUrl} alt="img" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default News;
