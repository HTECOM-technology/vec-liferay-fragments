import "../styles/WeeklyHot.css";
import { formatDate } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

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
              className="vec-weekly-item"
              onClick={() =>
                navigate(`/web/intranet/tin-tuc-su-kien/detail/${blog.id}`, {
                  state: {
                    categoryName:
                      blog.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryName
                  }
                })
              }
            >

              <div className="vec-weekly-item__image">
                <img src={fullImage} alt={blog.headline} />
              </div>

              <div className="vec-weekly-item__content">

                <div className="vec-weekly-item__title">
                  {blog.headline}
                </div>

                <div className="vec-weekly-item__category">
                  {blog.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryName}
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