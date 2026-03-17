import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { getAllBlogBySiteId } from "../../../services/blogService";
import { formatDate } from "../../../utils/dateUtils";
import WeeklyHot from "../components/WeeklyHot";

import "../styles/Detail.css";
import SubCategoryTabsDetail from "../components/SubCategoryTabsDetail";
import RelatedPosts from "../components/RelatedPosts";

const SITE_ID = 1029373;

const CATEGORY_TABS = [
  {
    id: 1135259,
    name: "Thông báo",
    link: "/documents/1029373/1134436/Thong_bao.png/23737b73-90d1-eb04-c629-67bdab965886"
  },
  {
    id: 1135262,
    name: "Đại hội Đảng 2025 - 2030",
    link: "/documents/1029373/1134436/Dai_hoi_dang.png/ceb20db6-0ff6-21d7-15ab-bbe7340a6fe8"
  },
  {
    id: 1135265,
    name: "Hoạt động TCT",
    link: "/documents/1029373/1134436/Hoat_dong_TCT.png/a49000ae-d48a-8659-0a26-e785298d5e44"
  },
  {
    id: 1135268,
    name: "Hoạt động CT thành viên",
    link: "/documents/1029373/1134436/Hoat_dong_CT_thanh_vien.png/d706dd15-5944-36f1-3588-e3fe7684320a"
  },
  {
    id: 1135271,
    name: "Chuyển đổi số",
    link: "/documents/1029373/1134436/Chuyen_doi_so.png/5eeb66e1-c6fb-34f5-5fb4-e2d6c270b8e4"
  },
  {
    id: 1135274,
    name: "Tin hiện trường",
    link: "/documents/1029373/1134436/Tin_hien_truong.png/1ef7c0c4-3dca-5008-cf5c-e8a6a1405770"
  }
];

const TinTucDetailPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [article, setArticle] = useState(null);
  const [hotBlogs, setHotBlogs] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  const categoryName = location.state?.categoryName || "";

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {

    try {

      const blogs = await getAllBlogBySiteId(SITE_ID);

      const targetBlog = blogs.find(
        blog => String(blog.id) === String(id)
      );

      setArticle(targetBlog);

      const hot = blogs
        .filter(blog =>
          blog.keywords?.some(
            k => k.toLowerCase() === "tin hot"
          )
        )
        .sort(
          (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
        )
        .slice(0, 5);

      setHotBlogs(hot);

      const currentCategory =
        targetBlog.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryName;

      const related = blogs
        .filter(blog =>
          blog.id !== targetBlog.id &&
          blog.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryName === currentCategory
        )
        .sort(
          (a, b) => new Date(b.datePublished) - new Date(a.datePublished)
        )
        .slice(0, 4);

      setRelatedBlogs(related);

    } catch (e) {

      console.error(e);

    }

  };

  if (!article) return <div>Loading...</div>;

  const publishDate = formatDate(article.datePublished);

  return (

    <div className="detail-wrapper">

      {/* ===== TOP ===== */}

      <div className="detail-top">

        <span
          className="detail-back"
          onClick={() => navigate(-1)}
        >

          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="#1E1E1E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

        </span>

        <span className="detail-title-fixed">
          Chi tiết bài viết
        </span>

      </div>

      {/* ===== MIDDLE ===== */}

      <div className="detail-layout">

        {/* LEFT */}

        <div className="detail-left">

          <div className="article-title">
            {article.headline}
          </div>

          <div className="article-meta">

            <span className="article-category">
              {categoryName}
            </span>

            <span className="article-dot">•</span>

            <span className="article-date">
              {publishDate}
            </span>

          </div>

          <div className="article-divider"></div>

          <div
            className="article-content"
            dangerouslySetInnerHTML={{
              __html: article.articleBody
            }}
          />

        </div>

        {/* RIGHT */}

        <div className="detail-right">

          <SubCategoryTabsDetail
            tabs={CATEGORY_TABS}
          />

          <WeeklyHot
            blogs={hotBlogs}
          />

        </div>

      </div>

      {/* ===== BOTTOM ===== */}

      <div className="related-wrapper">
        <RelatedPosts blogs={relatedBlogs} />
      </div>

    </div>

  );

};

export default TinTucDetailPage;