import "../styles/RelatedPosts.css";
import { formatDate } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const getContentField = (article, fieldName) => {
    return article?.contentFields?.find((f) => f.name === fieldName);
};

const RelatedPosts = ({ blogs }) => {

    const navigate = useNavigate();

    return (

        <div className="related-section">

            <div className="related-header">

                <h2 className="related-title">
                    Bài viết cùng chủ đề
                </h2>

                <div className="related-line"></div>

            </div>

            <div className="related-grid">

                {blogs.map((article) => {

                    const title = getContentField(article, "title")?.contentFieldValue?.data;
                    const imageUrl = getContentField(article, "image")?.contentFieldValue?.image?.contentUrl;
                    const date = getContentField(article, "date")?.contentFieldValue?.data;
                    const categoryName = article.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryName;

                    const publishDate = formatDate(date || article.datePublished);

                    const fullImage = imageUrl?.startsWith("http")
                        ? imageUrl
                        : `${window.location.origin}${imageUrl}`;

                    return (

                        <div
                            key={article.id}
                            className="related-card"
                            onClick={() =>
                                navigate(`/tin-tuc-su-kien/detail/${article.id}`, {
                                    state: { categoryName }
                                })
                            }
                        >

                            <div className="related-card-image">
                                <img src={fullImage} alt={title} />
                            </div>

                            <div className="related-card-title">
                                {title}
                            </div>

                            <div className="related-card-meta">

                                <span className="related-card-category">
                                    {categoryName}
                                </span>

                                <span className="related-card-dot">•</span>

                                <span className="related-card-date">
                                    {publishDate}
                                </span>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

};

export default RelatedPosts;