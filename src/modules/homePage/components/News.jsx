import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Select } from "antd";
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

  const isTabClick = () => dragDistance.current < 5;

  const smoothScroll = (el, targetLeft, duration = 500) => {
    const target = Math.round(targetLeft);
    const start = el.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) {
      requestAnimationFrame(checkArrows);
      return;
    }
    const startTime = performance.now();
    const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      el.scrollLeft = start + distance * easeInOut(progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.scrollLeft = target;
        requestAnimationFrame(checkArrows);
      }
    };
    requestAnimationFrame(step);
  };

  const scrollToTab = (tabEl) => {
    if (!tabEl || !tabsRef.current) return;
    const container = tabsRef.current;
    const tabLeft = tabEl.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft;
    const target = tabLeft - container.clientWidth / 2 + tabEl.offsetWidth / 2;
    smoothScroll(container, Math.max(0, target));
  };

  const scrollTabs = (direction) => {
    const el = tabsRef.current;
    if (!el) return;
    smoothScroll(el, el.scrollLeft + direction * 160);
  };

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
    if (activeCategoryId === "latest") return sortByDate(blogs).slice(0, 5);
    if (!activeCategoryId) return [];
    const filtered = blogs.filter((blog) =>
      blog.taxonomyCategoryBriefs?.some(
        (brief) => String(brief.taxonomyCategoryId) === String(activeCategoryId)
      )
    );
    return sortByDate(filtered).slice(0, 5);
  }, [blogs, activeCategoryId]);


  /** Show loader while data is being fetched */
  if (loading) {
    return <div className="news-loading">Loading...</div>;
  }

  return (
    <div className="news-container doc-card">
      {/* Header — desktop: tabs cuộn; mobile: Select dropdown */}
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <div className="news-tabs-wrapper">
          <span className="news-tabs-title">Tin tức - Sự kiện</span>

          {/* Desktop tabs */}
          <div className="news-tabs-scrollable">
            <button
              className={`news-tab-arrow news-tab-arrow-left${showLeftArrow ? " visible" : ""}`}
              onClick={() => scrollTabs(-1)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.8051 5.40705C15.4776 4.96235 14.8516 4.86736 14.4069 5.19488C14.0615 5.44927 13.7332 5.70372 13.4472 5.92689C12.8764 6.3724 12.1118 6.98572 11.3444 7.65208C10.5819 8.31412 9.79361 9.04815 9.18811 9.73344C8.88637 10.0749 8.60888 10.4279 8.4014 10.7721C8.21046 11.0888 8 11.524 8 12.0001C8 12.4762 8.21046 12.9115 8.4014 13.2282C8.60888 13.5724 8.88637 13.9253 9.18811 14.2668C9.79361 14.9521 10.5819 15.6861 11.3444 16.3482C12.1118 17.0145 12.8764 17.6278 13.4472 18.0734C13.7332 18.2965 14.0615 18.551 14.4069 18.8054C14.8516 19.1329 15.4776 19.0379 15.8051 18.5932C15.9368 18.4144 16.0002 18.2064 16 18.0002V12.0001V6.00007C16.0002 5.79387 15.9368 5.58581 15.8051 5.40705Z" fill="#141B34"/></svg>
            </button>
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
                  onClick={(e) => { if (isTabClick()) { setActiveCategoryId("latest"); scrollToTab(e.currentTarget); } }}
                >
                  Mới nhất
                </li>
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className={activeCategoryId === String(cat.id) ? "active" : ""}
                    onClick={(e) => { if (isTabClick()) { setActiveCategoryId(String(cat.id)); scrollToTab(e.currentTarget); } }}
                  >
                    {cat.name}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={`news-tab-arrow news-tab-arrow-right${showRightArrow ? " visible" : ""}`}
              onClick={() => scrollTabs(1)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.19486 5.40705C8.52237 4.96235 9.14837 4.86736 9.59306 5.19488C9.93847 5.44927 10.2668 5.70372 10.5528 5.92689C11.1236 6.3724 11.8882 6.98573 12.6556 7.65208C13.4181 8.31412 14.2064 9.04815 14.8119 9.73344C15.1136 10.0749 15.3911 10.4279 15.5986 10.7721C15.7895 11.0888 16 11.524 16 12.0001C16 12.4762 15.7895 12.9115 15.5986 13.2282C15.3911 13.5724 15.1136 13.9253 14.8119 14.2668C14.2064 14.9521 13.4181 15.6861 12.6556 16.3482C11.8882 17.0145 11.1236 17.6278 10.5528 18.0734C10.2668 18.2965 9.93847 18.551 9.59307 18.8054C9.14837 19.1329 8.52237 19.0379 8.19486 18.5932C8.0632 18.4144 7.99983 18.2064 8.00001 18.0002L8 12.0001L8 6.00007C7.99983 5.79387 8.0632 5.58581 8.19486 5.40705Z" fill="#141B34"/></svg>
            </button>
          </div>

          {/* Mobile select */}
          <Select
            className="news-mobile-select"
            value={activeCategoryId}
            onChange={(val) => setActiveCategoryId(val)}
            popupMatchSelectWidth={false}
            options={[
              { value: "latest", label: "Mới nhất" },
              ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
            ]}
          />
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
