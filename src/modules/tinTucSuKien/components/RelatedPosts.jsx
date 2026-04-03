import "../styles/RelatedPosts.css";
import { formatDate } from "../../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

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
                            className="related-card"
                            onClick={() => navigate(`/web/intranet/tin-tuc-su-kien/detail/${blog.id}`, {
                                state: {
                                    categoryName:
                                        blog.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryName
                                }
                            })
                            }
                        >

                            <div className="related-card-image">
                                <img src={fullImage} alt={blog.headline} />
                            </div>

                            <div className="related-card-title">
                                {blog.headline}
                            </div>

                            <div className="related-card-meta">

                                <span className="related-card-category">
                                    {blog.taxonomyCategoryBriefs?.[0]?.taxonomyCategoryName}
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