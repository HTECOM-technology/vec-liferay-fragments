import "../styles/WeeklyHot.css";
import { formatDate } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const getContentField = (article, fieldName) => {
    return article?.contentFields?.find((f) => f.name === fieldName);
};

const WeeklyHot = ({ blogs }) => {

    const navigate = useNavigate();

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
                    const date = getContentField(article, "date")?.contentFieldValue?.data;
                    const categoryName = article.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryName;

                    const publishDate = formatDate(date || article.datePublished);

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

            {/* SVG clip path */}
            <svg width="0" height="0">
                <defs>
                    <clipPath id="myClip" clipPathUnits="objectBoundingBox">
                        <path d="M 0,0 L 0.8,0 Q 0.85,0.05 1,1 L 0,1 Z" />
                    </clipPath>
                </defs>
            </svg>

            {/* decorative bar */}
            <div className="decorative-bar">
                <div className="bar-left"></div>
                <div className="bar-right"></div>
            </div>

        </div>

    );

};

export default WeeklyHot;