import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { getCategoriesByVocabularyWithImage } from "../../../services/taxonomyService";
import {
  getStructuredContentsByCategory,
  getStructuredContentById,
} from "../../../services/structuredContentService";
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

  const [otherIndex, setOtherIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(null);

  const categoryName = location.state?.categoryName || "";

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const cats = await getCategoriesByVocabularyWithImage(VOCABULARY_ID);
      setCategories(cats);

      const targetArticle = await getStructuredContentById(id);
      setArticle(targetArticle);

      // WeeklyHot lấy toàn bộ category trong vocabulary
      const allItems = await Promise.all(
          cats.map((cat) => getStructuredContentsByCategory(cat.id))
      );

      const hot = allItems
          .flat()
          .filter((a) =>
              a.keywords?.some((k) => k.toLowerCase() === "nổi bật trong tuần")
          )
          .sort(
              (a, b) =>
                  new Date(b.dateCreated || b.datePublished) -
                  new Date(a.dateCreated || a.datePublished)
          )
          .slice(0, 5);

      setHotArticles(hot);

      // RelatedPosts vẫn lấy cùng category với bài đang xem
      const currentCategoryId =
          targetArticle?.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryId;

      if (currentCategoryId) {
        const sameCategory = await getStructuredContentsByCategory(
            currentCategoryId
        );

        const related = sameCategory
            .filter((a) => String(a.id) !== String(id))
            .sort(
                (a, b) =>
                    new Date(b.dateCreated || b.datePublished) -
                    new Date(a.dateCreated || a.datePublished)
            )
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
  const content =
      getContentField(article, "paragraphContent1")?.contentFieldValue?.data;

  const publishDate = formatDate(
      article.dateCreated || article.datePublished || date
  );

  const imageField = getContentField(article, "image");
  const imageUrl = imageField?.contentFieldValue?.image?.contentUrl || "";

  const otherImages =
      article.contentFields
          ?.filter((f) => f.name === "otherImages")
          ?.map((f) => f.contentFieldValue?.image?.contentUrl)
          ?.filter(Boolean) || [];

  const allImages = [imageUrl, ...otherImages].filter(Boolean);

  const visibleOtherImages =
      otherImages.length <= 2
          ? otherImages
          : [
            otherImages[otherIndex],
            otherImages[(otherIndex + 1) % otherImages.length],
          ];

  const prevOtherImage = () => {
    setOtherIndex((prev) => (prev === 0 ? otherImages.length - 1 : prev - 1));
  };

  const nextOtherImage = () => {
    setOtherIndex((prev) => (prev === otherImages.length - 1 ? 0 : prev + 1));
  };

  const openModal = (src) => {
    const index = allImages.findIndex((img) => img === src);
    if (index !== -1) {
      setModalIndex(index);
    }
  };

  const closeModal = () => {
    setModalIndex(null);
  };

  const prevModalImage = (e) => {
    e.stopPropagation();
    setModalIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextModalImage = (e) => {
    e.stopPropagation();
    setModalIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
      <div className="detail-wrapper">
        <div className="detail-top">
        <span className="detail-back" onClick={() => navigate(-1)}>
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

          <span className="detail-title-fixed">Chi tiết bài viết</span>
        </div>

        <div className="detail-layout">
          <div className="detail-left">
            <div className="article-title">{title}</div>

            <div className="article-meta">
              <span className="article-category">{categoryName}</span>
              <span className="article-dot">•</span>
              <span className="article-date">{publishDate}</span>
            </div>

            <div className="article-divider"></div>

            <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: content }}
            />

            <div className="article-images">
              {imageUrl && (
                  <div className="detail-article-image detail-article-image-large">
                    <img src={imageUrl} alt="" onClick={() => openModal(imageUrl)} />
                  </div>
              )}

              {otherImages.length > 0 && (
                  <div className="detail-other-slider">
                    {otherImages.length > 2 && (
                        <button
                            type="button"
                            className="detail-slider-arrow detail-slider-prev"
                            onClick={prevOtherImage}
                            aria-label="Ảnh trước"
                        />
                    )}

                    {visibleOtherImages.map((img, index) => (
                        <div
                            className="detail-article-image detail-article-image-small"
                            key={`${img}-${index}`}
                        >
                          <img src={img} alt="" onClick={() => openModal(img)} />
                        </div>
                    ))}

                    {otherImages.length > 2 && (
                        <button
                            type="button"
                            className="detail-slider-arrow detail-slider-next"
                            onClick={nextOtherImage}
                            aria-label="Ảnh sau"
                        />
                    )}
                  </div>
              )}
            </div>
          </div>

          <div className="detail-right">
            <SubCategoryTabsDetail tabs={categories} />
            <WeeklyHot blogs={hotArticles} />
          </div>
        </div>

        <div className="related-wrapper">
          <RelatedPosts blogs={relatedArticles} />
        </div>

        {modalIndex !== null && (
            <div className="detail-image-modal" onClick={closeModal}>
              <button
                  type="button"
                  className="detail-modal-prev"
                  onClick={prevModalImage}
                  aria-label="Ảnh trước"
              />

              <img
                  className="detail-modal-preview"
                  src={allImages[modalIndex]}
                  alt=""
                  onClick={(e) => e.stopPropagation()}
              />

              <button
                  type="button"
                  className="detail-modal-next"
                  onClick={nextModalImage}
                  aria-label="Ảnh sau"
              />
            </div>
        )}
      </div>
  );
};

export default TinTucDetailPage;