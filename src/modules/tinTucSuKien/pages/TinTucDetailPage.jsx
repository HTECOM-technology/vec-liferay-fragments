import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { getCategoriesByVocabulary } from "../../../services/taxonomyService";
import { getStructuredContentsByCategory, getStructuredContentById } from "../../../services/structuredContentService";
import { formatDate } from "../../../utils/dateUtils";
import WeeklyHot from "../components/WeeklyHot";

import "../styles/Detail.css";
import SubCategoryTabsDetail from "../components/SubCategoryTabsDetail";
import RelatedPosts from "../components/RelatedPosts";

const VOCABULARY_ID = 1215209;

const getContentField = (article, fieldName) => {
  return article?.contentFields?.find((f) => f.name === fieldName);
};

const TinTucDetailPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [article, setArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [hotArticles, setHotArticles] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);

  const categoryName = location.state?.categoryName || "";

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {

    try {

      // Load categories để dùng cho tabs + related
      const cats = await getCategoriesByVocabulary(VOCABULARY_ID);
      setCategories(cats);

      // Load bài viết hiện tại theo id
      const targetArticle = await getStructuredContentById(id);
      setArticle(targetArticle);

      // Lấy categoryId đầu tiên của bài viết
      const currentCategoryId = targetArticle?.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryId;

      if (currentCategoryId) {

        // Load bài viết cùng category
        const sameCategory = await getStructuredContentsByCategory(currentCategoryId);

        // Hot articles
        const hot = sameCategory
            .filter((a) =>
                a.keywords?.some((k) => k.toLowerCase() === "tin hot")
            )
            .sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished))
            .slice(0, 5);
        setHotArticles(hot);

        // Related articles (bỏ bài hiện tại)
        const related = sameCategory
            .filter((a) => String(a.id) !== String(id))
            .sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished))
            .slice(0, 4);
        setRelatedArticles(related);

      }

    } catch (e) {
      console.error(e);
    }

  };

  if (!article) return <div>Loading...</div>;

  const title = getContentField(article, "title")?.contentFieldValue?.data;
  const date = getContentField(article, "date")?.contentFieldValue?.data;
  const content = getContentField(article, "paragraphContent1")?.contentFieldValue?.data;
  const publishDate = formatDate(date || article.datePublished);

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
              {title}
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
                dangerouslySetInnerHTML={{ __html: content }}
            />

          </div>

          {/* RIGHT */}

          <div className="detail-right">

            <SubCategoryTabsDetail tabs={categories} />

            <WeeklyHot blogs={hotArticles} />

          </div>

        </div>

        {/* ===== BOTTOM ===== */}

        <div className="related-wrapper">
          <RelatedPosts blogs={relatedArticles} />
        </div>

      </div>

  );

};

export default TinTucDetailPage;