import { useEffect, useMemo, useState } from "react";
import {
  getVocabulariesBySite,
  getCategoriesByVocabulary,
} from "../../../services/taxonomyService";
import "../styles/News.css";
import { getFieldValue } from "../../../utils/contentFieldUtils";
import { getAllBlogBySiteId } from "../../../services/blogService";

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

  /** Currently selected taxonomy category ID */
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  /** List of fetched news articles */
  const [blogs, setBlogs] = useState([]);

  /** Loading indicator */
  const [loading, setLoading] = useState(true);

  /** Liferay Site (Group) ID */
  const SITE_ID = 1029373;

  /** Target taxonomy vocabulary name */
  const VOCABULARY_NAME = "tin bài";

  /**
   * Load all initial data on component mount:
   * - Taxonomy categories
   * - Content structure
   * - Default category articles
   */
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Loads all required data for the News component.
   *
   * Steps:
   * 1. Fetch taxonomy vocabularies and categories
   * 2. Fetch content structures
   * 3. Fetch structured content for the default category
   */
  const loadInitialData = async () => {
    try {
      setLoading(true);

      /* 1. Load taxonomy categories */
      const vocabularies = await getVocabulariesBySite(SITE_ID);
      const targetVocabulary = vocabularies.find(
        (v) => v.name === VOCABULARY_NAME
      );

      if (!targetVocabulary) return;

      const cats = await getCategoriesByVocabulary(targetVocabulary.id);
      setCategories(cats);

      const defaultCategoryId = cats[0]?.id;
      setActiveCategoryId(defaultCategoryId);

      const blogsResponse = await getAllBlogBySiteId(SITE_ID);
      setBlogs(blogsResponse);
    } catch (error) {
      console.error("Error loading news data:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentBlogs = useMemo(() => {
    if (!activeCategoryId) {
      return [];
    }
    return blogs.filter((blog) => {
      return blog.taxonomyCategoryBriefs
        .filter((brief) => String(brief.taxonomyCategoryId) === String(activeCategoryId))
        .length > 0;
    });
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
          <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
            <img src={'/documents/d/intranet/container-2-'} alt="News Icon" />
          </div>
          <span>Tin tức - Sự kiện</span>
        </div>

        {/* Category Tabs */}
        <div className="news-tabs-div">
          <ul className="news-tabs">
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

      <div className="news-list p-8">
        {currentBlogs.map((blog) => {
          const shortDescription = blog.description ?? '';

          const publishDate = blog.datePublished?.split("T")[0] ?? '';

          const imageUrl = blog.image?.contentUrl;

          const categoryNames = (blog.taxonomyCategoryBriefs ?? []).map(
            (cat) => cat.taxonomyCategoryName,
          );

          return (
            <div key={blog.id} className="news-item">
              <div className="news-info">
                <h3>{blog.headline}</h3>

                <div className="news-date-div">
                  <span className="red-text">
                    {categoryNames.join(', ')}
                  </span>
                  <span className="dot-custom"></span>
                  <span className="news-date">{publishDate}</span>
                </div>
              </div>

              <img
                src={`${window.location.origin}${imageUrl}`}
                alt={blog.caption}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default News;
