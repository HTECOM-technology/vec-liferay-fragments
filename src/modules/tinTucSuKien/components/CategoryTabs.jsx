import "../styles/CategoryTabs.css";
import { useNavigate } from "react-router-dom";

const CategoryTabs = ({ tabs, activeCategoryId }) => {

    const navigate = useNavigate();

    return (

        <div className="news-tabs-wrapper">

            {tabs.map(cat => (

                <div
                    key={cat.id}
                    className={`news-tab ${String(activeCategoryId) === String(cat.id) ? "active" : ""
                        }`}
                    onClick={() =>
                        navigate(`/web/intranet/tin-tuc-su-kien/${cat.id}`)
                    }
                >

                    <img
                        className="news-tab-bg"
                        src={cat.link || ""}
                        alt={cat.name}
                    />

                    <span className="news-tab-title">
                        {cat.name}
                    </span>

                </div>

            ))}

        </div>

    );

};

export default CategoryTabs;