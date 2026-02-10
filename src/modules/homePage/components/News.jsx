import { useEffect, useState } from "react";
import {
  getVocabulariesBySite,
  getCategoriesByVocabulary,
} from "../services/taxonomyService";
import {
  getContentStructures,
  getStructuredContents,
} from "../services/contentService";
import "../styles/News.css";
import { getFieldValue } from "../utils/contentFieldUtils";
import tintukIcon from "../assets/camera/tintukIcon.svg";
/**
 * News Component
 *
 * Renders a list of news articles fetched from Liferay Headless APIs.
 *
 * Features:
 * - Loads taxonomy categories for tab-based filtering
 * - Fetches structured content using a specific content structure
 * - Reloads articles when the active category changes
 *
 * Data Sources:
 * - Taxonomy Vocabulary: "News Article Types"
 * - Content Structure: "NEWS_ARTICLES"
 *
 * @component
 * @returns {JSX.Element}
 */
const News = () => {

  /** List of taxonomy categories */
  const [categories, setCategories] = useState([]);

  /** Currently selected taxonomy category ID */
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  /** List of fetched news articles */
  const [articles, setArticles] = useState([]);

  /** Loading indicator */
  const [loading, setLoading] = useState(true);

  /** Content structure ID used to fetch articles */
  const [structureId, setStructureId] = useState(null);


  /** Liferay Site (Group) ID */
  // const SITE_ID = window.Liferay.ThemeDisplay.getSiteGroupId();
  const SITE_ID = 20117; // This is site Id of internet site to fetch tin tuk from that site

  /** Target taxonomy vocabulary name */
  const VOCABULARY_NAME = "News Article Types";

  /** Target content structure name */
  const STRUCTURE_NAME = "NEWS_ARTICLES";


  /**
   * Load all initial data on component mount:
   * - Taxonomy categories
   * - Content structure
   * - Default category articles
   */
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Reload articles when:
   * - Active category changes
   * - Structure ID becomes available
   */
  useEffect(() => {
    if (!structureId || !activeCategoryId) return;

    const loadByCategory = async () => {
      setLoading(true);
      const contents = await getStructuredContents(
        structureId,
        activeCategoryId
      );
      setArticles(contents);
      setLoading(false);
    };

    loadByCategory();
  }, [activeCategoryId, structureId]);


  /**
   * Loads all required data for the News component.
   *
   * Steps:
   * 1. Fetch taxonomy vocabularies and categories
   * 2. Fetch content structures
   * 3. Fetch structured content for the default category
   */
  const loadInitialData = async () => {
    try {
      setLoading(true);

      /* 1. Load taxonomy categories */
      const vocabularies = await getVocabulariesBySite(SITE_ID);
      const targetVocabulary = vocabularies.find(
        (v) => v.name === VOCABULARY_NAME
      );

      if (!targetVocabulary) return;

      const cats = await getCategoriesByVocabulary(targetVocabulary.id);
      setCategories(cats);

      const defaultCategoryId = cats[0]?.id;
      setActiveCategoryId(defaultCategoryId);

      /* 2. Load content structure */
      const structures = await getContentStructures(SITE_ID);
      const newsStructure = structures.find(
        (s) => s.name === STRUCTURE_NAME
      );

      if (!newsStructure) return;

      setStructureId(newsStructure.id);

      /* 3. Load articles for default category */
      const contents = await getStructuredContents(
        newsStructure.id,
        defaultCategoryId
      );
      setArticles(contents);
    } catch (error) {
      console.error("Error loading news data:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Show loader while data is being fetched */
  if (loading) {
    return <div className="news-loading">Loading...</div>;
  }


  return (
    <div className="news-container doc-card">
      {/* Header */}
      <div className="doc-card-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-8">
          <div className="doc-card-icon-div d-flex justify-content-center align-items-center">
            <img src={tintukIcon} alt="News Icon" />
          </div>
          <span>Tin tức - Sự kiện</span>
        </div>

        {/* Category Tabs */}
        <div className="news-tabs-div">
          <ul className="news-tabs">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={activeCategoryId === cat.id ? "active" : ""}
                onClick={() => setActiveCategoryId(cat.id)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* News Articles */}
      <div className="news-list p-8">
        {articles.map((item) => {
          const fields = item.contentFields;

          /** Extract structured fields */
          const shortDescription =
            getFieldValue(fields, "shortDescription")?.data;

          const publishDate =
            getFieldValue(fields, "date")?.data?.split("T")[0];

          const imageUrl =
            getFieldValue(fields, "image")?.image?.contentUrl;

          /** Active category object */
          const activeCategory = categories.find(
            (cat) => Number(cat.id) === Number(activeCategoryId)
          );

          return (
            <div key={item.id} className="news-item">
              <div className="news-info">
                <h3>{item.title}</h3>

                {/* Optional description */}
                {/* <p className="line-2">{shortDescription}</p> */}

                <div className="news-date-div">
                  <span className="red-text">
                    {activeCategory?.name || ""}
                  </span>
                  <span className="dot-custom"></span>
                  <span className="news-date">{publishDate}</span>
                </div>
              </div>

              <img
                src={`${window.location.origin}${imageUrl}`}
                alt={item.title}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default News;
