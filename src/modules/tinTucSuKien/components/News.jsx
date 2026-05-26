import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { getCategoriesByVocabularyWithImage } from "../../../services/taxonomyService";
import { getStructuredContentsByCategory } from "../../../services/structuredContentService";

import CategoryTabs from "../components/CategoryTabs";
import NewsList from "../components/NewsList";
import WeeklyHot from "../components/WeeklyHot";

import "../styles/News.css";
import "../styles/NewsMobie.css";

const PAGE_SIZE = 10;
const VOCABULARY_ID = 1215209;

const News = () => {

  const { slug } = useParams();

  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);

  const [sortType, setSortType] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [hotArticles, setHotArticles] = useState([]);

  /*
  =================
  LOAD CATEGORIES
  =================
  */

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);

        const cats = await getCategoriesByVocabularyWithImage(VOCABULARY_ID);
        setCategories(cats);

        const defaultId = slug || cats[0]?.id;
        setActiveCategoryId(defaultId);

        const allItems = await Promise.all(
          cats.map((cat) => getStructuredContentsByCategory(cat.id))
        );

        const weeklyHot = allItems
          .flat()
          .filter((a) =>
            a.keywords?.some((k) => k.toLowerCase() === "nổi bật trong tuần")
          )
          .sort((a, b) => new Date(b.dateCreated || b.datePublished) - new Date(a.dateCreated || a.datePublished))
          .slice(0, 5);

        setHotArticles(weeklyHot);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [slug]);

  /*
  =================
  LOAD ARTICLES THEO CATEGORY
  =================
  */

  useEffect(() => {
    if (!activeCategoryId) return;

    const loadArticles = async () => {
      try {
        setLoadingArticles(true);
        setCurrentPage(1);
        const items = await getStructuredContentsByCategory(activeCategoryId);
        setArticles(items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingArticles(false);
      }
    };

    loadArticles();
  }, [activeCategoryId]);

  /*
  =================
  CATEGORY NAME
  =================
  */

  const activeCategoryName = useMemo(() => {
    return categories.find(
      (c) => String(c.id) === String(activeCategoryId)
    )?.name || "";
  }, [categories, activeCategoryId]);

  /*
  =================
  SORT ARTICLES
  =================
  */

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const dateA = new Date(a.dateCreated || a.datePublished);
      const dateB = new Date(b.dateCreated || b.datePublished);
      return sortType === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [articles, sortType]);

  /*
  =================
  HOT ARTICLES
  =================
  */

  // const hotArticles = useMemo(() => {
  //   return articles
  //     .filter((a) =>
  //       a.keywords?.some((k) => k.toLowerCase() === "nổi bật trong tuần")
  //     )
  //     .sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished))
  //     .slice(0, 5);
  // }, [articles]);



  /*
  =================
  PAGINATION
  =================
  */

  const totalPages = Math.ceil(sortedArticles.length / PAGE_SIZE);

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedArticles.slice(start, start + PAGE_SIZE);
  }, [sortedArticles, currentPage]);

  if (loading) return <div>Loading...</div>;

  return (

    <div className="news-wrapper">

      {/* CATEGORY TABS */}

      <CategoryTabs
        tabs={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={(id) => {
          setActiveCategoryId(id);
          setCurrentPage(1);
        }}
      />

      {/* MAIN LAYOUT */}

      <div className="news-layout ttsk">

        {/* LEFT */}

        <div className="news-main ttsk">

          <div className="news-header ttsk">

            <div className="news-section-title ttsk">
              {activeCategoryName}
            </div>

            <select
              className="news-sort ttsk"
              value={sortType}
              onChange={(e) => {
                setSortType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>

          </div>

          {/* NEWS LIST */}

          {loadingArticles ? (
            <div>Đang tải bài viết...</div>
          ) : (
            <NewsList
              blogs={paginatedArticles}
              categoryName={activeCategoryName}
              categoryId={activeCategoryId}
            />
          )}

          {/* PAGINATION */}

          <div className="news-pagination ttsk">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              ›
            </button>

          </div>

        </div>

        {/* SIDEBAR */}

        <div className="news-sidebar ttsk">
          <WeeklyHot blogs={hotArticles} />
        </div>

      </div>

    </div>

  );

};

export default News;
