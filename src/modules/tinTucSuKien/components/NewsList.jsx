import "../styles/NewsList.css";
import { formatDate } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const getContentField = (article, fieldName) => {
  return article.contentFields?.find((f) => f.name === fieldName);
};

const NewsList = ({ blogs, categoryName, categoryId }) => {

  const navigate = useNavigate();

  return (

      <div className="news-list ttsk">

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
                  className="news-item ttsk"
                  onClick={() =>
                      navigate(`/web/guest/intranet/tin-tuc-su-kien/${categoryId}/${article.id}`, { state: { categoryName } })
                  }
              >

                <div className="news-left ttsk">

                  <h3 className="news-title ttsk">
                    {title}
                  </h3>

                  <p className="news-desc ttsk">
                    {shortDescription}
                  </p>

                  <div className="news-meta ttsk">

                <span className="news-category ttsk">
                  {categoryName}
                </span>

                    <span className="news-dot ttsk"></span>

                    <span className="news-date ttsk">
                  {publishDate}
                </span>

                  </div>

                </div>

                <div className="news-image ttsk">
                  {imageUrl && (
                      <img
                          className="news-image ttsk"
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