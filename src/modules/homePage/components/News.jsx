import { useEffect, useMemo, useState, useRef, useCallback } from "react";
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

  // ─── Tab scroll & drag ────────────────────────────────────────────────────
  const tabsRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const dragDistance = useRef(0);

  const checkArrows = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    checkArrows();
    el.addEventListener("scroll", checkArrows);
    const ro = new ResizeObserver(checkArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkArrows);
      ro.disconnect();
    };
  }, [checkArrows]);

  useEffect(() => { checkArrows(); }, [categories, checkArrows]);

  const handleTabMouseDown = (e) => {
    const el = tabsRef.current;
    if (!el) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragScrollLeft.current = el.scrollLeft;
    dragDistance.current = 0;
  };

  const handleTabMouseMove = (e) => {
    if (!isDragging.current || !tabsRef.current) return;
    e.preventDefault();
    const walk = e.clientX - dragStartX.current;
    dragDistance.current = Math.abs(walk);
    tabsRef.current.scrollLeft = dragScrollLeft.current - walk;
    checkArrows();
  };

  const handleTabMouseUp = () => { isDragging.current = false; };

  const scrollTabs = (direction) => {
    const el = tabsRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 160, behavior: "smooth" });
    setTimeout(checkArrows, 350);
  };

  const isTabClick = () => dragDistance.current < 5;

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

  const sortByDate = (list) => {
    return [...list].sort((a, b) => {
      const getDate = (blog) => {
        const dateStr = (blog.contentFields ?? []).find((f) => f.name === "date")
          ?.contentFieldValue?.data;
        return dateStr ? new Date(dateStr) : new Date(0);
      };
      return getDate(b) - getDate(a);
    });
  };

  const currentBlogs = useMemo(() => {
    if (activeCategoryId === "latest") return sortByDate(blogs);
    if (!activeCategoryId) return [];
    const filtered = blogs.filter((blog) =>
      blog.taxonomyCategoryBriefs?.some(
        (brief) => String(brief.taxonomyCategoryId) === String(activeCategoryId)
      )
    );
    return sortByDate(filtered);
  }, [blogs, activeCategoryId]);

  /** Show loader while data is being fetched */
  if (loading) {
    return <div className="news-loading">Loading...</div>;
  }

  return (
    <div className="news-container doc-card">
      {/* Header */}
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        {/* <div className="d-flex align-items-center gap-8">
          <span>Tin tức - Sự kiện</span>
        </div> */}

        {/* Category Tabs */}
        <div className="news-tabs-wrapper">
          <span className="news-tabs-title">Tin tức - Sự kiện</span>
          <div className="news-tabs-scrollable">
            <button
              className={`news-tab-arrow news-tab-arrow-left${showLeftArrow ? " visible" : ""}`}
              onClick={() => scrollTabs(-1)}
            >‹</button>
            <div
              className="news-tabs-div"
              ref={tabsRef}
              onMouseDown={handleTabMouseDown}
              onMouseMove={handleTabMouseMove}
              onMouseUp={handleTabMouseUp}
              onMouseLeave={handleTabMouseUp}
            >
              <ul className="news-tabs">
                <li
                  className={activeCategoryId === "latest" ? "active" : ""}
                  onClick={() => { if (isTabClick()) setActiveCategoryId("latest"); }}
                >
                  Mới nhất
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className={activeCategoryId === cat.id ? "active" : ""}
                    onClick={() => { if (isTabClick()) setActiveCategoryId(cat.id); }}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={`news-tab-arrow news-tab-arrow-right${showRightArrow ? " visible" : ""}`}
              onClick={() => scrollTabs(1)}
            >›</button>
          </div>
        </div>
      </div>

      <div className="news-list p-8" style={{ opacity: fetching ? 0.4 : 1, transition: "opacity 0.2s" }}>
        {currentBlogs.map((blog) => {
          // console.log(blog);

          // const publishDate = blog.datePublished?.split("T")[0] ?? '';

          // const imageUrl = blog.image?.contentUrl;
          console.log(blog);
          
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

              <img src={imageUrl} alt="img" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default News;
