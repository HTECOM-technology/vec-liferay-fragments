import "../styles/WeeklyHot.css";
import { formatDate } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCategoriesByVocabulary } from "../../../services/taxonomyService";

const VOCABULARY_ID = 1215209;

const getContentField = (article, fieldName) => {
    return article?.contentFields?.find((f) => f.name === fieldName);
};

const WeeklyHot = ({ blogs }) => {
    const navigate = useNavigate();
    const [vocabularyCategories, setVocabularyCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesByVocabulary(VOCABULARY_ID);
                setVocabularyCategories(data || []);
            } catch (error) {
                console.error("Lỗi lấy category vocabulary:", error);
            }
        };

        fetchCategories();
    }, []);

    const vocabularyCategoryIds = vocabularyCategories.map((c) => Number(c.id));

    return (
        <div className="vec-weekly-container">
            <div className="vec-weekly-header">
                <h2 className="vec-weekly-header__title">
                    Nổi bật trong tuần
                </h2>
            </div>

            <div className="vec-weekly-list">
                {blogs.map((article) => {
                    const title = getContentField(article, "title")?.contentFieldValue?.data;
                    const imageUrl = getContentField(article, "image")?.contentFieldValue?.image?.contentUrl;

                    const category = article.taxonomyCategoryBriefs?.find((c) =>
                        vocabularyCategoryIds.includes(Number(c.taxonomyCategoryId))
                    );

                    const categoryName = category?.taxonomyCategoryName;

                    const date = getContentField(article, "date")?.contentFieldValue?.data;

                    const publishDate = formatDate(
                        article.dateCreated || article.datePublished || date
                    );

                    const fullImage = imageUrl?.startsWith("http")
                        ? imageUrl
                        : `${window.location.origin}${imageUrl}`;

                    return (
                        <div
                            key={article.id}
                            className="vec-weekly-item"
                            onClick={() =>
                                navigate(`/tin-tuc-su-kien/detail/${article.id}`, {
                                    state: { categoryName }
                                })
                            }
                        >
                            <div className="vec-weekly-item__image">
                                <img src={fullImage} alt={title} />
                            </div>

                            <div className="vec-weekly-item__content">
                                <div className="vec-weekly-item__title">
                                    {title}
                                </div>

                                <div className="vec-weekly-item__category">
                                    {categoryName}
                                </div>

                                <div className="vec-weekly-item__date">
                                    {publishDate}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <svg width="0" height="0">
                <defs>
                    <clipPath id="myClip" clipPathUnits="objectBoundingBox">
                        <path d="M 0,0 L 0.8,0 Q 0.85,0.05 1,1 L 0,1 Z" />
                    </clipPath>
                </defs>
            </svg>

            <div className="decorative-bar">
                <div className="bar-left"></div>
                <div className="bar-right"></div>
            </div>
        </div>
    );
};

export default WeeklyHot;