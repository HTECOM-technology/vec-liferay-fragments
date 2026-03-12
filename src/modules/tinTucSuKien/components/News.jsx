import { useEffect, useMemo, useState } from "react";
import {
  getVocabulariesBySite,
  getCategoriesByVocabulary,
} from "../services/taxonomyService";
import { getAllBlogBySiteId } from "../services/blogService";
import "../styles/News.css";
import { formatDate } from "../utils/dateUtils";

const SITE_ID = 1029373;
const VOCABULARY_NAME = "tin bài";

const News = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const vocabularies = await getVocabulariesBySite(SITE_ID);
      const targetVocabulary = vocabularies.find(
        (v) => v.name?.toLowerCase() === VOCABULARY_NAME.toLowerCase()
      );

      if (!targetVocabulary) return;

      const cats = await getCategoriesByVocabulary(targetVocabulary.id);
      setCategories(cats);

      const defaultCategoryId = cats[0]?.id;
      setActiveCategoryId(defaultCategoryId);

      const blogsResponse = await getAllBlogBySiteId(SITE_ID);
      setBlogs(blogsResponse);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const activeCategoryName = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId)?.name || "";
  }, [categories, activeCategoryId]);

  const currentBlogs = useMemo(() => {
    if (!activeCategoryId) return [];

    return blogs.filter((blog) =>
      blog.taxonomyCategoryBriefs?.some(
        (brief) =>
          String(brief.taxonomyCategoryId) === String(activeCategoryId)
      )
    );
  }, [blogs, activeCategoryId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="news-container">

      {/* CATEGORY TABS */}
      <div className="news-tabs-wrapper">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`news-tab ${
              activeCategoryId === cat.id ? "active" : ""
            }`}
            onClick={() => setActiveCategoryId(cat.id)}
          >
            {/* ảnh nền category */}
            <img
              className="news-tab-bg"
              src=""
              alt=""
            />

            <span className="news-tab-title">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* TITLE CATEGORY */}
      <div className="news-section-title">
        {activeCategoryName}
      </div>

      {/* NEWS LIST */}
      <div className="news-list">

        {currentBlogs.map((blog) => {
          const publishDate = formatDate(blog.datePublished);
          const imageUrl = blog.image?.contentUrl;
          const fullImage =
            imageUrl?.startsWith("http")
              ? imageUrl
              : `${window.location.origin}${imageUrl}`;

          const categoryNames =
            blog.taxonomyCategoryBriefs?.map(
              (cat) => cat.taxonomyCategoryName
            ) || [];

          return (
            <div key={blog.id} className="news-item">

              <div className="news-left">
                <h3 className="news-title">{blog.headline}</h3>

                <p className="news-desc">
                  {blog.alternativeHeadline}
                </p>

                <div className="news-meta">
                  <span className="news-category">
                    {activeCategoryName}
                  </span>

                  <span className="news-dot"></span>

                  <span className="news-date">
                    {publishDate}
                  </span>
                </div>
              </div>

              {imageUrl && (
                <img
                  className="news-image"
                  src={fullImage}
                  alt={blog.caption}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default News;