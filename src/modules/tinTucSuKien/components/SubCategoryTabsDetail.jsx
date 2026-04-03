import "../styles/SubCategoryTabsDetail.css";
import { useNavigate } from "react-router-dom";

const SubCategoryTabsDetail = ({ tabs }) => {

    const navigate = useNavigate();

    return (

        <div className="vec-subcategory-container">

            <div className="vec-subcategory-header">
                <h2 className="vec-subcategory-title">
                    Các chủ đề khác
                </h2>
            </div>

            <div className="vec-subcategory-list">

                {tabs.map(cat => (

                    <div
                        key={cat.id}
                        className="vec-subcategory-item"
                        onClick={() =>
                            navigate(`/web/guest/intranet/tin-tuc-su-kien/${cat.id}`)
                        }
                    >

                        <img
                            className="vec-subcategory-bg"
                            src={cat.link}
                            alt={cat.name}
                        />

                        <div className="vec-subcategory-overlay"></div>

                        <div className="vec-subcategory-text">
                            {cat.name}
                        </div>

                    </div>

                ))}

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

export default SubCategoryTabsDetail;