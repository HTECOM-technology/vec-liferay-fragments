import "../styles/NewsList.css";
import { formatDate } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const NewsList = ({
  blogs,
  categoryName,
  categoryId
}) => {

  const navigate = useNavigate();

  return (

    <div className="news-list">

      {blogs.map(blog => {

        const publishDate = formatDate(blog.datePublished);

        const imageUrl = blog.image?.contentUrl;

        const fullImage =
          imageUrl?.startsWith("http")
            ? imageUrl
            : `${window.location.origin}${imageUrl}`;

        return (

          <div
            key={blog.id}
            className="news-item"
            onClick={() =>
              navigate(`/web/intranet/tin-tuc-su-kien/${categoryId}/${blog.id}`, { state: { categoryName } })
            }
          >

            <div className="news-left">

              <h3 className="news-title">
                {blog.headline}
              </h3>

              <p className="news-desc">
                {blog.alternativeHeadline}
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
                  alt={blog.caption}
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