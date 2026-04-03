import "../styles/CategoryTabs.css";
import { useNavigate } from "react-router-dom";

const EXCLUDED_CATEGORY_IDS = ["1215636"];

const CategoryTabs = ({ tabs, activeCategoryId, onSelectCategory }) => {

    const navigate = useNavigate();

    const filteredTabs = tabs.filter(
        cat => !EXCLUDED_CATEGORY_IDS.includes(String(cat.id))
    );

    return (

        <div className="news-tabs-wrapper">

            {filteredTabs.map(cat => (

                <div
                    key={cat.id}
                    className={`news-tab ${String(activeCategoryId) === String(cat.id) ? "active" : ""}`}
                    onClick={() => {
                        if (onSelectCategory) onSelectCategory(cat.id);
                        navigate(`/web/guest/intranet/tin-tuc-su-kien/${cat.id}`);
                    }}
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