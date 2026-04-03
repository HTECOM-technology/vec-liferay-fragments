import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getVocabulariesBySite,
  getCategoriesByVocabulary,
} from "../../../services/taxonomyService";

import { getAllBlogBySiteId } from "../../../services/blogService";

import CategoryTabs from "../components/CategoryTabs";
import NewsList from "../components/NewsList";
import WeeklyHot from "../components/WeeklyHot";

import "../styles/News.css";
import "../styles/NewsMobie.css";

const PAGE_SIZE = 10;

const SITE_ID = 20117;
const VOCABULARY_NAME = "tin bài";

const News = () => {

  const navigate = useNavigate();
  const { slug } = useParams();

  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortType, setSortType] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  /*
  =================
  LOAD DATA
  =================
  */

  useEffect(() => {
    loadInitialData();
  }, [slug]);

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

      const defaultCategoryId = slug || cats[0]?.id;

      setActiveCategoryId(defaultCategoryId);

      const blogsResponse = await getAllBlogBySiteId(SITE_ID);

      setBlogs(blogsResponse);

    } catch (e) {

      console.error(e);

    } finally {

      setLoading(false);

    }

  };

  /*
  =================
  FAKE IMAGE CATEGORY
  =================
  */

  const CATEGORY_TABS = [
    {
      id: 1135259,
      name: "Thông báo",
      link: "/documents/1029373/1134436/Thong_bao.png/23737b73-90d1-eb04-c629-67bdab965886",
    },
    {
      id: 1135262,
      name: "Đại hội Đảng 2025 - 2030",
      link: "/documents/1029373/1134436/Dai_hoi_dang.png/ceb20db6-0ff6-21d7-15ab-bbe7340a6fe8",
    },
    {
      id: 1135265,
      name: "Hoạt động TCT",
      link: "/documents/1029373/1134436/Hoat_dong_TCT.png/a49000ae-d48a-8659-0a26-e785298d5e44",
    },
    {
      id: 1135268,
      name: "Hoạt động CT thành viên",
      link: "/documents/1029373/1134436/Hoat_dong_CT_thanh_vien.png/d706dd15-5944-36f1-3588-e3fe7684320a",
    },
    {
      id: 1135271,
      name: "Chuyển đổi số",
      link: "/documents/1029373/1134436/Chuyen_doi_so.png/5eeb66e1-c6fb-34f5-5fb4-e2d6c270b8e4",
    },
    {
      id: 1135274,
      name: "Tin hiện trường",
      link: "/documents/1029373/1134436/Tin_hien_truong.png/1ef7c0c4-3dca-5008-cf5c-e8a6a1405770",
    }
  ];

  /*
  =================
  CATEGORY NAME
  =================
  */

  const activeCategoryName = useMemo(() => {

    const tab = CATEGORY_TABS.find(
      (c) => String(c.id) === String(activeCategoryId)
    );

    if (tab) return tab.name;

    return categories.find(
      (c) => String(c.id) === String(activeCategoryId)
    )?.name || "";

  }, [categories, activeCategoryId]);

  /*
  =================
  FILTER BLOG
  =================
  */

  const currentBlogs = useMemo(() => {

    if (!activeCategoryId) return [];

    let filtered = blogs.filter((blog) =>
      blog.taxonomyCategoryBriefs?.some(
        (brief) =>
          String(brief.taxonomyCategoryId) === String(activeCategoryId)
      )
    );

    filtered.sort((a, b) => {

      const dateA = new Date(a.datePublished);
      const dateB = new Date(b.datePublished);

      if (sortType === "newest") return dateB - dateA;

      return dateA - dateB;

    });

    return filtered;

  }, [blogs, activeCategoryId, sortType]);

  /*
  =================
  HOT BLOG
  =================
  */

  const hotBlogs = useMemo(() => {

    return blogs
      .filter(blog =>
        blog.keywords?.some(
          k => k.toLowerCase() === "tin hot"
        )
      )
      .sort(
        (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
      )
      .slice(0, 5);

  }, [blogs]);

  /*
  =================
  PAGINATION
  =================
  */

  const totalPages = Math.ceil(currentBlogs.length / PAGE_SIZE);

  const paginatedBlogs = useMemo(() => {

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return currentBlogs.slice(start, end);

  }, [currentBlogs, currentPage]);

  if (loading) return <div>Loading...</div>;

  return (

    <div className="news-wrapper">

      {/* CATEGORY TABS */}

      <CategoryTabs
        tabs={CATEGORY_TABS?.length ? CATEGORY_TABS : categories}
        activeCategoryId={activeCategoryId}
      />

      {/* MAIN LAYOUT */}

      <div className="news-layout">

        {/* LEFT */}

        <div className="news-main">

          <div className="news-header">

            <div className="news-section-title">
              {activeCategoryName}
            </div>

            <select
              className="news-sort"
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

          <NewsList
            blogs={paginatedBlogs}
            categoryName={activeCategoryName}
            categoryId={activeCategoryId}
          />

          {/* PAGINATION */}

          <div className="news-pagination">

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

        <div className="news-sidebar">

          <WeeklyHot blogs={hotBlogs} />

        </div>

      </div>

    </div>

  );

};

export default News;