import "../styles/NewsList.css";
import { formatDate } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const getContentField = (article, fieldName) => {
  return article.contentFields?.find((f) => f.name === fieldName);
};

const NewsList = ({ blogs, categoryName, categoryId }) => {

  const navigate = useNavigate();

  return (

      <div className="news-list">

        {blogs.map((article) => {

          const title = getContentField(article, "title")?.contentFieldValue?.data;
          const shortDescription = getContentField(article, "shortDescription")?.contentFieldValue?.data;
          const imageUrl = getContentField(article, "image")?.contentFieldValue?.image?.contentUrl;
          const date = getContentField(article, "date")?.contentFieldValue?.data;

          const publishDate = formatDate(date || article.datePublished);

          const fullImage = imageUrl?.startsWith("http")
              ? imageUrl
              : `${window.location.origin}${imageUrl}`;

          return (

              <div
                  key={article.id}
                  className="news-item"
                  onClick={() =>
                      navigate(`/web/intranet/tin-tuc-su-kien/${categoryId}/${article.id}`, { state: { categoryName } })
                  }
              >

                <div className="news-left">

                  <h3 className="news-title">
                    {title}
                  </h3>

                  <p className="news-desc">
                    {shortDescription}
                  </p>

                  <div className="news-meta">

                <span className="news-category">
                  {categoryName}
                </span>

                    <span className="news-dot"></span>

                    <span className="news-date">
                  {publishDate}
                </span>

                  </div>

                </div>

                <div className="news-image">
                  {imageUrl && (
                      <img
                          className="news-image"
                          src={fullImage}
                          alt={title}
                      />
                  )}
                </div>

              </div>

          );

        })}

      </div>

  );

};

export default NewsList;